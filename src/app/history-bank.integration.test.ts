import { beforeAll, describe, expect, it } from 'vitest';
import bank from '../imports/year-1/semester-2/BLS-HE-1.json';
import source from '../../docs/verification/history-import-2026-10-08/source-extraction.json';
import report from '../../docs/verification/history-import-2026-10-08/import-report.json';
import { validateModuleFile } from '../../data-format-v2/scripts/validate-banks';
import { ensureDataLoaded, getChaptersForModuleAndMode, isModuleActive } from './data';
import { checkAnswerCorrect } from './utils/quiz';
const raw=bank.chapters.flatMap(c=>c.subjects.flatMap(s=>s.questions));
describe('History PDF import',()=>{
 beforeAll(async()=>{await ensureDataLoaded();});
 it('accounts for every source occurrence, retaining the exact duplicate once',()=>{
  expect(source.map(q=>q.number)).toEqual(Array.from({length:25},(_,i)=>i+1));
  expect(report.sourceMapping).toHaveLength(25);expect(raw).toHaveLength(24);
  expect(new Set(raw.map(q=>q.id)).size).toBe(24);
  expect(raw.flatMap(q=>q.sourceOccurrences)).toHaveLength(25);
  expect(report.sourceMapping[4].id).toBe(report.sourceMapping[5].id);
  for(const row of source){
   const mapped=report.sourceMapping.find(m=>m.sourceQuestionNumber===row.number)!;
   const actual=raw.find(q=>q.id===mapped.id)!;
   expect(actual.text).toBe(row.text);
   expect(actual.correctIndex).toBe(row.options.findIndex(o=>o.label===row.answerLabel));
   expect(actual.options).toEqual(row.options.map(o=>row.number===11&&o.text==='B- two fingers'?'two fingers':o.text));
  }
  expect(source.find(q=>q.number===14)?.pages).toEqual([2,3]);
  expect(source.find(q=>q.number===21)?.pages).toEqual([3,4]);
 });
 it('unlocks the right module and keeps histories and examinations in their chapters',()=>{
  expect(validateModuleFile(bank as Parameters<typeof validateModuleFile>[0])).toEqual([]);
  expect(bank.meta.year).toBe(1);expect(bank.meta.semester).toBe(2);
  expect(bank.meta.moduleCode).toBe('BLS-HE-1');expect(bank.meta.creditPoints).toBe(1.5);expect(bank.meta.totalMarks).toBe(30);
  expect(bank.comingSoon).toBe(false);expect(isModuleActive('BLS-HE-1')).toBe(true);
  expect(bank.chapters.find(c=>c.id===1)?.subjects).toEqual([]);
  expect(bank.chapters.find(c=>c.id===2)?.subjects.flatMap(s=>s.questions)).toHaveLength(14);
  expect(bank.chapters.find(c=>c.id===3)?.subjects.flatMap(s=>s.questions)).toHaveLength(10);
 });
 it('loads and grades all keys, including unusual source letter ranges',()=>{
  const qs=getChaptersForModuleAndMode('BLS-HE-1','mcq').flatMap(c=>c.subjects.flatMap(s=>s.questions));expect(qs).toHaveLength(24);
  for(const q of qs){expect(checkAnswerCorrect(q,q.correctIndex),String(q.id)).toBe(true);expect(checkAnswerCorrect(q,((q.correctIndex??0)+1)%q.options!.length),String(q.id)).toBe(false);expect(q.text).not.toMatch(/^\d+\s*[-.)]/);}
  const q2=qs.find(q=>String(q.id).endsWith('-002'))!;expect(q2.correctIndex).toBe(3);
  expect(qs.find(q=>String(q.id).endsWith('-023'))?.correctIndex).toBe(3);
 });
});
