"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import FloatingElement from "./FloatingElement";

const features = [
  "OAuth authentication",
  "Ingredient safety scoring",
  "Quiz-based skin profile",
  "Gemini Vision OCR",
];

const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Supabase",
  "Gemini API",
  "Tailwind CSS",
];

interface Project {
  title: string;
  description: string;
  tech: string[];
  color: string;
  url: string;
}

const clientProjects: Project[] = [
  {
    title: "Amritha Hospital",
    description: "Multilingual language switching, SWR-based state management, API integration, and SEO optimization to improve search visibility.",
    tech: ["React.js", "SWR", "SEO", "i18n"],
    color: "#06b6d4",
    url: "https://www.amritahospitals.org/",
  },
  {
    title: "Kent Construction",
    description: "EMI calculator, SWR state management, and improved overall user experience with interactive financial tools.",
    tech: ["React.js", "SWR", "API"],
    color: "#10b981",
    url: "https://www.kenthomes.in/",
  },
  {
    title: "Yateem — E-commerce",
    description: "Choose Lens module using TanStack Query for efficient server-state management and bug fixes on the e-commerce platform.",
    tech: ["Next.js 14", "TanStack Query", "TypeScript"],
    color: "#a855f7",
    url: "https://yateem.com/",
  },
  {
    title: "Novvi Properties",
    description: "Advanced property search filters and enhanced interactive listings to effectively surface relevant property information.",
    tech: ["Next.js", "TypeScript", "API"],
    color: "#ec4899",
    url: "https://www.novviproperties.com/",
  },
  {
    title: "Karbone",
    description: "Dynamic search functionality and API integration for efficient product discovery and seamless UX.",
    tech: ["React.js", "API", "Search"],
    color: "#f97316",
    url: "https://www.karbone.com/",
  },
  {
    title: "Zentral",
    description: "Reusable Next.js components, real-time data API integration, and dynamic search for quick information access.",
    tech: ["Next.js", "Real-time API", "ShadCN"],
    color: "#3b82f6",
    url: "https://zentral.world/",
  },
];

export default function ProjectShowcase() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section id="projects" className="relative py-24 px-6">
      {/* ===== Featured Personal Project ===== */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="text-xs tracking-[0.3em] uppercase text-neon-cyan/70 font-medium">
          Featured Project
        </span>
        <h2 className="font-[var(--font-outfit)] text-4xl sm:text-5xl font-bold mt-3 gradient-text">
          AI Project Showcase
        </h2>
      </motion.div>

      {/* Skin Lens Card */}
      <div className="max-w-5xl mx-auto mb-28" style={{ perspective: 1000 }}>
        <motion.div
          ref={cardRef}
          className="glass-strong relative overflow-hidden rounded-3xl p-1 cursor-default"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="absolute inset-0 rounded-3xl neon-border" />

          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-[1.25rem] overflow-hidden">
            {/* Main content */}
            <div className="lg:col-span-3 p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-6">
                <FloatingElement distance={5} duration={4}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <span className="text-xl">🔬</span>
                  </div>
                </FloatingElement>
                <div>
                  <h3 className="font-[var(--font-outfit)] text-2xl sm:text-3xl font-bold text-white">
                    Skin Lens
                  </h3>
                  <p className="text-sm text-neon-cyan/80 font-medium">
                    AI Cosmetic Ingredient Analyzer
                  </p>
                </div>
              </div>

              <p className="text-white/60 leading-relaxed mb-6 text-sm sm:text-base">
                A full-stack web app that analyzes cosmetic product ingredients using
                Gemini Vision for OCR and ingredient identification. Helps users
                understand what&apos;s in their skincare products with AI-powered
                ingredient analysis and safety scoring.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    className="flex items-center gap-2 text-sm text-white/70"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-green flex-shrink-0" />
                    {feature}
                  </motion.div>
                ))}
              </div>

              <FloatingElement distance={4} delay={0.5} duration={5}>
                <a
                  href="https://skin-lens.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-white/10 text-sm font-medium text-white/90 hover:border-neon-cyan/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,214,212,0.2)]"
                >
                  <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                  skin-lens.netlify.app
                  <svg
                    className="w-4 h-4 text-white/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </FloatingElement>
            </div>

            {/* Tech stack sidebar */}
            <div className="lg:col-span-2 p-8 sm:p-10 bg-white/[0.02] border-t lg:border-t-0 lg:border-l border-white/5">
              <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-6 font-medium">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, i) => (
                  <motion.span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/70 border border-white/5 hover:border-neon-purple/30 hover:text-white/90 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 0 15px rgba(168,85,247,0.2)",
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span className="px-2.5 py-1 rounded-md bg-neon-purple/10 text-neon-purple/80 border border-neon-purple/20">
                    Full-Stack
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-neon-cyan/10 text-neon-cyan/80 border border-neon-cyan/20">
                    AI/ML
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-neon-green/10 text-neon-green/80 border border-neon-green/20">
                    Deployed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ===== Client / Professional Projects Grid ===== */}
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="text-xs tracking-[0.3em] uppercase text-neon-purple/70 font-medium">
          Professional Work
        </span>
        <h2 className="font-[var(--font-outfit)] text-3xl sm:text-4xl font-bold mt-3 gradient-text">
          Client Projects
        </h2>
      </motion.div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientProjects.map((project, index) => (
          <motion.div
            key={project.title}
            className="glass p-6 group hover:border-white/15 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.1 + index * 0.08,
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94] as const,
            }}
            whileHover={{
              y: -5,
              transition: { duration: 0.3 },
            }}
            onClick={() => window.open(project.url, "_blank", "noopener,noreferrer")}
          >
            {/* Glow accent */}
            <div
              className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-0 blur-3xl group-hover:opacity-20 transition-opacity duration-500"
              style={{ background: project.color }}
            />

            <div className="relative">
              <h4
                className="font-[var(--font-outfit)] text-lg font-bold mb-2"
                style={{ color: `${project.color}dd` }}
              >
                {project.title}
              </h4>
              <p className="text-xs text-white/50 leading-relaxed mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[10px] font-medium border"
                    style={{
                      background: `${project.color}08`,
                      borderColor: `${project.color}20`,
                      color: `${project.color}aa`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: `${project.color}cc` }}
              >
                Visit Site
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
