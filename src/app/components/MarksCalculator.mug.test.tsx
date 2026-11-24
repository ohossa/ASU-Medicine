import {beforeEach,describe,it,expect,vi} from 'vitest';
import {render,screen,fireEvent} from '@testing-library/react';
import {MarksCalculator} from './MarksCalculator';
import {MUG_MARKS_PRESET} from '../lib/marksRules';

vi.mock('../hooks/useTheme',()=>({useTheme:()=>({isDark:true})}));

describe('Urogenital (MUG-3) marks calculator integration',()=>{
  beforeEach(()=>{
    localStorage.clear();
    localStorage.setItem('asu_marks_calculator_selected_preset', JSON.stringify({
      id: 'MUG-3',
      name: 'Old saved URO layout',
      sections: [],
      boundaries: {A:0,B:0,C:0,D:0}
    }));
  });

  it('upgrades stale saved presets and displays all seven official Urogenital components',()=>{
    render(<MarksCalculator onBack={()=>{}}/>);
    for(const s of MUG_MARKS_PRESET.sections) {
      expect(screen.getByLabelText(s.name)).toBeInTheDocument();
    }
    expect(screen.getByText(/10 credit points · 200 marks/)).toBeInTheDocument();
    expect(screen.getByText(/Pass requires both ≥120 overall and ≥32\/80 across the two final papers/)).toBeInTheDocument();
    expect(screen.getByText('Total: 200 marks')).toBeInTheDocument();
  });

  it('enforces the final exam pass gate (≥32/80 across Paper 1 and Paper 2)',()=>{
    // Enter max marks for all non-final sections (25 + 25 + 40 + 20 + 10 = 120 marks), but 0 in final
    const scores = Object.fromEntries(
      MUG_MARKS_PRESET.sections.map(s => [s.id, String(s.id.startsWith('mug-final') ? 0 : s.max)])
    );
    localStorage.setItem('asu_marks_calculator_scores', JSON.stringify({'MUG-3': scores}));
    render(<MarksCalculator onBack={()=>{}}/>);

    expect(screen.getByRole('status')).toHaveTextContent('Final requirement not met');
    expect(screen.getAllByText('Out of Reach')).toHaveLength(4);

    // Enter 30 in Paper 1 and 2 in Paper 2 = 32/80 (passes gate)
    fireEvent.change(screen.getByLabelText('Final — Paper 1'), {target: {value: '30'}});
    fireEvent.change(screen.getByLabelText('Final — Paper 2'), {target: {value: '2'}});
    expect(screen.getByRole('status')).toHaveTextContent('Final requirement met');
  });

  it('correctly predicts target grades based on 200 total marks boundaries',()=>{
    // Empty scores initially
    localStorage.removeItem('asu_marks_calculator_scores');
    render(<MarksCalculator onBack={()=>{}}/>);

    expect(screen.getByText(/Final: 0\/80 · Pending — 32.00 more final marks needed/)).toBeInTheDocument();

    // Fill CA-1 (25) + CA-2 (25) + Activities (10) + Practical (40 + 20) = 120 marks
    fireEvent.change(screen.getByLabelText('Assessment 1'), {target: {value: '25'}});
    fireEvent.change(screen.getByLabelText('Assessment 2'), {target: {value: '25'}});
    fireEvent.change(screen.getByLabelText('Activities'), {target: {value: '10'}});
    fireEvent.change(screen.getByLabelText('Computer lab'), {target: {value: '40'}});
    fireEvent.change(screen.getByLabelText('Real lab'), {target: {value: '20'}});

    // 120 entered out of 200. Still need final gate (32 marks).
    // Grade A requires 170. Marks needed = 50 marks out of remaining 80 (62.5% -> 63% on remaining).
    expect(screen.getByText('+50 marks needed')).toBeInTheDocument();
  });

  it('renders MUG-3 with Detailed Preset badge on the Year 3 module selection grid',()=>{
    localStorage.clear();
    render(<MarksCalculator onBack={()=>{}} studentYear={3}/>);

    const mugBtn = screen.getByRole('button', {name: /MUG-3.*Urogenital/i});
    expect(mugBtn).toBeInTheDocument();
    expect(mugBtn).toHaveTextContent('Detailed Preset');
    expect(mugBtn).toHaveTextContent('10 CP · 200 Marks total');
  });
});
