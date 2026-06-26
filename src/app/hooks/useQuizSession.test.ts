import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQuizSession } from './useQuizSession';

// Mock Clerk useUser hook
const mockUser = { id: 'test-user-999' };
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ user: mockUser })
}));

// Mock useCloudSync trigger
vi.mock('./useCloudSync', () => ({
  triggerCloudSync: vi.fn()
}));

describe('useQuizSession hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('correctly saves, loads, and clears a standard session', () => {
    const { result } = renderHook(() => useQuizSession());

    const sessionPayload = {
      chapterId: 1,
      subjectName: 'anatomy',
      current: 2,
      answers: { 0: 1, 1: 2 },
      elapsedSeconds: 45,
      flagged: [0],
      finished: false,
      timerMode: 'practice' as const,
      showEssayAnswer: false,
    };

    result.current.save(sessionPayload);

    // Verify it is saved in local storage under the correct Clerk user-prefixed key
    const expectedKey = 'asu_quiz_session:test-user-999:1:anatomy';
    const raw = localStorage.getItem(expectedKey);
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    expect(parsed.chapterId).toBe(1);
    expect(parsed.answers).toEqual({ '0': 1, '1': 2 });
    expect(parsed.current).toBe(2);

    // Verify load works
    const loaded = result.current.load(1, 'anatomy');
    expect(loaded).not.toBeNull();
    expect(loaded?.current).toBe(2);

    // Verify clear works
    result.current.clear(1, 'anatomy');
    expect(localStorage.getItem(expectedKey)).toBeNull();
    expect(result.current.load(1, 'anatomy')).toBeNull();
  });

  it('automatically strips typed text from standard essay answers to conserve cloud storage space', () => {
    const { result } = renderHook(() => useQuizSession());

    const sessionPayload = {
      chapterId: 2,
      subjectName: 'physiology',
      current: 0,
      answers: {
        0: { text: 'This is a very long essay draft response that takes up a lot of space...', selfGrade: 'correct' as const },
        1: 2 // MCQ answer, should not be touched
      },
      elapsedSeconds: 10,
      flagged: [],
      finished: false,
      timerMode: 'practice' as const,
      showEssayAnswer: false,
    };

    result.current.save(sessionPayload);

    const expectedKey = 'asu_quiz_session:test-user-999:2:physiology';
    const parsed = JSON.parse(localStorage.getItem(expectedKey)!);

    // Standard essay answer should have its text stripped
    expect(parsed.answers['0'].text).toBe('');
    expect(parsed.answers['0'].selfGrade).toBe('correct');

    // MCQ answer should remain untouched
    expect(parsed.answers['1']).toBe(2);
  });

  it('automatically strips typed text from nested case study essay sub-answers', () => {
    const { result } = renderHook(() => useQuizSession());

    const sessionPayload = {
      chapterId: 3,
      subjectName: 'pathology',
      current: 0,
      answers: {
        0: {
          'subq-1': 1, // MCQ sub-answer
          'subq-2': { text: 'Some long essay answer in a case study...', selfGrade: 'incorrect' } // Case essay answer
        }
      },
      elapsedSeconds: 15,
      flagged: [],
      finished: false,
      timerMode: 'practice' as const,
      showEssayAnswer: false,
    };

    result.current.save(sessionPayload);

    const expectedKey = 'asu_quiz_session:test-user-999:3:pathology';
    const parsed = JSON.parse(localStorage.getItem(expectedKey)!);

    // Case study sub-question should have its text stripped
    expect(parsed.answers['0']['subq-2'].text).toBe('');
    expect(parsed.answers['0']['subq-2'].selfGrade).toBe('incorrect');
    expect(parsed.answers['0']['subq-1']).toBe(1);
  });

  it('correctly loads any active session for a chapter using loadAnyForChapter', () => {
    const { result } = renderHook(() => useQuizSession());

    // Save one active session for all subjects
    result.current.save({
      chapterId: 4,
      subjectName: 'all',
      current: 1,
      answers: {},
      elapsedSeconds: 5,
      flagged: [],
      finished: false,
      timerMode: 'practice' as const,
      showEssayAnswer: false,
    });

    const activeSession = result.current.loadAnyForChapter(4);
    expect(activeSession).not.toBeNull();
    expect(activeSession?.subjectName).toBe('all');
    expect(activeSession?.current).toBe(1);

    // Verify it doesn't match for a different chapter
    expect(result.current.loadAnyForChapter(5)).toBeNull();
  });
});
