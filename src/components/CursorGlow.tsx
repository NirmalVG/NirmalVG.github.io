"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  const springConfig = { damping: 30, stiffness: 150, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(touch);

    if (!touch) {
      const handleMouseMove = (e: MouseEvent) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Cursor-following glow — hidden on touch devices */}
      {!isTouchDevice && (
        <>
          <motion.div
            className="absolute rounded-full"
            style={{
              x,
              y,
              width: 500,
              height: 500,
              translateX: "-50%",
              translateY: "-50%",
              background:
                "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",
            }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              x,
              y,
              width: 400,
              height: 400,
              translateX: "-30%",
              translateY: "-60%",
              background:
                "radial-gradient(circle, rgba(6, 214, 212, 0.08) 0%, transparent 70%)",
            }}
          />
        </>
      )}
      {/* Static ambient blobs — smaller on mobile */}
      <div
        className="bg-blob"
        style={{
          width: isTouchDevice ? 300 : 600,
          height: isTouchDevice ? 300 : 600,
          background: "rgba(168, 85, 247, 0.15)",
          top: "10%",
          left: "10%",
        }}
      />
      <div
        className="bg-blob"
        style={{
          width: isTouchDevice ? 250 : 500,
          height: isTouchDevice ? 250 : 500,
          background: "rgba(6, 214, 212, 0.1)",
          top: "60%",
          right: "5%",
        }}
      />
      <div
        className="bg-blob"
        style={{
          width: isTouchDevice ? 200 : 400,
          height: isTouchDevice ? 200 : 400,
          background: "rgba(236, 72, 153, 0.08)",
          bottom: "20%",
          left: "30%",
        }}
      />
    </div>
  );
}
