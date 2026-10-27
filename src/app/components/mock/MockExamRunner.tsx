import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Flag,
  Grid,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
  Send,
  Clock,
} from 'lucide-react';
import type { MockExamConfig, MockExamQuestion, MockExamResult } from '../../types/mockExam';
import { calculateAinShamsGrade } from '../../utils/mockExamGrading';
import { checkAnswerCorrect } from '../../utils/quiz';

export interface MockExamRunnerProps {
  config: MockExamConfig;
  questions: MockExamQuestion[];
  onComplete: (result: MockExamResult) => void;
  onExit: () => void;
}

export function MockExamRunner({
  config,
  questions: initialQuestions,
  onComplete,
  onExit,
}: MockExamRunnerProps) {
  const [questions, setQuestions] = useState<MockExamQuestion[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Timer state
  const totalAllottedSeconds = config.durationMinutes * 60;
  const isUntimed = config.durationMinutes === 0;
  const [remainingSeconds, setRemainingSeconds] = useState(totalAllottedSeconds);
  const startTimeRef = useRef(Date.now());
  const questionStartTimesRef = useRef<number[]>(new Array(initialQuestions.length).fill(Date.now()));
  const questionDurationsRef = useRef<number[]>(new Array(initialQuestions.length).fill(0));

  const currentQ = questions[currentIndex];

  // Track time per question on index change
  useEffect(() => {
    questionStartTimesRef.current[currentIndex] = Date.now();
  }, [currentIndex]);

  const recordTimeForCurrentQuestion = useCallback(() => {
    const elapsed = Math.round((Date.now() - questionStartTimesRef.current[currentIndex]) / 1000);
    questionDurationsRef.current[currentIndex] += elapsed;
    questionStartTimesRef.current[currentIndex] = Date.now();
  }, [currentIndex]);

  // Submit Handler
  const handleFinalSubmit = useCallback(() => {
    recordTimeForCurrentQuestion();

    const totalDurationSeconds = Math.max(
      1,
      Math.round((Date.now() - startTimeRef.current) / 1000)
    );

    let correctCount = 0;
    let answeredCount = 0;
    const disciplineMap: Record<string, { total: number; correct: number; accuracy: number }> = {};

    const finalizedQuestions = questions.map((q, idx) => {
      const qDuration = questionDurationsRef.current[idx] || 0;
      let isCorrect = false;

      if (q.selectedOption !== undefined) {
        answeredCount++;
        if (checkAnswerCorrect(q, q.selectedOption)) {
          isCorrect = true;
          correctCount++;
        }
      }

      const sName = q.subjectName || 'Medical';
      if (!disciplineMap[sName]) {
        disciplineMap[sName] = { total: 0, correct: 0, accuracy: 0 };
      }
      disciplineMap[sName].total++;
      if (isCorrect) {
        disciplineMap[sName].correct++;
      }

      return {
        ...q,
        timeSpentSeconds: qDuration,
      };
    });

    for (const d of Object.values(disciplineMap)) {
      d.accuracy = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
    }

    const scorePercentage =
      finalizedQuestions.length > 0 ? Math.round((correctCount / finalizedQuestions.length) * 100) : 0;
    const gradeInfo = calculateAinShamsGrade(scorePercentage);

    const validDurations = questionDurationsRef.current.filter((d) => d > 0);
    const avgSec =
      validDurations.length > 0
        ? Math.round(validDurations.reduce((a, b) => a + b, 0) / validDurations.length)
        : Math.round(totalDurationSeconds / Math.max(1, finalizedQuestions.length));

    const fastestSec = validDurations.length > 0 ? Math.min(...validDurations) : avgSec;
    const slowestSec = validDurations.length > 0 ? Math.max(...validDurations) : avgSec;

    const result: MockExamResult = {
      id: `mock_res_${Date.now()}`,
      moduleCode: config.moduleCode,
      timestamp: new Date().toISOString(),
      preset: config.preset,
      mode: config.mode,
      totalQuestions: finalizedQuestions.length,
      answeredCount,
      correctCount,
      scorePercentage,
      gradeInfo,
      isPassed: scorePercentage >= 60,
      totalDurationSeconds,
      allottedDurationSeconds: totalAllottedSeconds,
      averageSecondsPerQuestion: avgSec,
      fastestQuestionSeconds: fastestSec,
      slowestQuestionSeconds: slowestSec,
      disciplineBreakdown: disciplineMap,
      questions: finalizedQuestions,
    };

    onComplete(result);
  }, [questions, config, onComplete, recordTimeForCurrentQuestion, totalAllottedSeconds]);

  // Countdown timer effect
  useEffect(() => {
    if (isUntimed) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isUntimed, handleFinalSubmit]);

  // Answer selection handler
  const handleSelectOption = (optIndex: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[currentIndex] = {
        ...copy[currentIndex],
        selectedOption: optIndex,
      };
      return copy;
    });
  };

  // Toggle flag
  const handleToggleFlag = () => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[currentIndex] = {
        ...copy[currentIndex],
        isFlagged: !copy[currentIndex].isFlagged,
      };
      return copy;
    });
  };

  // Navigation handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      recordTimeForCurrentQuestion();
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      recordTimeForCurrentQuestion();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleJumpToQuestion = (idx: number) => {
    recordTimeForCurrentQuestion();
    setCurrentIndex(idx);
    setPaletteOpen(false);
  };

  // Keyboard navigation listener (Apple HIG)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSubmitConfirm) return;

      // Numbers 1-4 for options
      if (['1', '2', '3', '4'].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        if (currentQ?.options && optIdx < currentQ.options.length) {
          handleSelectOption(optIdx);
        }
      }

      // Keys A-D for options
      if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
        const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
        const optIdx = map[e.key.toLowerCase()];
        if (currentQ?.options && optIdx < currentQ.options.length) {
          handleSelectOption(optIdx);
        }
      }

      // 'F' to flag
      if (e.key === 'f' || e.key === 'F') {
        handleToggleFlag();
      }

      // Arrow navigation
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQ, showSubmitConfirm]);

  const unansweredCount = questions.filter((q) => q.selectedOption === undefined).length;
  const answeredCount = questions.length - unansweredCount;

  // Format timer
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timerWarning = remainingSeconds < 300 && remainingSeconds > 0; // Under 5 minutes
  const timerCritical = remainingSeconds < 60 && remainingSeconds > 0; // Under 1 minute

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col justify-between">
      {/* ── TOP HEADER BAR ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/90 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Module title & progress pill */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExit}
              className="text-xs font-semibold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 px-2.5 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Exit
            </button>

            <span className="font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 hidden sm:inline">
              {config.moduleCode} · {config.preset.toUpperCase()}
            </span>

            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Center: Dynamic Countdown Timer */}
          {!isUntimed && (
            <div
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-1.5 border font-mono text-sm font-black transition-all ${
                timerCritical
                  ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse ring-2 ring-rose-500/30'
                  : timerWarning
                  ? 'border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'border-teal-300 bg-teal-50 text-teal-800 dark:border-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
              }`}
            >
              <Clock size={15} className={timerCritical ? 'animate-spin' : ''} />
              <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Right: Palette Toggle, Flag Button, Submit Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleFlag}
              className={`flex items-center justify-center h-10 w-10 rounded-xl border transition-all ${
                currentQ?.isFlagged
                  ? 'border-amber-400 bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                  : 'border-stone-200 bg-stone-50 text-stone-500 hover:text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400'
              }`}
              title="Flag question for review (F)"
              aria-label="Flag question for review"
            >
              <Flag size={16} className={currentQ?.isFlagged ? 'fill-amber-500' : ''} />
            </button>

            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 min-h-[40px] transition-colors"
              aria-label="Open question navigator grid"
            >
              <Grid size={15} />
              <span className="hidden sm:inline">Grid ({answeredCount}/{questions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 min-h-[40px] transition-all hover:scale-[1.02]"
            >
              <Send size={13} />
              Submit Exam
            </button>
          </div>
        </div>
      </header>

      {/* ── QUESTION BODY AREA ────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center">
        {currentQ ? (
          <div className="space-y-6">
            {/* Subject & Lecture tags */}
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold text-teal-600 dark:text-teal-400">
                {currentQ.subjectName || 'Medical Curriculum'}
              </span>
              {currentQ.chapterTitle && (
                <span className="truncate max-w-[200px] text-stone-400">
                  {currentQ.chapterTitle}
                </span>
              )}
            </div>

            {/* Medical Question Stem */}
            <div className="rounded-3xl border border-stone-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/90">
              <h2 className="text-base sm:text-lg font-bold leading-relaxed text-stone-900 dark:text-stone-100">
                {currentQ.text}
              </h2>
            </div>

            {/* MCQ Options List */}
            {currentQ.options && (
              <div className="space-y-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = currentQ.selectedOption === oIdx;
                  const isAnswerKey = currentQ.correctIndex === oIdx;
                  const showTutorFeedback = config.mode === 'tutor' && currentQ.selectedOption !== undefined;

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full flex items-center justify-between rounded-2xl border p-4 text-left transition-all min-h-[52px] cursor-pointer ${
                        showTutorFeedback && isAnswerKey
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100 ring-2 ring-emerald-500/30'
                          : showTutorFeedback && isSelected && !isAnswerKey
                          ? 'border-rose-400 bg-rose-50 text-rose-950 dark:bg-rose-950/60 dark:text-rose-100'
                          : isSelected
                          ? 'border-teal-500 bg-teal-50/70 text-teal-950 dark:bg-teal-950/50 dark:text-teal-100 shadow-sm ring-2 ring-teal-500/25'
                          : 'border-stone-200/80 bg-white/70 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900/60 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs transition-colors ${
                            isSelected
                              ? 'bg-teal-600 text-white'
                              : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="text-sm font-medium leading-relaxed">{opt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {showTutorFeedback && isAnswerKey && (
                          <span className="rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                            Official Key
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-stone-400 hidden sm:inline">
                          Press {oIdx + 1}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Instant Tutor Mode Feedback Box */}
            {config.mode === 'tutor' && currentQ.selectedOption !== undefined && currentQ.explanation && (
              <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 text-xs dark:border-teal-900/60 dark:bg-teal-950/40 animate-in fade-in duration-200">
                <span className="font-bold text-teal-800 dark:text-teal-300 block mb-1">
                  Faculty Clinical Explanation:
                </span>
                <p className="text-teal-950 dark:text-teal-100 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-sm text-stone-400">Loading exam questions…</p>
        )}
      </main>

      {/* ── BOTTOM PAGINATION CONTROLS ───────────────────────────── */}
      <footer className="border-t border-stone-200/80 bg-white/90 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/90 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 min-h-[44px] transition-colors"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <span className="text-xs text-stone-500 dark:text-stone-400 hidden sm:inline">
            Use <kbd className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 font-mono text-[10px]">←</kbd> and{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 font-mono text-[10px]">→</kbd> to navigate
          </span>

          <button
            type="button"
            onClick={currentIndex === questions.length - 1 ? () => setShowSubmitConfirm(true) : handleNext}
            className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold min-h-[44px] transition-all ${
              currentIndex === questions.length - 1
                ? 'bg-teal-600 text-white shadow-sm hover:bg-teal-700'
                : 'border border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200'
            }`}
          >
            {currentIndex === questions.length - 1 ? 'Review & Submit' : 'Next Question'}
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>

      {/* ── SLIDE-OUT QUESTION NAVIGATOR PALETTE ─────────────────── */}
      {paletteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="palette-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-lg rounded-3xl border border-stone-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl dark:border-stone-800 dark:bg-stone-900/95 max-h-[85vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h3 id="palette-modal-title" className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Question Navigator Grid
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {answeredCount} Answered · {unansweredCount} Unanswered · {questions.filter((q) => q.isFlagged).length} Flagged
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPaletteOpen(false)}
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Number Buttons Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-2.5 my-5 max-h-[50vh] overflow-y-auto p-1">
                {questions.map((q, idx) => {
                  const isCurrent = currentIndex === idx;
                  const isAnswered = q.selectedOption !== undefined;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`relative flex items-center justify-center h-10 w-10 rounded-xl font-bold text-xs transition-all ${
                        isCurrent
                          ? 'ring-2 ring-teal-500 scale-105'
                          : ''
                      } ${
                        isAnswered
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
                      }`}
                    >
                      {idx + 1}
                      {q.isFlagged && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 ring-2 ring-white dark:ring-stone-900" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
              <button
                type="button"
                onClick={() => setPaletteOpen(false)}
                className="rounded-xl bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 min-h-[40px]"
              >
                Close Navigator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBMIT CONFIRMATION ALERT ────────────────────────────── */}
      {showSubmitConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md rounded-3xl border border-stone-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl dark:border-stone-800 dark:bg-stone-900/95 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h3 id="confirm-modal-title" className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Ready to Submit Exam?
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {unansweredCount > 0
                    ? `You have ${unansweredCount} unanswered questions remaining.`
                    : 'All questions have been answered.'}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Once submitted, your final score and Ain Shams letter grade will be computed. Answers will be locked and cannot be changed.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 min-h-[44px]"
              >
                Keep Solving
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSubmitConfirm(false);
                  handleFinalSubmit();
                }}
                className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 min-h-[44px]"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
