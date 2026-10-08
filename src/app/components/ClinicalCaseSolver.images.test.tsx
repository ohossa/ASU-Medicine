import {describe,it,expect,vi,afterEach} from 'vitest';
import {render,screen,fireEvent} from '@testing-library/react';
import {ClinicalCaseSolver} from './ClinicalCaseSolver';
vi.mock('../hooks/useTheme',()=>({useTheme:()=>({theme:'dark'})}));
vi.mock('./PortalShell',()=>({PortalShell:({children}:any)=><>{children}</>}));
afterEach(()=>vi.restoreAllMocks());
describe('Case Solver reference',()=>{
 it('uses a local Parkinson reference and never reveals the answer in its error fallback',()=>{
 vi.spyOn(Math,'random').mockReturnValue(0.5);
 render(<ClinicalCaseSolver/>);
 const img=screen.getByRole('img',{name:/Educational reference illustration/});
 expect(img).toHaveAttribute('src','/cases/parkinson_dat.svg');
 expect(screen.getByText(/Educational illustration · not a patient image/)).toBeInTheDocument();
 fireEvent.error(img);
 expect(screen.getByText('Reference image could not be loaded').parentElement).toHaveStyle({display:'flex'});
 expect(img).toHaveStyle({display:'none'});
 expect(screen.queryByText("Idiopathic Parkinson's Disease (Hoehn & Yahr Stage 2)")).not.toBeInTheDocument();
 });
});
