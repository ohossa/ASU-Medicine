import { describe, it, expect } from 'vitest';
import type { Question } from './types';

describe('Question type extensions', () => {
  it('accepts fully populated question with all new fields', () => {
    const q: Question = {
      id: '1', text: 'Test', type: 'mcq',
      difficulty: 3, bloomLevel: 'apply', tags: ['tag-a'],
      estimatedTimeSeconds: 60,
      media: { imageUrl: '/img.webp' },
    };
    expect(q.difficulty).toBe(3);
  });

  it('accepts minimal question with no new fields', () => {
    const q: Question = { id: '1', text: 'Test', type: 'mcq' };
    expect(q.difficulty).toBeUndefined();
  });
});