import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import AdminAnalyticsView from "../../pages/admin/AdminAnalyticsView";

vi.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({
    getToken: async () => "test_owner_token",
    userId: "user_owner",
  }),
}));

const mockAnalyticsData = {
  summary: {
    totalStudents: 3,
    onlineNow: 2,
    activeToday: 3,
    totalQuestionsSolved: 1200,
    overallAccuracy: 85,
    totalStudyHours: 24,
    moduleCount: 42,
  },
  students: [
    {
      id: "stu_01",
      name: "Salma Farouk",
      email: "salma.farouk@student.asu.edu.eg",
      year: 3,
      xp: 8100,
      level: 16,
      streak: 25,
      bestStreak: 25,
      questionsAttempted: 690,
      questionsCorrect: 649,
      accuracy: 94,
      studyTimeMinutes: 1040,
      lastActive: "2026-10-27",
      isOnline: true,
      activeModule: "MGL-3",
      moduleBreakdown: {
        "MGL-3": { attempts: 380, correct: 365, accuracy: 96 },
        "MUG-3": { attempts: 310, correct: 284, accuracy: 91 },
      },
    },
    {
      id: "stu_02",
      name: "Ahmed Ezzat",
      email: "ahmed.ezzat@student.asu.edu.eg",
      year: 1,
      xp: 1950,
      level: 4,
      streak: 12,
      bestStreak: 12,
      questionsAttempted: 160,
      questionsCorrect: 152,
      accuracy: 95,
      studyTimeMinutes: 240,
      lastActive: "2026-10-27",
      isOnline: false,
      moduleBreakdown: {
        "IBM-1": { attempts: 90, correct: 84, accuracy: 93 },
      },
    },
    {
      id: "stu_03",
      name: "Hana El-Sayed",
      email: "hana.elsayed@student.asu.edu.eg",
      year: 5,
      xp: 6200,
      level: 13,
      streak: 42,
      bestStreak: 42,
      questionsAttempted: 520,
      questionsCorrect: 458,
      accuracy: 88,
      studyTimeMinutes: 850,
      lastActive: "2026-10-27",
      isOnline: true,
      activeModule: "SURG-5",
      moduleBreakdown: {
        "SURG-5": { attempts: 280, correct: 252, accuracy: 90 },
      },
    },
  ],
  modules: [
    {
      code: "MGL-3",
      name: "GIT Module",
      year: 3,
      semester: 1,
      totalQuestions: 247,
      totalAttempts: 690,
      accuracy: 96,
      activeStudents: 3,
      avgScore: 96,
      difficultyRating: "Beginner",
    },
  ],
  hardestQuestions: [],
  recentActivity: [],
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("AdminAnalyticsView: Master Leaderboard & Student Search (omarhmaged@gmail.com)", () => {
  it("renders the Master Leaderboard tab with Podium Showcase and ranked accounts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockAnalyticsData,
      })
    );

    render(<AdminAnalyticsView />);

    // Wait for data load
    await waitFor(() => {
      expect(screen.getByText("Portal Deep Analytics")).toBeInTheDocument();
    });

    // Switch to Master Leaderboard tab
    const leaderboardTab = screen.getByRole("button", { name: /Master Leaderboard/i });
    fireEvent.click(leaderboardTab);

    // Verify Tab Header
    expect(screen.getByText("Admin Master Leaderboard")).toBeInTheDocument();
    expect(screen.getByText("Real-Time Student Rankings & Mastery")).toBeInTheDocument();

    // Verify Podium Cards are rendered
    expect(screen.getByText("#1 Champion")).toBeInTheDocument();
    expect(screen.getByText("#2 Contender")).toBeInTheDocument();
    expect(screen.getByText("#3 Achiever")).toBeInTheDocument();

    // Default sorting is XP: Salma Farouk (8100 XP) should be #1 Champion
    const championCard = screen.getByText("#1 Champion").closest("div");
    expect(championCard).toBeInTheDocument();
    expect(screen.getAllByText("Salma Farouk").length).toBeGreaterThan(0);
  });

  it("dynamically re-ranks podium and roster when switching sort metric to Accuracy %", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockAnalyticsData,
      })
    );

    render(<AdminAnalyticsView />);

    await waitFor(() => {
      expect(screen.getByText("Portal Deep Analytics")).toBeInTheDocument();
    });

    const leaderboardTab = screen.getByRole("button", { name: /Master Leaderboard/i });
    fireEvent.click(leaderboardTab);

    // Click Accuracy % sort pill
    const accuracyBtn = screen.getByRole("button", { name: /Accuracy %/i });
    fireEvent.click(accuracyBtn);

    // Under Accuracy %, Ahmed Ezzat has 95%, so he is now #1 Champion!
    expect(screen.getAllByText("95% Accuracy").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Ahmed Ezzat").length).toBeGreaterThanOrEqual(2);
  });

  it("filters students in real-time when searching by name", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockAnalyticsData,
      })
    );

    render(<AdminAnalyticsView />);

    await waitFor(() => {
      expect(screen.getByText("Portal Deep Analytics")).toBeInTheDocument();
    });

    const leaderboardTab = screen.getByRole("button", { name: /Master Leaderboard/i });
    fireEvent.click(leaderboardTab);

    const searchInput = screen.getByPlaceholderText(/Search students by name, email, or account ID/i);
    fireEvent.change(searchInput, { target: { value: "Hana" } });

    // Only Hana El-Sayed should appear
    expect(screen.getAllByText("Hana El-Sayed").length).toBeGreaterThan(0);
    expect(screen.queryByText("Ahmed Ezzat")).not.toBeInTheDocument();
  });

  it("opens the StudentEmailReplyModal when clicking contact button", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockAnalyticsData,
      })
    );

    render(<AdminAnalyticsView />);

    await waitFor(() => {
      expect(screen.getByText("Portal Deep Analytics")).toBeInTheDocument();
    });

    const leaderboardTab = screen.getByRole("button", { name: /Master Leaderboard/i });
    fireEvent.click(leaderboardTab);

    // Click "Recognize" on the #1 Champion card
    const recognizeBtn = screen.getByRole("button", { name: /Recognize/i });
    fireEvent.click(recognizeBtn);

    // Modal dialog opens with Academic Recognition template
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Personal Student Outreach")).toBeInTheDocument();
    expect(screen.getByText("Academic Recognition (Top Performer)")).toBeInTheDocument();
  });
});
