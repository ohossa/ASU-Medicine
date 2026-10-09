import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { ArrowLeft, Search, SlidersHorizontal, X, Flag } from "lucide-react";
import { ReportQuestionButton } from "../reports/ReportQuestion";
import { FormattedAnswer } from "./FormattedAnswer";
import { useAcademicYear } from "../preferences/useAcademicYear";
import { useBankRevision } from "./CorrectionStatus";
import { useLearning } from "../learning/LearningProvider";
import { useLanguage } from "../hooks/useLanguage";
import {
  SYLLABUS_MODULES,
  getChaptersForModuleAndMode,
  isModuleActive,
  ensureDataLoaded,
  ensureYearDataLoaded,
} from "../data";
import { getFlaggedQuestions, toggleFlaggedQuestion } from "../utils/storage";
import {
  searchEntries,
  answerText,
  highlightParts,
  studyUrl,
  type SearchFilters,
} from "../search/engine";
import { useSearchIndex } from "../search/useSearchIndex";
import "./question-search.css";
export function QuestionSearch({
  onBack,
  userButton,
}: {
  onBack: () => void;
  userButton?: ReactNode;
}) {
  const { user } = useUser();
  const pref = useAcademicYear();
  const learning = useLearning();
  const { language } = useLanguage();
  const ar = language === "ar";
  const revision = useBankRevision();
  const defaults: SearchFilters = {
    year: String(pref.year ?? "all"),
    semester: "all",
    module: "all",
    subject: "all",
    chapter: "all",
    collection: "all",
    type: "all",
    status: "all",
  };
  const key = `asu_search_filters:${user?.id ?? "guest"}`;
  const [filters, setFilters] = useState<SearchFilters>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? "null");
      return saved && typeof saved === "object"
        ? {
            ...defaults,
            ...Object.fromEntries(
              Object.entries(saved).filter(
                ([k, v]) =>
                  [...Object.keys(defaults), "flagged"].includes(k) &&
                  (typeof v === "string" ||
                    (k === "flagged" && typeof v === "boolean")),
              ),
            ),
          }
        : defaults;
    } catch {
      return defaults;
    }
  });
  const scopeChosen = useRef(localStorage.getItem(key) !== null);
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const [panel, setPanel] = useState(false);
  const [page, setPage] = useState(60);
  const [revealed, setRevealed] = useState(new Set<string>());
  const [flagged, setFlagged] = useState(
    () => new Set(getFlaggedQuestions().map(String)),
  );
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  useEffect(() => {
    let live = true;
    setReady(false);
    setError("");
    (filters.year && filters.year !== "all"
      ? ensureYearDataLoaded(Number(filters.year))
      : ensureDataLoaded()
    )
      .then(() => {
        if (live) setReady(true);
      })
      .catch(() => {
        if (live)
          setError(
            ar
              ? "تعذر تحميل فهرس الأسئلة."
              : "The question index could not be loaded.",
          );
      });
    return () => {
      live = false;
    };
  }, [loadAttempt, ar, filters.year]);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(filters));
    } catch {
      /* optional device preferences */
    }
  }, [filters, key]);
  useEffect(() => {
    setPage(60);
  }, [deferred, filters, revision]);
  const sources = useMemo(
    () =>
      Object.entries(SYLLABUS_MODULES).flatMap(([year, sems]) =>
        Object.entries(sems).flatMap(([sem, mods]) =>
          mods
            .filter((m) => isModuleActive(m.code))
            .map((m) => ({
              year: Number(year),
              semester: Number(sem),
              moduleCode: m.code,
              moduleName: m.name,
              chapters: getChaptersForModuleAndMode(m.code, "mixed"),
            })),
        ),
      ),
    [ready, revision],
  );
  const attempted = useMemo(
    () =>
      new Set(
        learning.data?.entries.map(
          (e) => e.moduleCode + ":" + e.questionId.split("/")[0],
        ) ?? [],
      ),
    [learning.data],
  );
  const missed = useMemo(
    () =>
      new Set(
        learning.data?.entries
          .filter((e) => e.type !== "essay" && !e.correct)
          .map((e) => e.moduleCode + ":" + e.questionId.split("/")[0]) ?? [],
      ),
    [learning.data],
  );
  const {
    entries,
    results,
    indexing,
    searching,
    error: indexError,
  } = useSearchIndex(
    sources,
    ready,
    deferred,
    filters,
    flagged,
    missed,
    attempted,
  );
  const patch = (name: keyof SearchFilters, value: string | boolean) => {
    scopeChosen.current = true;
    setFilters((f) => ({
      ...f,
      [name]: value,
      ...(["year", "semester"].includes(name)
        ? { module: "all", subject: "all", chapter: "all" }
        : name === "module"
          ? { subject: "all", chapter: "all" }
          : name === "subject"
            ? { chapter: "all" }
            : {}),
    }));
  };
  useEffect(() => {
    if (pref.year && !scopeChosen.current)
      setFilters((f) => ({ ...f, year: String(pref.year) }));
  }, [pref.year]);
  const reset = () => {
    scopeChosen.current = true;
    setFilters(defaults);
  };
  const unique = (field: "moduleCode" | "subjectId" | "chapterId") => [
    ...new Map(
      searchEntries(entries, "", {
        year: filters.year,
        semester: filters.semester,
        ...(field !== "moduleCode" ? { module: filters.module } : {}),
        ...(field === "chapterId" ? { subject: filters.subject } : {}),
      }).map((e) => [
        field === "chapterId" ? e.chapterKey : String(e[field]),
        field === "moduleCode"
          ? e.moduleName
          : field === "subjectId"
            ? e.subjectName
            : (filters.module === "all" ? e.moduleName + " · " : "") +
              e.chapterTitle,
      ]),
    ).entries(),
  ];
  const Highlight = ({ text }: { text: string }) => (
    <>
      {highlightParts(text, deferred).map((p, i) =>
        p.match ? <mark key={i}>{p.text}</mark> : <span key={i}>{p.text}</span>,
      )}
    </>
  );
  const Filter = ({
    name,
    label,
    options,
  }: {
    name: keyof SearchFilters;
    label: string;
    options: Array<[string, string]>;
  }) => (
    <label>
      {label}
      <select
        value={String(filters[name] ?? "all")}
        onChange={(e) => patch(name, e.target.value)}
      >
        <option value="all">{ar ? "الكل" : "All"}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
        {filters[name] &&
          filters[name] !== "all" &&
          !options.some(([v]) => v === filters[name]) && (
            <option value={String(filters[name])}>
              {ar ? "فلتر غير متاح — أعد الضبط" : "Unavailable filter — reset"}
            </option>
          )}
      </select>
    </label>
  );
  return (
    <div className="question-search" dir={ar ? "rtl" : "ltr"}>
      <header data-portal-toolbar>
        <div className="search-toolbar">
          <button aria-label={ar ? "رجوع" : "Back"} onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div className="search-field">
            <Search size={19} aria-hidden="true" />
            <input
              aria-label={
                ar
                  ? "ابحث في الأسئلة والإجابات والفصول"
                  : "Search questions, answers and chapters"
              }
              maxLength={256}
              placeholder={
                ar ? "ابحث عن سؤال أو مفهوم…" : "Find a question or concept…"
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  if (panel) setPanel(false);
                  else setQuery("");
                }
              }}
            />
            {query && (
              <button
                aria-label={ar ? "مسح البحث" : "Clear search"}
                onClick={() => setQuery("")}
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            aria-label={ar ? "الفلاتر" : "Filters"}
            aria-expanded={panel}
            aria-controls="search-filters"
            onClick={() => setPanel(!panel)}
          >
            <SlidersHorizontal size={20} />
          </button>
          {userButton}
        </div>
        <div className="search-scope">
          <label>
            {ar ? "السنة الدراسية" : "Academic year"}
            <select
              value={filters.year}
              onChange={(e) => patch("year", e.target.value)}
            >
              <option value="all">{ar ? "كل السنوات" : "All years"}</option>
              {Object.keys(SYLLABUS_MODULES).map((y) => (
                <option key={y} value={y}>
                  {ar ? `السنة ${y}` : `Year ${y}`}
                </option>
              ))}
            </select>
          </label>
          <span>
            {ar
              ? "الإجابات مخفية حتى تطلبها"
              : "Answers stay hidden until you reveal them."}
          </span>
        </div>
        {panel && (
          <section
            className="search-filters"
            id="search-filters"
            aria-label={ar ? "فلاتر البحث" : "Search filters"}
          >
            <Filter
              name="semester"
              label={ar ? "الفصل الدراسي" : "Semester"}
              options={[
                ["1", "Semester 1"],
                ["2", "Semester 2"],
              ]}
            />
            <Filter
              name="module"
              label={ar ? "المقرر" : "Module"}
              options={unique("moduleCode")}
            />
            <Filter
              name="subject"
              label={ar ? "المادة" : "Subject"}
              options={unique("subjectId")}
            />
            <Filter
              name="chapter"
              label={ar ? "الفصل" : "Chapter"}
              options={unique("chapterId")}
            />
            <Filter
              name="collection"
              label={ar ? "المجموعة" : "Collection"}
              options={[
                ["practice", "Question bank"],
                ["past-exams", "Past exams & recalls"],
              ]}
            />
            <Filter
              name="type"
              label={ar ? "نوع السؤال" : "Question type"}
              options={[
                "mcq",
                "truefalse",
                "essay",
                "matching",
                "fillblank",
                "case",
                "casestudy",
              ].map((v) => [v, v])}
            />
            {learning.data && (
              <Filter
                name="status"
                label={ar ? "حالة التدريب" : "Practice status"}
                options={[
                  ["missed", "Missed"],
                  ["unattempted", "Unattempted"],
                ]}
              />
            )}
            <label className="search-check">
              <input
                type="checkbox"
                checked={filters.flagged ?? false}
                onChange={(e) => patch("flagged", e.target.checked)}
              />
              {ar ? "المعلّمة فقط" : "Flagged only"}
            </label>
            <button onClick={reset}>
              {ar ? "إعادة ضبط الفلاتر" : "Reset filters"}
            </button>
            <button onClick={() => setPanel(false)}>
              {ar ? "تم" : "Done"}
            </button>
          </section>
        )}
      </header>
      <main>
        <h1>{ar ? "بحث الأسئلة" : "Question Search"}</h1>
        {error || indexError ? (
          <div role="alert">
            <p>{error || indexError}</p>
            <button onClick={() => setLoadAttempt((n) => n + 1)}>
              {ar ? "إعادة المحاولة" : "Retry index loading"}
            </button>
          </div>
        ) : !ready || indexing ? (
          <p role="status">
            {ar ? "جار تجهيز فهرس الأسئلة…" : "Preparing the question index…"}
          </p>
        ) : (
          <>
            <p className="search-count" role="status" aria-live="polite">
              {results.length.toLocaleString()} {ar ? "سؤال" : "questions"}
              {deferred && ` · “${deferred}”`}
              {query !== deferred || searching ? " · Searching…" : ""}
            </p>
            {results.length === 0 ? (
              <section className="search-empty">
                <h2>{ar ? "لا توجد نتائج" : "No matching questions"}</h2>
                <p>
                  {ar
                    ? "جرّب عبارة أخرى أو غيّر الفلاتر."
                    : "Try another phrase or broaden your filters."}
                </p>
                <button onClick={reset}>
                  {ar ? "إعادة ضبط الفلاتر" : "Reset filters"}
                </button>
              </section>
            ) : (
              <div className="search-results">
                {results.slice(0, page).map((e) => {
                  const shown = revealed.has(e.key);
                  return (
                    <article key={e.key}>
                      <p className="search-meta">
                        {e.moduleName} · {e.subjectName} ·{" "}
                        {e.collection === "past-exams"
                          ? "Past exams"
                          : "Question bank"}
                      </p>
                      <h2>
                        <Highlight text={e.question.text} />
                      </h2>
                      <p className="search-meta">
                        {e.chapterTitle} · {e.childId ? "Case part · " : ""}
                        {e.question.type}
                      </p>
                      <div className="search-actions">
                        <button
                          aria-expanded={shown}
                          onClick={() =>
                            setRevealed((old) => {
                              const next = new Set(old);
                              if (next.has(e.key)) next.delete(e.key);
                              else next.add(e.key);
                              return next;
                            })
                          }
                        >
                          {shown
                            ? ar
                              ? "إخفاء الإجابة"
                              : "Hide answer"
                            : ar
                              ? "عرض الإجابة"
                              : "Reveal answer"}
                        </button>
                        <Link to={studyUrl(e)}>
                          {ar ? "افتح السؤال" : "Open question"}
                        </Link>
                        <button
                          aria-label={ar ? "تحديد السؤال" : "Flag question"}
                          aria-pressed={flagged.has(String(e.parent.id))}
                          onClick={() => {
                            toggleFlaggedQuestion(e.parent.id);
                            setFlagged(
                              new Set(getFlaggedQuestions().map(String)),
                            );
                          }}
                        >
                          <Flag size={17} />
                        </button>
                      </div>
                      {shown && (
                        <div className="search-answer">
                          {e.question.options && (
                            <ol type="A">
                              {e.question.options.map((option, i) => (
                                <li key={i}>{option}</li>
                              ))}
                            </ol>
                          )}
                          <h3>{ar ? "الإجابة" : "Answer"}</h3>
                          <FormattedAnswer
                            text={
                              answerText(e.question) ||
                              "No standalone answer; open the case to view its parts."
                            }
                          />
                          {e.question.explanation && (
                            <>
                              <h3>{ar ? "التفسير" : "Explanation"}</h3>
                              <FormattedAnswer text={e.question.explanation} />
                            </>
                          )}
                          <ReportQuestionButton
                            question={e.parent}
                            moduleCode={e.moduleCode}
                            chapterId={e.chapterId}
                          />
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
            {page < results.length && (
              <button
                className="search-more"
                onClick={() => setPage((n) => n + 60)}
              >
                {ar ? "تحميل المزيد" : "Load more"} ·{" "}
                {Math.min(page, results.length)} /{" "}
                {results.length.toLocaleString()}
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
}
