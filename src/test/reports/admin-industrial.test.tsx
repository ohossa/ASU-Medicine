import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import AdminIndustrialDashboard from "../../pages/admin/AdminIndustrialDashboard";
import type { AdminOverview } from "../../app/reports/dashboard-contracts";
import type { ReportList } from "../../app/reports/contracts";

vi.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({ getToken: async () => "owner-token" }),
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: { id: "owner", fullName: "Omar" },
  }),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const mockOverview: AdminOverview = {
  reports: {
    total: 12,
    counts: { new: 3, reviewing: 2, fixed: 5, dismissed: 2 },
    unresolved: 5,
    unresolvedQuestions: 4,
    priorityQuestions: [
      {
        key: "q1",
        moduleCode: "MRS-2",
        chapterId: 1,
        chapterTitle: "Anatomy",
        subjectName: "Respiratory",
        questionId: "q101",
        text: "Which bronchus is wider?",
        reportId: "rep_101",
        unresolvedCount: 3,
        reporterCount: 2,
        latestAt: "2026-11-04T12:00:00Z",
      },
    ],
  },
  tutor: {
    day: "2026-11-04",
    timezone: "Africa/Cairo",
    provider: "groq",
    requests: 120,
    successes: 118,
    failures: 2,
    inputTokens: 15400,
    outputTokens: 4200,
    totalTokens: 19600,
    quota: {
      observedAt: "2026-11-04T12:00:00Z",
      requestLimit: 1000,
      remainingRequests: 880,
      tokenLimit: 500000,
      remainingTokens: 480400,
    },
    recordedSince: "2026-11-04T00:00:00Z",
  },
};

const mockList: ReportList = {
  reports: [
    {
      id: "rep_alert_1",
      requestHash: "hash_1",
      reporterId: "student_1",
      category: "wrong_answer",
      explanation: "Option B is physiologically incorrect.",
      status: "new",
      notes: "",
      revision: 1,
      createdAt: "2026-11-04T10:00:00Z",
      updatedAt: "2026-11-04T10:00:00Z",
      notification: { state: "unconfigured" },
      snapshot: {
        moduleCode: "MRS-2",
        chapterId: 1,
        chapterTitle: "Anatomy",
        subjectName: "Thorax",
        version: "v1",
        question: {
          id: "res_99",
          type: "mcq",
          text: "Right principal bronchus angle?",
          options: ["25 degrees", "45 degrees"],
          correctIndex: 0,
        },
      },
    },
  ],
  total: 1,
  counts: { new: 1, reviewing: 0, fixed: 0, dismissed: 0 },
};

function renderDashboard(onNavigateTab = vi.fn()) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => ({
      ok: true,
      json: async () => {
        if (url.includes("action=overview")) return mockOverview;
        return mockList;
      },
    }))
  );

  return render(
    <MemoryRouter>
      <AdminIndustrialDashboard onNavigateTab={onNavigateTab} />
    </MemoryRouter>
  );
}

describe("AdminIndustrialDashboard", () => {
  it("renders the brand header, KPI cards, and HUD workspace", async () => {
    renderDashboard();

    expect(screen.getByText("asu.codes")).toBeInTheDocument();
    expect(screen.getByText("Admin Telemetry")).toBeInTheDocument();
    expect(screen.getByText("Question Bank")).toBeInTheDocument();
    expect(screen.getByText("Active Sessions")).toBeInTheDocument();
    expect(screen.getAllByText("Incident Pipeline").length).toBeGreaterThan(0);
    expect(screen.getByText("Query Latency")).toBeInTheDocument();

    // Map workspace region
    expect(screen.getByRole("region", { name: "Module Telemetry HUD" })).toBeInTheDocument();
  });

  it("allows switching roles between Curriculum Ops and System Ops", async () => {
    renderDashboard();

    const currBtn = screen.getByRole("radio", { name: "Curriculum Ops" });
    const sysBtn = screen.getByRole("radio", { name: "System Ops" });

    expect(currBtn).toHaveAttribute("data-active", "true");
    expect(sysBtn).toHaveAttribute("data-active", "false");

    fireEvent.click(sysBtn);

    expect(sysBtn).toHaveAttribute("data-active", "true");
    expect(currBtn).toHaveAttribute("data-active", "false");
  });

  it("selects a module from the SVG HUD and updates the Unit Inspector Card", async () => {
    renderDashboard();

    // Find module node by testid
    const node = await screen.findByTestId("module-node-IAE-1");
    fireEvent.click(node);

    // Inspector card updates
    await waitFor(() => {
      expect(screen.getAllByText(/IAE-1/).length).toBeGreaterThan(0);
    });
  });

  it("allows quick-triaging an incident from the Incident Pipeline", async () => {
    const fetchMock = vi.fn(async (url: string, opts?: any) => {
      if (opts?.method === "PATCH") {
        return { ok: true, json: async () => ({ success: true }) };
      }
      return {
        ok: true,
        json: async () => {
          if (url.includes("action=overview")) return mockOverview;
          return mockList;
        },
      };
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <MemoryRouter>
        <AdminIndustrialDashboard />
      </MemoryRouter>
    );

    // Wait for the report to load in the feed
    await screen.findByText("MRS-2: Qres_99");
    expect(screen.getByText("Option B is physiologically incorrect.")).toBeInTheDocument();

    // Click Mark Fixed
    const fixBtn = screen.getByRole("button", { name: "✓ Mark Fixed" });
    fireEvent.click(fixBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/question-reports"),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ id: "rep_alert_1", status: "fixed" }),
        })
      );
    });
  });

  it("triggers onNavigateTab when navigation links are clicked", async () => {
    const onNavigateTab = vi.fn();
    renderDashboard(onNavigateTab);

    const reportsNav = screen.getByRole("link", { name: /Incident Pipeline/ });
    fireEvent.click(reportsNav);
    expect(onNavigateTab).toHaveBeenCalledWith("reports");

    const analyticsNav = screen.getByRole("link", { name: /Portal Analytics/ });
    fireEvent.click(analyticsNav);
    expect(onNavigateTab).toHaveBeenCalledWith("analytics");

    const questionsNav = screen.getAllByRole("link", { name: /Question Studio/ })[0];
    fireEvent.click(questionsNav);
    expect(onNavigateTab).toHaveBeenCalledWith("questions");
  });
});
