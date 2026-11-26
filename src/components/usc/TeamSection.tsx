import { motion } from "framer-motion";

interface CoreMember {
  id: string;
  name: string;
  role: string;
  tier: 1 | 2 | 3 | 4;
  image: string;
  accent: "flame" | "cobalt" | "emerald";
}

const COORDINATOR: CoreMember = {
  id: "nitin-chauhan",
  name: "Nitin Chauhan",
  role: "Coordinator",
  tier: 1,
  image: "/Our Team/extracted/nitin-chauhan.png",
  accent: "flame",
};

const VICE_COORDINATOR: CoreMember = {
  id: "jagrit-churiwala",
  name: "Jagrit Churiwala",
  role: "Vice Coordinator",
  tier: 2,
  image: "/Our Team/extracted/jagrit-churiwala.png",
  accent: "flame",
};

const ASSOCIATE_COORDINATORS: readonly CoreMember[] = [
  {
    id: "kavya-mahato",
    name: "Kavya Mahato",
    role: "Associate Coordinator",
    tier: 3,
    image: "/Our Team/extracted/kavya-mahato.png",
    accent: "cobalt",
  },
  {
    id: "ansuman-ray",
    name: "Ansuman Ray",
    role: "Associate Coordinator",
    tier: 3,
    image: "/Our Team/extracted/ansuman-ray.png",
    accent: "cobalt",
  },
  {
    id: "sneha-ram",
    name: "Sneha Ram",
    role: "Associate Coordinator",
    tier: 3,
    image: "/Our Team/extracted/sneha-ram.png",
    accent: "cobalt",
  },
];

const STUDENT_POCS: readonly CoreMember[] = [
  {
    id: "ritrisha-patra",
    name: "Ritrisha Patra",
    role: "Student Point of Contact",
    tier: 4,
    image: "/Our Team/extracted/ritrisha-patra.png",
    accent: "emerald",
  },
  {
    id: "souvik-ghosh",
    name: "Souvik Ghosh",
    role: "Student Point of Contact",
    tier: 4,
    image: "/Our Team/extracted/souvik-ghosh.png",
    accent: "emerald",
  },
  {
    id: "kristi-buzarbaruah",
    name: "Kristi Buzarbaruah",
    role: "Student Point of Contact",
    tier: 4,
    image: "/Our Team/extracted/kristi-buzarbaruah.png",
    accent: "emerald",
  },
];

const ACCENT_STYLES = {
  flame: {
    border: "border-flame/40 hover:border-flame/80",
    glow: "bg-flame/25",
    ring: "shadow-[0_0_32px_-8px_rgba(250,70,22,0.5)]",
    badge: "border-flame/45 bg-flame/15 text-flame",
    dot: "bg-flame shadow-[0_0_12px_#FA4616]",
  },
  cobalt: {
    border: "border-cobalt/40 hover:border-cobalt/80",
    glow: "bg-cobalt/25",
    ring: "shadow-[0_0_32px_-8px_rgba(0,103,223,0.45)]",
    badge: "border-cobalt/45 bg-cobalt/15 text-cream",
    dot: "bg-cobalt shadow-[0_0_12px_#0067DF]",
  },
  emerald: {
    border: "border-emerald/40 hover:border-emerald/80",
    glow: "bg-emerald/25",
    ring: "shadow-[0_0_32px_-8px_rgba(61,153,96,0.45)]",
    badge: "border-emerald/45 bg-emerald/15 text-emerald",
    dot: "bg-emerald shadow-[0_0_12px_#3D9960]",
  },
} as const;

function VerticalGlowString({
  height = 56,
  fromColor = "#FA4616",
  toColor = "#0067DF",
}: {
  height?: number;
  fromColor?: string;
  toColor?: string;
}) {
  return (
    <div
      aria-hidden
      className="relative mx-auto flex w-6 flex-col items-center justify-center"
      style={{ height }}
    >
      {/* Top junction node */}
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: fromColor, boxShadow: `0 0 10px ${fromColor}` }}
      />
      {/* Glowing vertical line */}
      <div
        className="relative w-[2px] flex-1 overflow-hidden"
        style={{
          background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
          boxShadow: `0 0 12px ${fromColor}88`,
        }}
      >
        {/* Traveling light pulse */}
        <motion.div
          className="absolute inset-x-0 h-5 rounded-full bg-cream"
          style={{ boxShadow: `0 0 10px 2px ${fromColor}` }}
          animate={{ top: ["-30%", "120%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {/* Bottom junction node */}
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: toColor, boxShadow: `0 0 10px ${toColor}` }}
      />
    </div>
  );
}

