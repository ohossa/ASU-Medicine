import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router';
import { ProgressProvider } from './store/progress';
import { LevelUpOverlay } from './components/LevelUpOverlay';
import Dashboard from '../pages/Dashboard';
import YearModules from '../pages/YearModules';
import StudyMode from '../pages/StudyMode';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
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
  ExternalLink,
  Flag,
  Globe,
  Check,
  Home,
  Heart,
  Search,
  Calculator
} from 'lucide-react';
import type { ChapterData, SubjectData, Question, Screen, SubjectColor } from './types';
const ChapterSelect = lazy(() => import('./components/ChapterSelect').then(m => ({ default: m.ChapterSelect })));
import { SubjectSelect } from './components/SubjectSelect';
const QuizInterface = lazy(() => import('./components/QuizInterface').then(m => ({ default: m.QuizInterface })));
const ResultsDashboard = lazy(() => import('./components/ResultsDashboard').then(m => ({ default: m.ResultsDashboard })));
const HistoryScreen = lazy(() => import('./components/HistoryScreen').then(m => ({ default: m.HistoryScreen })));
const FlaggedQuestionsScreen = lazy(() => import('./components/FlaggedQuestionsScreen').then(m => ({ default: m.FlaggedQuestionsScreen })));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));
const ClinicalCaseSolver = lazy(() => import('./components/ClinicalCaseSolver').then(m => ({ default: m.ClinicalCaseSolver })));
const QuestionSearch = lazy(() => import('./components/QuestionSearch').then(m => ({ default: m.QuestionSearch })));
const MarksCalculator = lazy(() => import('./components/MarksCalculator').then(m => ({ default: m.MarksCalculator })));
const SyllabusTrackerPage = lazy(() => import('../pages/SyllabusTrackerPage').then(m => ({ default: m.SyllabusTrackerPage })));
import { SyllabusTracker } from './components/SyllabusTracker';
import { StudyTrackerSelectorModal } from './components/StudyTrackerSelectorModal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LanguageToggle } from './components/LanguageToggle';
import { InteractiveBackground } from './components/ui/InteractiveBackground';
import { StackedCarousel } from './components/ui/StackedCarousel';
import { saveQuizResult, getQuizHistory } from './utils/storage';
import type { QuizResult } from './utils/storage';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
const LoginScreen = lazy(() => import('./components/LoginScreen').then(m => ({ default: m.LoginScreen })));
import LoadingScreen from './components/LoadingScreen';
import { useCloudSync } from './hooks/useCloudSync';
import { YearSelectionModal } from './components/YearSelectionModal';
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

function ClerkThemeTogglePortal() {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    const findContainer = () => {
      const previews = document.querySelectorAll('.cl-userPreview');
      let preview: Element | null = null;
      for (let i = 0; i < previews.length; i++) {
        const p = previews[i];
        if (p.closest('.cl-userProfile-root')) {
          continue;
        }
        preview = p;
        break;
      }

      if (preview) {
        let existing = preview.querySelector('#clerk-custom-toggle-container');
        if (!existing) {
          existing = document.createElement('div');
          existing.id = 'clerk-custom-toggle-container';
          existing.className = 'ms-auto flex items-center justify-end pl-2 shrink-0 scale-85 origin-right';
          preview.appendChild(existing);
        }
        setContainer(existing);
      } else {
        setContainer(null);
      }
    };

    findContainer();

    const observer = new MutationObserver(() => {
      findContainer();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (!container) return null;

  return createPortal(<ThemeToggle />, container);
}

function LanguageProfilePage() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="p-6 text-gray-900 font-manrope">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-physiology/10 flex items-center justify-center text-physiology shrink-0">
          <Globe size={22} />
        </div>
        <div className="text-left rtl:text-right">
          <h3 className="font-archivo text-lg font-bold tracking-tight text-gray-900">
            {language === 'en' ? "Language Settings" : "إعدادات اللغة"}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {language === 'en' ? "Select your preferred language for the layout and content." : "اختر لغتك المفضلة للواجهة والمحتوى."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-450">
            {language === 'en' ? "Language" : "اللغة"}
          </label>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => {
                if (e.target.value !== language) {
                  toggleLanguage();
                }
              }}
              className="w-full p-4 pr-10 rounded-xl bg-gray-50 border border-gray-100 hover:border-physiology/20 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-physiology/50 transition-all duration-200 cursor-pointer appearance-none text-left rtl:text-right"
            >
              <option value="en">English (US)</option>
              <option value="ar">العربية (Arabic)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-450">
              <Globe size={18} />
            </div>
          </div>
        </div>
        
        <p className="text-[11px] text-gray-400 font-medium mt-2 leading-relaxed">
          {language === 'en' 
            ? "Note: Changing language will translate the interface layout and module topic names."
            : "ملاحظة: تغيير اللغة سيقوم بترجمة واجهة المستخدم وأسماء مواضيع الموديلات الدراسي."}
        </p>
      </div>
    </div>
  );
}

