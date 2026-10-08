import {describe,it,expect,vi,afterEach} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import AdminQuestionEditor from '../../pages/AdminQuestionEditor';
const refresh=vi.hoisted(()=>vi.fn());
vi.mock('@clerk/clerk-react',()=>({useAuth:()=>({getToken:async()=> 'owner-token',userId:'owner'})}));
vi.mock('../../app/data',()=>({refreshQuestionCorrections:refresh}));
const q={id:'q1',type:'mcq',lecture:1,text:'Which is correct?',options:['One','Two'],correctIndex:0,explanation:'Original explanation'};
afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.clearAllMocks();vi.restoreAllMocks();localStorage.clear();});
function mockAPI(fail=false) {
  const api=vi.fn(async(url:string,request:any)=>({
    ok: !fail || request?.method !== 'PATCH',
    status: fail ? 409 : 200,
    json: async()=> {
      if (url.includes('action=modules')) return {modules:[{code:'MGL-3',name:'GIT',count:1}]};
      if (['PATCH','POST','DELETE'].includes(request?.method)) return fail
        ? {error:'This question was edited in another window. Reload before saving.'}
        : {edit:{question:JSON.parse(request.body).question??q,revision:1}};
      return {questions:[{chapterId:1,chapterTitle:'Anatomy',subjectName:'Anatomy',revision:0,question:q,original:q}],total:1,chapters:[{id:1,title:'Anatomy',subjects:[{id:'anatomy',name:'Anatomy',lectureCount:1,lectureNames:['Oral cavity']}]}]};
    },
  }));
  vi.stubGlobal('fetch',api);
  return api;
}
describe('owner question studio UI',()=>{
 it('edits an answer, includes the expected revision, and refreshes published content',async()=>{const api=mockAPI();render(<MemoryRouter><AdminQuestionEditor/></MemoryRouter>);fireEvent.click(await screen.findByRole('button',{name:/Which is correct/}));fireEvent.click(screen.getByRole('radio',{name:'Correct answer 2'}));fireEvent.click(screen.getByRole('button',{name:'Publish correction'}));await screen.findByText(/Correction published to the question bank/);const request=api.mock.calls.find(([,r])=>r?.method==='PATCH')![1];expect(JSON.parse(request.body)).toMatchObject({questionId:'q1',revision:0,question:{correctIndex:1,id:'q1'}});expect(refresh).toHaveBeenCalledOnce();});
 it('keeps a draft after a rejected stale save and never reports success',async()=>{mockAPI(true);render(<MemoryRouter><AdminQuestionEditor/></MemoryRouter>);fireEvent.click(await screen.findByRole('button',{name:/Which is correct/}));fireEvent.change(screen.getByLabelText('Question prompt'),{target:{value:'My revised question?'}});fireEvent.click(screen.getByRole('button',{name:'Publish correction'}));await screen.findByRole('alert');expect(screen.getByLabelText('Question prompt')).toHaveValue('My revised question?');expect(screen.queryByText(/Correction published to the question bank/)).not.toBeInTheDocument();expect(refresh).not.toHaveBeenCalled();});
 it('restores an account-scoped unsaved draft after leaving the studio',async()=>{
  mockAPI();const first=render(<MemoryRouter><AdminQuestionEditor/></MemoryRouter>);
  fireEvent.click(await screen.findByRole('button',{name:/Which is correct/}));
  fireEvent.change(screen.getByLabelText('Question prompt'),{target:{value:'Saved device draft?'}});
  expect(JSON.parse(localStorage.getItem('asu_admin_draft:owner:MGL-3:1:q1')!).draft.text).toBe('Saved device draft?');
  first.unmount();vi.stubGlobal('confirm',vi.fn(()=>true));
  render(<MemoryRouter><AdminQuestionEditor/></MemoryRouter>);
  fireEvent.click(await screen.findByRole('button',{name:/Which is correct/}));
  expect(screen.getByLabelText('Question prompt')).toHaveValue('Saved device draft?');
  expect(screen.getByText(/unsaved draft was restored/)).toBeInTheDocument();
 });

 it('creates a new question with explicit chapter, subject and lecture routing',async()=>{
  const api=mockAPI();render(<MemoryRouter><AdminQuestionEditor/></MemoryRouter>);
  await screen.findByRole('button',{name:/Which is correct/});fireEvent.click(screen.getByRole('button',{name:'Add question'}));
  fireEvent.change(screen.getByLabelText('Question prompt'),{target:{value:'New exam question?'}});
  fireEvent.change(screen.getByLabelText('Option 1'),{target:{value:'Correct'}});
  fireEvent.change(screen.getByLabelText('Option 2'),{target:{value:'Distractor'}});
  fireEvent.click(screen.getByRole('button',{name:'Publish new question'}));await screen.findByText(/Correction published/);
  const request=api.mock.calls.find(([,r])=>r?.method==='POST')![1];
  expect(JSON.parse(request.body)).toMatchObject({moduleCode:'MGL-3',chapterId:1,subjectId:'anatomy',question:{lecture:1,text:'New exam question?',options:['Correct','Distractor']}});
 });
 it('removes a question reversibly and offers restoration',async()=>{
  const api=mockAPI();vi.stubGlobal('confirm',vi.fn(()=>true));render(<MemoryRouter><AdminQuestionEditor/></MemoryRouter>);
  fireEvent.click(await screen.findByRole('button',{name:/Which is correct/}));fireEvent.click(screen.getByRole('button',{name:'Remove question'}));
  await screen.findByRole('button',{name:'Restore question'});
  const request=api.mock.calls.find(([,r])=>r?.method==='DELETE')![1];expect(JSON.parse(request.body)).toMatchObject({questionId:'q1',revision:0});
  fireEvent.click(screen.getByRole('button',{name:'Restore question'}));await screen.findByText(/Correction published/);
  expect(api.mock.calls.find(([,r])=>r?.method==='PATCH')).toBeDefined();
 });

});
