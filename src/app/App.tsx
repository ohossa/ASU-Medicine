import { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Lock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Info,
  Activity,
  Layers,
  ArrowLeft,
  Settings,
  Mail,
  Sun,
  Moon,
  Clock,
  Award,
  ExternalLink
} from 'lucide-react';
import type { ChapterData, SubjectData, Question, Screen, SubjectColor } from './types';
import { ChapterSelect } from './components/ChapterSelect';
import { SubjectSelect } from './components/SubjectSelect';
import { QuizInterface } from './components/QuizInterface';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { saveQuizResult, getQuizHistory } from './utils/storage';
import type { QuizResult } from './utils/storage';
import {
  getChaptersForModuleAndMode,
  getModuleQuestionCounts,
  isModuleActive,
  SYLLABUS_MODULES
} from './data';
import type { ModuleInfo } from './data';

interface QuizPayload {
  chapter: ChapterData;
  subject: SubjectData | null;
  questions: Question[];
}

interface ResultPayload {
  chapter: ChapterData;
  subject: SubjectData | null;
  questions: Question[];
  answers: Record<number, any>;
  elapsedSeconds: number;
  flaggedQuestions: Set<number>;
}

// Unified portal footer component matching ASU branding
function PortalFooter() {
  return (
    <footer className="w-full mt-16 pb-8 text-center space-y-2 border-t border-gray-100 dark:border-gray-800/80 pt-6">
      <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wider uppercase">
        Ain Shams University • ASU Medical Portal
      </p>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium max-w-xl mx-auto px-6 leading-relaxed">
        Developed for medical students. For inquiries, database updates, or error reports, please contact:{' '}
        <a
          href="mailto:support-med@asu.edu.eg"
          className="hover:text-physiology dark:hover:text-white transition-colors underline font-semibold"
        >
          support-med@asu.edu.eg
        </a>
      </p>
    </footer>
  );
}

