import type { HackabotTrackId } from "./hackabot-data";

export interface ScheduleMilestone {
  step: string;
  phaseTag: string;
  title: string;
  venue: string;
  description: string;
}

export interface HackabotDaySchedule {
  id: "day-1" | "day-2";
  tabLabel: string;
  dateLabel: string;
  venueSummary: string;
  milestones: readonly ScheduleMilestone[];
}

export const HACKABOT_SCHEDULE: readonly HackabotDaySchedule[] = [
  {
    id: "day-1",
    tabLabel: "DAY 01 — DEC 12",
    dateLabel: "12 DECEMBER • KICKOFF & WORKSHOPS",
    venueSummary: "Campus 6 Auditorium",
    milestones: [
      {
        step: "01",
        phaseTag: "REPORTING & BRIEFING",
        title: "Check-In & Opening Ceremony",
        venue: "Campus 6 Auditorium",
        description:
          "Team squad pass verification, competition briefing by USC KIIT leads, and official launch under the Department of Training and Placement.",
      },
      {
        step: "02",
        phaseTag: "SKILL ACCELERATOR",
        title: "Interactive Technical Workshops",
        venue: "Campus 6 Auditorium",
        description:
          "Hands-on technical labs covering UiPath RPA, Agentic AI workflows, and rapid AI/ML & web innovation architecture.",
      },
      {
        step: "03",
        phaseTag: "INDUSTRY PERSPECTIVE",
        title: "Guest Engagement Session",
        venue: "Campus 6 Auditorium",
        description:
          "Interactive fireside talk, architecture insights, and Q&A with guest speakers, industry automation practitioners, and UiPath MVPs.",
      },
      {
        step: "04",
        phaseTag: "SPRINT LAUNCH",
        title: "Challenge Kickoff & 2+ SDG Alignment",
        venue: "Campus 6 Auditorium",
        description:
          "Lock in your track problem direction, map your solution to at least two UN Sustainable Development Goals, and begin prototyping.",
      },
    ],
  },
  {
    id: "day-2",
    tabLabel: "DAY 02 — DEC 13",
    dateLabel: "13 DECEMBER • SPRINT, DEMOS & FINALE",
    venueSummary: "Campus 10 Central Library & Campus 6 Auditorium",
    milestones: [
      {
        step: "01",
        phaseTag: "DEEP BUILD",
        title: "Hands-On Build Sprint & Mentor Check-Ins",
        venue: "Campus 10 Central Library",
        description:
          "Focused execution sprint where teams refine autonomous agents, AI models, and web interfaces with live mentor feedback.",
      },
      {
        step: "02",
        phaseTag: "CODE FREEZE",
        title: "Final Bot & Prototype Submissions",
        venue: "Campus 10 Central Library",
        description:
          "Freeze repositories, package workflow artifacts, verify SDG impact documentation, and submit final demo decks.",
      },
      {
        step: "03",
        phaseTag: "EVALUATION ARENA",
        title: "Live Judging Demos",
        venue: "Campus 6 Auditorium",
        description:
          "Teams present working bots and prototypes live before the judging panel, evaluated on technical depth, automation, and 2+ SDG impact.",
      },
      {
        step: "04",
        phaseTag: "GRAND FINALE",
        title: "Guest Keynote, Awards & Closing Ceremony",
        venue: "Campus 6 Auditorium",
        description:
          "Closing keynote address, winner announcements across both tracks, recognition of standout SDG impact teams, and community wrap-up.",
      },
    ],
  },
];

export interface HackabotFaqItem {
  id: string;
  question: string;
  answer: string;
}

export const HACKABOT_FAQS: readonly HackabotFaqItem[] = [
  {
    id: "fee",
    question: "How long will the event be?",
    answer:
      "The complete event duration and detailed schedule will be notified soon. Stay tuned for official updates!",
  },
  {
    id: "team-size",
    question: "What is the team size limit?",
    answer:
      "Participation is team-based with a strict maximum of 5 members per team (including the team leader). You can register with 1 to 5 members.",
  },
  {
    id: "sdg-rule",
    question: "What is the 2-SDG alignment rule?",
    answer:
      "Participants across both the RPA & AI Track and Innovation Track must design solutions aligned with at least two UN Sustainable Development Goals (SDGs), promoting technology-driven innovation for a sustainable future.",
  },
  {
    id: "venues",
    question: "Where is HACK-A-BOT 3.0 hosted?",
    answer:
      "HACK-A-BOT 3.0 is an offline competition hosted on 12–13 December across Campus 6 Auditorium and Campus 10 Central Library at KIIT University, Bhubaneswar.",
  },
  {
    id: "beginners",
    question: "Can beginners join the RPA & AI Track?",
    answer:
      "Yes! Interactive workshops on Robotic Process Automation, Agentic AI, and rapid system building — along with live mentor check-ins — are built right into the two-day schedule.",
  },
];

export const HACKABOT_VENUES = [
  {
    name: "Campus 6 Auditorium",
    role: "Ceremonies, Workshops & Demos",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=KIIT+Campus+6+Auditorium+Bhubaneswar",
  },
  {
    name: "Campus 10 Central Library",
    role: "Sprint Floor & Mentor Check-Ins",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=KIIT+Central+Library+Campus+10+Bhubaneswar",
  },
] as const;

