"use client"

import React, { useMemo, useEffect, useRef } from "react"
import { motion, useAnimate } from "framer-motion"
import { useHandTracking } from "./HandTrackingProvider"

interface Skill {
  name: string
  color: string
  category: "frontend" | "backend" | "database" | "cloud" | "ai"
}

const skills: Skill[] = [
  { name: "React.js", color: "#06b6d4", category: "frontend" },
  { name: "Next.js (App Router)", color: "#a855f7", category: "frontend" },
  { name: "TypeScript", color: "#3b82f6", category: "frontend" },
  { name: "JavaScript (ES6+)", color: "#f59e0b", category: "frontend" },
  { name: "Tailwind CSS", color: "#06b6d4", category: "frontend" },
  { name: "SCSS/SASS", color: "#ec4899", category: "frontend" },
  { name: "HTML5", color: "#f97316", category: "frontend" },
  { name: "ShadCN/UI", color: "#a855f7", category: "frontend" },
  { name: "Redux Toolkit", color: "#7c3aed", category: "frontend" },
  { name: "Zustand", color: "#06b6d4", category: "frontend" },
  { name: "TanStack Query", color: "#ec4899", category: "frontend" },
  { name: "SWR", color: "#3b82f6", category: "frontend" },
  { name: "Framer Motion", color: "#ec4899", category: "frontend" },
  { name: "Node.js", color: "#10b981", category: "backend" },
  { name: "Express.js", color: "#10b981", category: "backend" },
  { name: "FastAPI", color: "#10b981", category: "backend" },
  { name: "REST API Design", color: "#10b981", category: "backend" },
  { name: "Prisma ORM", color: "#a855f7", category: "backend" },
  { name: "PostgreSQL", color: "#3b82f6", category: "database" },
  { name: "MySQL", color: "#06b6d4", category: "database" },
  { name: "MongoDB", color: "#10b981", category: "database" },
  { name: "Supabase", color: "#10b981", category: "database" },
  { name: "AWS", color: "#f97316", category: "cloud" },
  { name: "Vercel", color: "#a855f7", category: "cloud" },
  { name: "Netlify", color: "#06b6d4", category: "cloud" },
  { name: "Render", color: "#3b82f6", category: "cloud" },
  { name: "Git", color: "#f97316", category: "cloud" },
  { name: "GitHub", color: "#a855f7", category: "cloud" },
  { name: "LLM Integration", color: "#f97316", category: "ai" },
  { name: "RAG Pipelines", color: "#8b5cf6", category: "ai" },
  { name: "Hybrid Retrieval (BM25 + Dense)", color: "#a855f7", category: "ai" },
  { name: "Cohere Rerank", color: "#ec4899", category: "ai" },
  { name: "Groq (LLaMA Inference)", color: "#7c3aed", category: "ai" },
  { name: "Gemini Vision API", color: "#06b6d4", category: "ai" },
  { name: "OpenAI API", color: "#10b981", category: "ai" },
  { name: "Prompt Engineering", color: "#f59e0b", category: "ai" },
  { name: "Vector Search (pgvector)", color: "#3b82f6", category: "ai" },
]

const categoryLabels: Record<string, { label: string; color: string }> = {
  ai: { label: "AI & LLM Engineering", color: "#8b5cf6" },
  frontend: { label: "Frontend", color: "#06b6d4" },
  backend: { label: "Backend", color: "#10b981" },
  database: { label: "Databases", color: "#3b82f6" },
  cloud: { label: "Cloud & DevOps", color: "#f97316" },
}

