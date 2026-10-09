import { useState, useEffect, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  BookOpen,
  ArrowRight,
  Trophy,
  Flame,
  Check,
  RefreshCw,
} from "lucide-react";
import { PortalShell } from "../app/components/PortalShell";
import { useAcademicYear } from "../app/preferences/useAcademicYear";
import { useLearning } from "../app/learning/LearningProvider";
import { REWARDS, TITLES } from "../app/learning/contracts";
import { moduleProgress } from "../app/learning/progress";
import {
  SYLLABUS_MODULES,
  getChaptersForModuleAndMode,
  ensureModuleDataLoaded,
  getModuleQuestionCounts,
  isModuleDataLoaded,
} from "../app/data";
import "./learning-hub.css";
import {
  LearningActivity,
  WeeklyActivity,
  useActivityHistory,
} from "./LearningActivity";
import { scopeHistory, type ModuleScope } from "../app/learning/facts";
import type { QuizResult } from "../app/utils/storage";
import { useBankRevision } from "../app/components/CorrectionStatus";
import { useUser } from "@clerk/clerk-react";
import { studyTopics } from "../app/learning/topics";
import { findContinuation } from "../app/learning/continuation";
import { useLanguage } from "../app/hooks/useLanguage";
export default function LearningHub({
  userButton,
  onSelectHistory,
}: {
  userButton?: ReactNode;
  onSelectHistory?: (r: QuizResult) => void;
}) {
  const { user } = useUser();
  useBankRevision();
  const [bankWarning, setBankWarning] = useState("");
  const yearPref = useAcademicYear(),
    learning = useLearning(),
    navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { language } = useLanguage();
  const ar = language === "ar";
  const tab = [
    "overview",
    "progress",
    "activity",
    "rewards",
    "rankings",
  ].includes(params.get("view") ?? "")
    ? params.get("view")!
    : "overview";
  const setTab = (view: string) => setParams({ view }, { replace: true });
  const [semester, setSemester] = useState("1");
  const history = useActivityHistory();
  const catalog: ModuleScope = {};
  for (const [y, sems] of Object.entries(SYLLABUS_MODULES))
    for (const [sem, list] of Object.entries(sems))
      for (const m of list)
        catalog[m.code] = { year: Number(y), semester: Number(sem) };
  const [alias, setAlias] = useState<string | null>(null),
    [saveError, setSaveError] = useState(""),
    [saving, setSaving] = useState(false);
  const year = yearPref.year;
  const p = learning.data?.profile;
  useEffect(() => {
    let live = true;
    if (year) {
      const codes = Object.values(SYLLABUS_MODULES[year] ?? {})
        .flat()
        .map((m) => m.code);
      Promise.allSettled(codes.map(ensureModuleDataLoaded)).then((results) => {
        if (live)
          setBankWarning(
            results.some((r) => r.status === "rejected")
              ? "Some question banks are unavailable offline. Saved activity and rewards are still accessible."
              : "",
          );
      });
    }
    return () => {
      live = false;
    };
  }, [year]);
  const modules = year
    ? Object.entries(SYLLABUS_MODULES[year] ?? {}).flatMap(([semester, list]) =>
        list.map((m) => {
          const questions = getChaptersForModuleAndMode(
            m.code,
            "mixed",
          ).flatMap((c) => c.subjects.flatMap((s) => s.questions));
          return {
            ...m,
            semester,
            bankReady: isModuleDataLoaded(m.code),
            questions,
            chapters: getChaptersForModuleAndMode(m.code, "mixed"),
            progress: moduleProgress(
              m.code,
              questions,
              (learning.data?.entries ?? []).map((entry) => {
                if (entry.moduleCode !== m.code) return entry;
                for (const c of getChaptersForModuleAndMode(m.code, "mixed"))
                  for (const subject of c.subjects) {
                    const q = subject.questions.find(
                      (q) =>
                        entry.questionId === String(q.id) ||
                        entry.questionId.startsWith(String(q.id) + "/"),
                    );
                    if (q)
                      return {
                        ...entry,
                        chapterId: c.id,
                        subject: subject.name,
                        topic:
                          subject.lectureNames?.[(q.lecture ?? 1) - 1] ??
                          c.title,
                      };
                  }
                return entry;
              }),
            ),
          };
        }),
      )
    : [];
  const continuation = user?.id
    ? findContinuation(
        user.id,
        modules.map((m) => ({ code: m.code, chapters: m.chapters })),
        localStorage,
      )
    : null;
  const completeScope = modules.every(
    (m) => m.bankReady || getModuleQuestionCounts(m.code).totalCount === 0,
  );
  const available = modules.filter((m) => m.progress.total > 0),
    attempted = available.reduce((n, m) => n + m.progress.attempted, 0),
    total = available.reduce((n, m) => n + m.progress.total, 0);
  const weak = available
    .flatMap((m) =>
      m.progress.weak.map((t) => ({ ...t, code: m.code, module: m.name })),
    )
    .sort((a, b) => a.correct / a.attempted - b.correct / b.attempted)
    .slice(0, 5);
  const revisionLink = (t: { code: string; name: string; subject: string }) => {
    const m = modules.find((m) => m.code === t.code);
    for (const c of m?.chapters ?? [])
      for (const s of c.subjects) {
        const topic = studyTopics(s).find(
          (topic) => topic.name === t.name && s.name === t.subject,
        );
        if (topic)
          return `/year-${year}/${t.code.toLowerCase()}/mixed?chapter=${c.id}&subject=${s.id}${topic.lecture ? `&lecture=${topic.lecture}` : ""}`;
      }
    return `/year-${year}/${t.code.toLowerCase()}/mcq`;
  };
  const save = async (patch: Parameters<typeof learning.settings>[0]) => {
    setSaving(true);
    setSaveError("");
    try {
      await learning.settings(patch);
    } catch (e) {
      setSaveError(
        e instanceof Error ? e.message : "Settings could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <PortalShell
      userButton={userButton}
      crumbs={[
        { label: "Portal", onClick: () => navigate("/") },
        { label: ar ? "تقدمي" : "My Progress" },
      ]}
    >
      <main className="learning-hub" dir={ar ? "rtl" : "ltr"}>
        {bankWarning && (
          <p role="status" className="learning-notice">
            {bankWarning}
          </p>
        )}
        <header
          className={`learning-hero reward-banner-${p?.banner ?? "default"}`}
        >
          <div>
            <span className="learning-year">
              {year
                ? ar
                  ? `السنة ${year}`
                  : `Year ${year}`
                : ar
                  ? "سنتك الدراسية"
                  : "Your academic year"}
            </span>
            <h1>{ar ? "تعلمك، في مكان واحد." : "Your learning, in focus."}</h1>
            <p>
              {ar
                ? "تابع من حيث توقفت. تعلم موضوعًا تلو الآخر."
                : "Pick up where you left off. Build understanding, one topic at a time."}
            </p>
          </div>
          {p && (
            <div className="learning-level">
              <Trophy size={22} />
              <strong>Level {p.level}</strong>
              <span>
                {TITLES.find((t) => t.id === p.title)?.name ??
                  "Medical Student"}
              </span>
            </div>
          )}
        </header>
        {(yearPref.loading || !year) && (
          <p role="status">
            {yearPref.loading
              ? "Loading your saved academic year…"
              : "Choose your academic year from your account profile to get started."}
          </p>
        )}
        {(learning.error || yearPref.error) && (
          <div role="alert" className="learning-notice">
            <p>
              {learning.error || yearPref.error}
              {learning.data
                ? " Showing your last successfully synced records."
                : ""}
            </p>
            <button onClick={() => void learning.retry()}>
              <RefreshCw size={14} /> Retry sync
            </button>
          </div>
        )}
        {learning.pending > 0 && (
          <div className="learning-notice">
            <p>
              {learning.pending} learning updates saved on this device, waiting
              to sync.
            </p>
            <button onClick={() => void learning.retry()}>
              {ar ? "مزامنة الآن" : "Sync now"}
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Discard pending XP updates? Your quiz history will remain, but these updates will not earn XP.",
                  )
                )
                  learning.discard();
              }}
            >
              Discard pending
            </button>
          </div>
        )}
        <nav className="learning-tabs" aria-label="Learning views">
          {[
            ["overview", ar ? "نظرة عامة" : "Overview"],
            ["progress", ar ? "التقدم" : "Progress"],
            ["activity", ar ? "النشاط" : "Activity"],
            ["rewards", ar ? "المكافآت" : "Rewards"],
          ].map(([id, label]) => (
            <button
              key={id}
              aria-pressed={tab === id}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        {(tab === "overview" || tab === "progress") && (
          <>
            <section className="learning-stats" aria-label="Learning summary">
              <div>
                <BookOpen />
                <strong>
                  {learning.data
                    ? `${attempted.toLocaleString()} / ${total.toLocaleString()}`
                    : "—"}
                </strong>
                <span>
                  {completeScope
                    ? "Unique questions attempted"
                    : "Downloaded-bank coverage only"}
                </span>
              </div>
              <div>
                <Trophy />
                <strong>{p ? p.xp.toLocaleString() : "—"}</strong>
                <span>{ar ? "نقاط الخبرة الشخصية" : "Personal XP"}</span>
              </div>
              <div>
                <Flame />
                <strong>{p ? p.streak : "—"}</strong>
                <span>
                  {ar
                    ? "أيام الدراسة المتتالية · توقيت القاهرة"
                    : "Study-day streak · Cairo time"}
                </span>
              </div>
            </section>
            {p && (
              <div className="learning-level-progress">
                <div>
                  <span>
                    {p.xp % 500} / 500 XP to Level {p.level + 1}
                  </span>
                  <span>Best streak: {p.bestStreak} days</span>
                </div>
                <progress
                  value={p.xp % 500}
                  max={500}
                  aria-label="Progress to next level"
                />
              </div>
            )}
            {tab === "overview" && continuation && (
              <section className="learning-panel">
                <h2>{ar ? "تابع دراستك" : "Continue studying"}</h2>
                <p>
                  {continuation.chapter.title} ·{" "}
                  {continuation.session.subjectName}
                </p>
                <Link
                  className="learning-primary"
                  to={`/year-${year}/${continuation.moduleCode.toLowerCase()}/mixed?chapter=${continuation.chapter.id}&resume=${encodeURIComponent(continuation.session.subjectName)}`}
                >
                  {ar ? "متابعة الاختبار" : "Resume your attempt"}
                </Link>
              </section>
            )}
            {tab === "overview" && year && (
              <WeeklyActivity
                history={scopeHistory(history, year, catalog).sessions}
              />
            )}
            {tab === "progress" && (
              <div className="learning-period" aria-label="Semester scope">
                {["1", "2", "all"].map((v) => (
                  <button
                    key={v}
                    aria-pressed={semester === v}
                    onClick={() => setSemester(v)}
                  >
                    {v === "all"
                      ? ar
                        ? "كل الفصول"
                        : "All semesters"
                      : ar
                        ? `الفصل ${v}`
                        : `Semester ${v}`}
                  </button>
                ))}
              </div>
            )}
            <section>
              <div className="learning-section-title">
                <h2>{ar ? "مقرراتك" : "Your modules"}</h2>
                <span>{year ? `Year ${year} only` : ""}</span>
              </div>
              <div className="learning-modules">
                {modules
                  .filter(
                    (m) =>
                      tab === "overview" ||
                      semester === "all" ||
                      m.semester === semester,
                  )
                  .map((m) => (
                    <article key={m.code} className="learning-module">
                      <div className="learning-module-heading">
                        <span>Semester {m.semester}</span>
                        {m.progress.total === 0 && (
                          <span>
                            {getModuleQuestionCounts(m.code).totalCount
                              ? "Bank not downloaded"
                              : "Coming soon"}
                          </span>
                        )}
                      </div>
                      <h3>{m.name}</h3>
                      {m.progress.total > 0 ? (
                        <>
                          <p>
                            {learning.data
                              ? `${m.progress.attempted} of ${m.progress.total} unique questions attempted`
                              : `${m.progress.total} questions available`}
                          </p>
                          {learning.data && (
                            <progress
                              max={m.progress.total}
                              value={m.progress.attempted}
                              aria-label={`${m.name} question coverage`}
                            />
                          )}
                          <div className="learning-module-meta">
                            <span>
                              {!learning.data
                                ? "Sync to see your accuracy"
                                : m.progress.accuracy === null
                                  ? "No graded attempts yet"
                                  : `${m.progress.accuracy}% latest objective accuracy`}
                            </span>
                            <span>
                              {learning.data ? m.progress.missed.length : "—"}{" "}
                              latest missed parts
                            </span>
                          </div>
                          {learning.data && (
                            <p className="learning-footnote">
                              {m.progress.everCorrect} unique objective
                              questions correct at least once. First-answer
                              accuracy:{" "}
                              {m.progress.firstAccuracy === null
                                ? "Not recorded in older entries"
                                : `${m.progress.firstAccuracy}% across ${m.progress.firstCount} recorded first answers`}
                              .
                            </p>
                          )}
                          <div className="learning-module-actions">
                            <Link
                              to={`/year-${year}/${m.code.toLowerCase()}/mcq`}
                            >
                              Practise <ArrowRight size={15} />
                            </Link>
                          </div>
                          {tab === "progress" && (
                            <details>
                              <summary>
                                {ar
                                  ? "المواد والفصول"
                                  : "Subjects and chapters"}
                              </summary>
                              {m.chapters.map((c) => (
                                <div className="learning-chapter" key={c.id}>
                                  <h4>{c.title}</h4>
                                  {c.subjects.flatMap((subject) =>
                                    studyTopics(subject).map((topic) => {
                                      const stats = moduleProgress(
                                        m.code,
                                        topic.questions,
                                        learning.data?.entries ?? [],
                                      );
                                      const link = `/year-${year}/${m.code.toLowerCase()}/mixed?chapter=${c.id}&subject=${subject.id}${topic.lecture ? `&lecture=${topic.lecture}` : ""}`;
                                      return (
                                        <div
                                          key={
                                            subject.id +
                                            ":" +
                                            (topic.lecture ?? "all")
                                          }
                                        >
                                          <strong>{topic.name}</strong>
                                          <p>
                                            {learning.data
                                              ? `${stats.attempted} / ${stats.total} attempted · ${stats.accuracy === null ? "No objective answers" : `${stats.accuracy}% latest objective accuracy`}`
                                              : `${stats.total} questions available`}
                                          </p>
                                          <Link
                                            className="learning-primary"
                                            to={link}
                                          >
                                            {ar
                                              ? "تدرب على هذا الموضوع"
                                              : "Practise this topic"}
                                          </Link>
                                          {learning.data &&
                                            stats.missed.length > 0 && (
                                              <Link
                                                className="learning-primary"
                                                to={link + "&missed=1"}
                                              >
                                                Retry missed questions (
                                                {stats.missed.length})
                                              </Link>
                                            )}
                                        </div>
                                      );
                                    }),
                                  )}
                                </div>
                              ))}
                            </details>
                          )}
                        </>
                      ) : (
                        <p>
                          The question bank and topic checklist will appear when
                          this module is available.
                        </p>
                      )}
                    </article>
                  ))}
              </div>
            </section>
            <section className="learning-weak">
              <h2>{ar ? "مواضيع للمراجعة" : "Topics to revisit"}</h2>
              {weak.length ? (
                weak.map((t) => (
                  <Link key={t.code + t.subject + t.name} to={revisionLink(t)}>
                    <div>
                      <strong>{t.name}</strong>
                      <span>
                        {t.subject} · {t.module}
                      </span>
                    </div>
                    <span>
                      {Math.round((t.correct / t.attempted) * 100)}%{" "}
                      <ArrowRight size={16} />
                    </span>
                  </Link>
                ))
              ) : (
                <p>
                  {learning.data
                    ? "Weak topics appear after at least five objective answers in a topic."
                    : "Sync your learning records to see topics to revisit."}
                </p>
              )}
            </section>
            <p className="learning-footnote">
              {completeScope
                ? "Summary totals cover both semesters of your selected year."
                : "Some question banks have not loaded. These totals cover downloaded banks only and may be incomplete."}{" "}
              Coverage counts answered questions, not quizzes opened. Accuracy
              uses your latest automatically graded answers; essay self-grades
              are separate. These records start with this release.
            </p>
          </>
        )}
        {tab === "activity" && year && (
          <LearningActivity
            year={year}
            catalog={catalog}
            onSelectHistory={onSelectHistory}
          />
        )}
        {(tab === "rankings" || tab === "rewards") && (
          <section className="learning-panel">
            <h2>
              {ar
                ? `ترتيب السنة ${year ?? "—"}`
                : `Year ${year ?? "—"} leaderboard`}
            </h2>
            <p>
              Automatically graded questions only. Essays earn personal XP, and
              repeated questions do not award points again.
            </p>
            <div className="learning-period">
              <button
                aria-pressed={learning.period === "weekly"}
                onClick={() => learning.setPeriod("weekly")}
              >
                This week
              </button>
              <button
                aria-pressed={learning.period === "all"}
                onClick={() => learning.setPeriod("all")}
              >
                All time
              </button>
            </div>
            {learning.loading && <p role="status">Loading rankings…</p>}
            <ol className="learning-ranking">
              {learning.data?.leaderboard.map((row, i) => (
                <li key={i} className={row.isYou ? "is-you" : ""}>
                  <span>{i + 1}</span>
                  <strong>
                    {row.alias}
                    {row.isYou ? " · You" : ""}
                  </strong>
                  <span>Level {row.level}</span>
                  <b>{row.xp.toLocaleString()} XP</b>
                </li>
              ))}
            </ol>
            {!learning.loading && !learning.data?.leaderboard.length && (
              <p>
                {ar
                  ? "لا توجد نتائج عامة بعد. المشاركة اختيارية."
                  : "No public rankings yet. Participation is optional."}
              </p>
            )}
            <p className="learning-footnote">
              Weeks begin Monday in Cairo. Competitive points are capped at 500
              per day; personal XP continues. Only aliases are public.
            </p>
          </section>
        )}
        {tab === "rewards" && (
          <section className="learning-panel">
            <h2>{ar ? "خصص ملفك" : "Make it yours"}</h2>
            <p>
              Earn banners and titles as your personal XP grows. Essays count
              toward these rewards.
            </p>
            {saveError && (
              <p role="alert" className="learning-notice">
                {saveError}
              </p>
            )}
            <div className="learning-consent">
              <label>
                Public alias
                <input
                  maxLength={24}
                  value={alias ?? p?.alias ?? ""}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="Choose an alias"
                />
              </label>
              <button
                disabled={saving || !p}
                onClick={() => void save({ alias: alias ?? p?.alias })}
              >
                Save alias
              </button>
              <label className="learning-checkbox">
                <input
                  type="checkbox"
                  checked={p?.optIn ?? false}
                  disabled={saving || !p}
                  onChange={(e) => void save({ optIn: e.target.checked })}
                />
                Show my alias on my year’s leaderboard
              </label>
            </div>
            <h3>{ar ? "خلفيات الملف" : "Profile banners"}</h3>
            <div className="learning-reward-grid">
              {REWARDS.map((r) => (
                <button
                  key={r.id}
                  className={`reward-banner-${r.id}`}
                  disabled={saving || !p || p.level < r.level}
                  aria-pressed={p?.banner === r.id}
                  onClick={() => void save({ banner: r.id })}
                >
                  <strong>
                    {r.name} {p?.banner === r.id && <Check size={15} />}
                  </strong>
                  <span>Level {r.level}</span>
                </button>
              ))}
            </div>
            <h3>{ar ? "ألقاب الملف" : "Profile titles"}</h3>
            <div className="learning-reward-grid">
              {TITLES.map((r) => (
                <button
                  key={r.id}
                  disabled={saving || !p || p.level < r.level}
                  aria-pressed={p?.title === r.id}
                  onClick={() => void save({ title: r.id })}
                >
                  <strong>
                    {r.name} {p?.title === r.id && <Check size={15} />}
                  </strong>
                  <span>Level {r.level}</span>
                </button>
              ))}
            </div>
            <p className="learning-footnote">
              Leaving the leaderboard removes your public entry while preserving
              personal progress. Past local XP is not imported into rankings.
            </p>
          </section>
        )}
      </main>
    </PortalShell>
  );
}
