import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as cachedSessionModule from './auth/cachedSession';

let mockIsLoaded = false;
let mockIsSignedIn = false;
let mockUser: any = null;

const { MockUserButton } = vi.hoisted(() => {
  const MockUserButton: any = ({ children }: any) => <button aria-label="User Account">PFP{children}</button>;
  MockUserButton.UserProfilePage = ({ children }: any) => <div>{children}</div>;
  MockUserButton.MenuItems = ({ children }: any) => <div>{children}</div>;
  MockUserButton.Action = () => null;
  return { MockUserButton };
});

vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => ({
    isLoaded: mockIsLoaded,
    isSignedIn: mockIsSignedIn,
    userId: mockUser?.id ?? null,
    getToken: vi.fn(),
  }),
  useUser: () => ({
    isLoaded: mockIsLoaded,
    isSignedIn: mockIsSignedIn,
    user: mockUser,
  }),
  UserButton: MockUserButton,
  SignIn: () => <div>Clerk SignIn Component</div>,
  SignUp: () => <div>Clerk SignUp Component</div>,
}));

vi.mock('../pages/Dashboard', () => ({
  default: ({ studentYear }: any) => (
    <div data-testid="dashboard-screen">
      <h1>ASU Dashboard</h1>
      <span data-testid="student-year">{studentYear}</span>
    </div>
  ),
}));

vi.mock('./components/LoadingScreen', () => ({
  default: () => <div data-testid="loading-screen">Loading ASU Medical Portal...</div>,
}));

vi.mock('./components/LoginScreen', () => ({
  LoginScreen: () => <div data-testid="login-screen">Please Sign In</div>,
}));

vi.mock('./hooks/useCloudSync', () => ({
  useCloudSync: vi.fn(),
}));

vi.mock('./hooks/usePresence', () => ({
  usePresence: vi.fn(),
}));

vi.mock('./preferences/useAcademicYear', () => ({
  useAcademicYear: () => ({
    year: 3,
    saveYear: vi.fn(),
    loading: false,
    error: null,
    retry: vi.fn(),
    localPreview: false,
  }),
}));

vi.mock('./reports/useOwnerAccess', () => ({
  useOwnerAccess: () => false,
}));

vi.mock('./components/CorrectionStatus', () => ({
  CorrectionStatus: () => null,
  useBankRevision: () => 1,
  startCorrectionsRefresh: vi.fn(),
}));

describe('App Optimistic Local-First Authentication', () => {
  beforeEach(() => {
    localStorage.clear();
    mockIsLoaded = false;
    mockIsSignedIn = false;
    mockUser = null;
    vi.clearAllMocks();
  });

  it('renders LoadingScreen when not loaded and no cached session exists', () => {
    mockIsLoaded = false;
    mockIsSignedIn = false;

    render(<App />);

    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-screen')).not.toBeInTheDocument();
  });

  it('immediately mounts and renders Dashboard when cached session exists, without waiting for Clerk isLoaded', () => {
    cachedSessionModule.setCachedSession({
      userId: 'user_123',
      firstName: 'Ahmed',
      fullName: 'Ahmed Ali',
      email: 'ahmed@asu.edu.eg',
    });

    mockIsLoaded = false;
    mockIsSignedIn = false;

    render(<App />);

    // Dashboard renders immediately on frame 0
    expect(screen.getByTestId('dashboard-screen')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
  });

  it('signs the user out to LoginScreen if Clerk server reports the session is invalid', async () => {
    cachedSessionModule.setCachedSession({
      userId: 'user_expired',
      firstName: 'Sara',
      fullName: 'Sara Omar',
      email: 'sara@asu.edu.eg',
    });

    // Mount with optimistic auth
    const { rerender } = render(<App />);
    expect(screen.getByTestId('dashboard-screen')).toBeInTheDocument();

    // Clerk loads and says user is NOT signed in
    mockIsLoaded = true;
    mockIsSignedIn = false;
    mockUser = null;

    rerender(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('login-screen')).toBeInTheDocument();
      expect(screen.queryByTestId('dashboard-screen')).not.toBeInTheDocument();
    });

    expect(cachedSessionModule.isOptimisticallyAuthenticated()).toBe(false);
  });
});
