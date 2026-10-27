import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockExamConfigModal } from '../../app/components/mock/MockExamConfigModal';

describe('MockExamConfigModal (Apple HIG Setup Dialog)', () => {
  it('renders modal with presets, feedback modes, and launch button', () => {
    const handleStart = vi.fn();
    const handleClose = vi.fn();

    render(
      <MockExamConfigModal
        isOpen={true}
        onClose={handleClose}
        moduleCode="MGL-3"
        moduleName="Gastrointestinal & Liver System"
        totalAvailableQuestions={500}
        onStartExam={handleStart}
      />
    );

    expect(screen.getByText(/Timed Mock Exam Simulation/i)).toBeInTheDocument();
    expect(screen.getByText(/Official Exam Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/Timed Tutor Mode/i)).toBeInTheDocument();

    expect(screen.getByText(/Quick Assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/Continuous Assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive Final/i)).toBeInTheDocument();

    const launchBtn = screen.getByRole('button', { name: /Launch Mock Exam/i });
    expect(launchBtn).toBeInTheDocument();
  });

  it('selects preset and launches with matching configuration', () => {
    const handleStart = vi.fn();
    const handleClose = vi.fn();

    render(
      <MockExamConfigModal
        isOpen={true}
        onClose={handleClose}
        moduleCode="MGL-3"
        totalAvailableQuestions={500}
        onStartExam={handleStart}
      />
    );

    // Click Quick Assessment
    const quickCard = screen.getByText(/Quick Assessment/i);
    fireEvent.click(quickCard);

    // Launch
    const launchBtn = screen.getByRole('button', { name: /Launch Mock Exam/i });
    fireEvent.click(launchBtn);

    expect(handleStart).toHaveBeenCalledWith({
      moduleCode: 'MGL-3',
      preset: 'quick',
      questionCount: 20,
      durationMinutes: 25,
      mode: 'official',
    });
  });

  it('switches to Timed Tutor Mode and custom question count', () => {
    const handleStart = vi.fn();
    const handleClose = vi.fn();

    render(
      <MockExamConfigModal
        isOpen={true}
        onClose={handleClose}
        moduleCode="IBM-1"
        totalAvailableQuestions={300}
        onStartExam={handleStart}
      />
    );

    // Switch feedback mode
    const tutorModeBtn = screen.getByText(/Timed Tutor Mode/i);
    fireEvent.click(tutorModeBtn);

    // Click Custom Test Builder
    const customCard = screen.getByText(/Custom Test Builder/i);
    fireEvent.click(customCard);

    const launchBtn = screen.getByRole('button', { name: /Launch Mock Exam/i });
    fireEvent.click(launchBtn);

    expect(handleStart).toHaveBeenCalledWith(
      expect.objectContaining({
        moduleCode: 'IBM-1',
        preset: 'custom',
        mode: 'tutor',
      })
    );
  });
});
