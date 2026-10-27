import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockExamRunner } from '../../app/components/mock/MockExamRunner';
import type { MockExamConfig, MockExamQuestion } from '../../app/types/mockExam';

const mockConfig: MockExamConfig = {
  moduleCode: 'MGL-3',
  preset: 'quick',
  questionCount: 2,
  durationMinutes: 25,
  mode: 'official',
};

const mockQuestions: MockExamQuestion[] = [
  {
    id: 'q1',
    text: 'Which artery supplies the stomach lesser curvature?',
    type: 'mcq',
    lecture: 1,
    subjectColor: 'anatomy',
    options: ['Left gastric artery', 'Right gastroepiploic', 'Short gastric'],
    correctIndex: 0,
    subjectName: 'Anatomy',
    explanation: 'The left gastric artery runs along the lesser curvature.',
  },
  {
    id: 'q2',
    text: 'What cell type secretes intrinsic factor in gastric glands?',
    type: 'mcq',
    lecture: 2,
    subjectColor: 'physiology',
    options: ['Chief cells', 'Parietal cells', 'G cells'],
    correctIndex: 1,
    subjectName: 'Physiology',
    explanation: 'Parietal cells secrete HCl and intrinsic factor.',
  },
];

describe('MockExamRunner (Active Exam Screen & Timed Navigation)', () => {
  it('renders question stem, options, countdown timer, and counter', () => {
    const handleComplete = vi.fn();
    const handleExit = vi.fn();

    render(
      <MockExamRunner
        config={mockConfig}
        questions={mockQuestions}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    );

    expect(screen.getByText(/Question 1 of 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Which artery supplies the stomach lesser curvature/i)).toBeInTheDocument();
    expect(screen.getByText('Left gastric artery')).toBeInTheDocument();
    expect(screen.getByText('Right gastroepiploic')).toBeInTheDocument();
    expect(screen.getByText('Short gastric')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Exam/i })).toBeInTheDocument();
  });

  it('selects option, flags question, and navigates to next question', () => {
    const handleComplete = vi.fn();
    const handleExit = vi.fn();

    render(
      <MockExamRunner
        config={mockConfig}
        questions={mockQuestions}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    );

    // Select Option A
    const optionA = screen.getByText('Left gastric artery');
    fireEvent.click(optionA);

    // Flag question
    const flagBtn = screen.getByRole('button', { name: /Flag question for review/i });
    fireEvent.click(flagBtn);

    // Next Question
    const nextBtn = screen.getByRole('button', { name: /Next Question/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Question 2 of 2/i)).toBeInTheDocument();
    expect(screen.getByText(/What cell type secretes intrinsic factor/i)).toBeInTheDocument();
  });

  it('opens navigator palette and jumps to specific question', () => {
    const handleComplete = vi.fn();
    const handleExit = vi.fn();

    render(
      <MockExamRunner
        config={mockConfig}
        questions={mockQuestions}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    );

    // Open palette
    const gridBtn = screen.getByRole('button', { name: /Open question navigator grid/i });
    fireEvent.click(gridBtn);

    expect(screen.getByText('Question Navigator Grid')).toBeInTheDocument();

    // Click question 2 button
    const q2Btn = screen.getByRole('button', { name: '2' });
    fireEvent.click(q2Btn);

    expect(screen.getByText(/Question 2 of 2/i)).toBeInTheDocument();
    expect(screen.getByText(/What cell type secretes intrinsic factor/i)).toBeInTheDocument();
  });

  it('submits exam and computes final Ain Shams score result', () => {
    const handleComplete = vi.fn();
    const handleExit = vi.fn();

    render(
      <MockExamRunner
        config={mockConfig}
        questions={mockQuestions}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    );

    // Answer Q1 correctly
    fireEvent.click(screen.getByText('Left gastric artery'));

    // Move to Q2
    fireEvent.click(screen.getByRole('button', { name: /Next Question/i }));

    // Answer Q2 correctly
    fireEvent.click(screen.getByText('Parietal cells'));

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Submit Exam/i });
    fireEvent.click(submitBtn);

    // Confirm submit in alert modal
    const confirmBtn = screen.getByRole('button', { name: /Confirm Submission/i });
    fireEvent.click(confirmBtn);

    expect(handleComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        moduleCode: 'MGL-3',
        totalQuestions: 2,
        correctCount: 2,
        scorePercentage: 100,
        isPassed: true,
      })
    );
  });
});
