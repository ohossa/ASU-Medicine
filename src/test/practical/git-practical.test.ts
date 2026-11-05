import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ensureDataLoaded, getChaptersForModuleAndMode, getModuleQuestionCounts } from '../../app/data';

describe('GIT (MGL-3) Practical Question Removal Verification', () => {
  const practicalJsonPath = path.resolve(__dirname, '../../app/data/practical/mgl-3-practical.json');

  beforeAll(async () => {
    await ensureDataLoaded();
  });

  it('mgl-3-practical.json exists as an empty array with 0 stations', () => {
    const raw = fs.readFileSync(practicalJsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(0);
  });

  it('getModuleQuestionCounts reports practicalCount as falsy/0 for MGL-3', () => {
    const counts = getModuleQuestionCounts('MGL-3');
    expect(counts.practicalCount ?? 0).toBe(0);
    expect(counts.mcqCount).toBeGreaterThan(5000);
  });

  it('getChaptersForModuleAndMode returns empty list for MGL-3 practical mode', () => {
    const practicalChaptersList = getChaptersForModuleAndMode('MGL-3', 'practical');
    expect(practicalChaptersList).toEqual([]);
  });

  it('getChaptersForModuleAndMode isolates MCQ practice without any practical sections', () => {
    const mcqChapters = getChaptersForModuleAndMode('MGL-3', 'mcq');
    expect(mcqChapters.length).toBeGreaterThan(0);
    for (const ch of mcqChapters) {
      expect(ch.bankSection).not.toBe('practical');
    }
  });
});
