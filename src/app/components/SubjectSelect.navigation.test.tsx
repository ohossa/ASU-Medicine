import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {SubjectSelect} from './SubjectSelect';
import {historyStorageKey,setHistoryAccount} from '../learning/historyScope';
import {selectedPractice,practiceTopics} from '../learning/customPractice';
import {freezeAttempt} from '../learning/attemptSnapshot';
import type {ChapterData,Question} from '../types';
vi.mock('@clerk/clerk-react',()=>({useAuth:()=>({userId:null,isLoaded:true,getToken:async()=>null})}));
vi.mock('../hooks/useLanguage',()=>({useLanguage:()=>({language:'en',t:(key:string)=>key})}));
vi.mock('../preferences/ShuffleSwitch',()=>({ShuffleSwitch:()=>null}));
const q=(id:string,lecture=1):Question=>({id,type:'mcq',text:id,lecture,subjectColor:'physiology',options:['a','b'],correctIndex:0,explanation:'',contentVersion:'v1'});
const blood:ChapterData={id:1,title:'Erythrocytes & Anemias',subtitle:'',emoji:'',page:0,lectureRange:'',accentColor:'physiology',subjects:[{id:'physiology',name:'Physiology',iconName:'Activity',lectures:'',lectureCount:2,lectureNames:['Anemia','Plasma'],questions:[q('p'),q('pl',2)]},{id:'biochem',name:'Biochemistry',iconName:'FlaskConical',lectures:'',lectureCount:1,lectureNames:['Iron metabolism'],questions:[q('b')]}]};
const learningState=vi.hoisted(()=>({entries:[] as import('../learning/contracts').LearningEntry[]}));
vi.mock('../learning/LearningProvider',()=>({useOptionalLearning:()=>({data:{entries:learningState.entries}})}));
const props={onBack:vi.fn(),onSelectSubject:vi.fn(),onQuickStart:vi.fn()};
afterEach(()=>{cleanup();localStorage.clear();learningState.entries=[];});
it('Blood opens subjects, then only that subject topics; back returns to subject selection',()=>{
 const onBack=vi.fn();render(<SubjectSelect {...props} onBack={onBack} chapter={blood} moduleCode="MBL-2"/>);
 expect(screen.getByRole('heading',{name:'Choose a subject'})).toBeInTheDocument();
 expect(screen.queryByRole('button',{name:'Practice Anemia, 1 question'})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Open Physiology, 2 topics, 2 questions'}));
 expect(screen.getByRole('button',{name:'Practice Anemia, 1 question'})).toBeInTheDocument();
 expect(screen.queryByRole('button',{name:/Practice Iron/})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Back'}));
 expect(screen.getByRole('heading',{name:'Choose a subject'})).toBeInTheDocument();expect(onBack).not.toHaveBeenCalled();
});
it('subject-first GIT topics remain direct, and inline search clears and reports no matches',()=>{
 const git:ChapterData={...blood,title:'Parasitology',subjects:[{...blood.subjects[0],id:'parasitology',name:'Fasciola',lectureNum:1,questions:[q('g')]},{...blood.subjects[0],id:'parasitology',name:'Malaria',lectureNum:2,questions:[q('m')]}]};
 render(<SubjectSelect {...props} chapter={git} moduleCode="MGL-3"/>);
 expect(screen.queryByRole('heading',{name:'Choose a subject'})).toBeNull();
 fireEvent.change(screen.getByRole('searchbox',{name:'Search topics'}),{target:{value:'MALARIA'}});
 expect(screen.getByRole('button',{name:'Practice Malaria, 1 question'})).toBeInTheDocument();expect(screen.queryByRole('button',{name:/Practice Fasciola/})).toBeNull();
 fireEvent.change(screen.getByRole('searchbox'),{target:{value:'xyz-no-match'}});expect(screen.getByText('No topics match your search.')).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Clear topic search'}));expect(screen.getByRole('button',{name:'Practice Fasciola, 1 question'})).toBeInTheDocument();
});
it('large topic offers20/40/whole without changing source IDs or adding unrelated questions',()=>{
 const questions=Array.from({length:51},(_,i)=>q(String(i)));
 const chapter:ChapterData={...blood,title:'The Cell',subjects:[{...blood.subjects[0],id:'histology',name:'Histology',lectureNames:['Membranes'],questions}]};
 const start=vi.fn();render(<SubjectSelect {...props} onSelectSubject={start} chapter={chapter} moduleCode="IHC-1"/>);
 fireEvent.click(screen.getByRole('button',{name:'Practice Membranes, 51 questions'}));
 expect(screen.getByRole('dialog',{name:'Practice Membranes'})).toBeInTheDocument();
 expect(screen.getByRole('button',{name:'40 questions'})).toBeInTheDocument();
 expect(screen.getByRole('button',{name:'Whole topic · 51 questions'})).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'20 questions'}));
 expect(start.mock.calls[0][1].map((q:Question)=>q.id)).toEqual(questions.slice(0,20).map(q=>q.id));
 expect(questions).toHaveLength(51);expect(questions[0].practiceTopic).toBeUndefined();
});

