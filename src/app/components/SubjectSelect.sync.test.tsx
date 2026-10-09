import {it,expect,vi,afterEach} from 'vitest';
import {render,screen,act,cleanup} from '@testing-library/react';
import {SubjectSelect} from './SubjectSelect';
import {LearningProvider} from '../learning/LearningProvider';
import {setHistoryAccount,historyStorageKey} from '../learning/historyScope';
import type {ChapterData} from '../types';
vi.mock('@clerk/clerk-react',()=>({useAuth:()=>({userId:'alice',isLoaded:true,getToken:async()=> 'token'})}));
vi.mock('../hooks/useLanguage',()=>({useLanguage:()=>({language:'en',t:(key:string)=>key})}));
vi.mock('../preferences/ShuffleSwitch',()=>({ShuffleSwitch:()=>null}));
const chapter:ChapterData={id:1,title:'Anatomy',subtitle:'',emoji:'',page:0,lectureRange:'',accentColor:'anatomy',subjects:[{id:'anatomy',name:'Oral cavity',iconName:'Bone',lectures:'',lectureCount:1,questions:[{id:'a',type:'truefalse',text:'One',lecture:1,subjectColor:'anatomy',correctIndex:0,explanation:''},{id:'b',type:'mcq',text:'Two',lecture:1,subjectColor:'anatomy',correctIndex:0,explanation:''}]}]};
const props={chapter,moduleCode:'MGL-3',onBack:vi.fn(),onSelectSubject:vi.fn(),onQuickStart:vi.fn()};
afterEach(()=>{cleanup();localStorage.clear();vi.unstubAllGlobals();});
it('updates topic result when cloud history arrives after the card mounted',async()=>{
 setHistoryAccount('alice');render(<SubjectSelect {...props}/>);
 localStorage.setItem(historyStorageKey(),JSON.stringify([{id:'phone',date:'2026-10-09',chapterId:1,chapterTitle:'Anatomy',subjectName:'Oral cavity',correct:1,total:2,pct:50,moduleCode:'MGL-3'}]));
 act(()=>window.dispatchEvent(new Event('storage')));
 expect(await screen.findByText('50% (1/2)')).toBeInTheDocument();
});
it('shows individually answered cloud questions even before a session finishes',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:async()=>({profile:{xp:5},leaderboard:[],entries:[{moduleCode:'MGL-3',chapterId:1,questionId:'a',subject:'Anatomy',topic:'Oral cavity',type:'truefalse',correct:true,everCorrect:true,at:'2026-10-09'}]})})));
 render(<LearningProvider><SubjectSelect {...props}/></LearningProvider>);
 expect(await screen.findByText('1/2 answered')).toBeInTheDocument();
 expect(screen.queryByText('Completed')).not.toBeInTheDocument();
});
