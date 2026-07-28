import CursorGlow from "@/components/CursorGlow"
import Hero from "@/components/Hero"
import ProjectShowcase from "@/components/ProjectShowcase"
import ExperienceTimeline from "@/components/ExperienceTimeline"
import Certifications from "@/components/Certifications"
import SkillNebula from "@/components/SkillNebula"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <CursorGlow />
      <div className="relative z-10">
        <Hero />
        <ProjectShowcase />
        <ExperienceTimeline />
        <Certifications />
        <SkillNebula />
        <Footer />
      </div>
    </main>
  )
}
