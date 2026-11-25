export type DomainId =
  | "rpa-ai"
  | "web-app"
  | "aiml-data"
  | "uiux-design"
  | "content-tech"
  | "marketing-pr"
  | "video-cinema"
  | "events-ops";

export type DomainCategory = "ALL" | "ENGINEERING" | "CREATIVE" | "GROWTH & OPS";

export interface DomainInfo {
  id: DomainId;
  title: string;
  shortTitle: string;
  category: Exclude<DomainCategory, "ALL">;
  tagline: string;
  description: string;
  tools: readonly string[];
  whatYouBuild: readonly string[];
  skillsWeLookFor: readonly string[];
  codename: string;
  accent: "flame" | "cobalt" | "emerald";
  spanWide?: boolean;
}

export const USC_DOMAINS: readonly DomainInfo[] = [
  {
    id: "rpa-ai",
    title: "RPA & Agentic AI",
    shortTitle: "RPA & AI",
    category: "ENGINEERING",
    tagline: "Autonomous digital workers & UiPath Maestro orchestration.",
    description:
      "Architect intelligent bots, agentic workflows, and cross-campus automations using UiPath Studio and Maestro.",
    tools: ["UiPath Studio", "Maestro", "Document Understanding", "Orchestrator"],
    whatYouBuild: [
      "Autonomous campus workflow bots for KIIT student clubs and hackathons",
      "Multi-agent UiPath Maestro pipelines connecting APIs, sheets, and LLMs",
      "Live bootcamp labs and competition templates for MAESTROVA",
    ],
    skillsWeLookFor: [
      "Logical problem-solving and flow thinking",
      "Curiosity about enterprise automation or agentic workflows",
      "Any programming background (Python, C#, or JS is a plus)",
    ],
    codename: "Orchestrator Prime",
    accent: "flame",
    spanWide: true,
  },
  {
    id: "web-app",
    title: "Web & App Development",
    shortTitle: "WEB DEV",
    category: "ENGINEERING",
    tagline: "High-craft web platforms, portals & full-stack systems.",
    description:
      "Engineer interactive 3D sites, event registration portals, real-time leaderboards, and mobile companions.",
    tools: ["React", "Next.js", "TypeScript", "Node.js", "Three.js"],
    whatYouBuild: [
      "Event portals and live judging dashboards for Bot-a-Thon KIIT",
      "Interactive 3D web experiences and internal member hubs",
      "REST & realtime APIs integrated with UiPath webhooks",
    ],
    skillsWeLookFor: [
      "Clean HTML/CSS/TypeScript fundamentals",
      "Experience shipping React or full-stack side projects",
      "Obsession with performance and responsive UX",
    ],
    codename: "System Architect",
    accent: "cobalt",
  },
  {
    id: "aiml-data",
    title: "AI / ML & Data Science",
    shortTitle: "AI / ML",
    category: "ENGINEERING",
    tagline: "LLMs, computer vision & intelligent data pipelines.",
    description:
      "Train custom vision models, build RAG assistants, and power intelligent decision nodes inside automation flows.",
    tools: ["Python", "PyTorch", "LangChain", "OpenCV", "Pandas"],
    whatYouBuild: [
      "RAG knowledge copilots trained on UiPath docs and campus FAQs",
      "Document OCR & vision classifiers plugged into UiPath agents",
      "Analytics dashboards tracking hackathon and workshop impact",
    ],
    skillsWeLookFor: [
      "Strong Python and data wrangling fundamentals",
      "Hands-on experimentation with LLMs, ML, or notebooks",
      "Ability to turn research papers into working demos",
    ],
    codename: "Neural Strategist",
    accent: "cobalt",
  },
  {
    id: "uiux-design",
    title: "UI/UX & Graphic Design",
    shortTitle: "DESIGN",
    category: "CREATIVE",
    tagline: "Design systems, brand identity & 3D visual storytelling.",
    description:
      "Shape USC KIIT's iconic visual language across product interfaces, posters, merch, and stage visuals.",
    tools: ["Figma", "Blender", "Illustrator", "Photoshop", "Spline"],
    whatYouBuild: [
      "Interactive prototypes and design systems for community apps",
      "Event identity kits, stage backdrops, and social carousels",
      "3D mascot renders and editorial layouts for flagship launches",
    ],
    skillsWeLookFor: [
      "Sharp eye for typography, layout hierarchy, and color",
      "Portfolio of UI screens, posters, or 3D experiments",
      "Comfort collaborating directly with developers",
    ],
    codename: "Pixel Automator",
    accent: "flame",
  },
  {
    id: "content-tech",
    title: "Content & Technical Writing",
    shortTitle: "CONTENT",
    category: "CREATIVE",
    tagline: "Automation deep-dives, docs & crisp technical storytelling.",
    description:
      "Translate complex RPA and Agentic AI concepts into readable guides, launch copy, and developer newsletters.",
    tools: ["Notion", "Markdown", "Medium", "Copywriting", "Docs"],
    whatYouBuild: [
      "Step-by-step UiPath tutorials and MAESTROVA study playbooks",
      "Editorial launch scripts, website copy, and speaker briefs",
      "Technical case studies spotlighting student-built bots",
    ],
    skillsWeLookFor: [
      "Clear, punchy writing without fluff",
      "Ability to break down technical topics for beginners",
      "Editorial discipline and research habits",
    ],
    codename: "Signal Chronicler",
    accent: "emerald",
  },
  {
    id: "marketing-pr",
    title: "Marketing, PR & Sponsorship",
    shortTitle: "MARKETING",
    category: "GROWTH & OPS",
    tagline: "Brand momentum, industry partnerships & campus outreach.",
    description:
      "Grow USC KIIT's reach across KIIT and eastern India, pitch sponsors, and orchestrate high-energy launch campaigns.",
    tools: ["Campaign Strategy", "Sponsor Decks", "Social Growth", "PR"],
    whatYouBuild: [
      "Multi-week hype campaigns filling 500+ seat auditoriums",
      "Sponsor proposals and tech-partner relationships",
      "Community collaborations with UiPath MVPs and student clubs",
    ],
    skillsWeLookFor: [
      "Persuasive communication and pitch confidence",
      "Instinct for viral storytelling and audience timing",
      "Follow-through with external partners and speakers",
    ],
    codename: "Growth Catalyst",
    accent: "flame",
  },
  {
    id: "video-cinema",
    title: "Video Editing & Cinematography",
    shortTitle: "VIDEO",
    category: "CREATIVE",
    tagline: "Kinetic motion graphics, aftermovies & high-impact reels.",
    description:
      "Direct, shoot, and cut cinematic trailers, hackathon aftermovies, and kinetic motion graphics for every milestone.",
    tools: ["After Effects", "Premiere Pro", "DaVinci Resolve", "Cinema"],
    whatYouBuild: [
      "High-octane teaser trailers for MAESTROVA and Bot-a-Thon",
      "Same-day hackathon reels and speaker highlight cuts",
      "Motion-graphics explainers bringing UiPath workflows to life",
    ],
    skillsWeLookFor: [
      "Strong pacing, sound design, and visual rhythm",
      "Showreel of edits, reels, or motion graphics",
      "Calm execution under live-event turnarounds",
    ],
    codename: "Frame Kineticist",
    accent: "cobalt",
  },
  {
    id: "events-ops",
    title: "Events & Operations",
    shortTitle: "OPERATIONS",
    category: "GROWTH & OPS",
    tagline: "Precision logistics for hackathons, bootcamps & summits.",
    description:
      "Run the command center behind every USC KIIT workshop, 24-hour hackathon, and national DevFest session.",
    tools: ["Event Ops", "Stage Production", "Logistics", "Team Ops"],
    whatYouBuild: [
      "End-to-end execution of 10-day bootcamps and campus hackathons",
      "Venue, judge, hospitality, and check-in operations at scale",
      "Playbooks that keep 8 domains moving in lockstep",
    ],
    skillsWeLookFor: [
      "Calm leadership when timelines tighten",
      "Detail-oriented planning and cross-team coordination",
      "Bias for action on event day",
    ],
    codename: "Mission Commander",
    accent: "emerald",
    spanWide: true,
  },
];

