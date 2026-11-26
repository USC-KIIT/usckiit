import { USC_DOMAINS, type DomainId, type DomainInfo } from "./usc-data";

export interface DiagnosticOption {
  key: "A" | "B" | "C" | "D";
  label: string;
  detail: string;
  stackBadge: string;
  weights: Partial<Record<DomainId, number>>;
}

export interface DiagnosticQuestion {
  id: number;
  prompt: string;
  options: readonly DiagnosticOption[];
}

export const DIAGNOSTIC_QUESTIONS: readonly DiagnosticQuestion[] = [
  {
    id: 1,
    prompt: "A 24-hour KIIT hackathon kicks off at 8 PM. What role do you grab first?",
    options: [
      {
        key: "A",
        label: "Wire the Autonomous Bot Core",
        detail: "Map triggers, connect APIs, and let UiPath agents handle the grind.",
        stackBadge: "AGENTIC LOGIC",
        weights: { "rpa-ai": 3, "core-ml": 2, "cloud-automation": 1 },
      },
      {
        key: "B",
        label: "Build the Live Web & Data Interface",
        detail: "Spin up a fast full-stack app & live analytics so judges can test it.",
        stackBadge: "SYSTEM DESIGN",
        weights: { "web-dev": 3, "data-analytics": 2, rnd: 1 },
      },
      {
        key: "C",
        label: "Craft the Visual Identity & Reel",
        detail: "Design the UI, brand system, and crisp demo visuals that win rooms.",
        stackBadge: "VISUAL CRAFT",
        weights: { "graphic-design": 3, "media-production": 2, "content-writing": 1 },
      },
      {
        key: "D",
        label: "Orchestrate the Squad & Pitch",
        detail: "Keep milestones on track, own the narrative, and close the final pitch.",
        stackBadge: "LEADERSHIP",
        weights: { speo: 3, "corporate-relations": 2, "media-strategy": 1 },
      },
    ],
  },
  {
    id: 2,
    prompt: "Which campus problem would you love to solve this semester?",
    options: [
      {
        key: "A",
        label: "Eliminate Manual Registration Chaos",
        detail: "Automate attendance, cloud orchestrators, and follow-ups with zero spreadsheets.",
        stackBadge: "WORKFLOW OPS",
        weights: { "rpa-ai": 3, "cloud-automation": 2 },
      },
      {
        key: "B",
        label: "Train a Smart Campus Copilot & Insights",
        detail: "Build an ML + data pipeline that answers student queries and tracks impact.",
        stackBadge: "NEURAL PIPELINES",
        weights: { "core-ml": 3, "data-analytics": 2, rnd: 2 },
      },
      {
        key: "C",
        label: "Turn Dry Tech into Viral Stories",
        detail: "Write punchy guides and cut cinematic reels students actually share.",
        stackBadge: "STORYTELLING",
        weights: { "content-writing": 3, "media-production": 2, "media-strategy": 2 },
      },
      {
        key: "D",
        label: "Pack a 600-Seat Auditorium",
        detail: "Run campus hype, bring in top sponsors, and fill every single row.",
        stackBadge: "GROWTH ENGINE",
        weights: { speo: 3, "corporate-relations": 2, "media-strategy": 2 },
      },
    ],
  },
  {
    id: 3,
    prompt: "Pick the workspace tab you naturally lose three hours inside:",
    options: [
      {
        key: "A",
        label: "Flowchart, Cloud Ops & Orchestrator",
        detail: "Debugging conditional branches, queues, CI/CD, and autonomous retries.",
        stackBadge: "BOT ARCHITECTURE",
        weights: { "rpa-ai": 3, "cloud-automation": 3 },
      },
      {
        key: "B",
        label: "Code Editor, Notebooks & Research",
        detail: "Shipping TypeScript apps, training models, or dissecting arXiv papers.",
        stackBadge: "FULL-STACK & R&D",
        weights: { "web-dev": 3, "core-ml": 2, rnd: 2, "data-analytics": 1 },
      },
      {
        key: "C",
        label: "Figma Canvas or Timeline Cut",
        detail: "Tweaking typography, keyframes, color grading, and micro-motion.",
        stackBadge: "MOTION & UI",
        weights: { "graphic-design": 3, "media-production": 3 },
      },
      {
        key: "D",
        label: "Notion Runbook, Copy & Sponsor CRM",
        detail: "Editorial calendars, speaker outreach, and crisp written briefs.",
        stackBadge: "EDITORIAL & OPS",
        weights: { "content-writing": 2, speo: 2, "corporate-relations": 2, "media-strategy": 2 },
      },
    ],
  },
  {
    id: 4,
    prompt: "A flagship HACK-A-BOT keynote goes live in 48 hours. Where do you shine?",
    options: [
      {
        key: "A",
        label: "Stress-Test the Live Demo Bot & Cloud",
        detail: "Guarantee the live Maestro workflow executes on stage with zero downtime.",
        stackBadge: "DEMO RELIABILITY",
        weights: { "rpa-ai": 2, "cloud-automation": 2, "web-dev": 1 },
      },
      {
        key: "B",
        label: "Direct the Teaser & Stage Visuals",
        detail: "Drop a 45-second hype trailer and high-contrast auditorium screens.",
        stackBadge: "CINEMA GRADE",
        weights: { "media-production": 3, "graphic-design": 2 },
      },
      {
        key: "C",
        label: "Script the Keynote & Launch Campaign",
        detail: "Craft the speaker narrative, social rollout, and post-event breakdown.",
        stackBadge: "TECH NARRATIVE",
        weights: { "content-writing": 3, "media-strategy": 2 },
      },
      {
        key: "D",
        label: "Command Check-In, Mentors & Stage Flow",
        detail: "Coordinate volunteers, industry judges, and seamless sponsor booths.",
        stackBadge: "COMMAND CENTER",
        weights: { speo: 3, "corporate-relations": 2 },
      },
    ],
  },
  {
    id: 5,
    prompt: "What kind of compliment makes your entire week?",
    options: [
      {
        key: "A",
        label: '"Your bot just saved us 12 hours!"',
        detail: "Seeing real people freed from repetitive work by your automation.",
        stackBadge: "ZERO FRICTION",
        weights: { "rpa-ai": 3, "cloud-automation": 2, "data-analytics": 1 },
      },
      {
        key: "B",
        label: '"This platform & model feels next-gen!"',
        detail: "When smooth interaction, data insights, or smart AI stop people mid-scroll.",
        stackBadge: "CRAFT OBSESSED",
        weights: { "web-dev": 2, "core-ml": 2, "graphic-design": 2, rnd: 2 },
      },
      {
        key: "C",
        label: '"That reel / campaign got me hooked!"',
        detail: "Sparking curiosity in hundreds of students through story and reach.",
        stackBadge: "AUDIENCE PULSE",
        weights: { "media-production": 2, "content-writing": 2, "media-strategy": 3 },
      },
      {
        key: "D",
        label: '"Smoothest event & partners KIIT has seen!"',
        detail: "Pulling off an ambitious campus summit where every detail clicks.",
        stackBadge: "EXECUTION PRO",
        weights: { speo: 3, "corporate-relations": 3 },
      },
    ],
  },
  {
    id: 6,
    prompt: "Pick the superpower you want to level up most at USC KIIT:",
    options: [
      {
        key: "A",
        label: "Agentic AI, ML & Cloud Systems",
        detail: "Master UiPath Maestro, deep learning, and scalable cloud pipelines.",
        stackBadge: "AI & CLOUD",
        weights: { "rpa-ai": 2, "core-ml": 3, "cloud-automation": 2, rnd: 2 },
      },
      {
        key: "B",
        label: "Production Full-Stack & Data Analytics",
        detail: "Ship resilient apps, BI dashboards, and data-driven tooling.",
        stackBadge: "SHIP & ANALYZE",
        weights: { "web-dev": 3, "data-analytics": 3 },
      },
      {
        key: "C",
        label: "Design Systems, Cinema & Storytelling",
        detail: "Own brand identity, motion design, and editorial craft end-to-end.",
        stackBadge: "BRAND CRAFT",
        weights: { "graphic-design": 3, "media-production": 2, "content-writing": 2 },
      },
      {
        key: "D",
        label: "Operations, Corporate Outreach & Growth",
        detail: "Lead flagship events, pitch industry partners, and scale digital reach.",
        stackBadge: "SCALE IMPACT",
        weights: { speo: 3, "corporate-relations": 3, "media-strategy": 2 },
      },
    ],
  },
];

