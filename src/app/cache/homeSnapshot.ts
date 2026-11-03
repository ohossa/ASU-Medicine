export const HOME_SNAPSHOT_KEY = 'asu:home-snapshot';

export interface HomeSnapshot {
  studentYear: number;
  activeCarouselIndex: number;
  xp: number;
  level: number;
  streakDays: number;
  lastStudyDate: string | null;
  cachedAt: number;
}

/**
 * Returns the cached home screen snapshot synchronously from localStorage.
 * Used for zero-latency, instant rendering of the student's Dashboard.
 */
export function getHomeSnapshot(): HomeSnapshot {
  const defaultYear = 3;
  let year = defaultYear;
  let xp = 0;
  let level = 1;
  let streakDays = 0;
  let lastStudyDate: string | null = null;

  try {
    const raw = localStorage.getItem(HOME_SNAPSHOT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.studentYear === 'number' && parsed.studentYear >= 1 && parsed.studentYear <= 5) {
        return parsed as HomeSnapshot;
      }
    }
  } catch {
    // Fall back to individual stores
  }

  // Graceful fallback to existing local stores if snapshot was not yet written
  try {
    const savedYear = Number(localStorage.getItem('asu_medical_student_year'));
    if (Number.isInteger(savedYear) && savedYear >= 1 && savedYear <= 5) {
      year = savedYear;
    }

    const gamificationRaw = localStorage.getItem('asu_gamification');
    if (gamificationRaw) {
      const g = JSON.parse(gamificationRaw)?.state;
      if (g) {
        if (typeof g.xp === 'number') xp = g.xp;
        if (typeof g.level === 'number') level = g.level;
        if (typeof g.streakDays === 'number') streakDays = g.streakDays;
        if (typeof g.lastStudyDate === 'string') lastStudyDate = g.lastStudyDate;
      }
    }
  } catch {
    // Storage access fallback
  }

  return {
    studentYear: year,
    activeCarouselIndex: Math.max(0, Math.min(4, year - 1)),
    xp,
    level,
    streakDays,
    lastStudyDate,
    cachedAt: Date.now(),
  };
}

/**
 * Persists an updated home snapshot to localStorage.
 */
export function saveHomeSnapshot(data: Partial<HomeSnapshot>): void {
  try {
    const current = getHomeSnapshot();
    const updated: HomeSnapshot = {
      ...current,
      ...data,
      cachedAt: Date.now(),
    };
    localStorage.setItem(HOME_SNAPSHOT_KEY, JSON.stringify(updated));
  } catch {
    // Storage quota or restricted access
  }
}
