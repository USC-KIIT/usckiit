import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  CloudCog,
  Code2,
  Cpu,
  FlaskConical,
  Megaphone,
  Palette,
  Pause,
  PenTool,
  Play,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { NON_TECH_DOMAINS, TECH_DOMAINS, type DomainId, type DomainInfo } from "@/data/domainsData";

interface DomainsShowcaseProps {
  onApplyDomain: (domainId: DomainId) => void;
}

type WingFilter = "tech" | "non-tech";

const WING_TABS: readonly { id: WingFilter; label: string; title: string; subtitle: string }[] = [
  {
    id: "tech",
    label: "TECH WING (06)",
    title: "TECH WING",
    subtitle: "ENGINEERING • AUTOMATION • INTELLIGENT SYSTEMS",
  },
  {
    id: "non-tech",
    label: "NON-TECH WING (06)",
    title: "NON-TECH WING",
    subtitle: "DESIGN • OPERATIONS • STRATEGY • STORYTELLING",
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
  onOpen,
  compact = false,
}: {
  domain: DomainInfo;
  onOpen: (domain: DomainInfo) => void;
  compact?: boolean;
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

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setMotionState({
      spotX: px * 100,
      spotY: py * 100,
      tiltX: (0.5 - py) * 6,
      tiltY: (px - 0.5) * 6,
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

  const spotlightColor = isTech ? "rgba(250, 70, 22, 0.18)" : "rgba(0, 103, 223, 0.18)";
  const accentText = isTech ? "text-flame" : "text-cobalt";
  const hoverBorder = isTech ? "hover:border-flame/60" : "hover:border-cobalt/60";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(domain)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(domain);
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        borderColor: "rgba(250, 246, 238, 0.1)",
        transform: `perspective(900px) rotateX(${motionState.tiltX}deg) rotateY(${motionState.tiltY}deg)`,
      }}
      className={`hud-brackets group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border bg-carbon/90 backdrop-blur-md text-left transition-[border-color,transform] duration-200 ease-out shadow-2xl ${
        compact ? "p-4 sm:p-5" : "p-6"
      } ${hoverBorder}`}
    >
      {/* Cursor-tracking radial spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: motionState.active ? 1 : 0,
          background: `radial-gradient(300px circle at ${motionState.spotX}% ${motionState.spotY}%, ${spotlightColor}, transparent 65%)`,
        }}
      />

      {/* Top Content */}
      <div className="relative z-10 w-full">
        <div className="flex items-center justify-between gap-2">
          <span className={`font-mono text-[10px] font-semibold tracking-[0.18em] ${accentText}`}>
            {domain.indexLabel}
          </span>
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border border-cream/10 bg-obsidian/85 transition-colors ${
              isTech
                ? "text-flame group-hover:border-flame/40"
                : "text-cobalt group-hover:border-cobalt/40"
            }`}
          >
            <Icon className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-3">
          <h3 className="font-display-usc text-xl tracking-wide text-cream sm:text-2xl">
            {domain.title}
          </h3>
          {domain.fullNameSubtitle && (
            <p className="mt-0.5 font-mono text-[9px] tracking-[0.12em] text-cobalt">
              {domain.fullNameSubtitle}
            </p>
          )}
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-cream/70 sm:text-[13px]">
            {domain.tagline}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {domain.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-cream/10 bg-obsidian/75 px-2 py-0.5 font-mono text-[9px] tracking-[0.08em] text-cream/75"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Lead Bar + Bold Orange EXPLORE DOMAIN Link */}
      <div className="relative z-10 mt-4 flex w-full flex-col gap-2.5 border-t border-cream/10 pt-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex shrink-0 -space-x-2">
            {domain.leads.map((lead) => (
              <span
                key={lead}
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full border border-obsidian font-mono text-[8px] font-bold text-cream ${
                  isTech
                    ? "bg-flame/25 shadow-[0_0_8px_rgba(250,70,22,0.35)]"
                    : "bg-cobalt/25 shadow-[0_0_8px_rgba(0,103,223,0.35)]"
                }`}
              >
                {getLeadInitials(lead)}
              </span>
            ))}
          </div>
          <span className="truncate font-mono text-[10px] text-cream/65">
            <span className="text-cream/40">Leads: </span>
            {domain.leads.join(", ")}
          </span>
        </div>

        <a
          href={`/domains/${domain.id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] font-bold tracking-[0.14em] text-flame transition-all duration-200 hover:translate-x-1 hover:text-[#FF6B00]"
        >
          EXPLORE DOMAIN
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

function OrbitingWingStage({
  domains,
  wingTitle,
  isTech,
  onOpen,
}: {
  domains: readonly DomainInfo[];
  wingTitle: string;
  isTech: boolean;
  onOpen: (domain: DomainInfo) => void;
}) {
  const [angle, setAngle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = (ts: number) => {
      if (lastTimeRef.current !== null && !paused && !hovered) {
        const dt = (ts - lastTimeRef.current) / 1000;
        setAngle((prev) => prev + dt * 0.24);
      }
      lastTimeRef.current = ts;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paused, hovered]);

  const stepOrbit = (dir: 1 | -1) => {
    setAngle((prev) => prev + dir * ((Math.PI * 2) / domains.length));
  };

  return (
    <div className="mt-8">
      {/* Desktop 3D Orbit Arena */}
      <div
        className="relative mx-auto hidden h-[640px] w-full max-w-6xl items-center justify-center overflow-visible md:flex"
        style={{ perspective: "1400px" }}
      >
        {/* Ambient 3D Orbital Rings */}
        <div
          aria-hidden
          className={`pointer-events-none absolute h-[340px] w-[820px] rounded-full border transition-colors duration-700 ${
            isTech ? "border-flame/20" : "border-cobalt/25"
          }`}
          style={{ transform: "rotateX(68deg)" }}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute h-[240px] w-[580px] rounded-full border border-dashed transition-colors duration-700 ${
            isTech ? "border-flame/30" : "border-cobalt/30"
          }`}
          style={{ transform: "rotateX(68deg)" }}
        />

        {/* Center 3D Core Hub */}
        <motion.div
          key={wingTitle}
          initial={{ scale: 0.86, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`relative z-20 flex h-44 w-44 flex-col items-center justify-center rounded-full border bg-obsidian/90 p-4 text-center backdrop-blur-xl ${
            isTech
              ? "border-flame/50 shadow-[0_0_60px_-8px_rgba(250,70,22,0.55)]"
              : "border-cobalt/50 shadow-[0_0_60px_-8px_rgba(0,103,223,0.55)]"
          }`}
        >
          <span
            aria-hidden
            className={`absolute inset-2 rounded-full border border-dashed ${
              isTech ? "border-flame/35" : "border-cobalt/35"
            } animate-[spin_18s_linear_infinite]`}
          />
          <span
            className={`font-mono text-[9px] tracking-[0.26em] ${
              isTech ? "text-flame" : "text-cobalt"
            }`}
          >
            USC KIIT
          </span>
          <h3 className="font-display-usc mt-1 text-3xl leading-none tracking-wide text-cream">
            {wingTitle}
          </h3>
          <span className="mt-2 font-mono text-[9px] tracking-[0.2em] text-cream/50">
            06 SQUADS
          </span>
        </motion.div>

        {/* 6 Orbiting Domain Cards */}
        {domains.map((domain, idx) => {
          const theta = angle + (idx / domains.length) * Math.PI * 2;
          const x = Math.sin(theta) * 410;
          const y = -Math.cos(theta) * 165;
          const depth = Math.cos(theta);
          const norm = (depth + 1) / 2;
          const scale = 0.74 + norm * 0.28;
          const opacity = 0.48 + norm * 0.52;
          const rotateY = -Math.sin(theta) * 16;
          const zIndex = Math.round(norm * 30) + 5;

          return (
            <div
              key={domain.id}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                position: "absolute",
                width: "272px",
                zIndex,
                opacity,
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotateY(${rotateY}deg)`,
                transformStyle: "preserve-3d",
              }}
              className="will-change-transform"
            >
              <DomainCard domain={domain} onOpen={onOpen} compact />
            </div>
          );
        })}
      </div>

      {/* Desktop Orbit Controls */}
      <div className="mt-2 hidden items-center justify-center gap-3 md:flex">
        <button
          type="button"
          onClick={() => stepOrbit(-1)}
          aria-label="Rotate orbit previous"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-cream/15 bg-carbon text-cream/75 transition-colors hover:border-flame hover:text-cream"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-cream/15 bg-carbon px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-cream/75 transition-colors hover:border-flame hover:text-cream"
        >
          {paused ? (
            <Play className="h-3 w-3 text-flame" />
          ) : (
            <Pause className="h-3 w-3 text-flame" />
          )}
          {paused ? "RESUME ORBIT" : "PAUSE ORBIT"}
        </button>
        <button
          type="button"
          onClick={() => stepOrbit(1)}
          aria-label="Rotate orbit next"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-cream/15 bg-carbon text-cream/75 transition-colors hover:border-flame hover:text-cream"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile 3D Coverflow / Auto-Moving Carousel */}
      <MobileDomainCoverflow
        domains={domains}
        wingTitle={wingTitle}
        isTech={isTech}
        onOpen={onOpen}
      />
    </div>
  );
}

function MobileDomainCoverflow({
  domains,
  wingTitle,
  isTech,
  onOpen,
}: {
  domains: readonly DomainInfo[];
  wingTitle: string;
  isTech: boolean;
  onOpen: (domain: DomainInfo) => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    setActiveIdx(0);
  }, [wingTitle]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % domains.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [autoPlay, domains.length]);

  const step = (dir: 1 | -1) => {
    setAutoPlay(false);
    setActiveIdx((prev) => (prev + dir + domains.length) % domains.length);
  };

  return (
    <div className="md:hidden">
      {/* Compact Wing Core Badge */}
      <div className="mb-4 flex justify-center">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[10px] font-semibold tracking-[0.18em] ${
            isTech
              ? "border-flame/40 bg-flame/10 text-flame"
              : "border-cobalt/40 bg-cobalt/10 text-cobalt"
          }`}
        >
          <span
            className={`h-2 w-2 animate-pulse rounded-full ${isTech ? "bg-flame" : "bg-cobalt"}`}
          />
          {wingTitle} • 0{activeIdx + 1} / 0{domains.length}
        </div>
      </div>

      {/* 3D Coverflow Stage */}
      <div
        className="relative mx-auto h-[325px] w-full overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        {domains.map((domain, idx) => {
          const total = domains.length;
          let offset = idx - activeIdx;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isCenter = offset === 0;
          const isAdjacent = Math.abs(offset) === 1;
          if (Math.abs(offset) > 1) return null;

          return (
            <motion.div
              key={domain.id}
              initial={false}
              animate={{
                x: offset * 245,
                scale: isCenter ? 1 : 0.84,
                rotateY: offset * -18,
                opacity: isCenter ? 1 : isAdjacent ? 0.42 : 0,
                zIndex: isCenter ? 20 : 10,
              }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_e, info) => {
                if (info.offset.x < -45) step(1);
                else if (info.offset.x > 45) step(-1);
              }}
              onClick={() => {
                if (!isCenter) step(offset > 0 ? 1 : -1);
              }}
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                width: "min(82vw, 310px)",
                marginLeft: "calc(min(82vw, 310px) / -2)",
                transformStyle: "preserve-3d",
              }}
              className="h-[310px]"
            >
              <DomainCard domain={domain} onOpen={onOpen} compact />
            </motion.div>
          );
        })}
      </div>

      {/* Controls + Dots */}
      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous domain"
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-cream/15 bg-carbon text-cream/75"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {domains.map((d, idx) => (
            <button
              key={d.id}
              type="button"
              aria-label={`Go to ${d.title}`}
              onClick={() => {
                setAutoPlay(false);
                setActiveIdx(idx);
              }}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeIdx
                  ? isTech
                    ? "w-5 bg-flame"
                    : "w-5 bg-cobalt"
                  : "w-1.5 bg-cream/25"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next domain"
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-cream/15 bg-carbon text-cream/75"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function DomainsShowcase({ onApplyDomain }: DomainsShowcaseProps) {
  const [activeWing, setActiveWing] = useState<WingFilter>("tech");
  const [selectedDomain, setSelectedDomain] = useState<DomainInfo | null>(null);

  const visibleDomains = activeWing === "tech" ? TECH_DOMAINS : NON_TECH_DOMAINS;
  const activeTabMeta = WING_TABS.find((t) => t.id === activeWing) ?? WING_TABS[0]!;
  const isTech = activeWing === "tech";

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
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] transition-all duration-700"
        style={{
          background: isTech
            ? "radial-gradient(ellipse 65% 50% at 50% 15%, rgba(250, 70, 22, 0.14), transparent 70%)"
            : "radial-gradient(ellipse 65% 50% at 50% 15%, rgba(0, 103, 223, 0.15), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center">
          <p className="font-hud text-xs text-flame">TWELVE SPECIALIZED SQUADS</p>
          <h2 className="font-display-usc mt-2 text-4xl text-cream sm:text-6xl">OUR DOMAINS</h2>
        </div>

        {/* Magnetic Wing Switcher (Tech Wing vs Non-Tech Wing only) */}
        <div className="mt-8 flex flex-col items-center">
          <div className="glass-dark inline-flex flex-nowrap items-center justify-center gap-1 rounded-full border border-cream/10 p-1">
            {WING_TABS.map((tab) => {
              const active = activeWing === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveWing(tab.id)}
                  className={`relative cursor-pointer whitespace-nowrap rounded-full px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.1em] transition-colors sm:px-6 sm:py-2.5 sm:text-[11px] sm:tracking-[0.14em] ${
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
          <div className="mt-3 min-h-[20px] px-2 text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTabMeta.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="font-mono text-[9px] leading-relaxed tracking-[0.16em] text-cream/55 sm:text-[11px] sm:tracking-[0.2em]"
              >
                {activeTabMeta.subtitle}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* 3D Circular Orbiting Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWing}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28 }}
          >
            <OrbitingWingStage
              domains={visibleDomains}
              wingTitle={activeTabMeta.title}
              isTech={isTech}
              onOpen={setSelectedDomain}
            />
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
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex h-full w-full max-w-lg flex-col justify-between overflow-y-auto border-l border-cream/12 bg-carbon p-6 sm:p-8"
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`rounded-full border px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.16em] ${
                      selectedDomain.wing === "tech"
                        ? "border-flame/40 bg-flame/15 text-flame"
                        : "border-cobalt/40 bg-cobalt/15 text-cobalt"
                    }`}
                  >
                    {selectedDomain.wing === "tech" ? "TECH WING" : "NON-TECH WING"} ·{" "}
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
                <p className="mt-4 text-sm leading-relaxed text-cream/80">
                  {selectedDomain.fullDescription}
                </p>

                {/* Key Tools & Skills */}
                <div className="mt-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/50">
                    Key Tools &amp; Skills
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {selectedDomain.toolsAndSkills.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full border border-cream/12 bg-obsidian/80 px-3 py-1 font-mono text-[11px] text-cream/85"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* What You'll Work On */}
                <div className="mt-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/50">
                    What You&apos;ll Work On
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {selectedDomain.workItems.map((work) => (
                      <li
                        key={work}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-cream/75"
                      >
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            selectedDomain.wing === "tech" ? "bg-flame" : "bg-cobalt"
                          }`}
                        />
                        <span>{work}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Clickable Domain Lead Chips */}
                <div className="mt-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/50">
                    Domain Leads (Click to view in Team)
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {selectedDomain.leads.map((lead) => (
                      <button
                        key={lead}
                        type="button"
                        onClick={() => handleJumpToLead(lead)}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-all hover:scale-[1.03] ${
                          selectedDomain.wing === "tech"
                            ? "border-flame/35 bg-flame/10 text-cream hover:border-flame hover:shadow-flame-glow"
                            : "border-cobalt/35 bg-cobalt/10 text-cream hover:border-cobalt hover:shadow-cobalt-glow"
                        }`}
                      >
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-obsidian text-[9px] font-bold text-cream">
                          {getLeadInitials(lead)}
                        </span>
                        {lead}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-2.5 border-t border-cream/10 pt-5">
                <a
                  href={`/domains/${selectedDomain.id}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-flame/40 bg-flame/10 py-3 font-mono text-xs font-bold tracking-[0.16em] text-flame transition-colors hover:bg-flame/20"
                >
                  EXPLORE DOMAIN PAGE
                  <ArrowRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedDomain.id;
                    setSelectedDomain(null);
                    onApplyDomain(id);
                  }}
                  className="gradient-flame shadow-flame-glow inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-3.5 font-mono text-xs font-semibold tracking-[0.16em] text-cream transition-transform hover:scale-[1.02]"
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
