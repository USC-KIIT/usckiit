import { useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  BrainCircuit,
  CalendarCheck,
  Code2,
  FileCode2,
  Film,
  Megaphone,
  Palette,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  USC_DOMAINS,
  type DomainCategory,
  type DomainId,
  type DomainInfo,
} from "@/lib/usc-data";

interface DomainsShowcaseProps {
  onApplyDomain: (domainId: DomainId) => void;
}

const CATEGORIES: readonly DomainCategory[] = [
  "ALL",
  "ENGINEERING",
  "CREATIVE",
  "GROWTH & OPS",
];

const DOMAIN_ICONS: Record<DomainId, LucideIcon> = {
  "rpa-ai": Bot,
  "web-app": Code2,
  "aiml-data": BrainCircuit,
  "uiux-design": Palette,
  "content-tech": FileCode2,
  "marketing-pr": Megaphone,
  "video-cinema": Film,
  "events-ops": CalendarCheck,
};

function DomainCard({
  domain,
  onOpen,
}: {
  domain: DomainInfo;
  onOpen: (domain: DomainInfo) => void;
}) {
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });
  const Icon = DOMAIN_ICONS[domain.id];

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpot({ x, y, active: true });
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(domain)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpot((prev) => ({ ...prev, active: false }))}
      className={`hud-brackets group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-cream/10 bg-carbon/85 p-6 text-left transition-colors duration-200 hover:border-flame/60 ${
        domain.spanWide ? "md:col-span-2" : ""
      }`}
    >
      {/* Cursor-following radial spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(360px circle at ${spot.x}% ${spot.y}%, oklch(0.648 0.224 34 / 18%), transparent 65%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cream/10 bg-obsidian text-flame transition-colors group-hover:border-flame/50">
            <Icon className="h-5 w-5" />
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.18em] text-cream/50 transition-colors group-hover:text-flame">
            {domain.category}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>

        <h3 className="font-display-usc mt-5 text-3xl text-cream">{domain.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cream/65">{domain.description}</p>
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap gap-2">
        {domain.tools.map((tool) => (
          <span
            key={tool}
            className="rounded-full border border-cream/10 bg-obsidian/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-cream/75"
          >
            {tool}
          </span>
        ))}
      </div>
    </button>
  );
}

export function DomainsShowcase({ onApplyDomain }: DomainsShowcaseProps) {
  const [activeFilter, setActiveFilter] = useState<DomainCategory>("ALL");
  const [selectedDomain, setSelectedDomain] = useState<DomainInfo | null>(null);

  const visibleDomains =
    activeFilter === "ALL"
      ? USC_DOMAINS
      : USC_DOMAINS.filter((d) => d.category === activeFilter);

  return (
    <section id="domains" className="relative bg-obsidian px-6 py-24 sm:px-10 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-hud text-xs text-flame">EIGHT SPECIALIZED SQUADS</p>
            <h2 className="font-display-usc mt-2 text-5xl text-cream sm:text-6xl">
              THE EIGHT DOMAINS
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const active = activeFilter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveFilter(category)}
                  className={`cursor-pointer rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.16em] transition-colors ${
                    active
                      ? "gradient-flame text-cream shadow-flame-glow"
                      : "border border-cream/15 bg-carbon/60 text-cream/70 hover:border-flame/50 hover:text-cream"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {visibleDomains.map((domain) => (
            <DomainCard key={domain.id} domain={domain} onOpen={setSelectedDomain} />
          ))}
        </div>
      </div>

      {/* Slide-Over Domain Detail Drawer */}
      <AnimatePresence>
        {selectedDomain && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.button
              type="button"
              aria-label="Close domain detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDomain(null)}
              className="fixed inset-0 bg-obsidian/75 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="relative z-10 flex h-full w-full max-w-lg flex-col justify-between overflow-y-auto border-l border-cream/10 bg-carbon p-7 shadow-2xl sm:p-9"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-hud text-[11px] text-flame">
                    {selectedDomain.category} · {selectedDomain.codename}
                  </span>
                  <button
                    type="button"
                    aria-label="Close drawer"
                    onClick={() => setSelectedDomain(null)}
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-cream/15 text-cream/80 transition-colors hover:border-flame hover:text-cream"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="font-display-usc mt-5 text-5xl text-cream">
                  {selectedDomain.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/75">
                  {selectedDomain.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedDomain.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-cobalt/40 bg-cobalt/15 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-cream"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="mt-8 border-t border-cream/10 pt-6">
                  <h4 className="font-hud text-xs text-flame">WHAT YOU&apos;LL BUILD</h4>
                  <ul className="mt-3 space-y-2.5 text-sm text-cream/80">
                    {selectedDomain.whatYouBuild.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-flame" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 border-t border-cream/10 pt-6">
                  <h4 className="font-hud text-xs text-emerald">SKILLS WE LOOK FOR</h4>
                  <ul className="mt-3 space-y-2.5 text-sm text-cream/80">
                    {selectedDomain.skillsWeLookFor.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
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
                  className="gradient-flame shadow-flame-glow w-full cursor-pointer rounded-full py-3.5 font-mono text-xs font-semibold tracking-[0.18em] text-cream transition-transform hover:scale-[1.02]"
                >
                  APPLY NOW FOR {selectedDomain.shortTitle}
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}