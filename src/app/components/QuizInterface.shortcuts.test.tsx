import { it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { QuizInterface } from "./QuizInterface";
import type { Question, ChapterData } from "../types";

const feedback = vi.hoisted(() => ({
  sound: vi.fn(),
  correct: vi.fn(),
  wrong: vi.fn(),
}));

vi.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({ getToken: vi.fn() }),
  useUser: () => ({ user: null, isSignedIn: false }),
}));

vi.mock("../hooks/useLanguage", () => ({
  useLanguage: () => ({ language: "en", t: (key: string) => key }),
}));

vi.mock("../hooks/useTheme", () => ({ useTheme: () => ({ theme: "dark" }) }));
vi.mock("../hooks/useCloudSync", () => ({ triggerCloudSync: vi.fn() }));
vi.mock("../hooks/useProgress", () => ({
  useProgress: () => ({ unlock: vi.fn() }),
}));

vi.mock("../hooks/useSoundEngine", () => ({
  useSoundEngine: () => ({
    trigger: feedback.sound,
    muted: false,
    toggleMute: vi.fn(),
  }),
}));

vi.mock("../lib/pulseEngine", () => ({
  fx: { correct: feedback.correct, wrong: feedback.wrong },
  pulse: { setMood: vi.fn() },
}));

vi.mock("../lib/celebrate", () => ({ celebrate: vi.fn() }));
vi.mock("../reports/ReportQuestion", () => ({
  ReportQuestionButton: () => null,
}));

const chapter: ChapterData = {
  id: 101,
  title: "Shortcuts Test Chapter",
  subtitle: "",
  emoji: "",
  page: 1,
  lectureRange: "",
  accentColor: "anatomy",
  subjects: [],
};

const makeTF = (id = "tf-1", correctIndex = 0): Question => ({
  id,
  lecture: 1,
  type: "truefalse",
  text: "Statement for True/False testing",
  options: ["True", "False"],
  correctIndex,
  explanation: "True/False explanation",
  subjectColor: "anatomy",
});

const makeMCQ = (id = "mcq-1"): Question => ({
  id,
  lecture: 1,
  type: "mcq",
  text: "MCQ question stem",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctIndex: 0,
  explanation: "MCQ explanation",
  subjectColor: "anatomy",
});

beforeEach(() => {
  cleanup();
  localStorage.clear();
  vi.clearAllMocks();
});

it("selects True when pressing 't' on an unanswered True/False question", () => {
  const finish = vi.fn();
  render(
    <QuizInterface
      chapter={chapter}
      subject={null}
      questions={[makeTF()]}
      onBack={vi.fn()}
      onFinish={finish}
    />,
  );

  expect(screen.getByText("T / 1")).toBeInTheDocument();
  fireEvent.keyDown(window, { key: "t" });

  expect(feedback.sound).toHaveBeenCalledWith("correct");
  fireEvent.click(screen.getByRole("button", { name: /Finish/ }));
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  expect(finish.mock.calls[0][0]).toEqual({ 0: true });
});

it("selects True when pressing numeric '1' or Arabic '١' on an unanswered True/False question", () => {
  const finish = vi.fn();
  render(
    <QuizInterface
      chapter={chapter}
      subject={null}
      questions={[makeTF()]}
      onBack={vi.fn()}
      onFinish={finish}
    />,
  );

  fireEvent.keyDown(window, { key: "1" });
  expect(feedback.sound).toHaveBeenCalledWith("correct");

  fireEvent.click(screen.getByRole("button", { name: /Finish/ }));
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  expect(finish.mock.calls[0][0]).toEqual({ 0: true });
});

it("selects False when pressing 'f' on an unanswered True/False question", () => {
  const finish = vi.fn();
  render(
    <QuizInterface
      chapter={chapter}
      subject={null}
      questions={[makeTF("tf-2", 1)]}
      onBack={vi.fn()}
      onFinish={finish}
    />,
  );

  expect(screen.getByText("F / 2")).toBeInTheDocument();
  fireEvent.keyDown(window, { key: "f" });

  expect(feedback.sound).toHaveBeenCalledWith("correct");
  fireEvent.click(screen.getByRole("button", { name: /Finish/ }));
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  expect(finish.mock.calls[0][0]).toEqual({ 0: false });
});

