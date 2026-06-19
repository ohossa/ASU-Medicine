import { describe, it, expect, beforeAll } from 'vitest';
import { ensureDataLoaded, getChaptersForModuleAndMode, getModuleQuestionCounts } from './data';

describe('Special Senses (MSS-2) restructured database validation', () => {
  beforeAll(async () => {
    await ensureDataLoaded();
  });

  it('verifies that the module is active and loaded', () => {
    const counts = getModuleQuestionCounts('MSS-2');
    expect(counts.totalCount).toBeGreaterThan(0);
    expect(counts.essayCount).toBeGreaterThan(0);
    // Cloze cards are parsed as fillblank, which are counted as MCQ in UI count helper
    expect(counts.mcqCount).toBeGreaterThan(0);
    console.log(`MSS-2 total questions: ${counts.totalCount} (Essay: ${counts.essayCount}, Fillblank: ${counts.mcqCount})`);
  });

  it('contains exactly 3 chapters for eye, ear, and chemical senses', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    expect(chapters.length).toBe(3);

    // Verify Chapter 1: Eye
    const ch1 = chapters[0];
    expect(ch1.id).toBe(1);
    expect(ch1.title).toBe('The Eye & Visual System');
    expect(ch1.emoji).toBe('👁️');
    expect(ch1.page).toBe(4);
    expect(ch1.lectureRange).toBe('Lectures 1-20');

    // Verify Chapter 2: Ear
    const ch2 = chapters[1];
    expect(ch2.id).toBe(2);
    expect(ch2.title).toBe('The Ear & Auditory/Vestibular Systems');
    expect(ch2.emoji).toBe('👂');
    expect(ch2.page).toBe(35);
    expect(ch2.lectureRange).toBe('Lectures 21-27');

    // Verify Chapter 3: Chemical Senses
    const ch3 = chapters[2];
    expect(ch3.id).toBe(3);
    expect(ch3.title).toBe('Chemical Senses (Smell & Taste)');
    expect(ch3.emoji).toBe('👅');
    expect(ch3.page).toBe(56);
    expect(ch3.lectureRange).toBe('Lectures 28-30');
  });

  it('contains correct subject definitions inside chapters', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    
    // Chapter 1 should have subjects like anatomy, histology, biochem, physiology, microbiology, pathology, pharma, clinical
    const ch1Subjects = chapters[0].subjects.map(s => s.id);
    expect(ch1Subjects).toContain('anatomy');
    expect(ch1Subjects).toContain('histology');
    expect(ch1Subjects).toContain('biochem');
    expect(ch1Subjects).toContain('physiology');
    expect(ch1Subjects).toContain('microbiology');
    expect(ch1Subjects).toContain('pathology');
    expect(ch1Subjects).toContain('pharma');
    expect(ch1Subjects).toContain('clinical'); // Ophthalmology clinical mapped to clinical

    // Chapter 2 should have subjects like anatomy, histology, physiology, microbiology, pathology, clinical
    const ch2Subjects = chapters[1].subjects.map(s => s.id);
    expect(ch2Subjects).toContain('anatomy');
    expect(ch2Subjects).toContain('histology');
    expect(ch2Subjects).toContain('physiology');
    expect(ch2Subjects).toContain('microbiology');
    expect(ch2Subjects).toContain('pathology');
    expect(ch2Subjects).toContain('clinical'); // ENT clinical mapped to clinical

    // Chapter 3 should have subjects like anatomy, physiology, clinical
    const ch3Subjects = chapters[2].subjects.map(s => s.id);
    expect(ch3Subjects).toContain('anatomy');
    expect(ch3Subjects).toContain('physiology');
    expect(ch3Subjects).toContain('clinical'); // ENT clinical mapped to clinical
  });

  it('ensures that lectureName list matches the question lectures index', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    for (const ch of chapters) {
      for (const subj of ch.subjects) {
        expect(subj.lectureNames).toBeDefined();
        expect(subj.lectureNames!.length).toBe(subj.lectureCount);
        
        for (const q of subj.questions) {
          // Lecture index must be 1-based and within bounds of the lectureNames array
          expect(q.lecture).toBeGreaterThan(0);
          expect(q.lecture).toBeLessThanOrEqual(subj.lectureCount);
          
          const lectureName = subj.lectureNames![q.lecture - 1];
          expect(typeof lectureName).toBe('string');
          expect(lectureName.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('validates the structure of cloze (fillblank) questions', () => {
    const chapters = getChaptersForModuleAndMode('MSS-2', 'mixed');
    let fillblankCount = 0;
    for (const ch of chapters) {
      for (const subj of ch.subjects) {
        for (const q of subj.questions) {
          if (q.type === 'fillblank') {
            fillblankCount++;
            expect(q.blanks).toBeDefined();
            expect(q.blanks!.length).toBeGreaterThan(0);
            
            // The number of underscores (___) in the text must equal the number of blanks
            const matches = q.text.match(/___/g);
            expect(matches).not.toBeNull();
            expect(matches!.length).toBe(q.blanks!.length);
            
            // Check that the explanation contains the completed sentence
            expect(q.explanation).toContain('Completed Sentence:');
          }
        }
      }
    }
    expect(fillblankCount).toBeGreaterThan(0);
  });
});
