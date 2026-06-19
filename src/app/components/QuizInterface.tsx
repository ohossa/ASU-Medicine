import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
import TimerSettingsPanel, { type TimerMode } from '../components/TimerSettingsPanel';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@clerk/clerk-react';
import { fx } from '../lib/pulseEngine';
import type { QuizSessionSave } from '../hooks/useQuizSession';
import { useQuizSession } from '../hooks/useQuizSession';
import { useSoundEngine } from '../hooks/useSoundEngine';
import { checkAnswerCorrect } from '../utils/quiz';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Clock,
  Flag,
  Keyboard,
  Target,
  Grid3X3,
  Lightbulb,
  Bookmark,
  AlertCircle,
  Activity,
  Star
} from 'lucide-react';
import type { ChapterData, SubjectData, Question, SubjectColor, QuizAnswer } from '../types';
import { subjectStyles, formatTime } from '../types';
import { useLanguage } from '../hooks/useLanguage';

import { MatchingQuestion } from './MatchingQuestion';
import { useQuizEngine } from '../hooks/useQuizEngine';
import { useHintSystem } from '../hooks/useHintSystem';
import { AIChatPanel } from './AIChatPanel';

interface Props {
  chapter: ChapterData;
  subject: SubjectData | null;
  questions: Question[];
  onBack: () => void;
  onFinish: (answers: Record<number, QuizAnswer>, elapsedSeconds: number, flaggedQuestions: Set<number>) => void;
  userButton?: React.ReactNode;
}

/* ----------------------------- Motion variants ----------------------------- */

const questionVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 48, scale: 0.98 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -48, scale: 0.98 })
};

/* --------------------------------- Helpers -------------------------------- */

const isAnswered = (q: Question, a: QuizAnswer | undefined): boolean => {
  if (a === undefined || a === null) return false;
  switch (q.type) {
  case 'essay':
      return typeof a === 'object'
        ? a.selfGrade !== undefined
        : typeof a === 'string' && a.trim().length > 0;
    case 'fillblank':
      return typeof a === 'object' && a.submitted === true;
    case 'matching':
      return typeof a === 'object' && a.submitted === true;
    case 'casestudy':
    case 'case':
      return typeof a === 'object' && Object.keys(a).length > 0;
    default:
      return true;
  }
};

function getQuestionStatus(q: Question, ans: QuizAnswer | undefined): 'correct' | 'incorrect' | 'pending' | 'unanswered' {
  const answered = isAnswered(q, ans);
  if (!answered) return 'unanswered';

  if (q.type === 'essay') {
    if (ans?.selfGrade === 'correct') return 'correct';
    if (ans?.selfGrade === 'incorrect') return 'incorrect';
    return 'pending';
  }

  if (q.type === 'case' || q.type === 'casestudy') {
    const subs = q.subQuestions ?? [];
    if (!subs.length) return 'unanswered';

    let hasPending = false;
    let hasIncorrect = false;
    let hasAnsweredAny = false;

    for (const sq of subs) {
      const subAns = ans?.[sq.id];
      if (subAns === undefined) {
        hasPending = true;
        continue;
      }
      hasAnsweredAny = true;
      if (sq.type === 'mcq') {
        if (subAns !== sq.correctIndex) {
          hasIncorrect = true;
        }
      } else if (sq.type === 'fillblank') {
        if (subAns?.submitted !== true) {
          hasPending = true;
        }
      } else {
        const graded = typeof subAns === 'object' && subAns.selfGrade !== undefined;
        if (graded) {
          if (subAns.selfGrade === 'incorrect') {
            hasIncorrect = true;
          }
        } else {
          hasPending = true;
        }
      }
    }

    if (!hasAnsweredAny) return 'unanswered';
    if (hasIncorrect) return 'incorrect';
    if (hasPending) return 'pending';
    return 'correct';
  }

  return checkAnswerCorrect(q, ans) ? 'correct' : 'incorrect';
}

const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

/* ------------------------------ Main component ----------------------------- */

