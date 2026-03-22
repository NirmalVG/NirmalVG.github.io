"use client";

import React from "react";
import { motion } from "framer-motion";

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export default function FloatingElement({
  children,
  delay = 0,
  duration = 6,
  distance = 15,
  className = "",
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -distance, distance * 0.5, 0],
        rotate: [0, 1, -1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
