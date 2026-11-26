import { Lock } from "lucide-react";
import { RECRUITMENT_ROADMAP } from "@/lib/usc-data";

interface RecruitmentSectionProps {
  onOpenApply?: () => void;
}

export function RecruitmentSection(_props: RecruitmentSectionProps) {
  return (
    <section id="recruitment" className="relative bg-obsidian px-4 py-16 sm:px-10 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-hud text-xs text-flame">JOIN THE SQUAD</p>
            <h2 className="font-display-usc mt-2 text-4xl text-cream sm:text-6xl">
              RECRUITMENT ROADMAP
            </h2>
          </div>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-cream/15 bg-carbon/80 px-6 py-3 font-mono text-xs font-semibold tracking-[0.16em] text-cream/55 sm:w-fit"
          >
            <Lock className="h-3.5 w-3.5 text-flame/75" />
            APPLICATION CLOSED
          </button>
        </div>

        <div className="relative mt-8 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-5 md:grid-cols-4">
          {/* Horizontal connector line on desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-10 right-10 top-9 hidden h-px bg-gradient-to-r from-flame/60 via-cobalt/50 to-emerald/60 md:block"
          />

          {RECRUITMENT_ROADMAP.map((item) => (
            <div
              key={item.step}
              className="glass-dark hud-brackets relative rounded-2xl p-5 sm:p-6"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-flame/50 bg-obsidian font-mono text-xs font-semibold text-flame">
                {item.step}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-cream">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/65">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}