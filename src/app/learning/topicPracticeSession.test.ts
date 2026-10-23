import {describe,it,expect} from 'vitest';
import {findTopicPracticeSession} from './topicPracticeSession';
import type {QuizSessionSave} from '../hooks/useQuizSession';
import type {Question,SubjectData} from '../types';
const topic={key:'oral',title:'Oral cavity',subjectName:'Anatomy'};
const questions:Question[]=[{id:'a',type:'mcq',subjectColor:'anatomy',text:'A',lecture:1,contentVersion:'v1',options:['yes','no'],correctIndex:0,explanation:'A',practiceTopic:topic},{id:'b',type:'mcq',subjectColor:'anatomy',text:'B',lecture:1,contentVersion:'v2',options:['yes','no'],correctIndex:0,explanation:'B',practiceTopic:topic}];
const subject:SubjectData={id:'anatomy',name:'Oral cavity',sessionKey:'custom:2:test',iconName:'Bone',lectures:'Oral cavity',lectureCount:1,questions};
const saved:QuizSessionSave={chapterId:1,subjectName:'Oral cavity',questionIds:['b','a'],questionVersions:['v2','v1'],current:1,answers:{0:1},elapsedSeconds:12,flagged:[0],finished:false,timerMode:'practice',showEssayAnswer:false,timestamp:1};
describe('legacy named-topic continuation',()=>{
 it('offers the exact legacy attempt including its saved shuffle order and answers',()=>{
  const restored=findTopicPracticeSession(subject,questions,key=>key==='Oral cavity'?saved:null);
  expect(restored).toEqual(saved);expect(restored?.questionIds).toEqual(['b','a']);expect(restored?.answers).toEqual({0:1});
 });
 it('prefers a valid new-topic attempt over the legacy attempt',()=>{
  const current={...saved,subjectName:subject.sessionKey!,current:0};
  expect(findTopicPracticeSession(subject,questions,key=>key===subject.sessionKey?current:saved)).toEqual(current);
 });
 it.each([
  ['changed content',{...saved,questionVersions:['v3','v1']}],
  ['unversioned draft',{...saved,questionVersions:undefined}],
  ['broad subject attempt',{...saved,questionIds:['b','a','outside'],questionVersions:['v2','v1','v1']}],
  ['duplicate question IDs',{...saved,questionIds:['a','a'],questionVersions:['v1','v1']}],
  ['finished draft',{...saved,finished:true}],
 ])('rejects a %s instead of attaching its answers to the topic',(_name,invalid)=>{
  expect(findTopicPracticeSession(subject,questions,key=>key==='Oral cavity'?invalid:null)).toBeNull();
 });
 it('does not use named-topic fallback for a multi-topic custom selection',()=>{
  const multiple=[questions[0],{...questions[1],practiceTopic:{...topic,key:'palate',title:'Palate'}}];
  expect(findTopicPracticeSession(subject,multiple,key=>key==='Oral cavity'?saved:null)).toBeNull();
 });
});
