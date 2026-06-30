import { describe, it, expect, beforeAll } from 'vitest';
import { ensureDataLoaded, getChaptersForModuleAndMode, getModuleQuestionCounts } from './data';

describe('Special Senses (MSS-2) subject-centric database validation', () => {
  beforeAll(async () => {
    await ensureDataLoaded();
  });

  it('verifies that the module is active and loaded with questions', () => {
    const counts = getModuleQuestionCounts('MSS-2');
    expect(counts.totalCount).toBeGreaterThan(0);
    expect(counts.essayCount).toBeGreaterThan(0);
    expect(counts.mcqCount).toBeGreaterThan(0);
  });

  it('contains exactly 9 chapters (8 subject-centric + 1 Past Exams)', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    expect(chapters.length).toBe(9);
  });

  it('chapter 1 is Anatomy with correct metadata and 17 lectures', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    const ch = chapters[0];
    expect(ch.id).toBe(1);
    expect(ch.title).toBe('Anatomy');
    expect(ch.emoji).toBe('🦴');
    expect(ch.page).toBe(4);
    expect(ch.subjects.length).toBe(1);
    expect(ch.subjects[0].id).toBe('anatomy');
    expect(ch.subjects[0].lectureCount).toBe(17);
    expect(ch.subjects[0].lectureNames).toHaveLength(17);
    expect(ch.subjects[0].lectureNames).toContain('Bony Orbit');
    expect(ch.subjects[0].lectureNames).toContain('Visual Pathway');
    expect(ch.subjects[0].lectureNames).toContain('Anatomy of the ear');
    expect(ch.subjects[0].lectureNames).toContain('Anatomy of the Facial Nerve');
    expect(ch.subjects[0].lectureNames).toContain('Olfactory & Taste Pathways');
    expect(ch.subjects[0].questions.length).toBeGreaterThan(0);
  });

  it('chapter 2 is Histology with 3 lectures', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    const ch = chapters[1];
    expect(ch.id).toBe(2);
    expect(ch.title).toBe('Histology');
    expect(ch.emoji).toBe('🔬');
    expect(ch.subjects.length).toBe(1);
    expect(ch.subjects[0].id).toBe('histology');
    expect(ch.subjects[0].lectureCount).toBe(3);
    expect(ch.subjects[0].lectureNames).toHaveLength(3);
    expect(ch.subjects[0].lectureNames).toContain('The Eye');
    expect(ch.subjects[0].lectureNames).toContain('The Ear');
    expect(ch.subjects[0].lectureNames).toContain('Structure of the Ear');
    expect(ch.subjects[0].questions.length).toBeGreaterThan(0);
  });

  it('chapter 3 is Biochemistry with 2 lectures', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    const ch = chapters[2];
    expect(ch.id).toBe(3);
    expect(ch.title).toBe('Biochemistry');
    expect(ch.emoji).toBe('⚗️');
    expect(ch.subjects.length).toBe(1);
    expect(ch.subjects[0].id).toBe('biochem');
    expect(ch.subjects[0].lectureCount).toBe(2);
    expect(ch.subjects[0].lectureNames).toHaveLength(2);
    expect(ch.subjects[0].lectureNames).toContain('Visual cycle and vitamin A');
    expect(ch.subjects[0].lectureNames).toContain('Deficiency of vitamin A');
    expect(ch.subjects[0].questions.length).toBeGreaterThan(0);
  });

  it('chapter 4 is Physiology with 12 lectures spanning vision, hearing, and chemical senses', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    const ch = chapters[3];
    expect(ch.id).toBe(4);
    expect(ch.title).toBe('Physiology');
    expect(ch.emoji).toBe('⚡');
    expect(ch.subjects.length).toBe(1);
    expect(ch.subjects[0].id).toBe('physiology');
    expect(ch.subjects[0].lectureCount).toBe(12);
    expect(ch.subjects[0].lectureNames).toHaveLength(12);
    expect(ch.subjects[0].lectureNames).toContain('Introduction to Vision Physiology and Vision Optics');
    expect(ch.subjects[0].lectureNames).toContain('Accommodation, Errors of refraction, and Iris');
    expect(ch.subjects[0].lectureNames).toContain('Physiology & Physics of Sound & Function of External and Middle Ear');
    expect(ch.subjects[0].lectureNames).toContain('Physiology of Smell and Taste (Chemical Senses)');
    expect(ch.subjects[0].lectureNames).toContain('Posture and equilibrium');
    expect(ch.subjects[0].questions.length).toBeGreaterThan(0);
  });

  it('chapter 5 is Microbiology with 2 lectures', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    const ch = chapters[4];
    expect(ch.id).toBe(5);
    expect(ch.title).toBe('Microbiology');
    expect(ch.emoji).toBe('🦠');
    expect(ch.subjects.length).toBe(1);
    expect(ch.subjects[0].id).toBe('microbiology');
    expect(ch.subjects[0].lectureCount).toBe(2);
    expect(ch.subjects[0].lectureNames).toContain('Infections of The Eye');
    expect(ch.subjects[0].lectureNames).toContain('Infections of The Ear');
    expect(ch.subjects[0].questions.length).toBeGreaterThan(0);
  });

  it('chapter 6 is Pathology with 2 lectures', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    const ch = chapters[5];
    expect(ch.id).toBe(6);
    expect(ch.title).toBe('Pathology');
    expect(ch.emoji).toBe('🛡️');
    expect(ch.subjects.length).toBe(1);
    expect(ch.subjects[0].id).toBe('pathology');
    expect(ch.subjects[0].lectureCount).toBe(2);
    expect(ch.subjects[0].lectureNames).toContain('Diseases of The Eye');
    expect(ch.subjects[0].lectureNames).toContain('Diseases of The Ear');
    expect(ch.subjects[0].questions.length).toBeGreaterThan(0);
  });

  it('chapter 7 is Pharmacology with 1 lecture', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    const ch = chapters[6];
    expect(ch.id).toBe(7);
    expect(ch.title).toBe('Pharmacology');
    expect(ch.emoji).toBe('💊');
    expect(ch.subjects.length).toBe(1);
    expect(ch.subjects[0].id).toBe('pharma');
    expect(ch.subjects[0].lectureCount).toBe(1);
    expect(ch.subjects[0].lectureNames).toContain('Drug Therapy of Glaucoma');
    expect(ch.subjects[0].questions.length).toBeGreaterThan(0);
  });

  it('chapter 8 is Clinical (merged Ophthalmology + ENT) with 3 lectures', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    const ch = chapters[7];
    expect(ch.id).toBe(8);
    expect(ch.title).toBe('Clinical');
    expect(ch.emoji).toBe('🩺');
    expect(ch.subjects.length).toBe(1);
    expect(ch.subjects[0].id).toBe('clinical');
    expect(ch.subjects[0].lectureCount).toBe(3);
    expect(ch.subjects[0].lectureNames).toContain('Basic Neuro-ophthalmic Examination');
    expect(ch.subjects[0].lectureNames).toContain('Hearing Loss');
    expect(ch.subjects[0].lectureNames).toContain('Taste and Smell Disorders');
    expect(ch.subjects[0].questions.length).toBeGreaterThan(0);
  });

  it('chapter 9 is Past Exams with 7 subjects', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    const ch = chapters[8];
    expect(ch.id).toBe(9);
    expect(ch.title).toBe('Past Exams');
    expect(['📝', '📌']).toContain(ch.emoji);
    expect(ch.subjects.length).toBe(7);
    const subjectIds = ch.subjects.map(s => s.id);
    expect(subjectIds).toContain('anatomy');
    expect(subjectIds).toContain('histology');
    expect(subjectIds).toContain('biochem');
    expect(subjectIds).toContain('physiology');
    expect(subjectIds).toContain('pathology');
    expect(subjectIds).toContain('pharma');
    expect(subjectIds).toContain('clinical');
  });

  it('all subjects have lectureNames length matching lectureCount and have questions', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    for (const ch of chapters) {
      for (const subj of ch.subjects) {
        expect(subj.lectureNames).toBeDefined();
        expect(subj.lectureNames!.length).toBe(subj.lectureCount);
        expect(subj.questions.length).toBeGreaterThan(0);
      }
    }
  });
});
