import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotFoundPage } from './NotFoundPage';

const mockNavigate = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

describe('NotFoundPage (Anti-Average 404 Experience)', () => {
  it('renders 404 heading and diagnosis badge', () => {
    render(<NotFoundPage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404');
    expect(screen.getByText(/DIAGNOSIS: ACUTE 404 SYNDROME/i)).toBeInTheDocument();
    expect(screen.getByText(/Vital Signs Missing · Pathway Not Found/i)).toBeInTheDocument();
  });

  it('provides accessible resuscitation and navigation actions', () => {
    render(<NotFoundPage />);

    const homeBtn = screen.getByRole('button', { name: /Resuscitate Session/i });
    expect(homeBtn).toBeInTheDocument();
    fireEvent.click(homeBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/');

    const learningBtn = screen.getByRole('button', { name: /Learning Hub/i });
    expect(learningBtn).toBeInTheDocument();
    fireEvent.click(learningBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/learning');

    const backBtn = screen.getByRole('button', { name: /Go back to previous page/i });
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('allows interactive pulse stimulation (defibrillation)', () => {
    render(<NotFoundPage />);

    const pulseBtn = screen.getByTitle(/Click to stimulate pulse/i);
    expect(pulseBtn).toHaveTextContent(/72 BPM/i);

    fireEvent.click(pulseBtn);
    expect(pulseBtn).toHaveTextContent(/84 BPM/i);
  });
});
