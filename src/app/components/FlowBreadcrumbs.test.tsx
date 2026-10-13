import {afterEach,describe,it,expect,vi} from 'vitest';
import {render,screen,within,cleanup,act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {FlowBreadcrumbs} from './FlowBreadcrumbs';
function viewport(compact:boolean){
 vi.stubGlobal('matchMedia',()=>({matches:compact,media:'(max-width: 640px)',addEventListener:()=>{},removeEventListener:()=>{}}));
}
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
const labels=['Year 1','Semester 1','Introduction to Histology & Cell Biology','Microtechniques and Microscopy'];
describe('responsive flow breadcrumbs',()=>{
 it('shows only the parent and current location on compact screens until full path is opened',async()=>{
  viewport(true);const user=userEvent.setup();render(<FlowBreadcrumbs crumbs={labels.map(label=>({label}))}/>);
  expect(screen.queryByText('Year 1')).toBeNull();expect(screen.queryByText('Semester 1')).toBeNull();
  expect(screen.getByText(labels[2])).toBeInTheDocument();expect(screen.getByText(labels[3])).toHaveAttribute('aria-current','page');
  await user.click(screen.getByRole('button',{name:'Show full path'}));
  const full=screen.getByRole('list',{name:'Full path'});expect(within(full).getByText('Year 1')).toBeInTheDocument();expect(within(full).getByText('Semester 1')).toBeInTheDocument();
 });
 it('makes every ancestor reachable from the compact menu and preserves navigation wrapping',async()=>{
  viewport(true);const user=userEvent.setup();const action=vi.fn();const navigate=vi.fn((callback:()=>void)=>callback());
  render(<FlowBreadcrumbs crumbs={[{label:'Year 1',onClick:action},{label:'Semester 1',onClick:action},{label:'Histology',onClick:action},{label:'Topics'}]} onNavigate={navigate}/>);
  const trigger=screen.getByRole('button',{name:'Show full path'});trigger.focus();await user.keyboard('{Enter}');
  const full=screen.getByRole('list',{name:'Full path'});const ancestor=within(full).getByRole('button',{name:'Semester 1'});ancestor.focus();await user.keyboard('{Enter}');
  expect(action).toHaveBeenCalledOnce();expect(navigate).toHaveBeenCalledOnce();expect(screen.queryByRole('list',{name:'Full path'})).toBeNull();
 });
 it('dismisses with Escape and restores focus to the full-path trigger',async()=>{
  viewport(true);const user=userEvent.setup();render(<FlowBreadcrumbs crumbs={labels.map(label=>({label,onClick:()=>{}}))}/>);
  const trigger=screen.getByRole('button',{name:'Show full path'});await user.click(trigger);
  within(screen.getByRole('list',{name:'Full path'})).getByRole('button',{name:'Year 1'}).focus();await user.keyboard('{Escape}');
  expect(screen.queryByRole('list',{name:'Full path'})).toBeNull();expect(trigger).toHaveFocus();
 });
 it('keeps the complete familiar desktop path and original ancestor callbacks',async()=>{
  viewport(false);const user=userEvent.setup();const action=vi.fn();render(<FlowBreadcrumbs crumbs={[{label:'Year 1',onClick:action},...labels.slice(1).map(label=>({label}))]}/>);
  for(const label of labels)expect(screen.getByText(label)).toBeInTheDocument();expect(screen.queryByRole('button',{name:'Show full path'})).toBeNull();
  await user.click(screen.getByRole('button',{name:'Year 1'}));expect(action).toHaveBeenCalledOnce();
 });
 it('labels the compact full path in Arabic and keeps the current-location semantic in RTL',async()=>{
  viewport(true);const user=userEvent.setup();render(<FlowBreadcrumbs rtl crumbs={[{label:'السنة الأولى',onClick:()=>{}},{label:'الفصل الأول',onClick:()=>{}},{label:'علم الأنسجة'}]}/>);
  expect(screen.getByText('علم الأنسجة')).toHaveAttribute('aria-current','page');await user.click(screen.getByRole('button',{name:'عرض المسار الكامل'}));
  expect(within(screen.getByRole('list',{name:'المسار الكامل'})).getByRole('button',{name:'السنة الأولى'})).toBeInTheDocument();
 });
});
it('lets keyboard users move through all ancestors and dismiss by clicking outside',async()=>{
 viewport(true);const user=userEvent.setup();render(<><FlowBreadcrumbs crumbs={labels.map((label,i)=>({label,onClick:i<3?()=>{}:undefined}))}/><button>Outside</button></>);
 const trigger=screen.getByRole('button',{name:'Show full path'});trigger.focus();await user.keyboard(' ');
 const full=screen.getByRole('list',{name:'Full path'});await user.keyboard('{ArrowDown}');expect(within(full).getByRole('button',{name:'Year 1'})).toHaveFocus();
 await user.keyboard('{End}');expect(within(full).getByRole('button',{name:labels[2]})).toHaveFocus();await user.keyboard('{Home}');expect(within(full).getByRole('button',{name:'Year 1'})).toHaveFocus();
 await user.click(screen.getByRole('button',{name:'Outside'}));expect(screen.queryByRole('list',{name:'Full path'})).toBeNull();expect(screen.getByRole('button',{name:'Outside'})).toHaveFocus();
});

it('adapts to a wider viewport without leaving a compact menu open',async()=>{
 let compact=true;const listeners=new Set<()=>void>();
 vi.stubGlobal('matchMedia',()=>({get matches(){return compact;},addEventListener:(_event:string,listener:()=>void)=>listeners.add(listener),removeEventListener:(_event:string,listener:()=>void)=>listeners.delete(listener)}));
 const user=userEvent.setup();render(<FlowBreadcrumbs crumbs={labels.map(label=>({label}))}/>);await user.click(screen.getByRole('button',{name:'Show full path'}));
 act(()=>{compact=false;listeners.forEach(listener=>listener());window.dispatchEvent(new Event('resize'));});
 expect(screen.queryByRole('button',{name:'Show full path'})).toBeNull();for(const label of labels)expect(screen.getByText(label)).toBeInTheDocument();
});
