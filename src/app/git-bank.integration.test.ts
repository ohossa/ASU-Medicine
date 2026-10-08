import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import manifest from '../test/fixtures/git-release-manifest.json';
import importedBank from '../imports/year-3/semester-1/MGL-3.json';
interface PreparedQuestion { id: string; type: string; lecture: number; [key: string]: any }
const bank = importedBank as unknown as { chapters: Array<{ id: number; bankSection?: 'practice' | 'past-exams'; subjects: Array<{ id: string; lectureNames: string[]; questions: PreparedQuestion[] }> }> };
import { ensureDataLoaded, getChaptersForModuleAndMode, getModuleQuestionCounts, findQuestionById } from './data';
import { toGitTopicChapter, selectGitCollection } from './lib/gitBank';
import { checkAnswerCorrect } from './utils/quiz';

const pastIds=new Set<string>(manifest.pastExamIds);
const stableJSON=(v:any):string=>JSON.stringify(v,(_key,value)=>value && typeof value==='object' && !Array.isArray(value) ? Object.fromEntries(Object.keys(value).sort().map(key=>[key,value[key]])) : value);
const rawQuestions=bank.chapters.flatMap(c=>c.subjects.flatMap(s=>s.questions));

describe('Integrated GIT question bank',()=>{
  it('grades every GIT true/false item correctly for boolean and indexed selections',async()=>{
    await ensureDataLoaded();
    const questions=getChaptersForModuleAndMode('MGL-3','mixed').flatMap(c=>c.subjects.flatMap(s=>s.questions)).filter(q=>q.type==='truefalse');
    expect(questions).toHaveLength(325);
    for(const q of questions){
      expect([0,1]).toContain(q.correctIndex);
      expect(checkAnswerCorrect(q,q.correctIndex===0),q.id+' boolean key').toBe(true);
      expect(checkAnswerCorrect(q,q.correctIndex!==0),q.id+' opposite').toBe(false);
      expect(checkAnswerCorrect(q,q.correctIndex),q.id+' index').toBe(true);
    }
  });
  it('provides concise explanations for every parent and every case child',()=>{
    const items=rawQuestions.flatMap(q=>[q,...(q.subQuestions??[])]);
    for(const q of items){
      expect(typeof q.explanation,q.id).toBe('string');
      expect(q.explanation.trim().length,q.id).toBeGreaterThan(0);
      expect(q.explanation.trim().split(/\s+/).length,q.id).toBeLessThanOrEqual(65);
      expect(q.explanation,q.id).not.toMatch(/^(?:FLAG|READY|See above|Pending|To be added)\.?$/i);
    }
  });
  it('imports every canonical parent once without changing prompt/options/answers/IDs',()=>{
    expect(rawQuestions).toHaveLength(6178);
    expect(new Set(rawQuestions.map(q=>q.id)).size).toBe(6178);
    expect(Object.keys(manifest.questionHashes)).toHaveLength(6178);
    for(const q of rawQuestions)expect(createHash('sha256').update(stableJSON(q)).digest('hex'),q.id).toBe((manifest.questionHashes as Record<string,string>)[q.id]);
  });
  it('uses correct GIT assessment metadata and never exposes excluded IDs',()=>{
    expect(importedBank.meta.creditPoints).toBe(13);expect(importedBank.meta.totalMarks).toBe(260);
    const published=new Set(rawQuestions.map(q=>q.id));
    expect(manifest.excludedIds).toHaveLength(485);
    expect(manifest.excludedIds.every(id=>!published.has(id))).toBe(true);
    expect(rawQuestions.some(q=>JSON.stringify(q).includes('Source underlined option label:'))).toBe(false);
  });
  it('physically separates past exams from practice with unique navigation/session chapter IDs',()=>{
    expect(bank.chapters).toHaveLength(16);
    expect(new Set(bank.chapters.map(c=>c.id)).size).toBe(16);
    const actualPast:string[]=[];const practice:string[]=[];
    for(const c of bank.chapters){
      expect(['practice','past-exams']).toContain(c.bankSection);
      for(const s of c.subjects)for(const q of s.questions){
        if(c.bankSection==='past-exams'){expect(pastIds.has(q.id),q.id).toBe(true);actualPast.push(q.id);}
        else{expect(pastIds.has(q.id),q.id).toBe(false);practice.push(q.id);}
      }
    }
    expect(new Set(actualPast)).toEqual(pastIds);
    expect(actualPast).toHaveLength(670);expect(practice).toHaveLength(5508);
  });
  it('loads both collections and preserves all supported scored fields',async()=>{
    await ensureDataLoaded();const cs=getChaptersForModuleAndMode('MGL-3','mixed');
    expect(selectGitCollection(cs,'practice')).toHaveLength(8);
    expect(selectGitCollection(cs,'past-exams')).toHaveLength(8);
    const loaded=new Map(cs.flatMap(c=>c.subjects.flatMap(s=>s.questions)).map(q=>[String(q.id),q]));
    for(const q of rawQuestions){
      const actual=loaded.get(q.id)!;expect(actual,q.id).toBeDefined();
      // Display may drop only a leading source label; the canonical file is hash-checked above.
      expect(q.text.endsWith(actual.text),q.id+' stem remainder').toBe(true);
      expect(actual.text.length,q.id+' nonempty stem').toBeGreaterThan(0);
      for(const key of ['type','lecture','explanation','options','correctIndex','pairs','modelAnswer','blanks','acceptedAnswers']){
        if(key in q)expect((actual as any)[key],q.id+' '+key).toEqual((q as any)[key]);
      }
      if(q.type==='case')for(let i=0;i<(q as any).subQuestions.length;i++){
        const child=(q as any).subQuestions[i];
        expect(child.text.endsWith(actual.subQuestions![i].text),child.id+' stem remainder').toBe(true);
        for(const key of ['id','type','explanation','options','correctIndex','modelAnswer','blanks','acceptedAnswers'])if(key in child)expect((actual.subQuestions![i] as any)[key],q.id+' '+key).toEqual(child[key]);
      }
    }
  });
  it('retains exact 104 topics in each collection, partitions questions by topic and keeps empty topics',async()=>{
    await ensureDataLoaded();const cs=getChaptersForModuleAndMode('MGL-3','mixed');
    for(const section of ['practice','past-exams'] as const){
      let topics=0;
      for(const c of selectGitCollection(cs,section)){
        const transformed=toGitTopicChapter(c);topics+=transformed.subjects.length;
        expect(transformed.subjects.map(s=>s.name)).toEqual((manifest.topics as Record<string,string[]>)[c.subjects[0].id]);
        expect(transformed.subjects.flatMap(s=>s.questions).map(q=>q.id).sort()).toEqual(c.subjects.flatMap(s=>s.questions).map(q=>q.id).sort());
        for(const s of transformed.subjects)expect(s.questions.every(q=>q.lecture===s.lectureNum)).toBe(true);
      }
      expect(topics).toBe(104);
    }
  });
  it('filters modes without collection leakage and grades all choice keys',async()=>{
    await ensureDataLoaded();const sets:Record<string,Set<string>>={};
    for(const mode of ['mcq','essay','mixed'] as const){
      const cs=getChaptersForModuleAndMode('MGL-3',mode);const ids:string[]=[];
      for(const c of cs)for(const s of c.subjects)for(const q of s.questions){
        expect(c.bankSection==='past-exams').toBe(pastIds.has(String(q.id)));
        const written=['case','casestudy','essay'].includes(q.type);
        if(mode==='mcq')expect(written).toBe(false);
        if(mode==='essay')expect(written).toBe(true);
        if(q.type==='mcq'||q.type==='truefalse'){
          expect(checkAnswerCorrect(q,q.correctIndex),String(q.id)).toBe(true);
          expect(checkAnswerCorrect(q,(q.correctIndex!+1)%q.options!.length)).toBe(false);
        }
        ids.push(String(q.id));
      }
      sets[mode]=new Set(ids);
    }
    expect([...sets.mcq].filter(id=>sets.essay.has(id))).toEqual([]);
    expect(new Set([...sets.mcq,...sets.essay])).toEqual(sets.mixed);
    expect(getModuleQuestionCounts('MGL-3')).toEqual({mcqCount:5187,essayCount:991,totalCount:6178});
  });
  it('resolves past question IDs to their separate history/search chapter',async()=>{
    await ensureDataLoaded();
    for(const chapter of bank.chapters.filter(c=>c.bankSection==='past-exams')){const id=chapter.subjects[0].questions[0]?.id;if(!id)continue;const found=findQuestionById(id);expect(found,id).toBeTruthy();expect(found!.chapter.bankSection).toBe('past-exams');}
  });
});
