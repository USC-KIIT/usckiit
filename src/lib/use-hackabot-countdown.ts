import { useEffect, useState } from "react";
import {
  getHackabotPhase,
  splitCountdown,
  type CountdownParts,
  type HackabotPhaseState,
} from "./hackabot-data";

export interface LiveHackabotClock {
  phaseState: HackabotPhaseState | null;
  countdown: CountdownParts;
  synced: boolean;
}

const UNSYNCED_PARTS: CountdownParts = {
  days: "--",
  hours: "--",
  minutes: "--",
  seconds: "--",
};

export function useHackabotCountdown(): LiveHackabotClock {
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    setNowMs(Date.now());
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const phaseState = nowMs !== null ? getHackabotPhase(nowMs) : null;
  const countdown =
    nowMs !== null && phaseState
      ? splitCountdown(phaseState.targetMs - nowMs)
      : UNSYNCED_PARTS;

  return {
    phaseState,
    countdown,
    synced: nowMs !== null,
  };
}
