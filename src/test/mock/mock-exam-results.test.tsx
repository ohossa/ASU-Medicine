import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockExamResultsView } from '../../app/components/mock/MockExamResultsView';
import type { MockExamResult } from '../../app/types/mockExam';

const mockResult: MockExamResult = {
  id: 'res_test_101',
  moduleCode: 'MGL-3',
  timestamp: new Date().toISOString(),
  preset: 'midterm',
  mode: 'official',
  totalQuestions: 2,
  answeredCount: 2,
  correctCount: 1,
  scorePercentage: 50,
  gradeInfo: {
    grade: 'F',
    gpaPoints: 0.0,
    status: 'Fail',
    color: 'text-rose-700 dark:text-rose-300',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    badgeBorder: 'border-rose-300 dark:border-rose-800',
  },
  isPassed: false,
  totalDurationSeconds: 120,
  allottedDurationSeconds: 3000,
  averageSecondsPerQuestion: 60,
  fastestQuestionSeconds: 40,
  slowestQuestionSeconds: 80,
  disciplineBreakdown: {
    Anatomy: { total: 1, correct: 1, accuracy: 100 },
    Pathology: { total: 1, correct: 0, accuracy: 0 },
  },
  questions: [
    {
      id: 'q1',
      text: 'What is the arterial supply to the stomach lesser curvature?',
      type: 'mcq',
      lecture: 1,
      subjectColor: 'anatomy',
      options: ['Left gastric artery', 'Right gastroepiploic', 'Short gastric'],
      correctIndex: 0,
      selectedOption: 0,
      subjectName: 'Anatomy',
      explanation: 'The left gastric artery runs along the lesser curvature.',
    },
    {
      id: 'q2',
      text: 'Which cell type secretes intrinsic factor in the gastric glands?',
      type: 'mcq',
      lecture: 2,
      subjectColor: 'pathology',
      options: ['Chief cells', 'Parietal cells', 'G cells'],
      correctIndex: 1,
      selectedOption: 0,
      subjectName: 'Pathology',
      explanation: 'Parietal (oxyntic) cells secrete HCl and intrinsic factor.',
    },
  ],
};

describe('MockExamResultsView (Ain Shams Faculty Grade & Pacing Report)', () => {
  it('renders Ain Shams grade, score, pacing, and discipline breakdown', () => {
    const handleRetry = vi.fn();
    const handleRetake = vi.fn();
    const handleBack = vi.fn();

    render(
      <MockExamResultsView
        result={mockResult}
        onRetryMissed={handleRetry}
        onRetakeExam={handleRetake}
        onBackToHub={handleBack}
      />
    );

    expect(screen.getByText('F')).toBeInTheDocument();
    expect(screen.getByText(/Ain Shams Medical Scale/i)).toBeInTheDocument();
    expect(screen.getAllByText('50%').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/1 of 2 Questions Correct/i)).toBeInTheDocument();
    expect(screen.getByText('60s / Q')).toBeInTheDocument();
    expect(screen.getAllByText('Anatomy').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Pathology').length).toBeGreaterThanOrEqual(1);
  });

  it('triggers 1-click retry on missed questions', () => {
    const handleRetry = vi.fn();
    const handleRetake = vi.fn();
    const handleBack = vi.fn();

    render(
      <MockExamResultsView
        result={mockResult}
        onRetryMissed={handleRetry}
        onRetakeExam={handleRetake}
        onBackToHub={handleBack}
      />
    );

    const retryBtns = screen.getAllByRole('button', { name: /Retry/i });
    expect(retryBtns.length).toBeGreaterThan(0);
    fireEvent.click(retryBtns[0]);

    expect(handleRetry).toHaveBeenCalledWith([mockResult.questions[1]]);
  });

  it('filters questions by Missed and expands clinical explanation', () => {
    render(
      <MockExamResultsView
        result={mockResult}
        onRetryMissed={vi.fn()}
        onRetakeExam={vi.fn()}
        onBackToHub={vi.fn()}
      />
    );

    // Filter by Missed
    const missedFilterBtn = screen.getByRole('button', { name: /Missed \(1\)/i });
    fireEvent.click(missedFilterBtn);

    expect(screen.getByText(/Which cell type secretes intrinsic factor/i)).toBeInTheDocument();
    expect(screen.queryByText(/What is the arterial supply to the stomach/i)).not.toBeInTheDocument();

    // Click to expand question
    const questionCard = screen.getByText(/Which cell type secretes intrinsic factor/i);
    fireEvent.click(questionCard);

    expect(screen.getByText(/Faculty Clinical Rationale:/i)).toBeInTheDocument();
    expect(screen.getByText(/Parietal \(oxyntic\) cells secrete HCl/i)).toBeInTheDocument();
  });
});
