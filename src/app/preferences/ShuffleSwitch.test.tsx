import {describe,it,expect,vi,beforeEach} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {ShuffleSwitch} from './ShuffleSwitch';
const identity=vi.hoisted(()=>({id:'student-a'}));
vi.mock('@clerk/clerk-react',()=>({useUser:()=>({user:identity})}));
vi.mock('../hooks/useCloudSync',()=>({triggerCloudSync:vi.fn()}));
beforeEach(()=>{localStorage.clear();identity.id='student-a';});
describe('account shuffle preference',()=>{it('persists, updates all switches and isolates account changes',()=>{let view=render(<><ShuffleSwitch/><ShuffleSwitch/></>);fireEvent.click(screen.getAllByRole('switch')[0]);for(const button of screen.getAllByRole('switch'))expect(button).toHaveAttribute('aria-checked','true');cleanup();view=render(<ShuffleSwitch/>);expect(screen.getByRole('switch')).toHaveAttribute('aria-checked','true');identity.id='student-b';view.rerender(<ShuffleSwitch/>);cleanup();render(<ShuffleSwitch/>);expect(screen.getByRole('switch')).toHaveAttribute('aria-checked','false');});});
