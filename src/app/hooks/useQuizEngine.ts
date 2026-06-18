import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { checkAnswerCorrect } from '../utils/quiz';
import type { Question } from '../types';

export interface QuizSession {
  questions: Question[];
  answers: Record<number, any>;
  elapsedSeconds: number;
  flaggedQuestions: Set<number>;
}

function isAnswered(q: Question, a: any): boolean {
  if (a === undefined || a === null) return false;
  switch (q.type) {
    case 'essay':
      return typeof a === 'object'
        ? (a.text?.trim().length > 0 || a.selfGrade !== undefined)
        : typeof a === 'string' && a.trim().length > 0;
    case 'fillblank':
      return typeof a === 'object' && a.submitted === true;
    case 'matching':
      return typeof a === 'object' && a.submitted === true;
    case 'case':
      return typeof a === 'object' && Object.keys(a).length > 0;
    default:
      return true;
  }
}

function getAnswerState(
  q: Question,
  ans: any
): 'unanswered' | 'answered' | 'submitted' | 'correct' | 'incorrect' {
  if (ans === undefined || ans === null) return 'unanswered';

  if (q.type === 'fillblank') {
    if (typeof ans !== 'object') return 'unanswered';
    const hasInputs = Array.isArray(ans.inputs) && ans.inputs.some((s: string) => s?.trim().length > 0);
    if (!hasInputs) return 'unanswered';
    if (!ans.submitted) return 'answered';
    return checkAnswerCorrect(q, ans) ? 'correct' : 'incorrect';
  }

  if (q.type === 'matching') {
    if (typeof ans !== 'object') return 'unanswered';
    if (!ans.submitted) return 'answered';
    return checkAnswerCorrect(q, ans) ? 'correct' : 'incorrect';
  }

  if (!isAnswered(q, ans)) return 'unanswered';
  if (checkAnswerCorrect(q, ans)) return 'correct';

  if (q.type === 'essay') {
    if (ans?.selfGrade === 'incorrect') return 'incorrect';
    return 'submitted';
  }

  if (q.type === 'case') {
    const subs = q.subQuestions ?? [];
    if (!subs.length) return 'submitted';
    const hasAny = subs.some((sq) => ans?.[sq.id] !== undefined);
    if (!hasAny) return 'submitted';
    const allDone = subs.every((sq) => {
      if (ans?.[sq.id] === undefined) return false;
      if (sq.type === 'essay') return ans[sq.id].selfGrade !== undefined;
      if (sq.type === 'fillblank') return ans[sq.id]?.submitted === true;
      return true;
    });
    if (!allDone) return 'submitted';
    return 'correct';
  }

  return 'incorrect';
}

function getDefaultEstimatedSeconds(q: Question): number {
  switch (q.type) {
    case 'mcq':
    case 'truefalse':
      return 60;
    case 'matching':
    case 'fillblank':
      return 120;
    case 'essay':
      return 300;
    case 'case':
      return 600;
    default:
      return 60;
  }
}

