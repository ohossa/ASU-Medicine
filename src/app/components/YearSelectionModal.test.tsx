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

it('allows dismissing via close button with default Year 3', ()=>{
 const dismiss = vi.fn();
 render(<YearSelectionModal onSelect={vi.fn()} onDismiss={dismiss}/>);
 const closeBtn = screen.getByRole('button', { name: /close and continue as year 3/i });
 fireEvent.click(closeBtn);
 expect(dismiss).toHaveBeenCalledWith(3);
});

it('allows dismissing via skip button with default Year 3', ()=>{
 const dismiss = vi.fn();
 render(<YearSelectionModal onSelect={vi.fn()} onDismiss={dismiss}/>);
 const skipBtn = screen.getByRole('button', { name: /skip for now — continue as year 3/i });
 fireEvent.click(skipBtn);
 expect(dismiss).toHaveBeenCalledWith(3);
});

it('allows entering portal as Year 3 when saving fails', async ()=>{
 const save = vi.fn().mockRejectedValue(new Error('Cloud sync error'));
 const dismiss = vi.fn();
 render(<YearSelectionModal onSelect={save} onDismiss={dismiss}/>);
 fireEvent.click(screen.getByRole('button', { name: /year3 yearDesc3/ }));
 await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
 const fallbackBtn = screen.getByRole('button', { name: /continue to portal as year 3/i });
 fireEvent.click(fallbackBtn);
 expect(dismiss).toHaveBeenCalledWith(3);
});

it('handles Escape key to dismiss as Year 3', ()=>{
 const dismiss = vi.fn();
 render(<YearSelectionModal onSelect={vi.fn()} onDismiss={dismiss}/>);
 fireEvent.keyDown(window, { key: 'Escape' });
 expect(dismiss).toHaveBeenCalledWith(3);
});
