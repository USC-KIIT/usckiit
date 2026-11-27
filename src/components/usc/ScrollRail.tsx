import { useEffect, useState } from "react";

const RAIL_SECTIONS = [
  { id: "home", code: "01", label: "INIT" },
  { id: "initiatives", code: "02", label: "INITIATIVES" },
  { id: "about", code: "03", label: "ABOUT" },
  { id: "domains", code: "04", label: "DOMAINS" },
  { id: "team", code: "05", label: "TEAM" },
  { id: "events", code: "06", label: "EVENTS" },
] as const;

export function ScrollRail() {
  const [activeId, setActiveId] = useState<string>("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        if (top?.target.id) {
          setActiveId(top.target.id);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    RAIL_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleJump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <aside
      aria-label="Section scroll rail"
      className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 xl:flex"
    >
      <div className="glass-dark flex flex-col items-end gap-2 rounded-2xl px-2.5 py-3">
        {RAIL_SECTIONS.map((sec) => {
          const active = activeId === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => handleJump(sec.id)}
              className="group flex cursor-pointer items-center gap-2 py-0.5 text-right"
            >
              <span
                className={`font-mono text-[9px] tracking-[0.18em] transition-colors ${
                  active ? "text-flame" : "text-cream/40 group-hover:text-cream/85"
                }`}
              >
                {sec.code} {sec.label}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  active
                    ? "h-4 w-1.5 bg-flame shadow-[0_0_10px_var(--flame)]"
                    : "h-1.5 w-1.5 bg-cream/25 group-hover:bg-cream/70"
                }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
