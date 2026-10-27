import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { InlineQuestionEditor } from "../../app/components/InlineQuestionEditor";

vi.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({
    getToken: async () => "test_owner_token",
    userId: "user_owner",
  }),
}));

const mockQuestion = {
  id: "q_test_101",
  type: "mcq",
  lecture: 1,
  text: "Which enzyme is the rate-limiting step in glycolysis?",
  options: ["Hexokinase", "Phosphofructokinase-1", "Pyruvate kinase", "Glucokinase"],
  correctIndex: 1,
  explanation: "PFK-1 catalyzes the committed and rate-limiting step of glycolysis.",
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("InlineQuestionEditor (On-The-Spot Question Editing)", () => {
  it("renders stem, all options, designated correct answer, and explanation", () => {
    render(
      <InlineQuestionEditor
        moduleCode="IBM-1"
        chapterId={1}
        question={mockQuestion}
      />
    );

    expect(screen.getByDisplayValue("Which enzyme is the rate-limiting step in glycolysis?")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hexokinase")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Phosphofructokinase-1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Pyruvate kinase")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Glucokinase")).toBeInTheDocument();
    expect(screen.getByText("Correct")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("PFK-1 catalyzes the committed and rate-limiting step of glycolysis.")
    ).toBeInTheDocument();
  });

  it("allows editing the question stem and options on the spot", () => {
    render(
      <InlineQuestionEditor
        moduleCode="IBM-1"
        chapterId={1}
        question={mockQuestion}
      />
    );

    const stemInput = screen.getByDisplayValue("Which enzyme is the rate-limiting step in glycolysis?");
    fireEvent.change(stemInput, { target: { value: "Refined prompt: rate limiting enzyme?" } });
    expect(stemInput).toHaveValue("Refined prompt: rate limiting enzyme?");

    const optionA = screen.getByDisplayValue("Hexokinase");
    fireEvent.change(optionA, { target: { value: "Hexokinase IV" } });
    expect(optionA).toHaveValue("Hexokinase IV");
  });

  it("allows switching the designated correct answer by clicking an option radio", () => {
    render(
      <InlineQuestionEditor
        moduleCode="IBM-1"
        chapterId={1}
        question={mockQuestion}
      />
    );

    // Click option A to designate as correct
    const optionAButton = screen.getByRole("button", { name: "Mark option A as correct answer" });
    fireEvent.click(optionAButton);

    expect(screen.getByRole("button", { name: "Mark option A as correct answer" })).toHaveClass("bg-emerald-600");
  });

  it("supports adding an additional choice option", () => {
    render(
      <InlineQuestionEditor
        moduleCode="IBM-1"
        chapterId={1}
        question={mockQuestion}
      />
    );

    const addBtn = screen.getByRole("button", { name: /Add Choice Option/i });
    fireEvent.click(addBtn);

    // Option E placeholder should now be present
    expect(screen.getByPlaceholderText("Option E…")).toBeInTheDocument();
  });

  it("submits PATCH to /api/question-bank with patched question data", async () => {
    const fetchMock = vi.fn(async (url: string, _opts: any) => {
      if (url.includes("action=single")) {
        return {
          ok: true,
          json: async () => ({ entry: { revision: 2 } }),
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({ edit: { revision: 3 } }),
      };
    });
    vi.stubGlobal("fetch", fetchMock);

    const onSaved = vi.fn();
    render(
      <InlineQuestionEditor
        moduleCode="IBM-1"
        chapterId={1}
        question={mockQuestion}
        onSaved={onSaved}
      />
    );

    const saveBtn = screen.getByRole("button", { name: /Save Question Patch/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      const patchCall = fetchMock.mock.calls.find((call) => call[0] === "/api/question-bank");
      expect(patchCall).toBeDefined();
      expect(patchCall).not.toBeUndefined();
      const body = JSON.parse(patchCall![1].body);
      expect(body.moduleCode).toBe("IBM-1");
      expect(body.questionId).toBe("q_test_101");
      expect(body.question.text).toBe("Which enzyme is the rate-limiting step in glycolysis?");
      expect(onSaved).toHaveBeenCalled();
    });
  });
});
