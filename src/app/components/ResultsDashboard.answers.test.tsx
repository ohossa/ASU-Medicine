import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ResultsDashboard } from './ResultsDashboard';
import type { ChapterData, Question, QuizAnswer } from '../types';
vi.mock('../hooks/useLanguage', () => ({ useLanguage: () => ({ language: 'en' }) }));
vi.mock('../hooks/useTheme', () => ({ useTheme: () => ({ theme: 'dark' }) }));
vi.mock('../hooks/useProgress', () => ({ useProgress: () => ({ unlock: vi.fn() }) }));
vi.mock('../lib/celebrate', () => ({ celebrate: vi.fn() }));
vi.mock('../lib/pulseEngine', () => ({ pulse: { setMood: vi.fn() } }));
vi.mock('../reports/ReportQuestion', () => ({ ReportQuestionButton: () => null }));
const chapter: ChapterData = { id: 1, title: 'Anatomy', subtitle: '', emoji: '', page: 1, lectureRange: '', accentColor: 'anatomy', subjects: [] };
const baseQuestion: Question = { id: 'q', lecture: 1, subjectColor: 'anatomy', explanation: '', text: 'Question?', type: 'essay' };
function review(question: Question, answer: QuizAnswer) {
  return render(<ResultsDashboard chapter={chapter} subject={null} questions={[question]} answers={{ 0: answer }}
    elapsedSeconds={10} flaggedQuestions={new Set()} onRetake={() => {}} onTryAnotherSubject={() => {}}
    onBackToChapters={() => {}} onBackToSubjects={() => {}} />);
}
afterEach(cleanup);
describe('typed result answer review', () => {
  it('keeps essay text and grading visible', () => {
    review(baseQuestion, { text: 'Essay response', selfGrade: 'correct' });
    expect(screen.getByRole('textbox')).toHaveValue('Essay response');
    expect(screen.getByText('Self-Graded: Correct')).toBeInTheDocument();
  });
  it('displays legacy string essay responses', () => {
    review(baseQuestion, 'Legacy essay response');
    expect(screen.getByRole('textbox')).toHaveValue('Legacy essay response');
  });
  it('reviews mixed case subanswers without treating selections as objects', () => {
    review({ ...baseQuestion, type: 'case', text: 'Clinical case', subQuestions: [
      { id: 'mcq', type: 'mcq', text: 'Choose', options: ['Yes', 'No'], correctIndex: 0, explanation: '' },
      { id: 'essay', type: 'essay', text: 'Explain', explanation: '' },
      { id: 'blank', type: 'fillblank', text: 'Structure ___', blanks: ['atrium'], explanation: '' },
    ] }, { mcq: 0, essay: { text: 'Case essay response', selfGrade: 'correct' }, blank: { inputs: ['atrium'], submitted: true } });
    expect(screen.getByText('Case essay response')).toBeInTheDocument();
    expect(screen.getByText('atrium')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });
});