function SkillTag({
  skill,
  index,
  handTrackingEnabled,
}: {
  skill: Skill
  index: number
  handTrackingEnabled: boolean
}) {
  const [scope, animate] = useAnimate()
  const hasStartedRef = useRef(false)
  const animationRef = useRef<any>(null)

  const params = useMemo(
    () => ({
      floatY: 6 + Math.random() * 12,
      duration: 4 + Math.random() * 5,
      delay: Math.random() * 4,
      rotate: -2 + Math.random() * 4,
    }),
    [],
  )

  useEffect(() => {
    // Stop floating animation when hand tracking is enabled
    if (handTrackingEnabled) {
      if (animationRef.current) {
        animationRef.current.stop?.()
        animationRef.current = null
      }
      // Reset transform to neutral position
      if (scope.current) {
        scope.current.style.transform = "none"
      }
      return
    }

    // Start floating animation only when hand tracking is off
    if (hasStartedRef.current) return
    hasStartedRef.current = true
    const timeout = setTimeout(() => {
      animationRef.current = animate(
        scope.current,
        {
          y: [0, -params.floatY, params.floatY * 0.3, 0],
          rotate: [0, params.rotate, -params.rotate, 0],
        },
        {
          duration: params.duration,
          repeat: Infinity,
          ease: "easeInOut",
        },
      )
    }, params.delay * 1000)
    return () => clearTimeout(timeout)
  }, [animate, scope, params, handTrackingEnabled])

  // When hand tracking is on, render without Framer Motion animations
  if (handTrackingEnabled) {
    return (
      <div ref={scope} className="relative group cursor-default">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-medium backdrop-blur-xl border transition-all duration-300"
          style={{
            background: `${skill.color}08`,
            borderColor: `${skill.color}20`,
            color: `${skill.color}dd`,
            boxShadow: `0 0 10px ${skill.color}10`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              background: skill.color,
              boxShadow: `0 0 6px ${skill.color}80`,
            }}
          />
          {skill.name}
        </span>
      </div>
    )
  }

  return (
    <motion.div
      ref={scope}
      className="relative group cursor-default"
      initial={{ opacity: 0, scale: 0, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: 0.05 + index * 0.04,
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      whileHover={{
        scale: 1.15,
        transition: { duration: 0.2 },
      }}
    >
      <span
        className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-medium backdrop-blur-xl border transition-all duration-300"
        style={{
          background: `${skill.color}08`,
          borderColor: `${skill.color}20`,
          color: `${skill.color}dd`,
          boxShadow: `0 0 10px ${skill.color}10`,
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = `${skill.color}50`
          el.style.boxShadow = `0 0 25px ${skill.color}30, 0 0 50px ${skill.color}15`
          el.style.background = `${skill.color}15`
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = `${skill.color}20`
          el.style.boxShadow = `0 0 10px ${skill.color}10`
          el.style.background = `${skill.color}08`
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            background: skill.color,
            boxShadow: `0 0 6px ${skill.color}80`,
          }}
        />
        {skill.name}
      </span>
    </motion.div>
  )
}

export default function SkillNebula() {
  const { handTrackingEnabled } = useHandTracking()

  const HeadingWrapper = handTrackingEnabled ? "div" : motion.div
  const headingProps = handTrackingEnabled
    ? { className: "text-center mb-8" }
    : {
        className: "text-center mb-8",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.7 },
      }

  const LegendWrapper = handTrackingEnabled ? "div" : motion.div
  const legendProps = handTrackingEnabled
    ? { className: "flex justify-center gap-3 sm:gap-6 mb-14 flex-wrap" }
    : {
        className: "flex justify-center gap-3 sm:gap-6 mb-14 flex-wrap",
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { delay: 0.3 },
      }

  return (
    <section
      id="skills"
      className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden"
    >
      <HeadingWrapper {...(headingProps as any)}>
        <span className="text-xs tracking-[0.3em] uppercase text-neon-pink/70 font-medium">
          Tech Arsenal
        </span>
        <h2 className="font-[var(--font-outfit)] text-4xl sm:text-5xl font-bold mt-3 gradient-text">
          Skills
        </h2>
      </HeadingWrapper>

      <LegendWrapper {...(legendProps as any)}>
        {Object.entries(categoryLabels).map(([key, val]) => (
          <div
            key={key}
            className="flex items-center gap-2 text-xs text-theme-secondary"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: val.color,
                boxShadow: `0 0 8px ${val.color}60`,
              }}
            />
            {val.label}
          </div>
        ))}
      </LegendWrapper>

      <div className="max-w-5xl mx-auto relative min-h-[300px] flex items-center justify-center">
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
          {skills.map((skill, index) => (
            <SkillTag
              key={skill.name}
              skill={skill}
              index={index}
              handTrackingEnabled={handTrackingEnabled}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
