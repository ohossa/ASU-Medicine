import biochemistry from '../../imports/year-1/semester-1/IBM-1.json';
import { it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
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
const show=(text:string)=>render(<QuizInterface chapter={chapter} subject={null} questions={[{id:'format-test',lecture:1,type:'mcq',text,options:['A long chemical name that must remain visible when it wraps','Other'],correctIndex:0,explanation:'Explanation',subjectColor:'biochem'} as Question]} onBack={vi.fn()} onFinish={vi.fn()}/>);
it('renders all prose containing a pipe rather than swallowing it as a table',()=>{
 show('Higher |S] is needed to reach Vmax/2. Which inhibitor is involved?');
 expect(screen.getByText('Higher |S] is needed to reach Vmax/2. Which inhibitor is involved?')).toBeInTheDocument();
});
it('renders table context and options with safe wrapping',()=>{
 show('Which pattern is correct?\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\nSelect the answer.');
 expect(screen.getByText('Which pattern is correct?')).toBeInTheDocument();expect(screen.getByText('Select the answer.')).toBeInTheDocument();expect(screen.getByRole('table')).toBeInTheDocument();
 expect(screen.getByText('A long chemical name that must remain visible when it wraps').className).toContain('overflow-wrap:anywhere');
});
it('renders the restored source matching table as six pairs in one question',()=>{
 const raw=biochemistry.chapters.flatMap(c=>c.subjects.flatMap(s=>s.questions)).find(q=>q.id==='IBM1-BIO-DRV-20260921-00208')!;
 const q={...raw,subjectColor:'biochem'} as Question;
 render(<QuizInterface chapter={chapter} subject={null} questions={[q]} onBack={vi.fn()} onFinish={vi.fn()}/>);
 expect(screen.getAllByText('Match each protein with its most appropriate description.')).toHaveLength(1);
 for(const premise of ['Collagen','Hemoglobin','Plasma proteins','Chaperones','Zein of maize','Milk proteins'])expect(screen.getByText(premise)).toBeInTheDocument();
 expect(screen.queryByText('Reference Answer:')).not.toBeInTheDocument();
});
