import { useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  CalendarCheck,
  CloudCog,
  Code2,
  Cpu,
  FlaskConical,
  Megaphone,
  Palette,
  PenTool,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  DOMAINS_DATA,
  NON_TECH_DOMAINS,
  TECH_DOMAINS,
  type DomainId,
  type DomainInfo,
} from "@/data/domainsData";

interface DomainsShowcaseProps {
  onApplyDomain: (domainId: DomainId) => void;
}

type WingFilter = "tech" | "non-tech" | "all";

const WING_TABS: readonly { id: WingFilter; label: string; subtitle: string }[] = [
  {
    id: "tech",
    label: "TECH WING (06)",
    subtitle: "ENGINEERING • AUTOMATION • INTELLIGENT SYSTEMS",
  },
  {
    id: "non-tech",
    label: "NON-TECH WING (06)",
    subtitle: "DESIGN • OPERATIONS • STRATEGY • STORYTELLING",
  },
  {
    id: "all",
    label: "ALL DOMAINS (12)",
    subtitle: "TECH WING (06) • NON-TECH WING (06) • 25 DOMAIN LEADS",
  },
];

const DOMAIN_ICONS: Record<DomainId, LucideIcon> = {
  "rpa-ai": Bot,
  "core-ml": Cpu,
  "web-dev": Code2,
  "data-analytics": BarChart3,
  "cloud-automation": CloudCog,
  rnd: FlaskConical,
  "graphic-design": Palette,
  speo: CalendarCheck,
  "media-production": Video,
  "corporate-relations": Briefcase,
  "content-writing": PenTool,
  "media-strategy": Megaphone,
};

function getLeadInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

