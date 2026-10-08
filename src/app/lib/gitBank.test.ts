import { describe,it,expect } from 'vitest';
import { canResumeGitSession, toGitTopicChapter } from './gitBank';
import type { Question, ChapterData } from '../types';
const questions=[{id:'q1'},{id:'q2'}] as Question[];
describe('GIT resume safety',()=>{
 it('only resumes the identical ordered question list',()=>{
  expect(canResumeGitSession({questionIds:['q1','q2']},questions)).toBe(true);
  expect(canResumeGitSession({questionIds:['q2','q1']},questions)).toBe(false);
  expect(canResumeGitSession({questionIds:['essay1','essay2']},questions)).toBe(false);
  expect(canResumeGitSession({questionIds:['q1']},questions)).toBe(false);
 });
 it('does not guess question identities for an old saved session',()=>{
  expect(canResumeGitSession({},questions)).toBe(false);
 });
});

describe('GIT history topic restoration',()=>{
 it('keeps topic numbers and question lists when already transformed history is restored',()=>{
  const chapter={id:101,title:'Past exams — Anatomy',subjects:[{id:'anatomy',lectureNames:['Oral cavity','Palate'],questions:[{id:'q1',lecture:1},{id:'q2',lecture:2}]}]} as unknown as ChapterData;
  const once=toGitTopicChapter(chapter);
  expect(toGitTopicChapter(once)).toEqual(once);
  expect(toGitTopicChapter(once).subjects[1].questions[0].id).toBe('q2');
 });
});
