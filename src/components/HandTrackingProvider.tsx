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

/* ───── CDN script loader for tasks-vision ───── */

const TASKS_VISION_CDN =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";

function loadTasksVisionScript(): Promise<void> {
  const src =
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js";
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
  const handLandmarkerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionRafRef = useRef<number | null>(null);
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
    // Stop detection loop
    if (detectionRafRef.current) {
      cancelAnimationFrame(detectionRafRef.current);
      detectionRafRef.current = null;
    }

    // Close HandLandmarker
    if (handLandmarkerRef.current) {
      try {
        handLandmarkerRef.current.close();
      } catch {
        /* ignore */
      }
      handLandmarkerRef.current = null;
    }

    // Release camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    // Release video element
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

  /* ──────────────── Process results (shared logic) ──────────────── */

  const processResults = useCallback(
    (landmarks: Array<Array<{ x: number; y: number }>>) => {
      const lm = landmarks?.[0];

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
          if (
            prevAvgYRef.current !== null &&
            lastGestureTimeRef.current !== null
          ) {
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
    },
    [],
  );

  /* ──────────────── Start hand tracking ──────────────── */

  const startTracking = useCallback(async () => {
    try {
      // 1. Load the tasks-vision bundle from CDN
      await loadTasksVisionScript();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vision = (window as any).Vision;

      if (!vision || !vision.FilesetResolver || !vision.HandLandmarker) {
        throw new Error(
          "MediaPipe Tasks Vision globals not found after loading script",
        );
      }

      const FilesetResolver = vision.FilesetResolver;
      const HandLandmarker = vision.HandLandmarker;

      // 2. Create the vision fileset resolver
      const wasmFileset = await FilesetResolver.forVisionTasks(TASKS_VISION_CDN);

      // 3. Create HandLandmarker instance
      const handLandmarker = await HandLandmarker.createFromOptions(wasmFileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      handLandmarkerRef.current = handLandmarker;

      // 4. Create hidden video element for camera feed
      const video = document.createElement("video");
      video.setAttribute("playsinline", "");
      video.setAttribute("autoplay", "");
      video.style.cssText =
        "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
      document.body.appendChild(video);
      videoRef.current = video;

      // 5. Start the camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
      });
      streamRef.current = stream;
      video.srcObject = stream;

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      // 6. Start the per-frame detection loop
      let lastTimestamp = -1;

      const detect = () => {
        if (!handLandmarkerRef.current || !videoRef.current) return;

        const nowMs = performance.now();
        // HandLandmarker requires strictly increasing timestamps
        if (nowMs > lastTimestamp) {
          try {
            const results = handLandmarkerRef.current.detectForVideo(
              videoRef.current,
              nowMs,
            );
            processResults(results.landmarks);
          } catch (err) {
            // Occasionally the video frame may not be ready; silently skip
            console.debug("[HandTracking] Detection frame skipped:", err);
          }
          lastTimestamp = nowMs;
        }

        detectionRafRef.current = requestAnimationFrame(detect);
      };

      detectionRafRef.current = requestAnimationFrame(detect);
    } catch (err) {
      console.error("[HandTracking] Initialisation failed:", err);
      setHandTrackingEnabled(false);
      cleanup();
    }
  }, [cleanup, processResults]);

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
