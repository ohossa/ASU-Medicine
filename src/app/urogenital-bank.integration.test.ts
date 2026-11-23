import { describe, it, expect } from 'vitest';
import importedBank from '../imports/year-3/semester-1/MUG-3.json';
import { ensureDataLoaded, getChaptersForModuleAndMode, findQuestionById } from './data';
import { checkAnswerCorrect } from './utils/quiz';

interface PreparedQuestion {
  id: string;
  type: string;
  lecture: number;
  text: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  [key: string]: any;
}

const bank = importedBank as unknown as {
  meta: { moduleCode: string; creditPoints: number; totalMarks: number };
  chapters: Array<{
    id: number;
    title: string;
    bankSection?: 'practice' | 'past-exams';
    examPeriod?: 'ca-1' | 'ca-2';
    subjects: Array<{
      id: string;
      name: string;
      lectureNames: string[];
      lectureCount: number;
      questions: PreparedQuestion[];
    }>;
  }>;
};

const rawQuestions = bank.chapters.flatMap((c) =>
  c.subjects.flatMap((s) => s.questions),
);

describe('Integrated Urogenital question bank (MUG-3)', () => {
  it('loads module data successfully with active chapters', async () => {
    await ensureDataLoaded();
    const chapters = getChaptersForModuleAndMode('MUG-3', 'mixed');
    expect(chapters.length).toBeGreaterThan(0);
    const totalLoaded = chapters.reduce(
      (sum, c) => sum + c.subjects.reduce((s, sub) => s + sub.questions.length, 0),
      0,
    );
    expect(totalLoaded).toBe(rawQuestions.length);
  });

  it('validates canonical question counts and metadata', () => {
    expect(bank.meta.moduleCode).toBe('MUG-3');
    expect(bank.meta.creditPoints).toBe(10);
    expect(bank.meta.totalMarks).toBe(200);
    expect(rawQuestions.length).toBe(2839);
  });

  it('guarantees unique and well-formatted question IDs', () => {
    const ids = rawQuestions.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    for (const q of rawQuestions) {
      expect(q.id).toMatch(/^MUG3-CH\d+-[A-Z]{4}-\d{4}$/);
    }
  });

  it('grades every question correctly via shared quiz utility', () => {
    for (const q of rawQuestions) {
      expect(['mcq', 'essay', 'truefalse', 'matching', 'case']).toContain(q.type);
      if (q.type === 'mcq') {
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options!.length).toBeGreaterThanOrEqual(2);
        expect(Number.isInteger(q.correctIndex)).toBe(true);
        expect(q.correctIndex!).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex!).toBeLessThan(q.options!.length);

        // Check grading function
        expect(checkAnswerCorrect(q as any, q.correctIndex!), `${q.id} correct`).toBe(true);
        const wrongIndex = (q.correctIndex! + 1) % q.options!.length;
        expect(checkAnswerCorrect(q as any, wrongIndex), `${q.id} wrong`).toBe(false);
      } else if (q.type === 'essay') {
        expect(typeof q.modelAnswer).toBe('string');
        expect(q.modelAnswer!.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('verifies non-empty, high-quality medical explanations for all questions', () => {
    for (const q of rawQuestions) {
      expect(typeof q.explanation).toBe('string');
      expect(q.explanation!.trim().length).toBeGreaterThan(5);
      expect(q.explanation).not.toMatch(/^(?:FLAG|READY|See above|Pending|To be added)\.?$/i);
    }
  });

  it('partitions chapters into practice and past-exams sections correctly', () => {
    const practiceChapters = bank.chapters.filter(
      (c) => (c.bankSection ?? 'practice') === 'practice',
    );
    const pastChapters = bank.chapters.filter((c) => c.bankSection === 'past-exams');

    expect(practiceChapters.length).toBe(8); // 8 Core Disciplines
    expect(pastChapters.length).toBeGreaterThan(0);

    const practiceCount = practiceChapters.reduce(
      (sum, c) => sum + c.subjects.reduce((s, sub) => s + sub.questions.length, 0),
      0,
    );
    const pastCount = pastChapters.reduce(
      (sum, c) => sum + c.subjects.reduce((s, sub) => s + sub.questions.length, 0),
      0,
    );

    expect(practiceCount).toBe(1901);
    expect(pastCount).toBe(938);
    expect(practiceCount + pastCount).toBe(rawQuestions.length);
  });

  it('ensures all questions map to valid syllabus lectures', () => {
    for (const chapter of bank.chapters) {
      for (const subject of chapter.subjects) {
        for (const q of subject.questions) {
          expect(q.lecture).toBeGreaterThanOrEqual(1);
          expect(q.lecture).toBeLessThanOrEqual(subject.lectureCount);
        }
      }
    }
  });

  it('allows question retrieval by ID across the entire bank', () => {
    const sample = rawQuestions.slice(0, 10);
    for (const q of sample) {
      const found = findQuestionById(q.id);
      expect(found).toBeTruthy();
      expect(found!.question.id).toBe(q.id);
    }
  });
});
