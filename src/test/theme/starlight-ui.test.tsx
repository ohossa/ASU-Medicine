import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarlightToggle } from '../../app/components/StarlightToggle';
import { ThemeProvider } from '../../app/context/ThemeContext';
import { useTheme } from '../../app/hooks/useTheme';
import { STARLIGHT_STORAGE_KEY } from '../../app/config/secretThemes';

// Mock Clerk useUser hook
const mockUseUser = vi.fn();
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => mockUseUser(),
}));

describe('Starlight Secret Theme UI & Context', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    vi.clearAllMocks();
  });

  it('renders nothing if the user is not loaded or not signed in', () => {
    mockUseUser.mockReturnValue({ isLoaded: false, user: null });
    const { container } = render(
      <ThemeProvider>
        <StarlightToggle />
      </ThemeProvider>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing for an unauthorized student email', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: {
        primaryEmailAddress: { emailAddress: 'student@med.asu.edu.eg' },
      },
    });
    const { container } = render(
      <ThemeProvider>
        <StarlightToggle />
      </ThemeProvider>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the secret Starlight toggle for sarahrateb@gmail.com', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: {
        primaryEmailAddress: { emailAddress: 'sarahrateb@gmail.com' },
      },
    });
    render(
      <ThemeProvider>
        <StarlightToggle />
      </ThemeProvider>,
    );
    const btn = screen.getByRole('switch', { name: /toggle secret starlight theme/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent(/Starlight/i);
  });

  it('renders the secret Starlight toggle for omarhmaged@gmail.com', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: {
        primaryEmailAddress: { emailAddress: 'omarhmaged@gmail.com' },
      },
    });
    render(
      <ThemeProvider>
        <StarlightToggle />
      </ThemeProvider>,
    );
    const btn = screen.getByRole('switch', { name: /toggle secret starlight theme/i });
    expect(btn).toBeInTheDocument();
  });

  it('toggles starlight theme and updates documentElement classes and localStorage', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: {
        primaryEmailAddress: { emailAddress: 'sarahrateb@gmail.com' },
      },
    });

    function TestHarness() {
      const { isStarlight } = useTheme();
      return (
        <div>
          <StarlightToggle />
          <span data-testid="starlight-status">{isStarlight ? 'ON' : 'OFF'}</span>
        </div>
      );
    }

    render(
      <ThemeProvider>
        <TestHarness />
      </ThemeProvider>,
    );

    const btn = screen.getByRole('switch', { name: /toggle secret starlight theme/i });
    expect(screen.getByTestId('starlight-status')).toHaveTextContent('OFF');
    expect(document.documentElement.classList.contains('theme-starlight')).toBe(false);

    // Turn ON
    fireEvent.click(btn);
    expect(screen.getByTestId('starlight-status')).toHaveTextContent('ON');
    expect(document.documentElement.classList.contains('theme-starlight')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem(STARLIGHT_STORAGE_KEY)).toBe('true');

    // Turn OFF
    fireEvent.click(btn);
    expect(screen.getByTestId('starlight-status')).toHaveTextContent('OFF');
    expect(document.documentElement.classList.contains('theme-starlight')).toBe(false);
    expect(localStorage.getItem(STARLIGHT_STORAGE_KEY)).toBe('false');
  });
});
