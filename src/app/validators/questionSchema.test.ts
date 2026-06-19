import { describe, it, expect } from 'vitest';
import { QuestionSchema } from './questionSchema';

describe('QuestionSchema', () => {
  it('accepts valid question with all new fields', () => {
    const q = {
      id: 'q1', text: 'A sufficiently long question text',
      type: 'mcq', explanation: 'A properly detailed explanation that is at least 30 characters',
      difficulty: 3, bloomLevel: 'apply', tags: ['tag'],
      estimatedTimeSeconds: 60,
      media: { imageUrl: 'https://example.com/x.webp' },
    };
    expect(() => QuestionSchema.parse(q)).not.toThrow();
  });

  it('rejects placeholder explanation', () => {
    const q = {
      id: 'q1', text: 'test', type: 'mcq',
      explanation: 'Review the related lecture material',
    };
    expect(() => QuestionSchema.parse(q)).toThrow();
  });

  it('rejects invalid difficulty', () => {
    const q = { id: 'q1', text: 'test', type: 'mcq', explanation: 'real', difficulty: 6 };
    expect(() => QuestionSchema.parse(q)).toThrow();
  });
});