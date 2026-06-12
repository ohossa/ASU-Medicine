import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { pulse } from '../lib/pulseEngine';
import { sound } from '../lib/sound';

export interface ProgressState {
  xp: number;
  level: number;
  bestStreak: number;
  achievements: string[];
}

const LEVEL_STEP = 500; // xp per level
const KEY = 'asu.progress.v1';

function load(): ProgressState {
  try {
    const data = localStorage.getItem(KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return { xp: 0, level: 1, bestStreak: 0, achievements: [] };
}

interface Ctx extends ProgressState {
  addXp: (amount: number) => void;
  recordStreak: (s: number) => void;
  unlock: (id: string) => void;
  lastLevelUp: number; // timestamp; overlay listens to this
}

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children, onSync }: { children: ReactNode; onSync?: (s: ProgressState) => void }) {
  const [state, setState] = useState<ProgressState>(load);
  const [lastLevelUp, setLastLevelUp] = useState(0);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
    onSync?.(state); // hook into existing useCloudSync / api/sync.ts
  }, [state, onSync]);

  const api = useMemo<Ctx>(() => ({
    ...state,
    lastLevelUp,
    addXp: (amount) => setState((s) => {
      const xp = s.xp + amount;
      const level = Math.floor(xp / LEVEL_STEP) + 1;
      if (level > s.level) {
        setLastLevelUp(Date.now());
        sound.levelUp();
        pulse.burst(window.innerWidth / 2, window.innerHeight / 2, 'levelup');
      }
      return { ...s, xp, level };
    }),
    recordStreak: (st) => setState((s) => ({ ...s, bestStreak: Math.max(s.bestStreak, st) })),
    unlock: (id) => setState((s) => s.achievements.includes(id) ? s : { ...s, achievements: [...s.achievements, id] }),
  }), [state, lastLevelUp]);

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export const useProgress = () => {
  const c = useContext(ProgressContext);
  if (!c) throw new Error('useProgress must be used within ProgressProvider');
  return c;
};
