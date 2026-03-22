"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
}

export default function GlassCard({
  children,
  className = "",
  glowColor,
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass relative overflow-hidden group ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        borderColor: "rgba(255,255,255,0.15)",
        transition: { duration: 0.3 },
      }}
    >
      {glowColor && (
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
          style={{ background: glowColor }}
        />
      )}
      {children}
    </motion.div>
  );
}
