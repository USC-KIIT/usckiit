import { useState, type MouseEvent } from "react";
import { Award, Bot, Flame, Globe2, Users, type LucideIcon } from "lucide-react";
import { USC_INITIATIVES, type InitiativeItem } from "@/lib/usc-data";

const INITIATIVE_ICONS: Record<string, LucideIcon> = {
  bootcamps: Flame,
  "sdg-competitions": Globe2,
  "bot-lab": Bot,
  certification: Award,
  "peer-mentorship": Users,
};

function InitiativeCard({ item }: { item: InitiativeItem }) {
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });
  const Icon = INITIATIVE_ICONS[item.id] ?? Flame;

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setSpot((prev) => ({ ...prev, active: false }))}
      className={`hud-brackets group relative overflow-hidden rounded-2xl border border-cream/10 bg-carbon/85 p-6 transition-colors duration-200 hover:border-flame/60 sm:p-7 ${
        item.spanWide ? "md:col-span-2" : ""
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(360px circle at ${spot.x}% ${spot.y}%, oklch(0.648 0.224 34 / 17%), transparent 65%)`,
        }}
      />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cream/10 bg-obsidian text-flame transition-colors group-hover:border-flame/50">
            <Icon className="h-5 w-5" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.18em] text-cream/45">
            {item.tag}
          </span>
        </div>
        <div className="mt-6">
          <h3 className="font-display-usc text-3xl text-cream">{item.title}</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-cream/70">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

export function InitiativesSection() {
  return (
    <section id="initiatives" className="relative bg-obsidian px-6 py-24 sm:px-10 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-hud text-xs text-flame">WHAT WE DRIVE</p>
            <h2 className="font-display-usc mt-2 text-5xl text-cream sm:text-6xl">
              OUR INITIATIVES
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-cream/65">
            Five core pillars turning KIIT students from automation newcomers into certified
            builders shipping real-world bots and AI solutions.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {USC_INITIATIVES.map((item) => (
            <InitiativeCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}