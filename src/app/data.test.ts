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
});
