import { describe, it, expect } from 'vitest';
import { generateMockExamQuestions } from '../../app/utils/mockExamGenerator';

describe('Mock Exam Generator & Curricular Sampling', () => {
  it('generates the requested number of questions for a valid module', async () => {
    const questions = await generateMockExamQuestions({
      moduleCode: 'MGL-3',
      preset: 'quick',
      questionCount: 20,
      durationMinutes: 25,
      mode: 'official',
    });

    expect(questions.length).toBe(20);
    for (const q of questions) {
      expect(q.text).toBeDefined();
      expect(q.subjectName).toBeDefined();
      expect(q.isFlagged).toBe(false);
    }
  });

  it('samples questions across multiple subjects for curricular balance', async () => {
    const questions = await generateMockExamQuestions({
      moduleCode: 'MGL-3',
      preset: 'midterm',
      questionCount: 40,
      durationMinutes: 50,
      mode: 'official',
    });

    expect(questions.length).toBe(40);

    const subjects = new Set(questions.map((q) => q.subjectName));
    expect(subjects.size).toBeGreaterThan(1);
  });

  it('handles small question count requests gracefully', async () => {
    const questions = await generateMockExamQuestions({
      moduleCode: 'IBM-1',
      preset: 'custom',
      questionCount: 5,
      durationMinutes: 10,
      mode: 'tutor',
    });

    expect(questions.length).toBe(5);
  });
});
