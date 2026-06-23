import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import YearModules from './YearModules';

// Mock storage
vi.mock('../app/utils/storage', () => ({
  getQuizHistoryForModule: () => [],
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
