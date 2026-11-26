import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import {
  CheckCircle2,
  Copy,
  Cpu,
  Download,
  Lock,
  LogOut,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
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
import {
  extractKiitRoll,
  getGoogleFullName,
  isKiitEmail,
  isSupabaseConfigured,
  signInWithKiitGoogle,
  supabase,
} from "@/lib/supabase";
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

function generateSquadPassPngDataUrl(params: {
  passId: string;
  teamName: string;
  trackTitle: string;
  trackAccent: "flame" | "cobalt";
  sdgCodes: readonly string[];
  leaderName: string;
  totalMembers: number;
}): string | null {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 680;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

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

  return canvas.toDataURL("image/png");
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
  const dataUrl = generateSquadPassPngDataUrl(params);
  if (!dataUrl) return false;
  const link = document.createElement("a");
  const slug = (params.teamName || "team")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  link.download = `hackabot-3-pass-${slug || "squad"}.png`;
  link.href = dataUrl;
  link.click();
  return true;
}

export function HackabotRegister({
  selectedTrack,
  onChangeTrack,
  selectedSdgs,
  onToggleSdg,
}: HackabotRegisterProps) {
  const { phaseState } = useHackabotCountdown();

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderRollOrInstitute, setLeaderRollOrInstitute] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [members, setMembers] = useState<HackabotMember[]>([]);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0, active: false });

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    const applyVerifiedUser = async (user: User | null, scrollIntoView = false) => {
      if (!user) {
        setAuthUser(null);
        return;
      }
      if (!isKiitEmail(user.email)) {
        await supabase?.auth.signOut();
        setAuthUser(null);
        setAuthError(
          `Signed in as ${user.email ?? "unknown"} — please sign in with your official @kiit.ac.in Google account.`,
        );
        toast.error("KIIT Gmail ID required", {
          description: "Please sign in with your official @kiit.ac.in Google account.",
        });
        return;
      }
      setAuthError(null);
      setAuthUser(user);
      setLeaderName(getGoogleFullName(user) || (user.email?.split("@")[0] ?? ""));
      setLeaderRollOrInstitute(extractKiitRoll(user.email));
      setLeaderEmail(user.email ?? "");
      if (scrollIntoView) {
        window.setTimeout(() => {
          document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    };

    const initAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const oauthFlag = sessionStorage.getItem("hackabot-oauth-return") === "1";
        const hadOAuthParams = Boolean(
          oauthFlag || code || window.location.hash.includes("access_token"),
        );
        if (oauthFlag) {
          sessionStorage.removeItem("hackabot-oauth-return");
        }

        if (code) {
          const { data: sessionData } = await supabase!.auth.getSession();
          if (!sessionData.session) {
            await supabase!.auth.exchangeCodeForSession(code);
          }
          window.history.replaceState({}, "", "/events/hackabot#register");
        } else if (hadOAuthParams) {
          window.history.replaceState({}, "", "/events/hackabot#register");
        }

        const { data } = await supabase!.auth.getSession();
        await applyVerifiedUser(data.session?.user ?? null, hadOAuthParams);
      } catch (err) {
        setAuthError(err instanceof Error ? err.message : "Authentication check failed.");
      } finally {
        setAuthLoading(false);
      }
    };

    void initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      void applyVerifiedUser(session?.user ?? null, event === "SIGNED_IN");
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    if (!isSupabaseConfigured) {
      toast.info("Supabase setup required", {
        description: "Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local first.",
      });
      return;
    }
    try {
      setAuthBusy(true);
      const { error } = await signInWithKiitGoogle();
      if (error) throw error;
    } catch (err) {
      setAuthBusy(false);
      toast.error("Google Sign-In failed", {
        description: err instanceof Error ? err.message : "Could not start Google authentication.",
      });
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAuthUser(null);
    setLeaderName("");
    setLeaderRollOrInstitute("");
    setLeaderEmail("");
    setSubmitted(false);
  };

  const totalMembers = 1 + members.length;
  const trackInfo =
    HACKABOT_TRACKS.find((t) => t.id === selectedTrack) ?? HACKABOT_TRACKS[0]!;

  const passId = useMemo(
    () => computePassCode(teamName, leaderEmail),
    [teamName, leaderEmail],
  );

  const selectedSdgObjects = useMemo(
    () => UN_SDGS.filter((s) => selectedSdgs.includes(s.id)),
    [selectedSdgs],
  );

  const addMember = () => {
    if (totalMembers >= HACKABOT_MAX_MEMBERS) return;
    setMembers((prev) => [...prev, { name: "", rollOrInstitute: "", email: "" }]);
  };

  const updateMember = (idx: number, field: keyof HackabotMember, value: string) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)),
    );
  };

  const removeMember = (idx: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: FormEvent) => {
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
    setSubmitting(true);

    if (supabase && authUser) {
      const { error } = await supabase.from("hackabot_registrations").insert({
        user_id: authUser.id,
        pass_id: passId,
        team_name: teamName.trim(),
        track: selectedTrack,
        sdgs: selectedSdgs,
        leader_name: leaderName.trim(),
        leader_roll: leaderRollOrInstitute.trim(),
        leader_email: leaderEmail.trim().toLowerCase(),
        leader_phone: leaderPhone.trim(),
        members,
      });

      if (error) {
        setSubmitting(false);
        const isDuplicate = error.code === "23505";
        toast.error(isDuplicate ? "Already registered" : "Could not save registration", {
          description: isDuplicate
            ? "A team has already been registered with this KIIT account."
            : error.message,
        });
        return;
      }

      const passPngBase64 = generateSquadPassPngDataUrl({
        passId,
        teamName,
        trackTitle: trackInfo.title,
        trackAccent: trackInfo.accent,
        sdgCodes: selectedSdgObjects.map((s) => s.code),
        leaderName,
        totalMembers,
      });

      // Best-effort email dispatch via Supabase Edge Function
      const { error: mailError } = await supabase.functions.invoke("send-hackabot-pass", {
        body: {
          passId,
          teamName: teamName.trim(),
          trackTitle: trackInfo.title,
          sdgCodes: selectedSdgObjects.map((s) => s.code),
          leaderName: leaderName.trim(),
          leaderEmail: leaderEmail.trim().toLowerCase(),
          totalMembers,
          passPngBase64,
        },
      });
      if (mailError) {
        toast.info("Pass generated — email delivery pending", {
          description: "Download your Squad Pass below while email service is being configured.",
        });
      }
    }

    setSubmitting(false);
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

  return (
    <section
      id="register"
      className="relative bg-obsidian px-4 py-16 sm:px-10 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-hud text-xs text-flame">SQUAD COMMAND TERMINAL</p>
            <h2 className="font-display-usc mt-2 text-4xl text-cream sm:text-6xl">
              TEAM REGISTRATION
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-cream/65">
            Register your squad below and watch your metallic HACK-A-BOT 3.0 Squad Pass update
            live in real time.
          </p>
        </div>

        {/* Status Banner */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald/35 bg-emerald/10 px-4 py-3 font-mono text-[11px] text-cream/90 sm:px-5">
          <span>
            REGISTRATION WINDOW: <strong className="text-cream">2 DEC – 11 DEC</strong> • ENTRY
            FEE: <strong className="text-emerald">FREE FOR ALL (₹0)</strong>
          </span>
          {phaseState?.phase === "pre-reg" && (
            <span className="rounded-full border border-flame/40 bg-flame/15 px-3 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-flame">
              EARLY PRE-REGISTRATION / LIVE DEMO MODE
            </span>
          )}
        </div>

        {/* Centered Registration Terminal */}
        <div className="mx-auto mt-8 max-w-3xl">
          <div className="glass-dark hud-brackets rounded-3xl p-5 sm:p-8">
            {authLoading ? (
              <div className="flex min-h-[340px] flex-col items-center justify-center gap-3 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-flame/30 border-t-flame" />
                <p className="font-mono text-xs tracking-[0.16em] text-cream/70">
                  CHECKING KIIT SESSION...
                </p>
              </div>
            ) : !authUser ? (
              <div className="flex min-h-[340px] flex-col items-center justify-center px-2 py-8 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-flame/35 bg-flame/15 text-flame shadow-flame-glow">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="font-display-usc mt-5 text-3xl text-cream sm:text-4xl">
                  SIGN IN WITH KIIT GMAIL ID
                </h3>

                <button
                  type="button"
                  disabled={authBusy}
                  onClick={handleGoogleSignIn}
                  className="mt-6 inline-flex cursor-pointer items-center justify-center gap-3 rounded-full border border-cream/20 bg-cream px-8 py-3.5 font-mono text-xs font-bold tracking-[0.16em] text-obsidian shadow-xl transition-transform hover:scale-[1.03] disabled:opacity-60"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                    />
                  </svg>
                  {authBusy ? "REDIRECTING..." : "GOOGLE"}
                </button>

                {authError && (
                  <p className="mt-4 max-w-md rounded-xl border border-crimson/40 bg-crimson/15 px-4 py-2.5 font-mono text-[11px] text-cream">
                    {authError}
                  </p>
                )}

                {!isSupabaseConfigured && (
                  <p className="mt-4 rounded-xl border border-flame/30 bg-flame/10 px-4 py-2 font-mono text-[10px] tracking-[0.12em] text-flame">
                    SUPABASE ENV NOT SET YET — ADD VITE_SUPABASE_URL &amp; VITE_SUPABASE_ANON_KEY
                  </p>
                )}
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Verified KIIT Session Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald/35 bg-emerald/10 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald" />
                  <div className="text-left">
                    <p className="font-mono text-[9px] tracking-[0.18em] text-emerald">
                      VERIFIED KIIT GMAIL ID
                    </p>
                    <p className="font-mono text-xs text-cream">{authUser.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-cream/15 bg-obsidian/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-cream/75 transition-colors hover:border-flame hover:text-cream"
                >
                  <LogOut className="h-3 w-3" />
                  SWITCH
                </button>
              </div>
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
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-hud text-[10px] text-flame">
                    TEAM LEADER DETAILS (MEMBER 1 / {HACKABOT_MAX_MEMBERS})
                  </p>
                  <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-[0.14em] text-emerald">
                    <Lock className="h-3 w-3" />
                    LOCKED FROM GOOGLE AUTH
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="relative">
                    <input
                      type="text"
                      aria-label="Team Leader Full Name"
                      readOnly
                      value={leaderName}
                      placeholder="Full Name *"
                      className="w-full cursor-not-allowed rounded-xl border border-emerald/30 bg-obsidian/55 py-2.5 pl-3.5 pr-9 text-sm text-cream/90 outline-none"
                    />
                    <Lock className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald/75" />
                    {errors["leaderName"] && (
                      <p className="mt-1 text-xs text-crimson">{errors["leaderName"]}</p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      aria-label="KIIT Roll Number or Institute"
                      readOnly
                      value={leaderRollOrInstitute}
                      placeholder="KIIT Roll No. *"
                      className="w-full cursor-not-allowed rounded-xl border border-emerald/30 bg-obsidian/55 py-2.5 pl-3.5 pr-9 font-mono text-sm text-cream/90 outline-none"
                    />
                    <Lock className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald/75" />
                    {errors["leaderRollOrInstitute"] && (
                      <p className="mt-1 text-xs text-crimson">
                        {errors["leaderRollOrInstitute"]}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      aria-label="Team Leader Email"
                      readOnly
                      value={leaderEmail}
                      placeholder="Email Address *"
                      className="w-full cursor-not-allowed rounded-xl border border-emerald/30 bg-obsidian/55 py-2.5 pl-3.5 pr-9 text-sm text-cream/90 outline-none"
                    />
                    <Lock className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald/75" />
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
                <div className="space-y-4 rounded-2xl border border-emerald/45 bg-emerald/15 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-emerald">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-mono text-xs font-semibold">
                          SQUAD REGISTERED • PASS ID: {passId}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] text-cream/75">
                          Confirmation &amp; downloadable pass sent to {leaderEmail}
                        </p>
                      </div>
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

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
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
                      className="gradient-flame shadow-flame-glow inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-cream transition-transform hover:scale-[1.02]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      DOWNLOAD PASS
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="gradient-flame shadow-flame-glow w-full cursor-pointer rounded-full py-4 font-mono text-xs font-semibold tracking-[0.18em] text-cream transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "SAVING REGISTRATION..." : "COMPLETE TEAM REGISTRATION — ₹0"}
                </button>
              )}
            </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
