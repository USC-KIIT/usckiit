import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onOpenHackabot: () => void;
}

const NAV_LINKS = [
  { label: "INITIATIVES", href: "#initiatives", hasFlameDot: false },
  { label: "ABOUT", href: "#about", hasFlameDot: false },
  { label: "DOMAINS", href: "#domains", hasFlameDot: false },
  { label: "TEAM", href: "#team", hasFlameDot: false },
  { label: "EVENTS", href: "#events", hasFlameDot: true },
] as const;

export function Navbar({ onOpenHackabot }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavClick = () => setDrawerOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex flex-col items-center">
      {/* Floating Glassmorphic Pill Navbar */}
      <div className="mt-3 flex w-full justify-center px-3 sm:px-4">
        <nav
          aria-label="Primary navigation"
          className="glass-dark flex w-full max-w-5xl items-center justify-between rounded-full px-3.5 py-2 shadow-2xl sm:px-6"
        >
          {/* Brand Emblem */}
          <a
            href="#home"
            aria-label="USC KIIT Home"
            className="group inline-flex shrink-0 items-center transition-opacity hover:opacity-90"
          >
            <img
              src="/USC%20KIIT%20Public%20Images/logo_svg.svg"
              alt="USC KIIT — UiPath Student Community"
              className="h-8 w-auto object-contain sm:h-10"
            />
          </a>

          {/* Center Navigation Links in Exact Order */}
          <div className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group relative inline-flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-cream/80 transition-colors hover:text-cream"
              >
                {item.hasFlameDot && (
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-flame shadow-[0_0_10px_var(--flame)]" />
                )}
                {item.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-flame shadow-[0_0_10px_var(--flame)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right CTA */}
          <div className="hidden items-center lg:flex">
            <button
              type="button"
              onClick={onOpenHackabot}
              className="gradient-flame shadow-flame-glow cursor-pointer rounded-full px-5 py-2 font-mono text-[11px] font-semibold tracking-[0.16em] text-cream transition-transform hover:scale-[1.04]"
            >
              HACK-A-BOT 3.0
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            onClick={() => setDrawerOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/15 text-cream lg:hidden"
          >
            {drawerOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>
      </div>

      {/* Animated Mobile Drawer */}
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
              {NAV_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={handleNavClick}
                  className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-cream/85 transition-colors hover:text-flame"
                >
                  {item.hasFlameDot && (
                    <span className="h-1.5 w-1.5 rounded-full bg-flame shadow-[0_0_8px_var(--flame)]" />
                  )}
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  onOpenHackabot();
                }}
                className="gradient-flame shadow-flame-glow mt-2 w-full rounded-full py-3 font-mono text-xs font-semibold tracking-[0.18em] text-cream"
              >
                HACK-A-BOT 3.0
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}