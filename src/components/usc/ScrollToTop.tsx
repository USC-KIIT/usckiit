import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Resets scroll to top when switching routes without a hash, or smoothly scrolls
 * to the target anchor once mounted when navigating to a hash URL (e.g. /events/hackabot#register).
 */
export function ScrollToTop() {
  const location = useRouterState({
    select: (s) => ({
      pathname: s.location.pathname,
      hash: s.location.hash,
    }),
  });

  useEffect(() => {
    const cleanHash = location.hash.replace(/^#/, "");
    if (!cleanHash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      return;
    }

    let attempts = 0;
    let rafId = 0;
    const scrollToTarget = () => {
      const target = document.getElementById(cleanHash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (attempts < 20) {
        attempts += 1;
        rafId = window.requestAnimationFrame(scrollToTarget);
      }
    };

    rafId = window.requestAnimationFrame(scrollToTarget);
    return () => window.cancelAnimationFrame(rafId);
  }, [location.pathname, location.hash]);

  return null;
}
