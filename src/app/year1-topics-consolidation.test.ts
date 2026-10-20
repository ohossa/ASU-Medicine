import { describe, expect, it } from 'vitest';
import iae from '../imports/year-1/semester-1/IAE-1.json';
import iphy from '../imports/year-1/semester-1/IPHY-1.json';
import p1 from '../imports/year-1/semester-1/P1-1.json';
import { validateModuleFile } from '../../data-format-v2/scripts/validate-banks';
import { practiceTopics } from './learning/customPractice';

describe('Year 1 Semester 1 Topic Consolidation & Quality Safeguards', () => {
  it('IAE-1 (Anatomy): 56 canonical topics with zero 1-2 question micro-topics', () => {
    expect(validateModuleFile(iae as any)).toEqual([]);
    expect(iae.chapters).toHaveLength(9);
    let totalTopics = 0;
    for (const ch of iae.chapters) {
      const topics = practiceTopics(ch as any, 'IAE-1');
      totalTopics += topics.length;
      for (const t of topics) {
        expect(t.questions.length).toBeGreaterThanOrEqual(5);
      }
    }
    expect(totalTopics).toBe(56);
  });

  it('P1-1 (Professionalism 1): consolidated from 70 micro-topics to 8 balanced topics', () => {
    expect(validateModuleFile(p1 as any)).toEqual([]);
    expect(p1.chapters).toHaveLength(4);
    let totalTopics = 0;
    for (const ch of p1.chapters) {
      const topics = practiceTopics(ch as any, 'P1-1');
      totalTopics += topics.length;
      for (const t of topics) {
        expect(t.questions.length).toBeGreaterThanOrEqual(8);
        expect(t.questions.length).toBeLessThanOrEqual(13);
      }
    }
    expect(totalTopics).toBe(8);
  });

  it('IPHY-1 (Physiology 1): 13 clean, chapter-aligned topics with zero cross-chapter leaks', () => {
    expect(validateModuleFile(iphy as any)).toEqual([]);
    expect(iphy.chapters).toHaveLength(13);
    for (const ch of iphy.chapters) {
      const s = ch.subjects[0];
      expect(s.lectureNames).toHaveLength(1);
      expect(s.lectureNames![0]).toBe(ch.title);
      expect(s.lectureCount).toBe(1);
      const topics = practiceTopics(ch as any, 'IPHY-1');
      expect(topics).toHaveLength(1);
      expect(topics[0].title).toBe(ch.title);
      expect(topics[0].questions.length).toBe(s.questions.length);
      expect(topics[0].questions.length).toBeGreaterThanOrEqual(6);
    }
  });
});
