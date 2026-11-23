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
    expect(chapterCounts[103]).toBe(139); // Physiology (misplaced micro & BPH questions relocated and duplicate merged)
    expect(chapterCounts[104]).toBe(54);  // Biochemistry
    expect(chapterCounts[105]).toBe(40);  // Pathology
    expect(chapterCounts[106]).toBe(36);  // Pharmacology
    expect(chapterCounts[107]).toBe(0);   // Microbiology (0 in CA-1, all moved to CA-2)
    expect(chapterCounts[108]).toBe(0);   // Parasitology

    const totalCa1 = Object.values(chapterCounts).reduce((a, b) => a + b, 0);
    expect(totalCa1).toBe(355); // Fully deduplicated CA-1 questions (zero micro)
  });

  const pdfAnchoredQuestions = ca1Chapters.flatMap((c) =>
    c.subjects.flatMap((s) => s.questions.filter((q) => q.sources?.some((src) => src.includes('Urogenital Past Exams- Assessment 1.pdf')))),
  );

  it('verifies 283 unique past exam questions anchored to Assessment 1 PDF are present in CA-1', () => {
    expect(pdfAnchoredQuestions.length).toBe(283);
    const ids = pdfAnchoredQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(283);

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

  it('verifies all questions in Continuous Assessment (CA-1 and CA-2) are exclusively type mcq', () => {
    const caChapters = bank.chapters.filter((c) => (c.id >= 101 && c.id <= 108) || (c.id >= 201 && c.id <= 208));
    expect(caChapters.length).toBe(16);
    for (const ch of caChapters) {
      for (const sub of ch.subjects) {
        for (const q of sub.questions) {
          expect(q.type).toBe('mcq');
        }
      }
    }
  });

  it('verifies CA-2 Microbiology (Chapter 207) contains all relocated questions with valid lecture mapping', () => {
    const ch207 = bank.chapters.find((c) => c.id === 207);
    expect(ch207).toBeDefined();
    const ch207Questions = ch207!.subjects.flatMap((s) => s.questions);
    expect(ch207Questions.length).toBe(20);

    // Verify all questions are MCQ with valid options and lectures 1-3
    for (const q of ch207Questions) {
      expect(q.type).toBe('mcq');
      expect(q.lecture).toBeGreaterThanOrEqual(1);
      expect(q.lecture).toBeLessThanOrEqual(3);
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options!.length).toBeGreaterThanOrEqual(4);
    }

    // Verify the 10 micro questions from Assessment 1 PDF are present in CA-2
    const pdfAnchoredCh207 = ch207Questions.filter((q) =>
      q.sources?.some((src) => src.includes('Urogenital Past Exams- Assessment 1.pdf')),
    );
    expect(pdfAnchoredCh207.length).toBe(10);
    for (const q of pdfAnchoredCh207) {
      expect(q.lecture).toBe(1); // Mapped to UTI lecture
    }
  });
});
