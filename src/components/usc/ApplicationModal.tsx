import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Sparkles, X } from "lucide-react";
import {
  validateApplication,
  type ApplicationPayload,
} from "@/lib/diagnostic";
import { USC_DOMAINS, type DomainId } from "@/lib/usc-data";

interface ApplicationModalProps {
  open: boolean;
  initialDomain?: DomainId;
  onClose: () => void;
}

export function ApplicationModal({ open, initialDomain, onClose }: ApplicationModalProps) {
  const [form, setForm] = useState<ApplicationPayload>({
    fullName: "",
    rollNumber: "",
    email: "",
    yearBranch: "",
    primaryDomain: initialDomain ?? "rpa-ai",
    secondaryDomain: "",
    portfolioUrl: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationPayload, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setErrors({});
      if (initialDomain) {
        setForm((prev) => ({
          ...prev,
          primaryDomain: initialDomain,
          secondaryDomain: prev.secondaryDomain === initialDomain ? "" : prev.secondaryDomain,
        }));
      }
    }
  }, [open, initialDomain]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validateApplication(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const selectedPrimary = USC_DOMAINS.find((d) => d.id === form.primaryDomain);

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="usc-apply-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.button
            type="button"
            aria-label="Close application modal"
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
            className="glass-dark hud-brackets relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl p-4 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-hud text-[11px] text-flame">USC KIIT RECRUITMENT</p>
                <h2 id="usc-apply-title" className="font-display-usc mt-1 text-3xl text-cream sm:text-4xl">
                  JOIN THE COMMUNITY
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

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald/50 bg-emerald/15 text-emerald">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <p className="font-hud mt-5 inline-flex items-center gap-1.5 text-xs text-flame">
                  <Sparkles className="h-3.5 w-3.5" />
                  TRANSMISSION CONFIRMED
                </p>
                <h3 className="font-display-usc mt-2 text-4xl text-cream">
                  WELCOME TO THE PIPELINE, {form.fullName.split(" ")[0]?.toUpperCase()}
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm text-cream/70">
                  Your application for{" "}
                  <span className="font-semibold text-cream">{selectedPrimary?.title}</span> has
                  been verified for <span className="font-mono text-flame">{form.email}</span>.
                  Watch your KIIT inbox for your Domain Assessment task.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="gradient-flame shadow-flame-glow mt-7 cursor-pointer rounded-full px-7 py-3 font-mono text-xs font-semibold tracking-[0.18em] text-cream"
                >
                  BACK TO USC KIIT
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="usc-name" className="font-hud block text-[10px] text-cream/70">
                      FULL NAME *
                    </label>
                    <input
                      id="usc-name"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Aarav Mohanty"
                      className="mt-1.5 w-full rounded-lg border border-cream/15 bg-obsidian/80 px-3.5 py-2.5 text-sm text-cream outline-none focus:border-flame"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-crimson">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="usc-roll" className="font-hud block text-[10px] text-cream/70">
                      KIIT ROLL NUMBER *
                    </label>
                    <input
                      id="usc-roll"
                      type="text"
                      value={form.rollNumber}
                      onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                      placeholder="22051842"
                      className="mt-1.5 w-full rounded-lg border border-cream/15 bg-obsidian/80 px-3.5 py-2.5 font-mono text-sm text-cream outline-none focus:border-flame"
                    />
                    {errors.rollNumber && (
                      <p className="mt-1 text-xs text-crimson">{errors.rollNumber}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="usc-email" className="font-hud block text-[10px] text-cream/70">
                      KIIT EMAIL (@kiit.ac.in) *
                    </label>
                    <input
                      id="usc-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="22051842@kiit.ac.in"
                      className="mt-1.5 w-full rounded-lg border border-cream/15 bg-obsidian/80 px-3.5 py-2.5 text-sm text-cream outline-none focus:border-flame"
                    />
                    {errors.email && <p className="mt-1 text-xs text-crimson">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="usc-year" className="font-hud block text-[10px] text-cream/70">
                      YEAR / BRANCH *
                    </label>
                    <input
                      id="usc-year"
                      type="text"
                      value={form.yearBranch}
                      onChange={(e) => setForm({ ...form, yearBranch: e.target.value })}
                      placeholder="2nd Year, CSE"
                      className="mt-1.5 w-full rounded-lg border border-cream/15 bg-obsidian/80 px-3.5 py-2.5 text-sm text-cream outline-none focus:border-flame"
                    />
                    {errors.yearBranch && (
                      <p className="mt-1 text-xs text-crimson">{errors.yearBranch}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="usc-primary-domain"
                      className="font-hud block text-[10px] text-cream/70"
                    >
                      PRIMARY DOMAIN *
                    </label>
                    <select
                      id="usc-primary-domain"
                      value={form.primaryDomain}
                      onChange={(e) =>
                        setForm({ ...form, primaryDomain: e.target.value as DomainId })
                      }
                      className="mt-1.5 w-full rounded-lg border border-cream/15 bg-obsidian px-3.5 py-2.5 text-sm text-cream outline-none focus:border-flame"
                    >
                      {USC_DOMAINS.map((domain) => (
                        <option key={domain.id} value={domain.id}>
                          {domain.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="usc-secondary-domain"
                      className="font-hud block text-[10px] text-cream/70"
                    >
                      SECONDARY DOMAIN
                    </label>
                    <select
                      id="usc-secondary-domain"
                      value={form.secondaryDomain}
                      onChange={(e) =>
                        setForm({ ...form, secondaryDomain: e.target.value as DomainId | "" })
                      }
                      className="mt-1.5 w-full rounded-lg border border-cream/15 bg-obsidian px-3.5 py-2.5 text-sm text-cream outline-none focus:border-flame"
                    >
                      <option value="">None (Optional)</option>
                      {USC_DOMAINS.map((domain) => (
                        <option key={domain.id} value={domain.id}>
                          {domain.title}
                        </option>
                      ))}
                    </select>
                    {errors.secondaryDomain && (
                      <p className="mt-1 text-xs text-crimson">{errors.secondaryDomain}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="usc-portfolio"
                    className="font-hud block text-[10px] text-cream/70"
                  >
                    PORTFOLIO / GITHUB / REEL LINK
                  </label>
                  <input
                    id="usc-portfolio"
                    type="url"
                    value={form.portfolioUrl}
                    onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                    placeholder="https://github.com/yourhandle"
                    className="mt-1.5 w-full rounded-lg border border-cream/15 bg-obsidian/80 px-3.5 py-2.5 text-sm text-cream outline-none focus:border-flame"
                  />
                  {errors.portfolioUrl && (
                    <p className="mt-1 text-xs text-crimson">{errors.portfolioUrl}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="gradient-flame shadow-flame-glow mt-2 w-full cursor-pointer rounded-full py-3.5 font-mono text-xs font-semibold tracking-[0.18em] text-cream transition-transform hover:scale-[1.01]"
                >
                  SUBMIT APPLICATION
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}