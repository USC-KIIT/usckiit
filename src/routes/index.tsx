import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AboutSection } from "@/components/usc/AboutSection";
import { ApplicationModal } from "@/components/usc/ApplicationModal";
import { AvengerIntro } from "@/components/usc/AvengerIntro";
import { DomainsShowcase } from "@/components/usc/DomainsShowcase";
import { EventsSection } from "@/components/usc/EventsSection";
import { EventSpotlightRibbon } from "@/components/usc/EventSpotlightRibbon";
import { Footer } from "@/components/usc/Footer";
import { InitiativesSection } from "@/components/usc/InitiativesSection";
import { Navbar } from "@/components/usc/Navbar";
import { RecruitmentSection } from "@/components/usc/RecruitmentSection";
import { ScrollHero } from "@/components/usc/ScrollHero";
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
  const [introComplete, setIntroComplete] = useState(
    () => sessionStorage.getItem("usc-intro-seen") === "1",
  );
  const [recruitModalOpen, setRecruitModalOpen] = useState(false);
  const [preferredDomain, setPreferredDomain] = useState<DomainId | undefined>(undefined);

  useEffect(() => {
    const isOAuthReturn =
      sessionStorage.getItem("hackabot-oauth-return") === "1" ||
      window.location.search.includes("code=") ||
      window.location.hash.includes("access_token=");
    if (isOAuthReturn) {
      const target = `/events/hackabot${window.location.search}${window.location.hash || "#register"}`;
      window.location.replace(target);
    }
  }, []);

  const openApplyModal = (domainId?: DomainId) => {
    setPreferredDomain(domainId);
    setRecruitModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {!introComplete && (
        <AvengerIntro
          onComplete={() => {
            sessionStorage.setItem("usc-intro-seen", "1");
            setIntroComplete(true);
          }}
        />
      )}
      <div className="relative min-h-screen bg-obsidian text-cream">
      <div className="film-grain-overlay" aria-hidden />
      <Navbar />

      <main>
        <ScrollHero onExploreInitiatives={() => scrollToSection("initiatives")} />
        <EventSpotlightRibbon />
        <InitiativesSection />
        <AboutSection />
        <DomainsShowcase onApplyDomain={(domainId) => openApplyModal(domainId)} />
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
    </>
  );
}
