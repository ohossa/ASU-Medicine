import { useEffect, useState } from "react";
import type { QuizResult } from "../app/utils/storage";
import { getQuizHistory } from "../app/utils/storage";
import {
  scopeHistory,
  calendarActivity,
  type ModuleScope,
} from "../app/learning/facts";
import { useLanguage } from "../app/hooks/useLanguage";
export function useActivityHistory() {
  const [history, setHistory] = useState(getQuizHistory);
  useEffect(() => {
    const update = () => setHistory(getQuizHistory());
    window.addEventListener("storage", update);
    window.addEventListener("asu-history-updated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("asu-history-updated", update);
    };
  }, []);
  return history;
}
export function WeeklyActivity({ history }: { history: QuizResult[] }) {
  const { language } = useLanguage();
  const days = calendarActivity(history);
  const max = Math.max(1, ...days.map((d) => d.sessions));
  return (
    <section className="learning-panel">
      <h2>{language === "ar" ? "نشاط هذا الأسبوع" : "Your last seven days"}</h2>
      <p>
        {language === "ar"
          ? "الاختبارات المكتملة حسب التاريخ بتوقيت القاهرة."
          : "Completed sessions by calendar date · Cairo time. Session time includes any idle time recorded by older attempts."}
      </p>
      <div className="learning-week" aria-hidden="true">
        {days.map((d) => (
          <div key={d.date}>
            <span>{d.sessions}</span>
            <progress max={max} value={d.sessions} />
            <small>{d.date.slice(5)}</small>
          </div>
        ))}
      </div>
      <details>
        <summary>
          {language === "ar" ? "عرض بيانات النشاط" : "View activity data"}
        </summary>
        <table className="learning-table">
          <thead>
            <tr>
              <th>{language === "ar" ? "التاريخ" : "Date"}</th>
              <th>{language === "ar" ? "الاختبارات" : "Sessions"}</th>
              <th>
                {language === "ar" ? "الدقائق المسجلة" : "Recorded minutes"}
              </th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.date}>
                <th>{d.date}</th>
                <td>{d.sessions}</td>
                <td>{Math.round(d.seconds / 60)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}
export function LearningActivity({
  year,
  catalog,
  onSelectHistory,
}: {
  year: number;
  catalog: ModuleScope;
  onSelectHistory?: (r: QuizResult) => void;
}) {
  const { language } = useLanguage();
  const ar = language === "ar";
  const history = useActivityHistory();
  const { sessions, unclassified } = scopeHistory(history, year, catalog);
  const [filter, setFilter] = useState("all");
  const [legacy, setLegacy] = useState(false);
  const modules = [...new Set(sessions.map((r) => r.moduleCode!))];
  const rows = (legacy ? unclassified : sessions)
    .filter((r) => filter === "all" || r.moduleCode === filter)
    .sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
  return (
    <section>
      <div className="learning-section-title">
        <h2>{ar ? "سجل الدراسة" : "Study activity"}</h2>
        <span>{ar ? `السنة ${year} فقط` : `Year ${year} only`}</span>
      </div>
      <WeeklyActivity history={sessions} />
      <div className="learning-period">
        <label>
          {ar ? "المقرر" : "Module"}{" "}
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">{ar ? "كل المقررات" : "All modules"}</option>
            {modules.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        {unclassified.length > 0 && (
          <button
            aria-pressed={legacy}
            onClick={() => {
              setLegacy(!legacy);
              setFilter("all");
            }}
          >
            {ar ? "سجل قديم غير مصنف" : "Unclassified history"} (
            {unclassified.length})
          </button>
        )}
      </div>
      {legacy && (
        <p className="learning-footnote">
          These saved sessions have no reliable module metadata. They are
          preserved here and excluded from year statistics.
        </p>
      )}
      <div className="learning-modules">
        {rows.map((r) => (
          <article className="learning-module" key={r.id}>
            <div className="learning-module-heading">
              <span>{r.moduleCode ?? "Unclassified"}</span>
              <time>
                {Number.isFinite(Date.parse(r.date))
                  ? new Date(r.date).toLocaleString(ar ? "ar-EG" : "en-GB", {
                      timeZone: "Africa/Cairo",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "Unknown date"}
              </time>
            </div>
            <h3>{r.chapterTitle || "Saved session"}</h3>
            <p>{r.subjectName || "All subjects"}</p>
            <p>
              {r.correct ?? 0} / {r.total ?? 0} recorded score ·{" "}
              {Math.max(0, Math.round((r.elapsedSeconds || 0) / 60))} min
            </p>
            <p className="learning-footnote">
              {r.scoreKind === "objective"
                ? "Automatically graded score"
                : r.scoreKind === "self-reviewed"
                  ? "Self-reviewed essay score"
                  : r.scoreKind === "mixed"
                    ? "Mixed objective and self-reviewed score"
                    : "Historical session score; grading method was not stored."}
            </p>
            <button
              className="learning-primary"
              disabled={legacy || !onSelectHistory}
              onClick={() => onSelectHistory?.(r)}
            >
              {ar ? "عرض النتائج" : "View results"}
            </button>
            {legacy && (
              <p>
                Module identification is required to restore these questions
                safely.
              </p>
            )}
          </article>
        ))}
      </div>
      {rows.length === 0 && (
        <div className="learning-panel">
          <h3>
            {ar ? "لا توجد اختبارات بعد" : "No sessions in this view yet"}
          </h3>
          <p>
            {ar
              ? "ابدأ التدريب وستظهر نتائجك هنا."
              : "Complete a practice session to see its saved results here."}
          </p>
        </div>
      )}
    </section>
  );
}
