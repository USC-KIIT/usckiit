import { useState, type MouseEvent } from "react";
import { ArrowUp, Github, Instagram, Linkedin, MapPin } from "lucide-react";

const SOCIALS = [
  { label: "Instagram", handle: "@usc_kiit", href: "https://instagram.com/usc_kiit", icon: Instagram },
  { label: "LinkedIn", handle: "USC KIIT", href: "https://linkedin.com", icon: Linkedin },
  { label: "GitHub", handle: "usc-kiit", href: "https://github.com", icon: Github },
] as const;

export function Footer() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMagnetMove = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.28;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.28;
    setOffset({ x: dx, y: dy });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-cream/10 bg-obsidian px-4 pb-10 pt-16 sm:px-10 sm:pt-20"
    >
      {/* Huge Ghosted Background Wordmark */}
      <div
        aria-hidden
        className="font-display-usc pointer-events-none absolute inset-x-0 bottom-0 select-none text-center text-[22vw] leading-[0.8] text-cream/[0.03]"
      >
        USC KIIT
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 sm:gap-10 md:flex-row md:items-end">
          <div>
            <p className="font-hud text-xs text-flame">UIPATH STUDENT COMMUNITY</p>
            <h2 className="font-display-usc mt-2 text-4xl text-cream sm:text-6xl">
              BUILDING THE FUTURE,
              <span className="block text-gradient-flame">ONE DOMAIN AT A TIME.</span>
            </h2>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-cream/65">
              <MapPin className="h-4 w-4 shrink-0 text-emerald" />
              KIIT University, Bhubaneswar, Odisha
            </p>
          </div>

          <div className="flex flex-col items-start gap-5 sm:gap-6 md:items-end">
            <button
              type="button"
              onClick={scrollToTop}
              onMouseMove={handleMagnetMove}
              onMouseLeave={() => setOffset({ x: 0, y: 0 })}
              style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
              className="glass-dark inline-flex cursor-pointer items-center gap-2.5 rounded-full px-5 py-3 font-mono text-xs tracking-[0.18em] text-cream transition-transform duration-150 hover:border-flame/70 hover:text-flame"
            >
              BACK TO TOP
              <ArrowUp className="h-4 w-4" />
            </button>

            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-cream/10 bg-carbon/80 px-3.5 py-2 font-mono text-[11px] tracking-[0.14em] text-cream/80 transition-colors hover:border-flame/60 hover:text-flame sm:px-4"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {social.handle}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-center font-mono text-[10px] tracking-[0.12em] text-cream/45 sm:mt-16 sm:flex-row sm:text-left sm:text-[11px] sm:tracking-[0.14em]">
          <span>© {new Date().getFullYear()} USC KIIT · UIPATH STUDENT COMMUNITY</span>
          <span className="inline-flex items-center gap-2 text-emerald">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            ALL SYSTEMS NOMINAL
          </span>
        </div>
      </div>
    </footer>
  );
}