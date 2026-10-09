import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import YearModules from './YearModules';

// Mock storage
vi.mock('../app/utils/storage', () => ({
  getQuizHistory: () => [],
}));

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: { fullName: 'Test Student' },
  }),
}));

// Mock Language
vi.mock('../app/hooks/useLanguage', () => ({
  useLanguage: () => ({
    language: 'en',
    t: (key: string) => key,
  }),
}));

describe('YearModules rendering with explicit paths', () => {
  it('renders Year 1 modules without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/year-1']}>
        <Routes>
          <Route path="/year-1" element={<YearModules />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Year 1 Modules/i)).toBeInTheDocument();
  });

  it('renders Year 2 modules without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/year-2']}>
        <Routes>
          <Route path="/year-2" element={<YearModules />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Year 2 Modules/i)).toBeInTheDocument();
  });
});
describe('Semester defaults',()=>{
 for(const year of [1,2,3])it(`Year ${year} starts on Semester 1`,()=>{
  const {unmount}=render(<MemoryRouter initialEntries={[`/year-${year}`]}><YearModules/></MemoryRouter>);
  const button=screen.getByRole('button',{name:/Semester 1/i});
  expect(button.querySelector('span')).toHaveClass('font-bold');unmount();
 });
 it('keeps explicitly requested Semester 2 links working',()=>{
  render(<MemoryRouter initialEntries={['/year-2?semester=2']}><YearModules/></MemoryRouter>);
  expect(screen.getByRole('button',{name:/Semester 2/i}).querySelector('span')).toHaveClass('font-bold');
 });
});