function BranchingGlowConnector({
  topColor = "#FA4616",
  bottomColor = "#0067DF",
}: {
  topColor?: string;
  bottomColor?: string;
}) {
  const gradId = `grad-${topColor.replace("#", "")}-${bottomColor.replace("#", "")}`;
  return (
    <>
      {/* Desktop 3-way glowing SVG tree branch */}
      <div aria-hidden className="relative mx-auto hidden h-20 w-full max-w-4xl md:block">
        <svg
          viewBox="0 0 900 80"
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={topColor} />
              <stop offset="100%" stopColor={bottomColor} />
            </linearGradient>
            <filter id="string-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Center stem down to horizontal bus */}
          <line
            x1="450"
            y1="0"
            x2="450"
            y2="38"
            stroke={topColor}
            strokeWidth="2.2"
            filter="url(#string-glow)"
          />
          {/* Horizontal bus across 3 columns */}
          <line
            x1="150"
            y1="38"
            x2="750"
            y2="38"
            stroke={`url(#${gradId})`}
            strokeWidth="2.2"
            filter="url(#string-glow)"
          />
          {/* Left drop */}
          <line
            x1="150"
            y1="38"
            x2="150"
            y2="80"
            stroke={bottomColor}
            strokeWidth="2.2"
            filter="url(#string-glow)"
          />
          {/* Center drop */}
          <line
            x1="450"
            y1="38"
            x2="450"
            y2="80"
            stroke={bottomColor}
            strokeWidth="2.2"
            filter="url(#string-glow)"
          />
          {/* Right drop */}
          <line
            x1="750"
            y1="38"
            x2="750"
            y2="80"
            stroke={bottomColor}
            strokeWidth="2.2"
            filter="url(#string-glow)"
          />

          {/* Glowing junction dots */}
          <circle cx="450" cy="0" r="4" fill={topColor} filter="url(#string-glow)" />
          <circle cx="450" cy="38" r="4" fill={topColor} filter="url(#string-glow)" />
          <circle cx="150" cy="80" r="4" fill={bottomColor} filter="url(#string-glow)" />
          <circle cx="450" cy="80" r="4" fill={bottomColor} filter="url(#string-glow)" />
          <circle cx="750" cy="80" r="4" fill={bottomColor} filter="url(#string-glow)" />
        </svg>

        {/* Animated traveling pulse on center stem */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-0 h-3 w-1 -translate-x-1/2 rounded-full bg-cream"
          style={{ boxShadow: `0 0 12px 2px ${topColor}` }}
          animate={{ top: ["0%", "44%"], opacity: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Mobile simple vertical glowing string */}
      <div className="md:hidden">
        <VerticalGlowString height={44} fromColor={topColor} toColor={bottomColor} />
      </div>
    </>
  );
}

function TeamTreeNode({
  member,
  featured = false,
  delay = 0,
}: {
  member: CoreMember;
  featured?: boolean;
  delay?: number;
}) {
  const styles = ACCENT_STYLES[member.accent];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={`glass-dark hud-brackets group relative mx-auto w-full overflow-hidden rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
        featured ? "max-w-[290px]" : "max-w-[270px]"
      } ${styles.border} ${styles.ring}`}
    >
      {/* Role badge */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] ${styles.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
          {member.role}
        </span>
      </div>

      {/* Extracted dark-theme portrait stage */}
      <div className="relative flex aspect-[4/3.6] w-full items-end justify-center overflow-hidden rounded-xl border border-cream/10 bg-obsidian">
        {/* Ambient radial glow behind person */}
        <div
          aria-hidden
          className={`pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${styles.glow} opacity-70`}
        />
        {/* Subtle dark cyber grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.973_0.013_84/4%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.973_0.013_84/4%)_1px,transparent_1px)] bg-[size:22px_22px]"
        />
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          className="relative z-10 h-[94%] w-auto max-w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
        />
        {/* Bottom dark melt gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent"
        />
      </div>

      {/* Name */}
      <div className="mt-3.5 text-center">
        <h3 className="font-display-usc text-2xl tracking-wide text-cream sm:text-[1.65rem]">
          {member.name}
        </h3>
      </div>
    </motion.article>
  );
}

export function TeamSection() {
  return (
    <section id="team" className="relative bg-obsidian px-4 py-16 sm:px-10 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <p className="font-hud text-xs text-flame">THE CORE HIERARCHY</p>
          <h2 className="font-display-usc mt-2 text-4xl text-cream sm:text-6xl">OUR TEAM</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-cream/65">
            The student leadership driving USC KIIT&apos;s vision, operations, and community
            initiatives across KIIT University.
          </p>
        </div>

        {/* Glowing Hierarchy Tree */}
        <div className="mt-12 flex flex-col items-center">
          {/* Tier 1: Coordinator */}
          <TeamTreeNode member={COORDINATOR} featured delay={0} />

          {/* Glowing string: Coordinator -> Vice Coordinator */}
          <VerticalGlowString height={56} fromColor="#FA4616" toColor="#FA4616" />

          {/* Tier 2: Vice Coordinator */}
          <TeamTreeNode member={VICE_COORDINATOR} featured delay={0.08} />

          {/* Glowing 3-way branch: Vice Coordinator -> Associate Coordinators */}
          <BranchingGlowConnector topColor="#FA4616" bottomColor="#0067DF" />

          {/* Tier 3: Associate Coordinators */}
          <div className="grid w-full max-w-4xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {ASSOCIATE_COORDINATORS.map((member, idx) => (
              <TeamTreeNode key={member.id} member={member} delay={0.12 + idx * 0.06} />
            ))}
          </div>

          {/* Glowing 3-way branch: Associate Coordinators -> Student POCs */}
          <BranchingGlowConnector topColor="#0067DF" bottomColor="#3D9960" />

          {/* Tier 4: Student Points of Contact */}
          <div className="grid w-full max-w-4xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {STUDENT_POCS.map((member, idx) => (
              <TeamTreeNode key={member.id} member={member} delay={0.18 + idx * 0.06} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
