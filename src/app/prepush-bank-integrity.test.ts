import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateModuleFile } from '../../data-format-v2/scripts/validate-banks';
const root = 'docs/verification/prepush-2026-10-09/';
const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const entries = (bank: any) => bank.chapters.flatMap((c: any) => c.subjects.flatMap((s: any) => s.questions));
const ledger = read(root + 'bank-cleanup-ledger.json');
describe('pre-push legacy display cleanup', () => {
  it('archives every removed question and preserves identity and grading on display-only edits', () => {
    for (const module of ['MINF-1','MBL-2','MRS-2']) {
      const semester = module === 'MINF-1' ? 'year-1/semester-2' : 'year-2/semester-1';
      const bank = read(`src/imports/${semester}/${module}.json`);
      expect(validateModuleFile(bank), module).toEqual([]);
      const before = entries(read(root + module + '-before.json'));
      const after = entries(bank);
      for (const old of before) {
        const current = after.find((q: any) => q.id === old.id);
        const record = ledger.find((r: any) => r.module === module && r.id === old.id);
        if (!current) {
          expect(record?.action).toBe('exclude'); expect(record.original).toEqual(old);
        } else {
          expect(current.correctIndex).toEqual(old.correctIndex);
          expect(current.correctAnswer).toEqual(old.correctAnswer);
          expect(current.type).toEqual(old.type);
          expect(current.subQuestions).toEqual(old.subQuestions);
          if (record) { expect(record.original).toEqual(old); expect(record.updated).toEqual(current); }
          else expect(current).toEqual(old);
        }
      }
      expect(after.length + ledger.filter((r: any) => r.module === module && r.action === 'exclude').length).toBe(before.length);
    }
  });
});
