import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── All 33 gallery images ───────────────────────────────────────────────────
const GALLERY_IMAGES = [
  "/USC KIIT Gallery/Auto_Gla_6.06db7352c7cdb323bbac.jpg",
  "/USC KIIT Gallery/DSC_0254.JPG",
  "/USC KIIT Gallery/DSC_0261.JPG",
  "/USC KIIT Gallery/DSC_0264.JPG",
  "/USC KIIT Gallery/DSC_0267.JPG",
  "/USC KIIT Gallery/DSC_0284.JPG",
  "/USC KIIT Gallery/DSC_0415.JPG",
  "/USC KIIT Gallery/jnuvbbaqhtdu1nwqcmp0.jpg",
  "/USC KIIT Gallery/kcg1ujavlfb3xbpu5xfw.jpg",
  "/USC KIIT Gallery/photo_shoot_1.d4a9e1a128e99c22b007.jpg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 12.47.40 (1).jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 12.47.40 (2).jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 12.47.40.jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 12.47.41 (1).jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 12.47.41 (2).jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 12.47.41.jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 12.47.42 (1).jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 12.47.42.jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 20.32.26 (1).jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 20.32.26 (2).jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 20.32.26.jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 20.32.27 (1).jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 20.32.27 (2).jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 20.32.27.jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 20.32.28 (1).jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 20.32.28 (2).jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 20.32.28.jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 20.32.29 (1).jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 20.32.29 (2).jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 20.32.29.jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 20.32.30 (1).jpeg",
  "/USC KIIT Gallery/WhatsApp Image 2026-11-26 at 20.32.30.jpeg",
];

// Skip the hackabot pass image (it's not a gallery photo)
const INTRO_IMAGES = GALLERY_IMAGES.filter((src) => !src.includes("hackabot-3-pass"));

// ─── Timing constants ─────────────────────────────────────────────────────────
const TOTAL_DURATION_MS = 7200; // 7.2s total intro
const MS_PER_FRAME = TOTAL_DURATION_MS / INTRO_IMAGES.length; // ≈ 225ms/image

// ─── Layout patterns for the Avengers multi-panel effect ─────────────────────
const LAYOUTS: readonly string[] = [
  "grid-cols-1",
  "grid-cols-2",
  "grid-cols-3",
  "grid-cols-2",
  "grid-cols-1",
];

type Cell = {
  src: string;
  objectPosition: string;
  flashColor: string;
};

function pickFlashColor(idx: number): string {
  const colors = [
    "rgba(250, 70, 22, 0.25)",  // flame
    "rgba(0, 103, 223, 0.22)",  // cobalt
    "rgba(61, 153, 96, 0.22)",  // emerald
    "rgba(250, 70, 22, 0.18)",  // flame dim
  ];
  return colors[idx % colors.length]!;
}

// Build a panel group: pick 1-3 consecutive images, style them, return
function buildPanelGroup(images: string[], startIdx: number): Cell[] {
  const count = startIdx % 4 === 0 ? 1 : startIdx % 3 === 0 ? 3 : 2;
  const cells: Cell[] = [];
  for (let i = 0; i < count; i++) {
    const imgIdx = (startIdx + i) % images.length;
    cells.push({
      src: images[imgIdx]!,
      objectPosition: i === 1 ? "top" : i === 2 ? "bottom" : "center",
      flashColor: pickFlashColor(startIdx + i),
    });
  }
  return cells;
}

interface AvengerIntroProps {
  onComplete: () => void;
}

