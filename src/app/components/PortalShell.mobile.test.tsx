import {describe,it,expect,vi} from 'vitest';
import {render,screen,fireEvent} from '@testing-library/react';
import {PortalShell} from './PortalShell';
vi.mock('@clerk/clerk-react',()=>({useUser:()=>({isLoaded:true,isSignedIn:false})}));
vi.mock('../hooks/useLanguage',()=>({useLanguage:()=>({language:'en'})}));
describe('tool navigation on small screens',()=>{
 it('provides a labelled back control even when desktop breadcrumbs are hidden',()=>{
 const back=vi.fn();render(<PortalShell crumbs={[{label:'Portal',onClick:back},{label:'Case Solver'}]}><p>Case content</p></PortalShell>);
 fireEvent.click(screen.getByRole('button',{name:'Back to Portal'}));expect(back).toHaveBeenCalledOnce();
 });
});
