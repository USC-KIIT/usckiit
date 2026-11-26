import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Copy, Plus, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  HACKABOT_MAX_MEMBERS,
  HACKABOT_MIN_SDGS,
  HACKABOT_TRACKS,
  UN_SDGS,
  validateHackabotRegistration,
  type HackabotMember,
  type HackabotRegistrationPayload,
  type HackabotTrackId,
} from "@/lib/hackabot-data";

interface HackabotRegistrationModalProps {
  open: boolean;
  initialTrack?: HackabotTrackId;
  initialSdgs?: readonly string[];
  onClose: () => void;
}

export function HackabotRegistrationModal({
  open,
  initialTrack,
  initialSdgs,
  onClose,
}: HackabotRegistrationModalProps) {
  const [form, setForm] = useState<HackabotRegistrationPayload>({
    teamName: "",
    track: initialTrack ?? "rpa-ai",
    selectedSdgs: initialSdgs ? [...initialSdgs] : [],
    leaderName: "",
    leaderRollOrInstitute: "",
    leaderEmail: "",
    leaderPhone: "",
    members: [],
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setErrors({});
      setForm((prev) => ({
        ...prev,
        track: initialTrack ?? prev.track,
        selectedSdgs:
          initialSdgs && initialSdgs.length > 0 ? [...initialSdgs] : prev.selectedSdgs,
      }));
    }
  }, [open, initialTrack, initialSdgs]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const totalMembers = 1 + form.members.length;

  const toggleSdg = (id: string) => {
    setForm((prev) => ({
      ...prev,
      selectedSdgs: prev.selectedSdgs.includes(id)
        ? prev.selectedSdgs.filter((s) => s !== id)
        : [...prev.selectedSdgs, id],
    }));
  };

  const addMember = () => {
    if (totalMembers >= HACKABOT_MAX_MEMBERS) return;
    setForm((prev) => ({
      ...prev,
      members: [...prev.members, { name: "", rollOrInstitute: "", email: "" }],
    }));
  };

  const updateMember = (idx: number, field: keyof HackabotMember, value: string) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.map((m, i) => (i === idx ? { ...m, [field]: value } : m)),
    }));
  };

  const removeMember = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validateHackabotRegistration(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const trackInfo = HACKABOT_TRACKS.find((t) => t.id === form.track);
  const sdgLabels = form.selectedSdgs
    .map((id) => {
      const found = UN_SDGS.find((s) => s.id === id);
      return found ? `${found.code}: ${found.title}` : id;
    })
    .join(", ");

  const handleCopyPass = async () => {
    const passText = [
      "HACK-A-BOT 3.0 — TEAM PASS",
      `Team: ${form.teamName}`,
      `Track: ${trackInfo?.title ?? form.track}`,
      `SDGs: ${sdgLabels}`,
      `Team Size: ${totalMembers} / ${HACKABOT_MAX_MEMBERS}`,
      `Leader: ${form.leaderName} (${form.leaderEmail})`,
      "Venue: Campus 6 Auditorium & Campus 10 Central Library, KIIT University",
      "Dates: 12–13 Dec • Entry Fee: Free",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(passText);
      toast.success("Copied HACK-A-BOT 3.0 Team Pass!");
    } catch {
      toast.info("Team Pass ready.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="hackabot-reg-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.button
            type="button"
            aria-label="Close registration modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22 }}
            className="glass-dark hud-brackets relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-4 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-hud text-[11px] text-flame">USC KIIT FLAGSHIP COMPETITION</p>
                <h2 id="hackabot-reg-title" className="font-display-usc mt-1 text-3xl text-cream sm:text-4xl">
                  HACK-A-BOT 3.0 REGISTRATION
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-cream/15 text-cream/75 transition-colors hover:border-flame hover:text-cream"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-emerald/35 bg-emerald/10 px-4 py-2.5 font-mono text-[11px] text-cream/90">
              Entry Fee: <strong className="text-emerald">Free for All</strong> •
              Registration: 2 Dec – 11 Dec • Offline at Campus 6 Auditorium &amp; Campus 10 Central
              Library
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 rounded-2xl border border-flame/40 bg-obsidian/90 p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-hud inline-flex items-center gap-2 text-xs text-emerald">
                    <CheckCircle2 className="h-4 w-4" />
                    HACK-A-BOT 3.0 TEAM PASS
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-flame/15 px-3 py-1 font-mono text-[10px] text-flame">
                    <Sparkles className="h-3 w-3" />
                    FREE ENTRY
                  </span>
                </div>

                <h3 className="font-display-usc mt-4 text-4xl text-cream">{form.teamName}</h3>
                <dl className="mt-4 grid grid-cols-1 gap-3 border-y border-cream/10 py-4 font-mono text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] text-cream/45">TRACK</dt>
                    <dd className="mt-0.5 text-cream">{trackInfo?.title}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-cream/45">TEAM SIZE</dt>
                    <dd className="mt-0.5 text-cream">
                      {totalMembers} / {HACKABOT_MAX_MEMBERS} Members
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[10px] text-cream/45">SELECTED SDGs</dt>
                    <dd className="mt-0.5 text-emerald">{sdgLabels}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[10px] text-cream/45">VENUE</dt>
                    <dd className="mt-0.5 text-cream/85">
                      Campus 6 Auditorium &amp; Campus 10 Central Library, KIIT University
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyPass}
                    className="gradient-flame shadow-flame-glow inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-2.5 font-mono text-xs font-semibold tracking-[0.16em] text-cream"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    COPY TEAM PASS
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer rounded-full border border-cream/15 px-5 py-2.5 font-mono text-xs tracking-[0.16em] text-cream/80 hover:border-flame hover:text-cream"
                  >
                    DONE
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-5" noValidate>
                {/* Team Name & Track */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="hb-team" className="font-hud block text-[10px] text-cream/70">
                      TEAM NAME *
                    </label>
                    <input
                      id="hb-team"
                      type="text"
                      value={form.teamName}
                      onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                      placeholder="Maestro Automators"
                      className="mt-1.5 w-full rounded-lg border border-cream/15 bg-obsidian/80 px-3.5 py-2.5 text-sm text-cream outline-none focus:border-flame"
                    />
                    {errors["teamName"] && (
                      <p className="mt-1 text-xs text-crimson">{errors["teamName"]}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="hb-track" className="font-hud block text-[10px] text-cream/70">
                      COMPETITION TRACK *
                    </label>
                    <select
                      id="hb-track"
                      value={form.track}
                      onChange={(e) =>
                        setForm({ ...form, track: e.target.value as HackabotTrackId })
                      }
                      className="mt-1.5 w-full rounded-lg border border-cream/15 bg-obsidian px-3.5 py-2.5 text-sm text-cream outline-none focus:border-flame"
                    >
                      {HACKABOT_TRACKS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SDG Alignment Multi-Select (Min 2) */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-hud text-[10px] text-cream/70">
                      SDG ALIGNMENT (SELECT AT LEAST {HACKABOT_MIN_SDGS}) *
                    </span>
                    <span
                      className={`font-mono text-[10px] ${
                        form.selectedSdgs.length >= HACKABOT_MIN_SDGS
                          ? "text-emerald"
                          : "text-flame"
                      }`}
                    >
                      {form.selectedSdgs.length}/{HACKABOT_MIN_SDGS}+ SELECTED
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {UN_SDGS.map((sdg) => {
                      const picked = form.selectedSdgs.includes(sdg.id);
                      return (
                        <button
                          key={sdg.id}
                          type="button"
                          onClick={() => toggleSdg(sdg.id)}
                          className={`cursor-pointer rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                            picked
                              ? "border-emerald bg-emerald/15 text-cream"
                              : "border-cream/12 bg-obsidian/70 text-cream/70 hover:border-flame/50"
                          }`}
                        >
                          <span className="font-mono text-[9px] text-flame">{sdg.code}</span>{" "}
                          <span>{sdg.title}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors["selectedSdgs"] && (
                    <p className="mt-1 text-xs text-crimson">{errors["selectedSdgs"]}</p>
                  )}
                </div>

                {/* Team Leader Details */}
                <div className="rounded-xl border border-cream/10 bg-obsidian/60 p-4">
                  <p className="font-hud text-[10px] text-flame">TEAM LEADER (MEMBER 1 / 5)</p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        aria-label="Leader full name"
                        value={form.leaderName}
                        onChange={(e) => setForm({ ...form, leaderName: e.target.value })}
                        placeholder="Leader Full Name *"
                        className="w-full rounded-lg border border-cream/15 bg-obsidian px-3 py-2 text-sm text-cream outline-none focus:border-flame"
                      />
                      {errors["leaderName"] && (
                        <p className="mt-1 text-xs text-crimson">{errors["leaderName"]}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        aria-label="Leader roll number or institute"
                        value={form.leaderRollOrInstitute}
                        onChange={(e) =>
                          setForm({ ...form, leaderRollOrInstitute: e.target.value })
                        }
                        placeholder="Roll No. / Institute *"
                        className="w-full rounded-lg border border-cream/15 bg-obsidian px-3 py-2 text-sm text-cream outline-none focus:border-flame"
                      />
                      {errors["leaderRollOrInstitute"] && (
                        <p className="mt-1 text-xs text-crimson">
                          {errors["leaderRollOrInstitute"]}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="email"
                        aria-label="Leader email"
                        value={form.leaderEmail}
                        onChange={(e) => setForm({ ...form, leaderEmail: e.target.value })}
                        placeholder="Email Address *"
                        className="w-full rounded-lg border border-cream/15 bg-obsidian px-3 py-2 text-sm text-cream outline-none focus:border-flame"
                      />
                      {errors["leaderEmail"] && (
                        <p className="mt-1 text-xs text-crimson">{errors["leaderEmail"]}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="tel"
                        aria-label="Leader phone"
                        value={form.leaderPhone}
                        onChange={(e) => setForm({ ...form, leaderPhone: e.target.value })}
                        placeholder="Phone (10 digits) *"
                        className="w-full rounded-lg border border-cream/15 bg-obsidian px-3 py-2 font-mono text-sm text-cream outline-none focus:border-flame"
                      />
                      {errors["leaderPhone"] && (
                        <p className="mt-1 text-xs text-crimson">{errors["leaderPhone"]}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dynamic Additional Members */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-hud text-[10px] text-cream/70">
                      TEAM SIZE: {totalMembers} / {HACKABOT_MAX_MEMBERS}
                    </span>
                    <button
                      type="button"
                      onClick={addMember}
                      disabled={totalMembers >= HACKABOT_MAX_MEMBERS}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-flame/45 bg-flame/10 px-3.5 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-flame transition-colors hover:bg-flame hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="h-3 w-3" />
                      ADD MEMBER
                    </button>
                  </div>

                  {form.members.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {form.members.map((member, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-cream/10 bg-obsidian/50 p-3.5"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-mono text-[10px] text-cobalt">
                              MEMBER {idx + 2}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeMember(idx)}
                              aria-label={`Remove member ${idx + 2}`}
                              className="inline-flex cursor-pointer items-center gap-1 font-mono text-[10px] text-cream/55 hover:text-crimson"
                            >
                              <Trash2 className="h-3 w-3" />
                              REMOVE
                            </button>
                          </div>
                          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateMember(idx, "name", e.target.value)}
                              placeholder="Full Name *"
                              className="rounded-lg border border-cream/15 bg-obsidian px-3 py-2 text-xs text-cream outline-none focus:border-flame"
                            />
                            <input
                              type="text"
                              value={member.rollOrInstitute}
                              onChange={(e) => updateMember(idx, "rollOrInstitute", e.target.value)}
                              placeholder="Roll No. / Institute *"
                              className="rounded-lg border border-cream/15 bg-obsidian px-3 py-2 text-xs text-cream outline-none focus:border-flame"
                            />
                            <input
                              type="email"
                              value={member.email}
                              onChange={(e) => updateMember(idx, "email", e.target.value)}
                              placeholder="Email *"
                              className="rounded-lg border border-cream/15 bg-obsidian px-3 py-2 text-xs text-cream outline-none focus:border-flame"
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

                <button
                  type="submit"
                  className="gradient-flame shadow-flame-glow w-full cursor-pointer rounded-full py-3.5 font-mono text-xs font-semibold tracking-[0.18em] text-cream transition-transform hover:scale-[1.01]"
                >
                  COMPLETE FREE TEAM REGISTRATION
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}