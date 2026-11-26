import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/events/hack-a-bot")({
  beforeLoad: () => {
    throw redirect({
      to: "/events/hackabot",
      replace: true,
    });
  },
});
