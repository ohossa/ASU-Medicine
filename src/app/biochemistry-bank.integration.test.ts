import { beforeAll, describe, expect, it } from 'vitest';
import bank from '../imports/year-1/semester-1/IBM-1.json';
import report from '../../docs/verification/biochemistry-import-2026-10-09/import-report.json';
import decisions from '../../docs/verification/biochemistry-import-2026-10-09/medical-decisions.json';
import accounting from '../../docs/verification/biochemistry-import-2026-10-09/source-accounting.json';
import { validateModuleFile } from '../../data-format-v2/scripts/validate-banks';
import { ensureDataLoaded, getChaptersForModuleAndMode, isModuleActive } from './data';
import { checkAnswerCorrect } from './utils/quiz';
const raw=bank.chapters.flatMap(c=>c.subjects.flatMap(s=>s.questions));
describe('Full biochemistry TXT intake',()=>{
 beforeAll(async()=>{await ensureDataLoaded();});
 it('accounts for the immutable source without publishing unresolved records',()=>{
  expect(accounting).toHaveLength(2152);expect(new Set(accounting.map(r=>r.sourceId)).size).toBe(2152);
  expect(report.sourceQuestions).toBe(2137);expect(report.unlinkedHistoricalAnswers).toBe(15);
  expect(report.decisionCounts.needs_review??0).toBe(0);
  expect(raw.length).toBe(report.uniqueQuestions);expect(raw.length).toBeGreaterThan(1500);
  expect(new Set(raw.map(q=>q.id)).size).toBe(raw.length);
  expect(raw.flatMap(q=>q.sourceOccurrences)).toHaveLength(report.releasedOccurrences);
  const ids=new Set(raw.map(q=>q.id));
  for(const row of accounting){
   expect(row.releaseErrors).toEqual([]);
   if(row.canonicalId)expect(ids.has(row.canonicalId)).toBe(true);
   else expect(row.decision).toBe('exclude');
  }
 });
 it('unlocks IBM-1 and exposes every question in a named topic',()=>{
  expect(bank.meta.moduleCode).toBe('IBM-1');expect(bank.meta.year).toBe(1);expect(bank.meta.semester).toBe(1);
  expect(bank.meta.creditPoints).toBe(3);expect(bank.meta.totalMarks).toBe(60);
  expect(bank.comingSoon).toBe(false);expect(isModuleActive('IBM-1')).toBe(true);
  expect(validateModuleFile(bank as Parameters<typeof validateModuleFile>[0])).toEqual([]);
  for(const c of bank.chapters)for(const s of c.subjects){
   expect(s.id).toBe('biochem');expect(s.lectureCount).toBe(s.lectureNames.length);
   for(const q of s.questions){expect(q.lecture).toBeGreaterThan(0);expect(q.lecture).toBeLessThanOrEqual(s.lectureCount);expect(s.lectureNames[q.lecture-1]).not.toMatch(/^Lecture \d/);}
  }
 });
 it('grades the actual imported answer positions, including repaired source labels',()=>{
  const mcqs=getChaptersForModuleAndMode('IBM-1','mcq').flatMap(c=>c.subjects.flatMap(s=>s.questions));
  expect(mcqs.length).toBe(report.questionTypes.mcq);
  for(const q of mcqs){
   expect(q.options!.length).toBeGreaterThanOrEqual(2);
   expect(checkAnswerCorrect(q,q.correctIndex),String(q.id)).toBe(true);
   expect(checkAnswerCorrect(q,((q.correctIndex??0)+1)%q.options!.length),String(q.id)).toBe(false);
   expect(checkAnswerCorrect(q,undefined),String(q.id)).toBe(false);
  }
  const amino=mcqs.find(q=>String(q.id)==='IBM1-BIO-DRV-20260921-00908')!;
  expect(amino.options).toEqual(['amine group','carboxyl group','phosphate group','radical (R) group']);expect(amino.correctIndex).toBe(3);
 });
 it('provides substantive explanations and model answers in the essay route',()=>{
  const essays=getChaptersForModuleAndMode('IBM-1','essay').flatMap(c=>c.subjects.flatMap(s=>s.questions));
  expect(essays.length).toBe(report.questionTypes.essay);
  for(const q of essays){expect(q.type).toBe('essay');expect(q.modelAnswer?.trim().length).toBeGreaterThan(0);}
  for(const q of raw){
   expect(q.explanation.trim().length).toBeGreaterThan(15);expect(q.explanation).not.toMatch(/see above|review the related lecture/i);
   const review=decisions.find(d=>d.id===q.sourceOccurrences[0].sourceId)!;
   expect(review.decision==='accept'||review.decision==='correct').toBe(true);
   expect((review.evidence??[]).some((e: {opened_full_text?:boolean;url?:string;locator?:string;claim?:string})=>e.opened_full_text===true&&e.url&&e.locator&&e.claim)).toBe(true);
   expect(q.text).not.toMatch(/^\s*\d+\s*[.)]\s+/);
  }
 });
 it('retains the medical recheck fixes and removes known ambiguous items',()=>{
  const ids=new Set(raw.map(q=>q.id));
  for(const suffix of ['00028','00158','01437','01346','02066','00478','00429'])expect(ids.has('IBM1-BIO-DRV-20260921-'+suffix)).toBe(false);
  const cyto=raw.find(q=>q.id==='IBM1-BIO-W1-Q08')!;
  expect(cyto.modelAnswer).toContain('Cytochrome b');expect(cyto.modelAnswer).toContain('cytochrome c');expect(cyto.modelAnswer).not.toMatch(/catalase/i);
  const cyanide=raw.find(q=>q.id==='IBM1-BIO-DRV-20260921-00271')!;expect(cyanide.text).not.toMatch(/irreversible/i);
  const enzyme=raw.find(q=>q.id==='IBM1-BIO-DRV-20260921-01242')!;expect(enzyme.text).not.toMatch(/major 6/i);expect(enzyme.correctIndex).toBe(1);
  const sphingo=raw.find(q=>q.id==='IBM1-BIO-DRV-20260921-01151')!;
  expect(sphingo.explanation).toMatch(/ceramide|sphingosine|sphingoid/i);expect(sphingo.explanation).toMatch(/phospho|choline/i);
 });

});

describe('Book-aligned IBM-1 organization',()=>{
 it('exposes 16 ordered book lectures and 14 labelled additional topics',()=>{
  expect(bank.chapters).toHaveLength(30);
  expect(bank.chapters.slice(0,16).map(c=>c.id)).toEqual(Array.from({length:16},(_,i)=>101+i));
  expect(bank.chapters.slice(16).every(c=>c.subtitle.startsWith('Additional topic'))).toBe(true);
  expect(bank.chapters[0].title).toContain('Protein Chemistry');expect(bank.chapters[15].title).toBe('Glycolysis');
  expect(Math.max(...bank.chapters.map(c=>c.subjects.flatMap(s=>s.questions).length))).toBeLessThan(200);
 });
 it('places known source-group exceptions by the tested concept',()=>{
  const find=(suffix:string)=>bank.chapters.find(c=>c.subjects.some(s=>s.questions.some(q=>q.id==='IBM1-BIO-DRV-20260921-'+suffix)))?.title;
  expect(find('00899')).toBe('Carbohydrate Chemistry');expect(find('01404')).toBe('Glycolysis');expect(find('01620')).toBe('Introduction to Metabolism');
 });
});
