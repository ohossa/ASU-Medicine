import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,within,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router';
import {ChapterSelect} from './ChapterSelect';
vi.mock('../preferences/ShuffleSwitch',()=>({ShuffleSwitch:()=>null}));
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('uses the shared compact full-path navigation for a non-GIT module',async()=>{
 vi.stubGlobal('matchMedia',()=>({matches:true,addEventListener:()=>{},removeEventListener:()=>{}}));const user=userEvent.setup();const back=vi.fn(),year=vi.fn();
 render(<MemoryRouter><ChapterSelect chapters={[]} moduleCode="IHC-1" moduleName="Histology" studyModeName="MCQ" onSelectChapter={vi.fn()} onBackToModeSelect={back} breadcrumbPath={[{label:'Year 1',onClick:year},{label:'Semester 1',onClick:back},{label:'Histology',onClick:back},{label:'Chapters'}]}/></MemoryRouter>);
 expect(screen.getByRole('navigation',{name:'Breadcrumb'})).toBeInTheDocument();expect(screen.queryByRole('button',{name:'Year 1'})).toBeNull();
 await user.click(screen.getByRole('button',{name:'Show full path'}));await user.click(within(screen.getByRole('list',{name:'Full path'})).getByRole('button',{name:'Year 1'}));expect(year).toHaveBeenCalledOnce();
 expect(screen.queryByText(/Subject Colou?r Guide/)).toBeNull();
});