function MainApp() {
  const { isDark } = useTheme();
  
  // Navigation states
  const [screen, setScreen] = useState<Screen>('yearSelect');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleInfo | null>(null);
  const [studyMode, setStudyMode] = useState<'mcq' | 'essay' | 'mixed' | null>(null);
  
  // Quiz states
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(null);
  const [quizPayload, setQuizPayload] = useState<QuizPayload | null>(null);
  const [resultPayload, setResultPayload] = useState<ResultPayload | null>(null);
  
  // UI States
  const [modalModule, setModalModule] = useState<ModuleInfo | null>(null);

  const transitionTo = (fn: () => void) => {
    // @ts-ignore
    if (document.startViewTransition) {
      // @ts-ignore
      document.startViewTransition(fn);
    } else {
      fn();
    }
  };

  // Navigate back helper for breadcrumbs
  const navigateTo = (targetScreen: Screen) => {
    transitionTo(() => {
      setScreen(targetScreen);
      if (targetScreen === 'yearSelect') {
        setSelectedYear(null);
        setSelectedSemester(null);
        setSelectedModule(null);
        setStudyMode(null);
        setSelectedChapter(null);
      } else if (targetScreen === 'semesterSelect') {
        setSelectedSemester(null);
        setSelectedModule(null);
        setStudyMode(null);
        setSelectedChapter(null);
      } else if (targetScreen === 'moduleSelect') {
        setSelectedModule(null);
        setStudyMode(null);
        setSelectedChapter(null);
      } else if (targetScreen === 'studyModeSelect') {
        setStudyMode(null);
        setSelectedChapter(null);
      } else if (targetScreen === 'chapters') {
        setSelectedChapter(null);
      }
    });
  };

  const handleSelectYear = (year: number) => {
    transitionTo(() => {
      setSelectedYear(year);
      setScreen('semesterSelect');
    });
  };

  const handleSelectSemester = (sem: number) => {
    transitionTo(() => {
      setSelectedSemester(sem);
      setScreen('moduleSelect');
    });
  };

  const handleSelectModule = (mod: ModuleInfo) => {
    if (isModuleActive(mod.code)) {
      transitionTo(() => {
        setSelectedModule(mod);
        setScreen('studyModeSelect');
      });
    } else {
      // Show "Coming Soon" dialog
      setModalModule(mod);
    }
  };

  const handleSelectMode = (mode: 'mcq' | 'essay' | 'mixed') => {
    transitionTo(() => {
      setStudyMode(mode);
      setScreen('chapters');
    });
  };

  const handleSelectChapter = (chapter: ChapterData) => {
    transitionTo(() => {
      setSelectedChapter(chapter);
      setScreen('subjects');
    });
  };

  const handleSelectSubject = (subject: SubjectData, questions: Question[]) => {
    transitionTo(() => {
      setQuizPayload({ chapter: selectedChapter!, subject, questions });
      setScreen('quiz');
    });
  };

  const handleQuickStart = (questions: Question[]) => {
    transitionTo(() => {
      setQuizPayload({ chapter: selectedChapter!, subject: null, questions });
      setScreen('quiz');
    });
  };

  const checkAnswerCorrect = (q: Question, ans: any) => {
    if (ans === undefined) return false;
    if (q.type === 'mcq' || q.type === 'truefalse') {
      return ans === q.correctIndex;
    }
    if (q.type === 'matching') {
      const scrambled = ans.scrambled;
      const matches = ans.matches || ans;
      if (!scrambled || !matches || !q.pairs) return false;
      return q.pairs.every((pair, pIdx) => {
        const correctTargetIdx = scrambled.indexOf(pair.target);
        return matches[pIdx] === correctTargetIdx;
      });
    }
    if (q.type === 'essay') {
      return ans?.selfGrade === 'correct';
    }
    if (q.type === 'case' && q.subQuestions) {
      return q.subQuestions.every((subQ) => {
        const subAns = ans[subQ.id];
        if (subAns === undefined) return false;
        if (subQ.type === 'mcq') {
          return subAns === subQ.correctIndex;
        }
        if (subQ.type === 'essay') {
          return subAns?.selfGrade === 'correct';
        }
        return false;
      });
    }
    if (q.type === 'fillblank') {
      const userAnswers = ans.userAnswers || [];
      const blanks = q.blanks || [];
      if (userAnswers.length !== blanks.length) return false;
      return blanks.every((correctWord, bIdx) => {
        const userWord = (userAnswers[bIdx] || '').trim().toLowerCase();
        const correctWordLower = correctWord.toLowerCase();
        const matchesPrimary = userWord === correctWordLower;
        const matchesAccepted = q.acceptedAnswers?.[bIdx]?.some(
          (alt) => alt.trim().toLowerCase() === userWord
        );
        return matchesPrimary || matchesAccepted;
      });
    }
    return false;
  };

  const handleFinishQuiz = (answers: Record<number, any>, elapsedSeconds: number, flaggedQuestions: Set<number>) => {
    const questions = quizPayload!.questions;
    
    let total = 0;
    let correct = 0;

    questions.forEach((q, i) => {
      const ans = answers[i];
      if (q.type === 'case' && q.subQuestions) {
        total += q.subQuestions.length;
        if (ans) {
          q.subQuestions.forEach((subQ) => {
            const subAns = ans[subQ.id];
            if (subAns !== undefined) {
              const isSubCorrect = subQ.type === 'mcq'
                ? subAns === subQ.correctIndex
                : subAns?.selfGrade === 'correct';
              if (isSubCorrect) correct++;
            }
          });
        }
      } else {
        total += 1;
        if (ans !== undefined && checkAnswerCorrect(q, ans)) {
          correct++;
        }
      }
    });

    saveQuizResult({
      chapterId: quizPayload!.chapter.id,
      chapterTitle: quizPayload!.chapter.title,
      subjectName: quizPayload!.subject?.name ?? 'All Subjects',
      correct,
      total,
      pct: total > 0 ? Math.round((correct / total) * 100) : 0,
      elapsedSeconds,
      questionIds: questions.map(q => q.id),
      answers,
      flaggedQuestionIds: Array.from(flaggedQuestions)
    });

    transitionTo(() => {
      setResultPayload({
        chapter: quizPayload!.chapter,
        subject: quizPayload!.subject,
        questions,
        answers,
        elapsedSeconds,
        flaggedQuestions
      });
      setScreen('results');
    });
  };

  const handleSelectHistory = (result: QuizResult) => {
    // Look up within endocrine mixed chapters to find historical questions
    const endocrineMixed = getChaptersForModuleAndMode('MEM-2', 'mixed');
    const chapter = endocrineMixed.find((c) => c.id === result.chapterId);
    if (!chapter) return;

    const subject = chapter.subjects.find((s) => s.name === result.subjectName) || null;

    let questionsList: Question[] = [];
    if (result.questionIds && Array.isArray(result.questionIds)) {
      const allChapterQuestions = chapter.subjects.flatMap((s) => s.questions);
      result.questionIds.forEach((id: number) => {
        const found = allChapterQuestions.find((q) => q.id === id);
        if (found) {
          questionsList.push(found);
        }
      });
    }

    if (questionsList.length === 0) {
      if (subject) {
        questionsList = subject.questions;
      } else {
        questionsList = chapter.subjects.flatMap((s) => s.questions);
      }
    }

    const answersRecord = result.answers || {};
    const flaggedSet = new Set<number>(result.flaggedQuestionIds || []);

    transitionTo(() => {
      setSelectedYear(2);
      setSelectedSemester(2);
      setSelectedModule({
        code: 'MEM-2',
        name: 'Endocrine System & Metabolism Module',
        cp: 5.5,
        marks: 110,
        keywords: ['endocrine', 'metabolism', 'mem']
      });
      setStudyMode('mixed');
      setSelectedChapter(chapter);
      setQuizPayload({ chapter, subject, questions: questionsList });
      setResultPayload({
        chapter,
        subject,
        questions: questionsList,
        answers: answersRecord,
        elapsedSeconds: result.elapsedSeconds,
        flaggedQuestions: flaggedSet,
      });
      setScreen('results');
    });
  };

  const handleRetake = () => {
    if (!quizPayload) return;
    transitionTo(() => {
      setQuizPayload({ ...quizPayload, questions: quizPayload.questions });
      setScreen('quiz');
    });
  };

  const handleBackToChapters = () => {
    transitionTo(() => {
      setSelectedChapter(null);
      setQuizPayload(null);
      setResultPayload(null);
      setScreen('chapters');
    });
  };

  const redirectToEndocrine = () => {
    transitionTo(() => {
      setModalModule(null);
      setSelectedYear(2);
      setSelectedSemester(2);
      setSelectedModule({
        code: 'MEM-2',
        name: 'Endocrine System & Metabolism Module',
        cp: 5.5,
        marks: 110,
        keywords: ['endocrine', 'metabolism', 'mem']
      });
      setScreen('studyModeSelect');
    });
  };

  // Retrieve dynamically loaded chapters
  const activeChapters = selectedModule && studyMode
    ? getChaptersForModuleAndMode(selectedModule.code, studyMode)
    : [];

  const studyModeNameMap = {
    mcq: 'MCQ Practice Mode',
    essay: 'Essay Study Mode',
    mixed: 'Mixed Exam Mode'
  };

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 bg-gray-50/50 dark:bg-gray-950 font-manrope selection:bg-physiology/20 selection:text-physiology-dark">
      {/* Dynamic Floating Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-background pointer-events-none">
        <div className="absolute top-[12%] left-[4%] h-[35vw] w-[35vw] rounded-full bg-physiology/4 dark:bg-physiology/2 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[8%] right-[4%] h-[40vw] w-[40vw] rounded-full bg-anatomy/4 dark:bg-anatomy/2 blur-[160px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <style>{`
        @keyframes popUp {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-pop-up { animation: popUp 350ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .grid-delay:nth-child(1) { animation-delay: 40ms; }
        .grid-delay:nth-child(2) { animation-delay: 80ms; }
        .grid-delay:nth-child(3) { animation-delay: 120ms; }
        .grid-delay:nth-child(4) { animation-delay: 160ms; }
        .grid-delay:nth-child(5) { animation-delay: 200ms; }
        .grid-delay:nth-child(6) { animation-delay: 240ms; }
        
        .portal-card {
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .portal-card:hover {
          transform: translateY(-5px) scale(1.01);
        }
      `}</style>

      {/* TOP NAVIGATION HEADER WITH BREADCRUMBS */}
      {['yearSelect', 'semesterSelect', 'moduleSelect', 'studyModeSelect'].includes(screen) && (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-physiology to-clinical flex items-center justify-center text-white font-archivo font-black text-xl shadow-md shadow-physiology/20">
                A
              </div>
              <div>
                <h1 className="font-archivo font-extrabold text-base tracking-tight leading-none">
                  ASU Medical Portal
                </h1>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                  Ain Shams University
                </p>
              </div>

              {screen === 'yearSelect' && (
                <div className="flex flex-col ml-4 sm:ml-6 border-l border-gray-150 dark:border-gray-800 pl-4 space-y-0.5">
                  <a
                    href="https://asu2learn.asu.edu.eg/medicine-emp/my/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-physiology hover:text-physiology-dark dark:hover:text-physiology transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-physiology animate-pulse" />
                    <span>EMP Portal</span>
                  </a>
                  <a
                    href="https://asu2learn.asu.edu.eg/medicine/my/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600" />
                    <span>Mainstream</span>
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {screen === 'yearSelect' && (
                <a
                  href="https://ums.asu.edu.eg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-clinical/10 hover:bg-clinical/20 text-clinical-dark border border-clinical/20 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5"
                >
                  <span>UMS Portal</span>
                  <ExternalLink size={12} className="text-clinical" />
                </a>
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}

      {/* PORTAL CONTAINER */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Breadcrumbs for easy navigation jumpbacks */}
        {['semesterSelect', 'moduleSelect', 'studyModeSelect'].includes(screen) && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-6 bg-white dark:bg-gray-900 px-4 py-2.5 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm w-fit">
            <button onClick={() => navigateTo('yearSelect')} className="hover:text-physiology transition-colors">Portal</button>
            {selectedYear && (
              <>
                <ChevronRight size={12} className="text-gray-300 dark:text-gray-700" />
                <button onClick={() => navigateTo('semesterSelect')} className="hover:text-physiology transition-colors">Year {selectedYear}</button>
              </>
            )}
            {selectedSemester && (
              <>
                <ChevronRight size={12} className="text-gray-300 dark:text-gray-700" />
                <button onClick={() => navigateTo('moduleSelect')} className="hover:text-physiology transition-colors">Semester {selectedSemester}</button>
              </>
            )}
            {selectedModule && (
              <>
                <ChevronRight size={12} className="text-gray-300 dark:text-gray-700" />
                <span className="text-gray-900 dark:text-gray-300 truncate max-w-[150px]">{selectedModule.code}</span>
              </>
            )}
          </div>
        )}

        {/* SCREEN 1: YEAR SELECT */}
        {screen === 'yearSelect' && (
          <div className="space-y-10 py-6">
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-physiology/10 text-physiology-dark rounded-full text-xs font-semibold tracking-wide uppercase">
                Academic Portal <Sparkles size={12} className="text-physiology" />
              </div>
              <h2 className="font-archivo text-4xl lg:text-5xl font-black tracking-tight leading-none">
                Select Academic Year
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Choose your current year of study to access the tailored credit point syllabus, module questions, and hybrid exams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((year) => {
                const isClerkship = year >= 4;
                return (
                  <button
                    key={year}
                    onClick={() => handleSelectYear(year)}
                    className="portal-card text-left bg-white dark:bg-gray-900 rounded-[30px] p-6 border-2 border-gray-100 dark:border-gray-800/80 hover:border-physiology/40 shadow-sm flex flex-col justify-between h-44 animate-pop-up grid-delay relative overflow-hidden group"
                  >
                    <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-physiology/5 group-hover:bg-physiology/10 transition-colors duration-300" />
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-physiology/10 text-physiology-dark flex items-center justify-center font-archivo font-black text-lg">
                        {year}
                      </div>
                      <h3 className="font-archivo text-xl font-bold text-gray-900 dark:text-white mt-4 tracking-tight">
                        Year {year}
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mt-1">
                        {isClerkship ? 'Clinical Clerkship Phase' : 'Pre-Clerkship Phase'}
                      </p>
                    </div>
                    <div className="flex items-center justify-end w-full">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-physiology group-hover:translate-x-1.5 transition-transform duration-200">
                        Enter <ArrowRight size={14} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Show recent attempts from history if any */}
            {getQuizHistory().length > 0 && (
              <div className="max-w-4xl mx-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-1.5 h-5 rounded-full bg-physiology" />
                  <h3 className="font-archivo text-lg font-bold">Resume From History</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getQuizHistory().slice(0, 3).map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleSelectHistory(r)}
                      className="text-left bg-white dark:bg-gray-900 rounded-2xl px-5 py-4 border border-gray-100 dark:border-gray-800/80 flex items-center gap-4 hover:border-physiology/30 transition-all duration-200 hover:scale-[1.01] hover:shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-physiology/10 text-physiology-dark flex items-center justify-center font-archivo font-black text-sm">
                        {r.pct}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-archivo text-xs font-bold text-gray-900 dark:text-white truncate">
                          Ch.{r.chapterId} — {r.subjectName}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {r.correct}/{r.total} correct
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <PortalFooter />
          </div>
        )}

        {/* SCREEN 2: SEMESTER SELECT */}
        {screen === 'semesterSelect' && (
          <div className="space-y-10 py-6 max-w-3xl mx-auto">
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <h2 className="font-archivo text-4xl font-black tracking-tight leading-none">
                Select Semester
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Syllabus contents and examinations are split by semesters. Select the active semester for Year {selectedYear}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2].map((sem) => (
                <button
                  key={sem}
                  onClick={() => handleSelectSemester(sem)}
                  className="portal-card text-left bg-white dark:bg-gray-900 rounded-[30px] p-8 border-2 border-gray-100 dark:border-gray-800/80 hover:border-physiology/40 shadow-sm flex flex-col justify-between h-48 animate-pop-up group relative overflow-hidden"
                >
                  <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-physiology/5 group-hover:bg-physiology/10 transition-colors duration-300" />
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-physiology/10 text-physiology-dark flex items-center justify-center">
                      <Calendar size={20} />
                    </div>
                    <h3 className="font-archivo text-2xl font-bold text-gray-900 dark:text-white mt-5 tracking-tight">
                      Semester {sem}
                    </h3>
                  </div>
                  <div className="flex items-center justify-end w-full">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-physiology group-hover:translate-x-1.5 transition-transform duration-200">
                      Open Syllabus <ArrowRight size={14} />
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={() => navigateTo('yearSelect')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-800 text-sm font-semibold transition-colors duration-200"
              >
                <ArrowLeft size={16} />
                Back to Years
              </button>
            </div>

            <PortalFooter />
          </div>
        )}

        {/* SCREEN 3: MODULE SELECT */}
        {screen === 'moduleSelect' && (
          <div className="space-y-10 py-6">
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <h2 className="font-archivo text-4xl font-black tracking-tight leading-none">
                Syllabus Modules
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Year {selectedYear}, Semester {selectedSemester} credit system syllabus. Click a module card to begin studying.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {(selectedYear && selectedSemester && SYLLABUS_MODULES[selectedYear]?.[selectedSemester]) ? (
                SYLLABUS_MODULES[selectedYear][selectedSemester].map((mod) => {
                  const active = isModuleActive(mod.code);
                  const counts = getModuleQuestionCounts(mod.code);
                  return (
                    <button
                      key={mod.code}
                      onClick={() => handleSelectModule(mod)}
                      className={`portal-card text-left bg-white dark:bg-gray-900 rounded-[30px] p-6 border-2 shadow-sm flex flex-col justify-between h-52 animate-pop-up grid-delay relative overflow-hidden group ${
                        active
                          ? 'border-physiology/20 hover:border-physiology/60'
                          : 'border-gray-100 dark:border-gray-800/80 hover:border-gray-200'
                      }`}
                    >
                      {active && (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-physiology/10 to-transparent rounded-bl-[60px]" />
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 font-archivo tracking-wider">
                            {mod.code}
                          </span>
                          {active ? (
                            <span className="px-2.5 py-0.5 bg-physiology/10 text-physiology-dark rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-physiology" />
                              Live ({counts.totalCount} Qs)
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <Lock size={10} />
                              Locked
                            </span>
                          )}
                        </div>

                        <h3 className="font-archivo text-base font-bold text-gray-900 dark:text-white leading-snug tracking-tight group-hover:text-physiology transition-colors duration-200">
                          {mod.name}
                        </h3>
                      </div>

                      <div>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 dark:text-gray-500">
                          <div>CP: <span className="text-gray-700 dark:text-gray-300 font-archivo">{mod.cp}</span></div>
                          <div className="w-px h-3 bg-gray-200 dark:bg-gray-800" />
                          <div>Marks: <span className="text-gray-700 dark:text-gray-300 font-archivo">{mod.marks}</span></div>
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-gray-800/80 my-3" />

                        <div className="flex items-center justify-between text-xs">
                          {active ? (
                            <span className="font-bold text-physiology inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                              Start Study <ArrowRight size={14} />
                            </span>
                          ) : (
                            <span className="font-semibold text-gray-400 dark:text-gray-500 inline-flex items-center gap-1">
                              Database Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full py-12 text-center text-gray-400 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl">
                  <GraduationCap className="mx-auto text-gray-300 dark:text-gray-700 mb-3" size={32} />
                  <p className="font-bold">Modules database coming soon for Year {selectedYear}.</p>
                  <p className="text-xs text-gray-400 mt-1">Check Year 2, Semester 2 for the live Endocrine module.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={() => navigateTo('semesterSelect')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-800 text-sm font-semibold transition-colors duration-200"
              >
                <ArrowLeft size={16} />
                Back to Semesters
              </button>
            </div>

            <PortalFooter />
          </div>
        )}

        {/* SCREEN 4: STUDY MODE SELECT */}
        {screen === 'studyModeSelect' && selectedModule && (
          <div className="space-y-10 py-6">
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <span className="px-4 py-1.5 bg-physiology/10 text-physiology-dark rounded-full text-xs font-semibold uppercase tracking-wide">
                Module Loaded: {selectedModule.code}
              </span>
              <h2 className="font-archivo text-4xl font-black tracking-tight leading-none">
                Select Study Mode
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Choose the question formats you wish to practice. You can focus on MCQs, essays, or a mixed exam.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* MCQ Practice Mode */}
              <button
                onClick={() => handleSelectMode('mcq')}
                className="portal-card text-left bg-white dark:bg-gray-900 rounded-[30px] p-6 border-2 border-gray-100 dark:border-gray-800/80 hover:border-physiology/40 shadow-sm flex flex-col justify-between h-72 animate-pop-up group relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-physiology/5 group-hover:bg-physiology/10 transition-colors duration-300" />
                
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-physiology/10 text-physiology flex items-center justify-center">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="font-archivo text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                      MCQ Practice Mode
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1 leading-relaxed">
                      Loads only multiple-choice, true/false, and fill-in-the-blank questions for rapid recall.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-physiology px-3 py-1 bg-physiology/5 rounded-lg w-fit">
                    {getModuleQuestionCounts(selectedModule.code).mcqCount} Questions available
                  </div>
                  <div className="flex items-center justify-end w-full">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-physiology group-hover:translate-x-1.5 transition-transform duration-200">
                      Start Practice <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </button>

              {/* Essay Study Mode */}
              <button
                onClick={() => handleSelectMode('essay')}
                className="portal-card text-left bg-white dark:bg-gray-900 rounded-[30px] p-6 border-2 border-gray-100 dark:border-gray-800/80 hover:border-clinical/40 shadow-sm flex flex-col justify-between h-72 animate-pop-up group relative overflow-hidden"
                style={{ animationDelay: '60ms' }}
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-clinical/5 group-hover:bg-clinical/10 transition-colors duration-300" />
                
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-clinical/10 text-clinical flex items-center justify-center">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="font-archivo text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                      Essay Study Mode
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1 leading-relaxed">
                      Loads written/short answer and case-based essay questions with detailed model answers.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-clinical px-3 py-1 bg-clinical/5 rounded-lg w-fit">
                    {getModuleQuestionCounts(selectedModule.code).essayCount} Questions available
                  </div>
                  <div className="flex items-center justify-end w-full">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-clinical group-hover:translate-x-1.5 transition-transform duration-200">
                      Start Study <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </button>

              {/* Mixed Exam Mode */}
              <button
                onClick={() => handleSelectMode('mixed')}
                className="portal-card text-left bg-white dark:bg-gray-900 rounded-[30px] p-6 border-2 border-gray-100 dark:border-gray-800/80 hover:border-biochem/40 shadow-sm flex flex-col justify-between h-72 animate-pop-up group relative overflow-hidden"
                style={{ animationDelay: '120ms' }}
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-biochem/5 group-hover:bg-biochem/10 transition-colors duration-300" />
                
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-biochem/10 text-biochem flex items-center justify-center">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="font-archivo text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                      Mixed Exam Mode
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1 leading-relaxed">
                      Combines MCQ and Essay databases to generate a comprehensive, hybrid practice exam.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-biochem px-3 py-1 bg-biochem/5 rounded-lg w-fit">
                    {getModuleQuestionCounts(selectedModule.code).totalCount} Questions available
                  </div>
                  <div className="flex items-center justify-end w-full">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-biochem group-hover:translate-x-1.5 transition-transform duration-200">
                      Generate Exam <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={() => navigateTo('moduleSelect')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-800 text-sm font-semibold transition-colors duration-200"
              >
                <ArrowLeft size={16} />
                Back to Modules
              </button>
            </div>

            <PortalFooter />
          </div>
        )}

        {/* SCREEN 5: CHAPTER SELECT */}
        {screen === 'chapters' && selectedModule && studyMode && (
          <ChapterSelect
            chapters={activeChapters}
            studyModeName={studyModeNameMap[studyMode]}
            moduleName={selectedModule.name}
            onSelectChapter={handleSelectChapter}
            onSelectHistory={handleSelectHistory}
            onBackToModeSelect={() => navigateTo('studyModeSelect')}
          />
        )}

        {/* SCREEN 6: SUBJECT SELECT */}
        {screen === 'subjects' && selectedChapter && (
          <SubjectSelect
            chapter={selectedChapter}
            onBack={() => setScreen('chapters')}
            onSelectSubject={handleSelectSubject}
            onQuickStart={handleQuickStart}
          />
        )}

        {/* SCREEN 7: QUIZ INTERFACE */}
        {screen === 'quiz' && quizPayload && (
          <QuizInterface
            chapter={quizPayload.chapter}
            subject={quizPayload.subject}
            questions={quizPayload.questions}
            onBack={() => setScreen('subjects')}
            onFinish={handleFinishQuiz}
          />
        )}

        {/* SCREEN 8: RESULTS DASHBOARD */}
        {screen === 'results' && resultPayload && (
          <ResultsDashboard
            chapter={resultPayload.chapter}
            subject={resultPayload.subject}
            questions={resultPayload.questions}
            answers={resultPayload.answers}
            elapsedSeconds={resultPayload.elapsedSeconds}
            flaggedQuestions={resultPayload.flaggedQuestions}
            onRetake={handleRetake}
            onTryAnotherSubject={() => setScreen('subjects')}
            onBackToChapters={handleBackToChapters}
            onBackToSubjects={() => setScreen('subjects')}
          />
        )}
      </main>

      {/* PREMIUM COMING SOON ALERT DIALOG / MODAL */}
      {modalModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-950/40 backdrop-blur-md transition-all duration-300">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[30px] p-7 shadow-2xl animate-pop-up relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-physiology/5 to-transparent rounded-bl-[50px]" />
            
            <div className="flex items-center gap-3 mb-4 text-physiology">
              <div className="w-10 h-10 rounded-xl bg-physiology/10 flex items-center justify-center">
                <Info size={20} />
              </div>
              <h3 className="font-archivo text-xl font-bold tracking-tight">
                Integration in Progress
              </h3>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
              Our academic editors are currently formatting the question database for <span className="font-semibold text-gray-900 dark:text-white">{modalModule.name} ({modalModule.code})</span>. 
              <br className="mb-2" />
              In the meantime, you can try practicing with the fully live <span className="font-semibold text-physiology-dark">Endocrine System & Metabolism</span> module (Year 2, Semester 2).
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={redirectToEndocrine}
                className="flex-1 px-5 py-3 bg-physiology hover:bg-physiology-dark text-white rounded-full text-xs font-bold tracking-wide transition-all duration-300 hover:scale-[0.98] shadow-md shadow-physiology/20"
              >
                Try Endocrine Module
              </button>
              <button
                onClick={() => setModalModule(null)}
                className="px-5 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold tracking-wide transition-all duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
