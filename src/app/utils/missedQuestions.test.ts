import {describe,it,expect} from 'vitest';
import {getMissedQuestions,missedPracticeSubject} from './missedQuestions';
import type {Question,SubjectData} from '../types';
const q=(id:string,type:Question['type']='mcq',extra:Partial<Question>={}):Question=>({id,type,lecture:1,text:id,options:['A','B'],correctIndex:0,subjectColor:'anatomy',explanation:'',...extra});
describe('missed-question practice',()=>{
 it('excludes correct true/false selections from retry practice',()=>{
  const questions=[q('true','truefalse'),q('false','truefalse',{correctIndex:1}),q('wrong','truefalse')];
  expect(getMissedQuestions(questions,{0:true,1:false,2:false})).toEqual([questions[2]]);
 });
 it('retains wrong and skipped questions in order, without mutating IDs/options',()=>{
  const questions=[q('correct'),q('wrong'),q('skipped')];
  expect(getMissedQuestions(questions,{0:0,1:1})).toEqual([questions[1],questions[2]]);
  expect(questions.map(q=>q.id)).toEqual(['correct','wrong','skipped']);
 });
 it('uses the existing grading rules for every supported format and keeps whole cases',()=>{
  const questions=[q('essay','essay'),q('blank','fillblank',{blanks:['ileum'],acceptedAnswers:[['terminal ileum']]}),q('match','matching',{pairs:[{premise:'A',target:'B'}]}),q('case','case',{subQuestions:[{id:'s1',type:'mcq',text:'part',correctIndex:0,explanation:''},{id:'s2',type:'essay',text:'part 2',modelAnswer:'answer',explanation:''}]})];
  const answers:any={0:{selfGrade:'correct'},1:{inputs:['terminal ileum'],submitted:true},2:{scrambled:['B'],matches:{0:0},submitted:true},3:{s1:0,s2:{selfGrade:'incorrect'}}};
  expect(getMissedQuestions(questions,answers)).toEqual([questions[3]]);
  expect(getMissedQuestions(questions,{...answers,3:{s1:0,s2:{selfGrade:'correct'}}})).toEqual([]);
 });
 it('gives retry practice a distinct session/history label without growing suffixes',()=>{
  const subject:SubjectData={id:'anatomy',name:'Oral cavity',iconName:'Bone',lectures:'',lectureCount:1,questions:[q('a'),q('b')]};
  const retry=missedPracticeSubject(subject,[q('b')],'anatomy');
  expect(retry.name).toBe('Oral cavity · Missed questions');expect(retry.questions).toHaveLength(1);expect(subject.name).toBe('Oral cavity');
  expect(missedPracticeSubject(retry,[q('b')],'anatomy').name).toBe(retry.name);
 });
});
