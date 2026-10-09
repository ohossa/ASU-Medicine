import { readFileSync } from 'node:fs';
import { beforeAll,describe,expect,it } from 'vitest';
import bank from '../imports/year-1/semester-1/IBM-1.json';
import { validateModuleFile } from '../../data-format-v2/scripts/validate-banks';
import { contentFingerprint } from '../../data-format-v2/scripts/question-quality';
import { ensureDataLoaded,getChaptersForModuleAndMode } from './data';
import { checkAnswerCorrect } from './utils/quiz';
import { sessionMatchesQuestions } from './preferences/shuffle';
const folder='docs/verification/biochemistry-quality-2026-10-09/';
const read=(name:string)=>JSON.parse(readFileSync(folder+name,'utf8'));
const all=(b:any)=>b.chapters.flatMap((c:any)=>c.subjects.flatMap((s:any)=>s.questions)) as any[];
const live=all(bank);
const resolve=(suffix:string)=>live.find(q=>q.id==='IBM1-BIO-DRV-20260921-'+suffix || q.duplicateAliases?.some((a:any)=>a.id==='IBM1-BIO-DRV-20260921-'+suffix));
describe('Dedicated Biochemistry OCR release',()=>{
 beforeAll(async()=>{await ensureDataLoaded();});
 it('accounts for every reviewed original and preserves complete removal archives',()=>{
  const report=read('summary.json'),before=all(read('before.json')),duplicates=read('duplicates.json'),excluded=read('exclusions.json'),consolidated=read('consolidations.json');
  expect(validateModuleFile(bank as any)).toEqual([]);expect(live).toHaveLength(report.after);expect(before).toHaveLength(report.before);
  expect(report.before-report.exclusions-report.duplicatesRemoved-report.fragmentsConsolidated).toBe(report.after);
  for(const q of before){
   const states=[live.some(x=>x.id===q.id),duplicates.some((r:any)=>r.id===q.id),excluded.some((r:any)=>r.id===q.id),consolidated.some((r:any)=>r.id===q.id)];expect(states.filter(Boolean),q.id).toHaveLength(1);
  }
  for(const r of [...duplicates,...excluded,...consolidated])expect(r.original.id).toBe(r.id);
  expect(new Set(live.map(contentFingerprint)).size).toBe(live.length);
 });
 it('restores swallowed first alternatives and retains the answer by content',()=>{
  for(const [suffix,answer] of [['00933','Glutamine'],['00942','Glycine'],['01090','Mannose.*Galactose.*not epimers']]){
   const q=resolve(suffix)!;expect(q,q?.id).toBeDefined();expect(q.options).toHaveLength(4);expect(q.options[q.correctIndex]).toMatch(new RegExp(answer,'i'));
  }
 });
 it('restores the original six-pair matching exercise and grades every pair',()=>{
  const q=getChaptersForModuleAndMode('IBM-1','mixed').flatMap(c=>c.subjects.flatMap(s=>s.questions)).find(q=>q.id==='IBM1-BIO-DRV-20260921-00208')!;
  expect(q.type).toBe('matching');expect(q.pairs).toHaveLength(6);
  const scrambled=q.pairs!.map(p=>p.target).reverse(),matches=Object.fromEntries(q.pairs!.map((p,i)=>[i,scrambled.indexOf(p.target)]));
  expect(checkAnswerCorrect(q,{scrambled,matches})).toBe(true);expect(checkAnswerCorrect(q,{scrambled,matches:{...matches,0:matches[1]}})).toBe(false);
  for(const suffix of ['00209','00210','00211','00212','00213'])expect(resolve(suffix)?.id).toBe('IBM1-BIO-DRV-20260921-00208');
 });
 it('makes the UTP reactant question unique and resets sessions after corrected content',()=>{
  const q=resolve('00711')!;expect(q.text).toMatch(/consumed to form UDP-glucose/);expect(q.options[q.correctIndex]).toBe('UTP');
  const original=all(read('before.json')).find(old=>old.id===q.id)!;expect(sessionMatchesQuestions([q],{questionIds:[q.id],questionVersions:[original.contentVersion]})).toBe(false);
 });
});
