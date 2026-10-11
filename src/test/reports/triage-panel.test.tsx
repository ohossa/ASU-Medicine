import {it,expect,vi,afterEach} from 'vitest';
import {render,screen,cleanup,fireEvent,waitFor} from '@testing-library/react';
import {TriagePanel} from '../../pages/TriagePanel';
vi.mock('@clerk/clerk-react',()=>({useAuth:()=>({getToken:async()=> 'owner-token'})}));
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('shows shadow mode, keeps all reports accessible and blocks enable without a labelled pilot',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:async()=>({mode:'shadow',metrics:{labelled:0,actionable:0,criticalMisses:0,falseLow:0,recall:null,ready:false},counts:{decision:2,uncertain:3,low:1},pending:3,assessments:[],labels:[],lowReportIds:[],config:{provider:false,dailyLimit:50}})})));
 render(<TriagePanel refresh={0} onRefresh={()=>{}}/>);
 expect(await screen.findByText('Shadow mode')).toBeInTheDocument();expect(screen.getByRole('button',{name:'Enable prioritization'})).toBeDisabled();expect(screen.getByText(/Every report remains visible/)).toBeInTheDocument();expect(screen.getByRole('button',{name:'Review next group'})).toBeDisabled();
});

it('sends closed-report scope only after the owner explicitly selects it',async()=>{
 const calls:any[]=[];
 vi.stubGlobal('fetch',vi.fn(async(_url:any,init:any)=>{if(init?.method==='POST'){calls.push(JSON.parse(init.body));return {ok:true,json:async()=>({processed:false,reason:'No eligible queued groups.'})};}return {ok:true,json:async()=>({mode:'shadow',metrics:{labelled:0,actionable:0,criticalMisses:0,falseLow:0,recall:null,ready:false},counts:{decision:0,uncertain:9,low:0},pending:0,pilotPending:9,assessments:[],labels:[],lowReportIds:[],config:{provider:true,dailyLimit:50}})};}));
 render(<TriagePanel refresh={0} onRefresh={()=>{}}/>);
 expect(await screen.findByText(/9 historical groups/)).toBeInTheDocument();
 const scope=screen.getByRole('checkbox',{name:/Include closed reports/});expect(scope).not.toBeChecked();
 fireEvent.click(scope);fireEvent.click(screen.getByRole('button',{name:'Review next group'}));
 await waitFor(()=>expect(calls[0]).toEqual({includeClosed:true}));
 expect(screen.getByRole('button',{name:'Enable prioritization'})).toBeDisabled();
});
