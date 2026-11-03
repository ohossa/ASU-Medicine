import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getHomeSnapshot, saveHomeSnapshot, HOME_SNAPSHOT_KEY } from './homeSnapshot';

describe('homeSnapshot', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns default snapshot when nothing is in localStorage', () => {
    const snapshot = getHomeSnapshot();
    expect(snapshot.studentYear).toBe(3);
    expect(snapshot.activeCarouselIndex).toBe(2);
    expect(snapshot.xp).toBe(0);
    expect(snapshot.level).toBe(1);
    expect(snapshot.streakDays).toBe(0);
  });

  it('populates initial snapshot from pre-existing local storage keys', () => {
    localStorage.setItem('asu_medical_student_year', '2');
    localStorage.setItem(
      'asu_gamification',
      JSON.stringify({
        state: { xp: 1250, level: 3, streakDays: 5, lastStudyDate: '2026-11-02' },
      })
    );

    const snapshot = getHomeSnapshot();
    expect(snapshot.studentYear).toBe(2);
    expect(snapshot.activeCarouselIndex).toBe(1);
    expect(snapshot.xp).toBe(1250);
    expect(snapshot.level).toBe(3);
    expect(snapshot.streakDays).toBe(5);
    expect(snapshot.lastStudyDate).toBe('2026-11-02');
  });

  it('saves and updates snapshot in localStorage', () => {
    saveHomeSnapshot({
      studentYear: 4,
      activeCarouselIndex: 3,
      xp: 3500,
      level: 4,
      streakDays: 12,
    });

    const snapshot = getHomeSnapshot();
    expect(snapshot.studentYear).toBe(4);
    expect(snapshot.activeCarouselIndex).toBe(3);
    expect(snapshot.xp).toBe(3500);
    expect(snapshot.level).toBe(4);
    expect(snapshot.streakDays).toBe(12);

    const raw = localStorage.getItem(HOME_SNAPSHOT_KEY);
    expect(raw).not.toBeNull();
  });
});
