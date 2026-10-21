import { beforeAll, describe, expect, it } from 'vitest';
import bank from '../imports/year-3/semester-2/R-3.json';
import { validateModuleFile } from '../../data-format-v2/scripts/validate-banks';
import { ensureModuleDataLoaded, isModuleActive } from './data';
import { checkAnswerCorrect } from './utils/quiz';

const canonical = bank.chapters.flatMap((c) => c.subjects.flatMap((s) => s.questions));

describe('R-3 Scientific Research Bank Integration', () => {
  beforeAll(async () => {
    await ensureModuleDataLoaded('R-3');
  });

  it('passes strict schema validation', () => {
    const errors = validateModuleFile(bank as Parameters<typeof validateModuleFile>[0]);
    expect(errors).toEqual([]);
  });

  it('matches syllabus metadata and activates module', () => {
    expect(bank.meta).toMatchObject({
      moduleCode: 'R-3',
      moduleName: 'Scientific Research',
      year: 3,
      semester: 2,
      creditPoints: 1.5,
      totalMarks: 30
    });
    expect(bank.comingSoon).toBe(false);
    expect(isModuleActive('R-3')).toBe(true);
  });

  it('has exactly 63 questions distributed across 4 active chapters (3 practical + 1 formative exam)', () => {
    expect(canonical).toHaveLength(63);

    // Active Practical Chapters:
    const ch1 = bank.chapters.find((c) => c.id === 1)!;
    const ch2 = bank.chapters.find((c) => c.id === 2)!;
    const ch3 = bank.chapters.find((c) => c.id === 3)!;
    const ch8 = bank.chapters.find((c) => c.id === 8)!;

    expect(ch1.subjects[0].questions).toHaveLength(14);
    expect(ch2.subjects[0].questions).toHaveLength(15);
    expect(ch3.subjects[0].questions).toHaveLength(24);
    expect(ch8.subjects[0].questions).toHaveLength(10);
    expect(ch8.bankSection).toBe('past-exams');

    // Outline Chapters:
    expect(bank.chapters.filter((c) => c.id >= 4 && c.id <= 7).every((c) => c.subjects.length === 0)).toBe(true);
  });

  it('contains expected question types across all 63 items', () => {
    const mcqs = canonical.filter((q) => q.type === 'mcq');
    const truefalses = canonical.filter((q) => q.type === 'truefalse');
    const essays = canonical.filter((q) => q.type === 'essay');
    const fillblanks = canonical.filter((q) => q.type === 'fillblank');
    const matchings = canonical.filter((q) => q.type === 'matching');

    expect(mcqs).toHaveLength(44); // 34 practical + 10 formative exam
    expect(truefalses).toHaveLength(5);
    expect(essays).toHaveLength(8);
    expect(fillblanks).toHaveLength(5);
    expect(matchings).toHaveLength(1);
  });

  it('grades MCQ and True/False questions correctly', () => {
    const mcqOrTf = canonical.filter((q) => q.type === 'mcq' || q.type === 'truefalse');
    for (const q of mcqOrTf) {
      expect(Number.isInteger(q.correctIndex)).toBe(true);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options!.length);

      // Verify grading helper
      expect(checkAnswerCorrect(q as unknown as Parameters<typeof checkAnswerCorrect>[0], q.correctIndex!)).toBe(true);
    }
  });

  it('provides complete model answers and explanations for essays and fillblanks', () => {
    const essays = canonical.filter((q) => q.type === 'essay');
    for (const q of essays) {
      expect(typeof q.modelAnswer).toBe('string');
      expect(q.modelAnswer!.trim().length).toBeGreaterThan(10);
      expect(q.explanation.trim().length).toBeGreaterThan(10);
    }

    const fillblanks = canonical.filter((q) => q.type === 'fillblank');
    for (const q of fillblanks) {
      expect(Array.isArray(q.blanks)).toBe(true);
      expect(q.blanks!.length).toBeGreaterThan(0);
      expect(q.explanation.trim().length).toBeGreaterThan(10);
    }
  });
});
