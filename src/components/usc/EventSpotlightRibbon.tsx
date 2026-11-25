import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, Calendar, MapPin } from "lucide-react";
import { getHackabotPhase, splitCountdown } from "@/lib/hackabot-data";

interface EventSpotlightRibbonProps {
  onFullDetails: () => void;
  onRegisterTeam: () => void;
}

export function EventSpotlightRibbon({
  onFullDetails,
  onRegisterTeam,
}: EventSpotlightRibbonProps) {
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    setNowMs(Date.now());
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const phaseState = nowMs !== null ? getHackabotPhase(nowMs) : null;
  const parts =
    nowMs !== null && phaseState
      ? splitCountdown(phaseState.targetMs - nowMs)
      : { days: "--", hours: "--", minutes: "--", seconds: "--" };

  return (
    <section
      aria-label="HACK-A-BOT 3.0 Spotlight"
      className="relative z-20 bg-obsidian px-6 pb-8 pt-4 sm:px-10"
    >
      <div className="glass-dark hud-brackets mx-auto flex max-w-6xl flex-col gap-6 rounded-2xl p-6 shadow-2xl lg:flex-row lg:items-center lg:justify-between lg:px-8">
        {/* Left: Event Info */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald/40 bg-emerald/15 px-3 py-0.5 font-mono text-[10px] font-semibold tracking-[0.16em] text-emerald">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
              NEXT FLAGSHIP EVENT
            </span>
            <span className="rounded-full border border-flame/35 bg-flame/10 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] text-flame">
              FREE FOR ALL
            </span>
          </div>
          <h2 className="font-display-usc text-3xl text-cream sm:text-4xl">
            HACK-A-BOT 3.0{" "}
            <span className="font-sans text-base font-normal tracking-normal text-cream/70">
              — &ldquo;Innovate. Automate. Create Impact.&rdquo;
            </span>
          </h2>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-cream/65">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-flame" />
              12–13 Dec
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-cobalt" />
              Campus 6 Auditorium &amp; Campus 10 Central Library
            </span>
          </p>
        </div>

        {/* Center: Live Compact Countdown */}
        <div className="flex flex-col items-start lg:items-center">
          <span className="font-hud text-[9px] text-cream/55">
            {phaseState ? phaseState.label : "SYNCING COUNTDOWN"}
          </span>
          <div className="mt-1.5 flex items-center gap-1.5 font-mono">
            {[
              { val: parts.days, unit: "DD" },
              { val: parts.hours, unit: "HH" },
              { val: parts.minutes, unit: "MM" },
              { val: parts.seconds, unit: "SS" },
            ].map((item, idx) => (
              <div key={item.unit} className="flex items-center gap-1.5">
                <div className="flex flex-col items-center rounded-lg border border-cream/10 bg-obsidian/90 px-2.5 py-1.5">
                  <span className="text-base font-bold leading-none text-cream sm:text-lg">
                    {item.val}
                  </span>
                  <span className="mt-0.5 text-[8px] tracking-widest text-cream/45">
                    {item.unit}
                  </span>
                </div>
                {idx < 3 && <span className="text-sm font-bold text-flame">:</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onFullDetails}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-cream/15 bg-obsidian/80 px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] text-cream/85 transition-colors hover:border-flame/60 hover:text-flame"
          >
            FULL DETAILS
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onRegisterTeam}
            className="gradient-flame shadow-flame-glow inline-flex cursor-pointer items-center gap-1.5 rounded-full px-5 py-2.5 font-mono text-[11px] font-semibold tracking-[0.16em] text-cream transition-transform hover:scale-[1.03]"
          >
            REGISTER TEAM
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}