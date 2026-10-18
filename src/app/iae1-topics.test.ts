import { describe, expect, it } from 'vitest';
import bank from '../imports/year-1/semester-1/IAE-1.json';
import { validateModuleFile } from '../../data-format-v2/scripts/validate-banks';
import { practiceTopics } from './learning/customPractice';

describe('Year 1 Anatomy (IAE-1) topic consolidation', () => {
  it('passes the canonical bank validator with zero errors', () => {
    expect(validateModuleFile(bank as any)).toEqual([]);
  });

  it('contains exactly 1,013 questions across 9 chapters', () => {
    expect(bank.chapters).toHaveLength(9);
    const totalQuestions = bank.chapters.reduce(
      (sum, ch) => sum + ch.subjects.reduce((sSum, s) => sSum + s.questions.length, 0),
      0
    );
    expect(totalQuestions).toBe(1013);
  });

  it('eliminates 1-2 question micro-topics: every topic has at least 5 questions', () => {
    let totalTopics = 0;
    for (const ch of bank.chapters) {
      const subject = ch.subjects[0];
      const lectureNames = subject.lectureNames ?? [];
      expect(lectureNames.length).toBeGreaterThanOrEqual(4);
      expect(lectureNames.length).toBeLessThanOrEqual(8);
      expect(subject.lectureCount).toBe(lectureNames.length);

      const topics = practiceTopics(ch as any, 'IAE-1');
      expect(topics).toHaveLength(lectureNames.length);
      totalTopics += topics.length;

      for (const topic of topics) {
        expect(topic.questions.length).toBeGreaterThanOrEqual(5);
      }
    }
    // Total consolidated topics across the 9 chapters
    expect(totalTopics).toBe(56);
  });

  it('ensures each question has a valid lecture index and contentVersion', () => {
    for (const ch of bank.chapters) {
      const subject = ch.subjects[0];
      const maxLecture = subject.lectureNames!.length;

      for (const q of subject.questions) {
        expect(Number.isInteger(q.lecture)).toBe(true);
        expect(q.lecture).toBeGreaterThanOrEqual(1);
        expect(q.lecture).toBeLessThanOrEqual(maxLecture);
        expect(q.contentVersion).toMatch(/^[a-f0-9]{64}$/);
      }
    }
  });
});
