import {fireEvent,render,screen,within} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {describe,it,expect,vi} from 'vitest';
import {ChapterSelect} from './ChapterSelect';
import type {ChapterData} from '../types';
vi.mock('../preferences/ShuffleSwitch',()=>({ShuffleSwitch:()=>null}));
const chapter={id:201,title:'DNA Replication',subtitle:'Additional topic · Beyond the study guide contents',emoji:'📚',page:0,lectureRange:'1 topic',accentColor:'biochem',subjects:[]} as ChapterData;
describe('IBM chapter provenance labels',()=>{
 it('shows additional-topic provenance without exposing internal chapter IDs as sequence numbers',()=>{
  render(<MemoryRouter><ChapterSelect chapters={[chapter]} moduleCode="IBM-1" moduleName="Biochemistry" studyModeName="MCQ" onSelectChapter={()=>{}} onBackToModeSelect={()=>{}}/></MemoryRouter>);
  expect(screen.getByText(chapter.subtitle)).toBeInTheDocument();expect(screen.getByText('#1')).toBeInTheDocument();expect(screen.queryByText('#201')).toBeNull();
 });
});

it('keeps past exams above the mixed card and syllabus in every module',()=>{
 const past={...chapter,id:9,title:'Past Exams',subjects:[{id:'biochem',name:'Biochemistry',iconName:'',lectures:'',lectureCount:1,questions:[{id:'past-1',type:'mcq',text:'Exam?',options:['A','B'],correctIndex:0,explanation:'',subjectColor:'biochem'}]}]} as ChapterData;
 render(<MemoryRouter><ChapterSelect chapters={[chapter,past]} moduleCode="FUTURE-1" moduleName="Future module" studyModeName="MCQ" onSelectChapter={()=>{}} onBackToModeSelect={()=>{}}/></MemoryRouter>);
 const region=screen.getByRole('region',{name:'Past Exams'}), syllabus=screen.getByText('DNA Replication');
 expect(region.compareDocumentPosition(syllabus) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
 expect(screen.getAllByText('Past Exams')).toHaveLength(2);
});

it('hides empty past exams while preserving ordinary empty chapters',()=>{
 render(<MemoryRouter><ChapterSelect chapters={[chapter,{...chapter,id:9,title:'Past Exams',bankSection:'past-exams'}]} moduleCode="FUTURE-1" moduleName="Future" studyModeName="Essay" onSelectChapter={()=>{}} onBackToModeSelect={()=>{}}/></MemoryRouter>);
 expect(screen.queryByRole('region',{name:'Past Exams'})).toBeNull();
 expect(screen.queryByText('Past Exams')).toBeNull();
 expect(screen.getByText('DNA Replication')).toBeInTheDocument();
});

it('shows one MUG-3 Past Exams block with links to the original chapters', () => {
 const past = (id: number, title: string, ids: string[]): ChapterData => ({
  ...chapter, id, title, bankSection: 'past-exams',
  subjects: [{id:'biochem',name:'Biochemistry',iconName:'',lectures:'',lectureCount:1,
   questions: ids.map(id => ({id,type:'mcq',text:'Exam?',lecture:1,options:['A','B'],correctIndex:0,explanation:'',subjectColor:'biochem'}))}],
 });
 const ca1 = {...past(103, 'CA-1 — Physiology', ['exam-1']), examPeriod:'ca-1' as const};
 const ca2 = {...past(201, 'CA-2 — Anatomy & Embryology', ['exam-2','exam-3']), examPeriod:'ca-2' as const};
 const finals = past(301, 'Past Final Papers & Essays', ['exam-4']);
 const empty = past(208, 'CA-2 — Parasitology', []);
 const select = vi.fn();
 render(<MemoryRouter><ChapterSelect chapters={[chapter,ca1,ca2,empty,finals]} moduleCode="MUG-3" moduleName="Urogenital" studyModeName="MCQ" onSelectChapter={select} onBackToModeSelect={()=>{}}/></MemoryRouter>);
 const region = screen.getByRole('region', {name:'Past Exams'});
 const disclosure = region.querySelector('details')!;
 expect(disclosure).toBeInTheDocument();
 expect(disclosure.open).toBe(false);
 expect(disclosure.querySelector('summary')).toHaveTextContent('4 questions');
 expect(screen.getAllByRole('region', {name:'Past Exams'})).toHaveLength(1);
 fireEvent.click(disclosure.querySelector('summary')!);
 expect(disclosure.open).toBe(true);
 const ca1Block = within(region).getByRole('group', { name: /Continuous Assessment 1/ });
 const ca2Block = within(region).getByRole('group', { name: /Continuous Assessment 2/ });
 const finalsBlock = within(region).getByRole('group', { name: /Past Final Papers/ });
 expect(within(ca1Block).getByRole('button', { name: /CA-1/ })).toBeInTheDocument();
 expect(within(ca2Block).getByRole('button', { name: /CA-2/ })).toBeInTheDocument();
 expect(within(finalsBlock).getByRole('button', { name: /Past Final/ })).toBeInTheDocument();
 expect(within(region).queryByRole('button', { name: /Parasitology/ })).toBeNull();
 for (const original of [ca1, ca2, finals]) {
  fireEvent.click(within(region).getByRole('button',{name:new RegExp(original.title)}));
  expect(select).toHaveBeenLastCalledWith(original);
 }
});