it('the next batch skips a completed batch but resumes an unfinished exact-version batch',()=>{
 setHistoryAccount(null);const questions=Array.from({length:45},(_,i)=>q(String(i)));
 const chapter:ChapterData={...blood,title:'The Cell',subjects:[{...blood.subjects[0],id:'histology',name:'Histology',lectureNames:['Membranes'],questions}]};
 const first=selectedPractice(chapter,practiceTopics(chapter,'IHC-1'),new Set(questions.slice(0,20).map(q=>String(q.id))));
 localStorage.setItem(historyStorageKey(),JSON.stringify([{id:'done',chapterId:1,moduleCode:'IHC-1',subjectName:'Membranes',questionIds:questions.slice(0,20).map(q=>q.id),questionSnapshot:freezeAttempt(first.questions),answers:Object.fromEntries(questions.slice(0,20).map((_,i)=>[i,0])),pct:100}]));
 const start=vi.fn();const view=render(<SubjectSelect {...props} onSelectSubject={start} chapter={chapter} moduleCode="IHC-1"/>);
 fireEvent.click(screen.getByRole('button',{name:'Practice Membranes, 45 questions'}));fireEvent.click(screen.getByRole('button',{name:'20 questions'}));
 expect(start.mock.calls[0][1].map((q:Question)=>q.id)).toEqual(questions.slice(20,40).map(q=>q.id));
 view.unmount();localStorage.setItem(`asu_quiz_session:guest:1:${first.subject.sessionKey}`,JSON.stringify({chapterId:1,subjectName:first.subject.sessionKey,questionIds:first.questions.map(q=>q.id).reverse(),questionVersions:first.questions.map(q=>q.contentVersion).reverse(),answers:{0:0},finished:false,timestamp:5}));
 render(<SubjectSelect {...props} onSelectSubject={start} chapter={chapter} moduleCode="IHC-1"/>);
 fireEvent.click(screen.getByRole('button',{name:'Practice Membranes, 45 questions'}));fireEvent.click(screen.getByRole('button',{name:'20 questions'}));
 expect(start.mock.calls[1][1].map((q:Question)=>q.id)).toEqual(first.questions.map(q=>q.id));
});

it('changed question revisions are not marked completed on cards or in session options',()=>{
 const questions=Array.from({length:21},(_,i)=>q(String(i)));const chapter:ChapterData={...blood,subjects:[{...blood.subjects[0],id:'histology',name:'Histology',lectureNames:['Membranes'],questions}]};
 learningState.entries=questions.map(q=>({moduleCode:'IHC-1',chapterId:1,questionId:String(q.id),contentVersion:'old',topic:'Membranes',subject:'Histology',type:'mcq',correct:true,everCorrect:true,at:'2026-10-12'}));
 render(<SubjectSelect {...props} chapter={chapter} moduleCode="IHC-1"/>);
 expect(screen.queryByText('21/21 answered')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Practice Membranes, 21 questions'}));expect(screen.getByText(/21 not yet practised/)).toBeInTheDocument();
});

it('custom practice stays within the chosen branch and retains its original topic key',()=>{
 const start=vi.fn();render(<SubjectSelect {...props} onSelectSubject={start} chapter={blood} moduleCode="MBL-2"/>);
 fireEvent.click(screen.getByRole('button',{name:'Open Biochemistry, 1 topic, 1 question'}));fireEvent.click(screen.getByRole('button',{name:'Choose topics'}));
 expect(screen.queryByRole('checkbox',{name:'Anemia'})).toBeNull();
 fireEvent.click(screen.getByRole('checkbox',{name:'Iron metabolism'}));fireEvent.click(screen.getByRole('button',{name:'Start practice'}));
 expect(start.mock.calls[0][1].map((q:Question)=>q.id)).toEqual(['b']);
 expect(start.mock.calls[0][1][0].practiceTopic.key).toBe(practiceTopics(blood,'MBL-2')[2].key);
});