function DomainCard({
  domain,
  index,
  onOpen,
}: {
  domain: DomainInfo;
  index: number;
  onOpen: (domain: DomainInfo) => void;
}) {
  const [motionState, setMotionState] = useState({
    spotX: 50,
    spotY: 50,
    tiltX: 0,
    tiltY: 0,
    active: false,
  });

  const Icon = DOMAIN_ICONS[domain.id];
  const isTech = domain.wing === "tech";

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const tiltY = (px - 0.5) * 7; // max ±3.5deg
    const tiltX = (0.5 - py) * 7; // max ±3.5deg
    setMotionState({
      spotX: px * 100,
      spotY: py * 100,
      tiltX,
      tiltY,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMotionState((prev) => ({
      ...prev,
      tiltX: 0,
      tiltY: 0,
      active: false,
    }));
  };

  const spotlightColor = isTech ? "rgba(250, 70, 22, 0.16)" : "rgba(0, 103, 223, 0.17)";
  const accentText = isTech ? "text-flame" : "text-cobalt";
  const hoverBorder = isTech ? "hover:border-flame/50" : "hover:border-cobalt/50";

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{
        duration: 0.32,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={() => onOpen(domain)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        borderColor: "rgba(250, 246, 238, 0.08)",
        transform: `perspective(900px) rotateX(${motionState.tiltX}deg) rotateY(${motionState.tiltY}deg)`,
      }}
      className={`hud-brackets group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border bg-carbon/85 p-6 text-left transition-[border-color,transform] duration-200 ease-out ${hoverBorder}`}
    >
      {/* Cursor-tracking radial spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: motionState.active ? 1 : 0,
          background: `radial-gradient(340px circle at ${motionState.spotX}% ${motionState.spotY}%, ${spotlightColor}, transparent 65%)`,
        }}
      />

      {/* Top Content */}
      <div className="relative z-10 w-full">
        {/* 1. Top Row: Index tag left + minimal Lucide icon badge right */}
        <div className="flex items-center justify-between gap-3">
          <span className={`font-mono text-[11px] font-semibold tracking-[0.18em] ${accentText}`}>
            {domain.indexLabel}
          </span>
          <span
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cream/10 bg-obsidian/80 backdrop-blur-sm transition-colors ${
              isTech
                ? "text-flame group-hover:border-flame/40"
                : "text-cobalt group-hover:border-cobalt/40"
            }`}
          >
            <Icon className="h-4 w-4" />
          </span>
        </div>

        {/* 2. Title & One-Liner */}
        <div className="mt-5">
          <h3 className="font-display-usc text-2xl tracking-wide text-cream sm:text-[1.75rem]">
            {domain.title}
          </h3>
          {domain.fullNameSubtitle && (
            <p className="mt-0.5 font-mono text-[10px] tracking-[0.12em] text-cobalt">
              {domain.fullNameSubtitle}
            </p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-cream/68">{domain.tagline}</p>
        </div>

        {/* 3. 3 Clean Focus Chips */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {domain.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-cream/10 bg-obsidian/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-cream/75"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Bottom Lead Bar */}
      <div className="relative z-10 mt-6 flex w-full items-center justify-between gap-3 border-t border-cream/10 pt-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex shrink-0 -space-x-2">
            {domain.leads.map((lead) => (
              <span
                key={lead}
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full border border-obsidian font-mono text-[9px] font-bold text-cream ${
                  isTech
                    ? "bg-flame/25 shadow-[0_0_10px_rgba(250,70,22,0.35)]"
                    : "bg-cobalt/25 shadow-[0_0_10px_rgba(0,103,223,0.35)]"
                }`}
              >
                {getLeadInitials(lead)}
              </span>
            ))}
          </div>
          <span className="truncate font-mono text-[11px] text-cream/70">
            <span className="text-cream/45">Leads: </span>
            {domain.leads.join(", ")}
          </span>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1 font-mono text-[10px] tracking-[0.12em] text-cream/55 transition-transform duration-200 group-hover:translate-x-0.5 ${
            isTech ? "group-hover:text-flame" : "group-hover:text-cobalt"
          }`}
        >
          Details
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </motion.button>
  );
}

export function DomainsShowcase({ onApplyDomain }: DomainsShowcaseProps) {
  const [activeWing, setActiveWing] = useState<WingFilter>("tech");
  const [selectedDomain, setSelectedDomain] = useState<DomainInfo | null>(null);

  const visibleDomains =
    activeWing === "tech"
      ? TECH_DOMAINS
      : activeWing === "non-tech"
        ? NON_TECH_DOMAINS
        : DOMAINS_DATA;

  const activeTabMeta = WING_TABS.find((t) => t.id === activeWing) ?? WING_TABS[0]!;

  const handleJumpToLead = (leadName: string) => {
    setSelectedDomain(null);
    window.dispatchEvent(new CustomEvent("usc:highlight-lead", { detail: { name: leadName } }));
    const teamEl = document.getElementById("team");
    if (teamEl) {
      teamEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="domains"
      className="relative overflow-hidden bg-obsidian px-4 py-16 sm:px-10 sm:py-24 lg:py-32"
    >
      {/* Ambient Mood Shift Radial Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] transition-all duration-700"
        style={{
          background:
            activeWing === "non-tech"
              ? "radial-gradient(ellipse 65% 50% at 50% 10%, rgba(0, 103, 223, 0.14), transparent 70%)"
              : activeWing === "all"
                ? "radial-gradient(ellipse 70% 50% at 50% 10%, rgba(250, 70, 22, 0.10), rgba(0, 103, 223, 0.08) 45%, transparent 72%)"
                : "radial-gradient(ellipse 65% 50% at 50% 10%, rgba(250, 70, 22, 0.14), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center">
          <p className="font-hud text-xs text-flame">TWELVE SPECIALIZED SQUADS</p>
          <h2 className="font-display-usc mt-2 text-4xl text-cream sm:text-6xl">OUR DOMAINS</h2>
        </div>

        {/* Magnetic Wing Switcher */}
        <div className="mt-8 flex flex-col items-center">
          <div className="glass-dark inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-cream/10 p-1.5">
            {WING_TABS.map((tab) => {
              const active = activeWing === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveWing(tab.id)}
                  className={`relative cursor-pointer rounded-full px-4 py-2 font-mono text-[10px] font-semibold tracking-[0.14em] transition-colors sm:px-5 sm:text-[11px] ${
                    active ? "text-cream" : "text-cream/60 hover:text-cream"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="activeWingPill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className={`absolute inset-0 rounded-full ${
                        tab.id === "non-tech"
                          ? "bg-gradient-to-r from-cobalt to-emerald shadow-cobalt-glow"
                          : tab.id === "all"
                            ? "bg-gradient-to-r from-flame to-cobalt shadow-flame-glow"
                            : "gradient-flame shadow-flame-glow"
                      }`}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Animated Wing Subtitle */}
          <div className="mt-4 h-5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTabMeta.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="font-mono text-[10px] tracking-[0.2em] text-cream/55 sm:text-[11px]"
              >
                {activeTabMeta.subtitle}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Kinetic Staggered Bento Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWing}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 md:grid-cols-2 lg:grid-cols-3"
          >
            {visibleDomains.map((domain, index) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                index={index}
                onOpen={setSelectedDomain}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide-Over Domain Detail Drawer */}
      <AnimatePresence>
        {selectedDomain && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-obsidian/80 backdrop-blur-md"
            onClick={() => setSelectedDomain(null)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-dark relative flex h-full w-full max-w-lg flex-col justify-between overflow-y-auto border-l border-cream/15 p-6 sm:p-10"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.18em] ${
                      selectedDomain.wing === "tech"
                        ? "border-flame/40 bg-flame/15 text-flame"
                        : "border-cobalt/40 bg-cobalt/15 text-cobalt"
                    }`}
                  >
                    {selectedDomain.wing === "tech" ? "TECH WING" : "NON-TECH WING"} //{" "}
                    {selectedDomain.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedDomain(null)}
                    aria-label="Close domain details"
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-flame hover:text-cream"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="font-display-usc mt-6 text-4xl text-cream sm:text-5xl">
                  {selectedDomain.title}
                </h3>
                {selectedDomain.fullNameSubtitle && (
                  <p className="mt-1 font-mono text-xs tracking-[0.14em] text-cobalt">
                    {selectedDomain.fullNameSubtitle}
                  </p>
                )}
                <p className="mt-3 text-base leading-relaxed text-cream/80">
                  {selectedDomain.description}
                </p>

                {/* Key Tools & Skills */}
                <div className="mt-7">
                  <p className="font-hud text-[11px] text-cream/55">KEY TOOLS &amp; SKILLS</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedDomain.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full border border-cream/15 bg-obsidian/80 px-3 py-1 font-mono text-[11px] text-cream/85"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* What You'll Work On */}
                <div className="mt-7">
                  <p className="font-hud text-[11px] text-cream/55">WHAT YOU&apos;LL WORK ON</p>
                  <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-cream/80">
                    {selectedDomain.whatYouWorkOn.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            selectedDomain.wing === "tech" ? "bg-flame" : "bg-cobalt"
                          }`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Clickable Domain Lead Chips */}
                <div className="mt-7">
                  <p className="font-hud text-[11px] text-cream/55">
                    DOMAIN LEADS (CLICK TO VIEW IN TEAM)
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedDomain.leads.map((lead) => (
                      <button
                        key={lead}
                        type="button"
                        onClick={() => handleJumpToLead(lead)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-cream/15 bg-obsidian/85 px-3.5 py-1.5 font-mono text-xs text-cream transition-colors hover:border-flame/60 hover:text-flame"
                      >
                        <span
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${
                            selectedDomain.wing === "tech"
                              ? "bg-flame/25 text-flame"
                              : "bg-cobalt/25 text-cobalt"
                          }`}
                        >
                          {getLeadInitials(lead)}
                        </span>
                        {lead}
                        <ArrowRight className="h-3 w-3 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-cream/10 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedDomain.id;
                    setSelectedDomain(null);
                    onApplyDomain(id);
                  }}
                  className="gradient-flame shadow-flame-glow inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3.5 font-mono text-xs font-semibold tracking-[0.16em] text-cream transition-transform hover:scale-[1.02]"
                >
                  APPLY FOR THIS DOMAIN
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}