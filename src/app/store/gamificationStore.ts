import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GamificationState {
  xp: number;
  level: number;
  streakDays: number;
  lastStudyDate: string | null;
  addXP: (amount: number) => void;
  recordStudyDay: () => void;
  getLevelProgress: () => { current: number; total: number; pct: number };
}

function xpForLevel(level: number) {
  if (level <= 1) return 0;
  let total = 0;
  for (let i = 2; i <= level; i++) total += 500 * (i - 1);
  return total;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0, level: 1, streakDays: 0, lastStudyDate: null,
      addXP(amount) {
        set({ xp: get().xp + amount });
        const { xp } = get();
        let nl = 1;
        while (xpForLevel(nl + 1) <= xp) nl++;
        if (nl !== get().level) set({ level: nl });
      },
      recordStudyDay() {
        const today = new Date().toISOString().split('T')[0];
        if (get().lastStudyDate === today) return;
        const yest = new Date(); yest.setDate(yest.getDate() - 1);
        const streak = get().lastStudyDate === yest.toISOString().split('T')[0] ? get().streakDays + 1 : 1;
        set({ streakDays: streak, lastStudyDate: today });
      },
      getLevelProgress() {
        const c = get().xp, l = get().level;
        const s = xpForLevel(l), e = xpForLevel(l + 1);
        return { current: c - s, total: e - s, pct: ((c - s) / (e - s)) * 100 };
      },
    }),
    { name: 'asu_gamification' }
  )
);