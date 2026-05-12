import { useCallback, useEffect, useState } from "react";
import { AdminModal } from "../components/admin/AdminModal";
import { AIGuide } from "../components/AIGuide";
import { BeyondCode } from "../components/BeyondCode";
import { Contact } from "../components/contact/Contact";
import { Hero } from "../components/hero/Hero";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { Projects } from "../components/projects/Projects";
import { ProofPoints } from "../components/ProofPoints";
import { Skills } from "../components/skills/Skills";
import { Experience } from "../components/timeline/Experience";
import { GrowthTimeline } from "../components/timeline/GrowthTimeline";
import { WhyHireMe } from "../components/WhyHireMe";
import { useViewMode } from "../context/ViewModeContext";
import { defaultResumeMetadata, getResumeMetadata, getResumeUrl } from "../firebase/resume";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";

export function Home() {
  const { isHR } = useViewMode();
  const [adminOpen, setAdminOpen] = useState(false);
  const [resumeMetadata, setResumeMetadata] = useState(defaultResumeMetadata);

  useKeyboardShortcut(useCallback(() => setAdminOpen(true), []));

  useEffect(() => {
    getResumeMetadata().then(setResumeMetadata).catch(() => setResumeMetadata(defaultResumeMetadata));
  }, [adminOpen]);

  async function handleResumeDownload() {
    try {
      const url = await getResumeUrl();
      if (!url) throw new Error("Resume is not configured yet.");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      alert("Resume is not available yet. Please check back soon or contact Yugant directly.");
    }
  }

  return (
    <>
      <Navbar />
      <main className="mode-transition">
        <Hero onResumeDownload={handleResumeDownload} resumeMetadata={resumeMetadata} />
        {isHR ? (
          <>
            <WhyHireMe />
            <Experience />
            <GrowthTimeline />
            <ProofPoints />
            <Skills />
            <Projects />
            <Contact />
          </>
        ) : (
          <>
            <Experience />
            <GrowthTimeline />
            <Skills />
            <Projects />
            <BeyondCode />
            <ProofPoints />
            <Contact />
          </>
        )}
      </main>
      <Footer />
      <AIGuide />
      <AdminModal open={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  );
}
