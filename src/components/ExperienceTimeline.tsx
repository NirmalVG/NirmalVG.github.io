"use client"

import React from "react"
import { motion } from "framer-motion"
import GlassCard from "./GlassCard"

interface Experience {
  company: string
  role: string
  period: string
  location: string
  description: string[]
  highlights: string[]
  projects: string
  color: string
  icon: string
}

const experiences: Experience[] = [
  {
    company: "Independent Developer",
    role: "Career Break — Developer & Academic Upskilling",
    period: "Jul 2024 — Present",
    location: "Thrissur, Kerala",
    description: [
      "Built Skin Lens, a full-stack AI-powered cosmetic ingredient analyzer, independently from concept to deployment.",
      "Pursuing Bachelor of Computer Applications (BCA) at Amity University Online to formalize software engineering fundamentals.",
    ],
    highlights: ["Full-Stack AI", "Gemini Vision", "Self-Directed"],
    projects: "Skin Lens",
    color: "#ec4899",
    icon: "🧠",
  },
  {
    company: "Webcastle",
    role: "Next.js Developer",
    period: "Apr 2024 — Jul 2024",
    location: "Kochi, Kerala",
    description: [
      "Developed 3+ production projects including an e-commerce platform and corporate websites using Next.js 14 and TypeScript.",
      "Built reusable component libraries with ShadCN/UI, reducing development time across projects.",
      "Integrated real-time data APIs and implemented dynamic search functionality for improved user engagement.",
      "Built advanced property search filters with dynamic listing display for Novvi Properties.",
      "Worked on the Yateem e-commerce platform, implementing the Choose Lens module using TanStack Query for efficient server-state management.",
    ],
    highlights: ["Next.js 14", "TypeScript", "TanStack Query", "ShadCN/UI"],
    projects: "Yateem · Novvi Properties",
    color: "#a855f7",
    icon: "🚀",
  },
  {
    company: "Webandcrafts",
    role: "Jr React Developer",
    period: "Sept 2022 — Mar 2024",
    location: "Thrissur, Kerala",
    description: [
      "Contributed to 10+ client projects across healthcare, real estate, construction, and retail sectors.",
      "Implemented multilingual support and SEO optimization for Amritha Hospital, improving search visibility.",
      "Developed an EMI calculator and SWR-based state management for Kent Construction, improving data fetching performance.",
      "Integrated third-party APIs across multiple projects, ensuring seamless data flow and consistent UX.",
    ],
    highlights: ["React.js", "SWR", "API Integration", "SEO"],
    projects: "Amritha Hospital · Kent Construction · Karbone · Zentral",
    color: "#06b6d4",
    icon: "💻",
  },
  {
    company: "Spectrum Softtech Solution Pvt Ltd",
    role: "MERN Stack Development Trainee",
    period: "Sept 2021 — Feb 2022",
    location: "Kochi, Kerala",
    description: [
      "Completed 6-month intensive training in full-stack web development covering HTML, CSS, JavaScript, Bootstrap, jQuery, React.js, Node.js, Express, and MongoDB.",
      "Built and deployed multiple training projects applying REST API design and component-based architecture.",
    ],
    highlights: ["MERN Stack", "REST API", "MongoDB"],
    projects: "Training Projects",
    color: "#f97316",
    icon: "🎓",
  },
]

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="relative py-16 sm:py-24 px-4 sm:px-6">
      {/* Section header */}
      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="text-xs tracking-[0.3em] uppercase text-neon-purple/70 font-medium">
          Career Journey
        </span>
        <h2 className="font-[var(--font-outfit)] text-4xl sm:text-5xl font-bold mt-3 gradient-text">
          Experience
        </h2>
      </motion.div>

      <div className="max-w-3xl mx-auto relative">
        {/* Timeline line */}
        <div className="absolute left-[22px] sm:left-[28px] top-0 bottom-0 w-px timeline-line" />

        {experiences.map((exp, index) => (
          <motion.div
            key={exp.company}
            className="relative flex gap-6 sm:gap-8 mb-16 last:mb-0"
            initial={{ opacity: 0, y: 60, x: -20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.8,
              delay: index * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94] as const,
            }}
          >
            {/* Timeline dot */}
            <div className="flex-shrink-0 relative z-10">
              <motion.div
                className="w-[46px] h-[46px] sm:w-[58px] sm:h-[58px] rounded-xl flex items-center justify-center border border-theme"
                style={{
                  background: `linear-gradient(135deg, ${exp.color}20, ${exp.color}05)`,
                  boxShadow: `0 0 25px ${exp.color}15`,
                }}
                whileInView={{
                  boxShadow: [
                    `0 0 15px ${exp.color}10`,
                    `0 0 30px ${exp.color}25`,
                    `0 0 15px ${exp.color}10`,
                  ],
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-xl sm:text-2xl">{exp.icon}</span>
              </motion.div>
            </div>

            {/* Content card */}
            <GlassCard
              className="flex-1 p-6 sm:p-8"
              glowColor={exp.color}
              delay={index * 0.1}
            >
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-start sm:justify-between gap-1 sm:gap-3 mb-4">
                <div>
                  <h3 className="font-[var(--font-outfit)] text-xl sm:text-2xl font-bold text-theme-heading">
                    {exp.company}
                  </h3>
                  <p
                    className="text-sm font-semibold mt-1"
                    style={{ color: exp.color }}
                  >
                    {exp.role}
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs text-theme-tertiary font-medium">
                    {exp.period}
                  </span>
                  <p className="text-xs text-theme-tertiary mt-0.5">{exp.location}</p>
                </div>
              </div>

              {/* Description */}
              <ul className="space-y-3 mb-5">
                {exp.description.map((desc, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-2 text-sm text-theme-secondary leading-relaxed"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0 mt-2"
                      style={{ background: exp.color }}
                    />
                    {desc}
                  </motion.li>
                ))}
              </ul>

              {/* Projects */}
              <div className="flex items-center gap-2 mb-4 text-xs text-theme-tertiary">
                <span className="font-medium">Key Projects:</span>
                <span className="text-theme-secondary">{exp.projects}</span>
              </div>

              {/* Tech highlights */}
              <div className="flex flex-wrap gap-2">
                {exp.highlights.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-md text-xs font-medium border"
                    style={{
                      background: `${exp.color}10`,
                      borderColor: `${exp.color}25`,
                      color: `${exp.color}cc`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
