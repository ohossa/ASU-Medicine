import {beforeEach,describe,it,expect,vi} from 'vitest';
import {render,screen,fireEvent} from '@testing-library/react';
import {MarksCalculator} from './MarksCalculator';
import {GIT_MARKS_PRESET} from '../lib/marksRules';
vi.mock('../hooks/useTheme',()=>({useTheme:()=>({isDark:true})}));
beforeEach(()=>{localStorage.clear();localStorage.setItem('asu_marks_calculator_selected_preset',JSON.stringify({id:'MGL-3',name:'Old saved GIT layout',sections:[],boundaries:{A:0,B:0,C:0,D:0}}));});
describe('GIT calculator integration',()=>{
 it('upgrades stale saved presets and shows all seven official components',()=>{
 render(<MarksCalculator onBack={()=>{}}/>);
 for(const s of GIT_MARKS_PRESET.sections) expect(screen.getByLabelText(s.name)).toBeInTheDocument();
 expect(screen.getByText(/13 credit points · 260 marks/)).toBeInTheDocument();
 });
 it('never labels a high overall score as guaranteed pass after failing the final',()=>{
 const scores=Object.fromEntries(GIT_MARKS_PRESET.sections.map(s=>[s.id,String(s.id.startsWith('git-final')?0:s.max)]));
 localStorage.setItem('asu_marks_calculator_scores',JSON.stringify({'MGL-3':scores}));
 render(<MarksCalculator onBack={()=>{}}/>);
 expect(screen.getByRole('status')).toHaveTextContent('Final requirement not met');
 expect(screen.getAllByText('Out of Reach')).toHaveLength(4);
 fireEvent.change(screen.getByLabelText('Final — Paper 1'),{target:{value:'36'}});
 fireEvent.change(screen.getByLabelText('Final — Paper 2'),{target:{value:'5.6'}});
 expect(screen.getByRole('status')).toHaveTextContent('Final requirement met');
 });
});
