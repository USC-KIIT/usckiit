import { lazy, Suspense, useEffect, useRef } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight, Cpu, Globe2, Mouse, Sparkles } from "lucide-react";
import { useHackabotCountdown } from "@/lib/use-hackabot-countdown";

const HeroStage3D = lazy(() => import("@/components/usc/HeroStage3D"));

interface HackabotScrollHeroProps {
  onRegisterClick: () => void;
  onExploreTracksClick: () => void;
}

export function HackabotScrollHero({
  onRegisterClick,
  onExploreTracksClick,
}: HackabotScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const { phaseState, countdown } = useHackabotCountdown();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 22,
    mass: 0.5,
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      scrollProgressRef.current = latest;
    });
    return unsubscribe;
  }, [smoothProgress]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  // Act 1 (0% - 45%): Mission Initialization
  const act1Opacity = useTransform(smoothProgress, [0, 0.34, 0.45], [1, 1, 0]);
  const act1LeftX = useTransform(smoothProgress, [0, 0.45], [0, -64]);
  const act1RightX = useTransform(smoothProgress, [0, 0.45], [0, 64]);

  // Act 2 (45% - 85%): Dual-Track Orbit Reveal
  const act2Opacity = useTransform(smoothProgress, [0.4, 0.5, 0.78, 0.87], [0, 1, 1, 0]);
  const act2BgScale = useTransform(smoothProgress, [0.4, 0.65, 0.87], [0.88, 1.03, 1.12]);
  const act2CtaY = useTransform(smoothProgress, [0.42, 0.54, 0.84], [28, 0, -20]);

  // Act 3 (85% - 100%): Warp Transition
  const warpOpacity = useTransform(smoothProgress, [0.82, 0.94, 1], [0, 0.7, 1]);

  return (
    <section
      id="briefing"
      ref={containerRef}
      className="relative h-[360vh] w-full bg-obsidian"
      aria-label="HACK-A-BOT 3.0 3D Command Stage"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Volumetric Atmospheric Lighting + Subtle Grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56vh] w-[56vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.648_0.224_34/24%)_0%,oklch(0.548_0.215_256/16%)_44%,transparent_72%)] blur-2xl sm:h-[74vh] sm:w-[74vh]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.973_0.013_84/3%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.973_0.013_84/3%)_1px,transparent_1px)] bg-[size:72px_72px]"
        />

        {/* ACT 2 DEPTH-OCCLUDED GIANT TYPOGRAPHY (z-10, STRICTLY BEHIND 3D Canvas at z-20) */}
        <motion.div
          style={{ opacity: act2Opacity, scale: act2BgScale }}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 text-center"
        >
          <h2 className="font-display-usc select-none text-[13.5vw] leading-[0.86] text-cream/90 sm:text-[12vw] lg:text-[10.5vw]">
            INNOVATE
            <span className="block text-gradient-flame">• AUTOMATE</span>
          </h2>
        </motion.div>

        {/* TRANSPARENT WEBGL 3D CANVAS (z-20, robot floats IN FRONT of giant text) */}
        <div className="absolute inset-0 z-20">
          <ClientOnly
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-44 w-44 animate-pulse rounded-full bg-flame/20 blur-2xl" />
              </div>
            }
          >
            <Suspense fallback={null}>
              <HeroStage3D
                mode="hackabot"
                motionRefs={{
                  scrollProgress: scrollProgressRef,
                  pointer: pointerRef,
                }}
              />
            </Suspense>
          </ClientOnly>
        </div>

        {/* ACT 1: MISSION INITIALIZATION OVERLAYS (z-30) */}
        <motion.div
          style={{ opacity: act1Opacity }}
          className="pointer-events-none absolute inset-0 z-30 mx-auto flex max-w-7xl flex-col justify-between px-4 pb-5 pt-20 sm:px-10 sm:pb-7 sm:pt-24 lg:pt-26"
        >
          {/* Top Monospace Eyebrow */}
          <div className="flex justify-center">
            <p className="glass-dark rounded-full border border-cream/12 px-3.5 py-1 text-center font-mono text-[9px] tracking-[0.16em] text-flame sm:px-4 sm:text-[11px] sm:tracking-[0.2em]">
              USC KIIT • UNDER THE DEPARTMENT OF TRAINING AND PLACEMENT
            </p>
          </div>

          {/* Center Split: Left Display Title + Right Telemetry Block */}
          <div className="my-auto flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-8">
            <motion.div style={{ x: act1LeftX }} className="max-w-md">
              <span className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-emerald/45 bg-emerald/15 px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.16em] text-emerald sm:text-[11px]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
                FREE FOR ALL • OFFLINE
              </span>
              <h1 className="font-display-usc text-[3.25rem] leading-[0.88] text-cream sm:text-7xl lg:text-[6.25rem]">
                HACK-A-BOT
                <span className="text-gradient-flame block">3.0</span>
              </h1>
            </motion.div>

            <motion.div
              style={{ x: act1RightX }}
              className="glass-dark hud-brackets max-w-xs self-end rounded-2xl p-3.5 text-right sm:p-5 md:max-w-sm md:self-center"
            >
              <p className="font-hud text-[9px] text-cobalt sm:text-[10px]">MISSION BRIEFING</p>
              <p className="mt-1.5 text-sm font-semibold text-cream sm:text-lg">
                &ldquo;Innovate. Automate. Create Impact.&rdquo;
              </p>
              <p className="mt-2 font-mono text-[9px] leading-relaxed tracking-[0.12em] text-cream/70 sm:text-[11px]">
                DEC 12–13 • CAMPUS 6 AUDITORIUM &amp; CAMPUS 10 CENTRAL LIBRARY • MAX 5 / TEAM
              </p>
            </motion.div>
          </div>

          {/* Bottom Center: Live Countdown Clock + Scroll Cue */}
          <div className="flex flex-col items-center gap-2.5 sm:gap-3">
            <div className="glass-dark hud-brackets flex flex-col items-center rounded-2xl px-4 py-2.5 sm:px-6 sm:py-3">
              <span className="font-hud text-[9px] text-emerald sm:text-[10px]">
                {phaseState ? phaseState.label : "SYNCING COUNTDOWN"}
              </span>
              <div className="mt-1.5 flex items-center gap-1 font-mono sm:gap-2">
                {[
                  { val: countdown.days, unit: "DD" },
                  { val: countdown.hours, unit: "HH" },
                  { val: countdown.minutes, unit: "MM" },
                  { val: countdown.seconds, unit: "SS" },
                ].map((item, idx) => (
                  <div key={item.unit} className="flex items-center gap-1 sm:gap-2">
                    <div className="flex flex-col items-center rounded-lg border border-cream/10 bg-obsidian/90 px-2.5 py-1 sm:px-3 sm:py-1.5">
                      <span className="text-base font-bold leading-none text-cream sm:text-xl">
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

            <p className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.18em] text-cream/55 sm:text-[10px]">
              <Mouse className="h-3 w-3 animate-bounce text-flame" />
              SCROLL WITH 2 FINGERS TO INITIALIZE BRIEFING
            </p>
          </div>
        </motion.div>

        {/* ACT 2: DUAL-TRACK ORBIT REVEAL PILLS + DUAL CTAs (z-30, IN FRONT OF CANVAS) */}
        <motion.div
          style={{ opacity: act2Opacity }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-end pb-8 sm:pb-12 md:pb-14"
        >
          {/* Desktop Floating Side Pills */}
          <div className="glass-dark hud-brackets absolute left-6 top-[28%] hidden items-center gap-2.5 rounded-full border border-flame/45 px-4 py-2 shadow-flame-glow md:inline-flex lg:left-16">
            <Cpu className="h-3.5 w-3.5 text-flame" />
            <span className="font-hud text-[11px] text-cream">TRACK 01: RPA &amp; AI</span>
          </div>

          <div className="glass-dark hud-brackets absolute right-6 top-[28%] hidden items-center gap-2.5 rounded-full border border-cobalt/50 px-4 py-2 shadow-cobalt-glow md:inline-flex lg:right-16">
            <Sparkles className="h-3.5 w-3.5 text-cobalt" />
            <span className="font-hud text-[11px] text-cream">TRACK 02: INNOVATION</span>
          </div>

          <div className="glass-dark hud-brackets absolute bottom-[24%] left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-emerald/45 px-4 py-2 md:inline-flex">
            <Globe2 className="h-3.5 w-3.5 text-emerald" />
            <span className="font-hud text-[11px] text-emerald">MANDATE: 2+ UN SDGs</span>
          </div>

          {/* Mobile Pill Row */}
          <div className="mb-3 flex flex-wrap justify-center gap-1.5 px-4 md:hidden">
            <div className="glass-dark inline-flex items-center gap-1.5 rounded-full border border-flame/40 px-2.5 py-1">
              <Cpu className="h-3 w-3 text-flame" />
              <span className="font-hud text-[9px] text-cream">TRACK 01: RPA &amp; AI</span>
            </div>
            <div className="glass-dark inline-flex items-center gap-1.5 rounded-full border border-cobalt/40 px-2.5 py-1">
              <Sparkles className="h-3 w-3 text-cobalt" />
              <span className="font-hud text-[9px] text-cream">TRACK 02: INNOVATION</span>
            </div>
            <div className="glass-dark inline-flex items-center gap-1.5 rounded-full border border-emerald/40 px-2.5 py-1">
              <Globe2 className="h-3 w-3 text-emerald" />
              <span className="font-hud text-[9px] text-emerald">MANDATE: 2+ UN SDGs</span>
            </div>
          </div>

          {/* Dual CTAs */}
          <motion.div
            style={{ y: act2CtaY }}
            className="pointer-events-auto mx-auto flex flex-wrap items-center justify-center gap-2.5 px-4 sm:gap-4 sm:px-6"
          >
            <button
              type="button"
              onClick={onRegisterClick}
              className="gradient-flame shadow-flame-glow inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-transform hover:scale-[1.03] sm:px-7 sm:py-3.5 sm:text-xs sm:tracking-[0.16em]"
            >
              REGISTER YOUR TEAM
              <ArrowDownRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onExploreTracksClick}
              className="glass-dark inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:border-flame/60 hover:text-flame sm:px-7 sm:py-3.5 sm:text-xs sm:tracking-[0.16em]"
            >
              FAQ &amp; COORDINATORS
            </button>
          </motion.div>
        </motion.div>

        {/* ACT 3 TRANSITION WARP FLOOR */}
        <motion.div
          style={{ opacity: warpOpacity }}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-44 bg-gradient-to-t from-obsidian via-obsidian/85 to-transparent"
        />
      </div>
    </section>
  );
}
