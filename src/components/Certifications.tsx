"use client"

import React from "react"
import { motion } from "framer-motion"
import GlassCard from "./GlassCard"

interface Certification {
  name: string
  issuer: string
  detail?: string
}

const certifications: Certification[] = [
  {
    name: "AI Engineer Core Track",
    issuer: "Udemy",
    detail: "LLM Engineering, RAG, QLoRA, Agents",
  },
  {
    name: "Associate AI Engineer",
    issuer: "DataCamp",
  },
  {
    name: "Applied AI Professional Certificate",
    issuer: "Coursera",
  },
]

const issuerColors: Record<string, string> = {
  Udemy: "#a855f7",
  DataCamp: "#10b981",
  Coursera: "#06b6d4",
}

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="text-xs tracking-[0.3em] uppercase text-neon-cyan/70 font-medium">
          Credentials
        </span>
        <h2 className="font-[var(--font-outfit)] text-4xl sm:text-5xl font-bold mt-3 gradient-text">
          Certifications
        </h2>
      </motion.div>

      <div className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-3">
        {certifications.map((certification, index) => {
          const color = issuerColors[certification.issuer] ?? "#ec4899"

          return (
            <GlassCard
              key={`${certification.issuer}-${certification.name}`}
              className="p-5 sm:p-6 rounded-lg min-h-[176px] flex flex-col justify-between"
              glowColor={color}
              delay={index * 0.1}
            >
              <div className="relative z-10">
                <div
                  className="w-10 h-10 rounded-lg border flex items-center justify-center mb-5"
                  style={{
                    background: `${color}12`,
                    borderColor: `${color}30`,
                    boxShadow: `0 0 18px ${color}18`,
                  }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color }}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                </div>

                <h3 className="font-[var(--font-outfit)] text-lg sm:text-xl font-bold text-theme-heading leading-tight">
                  {certification.name}
                </h3>
                <p className="text-sm font-semibold mt-2" style={{ color }}>
                  {certification.issuer}
                </p>
              </div>

              {certification.detail && (
                <p className="relative z-10 text-sm text-theme-secondary leading-relaxed mt-5">
                  {certification.detail}
                </p>
              )}
            </GlassCard>
          )
        })}
      </div>
    </section>
  )
}