export interface CommunityMetric {
  value: number;
  suffix: string;
  label: string;
}

export const COMMUNITY_METRICS: readonly CommunityMetric[] = [
  { value: 500, suffix: "+", label: "Student Automators" },
  { value: 15, suffix: "+", label: "Bootcamps & Hackathons" },
  { value: 8, suffix: "", label: "Specialized Domains" },
  { value: 100, suffix: "+", label: "Bots Built" },
];

export interface FlagshipEvent {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  stat: string;
}

export const FLAGSHIP_EVENTS: readonly FlagshipEvent[] = [
  {
    id: "maestrova",
    tag: "FLAGSHIP BOOTCAMP",
    title: "MAESTROVA",
    subtitle: "10-Day RPA, Agentic AI & Maestro Bootcamp",
    description:
      "Hands-on daily sprints taking KIIT students from first Studio workflow to production-grade UiPath Maestro agents.",
    stat: "10 DAYS · 350+ BUILDERS",
  },
  {
    id: "bot-a-thon",
    tag: "ANNUAL HACKATHON",
    title: "Bot-a-Thon KIIT",
    subtitle: "24-Hour Campus Automation Showdown",
    description:
      "Cross-functional squads race to automate real campus and industry bottlenecks, judged live by UiPath engineers.",
    stat: "24 HRS · 40+ BOTS SHIPPED",
  },
  {
    id: "devfest",
    tag: "COMMUNITY SUMMIT",
    title: "UiPath DevFest Sessions",
    subtitle: "Keynotes, Live Demos & MVP Panels",
    description:
      "Direct mentorship with UiPath MVPs, career blueprints in Agentic Automation, and live architecture breakdowns.",
    stat: "LIVE DEMOS · MVP MENTORS",
  },
];

