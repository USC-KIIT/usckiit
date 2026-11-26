import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { HackabotTrackId } from "@/lib/hackabot-data";
import { HackabotFaq } from "@/components/usc/hackabot/HackabotFaq";
import { HackabotNavbar } from "@/components/usc/hackabot/HackabotNavbar";
import { HackabotRegister } from "@/components/usc/hackabot/HackabotRegister";
import { HackabotScrollHero } from "@/components/usc/hackabot/HackabotScrollHero";

export const Route = createFileRoute("/events/hackabot")({
  head: () => ({
    meta: [
      { title: "HACK-A-BOT 3.0 — USC KIIT Flagship Competition" },
      {
        name: "description",
        content:
          "Innovate. Automate. Create Impact. Register free for HACK-A-BOT 3.0 (Dec 12–13) across RPA & AI or Innovation tracks aligned with 2+ UN SDGs.",
      },
      { property: "og:title", content: "HACK-A-BOT 3.0 — USC KIIT" },
      {
        property: "og:description",
        content:
          "2-day offline multi-track technology competition organized by USC KIIT under the Department of Training and Placement, KIIT University.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HackabotPage,
});

export function HackabotPage() {
  const [selectedTrack, setSelectedTrack] = useState<HackabotTrackId>("rpa-ai");
  const [selectedSdgs, setSelectedSdgs] = useState<string[]>([]);

  const toggleSdg = (sdgId: string) => {
    setSelectedSdgs((prev) =>
      prev.includes(sdgId) ? prev.filter((item) => item !== sdgId) : [...prev, sdgId],
    );
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    if (window.location.hash === "#register") {
      const timer = window.setTimeout(() => {
        scrollToSection("register");
      }, 180);
      return () => window.clearTimeout(timer);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-obsidian text-cream">
      <div className="film-grain-overlay" aria-hidden />
      <HackabotNavbar onRegisterClick={() => scrollToSection("register")} />

      <main>
        <HackabotScrollHero
          onRegisterClick={() => scrollToSection("register")}
          onExploreTracksClick={() => scrollToSection("faq")}
        />
        <HackabotRegister
          selectedTrack={selectedTrack}
          onChangeTrack={setSelectedTrack}
          selectedSdgs={selectedSdgs}
          onToggleSdg={toggleSdg}
        />
        <HackabotFaq />
      </main>
    </div>
  );
}
