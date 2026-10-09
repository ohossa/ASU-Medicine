import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateModuleFile } from '../../data-format-v2/scripts/validate-banks';
import { contentFingerprint } from '../../data-format-v2/scripts/question-quality';
import { sessionMatchesQuestions } from './preferences/shuffle';
const read=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const report='docs/verification/year1-quality-2026-10-09/';
const summary=read(report+'summary.json');
const duplicates=read(report+'duplicates.json') as any[];
const exclusions=read(report+'exclusions.json') as any[];
const biochemistryReport='docs/verification/biochemistry-quality-2026-10-09/';
const biochemistry=read(biochemistryReport+'summary.json');
const laterRemovals=[...read(biochemistryReport+'duplicates.json'),...read(biochemistryReport+'exclusions.json'),...read(biochemistryReport+'consolidations.json')] as any[];
const questions=(bank:any)=>bank.chapters.flatMap((c:any)=>c.subjects.flatMap((s:any)=>s.questions)) as any[];
describe('Semester 1 reviewed release accounting',()=>{
 it('accounts for each original exactly once and validates every retained parent and child',()=>{
  const fingerprints=new Set<string>();
  for(const [module,counts] of Object.entries(summary.modules) as [string,any][]){
   const before=questions(read(report+`before/${module}.json`));
   const bank=read(`src/imports/year-1/semester-1/${module}.json`),live=questions(bank);
   expect(validateModuleFile(bank),module).toEqual([]);expect(live).toHaveLength(module==='IBM-1'?biochemistry.after:counts.after);expect(before).toHaveLength(counts.before);
   const liveIds=new Set(live.map(q=>q.id));
   for(const original of before){
    const statuses=[liveIds.has(original.id),duplicates.some(d=>d.module===module&&d.id===original.id),exclusions.some(e=>e.module===module&&e.id===original.id),module==='IBM-1'&&laterRemovals.some(r=>r.id===original.id)];
    expect(statuses.filter(Boolean),original.id).toHaveLength(1);
   }
   for(const q of live){
    const fingerprint=contentFingerprint(q);expect(fingerprints.has(fingerprint),q.id).toBe(false);fingerprints.add(fingerprint);
    expect(q.contentVersion).toMatch(/^[a-f0-9]{64}$/);
    expect(sessionMatchesQuestions([q],{questionIds:[q.id],questionVersions:['source']})).toBe(false);
   }
  }
 });
 it('keeps Semester 2 banks byte-equivalent in parsed content to the original snapshots',()=>{
  for(const module of ['IPHA-1','MINF-1','BLS-HE-1','MLS-1','IPAT-1','P2-1']){
   const current=read(`src/imports/year-1/semester-2/${module}.json`);
   if(module==='MINF-1'){
    const corrections=read('docs/verification/prepush-2026-10-09/bank-cleanup-ledger.json').filter((r:any)=>r.module===module&&r.action==='display-cleanup');
    for(const chapter of current.chapters)for(const subject of chapter.subjects)subject.questions=subject.questions.map((q:any)=>corrections.find((r:any)=>r.id===q.id)?.original??q);
   }
   expect(current).toEqual(read(report+`before/${module}.json`));
  }
 });
});
