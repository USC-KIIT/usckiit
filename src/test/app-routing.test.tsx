import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches /events/hackabot and /events/hack-a-bot fallback routes case-insensitively", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    expect(router.matchRoutes("/events/hackabot").at(-1)?.routeId).toBe("/events/hackabot");
    expect(router.matchRoutes("/events/HACKABOT").at(-1)?.routeId).toBe("/events/hackabot");
    expect(router.matchRoutes("/events/hack-a-bot").at(-1)?.routeId).toBe("/events/hack-a-bot");
    expect(router.matchRoutes("/events/Hack-A-Bot").at(-1)?.routeId).toBe("/events/hack-a-bot");
  });
});
