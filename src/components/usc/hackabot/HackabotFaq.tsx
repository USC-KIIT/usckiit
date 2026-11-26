import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUp, ChevronDown, Copy, Phone } from "lucide-react";
import { toast } from "sonner";
import { HACKABOT_CONTACTS } from "@/lib/hackabot-data";
import { HACKABOT_FAQS } from "@/lib/hackabot-schedule";

export function HackabotFaq() {
  const [openId, setOpenId] = useState<string>(HACKABOT_FAQS[0]?.id ?? "fee");

  const handleCopyPhone = async (name: string, phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      toast.success("Copied phone number!", { description: `${name} · +91 ${phone}` });
    } catch {
      toast.info(`${name}: +91 ${phone}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="faq"
      className="relative border-t border-cream/10 bg-obsidian px-4 pb-10 pt-16 sm:px-10 sm:pt-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Tactical FAQ Accordion */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="font-hud text-xs text-flame">INTEL &amp; RULES</p>
            <h2 className="font-display-usc mt-2 text-4xl text-cream sm:text-6xl">TACTICAL FAQ</h2>
            <p className="mt-4 text-sm leading-relaxed text-cream/65">
              Everything squads need to know about fees, team limits, SDG eligibility, venues, and
              beginner onboarding before Day 1 kicks off.
            </p>
          </div>

          <div className="space-y-3 lg:col-span-7">
            {HACKABOT_FAQS.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  data-selected={isOpen ? "true" : undefined}
                  className={`hud-brackets overflow-hidden rounded-2xl border transition-colors ${
                    isOpen
                      ? "border-flame/50 bg-carbon/95"
                      : "border-cream/10 bg-carbon/65 hover:border-cream/25"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? "" : faq.id)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] font-semibold text-flame">
                        0{idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-cream sm:text-base">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-cream/70 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-flame" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <p className="border-t border-cream/10 px-5 pb-4 pt-3 text-xs leading-relaxed text-cream/75 sm:text-sm">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Official Event Coordinators (4-Column Glassmorphic Contact Cards) */}
        <div id="contact" className="mt-16 border-t border-cream/10 pt-12 sm:mt-20 sm:pt-16">
          <p className="font-hud text-xs text-flame">MISSION SUPPORT</p>
          <h2 className="font-display-usc mt-2 text-3xl text-cream sm:text-5xl">
            OFFICIAL EVENT COORDINATORS
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HACKABOT_CONTACTS.map((contact) => (
              <div
                key={contact.phone}
                className="glass-dark hud-brackets flex flex-col justify-between rounded-2xl p-5"
              >
                <div>
                  <span className="font-mono text-[9px] tracking-[0.16em] text-cobalt">
                    USC KIIT COORDINATOR
                  </span>
                  <p className="mt-1.5 text-base font-semibold text-cream">{contact.name}</p>
                  <p className="mt-1 font-mono text-xs tracking-wider text-cream/70">
                    +91 {contact.phone}
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <a
                    href={contact.telHref}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald/45 bg-emerald/15 py-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-emerald transition-colors hover:bg-emerald hover:text-obsidian"
                  >
                    <Phone className="h-3 w-3" />
                    CALL
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyPhone(contact.name, contact.phone)}
                    aria-label={`Copy ${contact.name}'s phone number`}
                    className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-xl border border-cream/15 bg-obsidian/80 px-3.5 py-2 font-mono text-[10px] tracking-[0.14em] text-cream/80 transition-colors hover:border-flame hover:text-flame"
                  >
                    <Copy className="h-3 w-3" />
                    COPY
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Page Footer */}
        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-[11px] leading-relaxed tracking-[0.1em] text-cream/60">
            Organized by USC KIIT under the Department of Training and Placement, KIIT University
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-carbon/80 px-4 py-2 font-mono text-[10px] tracking-[0.14em] text-cream/85 transition-colors hover:border-flame hover:text-flame"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to USC KIIT Home
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-cream/15 bg-carbon/80 px-4 py-2 font-mono text-[10px] tracking-[0.14em] text-cream/85 transition-colors hover:border-flame hover:text-flame"
            >
              Back to Top
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}
