"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHandTracking } from "./HandTrackingProvider";

export default function HandTrackingToggle() {
  const { handTrackingEnabled, toggleHandTracking, isHandDetected } =
    useHandTracking();

  return (
    <motion.button
      id="hand-tracking-toggle"
      onClick={toggleHandTracking}
      className="fixed top-5 left-5 sm:top-6 sm:left-6 z-50 flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl glass cursor-pointer group"
      style={{ border: "1px solid var(--theme-border)" }}
      whileHover={{
        scale: 1.05,
        boxShadow: handTrackingEnabled
          ? "0 0 20px rgba(16,185,129,0.4), 0 0 40px rgba(16,185,129,0.15)"
          : "0 0 20px rgba(168,85,247,0.3), 0 0 40px rgba(6,214,212,0.15)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      aria-label={`Turn hand tracking ${handTrackingEnabled ? "off" : "on"}`}
      title={`Hand Tracking: ${handTrackingEnabled ? "ON" : "OFF"}`}
    >
      {/* ── Hand icon ── */}
      <div className="relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          {handTrackingEnabled ? (
            <motion.div
              key="on"
              initial={{ scale: 0, rotate: -30, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 30, opacity: 0 }}
              transition={{
                duration: 0.35,
                type: "spring",
                stiffness: 250,
                damping: 18,
              }}
              className="relative flex items-center justify-center"
            >
              {/* Heroicons: hand-raised (outline) */}
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075-7.425a1.575 1.575 0 013.15 0v1.5m-3.15 0V6m3.15-1.5v4.5m0 0h.75a1.575 1.575 0 011.575 1.575v.45m-8.4 4.725l-1.012-1.012a1.575 1.575 0 00-2.228 0l-.075.075a1.575 1.575 0 000 2.228l4.162 4.162a5.25 5.25 0 007.425 0l.825-.825a5.25 5.25 0 001.538-3.712v-2.288"
                />
              </svg>

              {/* Animated pulse ring */}
              <motion.div
                className="absolute -inset-1 rounded-full pointer-events-none"
                style={{ border: "2px solid rgba(16, 185, 129, 0.35)" }}
                animate={{
                  scale: [1, 1.7, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="off"
              initial={{ scale: 0, rotate: 30, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: -30, opacity: 0 }}
              transition={{
                duration: 0.35,
                type: "spring",
                stiffness: 250,
                damping: 18,
              }}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--theme-text-tertiary)"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075-7.425a1.575 1.575 0 013.15 0v1.5m-3.15 0V6m3.15-1.5v4.5m0 0h.75a1.575 1.575 0 011.575 1.575v.45m-8.4 4.725l-1.012-1.012a1.575 1.575 0 00-2.228 0l-.075.075a1.575 1.575 0 000 2.228l4.162 4.162a5.25 5.25 0 007.425 0l.825-.825a5.25 5.25 0 001.538-3.712v-2.288"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Label + status ── */}
      <div className="flex flex-col items-start leading-none">
        <span
          className="text-[10px] sm:text-xs font-medium tracking-wide transition-colors duration-300"
          style={{
            color: handTrackingEnabled
              ? "#10b981"
              : "var(--theme-text-tertiary)",
          }}
        >
          {handTrackingEnabled ? "Tracking ON" : "Hand Track"}
        </span>

        <AnimatePresence>
          {handTrackingEnabled && (
            <motion.span
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 2 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-1 text-[9px] sm:text-[10px]"
              style={{ color: "var(--theme-text-muted)" }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                animate={{
                  background: isHandDetected ? "#10b981" : "#f97316",
                  boxShadow: isHandDetected
                    ? "0 0 6px rgba(16,185,129,0.7)"
                    : "0 0 6px rgba(249,115,22,0.7)",
                }}
                transition={{ duration: 0.3 }}
              />
              {isHandDetected ? "Hand detected" : "Show hand"}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
