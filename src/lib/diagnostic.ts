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
        weights: { "rpa-ai": 3, "aiml-data": 2 },
      },
      {
        key: "B",
        label: "Build the Live Web Interface",
        detail: "Spin up a fast full-stack app so judges can test it in real time.",
        stackBadge: "SYSTEM DESIGN",
        weights: { "web-app": 3, "rpa-ai": 1 },
      },
      {
        key: "C",
        label: "Craft the Visual Identity & Deck",
        detail: "Design the UI, brand system, and crisp demo visuals that win rooms.",
        stackBadge: "VISUAL CRAFT",
        weights: { "uiux-design": 3, "video-cinema": 2 },
      },
      {
        key: "D",
        label: "Orchestrate the Squad & Pitch",
        detail: "Keep milestones on track, own the narrative, and close the final pitch.",
        stackBadge: "LEADERSHIP",
        weights: { "events-ops": 3, "marketing-pr": 2, "content-tech": 1 },
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
        detail: "Automate attendance, certificates, and follow-ups with zero spreadsheets.",
        stackBadge: "WORKFLOW OPS",
        weights: { "rpa-ai": 3, "events-ops": 1 },
      },
      {
        key: "B",
        label: "Train a Smart Campus Copilot",
        detail: "Build an LLM + vision pipeline that answers student queries instantly.",
        stackBadge: "NEURAL PIPELINES",
        weights: { "aiml-data": 3, "web-app": 1 },
      },
      {
        key: "C",
        label: "Turn Dry Tech into Viral Stories",
        detail: "Write punchy guides and cut cinematic reels students actually share.",
        stackBadge: "STORYTELLING",
        weights: { "content-tech": 3, "video-cinema": 2 },
      },
      {
        key: "D",
        label: "Pack a 600-Seat Auditorium",
        detail: "Run campus hype, bring in top sponsors, and fill every single row.",
        stackBadge: "GROWTH ENGINE",
        weights: { "marketing-pr": 3, "events-ops": 2 },
      },
    ],
  },
  {
    id: 3,
    prompt: "Pick the workspace tab you naturally lose three hours inside:",
    options: [
      {
        key: "A",
        label: "Flowchart & Agent Orchestrator",
        detail: "Debugging conditional branches, queues, and autonomous retries.",
        stackBadge: "BOT ARCHITECTURE",
        weights: { "rpa-ai": 3, "aiml-data": 1 },
      },
      {
        key: "B",
        label: "Code Editor + Terminal Split",
        detail: "Shipping TypeScript components, shaders, and snappy API endpoints.",
        stackBadge: "FULL-STACK CODE",
        weights: { "web-app": 3, "aiml-data": 1 },
      },
      {
        key: "C",
        label: "Figma Canvas or Timeline Cut",
        detail: "Tweaking typography, keyframes, color grading, and micro-motion.",
        stackBadge: "MOTION & UI",
        weights: { "uiux-design": 2, "video-cinema": 3 },
      },
      {
        key: "D",
        label: "Notion Runbook & Sponsor CRM",
        detail: "Editorial calendars, speaker schedules, and crisp written briefs.",
        stackBadge: "EDITORIAL OPS",
        weights: { "content-tech": 2, "events-ops": 2, "marketing-pr": 2 },
      },
    ],
  },
  {
    id: 4,
    prompt: "A flagship MAESTROVA keynote goes live in 48 hours. Where do you shine?",
    options: [
      {
        key: "A",
        label: "Stress-Test the Live Demo Bot",
        detail: "Guarantee the live Maestro workflow executes on stage in under a second.",
        stackBadge: "DEMO RELIABILITY",
        weights: { "rpa-ai": 2, "aiml-data": 2, "web-app": 1 },
      },
      {
        key: "B",
        label: "Direct the Teaser & Stage Visuals",
        detail: "Drop a 45-second hype trailer and high-contrast auditorium screens.",
        stackBadge: "CINEMA GRADE",
        weights: { "video-cinema": 3, "uiux-design": 2 },
      },
      {
        key: "C",
        label: "Script the Keynote & Docs",
        detail: "Craft the speaker narrative, lab handbook, and post-event breakdown.",
        stackBadge: "TECH NARRATIVE",
        weights: { "content-tech": 3, "marketing-pr": 1 },
      },
      {
        key: "D",
        label: "Command Check-In & Stage Flow",
        detail: "Coordinate volunteers, mics, timing, and seamless sponsor booths.",
        stackBadge: "COMMAND CENTER",
        weights: { "events-ops": 3, "marketing-pr": 1 },
      },
    ],
  },
  {
    id: 5,
    prompt: "What kind of compliment makes your entire week?",
    options: [
      {
        key: "A",
        label: "\"Your bot just saved us 12 hours!\"",
        detail: "Seeing real people freed from repetitive work by your automation.",
        stackBadge: "ZERO FRICTION",
        weights: { "rpa-ai": 3, "aiml-data": 2 },
      },
      {
        key: "B",
        label: "\"This site feels Awwwards-level!\"",
        detail: "When smooth interaction and razor-sharp visuals stop people mid-scroll.",
        stackBadge: "CRAFT OBSESSED",
        weights: { "web-app": 2, "uiux-design": 3 },
      },
      {
        key: "C",
        label: "\"That reel / article got me hooked!\"",
        detail: "Sparking curiosity in hundreds of students through story and pacing.",
        stackBadge: "AUDIENCE PULSE",
        weights: { "video-cinema": 2, "content-tech": 2, "marketing-pr": 2 },
      },
      {
        key: "D",
        label: "\"Smoothest event KIIT has seen!\"",
        detail: "Pulling off an ambitious campus summit where every detail clicks.",
        stackBadge: "EXECUTION PRO",
        weights: { "events-ops": 3, "marketing-pr": 2 },
      },
    ],
  },
  {
    id: 6,
    prompt: "Pick the superpower you want to level up most at USC KIIT:",
    options: [
      {
        key: "A",
        label: "Agentic AI & Intelligent Models",
        detail: "Master UiPath Maestro, LLMs, and autonomous multi-step systems.",
        stackBadge: "AI MASTERY",
        weights: { "aiml-data": 3, "rpa-ai": 2 },
      },
      {
        key: "B",
        label: "Production Full-Stack & 3D Web",
        detail: "Ship resilient apps, interactive canvases, and developer tooling.",
        stackBadge: "SHIP FAST",
        weights: { "web-app": 3, "uiux-design": 1 },
      },
      {
        key: "C",
        label: "Design Systems & Visual Direction",
        detail: "Own brand identity, motion design, and editorial craft end-to-end.",
        stackBadge: "BRAND CRAFT",
        weights: { "uiux-design": 2, "video-cinema": 2, "content-tech": 2 },
      },
      {
        key: "D",
        label: "Community Leadership & Partnerships",
        detail: "Lead cross-domain teams, pitch global partners, and scale impact.",
        stackBadge: "SCALE IMPACT",
        weights: { "marketing-pr": 3, "events-ops": 3 },
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
    "web-app": 0,
    "aiml-data": 0,
    "uiux-design": 0,
    "content-tech": 0,
    "marketing-pr": 0,
    "video-cinema": 0,
    "events-ops": 0,
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