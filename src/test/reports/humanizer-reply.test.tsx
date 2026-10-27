import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import {
  reviewContext,
  replyTemplate,
  humanizeAIExplanation,
} from "../../app/reports/review-context";
import { ReplyComposer } from "../../pages/ReportReplyComposer";
import type { QuestionReport } from "../../app/reports/contracts";

vi.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({ getToken: async () => "token" }),
  useUser: () => ({ user: { id: "owner" } }),
}));

const mockReport = {
  id: "rep-12345",
  requestHash: "hash-12345",
  reporterId: "student-account-99",
  reporter: { name: "Ahmed Ali", username: "ahmed123", email: "ahmed@example.com", emailVerified: true },
  category: "wrong_answer",
  explanation: "Option B is physiologically inaccurate according to Guyton chapter 28.",
  notes: "Private reviewer thoughts - DO NOT LEAK",
  status: "new",
  revision: 1,
  createdAt: "2026-10-27T10:00:00Z",
  updatedAt: "2026-10-27T10:00:00Z",
  notification: { state: "sent" },
  snapshot: {
    moduleCode: "MRS-2",
    chapterId: 3,
    chapterTitle: "Renal Physiology & Acid-Base",
    subjectName: "Physiology",
    topicName: "Glomerular Filtration",
    version: "v2",
    question: {
      id: "q-renal-042",
      type: "mcq",
      text: "Which force promotes ultrafiltration across the glomerular capillary membrane?",
      options: [
        "Glomerular capillary hydrostatic pressure",
        "Bowman space hydrostatic pressure",
        "Glomerular capillary oncotic pressure",
        "Systemic venous pressure",
      ],
      correctIndex: 0,
      explanation: "Glomerular hydrostatic pressure (~60 mmHg) is the primary force favoring filtration.",
    },
  },
} as QuestionReport;

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe("reviewContext Prompt with Structural Humanizer Instructions", () => {
  it("includes founder name, anti-AI directives, and full question details for copying to external AI chat", () => {
    const prompt = reviewContext(mockReport);

    // Identifies Omar HossamEldin Maged & Ain Shams Medicine
    expect(prompt).toContain("Omar HossamEldin Maged");
    expect(prompt).toContain("ASUCodes Medical Portal");
    expect(prompt).toContain("Faculty of Medicine, Ain Shams University");

    // Structural-humanizer and anti-AI instructions
    expect(prompt).toContain("STRICT HUMANIZER & ANTI-AI WRITING INSTRUCTIONS");
    expect(prompt).toContain("Zero Conversational AI Filler");
    expect(prompt).toContain("Anti-AI Vocabulary");
    expect(prompt).toContain("No Em Dashes or Formatting Slop");
    expect(prompt).toContain("No Negative Parallelisms");
    expect(prompt).toContain("Plain Emotion & Concrete Specificity");

    // Full question snapshot
    expect(prompt).toContain("MRS-2");
    expect(prompt).toContain("Renal Physiology & Acid-Base");
    expect(prompt).toContain("Which force promotes ultrafiltration");
    expect(prompt).toContain("A. Glomerular capillary hydrostatic pressure (Marked Correct on Portal)");
    expect(prompt).toContain("Glomerular hydrostatic pressure (~60 mmHg)");

    // Student note
    expect(prompt).toContain("Option B is physiologically inaccurate according to Guyton chapter 28.");

    // Strict privacy: omits private email, user ID, and internal notes
    expect(prompt).not.toContain("ahmed@example.com");
    expect(prompt).not.toContain("student-account-99");
    expect(prompt).not.toContain("Private reviewer thoughts");
  });
});

