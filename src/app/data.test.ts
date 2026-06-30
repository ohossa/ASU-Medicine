import { describe, it, expect } from 'vitest';

describe('data module exports', () => {
  it('exports ensureDataLoaded as an async function', async () => {
    const { ensureDataLoaded } = await import('./data');
    expect(typeof ensureDataLoaded).toBe('function');
  });

  it('exports isModuleActive as a function', async () => {
    const { isModuleActive } = await import('./data');
    expect(typeof isModuleActive).toBe('function');
  });

  it('exports getModuleQuestionCounts as a function', async () => {
    const { getModuleQuestionCounts } = await import('./data');
    expect(typeof getModuleQuestionCounts).toBe('function');
  });

  it('exports getChaptersForModuleAndMode as a function', async () => {
    const { getChaptersForModuleAndMode } = await import('./data');
    expect(typeof getChaptersForModuleAndMode).toBe('function');
  });

  it('exports findQuestionById as a function', async () => {
    const { findQuestionById } = await import('./data');
    expect(typeof findQuestionById).toBe('function');
  });

  it('routes case and casestudy questions to essay mode and counts them under essayCount', async () => {
    const { getChaptersForModuleAndMode, getModuleQuestionCounts, ensureDataLoaded } = await import('./data');
    await ensureDataLoaded();

    // Verify for a module that has case questions, e.g., P6-3 or P7-4 (or MCNS-2)
    // Let's test with MCNS-2 or MEM-2 if active, or just verify generally
    const counts = getModuleQuestionCounts('MCNS-2');
    
    // MCNS-2 should have essay questions and case questions included in the essay count
    expect(counts.essayCount).toBeGreaterThan(0);

    const mcqChapters = getChaptersForModuleAndMode('MCNS-2', 'mcq');
    const essayChapters = getChaptersForModuleAndMode('MCNS-2', 'essay');
    const mixedChapters = getChaptersForModuleAndMode('MCNS-2', 'mixed');

    // MCQ mode should have NO questions of type 'case', 'casestudy', or 'essay'
    for (const ch of mcqChapters) {
      for (const sub of ch.subjects) {
        for (const q of sub.questions) {
          expect(['essay', 'case', 'casestudy']).not.toContain(q.type);
        }
      }
    }

    // Essay mode should ONLY have questions of type 'essay', 'case', or 'casestudy'
    for (const ch of essayChapters) {
      for (const sub of ch.subjects) {
        for (const q of sub.questions) {
          expect(['essay', 'case', 'casestudy']).toContain(q.type);
        }
      }
    }

    // Mixed mode should contain everything
    let hasCase = false;
    let hasMcq = false;
    for (const ch of mixedChapters) {
      for (const sub of ch.subjects) {
        for (const q of sub.questions) {
          if (q.type === 'case' || q.type === 'casestudy') hasCase = true;
          if (q.type === 'mcq') hasMcq = true;
        }
      }
    }
    expect(hasCase).toBe(true);
    expect(hasMcq).toBe(true);
  });

  it('normalizes circled C characters (copyright ©/Ⓒ/ⓒ) into standard (c)', async () => {
    const { getChaptersForModuleAndMode, ensureDataLoaded } = await import('./data');
    await ensureDataLoaded();

    // Since our normalizer runs inside transformV2Question, let's verify on a module
    // that had circled c characters.
    const chapters = getChaptersForModuleAndMode('IPHA-1', 'mixed');
    for (const ch of chapters) {
      for (const sub of ch.subjects) {
        for (const q of sub.questions) {
          expect(q.text).not.toContain('©');
          expect(q.text).not.toContain('Ⓒ');
          expect(q.text).not.toContain('ⓒ');
          if (q.explanation) {
            expect(q.explanation).not.toContain('©');
            expect(q.explanation).not.toContain('Ⓒ');
            expect(q.explanation).not.toContain('ⓒ');
          }
          if (q.subQuestions) {
            for (const sq of q.subQuestions) {
              expect(sq.text).not.toContain('©');
              expect(sq.text).not.toContain('Ⓒ');
              expect(sq.text).not.toContain('ⓒ');
            }
          }
        }
      }
    }
  });
});
