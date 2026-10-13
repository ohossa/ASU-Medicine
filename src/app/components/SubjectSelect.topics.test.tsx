import {afterEach,describe,it,expect,vi} from 'vitest';
import {cleanup,render,screen,fireEvent} from '@testing-library/react';
import {SubjectSelect} from './SubjectSelect';
import {SoundToggle} from './SoundToggle';
import {ChapterSelect} from './ChapterSelect';
import {MemoryRouter} from 'react-router';
import {resumeCustomPractice} from '../learning/customPractice';
import type {ChapterData} from '../types';
vi.mock('@clerk/clerk-react',()=>({useAuth:()=>({userId:null,isLoaded:true,getToken:async()=>null})}));
vi.mock('../hooks/useLanguage',()=>({useLanguage:()=>({language:'en',t:(key:string)=>key})}));
vi.mock('../preferences/ShuffleSwitch',()=>({ShuffleSwitch:()=>null}));
const chapter:ChapterData={id:2,title:'The Cell',subtitle:'The Cell',emoji:'🔬',page:8,lectureRange:'Book topics',accentColor:'histology',subjects:[{id:'histology',name:'Histology',iconName:'Microscope',lectures:'',lectureCount:4,lectureNames:['Membranes','Mitochondria','Lysosomes','Empty'],questions:[
 {id:'a',type:'mcq',text:'Membrane question',lecture:1,subjectColor:'histology',options:['A','B'],correctIndex:1,explanation:'Membrane explanation.'},
 {id:'b',type:'mcq',text:'Mito question',lecture:2,subjectColor:'histology',options:['A','B'],correctIndex:0,explanation:'Mitochondrial explanation.'},
 {id:'c',type:'truefalse',text:'Lysosome question',lecture:3,subjectColor:'histology',options:['True','False'],correctIndex:1,explanation:'Lysosome explanation.'},
 {id:'d',type:'mcq',text:'Another mito question',lecture:2,subjectColor:'histology',options:['A','B'],correctIndex:1,explanation:'Mitochondrial explanation.'}]}]};
afterEach(()=>{cleanup();localStorage.clear();});
describe('chapter → topic navigation',()=>{
 it('shows every book topic directly and starts only its questions',()=>{
  const start=vi.fn();render(<SubjectSelect chapter={chapter} moduleCode="IHC-1" onBack={vi.fn()} onSelectSubject={start} onQuickStart={vi.fn()}/>);
  expect(screen.queryByRole('heading',{name:'Histology'})).toBeNull();
  const button=screen.getByRole('button',{name:'Practice Mitochondria, 2 questions'});
  expect(screen.getByRole('button',{name:'Practice Membranes, 1 question'})).toBeEnabled();
  expect(screen.getByRole('button',{name:'Practice Lysosomes, 1 question'})).toBeEnabled();
  expect(screen.getByRole('button',{name:'Empty, no questions in this mode'})).toBeDisabled();
  fireEvent.click(button);const [subject,questions]=start.mock.calls[0];
  expect(subject.name).toBe('Mitochondria');expect(subject.id).toBe('histology');
  expect(questions.map((q:{id:string})=>q.id)).toEqual(['b','d']);
  expect(questions.every((q:{practiceTopic:{title:string}})=>q.practiceTopic.title==='Mitochondria')).toBe(true);
  expect(resumeCustomPractice(chapter,{subjectName:subject.sessionKey,questionIds:['d','b']},'IHC-1')?.questions.map(q=>q.id)).toEqual(['d','b']);
  expect(chapter.subjects[0].questions).toHaveLength(4);expect(chapter.subjects[0].questions[1].practiceTopic).toBeUndefined();
 });
 it('keeps the subject colour legend out of every module navigation',()=>{
  render(<MemoryRouter><ChapterSelect chapters={[chapter]} moduleCode="IHC-1" moduleName="Histology" studyModeName="MCQ" onSelectChapter={vi.fn()} onBackToModeSelect={vi.fn()}/></MemoryRouter>);
  expect(screen.queryByText(/Subject Colou?r Guide/)).toBeNull();
 });
 it('keeps the sound control icon-only, labelled and 44px in both states',()=>{
  const toggle=vi.fn();const {rerender}=render(<SoundToggle muted={false} onToggle={toggle}/>);
  const button=screen.getByRole('button',{name:'Mute sounds'});expect(button.textContent).toBe('');expect(button.querySelector('svg')).not.toBeNull();expect(button.className).toContain('h-11 w-11');
  fireEvent.click(button);expect(toggle).toHaveBeenCalledOnce();
  rerender(<SoundToggle muted={true} onToggle={toggle}/>);
  expect(screen.getByRole('button',{name:'Unmute sounds'}).textContent).toBe('');expect(screen.getByRole('button',{name:'Unmute sounds'})).toHaveAttribute('aria-pressed','false');
 });
});
