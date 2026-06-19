import React, { useState, useEffect } from 'react';
import { checkAnswerCorrect } from '../utils/quiz';
import { norm } from '../utils/string';
import {
  ArrowLeft,
  CheckCircle2,
  Check,
  X,
  XCircle,
  Clock,
  Activity,
  Award,
  Lightbulb,
  Bookmark,
  Flag,
  RotateCcw,
  ArrowRight,
  LayoutGrid,
} from 'lucide-react';
import type { ChapterData, SubjectData, Question, SubjectColor, QuizAnswer, SubQuestion } from '../types';
import { subjectStyles, formatTime } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { celebrate } from '../lib/celebrate';
import { pulse } from '../lib/pulseEngine';
import { useProgress } from '../hooks/useProgress';
import { MatchingQuestion } from './MatchingQuestion';

interface Props {
  chapter: ChapterData;
  subject: SubjectData | null;
  questions: Question[];
  answers: Record<number, QuizAnswer>;
  elapsedSeconds: number;
  flaggedQuestions: Set<number>;
  onRetake: () => void;
  onTryAnotherSubject: () => void;
  onBackToChapters: () => void;
  onBackToSubjects: () => void;
  userButton?: React.ReactNode;
}

/* ------------------------------ Helper logic ------------------------------ */

function getPerformanceLabel(pct: number): string {
  if (pct >= 85) return 'A - Excellent';
  if (pct >= 75) return 'B - Very Good';
  if (pct >= 65) return 'C - Good';
  if (pct >= 60) return 'D - Satisfactory';
  if (pct >= 30) return 'F - Insufficient';
  return 'F - Highly Insufficient';
}

function getPerformanceBadge(pct: number): string {
  if (pct >= 85) return 'Grade A';
  if (pct >= 75) return 'Grade B';
  if (pct >= 65) return 'Grade C';
  if (pct >= 60) return 'Grade D';
  return 'Grade F';
}

/* Checks a single fill-blank slot */
function isBlankCorrect(q: Question, inputs: string[], i: number): boolean {
  const user = norm(inputs[i]);
  if (!user) return false;
  const alternatives = ((q.acceptedAnswers ?? [])[i] ?? []).map(norm);
  return user === norm((q.blanks ?? [])[i]) || alternatives.includes(user);
}

/* ------------------------- Markdown table renderer ------------------------- */

