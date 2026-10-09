import type { QuizResult } from "../utils/storage";
export type ModuleScope = Record<string, { year: number; semester: number }>;
export function scopeHistory(
  rows: QuizResult[],
  year: number,
  catalog: ModuleScope,
) {
  const seen = new Set<string>();
  const unique = rows.filter(
    (r) => r && typeof r.id === "string" && !seen.has(r.id) && !!seen.add(r.id),
  );
  const sessions = unique.filter(
    (r) => r.moduleCode && catalog[r.moduleCode]?.year === year,
  );
  const unclassified = unique.filter(
    (r) => !r.moduleCode || !catalog[r.moduleCode],
  );
  return { sessions, unclassified };
}
export const cairoDate = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
export function calendarActivity(rows: QuizResult[], now = new Date()) {
  const today = cairoDate(now);
  const anchor = new Date(today + "T12:00:00Z");
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(anchor);
    d.setUTCDate(d.getUTCDate() - 6 + i);
    return { date: d.toISOString().slice(0, 10), sessions: 0, seconds: 0 };
  });
  const seen = new Set<string>();
  for (const r of rows) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    const d = new Date(r.date);
    if (!Number.isFinite(d.getTime())) continue;
    const day = days.find((x) => x.date === cairoDate(d));
    if (day) {
      day.sessions++;
      day.seconds += Number.isFinite(r.elapsedSeconds)
        ? Math.max(0, r.elapsedSeconds)
        : 0;
    }
  }
  return days;
}
