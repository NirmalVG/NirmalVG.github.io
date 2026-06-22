'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { isDark, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-5 right-5 sm:top-6 sm:right-6 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-xl glass flex items-center justify-center cursor-pointer group"
      style={{
        border: '1px solid var(--theme-border)',
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: isDark
          ? '0 0 20px rgba(168,85,247,0.3), 0 0 40px rgba(6,214,212,0.15)'
          : '0 0 20px rgba(251,191,36,0.3), 0 0 40px rgba(251,146,60,0.15)',
      }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* ── Theme icon ── */}
      <div className="relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ duration: 0.35, type: 'spring', stiffness: 250, damping: 18 }}
              className="relative flex items-center justify-center"
            >
              {/* Sun rays */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute w-[2px] h-[6px] rounded-full bg-amber-400"
                    style={{
                      transform: `rotate(${i * 45}deg) translateY(-11px)`,
                      opacity: 0.8,
                    }}
                  />
                ))}
              </motion.div>
              {/* Sun circle */}
              <div
                className="w-[14px] h-[14px] rounded-full bg-gradient-to-br from-amber-300 to-orange-400"
                style={{ boxShadow: '0 0 10px rgba(251,191,36,0.6), 0 0 20px rgba(251,191,36,0.3)' }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: 90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: -90, opacity: 0 }}
              transition={{ duration: 0.35, type: 'spring', stiffness: 250, damping: 18 }}
              className="relative flex items-center justify-center"
            >
              {/* Moon crescent */}
              <div
                className="w-[16px] h-[16px] rounded-full"
                style={{
                  background: 'transparent',
                  boxShadow: '5px -2px 0 0 #c4b5fd, 0 0 10px rgba(196,181,253,0.4)',
                  border: 'none',
                }}
              />
              {/* Stars */}
              {[
                { top: -4, right: -2, size: 2 },
                { top: 2, right: -6, size: 1.5 },
                { top: -6, right: 4, size: 1.5 },
              ].map((star, i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full bg-purple-300"
                  style={{
                    width: star.size,
                    height: star.size,
                    top: star.top,
                    right: star.right,
                  }}
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}
