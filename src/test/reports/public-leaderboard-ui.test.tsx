import { it, expect, vi, afterEach, describe } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import LearningHub from "../../pages/LearningHub";

vi.mock("@clerk/clerk-react", () => ({
  useUser: () => ({ user: { id: "test-user-leaderboard" } }),
}));

const mocks = vi.hoisted(() => ({
  settings: vi.fn(),
  setPeriod: vi.fn(),
  year: 3,
}));

vi.mock("../../app/preferences/useAcademicYear", () => ({
  useAcademicYear: () => ({ year: mocks.year, loading: false, error: null }),
}));

vi.mock("../../app/components/PortalShell", () => ({
  PortalShell: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("../../app/data", () => ({
  correctionRevision: 0,
  isModuleDataLoaded: () => true,
  SYLLABUS_MODULES: {
    3: {
      1: [
        { code: "MGL-3", name: "GIT & Liver Module", cp: 13 },
      ],
    },
  },
  getChaptersForModuleAndMode: () => [],
  ensureModuleDataLoaded: async () => {},
  getModuleQuestionCounts: () => ({ totalCount: 0 }),
}));

vi.mock("../../app/learning/LearningProvider", () => ({
  useLearning: () => ({
    data: {
      profile: {
        xp: 1250,
        level: 3,
        streak: 5,
        bestStreak: 12,
        alias: "Dr. Ahmed",
        optIn: false,
        banner: "default",
        title: "student",
      },
      entries: [
        {
          moduleCode: "MGL-3",
          chapterId: 1,
          questionId: "q1",
          correct: true,
          everCorrect: true,
          firstCorrect: true,
        },
      ],
      leaderboard: [
        { alias: "Dr. Sarah", xp: 5200, level: 11, banner: "aurora", isYou: false },
        { alias: "Karim Ezzat", xp: 3400, level: 7, banner: "ocean", isYou: false },
        { alias: "Dr. Ahmed", xp: 1250, level: 3, banner: "default", isYou: true },
      ],
    },
    loading: false,
    pending: 0,
    error: "",
    settings: mocks.settings,
    period: "weekly",
    setPeriod: mocks.setPeriod,
    retry: vi.fn(),
    discard: vi.fn(),
  }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Public Leaderboard UI & Interaction", () => {
  it("renders Leaderboard tab and displays Top 3 Podium with Champion, Contender, Achiever", () => {
    render(
      <MemoryRouter>
        <LearningHub />
      </MemoryRouter>,
    );

    const leaderboardTab = screen.getByRole("button", { name: "Leaderboard" });
    expect(leaderboardTab).toBeInTheDocument();

    fireEvent.click(leaderboardTab);

    // Verifies Podium badges and aliases
    expect(screen.getByText("#1 Champion")).toBeInTheDocument();
    expect(screen.getByText("#2 Contender")).toBeInTheDocument();
    expect(screen.getByText("#3 Achiever")).toBeInTheDocument();

    expect(screen.getAllByText("Dr. Sarah")).toHaveLength(2);
    expect(screen.getAllByText("Karim Ezzat")).toHaveLength(2);
    expect(screen.getAllByText(/Dr\. Ahmed/)).toHaveLength(2); // In podium and roster
  });

  it("highlights current user with '· You' in podium and roster", () => {
    render(
      <MemoryRouter>
        <LearningHub />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Leaderboard" }));

    // Verifies user highlight
    expect(screen.getAllByText(/· You/)).toHaveLength(2);
  });

  it("switches between This Week and All Time views", () => {
    render(
      <MemoryRouter>
        <LearningHub />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Leaderboard" }));

    const allTimeBtn = screen.getByRole("button", { name: "All time" });
    fireEvent.click(allTimeBtn);
    expect(mocks.setPeriod).toHaveBeenCalledWith("all");

    const thisWeekBtn = screen.getByRole("button", { name: "This week" });
    fireEvent.click(thisWeekBtn);
    expect(mocks.setPeriod).toHaveBeenCalledWith("weekly");
  });

  it("validates display name and prevents saving profane or inappropriate names", async () => {
    render(
      <MemoryRouter>
        <LearningHub />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Leaderboard" }));

    const input = screen.getByPlaceholderText(/e\.g\. Dr\. Sarah/);
    const saveBtn = screen.getByRole("button", { name: "Save name" });

    // Enter bad word
    fireEvent.change(input, { target: { value: "bad fuck name" } });

    // Verifies error alert is displayed
    expect(screen.getByText(/Please choose an appropriate academic display name/i)).toBeInTheDocument();
    // Save button must be disabled
    expect(saveBtn).toBeDisabled();

    // Enter legitimate name
    fireEvent.change(input, { target: { value: "Dr. Sarah" } });
    expect(screen.queryByText(/Please choose an appropriate academic display name/i)).not.toBeInTheDocument();
    expect(saveBtn).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(saveBtn);
    });

    expect(mocks.settings).toHaveBeenCalledWith({ alias: "Dr. Sarah" });
  });

  it("toggles leaderboard participation opt-in via accessible switch", async () => {
    render(
      <MemoryRouter>
        <LearningHub />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Leaderboard" }));

    const toggle = screen.getByTitle("Toggle participation").querySelector("input")!;
    expect(toggle.checked).toBe(false);

    await act(async () => {
      fireEvent.click(toggle);
    });

    expect(mocks.settings).toHaveBeenCalledWith({ optIn: true });
  });
});
