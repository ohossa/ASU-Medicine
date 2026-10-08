import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizInterface } from './QuizInterface';
import type { ChapterData, Question } from '../types';
vi.mock('@clerk/clerk-react', () => ({ useAuth: () => ({ getToken: vi.fn() }), useUser: () => ({ user: null, isSignedIn: false }) }));
vi.mock('../hooks/useLanguage', () => ({ useLanguage: () => ({ language: 'en', t: (key: string) => key }) }));
vi.mock('../hooks/useCloudSync', () => ({ triggerCloudSync: vi.fn() }));
vi.mock('../hooks/useSoundEngine', () => ({ useSoundEngine: () => ({ trigger: vi.fn(), muted: true, toggleMute: vi.fn() }) }));
const question: Question = { id: 'git-nav-q', lecture: 1, type: 'mcq', text: 'Test prompt', options: ['One','Two'], correctIndex: 1, explanation: '', subjectColor: 'anatomy' };
const chapter: ChapterData = { id: 101, title: 'Past exams — Anatomy', bankSection: 'past-exams', subtitle: 'Anatomy', emoji: '📚', page: 3, lectureRange: '', accentColor: 'anatomy', subjects: [] };
beforeEach(() => localStorage.clear());
describe('Minimal quiz navigation', () => {
  it('announces a correct true/false selection and saves its boolean value', () => {
    const tf: Question={...question,id:'tf',type:'truefalse',text:'Statement',options:['True','False'],correctIndex:0,explanation:'The attachment is correct.'};
    const back=vi.fn();
    render(<QuizInterface chapter={chapter} subject={{id:'anatomy',iconName:'Bone',name:'TF topic',lectures:'',lectureCount:1,questions:[tf]}} questions={[tf]} onBack={back} onFinish={vi.fn()}/>);
    fireEvent.click(screen.getByRole('button',{name:'True'}));
    expect(screen.getByText('Correct. The attachment is correct.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:/^Back$/}));
    const saved=JSON.parse(localStorage.getItem('asu_quiz_session:guest:101:TF topic')!);
    expect(saved.answers).toEqual({0:true});
  });
  it('reveals each case explanation only after its answer is revealed or submitted', () => {
    const caseQuestion: Question = { ...question, id: 'case-explanations', type: 'case', text: 'Case stem', subQuestions: [
      { id: 'case-choice', type: 'mcq', text: 'Choose the structure', options: ['One', 'Two'], correctIndex: 1, explanation: 'The muscular wall propels the bolus.' },
      { id: 'case-essay', type: 'essay', text: 'Explain the mechanism', modelAnswer: 'Muscle contraction', explanation: 'Coordinated contractions move contents forward.' },
    ] };
    render(<QuizInterface chapter={chapter} subject={{ id: 'anatomy', iconName: 'Bone', name: 'Case topic', lectures: '', lectureCount: 1, questions: [caseQuestion] }} questions={[caseQuestion]} onBack={vi.fn()} onFinish={vi.fn()} />);
    expect(screen.queryByText('The muscular wall propels the bolus.')).not.toBeInTheDocument();
    expect(screen.queryByText('Coordinated contractions move contents forward.')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Two/ }));
    expect(screen.getByText('The muscular wall propels the bolus.')).toBeInTheDocument();
    expect(screen.queryByText('Coordinated contractions move contents forward.')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reveal Answer' }));
    expect(screen.getByText('Coordinated contractions move contents forward.')).toBeInTheDocument();
  });
  it('hides the breadcrumb strip and saves progress before going back', () => {
    const navigate = vi.fn(() => {
      const saved = JSON.parse(localStorage.getItem('asu_quiz_session:guest:101:Oral cavity')!);
      expect(saved.answers).toEqual({ 0: 1 });
      expect(saved.questionIds).toEqual(['git-nav-q']);
      expect(saved.elapsedSeconds).toBeGreaterThanOrEqual(42);
    });
    render(<QuizInterface chapter={chapter} subject={{ id: 'anatomy', iconName: 'Bone', name: 'Oral cavity', lectures: '', lectureCount: 1, questions: [question] }} questions={[question]}
      onBack={navigate} onFinish={vi.fn()} breadcrumbPath={[{label:'Portal',onClick:navigate},{label:'Oral cavity'}]}
      savedSession={{ chapterId:101, subjectName:'Oral cavity', questionIds:['git-nav-q'], current:0, answers:{0:1}, elapsedSeconds:42, flagged:[], finished:false, timerMode:'practice', showEssayAnswer:false, timestamp:Date.now() }}/>);
    expect(screen.queryByRole('navigation',{name:'Breadcrumb'})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:/^Back$/}));
    expect(navigate).toHaveBeenCalledOnce();
  });
});
