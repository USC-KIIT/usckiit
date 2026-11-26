import { useMemo, useState, type FormEvent, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Copy, Cpu, Download, Plus, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  HACKABOT_MAX_MEMBERS,
  HACKABOT_MIN_SDGS,
  HACKABOT_TRACKS,
  UN_SDGS,
  validateHackabotRegistration,
  type HackabotMember,
  type HackabotTrackId,
} from "@/lib/hackabot-data";
import { useHackabotCountdown } from "@/lib/use-hackabot-countdown";

interface HackabotRegisterProps {
  selectedTrack: HackabotTrackId;
  onChangeTrack: (trackId: HackabotTrackId) => void;
  selectedSdgs: readonly string[];
  onToggleSdg: (sdgId: string) => void;
}

function computePassCode(teamName: string, email: string): string {
  const seed = `${teamName.trim().toUpperCase()}|${email.trim().toLowerCase()}`;
  if (!seed || seed === "|") return "HAB3-2026";
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33) ^ seed.charCodeAt(i);
  }
  const code = Math.abs(hash % 9000) + 1000;
  return `HAB3-${code}`;
}

function downloadSquadPassPng(params: {
  passId: string;
  teamName: string;
  trackTitle: string;
  trackAccent: "flame" | "cobalt";
  sdgCodes: readonly string[];
  leaderName: string;
  totalMembers: number;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 680;
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  // Obsidian background
  ctx.fillStyle = "#090A0F";
  ctx.fillRect(0, 0, 1200, 680);

  // Subtle accent radial glow
  const grad = ctx.createRadialGradient(980, 120, 40, 980, 120, 540);
  grad.addColorStop(
    0,
    params.trackAccent === "flame" ? "rgba(250, 70, 22, 0.34)" : "rgba(0, 103, 223, 0.34)",
  );
  grad.addColorStop(1, "rgba(9, 10, 15, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 680);

  // Border frame
  ctx.strokeStyle = params.trackAccent === "flame" ? "#FA4616" : "#0067DF";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(28, 28, 1144, 624, 28);
  ctx.stroke();

  // Header metadata
  ctx.fillStyle = "#FA4616";
  ctx.font = "600 20px 'JetBrains Mono', monospace";
  ctx.fillText("USC KIIT • HACK-A-BOT 3.0 OFFICIAL SQUAD PASS", 72, 92);

  ctx.fillStyle = "#3D9960";
  ctx.font = "700 22px 'JetBrains Mono', monospace";
  ctx.fillText("REGISTERED ✓", 950, 92);

  // Team Name
  ctx.fillStyle = "#FAF6EE";
  ctx.font = "700 66px 'Space Grotesk', sans-serif";
  ctx.fillText((params.teamName || "SQUAD TEAM").toUpperCase(), 72, 188, 1040);

  // Track + Pass ID
  ctx.fillStyle = params.trackAccent === "flame" ? "#FF6B00" : "#38BDF8";
  ctx.font = "600 26px 'JetBrains Mono', monospace";
  ctx.fillText(`${params.trackTitle}  •  PASS ID: ${params.passId}`, 72, 246);

  // Details block
  ctx.fillStyle = "rgba(250, 246, 238, 0.78)";
  ctx.font = "500 22px 'Space Grotesk', sans-serif";
  ctx.fillText(`TEAM LEADER: ${params.leaderName || "TBD"}`, 72, 330);
  ctx.fillText(
    `SQUAD ROSTER: ${params.totalMembers} / ${HACKABOT_MAX_MEMBERS} MEMBERS  •  ENTRY FEE: ₹0 (FREE)`,
    72,
    376,
  );
  ctx.fillText(`UN SDGs: ${params.sdgCodes.join(", ") || "2+ SDGs MANDATORY"}`, 72, 422);

  // Footer strip
  ctx.strokeStyle = "rgba(250, 246, 238, 0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(72, 500);
  ctx.lineTo(1128, 500);
  ctx.stroke();

  ctx.fillStyle = "rgba(250, 246, 238, 0.7)";
  ctx.font = "500 20px 'JetBrains Mono', monospace";
  ctx.fillText("DEC 12–13, 2026 • CAMPUS 6 AUDITORIUM & CAMPUS 10 CENTRAL LIBRARY", 72, 558);
  ctx.fillText("UNDER THE DEPARTMENT OF TRAINING AND PLACEMENT, KIIT UNIVERSITY", 72, 596);

  const link = document.createElement("a");
  const slug = (params.teamName || "team")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  link.download = `hackabot-3-pass-${slug || "squad"}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  return true;
}

const BARCODE_BARS = [
  3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2,
] as const;

export function HackabotRegister({
  selectedTrack,
  onChangeTrack,
  selectedSdgs,
  onToggleSdg,
}: HackabotRegisterProps) {
  const { phaseState } = useHackabotCountdown();

  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderRollOrInstitute, setLeaderRollOrInstitute] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [members, setMembers] = useState<HackabotMember[]>([]);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0, active: false });

  const totalMembers = 1 + members.length;
  const trackInfo = HACKABOT_TRACKS.find((t) => t.id === selectedTrack) ?? HACKABOT_TRACKS[0]!;
  const isFlameTrack = trackInfo.accent === "flame";

  const passId = useMemo(() => computePassCode(teamName, leaderEmail), [teamName, leaderEmail]);

  const selectedSdgObjects = useMemo(
    () => UN_SDGS.filter((s) => selectedSdgs.includes(s.id)),
    [selectedSdgs],
  );

  const addMember = () => {
    if (totalMembers >= HACKABOT_MAX_MEMBERS) return;
    setMembers((prev) => [...prev, { name: "", rollOrInstitute: "", email: "" }]);
  };

  const updateMember = (idx: number, field: keyof HackabotMember, value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  };

  const removeMember = (idx: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validateHackabotRegistration({
      teamName,
      track: selectedTrack,
      selectedSdgs,
      leaderName,
      leaderRollOrInstitute,
      leaderEmail,
      leaderPhone,
      members,
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Check the highlighted fields to complete registration.");
      return;
    }
    setErrors({});
    setSubmitted(true);
    toast.success("Team Registered for HACK-A-BOT 3.0!", {
      description: `Squad Pass ${passId} issued (${trackInfo.title}).`,
    });
  };

  const handleCopySummary = async () => {
    const sdgList = selectedSdgObjects.map((s) => `${s.code}: ${s.title}`).join(", ");
    const summary = [
      `HACK-A-BOT 3.0 — OFFICIAL SQUAD PASS (${passId})`,
      `Status: ${submitted ? "REGISTERED ✓" : "DRAFT PREVIEW"}`,
      `Team: ${teamName || "TBD"}`,
      `Track: ${trackInfo.title}`,
      `SDGs (${selectedSdgObjects.length}): ${sdgList || "None selected"}`,
      `Squad Size: ${totalMembers} / ${HACKABOT_MAX_MEMBERS}`,
      `Leader: ${leaderName || "TBD"} (${leaderEmail || "TBD"})`,
      "Dates: 12–13 Dec 2026 • Entry Fee: Free for All (₹0)",
      "Venues: Campus 6 Auditorium & Campus 10 Central Library, KIIT University",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Copied Squad Pass summary to clipboard!");
    } catch {
      toast.info("Squad Pass summary ready.");
    }
  };

  const handleDownloadPass = () => {
    const ok = downloadSquadPassPng({
      passId,
      teamName,
      trackTitle: trackInfo.title,
      trackAccent: trackInfo.accent,
      sdgCodes: selectedSdgObjects.map((s) => s.code),
      leaderName,
      totalMembers,
    });
    if (ok) {
      toast.success("Downloaded HACK-A-BOT 3.0 Squad Pass!");
    } else {
      toast.info("Use Copy Pass Summary if image export is unavailable.");
    }
  };

  const handleCardMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setCardTilt({
      rx: (0.5 - py) * 9,
      ry: (px - 0.5) * 9,
      active: true,
    });
  };

  return (
    <section id="register" className="relative bg-obsidian px-4 py-16 sm:px-10 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-hud text-xs text-flame">SQUAD COMMAND TERMINAL</p>
            <h2 className="font-display-usc mt-2 text-4xl text-cream sm:text-6xl">
              TEAM REGISTRATION
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-cream/65">
            Register your squad below and watch your metallic HACK-A-BOT 3.0 Squad Pass update live
            in real time.
          </p>
        </div>

        {/* Status Banner */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald/35 bg-emerald/10 px-4 py-3 font-mono text-[11px] text-cream/90 sm:px-5">
          <span>
            REGISTRATION WINDOW: <strong className="text-cream">2 DEC – 11 DEC</strong> • ENTRY FEE:{" "}
            <strong className="text-emerald">FREE FOR ALL (₹0)</strong>
          </span>
          {phaseState?.phase === "pre-reg" && (
            <span className="rounded-full border border-flame/40 bg-flame/15 px-3 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-flame">
              EARLY PRE-REGISTRATION / LIVE DEMO MODE
            </span>
          )}
        </div>

        {/* 2-Column Split-Screen Terminal */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* LEFT COLUMN (60%): Registration Form */}
          <div className="glass-dark hud-brackets rounded-3xl p-5 sm:p-8 lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Team Name */}
              <div>
                <label htmlFor="hab-team-name" className="font-hud block text-[10px] text-cream/75">
                  TEAM NAME *
                </label>
                <input
                  id="hab-team-name"
                  type="text"
                  value={teamName}
                  disabled={submitted}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Maestro Automators"
                  className="mt-2 w-full rounded-xl border border-cream/15 bg-obsidian/85 px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-flame disabled:opacity-60"
                />
                {errors["teamName"] && (
                  <p className="mt-1.5 text-xs text-crimson">{errors["teamName"]}</p>
                )}
              </div>

              {/* Track Selector Cards */}
              <div>
                <span className="font-hud block text-[10px] text-cream/75">
                  SELECT COMPETITION TRACK *
                </span>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {HACKABOT_TRACKS.map((track) => {
                    const active = selectedTrack === track.id;
                    const flame = track.accent === "flame";
                    const Icon = flame ? Cpu : Sparkles;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        disabled={submitted}
                        onClick={() => onChangeTrack(track.id)}
                        aria-pressed={active}
                        className={`flex cursor-pointer flex-col items-start rounded-2xl border p-4 text-left transition-all disabled:cursor-default disabled:opacity-75 ${
                          active
                            ? flame
                              ? "border-flame bg-flame/15 shadow-flame-glow"
                              : "border-cobalt bg-cobalt/15 shadow-cobalt-glow"
                            : "border-cream/12 bg-obsidian/70 hover:border-cream/30"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[0.14em] ${
                              flame ? "text-flame" : "text-cobalt"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {track.code}
                          </span>
                          <span
                            className={`h-3.5 w-3.5 rounded-full border ${
                              active
                                ? flame
                                  ? "border-flame bg-flame"
                                  : "border-cobalt bg-cobalt"
                                : "border-cream/30"
                            }`}
                          />
                        </div>
                        <span className="font-display-usc mt-2 text-2xl text-cream">
                          {track.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SDG Alignment Multi-Select (Min 2) */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-hud text-[10px] text-cream/75">
                    SDG ALIGNMENT (MIN {HACKABOT_MIN_SDGS} REQUIRED) *
                  </span>
                  <span
                    className={`font-mono text-[10px] font-semibold ${
                      selectedSdgs.length >= HACKABOT_MIN_SDGS ? "text-emerald" : "text-flame"
                    }`}
                  >
                    {selectedSdgs.length}/{HACKABOT_MIN_SDGS}+ SELECTED
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {UN_SDGS.map((sdg) => {
                    const picked = selectedSdgs.includes(sdg.id);
                    return (
                      <button
                        key={sdg.id}
                        type="button"
                        disabled={submitted}
                        onClick={() => onToggleSdg(sdg.id)}
                        aria-pressed={picked}
                        className={`cursor-pointer rounded-xl border px-3 py-2 text-left text-xs transition-colors disabled:cursor-default disabled:opacity-75 ${
                          picked
                            ? "border-emerald bg-emerald/15 text-cream"
                            : "border-cream/12 bg-obsidian/70 text-cream/70 hover:border-flame/50"
                        }`}
                      >
                        <span className="font-mono text-[9px] font-semibold text-flame">
                          {sdg.code}
                        </span>{" "}
                        <span>{sdg.title}</span>
                      </button>
                    );
                  })}
                </div>
                {errors["selectedSdgs"] && (
                  <p className="mt-1.5 text-xs text-crimson">{errors["selectedSdgs"]}</p>
                )}
              </div>

              {/* Team Leader Details */}
              <div className="rounded-2xl border border-cream/10 bg-obsidian/65 p-4 sm:p-5">
                <p className="font-hud text-[10px] text-flame">
                  TEAM LEADER DETAILS (MEMBER 1 / {HACKABOT_MAX_MEMBERS})
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <input
                      type="text"
                      aria-label="Team Leader Full Name"
                      disabled={submitted}
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      placeholder="Full Name *"
                      className="w-full rounded-xl border border-cream/15 bg-obsidian px-3.5 py-2.5 text-sm text-cream outline-none focus:border-flame disabled:opacity-60"
                    />
                    {errors["leaderName"] && (
                      <p className="mt-1 text-xs text-crimson">{errors["leaderName"]}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      aria-label="KIIT Roll Number or Institute"
                      disabled={submitted}
                      value={leaderRollOrInstitute}
                      onChange={(e) => setLeaderRollOrInstitute(e.target.value)}
                      placeholder="KIIT Roll No. / Institute *"
                      className="w-full rounded-xl border border-cream/15 bg-obsidian px-3.5 py-2.5 text-sm text-cream outline-none focus:border-flame disabled:opacity-60"
                    />
                    {errors["leaderRollOrInstitute"] && (
                      <p className="mt-1 text-xs text-crimson">{errors["leaderRollOrInstitute"]}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      aria-label="Team Leader Email"
                      disabled={submitted}
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      placeholder="Email Address *"
                      className="w-full rounded-xl border border-cream/15 bg-obsidian px-3.5 py-2.5 text-sm text-cream outline-none focus:border-flame disabled:opacity-60"
                    />
                    {errors["leaderEmail"] && (
                      <p className="mt-1 text-xs text-crimson">{errors["leaderEmail"]}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      aria-label="Team Leader Phone"
                      disabled={submitted}
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      placeholder="Phone Number (10 digits) *"
                      className="w-full rounded-xl border border-cream/15 bg-obsidian px-3.5 py-2.5 font-mono text-sm text-cream outline-none focus:border-flame disabled:opacity-60"
                    />
                    {errors["leaderPhone"] && (
                      <p className="mt-1 text-xs text-crimson">{errors["leaderPhone"]}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Squad Builder (Max 5 total) */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-hud text-[10px] text-cream/75">
                    TEAM SIZE: {totalMembers} / {HACKABOT_MAX_MEMBERS}
                  </span>
                  <button
                    type="button"
                    onClick={addMember}
                    disabled={submitted || totalMembers >= HACKABOT_MAX_MEMBERS}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-flame/45 bg-flame/10 px-4 py-1.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-flame transition-colors hover:bg-flame hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    ADD TEAM MEMBER
                  </button>
                </div>

                {members.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {members.map((member, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-cream/10 bg-obsidian/55 p-4"
                      >
                        <div className="mb-2.5 flex items-center justify-between">
                          <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-cobalt">
                            MEMBER {idx + 2} / {HACKABOT_MAX_MEMBERS}
                          </span>
                          <button
                            type="button"
                            disabled={submitted}
                            onClick={() => removeMember(idx)}
                            className="inline-flex cursor-pointer items-center gap-1 font-mono text-[10px] text-cream/55 hover:text-crimson disabled:opacity-40"
                          >
                            <Trash2 className="h-3 w-3" />
                            REMOVE
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                          <input
                            type="text"
                            disabled={submitted}
                            value={member.name}
                            onChange={(e) => updateMember(idx, "name", e.target.value)}
                            placeholder="Member Full Name *"
                            className="rounded-xl border border-cream/15 bg-obsidian px-3 py-2 text-xs text-cream outline-none focus:border-flame disabled:opacity-60"
                          />
                          <input
                            type="text"
                            disabled={submitted}
                            value={member.rollOrInstitute}
                            onChange={(e) => updateMember(idx, "rollOrInstitute", e.target.value)}
                            placeholder="Roll No. / Institute *"
                            className="rounded-xl border border-cream/15 bg-obsidian px-3 py-2 text-xs text-cream outline-none focus:border-flame disabled:opacity-60"
                          />
                          <input
                            type="email"
                            disabled={submitted}
                            value={member.email}
                            onChange={(e) => updateMember(idx, "email", e.target.value)}
                            placeholder="Email Address *"
                            className="rounded-xl border border-cream/15 bg-obsidian px-3 py-2 text-xs text-cream outline-none focus:border-flame disabled:opacity-60"
                          />
                        </div>
                        {(errors[`member-${idx}-name`] ||
                          errors[`member-${idx}-roll`] ||
                          errors[`member-${idx}-email`]) && (
                          <p className="mt-1.5 text-xs text-crimson">
                            Complete name, roll/institute, and valid email for Member {idx + 2}.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit / Reset Controls */}
              {submitted ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald/45 bg-emerald/15 p-4">
                  <div className="flex items-center gap-2.5 text-emerald">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span className="font-mono text-xs font-semibold">
                      SQUAD REGISTERED • YOUR OFFICIAL PASS IS ACTIVE →
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-cream/20 bg-obsidian px-4 py-2 font-mono text-[10px] tracking-[0.14em] text-cream/85 hover:border-flame hover:text-flame"
                  >
                    <RotateCcw className="h-3 w-3" />
                    EDIT / NEW ENTRY
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className="gradient-flame shadow-flame-glow w-full cursor-pointer rounded-full py-4 font-mono text-xs font-semibold tracking-[0.18em] text-cream transition-transform hover:scale-[1.01]"
                >
                  COMPLETE TEAM REGISTRATION — ₹0
                </button>
              )}
            </form>
          </div>

          {/* RIGHT COLUMN (40%, Sticky on Desktop): REAL-TIME HOLOGRAPHIC TEAM PASS */}
          <div className="lg:sticky lg:top-24 lg:col-span-5">
            <motion.div
              animate={submitted ? { rotateY: [0, 8, 0], scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.55, ease: "easeOut" }}
              onMouseMove={handleCardMove}
              onMouseLeave={() => setCardTilt({ rx: 0, ry: 0, active: false })}
              style={{
                transform: `perspective(1000px) rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg)`,
                transition: cardTilt.active
                  ? "transform 0.08s ease-out"
                  : "transform 0.4s ease-out",
              }}
              className={`hud-brackets relative overflow-hidden rounded-3xl border bg-gradient-to-br from-carbon via-obsidian to-carbon p-6 shadow-2xl sm:p-7 ${
                submitted
                  ? "border-emerald shadow-[0_0_40px_-8px_oklch(0.628_0.122_152/55%)]"
                  : isFlameTrack
                    ? "border-flame/50 shadow-flame-glow"
                    : "border-cobalt/55 shadow-cobalt-glow"
              }`}
            >
              {/* Subtle metallic sheen & celebratory burst */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-35"
                style={{
                  background: isFlameTrack
                    ? "radial-gradient(circle at 85% 15%, oklch(0.648 0.224 34 / 32%), transparent 55%), linear-gradient(125deg, transparent 35%, oklch(0.973 0.013 84 / 8%) 50%, transparent 65%)"
                    : "radial-gradient(circle at 85% 15%, oklch(0.548 0.215 256 / 34%), transparent 55%), linear-gradient(125deg, transparent 35%, oklch(0.973 0.013 84 / 8%) 50%, transparent 65%)",
                }}
              />

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0.9 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald"
                  />
                )}
              </AnimatePresence>

              <div className="relative z-10">
                {/* Pass Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-hud text-[10px] text-cream/65">
                    HACK-A-BOT 3.0 SQUAD PASS
                  </span>
                  {submitted ? (
                    <motion.span
                      initial={{ scale: 1.5, rotate: -10, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 280, damping: 18 }}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald bg-emerald/20 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.14em] text-emerald"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      REGISTERED ✓
                    </motion.span>
                  ) : (
                    <span className="rounded-full border border-cream/15 bg-obsidian/80 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.14em] text-cream/60">
                      LIVE PREVIEW
                    </span>
                  )}
                </div>

                {/* Live Team Name */}
                <div className="mt-5">
                  <p className="font-mono text-[9px] tracking-[0.18em] text-cream/45">
                    SQUAD CALLSIGN
                  </p>
                  <h3 className="font-display-usc mt-1 truncate text-3xl text-cream sm:text-4xl">
                    {teamName.trim() || "UNASSIGNED SQUAD"}
                  </h3>
                </div>

                {/* Track & Roster Badges */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] ${
                      isFlameTrack
                        ? "border-flame/50 bg-flame/15 text-flame"
                        : "border-cobalt/55 bg-cobalt/20 text-cream"
                    }`}
                  >
                    {trackInfo.code} • {trackInfo.title}
                  </span>
                  <span className="rounded-full border border-cream/15 bg-obsidian/80 px-3 py-1 font-mono text-[10px] text-cream/85">
                    {totalMembers} / {HACKABOT_MAX_MEMBERS} MEMBERS
                  </span>
                </div>

                {/* Live SDG Chips */}
                <div className="mt-5 border-t border-cream/10 pt-4">
                  <p className="font-mono text-[9px] tracking-[0.16em] text-cream/45">
                    ALIGNED UN SDGs ({selectedSdgObjects.length}/2+ MIN)
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedSdgObjects.length > 0 ? (
                      selectedSdgObjects.map((sdg) => (
                        <span
                          key={sdg.id}
                          className="rounded-md border border-emerald/35 bg-emerald/10 px-2 py-0.5 font-mono text-[10px] text-emerald"
                        >
                          {sdg.code}
                        </span>
                      ))
                    ) : (
                      <span className="font-mono text-[11px] text-cream/40">
                        Select 2+ SDGs to lock alignment...
                      </span>
                    )}
                  </div>
                </div>

                {/* Squad Roster Preview */}
                <div className="mt-4 border-t border-cream/10 pt-4 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-cream/80">
                    <span className="text-cream/45">LEADER</span>
                    <span className="truncate pl-3 font-medium">
                      {leaderName.trim() || "Awaiting Input"}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-cream/70">
                    <span className="text-cream/45">DATES</span>
                    <span>DEC 12–13 • ₹0 FREE</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-cream/70">
                    <span className="text-cream/45">VENUES</span>
                    <span className="truncate pl-3 text-right">
                      Campus 6 Aud. &amp; C10 Library
                    </span>
                  </div>
                </div>

                {/* Scanline Barcode + Pass ID */}
                <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-cream/10 bg-obsidian/90 px-4 py-3">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.16em] text-cream/45">PASS ID</p>
                    <p className="font-mono text-sm font-bold tracking-[0.14em] text-flame">
                      {passId}
                    </p>
                  </div>
                  <div aria-hidden className="flex h-8 items-end gap-[2px] opacity-80">
                    {BARCODE_BARS.map((w, idx) => (
                      <span
                        key={idx}
                        className="block h-full rounded-[1px] bg-cream/75"
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Action Buttons (Visible prominently once submitted, or handy copy/save) */}
                <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-cream/18 bg-obsidian/90 px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-cream transition-colors hover:border-flame hover:text-flame"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    COPY PASS SUMMARY
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPass}
                    className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-cream transition-transform hover:scale-[1.02] ${
                      submitted
                        ? "gradient-flame shadow-flame-glow"
                        : "border border-cream/18 bg-carbon hover:border-cobalt"
                    }`}
                  >
                    <Download className="h-3.5 w-3.5" />
                    DOWNLOAD PASS
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
