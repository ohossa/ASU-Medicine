import { describe, it, expect } from 'vitest';
import { checkAnswerCorrect } from './quiz';
import type { Question } from '../types';

function makeQ(partial: Partial<Question> & { type: Question['type'] }): Question {
  return {
    id: 1,
    text: 'Test question',
    type: partial.type,
    subjectColor: 'clinical',
    explanation: '',
    ...partial,
  } as Question;
}

describe('checkAnswerCorrect — MCQ', () => {
  const q = makeQ({ type: 'mcq', correctIndex: 2, options: ['A', 'B', 'C', 'D'] });

  it('returns true for correct index', () => {
    expect(checkAnswerCorrect(q, 2)).toBe(true);
  });

  it('returns false for wrong index', () => {
    expect(checkAnswerCorrect(q, 1)).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(checkAnswerCorrect(q, null)).toBe(false);
    expect(checkAnswerCorrect(q, undefined)).toBe(false);
  });
});

describe('checkAnswerCorrect — True/False', () => {
  const q = makeQ({ type: 'truefalse', correctIndex: 1 });

  it('returns true for correct bool index', () => {
    expect(checkAnswerCorrect(q, 1)).toBe(true);
  });

  it('returns false for wrong bool index', () => {
    expect(checkAnswerCorrect(q, 0)).toBe(false);
  });
});

describe('checkAnswerCorrect — Matching', () => {
  const q = makeQ({
    type: 'matching',
    pairs: [
      { premise: 'A', target: '1' },
      { premise: 'B', target: '2' },
      { premise: 'C', target: '3' },
    ],
  });

  const scrambled = ['2', '3', '1'];

  it('returns true when all matches are correct', () => {
    const ans = {
      scrambled,
      matches: { 0: 2, 1: 0, 2: 1 }, // A→1, B→2, C→3
      submitted: true,
    };
    expect(checkAnswerCorrect(q, ans)).toBe(true);
  });

  it('returns false when any match is wrong', () => {
    const ans = {
      scrambled,
      matches: { 0: 0, 1: 0, 2: 1 }, // A→2 (wrong)
      submitted: true,
    };
    expect(checkAnswerCorrect(q, ans)).toBe(false);
  });

  it('returns false when matches object is empty', () => {
    expect(checkAnswerCorrect(q, { scrambled, matches: {}, submitted: true })).toBe(false);
  });

  it('returns false when scrambled is missing', () => {
    expect(checkAnswerCorrect(q, { matches: { 0: 0 }, submitted: true })).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(checkAnswerCorrect(q, null)).toBe(false);
    expect(checkAnswerCorrect(q, undefined)).toBe(false);
  });

  it('handles duplicate targets by matching first occurrence', () => {
    const dupQ = makeQ({
      type: 'matching',
      pairs: [
        { premise: 'A', target: 'X' },
        { premise: 'B', target: 'X' },
      ],
    });
    const ans = {
      scrambled: ['X', 'X'],
      matches: { 0: 0, 1: 0 },
      submitted: true,
    };
    expect(checkAnswerCorrect(dupQ, ans)).toBe(true);
  });
});

describe('checkAnswerCorrect — Fill in the Blank', () => {
  const q = makeQ({
    type: 'fillblank',
    blanks: ['heart', 'left atrium'],
    acceptedAnswers: [['cardiac'], []],
  });

  it('returns true when all blanks match exactly', () => {
    const ans = { inputs: ['heart', 'left atrium'], submitted: true };
    expect(checkAnswerCorrect(q, ans)).toBe(true);
  });

  it('returns true with alternative answers', () => {
    const ans = { inputs: ['cardiac', 'left atrium'], submitted: true };
    expect(checkAnswerCorrect(q, ans)).toBe(true);
  });

  it('is case-insensitive', () => {
    const ans = { inputs: ['HEART', 'LEFT ATRIUM'], submitted: true };
    expect(checkAnswerCorrect(q, ans)).toBe(true);
  });

  it('returns false when any blank is wrong', () => {
    const ans = { inputs: ['brain', 'left atrium'], submitted: true };
    expect(checkAnswerCorrect(q, ans)).toBe(false);
  });

  it('returns false when any blank is empty', () => {
    const ans = { inputs: ['', 'left atrium'], submitted: true };
    expect(checkAnswerCorrect(q, ans)).toBe(false);
  });

  it('returns false when inputs array is shorter than blanks', () => {
    const ans = { inputs: ['heart'], submitted: true };
    expect(checkAnswerCorrect(q, ans)).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(checkAnswerCorrect(q, null)).toBe(false);
  });
});

describe('checkAnswerCorrect — Essay', () => {
  const q = makeQ({ type: 'essay' });

  it('returns true when self-graded correct', () => {
    expect(checkAnswerCorrect(q, { text: 'answer', selfGrade: 'correct' })).toBe(true);
  });

  it('returns false when self-graded incorrect', () => {
    expect(checkAnswerCorrect(q, { text: 'answer', selfGrade: 'incorrect' })).toBe(false);
  });

  it('returns false when no selfGrade', () => {
    expect(checkAnswerCorrect(q, { text: 'answer' })).toBe(false);
  });
});

describe('checkAnswerCorrect — Case Study', () => {
  const q = makeQ({
    type: 'casestudy',
    subQuestions: [
      { id: 's1', type: 'mcq', text: 'Q1', correctIndex: 1, options: ['A', 'B'] },
      { id: 's2', type: 'essay', text: 'Q2' },
      { id: 's3', type: 'fillblank', text: 'Q3', blanks: ['answer'], acceptedAnswers: [] },
    ],
  });

  it('returns true when all sub-questions are correct', () => {
    const ans = {
      s1: 1,
      s2: { text: 'essay', selfGrade: 'correct' },
      s3: { inputs: ['answer'], submitted: true },
    };
    expect(checkAnswerCorrect(q, ans)).toBe(true);
  });

  it('returns false when one sub-question is wrong', () => {
    const ans = {
      s1: 0,
      s2: { text: 'essay', selfGrade: 'correct' },
      s3: { inputs: ['answer'], submitted: true },
    };
    expect(checkAnswerCorrect(q, ans)).toBe(false);
  });

  it('returns false when essay sub-question is ungraded', () => {
    const ans = {
      s1: 1,
      s2: { text: 'essay' },
      s3: { inputs: ['answer'], submitted: true },
    };
    expect(checkAnswerCorrect(q, ans)).toBe(false);
  });

  it('returns false when sub-answers are missing', () => {
    const ans = { s1: 1 };
    expect(checkAnswerCorrect(q, ans)).toBe(false);
  });

  it('returns false when subQuestions array is empty', () => {
    const emptyQ = makeQ({ type: 'casestudy', subQuestions: [] });
    expect(checkAnswerCorrect(emptyQ, {})).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(checkAnswerCorrect(q, null)).toBe(false);
  });
});

describe('checkAnswerCorrect — Unknown type', () => {
  it('returns false for unrecognised question types', () => {
    const q = makeQ({ type: 'mcq', correctIndex: 0 });
    // @ts-expect-error force unknown type
    q.type = 'unknown';
    expect(checkAnswerCorrect(q, 0)).toBe(false);
  });
});
