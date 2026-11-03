import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Dashboard from './Dashboard';
import { saveHomeSnapshot, getHomeSnapshot } from '../app/cache/homeSnapshot';

vi.mock('../app/components/PortalShell', () => ({ PortalShell: ({ children }: any) => <>{children}</> }));
vi.mock('../components/cards/PremiumCards', () => ({ CardShell: ({ children, onClick }: any) => <article onClick={onClick}>{children}</article> }));
vi.mock('../app/theme/subjectThemes', () => ({ applySubjectTheme: vi.fn(() => ({ accent: '#a855f7' })) }));
vi.mock('../app/lib/pulseEngine', () => ({ pulse: { burst: vi.fn() } }));
vi.mock('../app/utils/storage', () => ({ getQuizHistory: () => [] }));

describe('Dashboard home snapshot hydration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('hydrates active carousel index and student year from snapshot synchronously', () => {
    saveHomeSnapshot({ studentYear: 2, activeCarouselIndex: 1 });
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'Go to Year 2' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Go to Year 1' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('updates the home snapshot when studentYear changes or carousel index is switched', () => {
    render(
      <MemoryRouter>
        <Dashboard studentYear={1} />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'Go to Year 1' })).toHaveAttribute('aria-pressed', 'true');
    let snap = getHomeSnapshot();
    expect(snap.studentYear).toBe(1);
    expect(snap.activeCarouselIndex).toBe(0);

    // Switch to Year 3 via indicator button
    fireEvent.click(screen.getByRole('button', { name: 'Go to Year 3' }));
    snap = getHomeSnapshot();
    expect(snap.activeCarouselIndex).toBe(2);
    expect(snap.studentYear).toBe(3);
  });
});