export interface DiagnosticResult {
  primary: DomainInfo;
  primaryMatch: number;
  secondary: DomainInfo;
  secondaryMatch: number;
  codename: string;
  stackBadges: string[];
}

export function computeDiagnosticResult(
  selectedKeys: readonly ("A" | "B" | "C" | "D")[],
): DiagnosticResult {
  const scores: Record<DomainId, number> = {
    "rpa-ai": 0,
    "core-ml": 0,
    "web-dev": 0,
    "data-analytics": 0,
    "cloud-automation": 0,
    rnd: 0,
    "graphic-design": 0,
    speo: 0,
    "media-production": 0,
    "corporate-relations": 0,
    "content-writing": 0,
    "media-strategy": 0,
  };
  const stackBadges: string[] = [];

  DIAGNOSTIC_QUESTIONS.forEach((question, index) => {
    const chosenKey = selectedKeys[index];
    if (!chosenKey) return;
    const option = question.options.find((item) => item.key === chosenKey);
    if (!option) return;
    stackBadges.push(option.stackBadge);
    for (const [domainId, weight] of Object.entries(option.weights) as [DomainId, number][]) {
      scores[domainId] = (scores[domainId] ?? 0) + weight;
    }
  });

  const ranked = [...USC_DOMAINS].sort((a, b) => scores[b.id] - scores[a.id]);
  const primary = ranked[0] ?? USC_DOMAINS[0]!;
  const secondary = ranked[1] ?? USC_DOMAINS[1]!;

  const topScore = Math.max(scores[primary.id], 1);
  const secondScore = scores[secondary.id];

  const primaryMatch = Math.min(98, Math.max(82, 74 + Math.round((topScore / 15) * 24)));
  const secondaryMatch = Math.min(
    primaryMatch - 4,
    Math.max(64, Math.round((secondScore / topScore) * primaryMatch)),
  );

  return {
    primary,
    primaryMatch,
    secondary,
    secondaryMatch,
    codename: primary.codename,
    stackBadges,
  };
}

