import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Cpu, Play, RotateCcw, Terminal } from "lucide-react";
import {
  BOT_PIPELINE_NODES,
  COMMUNITY_METRICS,
  type CommunityMetric,
} from "@/lib/usc-data";

function AnimatedMetricTile({ metric }: { metric: CommunityMetric }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frameId = 0;
    const start = performance.now();
    const duration = 1100;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * metric.value));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [inView, metric.value]);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-charcoal/12 bg-cream p-5 shadow-sm"
    >
      <p className="font-display-usc text-gradient-flame text-4xl sm:text-5xl">
        {display}
        {metric.suffix}
      </p>
      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-charcoal/75">
        {metric.label}
      </p>
    </div>
  );
}

export function AboutSection() {
  const [activeNode, setActiveNode] = useState<number>(-1);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => timersRef.current.forEach((id) => window.clearTimeout(id));
  }, []);

  const runSimulation = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    setRunning(true);
    setActiveNode(0);
    setLogs([BOT_PIPELINE_NODES[0]?.log ?? ""]);

    BOT_PIPELINE_NODES.slice(1).forEach((node, idx) => {
      const id = window.setTimeout(() => {
        setActiveNode(idx + 1);
        setLogs((prev) => [...prev, node.log]);
        if (idx + 1 === BOT_PIPELINE_NODES.length - 1) setRunning(false);
      }, (idx + 1) * 580);
      timersRef.current.push(id);
    });
  };

  const resetSimulation = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    setRunning(false);
    setActiveNode(-1);
    setLogs([]);
  };

  return (
    <section id="about" className="editorial-surface relative px-6 py-24 sm:px-10 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Community Story */}
          <div className="lg:col-span-5">
            <p className="font-hud text-xs font-semibold text-flame">WHO WE ARE</p>
            <h2 className="font-display-usc text-gradient-flame mt-2 text-5xl sm:text-6xl">
              ABOUT USC KIIT
            </h2>
            <p className="mt-6 text-base leading-relaxed text-charcoal/85">
              <strong>UiPath Student Community, KIIT University (Bhubaneswar)</strong> is an
              official student-led technical community operating under the{" "}
              <strong>Department of Training and Placement, KIIT</strong>.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
              We unite curious engineers, designers, writers, and organizers across eight
              specialized domains — empowering students to master Robotic Process Automation (RPA),
              Agentic AI, full-stack software engineering, and high-craft creative storytelling.
            </p>

            <blockquote className="mt-7 rounded-2xl border-l-4 border-flame bg-charcoal/[0.04] p-5">
              <p className="font-display-usc text-2xl tracking-wide text-charcoal sm:text-3xl">
                &ldquo;Building the Future, One Domain at a Time.&rdquo;
              </p>
              <footer className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald">
                DEPT. OF TRAINING &amp; PLACEMENT · KIIT UNIVERSITY
              </footer>
            </blockquote>
          </div>

          {/* Right Column: 2x2 Metrics Grid + Interactive Simulate a USC Bot Playground */}
          <div className="space-y-6 lg:col-span-7">
            <div className="grid grid-cols-2 gap-4">
              {COMMUNITY_METRICS.map((metric) => (
                <AnimatedMetricTile key={metric.label} metric={metric} />
              ))}
            </div>

            <div className="rounded-3xl bg-obsidian p-6 text-cream shadow-2xl sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-hud inline-flex items-center gap-2 text-[10px] text-flame">
                    <Cpu className="h-3.5 w-3.5" />
                    WORKFLOW MINI-PLAYGROUND
                  </p>
                  <h3 className="font-display-usc mt-1 text-3xl text-cream">
                    SIMULATE A USC BOT
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={runSimulation}
                    disabled={running}
                    className="gradient-flame shadow-flame-glow inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 font-mono text-[11px] font-semibold tracking-[0.16em] text-cream transition-transform hover:scale-[1.03] disabled:opacity-60"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    {running ? "RUNNING..." : "SIMULATE WORKFLOW"}
                  </button>
                  {activeNode >= 0 && !running && (
                    <button
                      type="button"
                      onClick={resetSimulation}
                      aria-label="Reset simulation"
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-cream/15 text-cream/75 transition-colors hover:border-flame hover:text-cream"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-4">
                {BOT_PIPELINE_NODES.map((node, idx) => {
                  const reached = activeNode >= idx;
                  const current = activeNode === idx;
                  return (
                    <motion.div
                      key={node.id}
                      animate={{ scale: current && running ? 1.03 : 1 }}
                      className={`hud-brackets rounded-xl border p-3.5 transition-colors duration-300 ${
                        reached
                          ? "border-flame bg-carbon shadow-flame-glow"
                          : "border-cream/10 bg-carbon/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] tracking-[0.16em] text-cream/50">
                          0{idx + 1}
                        </span>
                        {reached && (
                          <CheckCircle2
                            className={`h-3.5 w-3.5 ${current && running ? "animate-pulse text-flame" : "text-emerald"}`}
                          />
                        )}
                      </div>
                      <p className="mt-1.5 text-xs font-semibold text-cream">{node.label}</p>
                      <p className="mt-1 font-mono text-[10px] text-flame">
                        {reached ? node.metric : "IDLE"}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl border border-cream/10 bg-carbon/80 p-3.5 font-mono text-[11px]">
                <div className="mb-1.5 flex items-center gap-2 text-[9px] tracking-[0.18em] text-cream/50">
                  <Terminal className="h-3 w-3 text-flame" />
                  ORCHESTRATOR LOG
                </div>
                {logs.length === 0 ? (
                  <p className="text-cream/45">
                    &gt; Click &quot;SIMULATE WORKFLOW&quot; to run a live USC KIIT bot pipeline.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {logs.map((line, i) => (
                      <p
                        key={line}
                        className={
                          i === BOT_PIPELINE_NODES.length - 1 ? "text-emerald" : "text-cream/80"
                        }
                      >
                        &gt; {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}