describe("replyTemplate Enhanced with Question Reference and Full Name", () => {
  it("includes the full reported question details, answer on portal, and signs as Omar HossamEldin Maged", () => {
    const template = replyTemplate("correct", mockReport);

    // Full name signature
    expect(template).toContain("Omar HossamEldin Maged");
    expect(template).not.toMatch(/\bOmar\b\s*\nASUCodes/); // Not just "Omar"

    // Question reference block
    expect(template).toContain("--- REPORTED QUESTION REFERENCE ---");
    expect(template).toContain("Module: MRS-2 · Renal Physiology & Acid-Base · Physiology · Glomerular Filtration");
    expect(template).toContain("Question ID: q-renal-042");
    expect(template).toContain("Which force promotes ultrafiltration");
    expect(template).toContain("A. Glomerular capillary hydrostatic pressure  [Current Answer]");
    expect(template).toContain("Answer on Portal: A. Glomerular capillary hydrostatic pressure");
    expect(template).toContain("Option B is physiologically inaccurate");

    // Placeholder present for filling
    expect(template).toContain("[Explain the correct answer and address the student’s concern here]");
  });
});

describe("humanizeAIExplanation De-Slop Function", () => {
  it("strips conversational preambles, trailing pleasantries, em dashes, curly quotes, and AI buzzwords", () => {
    const rawAiText = `Here is a response for the student:

Certainly! The glomerular capillary hydrostatic pressure—which averages roughly 60 mmHg—serves as a testament to the crucial and pivotal role of hemodynamic autoregulation. It's not just about filtration, it's about maintaining constant GFR.

I hope this helps! Feel free to reach out if you have any further questions.
Best regards,
Medical AI Assistant`;

    const cleaned = humanizeAIExplanation(rawAiText);

    // Preambles and outros stripped
    expect(cleaned).not.toContain("Here is a response");
    expect(cleaned).not.toContain("Certainly!");
    expect(cleaned).not.toContain("I hope this helps!");
    expect(cleaned).not.toContain("Feel free to reach out");
    expect(cleaned).not.toContain("Medical AI Assistant");

    // Em dashes stripped
    expect(cleaned).not.toContain("—");

    // AI buzzwords replaced
    expect(cleaned).not.toContain("serves as a testament to");
    expect(cleaned).not.toContain("crucial");
    expect(cleaned).not.toContain("pivotal");

    // Core medical explanation preserved
    expect(cleaned).toContain("glomerular capillary hydrostatic pressure");
    expect(cleaned).toContain("60 mmHg");
    expect(cleaned).toContain("hemodynamic autoregulation");
  });
});

describe("ReplyComposer Auto-Humanizer and AI Chat Paste Workflow", () => {
  it("replaces the template placeholder with the humanized AI text upon clicking 'Humanize & Insert into draft'", async () => {
    const request = vi.fn(async () => ({
      replies: [],
      recipient: "ahmed@example.com",
      configured: true,
      draft: null,
    }));

    render(<ReplyComposer report={mockReport} request={request as any} />);

    // Wait for recipient to load
    await screen.findByText("ahmed@example.com");

    // Select the "Answer is correct" template
    fireEvent.click(screen.getByRole("button", { name: "Answer is correct" }));

    const textarea = screen.getByLabelText("Email message") as HTMLTextAreaElement;
    expect(textarea.value).toContain("[Explain the correct answer and address the student’s concern here]");
    expect(textarea.value).toContain("Omar HossamEldin Maged");

    // Open the AI Paste Box
    fireEvent.click(screen.getByRole("button", { name: /Open paste box/i }));

    const aiPasteInput = screen.getByPlaceholderText(/Paste raw AI discussion or medical explanation here.../i);
    fireEvent.change(aiPasteInput, {
      target: {
        value: "Certainly! Option A is correct because glomerular capillary hydrostatic pressure is the primary filtration force in Starling dynamics.",
      },
    });

    // Click "Humanize & Insert into draft"
    fireEvent.click(screen.getByRole("button", { name: /Humanize & Insert into draft/i }));

    // Placeholder is replaced by the cleaned explanation
    expect(textarea.value).not.toContain("[Explain the correct answer and address the student’s concern here]");
    expect(textarea.value).toContain("Option A is correct because glomerular capillary hydrostatic pressure");
    expect(textarea.value).not.toContain("Certainly!"); // stripped by humanizer
  });
});
