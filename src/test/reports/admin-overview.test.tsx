import { it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import AdminOverviewPanel from "../../pages/AdminOverviewPanel";
vi.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({ getToken: async () => "owner-token" }),
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const reports = {
  total: 3,
  counts: { new: 2, reviewing: 1, fixed: 0, dismissed: 0 },
  unresolved: 3,
  unresolvedQuestions: 1,
  priorityQuestions: [
    {
      key: "q1",
      moduleCode: "MGL-3",
      chapterId: 1,
      chapterTitle: "Anatomy",
      subjectName: "Anatomy",
      questionId: "q1",
      text: "42. Which nerve?",
      reportId: "r_test",
      unresolvedCount: 3,
      reporterCount: 2,
      latestAt: "2026-10-08T10:00:00Z",
    },
  ],
};
function show(data: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, json: async () => data })),
  );
  render(
    <MemoryRouter>
      <AdminOverviewPanel refresh={0} />
    </MemoryRouter>,
  );
}
it("renders real backlog and links to the relevant report without source numbering", async () => {
  show({ reports, tutor: null, tutorError: "Metrics unavailable" });
  await screen.findByText("3 unresolved reports across 1 question.");
  expect(screen.getByText("Which nerve?")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Which nerve/ })).toHaveAttribute(
    "href",
    "/admin/reports?report=r_test",
  );
  expect(screen.getByRole("link", { name: "Review reports" })).toHaveAttribute(
    "href",
    "/admin/reports?status=unresolved",
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Metrics unavailable");
});
it("does not invent activity or a live quota on an empty day", async () => {
  show({
    reports: { ...reports, priorityQuestions: [] },
    tutor: {
      day: "2026-10-08",
      timezone: "Africa/Cairo",
      provider: "groq",
      requests: 0,
      successes: 0,
      failures: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      recordedSince: null,
      quota: null,
    },
  });
  await screen.findByText("No tutor requests recorded today.");
  expect(
    screen.getByText("No provider quota reading available yet."),
  ).toBeInTheDocument();
});
it("labels saved provider readings with their scope and observation time", async () => {
  show({
    reports,
    tutor: {
      day: "2026-10-08",
      requests: 3,
      successes: 2,
      failures: 1,
      inputTokens: 10,
      outputTokens: 5,
      totalTokens: 15,
      recordedSince: "2026-10-08T09:00:00Z",
      quota: {
        observedAt: "2026-10-08T10:00:00Z",
        requestLimit: 1000,
        remainingRequests: 997,
        tokenLimit: 8000,
        remainingTokens: 7900,
      },
    },
  });
  await screen.findByText("Latest provider quota reading");
  expect(screen.getByText("997 / 1,000")).toBeInTheDocument();
  expect(
    screen.getByText(/saved provider reading, not a live balance/),
  ).toBeInTheDocument();
});
