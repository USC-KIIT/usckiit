import { lazy, Suspense, useEffect, useRef } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight, Cpu, Flame, Layers, Sparkles } from "lucide-react";

const HeroStage3D = lazy(() => import("./HeroStage3D"));

interface ScrollHeroProps {
  onRegisterHackabot: () => void;
  onExploreInitiatives: () => void;
}

const TOTEM_PILLS = [
  { label: "RPA & AGENTIC AI", icon: Cpu, pos: "left-6 top-[28%] lg:left-16" },
  { label: "WORKSHOPS & BOOTCAMPS", icon: Sparkles, pos: "right-6 top-[28%] lg:right-16" },
  { label: "HACK-A-BOT 3.0", icon: Flame, pos: "left-8 bottom-[28%] lg:left-20" },
  { label: "8 CORE DOMAINS", icon: Layers, pos: "right-8 bottom-[28%] lg:right-20" },
] as const;

export function ScrollHero({ onRegisterHackabot, onExploreInitiatives }: ScrollHeroProps) {
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
  const act1RightX = useTransform(smoothProgress, [0, 0.34], [0, 70]);

  // Act 2 (35% - 70%): Giant depth-occluded background headline + Domain Totems + Dual CTAs
  const act2Opacity = useTransform(smoothProgress, [0.3, 0.42, 0.66, 0.76], [0, 1, 1, 0]);
  const act2BgScale = useTransform(smoothProgress, [0.3, 0.55, 0.76], [0.88, 1.02, 1.12]);
  const act2CtaY = useTransform(smoothProgress, [0.34, 0.46, 0.72], [32, 0, -24]);

  // Scroll ring stroke progress
  const ringDashOffset = useTransform(smoothProgress, [0, 1], [113.1, 0]);

  // Act 3 warp tint
  const warpOpacity = useTransform(smoothProgress, [0.7, 0.92, 1], [0, 0.65, 1]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-[450vh] w-full bg-obsidian"
      aria-label="USC KIIT 3D Hero Showcase"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Volumetric Radial Glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[72vh] w-[72vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.648_0.224_34/22%)_0%,oklch(0.548_0.215_256/14%)_42%,transparent_72%)] blur-2xl"
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
          <h2 className="font-display-usc select-none text-[14vw] leading-[0.86] text-cream/90 sm:text-[12vw] lg:text-[10.5vw]">
            INNOVATE
            <span className="block text-gradient-flame">• AUTOMATE</span>
          </h2>
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
          className="pointer-events-none absolute inset-0 z-30 mx-auto flex max-w-7xl flex-col justify-between px-6 pb-10 pt-32 sm:px-10 md:pt-36"
        >
          <div className="flex flex-1 flex-col justify-between gap-8 md:flex-row md:items-center">
            {/* Left Headline Block */}
            <motion.div style={{ x: act1LeftX }} className="max-w-lg">
              <p className="font-hud mb-3 inline-flex items-center gap-2 text-[11px] text-flame">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald" />
                USC KIIT PRESENTS
              </p>
              <h1 className="font-display-usc text-6xl text-cream sm:text-7xl lg:text-[5.75rem]">
                AUTOMATE
                <span className="block text-gradient-future">THE FUTURE</span>
              </h1>
              <p className="mt-4 max-w-sm text-sm text-cream/70 sm:text-base">
                Building the Future, One Domain at a Time — KIIT University&apos;s official UiPath
                Student Community.
              </p>
            </motion.div>

            {/* Right Architectural Telemetry */}
            <motion.div
              style={{ x: act1RightX }}
              className="hidden max-w-xs text-right md:block"
            >
              <p className="font-hud text-[11px] leading-relaxed text-cream/75">
                EIGHT DOMAINS.
                <br />
                ONE INTELLIGENT CORE.
                <br />
                <span className="text-flame">SCROLL TO INITIALIZE.</span>
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cream/10 bg-carbon/60 px-3 py-1 font-mono text-[10px] tracking-widest text-cream/65">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                BHUBANESWAR · KIIT_NODE
              </div>
            </motion.div>
          </div>

          {/* Bottom Center Scroll Ring Indicator */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex h-11 w-11 items-center justify-center">
              <svg className="h-11 w-11 -rotate-90" viewBox="0 0 40 40">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-cream/15"
                />
                <motion.circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="113.1"
                  style={{ strokeDashoffset: ringDashOffset }}
                  className="text-flame"
                />
              </svg>
              <span className="absolute h-1.5 w-1.5 animate-bounce rounded-full bg-flame" />
            </div>
            <span className="font-hud animate-pulse text-[10px] text-cream/65">
              SCROLL DOWN WITH 2 FINGERS TO EXPLORE
            </span>
          </div>
        </motion.div>

        {/* ACT 2 FLOATING DOMAIN TOTEM PILLS + DUAL CTAS (z-30) */}
        <motion.div
          style={{ opacity: act2Opacity }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-end pb-12 sm:pb-16"
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

          <motion.div
            style={{ y: act2CtaY }}
            className="pointer-events-auto mx-auto flex flex-wrap items-center justify-center gap-4 px-6"
          >
            <button
              type="button"
              onClick={onRegisterHackabot}
              className="gradient-flame shadow-flame-glow inline-flex cursor-pointer items-center gap-2 rounded-full px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-cream transition-transform hover:scale-[1.03]"
            >
              HACK-A-BOT 3.0 — REGISTER
              <ArrowDownRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onExploreInitiatives}
              className="glass-dark inline-flex cursor-pointer items-center gap-2 rounded-full px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-cream transition-colors hover:border-flame/60 hover:text-flame"
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