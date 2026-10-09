import { useEffect, useRef, useState, type ReactNode } from "react";
import { useUser } from "@clerk/clerk-react";
import { useLearning } from "../learning/LearningProvider";
import { pulse } from "../lib/pulseEngine";
export { ProgressContext, type ProgressState } from "./ProgressContextValue";
import { ProgressContext, type ProgressState } from "./ProgressContextValue";
function load(id: string) {
  try {
    return JSON.parse(
      localStorage.getItem(`asu.achievements:${id}`) ?? "[]",
    ) as string[];
  } catch {
    return [];
  }
}
export function ProgressProvider({
  children,
  onSync,
}: {
  children: ReactNode;
  onSync?: (s: ProgressState) => void;
}) {
  const { user } = useUser();
  return (
    <AccountProgress
      key={user?.id ?? "guest"}
      id={user?.id ?? "guest"}
      onSync={onSync}
    >
      {children}
    </AccountProgress>
  );
}
function AccountProgress({
  children,
  id,
  onSync,
}: {
  children: ReactNode;
  id: string;
  onSync?: (s: ProgressState) => void;
}) {
  const { data } = useLearning();
  const [achievements, setAchievements] = useState(() => load(id)),
    [lastLevelUp, setLastLevelUp] = useState(0);
  const previous = useRef<number | null>(null);
  const p = data?.profile;
  const state: ProgressState = {
    xp: p?.xp ?? 0,
    level: p?.level ?? 1,
    bestStreak: p?.bestStreak ?? 0,
    achievements,
  };
  useEffect(() => {
    if (!p) return;
    if (previous.current !== null && p.level > previous.current) {
      setLastLevelUp(Date.now());
      pulse.burst(window.innerWidth / 2, window.innerHeight / 2, "levelup");
    }
    previous.current = p.level;
  }, [p?.level]);
  useEffect(() => {
    try {
      localStorage.setItem(
        `asu.achievements:${id}`,
        JSON.stringify(achievements),
      );
    } catch {
      /* Cosmetic cache only. */
    }
    onSync?.(state);
  }, [achievements, id, onSync]);
  return (
    <ProgressContext.Provider
      value={{
        ...state,
        lastLevelUp,
        recordStreak: () => {},
        unlock: (id) =>
          setAchievements((old) => (old.includes(id) ? old : [...old, id])),
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
