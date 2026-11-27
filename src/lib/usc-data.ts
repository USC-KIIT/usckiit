export {
  DOMAINS_DATA as USC_DOMAINS,
  NON_TECH_DOMAINS,
  TECH_DOMAINS,
  type DomainId,
  type DomainInfo,
  type DomainWing,
} from "@/data/domainsData";

export interface CommunityMetric {
  value: number;
  suffix: string;
  label: string;
}

export const COMMUNITY_METRICS: readonly CommunityMetric[] = [
  { value: 500, suffix: "+", label: "Student Automators" },
  { value: 15, suffix: "+", label: "Bootcamps & Hackathons" },
  { value: 12, suffix: "", label: "Specialized Domains" },
  { value: 100, suffix: "+", label: "Bots Built" },
];

export interface EventSpeaker {
  name: string;
  role: string;
}

export interface FlagshipEvent {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  stat: string;
  date: string;
  venue: string;
  highlights: readonly string[];
  speakers: readonly EventSpeaker[];
  partners?: string;
}

export const FLAGSHIP_EVENTS: readonly FlagshipEvent[] = [
  {
    id: "automatrix-3",
    tag: "WORKSHOP · OCT 2026",
    title: "AUTOMATRIX 3.0",
    subtitle: "Where AI Meets Automation · Campus 17",
    description:
      "An intensive hands-on workshop exploring Agentic AI, UiPath Maestro, and intelligent automation — turning ideas into autonomous action.",
    stat: "3 OCT 2026 · 2:30 PM · CAMPUS 17",
    date: "October 3, 2026 · 2:30 PM onwards",
    venue: "Campus 17 Auditorium",
    highlights: [
      "Keynote Session",
      "Hands-on Agentic AI & Maestro",
      "Maestro Workshop",
      "Free Registration",
    ],
    speakers: [
      {
        name: "Darshan Sable",
        role: "Automation Engineer @ Accelirate · UiPath MVP 2026 · 5× UiPath Certified",
      },
    ],
    partners: "Sponsors: Chaska (Dessert) · King Rolls (Dining) · 69 Burger (Food)",
  },
  {
    id: "maestrova",
    tag: "10-DAY BOOTCAMP · SEP 2026",
    title: "MAESTROVA BOOTCAMP",
    subtitle: "Where Automation Meets Intelligence · Online",
    description:
      "A 10-day evening cohort exclusively for 1st, 2nd & 3rd year students — taking builders from RPA workflows to UiPath Apps and Maestro.",
    stat: "21–30 SEP 2026 · 600 SEATS FCFS",
    date: "21–30 September 2026 · 10:00 PM – 11:00 PM",
    venue: "Online Mode",
    highlights: [
      "RPA & Workflow Automation",
      "Agentic AI & AI Agents",
      "UiPath Apps",
      "UiPath Maestro & Process Orchestration",
    ],
    speakers: [],
    partners: "600 Registrations (FCFS) · No Prior UiPath Experience Required",
  },
  {
    id: "coding-compass",
    tag: "CAREER SERIES · JUN 2026",
    title: "THE CODING COMPASS",
    subtitle: "Navigating Your Coding Journey · Online",
    description:
      "Mentorship sessions covering Competitive Programming, DSA & Problem Solving, Coding Interview Prep, and Internship & Placement blueprints.",
    stat: "28 JUN 2026 · 7:00 PM · OPEN TO ALL",
    date: "June 28, 2026 · 7:00 PM – 8:30 PM",
    venue: "Online Session",
    highlights: [
      "Competitive Programming & DSA",
      "Internships & Placements",
      "Coding Interview Preparation",
      "Building a Tech Career",
    ],
    speakers: [
      {
        name: "Samrat Bharadwaj",
        role: "SDE II @ Atlassian · Ex @ Amazon · Codeforces Expert (1640)",
      },
      {
        name: "Sanika Jain",
        role: "SDE II @ Oracle · Ex-Google Intern · IIT (BHU) Alumna",
      },
    ],
    partners: "Open to All Students",
  },
  {
    id: "campus-unleashed",
    tag: "CAMPUS ARENA · AUG 2026",
    title: "CAMPUS UNLEASHED",
    subtitle: "Monster Energy × USC KIIT · BGMI Watch Party",
    description:
      "High-voltage BGMI Tournament & Watch Party at Campus 25 — packed with clutch plays, live cheers, and unforgettable campus energy.",
    stat: "AUGUST 2026 · CAMPUS 25",
    date: "August 2026",
    venue: "Campus 25, KIIT University",
    highlights: [
      "BGMI Tournament",
      "Live Watch Party",
      "Monster Energy Activation",
      "Community & Esports",
    ],
    speakers: [],
    partners: "In Collaboration with Monster Energy",
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
    description:
      "Submit your KIIT details, primary domain, and portfolio or GitHub link in under two minutes.",
  },
  {
    step: "02",
    title: "Technical / Non-Technical Interview",
    description:
      "Walk our domain leads through your skills, past work, and how you approach real-world problems.",
  },
  {
    step: "03",
    title: "HR Interview (If Necessary)",
    description:
      "A quick culture-fit and commitment conversation with the core leadership team when required.",
  },
  {
    step: "04",
    title: "Welcome to USC KIIT",
    description:
      "Get onboarded to your domain squad, claim your UiPath toolkit, and ship from week one.",
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
