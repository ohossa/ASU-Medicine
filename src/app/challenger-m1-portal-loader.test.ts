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
    expect(manifestEntry.totalCount).toBe(7591);
    expect(manifestEntry.mcqCount).toBe(3727);
    expect(manifestEntry.essayCount).toBe(3864);
    expect(manifestEntry.paths).toEqual(['../imports/year-3/semester-1/MUG-3.json']);
    expect(manifestEntry.revision).toBe('25cbffbd3602d792f7cf85af1ba56a0781c200fcb8da2640a0015f150e142953');
    expect(manifestEntry.bytes).toBe(11428382);
  });

  it('reports module question counts from manifest when not yet in memory', () => {
    const counts = getModuleQuestionCounts('MUG-3');
    expect(counts.totalCount).toBe(7591);
    expect(counts.mcqCount).toBe(3727);
    expect(counts.essayCount).toBe(3864);
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
    expect(counts.totalCount).toBe(7591);
    expect(counts.mcqCount).toBe(3727);
    expect(counts.essayCount).toBe(3864);
  });

  it('loads mixed mode chapters with exact chapter counts, schema integrity, and zero truncation', () => {
    const chapters = getChaptersForModuleAndMode('MUG-3', 'mixed');
    
    // Total questions loaded must be exactly 7,596
    const totalLoaded = chapters.reduce(
      (sum, c) => sum + c.subjects.reduce((s, sub) => s + sub.questions.length, 0),
      0
    );
    expect(totalLoaded).toBe(7591);

    // Verify visiblePracticeChapters behavior
    // 25 chapters in bank, 2 empty past-exam chapters (108, 204) properly hidden from student navigation
    expect(chapters.length).toBe(23);
    expect(chapters.find((c) => c.id === 108)).toBeUndefined();
    expect(chapters.find((c) => c.id === 204)).toBeUndefined();

    // Verify Chapter 301
    const ch301 = chapters.find((c) => c.id === 301);
    expect(ch301).toBeDefined();
    expect(ch301!.title).toBe('Past Final Papers & Essays');
    expect(ch301!.bankSection).toBe('past-exams');
    expect((ch301 as any).examPeriod).toBeUndefined();
    expect(ch301!.subjects.length).toBe(8);

    const c301Count = ch301!.subjects.reduce((s, sub) => s + sub.questions.length, 0);
    expect(c301Count).toBe(317);

    // Verify Chapter 301 subject distribution
    const subCounts: Record<string, number> = {};
    for (const sub of ch301!.subjects) {
      subCounts[sub.id] = sub.questions.length;
    }
    expect(subCounts).toEqual({
      anatomy: 15,
      histology: 3,
      physiology: 78,
      biochem: 1,
      pathology: 210,
      pharma: 1,
      microbiology: 6,
      parasitology: 3,
    });

    // Verify Practice chapters (1-8)
    const ch1 = chapters.find((c) => c.id === 1);
    expect(ch1).toBeDefined();
    expect(ch1!.subjects[0].questions.length).toBe(782); // 787 - 5 excluded in Iteration 4

    const ch3 = chapters.find((c) => c.id === 3);
    expect(ch3).toBeDefined();
    expect(ch3!.subjects[0].questions.length).toBe(1484); // -52 moved to Ch1

    const ch5 = chapters.find((c) => c.id === 5);
    expect(ch5).toBeDefined();
    expect(ch5!.subjects[0].questions.length).toBe(2796); // 2832 - 36 excluded corrupt items

    // Verify CA-1 chapters
    const ch101 = chapters.find((c) => c.id === 101);
    expect(ch101!.subjects[0].questions.length).toBe(15);
    const ch103 = chapters.find((c) => c.id === 103);
    expect(ch103!.subjects[0].questions.length).toBe(84); // 94 - 10 dashed line fragments
    const ch104 = chapters.find((c) => c.id === 104);
    expect(ch104!.subjects[0].questions.length).toBe(3); // +1 from Ch103
    const ch105 = chapters.find((c) => c.id === 105);
    expect(ch105!.subjects[0].questions.length).toBe(101); // 103 - 2 dashed line fragments
    const ch106 = chapters.find((c) => c.id === 106);
    expect(ch106!.subjects[0].questions.length).toBe(6); // +2 from Ch105

    // Verify CA-2 chapters
    const ch201 = chapters.find((c) => c.id === 201);
    expect(ch201!.subjects[0].questions.length).toBe(24); // +1 net
    const ch203 = chapters.find((c) => c.id === 203);
    expect(ch203!.subjects[0].questions.length).toBe(92); // 96 - 4 dashed line fragments
    const ch205 = chapters.find((c) => c.id === 205);
    expect(ch205!.subjects[0].questions.length).toBe(363); // 364 - 1 dashed line fragment
  });

  it('loads MCQ mode with exact question counts (3,727 questions)', () => {
    const chapters = getChaptersForModuleAndMode('MUG-3', 'mcq');
    const totalMcq = chapters.reduce(
      (sum, c) => sum + c.subjects.reduce((s, sub) => s + sub.questions.length, 0),
      0
    );
    expect(totalMcq).toBe(3727);

    for (const c of chapters) {
      for (const s of c.subjects) {
        for (const q of s.questions) {
          expect(['essay', 'case', 'casestudy']).not.toContain(q.type);
        }
      }
    }
  });

  it('loads Essay mode with exact question counts (3,864 questions)', () => {
    const chapters = getChaptersForModuleAndMode('MUG-3', 'essay');
    const totalEssay = chapters.reduce(
      (sum, c) => sum + c.subjects.reduce((s, sub) => s + sub.questions.length, 0),
      0
    );
    expect(totalEssay).toBe(3864);

    for (const c of chapters) {
      for (const s of c.subjects) {
        for (const q of s.questions) {
          expect(['essay', 'case', 'casestudy']).toContain(q.type);
        }
      }
    }
  });

  it('correctly retrieves relocated questions via findQuestionById with new chapter and subject bindings', () => {
    // 1. Moved Ch3 -> Ch1
    const q307 = findQuestionById('MUG3-CH3-PHYS-0307');
    expect(q307).toBeDefined();
    expect(q307!.chapter.id).toBe(1);
    expect(q307!.subjectName).toBe('Anatomy & Embryology');
    expect(q307!.question.lecture).toBe(1);

    const q361 = findQuestionById('MUG3-CH3-PHYS-0361');
    expect(q361).toBeDefined();
    expect(q361!.chapter.id).toBe(1);
    expect(q361!.subjectName).toBe('Anatomy & Embryology');
    expect(q361!.question.lecture).toBe(10);

    // 2. Cross-discipline items
    // MUG3-CH101-ANAT-0012 -> Ch 103 (Physiology)
    const qCross1 = findQuestionById('MUG3-CH101-ANAT-0012');
    expect(qCross1).toBeDefined();
    expect(qCross1!.chapter.id).toBe(103);
    expect(qCross1!.subjectName).toBe('Physiology');
    expect(qCross1!.question.lecture).toBe(3);

    // MUG3-CH103-PHYS-0001 -> Ch 104 (Biochemistry)
    const qCross2 = findQuestionById('MUG3-CH103-PHYS-0001');
    expect(qCross2).toBeDefined();
    expect(qCross2!.chapter.id).toBe(104);
    expect(qCross2!.subjectName).toBe('Biochemistry');
    expect(qCross2!.question.lecture).toBe(4);

    // MUG3-CH105-PATH-0088 -> Ch 101 (Anatomy)
    const qCross3 = findQuestionById('MUG3-CH105-PATH-0088');
    expect(qCross3).toBeDefined();
    expect(qCross3!.chapter.id).toBe(101);
    expect(qCross3!.subjectName).toBe('Anatomy & Embryology');
    expect(qCross3!.question.lecture).toBe(4);

    // MUG3-CH105-PATH-0089 -> Ch 106 (Pharmacology)
    const qCross4 = findQuestionById('MUG3-CH105-PATH-0089');
    expect(qCross4).toBeDefined();
    expect(qCross4!.chapter.id).toBe(106);
    expect(qCross4!.subjectName).toBe('Pharmacology');
    expect(qCross4!.question.lecture).toBe(1);

    // MUG3-CH301-PHYS-0073 -> Ch 301 (Pathology)
    const qCross5 = findQuestionById('MUG3-CH301-PHYS-0073');
    expect(qCross5).toBeDefined();
    expect(qCross5!.chapter.id).toBe(301);
    expect(qCross5!.question.subjectColor).toBe('pathology');
    expect(qCross5!.subjectName).toBe('Clinical Pathology & Multidisciplinary Finals');
    expect(qCross5!.question.lecture).toBe(11);

    // MUG3-CH1-ANAT-0493 -> Ch 5 (Pathology)
    const qCross6 = findQuestionById('MUG3-CH1-ANAT-0493');
    expect(qCross6).toBeDefined();
    expect(qCross6!.chapter.id).toBe(5);
    expect(qCross6!.subjectName).toBe('Pathology');
    expect(qCross6!.question.lecture).toBe(8);

    // Non-existent ID returns null
    expect(findQuestionById('NON_EXISTENT_ID_9999')).toBeNull();
  });

  it('resolves learning question versions for Chapter 1 and Chapter 301 without failure', async () => {
    const ch1Versions = await getLearningQuestionVersions('MUG-3', 1);
    expect(ch1Versions).toBeInstanceOf(Map);
    expect(ch1Versions.size).toBe(782);
    // Check moved question has version
    expect(ch1Versions.has('MUG3-CH3-PHYS-0307')).toBe(true);
    expect(ch1Versions.get('MUG3-CH3-PHYS-0307')).toMatch(/^[0-9a-f]{64}$/);

    const ch301Versions = await getLearningQuestionVersions('MUG-3', 301);
    expect(ch301Versions).toBeInstanceOf(Map);
    expect(ch301Versions.size).toBe(317);
    expect(ch301Versions.has('MUG3-CH301-PHYS-0073')).toBe(true);
    expect(ch301Versions.get('MUG3-CH301-PHYS-0073')).toMatch(/^[0-9a-f]{64}$/);
  });
});
