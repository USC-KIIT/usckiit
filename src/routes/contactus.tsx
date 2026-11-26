import { useState, type FormEvent, type PointerEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/contactus")({
  head: () => ({
    meta: [
      { title: "Contact Us — USC KIIT" },
      {
        name: "description",
        content: "Have a query for USC KIIT? Reach out to the UiPath Student Community at KIIT University.",
      },
    ],
  }),
  component: ContactUsPage,
});

const QUERY_TOPICS = [
  "General Query",
  "Hack-a-Bot 3.0",
  "Recruitment & Domains",
  "Sponsorship & Partnerships",
  "Workshops & Speaker Sessions",
] as const;

function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [topic, setTopic] = useState<string>(QUERY_TOPICS[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !contact.trim() || !message.trim()) {
      toast.error("Please fill in Name, Email ID, Contact, and Your Message.");
      return;
    }

    setSubmitting(true);

    if (supabase) {
      const { error } = await supabase.from("contact_queries").insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        contact: contact.trim(),
        topic,
        message: message.trim(),
      });

      if (error) {
        setSubmitting(false);
        toast.error("Could not send query", { description: error.message });
        return;
      }
    }

    setSubmitting(false);
    setSubmitted(true);
    toast.success("Thanks! We will get back to you soon!");
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setContact("");
    setTopic(QUERY_TOPICS[0]);
    setMessage("");
    setSubmitted(false);
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-obsidian px-4 py-5 text-cream sm:px-8 sm:py-6">
      {/* Full-bleed Background Photo */}
      <img
        src="/contactus-background.jpeg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Dark obsidian mirror + vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 85% at 50% 50%, rgba(9,10,15,0.68) 0%, rgba(9,10,15,0.88) 100%)",
        }}
      />
      <div className="film-grain-overlay" aria-hidden />

      {/* Top Minimal Nav Bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Link
          to="/"
          className="glass-dark inline-flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2 font-mono text-[11px] tracking-[0.16em] text-cream/85 transition-colors hover:border-flame hover:text-flame"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          BACK
        </Link>
      </header>

      {/* Single-Frame Centered Contact Card */}
      <main className="relative z-10 mx-auto my-auto w-full max-w-5xl py-4">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setSpot((prev) => ({ ...prev, active: false }))}
          className="glass-dark hud-brackets relative overflow-hidden rounded-3xl border border-cream/15 p-5 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          {/* Cursor Spotlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: spot.active ? 1 : 0,
              background: `radial-gradient(380px circle at ${spot.x}% ${spot.y}%, rgba(250,70,22,0.14), transparent 70%)`,
            }}
          />

          <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center lg:gap-8">
            {/* Left Info Column */}
            <div className="space-y-4 lg:col-span-5">
              <p className="font-hud text-[10px] tracking-[0.22em] text-flame">HAVE A QUERY?</p>
              <h1 className="font-display-usc text-4xl leading-[0.95] text-cream sm:text-5xl">
                CONNECT WITH <span className="text-gradient-flame">US</span>
              </h1>
              <p className="text-sm leading-relaxed text-cream/75">
                Questions about Hack-a-Bot 3.0, domains, partnerships, or upcoming sessions? Drop
                your message and our core team will reach out.
              </p>

              <div className="space-y-2.5 pt-2 font-mono text-[11px] text-cream/80">
                <div className="flex items-center gap-2.5 rounded-xl border border-cream/10 bg-obsidian/65 px-3.5 py-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-flame" />
                  <span>KIIT University, Bhubaneswar, Odisha</span>
                </div>
              </div>
            </div>

            {/* Right Form / Confirmation Column */}
            <div className="lg:col-span-7">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-emerald/40 bg-obsidian/80 p-6 text-center"
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald/45 bg-emerald/15 text-emerald">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h2 className="font-display-usc mt-4 text-3xl text-cream sm:text-4xl">
                    THANKS! WE WILL GET BACK TO YOU SOON!
                  </h2>
                  <p className="mt-2 max-w-md text-xs leading-relaxed text-cream/70 sm:text-sm">
                    Your query has been logged with USC KIIT. Keep an eye on{" "}
                    <span className="font-mono text-cream">{email}</span>.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="cursor-pointer rounded-full border border-cream/20 bg-carbon px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-cream/85 transition-colors hover:border-flame hover:text-flame"
                    >
                      SEND ANOTHER QUERY
                    </button>
                    <Link
                      to="/"
                      className="gradient-flame shadow-flame-glow rounded-full px-6 py-2.5 font-mono text-[11px] font-semibold tracking-[0.14em] text-cream transition-transform hover:scale-[1.03]"
                    >
                      BACK TO HOME
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 rounded-2xl border border-cream/10 bg-obsidian/75 p-4 sm:p-5"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-flame/75" />
                      <input
                        type="text"
                        required
                        aria-label="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name *"
                        className="w-full rounded-xl border border-cream/15 bg-carbon/90 py-2.5 pl-9 pr-3 text-sm text-cream outline-none transition-colors focus:border-flame"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-flame/75" />
                      <input
                        type="email"
                        required
                        aria-label="Email ID"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email ID *"
                        className="w-full rounded-xl border border-cream/15 bg-carbon/90 py-2.5 pl-9 pr-3 text-sm text-cream outline-none transition-colors focus:border-flame"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-flame/75" />
                      <input
                        type="tel"
                        required
                        aria-label="Contact Number"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Contact Number *"
                        className="w-full rounded-xl border border-cream/15 bg-carbon/90 py-2.5 pl-9 pr-3 font-mono text-sm text-cream outline-none transition-colors focus:border-flame"
                      />
                    </div>
                    <select
                      aria-label="Query Topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full cursor-pointer rounded-xl border border-cream/15 bg-carbon/90 px-3 py-2.5 font-mono text-xs text-cream outline-none transition-colors focus:border-flame"
                    >
                      {QUERY_TOPICS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <MessageSquare className="pointer-events-none absolute left-3 top-3 h-3.5 w-3.5 text-flame/75" />
                    <textarea
                      required
                      rows={4}
                      aria-label="Your Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your message or query *"
                      className="w-full resize-none rounded-xl border border-cream/15 bg-carbon/90 py-2.5 pl-9 pr-3 text-sm text-cream outline-none transition-colors focus:border-flame"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="gradient-flame shadow-flame-glow inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-3.5 font-mono text-xs font-semibold tracking-[0.18em] text-cream transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {submitting ? "SENDING..." : "SUBMIT QUERY"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 text-center font-mono text-[10px] tracking-[0.18em] text-cream/45">
        USC KIIT • UIPATH STUDENT COMMUNITY, KIIT UNIVERSITY
      </footer>
    </div>
  );
}
