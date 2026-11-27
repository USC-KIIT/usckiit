export type HackabotTrackId = "rpa-ai" | "innovation";

export interface HackabotTrack {
  id: HackabotTrackId;
  code: string;
  title: string;
  description: string;
  tags: readonly string[];
  accent: "flame" | "cobalt";
  ctaLabel: string;
}

export interface SdgGoal {
  id: string;
  code: string;
  title: string;
}

export interface EventContact {
  name: string;
  phone: string;
  telHref: string;
}

export interface HackabotMember {
  name: string;
  rollOrInstitute: string;
  email: string;
}

export interface HackabotRegistrationPayload {
  teamName: string;
  track: HackabotTrackId;
  selectedSdgs: readonly string[];
  leaderName: string;
  leaderRollOrInstitute: string;
  leaderEmail: string;
  leaderPhone: string;
  members: readonly HackabotMember[];
}

export const HACKABOT_MAX_MEMBERS = 5;
export const HACKABOT_MIN_SDGS = 2;

// IST (+05:30) timestamps for HACK-A-BOT 3.0 (December 2026)
export const REG_OPEN_MS = Date.parse("2026-12-02T00:00:00+05:30");
export const REG_CLOSE_MS = Date.parse("2026-12-11T23:59:59+05:30");
export const EVENT_START_MS = Date.parse("2026-12-12T00:00:00+05:30");

export type HackabotPhase = "pre-reg" | "reg-open" | "live";

export interface HackabotPhaseState {
  phase: HackabotPhase;
  label: string;
  ctaLabel: string;
  targetMs: number;
  regProgressPct: number;
}

export function getHackabotPhase(nowMs: number): HackabotPhaseState {
  if (nowMs < REG_OPEN_MS) {
    return {
      phase: "pre-reg",
      label: "REGISTRATIONS OPEN IN",
      ctaLabel: "PRE-REGISTER / NOTIFY TEAM",
      targetMs: REG_OPEN_MS,
      regProgressPct: 12,
    };
  }
  if (nowMs <= REG_CLOSE_MS) {
    const span = REG_CLOSE_MS - REG_OPEN_MS;
    const elapsed = Math.max(0, nowMs - REG_OPEN_MS);
    const pct = Math.min(100, Math.max(8, Math.round((elapsed / span) * 100)));
    return {
      phase: "reg-open",
      label: "REGISTRATIONS CLOSE IN",
      ctaLabel: "REGISTER YOUR TEAM",
      targetMs: REG_CLOSE_MS,
      regProgressPct: pct,
    };
  }
  return {
    phase: "live",
    label: "HACK-A-BOT 3.0 IS LIVE",
    ctaLabel: "REGISTER TEAM",
    targetMs: EVENT_START_MS,
    regProgressPct: 100,
  };
}

export interface CountdownParts {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export function splitCountdown(diffMs: number): CountdownParts {
  const safe = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(safe / 86400);
  const hours = Math.floor((safe % 86400) / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export const HACKABOT_TRACKS: readonly HackabotTrack[] = [
  {
    id: "rpa-ai",
    code: "TRACK 01",
    title: "RPA & AI TRACK",
    description:
      "Focused on Robotic Process Automation, Agentic AI, and intelligent automation solutions.",
    tags: ["Robotic Process Automation", "Agentic AI", "Intelligent Automation", "UiPath"],
    accent: "flame",
    ctaLabel: "Register for RPA & AI Track",
  },
  {
    id: "innovation",
    code: "TRACK 02",
    title: "INNOVATION TRACK",
    description:
      "Focused on Artificial Intelligence, Machine Learning (AI/ML), and Web Development to build innovative, real-world solutions.",
    tags: ["AI / ML", "Web Development", "Real-World Solutions", "Innovation"],
    accent: "cobalt",
    ctaLabel: "Register for Innovation Track",
  },
];

export const UN_SDGS: readonly SdgGoal[] = [
  { id: "sdg-3", code: "SDG 3", title: "Good Health" },
  { id: "sdg-4", code: "SDG 4", title: "Quality Education" },
  { id: "sdg-7", code: "SDG 7", title: "Clean Energy" },
  { id: "sdg-8", code: "SDG 8", title: "Decent Work" },
  { id: "sdg-9", code: "SDG 9", title: "Industry & Innovation" },
  { id: "sdg-11", code: "SDG 11", title: "Sustainable Cities" },
  { id: "sdg-12", code: "SDG 12", title: "Responsible Consumption" },
  { id: "sdg-13", code: "SDG 13", title: "Climate Action" },
  { id: "sdg-16", code: "SDG 16", title: "Strong Institutions" },
];

export const HACKABOT_HIGHLIGHTS = [
  {
    title: "Interactive Workshops",
    detail:
      "Live hands-on sessions on UiPath Agentic AI, automation architecture, and rapid prototyping.",
  },
  {
    title: "Hands-On Challenges",
    detail: "Two-day multi-track sprint turning SDG problem statements into working, judged demos.",
  },
  {
    title: "Exciting Guest Engagements",
    detail:
      "Direct mentorship, fireside chats, and live reviews from industry leaders and UiPath MVPs.",
  },
] as const;

export const HACKABOT_CONTACTS: readonly EventContact[] = [
  { name: "Souvik Ghosh", phone: "7583938389", telHref: "tel:+917583938389" },
  { name: "Ritrisha Patra", phone: "7908385705", telHref: "tel:+917908385705" },
  { name: "Shristi Buzarbaruah", phone: "8822347227", telHref: "tel:+918822347227" },
  { name: "Dwipayan Patra", phone: "8167845294", telHref: "tel:+918167845294" },
];

export function validateHackabotRegistration(
  payload: HackabotRegistrationPayload,
): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};

  if (payload.teamName.trim().length < 2) {
    errors["teamName"] = "Enter your team name.";
  }
  if (payload.selectedSdgs.length < HACKABOT_MIN_SDGS) {
    errors["selectedSdgs"] = "Select at least 2 UN Sustainable Development Goals.";
  }
  if (payload.leaderName.trim().length < 2) {
    errors["leaderName"] = "Enter the team leader's full name.";
  }
  if (payload.leaderRollOrInstitute.trim().length < 2) {
    errors["leaderRollOrInstitute"] = "Enter roll number or institute name.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.leaderEmail.trim())) {
    errors["leaderEmail"] = "Enter a valid email address.";
  }
  if (!/^\+?\d{10,13}$/.test(payload.leaderPhone.replace(/[\s-]/g, ""))) {
    errors["leaderPhone"] = "Enter a valid 10-digit phone number.";
  }
  if (payload.members.length + 1 > HACKABOT_MAX_MEMBERS) {
    errors["members"] = `Maximum ${HACKABOT_MAX_MEMBERS} members allowed including leader.`;
  }
  payload.members.forEach((member, idx) => {
    if (member.name.trim().length < 2) {
      errors[`member-${idx}-name`] = "Enter member name.";
    }
    if (member.rollOrInstitute.trim().length < 2) {
      errors[`member-${idx}-roll`] = "Enter roll no. or institute.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email.trim())) {
      errors[`member-${idx}-email`] = "Enter a valid email.";
    }
  });

  return errors;
}
