import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { COMMUNITY_METRICS, type CommunityMetric } from "@/lib/usc-data";

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
      className="rounded-2xl border border-charcoal/12 bg-cream p-4 shadow-sm sm:p-5"
    >
      <p className="font-display-usc text-gradient-flame text-3xl sm:text-5xl">
        {display}
        {metric.suffix}
      </p>
      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-charcoal/75 sm:text-[11px] sm:tracking-[0.14em]">
        {metric.label}
      </p>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="editorial-surface relative px-4 py-16 sm:px-10 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Left Column: Community Story */}
          <div className="lg:col-span-5">
            <p className="font-hud text-xs font-semibold text-flame">WHO WE ARE</p>
            <h2 className="font-display-usc text-gradient-flame mt-2 text-4xl sm:text-6xl">
              ABOUT USC KIIT
            </h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal/85 sm:mt-6">
              <strong>UiPath Student Community, KIIT University (Bhubaneswar)</strong> is an
              official student-led technical community operating under the{" "}
              <strong>Department of Training and Placement, KIIT</strong>.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
              We unite curious engineers, designers, writers, and organizers across twelve
              specialized domains — empowering students to master Robotic Process Automation (RPA),
              Agentic AI, full-stack software engineering, and high-craft creative storytelling.
            </p>

            <blockquote className="mt-6 rounded-2xl border-l-4 border-flame bg-charcoal/[0.04] p-4 sm:mt-7 sm:p-5">
              <p className="font-display-usc text-2xl tracking-wide text-charcoal sm:text-3xl">
                &ldquo;Building the Future, One Domain at a Time.&rdquo;
              </p>
              <footer className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald sm:tracking-[0.18em]">
                DEPT. OF TRAINING &amp; PLACEMENT · KIIT UNIVERSITY
              </footer>
            </blockquote>
          </div>

          {/* Right Column: 2x2 Metrics Grid + USC KIIT Group Photo */}
          <div className="space-y-5 sm:space-y-6 lg:col-span-7">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {COMMUNITY_METRICS.map((metric) => (
                <AnimatedMetricTile key={metric.label} metric={metric} />
              ))}
            </div>

            <div className="overflow-hidden rounded-3xl border border-charcoal/12 bg-obsidian shadow-2xl">
              <img
                src="/groupphoto.jpeg"
                alt="USC KIIT Community Group Photo"
                className="aspect-[16/10] w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}