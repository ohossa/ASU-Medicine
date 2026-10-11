import { beforeAll, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import bank from '../imports/year-3/semester-1/P4-3.json';
import decisions from '../../docs/verification/ethics-import-2026-10-11/medical-decisions.json';
import accounting from '../../docs/verification/ethics-import-2026-10-11/source-accounting.json';
import pages from '../../docs/verification/ethics-import-2026-10-11/page-ledger.json';
import before from '../../docs/verification/ethics-import-2026-10-11/before.json';
import { validateModuleFile } from '../../data-format-v2/scripts/validate-banks';
import { contentFingerprint } from '../../data-format-v2/scripts/question-quality';
import { ensureModuleDataLoaded, getChaptersForModuleAndMode, getModuleQuestionCounts, isModuleActive } from './data';
import { checkAnswerCorrect } from './utils/quiz';
import { shuffledCopy, restoreQuestionOrder } from './preferences/shuffle';
import { restoreHistoryQuestions } from './utils/historyQuestions';
import { getMissedQuestions } from './utils/missedQuestions';
import { questionScore } from './learning/customPractice';
import type { QuizAnswer } from './types';

const canonical=bank.chapters.flatMap(c=>c.subjects.flatMap(s=>s.questions));
const accepted=decisions.filter(d=>d.canonical_id);
const runtime=()=>getChaptersForModuleAndMode('P4-3','mcq').flatMap(c=>c.subjects.flatMap(s=>s.questions));
describe('P4-3 Ethics source import',()=>{
 beforeAll(async()=>{await ensureModuleDataLoaded('P4-3');});
 it('accounts for every source occurrence and page without releasing holds',()=>{
  expect(accounting).toHaveLength(104);expect(new Set(accounting.map(r=>r.occurrence_id)).size).toBe(104);
  expect(pages).toHaveLength(24);expect(pages.every(p=>p.status==='visually_read')).toBe(true);
  expect(accounting.filter(r=>r.disposition==='released')).toHaveLength(47);
  expect(accounting.filter(r=>r.disposition==='duplicate_merged')).toHaveLength(16);
  expect(accounting.filter(r=>r.disposition==='excluded')).toHaveLength(41);
  const ids=new Set(canonical.map(q=>q.id));
  for(const r of accounting)r.canonical_id?expect(ids.has(r.canonical_id)).toBe(true):expect(r.disposition).toBe('excluded');
  expect(new Set(canonical.map(contentFingerprint)).size).toBe(47);
 });
 it('activates the requested module with the existing taxonomy and catalog metadata',()=>{
  expect(bank.meta).toMatchObject({moduleCode:'P4-3',year:3,semester:1,creditPoints:1.5,totalMarks:30});
  expect(bank.comingSoon).toBe(false);expect(isModuleActive('P4-3')).toBe(true);
  expect(bank.chapters.map(c=>[c.id,c.title])).toEqual(before.chapters.map(c=>[c.id,c.title]));
  expect(validateModuleFile(bank as Parameters<typeof validateModuleFile>[0])).toEqual([]);
  for(const c of bank.chapters)for(const s of c.subjects){
   expect(s.id).toBe('clinical');expect(s.name).toBe('Medical Ethics');expect(s.lectureNames).toEqual([c.title]);
   expect(s.lectureCount).toBe(1);expect(s.questions.every(q=>q.lecture===1)).toBe(true);
  }
  expect(getModuleQuestionCounts('P4-3')).toMatchObject({mcqCount:47,essayCount:0});
  expect(runtime()).toHaveLength(47);
  expect(getChaptersForModuleAndMode('P4-3','mixed').flatMap(c=>c.subjects.flatMap(s=>s.questions))).toHaveLength(47);
  expect(getChaptersForModuleAndMode('P4-3','essay').flatMap(c=>c.subjects.flatMap(s=>s.questions))).toHaveLength(0);
 });
 it('binds every released exact content version to its answer and option review',()=>{
  expect(accepted).toHaveLength(47);
  for(const q of canonical){
   const d=accepted.find(d=>d.canonical_id===q.id)!;
   const content=Object.fromEntries(['correctIndex','explanation','options','text','type'].map(k=>[k,q[k as keyof typeof q]]));
   expect(createHash('sha256').update(JSON.stringify(content)).digest('hex'),q.id).toBe(d.reviewed_content_hash);
   expect(d.option_assessment).toHaveLength(4);expect(d.evidence?.length).toBeGreaterThan(0);
   expect(d.evidence?.every(e=>e.opened_full_text&&e.locator&&e.claim)).toBe(true);
   expect(d.review_method).toBe('nonblind');expect(d.independent_check).toBe('not performed');
  }
  const correction=accepted.find(d=>d.group==='invalid')!;
  expect(correction.decision).toBe('correct_answer');
  const corrected=runtime().find(q=>String(q.id)===correction.canonical_id)!;
  expect(corrected.correctIndex).toBe(1);expect(corrected.options?.[1]).toBe('Is under threat');
  expect(checkAnswerCorrect(corrected,3)).toBe(false);
  const combo=runtime().find(q=>q.options?.includes('Both adult and competent'))!;
  expect(combo.correctIndex).toBe(3);expect(checkAnswerCorrect(combo,3)).toBe(true);
 });
 it('grades every choice correctly after runtime loading and shuffle',()=>{
  const qs=runtime(), originalIds=qs.map(q=>q.id);
  for(const q of qs){
   const raw=canonical.find(r=>r.id===String(q.id))!;
   expect(q.options).toEqual(raw.options);expect(q.correctIndex).toBe(raw.correctIndex);
   q.options!.forEach((_,index)=>expect(checkAnswerCorrect(q,index),String(q.id)).toBe(index===raw.correctIndex));
   expect(checkAnswerCorrect(q,undefined)).toBe(false);
   expect(q.explanation.length).toBeGreaterThan(30);
  }
  const shuffled=shuffledCopy(qs,()=>0.25);
  expect(shuffled.map(q=>q.id)).not.toEqual(originalIds);
  expect(qs.map(q=>q.id)).toEqual(originalIds);
  expect(restoreQuestionOrder(shuffled,originalIds)?.map(q=>q.id)).toEqual(originalIds);
  expect(shuffled.every(q=>checkAnswerCorrect(q,q.correctIndex))).toBe(true);
 });
 it('restores saved-history selections by ID and uses the same missed-question grading',()=>{
  const qs=runtime();const answers:Record<number,QuizAnswer>={};
  qs.forEach((q,index)=>{answers[index]=index%2===0?q.correctIndex!:((q.correctIndex!+1)%4);});
  const restored=restoreHistoryQuestions(qs.map(q=>q.id),[...qs].reverse(),answers,[1]);
  expect(restored.questions.map(q=>q.id)).toEqual(qs.map(q=>q.id));expect(restored.answers).toEqual(answers);
  expect(restored.flags.has(1)).toBe(true);expect(restored.removedCount).toBe(0);
  expect(getMissedQuestions(restored.questions,restored.answers).map(q=>q.id)).toEqual(qs.filter((_,i)=>i%2===1).map(q=>q.id));
  const scores=qs.map((q,i)=>questionScore(q,answers[i]));
  expect(scores.reduce((sum,s)=>sum+s.correct,0)).toBe(24);
  expect(scores.reduce((sum,s)=>sum+s.total,0)).toBe(47);
 });
});
