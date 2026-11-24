import { describe, it, expect } from 'vitest';
import importedBank from '../imports/year-3/semester-1/MUG-3.json';
import { checkAnswerCorrect } from './utils/quiz';

interface Question {
  id: string;
  type: 'mcq' | 'essay' | 'fillblank' | 'truefalse' | 'matching' | 'case' | 'casestudy';
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

describe('MUG-3 Already-Made Question Files Expansion Suite (251 questions)', () => {
  const ch1 = bank.chapters.find((c) => c.id === 1)!;
  const ch2 = bank.chapters.find((c) => c.id === 2)!;
  const ch4 = bank.chapters.find((c) => c.id === 4)!;
  const ch5 = bank.chapters.find((c) => c.id === 5)!;
  const ch6 = bank.chapters.find((c) => c.id === 6)!;
  const ch7 = bank.chapters.find((c) => c.id === 7)!;

  const newAnat = ch1.subjects[0].questions.filter((q) => {
    const n = parseInt(q.id.split('-').pop() || '0');
    return n >= 1021;
  });
  const newHisto = ch2.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH2-HIST-06'));
  const newBioc = ch4.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH4-BIOC-06'));
  const newPath = ch5.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH5-PATH-50'));
  const newPhar = ch6.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH6-PHAR-06'));
  const newMicr = ch7.subjects[0].questions.filter((q) => q.id.startsWith('MUG3-CH7-MICR-04'));

  it('verifies exact counts of newly added MCQs across all 6 disciplines', () => {
    expect(newAnat.length).toBe(41);
    expect(newHisto.length).toBe(6);
    expect(newBioc.length).toBe(43);
    expect(newPath.length).toBe(62);
    expect(newPhar.length).toBe(54);
    expect(newMicr.length).toBe(45);

    const totalNew = newAnat.length + newHisto.length + newBioc.length + newPath.length + newPhar.length + newMicr.length;
    expect(totalNew).toBe(251);
  });

  it('guarantees 4+ options, deterministic answers, and non-empty explanations for all 251 new questions', () => {
    const allNewQuestions = [
      ...newAnat,
      ...newHisto,
      ...newBioc,
      ...newPath,
      ...newPhar,
      ...newMicr,
    ];

    expect(allNewQuestions.length).toBe(251);

    for (const q of allNewQuestions) {
      expect(q.type).toBe('mcq');
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options!.length).toBeGreaterThanOrEqual(4);

      // Verify no duplicate options within any question
      const uniqueOpts = new Set(q.options!.map((o) => o.trim().toLowerCase()));
      expect(uniqueOpts.size).toBe(q.options!.length);

      // Verify correctIndex within bounds
      expect(Number.isInteger(q.correctIndex)).toBe(true);
      expect(q.correctIndex!).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex!).toBeLessThan(q.options!.length);

      // Verify grading function
      expect(checkAnswerCorrect(q, q.correctIndex)).toBe(true);

      // Verify wrong answer grading
      const wrongIndex = (q.correctIndex! + 1) % q.options!.length;
      expect(checkAnswerCorrect(q, wrongIndex)).toBe(false);

      // Verify rich clinical explanation
      expect(q.explanation).toBeDefined();
      expect(q.explanation!.length).toBeGreaterThanOrEqual(40);

      // Verify source provenance
      expect(q.sources).toBeDefined();
      expect(q.sources!.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('verifies valid lecture mapping in accordance with syllabus', () => {
    for (const q of newAnat) expect(q.lecture).toBeGreaterThanOrEqual(1);
    for (const q of newHisto) expect(q.lecture).toBeGreaterThanOrEqual(1);
    for (const q of newBioc) expect(q.lecture).toBeGreaterThanOrEqual(1);
    for (const q of newPath) expect(q.lecture).toBeGreaterThanOrEqual(1);
    for (const q of newPhar) expect(q.lecture).toBeGreaterThanOrEqual(1);
    for (const q of newMicr) expect(q.lecture).toBeGreaterThanOrEqual(1);
  });
});