function QuestionText({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split('\n');
  const blocks: Array<{ kind: 'p' | 'table'; lines: string[] }> = [];
  let buffer: string[] = [];
  let tableBuffer: string[] = [];

  const flushP = () => {
    if (buffer.length) blocks.push({ kind: 'p', lines: [...buffer] });
    buffer = [];
  };
  const flushTable = () => {
    if (tableBuffer.length) blocks.push({ kind: 'table', lines: [...tableBuffer] });
    tableBuffer = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith('|') && line.includes('|')) {
      flushP();
      tableBuffer.push(line);
    } else {
      flushTable();
      buffer.push(line);
    }
  }
  flushP();
  flushTable();

  return (
    <div className="space-y-4">
      {blocks.map((block, bi) => {
        if (block.kind === 'p') {
          const para = block.lines.join('\n').trim();
          if (!para) return null;
          return (
            <p key={bi} className="whitespace-pre-line text-[15px] leading-relaxed text-white/85">
              {para}
            </p>
          );
        }
        // Markdown table: header | --- separator | rows
        const rows = block.lines
          .map(l => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()))
          .filter(cells => cells.length > 0);
        const sepIndex = rows.findIndex(cells => cells.every(c => /^:?-{2,}:?$/.test(c)));
        const header = sepIndex > 0 ? rows[0] : null;
        const body = sepIndex > 0 ? rows.slice(sepIndex + 1) : rows;

        return (
          <div key={bi} className="overflow-x-auto rounded-xl border border-white/[0.08]">
            <table className="w-full text-sm">
              {header && (
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.04]">
                    {header.map((h, i) => (
                      <th key={i} className="px-4 py-2.5 text-start font-semibold text-white/80">{h}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {body.map((cells, ri) => (
                  <tr key={ri} className="border-b border-white/[0.05] last:border-0">
                    {cells.map((c, ci) => (
                      <td key={ci} className="px-4 py-2.5 text-white/65">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ Progress ring ------------------------------ */

function ScoreRing({ percentage }: { percentage: number }) {
  const r = 78;
  const circumference = 2 * Math.PI * r; // ≈ 490
  const [offset, setOffset] = useState(circumference);
  const { isDark } = useTheme();

  useEffect(() => {
    const id = window.setTimeout(() => {
      setOffset(circumference - (Math.min(Math.max(percentage, 0), 100) / 100) * circumference);
    }, 150);
    return () => window.clearTimeout(id);
  }, [percentage, circumference]);

  const ringColor = isDark
    ? (percentage >= 75 ? '#34d399' : percentage >= 60 ? '#fbbf24' : '#fb7185')
    : (percentage >= 75 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#f43f5e');

  const bgStroke = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.04)';

  return (
    <div className="relative" style={{ width: 168, height: 168 }}>
      <svg width={168} height={168} className="-rotate-90">
        <circle cx={84} cy={84} r={r} fill="none" stroke={bgStroke} strokeWidth={12} />
        <circle
          cx={84}
          cy={84}
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-white">{percentage}%</span>
        <span className="mt-1 rounded-full border border-gray-200 dark:border-white/[0.1] bg-gray-100/50 dark:bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-white/50">
          Score
        </span>
      </div>
    </div>
  );
}

function getFilterBadgeCls(key: 'all' | 'wrong' | 'flagged', isActive: boolean): string {
  if (isActive) {
    return 'bg-white/10 text-white/70 dark:bg-black/10 dark:text-black/70';
  }
  switch (key) {
    case 'all':
      return 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70';
    case 'wrong':
      return 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400';
    case 'flagged':
      return 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400';
    default:
      return '';
  }
}

/* ------------------------------ Main component ----------------------------- */

export function ResultsDashboard({
  chapter,
  subject,
  questions,
  answers,
  elapsedSeconds,
  flaggedQuestions,
  onRetake,
  onTryAnotherSubject,
  onBackToChapters,
  onBackToSubjects,
  userButton,
}: Props) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const progressStore = useProgress();
  const [filter, setFilter] = useState<'all' | 'wrong' | 'flagged'>('all');
  const [openExplanations, setOpenExplanations] = useState<Set<number>>(new Set());
  const [openConcepts, setOpenConcepts] = useState<Set<number>>(new Set());

  const style = subjectStyles[(subject?.id ?? 'clinical') as SubjectColor];

  /* Score math */
  const correctness = questions.map((q, i) => checkAnswerCorrect(q, answers[i]));
  const correctCount = correctness.filter(Boolean).length;
  const totalCount = questions.length;
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const wrongCount = totalCount - correctCount;
  const flaggedCount = flaggedQuestions.size;
  const avgSeconds = totalCount > 0 ? Math.round(elapsedSeconds / totalCount) : 0;

  const badge = getPerformanceBadge(percentage);
  const gradeLetter = badge.replace('Grade ', '');
  const gradeColor =
    percentage >= 75
      ? 'text-emerald-600 dark:text-emerald-400'
      : percentage >= 65
        ? 'text-sky-600 dark:text-sky-400'
        : percentage >= 60
          ? 'text-amber-600 dark:text-amber-400'
          : 'text-rose-600 dark:text-rose-400';

  /* Confetti celebration */
  useEffect(() => {
    const moduleCode = subject?.id ?? 'default';
    const isPerfect = correctCount === totalCount;
    celebrate({ perfect: isPerfect, moduleCode });
    pulse.setMood('celebrate', 3000);
    if (correctCount === totalCount) {
      progressStore.unlock('perfect_score');
    } else if (percentage >= 75) {
      progressStore.unlock('high_score');
    }
  }, [correctCount, totalCount, percentage, progressStore, subject?.id]);

  const toggleSet = (setter: React.Dispatch<React.SetStateAction<Set<number>>>, i: number) =>
    setter(prev => {
      const next = new Set(prev);
      if (next.has(i)) { next.delete(i); } else { next.add(i); }
      return next;
    });

  /* Filtered question list (keeps original indices) */
  const visible = questions
    .map((q, i) => ({ q, i }))
    .filter(({ i }) => {
      if (filter === 'wrong') return !correctness[i];
      if (filter === 'flagged') return flaggedQuestions.has(i);
      return true;
    });

  /* ------------------------- Per-type review renderers ------------------------- */

  const renderOptions = (q: Question, ans: QuizAnswer) => (
    <div className="mt-4 space-y-2">
      {(q.options ?? (q.type === 'truefalse' ? ['True', 'False'] : [])).map((opt: string, oi: number) => {
        const isCorrect = oi === q.correctIndex;
        const isUserWrong = ans === oi && !isCorrect;
        return (
          <div
            key={oi}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
              isCorrect
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : isUserWrong
                  ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'border-gray-200 dark:border-white/[0.07] bg-gray-50/30 dark:bg-white/[0.02] text-gray-700 dark:text-white/50'
            }`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current/40 text-[11px] font-semibold">
              {isCorrect ? <Check size={13} /> : isUserWrong ? <X size={13} /> : String.fromCharCode(65 + oi)}
            </span>
            <span className="leading-relaxed">{opt}</span>
            {ans === oi && (
              <span className="ms-auto shrink-0 rounded-full border border-current/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                Your answer
              </span>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderEssay = (q: Question, ans: QuizAnswer) => {
    const selfGrade = ans?.selfGrade;
    return (
      <div className="mt-4 space-y-4">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-white/40">Your Answer</p>
          <textarea
            readOnly
            value={ans?.text ?? ans?.draft ?? ''}
            rows={5}
            className="w-full resize-none rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-black/30 p-4 text-sm leading-relaxed text-gray-800 dark:text-white/80 outline-none"
          />
        </div>
        {q.modelAnswer && (
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.06] p-4 text-start">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={14} /> Reference Model Answer
            </p>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-white/75">{q.modelAnswer}</p>
          </div>
        )}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
            selfGrade === 'correct'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}
        >
          {selfGrade === 'correct' ? <Check size={13} /> : <X size={13} />}
          Self-Graded: {selfGrade === 'correct' ? 'Correct' : 'Incorrect'}
        </span>
      </div>
    );
  };

  const renderFillBlank = (q: Question, ans: QuizAnswer) => {
    const inputs: string[] = ans?.inputs ?? [];
    const blanks: string[] = q.blanks ?? [];
    const parts = (q.text ?? '').split('___');

    return (
      <div className="mt-4 space-y-4">
        <p className="text-[15px] leading-loose text-gray-800 dark:text-white/80 text-start">
          {parts.map((part, pi) => (
            <React.Fragment key={pi}>
              {part}
              {pi < parts.length - 1 && (
                <span
                  className={`mx-1 inline-block rounded-lg border px-3 py-0.5 text-sm font-medium ${
                    isBlankCorrect(q, inputs, pi)
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400 line-through'
                  }`}
                >
                  {inputs[pi]?.trim() || '—'}
                </span>
              )}
            </React.Fragment>
          ))}
        </p>
        <div className="rounded-xl border border-gray-200 dark:border-white/[0.07] bg-gray-50/50 dark:bg-white/[0.02] p-4 text-start">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-white/40">Answer Key</p>
          <ul className="space-y-1.5">
            {blanks.map((b, bi) => (
              <li key={bi} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-400 dark:text-white/35 tabular-nums">#{bi + 1}</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{b}</span>
                {(q.acceptedAnswers?.[bi]?.length ?? 0) > 0 && (
                  <span className="text-xs text-gray-400 dark:text-white/35">(also: {q.acceptedAnswers![bi].join(', ')})</span>
                )}
                <span className="text-gray-300 dark:text-white/30">·</span>
                <span className={isBlankCorrect(q, inputs, bi) ? 'text-emerald-600/80 dark:text-emerald-400/80' : 'text-rose-600/80 dark:text-rose-400/80 line-through'}>
                  you: {inputs[bi]?.trim() || 'blank'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderMatching = (q: Question, ans: QuizAnswer) => {
    return (
      <div className="mt-4">
        <MatchingQuestion
          pairs={q.pairs ?? []}
          scrambled={ans?.scrambled ?? []}
          matches={ans?.matches ?? {}}
          submitted
          disabled
          onChange={() => {}}
        />
      </div>
    );
  };

  const renderCase = (q: Question, ans: QuizAnswer) => (
    <div className="mt-4 space-y-4">
      {(q.caseText ?? q.description ?? q.text) && (
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.03] dark:bg-sky-500/[0.05] p-4 text-start">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-300">
            <Activity size={14} /> Clinical Case
          </p>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-white/75">{q.caseText ?? q.description ?? q.text}</p>
        </div>
      )}
      {(q.subQuestions ?? []).map((sq: SubQuestion, si: number) => {
        const userAns = ans?.[sq.id];
        const isSubMcq = sq.type === 'mcq';
        const isSubFill = sq.type === 'fillblank';
        const subCorrect = isSubFill
          ? checkAnswerCorrect(sq, userAns)
          : isSubMcq
            ? userAns === sq.correctIndex
            : userAns?.selfGrade === 'correct';
        return (
          <div key={si} className="rounded-xl border border-gray-200 dark:border-white/[0.07] bg-gray-50/30 dark:bg-white/[0.02] p-4 text-start">
            <div className="mb-3 flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-gray-800 dark:text-white/85">
                <span className="text-gray-400 dark:text-white/40">{si + 1}.</span> {sq.text}
              </p>
              {userAns !== undefined ? (
                subCorrect ? (
                  <CheckCircle2 size={17} className="shrink-0 text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <XCircle size={17} className="shrink-0 text-rose-500 dark:text-rose-400" />
                )
              ) : (
                <span className="text-xs text-gray-400 dark:text-white/30 shrink-0 font-medium">Unanswered</span>
              )}
            </div>
            {isSubFill ? (
              <div className="space-y-2">
                {(sq.text ?? '').split('___').map((part: string, pi: number) => (
                  <React.Fragment key={pi}>
                    <span className="text-sm text-gray-800 dark:text-white/80">{part}</span>
                    {pi < (sq.blanks ?? []).length && (
                      <span
                        className={`mx-1 inline-block rounded-lg border px-2.5 py-0.5 text-sm font-medium ${
                          isBlankCorrect(sq, userAns?.inputs ?? [], pi)
                            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400 line-through'
                        }`}
                      >
                        {(userAns?.inputs ?? [])[pi]?.trim() || '—'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
                {!userAns && <span className="text-xs text-gray-400 dark:text-white/30">No answer submitted</span>}
              </div>
            ) : isSubMcq && sq.options ? (
              <div className="space-y-1.5">
                {sq.options.map((opt: string, oi: number) => {
                  const isCorrect = oi === sq.correctIndex;
                  const isUserWrong = userAns === oi && !isCorrect;
                  return (
                    <div
                      key={oi}
                      className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm ${
                        isCorrect
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : isUserWrong
                            ? 'border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : 'border-gray-200 dark:border-white/[0.06] bg-transparent text-gray-500 dark:text-white/45'
                      }`}
                    >
                      {isCorrect ? <Check size={13} /> : isUserWrong ? <X size={13} /> : <span className="w-[13px]" />}
                      {opt}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-white/40">Your Answer</p>
                  <p className="text-sm bg-gray-100/50 dark:bg-black/20 rounded-lg p-3 border border-gray-200 dark:border-white/[0.05] text-gray-800 dark:text-white/85 leading-relaxed whitespace-pre-wrap">
                    {userAns?.text || 'No answer submitted'}
                  </p>
                </div>
                {sq.modelAnswer && (
                  <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/[0.01] dark:bg-emerald-500/[0.02] p-3 text-xs leading-relaxed text-gray-600 dark:text-white/70">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Reference Answer:</span>
                    {sq.modelAnswer}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderAnswerReview = (q: Question, ans: QuizAnswer) => {
    switch (q.type) {
      case 'mcq':
      case 'truefalse': return renderOptions(q, ans);
      case 'essay': return renderEssay(q, ans);
      case 'fillblank': return renderFillBlank(q, ans);
      case 'matching': return renderMatching(q, ans);
      case 'case':
      case 'casestudy': return renderCase(q, ans);
      default: return null;
    }
  };

  /* ---------------------------------- Render --------------------------------- */

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen text-foreground antialiased transition-colors duration-300" style={{ fontFamily: "'Outfit', 'Manrope', 'Archivo', system-ui, sans-serif" }}>
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 start-1/4 h-96 w-96 rounded-full bg-emerald-500/[0.04] dark:bg-emerald-500/[0.07] blur-[130px]" />
        <div className="absolute bottom-0 end-1/4 h-96 w-96 rounded-full bg-sky-500/[0.04] dark:bg-sky-500/[0.07] blur-[130px]" />
      </div>

      {/* ── Section A: Header Banner ───────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onBackToChapters}
              aria-label="Back to chapters"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.04] text-gray-700 dark:text-white/70 transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.08] btn-press"
            >
              <ArrowLeft size={16} className={`text-current ${isRTL ? 'rotate-180' : ''}`} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-gray-900 dark:text-white">{chapter.title}</p>
              <p className="truncate text-xs text-gray-500 dark:text-white/40">
                <button onClick={onBackToSubjects} className={`transition-colors hover:underline ${style.text}`}>
                  {subject?.name ?? 'Subjects'}
                </button>
                {chapter.subtitle ? ` · ${chapter.subtitle}` : ''}
              </p>
            </div>
          </div>
          {userButton}
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* ── Section B: Analytics Summary Grid ────────────────────────────── */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Circular score */}
          <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-card p-6 backdrop-blur-xl transition-colors duration-300">
            <ScoreRing percentage={percentage} />
          </div>

          {/* Accuracy */}
          <div className="flex flex-col justify-center rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-card p-6 backdrop-blur-xl transition-colors duration-300">
            <Award size={20} className="mb-3 text-emerald-500 dark:text-emerald-400" />
            <p className="text-3xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-white">
              {correctCount} <span className="text-lg font-normal text-gray-400 dark:text-white/35">/ {totalCount}</span>
            </p>
            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-white/70">Accuracy Rating</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-white/40">
              {percentage >= 85 ? 'Excellent performance!' : percentage >= 65 ? 'Solid work — keep refining.' : percentage >= 60 ? 'Passed — review the misses.' : 'Needs revision. You have this.'}
            </p>
          </div>

          {/* Time */}
          <div className="flex flex-col justify-center rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-card p-6 backdrop-blur-xl transition-colors duration-300">
            <Clock size={20} className="mb-3 text-sky-500 dark:text-sky-400" />
            <p className="text-3xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-white">{formatTime(elapsedSeconds)}</p>
            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-white/70">Elapsed Time</p>
            <span className="mt-2 w-fit rounded-full border border-gray-200 dark:border-white/[0.08] bg-gray-100/50 dark:bg-white/[0.04] px-2.5 py-1 text-[11px] tabular-nums text-gray-500 dark:text-white/45">
              ~{avgSeconds}s per question
            </span>
          </div>

          {/* Grade */}
          <div className="flex flex-col justify-center rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-card p-6 backdrop-blur-xl transition-colors duration-300">
            <Activity size={20} className="mb-3 text-amber-500 dark:text-amber-400" />
            <p className={`text-4xl font-bold tracking-tight ${gradeColor}`}>{gradeLetter}</p>
            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-white/70">Course Grade</p>
            <span className="mt-2 w-fit rounded-full border border-gray-200 dark:border-white/[0.08] bg-gray-100/50 dark:bg-white/[0.04] px-2.5 py-1 text-[11px] text-gray-500 dark:text-white/45">
              {getPerformanceLabel(percentage)}
            </span>
          </div>
        </div>

        {/* ── Section C: Control Action Links ──────────────────────────────── */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRetake}
            className="flex items-center gap-2 rounded-full bg-physiology px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-physiology-dark hover:scale-[1.03] active:scale-[0.98] cursor-pointer btn-press"
          >
            <RotateCcw size={15} /> Retake Session
          </button>
          <button
            onClick={onTryAnotherSubject}
            className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/[0.1] bg-gray-50/50 dark:bg-white/[0.03] px-6 py-3 text-sm font-medium text-gray-700 dark:text-white/75 transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.08] cursor-pointer btn-press"
          >
            <LayoutGrid size={15} /> Practice Another Topic
          </button>
          <button
            onClick={onBackToChapters}
            className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/[0.1] bg-gray-50/50 dark:bg-white/[0.03] px-6 py-3 text-sm font-medium text-gray-700 dark:text-white/75 transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.08] cursor-pointer btn-press"
          >
            Back to Chapters <ArrowRight size={15} className={isRTL ? 'rotate-180' : ''} />
          </button>
        </div>

        {/* ── Section D: Questions Filter Toggle Bar ───────────────────────── */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              { key: 'all', label: 'All Questions', count: totalCount },
              { key: 'wrong', label: 'Incorrect', count: wrongCount },
              { key: 'flagged', label: 'Flagged', count: flaggedCount },
            ] as const
          ).map(({ key, label, count }) => {
            const isActive = filter === key;
            const badgeCls = getFilterBadgeCls(key, isActive);
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                aria-pressed={isActive}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all cursor-pointer btn-press ${
                  isActive
                    ? 'border-gray-300 dark:border-white/30 bg-gray-900 dark:bg-white text-white dark:text-black font-semibold shadow-sm'
                    : 'border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.03] text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.07]'
                }`}
              >
                {label}
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${badgeCls}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Expand / Collapse All controls */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => {
              const indices = new Set(visible.map(({ i }) => i));
              setOpenExplanations(new Set(indices));
            }}
            className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 px-3.5 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 transition-colors hover:bg-amber-500/10 btn-press"
          >
            <Lightbulb size={13} /> Expand All Explanations
          </button>
          <button
            onClick={() => {
              const indices = new Set(visible.map(({ i }) => i));
              setOpenConcepts(new Set(indices));
            }}
            className="flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/5 px-3.5 py-1.5 text-xs font-medium text-sky-700 dark:text-sky-300 transition-colors hover:bg-sky-500/10 btn-press"
          >
            <Bookmark size={13} /> Expand All Concepts
          </button>
          <button
            onClick={() => {
              setOpenExplanations(new Set());
              setOpenConcepts(new Set());
            }}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-gray-500 dark:text-white/50 transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.07] btn-press"
          >
            Collapse All
          </button>
        </div>

        {/* ── Section E: Detailed Question Review Feed ─────────────────────── */}
        {visible.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-card p-12 text-center text-sm text-gray-400 dark:text-white/40">
            No questions match this filter.
          </div>
        ) : (
          visible.map(({ q, i }) => {
            const ans = answers[i];
            const correct = correctness[i];
            const isFlagged = flaggedQuestions.has(i);
            return (
              <div key={i} className="mb-6 rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-card p-6 text-start backdrop-blur-xl transition-colors duration-300">
                {/* Card header */}
                <div className="mb-4 flex flex-wrap items-center gap-2.5">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white/85">Question {i + 1}</span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${style.borderOp15} ${style.bgOp10} ${style.text}`}>
                    {subject?.name ?? 'General'}
                  </span>
                  {isFlagged && (
                    <span className="flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                      <Flag size={11} className="fill-amber-500 dark:fill-amber-400" /> Flagged
                    </span>
                  )}
                  <span
                    className={`ms-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      correct ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {correct ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                {/* Question statement (with markdown table support) */}
                {q.type !== 'fillblank' && <QuestionText text={q.text ?? q.question ?? ''} />}

                {/* Answer review */}
                {renderAnswerReview(q, ans)}

                {/* Toggle collapsers */}
                {(q.explanation || q.keyConcept) && (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-200 dark:border-white/[0.05] pt-4">
                    {q.explanation && (
                      <button
                        onClick={() => toggleSet(setOpenExplanations, i)}
                        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer btn-press ${
                          openExplanations.has(i)
                            ? 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                            : 'border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.03] text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/[0.07]'
                        }`}
                      >
                        <Lightbulb size={13} /> Explanation
                      </button>
                    )}
                    {q.keyConcept && (
                      <button
                        onClick={() => toggleSet(setOpenConcepts, i)}
                        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer btn-press ${
                          openConcepts.has(i)
                            ? 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300'
                            : 'border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.03] text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/[0.07]'
                        }`}
                      >
                        <Bookmark size={13} /> Key Concept
                      </button>
                    )}
                  </div>
                )}

                {q.explanation && openExplanations.has(i) && (
                  <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] dark:bg-amber-500/[0.05] p-4 transition-all">
                    <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                      <Lightbulb size={13} /> Explanation
                    </p>
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-white/75">{q.explanation}</p>
                  </div>
                )}
                {q.keyConcept && openConcepts.has(i) && (
                  <div className="mt-3 rounded-xl border border-sky-500/20 bg-sky-500/[0.03] dark:bg-sky-500/[0.05] p-4 transition-all">
                    <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                      <Bookmark size={13} /> Key Concept
                    </p>
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-white/75">{q.keyConcept}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

export default ResultsDashboard;
