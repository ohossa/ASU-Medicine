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

describe('CA-1 Past Exams Intake & Quality Verification (Deduplicated)', () => {
  const ca1Chapters = bank.chapters.filter((c) => c.examPeriod === 'ca-1' && c.id >= 101 && c.id <= 108);

  it('contains all 8 CA-1 chapters with expected question volumes', () => {
    expect(ca1Chapters.length).toBe(8);

    const chapterCounts = Object.fromEntries(
      ca1Chapters.map((c) => [c.id, c.subjects.reduce((sum, s) => sum + s.questions.length, 0)]),
    );

    expect(chapterCounts[101]).toBe(59);  // Anatomy & Embryology
    expect(chapterCounts[102]).toBe(27);  // Histology
    expect(chapterCounts[103]).toBe(146); // Physiology
    expect(chapterCounts[104]).toBe(54);  // Biochemistry
    expect(chapterCounts[105]).toBe(40);  // Pathology
    expect(chapterCounts[106]).toBe(36);  // Pharmacology
    expect(chapterCounts[107]).toBe(12);  // Microbiology
    expect(chapterCounts[108]).toBe(0);   // Parasitology

    const totalCa1 = Object.values(chapterCounts).reduce((a, b) => a + b, 0);
    expect(totalCa1).toBe(374); // Fully deduplicated CA-1 questions
  });

  const pdfAnchoredQuestions = ca1Chapters.flatMap((c) =>
    c.subjects.flatMap((s) => s.questions.filter((q) => q.sources?.some((src) => src.includes('Urogenital Past Exams- Assessment 1.pdf')))),
  );

  it('verifies 293 unique past exam questions anchored to Assessment 1 PDF are present and uniquely identified', () => {
    expect(pdfAnchoredQuestions.length).toBe(293);
    const ids = pdfAnchoredQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(293);

    for (const q of pdfAnchoredQuestions) {
      expect(q.id).toMatch(/^MUG3-CH\d+-[A-Z]{4}-\d{4}$/);
    }
  });

  it('guarantees valid options, valid correctIndex, and 100% grading precision for all questions', () => {
    for (const q of pdfAnchoredQuestions) {
      expect(q.type).toBe('mcq');
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options!.length).toBeGreaterThanOrEqual(4);
      expect(new Set(q.options!).size).toBe(q.options!.length); // No duplicates
      expect(Number.isInteger(q.correctIndex)).toBe(true);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options!.length);

      // Verify quiz utility grading
      expect(checkAnswerCorrect(q as any, q.correctIndex!), `ID ${q.id} grading true`).toBe(true);
      const wrongIdx = (q.correctIndex! + 1) % q.options!.length;
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