export function QuizInterface({ chapter, subject, questions, onBack, onFinish, userButton, savedSession }: Props & { savedSession?: QuizSessionSave }) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const { getToken } = useAuth();
  const { trigger: playSound, muted, toggleMute } = useSoundEngine();
  const { save: saveQuizSession } = useQuizSession();

  const [announcement, setAnnouncement] = useState('');
  const [direction, setDirection] = useState(1);
  const [essayDraft, setEssayDraft] = useState('');
  const [showEssayAnswer, setShowEssayAnswer] = useState(() => savedSession?.showEssayAnswer ?? false);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [timerMode, setTimerMode] = useState<'off' | 'practice' | 'exam'>('practice');

  const engine = useQuizEngine({
    questions,
    onFinish: (session) => onFinish(session.answers, session.elapsedSeconds, session.flaggedQuestions),
  });
  const {
    current, answers, flagged, elapsedSeconds: totalElapsed,
    showGrid, showShortcuts, progress, answeredCount, timerUrgency,
    blankInputs, blankSubmitted,
    goTo, toggleFlag, setAnswer,
    toggleGrid, toggleShortcuts,
  } = engine;

  const handleGoTo = React.useCallback((index: number) => {
    if (index < 0 || index >= questions.length) return;
    setDirection(index > current ? 1 : -1);
    goTo(index);
  }, [current, goTo, questions.length]);

  // Case Study sub-question drafts temporary state
  const [subEssayDrafts, setSubEssayDrafts] = useState<Record<string, string>>({});
  const [revealedSubEssays, setRevealedSubEssays] = useState<Record<string, boolean>>({});
  const lastFocusedSubQ = useRef<string | null>(null);
  const question = questions[current];
  const total = questions.length;
  
  const subjectColor: SubjectColor = question?.subjectColor ?? 'clinical';
  const style = subjectStyles[subjectColor];

  const answered = question ? (answers[current] !== undefined && isAnswered(question, answers[current])) : false;
  const isCompleted = answered;
  const isCorrect = question ? (
    question.type === 'essay'
      ? answers[current]?.selfGrade === 'correct'
      : question.type === 'case' || question.type === 'casestudy'
        ? getQuestionStatus(question, answers[current]) === 'correct'
        : checkAnswerCorrect(question, answers[current])
  ) : false;

  /* Sound effect + pulse + confetti on answer reveal (once per question) */
  const playedForQuestions = useRef<Set<number>>(new Set());
  useEffect(() => {
    if (answered && question && !playedForQuestions.current.has(current)) {
      playedForQuestions.current.add(current);
      if (isCorrect) {
        fx.correct(0.5, 0.5, 1);
        playSound('correct');
      } else {
        fx.wrong(0.5, 0.5);
        playSound('wrong');
      }
    }
  }, [answered, isCorrect, question, playSound, current]);

  /* Auto-save quiz session every 2 seconds */
  const quizDataRef = useRef({ current: 0, answers: {} as Record<number, unknown>, elapsedSeconds: 0, flagged: [] as number[], finished: false, timerMode: 'practice' as TimerMode, showEssayAnswer: false });
  useLayoutEffect(() => {
    quizDataRef.current = { current, answers, elapsedSeconds, flagged: [...flagged], finished, timerMode, showEssayAnswer };
  });
  useEffect(() => {
    const timer = setInterval(() => {
      const d = quizDataRef.current;
      if (d.finished) return;
      saveQuizSession({
        chapterId: chapter.id,
        subjectName: subject?.name ?? 'all',
        current: d.current,
        answers: d.answers,
        elapsedSeconds: d.elapsedSeconds,
        flagged: d.flagged,
        finished: d.finished,
        timerMode: d.timerMode,
        showEssayAnswer: d.showEssayAnswer,
        essayDrafts: {},
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [chapter.id, subject?.name, saveQuizSession]);

  /* Smooth scroll to essay answer when revealed */
  const essayAnswerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (showEssayAnswer && essayAnswerRef.current) {
      essayAnswerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showEssayAnswer]);

  /* aria-live announcement on answer reveal */
  useLayoutEffect(() => {
    if (!answered || !question) return;
    const lang = language === 'ar' ? 'ar' : 'en';
    const answerIsCorrect = question.type === 'essay'
      ? answers[current]?.selfGrade === 'correct'
      : question.type === 'case' || question.type === 'casestudy'
        ? getQuestionStatus(question, answers[current]) === 'correct'
        : checkAnswerCorrect(question, answers[current]);
    const correctLabel = question.options?.[question.correctIndex ?? -1] ?? '';
    const msg = answerIsCorrect
      ? `${lang === 'ar' ? 'صحيح' : 'Correct'}. ${question.explanation?.slice(0, 80) || ''}`
      : `${lang === 'ar' ? 'خاطئ' : 'Incorrect'}. ${lang === 'ar' ? 'الإجابة الصحيحة كانت' : 'The correct answer was'} ${correctLabel}`;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnnouncement(msg);
  }, [answered, current, question, answers, language]);

  /* Sync temporary states on index change */
  useLayoutEffect(() => {
    lastFocusedSubQ.current = null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowEssayAnswer(false);
    if (!question) return;

    if (question.type === 'essay') {
      setEssayDraft(answers[current]?.text || '');
    } else if (question.type === 'matching') {
      if (answers[current] === undefined && question.pairs) {
        // Scramble targets on first mount
        const scrambled = [...question.pairs].map(p => p.target).sort(() => Math.random() - 0.5);
        setAnswer({ scrambled, matches: {}, submitted: false });
      }
    } else if ((question.type === 'case' || question.type === 'casestudy') && question.subQuestions) {
      const saved = answers[current] || {};
      const drafts: Record<string, string> = {};
      const revs: Record<string, boolean> = {};
      question.subQuestions.forEach(subQ => {
        drafts[subQ.id] = saved[subQ.id]?.text || '';
        revs[subQ.id] = saved[subQ.id] !== undefined;
      });
      setSubEssayDrafts(drafts);
      setRevealedSubEssays(revs);
    }
  }, [current, question, answers, setAnswer]);

  /* Keyboard shortcuts */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'ArrowRight') handleGoTo(isRTL ? current - 1 : current + 1);
      else if (e.key === 'ArrowLeft') handleGoTo(isRTL ? current + 1 : current - 1);
      else if (e.key.toLowerCase() === 'f') toggleFlag();
      else if (e.key.toLowerCase() === 'g') toggleGrid();
      else if (e.key === 'Enter' && question) {
        if (question.type === 'essay' && answers[current]?.selfGrade === undefined && !showEssayAnswer) {
          setShowEssayAnswer(true);
        }
        if ((question.type === 'case' || question.type === 'casestudy') && lastFocusedSubQ.current) {
          const subId = lastFocusedSubQ.current;
          if ((answers[current] ?? {})[subId]?.selfGrade === undefined && !revealedSubEssays[subId]) {
            setRevealedSubEssays(prev => ({ ...prev, [subId]: true }));
          }
        }
      }
      else if (/^[1-9]$/.test(e.key) && question) {
        const idx = Number(e.key) - 1;
        if (question.type === 'mcq' && question.options && idx < question.options.length) {
          if (answers[current] === undefined) {
            setAnswer(idx);
          }
        }
        if (question.type === 'truefalse' && idx < 2) {
          if (answers[current] === undefined) {
            setAnswer(idx === 0);
          }
        }
        if (question.type === 'essay' && showEssayAnswer) {
          const ans = answers[current];
          if (ans?.selfGrade === undefined) {
            if (idx === 0) {
              setAnswer({ text: answers[current]?.text || '', selfGrade: 'correct' });
              setShowEssayAnswer(false);
            } else if (idx === 1) {
              setAnswer({ text: answers[current]?.text || '', selfGrade: 'incorrect' });
              setShowEssayAnswer(false);
            }
          }
        }
        if ((question.type === 'case' || question.type === 'casestudy') && lastFocusedSubQ.current) {
          const subId = lastFocusedSubQ.current;
          const subVal = (answers[current] ?? {})[subId];
          if (subVal?.selfGrade === undefined && revealedSubEssays[subId]) {
            if (idx === 0) {
              setAnswer({ ...answers[current], [subId]: { text: subVal?.text || '', selfGrade: 'correct' } });
              setRevealedSubEssays(prev => ({ ...prev, [subId]: false }));
            } else if (idx === 1) {
              setAnswer({ ...answers[current], [subId]: { text: subVal?.text || '', selfGrade: 'incorrect' } });
              setRevealedSubEssays(prev => ({ ...prev, [subId]: false }));
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current, question, handleGoTo, toggleFlag, answers, isRTL, showEssayAnswer, revealedSubEssays, setAnswer, toggleGrid]);



  // useHintSystem must be called unconditionally (hooks rules)
  const { messages: chatMessages, loading: chatLoading, error: chatError, sendMessage, clearChat } = useHintSystem({
    question: question ?? undefined,
    userAnswer: question ? answers[current] : undefined,
    correctAnswer: question?.options?.[question.correctIndex ?? -1],
    studentWrongAnswer: isCompleted && !isCorrect && question?.options ? question.options[answers[current] as number] : undefined,
    getToken,
    enabled: isCompleted && !!question,
  });

  if (!question) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        <AlertCircle size={18} className="mr-2" /> No questions available.
      </div>
    );
  }

  /* Table rendering parser helper */
  const renderFormattedText = (
    text: string | undefined,
    fallbackClassName: string = "text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed mb-4 whitespace-pre-wrap text-left"
  ) => {
    if (!text) return null;
    if (text.includes('|')) {
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      const rows = lines
        .filter((line) => !line.includes('---') && line.includes('|'))
        .map((line) => {
          const parts = line.split('|');
          if (parts[0] === '') parts.shift();
          if (parts[parts.length - 1] === '') parts.pop();
          return parts.map((cell) => cell.trim());
        });

      if (rows.length > 0) {
        const headers = rows[0];
        const bodyRows = rows.slice(1);

        return (
          <div className="overflow-x-auto my-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] text-left">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                  {headers.map((h, idx) => (
                    <th key={idx} className="p-4 text-[10px] sm:text-xs font-bold text-white/60 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-4 text-xs sm:text-sm font-medium text-white/85">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }
    return (
      <div className={fallbackClassName}>
        {text}
      </div>
    );
  };

  /* ------------------------- Per-format answer renderers ------------------------- */

  const renderMCQ = (q: Question, value: QuizAnswer | undefined, onChange: (v: number) => void) => {
    const hasAnswered = value !== undefined;
    return (
      <div className="space-y-2.5">
        {(q.options ?? []).map((opt, i) => {
          const selected = value === i;
          const isCorrect = i === q.correctIndex;

          let btnClass = 'group flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-start transition-all duration-200 btn-press ';
          if (!hasAnswered) {
            btnClass += 'option-hover ';
          }
          let badgeClass = 'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors ';

          if (!hasAnswered) {
            btnClass += 'border-gray-200 dark:border-white/[0.07] bg-gray-50/50 dark:bg-white/[0.025] hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-800 dark:text-white';
            badgeClass += 'border-gray-300 dark:border-white/15 text-gray-500 dark:text-white/40 bg-gray-100/50 dark:bg-white/[0.03]';
          } else if (isCorrect) {
            btnClass += 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300';
            badgeClass += 'border-emerald-500/40 text-emerald-600 dark:text-emerald-300 bg-emerald-500/10';
          } else if (selected && !isCorrect) {
            btnClass += 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-300 wrong-shake';
            badgeClass += 'border-rose-500/40 text-rose-600 dark:text-rose-300 bg-rose-500/10';
          } else {
            btnClass += 'border-gray-100 dark:border-white/[0.04] bg-gray-50/30 dark:bg-white/[0.01] text-gray-400 dark:text-white/30 cursor-not-allowed';
            badgeClass += 'border-gray-200 dark:border-white/10 text-gray-300 dark:text-white/20';
          }

          return (
            <motion.button
              key={i}
              disabled={hasAnswered}
              whileTap={hasAnswered ? undefined : { scale: 0.985 }}
              onClick={() => onChange(i)}
              className={btnClass}
            >
              <span className={badgeClass}>
                {hasAnswered && isCorrect ? (
                  <Check size={14} />
                ) : hasAnswered && selected && !isCorrect ? (
                  <X size={14} />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="text-sm leading-relaxed">{opt}</span>
            </motion.button>
          );
        })}
      </div>
    );
  };

  const renderTrueFalse = (value: QuizAnswer | undefined, onChange: (v: boolean) => void) => {
    const hasAnswered = value !== undefined;
    return (
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'True', val: true, icon: <Check size={20} /> },
          { label: 'False', val: false, icon: <X size={20} /> }
        ].map(({ label, val, icon }) => {
          const selected = value === val;
          const isCorrect = val === (question.correctIndex === 0);

          let btnClass = 'flex flex-col items-center gap-2 rounded-2xl border py-6 transition-all duration-200 btn-press ';

          if (!hasAnswered) {
            btnClass += 'border-gray-200 dark:border-white/[0.07] bg-gray-50/50 dark:bg-white/[0.025] text-gray-700 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.06]';
          } else if (isCorrect) {
            btnClass += 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300';
          } else if (selected && !isCorrect) {
            btnClass += 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-300 wrong-shake';
          } else {
            btnClass += 'border-gray-200 dark:border-white/[0.04] bg-gray-50/30 dark:bg-white/[0.01] text-gray-400 dark:text-white/20 cursor-not-allowed';
          }

          return (
            <motion.button
              key={label}
              disabled={hasAnswered}
              whileTap={hasAnswered ? undefined : { scale: 0.97 }}
              onClick={() => onChange(val)}
              className={btnClass}
            >
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </motion.button>
          );
        })}
      </div>
    );
  };

  const renderEssay = (value: QuizAnswer | undefined, onChange: (v: { text: string; selfGrade?: string }) => void) => {
    const isCompleted = value?.selfGrade !== undefined;
    return (
      <div className="space-y-4">
        <textarea
          value={essayDraft}
          disabled={isCompleted}
          onChange={e => {
            const val = e.target.value;
            setEssayDraft(val);
            onChange({ text: val, selfGrade: value?.selfGrade });
          }}
          rows={7}
          placeholder={t('essayPlaceholder') || "Type your answer…"}
          className="w-full resize-y rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-black/30 p-4 text-sm leading-relaxed text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none transition-colors focus:border-gray-400 dark:focus:border-white/25 backdrop-blur-xl"
        />
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white/35">
          <span className="flex items-center gap-1.5">
            <Lightbulb size={13} className="text-amber-500/70 dark:text-amber-400/70" />
            Structure: definition, mechanism, clinical relevance.
          </span>
          <span className="tabular-nums">{wordCount(essayDraft)} words</span>
        </div>

        {!isCompleted && !showEssayAnswer && (
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowEssayAnswer(true);
                requestAnimationFrame(() => {
                  setTimeout(() => {
                    const answerEl = document.querySelector('[data-essay-answer]');
                    if (answerEl) {
                      const targetY = answerEl.getBoundingClientRect().top + window.scrollY - 32;
                      const extra = Math.min(400, window.innerHeight * 0.35);
                      window.scrollTo({ top: targetY + extra, behavior: 'smooth' });
                    }
                  }, 120);
                });
              }}
              className="px-6 py-2.5 bg-gray-950 dark:bg-white text-white dark:text-black rounded-full text-xs font-bold tracking-wide hover:scale-[0.98] transition-transform hover:bg-gray-900 dark:hover:bg-gray-100 btn-press"
            >
              {t('revealModelAnswer') || "Reveal Model Answer"}
            </button>
          </div>
        )}

        {(showEssayAnswer || isCompleted) && (
          <div ref={essayAnswerRef} data-essay-answer className="space-y-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/[0.03] p-4 text-start">
            <div className="flex items-center gap-2">
              <Lightbulb size={16} className="text-emerald-500 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {t('modelAnswerReference') || "Reference Answer"}
              </span>
            </div>
            <p className="text-xs text-gray-700 dark:text-white/80 leading-relaxed whitespace-pre-wrap">{question.modelAnswer}</p>

            {question.keyConcept && (
              <div className="rounded-lg border border-sky-500/15 bg-sky-50/50 dark:bg-sky-500/[0.03] p-3 flex items-start gap-2.5">
                <Bookmark size={15} className="text-sky-500 dark:text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block mb-0.5">Key Concept</span>
                  <p className="text-xs text-gray-700 dark:text-white/70 leading-relaxed">{question.keyConcept}</p>
                </div>
              </div>
            )}

            {!isCompleted && (
              <div className="pt-4 border-t border-gray-200 dark:border-emerald-500/10">
                <h4 className="text-xs font-bold text-gray-600 dark:text-white/60 uppercase tracking-wider mb-1">
                  {t('selfGrading') || "Self Grading"}
                </h4>
                <p className="text-xs text-gray-500 dark:text-white/45 mb-3">
                  {t('selfGradingDesc') || "Grade yourself based on the reference answer above."}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onChange({ text: essayDraft, selfGrade: 'correct' });
                      setShowEssayAnswer(false);
                    }}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white dark:text-black rounded-full text-xs font-bold transition-colors btn-press"
                  >
                    {t('correct') || "Correct"}
                  </button>
                  <button
                    onClick={() => {
                      onChange({ text: essayDraft, selfGrade: 'incorrect' });
                      setShowEssayAnswer(false);
                    }}
                    className="px-5 py-2 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/5 rounded-full text-xs font-bold transition-colors btn-press"
                  >
                    {t('incorrect') || "Incorrect"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderFillBlank = (q: Question, _value: QuizAnswer | undefined, onChange: (v: { inputs: string[]; submitted: boolean }) => void) => {
    const parts = (q.text ?? '').split('___');
    const blanks = Math.max(parts.length - 1, 1);
    const checkBlank = (i: number, val: string) => {
      const primary = (q.blanks || [])[i]?.trim().toLowerCase() || '';
      const alts = ((q.acceptedAnswers || [])[i] || []).map(a => a.trim().toLowerCase());
      return val.trim().toLowerCase() === primary || alts.includes(val.trim().toLowerCase());
    };

    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.01] p-5 leading-loose text-base text-gray-800 dark:text-white/80 text-left">
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              <span className="whitespace-pre-wrap">{part}</span>
              {i < blanks && (
                <span className={`inline-block mx-1.5 align-middle rounded-lg transition-all ${
                  blankSubmitted
                    ? checkBlank(i, blankInputs[i] || '')
                      ? 'ring-2 ring-emerald-500/40'
                      : 'ring-2 ring-rose-500/40'
                    : 'ring-2 ring-gray-200 dark:ring-white/10 focus-within:ring-gray-400 dark:focus-within:ring-white/30'
                }`}>
                  <input
                    type="text"
                    disabled={blankSubmitted}
                    value={blankInputs[i] || ''}
                    onChange={e => {
                      const next = [...blankInputs];
                      next[i] = e.target.value;
                      onChange({ inputs: next, submitted: false });
                    }}
                    placeholder={`Blank ${i + 1}`}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold outline-none bg-gray-100 dark:bg-[#0e0e10] border-0 text-center transition-all ${
                      blankSubmitted
                        ? checkBlank(i, blankInputs[i] || '')
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
                          : 'text-rose-600 dark:text-rose-400 bg-rose-500/5 line-through'
                        : 'text-gray-900 dark:text-white'
                    }`}
                    style={{ width: `${Math.max(120, (blankInputs[i]?.length || 8) * 9 + 40)}px` }}
                  />
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {!blankSubmitted && (
          <div className="flex justify-end">
            <button
              onClick={() => {
                onChange({ inputs: [...blankInputs], submitted: true });
              }}
              disabled={blankInputs.some((v, i) => i < blanks && !v?.trim())}
              className="px-6 py-2.5 bg-gray-950 dark:bg-white text-white dark:text-black rounded-full text-xs font-bold tracking-wide hover:scale-[0.98] transition-transform hover:bg-gray-900 dark:hover:bg-gray-100 disabled:opacity-35 disabled:cursor-not-allowed btn-press"
            >
              Check Answers
            </button>
          </div>
        )}

        {blankSubmitted && (
          <div className="space-y-2.5 text-start">
            {(q.blanks || []).map((correctAns, i) => {
              const isCorrect = checkBlank(i, blankInputs[i] || '');
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs ${
                    isCorrect ? 'border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/[0.03]' : 'border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/[0.03]'
                  }`}
                >
                  <div className="mt-0.5">
                    {isCorrect ? <Check size={14} className="text-emerald-500 dark:text-emerald-400" /> : <X size={14} className="text-rose-500 dark:text-rose-400" />}
                  </div>
                  <div>
                    <span className={`font-semibold block ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Blank {i + 1}: {isCorrect ? 'Correct!' : `Incorrect — you wrote "${blankInputs[i] || '—'}"`}
                    </span>
                    {!isCorrect && (
                      <span className="text-gray-500 dark:text-white/50 block mt-0.5">
                        Correct answer: <span className="text-emerald-600 dark:text-emerald-450 font-semibold">{correctAns}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderMatching = (q: Question, _value: QuizAnswer | undefined, onChange: (v: { scrambled: string[]; matches: Record<string, string>; submitted: boolean }) => void) => {
    return (
      <MatchingQuestion
        pairs={q.pairs ?? []}
        scrambled={_value?.scrambled ?? []}
        matches={_value?.matches ?? {}}
        submitted={_value?.submitted === true}
        disabled={false}
        onChange={onChange}
      />
    );
  };

  const renderCaseStudy = (q: Question, value: QuizAnswer | undefined, onChange: (v: QuizAnswer) => void) => {
    const subAns = value ?? {};
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-sky-500/30 bg-sky-50/70 dark:bg-sky-500/[0.05] p-4 text-start">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-300">
            <Activity size={14} /> Clinical Case
          </p>
          <p className="text-sm leading-relaxed text-gray-800 dark:text-white/75">{q.text}</p>
        </div>

        <div className="space-y-6">
          {(q.subQuestions ?? []).map((subQ) => {
            const subVal = subAns[subQ.id];
            const isCompleted = subVal !== undefined;

            return (
              <div key={subQ.id} className="border-t border-gray-200 dark:border-white/[0.06] pt-5 text-start">
                {(() => {
                  const cleanText = (subQ.text ?? '')
                    .replace(/^\[TYPE:\s*\w+\]\s*/i, '')
                    .replace(/^Sub-question\s*\d*\s*:?\s*/i, '');
                  return (
                    <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white/90 leading-relaxed">
                      {cleanText}
                    </h4>
                  );
                })()}

                {subQ.type === 'fillblank' ? (() => {
                  const parts = subQ.text.split('___');
                  const blanksCount = Math.max(parts.length - 1, 1);
                  const blankInputs: string[] = (subVal?.inputs as string[] | undefined) || Array(blanksCount).fill('');
                  const submitted = subVal?.submitted === true;
                  const checkSubBlank = (i: number, val: string) => {
                    const primary = (subQ.blanks || [])[i]?.trim().toLowerCase() || '';
                    const alts = ((subQ.acceptedAnswers || [])[i] || []).map(a => a.trim().toLowerCase());
                    return val.trim().toLowerCase() === primary || alts.includes(val.trim().toLowerCase());
                  };
                  return (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.01] p-4 leading-loose text-sm text-gray-800 dark:text-white/80 text-left">
                        {parts.map((part, i) => (
                          <React.Fragment key={i}>
                            <span className="whitespace-pre-wrap">{part}</span>
                            {i < blanksCount && (
                              <span className={`inline-block mx-1 align-middle rounded-lg transition-all ${
                                submitted
                                  ? checkSubBlank(i, blankInputs[i] || '')
                                    ? 'ring-2 ring-emerald-500/40'
                                    : 'ring-2 ring-rose-500/40'
                                  : 'ring-2 ring-gray-200 dark:ring-white/10 focus-within:ring-gray-400 dark:focus-within:ring-white/30'
                              }`}>
                                <input
                                  type="text"
                                  disabled={submitted}
                                  value={blankInputs[i] || ''}
                                  onChange={e => {
                                    const next = [...blankInputs];
                                    next[i] = e.target.value;
                                    onChange({ ...subAns, [subQ.id]: { inputs: next, submitted: false } });
                                  }}
                                  placeholder={`Blank ${i + 1}`}
                                  className={`px-3 py-1 rounded-lg text-xs font-bold outline-none bg-gray-100 dark:bg-[#0e0e10] border-0 text-center transition-all ${
                                    submitted
                                      ? checkSubBlank(i, blankInputs[i] || '')
                                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
                                        : 'text-rose-600 dark:text-rose-400 bg-rose-500/5 line-through'
                                      : 'text-gray-900 dark:text-white'
                                  }`}
                                  style={{ width: `${Math.max(120, (blankInputs[i]?.length || 8) * 9 + 40)}px` }}
                                />
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      {!submitted && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => onChange({ ...subAns, [subQ.id]: { inputs: blankInputs, submitted: true } })}
                            disabled={blankInputs.some(b => !b?.trim())}
                            className="px-6 py-2.5 bg-gray-950 dark:bg-white text-white dark:text-black rounded-full text-xs font-bold tracking-wide hover:scale-[0.98] transition-transform disabled:opacity-35 disabled:cursor-not-allowed btn-press"
                          >
                            Submit Answers
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })() : subQ.type === 'mcq' && subQ.options ? (
                  <div className="space-y-2.5">
                    {subQ.options.map((opt, oIdx) => {
                      const selected = subVal === oIdx;
                      const isCorrectOpt = oIdx === subQ.correctIndex;

                      let optClass = 'group flex w-full items-center gap-3.5 rounded-xl border px-4 py-3 text-start transition-all duration-200 btn-press ';
                      if (!isCompleted) {
                        optClass += 'option-hover ';
                      }
                      let badgeClass = 'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors ';

                      if (!isCompleted) {
                        optClass += 'border-gray-200 dark:border-white/[0.07] bg-gray-50/50 dark:bg-white/[0.025] hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-800 dark:text-white';
                        badgeClass += 'border-gray-300 dark:border-white/15 text-gray-500 dark:text-white/40 bg-gray-100/50 dark:bg-white/[0.03]';
                      } else if (isCorrectOpt) {
                        optClass += 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300';
                        badgeClass += 'border-emerald-500/40 text-emerald-600 dark:text-emerald-300 bg-emerald-500/10';
                      } else if (selected && !isCorrectOpt) {
                        optClass += 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-300 wrong-shake';
                        badgeClass += 'border-rose-500/40 text-rose-600 dark:text-rose-300 bg-rose-500/10';
                      } else {
                        optClass += 'border-gray-100 dark:border-white/[0.04] bg-gray-50/30 dark:bg-white/[0.01] text-gray-400 dark:text-white/30 cursor-not-allowed';
                        badgeClass += 'border-gray-200 dark:border-white/10 text-gray-300 dark:text-white/20';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isCompleted}
                          onClick={() => onChange({ ...subAns, [subQ.id]: oIdx })}
                          className={optClass}
                        >
                          <span className={badgeClass}>
                            {isCompleted && isCorrectOpt ? (
                              <Check size={12} />
                            ) : isCompleted && selected && !isCorrectOpt ? (
                              <X size={12} />
                            ) : (
                              String.fromCharCode(65 + oIdx)
                            )}
                          </span>
                          <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={subEssayDrafts[subQ.id] || ''}
                      disabled={isCompleted}
                      onChange={e => {
                        const val = e.target.value;
                        setSubEssayDrafts(prev => ({ ...prev, [subQ.id]: val }));
                        onChange({
                          ...subAns,
                          [subQ.id]: { text: val, selfGrade: subVal?.selfGrade }
                        });
                      }}
                      onFocus={() => { lastFocusedSubQ.current = subQ.id; }}
                      rows={3}
                      placeholder="Type your essay answer…"
                      className="w-full resize-y rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-black/30 p-4 text-xs leading-relaxed text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none transition-colors focus:border-gray-400 dark:focus:border-white/25 backdrop-blur-xl"
                    />

                    {!isCompleted && !revealedSubEssays[subQ.id] && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setRevealedSubEssays(prev => ({ ...prev, [subQ.id]: true }));
                            requestAnimationFrame(() => {
                              setTimeout(() => {
                                document.querySelector(`[data-sub-essay="${subQ.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                              }, 150);
                            });
                          }}
                          className="px-5 py-2 bg-gray-950 dark:bg-white text-white dark:text-black rounded-full text-[10px] font-bold tracking-wide hover:scale-[0.98] transition-transform hover:bg-gray-900 dark:hover:bg-gray-100 btn-press"
                        >
                          Reveal Answer
                        </button>
                      </div>
                    )}

                    {(revealedSubEssays[subQ.id] || isCompleted) && (
                      <div data-sub-essay={subQ.id} className="space-y-3 rounded-lg border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/[0.02] p-3 text-xs">
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">Reference Answer:</p>
                        <p className="text-gray-800 dark:text-white/85 leading-relaxed whitespace-pre-wrap">{subQ.modelAnswer}</p>
                        
                        {!isCompleted && (
                          <div className="pt-3 border-t border-gray-200 dark:border-emerald-500/10">
                            <p className="text-[10px] font-bold text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">Self Grading:</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  onChange({
                                    ...subAns,
                                    [subQ.id]: { text: subEssayDrafts[subQ.id] || '', selfGrade: 'correct' }
                                  });
                                  setRevealedSubEssays(prev => ({ ...prev, [subQ.id]: false }));
                                }}
                                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white dark:text-black rounded-full text-[10px] font-bold transition-colors btn-press"
                              >
                                Correct
                              </button>
                              <button
                                onClick={() => {
                                  onChange({
                                    ...subAns,
                                    [subQ.id]: { text: subEssayDrafts[subQ.id] || '', selfGrade: 'incorrect' }
                                  });
                                  setRevealedSubEssays(prev => ({ ...prev, [subQ.id]: false }));
                                }}
                                className="px-4 py-1.5 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/5 rounded-full text-[10px] font-bold transition-colors btn-press"
                              >
                                Incorrect
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAnswerArea = () => {
    const value = answers[current];
    switch (question.type) {
      case 'mcq':
        return renderMCQ(question, value, setAnswer);
      case 'truefalse':
        return renderTrueFalse(value, setAnswer);
      case 'essay':
        return renderEssay(value, setAnswer);
      case 'fillblank':
        return renderFillBlank(question, value, setAnswer);
      case 'matching':
        return renderMatching(question, value, setAnswer);
      case 'case':
      case 'casestudy':
        return renderCaseStudy(question, value, setAnswer);
      default:
        return renderMCQ(question, value, setAnswer);
    }
  };

  const typeLabels: Record<string, string> = {
    mcq: 'Multiple Choice',
    truefalse: 'True / False',
    essay: 'Essay',
    fillblank: 'Fill in the Blank',
    matching: 'Matching',
    case: 'Case Study',
    casestudy: 'Case Study'
  };

  /* ---------------------------------- Render --------------------------------- */

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen text-foreground antialiased transition-colors duration-300">
      {/* aria-live quiz announcer */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" data-testid="quiz-announcer">
        {announcement}
      </div>

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`absolute -top-32 start-1/3 h-80 w-80 rounded-full blur-[130px] opacity-20 ${style.bg}`} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Back"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.04] transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.08] btn-press"
            >
              <ArrowLeft size={16} className={`text-gray-700 dark:text-white/70 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{chapter.title}</p>
              <p className={`truncate text-xs ${style.text} opacity-80`}>{subject?.name ?? 'General'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {timerMode !== 'off' && (
              <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs tabular-nums transition-colors ${
                timerUrgency === 'critical'
                  ? "border-red-400/50 bg-red-50/50 dark:bg-red-500/10 text-red-600 dark:text-red-400 animate-pulse"
                  : timerUrgency === 'warning'
                    ? "border-amber-400/50 bg-amber-50/50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.04] text-gray-600 dark:text-white/70"
              }`}>
                <Clock size={13} /> {formatTime(totalElapsed)}
              </span>
            )}
            <button
              onClick={toggleShortcuts}
              aria-label="Keyboard shortcuts"
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.04] text-gray-500 dark:text-white/50 transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.08] sm:flex btn-press"
            >
              <Keyboard size={15} />
            </button>
            <button
              onClick={toggleGrid}
              aria-label="Question grid"
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors btn-press ${
                showGrid ? `${style.border} ${style.bg} text-white` : 'border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.04] text-gray-550 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/[0.08]'
              }`}
            >
              <Grid3X3 size={15} />
            </button>
            {userButton}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] w-full bg-gray-100 dark:bg-white/[0.05]">
          <motion.div
            className={`h-full ${style.bg.replace('/10', '')} bg-gradient-to-r from-gray-400 to-gray-600 dark:from-white/60 dark:to-white/90`}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          />
        </div>
      </header>

      {/* Shortcuts popover */}
      <AnimatePresence>
        {showShortcuts && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              role="dialog"
              aria-modal="true"
              className="fixed end-4 top-16 z-40 w-64 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#161618]/95 p-4 text-xs shadow-2xl backdrop-blur-xl text-gray-800 dark:text-white"
            >
              <p className="mb-2 font-semibold text-gray-900 dark:text-white/80">Keyboard shortcuts</p>
              {[['← →', 'Navigate questions'], ['1–9', 'Select MCQ / True-False option'], ['Enter', 'Reveal essay answer'], ['1 / 2', 'Correct / Wrong (essay)'], ['F', 'Flag question'], ['G', 'Toggle grid']].map(([k, d]) => (
                <div key={k} className="flex items-center justify-between py-1 text-gray-500 dark:text-white/50">
                  <span>{d}</span>
                  <kbd className="rounded border border-gray-200 dark:border-white/15 bg-gray-100 dark:bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-gray-700 dark:text-white/70">{k}</kbd>
                </div>
              ))}
              <TimerSettingsPanel
                mode={timerMode}
                urgency={timerUrgency}
                muted={muted}
                onChangeMode={setTimerMode}
                onToggleMute={toggleMute}
              />
              <div className="mt-3 border-t border-gray-200 dark:border-white/[0.08] pt-3">
                <p className="mb-1.5 font-semibold text-gray-900 dark:text-white/80">Star Legend</p>
                <div className="flex items-center gap-3 py-0.5 text-gray-500 dark:text-white/50">
                  <span className="text-amber-500 dark:text-amber-400 font-bold">★</span>
                  <span>Repeated 2-3 times</span>
                </div>
                <div className="flex items-center gap-3 py-0.5 text-gray-500 dark:text-white/50">
                  <span className="text-amber-500 dark:text-amber-400 font-bold">★★</span>
                  <span>Repeated 4-5 times</span>
                </div>
                <div className="flex items-center gap-3 py-0.5 text-gray-500 dark:text-white/50">
                  <span className="text-amber-500 dark:text-amber-400 font-bold">★★★</span>
                  <span>Repeated 6+ times</span>
                </div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Question palette grid */}
      <AnimatePresence>
        {showGrid && (
          <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              role="dialog"
              aria-modal="false"
              className="overflow-hidden border-b border-gray-200 dark:border-white/[0.06] bg-gray-50/30 dark:bg-white/[0.02]"
            >
              <div className="mx-auto grid max-w-4xl grid-cols-8 gap-2 px-4 py-4 sm:grid-cols-12 sm:px-6">
                {questions.map((q, i) => {
                  const status = getQuestionStatus(q, answers[i]);
                  const isFlagged = flagged.has(i);

                const btnClass = (() => {
                  if (status === 'correct') return "border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold";
                  if (status === 'incorrect') return "border-rose-500/30 dark:border-rose-500/20 bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 font-semibold";
                  if (status === 'pending') return "border-sky-500/30 dark:border-sky-500/20 bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 font-semibold";
                  if (isFlagged) return "border-amber-500/30 dark:border-amber-500/20 bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold";
                  return "border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.03] text-gray-400 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/[0.07]";
                })();

                const isActive = i === current;
                const activeRing = isActive
                  ? "ring-2 ring-zinc-800 dark:ring-zinc-200 ring-offset-2 dark:ring-offset-zinc-950 scale-105 z-10 shadow-md"
                  : "";

                return (
                  <motion.button
                    key={i}
                    onClick={() => goTo(i)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`relative flex h-11 items-center justify-center rounded-lg border text-xs font-medium tabular-nums transition-all cursor-pointer ${btnClass} ${activeRing}`}
                  >
                    {i + 1}
                    {isFlagged && <Flag size={9} className="absolute -end-1 -top-1 fill-amber-500 text-amber-500" />}
                  </motion.button>
                );
              })}
            </div>
            </motion.div>
          </FocusTrap>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={questionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Question meta */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium ${style.borderOp15} ${style.bgOp10} ${style.text}`}>
                  <Target size={12} /> {typeLabels[question.type] ?? 'Question'}
                </span>
                <span className="text-xs text-gray-500 dark:text-white/35 tabular-nums">
                  {current + 1} / {total} · {answeredCount} answered
                </span>
                {question.repetitionCount && question.repetitionCount > 1 && (
                  <span
                    title={`Repeated ${question.repetitionCount} times — high priority question`}
                    className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500 dark:text-amber-400 shrink-0 select-none"
                  >
                    {question.repetitionCount >= 6 ? (
                      <><Star size={11} className="fill-amber-500" /><Star size={11} className="fill-amber-500" /><Star size={11} className="fill-amber-500" /></>
                    ) : question.repetitionCount >= 4 ? (
                      <><Star size={11} className="fill-amber-500" /><Star size={11} className="fill-amber-500" /></>
                    ) : (
                      <Star size={11} className="fill-amber-500" />
                    )}
                  </span>
                )}
              </div>
              <button
                onClick={toggleFlag}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors btn-press ${
                  flagged.has(current)
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                    : 'border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-gray-500 dark:text-white/45 hover:bg-gray-100 dark:hover:bg-white/[0.07]'
                }`}
              >
                <Bookmark size={13} className={flagged.has(current) ? 'fill-amber-400' : ''} />
                {flagged.has(current) ? 'Flagged' : 'Flag'}
              </button>
            </div>

            {/* Question card */}
            <div className="rounded-2xl border border-gray-200 dark:border-white/[0.07] bg-card p-5 shadow-sm dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] sm:p-7">
              {question.type !== 'fillblank' && question.type !== 'case' && question.type !== 'casestudy' && renderFormattedText(
                question.text,
                "mb-6 text-base font-semibold leading-relaxed text-gray-900 dark:text-white sm:text-lg text-left whitespace-pre-line"
              )}
              
              {renderAnswerArea()}

              {/* Explanations & key concept box (Shown once user answered the question) */}
              {answered && (
                <div className="mt-6 space-y-4 border-t border-gray-200 dark:border-white/[0.06] pt-6 text-start">
                  {question.explanation && (
                    <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/[0.03] p-4">
                      <Lightbulb size={16} className="text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Explanation</div>
                        <p className="text-xs text-gray-700 dark:text-white/70 leading-relaxed">{question.explanation}</p>
                      </div>
                    </div>
                  )}
                  {question.keyConcept && question.type !== 'essay' && (
                    <div className="flex items-start gap-3 rounded-xl border border-sky-500/20 bg-sky-50/50 dark:bg-sky-500/[0.03] p-4">
                      <Bookmark size={16} className="text-sky-500 dark:text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block mb-0.5">Key Concept</span>
                        <p className="text-xs text-gray-700 dark:text-white/70 leading-relaxed">{question.keyConcept}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Chat Tutor Panel */}
            <AIChatPanel
              visible={isCompleted}
              messages={chatMessages}
              loading={chatLoading}
              error={chatError}
              onSend={sendMessage}
              onClear={clearChat}
            />
          </motion.div>
        </AnimatePresence>

        {/* Footer navigation */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            onClick={() => handleGoTo(current - 1)}
            disabled={current === 0}
            className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.04] px-5 py-2.5 text-sm text-gray-700 dark:text-white/70 transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft size={15} className={isRTL ? 'rotate-180' : ''} /> Previous
          </button>

          {current < total - 1 ? (
            <button
              onClick={() => handleGoTo(current + 1)}
              className={`flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-semibold transition-all ${style.border} ${style.bg} text-white hover:brightness-110 active:scale-95`}
            >
              Next <ArrowRight size={15} className={isRTL ? 'rotate-180' : ''} />
            </button>
          ) : (
            <button
              onClick={() => setConfirmFinish(true)}
              className="flex items-center gap-2 rounded-full bg-gray-950 dark:bg-white px-6 py-2.5 text-sm font-semibold text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 transition-all active:scale-95"
            >
              <Check size={15} /> Finish
            </button>
          )}
        </div>
      </main>

      {/* Finish confirmation */}
      <AnimatePresence>
        {confirmFinish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setConfirmFinish(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#161618] p-6 shadow-2xl text-gray-900 dark:text-white"
            >
              <h3 className="text-lg font-semibold">Submit attempt?</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-white/50">
                You answered <span className="font-medium text-gray-900 dark:text-white tabular-nums">{answeredCount}</span> of{' '}
                <span className="tabular-nums">{total}</span> questions
                {flagged.size > 0 && (
                  <> · <span className="text-amber-500 dark:text-amber-400 tabular-nums">{flagged.size} flagged</span></>
                )}
                . Time: <span className="tabular-nums">{formatTime(totalElapsed)}</span>.
              </p>
              {answeredCount < total && (
                <p className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 dark:border-amber-500/25 bg-amber-50 dark:bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                  <AlertCircle size={14} className="shrink-0" />
                  {total - answeredCount} unanswered question{total - answeredCount === 1 ? '' : 's'} will be marked incorrect.
                </p>
              )}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setConfirmFinish(false)}
                  className="flex-1 rounded-full border border-gray-200 dark:border-white/[0.1] py-2.5 text-sm text-gray-600 dark:text-white/70 transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                >
                  Keep working
                </button>
                <button
                  onClick={() => { onFinish(answers, totalElapsed, flagged); setConfirmFinish(false); }}
                  className="flex-1 rounded-full bg-gray-950 dark:bg-white py-2.5 text-sm font-semibold text-white dark:text-black transition-transform hover:scale-[1.02]"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default QuizInterface;
