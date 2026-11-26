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