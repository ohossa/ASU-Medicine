import { describe, it, expect } from 'vitest';
import { assignDefaultDifficulty, assignDefaultBloomLevel } from './assignDefaultDifficulty';
import type { Question } from '../types';

describe('assignDefaultDifficulty', () => {
  it('assigns 1 to true/false', () => {
    const q: Question = { id: '1', text: 'Is it?', type: 'truefalse', explanation: 'Yes.' };
    expect(assignDefaultDifficulty(q)).toBe(1);
  });

  it('assigns 5 to case study', () => {
    const q: Question = { id: '1', text: 'Q', type: 'case_study', explanation: 'A'.repeat(600) };
    expect(assignDefaultDifficulty(q)).toBe(5);
  });

  it('preserves existing difficulty', () => {
    const q: Question = { id: '1', text: 'Q', type: 'mcq', difficulty: 4, explanation: '...' };
    expect(assignDefaultDifficulty(q)).toBe(4);
  });

  it('boosts for complex terminology', () => {
    const q1: Question = { id: '1', text: 'What?', type: 'mcq', explanation: '...' };
    const q2: Question = { id: '2', text: 'Regarding electroencephalographic findings...', type: 'mcq', explanation: '...' };
    expect(assignDefaultDifficulty(q1)).toBeLessThan(assignDefaultDifficulty(q2));
  });
});

describe('assignDefaultBloomLevel', () => {
  it('classifies what-is as remember', () => {
    const q: Question = { id: '1', text: 'What is CN VI?', type: 'mcq', explanation: '...' };
    expect(assignDefaultBloomLevel(q)).toBe('remember');
  });

  it('classifies BEST as evaluate', () => {
    const q: Question = { id: '1', text: 'Which is BEST?', type: 'mcq', explanation: '...' };
    expect(assignDefaultBloomLevel(q)).toBe('evaluate');
  });
});