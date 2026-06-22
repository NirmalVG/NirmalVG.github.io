"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { MotionConfig } from "framer-motion";

/* ───── Types ───── */

interface HandTrackingContextType {
  handTrackingEnabled: boolean;
  toggleHandTracking: () => void;
  handY: number; // 0-1 normalised vertical hand position
  isHandDetected: boolean;
}

/* ───── Context ───── */

const HandTrackingContext = createContext<HandTrackingContextType>({
  handTrackingEnabled: false,
  toggleHandTracking: () => {},
  handY: 0.5,
  isHandDetected: false,
});

export function useHandTracking() {
  return useContext(HandTrackingContext);
}

/* ───── CDN script loader ───── */

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

function getScrollRoot(): Element {
  return document.scrollingElement ?? document.documentElement;
}

function getScrollTop(): number {
  return window.scrollY || getScrollRoot().scrollTop;
}

function getMaxScrollTop(): number {
  // Use the maximum of multiple measurement methods to avoid undercount
  // when Framer Motion animations haven't fully expanded content yet
  const body = document.body;
  const html = document.documentElement;
  const scrollHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight,
  );
  return Math.max(0, scrollHeight - window.innerHeight);
}

/** Apply vertical scroll; returns false only when clamped at a boundary. */
function applyScrollDelta(delta: number): boolean {
  if (delta === 0) return true;

  const root = getScrollRoot();
  const before = getScrollTop();
  const maxScroll = getMaxScrollTop();
  const next = Math.max(0, Math.min(before + delta, maxScroll));

  if (next === before) return false;

  root.scrollTop = next;

  // Fallback for browsers where scrollingElement assignment alone is ignored
  if (getScrollTop() === before) {
    window.scrollTo({ top: next, left: 0, behavior: "auto" });
  }

  return getScrollTop() !== before;
}

function velocityToPxPerFrame(velocity: number): number {
  return (velocity * window.innerHeight * 2) / 60;
}

/** Map hand height in camera frame to a page scroll position. */
function handYToScrollTarget(y: number): number {
  const SCROLL_ZONE_MIN = 0.12;
  const SCROLL_ZONE_MAX = 0.88;
  const maxScroll = getMaxScrollTop();
  const t = Math.max(
    0,
    Math.min(1, (y - SCROLL_ZONE_MIN) / (SCROLL_ZONE_MAX - SCROLL_ZONE_MIN)),
  );
  return t * maxScroll;
}

/** Peace sign only: index + middle up, ring + pinky down — blocks open-palm scrolling. */
function isTwoFingerScrollGesture(lm: Array<{ x: number; y: number }>): boolean {
  const indexTip = lm[8];
  const middleTip = lm[12];
  const ringTip = lm[16];
  const pinkyTip = lm[20];
  const indexPIP = lm[6];
  const middlePIP = lm[10];
  const ringPIP = lm[14];
  const pinkyPIP = lm[18];

  const indexRaised = indexTip.y < indexPIP.y + 0.02;
  const middleRaised = middleTip.y < middlePIP.y + 0.02;
  const ringDown = ringTip.y > ringPIP.y - 0.03;
  const pinkyDown = pinkyTip.y > pinkyPIP.y - 0.03;

  return indexRaised && middleRaised && ringDown && pinkyDown;
}

