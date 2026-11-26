import { useState, type PointerEvent } from "react";
import { Award, Bot, Flame, Globe2, Users, type LucideIcon } from "lucide-react";
import { USC_INITIATIVES, type InitiativeItem } from "@/lib/usc-data";

const INITIATIVE_ICONS: Record<string, LucideIcon> = {
  bootcamps: Flame,
  "sdg-competitions": Globe2,
  "bot-lab": Bot,
  certification: Award,
  "peer-mentorship": Users,
};

const INITIATIVE_IMAGES: Record<string, string> = {
  bootcamps: "/USC KIIT Gallery/Auto_Gla_6.06db7352c7cdb323bbac.jpg",
  "sdg-competitions": "/USC KIIT Gallery/DSC_0254.JPG",
  "bot-lab": "/USC KIIT Gallery/DSC_0261.JPG",
  certification: "/USC KIIT Gallery/DSC_0267.JPG",
  "peer-mentorship": "/USC KIIT Gallery/photo_shoot_1.d4a9e1a128e99c22b007.jpg",
};

function InitiativeCard({ item }: { item: InitiativeItem }) {
  const [spot, setSpot] = useState({ x: 0, y: 0, active: false });
  const Icon = INITIATIVE_ICONS[item.id] ?? Flame;
  const bgImage = INITIATIVE_IMAGES[item.id] ?? "/USC KIIT Gallery/DSC_0254.JPG";

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setSpot((prev) => ({ ...prev, active: false }))}
      className={`hud-brackets group relative overflow-hidden rounded-2xl border border-cream/10 bg-obsidian p-5 transition-colors duration-200 hover:border-flame/60 sm:p-7 ${
        item.spanWide ? "md:col-span-2" : ""
      }`}
    >
      {/* Background photo */}
      <img
        src={bgImage}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />

      {/* Cursor-following dark flashlight mask over the background photo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: spot.active
            ? `radial-gradient(240px circle at ${spot.x}px ${spot.y}px, rgba(9,10,15,0.22) 0%, rgba(9,10,15,0.62) 48%, rgba(9,10,15,0.9) 78%, rgba(9,10,15,0.94) 100%)`
            : "rgba(9,10,15,0.9)",
        }}
      />

      {/* Subtle warm flame edge glow at cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(240px circle at ${spot.x}px ${spot.y}px, oklch(0.648 0.224 34 / 16%), transparent 70%)`,
        }}
      />

      {/* Card content above photo */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cream/15 bg-obsidian/80 text-flame backdrop-blur-sm transition-colors group-hover:border-flame/50">
            <Icon className="h-5 w-5" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.18em] text-cream/60">
            {item.tag}
          </span>
        </div>
        <div className="mt-5 sm:mt-6">
          <h3 className="font-display-usc text-2xl text-cream drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-3xl">
            {item.title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-cream/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function InitiativesSection() {
  return (
    <section id="initiatives" className="relative bg-obsidian px-4 py-16 sm:px-10 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-hud text-xs text-flame">WHAT WE DRIVE</p>
            <h2 className="font-display-usc mt-2 text-4xl text-cream sm:text-6xl">
              OUR INITIATIVES
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-cream/65">
            Five core pillars turning KIIT students from automation newcomers into certified
            builders shipping real-world bots and AI solutions.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3">
          {USC_INITIATIVES.map((item) => (
            <InitiativeCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}