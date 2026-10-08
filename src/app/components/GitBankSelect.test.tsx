vi.mock('@clerk/clerk-react',()=>({useUser:()=>({user:null})}));
import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GitBankSelect } from './GitBankSelect';
import { SubjectSelect } from './SubjectSelect';
import { toGitTopicChapter } from '../lib/gitBank';
import type { ChapterData, QuestionCollection } from '../types';
vi.mock('../hooks/useLanguage',()=>({useLanguage:()=>({language:'en',t:(key:string)=>key})}));

const makeChapter=(section:QuestionCollection,id:number):ChapterData=>({id,bankSection:section,title:section==='practice'?'Anatomy':'Past exams — Anatomy',subtitle:'Anatomy',emoji:'📚',page:3,lectureRange:'Topics 1–2',accentColor:'anatomy',subjects:[{id:'anatomy',name:'Anatomy',iconName:'Bone',lectures:'',lectureCount:2,lectureNames:['Oral cavity','Palate'],questions:[{id:section+'-q',type:'mcq',text:'Which structure?',lecture:1,subjectColor:'anatomy',options:['A','B'],correctIndex:0,explanation:''}]}]});
const chapters=[makeChapter('practice',1),makeChapter('past-exams',101)];
function Flow({select=vi.fn(),back=vi.fn()}:{select?:(chapter:ChapterData)=>void;back?:()=>void}){
 const [collection,setCollection]=useState<QuestionCollection>('practice');
 return <GitBankSelect chapters={chapters} collection={collection} onCollectionChange={setCollection} studyModeName="MCQ Practice Mode" onSelectChapter={select} onBackToModeSelect={back}/>;
}
describe('GIT collection and subject navigation',()=>{
 it('starts with regular subjects and a separate past-exams block',()=>{
  const select=vi.fn();render(<Flow select={select}/>);
  expect(screen.getByRole('heading',{name:'Question bank'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:/Anatomy.*1 question/i}));
  expect(select).toHaveBeenCalledWith(chapters[0]);
 });
 it('past-exams block opens subjects before a topic can be selected',()=>{
  const select=vi.fn();render(<Flow select={select}/>);
  fireEvent.click(screen.getByRole('button',{name:/Past exams & recalls.*1 question/i}));
  expect(screen.getByRole('heading',{name:'Past exams & recalls'})).toBeInTheDocument();
  expect(select).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:/Anatomy.*1 question/i}));
  expect(select).toHaveBeenCalledWith(chapters[1]);
 });
 it('back from past exams returns to regular subjects before leaving the mode',()=>{
  const back=vi.fn();render(<Flow back={back}/>);
  fireEvent.click(screen.getByRole('button',{name:/Past exams & recalls.*1 question/i}));
  fireEvent.click(screen.getByRole('button',{name:'Back to question bank'}));
  expect(screen.getByRole('heading',{name:'Question bank'})).toBeInTheDocument();expect(back).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:'Back to study modes'}));expect(back).toHaveBeenCalledOnce();
 });
 it('topics preserve empty chapters as disabled, and a topic starts only its collection questions',()=>{
  const selected=vi.fn();render(<SubjectSelect chapter={toGitTopicChapter(chapters[1])} moduleCode="MGL-3" onBack={vi.fn()} onSelectSubject={selected} onQuickStart={vi.fn()}/>);
  expect(screen.getByText('Chapters / topics')).toBeInTheDocument();
  const topic=screen.getByRole('button',{name:/Oral cavity/i});fireEvent.click(topic);
  expect(selected.mock.calls[0][1].map((q:any)=>q.id)).toEqual(['past-exams-q']);
  expect(screen.getByRole('button',{name:/Palate/i})).toBeDisabled();
  expect(screen.queryByText('Coming Soon...')).not.toBeInTheDocument();
  expect(screen.getByText('No questions in this mode')).toBeInTheDocument();
 });
 it('empty subjects cannot start a quiz',()=>{
  const empty={...chapters[0],subjects:[{...chapters[0].subjects[0],questions:[]}]};
  render(<GitBankSelect chapters={[empty]} collection="practice" onCollectionChange={vi.fn()} studyModeName="Essay Study Mode" onSelectChapter={vi.fn()} onBackToModeSelect={vi.fn()}/>);
  expect(screen.getByRole('button',{name:/Anatomy.*0 questions/i})).toBeDisabled();
 });
});

 describe('GIT interactive breadcrumb header', () => {
  it('lets students jump to ancestors and return from past exams to the regular bank', () => {
    const portal=vi.fn(), semester=vi.fn(), modes=vi.fn(), change=vi.fn();
    const props:any={chapters,collection:'past-exams',onCollectionChange:change,studyModeName:'MCQ Practice Mode',onSelectChapter:vi.fn(),onBackToModeSelect:modes,breadcrumbPath:[{label:'Portal',onClick:portal},{label:'Semester 1',onClick:semester},{label:'MCQ Practice Mode',onClick:modes}]};
    render(<GitBankSelect {...props}/>);
    fireEvent.click(screen.getByRole('button',{name:'Portal'}));expect(portal).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button',{name:'Semester 1'}));expect(semester).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button',{name:'MCQ Practice Mode'}));expect(modes).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button',{name:'Question bank'}));expect(change).toHaveBeenCalledWith('practice');
  });
 });
