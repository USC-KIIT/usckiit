import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RotateCcw, Sparkles, Terminal } from "lucide-react";
import {
  computeDiagnosticResult,
  DIAGNOSTIC_QUESTIONS,
  type DiagnosticResult,
} from "@/lib/diagnostic";
import type { DomainId } from "@/lib/usc-data";

interface SystemDiagnosticProps {
  onApplyDomain: (domainId: DomainId) => void;
}

export function SystemDiagnostic({ onApplyDomain }: SystemDiagnosticProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<("A" | "B" | "C" | "D")[]>([]);
  const [phase, setPhase] = useState<"quiz" | "compiling" | "result">("quiz");
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const currentQuestion = DIAGNOSTIC_QUESTIONS[stepIndex];
  const total = DIAGNOSTIC_QUESTIONS.length;

  const liveBadges = answers
    .map((key, idx) => DIAGNOSTIC_QUESTIONS[idx]?.options.find((o) => o.key === key)?.stackBadge)
    .filter((b): b is string => Boolean(b));

  useEffect(() => {
    if (phase !== "compiling") return;
    const timer = window.setTimeout(() => {
      setResult(computeDiagnosticResult(answers));
      setPhase("result");
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [phase, answers]);

  const handleSelect = (key: "A" | "B" | "C" | "D") => {
    const nextAnswers = [...answers, key];
    setAnswers(nextAnswers);
    if (stepIndex + 1 < total) {
      setStepIndex((prev) => prev + 1);
    } else {
      setPhase("compiling");
    }
  };

  const handleRetake = () => {
    setAnswers([]);
    setStepIndex(0);
    setResult(null);
    setPhase("quiz");
  };

  const progressPct = phase === "quiz" ? (answers.length / total) * 100 : 100;
  const watermarkNumber = String(Math.min(stepIndex + 1, total)).padStart(2, "0");

  return (
    <section
      id="diagnostic"
      className="relative overflow-hidden bg-obsidian px-4 py-16 sm:px-10 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 sm:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-hud text-xs text-flame">FIND YOUR IDEAL USC KIIT DOMAIN</p>
            <h2 className="font-display-usc mt-2 text-4xl text-cream sm:text-6xl">
              SYSTEM DIAGNOSTIC
            </h2>
          </div>
          <p className="max-w-sm text-sm text-cream/65">
            Six rapid scenario calibrations to match your instincts with the USC KIIT squad where
            you&apos;ll ship fastest.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-12">
          {/* Left Sidebar Panel (30% -> 4 cols) */}
          <aside className="glass-dark hud-brackets flex flex-col justify-between rounded-2xl p-4 sm:p-6 lg:col-span-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-hud text-xs font-semibold text-flame">YOUR STACK</span>
                <span className="font-mono text-[11px] text-cream/55">
                  {answers.length}/{total} LOCKED
                </span>
              </div>

              <div className="mt-4 flex min-h-[64px] flex-wrap content-start gap-2 sm:mt-5 sm:min-h-[140px]">
                {liveBadges.length === 0 ? (
                  <p className="font-mono text-xs leading-relaxed text-cream/40">
                    Awaiting telemetry input. Select your first response to populate live stack
                    signals…
                  </p>
                ) : (
                  liveBadges.map((badge, idx) => (
                    <motion.span
                      key={`${badge}-${idx}`}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-full border border-flame/40 bg-flame/10 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-cream"
                    >
                      {badge}
                    </motion.span>
                  ))
                )}
              </div>
            </div>

            {/* Vertical Progress + Node Status */}
            <div className="mt-5 border-t border-cream/10 pt-4 sm:mt-8 sm:pt-5">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-cream/55">
                <span>CALIBRATION PROGRESS</span>
                <span>{Math.round(progressPct)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
                <motion.div
                  className="gradient-flame h-full rounded-full"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.35 }}
                />
              </div>
              <div className="mt-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-emerald sm:mt-4">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald" />
                KIIT_NODE: ONLINE
              </div>
            </div>
          </aside>

          {/* Right Interactive Panel (70% -> 8 cols) */}
          <div className="glass-dark relative overflow-hidden rounded-2xl p-4 sm:p-8 lg:col-span-8">
            {/* Giant Faded Watermark Number */}
            {phase === "quiz" && (
              <span
                aria-hidden
                className="font-display-usc pointer-events-none absolute -right-2 -top-4 select-none text-[6.5rem] leading-none text-cream/[0.04] sm:-right-3 sm:-top-6 sm:text-[13rem]"
              >
                {watermarkNumber}
              </span>
            )}

            <AnimatePresence mode="wait">
              {phase === "quiz" && currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.25 }}
                  className="relative z-10"
                >
                  <p className="font-hud text-xs text-cobalt">
                    CALIBRATION {watermarkNumber} / 0{total}
                  </p>
                  <h3 className="mt-2.5 max-w-2xl text-xl font-semibold leading-snug text-cream sm:mt-3 sm:text-3xl">
                    {currentQuestion.prompt}
                  </h3>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => handleSelect(option.key)}
                        className="hud-brackets group flex cursor-pointer flex-col justify-between rounded-xl border border-cream/10 bg-carbon/85 p-4 text-left transition-all duration-200 hover:border-flame/70 hover:bg-carbon sm:p-5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-cream/15 bg-obsidian font-mono text-xs font-semibold text-flame transition-colors group-hover:border-flame group-hover:bg-flame group-hover:text-cream">
                            {option.key}
                          </span>
                          <span className="font-mono text-[10px] tracking-[0.15em] text-cream/45 group-hover:text-flame">
                            {option.stackBadge}
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-cream sm:mt-4 sm:text-base">
                          {option.label}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-cream/65">
                          {option.detail}
                        </p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {phase === "compiling" && (
                <motion.div
                  key="compiling"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[280px] flex-col items-center justify-center text-center sm:min-h-[340px]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-flame/40 bg-flame/15 text-flame">
                    <Terminal className="h-6 w-6 animate-pulse" />
                  </div>
                  <p className="font-hud mt-5 text-sm text-flame">COMPILING AGENT PROFILE...</p>
                  <div className="mt-4 space-y-1.5 font-mono text-xs text-cream/60">
                    <p>&gt; Evaluating 6 telemetry vectors across 12 USC KIIT domains</p>
                    <p>&gt; Synthesizing primary &amp; secondary squad compatibility</p>
                    <p className="text-emerald">&gt; Generating codename assignment...</p>
                  </div>
                </motion.div>
              )}

              {phase === "result" && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative z-10"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-hud inline-flex items-center gap-2 text-xs text-emerald">
                      <Sparkles className="h-3.5 w-3.5" />
                      AGENT PROFILE COMPILED
                    </span>
                    <span className="rounded-full border border-cobalt/40 bg-cobalt/15 px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-cream">
                      CODENAME: {result.codename.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    <div className="hud-brackets rounded-xl border border-flame/50 bg-carbon p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-hud text-[10px] text-flame">PRIMARY DOMAIN MATCH</p>
                        <span
                          className={`rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.14em] ${
                            result.primary.wing === "tech"
                              ? "border-flame/40 bg-flame/15 text-flame"
                              : "border-cobalt/40 bg-cobalt/15 text-cobalt"
                          }`}
                        >
                          {result.primary.wing === "tech" ? "TECH WING" : "NON-TECH WING"}
                        </span>
                      </div>
                      <h3 className="font-display-usc mt-2 text-3xl text-cream sm:text-4xl">
                        {result.primary.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-cream/70">
                        {result.primary.tagline}
                      </p>
                      <p className="mt-4 font-mono text-2xl font-bold text-flame">
                        {result.primaryMatch}%{" "}
                        <span className="text-xs font-normal text-cream/50">COMPATIBILITY</span>
                      </p>
                    </div>

                    <div className="rounded-xl border border-cream/10 bg-obsidian/70 p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-hud text-[10px] text-cobalt">SECONDARY MATCH</p>
                        <span
                          className={`rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.14em] ${
                            result.secondary.wing === "tech"
                              ? "border-flame/35 bg-flame/10 text-flame"
                              : "border-cobalt/35 bg-cobalt/10 text-cobalt"
                          }`}
                        >
                          {result.secondary.wing === "tech" ? "TECH WING" : "NON-TECH WING"}
                        </span>
                      </div>
                      <h4 className="font-display-usc mt-2 text-2xl text-cream/90 sm:text-3xl">
                        {result.secondary.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-cream/65">
                        {result.secondary.tagline}
                      </p>
                      <p className="mt-4 font-mono text-xl font-semibold text-cobalt">
                        {result.secondaryMatch}%{" "}
                        <span className="text-xs font-normal text-cream/45">SYNERGY</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onApplyDomain(result.primary.id)}
                      className="gradient-flame shadow-flame-glow inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 font-mono text-xs font-semibold tracking-[0.16em] text-cream transition-transform hover:scale-[1.03] sm:w-auto"
                    >
                      APPLY FOR THIS DOMAIN
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-cream/15 bg-carbon px-5 py-3 font-mono text-xs tracking-[0.16em] text-cream/80 transition-colors hover:border-flame/50 hover:text-cream sm:w-auto"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      RETAKE DIAGNOSTIC
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
