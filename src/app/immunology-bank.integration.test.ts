import {beforeAll,describe,it,expect} from 'vitest';
import bank from '../imports/year-1/semester-1/MIM-1.json';
import {validateModuleFile} from '../../data-format-v2/scripts/validate-banks';
import {ensureDataLoaded,getChaptersForModuleAndMode,getModuleQuestionCounts,isModuleActive,SYLLABUS_MODULES} from './data';
import type {Question,QuizAnswer} from './types';
import {checkAnswerCorrect} from './utils/quiz';
import {restoreHistoryQuestions} from './utils/historyQuestions';
import {getMissedQuestions} from './utils/missedQuestions';
import {practiceTopics,selectedPractice} from './learning/customPractice';
import {sessionMatchesQuestions} from './preferences/shuffle';
const canonical=(bank as unknown as {chapters:{subjects:{questions:Question[]}[]}[]}).chapters.flatMap(c=>c.subjects.flatMap(s=>s.questions));
const loaded=()=>getChaptersForModuleAndMode('MIM-1','mixed').flatMap(c=>c.subjects.flatMap(s=>s.questions));
describe('Year 1 Semester 1 Immunology intake',()=>{
 beforeAll(async()=>{await ensureDataLoaded();});
 it('activates the complete book-organized bank and preserves unique IDs',()=>{
  expect(validateModuleFile(bank as Parameters<typeof validateModuleFile>[0])).toEqual([]);
  expect(bank.meta).toMatchObject({moduleCode:'MIM-1',year:1,semester:1,creditPoints:3,totalMarks:60});
  expect(canonical.length).toBeGreaterThan(600);expect(isModuleActive('MIM-1')).toBe(true);
  expect(bank.chapters.slice(0,13).map(c=>c.title)).toEqual(['Overview of Immune System: Cells and Organs','Innate Immunity','Antigens and Self-Molecules','Cell Mediated Immune Response','Humoral Immune Response','The Complement','Immunization','Immunity to Microbes','Hypersensitivity','Tolerance and Autoimmunity','Transplantation','Tumor Immunology','Immunodeficiency Diseases']);
  expect(bank.chapters.at(-1)?.title).toBe('Past Exams');expect(new Set(canonical.map(q=>q.id)).size).toBe(canonical.length);
 });
 it('hides empty exam chapters in every module and study mode while retaining real exams',()=>{
  for(const semesters of Object.values(SYLLABUS_MODULES))for(const modules of Object.values(semesters))for(const module of modules)for(const mode of ['mcq','essay','mixed'] as const){
   for(const chapter of getChaptersForModuleAndMode(module.code,mode).filter(c=>c.bankSection==='past-exams'||/past exams/i.test(c.title)))expect(chapter.subjects.some(s=>s.questions.length>0),module.code+':'+mode).toBe(true);
  }
  expect(getChaptersForModuleAndMode('MIM-1','essay').some(c=>c.title==='Past Exams')).toBe(false);
  for(const mode of ['mcq','mixed'] as const)expect(getChaptersForModuleAndMode('MIM-1',mode).find(c=>c.title==='Past Exams')?.subjects.flatMap(s=>s.questions)).toHaveLength(15);
 });
 it('retains every reviewed answer, explanation, child and version through runtime conversion',()=>{
  const runtime=loaded();expect(runtime).toHaveLength(canonical.length);expect(getModuleQuestionCounts('MIM-1').totalCount).toBe(canonical.length);const byId=new Map(runtime.map(q=>[q.id,q]));
  for(const source of canonical){const q=byId.get(source.id)!;expect(q,String(source.id)).toBeDefined();expect(q.type).toBe(source.type);expect(q.text).toBe(source.text);expect(q.lecture).toBe(source.lecture);expect(q.subjectColor).toBe('microbiology');expect(q.options).toEqual(source.options);expect(q.correctIndex).toBe(source.correctIndex);expect(q.modelAnswer).toEqual(source.modelAnswer);expect(q.explanation).toBe(source.explanation);expect(q.contentVersion).toBe(source.contentVersion);
   if(q.type==='mcq'){expect(checkAnswerCorrect(q,q.correctIndex)).toBe(true);expect(checkAnswerCorrect(q,((q.correctIndex??0)+1)%q.options!.length)).toBe(false);expect(checkAnswerCorrect(q,undefined)).toBe(false);}
   if(q.type==='case'){expect(q.subQuestions).toEqual(source.subQuestions);for(const child of q.subQuestions??[]){expect(child.modelAnswer?.length).toBeGreaterThan(15);expect(child.explanation?.length).toBeGreaterThan(15);}}
  }
  expect(runtime.filter(q=>q.type==='case').flatMap(q=>q.subQuestions??[])).toHaveLength(17);
 });
 it('exposes nonempty concept topics including 20/40/whole-topic selections',()=>{
  const chapters=getChaptersForModuleAndMode('MIM-1','mixed');const topics=chapters.flatMap(c=>practiceTopics(c,'MIM-1'));expect(topics.length).toBeGreaterThan(35);expect(topics.every(t=>t.questions.length>0)).toBe(true);expect(topics.reduce((n,t)=>n+t.questions.length,0)).toBe(canonical.length);
  for(const chapter of chapters)for(const topic of practiceTopics(chapter,'MIM-1'))for(const count of [20,40,topic.questions.length]){const subset=topic.questions.slice(0,count);const run=selectedPractice(chapter,practiceTopics(chapter,'MIM-1'),new Set(subset.map(q=>String(q.id))));expect(run.questions.map(q=>q.id)).toEqual(subset.map(q=>q.id));expect(run.subject.name).toBe(topic.title);}
 });
 it('keeps answers on stable IDs and rejects changed-version resumes',()=>{
  const qs=loaded().filter(q=>q.type==='mcq').slice(0,40);const answers:Record<number,QuizAnswer>={};qs.forEach((q,i)=>{answers[i]=q.correctIndex!;});const restored=restoreHistoryQuestions(qs.map(q=>q.id),[...qs].reverse(),answers,[]);expect(restored.questions.map(q=>q.id)).toEqual(qs.map(q=>q.id));expect(getMissedQuestions(restored.questions,restored.answers)).toEqual([]);delete restored.answers[0];expect(getMissedQuestions(restored.questions,restored.answers).map(q=>q.id)).toEqual([qs[0].id]);
  const saved={questionIds:qs.map(q=>q.id),questionVersions:qs.map(q=>q.contentVersion!)};expect(sessionMatchesQuestions(qs,saved)).toBe(true);expect(sessionMatchesQuestions(qs,{...saved,questionVersions:saved.questionVersions.map((v,i)=>i===0?'changed':v)})).toBe(false);
 });
});
