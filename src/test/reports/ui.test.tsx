import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter } from "react-router";
import {
  ReportProvider,
  ReportQuestionButton,
} from "../../app/reports/ReportQuestion";
vi.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({ getToken: async () => "test-token" }),
}));
vi.mock("../../app/hooks/useLanguage", () => ({
  useLanguage: () => ({ language: "en" }),
}));
vi.mock("../../app/data", () => ({ findQuestionById: () => null }));
const question = {
  id: "Q1",
  type: "mcq" as const,
  text: "What is the answer?",
  options: ["A", "B"],
  correctIndex: 0,
  lecture: 1,
  subjectColor: "anatomy" as const,
  explanation: "Explanation",
};
function mount() {
  render(
    <MemoryRouter>
      <ReportProvider>
        <ReportQuestionButton
          question={question}
          chapterId={1}
          moduleCode="MEM-2"
        />
      </ReportProvider>
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Report an issue" }));
}
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
describe("Student question reporting", () => {
  it("opens an accessible form and sends the chosen issue and explanation", async () => {
    const fetch = vi.fn(async (_url: string, _options: RequestInit) => ({
      ok: true,
      json: async () => ({ saved: true, id: "report1" }),
    }));
    vi.stubGlobal("fetch", fetch);
    mount();
    expect(
      screen.getByRole("dialog", { name: "Report this question" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Wrong answer"));
    fireEvent.change(screen.getByLabelText("Explanation (optional)"), {
      target: { value: "Key seems wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send report" }));
    await screen.findByText("Report received");
    expect(JSON.parse(String(fetch.mock.calls[0][1].body))).toMatchObject({
      category: "wrong_answer",
      explanation: "Key seems wrong",
      questionId: "Q1",
      moduleCode: "MEM-2",
    });
  });
  it("keeps the student explanation when the server cannot save", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        json: async () => ({ error: "Please try again later." }),
      })),
    );
    mount();
    fireEvent.click(screen.getByLabelText("Formatting issue"));
    fireEvent.change(screen.getByLabelText("Explanation (optional)"), {
      target: { value: "Table has shifted" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send report" }));
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Please try again later.",
      ),
    );
    expect(screen.getByLabelText("Explanation (optional)")).toHaveValue(
      "Table has shifted",
    );
  });
  it("does not submit before choosing an issue", () => {
    mount();
    expect(screen.getByRole("button", { name: "Send report" })).toBeDisabled();
  });
});
