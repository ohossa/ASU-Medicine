import { it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QuestionSearch } from "../components/QuestionSearch";
vi.mock("@clerk/clerk-react", () => ({
  useUser: () => ({ user: { id: "search-test" } }),
}));
vi.mock("../preferences/useAcademicYear", () => ({
  useAcademicYear: () => ({ year: 3, loading: false }),
}));
vi.mock("../learning/LearningProvider", () => ({
  useLearning: () => ({ data: null }),
}));
vi.mock("../reports/ReportQuestion", () => ({
  ReportQuestionButton: () => null,
}));
vi.mock("../components/CorrectionStatus", () => ({ useBankRevision: () => 0 }));

const transition = vi.hoisted(() => ({loaded:false, complete: undefined as (()=>void) | undefined}));
vi.mock("../data",()=>({
 ensureDataLoaded:async()=>{},ensureYearDataLoaded:async(year:number)=>{if(year===1) await new Promise<void>(resolve=>{transition.complete=()=>{transition.loaded=true;resolve();};});},
 SYLLABUS_MODULES:{1:{1:[{code:'EX-1',name:'Destination'}]},3:{1:[{code:'EX-3',name:'Current'}]}},isModuleActive:()=>true,
 getChaptersForModuleAndMode:(code:string)=>(code==='EX-3'||transition.loaded)?[{id:1,title:'Past Exams',bankSection:'past-exams',subjects:[{id:'histology',name:'Histology',questions:[{id:code,type:'mcq',text:code==='EX-3'?'Current exam':'Destination exam',options:['A','B'],correctIndex:0,explanation:'Exam'}]}]}]:[]
}));
it('retains selected exams while destination academic year index is loading',async()=>{
 localStorage.setItem('asu_search_filters:search-test',JSON.stringify({year:'3',collection:'past-exams'}));
 render(<MemoryRouter><QuestionSearch onBack={()=>{}}/></MemoryRouter>);
 await waitFor(()=>expect(screen.getByText('Current exam')).toBeInTheDocument());
 fireEvent.click(screen.getByRole('button',{name:/Filters/i}));
 expect(screen.getByLabelText('Collection')).toHaveValue('past-exams');
 fireEvent.change(screen.getByLabelText('Academic year'),{target:{value:'1'}});
 expect(screen.getByLabelText('Collection')).toHaveValue('past-exams');
 await act(async()=>transition.complete?.());
 await waitFor(()=>expect(screen.getByText('Destination exam')).toBeInTheDocument());
 expect(screen.getByLabelText('Collection')).toHaveValue('past-exams');
});
