import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import {it,expect,vi} from 'vitest';
import {YearSelectionModal} from './YearSelectionModal';
vi.mock('../hooks/useLanguage',()=>({useLanguage:()=>({language:'en',t:(s:string)=>s})}));
it('awaits the cloud save and shows failure without silently completing onboarding',async()=>{
 const save=vi.fn().mockRejectedValue(new Error('cloud unavailable'));
 render(<YearSelectionModal onSelect={save}/>);
 fireEvent.click(screen.getByRole('button',{name:/year2 yearDesc2/}));
 await waitFor(()=>expect(screen.getByRole('alert')).toHaveTextContent('could not be saved'));
 expect(save).toHaveBeenCalledWith(2);expect(screen.getByRole('dialog')).toBeInTheDocument();
 expect(screen.getByRole('button',{name:/year2 yearDesc2/})).toBeEnabled();
});
it('traps focus within the modal rather than other page buttons',()=>{
 render(<><button>Page button</button><YearSelectionModal onSelect={vi.fn()}/></>);
 const first=screen.getByRole('button',{name:/year1 yearDesc1/});expect(first).toHaveFocus();
 fireEvent.keyDown(window,{key:'Tab',shiftKey:true});expect(screen.getByRole('button',{name:/year5 yearDesc5/})).toHaveFocus();
});
it('describes browser-only saving in local preview',()=>{
 render(<YearSelectionModal onSelect={vi.fn()} localPreview/>);
 expect(screen.getByText(/Local preview.*this browser/i)).toBeInTheDocument();
 expect(screen.queryByText(/across devices/)).toBeNull();
});
