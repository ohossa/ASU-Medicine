import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import Dashboard from './Dashboard';
import YearModules from './YearModules';
import { ensureDataLoaded } from '../app/data';
beforeAll(async () => { await ensureDataLoaded(); });

vi.mock('../app/components/PortalShell', () => ({ PortalShell: ({ children }: any) => <>{children}</> }));
vi.mock('../components/cards/PremiumCards', () => ({ CardShell: ({ children, onClick }: any) => <article onClick={onClick}>{children}</article> }));
vi.mock('../app/theme/subjectThemes', () => ({ applySubjectTheme: vi.fn(() => ({ accent: '#a855f7' })) }));
vi.mock('../app/lib/pulseEngine', () => ({ pulse: { burst: vi.fn() } }));
vi.mock('../app/utils/storage', () => ({ getQuizHistoryForModule: () => [] }));

it('centers the saved year and responds to a changed account year',()=>{
 const {rerender}=render(<MemoryRouter><Dashboard studentYear={2}/></MemoryRouter>);
 expect(screen.getByRole('button',{name:'Go to Year 2'})).toHaveAttribute('aria-pressed','true');
 rerender(<MemoryRouter><Dashboard studentYear={1}/></MemoryRouter>);
 expect(screen.getByRole('button',{name:'Go to Year 1'})).toHaveAttribute('aria-pressed','true');
});

describe('GIT entry from the home page', () => {
  it('Semester 1 breadcrumbs land on GIT directly', () => {
    render(<MemoryRouter initialEntries={['/year-3?semester=1']}><Routes><Route path='/year-3' element={<YearModules/>}/></Routes></MemoryRouter>);
    expect(screen.getByText('MGL-3')).toBeInTheDocument();
  });
  it('respects an explicit Semester 2 link for Year 3', () => {
    render(<MemoryRouter initialEntries={['/year-3?semester=2']}><Routes><Route path='/year-3' element={<YearModules/>}/></Routes></MemoryRouter>);
    expect(screen.queryByText('MGL-3')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:/Semester 1/}));
    expect(screen.getByText('MGL-3')).toBeInTheDocument();
  });
  it('opens Year 3, Semester 1, and the active GIT module', () => {
    render(<MemoryRouter><Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/year-3" element={<YearModules />} />
      <Route path="/year-3/mgl-3" element={<h1>GIT study modes</h1>} />
    </Routes></MemoryRouter>);
    const year3 = screen.getByText('Year 3').closest('article')!;
    expect(within(year3).queryByText('LOCKED')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to Year 3' })).toHaveAttribute('aria-pressed','true');
    fireEvent.click(within(year3).getByRole('button', { name: 'Enter' }));
    expect(screen.getByText('Year 3 Modules')).toBeInTheDocument();
    // GIT is available immediately because Year 3 defaults to Semester 1.
    const git = screen.getByText('MGL-3').closest('article')!;
    expect(within(git).queryByText('Coming Soon')).not.toBeInTheDocument();
    fireEvent.click(within(git).getByRole('button', { name: /Start/ }));
    expect(screen.getByRole('heading', { name: 'GIT study modes' })).toBeInTheDocument();
  });
});
