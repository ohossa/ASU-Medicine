import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getHistoryDate, HistoryScreen } from './HistoryScreen';
import type { QuizResult } from '../utils/storage';

vi.mock('../hooks/useLanguage', () => ({ useLanguage: () => ({ language: 'en', t: (key: string) => key }) }));
const invalidResult: QuizResult = {
  id: 'invalid-date', date: '', chapterId: 1, chapterTitle: 'Saved result', subjectName: 'Anatomy',
  correct: 1, total: 2, pct: 50, elapsedSeconds: 10,
};
vi.mock('../utils/storage', () => ({ getQuizHistory: () => [{
  id: 'invalid-date', date: '', chapterId: 1, chapterTitle: 'Saved result', subjectName: 'Anatomy',
  correct: 1, total: 2, pct: 50, elapsedSeconds: 10,
}] }));

describe('history result dates', () => {
  it('uses the recorded date before a legacy timestamp', () => {
    const result = { ...invalidResult, date: '2026-10-08T09:00:00Z', timestamp: 0 };
    expect(getHistoryDate(result)?.toISOString())
      .toBe('2026-10-08T09:00:00.000Z');
  });
  it('falls back to a valid legacy timestamp when the date is malformed', () => {
    const result = { ...invalidResult, date: 'invalid', timestamp: 0 };
    expect(getHistoryDate(result)?.getTime()).toBe(0);
  });
  it('does not invent dates for malformed or missing values', () => {
    expect(getHistoryDate(invalidResult)).toBeNull();
    const result = { ...invalidResult, timestamp: {} };
    expect(getHistoryDate(result)).toBeNull();
  });
  it('keeps undated saved results visible', () => {
    render(<HistoryScreen onBack={() => {}} onSelectHistory={() => {}} />);
    expect(screen.getByText('Unknown date')).toBeInTheDocument();
    expect(screen.getByText('Saved result')).toBeInTheDocument();
  });
});