export interface SdgVisualMeta {
  color: string;
  focus: string;
}

export const SDG_VISUAL_META: Record<string, SdgVisualMeta> = {
  "sdg-3": { color: "#4C9F38", focus: "preventive healthcare, triage & wellness access" },
  "sdg-4": { color: "#C5192D", focus: "inclusive learning & campus knowledge access" },
  "sdg-7": { color: "#FCC30B", focus: "clean energy telemetry & power optimization" },
  "sdg-8": { color: "#A21942", focus: "career readiness, upskilling & productivity" },
  "sdg-9": { color: "#FD6925", focus: "resilient automation & digital infrastructure" },
  "sdg-11": { color: "#FD9D24", focus: "smart campuses, transit & sustainable cities" },
  "sdg-12": { color: "#BF8B2E", focus: "resource efficiency & zero-waste operations" },
  "sdg-13": { color: "#3F7E44", focus: "carbon tracking & climate resilience workflows" },
  "sdg-16": { color: "#00689D", focus: "transparent governance & student services" },
};

const CURATED_SPARK_IDEAS: Record<
  string,
  { title: string; rpaAngle: string; innovationAngle: string }
> = {
  "sdg-4+sdg-9": {
    title: "Automated Campus Accessibility & Learning Pipeline",
    rpaAngle:
      "Build an agentic UiPath bot that converts lecture notes into multi-format study packs, routes lab accessibility requests, and syncs placement prep trackers automatically.",
    innovationAngle:
      "Ship an AI/ML-powered adaptive learning web platform that personalizes study roadmaps, transcribes technical sessions, and connects labs in real time.",
  },
  "sdg-3+sdg-11": {
    title: "Smart Campus Health & Emergency Dispatch Mesh",
    rpaAngle:
      "Orchestrate UiPath agents to automate hostel clinic intake, medicine inventory alerts, and instant wellness notifications across campus blocks.",
    innovationAngle:
      "Develop an ML symptom-triage and campus health telemetry dashboard mapping air quality, clinic load, and rapid response routing.",
  },
  "sdg-7+sdg-13": {
    title: "Autonomous Campus Energy & Carbon Optimizer",
    rpaAngle:
      "Deploy unattended bots that audit lab power schedules, flag HVAC anomalies, and generate weekly campus sustainability reports without manual intervention.",
    innovationAngle:
      "Create an AI forecasting web app that predicts peak hostel/lab power demand and recommends solar load balancing strategies.",
  },
  "sdg-8+sdg-9": {
    title: "Intelligent Placement & Skill-Gap Orchestrator",
    rpaAngle:
      "Build an end-to-end UiPath Maestro workflow automating resume verification, interview slot scheduling, and personalized certification nudges.",
    innovationAngle:
      "Engineer a full-stack AI career copilot matching student project portfolios to industry roles with automated mock-interview feedback.",
  },
  "sdg-11+sdg-12": {
    title: "Zero-Waste Smart Campus Resource Loop",
    rpaAngle:
      "Automate mess food-surplus tracking, vendor procurement forecasting, and instant redistribution alerts to campus volunteers via RPA.",
    innovationAngle:
      "Build a computer-vision + web logistics portal tracking cafeteria waste patterns and optimizing campus recycling routes.",
  },
};

export interface ImpactSparkResult {
  title: string;
  summary: string;
  sdgSummary: string;
}

export function getImpactSparkIdea(
  selectedSdgs: readonly string[],
  track: HackabotTrackId,
): ImpactSparkResult | null {
  if (selectedSdgs.length < 2) return null;

  const sorted = [...selectedSdgs].sort();
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const pairKey = `${sorted[i]}+${sorted[j]}`;
      const match = CURATED_SPARK_IDEAS[pairKey];
      if (match) {
        return {
          title: match.title,
          summary: track === "rpa-ai" ? match.rpaAngle : match.innovationAngle,
          sdgSummary: sorted.map((s) => s.toUpperCase()).join(" + "),
        };
      }
    }
  }

  const first = SDG_VISUAL_META[sorted[0] ?? ""]?.focus ?? "high-impact sustainability";
  const second = SDG_VISUAL_META[sorted[1] ?? ""]?.focus ?? "community resilience";

  if (track === "rpa-ai") {
    return {
      title: "Agentic Multi-SDG Automation Orchestrator",
      summary: `Combine UiPath Studio and Agentic AI to bridge ${first} with ${second} — automating cross-system data intake, anomaly alerts, and stakeholder action queues.`,
      sdgSummary: sorted.map((s) => s.toUpperCase()).join(" + "),
    };
  }

  return {
    title: "AI/ML & Full-Stack Sustainability System",
    summary: `Build an intelligent web + ML product connecting ${first} and ${second} with predictive analytics, real-time citizen/campus dashboards, and measurable SDG telemetry.`,
    sdgSummary: sorted.map((s) => s.toUpperCase()).join(" + "),
  };
}
