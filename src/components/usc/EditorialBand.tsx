import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Cpu, Play, RotateCcw, Terminal } from "lucide-react";
import {
  BOT_PIPELINE_NODES,
  COMMUNITY_METRICS,
  FLAGSHIP_EVENTS,
  type CommunityMetric,
} from "@/lib/usc-data";

function AnimatedMetric({ metric }: { metric: CommunityMetric }) {
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
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [inView, metric.value]);

  return (
    <div ref={ref} className="border-t-2 border-charcoal/15 pt-5">
      <p className="font-display-usc text-gradient-flame text-5xl sm:text-6xl">
        {display}
        {metric.suffix}
      </p>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-charcoal/75">
        {metric.label}
      </p>
    </div>
  );
}

export function EditorialBand() {
  const [activeNode, setActiveNode] = useState<number>(-1);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
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
        if (idx + 1 === BOT_PIPELINE_NODES.length - 1) {
          setRunning(false);
        }
      }, (idx + 1) * 620);
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
    <section id="events" className="editorial-surface relative px-6 py-24 sm:px-10 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-hud text-xs font-semibold text-flame">
              COMMUNITY IMPACT &amp; FLAGSHIP EVENTS
            </p>
            <h2 className="font-display-usc text-gradient-flame mt-2 text-5xl sm:text-6xl lg:text-7xl">
              BUILT AT KIIT.
              <span className="block text-charcoal">SCALED FOR REAL IMPACT.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-charcoal/75">
            From 10-day UiPath Maestro bootcamps to 24-hour campus hackathons, USC KIIT turns
            curious students into production-ready automation builders.
          </p>
        </div>

        {/* Animated Community Metrics */}
        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {COMMUNITY_METRICS.map((metric) => (
            <AnimatedMetric key={metric.label} metric={metric} />
          ))}
        </div>

        {/* Flagship Highlights */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {FLAGSHIP_EVENTS.map((event) => (
            <article
              key={event.id}
              className="flex flex-col justify-between rounded-2xl border border-charcoal/12 bg-cream p-7 shadow-sm transition-transform duration-200 hover:-translate-y-1"
            >
              <div>
                <span className="font-hud inline-block rounded-full bg-flame/10 px-3 py-1 text-[10px] font-semibold text-flame">
                  {event.tag}
                </span>
                <h3 className="font-display-usc mt-4 text-4xl text-charcoal">{event.title}</h3>
                <p className="mt-1 text-sm font-semibold text-cobalt">{event.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                  {event.description}
                </p>
              </div>
              <p className="mt-6 border-t border-charcoal/10 pt-4 font-mono text-[11px] font-semibold tracking-[0.16em] text-emerald">
                {event.stat}
              </p>
            </article>
          ))}
        </div>

        {/* Interactive "Run a USC Bot" Mini-Playground */}
        <div className="mt-16 rounded-3xl bg-obsidian p-6 text-cream shadow-2xl sm:p-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-hud inline-flex items-center gap-2 text-[11px] text-flame">
                <Cpu className="h-3.5 w-3.5" />
                INTERACTIVE WORKFLOW PLAYGROUND
              </p>
              <h3 className="font-display-usc mt-1.5 text-3xl text-cream sm:text-4xl">
                RUN A USC BOT
              </h3>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={runSimulation}
                disabled={running}
                className="gradient-flame shadow-flame-glow inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-2.5 font-mono text-xs font-semibold tracking-[0.16em] text-cream transition-transform hover:scale-[1.03] disabled:opacity-60"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                {running ? "EXECUTING..." : "SIMULATE WORKFLOW"}
              </button>
              {activeNode >= 0 && !running && (
                <button
                  type="button"
                  onClick={resetSimulation}
                  aria-label="Reset workflow"
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-cream/15 text-cream/75 transition-colors hover:border-flame hover:text-cream"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Node Pipeline with SVG Energy Connectors */}
          <div className="mt-8 grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
            {BOT_PIPELINE_NODES.map((node, idx) => {
              const reached = activeNode >= idx;
              const current = activeNode === idx;
              return (
                <div key={node.id} className="contents">
                  <div
                    className={`hud-brackets rounded-xl border p-4 transition-all duration-300 ${
                      reached
                        ? "border-flame bg-carbon shadow-flame-glow"
                        : "border-cream/10 bg-carbon/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] tracking-[0.16em] text-cream/55">
                        NODE 0{idx + 1}
                      </span>
                      {reached && (
                        <CheckCircle2
                          className={`h-4 w-4 ${current && running ? "animate-pulse text-flame" : "text-emerald"}`}
                        />
                      )}
                    </div>
                    <p className="mt-2 text-sm font-semibold text-cream">{node.label}</p>
                    <p className="mt-0.5 text-xs text-cream/60">{node.sublabel}</p>
                    <p className="mt-3 font-mono text-[10px] tracking-[0.14em] text-flame">
                      {reached ? node.metric : "IDLE"}
                    </p>
                  </div>

                  {idx < BOT_PIPELINE_NODES.length - 1 && (
                    <div
                      aria-hidden
                      className="hidden items-center justify-center md:flex"
                    >
                      <svg width="42" height="16" viewBox="0 0 42 16" fill="none">
                        <line
                          x1="0"
                          y1="8"
                          x2="42"
                          y2="8"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-cream/15"
                        />
                        {activeNode > idx && (
                          <motion.line
                            x1="0"
                            y1="8"
                            x2="42"
                            y2="8"
                            stroke="var(--flame)"
                            strokeWidth="2.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.45 }}
                          />
                        )}
                        {activeNode >= idx && activeNode < BOT_PIPELINE_NODES.length && (
                          <motion.circle
                            cy="8"
                            r="3.5"
                            fill="var(--solar)"
                            initial={{ cx: 2, opacity: 1 }}
                            animate={{ cx: 40, opacity: 0.2 }}
                            transition={{ duration: 0.55, repeat: running ? Infinity : 0 }}
                          />
                        )}
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Live Execution Logs */}
          <div className="mt-6 rounded-xl border border-cream/10 bg-carbon/80 p-4 font-mono text-xs">
            <div className="mb-2 flex items-center gap-2 text-[10px] tracking-[0.18em] text-cream/50">
              <Terminal className="h-3.5 w-3.5 text-flame" />
              LIVE ORCHESTRATOR STREAM
            </div>
            {logs.length === 0 ? (
              <p className="text-cream/45">
                &gt; Press &quot;SIMULATE WORKFLOW&quot; to trigger a live KIIT automation run.
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
    </section>
  );
}