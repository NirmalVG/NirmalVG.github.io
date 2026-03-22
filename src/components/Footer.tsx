"use client"

import React from "react"
import { motion } from "framer-motion"
import MagneticButton from "./MagneticButton"

export default function Footer() {
  return (
    <footer id="contact" className="relative py-16 sm:py-24 px-4 sm:px-6">
      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-lg h-px bg-gradient-to-r from-transparent via-neon-purple/40 to-transparent" />

      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-xs tracking-[0.3em] uppercase text-neon-green/70 font-medium">
          Get in Touch
        </span>
        <h2 className="font-[var(--font-outfit)] text-4xl sm:text-5xl font-bold mt-3 mb-6 gradient-text">
          Let&apos;s Connect
        </h2>
        <p className="text-white/50 text-sm sm:text-base mb-10 leading-relaxed max-w-md mx-auto">
          Open to exciting opportunities, collaborations, and conversations
          about building great software.
        </p>

        {/* Contact info row */}
        <motion.div
          className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm text-white/60">
            <svg
              className="w-4 h-4"
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
        </motion.div>

        {/* Mailto CTA */}
        <motion.div
          className="mb-12"
          whileInView={{ scale: [0.95, 1] }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <MagneticButton
            href="mailto:nirmalvg97@gmail.com"
            variant="primary"
            className="text-base px-8 py-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            nirmalvg97@gmail.com
          </MagneticButton>
        </motion.div>

        {/* Social links row */}
        <motion.div
          className="flex justify-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href="https://github.com/NirmalVG"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white hover:border-neon-purple/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/nirmal-v-g/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white hover:border-neon-cyan/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,214,212,0.2)]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </motion.div>

        {/* Education & Languages */}
        <motion.div
          className="pt-8 border-t border-white/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {/* Education */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="glass px-3 sm:px-4 py-2 rounded-lg inline-flex items-center gap-2 text-xs text-white/40 flex-wrap">
              <span className="text-sm">🎓</span>
              <span>
                <span className="text-white/60 font-medium">BCA</span> — Amity
                University Online
                <span className="text-white/30 ml-1.5">
                  July 2024 – Present
                </span>
              </span>
            </div>
          </div>

          {/* Languages */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-6">
            <span className="px-3 py-1 rounded-md text-[10px] font-medium border border-neon-cyan/15 bg-neon-cyan/5 text-neon-cyan/60">
              🌐 English — Full Professional Proficiency
            </span>
            <span className="px-3 py-1 rounded-md text-[10px] font-medium border border-neon-purple/15 bg-neon-purple/5 text-neon-purple/60">
              🌐 Malayalam — Full Professional Proficiency
            </span>
          </div>

          <p className="text-xs text-white/15 mt-4">
            © {new Date().getFullYear()} Nirmal V G. Crafted with ✨
          </p>
        </motion.div>
      </motion.div>
    </footer>
  )
}