export function AvengerIntro({ onComplete }: AvengerIntroProps) {
  const [frameIdx, setFrameIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [panelCells, setPanelCells] = useState<Cell[]>(() =>
    buildPanelGroup(INTRO_IMAGES, 0),
  );
  const [flashActive, setFlashActive] = useState(false);
  const [exiting, setExiting] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const frameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameIdxRef = useRef(0);

  const triggerExit = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    if (frameTimerRef.current) clearTimeout(frameTimerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTimeout(onComplete, 820);
  }, [exiting, onComplete]);

  // RAF-based progress bar
  useEffect(() => {
    const tick = (ts: number) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const pct = Math.min(elapsed / TOTAL_DURATION_MS, 1);
      setProgress(pct);
      if (pct < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        triggerExit();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [triggerExit]);

  // Frame flipper
  useEffect(() => {
    const scheduleNext = (idx: number) => {
      frameTimerRef.current = setTimeout(() => {
        const next = idx + 1;
        frameIdxRef.current = next;
        setFrameIdx(next);
        setPanelCells(buildPanelGroup(INTRO_IMAGES, next));
        setFlashActive(true);
        setTimeout(() => setFlashActive(false), 90);
        if (next < INTRO_IMAGES.length - 1) {
          scheduleNext(next);
        }
      }, MS_PER_FRAME);
    };
    scheduleNext(0);
    return () => {
      if (frameTimerRef.current) clearTimeout(frameTimerRef.current);
    };
  }, []);

  const colClass =
    panelCells.length === 1
      ? "grid-cols-1"
      : panelCells.length === 3
        ? "grid-cols-3"
        : "grid-cols-2";

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="avenger-intro"
          className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-obsidian"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.72, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ── Dark vignette + grain overlay ── */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 film-grain-overlay"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 30%, rgba(9,10,15,0.65) 100%)",
            }}
          />

          {/* ── Flash overlay on frame change ── */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-75"
            style={{ opacity: flashActive ? 1 : 0, background: "#090A0F" }}
          />

          {/* ── Multi-panel photo grid ── */}
          <div className={`grid flex-1 gap-0.5 ${colClass}`} style={{ minHeight: 0 }}>
            {panelCells.map((cell, i) => (
              <div key={`${frameIdx}-${i}`} className="relative overflow-hidden">
                <motion.img
                  key={`img-${frameIdx}-${i}`}
                  src={cell.src}
                  alt=""
                  aria-hidden
                  className="h-full w-full object-cover"
                  style={{ objectPosition: cell.objectPosition }}
                  initial={{ scale: 1.08, filter: "brightness(0.4) saturate(0.5)" }}
                  animate={{ scale: 1.0, filter: "brightness(0.72) saturate(1.1)" }}
                  transition={{ duration: 0.21, ease: "easeOut" }}
                />
                {/* Per-cell colored tint */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: cell.flashColor }}
                />
                {/* Low-opacity obsidian mirror (the "black mirror" the user asked for) */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "rgba(9,10,15,0.38)" }}
                />
              </div>
            ))}
          </div>

          {/* ── Center wordmark overlay ── */}
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
            <motion.div
              key={`wordmark-${frameIdx}`}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <span className="font-mono text-[10px] tracking-[0.4em] text-flame/80">
                USC KIIT • UIPATH STUDENT COMMUNITY
              </span>
              <h1
                className="select-none font-display-usc text-[clamp(2.8rem,8vw,7rem)] leading-none tracking-tighter text-cream"
                style={{
                  textShadow:
                    "0 0 60px rgba(250,70,22,0.45), 0 2px 20px rgba(0,0,0,0.9)",
                }}
              >
                KIIT UNIVERSITY
              </h1>
              <span className="font-mono text-[10px] tracking-[0.35em] text-cream/50">
                BHUBANESWAR • EST. 2023
              </span>
            </motion.div>
          </div>

          {/* ── Flame horizontal scan line ── */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 z-30 h-[2px]"
            style={{
              background:
                "linear-gradient(to right, transparent, #FA4616 20%, #FF6B00 50%, #FA4616 80%, transparent)",
              boxShadow: "0 0 24px 4px rgba(250,70,22,0.7)",
            }}
            animate={{ top: ["8%", "92%"] }}
            transition={{
              duration: TOTAL_DURATION_MS / 1000,
              ease: "linear",
              repeat: 0,
            }}
          />

          {/* ── Bottom HUD: progress bar + skip ── */}
          <div className="relative z-40 flex flex-col items-center gap-3 px-6 pb-7 pt-4">
            {/* Timeline / progress bar */}
            <div className="w-full max-w-sm">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.25em] text-cream/55">
                  USC KIIT — HIGHLIGHTS
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-flame/80">
                  {Math.round(progress * 100)}%
                </span>
              </div>
              <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-cream/10">
                {/* Tick marks every 10% */}
                {Array.from({ length: 9 }, (_, i) => (
                  <div
                    key={i}
                    aria-hidden
                    className="absolute top-0 h-full w-px bg-cream/20"
                    style={{ left: `${(i + 1) * 10}%` }}
                  />
                ))}
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    background:
                      "linear-gradient(to right, #FA4616, #FF6B00, #FA4616)",
                    boxShadow: "0 0 10px rgba(250,70,22,0.9)",
                  }}
                />
              </div>
            </div>

            {/* Skip button */}
            <button
              type="button"
              onClick={triggerExit}
              className="group glass-dark inline-flex cursor-pointer items-center gap-2 rounded-full border border-cream/15 px-5 py-2 font-mono text-[11px] tracking-[0.2em] text-cream/70 backdrop-blur-md transition-all duration-200 hover:border-flame/60 hover:text-cream"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-flame/60 transition-colors group-hover:bg-flame"
              />
              SKIP INTRO
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="text-cream/50 group-hover:text-flame"
              >
                <path
                  d="M2 2l4 4-4 4M7 2l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
