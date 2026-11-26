import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AboutSection } from "@/components/usc/AboutSection";
import { ApplicationModal } from "@/components/usc/ApplicationModal";
import { DomainsShowcase } from "@/components/usc/DomainsShowcase";
import { EventsSection } from "@/components/usc/EventsSection";
import { EventSpotlightRibbon } from "@/components/usc/EventSpotlightRibbon";
import { Footer } from "@/components/usc/Footer";
import { InitiativesSection } from "@/components/usc/InitiativesSection";
import { Navbar } from "@/components/usc/Navbar";
import { RecruitmentSection } from "@/components/usc/RecruitmentSection";
import { ScrollHero } from "@/components/usc/ScrollHero";
import { SystemDiagnostic } from "@/components/usc/SystemDiagnostic";
import { TeamSection } from "@/components/usc/TeamSection";
import type { DomainId } from "@/lib/usc-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "USC KIIT — Building the Future, One Domain at a Time" },
      {
        name: "description",
        content:
          "Official UiPath Student Community at KIIT University, Bhubaneswar. Explore 8 domains, run the System Diagnostic, and build autonomous workflows.",
      },
      { property: "og:title", content: "USC KIIT — UiPath Student Community, KIIT University" },
      {
        property: "og:description",
        content:
          "Building the Future, One Domain at a Time. Interactive 3D showcase, System Diagnostic quiz, flagship bootcamps, and recruitment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [recruitModalOpen, setRecruitModalOpen] = useState(false);
  const [preferredDomain, setPreferredDomain] = useState<DomainId | undefined>(undefined);

  const openApplyModal = (domainId?: DomainId) => {
    setPreferredDomain(domainId);
    setRecruitModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-obsidian text-cream">
      <div className="film-grain-overlay" aria-hidden />
      <Navbar />

      <main>
        <ScrollHero onExploreInitiatives={() => scrollToSection("initiatives")} />
        <EventSpotlightRibbon />
        <InitiativesSection />
        <AboutSection />
        <DomainsShowcase onApplyDomain={(domainId) => openApplyModal(domainId)} />
        <SystemDiagnostic onApplyDomain={(domainId) => openApplyModal(domainId)} />
        <TeamSection />
        <EventsSection />
        <RecruitmentSection onOpenApply={() => openApplyModal()} />
      </main>

      <Footer />

      <ApplicationModal
        open={recruitModalOpen}
        {...(preferredDomain ? { initialDomain: preferredDomain } : {})}
        onClose={() => setRecruitModalOpen(false)}
      />
    </div>
  );
}
