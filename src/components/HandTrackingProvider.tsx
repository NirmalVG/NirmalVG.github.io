'use client'

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react'

/* ───── Types ───── */

interface HandTrackingContextType {
  handTrackingEnabled: boolean
  toggleHandTracking: () => void
  handY: number            // 0-1 normalised vertical hand position
  isHandDetected: boolean
}

/* ───── Context ───── */

const HandTrackingContext = createContext<HandTrackingContextType>({
  handTrackingEnabled: false,
  toggleHandTracking: () => {},
  handY: 0.5,
  isHandDetected: false,
})

export function useHandTracking() {
  return useContext(HandTrackingContext)
}

/* ───── CDN script loader ───── */

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.crossOrigin = 'anonymous'
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

/* ───── Provider ───── */

export default function HandTrackingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [handTrackingEnabled, setHandTrackingEnabled] = useState(false)
  const [handY, setHandY] = useState(0.5)
  const [isHandDetected, setIsHandDetected] = useState(false)

  // Refs for tracking state (not in React state to avoid re-renders every frame)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const handsInstanceRef = useRef<any>(null)
  const cameraInstanceRef = useRef<any>(null)
  const prevAvgYRef = useRef<number | null>(null)
  const smoothedDeltaRef = useRef(0)
  const scrollTargetRef = useRef(0)        // target scroll velocity per rAF frame
  const handLostTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollRafRef = useRef<number | null>(null)

  // ─── Tuning constants ───
  const EMA_ALPHA = 0.14          // Smoothing for raw delta (higher = snappier, lower = smoother)
  const DEADZONE = 0.003          // Normalised — kills camera jitter
  const SCROLL_SENSITIVITY = 700  // Multiplier: normalised delta → px/frame target
  const VELOCITY_LERP = 0.07      // rAF lerp toward target (lower = smoother approach)
  const MIN_VELOCITY_PX = 0.15    // Below this, stop scrolling entirely
  const DECAY_NO_GESTURE = 0.82   // Per-frame decay when fingers aren't in scroll pose
  const DECAY_NO_HAND = 0.88      // Per-frame decay when no hand is detected

  /* ──────────────── Cleanup ──────────────── */

  const cleanup = useCallback(() => {
    // Stop camera
    if (cameraInstanceRef.current) {
      try { cameraInstanceRef.current.stop() } catch { /* ignore */ }
      cameraInstanceRef.current = null
    }
    // Close MediaPipe Hands
    if (handsInstanceRef.current) {
      try { handsInstanceRef.current.close() } catch { /* ignore */ }
      handsInstanceRef.current = null
    }
    // Release video stream
    if (videoRef.current?.srcObject) {
      ;(videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop())
      videoRef.current.srcObject = null
    }
    // Remove off-screen video element
    if (videoRef.current?.parentNode) {
      videoRef.current.parentNode.removeChild(videoRef.current)
    }
    videoRef.current = null

    // Reset refs
    prevAvgYRef.current = null
    smoothedDeltaRef.current = 0
    scrollTargetRef.current = 0
    setIsHandDetected(false)
    setHandY(0.5)

    if (handLostTimerRef.current) {
      clearTimeout(handLostTimerRef.current)
      handLostTimerRef.current = null
    }
  }, [])

  /* ──────────────── Start hand tracking ──────────────── */

  const startTracking = useCallback(async () => {
    try {
      // 1. Load MediaPipe scripts from CDN
      await loadScript(
        'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'
      )
      await loadScript(
        'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
      )

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any
      const HandsClass = win.Hands
      const CameraClass = win.Camera

      if (!HandsClass || !CameraClass) {
        throw new Error('MediaPipe globals not found after loading scripts')
      }

      // 2. Create hidden video element for camera feed
      const video = document.createElement('video')
      video.setAttribute('playsinline', '')
      video.setAttribute('autoplay', '')
      video.style.cssText =
        'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;'
      document.body.appendChild(video)
      videoRef.current = video

      // 3. Initialise MediaPipe Hands
      const hands = new HandsClass({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      })

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0, // lite model for performance
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.5,
      })

      // 4. Process each detection frame
      hands.onResults((results: any) => {
        const lm = results.multiHandLandmarks?.[0]

        if (lm) {
          /* --- Hand IS detected --- */
          const indexTip = lm[8]   // index fingertip
          const middleTip = lm[12] // middle fingertip
          const indexPIP = lm[6]   // index second knuckle
          const middlePIP = lm[10] // middle second knuckle

          // Check both fingers are raised (tip above PIP)
          const indexRaised = indexTip.y < indexPIP.y
          const middleRaised = middleTip.y < middlePIP.y

          const avgY = (indexTip.y + middleTip.y) / 2
          setHandY(avgY)
          setIsHandDetected(true)

          // Clear hand-lost timer
          if (handLostTimerRef.current) {
            clearTimeout(handLostTimerRef.current)
            handLostTimerRef.current = null
          }

          if (indexRaised && middleRaised) {
            /* Two-finger scroll gesture active */
            if (prevAvgYRef.current !== null) {
              const rawDelta = avgY - prevAvgYRef.current

              // Apply dead-zone
              const delta =
                Math.abs(rawDelta) > DEADZONE ? rawDelta : 0

              // Exponential moving average
              smoothedDeltaRef.current =
                smoothedDeltaRef.current * (1 - EMA_ALPHA) +
                delta * EMA_ALPHA

              scrollTargetRef.current =
                smoothedDeltaRef.current * SCROLL_SENSITIVITY
            }
            prevAvgYRef.current = avgY
          } else {
            /* Fingers not in scroll pose — decay velocity */
            prevAvgYRef.current = null
            smoothedDeltaRef.current *= DECAY_NO_GESTURE
            scrollTargetRef.current =
              smoothedDeltaRef.current * SCROLL_SENSITIVITY
          }
        } else {
          /* --- No hand detected --- */
          prevAvgYRef.current = null
          smoothedDeltaRef.current *= DECAY_NO_HAND
          scrollTargetRef.current =
            smoothedDeltaRef.current * SCROLL_SENSITIVITY

          // Mark hand as lost after a short grace period (avoids flicker)
          if (!handLostTimerRef.current) {
            handLostTimerRef.current = setTimeout(() => {
              setIsHandDetected(false)
              handLostTimerRef.current = null
            }, 500)
          }
        }
      })

      handsInstanceRef.current = hands

      // 5. Start camera → feeds into MediaPipe Hands
      const camera = new CameraClass(video, {
        onFrame: async () => {
          if (handsInstanceRef.current && videoRef.current) {
            await handsInstanceRef.current.send({ image: videoRef.current })
          }
        },
        width: 320,
        height: 240,
      })

      cameraInstanceRef.current = camera
      await camera.start()
    } catch (err) {
      console.error('[HandTracking] Initialisation failed:', err)
      setHandTrackingEnabled(false)
      cleanup()
    }
  }, [cleanup])

  /* ──────────────── Enable / disable lifecycle ──────────────── */

  useEffect(() => {
    if (handTrackingEnabled) {
      startTracking()
      // Add class to <html> to override scroll-behavior
      document.documentElement.classList.add('hand-tracking-active')
    } else {
      cleanup()
      document.documentElement.classList.remove('hand-tracking-active')
    }
    return () => {
      cleanup()
      document.documentElement.classList.remove('hand-tracking-active')
    }
  }, [handTrackingEnabled, startTracking, cleanup])

  /* ──────────────── Smooth scroll rAF loop ──────────────── */

  useEffect(() => {
    if (!handTrackingEnabled) {
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current)
        scrollRafRef.current = null
      }
      return
    }

    let currentVelocity = 0

    const tick = () => {
      const target = scrollTargetRef.current

      // Lerp toward target velocity
      currentVelocity += (target - currentVelocity) * VELOCITY_LERP

      // Apply scroll if above threshold
      if (Math.abs(currentVelocity) > MIN_VELOCITY_PX) {
        document.documentElement.scrollTop += currentVelocity
      }

      scrollRafRef.current = requestAnimationFrame(tick)
    }

    scrollRafRef.current = requestAnimationFrame(tick)

    return () => {
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current)
        scrollRafRef.current = null
      }
    }
  }, [handTrackingEnabled])

  /* ──────────────── Toggle ──────────────── */

  const toggleHandTracking = useCallback(() => {
    setHandTrackingEnabled((prev) => !prev)
  }, [])

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
      {children}
    </HandTrackingContext.Provider>
  )
}
