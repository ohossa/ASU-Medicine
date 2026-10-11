import { it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { QuizInterface } from "./QuizInterface";
import { ResultsDashboard } from "./ResultsDashboard";
import { ensureDataLoaded, getChaptersForModuleAndMode } from "../data";
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
  title: "Past exams — Histology",
  subtitle: "",
  emoji: "",
  page: 1,
  lectureRange: "",
  accentColor: "histology",
  subjects: [],
};
beforeEach(() => {
  cleanup();
  localStorage.clear();
  vi.clearAllMocks();
});
it.each([true, false])(
  "keeps sound, pulse, submitted answer and results consistent for a correct %s choice",
  (choice) => {
    const q: Question = {
      id: "tf-feedback",
      lecture: 1,
      type: "truefalse",
      text: "Statement",
      options: ["True", "False"],
      correctIndex: choice ? 0 : 1,
      explanation: "Useful explanation.",
      subjectColor: "histology",
    };
    const finish = vi.fn();
    render(
      <QuizInterface
        chapter={chapter}
        subject={null}
        questions={[q]}
        onBack={vi.fn()}
        onFinish={finish}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: choice ? "True" : "False" }),
    );
    expect(feedback.sound).toHaveBeenCalledWith("correct");
    expect(feedback.sound).not.toHaveBeenCalledWith("wrong");
    expect(feedback.correct).toHaveBeenCalled();
    expect(feedback.wrong).not.toHaveBeenCalled();
    window.dispatchEvent(new Event("asu:save-before-refresh"));
    expect(
      JSON.parse(localStorage.getItem("asu_quiz_session:guest:101:all")!)
        .answers,
    ).toEqual({ 0: choice });
    fireEvent.click(screen.getByRole("button", { name: /Finish/ }));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(finish.mock.calls[0][0]).toEqual({ 0: choice });
    cleanup();
    render(
      <ResultsDashboard
        chapter={chapter}
        subject={null}
        questions={[q]}
        answers={finish.mock.calls[0][0]}
        elapsedSeconds={10}
        flaggedQuestions={new Set()}
        onRetake={vi.fn()}
        onTryAnotherSubject={vi.fn()}
        onBackToChapters={vi.fn()}
        onBackToSubjects={vi.fn()}
      />,
    );
    expect(screen.getAllByText("Correct").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /^Incorrect/ }),
    ).toHaveTextContent("0");
  },
);
it("uses correct feedback for the exact reported vermilion-border item from the real bank", async () => {
  await ensureDataLoaded();
  const q = getChaptersForModuleAndMode("MGL-3", "mixed")
    .flatMap((c) => c.subjects.flatMap((s) => s.questions))
    .find(
      (q) =>
        q.type === "truefalse" && /free red margin of the lip/i.test(q.text),
    );
  expect(q).toBeDefined();
  render(
    <QuizInterface
      chapter={chapter}
      subject={null}
      questions={[q!]}
      onBack={vi.fn()}
      onFinish={vi.fn()}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "True" }));
  expect(feedback.sound).toHaveBeenCalledWith("correct");
  expect(feedback.wrong).not.toHaveBeenCalled();
});

it('keeps one accessible icon-only sound control when keyboard shortcuts are open',()=>{
 const q:Question={id:'sound-control',type:'mcq',text:'Question',options:['A','B'],correctIndex:0,lecture:1,explanation:'Test explanation.',subjectColor:'histology'};
 render(<QuizInterface chapter={chapter} subject={null} questions={[q]} onBack={vi.fn()} onFinish={vi.fn()}/>);
 const control=screen.getByRole('button',{name:'Mute sounds'});
 expect(control).toHaveAttribute('aria-pressed','true');
 expect(control.className).not.toContain('hidden');
 expect(control).toHaveTextContent(/^$/);
 fireEvent.click(screen.getByRole('button',{name:'Keyboard shortcuts'}));
 expect(screen.getAllByRole('button',{name:'Mute sounds'})).toHaveLength(1);
});

it('names the shortcuts panel, pauses answer shortcuts and returns focus on Escape',async()=>{
 const q:Question={id:'shortcut-a11y',type:'mcq',text:'Question',options:['A','B'],correctIndex:0,lecture:1,explanation:'Test explanation.',subjectColor:'histology'};
 render(<QuizInterface chapter={chapter} subject={null} questions={[q]} onBack={vi.fn()} onFinish={vi.fn()}/>);
 const trigger=screen.getByRole('button',{name:'Keyboard shortcuts'});
 fireEvent.click(trigger);
 expect(screen.getByRole('dialog',{name:'Keyboard shortcuts'})).toBeInTheDocument();
 expect(screen.getByRole('button',{name:'Close keyboard shortcuts'})).toHaveFocus();
 fireEvent.keyDown(window,{key:'1'});expect(feedback.sound).not.toHaveBeenCalled();
 fireEvent.keyDown(window,{key:'Escape'});
 await waitFor(()=>expect(screen.queryByRole('dialog',{name:'Keyboard shortcuts'})).not.toBeInTheDocument());
 expect(trigger).toHaveFocus();
});

it('uses a named question region inside the portal main landmark',()=>{
 const q:Question={id:'landmark',type:'mcq',text:'Question',options:['A','B'],correctIndex:0,lecture:1,explanation:'Test explanation.',subjectColor:'histology'};
 render(<main><QuizInterface chapter={chapter} subject={null} questions={[q]} onBack={vi.fn()} onFinish={vi.fn()}/></main>);
 expect(screen.getAllByRole('main')).toHaveLength(1);
 expect(screen.getByRole('region',{name:'Question practice'})).toBeInTheDocument();
});
