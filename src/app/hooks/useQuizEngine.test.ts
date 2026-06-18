import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useQuizEngine } from './useQuizEngine';
import type { Question } from '../types';

function makeQ(partial: Partial<Question> & { type: Question['type']; estimatedTimeSeconds?: number }): Question {
  return {
    id: 1,
    text: 'Test question',
    subjectColor: 'clinical',
    explanation: '',
    ...partial,
  } as Question;
}

describe('useQuizEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createHook = (overrides?: { questions?: Question[]; initialAnswers?: Record<number, any> }) => {
    const questions = overrides?.questions ?? [
      makeQ({ type: 'mcq', correctIndex: 1, options: ['A', 'B', 'C'] }),
      makeQ({ type: 'truefalse', correctIndex: 0 }),
      makeQ({ type: 'fillblank', blanks: ['heart', 'left atrium'] }),
      makeQ({ type: 'essay' }),
    ];
    const onFinish = vi.fn();
    return renderHook(() =>
      useQuizEngine({
        questions,
        onFinish,
        initialAnswers: overrides?.initialAnswers,
      })
    );
  };

  describe('initial state', () => {
    it('starts at question 0', () => {
      const { result } = createHook();
      expect(result.current.current).toBe(0);
      expect(result.current.currentQuestion.type).toBe('mcq');
    });

    it('has zero elapsed time', () => {
      const { result } = createHook();
      expect(result.current.elapsedSeconds).toBe(0);
    });

    it('has empty answers unless initialAnswers provided', () => {
      const { result } = createHook();
      expect(Object.keys(result.current.answers)).toHaveLength(0);
    });

    it('accepts initialAnswers', () => {
      const { result } = createHook({ initialAnswers: { 0: 1, 1: true } });
      expect(result.current.answers[0]).toBe(1);
      expect(result.current.answers[1]).toBe(true);
    });

    it('computes progress as 1 / total', () => {
      const { result } = createHook();
      expect(result.current.progress).toBe(0.25);
    });

    it('answerState is unanswered when no answer exists', () => {
      const { result } = createHook();
      expect(result.current.answerState).toBe('unanswered');
    });
  });

  describe('navigation', () => {
    it('goTo moves to a valid index', () => {
      const { result } = createHook();
      act(() => result.current.goTo(2));
      expect(result.current.current).toBe(2);
      expect(result.current.currentQuestion.type).toBe('fillblank');
    });

    it('goTo clamps to bounds', () => {
      const { result } = createHook();
      act(() => result.current.goTo(-1));
      expect(result.current.current).toBe(0);
      act(() => result.current.goTo(100));
      expect(result.current.current).toBe(0);
    });

    it('goNext advances', () => {
      const { result } = createHook();
      act(() => result.current.goNext());
      expect(result.current.current).toBe(1);
    });

    it('goNext stops at last question', () => {
      const { result } = createHook({ questions: [makeQ({ type: 'mcq' })] });
      act(() => result.current.goNext());
      expect(result.current.current).toBe(0);
    });

    it('goPrev goes back', () => {
      const { result } = createHook();
      act(() => result.current.goTo(2));
      act(() => result.current.goPrev());
      expect(result.current.current).toBe(1);
    });

    it('goPrev stops at 0', () => {
      const { result } = createHook();
      act(() => result.current.goPrev());
      expect(result.current.current).toBe(0);
    });

    it('goTo hides the grid', () => {
      const { result } = createHook();
      act(() => result.current.toggleGrid());
      expect(result.current.showGrid).toBe(true);
      act(() => result.current.goTo(2));
      expect(result.current.showGrid).toBe(false);
    });
  });

  describe('answers', () => {
    it('setAnswer stores answer for current question', () => {
      const { result } = createHook();
      act(() => result.current.setAnswer(1));
      expect(result.current.answers[0]).toBe(1);
    });

    it('answerState becomes correct for right MCQ answer', () => {
      const { result } = createHook();
      act(() => result.current.setAnswer(1));
      expect(result.current.answerState).toBe('correct');
    });

    it('answerState becomes incorrect for wrong MCQ answer', () => {
      const { result } = createHook();
      act(() => result.current.setAnswer(0));
      expect(result.current.answerState).toBe('incorrect');
    });

    it('answerState is submitted for essay with text but no grade', () => {
      const { result } = createHook();
      act(() => result.current.goTo(3));
      act(() => result.current.setAnswer({ text: 'Some essay' }));
      expect(result.current.answerState).toBe('submitted');
    });

    it('answerState is correct for self-graded correct essay', () => {
      const { result } = createHook();
      act(() => result.current.goTo(3));
      act(() => result.current.setAnswer({ text: 'Some essay', selfGrade: 'correct' }));
      expect(result.current.answerState).toBe('correct');
    });

    it('answerState is answered for unsubmitted fillblank inputs', () => {
      const { result } = createHook();
      act(() => result.current.goTo(2));
      act(() => result.current.setAnswer({ inputs: ['heart'], submitted: false }));
      expect(result.current.answerState).toBe('answered');
    });

    it('answerState is incorrect for submitted fillblank with wrong answer', () => {
      const { result } = createHook();
      act(() => result.current.goTo(2));
      act(() => result.current.setAnswer({ inputs: ['brain'], submitted: true }));
      expect(result.current.answerState).toBe('incorrect');
    });
  });

  describe('flagging', () => {
    it('toggleFlag adds current index', () => {
      const { result } = createHook();
      act(() => result.current.toggleFlag());
      expect(result.current.flagged.has(0)).toBe(true);
    });

    it('toggleFlag removes when already flagged', () => {
      const { result } = createHook();
      act(() => result.current.toggleFlag());
      act(() => result.current.toggleFlag());
      expect(result.current.flagged.has(0)).toBe(false);
    });
  });

  describe('timer', () => {
    it('increments elapsedSeconds every second', async () => {
      const { result } = createHook();
      act(() => vi.advanceTimersByTime(3000));
      await waitFor(() => expect(result.current.elapsedSeconds).toBe(3));
    });

    it('pauses when showGrid is true', async () => {
      const { result } = createHook();
      act(() => vi.advanceTimersByTime(2000));
      await waitFor(() => expect(result.current.elapsedSeconds).toBe(2));
      act(() => result.current.toggleGrid());
      act(() => vi.advanceTimersByTime(2000));
      await waitFor(() => expect(result.current.elapsedSeconds).toBe(2));
      act(() => result.current.toggleGrid());
      act(() => vi.advanceTimersByTime(1000));
      await waitFor(() => expect(result.current.elapsedSeconds).toBe(3));
    });

    it('pauses when showShortcuts is true', async () => {
      const { result } = createHook();
      act(() => vi.advanceTimersByTime(2000));
      await waitFor(() => expect(result.current.elapsedSeconds).toBe(2));
      act(() => result.current.toggleShortcuts());
      act(() => vi.advanceTimersByTime(2000));
      await waitFor(() => expect(result.current.elapsedSeconds).toBe(2));
    });
  });

  describe('timer urgency', () => {
    it('stays normal under 60% of estimated time', () => {
      const { result } = createHook({
        questions: [
          makeQ({ type: 'mcq', correctIndex: 0 }),
          makeQ({ type: 'mcq', correctIndex: 0 }),
        ],
      });
      // 2 MCQs = 120s estimated. 60% = 72s
      act(() => vi.advanceTimersByTime(70000));
      expect(result.current.timerUrgency).toBe('normal');
    });

    it('switches to warning above 60%', () => {
      const { result } = createHook({
        questions: [
          makeQ({ type: 'mcq', correctIndex: 0 }),
          makeQ({ type: 'mcq', correctIndex: 0 }),
        ],
      });
      act(() => vi.advanceTimersByTime(75000));
      expect(result.current.timerUrgency).toBe('warning');
    });

    it('switches to critical above 85%', () => {
      const { result } = createHook({
        questions: [
          makeQ({ type: 'mcq', correctIndex: 0 }),
          makeQ({ type: 'mcq', correctIndex: 0 }),
        ],
      });
      act(() => vi.advanceTimersByTime(103000));
      expect(result.current.timerUrgency).toBe('critical');
    });

    it('uses explicit estimatedTimeSeconds when present', () => {
      const { result } = createHook({
        questions: [
          makeQ({ type: 'mcq', correctIndex: 0, estimatedTimeSeconds: 10 }),
        ],
      });
      act(() => vi.advanceTimersByTime(7000));
      expect(result.current.timerUrgency).toBe('warning');
    });
  });

  describe('submitAnswer', () => {
    it('submits fillblank when not yet submitted', () => {
      const { result } = createHook();
      act(() => result.current.goTo(2));
      act(() => result.current.setAnswer({ inputs: ['heart', 'left atrium'], submitted: false }));
      act(() => result.current.submitAnswer());
      expect(result.current.answers[2].submitted).toBe(true);
    });

    it('advances for already-submitted fillblank', () => {
      const { result } = createHook();
      act(() => result.current.goTo(2));
      act(() => result.current.setAnswer({ inputs: ['brain'], submitted: true }));
      act(() => result.current.submitAnswer());
      expect(result.current.current).toBe(3);
    });

    it('advances for MCQ (auto-submitted)', () => {
      const { result } = createHook();
      act(() => result.current.setAnswer(1));
      act(() => result.current.submitAnswer());
      expect(result.current.current).toBe(1);
    });
  });

  describe('revealAnswer', () => {
    it('marks unanswered MCQ as revealed', () => {
      const { result } = createHook();
      act(() => result.current.revealAnswer());
      expect(result.current.revealed.has(0)).toBe(true);
    });

    it('does nothing for already-answered MCQ', () => {
      const { result } = createHook();
      act(() => result.current.setAnswer(1));
      act(() => result.current.revealAnswer());
      expect(result.current.revealed.has(0)).toBe(false);
    });

    it('does nothing for essay', () => {
      const { result } = createHook();
      act(() => result.current.goTo(3));
      act(() => result.current.revealAnswer());
      expect(result.current.revealed.has(3)).toBe(false);
    });
  });

  describe('finish flow', () => {
    it('finish opens confirmation modal', () => {
      const { result } = createHook();
      act(() => result.current.finish());
      expect(result.current.confirmFinish).toBe(true);
      expect(result.current.finished).toBe(false);
    });

    it('confirmFinishAction finishes and calls onFinish', () => {
      const { result } = createHook();
      act(() => result.current.setAnswer(1));
      act(() => result.current.toggleFlag());
      act(() => result.current.finish());
      act(() => result.current.confirmFinishAction());
      expect(result.current.finished).toBe(true);
      expect(result.current.confirmFinish).toBe(false);
    });

    it('onFinish receives session data', () => {
      const onFinish = vi.fn();
      const questions = [makeQ({ type: 'mcq', correctIndex: 1 })];
      const { result } = renderHook(() =>
        useQuizEngine({ questions, onFinish, initialAnswers: { 0: 1 } })
      );
      act(() => result.current.toggleFlag());
      act(() => vi.advanceTimersByTime(5000));
      act(() => result.current.finish());
      act(() => result.current.confirmFinishAction());
      expect(onFinish).toHaveBeenCalledTimes(1);
      const session = onFinish.mock.calls[0][0];
      expect(session.questions).toEqual(questions);
      expect(session.answers[0]).toBe(1);
      expect(session.elapsedSeconds).toBe(5);
      expect(session.flaggedQuestions.has(0)).toBe(true);
    });
  });

  describe('modals', () => {
    it('toggleGrid toggles showGrid', () => {
      const { result } = createHook();
      expect(result.current.showGrid).toBe(false);
      act(() => result.current.toggleGrid());
      expect(result.current.showGrid).toBe(true);
    });

    it('toggleShortcuts toggles showShortcuts', () => {
      const { result } = createHook();
      expect(result.current.showShortcuts).toBe(false);
      act(() => result.current.toggleShortcuts());
      expect(result.current.showShortcuts).toBe(true);
    });
  });

  describe('derived counts', () => {
    it('answeredCount counts only fully answered', () => {
      const { result } = createHook();
      act(() => result.current.setAnswer(1)); // mcq answered
      expect(result.current.answeredCount).toBe(1);
    });

    it('score counts correct answers', () => {
      const { result } = createHook();
      act(() => result.current.setAnswer(1)); // correct
      expect(result.current.score).toBe(1);
      act(() => result.current.goNext());
      act(() => result.current.setAnswer(false)); // wrong for truefalse (correctIndex 0)
      expect(result.current.score).toBe(1);
    });

    it('score excludes unsubmitted answers', () => {
      const { result } = createHook();
      act(() => result.current.goTo(2));
      act(() => result.current.setAnswer({ inputs: ['heart'], submitted: false }));
      expect(result.current.score).toBe(0);
    });
  });

  describe('blankInputs / blankSubmitted', () => {
    it('blankInputs defaults to empty array for non-fillblank', () => {
      const { result } = createHook();
      expect(result.current.blankInputs).toEqual([]);
    });

    it('blankInputs initializes from answers for fillblank', () => {
      const { result } = createHook({
        initialAnswers: { 2: { inputs: ['brain'], submitted: true } },
      });
      act(() => result.current.goTo(2));
      expect(result.current.blankInputs).toEqual(['brain']);
      expect(result.current.blankSubmitted).toBe(true);
    });

    it('blankInputs defaults to blanks length when no answer', () => {
      const { result } = createHook();
      act(() => result.current.goTo(2));
      expect(result.current.blankInputs).toEqual(['', '']);
      expect(result.current.blankSubmitted).toBe(false);
    });
  });

  describe('matching auto-init', () => {
    it('auto-scrambles matching on first visit', () => {
      const questions = [
        makeQ({
          type: 'matching',
          pairs: [
            { premise: 'A', target: '1' },
            { premise: 'B', target: '2' },
          ],
        }),
      ];
      const { result } = createHook({ questions });
      expect(result.current.answers[0]).toBeDefined();
      expect(result.current.answers[0].scrambled).toHaveLength(2);
      expect(result.current.answers[0].matches).toEqual({});
      expect(result.current.answers[0].submitted).toBe(false);
    });

    it('does not re-scramble when revisiting', () => {
      const questions = [
        makeQ({
          type: 'matching',
          pairs: [
            { premise: 'A', target: '1' },
            { premise: 'B', target: '2' },
          ],
        }),
        makeQ({ type: 'mcq', correctIndex: 0 }),
      ];
      const { result } = createHook({ questions });
      const firstScrambled = result.current.answers[0].scrambled;
      act(() => result.current.goNext());
      act(() => result.current.goPrev());
      expect(result.current.answers[0].scrambled).toEqual(firstScrambled);
    });
  });

  describe('edge cases', () => {
    it('handles empty questions array gracefully', () => {
      const { result } = createHook({ questions: [] });
      expect(result.current.current).toBe(0);
      expect(result.current.progress).toBe(0);
      expect(result.current.answeredCount).toBe(0);
      expect(result.current.score).toBe(0);
    });

    it('goTo does nothing with empty questions', () => {
      const { result } = createHook({ questions: [] });
      act(() => result.current.goTo(0));
      expect(result.current.current).toBe(0);
    });
  });
});
