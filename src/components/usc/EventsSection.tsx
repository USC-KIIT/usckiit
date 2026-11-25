import { useEffect, useState, type MouseEvent } from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Globe2,
  MapPin,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  getHackabotPhase,
  HACKABOT_CONTACTS,
  HACKABOT_HIGHLIGHTS,
  HACKABOT_MIN_SDGS,
  HACKABOT_TRACKS,
  splitCountdown,
  UN_SDGS,
  type HackabotTrack,
  type HackabotTrackId,
} from "@/lib/hackabot-data";
import { FLAGSHIP_EVENTS } from "@/lib/usc-data";

interface EventsSectionProps {
  onRegisterHackabot: (options?: {
    track?: HackabotTrackId;
    sdgs?: readonly string[];
  }) => void;
}

function TrackSpotlightCard({
  track,
  onSelect,
}: {
  track: HackabotTrack;
  onSelect: (trackId: HackabotTrackId) => void;
}) {
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });
  const isFlame = track.accent === "flame";

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setSpot((prev) => ({ ...prev, active: false }))}
      className={`hud-brackets relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-carbon/90 p-7 transition-colors ${
        isFlame
          ? "border-flame/35 hover:border-flame"
          : "border-cobalt/35 hover:border-cobalt"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.active ? 1 : 0,
          background: isFlame
            ? `radial-gradient(380px circle at ${spot.x}% ${spot.y}%, oklch(0.648 0.224 34 / 20%), transparent 65%)`
            : `radial-gradient(380px circle at ${spot.x}% ${spot.y}%, oklch(0.548 0.215 256 / 22%), transparent 65%)`,
        }}
      />

      <div className="relative z-10">
        <span
          className={`font-hud inline-block rounded-full px-3 py-1 text-[10px] font-semibold ${
            isFlame
              ? "border border-flame/40 bg-flame/15 text-flame"
              : "border border-cobalt/40 bg-cobalt/15 text-cream"
          }`}
        >
          {track.code}
        </span>
        <h4 className="font-display-usc mt-4 text-4xl text-cream">{track.title}</h4>
        <p className="mt-3 text-sm leading-relaxed text-cream/75">{track.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {track.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-cream/12 bg-obsidian/80 px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-cream/75"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-7">
        <button
          type="button"
          onClick={() => onSelect(track.id)}
          className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-3 font-mono text-xs font-semibold tracking-[0.16em] text-cream transition-transform hover:scale-[1.02] ${
            isFlame
              ? "gradient-flame shadow-flame-glow"
              : "bg-cobalt shadow-cobalt-glow"
          }`}
        >
          {track.ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function EventsSection({ onRegisterHackabot }: EventsSectionProps) {
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [selectedSdgs, setSelectedSdgs] = useState<string[]>([]);

  useEffect(() => {
    setNowMs(Date.now());
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const phaseState = nowMs !== null ? getHackabotPhase(nowMs) : null;
  const countdown =
    nowMs !== null && phaseState
      ? splitCountdown(phaseState.targetMs - nowMs)
      : { days: "--", hours: "--", minutes: "--", seconds: "--" };

  const toggleSdg = (id: string) => {
    setSelectedSdgs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleCopyPhone = async (name: string, phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      toast.success("Copied phone number!", { description: `${name} · +91 ${phone}` });
    } catch {
      toast.info(`${name}: +91 ${phone}`);
    }
  };

  const sdgMandateMet = selectedSdgs.length >= HACKABOT_MIN_SDGS;

  return (
    <section id="events" className="relative bg-obsidian px-6 py-24 sm:px-10 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* TIER 1: HACK-A-BOT 3.0 COMMAND CENTER */}
        <div className="glass-dark hud-brackets relative overflow-hidden rounded-3xl p-6 sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-flame/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 bottom-24 h-72 w-72 rounded-full bg-cobalt/15 blur-3xl"
          />

          {/* Header Block */}
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-hud text-[11px] text-flame">
                ORGANIZED BY USC KIIT • UNDER THE DEPARTMENT OF TRAINING AND PLACEMENT
              </p>
              <h2 className="font-display-usc text-gradient-flame mt-2 text-6xl sm:text-7xl lg:text-8xl">
                HACK-A-BOT 3.0
              </h2>
              <p className="mt-2 text-lg font-semibold text-cream sm:text-xl">
                &ldquo;Innovate. Automate. Create Impact.&rdquo;
              </p>
              <p className="mt-3 text-sm leading-relaxed text-cream/75">
                A multi-track technology competition organized by USC KIIT under the Department of
                Training and Placement, featuring interactive workshops, hands-on challenges, and
                exciting guest engagements.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald/45 bg-emerald/15 px-4 py-1.5 font-mono text-[11px] font-semibold tracking-[0.16em] text-emerald">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald" />
                FREE FOR ALL
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-cobalt/45 bg-cobalt/15 px-4 py-1.5 font-mono text-[11px] font-semibold tracking-[0.16em] text-cream">
                OFFLINE EVENT
              </span>
            </div>
          </div>

          {/* Smart Live Countdown Bar */}
          <div className="relative z-10 mt-8 flex flex-col gap-5 rounded-2xl border border-cream/10 bg-obsidian/85 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="font-hud text-[10px] text-emerald">
                {phaseState ? phaseState.label : "SYNCING EVENT CLOCK"}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 font-mono">
                {[
                  { val: countdown.days, label: "DAYS" },
                  { val: countdown.hours, label: "HRS" },
                  { val: countdown.minutes, label: "MIN" },
                  { val: countdown.seconds, label: "SEC" },
                ].map((unit, idx) => (
                  <div key={unit.label} className="flex items-center gap-2">
                    <div className="min-w-[60px] rounded-xl border border-cream/10 bg-carbon px-3 py-2 text-center">
                      <span className="block text-2xl font-bold leading-none text-cream">
                        {unit.val}
                      </span>
                      <span className="mt-1 block text-[9px] tracking-[0.18em] text-cream/45">
                        {unit.label}
                      </span>
                    </div>
                    {idx < 3 && <span className="text-lg font-bold text-flame">:</span>}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRegisterHackabot()}
              className="gradient-flame shadow-flame-glow inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-3.5 font-mono text-xs font-semibold tracking-[0.16em] text-cream transition-transform hover:scale-[1.03]"
            >
              {phaseState?.ctaLabel ?? "REGISTER YOUR TEAM"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* 4-Card Key Logistics Bento Grid */}
          <div className="relative z-10 mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="hud-brackets rounded-2xl border border-cream/10 bg-carbon/85 p-5">
              <Calendar className="h-5 w-5 text-flame" />
              <p className="font-hud mt-3 text-[10px] text-cream/55">EVENT DATES</p>
              <p className="mt-1 text-lg font-semibold text-cream">12 – 13 December</p>
              <p className="mt-1 text-xs text-cream/65">2-Day Multi-Track Competition</p>
            </div>

            <div className="hud-brackets rounded-2xl border border-cream/10 bg-carbon/85 p-5">
              <Clock className="h-5 w-5 text-cobalt" />
              <p className="font-hud mt-3 text-[10px] text-cream/55">REGISTRATION WINDOW</p>
              <p className="mt-1 text-lg font-semibold text-cream">Opens 2 Dec • Closes 11 Dec</p>
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
                <div
                  className="gradient-flame h-full rounded-full"
                  style={{ width: `${phaseState?.regProgressPct ?? 12}%` }}
                />
              </div>
            </div>

            <div className="hud-brackets rounded-2xl border border-cream/10 bg-carbon/85 p-5">
              <MapPin className="h-5 w-5 text-emerald" />
              <p className="font-hud mt-3 text-[10px] text-cream/55">OFFLINE VENUES</p>
              <p className="mt-1 text-base font-semibold text-cream">
                Campus 6 Auditorium &amp; Campus 10 Central Library
              </p>
              <p className="mt-1 text-xs text-cream/65">KIIT University</p>
            </div>

            <div className="hud-brackets rounded-2xl border border-cream/10 bg-carbon/85 p-5">
              <Users className="h-5 w-5 text-flame" />
              <p className="font-hud mt-3 text-[10px] text-cream/55">PARTICIPATION &amp; FEE</p>
              <p className="mt-1 text-lg font-semibold text-cream">Team-Based (Max 5 Members)</p>
              <p className="mt-1 font-mono text-xs font-semibold text-emerald">
                100% Free for All
              </p>
            </div>
          </div>

          {/* Two Dedicated Tracks */}
          <div className="relative z-10 mt-10">
            <p className="font-hud text-xs text-flame">CHOOSE YOUR ARENA</p>
            <h3 className="font-display-usc mt-1.5 text-4xl text-cream">COMPETITION TRACKS</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              {HACKABOT_TRACKS.map((track) => (
                <TrackSpotlightCard
                  key={track.id}
                  track={track}
                  onSelect={(trackId) => onRegisterHackabot({ track: trackId, sdgs: selectedSdgs })}
                />
              ))}
            </div>
          </div>

          {/* Interactive 2+ SDG Alignment Mandate Widget */}
          <div className="relative z-10 mt-10 rounded-2xl border border-cream/10 bg-obsidian/85 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-hud inline-flex items-center gap-2 text-[11px] text-emerald">
                  <Globe2 className="h-3.5 w-3.5" />
                  MANDATORY SUSTAINABILITY ALIGNMENT
                </p>
                <h3 className="font-display-usc mt-1.5 text-3xl text-cream sm:text-4xl">
                  2+ UN SDG ALIGNMENT MANDATE
                </h3>
                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-cream/70 sm:text-sm">
                  Participants across both tracks must develop solutions aligned with at least two
                  Sustainable Development Goals (SDGs), encouraging technology-driven innovation
                  for a sustainable future.
                </p>
              </div>

              <div className="shrink-0">
                {sdgMandateMet ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald/50 bg-emerald/15 px-4 py-1.5 font-mono text-xs font-semibold text-emerald">
                    <CheckCircle2 className="h-4 w-4" />
                    2+ SDGs Selected — Mandate Met!
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-flame/40 bg-flame/10 px-4 py-1.5 font-mono text-xs text-flame">
                    {selectedSdgs.length === 0
                      ? "0/2 Selected"
                      : "1/2 — Pick 1 more"}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {UN_SDGS.map((sdg) => {
                const picked = selectedSdgs.includes(sdg.id);
                return (
                  <button
                    key={sdg.id}
                    type="button"
                    onClick={() => toggleSdg(sdg.id)}
                    aria-pressed={picked}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                      picked
                        ? "border-emerald bg-emerald/15 text-cream"
                        : "border-cream/10 bg-carbon/70 text-cream/75 hover:border-flame/50 hover:text-cream"
                    }`}
                  >
                    <div>
                      <span className="block font-mono text-[10px] tracking-[0.16em] text-flame">
                        {sdg.code}
                      </span>
                      <span className="text-sm font-medium">{sdg.title}</span>
                    </div>
                    <span
                      className={`h-4 w-4 rounded-full border ${
                        picked ? "border-emerald bg-emerald" : "border-cream/25"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => onRegisterHackabot({ sdgs: selectedSdgs })}
                className="gradient-flame shadow-flame-glow inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-2.5 font-mono text-xs font-semibold tracking-[0.16em] text-cream transition-transform hover:scale-[1.03]"
              >
                LOCK SDGs &amp; REGISTER TEAM
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* What to Expect (3 Compact Highlight Cards) */}
          <div className="relative z-10 mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {HACKABOT_HIGHLIGHTS.map((item, idx) => (
              <div
                key={item.title}
                className="rounded-2xl border border-cream/10 bg-carbon/80 p-5"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-flame">
                  <Sparkles className="h-3.5 w-3.5" />
                  EXPERIENCE 0{idx + 1}
                </span>
                <h4 className="mt-2.5 text-lg font-semibold text-cream">{item.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-cream/65">{item.detail}</p>
              </div>
            ))}
          </div>

          {/* Official Event Contact Cards (4-Column Grid) */}
          <div className="relative z-10 mt-10 border-t border-cream/10 pt-8">
            <p className="font-hud text-xs text-flame">OFFICIAL EVENT CONTACTS</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {HACKABOT_CONTACTS.map((contact) => (
                <div
                  key={contact.phone}
                  className="hud-brackets flex flex-col justify-between rounded-xl border border-cream/10 bg-obsidian/80 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-cream">{contact.name}</p>
                    <p className="mt-1 font-mono text-xs tracking-wider text-cream/70">
                      +91 {contact.phone}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href={contact.telHref}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald/40 bg-emerald/10 py-1.5 font-mono text-[10px] tracking-[0.14em] text-emerald transition-colors hover:bg-emerald hover:text-obsidian"
                    >
                      <Phone className="h-3 w-3" />
                      CALL
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyPhone(contact.name, contact.phone)}
                      aria-label={`Copy ${contact.name}'s phone number`}
                      className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-cream/15 bg-carbon px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-cream/80 transition-colors hover:border-flame hover:text-flame"
                    >
                      <Copy className="h-3 w-3" />
                      COPY
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TIER 2: PAST FLAGSHIP EVENTS */}
        <div className="mt-16">
          <p className="font-hud text-xs text-cream/55">ARCHIVE</p>
          <h3 className="font-display-usc mt-1.5 text-4xl text-cream sm:text-5xl">
            PAST FLAGSHIP EVENTS
          </h3>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {FLAGSHIP_EVENTS.map((event) => (
              <article
                key={event.id}
                className="glass-dark hud-brackets flex flex-col justify-between rounded-2xl p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-hud text-[10px] text-flame">{event.tag}</span>
                    <span className="rounded-full border border-cream/15 bg-obsidian px-2.5 py-0.5 font-mono text-[9px] tracking-[0.16em] text-cream/55">
                      COMPLETED
                    </span>
                  </div>
                  <h4 className="font-display-usc mt-4 text-3xl text-cream">{event.title}</h4>
                  <p className="mt-1 text-xs font-semibold text-cobalt">{event.subtitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-cream/65">{event.description}</p>
                </div>
                <p className="mt-5 border-t border-cream/10 pt-3 font-mono text-[10px] tracking-[0.16em] text-emerald">
                  {event.stat}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}