import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  ensureDataLoaded,
  ensurePracticalDataLoaded,
  getChaptersForModuleAndMode,
  getModuleQuestionCounts,
} from '../../app/data';

describe('GIT (MGL-3) Practical Question Bank Rebuild & Verification', () => {
  const practicalJsonPath = path.resolve(__dirname, '../../app/data/practical/mgl-3-practical.json');
  const publicDir = path.resolve(__dirname, '../../../public');

  beforeAll(async () => {
    await ensureDataLoaded();
    await ensurePracticalDataLoaded('MGL-3');
  });

  it('mgl-3-practical.json exists on disk and contains exactly 7 chapters totaling 826 questions', () => {
    const raw = fs.readFileSync(practicalJsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(7);

    const chapterCounts = parsed.map((ch: any) => ({
      id: ch.id,
      title: ch.title,
      count: ch.subjects[0].questions.length,
    }));

    expect(chapterCounts).toEqual([
      { id: 301, title: 'Practical — Anatomy', count: 315 },
      { id: 302, title: 'Practical — Histology', count: 183 },
      { id: 303, title: 'Practical — Pathology (Museum Jars)', count: 95 },
      { id: 304, title: 'Practical — Pathology (Microscopic Slides)', count: 50 },
      { id: 305, title: 'Practical — Parasitology', count: 84 },
      { id: 306, title: 'Practical — Microbiology', count: 51 },
      { id: 307, title: 'Practical — Physiology', count: 48 },
    ]);

    const totalQuestions = chapterCounts.reduce((acc: number, c: any) => acc + c.count, 0);
    expect(totalQuestions).toBe(826);
  });

  it('every question adheres to schema: non-empty stem, valid options, correctIndex, explanation, keyConcept', () => {
    const raw = fs.readFileSync(practicalJsonPath, 'utf8');
    const chapters = JSON.parse(raw);

    for (const ch of chapters) {
      for (const subj of ch.subjects) {
        for (const q of subj.questions) {
          expect(q.id).toBeDefined();
          expect(typeof q.id).toBe('string');
          expect(q.text).toBeDefined();
          expect(q.text.trim().length).toBeGreaterThan(0);
          expect(Array.isArray(q.options)).toBe(true);
          expect(q.options.length).toBeGreaterThanOrEqual(2);
          expect(typeof q.correctIndex).toBe('number');
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThan(q.options.length);
          expect(q.explanation).toBeDefined();
          expect(q.explanation.trim().length).toBeGreaterThan(15);
          expect(q.keyConcept).toBeDefined();
          expect(q.keyConcept.trim().length).toBeGreaterThan(10);
        }
      }
    }
  });

  it('all 746 image-based practical questions reference real, existing WebP assets under public/', () => {
    const raw = fs.readFileSync(practicalJsonPath, 'utf8');
    const chapters = JSON.parse(raw);

    let imageCount = 0;
    for (const ch of chapters) {
      for (const subj of ch.subjects) {
        for (const q of subj.questions) {
          if (q.media && q.media.imageUrl) {
            imageCount++;
            const relativePath = q.media.imageUrl.replace(/^\//, '');
            const absolutePath = path.join(publicDir, relativePath);
            expect(
              fs.existsSync(absolutePath),
              `Image file missing on disk: ${absolutePath} (Question: ${q.id})`
            ).toBe(true);
          }
        }
      }
    }
    expect(imageCount).toBe(746);
  });

  it('getModuleQuestionCounts reports practicalCount as exactly 826 for MGL-3', () => {
    const counts = getModuleQuestionCounts('MGL-3');
    expect(counts.practicalCount).toBe(826);
    expect(counts.mcqCount).toBeGreaterThan(5000);
  });

  it('getChaptersForModuleAndMode returns all 7 practical chapters with correct accent colors in practical mode', () => {
    const practicalChaptersList = getChaptersForModuleAndMode('MGL-3', 'practical');
    expect(practicalChaptersList).toHaveLength(7);
    expect(practicalChaptersList[0].title).toBe('Practical — Anatomy');
    expect(practicalChaptersList[0].accentColor).toBe('anatomy');
    expect(practicalChaptersList[1].accentColor).toBe('histology');
    expect(practicalChaptersList[2].accentColor).toBe('pathology');
    expect(practicalChaptersList[3].accentColor).toBe('pathology');
    expect(practicalChaptersList[4].accentColor).toBe('parasitology');
    expect(practicalChaptersList[5].accentColor).toBe('microbiology');
    expect(practicalChaptersList[6].accentColor).toBe('physiology');
  });

  it('getChaptersForModuleAndMode isolates MCQ practice without any practical sections', () => {
    const mcqChapters = getChaptersForModuleAndMode('MGL-3', 'mcq');
    expect(mcqChapters.length).toBeGreaterThan(0);
    for (const ch of mcqChapters) {
      expect(ch.bankSection).not.toBe('practical');
    }
  });
});
