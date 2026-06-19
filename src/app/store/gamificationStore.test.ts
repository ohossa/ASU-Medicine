import { describe, it, expect } from 'vitest';
import { useGamificationStore } from './gamificationStore';

describe('gamificationStore', () => {
  it('starts at level 1', () => {
    expect(useGamificationStore.getState().level).toBe(1);
  });

  it('levels up at 500 XP', () => {
    useGamificationStore.getState().addXP(500);
    expect(useGamificationStore.getState().level).toBe(2);
  });

  it('extends streak on consecutive day', () => {
    const yest = new Date(); yest.setDate(yest.getDate() - 1);
    useGamificationStore.setState({ streakDays: 5, lastStudyDate: yest.toISOString().split('T')[0] });
    useGamificationStore.getState().recordStudyDay();
    expect(useGamificationStore.getState().streakDays).toBe(6);
  });
});