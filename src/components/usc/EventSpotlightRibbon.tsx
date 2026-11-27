import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { useHackabotCountdown } from "@/lib/use-hackabot-countdown";

export function EventSpotlightRibbon() {
  const { phaseState, countdown } = useHackabotCountdown();

  return (
    <section
      aria-label="HACK-A-BOT 3.0 Spotlight"
      className="relative z-20 bg-obsidian px-4 pb-6 pt-3 sm:px-10 sm:pb-8 sm:pt-4"
    >
      <div className="glass-dark hud-brackets mx-auto flex max-w-6xl flex-col gap-5 rounded-2xl p-4 shadow-2xl sm:gap-6 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        {/* Left: Event Info */}
        <div className="space-y-2">
          <h2 className="font-display-usc text-2xl text-cream sm:text-4xl">
            HACK-A-BOT 3.0{" "}
            <span className="block font-sans text-sm font-normal tracking-normal text-cream/70 sm:inline sm:text-base">
              — &ldquo;Innovate. Automate. Create Impact.&rdquo;
            </span>
          </h2>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-cream/65">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-flame" />
              12–13 Dec
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-cobalt" />
              Campus 6 Auditorium &amp; Campus 10 Central Library
            </span>
          </p>
        </div>

        {/* Center: Live Compact Countdown */}
        <div className="flex flex-col items-start lg:items-center">
          <span className="font-hud text-[9px] text-cream/55">
            {phaseState ? phaseState.label : "SYNCING COUNTDOWN"}
          </span>
          <div className="mt-1.5 flex items-center gap-1 font-mono sm:gap-1.5">
            {[
              { val: countdown.days, unit: "DD" },
              { val: countdown.hours, unit: "HH" },
              { val: countdown.minutes, unit: "MM" },
              { val: countdown.seconds, unit: "SS" },
            ].map((item, idx) => (
              <div key={item.unit} className="flex items-center gap-1 sm:gap-1.5">
                <div className="flex flex-col items-center rounded-lg border border-cream/10 bg-obsidian/90 px-2 py-1 sm:px-2.5 sm:py-1.5">
                  <span className="text-sm font-bold leading-none text-cream sm:text-lg">
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
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Link
            to="/events/hackabot"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-cream/15 bg-obsidian/80 px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] text-cream/85 transition-colors hover:border-flame/60 hover:text-flame sm:flex-initial sm:tracking-[0.16em]"
          >
            FULL DETAILS
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/events/hackabot"
            hash="register"
            className="gradient-flame shadow-flame-glow inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-5 py-2.5 font-mono text-[11px] font-semibold tracking-[0.14em] text-cream transition-transform hover:scale-[1.03] sm:flex-initial sm:tracking-[0.16em]"
          >
            REGISTER TEAM
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}