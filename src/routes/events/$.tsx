import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/events/$")({
  beforeLoad: ({ params }) => {
    const normalized = params._splat?.trim().toLowerCase();
    if (normalized === "hackabot" || normalized === "hack-a-bot") {
      throw redirect({
        to: "/events/hackabot",
        replace: true,
      });
    }
    throw notFound();
  },
});
