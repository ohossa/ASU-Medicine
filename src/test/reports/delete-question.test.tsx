import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { DeleteQuestionModal } from "../../app/components/DeleteQuestionModal";
import AdminPortal from "../../pages/AdminPortal";
import type { QuestionReport } from "../../app/reports/contracts";

vi.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({
    getToken: async () => "test_token_owner",
    userId: "owner",
  }),
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: { id: "owner", fullName: "Omar" },
  }),
}));

vi.mock("../../app/hooks/useLanguage", () => ({
  useLanguage: () => ({ language: "en" }),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

const mockReport: QuestionReport = {
  id: "rep_del_101",
  requestHash: "hash123",
  reporterId: "student_abc",
  category: "wrong_answer",
  explanation: "This question is invalid and needs removal.",
  status: "new",
  notes: "",
  revision: 1,
  createdAt: "2026-10-28T10:00:00Z",
  updatedAt: "2026-10-28T10:00:00Z",
  notification: { state: "unconfigured" },
  snapshot: {
    moduleCode: "MGL-3",
    chapterId: 2,
    chapterTitle: "Physiology",
    subjectName: "Gastric Secretion",
    version: "v1",
    question: {
      id: "MGL3-PHYS-999",
      type: "mcq",
      text: "Which cell produces intrinsic factor?",
      options: ["Chief cell", "Parietal cell", "G cell", "Mucous cell"],
      correctIndex: 1,
      explanation: "Parietal cells secrete HCl and intrinsic factor.",
    },
  },
};

describe("DeleteQuestionModal Component", () => {
  it("renders accessible Apple HIG modal with question preview", () => {
    render(
      <DeleteQuestionModal
        isOpen={true}
        onClose={vi.fn()}
        moduleCode="MGL-3"
        chapterId={2}
        questionId="MGL3-PHYS-999"
        questionStem="Which cell produces intrinsic factor?"
        revision={2}
        onSuccess={vi.fn()}
      />
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "delete-dialog-title");
    expect(screen.getByText("Remove Question from Practice?")).toBeInTheDocument();
    expect(screen.getByText(/Which cell produces intrinsic factor/i)).toBeInTheDocument();
    expect(screen.getByText(/Rev 2/i)).toBeInTheDocument();
  });

  it("dismisses on Escape key press", () => {
    const onClose = vi.fn();
    render(
      <DeleteQuestionModal
        isOpen={true}
        onClose={onClose}
        moduleCode="MGL-3"
        chapterId={2}
        questionId="MGL3-PHYS-999"
        onSuccess={vi.fn()}
      />
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});

describe("AdminPortal Delete and Restore Integration", () => {
  it("shows Delete Question button in Review Decision panel and allows deletion", async () => {
    const fetchMock = vi.fn(async (url: string, opts: any) => {
      if (url.includes("action=access")) {
        return { ok: true, json: async () => ({ isAdmin: true }) };
      }
      if (url.includes("action=detail")) {
        return { ok: true, json: async () => ({ report: mockReport }) };
      }
      if (url.includes("action=single")) {
        return {
          ok: true,
          json: async () => ({
            entry: {
              revision: 1,
              deleted: false,
              question: mockReport.snapshot.question,
            },
          }),
        };
      }
      if (url === "/api/question-bank" && opts?.method === "DELETE") {
        return {
          ok: true,
          status: 200,
          json: async () => ({ edit: { revision: 2, deleted: true } }),
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
        json: async () => ({
          reports: [mockReport],
          total: 1,
          counts: { new: 1, reviewing: 0, fixed: 0, dismissed: 0 },
        }),
      };
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <MemoryRouter initialEntries={["/admin/reports?report=rep_del_101"]}>
        <AdminPortal />
      </MemoryRouter>
    );

    // Wait for ReportDetail to load
    await screen.findByRole("heading", { name: "Wrong answer" });

    // Verify Delete Question button is present in the review decision panel
    const deleteBtn = screen.getByRole("button", { name: /Delete Question/i });
    expect(deleteBtn).toBeInTheDocument();

    // Click Delete Question
    fireEvent.click(deleteBtn);

    // Confirm dialog is open
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Remove Question from Practice?")).toBeInTheDocument();

    // Confirm removal
    const confirmBtn = screen.getByRole("button", { name: "Confirm remove question" });
    fireEvent.click(confirmBtn);

    // After deletion: Question Removed banner should appear with Restore Question button
    await screen.findByText("Question Removed from Student Practice");
    expect(screen.getAllByRole("button", { name: /Restore Question/i }).length).toBeGreaterThanOrEqual(1);
  });

  it("restores a deleted question via Restore Question button", async () => {
    const deletedReport: QuestionReport = {
      ...mockReport,
      snapshot: {
        ...mockReport.snapshot,
        question: {
          ...mockReport.snapshot.question,
          deleted: true,
        } as any,
      },
    };

    const fetchMock = vi.fn(async (url: string, opts: any) => {
      if (url.includes("action=access")) {
        return { ok: true, json: async () => ({ isAdmin: true }) };
      }
      if (url.includes("action=detail")) {
        return { ok: true, json: async () => ({ report: deletedReport }) };
      }
      if (url.includes("action=single")) {
        return {
          ok: true,
          json: async () => ({
            entry: {
              revision: 2,
              deleted: true,
              question: deletedReport.snapshot.question,
            },
          }),
        };
      }
      if (url === "/api/question-bank" && opts?.method === "PATCH") {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            edit: {
              revision: 3,
              deleted: false,
              question: { ...deletedReport.snapshot.question, deleted: false },
            },
          }),
        };
      }
      return {
        ok: true,
        json: async () => ({
          reports: [deletedReport],
          total: 1,
          counts: { new: 1, reviewing: 0, fixed: 0, dismissed: 0 },
        }),
      };
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <MemoryRouter initialEntries={["/admin/reports?report=rep_del_101"]}>
        <AdminPortal />
      </MemoryRouter>
    );

    // Question Removed banner is immediately visible for deleted question
    await screen.findByText("Question Removed from Student Practice");

    // Click Restore Question
    const restoreButtons = screen.getAllByRole("button", { name: /Restore Question/i });
    expect(restoreButtons.length).toBeGreaterThan(0);
    fireEvent.click(restoreButtons[0]);

    await waitFor(() => {
      const patchCall = fetchMock.mock.calls.find(
        (call) => call[0] === "/api/question-bank" && call[1]?.method === "PATCH"
      );
      expect(patchCall).toBeDefined();
      const body = JSON.parse(patchCall![1].body);
      expect(body.moduleCode).toBe("MGL-3");
      expect(body.questionId).toBe("MGL3-PHYS-999");
      expect(body.question.deleted).toBe(false);
    });
  });
});
