import {it,expect,vi,afterEach} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import {TriagePanel} from '../../pages/TriagePanel';
vi.mock('@clerk/clerk-react',()=>({useAuth:()=>({getToken:async()=> 'owner-token'})}));
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('shows shadow mode, keeps all reports accessible and blocks enable without a labelled pilot',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:async()=>({mode:'shadow',metrics:{labelled:0,actionable:0,criticalMisses:0,falseLow:0,recall:null,ready:false},counts:{decision:2,uncertain:3,low:1},pending:3,assessments:[],labels:[],lowReportIds:[],config:{provider:false,dailyLimit:50}})})));
 render(<TriagePanel refresh={0} onRefresh={()=>{}}/>);
 expect(await screen.findByText('Shadow mode')).toBeInTheDocument();expect(screen.getByRole('button',{name:'Enable prioritization'})).toBeDisabled();expect(screen.getByText(/Every report remains visible/)).toBeInTheDocument();expect(screen.getByRole('button',{name:'Review next group'})).toBeDisabled();
});
