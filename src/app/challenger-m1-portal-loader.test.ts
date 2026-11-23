import { describe, it, expect } from 'vitest';
import {
  ensureModuleDataLoaded,
  isModuleDataLoaded,
  isModuleActive,
  getModuleQuestionCounts,
  getChaptersForModuleAndMode,
  findQuestionById,
  getLearningQuestionVersions,
  getModuleAcademicYear,
  bankManifest,
} from './data';

describe('Challenger 2 — Adversarial Loader & Boundary Tests for MUG-3', () => {
  it('verifies bankManifest.json matches MUG-3 specifications prior to load', () => {
    const manifestEntry = bankManifest['MUG-3'];
    expect(manifestEntry).toBeDefined();
    expect(manifestEntry.year).toBe(3);
    expect(manifestEntry.semester).toBe(1);
    expect(manifestEntry.totalCount).toBe(2836);
    expect(manifestEntry.mcqCount).toBe(1599);
    expect(manifestEntry.essayCount).toBe(1237);
    expect(manifestEntry.paths).toEqual(['../imports/year-3/semester-1/MUG-3.json']);
    expect(manifestEntry.revision).toBe('e8e37375c3d01f8e26e9c1d97b16f748fd1fc035da368b57720c5b92084918bc');
    expect(manifestEntry.bytes).toBe(3746767);
  });

  it('reports module question counts from manifest when not yet in memory', () => {
    const counts = getModuleQuestionCounts('MUG-3');
    expect(counts.totalCount).toBe(2836);
    expect(counts.mcqCount).toBe(1599);
    expect(counts.essayCount).toBe(1237);
  });

  it('resolves correct academic year for MUG-3', () => {
    expect(getModuleAcademicYear('MUG-3')).toBe(3);
    expect(getModuleAcademicYear('mug-3')).toBe(3);
  });

  it('loads MUG-3 data successfully into memory without error', async () => {
    await ensureModuleDataLoaded('MUG-3');
    expect(isModuleDataLoaded('MUG-3')).toBe(true);
    expect(isModuleActive('MUG-3')).toBe(true);
  });

  it('reports exact question counts in memory matching manifest', () => {
    const counts = getModuleQuestionCounts('MUG-3');
    expect(counts.totalCount).toBe(2836);
    expect(counts.mcqCount).toBe(1599);
    expect(counts.essayCount).toBe(1237);
  });

  it('loads mixed mode chapters with exact chapter counts, schema integrity, and zero truncation', () => {
    const chapters = getChaptersForModuleAndMode('MUG-3', 'mixed');
    
    // Total questions loaded must be exactly 2836 verified questions
    const totalLoaded = chapters.reduce(
      (sum, c) => sum + c.subjects.reduce((s, sub) => s + sub.questions.length, 0),
      0
    );
    expect(totalLoaded).toBe(2836);

    // Verify visiblePracticeChapters behavior (21 visible chapters in mixed mode: 25 total - 4 empty chapters: 107, 108, 204, 208)
    expect(chapters.length).toBe(21);

    for (const chapter of chapters.filter(ch => ch.id >= 101 && ch.id <= 208)) {
      expect(chapter.examPeriod, chapter.title).toBe(chapter.id < 200 ? 'ca-1' : 'ca-2');
    }

    // Verify Chapter 301
    const ch301 = chapters.find((c) => c.id === 301);
    expect(ch301).toBeDefined();
    expect(ch301!.title).toBe('Past Final Papers & Essays');
    expect(ch301!.bankSection).toBe('past-exams');

    const c301Count = ch301!.subjects.reduce((s, sub) => s + sub.questions.length, 0);
    expect(c301Count).toBe(495);

    // Verify Practice chapters with verified content
    const ch1 = chapters.find((c) => c.id === 1);
    expect(ch1).toBeDefined();
    expect(ch1!.subjects[0].questions.length).toBe(674);

    const ch2 = chapters.find((c) => c.id === 2);
    expect(ch2).toBeDefined();
    expect(ch2!.subjects[0].questions.length).toBe(438);

    const ch3 = chapters.find((c) => c.id === 3);
    expect(ch3).toBeDefined();
    expect(ch3!.subjects[0].questions.length).toBe(418);
  });

  it('loads MCQ mode with exact question counts (1599 questions)', () => {
    const chapters = getChaptersForModuleAndMode('MUG-3', 'mcq');
    const totalMcq = chapters.reduce(
      (sum, c) => sum + c.subjects.reduce((s, sub) => s + sub.questions.length, 0),
      0
    );
    expect(totalMcq).toBe(1599);

    for (const c of chapters) {
      for (const s of c.subjects) {
        for (const q of s.questions) {
          expect(['essay', 'case', 'casestudy']).not.toContain(q.type);
        }
      }
    }
  });

  it('loads Essay mode with exact question counts (1237 questions)', () => {
    const chapters = getChaptersForModuleAndMode('MUG-3', 'essay');
    const totalEssay = chapters.reduce(
      (sum, c) => sum + c.subjects.reduce((s, sub) => s + sub.questions.length, 0),
      0
    );
    expect(totalEssay).toBe(1237);

    for (const c of chapters) {
      for (const s of c.subjects) {
        for (const q of s.questions) {
          expect(['essay', 'case', 'casestudy']).toContain(q.type);
        }
      }
    }
  });

  it('correctly retrieves verified questions via findQuestionById with chapter and subject bindings', () => {
    const q1 = findQuestionById('MUG3-CH1-ANAT-0002');
    expect(q1).toBeDefined();
    expect(q1!.chapter.id).toBe(1);
    expect(q1!.subjectName).toBe('Anatomy & Embryology');

    const q2 = findQuestionById('MUG3-CH2-HIST-0001');
    expect(q2).toBeDefined();
    expect(q2!.chapter.id).toBe(2);
    expect(q2!.subjectName).toBe('Histology');

    const q3 = findQuestionById('MUG3-CH301-ANAT-0014');
    expect(q3).toBeDefined();
    expect(q3!.chapter.id).toBe(301);

    // Non-existent ID returns null
    expect(findQuestionById('NON_EXISTENT_ID_9999')).toBeNull();
  });

  it('resolves learning question versions for Chapter 1 and Chapter 301 without failure', async () => {
    const ch1Versions = await getLearningQuestionVersions('MUG-3', 1);
    expect(ch1Versions).toBeInstanceOf(Map);
    expect(ch1Versions.size).toBe(674);
    expect(ch1Versions.has('MUG3-CH1-ANAT-0002')).toBe(true);

    const ch301Versions = await getLearningQuestionVersions('MUG-3', 301);
    expect(ch301Versions).toBeInstanceOf(Map);
    expect(ch301Versions.size).toBe(495);
    expect(ch301Versions.has('MUG3-CH301-ANAT-0014')).toBe(true);
  });
});
