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
import { SyllabusTracker } from './components/SyllabusTracker';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LanguageToggle } from './components/LanguageToggle';
import { StackedCarousel } from './components/ui/StackedCarousel';
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
          href="mailto:omarhmaged@gmail.com"
          className="hover:text-physiology dark:hover:text-white transition-colors underline font-semibold"
        >
          omarhmaged@gmail.com
        </a>
      </p>
    </footer>
  );
}

function MainApp() {
  const { t, language } = useLanguage();

  const hasActiveModulesForYear = (year: number): boolean => {
    const semesters = SYLLABUS_MODULES[year];
    if (!semesters) return false;
    return Object.values(semesters).some((modules) =>
      modules.some((mod) => isModuleActive(mod.code))
    );
  };

  const hasActiveModulesForSemester = (year: number, sem: number): boolean => {
    const modules = SYLLABUS_MODULES[year]?.[sem];
    if (!modules) return false;
    return modules.some((mod) => isModuleActive(mod.code));
  };
  
  // Navigation states
  const [screen, setScreen] = useState<Screen>('yearSelect');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleInfo | null>(null);
  const [studyMode, setStudyMode] = useState<'mcq' | 'essay' | 'mixed' | null>(null);
  const [showTracker, setShowTracker] = useState(false);
  
  // Quiz states
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(null);
  const [quizPayload, setQuizPayload] = useState<QuizPayload | null>(null);
  const [resultPayload, setResultPayload] = useState<ResultPayload | null>(null);
  
  // UI States
  const [modalModule, setModalModule] = useState<ModuleInfo | null>(null);

  // Carousel states
  const [activeYearCarouselIndex, setActiveYearCarouselIndex] = useState(1); // Default to Year 2
  const [activeSemesterCarouselIndex, setActiveSemesterCarouselIndex] = useState(0);

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
        <div className="absolute top-[10%] left-[5%] h-[35vw] w-[35vw] rounded-full bg-physiology/6 dark:bg-physiology/4 blur-[130px] blob-float-1" />
        <div className="absolute bottom-[10%] right-[5%] h-[40vw] w-[40vw] rounded-full bg-anatomy/6 dark:bg-anatomy/4 blur-[160px] blob-float-2" />
      </div>

      <style>{`
        @keyframes shrinkHeader {
          to {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            background: var(--color-glass-bg);
            backdrop-filter: blur(24px);
            border-bottom-color: var(--color-glass-border);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
          }
        }
        @keyframes shrinkHeaderDark {
          to {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            background: var(--color-glass-dark-bg);
            backdrop-filter: blur(24px);
            border-bottom-color: var(--color-glass-dark-border);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
          }
        }
        @supports (animation-timeline: scroll()) and (animation-range: 0% 100%) {
          .shrinking-header {
            animation: shrinkHeader auto linear both;
            animation-timeline: scroll(block root);
            animation-range: 0px 100px;
          }
          .dark .shrinking-header {
            animation: shrinkHeaderDark auto linear both;
            animation-timeline: scroll(block root);
            animation-range: 0px 100px;
          }
        }

        @keyframes popUp {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes floatBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(6%, 10%) scale(1.1) rotate(10deg); }
        }
        @keyframes floatBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(-8%, -6%) scale(0.85) rotate(-5deg); }
        }
        .blob-float-1 { animation: floatBlob1 25s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .blob-float-2 { animation: floatBlob2 30s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate; }

        .animate-pop-up { animation: popUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        .grid-delay:nth-child(1) { animation-delay: 40ms; }
        .grid-delay:nth-child(2) { animation-delay: 80ms; }
        .grid-delay:nth-child(3) { animation-delay: 120ms; }
        .grid-delay:nth-child(4) { animation-delay: 160ms; }
        .grid-delay:nth-child(5) { animation-delay: 200ms; }
        .grid-delay:nth-child(6) { animation-delay: 240ms; }
        
        .portal-card {
          transition: all 500ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .portal-card:hover {
          transform: translateY(-8px) scale(1.02);
          z-index: 10;
        }
        .animate-flip-rtl {
          transition: transform 300ms ease;
        }
        html[dir="rtl"] .animate-flip-rtl {
          transform: rotate(180deg);
        }
      `}</style>

      {/* TOP NAVIGATION HEADER WITH BREADCRUMBS */}
      {['yearSelect', 'semesterSelect', 'moduleSelect', 'studyModeSelect'].includes(screen) && (
        <header className="shrinking-header bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50 sticky top-0 z-40 transition-colors duration-300">
          <div className="max-w-[1600px] mx-auto px-6 py-5 transition-all duration-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-physiology/10 flex items-center justify-center text-physiology-dark dark:text-physiology drop-shadow-sm transition-transform hover:scale-105 will-change-transform transform-gpu">
                <Activity size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="font-archivo font-extrabold text-base tracking-tight leading-none">
                  {t('portalTitle')}
                </h1>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                  {t('asu')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-end">
              {screen === 'yearSelect' && (
                <div className="hidden md:flex items-center gap-2 mr-2">
                  <a
                    href="https://asu2learn.asu.edu.eg/medicine-emp/my/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-physiology/10 hover:bg-physiology/20 text-physiology-dark dark:text-physiology border border-physiology/20 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5"
                  >
                    <span>{t('empPortal')}</span>
                    <ExternalLink size={12} className="text-physiology" />
                  </a>
                  <a
                    href="https://asu2learn.asu.edu.eg/medicine/my/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5"
                  >
                    <span>{t('mainstreamPortal')}</span>
                    <ExternalLink size={12} className="text-gray-500" />
                  </a>
                  <a
                    href="https://ums.asu.edu.eg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-clinical/10 hover:bg-clinical/20 text-clinical-dark dark:text-clinical border border-clinical/20 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5"
                  >
                    <span>{t('umsPortal')}</span>
                    <ExternalLink size={12} className="text-clinical" />
                  </a>
                </div>
              )}
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}

      {/* PORTAL CONTAINER */}
      <main className="max-w-[1600px] mx-auto px-6 py-12 relative z-10">
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transform-gpu">
          <div className="absolute inset-0 dot-pattern"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-physiology/10 dark:bg-physiology/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse duration-10000 will-change-transform transform-gpu"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-clinical/10 dark:bg-clinical/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse duration-10000 will-change-transform transform-gpu" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Breadcrumbs for easy navigation jumpbacks */}
        {['semesterSelect', 'moduleSelect', 'studyModeSelect'].includes(screen) && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-8 glass-panel px-5 py-3 w-fit transition-all duration-300">
            <button onClick={() => navigateTo('yearSelect')} className="hover:text-physiology transition-colors">{t('portal')}</button>
            {selectedYear && (
              <>
                <ChevronRight size={12} className="text-gray-300 dark:text-gray-700 animate-flip-rtl" />
                <button onClick={() => navigateTo('semesterSelect')} className="hover:text-physiology transition-colors">{t('year' + selectedYear)}</button>
              </>
            )}
            {selectedSemester && (
              <>
                <ChevronRight size={12} className="text-gray-300 dark:text-gray-700 animate-flip-rtl" />
                <button onClick={() => navigateTo('moduleSelect')} className="hover:text-physiology transition-colors">{t('semester' + selectedSemester)}</button>
              </>
            )}
            {selectedModule && (
              <>
                <ChevronRight size={12} className="text-gray-300 dark:text-gray-700 animate-flip-rtl" />
                <span className="text-gray-900 dark:text-gray-300 truncate max-w-[150px]">{selectedModule.code}</span>
              </>
            )}
          </div>
        )}

        {/* SCREEN 1: YEAR SELECT */}
        {screen === 'yearSelect' && (
          <div className="w-full pb-10">
            {/* Clean Apple Music Style Header */}
            <div className="max-w-[1600px] mx-auto px-4 lg:px-12 mb-8 mt-4 text-center">
              <h1 className="font-archivo text-4xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-3">
                {t('selectYear')}
              </h1>
              <p dir="rtl" className="text-physiology dark:text-physiology-light font-medium text-xl lg:text-3xl max-w-2xl mx-auto" style={{ fontFamily: "'Amiri', serif", lineHeight: "1.8" }}>
                ﴿وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا﴾
              </p>
            </div>

            {/* Stacked 3D Carousel Layout for Year Select */}
            <div className="max-w-[1600px] mx-auto pb-4">
              <StackedCarousel 
                activeIndex={activeYearCarouselIndex}
                setActiveIndex={setActiveYearCarouselIndex}
                onSelect={(id) => handleSelectYear(id as number)}
                items={[1, 2, 3, 4, 5].map(year => {
                  const active = hasActiveModulesForYear(year);

                  let totalCp = 0;
                  let totalMarks = 0;
                  const sems = SYLLABUS_MODULES[year];
                  if (sems) {
                    Object.values(sems).forEach(modules => {
                      modules.forEach(mod => {
                        totalCp += mod.cp;
                        totalMarks += mod.marks;
                      });
                    });
                  }

                  const getPhaseTitle = (y: number) => {
                    if (y === 1 || y === 2) return 'Foundations';
                    if (y === 3) return 'Transitional Phase';
                    return 'Clinical Phase';
                  };

                  const getPhaseSubtitle = (y: number) => {
                    if (y === 1 || y === 2) return t('preClerkship');
                    if (y === 3) return 'Pre-clerkship / Clerkship';
                    return t('clerkship');
                  };

                  return {
                    id: year,
                    disabled: false, // Always allow clicking into the year
                    content: (
                      <div className="w-full h-full glass-panel flex flex-col justify-between relative overflow-hidden group bg-white/80 dark:bg-black/80 backdrop-blur-3xl p-8">
                        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-physiology/5 group-hover:bg-physiology/10 transition-colors duration-700 blur-2xl pointer-events-none" />

                        <div className="flex justify-between items-start w-full relative z-10 gap-2">
                          <div className={`w-fit px-5 h-12 rounded-2xl flex items-center justify-center shrink-0 font-archivo font-black text-2xl tracking-normal shadow-sm border ${
                            active 
                              ? 'bg-gradient-to-br from-physiology/10 to-physiology/5 text-physiology-dark border-physiology/20 dark:text-physiology-light' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-transparent'
                          }`}>
                            {t('year' + year)}
                          </div>
                          
                          {!active && (
                            <span className="px-3 py-1.5 mt-2 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 text-gray-600 dark:text-gray-300 rounded-xl text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-sm pointer-events-none whitespace-nowrap">
                              <Lock size={10} className="shrink-0" />
                              <span>{language === 'en' ? 'LOCKED' : 'مغلق'}</span>
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-auto w-full relative z-10">
                          <h3 className="font-archivo text-2xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                            {getPhaseTitle(year)}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                            {getPhaseSubtitle(year)}
                          </p>
                          
                          {totalCp > 0 && (
                            <div className="flex gap-4 mt-3">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Credit Points</span>
                                <span className="text-sm font-black text-gray-700 dark:text-gray-300">{totalCp} CP</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total Marks</span>
                                <span className="text-sm font-black text-gray-700 dark:text-gray-300">{totalMarks}</span>
                              </div>
                            </div>
                          )}

                          {active && (
                            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-physiology animate-pulse" />
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-physiology-dark dark:text-physiology">
                                  {t('activeModules')}
                                </span>
                              </div>
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-physiology group-hover:translate-x-1.5 transition-transform duration-300">
                                {t('enter')} <ArrowRight size={14} className="rtl:rotate-180" />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  };
                })}
              />
            </div>
            
            <div className="h-10"></div>
            
            {/* Show recent attempts from history if any */}
            {getQuizHistory().length > 0 && (
              <div className="max-w-[1400px] mx-auto pt-10 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 rounded-full bg-gradient-to-b from-physiology to-clinical" />
                    <h3 className="font-archivo text-2xl font-black tracking-tight">{t('resumeHistory')}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getQuizHistory().slice(0, 3).map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleSelectHistory(r)}
                      className="portal-card text-left glass-panel glow-border rounded-3xl p-6 flex flex-col justify-between h-40 animate-pop-up relative overflow-hidden group"
                    >
                      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-physiology/5 group-hover:bg-physiology/10 transition-colors duration-300" />
                      
                      <div className="flex justify-between items-start">
                        <div className="w-fit px-3 h-10 rounded-xl bg-gradient-to-br from-physiology/10 to-clinical/10 text-physiology-dark flex items-center justify-center font-archivo font-black text-lg shadow-sm border border-physiology/10">
                          {r.pct}%
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs font-bold border border-gray-100 dark:border-gray-700">
                          {r.correct}/{r.total} {t('correct')}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="font-archivo text-base font-bold text-gray-900 dark:text-white truncate tracking-tight">
                          {t('chapter')} {r.chapterId}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1 truncate">
                          {r.subjectName}
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
                {t('selectSemester')}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {language === 'en'
                  ? `Syllabus contents and examinations are split by semesters. Select the active semester for ${t('year' + selectedYear)}.`
                  : `يتم تقسيم محتويات المنهج والامتحانات حسب الفصول الدراسية. اختر الفصل الدراسي النشط لـ ${t('year' + selectedYear)}.`}
              </p>
            </div>

            <div className="max-w-2xl mx-auto pb-4">
              <StackedCarousel 
                activeIndex={activeSemesterCarouselIndex}
                setActiveIndex={setActiveSemesterCarouselIndex}
                onSelect={(id) => handleSelectSemester(id as number)}
                items={[1, 2].map(sem => {
                  const active = selectedYear ? hasActiveModulesForSemester(selectedYear, sem) : false;
                  
                  let totalCp = 0;
                  let totalMarks = 0;
                  if (selectedYear && SYLLABUS_MODULES[selectedYear]?.[sem]) {
                    SYLLABUS_MODULES[selectedYear][sem].forEach(mod => {
                      totalCp += mod.cp;
                      totalMarks += mod.marks;
                    });
                  }

                  return {
                    id: sem,
                    disabled: false, // Always allow clicking into the semester
                    content: (
                      <div className="w-full h-full glass-panel flex flex-col justify-between relative overflow-hidden group bg-white/80 dark:bg-black/80 backdrop-blur-3xl p-6 sm:p-8">
                        <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-physiology/5 group-hover:bg-physiology/10 transition-colors duration-300 blur-2xl pointer-events-none" />

                        <div className="relative z-10">
                          <div className="flex justify-between items-start w-full gap-1.5 sm:gap-2">
                            <div className={`w-fit px-3 sm:px-4 h-10 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 font-archivo font-black text-base sm:text-lg tracking-normal shadow-sm border gap-1.5 sm:gap-2 ${
                              active ? 'bg-gradient-to-br from-clinical/10 to-clinical/5 text-clinical-dark dark:text-clinical border-clinical/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-transparent'
                            }`}>
                              <Calendar size={16} className={active ? 'text-clinical' : ''} />
                              {t('semester' + sem)}
                            </div>
                            
                            {!active && (
                              <span className="px-2 sm:px-3 py-1 mt-1 sm:mt-1.5 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 text-gray-600 dark:text-gray-300 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-sm pointer-events-none whitespace-nowrap">
                                <Lock size={10} className="shrink-0" />
                                <span>{language === 'en' ? 'LOCKED' : 'مغلق'}</span>
                              </span>
                            )}
                          </div>
                          
                          {/* Phase logic for semester */}
                          {selectedYear && (
                            <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                              {selectedYear < 3 || (selectedYear === 3 && sem === 1) ? t('preClerkship') : t('clerkship')}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col w-full relative z-10 mt-auto space-y-4">
                          {totalCp > 0 && (
                            <div className="flex gap-4">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Credit Points</span>
                                <span className="text-sm font-black text-gray-700 dark:text-gray-300">{totalCp} CP</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total Marks</span>
                                <span className="text-sm font-black text-gray-700 dark:text-gray-300">{totalMarks}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-end w-full">
                            {active ? (
                              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-physiology group-hover:translate-x-1.5 transition-transform duration-200">
                                {t('enter')} <ArrowRight size={16} className="rtl:rotate-180" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 dark:text-gray-500">
                                {t('comingSoon')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  };
                })}
              />
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={() => navigateTo('yearSelect')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-sm font-semibold transition-colors duration-200"
              >
                <ArrowLeft size={16} className="rtl:rotate-180" />
                {t('back')}
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
                {t('selectModule')}
              </h2>
              <div className="flex flex-col items-center gap-3 mt-2">
                <span className="px-5 py-2 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md text-gray-700 dark:text-gray-300 text-sm font-black tracking-widest uppercase border border-gray-200/60 dark:border-gray-800 shadow-sm">
                  {language === 'en' ? `Year ${selectedYear} • Semester ${selectedSemester}` : `السنة ${selectedYear} • الفصل الدراسي ${selectedSemester}`}
                </span>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {language === 'en'
                    ? 'Click a module card to begin studying.'
                    : 'اضغط على بطاقة الوحدة لبدء المذاكرة.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1400px] mx-auto">
              {(selectedYear && selectedSemester && SYLLABUS_MODULES[selectedYear]?.[selectedSemester]) ? (
                SYLLABUS_MODULES[selectedYear][selectedSemester].map((mod) => {
                  const active = isModuleActive(mod.code);
                  const counts = getModuleQuestionCounts(mod.code);
                  return (
                    <button
                      key={mod.code}
                      onClick={() => active && handleSelectModule(mod)}
                      disabled={!active}
                      style={{ viewTransitionName: `module-${mod.code}` }}
                      className={`portal-card text-start glass-panel p-6 flex flex-col justify-between h-52 animate-pop-up grid-delay relative overflow-hidden group ${
                        active
                          ? 'hover:border-physiology/60 cursor-pointer glow-border'
                          : 'opacity-60 saturate-50 cursor-not-allowed pointer-events-none shadow-none'
                      }`}
                    >
                      {active ? (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-physiology/10 to-transparent rounded-bl-[60px]" />
                      ) : (
                        <span className="absolute top-4 right-4 px-3 py-1 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 text-gray-600 dark:text-gray-300 rounded-xl text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                          <Lock size={10} />
                          {t('comingSoon').replace('...', '')}
                        </span>
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 font-archivo tracking-wider">
                            {mod.code}
                          </span>
                          {active && (
                            <span className="px-2.5 py-0.5 bg-physiology/10 text-physiology-dark rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-physiology" />
                              {language === 'en' ? 'Live' : 'نشط'} ({counts.totalCount} {t('questions')})
                            </span>
                          )}
                        </div>

                        <h3 className="font-archivo text-base font-bold text-gray-900 dark:text-white leading-snug tracking-tight group-hover:text-physiology transition-colors duration-200">
                          {mod.name}
                        </h3>
                      </div>

                      <div>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 dark:text-gray-550">
                          <div>{t('cp')}: <span className="text-gray-700 dark:text-gray-300 font-archivo">{mod.cp}</span></div>
                          <div className="w-px h-3 bg-gray-200 dark:bg-gray-800" />
                          <div>{t('marks')}: <span className="text-gray-700 dark:text-gray-300 font-archivo">{mod.marks}</span></div>
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-gray-900 my-3" />

                        <div className="flex items-center justify-between text-xs">
                          {active ? (
                            <span className="font-bold text-physiology inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                              {t('start')} <ArrowRight size={14} className="rtl:rotate-180" />
                            </span>
                          ) : (
                            <span className="font-semibold text-gray-400 dark:text-gray-500 inline-flex items-center gap-1">
                              {t('comingSoon')}
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
                  <p className="font-bold">{t('comingSoon')}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={() => navigateTo('semesterSelect')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-sm font-semibold transition-colors duration-200"
              >
                <ArrowLeft size={16} className="rtl:rotate-180" />
                {t('back')}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1400px] mx-auto">
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

            <div className="max-w-[1400px] mx-auto">
              <button
                onClick={() => setShowTracker(true)}
                className="w-full glass-panel glow-border rounded-2xl p-5 flex items-center justify-between group hover:shadow-md transition-all animate-pop-up"
                style={{ animationDelay: '180ms' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                    <Calendar size={20} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-archivo font-bold text-lg text-gray-900 dark:text-white tracking-tight">Syllabus & Study Tracker</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Keep track of your chapter progress and personal notes</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors">
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white animate-flip-rtl" />
                </div>
              </button>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={() => navigateTo('moduleSelect')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-sm font-semibold transition-colors duration-200"
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
            breadcrumbPath={[
              t('portal') || 'Portal',
              t(`year${selectedYear}`) || `Year ${selectedYear}`,
              t(`semester${selectedSemester}`) || `Semester ${selectedSemester}`,
              selectedModule?.name || '',
              `${t('chapter')} ${selectedChapter.id}`
            ].filter(Boolean)}
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

      {showTracker && selectedModule && (
        <SyllabusTracker
          moduleCode={selectedModule.code}
          moduleName={selectedModule.name}
          chapters={getChaptersForModuleAndMode(selectedModule.code, 'mixed')}
          onClose={() => setShowTracker(false)}
        />
      )}

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
