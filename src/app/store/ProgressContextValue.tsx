import { createContext } from 'react';

export interface ProgressState {
  xp: number;
  level: number;
  bestStreak: number;
  achievements: string[];
}

interface Ctx extends ProgressState {
  addXp: (amount: number) => void;
  recordStreak: (s: number) => void;
  unlock: (id: string) => void;
  lastLevelUp: number;
}

export const ProgressContext = createContext<Ctx | null>(null);