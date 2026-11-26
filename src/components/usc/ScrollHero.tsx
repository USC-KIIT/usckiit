import { lazy, Suspense, useEffect, useRef } from "react";
import { ClientOnly, Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight, Cpu, Flame, Layers, Sparkles } from "lucide-react";

const HeroStage3D = lazy(() => import("./HeroStage3D"));

interface ScrollHeroProps {
  onExploreInitiatives: () => void;
}

const TOTEM_PILLS = [
  { label: "RPA & AGENTIC AI", icon: Cpu, pos: "left-6 top-[28%] lg:left-16" },
  { label: "WORKSHOPS & BOOTCAMPS", icon: Sparkles, pos: "right-6 top-[28%] lg:right-16" },
  { label: "HACK-A-BOT 3.0", icon: Flame, pos: "left-8 bottom-[28%] lg:left-20" },
  { label: "8 CORE DOMAINS", icon: Layers, pos: "right-8 bottom-[28%] lg:right-20" },
] as const;

export function ScrollHero({ onExploreInitiatives }: ScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

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

  // Act 1 (0% - 35%): Hero Initialization overlays
  const act1Opacity = useTransform(smoothProgress, [0, 0.24, 0.34], [1, 1, 0]);
  const act1LeftX = useTransform(smoothProgress, [0, 0.34], [0, -70]);

  // Act 2 (35% - 70%): Giant depth-occluded background headline + Domain Totems + Dual CTAs
  const act2Opacity = useTransform(smoothProgress, [0.3, 0.42, 0.66, 0.76], [0, 1, 1, 0]);
  const act2BgScale = useTransform(smoothProgress, [0.3, 0.55, 0.76], [0.88, 1.02, 1.12]);
  const act2CtaY = useTransform(smoothProgress, [0.34, 0.46, 0.72], [32, 0, -24]);
  const act2TopX = useTransform(smoothProgress, [0.3, 0.48, 0.7], ["0vw", "-20vw", "-28vw"]);
  const act2BottomX = useTransform(smoothProgress, [0.3, 0.48, 0.7], ["0vw", "20vw", "28vw"]);

  // Act 3 warp tint
  const warpOpacity = useTransform(smoothProgress, [0.7, 0.92, 1], [0, 0.65, 1]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-[360vh] w-full bg-obsidian md:h-[450vh]"
      aria-label="USC KIIT 3D Hero Showcase"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Volumetric Radial Glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[58vh] w-[58vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.648_0.224_34/22%)_0%,oklch(0.548_0.215_256/14%)_42%,transparent_72%)] blur-2xl sm:h-[72vh] sm:w-[72vh]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.973_0.013_84/3%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.973_0.013_84/3%)_1px,transparent_1px)] bg-[size:72px_72px]"
        />

        {/* ACT 2 DEPTH-OCCLUDED GIANT TYPOGRAPHY (z-10, BEHIND the transparent 3D Canvas at z-20) */}
        <motion.div
          style={{ opacity: act2Opacity, scale: act2BgScale }}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 text-center"
        >
          <h2 className="font-display-usc select-none text-[13.5vw] leading-[0.86] text-cream/90 sm:text-[12vw] lg:text-[10.5vw]">
            <motion.span style={{ x: act2TopX }} className="block">
              INNOVATE
            </motion.span>
            <motion.span style={{ x: act2BottomX }} className="block text-gradient-flame">
              • AUTOMATE
            </motion.span>
          </h2>
        </motion.div>

        {/* ACT 1 RIGHT-SIDE DEPTH TEXT — behind robot at z-10 */}
        <motion.div
          style={{ opacity: act1Opacity }}
          className="pointer-events-none absolute inset-0 z-10 flex items-end justify-end pb-7 pr-4 sm:pb-10 sm:pr-10 md:items-center md:pb-0 md:pr-12 lg:pr-20"
        >
          <div className="flex select-none flex-col items-end gap-0 leading-none">
            {/* Thin eyebrow line */}
            <span className="mb-2 inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.24em] text-flame/80 sm:mb-3 sm:text-[11px] sm:tracking-[0.28em]">
              <span className="h-px w-5 bg-flame/50 sm:w-8" />
              USC KIIT CORE VALUES
            </span>

            {/* "CONNECT" — large, cream, slightly transparent */}
            <span className="font-display-usc text-right text-[13.5vw] leading-[0.82] text-cream/25 sm:text-[10.5vw] md:text-cream/15 lg:text-[9vw]">
              CONNECT
            </span>

            {/* Flame divider rule */}
            <span className="my-1.5 ml-auto block h-[2px] w-[55%] bg-gradient-to-l from-flame/60 via-flame/20 to-transparent sm:my-2" />

            {/* "LEARN &" — medium, gradient */}
            <span
              className="font-display-usc text-right text-[9.5vw] leading-[0.88] sm:text-[7.5vw] lg:text-[6.5vw]"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.85 0.03 84 / 0.65) 0%, oklch(0.648 0.224 34 / 0.55) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LEARN &amp;
            </span>

            {/* "COLLABORATE" — slightly smaller, emerald accent */}
            <span
              className="font-display-usc text-right text-[7.5vw] leading-[0.92] sm:text-[6vw] lg:text-[5.2vw]"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.76 0.17 162 / 0.65) 0%, oklch(0.85 0.03 84 / 0.45) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              COLLABORATE
            </span>

            {/* Subtle bottom dots */}
            <span className="mt-2.5 flex gap-1.5 sm:mt-4">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1 w-1 rounded-full"
                  style={{
                    background:
                      i === 0
                        ? "oklch(0.648 0.224 34 / 0.7)"
                        : i === 1
                          ? "oklch(0.76 0.17 162 / 0.5)"
                          : "oklch(0.85 0.03 84 / 0.3)",
                  }}
                />
              ))}
            </span>
          </div>
        </motion.div>

        {/* TRANSPARENT WEBGL 3D CANVAS (z-20, robot floats IN FRONT of Act 2 giant text) */}
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
                motionRefs={{
                  scrollProgress: scrollProgressRef,
                  pointer: pointerRef,
                }}
              />
            </Suspense>
          </ClientOnly>
        </div>

        {/* ACT 1 OVERLAYS (z-30) */}
        <motion.div
          style={{ opacity: act1Opacity }}
          className="pointer-events-none absolute inset-0 z-30 mx-auto flex max-w-7xl flex-col justify-start px-4 pb-8 pt-24 sm:px-10 sm:pt-28 md:justify-between md:pb-10 md:pt-32"
        >
          <div className="flex flex-col justify-start gap-4 md:flex-1 md:flex-row md:items-center md:justify-between md:gap-8">
            {/* Left Headline Block */}
            <motion.div style={{ x: act1LeftX }} className="max-w-lg">
              <h1 className="font-display-usc text-[2.75rem] leading-[0.9] text-cream sm:text-7xl lg:text-[5.75rem]">
                AUTOMATE
                <span className="block text-gradient-future">THE FUTURE</span>
              </h1>
              <p className="mt-2.5 max-w-[16.5rem] text-xs leading-relaxed text-cream/75 sm:mt-4 sm:max-w-sm sm:text-base">
                Building the Future, One Domain at a Time — KIIT University&apos;s official UiPath
                Student Community.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ACT 2 FLOATING DOMAIN TOTEM PILLS + DUAL CTAS (z-30) */}
        <motion.div
          style={{ opacity: act2Opacity }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-end pb-8 sm:pb-14 md:pb-16"
        >
          {TOTEM_PILLS.map((pill) => {
            const Icon = pill.icon;
            return (
              <div
                key={pill.label}
                className={`glass-dark hud-brackets absolute hidden items-center gap-2.5 rounded-full px-4 py-2 md:inline-flex ${pill.pos}`}
              >
                <Icon className="h-3.5 w-3.5 text-flame" />
                <span className="font-hud text-[11px] text-cream">{pill.label}</span>
              </div>
            );
          })}

          <div className="mb-3 flex flex-wrap justify-center gap-1.5 px-4 md:hidden">
            {TOTEM_PILLS.map((pill) => {
              const Icon = pill.icon;
              return (
                <div
                  key={pill.label}
                  className="glass-dark inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                >
                  <Icon className="h-3 w-3 text-flame" />
                  <span className="font-hud text-[9px] text-cream">{pill.label}</span>
                </div>
              );
            })}
          </div>

          <motion.div
            style={{ y: act2CtaY }}
            className="pointer-events-auto mx-auto flex flex-wrap items-center justify-center gap-2.5 px-4 sm:gap-4 sm:px-6"
          >
            <Link
              to="/events/hackabot"
              className="gradient-flame shadow-flame-glow inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-transform hover:scale-[1.03] sm:px-7 sm:py-3.5 sm:text-xs sm:tracking-[0.16em]"
            >
              HACK-A-BOT 3.0 — REGISTER
              <ArrowDownRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={onExploreInitiatives}
              className="glass-dark inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:border-flame/60 hover:text-flame sm:px-7 sm:py-3.5 sm:text-xs sm:tracking-[0.16em]"
            >
              EXPLORE OUR INITIATIVES
            </button>
          </motion.div>
        </motion.div>

        {/* ACT 3 TRANSITION WARP FLOOR */}
        <motion.div
          style={{ opacity: warpOpacity }}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-44 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent"
        />
      </div>
    </section>
  );
}