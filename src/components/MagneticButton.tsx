"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function MagneticButton({
  children,
  href,
  variant = "primary",
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    x.set(distX * 0.3);
    y.set(distY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const glowOpacity = useTransform(x, [-30, 0, 30], [0.8, 0.4, 0.8]);

  const baseClasses =
    variant === "primary"
      ? "bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold"
      : "glass border border-white/10 text-white/90 font-medium";

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative inline-flex items-center gap-2 px-5 py-3 sm:px-7 sm:py-3.5 rounded-xl text-sm tracking-wide cursor-pointer transition-all ${baseClasses} ${className}`}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <motion.span
        className="absolute inset-0 rounded-xl"
        style={{
          opacity: glowOpacity,
          background:
            variant === "primary"
              ? "linear-gradient(135deg, rgba(168,85,247,0.4), rgba(6,214,212,0.4))"
              : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          filter: "blur(15px)",
          zIndex: -1,
        }}
      />
      {children}
    </motion.a>
  );
}
