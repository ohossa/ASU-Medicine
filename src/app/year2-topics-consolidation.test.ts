import { describe, it, expect } from 'vitest';
import mcvsBank from '../imports/year-2/semester-1/MCVS-2.json';
import mrsBank from '../imports/year-2/semester-1/MRS-2.json';
import memBank from '../imports/year-2/semester-2/MEM-2.json';
import { practiceTopics } from './learning/customPractice';
import { subjectBranches } from './learning/practiceNavigation';
import type { ChapterData } from './types';

describe('Year 2 Systems Banks Topic Consolidation & Navigation Hierarchy', () => {
  describe('MCVS-2 (Cardiovascular System 2)', () => {
    it('preserves all 1,633 questions across all 11 chapters without loss', () => {
      const total = mcvsBank.chapters.reduce(
        (sum, ch) => sum + ch.subjects.reduce((sSum, s) => sSum + s.questions.length, 0),
        0
      );
      expect(total).toBe(1633);
      expect(mcvsBank.chapters).toHaveLength(11);
    });

    it('defines canonical lectureNames for all subjects with 0 ghost topics and 0 micro-topics', () => {
      let totalTopics = 0;
      for (const ch of mcvsBank.chapters) {
        for (const sub of ch.subjects) {
          expect(sub.lectureNames).toBeDefined();
          expect(Array.isArray(sub.lectureNames)).toBe(true);
          expect(sub.lectureNames.length).toBeGreaterThan(0);
          expect(sub.lectureCount).toBe(sub.lectureNames.length);

          const counts: Record<number, number> = {};
          for (let i = 1; i <= sub.lectureNames.length; i++) {
            counts[i] = 0;
          }

          for (const q of sub.questions) {
            expect(typeof q.lecture).toBe('number');
            expect(q.lecture).toBeGreaterThanOrEqual(1);
            expect(q.lecture).toBeLessThanOrEqual(sub.lectureNames.length);
            counts[q.lecture]++;
          }

          for (let i = 1; i <= sub.lectureNames.length; i++) {
            totalTopics++;
            expect(counts[i], `MCVS-2 Ch ${ch.id} ${sub.name} Topic ${i} has 0 questions`).toBeGreaterThan(0);
          }
        }
      }
      expect(totalTopics).toBe(44);
    });

    it('generates multi-subject branches for integrated chapters in practiceNavigation', () => {
      // Chapter 4 (Electrical Activity) has Physiology and Pharmacology
      const ch4 = mcvsBank.chapters[3] as unknown as ChapterData;
      const branches = subjectBranches(ch4, 'MCVS-2');
      expect(branches.length).toBe(2);
      expect(branches.map((b: { title: string }) => b.title)).toEqual(['Physiology', 'Pharmacology']);
    });
  });

  describe('MRS-2 (Respiratory System 2)', () => {
    it('preserves all 2,353 questions across all 3 chapters with comingSoon disabled', () => {
      const total = mrsBank.chapters.reduce(
        (sum, ch) => sum + ch.subjects.reduce((sSum, s) => sSum + s.questions.length, 0),
        0
      );
      expect(total).toBe(2353);
      expect(mrsBank.chapters).toHaveLength(3);
      expect(mrsBank.comingSoon).toBe(false);
    });

    it('defines canonical lectureNames across Anatomy, Histology, Physiology, Biochem, Path, Pharma, Micro, Parasitology', () => {
      let totalTopics = 0;
      for (const ch of mrsBank.chapters) {
        for (const sub of ch.subjects) {
          expect(sub.lectureNames).toBeDefined();
          expect(Array.isArray(sub.lectureNames)).toBe(true);
          expect(sub.lectureNames.length).toBeGreaterThan(0);

          const counts: Record<number, number> = {};
          for (let i = 1; i <= sub.lectureNames.length; i++) {
            counts[i] = 0;
          }

          for (const q of sub.questions) {
            expect(typeof q.lecture).toBe('number');
            expect(q.lecture).toBeGreaterThanOrEqual(1);
            expect(q.lecture).toBeLessThanOrEqual(sub.lectureNames.length);
            counts[q.lecture]++;
          }

          for (let i = 1; i <= sub.lectureNames.length; i++) {
            totalTopics++;
            expect(counts[i], `MRS-2 Ch ${ch.id} ${sub.name} Topic ${i} has 0 questions`).toBeGreaterThan(0);
          }
        }
      }
      expect(totalTopics).toBe(27);
    });

    it('verifies practiceTopics produces topic batches with valid question arrays', () => {
      const ch1 = mrsBank.chapters[0] as unknown as ChapterData;
      const topics = practiceTopics(ch1, 'MRS-2');
      expect(topics.length).toBe(7); // 4 Anatomy + 3 Histology
      for (const t of topics) {
        expect(t.questions.length).toBeGreaterThan(0);
      }
    });
  });

  describe('MEM-2 (Endocrine System & Metabolism 2)', () => {
    it('preserves all 840 questions across all 5 endocrine chapters', () => {
      const total = memBank.chapters.reduce(
        (sum, ch) => sum + ch.subjects.reduce((sSum, s) => sSum + s.questions.length, 0),
        0
      );
      expect(total).toBe(840);
      expect(memBank.chapters).toHaveLength(5);
    });

    it('defines canonical lectureNames for all endocrine organs with 0 ghost topics', () => {
      let totalTopics = 0;
      for (const ch of memBank.chapters) {
        for (const sub of ch.subjects) {
          expect(sub.lectureNames).toBeDefined();
          expect(Array.isArray(sub.lectureNames)).toBe(true);
          expect(sub.lectureNames.length).toBeGreaterThan(0);

          const counts: Record<number, number> = {};
          for (let i = 1; i <= sub.lectureNames.length; i++) {
            counts[i] = 0;
          }

          for (const q of sub.questions) {
            expect(typeof q.lecture).toBe('number');
            expect(q.lecture).toBeGreaterThanOrEqual(1);
            expect(q.lecture).toBeLessThanOrEqual(sub.lectureNames.length);
            counts[q.lecture]++;
          }

          for (let i = 1; i <= sub.lectureNames.length; i++) {
            totalTopics++;
            expect(counts[i], `MEM-2 Ch ${ch.id} ${sub.name} Topic ${i} has 0 questions`).toBeGreaterThan(0);
          }
        }
      }
      expect(totalTopics).toBe(34);
    });

    it('allows multi-subject navigation in pituitary, thyroid, and adrenal chapters', () => {
      const ch1 = memBank.chapters[0] as unknown as ChapterData;
      const branches = subjectBranches(ch1, 'MEM-2');
      expect(branches.length).toBeGreaterThan(1);
      const branchTitles = branches.map((b: { title: string }) => b.title);
      expect(branchTitles).toContain('Histology');
      expect(branchTitles).toContain('Physiology');
      expect(branchTitles).toContain('Biochemistry');
    });
  });
});
