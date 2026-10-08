import { beforeAll, describe, expect, it } from 'vitest';
import { ensureDataLoaded, getChaptersForModuleAndMode, getModuleQuestionCounts, isModuleActive } from './data';
import { validateModuleFile } from '../../data-format-v2/scripts/validate-banks';
import genetics from '../imports/year-1/semester-1/MBMG-1.json';
import anatomy from '../imports/year-1/semester-1/IAE-1.json';
import physiology from '../imports/year-1/semester-1/IPHY-1.json';
import ict from '../imports/year-1/semester-1/P1-1.json';
import mapping from '../../docs/verification/year1-import-2026-10-08/source-mapping.json';
import { checkAnswerCorrect } from './utils/quiz';

type Bank = Parameters<typeof validateModuleFile>[0] & {comingSoon: boolean};
const banks = [genetics, anatomy, physiology, ict] as Bank[];
describe('Year 1 Semester 1 designated source release', () => {
  beforeAll(async () => { await ensureDataLoaded(); });
  for (const bank of banks) {
    it(`${bank.meta.moduleCode}: all source groups are routed, valid and unlocked`, () => {
      expect(validateModuleFile(bank as Parameters<typeof validateModuleFile>[0])).toEqual([]);
      const code = bank.meta.moduleCode;
      const report = mapping[code as keyof typeof mapping];
      const raw = bank.chapters.flatMap(ch => ch.subjects.flatMap(s => s.questions));
      expect(raw).toHaveLength(report.sourceRows);
      expect(new Set(raw.map(q => q.id)).size).toBe(raw.length);
      expect(bank.comingSoon).toBe(false);
      expect(bank.meta.year).toBe(1);
      expect(bank.meta.semester).toBe(1);
      expect(isModuleActive(code)).toBe(true);
      expect(getModuleQuestionCounts(code).totalCount).toBe(report.sourceRows);
      const mixed = getChaptersForModuleAndMode(code, 'mixed').flatMap(ch => ch.subjects.flatMap(s => s.questions));
      expect(mixed).toHaveLength(raw.length);
      const mcq = getChaptersForModuleAndMode(code, 'mcq').flatMap(ch => ch.subjects.flatMap(s => s.questions));
      const essays = getChaptersForModuleAndMode(code, 'essay').flatMap(ch => ch.subjects.flatMap(s => s.questions));
      expect(mcq.length + essays.length).toBe(raw.length);
      for (const q of mixed) {
        if (q.type === 'mcq') expect(checkAnswerCorrect(q, q.correctIndex)).toBe(true);
        if (q.type === 'truefalse') {
          expect(checkAnswerCorrect(q, q.correctIndex === 0)).toBe(true);
          expect(checkAnswerCorrect(q, q.correctIndex !== 0)).toBe(false);
        }
        if (q.type === 'case') expect(q.subQuestions?.every(s => s.modelAnswer?.trim())).toBe(true);
      }
    });
  }
  it('preserves Genetics short answers in essay mode, rather than inventing options', () => {
    const essays = getChaptersForModuleAndMode('MBMG-1', 'essay').flatMap(ch => ch.subjects.flatMap(s => s.questions));
    expect(essays).toHaveLength(3);
    expect(essays.every(q => q.type === 'essay' && q.modelAnswer?.trim())).toBe(true);
  });
});
