import { it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { QuizInterface } from "./QuizInterface";
import {checkAnswerCorrect} from "../utils/quiz";
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
const chapter:ChapterData={id:101,title:'Immunization',subtitle:'',emoji:'',page:1,lectureRange:'',accentColor:'microbiology',subjects:[]};
const q:Question={id:'multipart',type:'case',lecture:1,subjectColor:'microbiology',text:'Classify acquired immunity',explanation:'Classify each mechanism.',subQuestions:[{id:'infection',type:'essay',text:'Infection',modelAnswer:'Natural active immunity.',explanation:'The recipient generates its own response.'},{id:'antibody',type:'essay',text:'Antibody injection',modelAnswer:'Artificial passive immunity.',explanation:'Preformed antibody is transferred.'}]};
beforeEach(()=>{cleanup();localStorage.clear();vi.clearAllMocks();});
it('announces the committed correct essay part without marking its incomplete parent incorrect',()=>{
 const finish=vi.fn();render(<QuizInterface chapter={chapter} subject={null} questions={[q]} onBack={vi.fn()} onFinish={finish}/>);
 fireEvent.click(screen.getAllByRole('button',{name:'Reveal Answer'})[0]);fireEvent.click(screen.getByRole('button',{name:'Correct'}));
 expect(screen.getByTestId('quiz-announcer')).toHaveTextContent('Correct. The recipient generates its own response.');expect(screen.getByTestId('quiz-announcer')).not.toHaveTextContent('Incorrect');expect(feedback.sound.mock.calls).toEqual([['correct']]);expect(feedback.wrong).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Reveal Answer'}));fireEvent.click(screen.getByRole('button',{name:'Correct'}));
 expect(feedback.sound.mock.calls).toEqual([['correct'],['correct']]);expect(screen.getByTestId('quiz-announcer')).toHaveTextContent('Correct. Preformed antibody is transferred.');
 fireEvent.click(screen.getByRole('button',{name:'Finish'}));fireEvent.click(screen.getByRole('button',{name:'Submit'}));expect(checkAnswerCorrect(q,finish.mock.calls[0][0][0])).toBe(true);
});
it('uses the current wrong child model answer rather than an empty parent choice label',()=>{
 render(<QuizInterface chapter={chapter} subject={null} questions={[q]} onBack={vi.fn()} onFinish={vi.fn()}/>);
 fireEvent.click(screen.getAllByRole('button',{name:'Reveal Answer'})[1]);fireEvent.click(screen.getByRole('button',{name:'Incorrect'}));expect(screen.getByTestId('quiz-announcer')).toHaveTextContent('Incorrect. The correct answer was Artificial passive immunity.');expect(feedback.sound.mock.calls).toEqual([['wrong']]);
});
it('gives correct MCQ child feedback while another part remains unanswered',()=>{
 const mixed:Question={...q,subQuestions:[{id:'choice',type:'mcq',text:'IgG transfer?',options:['Active','Passive'],correctIndex:1,explanation:'Preformed IgG supplies passive protection.'},q.subQuestions![0]]};
 render(<QuizInterface chapter={chapter} subject={null} questions={[mixed]} onBack={vi.fn()} onFinish={vi.fn()}/>);fireEvent.click(screen.getByRole('button',{name:/Passive/}));expect(feedback.sound.mock.calls).toEqual([['correct']]);expect(screen.getByTestId('quiz-announcer')).toHaveTextContent('Correct. Preformed IgG supplies passive protection.');
});
it('does not grade a case blank typing draft, then gives feedback once after submission',()=>{
 const blanks:Question={...q,subQuestions:[{id:'blank',type:'fillblank',text:'The antibody is (____)',blanks:['IgG'],explanation:'IgG is transferred across the placenta.'},q.subQuestions![0]]};
 render(<QuizInterface chapter={chapter} subject={null} questions={[blanks]} onBack={vi.fn()} onFinish={vi.fn()}/>);fireEvent.change(screen.getByPlaceholderText('Blank 1'),{target:{value:'IgG'}});expect(feedback.sound).not.toHaveBeenCalled();expect(screen.getByTestId('quiz-announcer')).toBeEmptyDOMElement();fireEvent.click(screen.getByRole('button',{name:'Submit Answers'}));expect(feedback.sound.mock.calls).toEqual([['correct']]);expect(screen.getByTestId('quiz-announcer')).toHaveTextContent('Correct. IgG is transferred across the placenta.');
});
it('does not replay feedback for committed parts restored from a saved case',()=>{
 render(<QuizInterface chapter={chapter} subject={null} questions={[q]} onBack={vi.fn()} onFinish={vi.fn()} savedSession={{chapterId:101,subjectName:'all',questionIds:['multipart'],current:0,answers:{0:{infection:{text:'',selfGrade:'correct'}}},elapsedSeconds:1,flagged:[],finished:false,timerMode:'practice',showEssayAnswer:false,timestamp:1}}/>);expect(feedback.sound).not.toHaveBeenCalled();expect(screen.getByTestId('quiz-announcer')).toBeEmptyDOMElement();
});
it('changes the live-region text for consecutive parts with identical feedback',()=>{
 const repeated:Question={...q,subQuestions:q.subQuestions!.map(child=>({...child,explanation:'The recipient responds.'}))};
 render(<QuizInterface chapter={chapter} subject={null} questions={[repeated]} onBack={vi.fn()} onFinish={vi.fn()}/>);fireEvent.click(screen.getAllByRole('button',{name:'Reveal Answer'})[0]);fireEvent.click(screen.getByRole('button',{name:'Correct'}));const first=screen.getByTestId('quiz-announcer').textContent;
 fireEvent.click(screen.getByRole('button',{name:'Reveal Answer'}));fireEvent.click(screen.getByRole('button',{name:'Correct'}));expect(screen.getByTestId('quiz-announcer').textContent).not.toBe(first);expect(feedback.sound.mock.calls).toEqual([['correct'],['correct']]);
});
it('gives a useful standalone essay self-grade announcement without an empty MCQ answer label',()=>{
 const essay:Question={...q,type:'essay',subQuestions:undefined,text:'Compare active and passive immunity',modelAnswer:'Active creates a recipient response; passive transfers antibody.'};render(<QuizInterface chapter={chapter} subject={null} questions={[essay]} onBack={vi.fn()} onFinish={vi.fn()}/>);fireEvent.click(screen.getByRole('button',{name:'revealModelAnswer'}));fireEvent.click(screen.getByRole('button',{name:'incorrect'}));expect(screen.getByTestId('quiz-announcer')).toHaveTextContent('Incorrect. Review the model answer.');
});
