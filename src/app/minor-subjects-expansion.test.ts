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
  [key: string]: any;
}

const bank = importedBank as unknown as {
  chapters: Array<{
    id: number;
    title: string;
    subjects: Array<{
      id: string;
      name: string;
      lectureCount: number;
      lectureNames: string[];
      questions: Question[];
    }>;
  }>;
};

describe('MUG-3 Minor Subjects MCQ Expansion Suite', () => {
  const ch4 = bank.chapters.find((c) => c.id === 4)!;
  const ch5 = bank.chapters.find((c) => c.id === 5)!;
  const ch6 = bank.chapters.find((c) => c.id === 6)!;
  const ch7 = bank.chapters.find((c) => c.id === 7)!;
  const ch8 = bank.chapters.find((c) => c.id === 8)!;

  it('verifies exact counts of newly added MCQs across all 5 minor disciplines', () => {
    const bioMCQs = ch4.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH4-BIOC-05'));
    const pathMCQs = ch5.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH5-PATH-4'));
    const pharMCQs = ch6.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH6-PHAR-05'));
    const micrMCQs = ch7.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH7-MICR-03'));
    const paraMCQs = ch8.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH8-PARA-01'));

    expect(bioMCQs.length).toBe(60);
    expect(pathMCQs.length).toBe(100);
    expect(pharMCQs.length).toBe(50);
    expect(micrMCQs.length).toBe(40);
    expect(paraMCQs.length).toBe(20);

    const totalNew = bioMCQs.length + pathMCQs.length + pharMCQs.length + micrMCQs.length + paraMCQs.length;
    expect(totalNew).toBe(270);
  });

  it('guarantees 4 options, deterministic answers, and non-empty explanations for all 270 new questions', () => {
    const allNewQuestions = [
      ...ch4.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH4-BIOC-05')),
      ...ch5.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH5-PATH-4')),
      ...ch6.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH6-PHAR-05')),
      ...ch7.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH7-MICR-03')),
      ...ch8.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH8-PARA-01')),
    ];

    expect(allNewQuestions.length).toBe(270);

    for (const q of allNewQuestions) {
      expect(q.type).toBe('mcq');
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options!.length).toBe(4);

      // Verify no duplicate options within any question
      const uniqueOpts = new Set(q.options!.map((o) => o.trim().toLowerCase()));
      expect(uniqueOpts.size).toBe(4);

      // Verify correctIndex within bounds
      expect(Number.isInteger(q.correctIndex)).toBe(true);
      expect(q.correctIndex!).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex!).toBeLessThan(4);

      // Verify grading function
      expect(checkAnswerCorrect(q as any, q.correctIndex!)).toBe(true);
      const wrongIdx = (q.correctIndex! + 1) % 4;
      expect(checkAnswerCorrect(q as any, wrongIdx)).toBe(false);

      // Verify rich medical explanation
      expect(typeof q.explanation).toBe('string');
      expect(q.explanation!.trim().length).toBeGreaterThan(25);
      expect(q.explanation).not.toMatch(/^(?:FLAG|READY|See above|Pending|To be added)\.?$/i);

      // Verify source provenance
      expect(Array.isArray(q.sources)).toBe(true);
      expect(q.sources!.length).toBeGreaterThan(0);
    }
  });

  it('verifies complete lecture distribution across all 29 minor syllabus lectures', () => {
    // Ch 4: Biochemistry (4 lectures, 15 each)
    const bioByLec = ch4.subjects[0].questions
      .filter((q) => q.id.startsWith('MUG3-CH4-BIOC-05'))
      .reduce((acc, q) => ({ ...acc, [q.lecture]: (acc[q.lecture] || 0) + 1 }), {} as Record<number, number>);
    expect(bioByLec[1]).toBe(15);
    expect(bioByLec[2]).toBe(15);
    expect(bioByLec[3]).toBe(15);
    expect(bioByLec[4]).toBe(15);

    // Ch 5: Pathology (14 lectures, all >= 7)
    const pathByLec = ch5.subjects[0].questions
      .filter((q) => q.id.startsWith('MUG3-CH5-PATH-4'))
      .reduce((acc, q) => ({ ...acc, [q.lecture]: (acc[q.lecture] || 0) + 1 }), {} as Record<number, number>);
    for (let lec = 1; lec <= 14; lec++) {
      expect(pathByLec[lec]).toBeGreaterThanOrEqual(7);
    }

    // Ch 6: Pharmacology (6 lectures, all >= 8)
    const pharByLec = ch6.subjects[0].questions
      .filter((q) => q.id.startsWith('MUG3-CH6-PHAR-05'))
      .reduce((acc, q) => ({ ...acc, [q.lecture]: (acc[q.lecture] || 0) + 1 }), {} as Record<number, number>);
    for (let lec = 1; lec <= 6; lec++) {
      expect(pharByLec[lec]).toBeGreaterThanOrEqual(8);
    }

    // Ch 7: Microbiology (3 lectures, all >= 10)
    const micrByLec = ch7.subjects[0].questions
      .filter((q) => q.id.startsWith('MUG3-CH7-MICR-03'))
      .reduce((acc, q) => ({ ...acc, [q.lecture]: (acc[q.lecture] || 0) + 1 }), {} as Record<number, number>);
    expect(micrByLec[1]).toBe(16);
    expect(micrByLec[2]).toBe(14);
    expect(micrByLec[3]).toBe(10);

    // Ch 8: Parasitology (2 lectures, all >= 8)
    const paraByLec = ch8.subjects[0].questions
      .filter((q) => q.id.startsWith('MUG3-CH8-PARA-01'))
      .reduce((acc, q) => ({ ...acc, [q.lecture]: (acc[q.lecture] || 0) + 1 }), {} as Record<number, number>);
    expect(paraByLec[1]).toBe(12);
    expect(paraByLec[2]).toBe(8);
  });
});
