import CursorGlow from "@/components/CursorGlow"
import Hero from "@/components/Hero"
import ProjectShowcase from "@/components/ProjectShowcase"
import ExperienceTimeline from "@/components/ExperienceTimeline"
import SkillNebula from "@/components/SkillNebula"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden overscroll-y-contain">
      <CursorGlow />
      <div className="relative z-10">
        <Hero />
        <ProjectShowcase />
        <ExperienceTimeline />
        <SkillNebula />
        <Footer />
      </div>
    </main>
  )
}
