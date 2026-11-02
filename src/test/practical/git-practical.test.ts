import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getChaptersForModuleAndMode, getModuleQuestionCounts } from '../../app/data';

describe('GIT (MGL-3) Practical Exam Bank & Engine Integration', () => {
  const practicalChapters = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../app/data/practical/mgl-3-practical.json'), 'utf8')
  );

  it('contains the 8 designated practical chapters with IDs 301 to 308 and exact question counts', () => {
    expect(practicalChapters).toHaveLength(8);

    const ids = practicalChapters.map((c: any) => c.id);
    expect(ids).toEqual([301, 302, 303, 304, 305, 306, 307, 308]);

    const titles = practicalChapters.map((c: any) => c.title);
    expect(titles).toContain('Practical — Histology');
    expect(titles).toContain('Practical — Pathology');
    expect(titles).toContain('Practical — Parasitology');
    expect(titles).toContain('Practical — Anatomy');
    expect(titles).toContain('Practical — Physiology');
    expect(titles).toContain('Practical — Biochemistry');
    expect(titles).toContain('Practical — Microbiology');
    expect(titles).toContain('Practical — Clinical');

    const expectedCountsByChapter: Record<number, number> = {
      301: 28, // Histology
      302: 6,  // Pathology
      303: 41, // Parasitology
      304: 37, // Anatomy
      305: 2,  // Physiology
      306: 2,  // Biochemistry
      307: 2,  // Microbiology
      308: 2   // Clinical
    };

    for (const ch of practicalChapters) {
      const qCount = ch.subjects.reduce((sum: number, s: any) => sum + s.questions.length, 0);
      expect(qCount, `Chapter ${ch.id} (${ch.title}) count mismatch`).toBe(expectedCountsByChapter[ch.id]);
    }
  });

  it('every practical question has an imageUrl and points to an existing WebP asset > 1KB on disk', () => {
    let questionCount = 0;

    for (const chapter of practicalChapters) {
      for (const subject of chapter.subjects) {
        for (const q of subject.questions) {
          questionCount++;
          expect(q.media?.imageUrl, `Question ${q.id} missing media.imageUrl`).toBeDefined();

          // Verify image exists on disk in public folder
          const diskPath = path.resolve(__dirname, '../../../public', q.media.imageUrl.replace(/^\//, ''));
          expect(fs.existsSync(diskPath), `Asset file not found on disk: ${diskPath}`).toBe(true);

          const stat = fs.statSync(diskPath);
          expect(stat.size, `Asset file is empty: ${diskPath}`).toBeGreaterThan(1000);
        }
      }
    }

    expect(questionCount).toBe(120);
  });

  it('distributes correct answer indices (A, B, C, D) with exact 25% balance (30 each) without cueing bias', () => {
    const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };

    for (const chapter of practicalChapters) {
      for (const subject of chapter.subjects) {
        for (const q of subject.questions) {
          expect(q.options).toHaveLength(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
          counts[q.correctIndex]++;
        }
      }
    }

    // Verify perfect balance: exactly 30 of each choice (A, B, C, D)
    expect(counts[0]).toBe(30);
    expect(counts[1]).toBe(30);
    expect(counts[2]).toBe(30);
    expect(counts[3]).toBe(30);
  });

  it('includes explicit Criteria of Identification in all Parasitology questions', () => {
    const paraChapter = practicalChapters.find((c: any) => c.id === 303);
    expect(paraChapter).toBeDefined();

    for (const q of paraChapter.subjects[0].questions) {
      expect(q.explanation).toMatch(/Criteria of Identification/i);
    }
  });

  it('getModuleQuestionCounts reports practicalCount accurately as 120', () => {
    const counts = getModuleQuestionCounts('MGL-3');
    expect(counts.practicalCount).toBe(120);
    expect(counts.totalCount).toBeGreaterThan(6000);
  });

  it('getChaptersForModuleAndMode isolates practical chapters from normal MCQ practice', () => {
    const practicalChaptersList = getChaptersForModuleAndMode('MGL-3', 'practical');
    expect(practicalChaptersList).toHaveLength(8);
    for (const ch of practicalChaptersList) {
      expect(ch.bankSection).toBe('practical');
    }

    const mcqChapters = getChaptersForModuleAndMode('MGL-3', 'mcq');
    for (const ch of mcqChapters) {
      expect(ch.bankSection).not.toBe('practical');
    }
  });
});
