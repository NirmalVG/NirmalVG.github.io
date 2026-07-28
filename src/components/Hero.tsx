"use client"

import React from "react"
import { motion } from "framer-motion"
import MagneticButton from "./MagneticButton"
import FloatingElement from "./FloatingElement"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 overflow-hidden"
    >
      {/* Decorative floating orbs */}
      <FloatingElement
        delay={0}
        distance={20}
        className="absolute top-20 left-[10%] opacity-60"
      >
        <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
      </FloatingElement>
      <FloatingElement
        delay={1}
        distance={15}
        className="absolute top-32 right-[15%] opacity-40"
      >
        <div className="w-3 h-3 rounded-full bg-neon-cyan shadow-[0_0_15px_rgba(6,214,212,0.6)]" />
      </FloatingElement>
      <FloatingElement
        delay={2}
        distance={12}
        className="absolute bottom-40 left-[20%] opacity-50"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-neon-pink shadow-[0_0_10px_rgba(236,72,153,0.6)]" />
      </FloatingElement>
      <FloatingElement
        delay={0.5}
        distance={18}
        className="absolute top-[60%] right-[8%] opacity-30"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-neon-blue shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
      </FloatingElement>
      <FloatingElement
        delay={1.5}
        distance={10}
        className="absolute top-[45%] left-[5%] opacity-40"
      >
        <div className="w-1 h-1 rounded-full bg-neon-green shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
      </FloatingElement>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs tracking-widest uppercase text-theme-secondary">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            Available for opportunities
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="font-[var(--font-outfit)] text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight mb-6 gradient-text gradient-text-glow"
        >
          Nirmal V G
        </motion.h1>

        {/* Headline */}
        <motion.h2
          variants={itemVariants}
          className="font-[var(--font-outfit)] text-lg sm:text-2xl md:text-3xl font-medium text-theme-primary mb-4 tracking-wide"
        >
          AI Engineer (Full Stack) — <span className="text-neon-cyan">RAG</span>{" "}
          <span className="text-theme-tertiary">·</span>{" "}
          <span className="text-neon-purple">LLMs</span>{" "}
          <span className="text-theme-tertiary">·</span>{" "}
          <span className="text-neon-pink">Next.js</span>
          <span className="text-theme-tertiary">·</span>{" "}
          <span className="text-neon-blue">FastAPI</span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-theme-secondary max-w-2xl mx-auto mb-6 leading-relaxed"
        >
          I build production AI systems end-to-end — from hybrid retrieval and
          LLM orchestration on the backend to the interfaces people actually
          use. 2+ years shipping React/Next.js products professionally, now
          focused on retrieval-augmented generation, LLM integration, and
          evaluation-driven AI engineering.
        </motion.p>

        {/* Location & Contact */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-2 sm:gap-4 mb-10 text-sm text-theme-tertiary"
        >
          <span className="inline-flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-neon-purple/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            Thrissur, Kerala
          </span>
          <span className="hidden sm:flex items-center text-theme-muted">
            ·
          </span>
          <a
            href="mailto:nirmalvg97@gmail.com"
            className="inline-flex items-center gap-1.5 hover:text-neon-pink/70 transition-colors"
          >
            <svg
              className="w-4 h-4 text-neon-pink/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            nirmalvg97@gmail.com
          </a>
        </motion.div>

        {/* Stats Banner */}
        <motion.div variants={itemVariants}>
          <FloatingElement delay={0.3} distance={8}>
            <div className="inline-flex items-center gap-4 px-6 py-4 glass-strong rounded-2xl glow-purple mb-12">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold gradient-text">13+</span>
                <span className="text-xs text-theme-secondary text-left leading-tight max-w-[160px] sm:max-w-[200px]">
                  production projects delivered across healthcare, real estate,
                  e-commerce &amp; construction — now building AI-native
                  products from architecture to deployment
                </span>
              </div>
            </div>
          </FloatingElement>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4"
        >
          <MagneticButton href="https://github.com/NirmalVG" variant="primary">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </MagneticButton>
          <MagneticButton
            href="https://www.linkedin.com/in/nirmal-v-g/"
            variant="secondary"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--theme-bg)] to-transparent pointer-events-none z-20" />
    </section>
  )
}