export interface RoadmapStep {
  step: string;
  title: string;
  description: string;
}

export const RECRUITMENT_ROADMAP: readonly RoadmapStep[] = [
  {
    step: "01",
    title: "Register Online",
    description: "Submit your KIIT details, primary domain, and portfolio or GitHub link in under two minutes.",
  },
  {
    step: "02",
    title: "Domain Assessment / Task",
    description: "Complete a practical 48-hour domain challenge designed to showcase how you think and ship.",
  },
  {
    step: "03",
    title: "Technical & Culture Interview",
    description: "Walk our domain leads through your work, ideas, and what you want to build at USC KIIT.",
  },
  {
    step: "04",
    title: "Welcome to USC KIIT",
    description: "Get onboarded to your domain squad, claim your UiPath toolkit, and ship from week one.",
  },
];

export interface BotPipelineNode {
  id: string;
  label: string;
  sublabel: string;
  log: string;
  metric: string;
}

export const BOT_PIPELINE_NODES: readonly BotPipelineNode[] = [
  {
    id: "input",
    label: "KIIT Student Input",
    sublabel: "Event Form + Roll No.",
    log: "[00.08s] Payload received · @kiit.ac.in verified",
    metric: "100% valid",
  },
  {
    id: "agent",
    label: "UiPath AI Agent",
    sublabel: "Intent + Domain Triage",
    log: "[00.19s] Agent classified skill profile → RPA & AI",
    metric: "98.4% conf",
  },
  {
    id: "orchestrator",
    label: "Workflow Orchestrator",
    sublabel: "Maestro Queue Dispatch",
    log: "[00.31s] Calendar invite + Slack role queued",
    metric: "0 retries",
  },
  {
    id: "done",
    label: "Task Automated ✓",
    sublabel: "Certificate & Invite Sent",
    log: "[00.42s] Complete · 0.42s saved · Zero manual effort",
    metric: "0.42s saved",
  },
];

export interface InitiativeItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  spanWide?: boolean;
}

export const USC_INITIATIVES: readonly InitiativeItem[] = [
  {
    id: "bootcamps",
    tag: "01 · COHORTS",
    title: "Hands-On Automation Bootcamps",
    description:
      "Intensive cohorts like MAESTROVA teaching UiPath Studio, RPA workflows, and Agentic AI from zero to deployment.",
    spanWide: true,
  },
  {
    id: "sdg-competitions",
    tag: "02 · HACKATHONS",
    title: "SDG-Driven Tech Competitions",
    description:
      "Campus-wide multi-track hackathons like HACK-A-BOT pairing automation and AI/ML with UN Sustainable Development Goals.",
  },
  {
    id: "bot-lab",
    tag: "03 · OPEN LAB",
    title: "Student Bot Lab & Open Projects",
    description:
      "Real campus workflow automations, autonomous AI agents, and full-stack tools built collaboratively by KIIT students.",
  },
  {
    id: "certification",
    tag: "04 · CAREER TRACKS",
    title: "UiPath Certification & Career Readiness",
    description:
      "Peer study tracks, guest engagements, and mentorship organized under the Department of Training and Placement, KIIT.",
  },
  {
    id: "peer-mentorship",
    tag: "05 · COMMUNITY",
    title: "Peer Mentorship & Tech Talks",
    description:
      "Weekly workshops, hands-on challenges, and beginner-friendly onboarding across all 8 domains.",
  },
];