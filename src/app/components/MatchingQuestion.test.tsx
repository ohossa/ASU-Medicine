import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MatchingQuestion } from './MatchingQuestion';
import type { MatchingProps } from './MatchingQuestion';

const pairs = [
  { premise: 'Cranial Nerve III', target: 'Oculomotor' },
  { premise: 'Cranial Nerve VI', target: 'Abducens' },
  { premise: 'Cranial Nerve IV', target: 'Trochlear' },
];

const scrambled = ['Abducens', 'Oculomotor', 'Trochlear'];

function makeProps(overrides: Partial<MatchingProps> = {}): MatchingProps {
  return {
    pairs,
    scrambled,
    matches: {},
    submitted: false,
    disabled: false,
    onChange: vi.fn(),
    ...overrides,
  };
}

describe('MatchingQuestion rendering', () => {
  it('renders all premise cards', () => {
    render(<MatchingQuestion {...makeProps()} />);
    expect(screen.getByRole('gridcell', { name: /Cranial Nerve III/i })).toBeInTheDocument();
    expect(screen.getByRole('gridcell', { name: /Cranial Nerve VI/i })).toBeInTheDocument();
    expect(screen.getByRole('gridcell', { name: /Cranial Nerve IV/i })).toBeInTheDocument();
  });

  it('renders all target cards', () => {
    render(<MatchingQuestion {...makeProps()} />);
    expect(screen.getByRole('gridcell', { name: /Abducens/i })).toBeInTheDocument();
    expect(screen.getByRole('gridcell', { name: /Oculomotor/i })).toBeInTheDocument();
    expect(screen.getByRole('gridcell', { name: /Trochlear/i })).toBeInTheDocument();
  });

  it('disables submit button when not all matched', () => {
    render(<MatchingQuestion {...makeProps()} />);
    const btn = screen.getByRole('button', { name: /Lock In Matches/i });
    expect(btn).toBeDisabled();
  });

  it('enables submit button when all matched', () => {
    render(<MatchingQuestion {...makeProps({ matches: { 0: 1, 1: 0, 2: 2 } })} />);
    const btn = screen.getByRole('button', { name: /Lock In Matches/i });
    expect(btn).toBeEnabled();
  });

  it('does not render submit button after submission', () => {
    render(<MatchingQuestion {...makeProps({ submitted: true, matches: { 0: 1, 1: 0, 2: 2 } })} />);
    expect(screen.queryByRole('button', { name: /Lock In Matches/i })).not.toBeInTheDocument();
  });
});

describe('MatchingQuestion tap-to-match', () => {
  it('selects a premise on click and then matches it to a target', () => {
    const onChange = vi.fn();
    render(<MatchingQuestion {...makeProps({ onChange })} />);

    const premise = screen.getByRole('button', { name: /Cranial Nerve III/i });
    fireEvent.click(premise);

    const target = screen.getByRole('button', { name: /Oculomotor/i });
    fireEvent.click(target);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        matches: expect.objectContaining({ 0: 1 }),
        submitted: false,
      })
    );
  });

  it('deselects the same premise on second click', () => {
    const onChange = vi.fn();
    render(<MatchingQuestion {...makeProps({ onChange })} />);

    const premise = screen.getByRole('button', { name: /Cranial Nerve III/i });
    fireEvent.click(premise);
    fireEvent.click(premise);

    // clicking target while no premise is selected should not fire onChange
    const target = screen.getByRole('button', { name: /Oculomotor/i });
    fireEvent.click(target);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('removes a match when clicking the × icon', () => {
    const onChange = vi.fn();
    render(<MatchingQuestion {...makeProps({ matches: { 0: 1 }, onChange })} />);

    const removeBtn = screen.getByLabelText(/Remove match/i);
    fireEvent.click(removeBtn);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        matches: {},
        submitted: false,
      })
    );
  });
});

describe('MatchingQuestion submit', () => {
  it('calls onChange with submitted=true when all matched and submit clicked', () => {
    const onChange = vi.fn();
    render(<MatchingQuestion {...makeProps({ matches: { 0: 1, 1: 0, 2: 2 }, onChange })} />);

    const btn = screen.getByRole('button', { name: /Lock In Matches/i });
    fireEvent.click(btn);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        submitted: true,
      })
    );
  });
});

describe('MatchingQuestion keyboard navigation', () => {
  it('matches a premise to a target via Enter key', () => {
    const onChange = vi.fn();
    render(<MatchingQuestion {...makeProps({ onChange })} />);

    const premise = screen.getByRole('button', { name: /Cranial Nerve III/i });
    fireEvent.keyDown(premise, { key: 'Enter' });

    const target = screen.getByRole('button', { name: /Oculomotor/i });
    fireEvent.keyDown(target, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        matches: expect.objectContaining({ 0: 1 }),
      })
    );
  });

  it('deselects via Escape', () => {
    const onChange = vi.fn();
    render(<MatchingQuestion {...makeProps({ onChange })} />);

    const premise = screen.getByRole('button', { name: /Cranial Nerve III/i });
    fireEvent.keyDown(premise, { key: 'Enter' });
    fireEvent.keyDown(premise, { key: 'Escape' });

    const target = screen.getByRole('button', { name: /Oculomotor/i });
    fireEvent.keyDown(target, { key: 'Enter' });

    // Escape cleared the selection, so target Enter should do nothing
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('MatchingQuestion post-submission state', () => {
  it('shows correct styling for correct matches', () => {
    const matches = { 0: 1, 1: 0, 2: 2 }; // all correct
    render(<MatchingQuestion {...makeProps({ submitted: true, matches })} />);

    const premise = screen.getByRole('button', { name: /Cranial Nerve III, Matched/i });
    expect(premise).toBeInTheDocument();
  });

  it('shows correction list for wrong matches', () => {
    const matches = { 0: 0, 1: 1, 2: 2 }; // 0 is wrong (CN III should be Oculomotor not Abducens)
    render(<MatchingQuestion {...makeProps({ submitted: true, matches })} />);

    expect(screen.getAllByText(/Cranial Nerve III/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Oculomotor/i).length).toBeGreaterThan(0);
  });
});

describe('MatchingQuestion disabled state', () => {
  it('prevents interaction when disabled', () => {
    const onChange = vi.fn();
    render(<MatchingQuestion {...makeProps({ disabled: true, onChange })} />);

    const premise = screen.getByRole('button', { name: /Cranial Nerve III/i });
    fireEvent.click(premise);

    const target = screen.getByRole('button', { name: /Oculomotor/i });
    fireEvent.click(target);

    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('MatchingQuestion drag ghost', () => {
  it('does not show a drag ghost initially', () => {
    render(<MatchingQuestion {...makeProps()} />);
    expect(document.querySelector('.z-50.pointer-events-none')).not.toBeInTheDocument();
  });
});
