import { it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QuestionSearch } from "../components/QuestionSearch";
vi.mock("@clerk/clerk-react", () => ({
  useUser: () => ({ user: { id: "search-test" } }),
}));
vi.mock("../preferences/useAcademicYear", () => ({
  useAcademicYear: () => ({ year: 3, loading: false }),
}));
vi.mock("../learning/LearningProvider", () => ({
  useLearning: () => ({ data: null }),
}));
vi.mock("../reports/ReportQuestion", () => ({
  ReportQuestionButton: () => null,
}));
vi.mock("../components/CorrectionStatus", () => ({ useBankRevision: () => 0 }));
vi.mock("../data", () => ({
  ensureDataLoaded: async () => {},
  ensureYearDataLoaded: async () => {},
  SYLLABUS_MODULES: { 3: { 1: [{ code: "MGL-3", name: "GIT" }] } },
  isModuleActive: () => true,
  getChaptersForModuleAndMode: () => [
    {
      id: 1,
      title: "Stomach",
      subjects: [
        {
          id: "histology",
          name: "Histology",
          questions: Array.from({ length: 105 }, (_, i) => ({
            id: String(i),
            type: "mcq",
            text: `Lipase question ${i}`,
            options: ["Correct secret", "Wrong"],
            correctIndex: 0,
            explanation: "The mechanism.",
          })),
        },
      ],
    },
  ],
}));
it("starts in the saved year, conceals answers and makes all results reachable", async () => {
  render(
    <MemoryRouter>
      <QuestionSearch onBack={() => {}} />
    </MemoryRouter>,
  );
  await waitFor(() =>
    expect(screen.getByText(/105 questions/)).toBeInTheDocument(),
  );
  expect(screen.getByLabelText("Academic year")).toHaveValue("3");
  expect(screen.queryByText("Correct secret")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Load more/ }));
  await waitFor(() =>
    expect(screen.getByText("Lipase question 104")).toBeInTheDocument(),
  );
});