export function useQuizEngine(params: {
  questions: Question[];
  onFinish: (session: QuizSession) => void;
  initialAnswers?: Record<number, any>;
}) {
  const { questions, onFinish, initialAnswers } = params;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>(() => initialAnswers ?? {});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const answersRef = useRef(answers);
  answersRef.current = answers;

  const currentQuestion = questions[current] ?? questions[0];
  const total = questions.length;

  /* Timer */
  useEffect(() => {
    if (showGrid || showShortcuts) return;
    const id = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [showGrid, showShortcuts]);

  /* Matching init on navigate */
  useEffect(() => {
    const q = questions[current];
    if (!q) return;
    if (q.type === 'matching' && answersRef.current[current] === undefined && q.pairs) {
      const scrambled = [...q.pairs].map((p) => p.target).sort(() => Math.random() - 0.5);
      setAnswers((prev) => ({
        ...prev,
        [current]: { scrambled, matches: {}, submitted: false },
      }));
    }
  }, [current, questions]);

  const totalEstimatedSeconds = useMemo(() => {
    return questions.reduce((sum, q) => {
      const explicit = ((q as unknown) as Record<string, unknown>).estimatedTimeSeconds;
      if (typeof explicit === 'number') return sum + explicit;
      return sum + getDefaultEstimatedSeconds(q);
    }, 0);
  }, [questions]);

  const timerUrgency = useMemo<'normal' | 'warning' | 'critical'>(() => {
    if (totalEstimatedSeconds <= 0) return 'normal';
    const ratio = elapsedSeconds / totalEstimatedSeconds;
    if (ratio > 0.85) return 'critical';
    if (ratio > 0.60) return 'warning';
    return 'normal';
  }, [elapsedSeconds, totalEstimatedSeconds]);

  const progress = total > 0 ? (current + 1) / total : 0;

  const answeredCount = useMemo(() => {
    return questions.reduce((n, q, i) => n + (isAnswered(q, answers[i]) ? 1 : 0), 0);
  }, [questions, answers]);

  const score = useMemo(() => {
    return questions.reduce((n, q, i) => n + (checkAnswerCorrect(q, answers[i]) ? 1 : 0), 0);
  }, [questions, answers]);

  const answerState = useMemo(() => {
    return getAnswerState(currentQuestion, answers[current]);
  }, [currentQuestion, answers, current]);

  const blankInputs = useMemo(() => {
    const q = currentQuestion;
    const ans = answers[current];
    if (q?.type === 'fillblank') {
      return (ans?.inputs as string[] | undefined) ?? Array((q.blanks ?? []).length).fill('');
    }
    return [];
  }, [currentQuestion, answers, current]);

  const blankSubmitted = useMemo(() => {
    const ans = answers[current];
    return (ans?.submitted as boolean | undefined) === true;
  }, [answers, current]);

  /* Navigation */
  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= total) return;
      setCurrent(index);
      setShowGrid(false);
    },
    [total]
  );

  const goNext = useCallback(() => {
    setCurrent((prev) => Math.min(prev + 1, total - 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => Math.max(prev - 1, 0));
  }, []);

  const toggleFlag = useCallback(() => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(current)) {
        next.delete(current);
      } else {
        next.add(current);
      }
      return next;
    });
  }, [current]);

  const setAnswer = useCallback(
    (value: any) => {
      setAnswers((prev) => ({ ...prev, [current]: value }));
    },
    [current]
  );

  const submitAnswer = useCallback(() => {
    const q = questions[current];
    const ans = answers[current];
    if (q?.type === 'fillblank' && ans && !ans.submitted) {
      setAnswers((prev) => ({ ...prev, [current]: { ...ans, submitted: true } }));
      return;
    }
    if (q?.type === 'matching' && ans && !ans.submitted) {
      setAnswers((prev) => ({ ...prev, [current]: { ...ans, submitted: true } }));
      return;
    }
    goNext();
  }, [current, questions, answers, goNext]);

  const revealAnswer = useCallback(() => {
    const q = questions[current];
    const ans = answers[current];
    if ((q?.type === 'mcq' || q?.type === 'truefalse') && !isAnswered(q, ans)) {
      setRevealed((prev) => {
        const next = new Set(prev);
        next.add(current);
        return next;
      });
    }
  }, [current, questions, answers]);

  const finish = useCallback(() => {
    setConfirmFinish(true);
  }, []);

  const confirmFinishAction = useCallback(() => {
    setFinished(true);
    setConfirmFinish(false);
    onFinish({
      questions,
      answers,
      elapsedSeconds,
      flaggedQuestions: flagged,
    });
  }, [questions, answers, elapsedSeconds, flagged, onFinish]);

  const toggleGrid = useCallback(() => {
    setShowGrid((prev) => !prev);
  }, []);

  const toggleShortcuts = useCallback(() => {
    setShowShortcuts((prev) => !prev);
  }, []);

  return {
    current,
    answers,
    flagged,
    elapsedSeconds,
    timerUrgency,
    finished,
    confirmFinish,
    showGrid,
    showShortcuts,
    progress,
    answeredCount,
    score,
    currentQuestion,
    blankInputs,
    blankSubmitted,
    answerState,
    revealed,
    goTo,
    goNext,
    goPrev,
    toggleFlag,
    setAnswer,
    submitAnswer,
    revealAnswer,
    finish,
    confirmFinishAction,
    toggleGrid,
    toggleShortcuts,
  };
}
