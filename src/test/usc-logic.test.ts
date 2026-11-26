import { describe, expect, it } from "vitest";
import { computeDiagnosticResult, validateApplication, validateKiitEmail } from "@/lib/diagnostic";
import {
  getHackabotPhase,
  REG_CLOSE_MS,
  REG_OPEN_MS,
  splitCountdown,
  validateHackabotRegistration,
} from "@/lib/hackabot-data";
import { getImpactSparkIdea } from "@/lib/hackabot-schedule";

describe("USC KIIT Diagnostic scoring", () => {
  it("matches RPA & Agentic AI when automation-focused answers dominate", () => {
    const result = computeDiagnosticResult(["A", "A", "A", "A", "A", "A"]);
    expect(result.primary.id).toBe("rpa-ai");
    expect(result.codename).toBe("Orchestrator Prime");
    expect(result.primaryMatch).toBeGreaterThanOrEqual(82);
    expect(result.secondaryMatch).toBeLessThan(result.primaryMatch);
    expect(result.stackBadges).toHaveLength(6);
  });

  it("matches SPEO when leadership and ops answers dominate", () => {
    const result = computeDiagnosticResult(["D", "D", "D", "D", "D", "D"]);
    expect(result.primary.id).toBe("speo");
    expect(result.secondary.id).toBe("corporate-relations");
  });
});

describe("KIIT application validation", () => {
  it("accepts valid @kiit.ac.in emails and rejects external domains", () => {
    expect(validateKiitEmail("22051234@kiit.ac.in")).toBe(true);
    expect(validateKiitEmail("student@gmail.com")).toBe(false);
    expect(validateKiitEmail("student@kiit.ac.in.fake.com")).toBe(false);
  });

  it("flags invalid roll number, duplicate domains, and malformed portfolio URLs", () => {
    const errors = validateApplication({
      fullName: "A",
      rollNumber: "abc",
      email: "me@gmail.com",
      yearBranch: "",
      primaryDomain: "web-dev",
      secondaryDomain: "web-dev",
      portfolioUrl: "not-a-url",
    });

    expect(errors.fullName).toBeDefined();
    expect(errors.rollNumber).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.yearBranch).toBeDefined();
    expect(errors.secondaryDomain).toBeDefined();
    expect(errors.portfolioUrl).toBeDefined();
  });

  it("passes with valid KIIT applicant details", () => {
    const errors = validateApplication({
      fullName: "Debayan Samal",
      rollNumber: "22051842",
      email: "22051842@kiit.ac.in",
      yearBranch: "3rd Year, CSE",
      primaryDomain: "rpa-ai",
      secondaryDomain: "web-dev",
      portfolioUrl: "https://github.com/debayan",
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });
});

describe("HACK-A-BOT 3.0 countdown & registration rules", () => {
  it("transitions phases across 2 Dec, 11 Dec, and 12 Dec 2026 IST", () => {
    expect(getHackabotPhase(REG_OPEN_MS - 1000).phase).toBe("pre-reg");
    expect(getHackabotPhase(REG_OPEN_MS + 1000).phase).toBe("reg-open");
    expect(getHackabotPhase(REG_CLOSE_MS + 5000).phase).toBe("live");
    expect(splitCountdown(90061000)).toEqual({
      days: "01",
      hours: "01",
      minutes: "01",
      seconds: "01",
    });
  });

  it("enforces at least 2 SDGs and maximum 5 total team members", () => {
    const errors = validateHackabotRegistration({
      teamName: "BotForge",
      track: "rpa-ai",
      selectedSdgs: ["sdg-3"],
      leaderName: "Aarav",
      leaderRollOrInstitute: "22051234",
      leaderEmail: "aarav@kiit.ac.in",
      leaderPhone: "7583938389",
      members: [
        { name: "M1", rollOrInstitute: "22050001", email: "m1@kiit.ac.in" },
        { name: "M2", rollOrInstitute: "22050002", email: "m2@kiit.ac.in" },
        { name: "M3", rollOrInstitute: "22050003", email: "m3@kiit.ac.in" },
        { name: "M4", rollOrInstitute: "22050004", email: "m4@kiit.ac.in" },
        { name: "M5", rollOrInstitute: "22050005", email: "m5@kiit.ac.in" },
      ],
    });
    expect(errors["selectedSdgs"]).toBeDefined();
    expect(errors["members"]).toBeDefined();
  });

  it("accepts a valid 3-member team with 2 SDGs", () => {
    const errors = validateHackabotRegistration({
      teamName: "Maestro Squad",
      track: "innovation",
      selectedSdgs: ["sdg-4", "sdg-9"],
      leaderName: "Debayan Samal",
      leaderRollOrInstitute: "22051842",
      leaderEmail: "22051842@kiit.ac.in",
      leaderPhone: "7583938389",
      members: [
        { name: "Riya Sen", rollOrInstitute: "22051843", email: "riya@kiit.ac.in" },
        { name: "Kabir Das", rollOrInstitute: "22051844", email: "kabir@kiit.ac.in" },
      ],
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("generates track-specific Impact Spark ideas once 2+ SDGs are selected", () => {
    expect(getImpactSparkIdea(["sdg-4"], "rpa-ai")).toBeNull();

    const rpaSpark = getImpactSparkIdea(["sdg-4", "sdg-9"], "rpa-ai");
    expect(rpaSpark?.title).toContain("Accessibility");
    expect(rpaSpark?.summary).toContain("UiPath");

    const innovationSpark = getImpactSparkIdea(["sdg-3", "sdg-16"], "innovation");
    expect(innovationSpark).not.toBeNull();
    expect(innovationSpark?.sdgSummary).toContain("SDG-16");
  });
});
