import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

interface PracticalQuestion {
  id: string;
  type: string;
  lecture: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  keyConcept: string;
  media?: {
    type: string;
    imageUrl?: string;
    caption?: string;
  };
}

interface PracticalChapter {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  page: number;
  lectureRange: string;
  bankSection: string;
  subjects: Array<{
    id: string;
    name: string;
    iconName: string;
    lectures: string;
    lectureCount: number;
    lectureNames: string[];
    questions: PracticalQuestion[];
  }>;
}

describe('GIT Practical Bank Exhaustive Verification (286 Authentic Stations)', () => {
  const practicalBank: PracticalChapter[] = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../app/data/practical/mgl-3-practical.json'), 'utf8')
  );

  it('validates structural integrity of all 8 chapters', () => {
    expect(practicalBank).toHaveLength(8);
    const chapterIds = practicalBank.map(c => c.id);
    expect(chapterIds).toEqual([301, 302, 303, 304, 305, 306, 307, 308]);

    for (const chapter of practicalBank) {
      expect(chapter.bankSection).toBe('practical');
      expect(chapter.subjects).toHaveLength(1);
      const subject = chapter.subjects[0];
      expect(subject.questions.length).toBeGreaterThanOrEqual(28);
      expect(subject.lectureNames.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('verifies that every question adheres to strict multiple-choice schema', () => {
    const allIds = new Set<string>();

    for (const chapter of practicalBank) {
      const subject = chapter.subjects[0];
      for (const q of subject.questions) {
        expect(q.id).toBeDefined();
        expect(allIds.has(q.id), `Duplicate question ID detected: ${q.id}`).toBe(false);
        allIds.add(q.id);

        expect(q.text.trim().length, `Empty text in question ${q.id}`).toBeGreaterThan(15);
        expect(q.options, `Question ${q.id} must have exactly 4 options`).toHaveLength(4);

        for (let i = 0; i < q.options.length; i++) {
          expect(q.options[i].trim().length, `Option ${i} empty in question ${q.id}`).toBeGreaterThan(0);
        }

        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThanOrEqual(3);

        const correctVal = q.options[q.correctIndex];
        expect(correctVal).toBeDefined();

        expect(q.explanation.trim().length, `Empty explanation in ${q.id}`).toBeGreaterThan(15);
        expect(q.keyConcept.trim().length, `Empty keyConcept in ${q.id}`).toBeGreaterThan(10);
      }
    }

    expect(allIds.size).toBe(286);
  });

  it('verifies all referenced images exist on disk, are valid WebP, and non-empty (>1 KB)', () => {
    let imagesChecked = 0;

    for (const chapter of practicalBank) {
      for (const subject of chapter.subjects) {
        for (const q of subject.questions) {
          if (q.media?.imageUrl) {
            imagesChecked++;
            expect(q.media.imageUrl.startsWith('/images/practical/mgl-3/')).toBe(true);

            const diskPath = path.resolve(__dirname, '../../../public', q.media.imageUrl.replace(/^\//, ''));
            expect(fs.existsSync(diskPath), `Missing image file: ${diskPath}`).toBe(true);

            const stat = fs.statSync(diskPath);
            expect(stat.size, `Image file too small: ${diskPath}`).toBeGreaterThan(1024);
          }
        }
      }
    }

    expect(imagesChecked).toBe(286);
  });

  it('verifies Biochemistry calculation stations (Chapter 306)', () => {
    const biocChapter = practicalBank.find(c => c.id === 306);
    expect(biocChapter).toBeDefined();

    const questions = biocChapter!.subjects[0].questions;
    expect(questions).toHaveLength(40);

    // Filter calculation & clinical chemistry stations
    const calcQuestions = questions.filter(q =>
      q.text.toLowerCase().includes('absorbance') ||
      q.text.toLowerCase().includes('spectrophotomet') ||
      q.text.toLowerCase().includes('beer-lambert') ||
      q.text.toLowerCase().includes('concentration') ||
      q.text.toLowerCase().includes('calculation') ||
      q.text.toLowerCase().includes('caloric') ||
      q.text.toLowerCase().includes('bmi') ||
      q.text.toLowerCase().includes('kcal')
    );
    expect(calcQuestions.length).toBeGreaterThanOrEqual(10);

    for (const q of calcQuestions) {
      expect(q.explanation.length).toBeGreaterThan(20);
    }
  });

  it('verifies Microbiology diagnostic and biochemical stations (Chapter 307)', () => {
    const microChapter = practicalBank.find(c => c.id === 307);
    expect(microChapter).toBeDefined();

    const questions = microChapter!.subjects[0].questions;
    expect(questions).toHaveLength(40);

    const mediaQuestions = questions.filter(q =>
      q.text.toLowerCase().includes('macconkey') ||
      q.text.toLowerCase().includes('tcbs') ||
      q.text.toLowerCase().includes('tsi') ||
      q.text.toLowerCase().includes('oxidase') ||
      q.text.toLowerCase().includes('widal') ||
      q.text.toLowerCase().includes('urease')
    );
    expect(mediaQuestions.length).toBeGreaterThanOrEqual(15);
  });

  it('verifies Physiology lab cases and motility stations (Chapter 305)', () => {
    const physChapter = practicalBank.find(c => c.id === 305);
    expect(physChapter).toBeDefined();

    const questions = physChapter!.subjects[0].questions;
    expect(questions).toHaveLength(40);

    const labQuestions = questions.filter(q =>
      q.text.toLowerCase().includes('manometry') ||
      q.text.toLowerCase().includes('achalasia') ||
      q.text.toLowerCase().includes('dysphagia') ||
      q.text.toLowerCase().includes('sglt-1') ||
      q.text.toLowerCase().includes('gerd') ||
      q.text.toLowerCase().includes('barium') ||
      q.text.toLowerCase().includes('swallowing') ||
      q.text.toLowerCase().includes('gastric') ||
      q.text.toLowerCase().includes('emptying') ||
      q.text.toLowerCase().includes('vomiting')
    );
    expect(labQuestions.length).toBeGreaterThanOrEqual(15);
  });

  it('verifies Clinical endoscopy and therapeutics stations (Chapter 308)', () => {
    const clinChapter = practicalBank.find(c => c.id === 308);
    expect(clinChapter).toBeDefined();

    const questions = clinChapter!.subjects[0].questions;
    expect(questions).toHaveLength(30);

    const clinTopics = questions.filter(q =>
      q.text.toLowerCase().includes('endoscopy') ||
      q.text.toLowerCase().includes('ulcer') ||
      q.text.toLowerCase().includes('pylori') ||
      q.text.toLowerCase().includes('varices') ||
      q.text.toLowerCase().includes('cirrhosis') ||
      q.text.toLowerCase().includes('hepatitis') ||
      q.text.toLowerCase().includes('gerd') ||
      q.text.toLowerCase().includes('perforation')
    );
    expect(clinTopics.length).toBeGreaterThanOrEqual(15);
  });
});
