import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getChaptersForModuleAndMode, getModuleQuestionCounts } from '../../app/data';

describe('GIT (MGL-3) Practical Exam Bank & Engine Integration', () => {
  const practicalChapters = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../app/data/practical/mgl-3-practical.json'), 'utf8')
  );

  it('contains the 8 designated practical chapters with IDs 301 to 308', () => {
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
  });

  it('every practical question has an imageUrl and points to an existing WebP asset', () => {
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

    expect(questionCount).toBe(29);
  });

  it('distributes correct answer indices (A, B, C, D) evenly without answer cueing bias', () => {
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

    // Verify balance across A (0), B (1), C (2), D (3): each letter should have 7-8 occurrences
    expect(counts[0]).toBeGreaterThanOrEqual(6);
    expect(counts[1]).toBeGreaterThanOrEqual(6);
    expect(counts[2]).toBeGreaterThanOrEqual(6);
    expect(counts[3]).toBeGreaterThanOrEqual(6);
  });

  it('getModuleQuestionCounts reports practicalCount accurately', () => {
    const counts = getModuleQuestionCounts('MGL-3');
    expect(counts.practicalCount).toBe(29);
    expect(counts.totalCount).toBeGreaterThan(6000);
  });

  it('getChaptersForModuleAndMode isolates practical chapters from normal MCQ practice', () => {
    const practicalChapters = getChaptersForModuleAndMode('MGL-3', 'practical');
    expect(practicalChapters).toHaveLength(8);
    for (const ch of practicalChapters) {
      expect(ch.bankSection).toBe('practical');
    }

    const mcqChapters = getChaptersForModuleAndMode('MGL-3', 'mcq');
    for (const ch of mcqChapters) {
      expect(ch.bankSection).not.toBe('practical');
    }
  });
});
