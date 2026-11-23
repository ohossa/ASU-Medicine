import { describe, it, expect } from 'vitest';
import importedBank from '../imports/year-3/semester-1/MUG-3.json';
import { checkAnswerCorrect } from './utils/quiz';

interface Question {
  id: string;
  type: string;
  lecture: number;
  text: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  sources?: string[];
  repetitionCount?: number;
}

const bank = importedBank as unknown as {
  chapters: Array<{
    id: number;
    title: string;
    bankSection?: string;
    examPeriod?: string;
    subjects: Array<{
      id: string;
      name: string;
      lectureCount: number;
      questions: Question[];
    }>;
  }>;
};

describe('CA-1 Past Exams Intake & Quality Verification (307 questions)', () => {
  const ca1Chapters = bank.chapters.filter((c) => c.examPeriod === 'ca-1' && c.id >= 101 && c.id <= 108);

  it('contains all 8 CA-1 chapters with expected question volumes', () => {
    expect(ca1Chapters.length).toBe(8);

    const chapterCounts = Object.fromEntries(
      ca1Chapters.map((c) => [c.id, c.subjects.reduce((sum, s) => sum + s.questions.length, 0)]),
    );

    expect(chapterCounts[101]).toBe(67);  // Anatomy & Embryology (10 + 57)
    expect(chapterCounts[102]).toBe(33);  // Histology (12 + 21)
    expect(chapterCounts[103]).toBe(161); // Physiology (57 + 104)
    expect(chapterCounts[104]).toBe(55);  // Biochemistry (6 + 49)
    expect(chapterCounts[105]).toBe(44);  // Pathology (11 + 33)
    expect(chapterCounts[106]).toBe(37);  // Pharmacology (4 + 33)
    expect(chapterCounts[107]).toBe(12);  // Microbiology (2 + 10)
    expect(chapterCounts[108]).toBe(0);   // Parasitology (0)

    const totalCa1 = Object.values(chapterCounts).reduce((a, b) => a + b, 0);
    expect(totalCa1).toBe(409); // 102 original + 307 new
  });

  const newlyAdded = ca1Chapters.flatMap((c) =>
    c.subjects.flatMap((s) => s.questions.filter((q) => q.sources?.some((src) => src.includes('Urogenital Past Exams- Assessment 1.pdf')))),
  );

  it('verifies exactly 307 questions from Assessment 1 PDF are present and uniquely identified', () => {
    expect(newlyAdded.length).toBe(307);
    const ids = newlyAdded.map((q) => q.id);
    expect(new Set(ids).size).toBe(307);

    for (const q of newlyAdded) {
      expect(q.id).toMatch(/^MUG3-CH10[1-7]-[A-Z]{4}-\d{4}$/);
    }
  });

  it('guarantees 5 distinct options, valid correctIndex, and 100% grading precision for all 307 questions', () => {
    for (const q of newlyAdded) {
      expect(q.type).toBe('mcq');
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options!.length).toBe(5);
      expect(new Set(q.options!).size).toBe(5); // No duplicates
      expect(Number.isInteger(q.correctIndex)).toBe(true);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(5);

      // Verify quiz utility grading
      expect(checkAnswerCorrect(q as any, q.correctIndex!), `ID ${q.id} grading true`).toBe(true);
      const wrongIdx = (q.correctIndex! + 1) % 5;
      expect(checkAnswerCorrect(q as any, wrongIdx), `ID ${q.id} grading false`).toBe(false);
    }
  });

  it('ensures comprehensive clinical explanations and valid lecture mapping', () => {
    for (const ch of ca1Chapters) {
      for (const sub of ch.subjects) {
        for (const q of sub.questions) {
          expect(q.text.trim().length).toBeGreaterThan(10);
          expect(q.explanation?.trim().length).toBeGreaterThan(20);
          expect(q.lecture).toBeGreaterThanOrEqual(1);
          expect(q.lecture).toBeLessThanOrEqual(sub.lectureCount);
        }
      }
    }
  });
});
