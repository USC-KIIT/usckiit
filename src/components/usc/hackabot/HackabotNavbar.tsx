import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Menu, X } from "lucide-react";

const HACKABOT_NAV_LINKS = [
  { label: "BRIEFING", href: "#briefing" },
  { label: "REGISTER", href: "#register" },
  { label: "FAQ", href: "#faq" },
  { label: "CONTACT", href: "#contact" },
] as const;

interface HackabotNavbarProps {
  onRegisterClick: () => void;
}

export function HackabotNavbar({ onRegisterClick }: HackabotNavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAnchorClick = (href: string) => {
    setDrawerOpen(false);
    const id = href.replace(/^#/, "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex flex-col items-center">
      <div className="mt-3 flex w-full justify-center px-3 sm:px-4">
        <nav
          aria-label="HACK-A-BOT 3.0 navigation"
          className="glass-dark flex w-full max-w-6xl items-center justify-between gap-3 rounded-full px-3.5 py-2 shadow-2xl sm:px-5"
        >
          {/* Left: Back to Home + Quick Anchor Links */}
          <div className="flex items-center gap-3 xl:gap-5">
            <Link
              to="/"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-cream/15 bg-obsidian/80 px-3 py-1.5 font-mono text-[10px] font-medium tracking-[0.14em] text-cream/85 transition-colors hover:border-flame/60 hover:text-flame sm:text-[11px]"
            >
              <ArrowLeft className="h-3 w-3" />
              USC KIIT
            </Link>

            <div className="hidden items-center gap-4 lg:flex xl:gap-5">
              {HACKABOT_NAV_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAnchorClick(item.href);
                  }}
                  className="group relative font-mono text-[10px] font-medium tracking-[0.16em] text-cream/75 transition-colors hover:text-cream xl:text-[11px]"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-flame shadow-[0_0_10px_var(--flame)] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>

          {/* Center: Glowing HACK-A-BOT 3.0 Emblem Badge */}
          <a
            href="#briefing"
            onClick={(e) => {
              e.preventDefault();
              handleAnchorClick("#briefing");
            }}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-flame/40 bg-flame/10 px-3 py-1 shadow-[0_0_20px_-4px_oklch(0.648_0.224_34/45%)] transition-colors hover:border-flame sm:px-4"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-flame shadow-[0_0_10px_var(--flame)]" />
            <span className="font-display-usc text-sm tracking-wider text-cream sm:text-base">
              HACK-A-BOT <span className="text-gradient-flame">3.0</span>
            </span>
          </a>

          {/* Right: Pulsing Flame Orange CTA */}
          <div className="hidden items-center lg:flex">
            <button
              type="button"
              onClick={onRegisterClick}
              className="gradient-flame shadow-flame-glow relative cursor-pointer rounded-full px-5 py-2 font-mono text-[11px] font-semibold tracking-[0.16em] text-cream transition-transform hover:scale-[1.04]"
            >
              REGISTER TEAM
            </button>
          </div>

          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setDrawerOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/15 text-cream lg:hidden"
          >
            {drawerOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="glass-dark fixed inset-x-3 top-20 z-50 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl p-5 shadow-2xl sm:inset-x-4 sm:p-6 lg:hidden"
          >
            <div className="flex flex-col gap-4">
              {HACKABOT_NAV_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAnchorClick(item.href);
                  }}
                  className="font-mono text-xs tracking-[0.2em] text-cream/85 transition-colors hover:text-flame"
                >
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  onRegisterClick();
                }}
                className="gradient-flame shadow-flame-glow mt-2 w-full cursor-pointer rounded-full py-3 font-mono text-xs font-semibold tracking-[0.18em] text-cream"
              >
                REGISTER TEAM
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