export default function HandTrackingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [handTrackingEnabled, setHandTrackingEnabled] = useState(false);
  const [handY, setHandY] = useState(0.5);
  const [isHandDetected, setIsHandDetected] = useState(false);

  // Refs for tracking state (not in React state to avoid re-renders every frame)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handsInstanceRef = useRef<any>(null);
  const cameraInstanceRef = useRef<any>(null);
  const prevAvgYRef = useRef<number | null>(null);
  const smoothedHandYRef = useRef(0.5);
  const smoothedVelocityRef = useRef(0);
  const scrollTargetPositionRef = useRef(0);
  const scrollGestureActiveRef = useRef(false);
  const lastGestureTimeRef = useRef<number | null>(null);
  const handLostTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRafRef = useRef<number | null>(null);

  // ─── Tuning constants ───
  const HAND_Y_SMOOTH = 0.28; // Smooth hand position to reduce camera jitter
  const POSITION_LERP = 0.14; // How quickly page scroll follows hand height
  const EMA_ALPHA = 0.22; // Smoothing for swipe velocity
  const DEADZONE = 0.002;
  const VELOCITY_BOOST = 1.6; // Extra scroll from hand movement between frames
  const DECAY_NO_GESTURE = 0.86;
  const DECAY_NO_HAND = 0.9;
  const MAX_DT_SEC = 0.1;

  /* ──────────────── Cleanup ──────────────── */

  const cleanup = useCallback(() => {
    // Stop camera
    if (cameraInstanceRef.current) {
      try {
        cameraInstanceRef.current.stop();
      } catch {
        /* ignore */
      }
      cameraInstanceRef.current = null;
    }
    // Close MediaPipe Hands
    if (handsInstanceRef.current) {
      try {
        handsInstanceRef.current.close();
      } catch {
        /* ignore */
      }
      handsInstanceRef.current = null;
    }
    // Release video stream
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    // Remove off-screen video element
    if (videoRef.current?.parentNode) {
      videoRef.current.parentNode.removeChild(videoRef.current);
    }
    videoRef.current = null;

    // Reset refs
    prevAvgYRef.current = null;
    smoothedHandYRef.current = 0.5;
    smoothedVelocityRef.current = 0;
    scrollTargetPositionRef.current = getScrollTop();
    scrollGestureActiveRef.current = false;
    lastGestureTimeRef.current = null;
    setIsHandDetected(false);
    setHandY(0.5);

    if (handLostTimerRef.current) {
      clearTimeout(handLostTimerRef.current);
      handLostTimerRef.current = null;
    }
  }, []);

  /* ──────────────── Start hand tracking ──────────────── */

  const startTracking = useCallback(async () => {
    try {
      // 1. Load MediaPipe scripts from CDN
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any;
      const HandsClass = win.Hands;
      const CameraClass = win.Camera;

      if (!HandsClass || !CameraClass) {
        throw new Error("MediaPipe globals not found after loading scripts");
      }

      // 2. Create hidden video element for camera feed
      const video = document.createElement("video");
      video.setAttribute("playsinline", "");
      video.setAttribute("autoplay", "");
      video.style.cssText =
        "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
      document.body.appendChild(video);
      videoRef.current = video;

      // 3. Initialise MediaPipe Hands
      const hands = new HandsClass({
        locateFile: (file: string) =>
          file.startsWith("http")
            ? file
            : `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0, // lite model for performance
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.5,
      });

      // 4. Process each detection frame
      hands.onResults((results: any) => {
        const lm = results.multiHandLandmarks?.[0];

        if (lm) {
          /* --- Hand IS detected --- */
          const indexTip = lm[8];
          const middleTip = lm[12];

          const scrollGesture = isTwoFingerScrollGesture(lm);
          const avgY = (indexTip.y + middleTip.y) / 2;
          setHandY(avgY);
          setIsHandDetected(true);

          // Clear hand-lost timer
          if (handLostTimerRef.current) {
            clearTimeout(handLostTimerRef.current);
            handLostTimerRef.current = null;
          }

          if (scrollGesture) {
            /* Two-finger scroll — only index + middle finger movement */
            const wasActive = scrollGestureActiveRef.current;

            if (!wasActive) {
              // Sync to current scroll so the page doesn't jump when the gesture starts
              smoothedHandYRef.current = avgY;
              scrollTargetPositionRef.current = getScrollTop();
            }

            scrollGestureActiveRef.current = true;

            smoothedHandYRef.current =
              smoothedHandYRef.current * (1 - HAND_Y_SMOOTH) +
              avgY * HAND_Y_SMOOTH;

            scrollTargetPositionRef.current = handYToScrollTarget(
              smoothedHandYRef.current,
            );

            const now = performance.now();
            if (prevAvgYRef.current !== null && lastGestureTimeRef.current !== null) {
              const dtSec = Math.min(
                (now - lastGestureTimeRef.current) / 1000,
                MAX_DT_SEC,
              );
              const rawDelta = avgY - prevAvgYRef.current;

              if (dtSec > 0) {
                const instantVelocity =
                  Math.abs(rawDelta) > DEADZONE ? rawDelta / dtSec : 0;

                smoothedVelocityRef.current =
                  smoothedVelocityRef.current * (1 - EMA_ALPHA) +
                  instantVelocity * EMA_ALPHA;
              }
            }

            prevAvgYRef.current = avgY;
            lastGestureTimeRef.current = now;
          } else {
            scrollGestureActiveRef.current = false;
            prevAvgYRef.current = null;
            lastGestureTimeRef.current = null;
            smoothedVelocityRef.current *= DECAY_NO_GESTURE;
          }
        } else {
          /* --- No hand detected --- */
          scrollGestureActiveRef.current = false;
          prevAvgYRef.current = null;
          lastGestureTimeRef.current = null;
          smoothedVelocityRef.current *= DECAY_NO_HAND;

          // Mark hand as lost after a short grace period (avoids flicker)
          if (!handLostTimerRef.current) {
            handLostTimerRef.current = setTimeout(() => {
              setIsHandDetected(false);
              handLostTimerRef.current = null;
            }, 500);
          }
        }
      });

      handsInstanceRef.current = hands;

      // 5. Start camera → feeds into MediaPipe Hands
      const camera = new CameraClass(video, {
        onFrame: async () => {
          if (handsInstanceRef.current && videoRef.current) {
            await handsInstanceRef.current.send({ image: videoRef.current });
          }
        },
        width: 320,
        height: 240,
      });

      cameraInstanceRef.current = camera;
      await camera.start();
    } catch (err) {
      console.error("[HandTracking] Initialisation failed:", err);
      setHandTrackingEnabled(false);
      cleanup();
    }
  }, [cleanup]);

  /* ──────────────── Pre-trigger whileInView animations ──────────────── */

  /**
   * Rapidly scroll to the bottom and back so every Framer Motion
   * `whileInView` / `viewport={{ once: true }}` animation fires.
   * This stabilises the page height before hand-tracking takes over scrolling.
   */
  const preTriggerAnimations = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const savedPos = getScrollTop();
      const maxScroll = getMaxScrollTop();

      // Scroll to absolute bottom instantly
      window.scrollTo({ top: maxScroll, behavior: "auto" });

      // Give IntersectionObserver callbacks a frame to fire
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Scroll back to original position
          window.scrollTo({ top: savedPos, behavior: "auto" });
          // Allow one more frame for any layout to settle
          requestAnimationFrame(() => {
            scrollTargetPositionRef.current = getScrollTop();
            resolve();
          });
        });
      });
    });
  }, []);

  /* ──────────────── Enable / disable lifecycle ──────────────── */

  useEffect(() => {
    if (handTrackingEnabled) {
      // Add class to <html> to override scroll-behavior
      document.documentElement.classList.add("hand-tracking-active");
      // Pre-trigger all whileInView animations, then start tracking
      preTriggerAnimations().then(() => {
        startTracking();
      });
    } else {
      cleanup();
      document.documentElement.classList.remove("hand-tracking-active");
    }
    return () => {
      cleanup();
      document.documentElement.classList.remove("hand-tracking-active");
    };
  }, [handTrackingEnabled, startTracking, cleanup, preTriggerAnimations]);

  /* ──────────────── Smooth scroll rAF loop ──────────────── */

  useEffect(() => {
    if (!handTrackingEnabled) {
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
      return;
    }

    let scrollAccumulator = 0;

    const tick = () => {
      const current = getScrollTop();
      let delta = 0;

      if (scrollGestureActiveRef.current) {
        // Primary: smoothly scroll toward the hand's mapped page position
        const positionDelta =
          (scrollTargetPositionRef.current - current) * POSITION_LERP;
        delta += positionDelta;
      }

      // Secondary: swipe velocity for fine control between position updates
      const velocityDelta =
        velocityToPxPerFrame(smoothedVelocityRef.current) * VELOCITY_BOOST;
      delta += velocityDelta;

      scrollAccumulator += delta;

      if (Math.abs(scrollAccumulator) >= 0.5) {
        const scrollAmount =
          scrollAccumulator > 0
            ? Math.floor(scrollAccumulator)
            : Math.ceil(scrollAccumulator);
        scrollAccumulator -= scrollAmount;

        applyScrollDelta(scrollAmount);

        // Only kill momentum when truly pinned at an edge for several frames
        const afterScroll = getScrollTop();
        const maxScroll = getMaxScrollTop();
        if (
          (scrollAmount < 0 && afterScroll <= 0) ||
          (scrollAmount > 0 && afterScroll >= maxScroll - 2)
        ) {
          scrollAccumulator = 0;
          smoothedVelocityRef.current *= 0.5;
        }
      }

      scrollRafRef.current = requestAnimationFrame(tick);
    };

    scrollRafRef.current = requestAnimationFrame(tick);

    return () => {
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, [handTrackingEnabled]);

  /* ──────────────── Toggle ──────────────── */

  const toggleHandTracking = useCallback(() => {
    setHandTrackingEnabled((prev) => !prev);
  }, []);

  /* ──────────────── Render ──────────────── */

  return (
    <HandTrackingContext.Provider
      value={{
        handTrackingEnabled,
        toggleHandTracking,
        handY,
        isHandDetected,
      }}
    >
      <MotionConfig
        reducedMotion={handTrackingEnabled ? "always" : "never"}
        transition={handTrackingEnabled ? { duration: 0 } : undefined}
      >
        {children}
      </MotionConfig>
    </HandTrackingContext.Provider>
  );
}
