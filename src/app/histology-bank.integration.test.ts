import { beforeAll, describe, expect, it } from 'vitest';
import bank from '../imports/year-1/semester-1/IHC-1.json';
import { validateModuleFile } from '../../data-format-v2/scripts/validate-banks';
import { ensureDataLoaded, getChaptersForModuleAndMode, getModuleQuestionCounts, isModuleActive } from './data';
import type { Question, QuizAnswer } from './types';
import { checkAnswerCorrect } from './utils/quiz';
import { restoreHistoryQuestions } from './utils/historyQuestions';
import {practiceTopics,selectedPractice} from './learning/customPractice';
import { getMissedQuestions } from './utils/missedQuestions';

const canonical=(bank as unknown as {chapters:{subjects:{questions:Question[]}[]}[]}).chapters.flatMap(c=>c.subjects.flatMap(s=>s.questions));
const loaded=(mode:'mcq'|'essay'|'mixed')=>getChaptersForModuleAndMode('IHC-1',mode).flatMap(c=>c.subjects.flatMap(s=>s.questions));

describe('Year 1 Semester 1 Histology intake',()=>{
 beforeAll(async()=>{await ensureDataLoaded();});
 it('activates IHC-1 with the designated book order and separate exam collections',()=>{
  expect(validateModuleFile(bank as Parameters<typeof validateModuleFile>[0])).toEqual([]);
  expect(bank.meta).toMatchObject({moduleCode:'IHC-1',year:1,semester:1,creditPoints:3,totalMarks:60});
  expect(canonical.length).toBeGreaterThan(1000);expect(isModuleActive('IHC-1')).toBe(true);
  expect(bank.chapters.slice(0,5).map(c=>c.title)).toEqual(['Microtechniques and Microscopy','The Cell','Epithelial Tissue','Connective Tissue','Overview']);
  expect(bank.chapters.at(-1)?.title).toBe('Past Exams');
  expect(new Set(canonical.map(q=>q.id)).size).toBe(canonical.length);
 });
 it('preserves every accepted key, special-format answer and topic through the actual loader',()=>{
  const runtime=loaded('mixed');expect(runtime).toHaveLength(canonical.length);
  expect(getModuleQuestionCounts('IHC-1').totalCount).toBe(canonical.length);
  const byId=new Map(runtime.map(q=>[q.id,q]));
  for(const source of canonical){
   const q=byId.get(source.id)!;expect(q,String(source.id)).toBeDefined();
   expect(q.type).toBe(source.type);expect(q.lecture).toBe(source.lecture);expect(q.subjectColor).toBe('histology');
   expect(q.options).toEqual(source.options);expect(q.correctIndex).toBe(source.correctIndex);
   expect(q.pairs).toEqual(source.pairs);expect(q.modelAnswer).toBe(source.modelAnswer);
   expect(q.explanation).toBe(source.explanation);expect(q.text).not.toMatch(/^\d+\s*[-.)]/);
   if(q.type==='mcq'||q.type==='truefalse'){
    expect(checkAnswerCorrect(q,q.correctIndex)).toBe(true);
    expect(checkAnswerCorrect(q,((q.correctIndex??0)+1)%q.options!.length)).toBe(false);
    expect(checkAnswerCorrect(q,undefined)).toBe(false);
   }
  }
  expect(loaded('essay').filter(q=>q.type==='essay')).toHaveLength(2);
  expect(loaded('mcq').some(q=>q.type==='truefalse')).toBe(true);
  expect(loaded('mcq').some(q=>q.type==='matching')).toBe(true);
 });
 it('exposes every book topic as a complete smaller practice session',()=>{
  const chapters=getChaptersForModuleAndMode('IHC-1','mixed');
  const topics=chapters.flatMap(c=>practiceTopics(c,'IHC-1'));
  expect(topics).toHaveLength(60);
  expect(topics.every(t=>t.questions.length>0)).toBe(true);
  expect(topics.reduce((n,t)=>n+t.questions.length,0)).toBe(canonical.length);
  const cell=chapters.find(c=>c.title==='The Cell')!;
  const cellTopics=practiceTopics(cell,'IHC-1');expect(cellTopics).toHaveLength(21);
  expect(Math.max(...cellTopics.map(t=>t.questions.length))).toBeLessThanOrEqual(50);
  for(const chapter of chapters)for(const topic of practiceTopics(chapter,'IHC-1')){
   const run=selectedPractice(chapter,practiceTopics(chapter,'IHC-1'),new Set(topic.questions.map(q=>String(q.id))));
   expect(run.questions.map(q=>q.id)).toEqual(topic.questions.map(q=>q.id));
   expect(run.subject.name).toBe(topic.title);
  }
 });
 it('grades both TF booleans and matching after target shuffle',()=>{
  const qs=loaded('mixed');
  for(const q of qs.filter(q=>q.type==='truefalse')){
   expect(q.options).toEqual(['True','False']);
   expect(checkAnswerCorrect(q,q.correctIndex===0)).toBe(true);
   expect(checkAnswerCorrect(q,q.correctIndex!==0)).toBe(false);
  }
  for(const q of qs.filter(q=>q.type==='matching')){
   const scrambled=q.pairs!.map(p=>p.target).reverse();
   const matches=Object.fromEntries(q.pairs!.map((p,i)=>[i,scrambled.indexOf(p.target)]));
   expect(checkAnswerCorrect(q,{scrambled,matches})).toBe(true);
   expect(checkAnswerCorrect(q,{scrambled,matches:{}})).toBe(false);
  }
 });
 it('keeps selected answers on stable IDs when history is restored from a shuffled bank',()=>{
  const qs=loaded('mcq').filter(q=>q.type==='mcq'||q.type==='truefalse').slice(0,40);
  const answers:Record<number,QuizAnswer>={};
  qs.forEach((q,i)=>{answers[i]=q.type==='truefalse'?q.correctIndex===0:q.correctIndex!;});
  const restored=restoreHistoryQuestions(qs.map(q=>q.id),[...qs].reverse(),answers,[]);
  expect(restored.questions.map(q=>q.id)).toEqual(qs.map(q=>q.id));
  expect(getMissedQuestions(restored.questions,restored.answers)).toEqual([]);
  delete restored.answers[0];expect(getMissedQuestions(restored.questions,restored.answers).map(q=>q.id)).toEqual([qs[0].id]);
 });
});
