import { describe,it,expect } from 'vitest';
import { validateModuleFile } from '../../data-format-v2/scripts/validate-banks';
import { resolveAnswerIndex, contentFingerprint } from '../../data-format-v2/scripts/question-quality';
import ibm from '../imports/year-1/semester-1/IBM-1.json';
const all = ibm.chapters.flatMap(c=>c.subjects.flatMap(s=>s.questions));
describe('Question quality boundaries',()=>{
 it('rejects missing, fractional, out-of-bounds and conflicting keys instead of selecting a default',()=>{
  for(const correctIndex of [undefined,-1,2,.5,NaN])expect(()=>resolveAnswerIndex({correctIndex},['one','two'])).toThrow();
  expect(()=>resolveAnswerIndex({correctIndex:0,correctAnswer:'B'},['one','two'])).toThrow();
  expect(resolveAnswerIndex({correctAnswer:'B'},['one','two'])).toBe(1);
 });
 it('preserves medically meaningful charge signs and decimal values in duplicate keys',()=>{
  const q={type:'mcq',text:'At pH 2.5',options:['net +ve','net -ve'],correctIndex:0};
  expect(contentFingerprint(q)).not.toBe(contentFingerprint({...q,text:'At pH 25'}));
  expect(contentFingerprint(q)).not.toBe(contentFingerprint({...q,correctIndex:1}));
  expect(contentFingerprint(q)).toBe(contentFingerprint({...q,options:['net -ve','net +ve'],correctIndex:1}));
 });
 it('bank validator rejects damaged options, repeated choices and fractional keys in parent and child',()=>{
  const base=structuredClone(ibm) as any;const s=base.chapters[0].subjects[0];
  s.questions=[{id:'bad',type:'mcq',text:'A valid stem',lecture:1,options:['choice','choice.'],correctIndex:.5,explanation:'Explanation'}];
  expect(validateModuleFile(base).join(' ')).toMatch(/integer|duplicat/i);
  s.questions[0].options=['one','two PULSE Dr Marwa Hamdy'];s.questions[0].correctIndex=0;
  expect(validateModuleFile(base).join(' ')).toMatch(/corrupt|footer/i);
  s.questions[0].options=['one','two BIOCHEM ACADEMY'];expect(validateModuleFile(base).join(' ')).toMatch(/corrupt|footer/i);
  s.questions=[{id:'case',type:'case',text:'Case stem',lecture:1,subQuestions:[{id:'child',type:'mcq',text:'Child',options:['a','b'],correctIndex:.5,explanation:''}]}];
  expect(validateModuleFile(base).join(' ')).toMatch(/integer/i);
 });
});
describe('Student screenshot regressions',()=>{
 it('displays a readable, unambiguous protamine question with the negative-residue answer',()=>{
  const q=all.find(q=>q.id==='IBM1-BIO-DRV-20260921-01453')!;
  expect(q.text).not.toMatch(/prutein|nun covalent|санд/);expect(q.options?.[q.correctIndex!]).toMatch(/negatively charged/);
 });
 it('preserves the protein backbone sequence without footer text or stray letters',()=>{
  const q=all.find(q=>q.id==='IBM1-BIO-DRV-20260921-02147')!;
  expect(q.options?.[q.correctIndex!]).toBe('-C-N-C-C-');expect(q.options?.join(' ')).not.toMatch(/PULSE|Hamdy/);
 });
 it('restores merged alternatives while keeping the DNA answer correctly indexed',()=>{
  for(const suffix of ['02234','02253']){
   const q=all.find(q=>q.id==='IBM1-BIO-DRV-20260921-'+suffix)!;
   expect(q.options).toHaveLength(5);expect(q.options?.[q.correctIndex!]).toBe('The nucleotide sequence of DNA');expect(q.options?.join(' ')).not.toContain('¢');
  }
 });
 it('provides a complete glutathione stem and grammatically clear options',()=>{
  const q=all.find(q=>q.id==='IBM1-BIO-DRV-20260921-02286' || ('duplicateAliases' in q && (q.duplicateAliases as {id:string}[]).some(a=>a.id==='IBM1-BIO-DRV-20260921-02286')))!;
  expect(q.text).toMatch(/Which statements.*glutathione/);expect(q.options?.[q.correctIndex!]).toBe('All of the above.');
 });
});