function AcademicYearProfilePage({
  studentYear,
  setStudentYear,
  setScreen,
  setSelectedYear,
  setSelectedSemester,
  setSelectedModule,
  setStudyMode,
  setSelectedChapter
}: {
  studentYear: number | null;
  setStudentYear: (y: number | null) => void;
  setScreen: any;
  setSelectedYear: any;
  setSelectedSemester: any;
  setSelectedModule: any;
  setStudyMode: any;
  setSelectedChapter: any;
}) {
  const { language } = useLanguage();

  const handleSelectYear = (year: number) => {
    localStorage.setItem('asu_medical_student_year', year.toString());
    localStorage.removeItem('asu_portal_year');
    localStorage.removeItem('asu_portal_semester');
    localStorage.removeItem('asu_portal_module');
    localStorage.removeItem('asu_portal_studyMode');
    localStorage.removeItem('asu_portal_screen');
    
    // Update local state
    setStudentYear(year);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedModule(null);
    setStudyMode(null);
    setSelectedChapter(null);
    setScreen('yearSelect');
    
    // Trigger cloud sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('trigger-cloud-sync'));
    }
  };

  const getYearName = (yr: number) => {
    if (language === 'en') {
      if (yr === 1) return "First Year";
      if (yr === 2) return "Second Year";
      if (yr === 3) return "Third Year";
      if (yr === 4) return "Fourth Year";
      if (yr === 5) return "Fifth Year";
    } else {
      if (yr === 1) return "السنة الأولى";
      if (yr === 2) return "السنة الثانية";
      if (yr === 3) return "السنة الثالثة";
      if (yr === 4) return "السنة الرابعة";
      if (yr === 5) return "السنة الخامسة";
    }
    return `Year ${yr}`;
  };

  return (
    <div className="p-6 text-gray-900 font-manrope">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-physiology/10 flex items-center justify-center text-physiology shrink-0">
          <GraduationCap size={22} />
        </div>
        <div className="text-left rtl:text-right">
          <h3 className="font-archivo text-lg font-bold tracking-tight text-gray-900">
            {language === 'en' ? "Change Academic Year" : "تغيير السنة الدراسية"}
          </h3>
          <p className="text-xs text-gray-505 font-medium mt-0.5">
            {language === 'en' ? `Current: ${getYearName(studentYear || 1)}` : `الحالي: ${getYearName(studentYear || 1)}`}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {([1, 2, 3, 4, 5] as const).map((yr) => {
          const isCurrent = studentYear === yr;
          return (
            <button
              key={yr}
              onClick={() => handleSelectYear(yr)}
              className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all duration-200 text-left rtl:text-right ${
                isCurrent 
                  ? "bg-physiology/10 border-physiology/30 text-physiology-dark"
                  : "bg-gray-50 border-gray-100 hover:bg-physiology/5 text-gray-700"
              }`}
            >
              <div className="text-left rtl:text-right">
                <span className="block text-sm font-bold">
                  {language === 'en' ? `Year ${yr}` : `السنة ${yr}`}
                </span>
                <span className="block text-[11px] text-gray-400 mt-0.5">
                  {language === 'en' 
                    ? `Switch to Year ${yr} syllabus and courses`
                    : `الانتقال إلى منهج ومقررات السنة ${yr}`}
                </span>
              </div>
              {isCurrent && (
                <div className="w-5.5 h-5.5 rounded-full bg-physiology flex items-center justify-center text-white shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const lookupModule = (mCode: string): ModuleInfo | null => {
  for (const year of Object.values(SYLLABUS_MODULES)) {
    for (const sem of Object.values(year)) {
      const found = sem.find(m => m.code.toLowerCase() === mCode.toLowerCase());
      if (found) return found;
    }
  }
  return null;
};

function QuizFlowWrapper({
  code,
  mode,
  selectedModule,
  setSelectedModule,
  studyMode,
  setStudyMode,
  screen,
  setScreen,
  activeChapters,
  studyModeNameMap,
  selectedChapter,
  setSelectedChapter,
  handleSelectChapter,
  handleSelectHistory,
  customUserButton,
  selectedYear,
  selectedSemester,
  handleSelectSubject,
  handleQuickStart,
  quizPayload,
  handleFinishQuiz,
  resultPayload,
  handleRetake,
  handleBackToChapters,
  isFromHistory,
  setIsFromHistory,
  historySource,
  t
}: {
  code?: string;
  mode?: string;
  selectedModule: ModuleInfo | null;
  setSelectedModule: (m: ModuleInfo | null) => void;
  studyMode: 'mcq' | 'essay' | 'mixed' | null;
  setStudyMode: (m: 'mcq' | 'essay' | 'mixed' | null) => void;
  screen: Screen;
  setScreen: (s: Screen) => void;
  activeChapters: any[];
  studyModeNameMap: Record<string, string>;
  selectedChapter: ChapterData | null;
  setSelectedChapter: (c: ChapterData | null) => void;
  handleSelectChapter: (c: ChapterData) => void;
  handleSelectHistory: (res: any, source: any) => void;
  customUserButton: React.ReactNode;
  selectedYear: number | null;
  selectedSemester: number | null;
  handleSelectSubject: (s: SubjectData, q: Question[]) => void;
  handleQuickStart: (q: Question[]) => void;
  quizPayload: QuizPayload | null;
  handleFinishQuiz: (answers: Record<number, any>, elapsedSeconds: number, flaggedQuestions: Set<number>) => void;
  resultPayload: ResultPayload | null;
  handleRetake: () => void;
  handleBackToChapters: () => void;
  isFromHistory: boolean;
  setIsFromHistory: (b: boolean) => void;
  historySource: 'chapters' | 'history' | null;
  t: (key: string) => string;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      const targetModule = lookupModule(code);
      if (targetModule) {
        setSelectedModule(targetModule);
      }
    }
    if (mode) {
      setStudyMode(mode as any);
    }
    if (screen !== 'chapters' && screen !== 'subjects' && screen !== 'quiz' && screen !== 'results') {
      setScreen('chapters');
    }
  }, [code, mode, setSelectedModule, setStudyMode, setScreen, screen]);

  if (!selectedModule || !studyMode) {
    return <div>Loading module...</div>;
  }

  return (
    <>
      {screen === 'chapters' && (
        <Suspense fallback={<div>Loading...</div>}>
          <ChapterSelect
            chapters={activeChapters}
            studyModeName={studyModeNameMap[studyMode]}
            moduleName={selectedModule.name}
            moduleCode={selectedModule.code}
            onSelectChapter={handleSelectChapter}
            onSelectHistory={(res) => handleSelectHistory(res, 'chapters')}
            onBackToModeSelect={() => navigate(`/year-2/${selectedModule.code.toLowerCase()}`)}
            userButton={customUserButton}
            breadcrumbPath={[
              { label: t('portal') || 'Portal', onClick: () => navigate('/') },
              { label: t(`year${selectedYear || 2}`) || `Year ${selectedYear || 2}`, onClick: () => navigate('/year-2') },
              { label: selectedModule?.name || '' }
            ]}
          />
        </Suspense>
      )}

      {screen === 'subjects' && selectedChapter && (
        <SubjectSelect
          chapter={selectedChapter}
          breadcrumbPath={[
            { label: t('portal') || 'Portal', onClick: () => navigate('/') },
            { label: t(`year${selectedYear || 2}`) || `Year ${selectedYear || 2}`, onClick: () => navigate('/year-2') },
            { label: selectedModule?.name || '', onClick: () => navigate(`/year-2/${selectedModule.code.toLowerCase()}`) },
            { label: selectedChapter.title }
          ]}
          onBack={() => setScreen('chapters')}
          onSelectSubject={handleSelectSubject}
          onQuickStart={handleQuickStart}
          userButton={customUserButton}
        />
      )}

      {screen === 'quiz' && quizPayload && (
        <Suspense fallback={<div>Loading...</div>}>
          <QuizInterface
            chapter={quizPayload.chapter}
            subject={quizPayload.subject}
            questions={quizPayload.questions}
            onBack={() => setScreen('subjects')}
            onFinish={handleFinishQuiz}
            userButton={customUserButton}
          />
        </Suspense>
      )}

      {screen === 'results' && resultPayload && (
        <Suspense fallback={<div>Loading...</div>}>
          <ResultsDashboard
            chapter={resultPayload.chapter}
            subject={resultPayload.subject}
            questions={resultPayload.questions}
            answers={resultPayload.answers}
            elapsedSeconds={resultPayload.elapsedSeconds}
            flaggedQuestions={resultPayload.flaggedQuestions}
            onRetake={handleRetake}
            onTryAnotherSubject={() => {
              if (isFromHistory) {
                setIsFromHistory(false);
                setScreen(historySource === 'chapters' ? 'chapters' : 'history');
              } else {
                setScreen('subjects');
              }
            }}
            onBackToChapters={handleBackToChapters}
            onBackToSubjects={() => {
              if (isFromHistory) {
                setIsFromHistory(false);
                setScreen(historySource === 'chapters' ? 'chapters' : 'history');
              } else {
                setScreen('subjects');
              }
            }}
            userButton={customUserButton}
          />
        </Suspense>
      )}
    </>
  );
}

function MainApp() {
  const { t, language, toggleLanguage } = useLanguage();
  const { user } = useUser();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  
  // Initialize automatic cloud synchronization
  useCloudSync();

  // ── 1. State Initializations ──────────────────────────────────────────────────

  // Student Year tracking
  const [studentYear, setStudentYear] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('asu_medical_student_year');
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });

  // Navigation states
  const [screen, setScreen] = useState<Screen>(() => {
    try {
      const saved = localStorage.getItem('asu_portal_screen');
      if (saved) {
        if (saved === 'quiz' || saved === 'results') return 'chapters';
        return saved as Screen;
      }
      return 'yearSelect';
    } catch { return 'yearSelect'; }
  });
  const [isFromHistory, setIsFromHistory] = useState(false);
  const [historySource, setHistorySource] = useState<'chapters' | 'history' | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(() => {
    try { const saved = localStorage.getItem('asu_portal_year'); return saved ? Number(saved) : null; } catch { return null; }
  });
  const [selectedSemester, setSelectedSemester] = useState<number | null>(() => {
    try { const saved = localStorage.getItem('asu_portal_semester'); return saved ? Number(saved) : null; } catch { return null; }
  });
  const [selectedModule, setSelectedModule] = useState<ModuleInfo | null>(() => {
    try { const saved = localStorage.getItem('asu_portal_module'); return saved ? JSON.parse(saved) : null; } catch { return null; }
  });
  const [studyMode, setStudyMode] = useState<'mcq' | 'essay' | 'mixed' | null>(() => {
    try { const saved = localStorage.getItem('asu_portal_studyMode'); return saved as any || null; } catch { return null; }
  });

  const [showTracker, setShowTracker] = useState(false);
  const [showTrackerSelector, setShowTrackerSelector] = useState(false);
  const [trackerModule, setTrackerModule] = useState<ModuleInfo | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPortalsModal, setShowPortalsModal] = useState(false);
  
  // Quiz states
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(null);
  const [quizPayload, setQuizPayload] = useState<QuizPayload | null>(null);
  const [resultPayload, setResultPayload] = useState<ResultPayload | null>(null);
  
  // UI States
  const [modalModule, setModalModule] = useState<ModuleInfo | null>(null);

  // Carousel states
  const [activeYearCarouselIndex, setActiveYearCarouselIndex] = useState(1); // Default to Year 2
  const [activeSemesterCarouselIndex, setActiveSemesterCarouselIndex] = useState(0);

  // Navigation history tracker
  const isRestoringHistoryRef = useRef(false);

  // ── 2. Helpers and Data Functions ─────────────────────────────────────────────

  const getYearProgress = () => {
    try {
      if (!studentYear) return { completed: 0, total: 0, pct: 0 };
      
      const historyList = getQuizHistory().filter(r => r && typeof r === 'object');
      let totalSubjects = 0;
      let completedSubjects = 0;
      
      const semesters = SYLLABUS_MODULES[studentYear];
      if (semesters) {
        Object.values(semesters).forEach((modules) => {
          modules.forEach((mod) => {
            if (isModuleActive(mod.code)) {
              const chapters = getChaptersForModuleAndMode(mod.code, 'mixed');
              chapters.forEach((chapter) => {
                chapter.subjects.forEach((subject) => {
                  totalSubjects++;
                  const isSolved = historyList.some(
                    (r) => r.moduleCode === mod.code && 
                           String(r.chapterId) === String(chapter.id) && 
                           r.subjectName === subject.name
                  );
                  if (isSolved) {
                    completedSubjects++;
                  }
                });
              });
            }
          });
        });
      }
      
      const pct = totalSubjects > 0 ? Math.round((completedSubjects / totalSubjects) * 100) : 0;
      return { completed: completedSubjects, total: totalSubjects, pct };
    } catch (e) {
      console.error(e);
      return { completed: 0, total: 0, pct: 0 };
    }
  };

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

  // ── 3. Life-Cycle Effects ─────────────────────────────────────────────────────

  // Listen for storage changes from cloud sync
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('asu_medical_student_year');
        if (saved) {
          setStudentYear(parseInt(saved, 10));
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Listen for history popstate events (back/forward browser buttons)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state && state.asuPortal) {
        isRestoringHistoryRef.current = true;
        transitionTo(() => {
          setScreen(state.screen);
          setSelectedYear(state.selectedYear);
          setSelectedSemester(state.selectedSemester);
          setSelectedModule(state.selectedModule);
          setStudyMode(state.studyMode);
          setSelectedChapter(state.selectedChapter);
          setQuizPayload(state.quizPayload);
          setResultPayload(state.resultPayload ? {
            ...state.resultPayload,
            flaggedQuestions: new Set(state.resultPayload.flaggedQuestions)
          } : null);
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('asu_portal_screen', screen);
    if (selectedYear) localStorage.setItem('asu_portal_year', selectedYear.toString());
    else localStorage.removeItem('asu_portal_year');
    if (selectedSemester) localStorage.setItem('asu_portal_semester', selectedSemester.toString());
    else localStorage.removeItem('asu_portal_semester');
    if (selectedModule) localStorage.setItem('asu_portal_module', JSON.stringify(selectedModule));
    else localStorage.removeItem('asu_portal_module');
    if (studyMode) localStorage.setItem('asu_portal_studyMode', studyMode);
    else localStorage.removeItem('asu_portal_studyMode');
    
    // Trigger cloud sync to push these states
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('trigger-cloud-sync'));
    }
  }, [screen, selectedYear, selectedSemester, selectedModule, studyMode]);

  // Synchronize history state with React state
  useEffect(() => {
    const stateRepresentation = {
      screen,
      selectedYear,
      selectedSemester,
      selectedModule,
      studyMode,
      selectedChapter,
      quizPayload,
      resultPayload: resultPayload ? {
        ...resultPayload,
        flaggedQuestions: Array.from(resultPayload.flaggedQuestions || [])
      } : null
    };

    if (isRestoringHistoryRef.current) {
      isRestoringHistoryRef.current = false;
      return;
    }

    const currentHistoryState = window.history.state;
    if (!currentHistoryState || !currentHistoryState.asuPortal) {
      window.history.replaceState({ asuPortal: true, ...stateRepresentation }, '');
    } else {
      const keys = [
        'screen', 'selectedYear', 'selectedSemester', 'selectedModule', 'studyMode', 'selectedChapter', 'quizPayload', 'resultPayload'
      ];
      const isChanged = keys.some(k => {
        if (k === 'resultPayload' || k === 'quizPayload' || k === 'selectedModule' || k === 'selectedChapter') {
          return JSON.stringify(currentHistoryState[k]) !== JSON.stringify((stateRepresentation as any)[k]);
        }
        return currentHistoryState[k] !== (stateRepresentation as any)[k];
      });

      if (isChanged) {
        window.history.pushState({ asuPortal: true, ...stateRepresentation }, '');
      }
    }
  }, [screen, selectedYear, selectedSemester, selectedModule, studyMode, selectedChapter, quizPayload, resultPayload]);

  // Auto-routing safety net to prevent black screen (empty layouts) due to inconsistent/missing states on refresh
  useEffect(() => {
    if (screen === 'chapters' && (!selectedModule || !studyMode)) {
      setScreen('yearSelect');
    } else if (screen === 'subjects' && !selectedChapter) {
      setScreen('chapters');
    } else if (screen === 'quiz' && !quizPayload) {
      setScreen('chapters');
    } else if (screen === 'results' && !resultPayload) {
      setScreen('chapters');
    } else if (screen === 'semesterSelect' && !selectedYear) {
      setScreen('yearSelect');
    } else if (screen === 'moduleSelect' && (!selectedYear || !selectedSemester)) {
      setScreen('yearSelect');
    } else if (screen === 'studyModeSelect' && !selectedModule) {
      setScreen('yearSelect');
    }
  }, [screen, selectedYear, selectedSemester, selectedModule, studyMode, selectedChapter, quizPayload, resultPayload]);

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

    setIsFromHistory(false);
    saveQuizResult({
      moduleCode: selectedModule?.code,
      year: selectedYear,
      semester: selectedSemester,
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

  const handleSelectHistory = (result: QuizResult, source: 'chapters' | 'history' = 'history') => {
    const modCode = result.moduleCode || 'MEM-2';
    const yr = result.year || 2;
    const sem = result.semester || 2;

    const moduleChapters = getChaptersForModuleAndMode(modCode, 'mixed');
    const chapter = moduleChapters.find((c) => String(c.id) === String(result.chapterId));
    if (!chapter) return;

    const subject = chapter.subjects.find((s) => s.name === result.subjectName) || null;

    let questionsList: Question[] = [];
    if (result.questionIds && Array.isArray(result.questionIds)) {
      const allChapterQuestions = chapter.subjects.flatMap((s) => s.questions);
      result.questionIds.forEach((id: string | number) => {
        const found = allChapterQuestions.find((q) => String(q.id) === String(id));
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

    // Try to locate the module definition
    let targetModule = SYLLABUS_MODULES[yr]?.[sem]?.find((m: any) => m.code === modCode) || null;
    if (!targetModule && modCode === 'MEM-2') {
      targetModule = {
        code: 'MEM-2',
        name: 'Endocrine System & Metabolism Module',
        cp: 5.5,
        marks: 110,
        keywords: ['endocrine', 'metabolism', 'mem']
      };
    }

    transitionTo(() => {
      setSelectedYear(yr);
      setSelectedSemester(sem);
      if (targetModule) {
        setSelectedModule(targetModule);
      }
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
      setIsFromHistory(true);
      setHistorySource(source);
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
      if (isFromHistory) {
        setIsFromHistory(false);
        setQuizPayload(null);
        setResultPayload(null);
        if (historySource === 'chapters') {
          setScreen('chapters');
        } else {
          setScreen('history');
        }
      } else {
        setSelectedChapter(null);
        setQuizPayload(null);
        setResultPayload(null);
        setScreen('chapters');
      }
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

  const customUserButton = (
    <UserButton 
      appearance={{
        baseTheme: undefined,
        elements: {
          userButtonBox: "w-11 h-11 md:w-12 md:h-12",
          userButtonTrigger: "w-11 h-11 md:w-12 md:h-12",
          userButtonAvatarBox: "w-11 h-11 md:w-12 md:h-12 border border-physiology shadow-md",
          userButtonAvatarImage: "w-full h-full object-cover",
        }
      }}
    >
      <UserButton.UserProfilePage
        label={language === 'en' ? "Change Academic Year" : "تغيير السنة الدراسية"}
        labelIcon={<GraduationCap size={16} />}
        url="academic-year"
      >
        <AcademicYearProfilePage
          studentYear={studentYear}
          setStudentYear={setStudentYear}
          setScreen={setScreen}
          setSelectedYear={setSelectedYear}
          setSelectedSemester={setSelectedSemester}
          setSelectedModule={setSelectedModule}
          setStudyMode={setStudyMode}
          setSelectedChapter={setSelectedChapter}
        />
      </UserButton.UserProfilePage>

      <UserButton.UserProfilePage
        label={language === 'en' ? "Language" : "اللغة"}
        labelIcon={<Globe size={16} />}
        url="language"
      >
        <LanguageProfilePage />
      </UserButton.UserProfilePage>

      <UserButton.MenuItems>
        <UserButton.Action
          label={language === 'en' ? "Dashboard" : "اللوحة الرئيسية"}
          labelIcon={<Home size={16} className="text-physiology" />}
          onClick={() => {
            transitionTo(() => {
              setQuizPayload(null);
              setResultPayload(null);
              navigate('/');
            });
          }}
        />

        <UserButton.Action
          label={language === 'en' ? "Performance Dashboard" : "لوحة تحليلات الأداء"}
          labelIcon={<Activity size={16} className="text-[#2dd4bf]" />}
          onClick={() => {
            transitionTo(() => navigate('/analytics'));
          }}
        />

        <UserButton.Action
          label="Flagged Questions"
          labelIcon={<Flag size={16} className="text-clinical" />}
          onClick={() => {
            transitionTo(() => navigate('/flagged-questions'));
          }}
        />

        <UserButton.Action
          label={language === 'en' ? "ASU Portals" : "بوابات عين شمس"}
          labelIcon={<ExternalLink size={16} className="text-physiology" />}
          onClick={() => {
            setShowPortalsModal(true);
          }}
        />

        <UserButton.Action
          label="Report Bug / Support"
          labelIcon={<Mail size={16} className="text-gray-500" />}
          onClick={() => {
            setShowSupportModal(true);
          }}
        />
      </UserButton.MenuItems>
    </UserButton>
  );

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 font-manrope selection:bg-physiology/20 selection:text-physiology-dark overflow-x-hidden">

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
      `}</style>

      <main className="w-full relative z-10">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-physiology/10 to-transparent dark:from-physiology/5 rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse duration-10000 will-change-transform transform-gpu"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-clinical/10 to-transparent dark:from-clinical/5 rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse duration-10000 will-change-transform transform-gpu" style={{ animationDelay: '2s' }}></div>
        </div>

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Main Dashboard page */}
          <Route path="/" element={
            <Dashboard 
              userButton={customUserButton} 
              onOpenTrackerSelector={() => setShowTrackerSelector(true)} 
            />
          } />

          {/* Year Modules page */}
          <Route path="/year-2" element={
            <YearModules 
              userButton={customUserButton} 
            />
          } />

          {/* Study Mode Selector page */}
          <Route path="/year-2/:code" element={
            <StudyMode 
              userButton={customUserButton} 
              onStartStudyMode={(mode, mCode) => {
                const targetModule = lookupModule(mCode);
                if (targetModule) {
                  setSelectedModule(targetModule);
                  setStudyMode(mode);
                  setScreen('chapters');
                  navigate(`/year-2/${mCode.toLowerCase()}/${mode}`);
                }
              }}
              onOpenSyllabus={(mCode) => {
                navigate(`/year-2/${mCode.toLowerCase()}/tracker`);
              }}
            />
          } />

          {/* Chapters / Quiz sub-flow wrapper */}
          <Route path="/year-2/:code/:mode" element={
            <QuizFlowWrapper 
              code={params.code} 
              mode={params.mode}
              selectedModule={selectedModule}
              setSelectedModule={setSelectedModule}
              studyMode={studyMode}
              setStudyMode={setStudyMode}
              screen={screen}
              setScreen={setScreen}
              activeChapters={activeChapters}
              studyModeNameMap={studyModeNameMap}
              selectedChapter={selectedChapter}
              setSelectedChapter={setSelectedChapter}
              handleSelectChapter={handleSelectChapter}
              handleSelectHistory={handleSelectHistory}
              customUserButton={customUserButton}
              selectedYear={selectedYear}
              selectedSemester={selectedSemester}
              handleSelectSubject={handleSelectSubject}
              handleQuickStart={handleQuickStart}
              quizPayload={quizPayload}
              handleFinishQuiz={handleFinishQuiz}
              resultPayload={resultPayload}
              handleRetake={handleRetake}
              handleBackToChapters={handleBackToChapters}
              isFromHistory={isFromHistory}
              setIsFromHistory={setIsFromHistory}
              historySource={historySource}
              t={t}
            />
          } />

          {/* Tools pages */}
          <Route path="/history" element={
            <Suspense fallback={<div>Loading...</div>}>
              <HistoryScreen
                onBack={() => navigate('/')}
                onSelectHistory={(res) => handleSelectHistory(res, 'history')}
                userButton={customUserButton}
              />
            </Suspense>
          } />

          <Route path="/case-solver" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ClinicalCaseSolver
                onBack={() => navigate('/')}
                userButton={customUserButton}
              />
            </Suspense>
          } />

          <Route path="/marks-calculator" element={
            <Suspense fallback={<div>Loading...</div>}>
              <MarksCalculator
                onBack={() => navigate('/')}
                userButton={customUserButton}
              />
            </Suspense>
          } />

          <Route path="/question-search" element={
            <Suspense fallback={<div>Loading...</div>}>
              <QuestionSearch
                onBack={() => navigate('/')}
                userButton={customUserButton}
              />
            </Suspense>
          } />

          <Route path="/analytics" element={
            <Suspense fallback={<div>Loading...</div>}>
              <AnalyticsDashboard
                onBack={() => navigate('/')}
                userButton={customUserButton}
                history={getQuizHistory()}
                studentName={user ? (user.fullName || `${user.firstName} ${user.lastName}`.trim() || 'Student') : 'Student'}
                studentYear={studentYear}
                progress={getYearProgress()}
              />
            </Suspense>
          } />

          <Route path="/flagged-questions" element={
            <Suspense fallback={<div>Loading...</div>}>
              <FlaggedQuestionsScreen
                onBack={() => navigate('/')}
                onPracticeQuiz={(ch, subName, qs) => {
                  setSelectedChapter(ch);
                  setQuizPayload({
                    chapter: ch,
                    subject: ch.subjects.find(s => s.name === subName) || null,
                    questions: qs
                  });
                  setScreen('quiz');
                  navigate(`/year-2/${(code || 'mem-2').toLowerCase()}/mixed`);
                }}
                userButton={customUserButton}
              />
            </Suspense>
          } />
          
          <Route path="/year-2/:code/tracker" element={
            <Suspense fallback={<div>Loading...</div>}>
              <SyllabusTrackerPage userButton={customUserButton} />
            </Suspense>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </main>

      <AnimatePresence>
        {showTrackerSelector && (
          <StudyTrackerSelectorModal
            onClose={() => setShowTrackerSelector(false)}
            onSelectModule={(mod) => {
              setShowTrackerSelector(false);
              navigate(`/year-2/${mod.code.toLowerCase()}/tracker`);
            }}
          />
        )}
      </AnimatePresence>

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

      {/* YEAR SELECTION ONBOARDING MODAL */}
      {!studentYear && (
        <YearSelectionModal onSelect={setStudentYear} />
      )}

      {/* SUPPORT & BUG REPORT MODAL */}
      {showSupportModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-950/40 backdrop-blur-md transition-all duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSupportModal(false);
            }
          }}
        >
          <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100/80 dark:border-gray-800/80 rounded-[30px] p-8 shadow-2xl animate-pop-up relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-clinical/10 to-transparent rounded-bl-[60px]" />
            
            <div className="flex items-center gap-3 mb-4 text-clinical">
              <div className="w-10 h-10 rounded-xl bg-clinical/10 flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <h3 className="font-archivo text-xl font-bold tracking-tight">
                Report Bug / Support
              </h3>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
              Have a question, feedback, or found a bug? Reach out to the developer directly via email or WhatsApp:
            </p>

            <div className="space-y-3">
              {/* Email Button */}
              <a
                href="mailto:omarhmaged@gmail.com?subject=ASU%20Medical%20Portal%20Feedback%20%26%20Bug%20Report"
                className="w-full px-5 py-4 rounded-2xl bg-gray-50/60 dark:bg-gray-800/30 hover:bg-clinical/10 dark:hover:bg-clinical/15 border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-all group duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-clinical/10 dark:bg-clinical/20 flex items-center justify-center text-clinical group-hover:scale-105 transition-transform duration-200 shrink-0">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-clinical transition-colors duration-200 tracking-wide font-manrope">
                  omarhmaged@gmail.com
                </span>
              </a>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/201040479155"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-4 rounded-2xl bg-gray-50/60 dark:bg-gray-800/30 hover:bg-physiology/10 dark:hover:bg-physiology/15 border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-all group duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-physiology/10 dark:bg-physiology/20 flex items-center justify-center text-physiology group-hover:scale-105 transition-transform duration-200 shrink-0">
                  <svg className="w-5.5 h-5.5 text-physiology fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-physiology transition-colors duration-200 tracking-wide font-manrope">
                  (+20) 1040479155
                </span>
              </a>
            </div>

            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full py-3.5 mt-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-250 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold tracking-wide transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* LANGUAGE SELECTION MODAL */}
      {showLanguageModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-950/40 backdrop-blur-md transition-all duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowLanguageModal(false);
            }
          }}
        >
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-100/80 dark:border-gray-800/80 rounded-[30px] p-7 shadow-2xl animate-pop-up relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-physiology/10 to-transparent rounded-bl-[60px]" />
            
            <div className="flex items-center gap-3 mb-5 text-physiology">
              <div className="w-10 h-10 rounded-xl bg-physiology/10 flex items-center justify-center shrink-0">
                <Globe size={20} className="text-physiology" />
              </div>
              <h3 className="font-archivo text-xl font-bold tracking-tight">
                {language === 'en' ? 'Select Language' : 'اختر اللغة'}
              </h3>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
              {language === 'en' 
                ? 'Choose your preferred language for the portal layout and syllabus topics:' 
                : 'اختر لغتك المفضلة لواجهة البوابة ومواضيع المنهج الدراسي:'}
            </p>

            <div className="space-y-3">
              {/* English Option */}
              <button
                onClick={() => {
                  if (language !== 'en') toggleLanguage();
                  setShowLanguageModal(false);
                }}
                className={`w-full px-5 py-4 rounded-2xl flex items-center justify-between border transition-all duration-200 group ${
                  language === 'en'
                    ? 'bg-physiology/10 border-physiology/30 text-physiology-dark dark:text-physiology'
                    : 'bg-gray-50/60 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                    🇺🇸
                  </div>
                  <span className="text-sm font-bold font-manrope tracking-wide">
                    English (US)
                  </span>
                </div>
                {language === 'en' && (
                  <div className="w-5.5 h-5.5 rounded-full bg-physiology flex items-center justify-center text-white shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </button>

              {/* Arabic Option */}
              <button
                onClick={() => {
                  if (language !== 'ar') toggleLanguage();
                  setShowLanguageModal(false);
                }}
                className={`w-full px-5 py-4 rounded-2xl flex items-center justify-between border transition-all duration-200 group ${
                  language === 'ar'
                    ? 'bg-physiology/10 border-physiology/30 text-physiology-dark dark:text-physiology'
                    : 'bg-gray-50/60 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                    🇪🇬
                  </div>
                  <span className="text-sm font-bold font-manrope tracking-wide font-amiri">
                    العربية (Arabic)
                  </span>
                </div>
                {language === 'ar' && (
                  <div className="w-5.5 h-5.5 rounded-full bg-physiology flex items-center justify-center text-white shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </button>
            </div>

            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full py-3.5 mt-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-250 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl text-xs font-bold tracking-wide transition-all duration-200"
            >
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </button>
          </div>
        </div>
      )}

      {/* PORTALS MODAL */}
      {showPortalsModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-950/40 backdrop-blur-md transition-all duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPortalsModal(false);
            }
          }}
        >
          <div className="w-full max-w-md bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border border-gray-100/85 dark:border-gray-800/85 rounded-[30px] p-8 shadow-2xl animate-pop-up relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-physiology/10 to-transparent rounded-bl-[60px]" />
            
            <div className="flex items-center gap-3 mb-4 text-physiology">
              <div className="w-10 h-10 rounded-xl bg-physiology/10 flex items-center justify-center shrink-0">
                <GraduationCap size={22} />
              </div>
              <h3 className="font-archivo text-xl font-bold tracking-tight">
                {language === 'en' ? "ASU Academic Portals" : "بوابات جامعة عين شمس"}
              </h3>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
              {language === 'en' 
                ? "Select an official university portal to open in a new tab." 
                : "اختر البوابة الجامعية الرسمية لفتحها في تبويب جديد."}
            </p>

            <div className="space-y-3">
              {/* EMP Portal */}
              <a
                href="https://asu2learn.asu.edu.eg/medicine-emp/my/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-4 rounded-2xl bg-gray-50/60 dark:bg-gray-800/30 hover:bg-physiology/10 dark:hover:bg-physiology/15 border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-all group duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-physiology/10 dark:bg-physiology/20 flex items-center justify-center text-physiology group-hover:scale-105 transition-transform duration-200 shrink-0">
                  <BookOpen size={18} />
                </div>
                <div className="flex flex-col text-left rtl:text-right">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-250 group-hover:text-physiology transition-colors duration-200 tracking-wide font-manrope">
                    {language === 'en' ? "EMP Portal" : "بوابة EMP"}
                  </span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                    {language === 'en' ? "E-Learning Management System" : "نظام إدارة التعلم الإلكتروني للبرنامج المتميز"}
                  </span>
                </div>
              </a>

              {/* Mainstream Portal */}
              <a
                href="https://asu2learn.asu.edu.eg/medicine/my/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-4 rounded-2xl bg-gray-50/60 dark:bg-gray-800/30 hover:bg-anatomy/10 dark:hover:bg-anatomy/15 border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-all group duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-anatomy/10 dark:bg-anatomy/20 flex items-center justify-center text-anatomy group-hover:scale-105 transition-transform duration-200 shrink-0">
                  <Layers size={18} />
                </div>
                <div className="flex flex-col text-left rtl:text-right">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-250 group-hover:text-anatomy transition-colors duration-200 tracking-wide font-manrope">
                    {language === 'en' ? "Mainstream Portal" : "البوابة الرئيسية"}
                  </span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                    {language === 'en' ? "Mainstream E-Learning System" : "نظام التعلم الإلكتروني الرئيسي للكلية"}
                  </span>
                </div>
              </a>

              {/* UMS Portal */}
              <a
                href="https://ums.asu.edu.eg/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-4 rounded-2xl bg-gray-50/60 dark:bg-gray-800/30 hover:bg-clinical/10 dark:hover:bg-clinical/15 border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-all group duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-clinical/10 dark:bg-clinical/20 flex items-center justify-center text-clinical group-hover:scale-105 transition-transform duration-200 shrink-0">
                  <GraduationCap size={18} />
                </div>
                <div className="flex flex-col text-left rtl:text-right">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-250 group-hover:text-clinical transition-colors duration-200 tracking-wide font-manrope">
                    {language === 'en' ? "UMS Portal" : "بوابة UMS"}
                  </span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                    {language === 'en' ? "University Management System" : "نظام إدارة الجامعة والخدمات الطلابية"}
                  </span>
                </div>
              </a>
            </div>

            <button
              onClick={() => setShowPortalsModal(false)}
              className="w-full mt-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold tracking-wide transition-all duration-200"
            >
              {language === 'en' ? "Close" : "إغلاق"}
            </button>
          </div>
        </div>
      )}

      <ClerkThemeTogglePortal />
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return <LoadingScreen onComplete={() => setReady(true)} />;
  }

  return (
    <ThemeProvider>
      {/* Dynamic Floating Background Blobs & Interactive Dots */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <InteractiveBackground />
        <div className="absolute top-[10%] left-[5%] h-[35vw] w-[35vw] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-physiology/30 to-transparent dark:from-physiology/20 blob-float-1" />
        <div className="absolute bottom-[10%] right-[5%] h-[40vw] w-[40vw] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-anatomy/30 to-transparent dark:from-anatomy/20 blob-float-2" />
      </div>

      <SignedIn>
        <BrowserRouter>
          <ProgressProvider>
            <MainApp />
            <LevelUpOverlay />
          </ProgressProvider>
        </BrowserRouter>
      </SignedIn>
      <SignedOut>
        <Suspense fallback={<LoadingScreen />}>
          <LoginScreen />
        </Suspense>
      </SignedOut>
    </ThemeProvider>
  );
}