export interface ApplicationPayload {
  fullName: string;
  rollNumber: string;
  email: string;
  yearBranch: string;
  primaryDomain: DomainId;
  secondaryDomain: DomainId | "";
  portfolioUrl: string;
}

export function validateKiitEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  return /^[a-z0-9._%+-]+@kiit\.ac\.in$/.test(trimmed);
}

export function validateApplication(
  payload: ApplicationPayload,
): Partial<Record<keyof ApplicationPayload, string>> {
  const errors: Partial<Record<keyof ApplicationPayload, string>> = {};

  if (payload.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name.";
  }
  if (!/^\d{6,10}$/.test(payload.rollNumber.trim())) {
    errors.rollNumber = "Enter a valid KIIT roll number (6–10 digits).";
  }
  if (!validateKiitEmail(payload.email)) {
    errors.email = "Use your official @kiit.ac.in email address.";
  }
  if (payload.yearBranch.trim().length < 2) {
    errors.yearBranch = "Enter your year and branch (e.g. 2nd Year, CSE).";
  }
  if (payload.secondaryDomain && payload.secondaryDomain === payload.primaryDomain) {
    errors.secondaryDomain = "Secondary domain should differ from primary.";
  }
  if (payload.portfolioUrl.trim()) {
    try {
      const parsed = new URL(payload.portfolioUrl.trim());
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        errors.portfolioUrl = "Use a valid http:// or https:// URL.";
      }
    } catch {
      errors.portfolioUrl = "Enter a valid URL (e.g. https://github.com/you).";
    }
  }

  return errors;
}