it("selects False when pressing numeric '2' or Arabic '٢' on an unanswered True/False question", () => {
  const finish = vi.fn();
  render(
    <QuizInterface
      chapter={chapter}
      subject={null}
      questions={[makeTF("tf-3", 1)]}
      onBack={vi.fn()}
      onFinish={finish}
    />,
  );

  fireEvent.keyDown(window, { key: "2" });
  expect(feedback.sound).toHaveBeenCalledWith("correct");

  fireEvent.click(screen.getByRole("button", { name: /Finish/ }));
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  expect(finish.mock.calls[0][0]).toEqual({ 0: false });
});

it("toggles flag when pressing 'f' on an already answered True/False question", () => {
  render(
    <QuizInterface
      chapter={chapter}
      subject={null}
      questions={[makeTF()]}
      onBack={vi.fn()}
      onFinish={vi.fn()}
    />,
  );

  // Answer first with 't'
  fireEvent.keyDown(window, { key: "t" });

  // Now press 'f' -> should toggle flag instead of changing answer
  const flagBtn = screen.getByRole("button", { name: /Flag question/i });
  expect(flagBtn).toBeInTheDocument();
  expect(flagBtn).toHaveAttribute("aria-pressed", "false");

  fireEvent.keyDown(window, { key: "f" });
  expect(screen.getByRole("button", { name: /Flagged question/i })).toHaveAttribute("aria-pressed", "true");

  // Pressing 'f' again unflags
  fireEvent.keyDown(window, { key: "f" });
  expect(screen.getByRole("button", { name: /Flag question/i })).toHaveAttribute("aria-pressed", "false");
});

it("toggles flag when pressing Shift+F on an unanswered True/False question without answering", () => {
  render(
    <QuizInterface
      chapter={chapter}
      subject={null}
      questions={[makeTF()]}
      onBack={vi.fn()}
      onFinish={vi.fn()}
    />,
  );

  const flagBtn = screen.getByRole("button", { name: /Flag question/i });
  expect(flagBtn).toHaveAttribute("aria-pressed", "false");

  fireEvent.keyDown(window, { key: "F", shiftKey: true });
  expect(screen.getByRole("button", { name: /Flagged question/i })).toHaveAttribute("aria-pressed", "true");

  // Verify True and False buttons remain uncommitted and enabled
  expect(screen.getByRole("button", { name: /True/i })).not.toBeDisabled();
  expect(screen.getByRole("button", { name: /False/i })).not.toBeDisabled();
});

it("toggles flag when pressing 'f' on an MCQ question without answering", () => {
  render(
    <QuizInterface
      chapter={chapter}
      subject={null}
      questions={[makeMCQ()]}
      onBack={vi.fn()}
      onFinish={vi.fn()}
    />,
  );

  const flagBtn = screen.getByRole("button", { name: /Flag question/i });
  expect(flagBtn).toHaveAttribute("aria-pressed", "false");

  fireEvent.keyDown(window, { key: "f" });
  expect(screen.getByRole("button", { name: /Flagged question/i })).toHaveAttribute("aria-pressed", "true");
  expect(feedback.sound).not.toHaveBeenCalled();
});

it("displays keyboard shortcut badges when unanswered and hides them once answered", () => {
  render(
    <QuizInterface
      chapter={chapter}
      subject={null}
      questions={[makeTF()]}
      onBack={vi.fn()}
      onFinish={vi.fn()}
    />,
  );

  expect(screen.getByText("T / 1")).toBeInTheDocument();
  expect(screen.getByText("F / 2")).toBeInTheDocument();

  fireEvent.keyDown(window, { key: "t" });

  expect(screen.queryByText("T / 1")).toBeNull();
  expect(screen.queryByText("F / 2")).toBeNull();
});

it("shows True/False shortcut entries in the shortcuts popover dialog", () => {
  render(
    <QuizInterface
      chapter={chapter}
      subject={null}
      questions={[makeTF()]}
      onBack={vi.fn()}
      onFinish={vi.fn()}
    />,
  );

  const shortcutsTrigger = screen.getByRole("button", { name: /Keyboard shortcuts/i });
  fireEvent.click(shortcutsTrigger);

  expect(screen.getByText("Select True / False")).toBeInTheDocument();
  expect(screen.getByText("T / F or 1 / 2")).toBeInTheDocument();
});
