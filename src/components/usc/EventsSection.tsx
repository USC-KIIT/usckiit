import { useState, type PointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  Cpu,
  Globe2,
  MapPin,
  Mic2,
  Sparkles,
  Users,
} from "lucide-react";
import { useHackabotCountdown } from "@/lib/use-hackabot-countdown";
import { FLAGSHIP_EVENTS, type FlagshipEvent } from "@/lib/usc-data";

export function EventsSection() {
  const { phaseState, countdown } = useHackabotCountdown();

  return (
    <section id="events" className="relative bg-obsidian px-4 py-16 sm:px-10 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* TIER 1: HACK-A-BOT 3.0 FEATURED PORTAL CARD */}
        <div className="glass-dark hud-brackets relative overflow-hidden rounded-3xl p-5 sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-flame/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cobalt/15 blur-3xl"
          />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-hud text-[10px] leading-relaxed text-flame sm:text-[11px]">
                UPCOMING FLAGSHIP COMPETITION • USC KIIT UNDER DEPARTMENT OF TRAINING &amp; PLACEMENT
              </p>
              <h2 className="font-display-usc text-gradient-flame mt-2 text-5xl sm:text-7xl lg:text-8xl">
                HACK-A-BOT 3.0
              </h2>
              <p className="mt-2 text-base font-semibold text-cream sm:text-xl">
                &ldquo;Innovate. Automate. Create Impact.&rdquo;
              </p>
              <p className="mt-3 text-sm leading-relaxed text-cream/75">
                A 2-day offline multi-track technology competition featuring interactive workshops,
                hands-on challenges, guest engagements, and 2+ UN SDG sustainability alignment.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald/45 bg-emerald/15 px-3.5 py-1.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-emerald sm:px-4 sm:text-[11px]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald" />
                FREE FOR ALL (₹0)
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-cobalt/45 bg-cobalt/15 px-3.5 py-1.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-cream sm:px-4 sm:text-[11px]">
                OFFLINE • DEC 12–13
              </span>
            </div>
          </div>

          {/* Quick Spec Pills */}
          <div className="relative z-10 mt-6 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/12 bg-obsidian/80 px-3.5 py-1.5 font-mono text-[11px] text-cream/80">
              <Calendar className="h-3.5 w-3.5 text-flame" />
              12–13 Dec • Reg: 2–11 Dec
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/12 bg-obsidian/80 px-3.5 py-1.5 font-mono text-[11px] text-cream/80">
              <MapPin className="h-3.5 w-3.5 text-cobalt" />
              Campus 6 Aud. &amp; Campus 10 Central Library
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/12 bg-obsidian/80 px-3.5 py-1.5 font-mono text-[11px] text-cream/80">
              <Cpu className="h-3.5 w-3.5 text-flame" />
              Tracks: RPA &amp; AI + Innovation
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/12 bg-obsidian/80 px-3.5 py-1.5 font-mono text-[11px] text-cream/80">
              <Globe2 className="h-3.5 w-3.5 text-emerald" />
              2+ UN SDGs Mandate
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/12 bg-obsidian/80 px-3.5 py-1.5 font-mono text-[11px] text-cream/80">
              <Users className="h-3.5 w-3.5 text-cream/70" />
              Max 5 / Team
            </span>
          </div>

          {/* Compact Live Countdown + Portal Entry CTA */}
          <div className="relative z-10 mt-7 flex flex-col gap-5 rounded-2xl border border-cream/10 bg-obsidian/85 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="font-hud text-[10px] text-emerald">
                {phaseState ? phaseState.label : "SYNCING EVENT CLOCK"}
              </p>
              <div className="mt-2 flex items-center gap-1 font-mono sm:gap-2">
                {[
                  { val: countdown.days, label: "DAYS" },
                  { val: countdown.hours, label: "HRS" },
                  { val: countdown.minutes, label: "MIN" },
                  { val: countdown.seconds, label: "SEC" },
                ].map((unit, idx) => (
                  <div key={unit.label} className="flex items-center gap-1 sm:gap-2">
                    <div className="min-w-[50px] rounded-xl border border-cream/10 bg-carbon px-2 py-1.5 text-center sm:min-w-[58px] sm:px-3 sm:py-2">
                      <span className="block text-xl font-bold leading-none text-cream sm:text-2xl">
                        {unit.val}
                      </span>
                      <span className="mt-1 block text-[8px] tracking-[0.14em] text-cream/45 sm:text-[9px]">
                        {unit.label}
                      </span>
                    </div>
                    {idx < 3 && <span className="text-base font-bold text-flame">:</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 sm:items-end">
              <Link
                to="/events/hackabot"
                className="gradient-flame shadow-flame-glow inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-mono text-xs font-semibold tracking-[0.16em] text-cream transition-transform hover:scale-[1.03] sm:w-auto sm:px-7"
              >
                ENTER HACK-A-BOT 3.0 PORTAL
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/events/hackabot"
                hash="register"
                className="text-center font-mono text-[10px] tracking-[0.16em] text-cream/65 transition-colors hover:text-flame sm:pr-2"
              >
                DIRECTLY JUMP TO TEAM REGISTRATION →
              </Link>
            </div>
          </div>
        </div>

        {/* TIER 2: PAST FLAGSHIP EVENTS */}
        <PastEventsArchive events={FLAGSHIP_EVENTS} />
      </div>
    </section>
  );
}

function PastEventsArchive({ events }: { events: readonly FlagshipEvent[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="mt-16">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-hud text-xs text-cream/55">ARCHIVE</p>
          <h3 className="font-display-usc mt-1.5 text-4xl text-cream sm:text-5xl">
            PAST FLAGSHIP EVENTS
          </h3>
        </div>
        <p className="font-mono text-[10px] tracking-[0.16em] text-cream/45">
          HOVER OR TAP ANY EVENT TO EXPAND FULL DETAILS
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 items-start gap-5 md:grid-cols-2">
        {events.map((event) => (
          <PastEventCard
            key={event.id}
            event={event}
            isExpanded={activeId === event.id}
            isDimmed={activeId !== null && activeId !== event.id}
            onHoverStart={() => setActiveId(event.id)}
            onHoverEnd={() => setActiveId((prev) => (prev === event.id ? null : prev))}
            onToggle={() => setActiveId((prev) => (prev === event.id ? null : event.id))}
          />
        ))}
      </div>
    </div>
  );
}

function PastEventCard({
  event,
  isExpanded,
  isDimmed,
  onHoverStart,
  onHoverEnd,
  onToggle,
}: {
  event: FlagshipEvent;
  isExpanded: boolean;
  isDimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onToggle: () => void;
}) {
  const [spot, setSpot] = useState({ x: 0, y: 0, active: false });

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  return (
    <motion.article
      layout
      animate={{
        y: isExpanded ? -4 : 0,
        opacity: isDimmed ? 0.65 : 1,
      }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onHoverStart}
      onMouseLeave={() => {
        setSpot((prev) => ({ ...prev, active: false }));
        onHoverEnd();
      }}
      onPointerMove={handlePointerMove}
      onClick={onToggle}
      className={`glass-dark hud-brackets group relative cursor-pointer overflow-hidden rounded-2xl border p-6 transition-colors duration-300 ${
        isExpanded
          ? "border-flame/55 shadow-[0_20px_50px_-15px_rgba(250,70,22,0.28)]"
          : "border-cream/10 hover:border-flame/40"
      }`}
    >
      {/* Subtle cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(280px circle at ${spot.x}px ${spot.y}px, rgba(250,70,22,0.14), transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2">
          <span className="font-hud text-[10px] text-flame">{event.tag}</span>
          <span className="rounded-full border border-cream/15 bg-obsidian px-2.5 py-0.5 font-mono text-[9px] tracking-[0.16em] text-cream/55">
            COMPLETED
          </span>
        </div>

        <h4 className="font-display-usc mt-4 text-3xl text-cream sm:text-4xl">{event.title}</h4>
        <p className="mt-1 text-xs font-semibold text-cobalt">{event.subtitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-cream/70">{event.description}</p>

        {/* Smoothly expanding full details */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 space-y-4 border-t border-cream/10 pt-4">
                {/* Date & Venue */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/12 bg-obsidian/80 px-3 py-1 font-mono text-[10px] text-cream/80">
                    <Calendar className="h-3 w-3 text-flame" />
                    {event.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/12 bg-obsidian/80 px-3 py-1 font-mono text-[10px] text-cream/80">
                    <MapPin className="h-3 w-3 text-cobalt" />
                    {event.venue}
                  </span>
                </div>

                {/* Topics / Highlights */}
                <div>
                  <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-cream/50">
                    <Sparkles className="h-3 w-3 text-flame" />
                    HIGHLIGHTS &amp; TOPICS
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {event.highlights.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-flame/25 bg-flame/10 px-2.5 py-1 font-mono text-[10px] text-cream/90"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Speakers */}
                {event.speakers.length > 0 && (
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-cream/50">
                      <Mic2 className="h-3 w-3 text-emerald" />
                      FEATURED {event.speakers.length > 1 ? "SPEAKERS" : "SPEAKER"}
                    </p>
                    <div className="space-y-2">
                      {event.speakers.map((speaker) => (
                        <div
                          key={speaker.name}
                          className="rounded-xl border border-cream/10 bg-obsidian/70 px-3.5 py-2.5"
                        >
                          <p className="text-xs font-semibold text-cream">{speaker.name}</p>
                          <p className="mt-0.5 text-[11px] text-cream/65">{speaker.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Partners / Sponsors */}
                {event.partners && (
                  <p className="font-mono text-[10px] leading-relaxed tracking-[0.12em] text-cream/60">
                    {event.partners}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Stat + Expand Indicator */}
        <div className="mt-5 flex items-center justify-between gap-2 border-t border-cream/10 pt-3">
          <p className="font-mono text-[10px] tracking-[0.16em] text-emerald">{event.stat}</p>
          <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-[0.16em] text-cream/50 transition-colors group-hover:text-flame">
            {isExpanded ? "DETAILS" : "EXPAND"}
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-300 ${
                isExpanded ? "rotate-180 text-flame" : ""
              }`}
            />
          </span>
        </div>
      </div>
    </motion.article>
  );
}