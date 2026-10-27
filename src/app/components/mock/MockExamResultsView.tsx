import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Zap,
  Target,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Flag,
} from 'lucide-react';
import type { MockExamResult, MockExamQuestion } from '../../types/mockExam';
import { checkAnswerCorrect } from '../../utils/quiz';

export interface MockExamResultsViewProps {
  result: MockExamResult;
  onRetryMissed: (missedQuestions: MockExamQuestion[]) => void;
  onRetakeExam: () => void;
  onBackToHub: () => void;
}

export function MockExamResultsView({
  result,
  onRetryMissed,
  onRetakeExam,
  onBackToHub,
}: MockExamResultsViewProps) {
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'flagged'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const grade = result.gradeInfo;

  const isQuestionCorrect = (q: MockExamQuestion) => {
    return checkAnswerCorrect(q, q.selectedOption);
  };

  // Filter questions for review
  const missedQuestions = result.questions.filter((q) => !isQuestionCorrect(q));

  const flaggedQuestions = result.questions.filter((q) => q.isFlagged);

  const filteredQuestions = result.questions.filter((q) => {
    if (reviewFilter === 'incorrect') return !isQuestionCorrect(q);
    if (reviewFilter === 'flagged') return q.isFlagged;
    return true;
  });

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 py-6 px-4">
      {/* ── 1. AIN SHAMS GRADE CELEBRATION HERO ────────────────── */}
      <div className={`rounded-3xl border-2 p-6 md:p-8 backdrop-blur-2xl shadow-xl transition-all ${grade.badgeBg} ${grade.badgeBorder}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Massive Grade Badge */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white shadow-md dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
              <span className={`text-5xl font-black tracking-tight ${grade.color}`}>
                {grade.grade}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${grade.badgeBg} ${grade.color} border ${grade.badgeBorder}`}>
                  Ain Shams Medical Scale · {grade.status}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  {grade.gpaPoints.toFixed(2)} GPA Points
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
                {result.isPassed ? 'Examination Completed Successfully' : 'Assessment Completed — Review Recommended'}
              </h1>
              <p className="text-xs md:text-sm text-stone-600 dark:text-stone-300 mt-1">
                {result.moduleCode} · {result.preset.toUpperCase()} · Completed {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Quick Score Counter */}
          <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-stone-200/60 dark:border-stone-800">
            <div className="text-left md:text-right">
              <span className="text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100">
                {result.scorePercentage}%
              </span>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                {result.correctCount} of {result.totalQuestions} Questions Correct
              </p>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {missedQuestions.length > 0 ? (
                <button
                  type="button"
                  onClick={() => onRetryMissed(missedQuestions)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 min-h-[44px] transition-all hover:scale-[1.02]"
                >
                  <Target size={14} />
                  Retry {missedQuestions.length} Missed
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={16} /> Perfect Score!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. PACING & PERFORMANCE METRICS ─────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-stone-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/80">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Duration</span>
            <Clock size={15} className="text-blue-600" />
          </div>
          <p className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {formatSeconds(result.totalDurationSeconds)}
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5">
            of {result.allottedDurationSeconds > 0 ? formatSeconds(result.allottedDurationSeconds) : 'Untimed'}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/80">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Average Pace</span>
            <Zap size={15} className="text-amber-600" />
          </div>
          <p className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {result.averageSecondsPerQuestion}s / Q
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5">
            Fastest: {result.fastestQuestionSeconds}s · Slowest: {result.slowestQuestionSeconds}s
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/80">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Accuracy</span>
            <CheckCircle2 size={15} className="text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {result.scorePercentage}%
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            {result.correctCount} Correct Answers
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/80">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Review Flags</span>
            <Flag size={15} className="text-rose-600" />
          </div>
          <p className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {flaggedQuestions.length} Flagged
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5">
            {missedQuestions.length} Incorrect
          </p>
        </div>
      </div>

      {/* ── 3. DISCIPLINE MASTERY BREAKDOWN ─────────────────────── */}
      {Object.keys(result.disciplineBreakdown).length > 0 && (
        <div className="rounded-3xl border border-stone-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/80">
          <h3 className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-teal-600" />
            Curricular Discipline Mastery Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(result.disciplineBreakdown).map(([discipline, stats]) => (
              <div
                key={discipline}
                className="rounded-2xl border border-stone-200/60 bg-stone-50/60 p-3.5 dark:border-stone-800 dark:bg-stone-800/40"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate">
                    {discipline}
                  </span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${
                      stats.accuracy >= 80
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : stats.accuracy >= 65
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {stats.accuracy}%
                  </span>
                </div>

                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {stats.correct} of {stats.total} correct
                </p>

                <div className="mt-2 h-1.5 w-full rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stats.accuracy >= 80 ? 'bg-emerald-500' : stats.accuracy >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, stats.accuracy))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. DETAILED QUESTION REVIEW DRAWER ───────────────────── */}
      <div className="rounded-3xl border border-stone-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Exam Questions Review ({filteredQuestions.length})
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Review your answers, official department keys, and detailed faculty rationales.
            </p>
          </div>

          {/* Segmented Review Filters */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setReviewFilter('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold min-h-[36px] transition-all ${
                reviewFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-sm dark:bg-stone-900 dark:text-stone-100'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-400'
              }`}
            >
              All ({result.totalQuestions})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('incorrect')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold min-h-[36px] transition-all ${
                reviewFilter === 'incorrect'
                  ? 'bg-white text-rose-700 shadow-sm dark:bg-stone-900 dark:text-rose-400'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-400'
              }`}
            >
              Missed ({missedQuestions.length})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('flagged')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold min-h-[36px] transition-all ${
                reviewFilter === 'flagged'
                  ? 'bg-white text-amber-700 shadow-sm dark:bg-stone-900 dark:text-amber-400'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-400'
              }`}
            >
              Flagged ({flaggedQuestions.length})
            </button>
          </div>
        </div>

        {/* Question Review List */}
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => {
            const isExpanded = expandedQuestionId === String(q.id);
            const isCorrect = isQuestionCorrect(q);

            return (
              <div
                key={q.id}
                className={`rounded-2xl border p-4 transition-all ${
                  isCorrect
                    ? 'border-stone-200/80 bg-stone-50/40 dark:border-stone-800 dark:bg-stone-900/40'
                    : 'border-rose-200/80 bg-rose-50/20 dark:border-rose-900/50 dark:bg-rose-950/20'
                }`}
              >
                <div
                  className="flex items-start justify-between gap-3 cursor-pointer"
                  onClick={() => setExpandedQuestionId(isExpanded ? null : String(q.id))}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="rounded-md bg-stone-200/70 px-2 py-0.5 text-[10px] font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                          {q.subjectName || 'Medical'}
                        </span>
                        {q.isFlagged && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            <Flag size={10} /> Flagged
                          </span>
                        )}
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            isCorrect
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 leading-relaxed">
                        {q.text}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                    aria-label={isExpanded ? 'Collapse explanation' : 'Expand explanation'}
                  >
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                </div>

                {/* Expanded Explanation & Options Details */}
                {isExpanded && (
                  <div className="mt-4 border-t border-stone-200/60 dark:border-stone-800 pt-3 space-y-3 animate-in fade-in duration-150">
                    {/* Choices Preview */}
                    {q.options && (
                      <div className="space-y-1.5 text-xs">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = q.selectedOption === oIdx;
                          const isAnswerKey = q.correctIndex === oIdx;

                          return (
                            <div
                              key={oIdx}
                              className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                                isAnswerKey
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 font-semibold'
                                  : isSelected
                                  ? 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200'
                                  : 'border-stone-200/50 text-stone-600 dark:border-stone-800 dark:text-stone-400'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold w-4">{String.fromCharCode(65 + oIdx)}.</span>
                                <span>{opt}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {isSelected && (
                                  <span className="rounded bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 text-[9px] font-bold">
                                    Your Choice
                                  </span>
                                )}
                                {isAnswerKey && (
                                  <span className="rounded bg-emerald-600 text-white px-1.5 py-0.5 text-[9px] font-bold">
                                    Official Key
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Faculty Explanation */}
                    {q.explanation && (
                      <div className="rounded-xl border border-teal-200/60 bg-teal-50/60 p-3 text-xs dark:border-teal-900/50 dark:bg-teal-950/30">
                        <span className="font-bold text-teal-800 dark:text-teal-300 block mb-1">
                          Faculty Clinical Rationale:
                        </span>
                        <p className="text-teal-950 dark:text-teal-100 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. BOTTOM NAVIGATION ACTIONS ────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBackToHub}
          className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 min-h-[44px] transition-colors"
        >
          Return to Module Hub
        </button>

        <div className="flex items-center gap-2">
          {missedQuestions.length > 0 && (
            <button
              type="button"
              onClick={() => onRetryMissed(missedQuestions)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 min-h-[44px] transition-all"
            >
              <RotateCcw size={14} />
              Retry {missedQuestions.length} Missed Questions
            </button>
          )}

          <button
            type="button"
            onClick={onRetakeExam}
            className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-stone-800 dark:bg-white dark:text-stone-900 min-h-[44px] transition-all"
          >
            Take Another Mock Exam
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
