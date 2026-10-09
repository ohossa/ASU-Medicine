import {it,expect,vi,afterEach} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import {LanguageProfilePage} from '../../app/components/profile/LanguageProfilePage';
import {createVisibleAnimation} from '../../app/components/ui/visibleAnimation';
vi.mock('../../app/hooks/useLanguage',()=>({useLanguage:()=>({language:'en',toggleLanguage:vi.fn()})}));
afterEach(cleanup);
it('labels the account language selector for keyboard and assistive navigation',()=>{render(<LanguageProfilePage/>);expect(screen.getByRole('combobox',{name:'Language'})).toBeInTheDocument();});
it('pauses decorative frames when hidden or reduced motion and disposes listeners',()=>{
 let reduced=false,hidden=false,next=0;const jobs=new Map<number,FrameRequestCallback>(),cancel=vi.fn((id:number)=>jobs.delete(id));
 const draw=vi.fn();const c=createVisibleAnimation(draw,{request:cb=>{jobs.set(++next,cb);return next;},cancel,reduced:()=>reduced,hidden:()=>hidden});
 c.refresh();expect(jobs.size).toBe(1);hidden=true;c.refresh();expect(jobs.size).toBe(0);hidden=false;reduced=true;c.refresh();expect(draw).toHaveBeenCalledTimes(1);expect(jobs.size).toBe(0);reduced=false;c.refresh();expect(jobs.size).toBe(1);c.stop();expect(jobs.size).toBe(0);c.refresh();expect(jobs.size).toBe(0);
});
