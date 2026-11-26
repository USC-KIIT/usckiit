import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── 32 optimized WebP gallery frames (~2.79 MB total vs 38 MB raw) ─────────
const INTRO_IMAGES = Array.from(
  { length: 32 },
  (_, i) => `/USC KIIT Gallery/intro/${String(i + 1).padStart(2, "0")}.webp`,
);

// ─── Timing constants ─────────────────────────────────────────────────────────
const TOTAL_DURATION_MS = 7200; // 7.2s total intro
const MS_PER_FRAME = TOTAL_DURATION_MS / INTRO_IMAGES.length; // ≈ 225ms/image

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    const done = () => resolve();
    img.onload = () => {
      if (typeof img.decode === "function") {
        img.decode().then(done).catch(done);
      } else {
        done();
      }
    };
    img.onerror = done;
  });
}

type Cell = {
  src: string;
  objectPosition: string;
  flashColor: string;
};

function pickFlashColor(idx: number): string {
  const colors = [
    "rgba(250, 70, 22, 0.25)", // flame
    "rgba(0, 103, 223, 0.22)", // cobalt
    "rgba(61, 153, 96, 0.22)", // emerald
    "rgba(250, 70, 22, 0.18)", // flame dim
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
  const [ready, setReady] = useState(false);
  const [frameIdx, setFrameIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [panelCells, setPanelCells] = useState<Cell[]>(() => buildPanelGroup(INTRO_IMAGES, 0));
  const [exiting, setExiting] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const frameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameIdxRef = useRef(0);

  // Preload & decode first 6 frames before starting playback, and warm the rest in background
  useEffect(() => {
    let cancelled = false;
    const head = INTRO_IMAGES.slice(0, 6);
    const tail = INTRO_IMAGES.slice(6);

    Promise.race([
      Promise.all(head.map(preloadImage)),
      new Promise<void>((resolve) => setTimeout(resolve, 650)),
    ]).then(() => {
      if (!cancelled) setReady(true);
    });

    tail.forEach((src) => {
      void preloadImage(src);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const triggerExit = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    if (frameTimerRef.current) clearTimeout(frameTimerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTimeout(onComplete, 820);
  }, [exiting, onComplete]);

  // RAF-based progress bar
  useEffect(() => {
    if (!ready) return;
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
  }, [ready, triggerExit]);

  // Frame flipper
  useEffect(() => {
    if (!ready) return;
    const scheduleNext = (idx: number) => {
      frameTimerRef.current = setTimeout(() => {
        const next = idx + 1;
        frameIdxRef.current = next;
        setFrameIdx(next);
        setPanelCells(buildPanelGroup(INTRO_IMAGES, next));
        if (next < INTRO_IMAGES.length - 1) {
          scheduleNext(next);
        }
      }, MS_PER_FRAME);
    };
    scheduleNext(0);
    return () => {
      if (frameTimerRef.current) clearTimeout(frameTimerRef.current);
    };
  }, [ready]);

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

          {/* ── Smooth crossfading full-screen photos (zero black flash) ── */}
          <div className="absolute inset-0">
            <AnimatePresence initial={false} mode="sync">
              {panelCells.slice(0, 1).map((cell) => (
                <motion.div
                  key={`frame-${frameIdx}`}
                  className="absolute inset-0 overflow-hidden"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.24, ease: "easeInOut" }}
                >
                  <img
                    src={cell.src}
                    alt=""
                    aria-hidden
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: "center",
                      filter: "brightness(0.76) saturate(1.1)",
                    }}
                  />
                  {/* Per-cell colored tint */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: cell.flashColor }}
                  />
                  {/* Low-opacity obsidian mirror */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: "rgba(9,10,15,0.34)" }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
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

          {/* ── Bottom HUD: wordmark + progress bar + skip — overlaid on image ── */}
          <div
            className="absolute inset-x-0 bottom-0 z-40 flex flex-col items-center gap-2 px-6 pb-7 pt-10"
            style={{
              background:
                "linear-gradient(to top, rgba(9,10,15,0.85) 0%, rgba(9,10,15,0.5) 60%, transparent 100%)",
            }}
          >
            {/* Compact static wordmark — no heartbeat */}
            <div className="mb-1 flex flex-col items-center gap-0.5 text-center">
              <span className="font-mono text-[9px] tracking-[0.35em] text-flame/70">
                USC KIIT • UIPATH STUDENT COMMUNITY
              </span>
              <span
                className="select-none font-display-usc text-[clamp(1.1rem,3vw,1.6rem)] leading-none tracking-tighter text-cream"
                style={{ textShadow: "0 0 30px rgba(250,70,22,0.5), 0 2px 10px rgba(0,0,0,0.9)" }}
              >
                KIIT UNIVERSITY
              </span>
              <span className="font-mono text-[8px] tracking-[0.3em] text-cream/40">
                BHUBANESWAR • EST. 2023
              </span>
            </div>

            {/* Timeline / progress bar */}
            <div className="w-full max-w-sm">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.25em] text-cream/55">
                  LOADING
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
                    background: "linear-gradient(to right, #FA4616, #FF6B00, #FA4616)",
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
