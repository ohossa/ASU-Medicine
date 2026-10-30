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

  it("renders Delete Question button in the action bar", () => {
    render(
      <InlineQuestionEditor
        moduleCode="IBM-1"
        chapterId={1}
        question={mockQuestion}
      />
    );

    const deleteBtn = screen.getByRole("button", { name: /Delete Question/i });
    expect(deleteBtn).toBeInTheDocument();
  });

  it("opens Apple HIG Delete Question modal when Delete Question is clicked and allows cancelling", () => {
    render(
      <InlineQuestionEditor
        moduleCode="IBM-1"
        chapterId={1}
        question={mockQuestion}
      />
    );

    const deleteBtn = screen.getByRole("button", { name: /Delete Question/i });
    fireEvent.click(deleteBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Remove Question from Practice?")).toBeInTheDocument();

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("submits DELETE /api/question-bank and auto-resolves report when confirmed", async () => {
    const fetchMock = vi.fn(async (url: string, opts?: any) => {
      if (url.includes("action=single")) {
        return {
          ok: true,
          json: async () => ({ entry: { revision: 4 } }),
        };
      }
      if (url === "/api/question-bank" && opts?.method === "DELETE") {
        return {
          ok: true,
          status: 200,
          json: async () => ({ edit: { revision: 5, deleted: true } }),
        };
      }
      if (url.includes("/api/question-reports") && opts?.method === "PATCH") {
        return {
          ok: true,
          status: 200,
          json: async () => ({ ok: true }),
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({}),
      };
    });
    vi.stubGlobal("fetch", fetchMock);

    const onDeleted = vi.fn();
    render(
      <InlineQuestionEditor
        moduleCode="IBM-1"
        chapterId={1}
        question={mockQuestion}
        revision={4}
        reportId="rep_test_999"
        reportRevision={2}
        onDeleted={onDeleted}
      />
    );

    // Click Delete Question to open confirmation modal
    fireEvent.click(screen.getByRole("button", { name: /Delete Question/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Verify auto-resolve checkbox is present and checked
    const autoResolveCheckbox = screen.getByRole("checkbox", {
      name: /Auto-resolve linked student report as Fixed/i,
    });
    expect(autoResolveCheckbox).toBeChecked();

    // Confirm removal
    const confirmBtn = screen.getByRole("button", { name: "Confirm remove question" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      // Verify DELETE /api/question-bank called
      const deleteCall = fetchMock.mock.calls.find(
        (call) => call[0] === "/api/question-bank" && call[1]?.method === "DELETE"
      );
      expect(deleteCall).toBeDefined();
      const deleteBody = JSON.parse(deleteCall![1].body);
      expect(deleteBody.moduleCode).toBe("IBM-1");
      expect(deleteBody.questionId).toBe("q_test_101");
      expect(deleteBody.chapterId).toBe(1);

      // Verify PATCH /api/question-reports called to auto-resolve report
      const reportCall = fetchMock.mock.calls.find(
        (call) => call[0] === "/api/question-reports" && call[1]?.method === "PATCH"
      );
      expect(reportCall).toBeDefined();
      const reportBody = JSON.parse(reportCall![1].body);
      expect(reportBody.id).toBe("rep_test_999");
      expect(reportBody.status).toBe("fixed");

      // Verify onDeleted callback was invoked
      expect(onDeleted).toHaveBeenCalledWith("q_test_101", 5);
    });
  });

  it("renders curriculum routing controls and supports relocating question to another subject and lecture topic", async () => {
    const mockChapters = [
      {
        id: 5,
        title: "Pathology",
        subjects: [{ id: "pathology", name: "Pathology", lectureCount: 22, lectureNames: ["Intro", "Inflammation"] }],
      },
      {
        id: 8,
        title: "Parasitology",
        subjects: [
          {
            id: "parasitology",
            name: "Parasitology",
            lectureCount: 21,
            lectureNames: [
              "Trematodes of the liver",
              "Cestodes of the liver (Echinococcus granulosus)",
            ],
          },
        ],
      },
    ];

    const fetchMock = vi.fn(async (url: string, _opts?: any) => {
      if (url.includes("action=single")) {
        return {
          ok: true,
          json: async () => ({
            entry: {
              revision: 1,
              chapterId: 5,
              subjectId: "pathology",
              question: { ...mockQuestion, id: "MGL3-CH5-PATH-0976", lecture: 1 },
            },
            chapters: mockChapters,
          }),
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          edit: {
            revision: 2,
            targetChapterId: 8,
            targetSubjectId: "parasitology",
            question: { ...mockQuestion, id: "MGL3-CH5-PATH-0976", lecture: 2 },
          },
        }),
      };
    });
    vi.stubGlobal("fetch", fetchMock);

    const onSaved = vi.fn();
    render(
      <InlineQuestionEditor
        moduleCode="MGL-3"
        chapterId={5}
        subjectId="pathology"
        question={{ ...mockQuestion, id: "MGL3-CH5-PATH-0976", lecture: 1 }}
        chapters={mockChapters}
        onSaved={onSaved}
      />
    );

    // Verify Curriculum Routing & Placement header
    expect(screen.getByText("Curriculum Routing & Placement")).toBeInTheDocument();

    // Verify Destination Chapter and Subject dropdown
    const subjectSelect = screen.getByLabelText("Destination Chapter and Subject");
    expect(subjectSelect).toBeInTheDocument();
    expect(subjectSelect).toHaveValue("5:pathology");

    // Relocate to Chapter 8 Parasitology
    fireEvent.change(subjectSelect, { target: { value: "8:parasitology" } });
    expect(subjectSelect).toHaveValue("8:parasitology");

    // Lecture dropdown should now display Parasitology lectures
    const lectureSelect = screen.getByLabelText("Lecture or Topic");
    expect(screen.getByText("2. Cestodes of the liver (Echinococcus granulosus)")).toBeInTheDocument();

    // Select lecture 2
    fireEvent.change(lectureSelect, { target: { value: "2" } });
    expect(lectureSelect).toHaveValue("2");

    // Visual relocation indicator banner should be visible
    expect(screen.getByText(/Relocating question:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/MGL3-CH5-PATH-0976/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/is permanently preserved/i)).toBeInTheDocument();

    // Save Question Patch
    const saveBtn = screen.getByRole("button", { name: /Save Question Patch/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      const patchCall = fetchMock.mock.calls.find((call) => call[0] === "/api/question-bank");
      expect(patchCall).toBeDefined();
      const body = JSON.parse(patchCall![1].body);
      expect(body.moduleCode).toBe("MGL-3");
      expect(body.chapterId).toBe(5); // source chapter
      expect(body.questionId).toBe("MGL3-CH5-PATH-0976"); // Stable ID!
      expect(body.targetChapterId).toBe(8); // destination chapter
      expect(body.targetSubjectId).toBe("parasitology"); // destination subject
      expect(body.question.lecture).toBe(2); // destination lecture

      // Check onSaved callback received relocation metadata
      expect(onSaved).toHaveBeenCalledWith(
        expect.objectContaining({ id: "MGL3-CH5-PATH-0976", lecture: 2 }),
        2,
        expect.objectContaining({
          chapterId: 8,
          chapterTitle: "Parasitology",
          subjectId: "parasitology",
          subjectName: "Parasitology",
          topicName: "Cestodes of the liver (Echinococcus granulosus)",
        })
      );
    });
  });
});
