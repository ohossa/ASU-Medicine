import {topicScores,questionScore,resumeCustomPractice,selectedPractice,practiceTopics,type TopicScore} from './learning/customPractice';
import {RouteDataGate} from './loading/RouteDataGate';
import {resolveStudyLink} from './utils/studyLinks';
import {LearningProvider,useLearning} from './learning/LearningProvider';
import {TITLES} from './learning/contracts';
import '../pages/learning-hub.css';
import { restoreHistoryQuestions, resolveHistoryChapter } from './utils/historyQuestions';
import { useBankRevision } from './components/CorrectionStatus';
import { useOwnerAccess } from './reports/useOwnerAccess';
import { missedPracticeSubject } from './utils/missedQuestions';
import { CorrectionStatus } from './components/CorrectionStatus';
import { useShufflePreference } from './preferences/useShufflePreference';
import { shuffledCopy, restoreQuestionOrder, sessionMatchesQuestions } from './preferences/shuffle';
import { ReportProvider } from './reports/ReportQuestion';
import { useState, useEffect, useRef, useMemo, Suspense, lazy, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router';
import safeStorage from './utils/safeStorage';
import { ProgressProvider } from './store/progress';
import { FX } from './lib/fx.config';
import { useDeferredMount } from './hooks/useDeferredMount';
import { FeatureErrorBoundary } from './components/FeatureErrorBoundary';
import { useViewTransition } from './hooks/useViewTransition';
import { ClerkThemeTogglePortal } from './components/ClerkThemeTogglePortal';
import { LanguageProfilePage } from './components/profile/LanguageProfilePage';
import { AcademicYearProfilePage } from './components/profile/AcademicYearProfilePage';

// Lazy-loaded components for routing/modals
const AdminPortal = lazy(() => import('../pages/AdminPortal'));
const LearningHub = lazy(() => import('../pages/LearningHub'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const YearModules = lazy(() => import('../pages/YearModules'));
const StudyMode = lazy(() => import('../pages/StudyMode'));
const SubjectSelect = lazy(() => import('./components/SubjectSelect').then(m => ({ default: m.SubjectSelect })));
const StudyTrackerSelectorModal = lazy(() => import('./components/StudyTrackerSelectorModal').then(m => ({ default: m.StudyTrackerSelectorModal })));

// Lazy-loaded FX layer components
const LazyLevelUpOverlay = lazy(() => import('./components/LevelUpOverlay').then(m => ({ default: m.LevelUpOverlay })));
const LazyInteractiveBackground = lazy(() => import('./components/ui/InteractiveBackground').then(m => ({ default: m.InteractiveBackground })));
const LazyConfettiManager = lazy(() => import('./components/ConfettiManager').then(m => ({ default: m.ConfettiManager })));
const LazySoundManagerComponent = lazy(() => import('./components/SoundManagerComponent').then(m => ({ default: m.SoundManagerComponent })));

// Eager mode aliases (using lazy loading under the hood to prevent entry bundle bloat)
const EagerLevelUpOverlay = LazyLevelUpOverlay;
const EagerInteractiveBackground = LazyInteractiveBackground;

import { AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  BookOpen,
  Info,
  Activity,
  Layers,
  Mail,
  ExternalLink,
  Flag,
  Globe,
  Check,
  HeartHandshake
} from 'lucide-react';
import { toGitTopicChapter } from './lib/gitBank';
import type { ChapterData, SubjectData, Question, Screen, QuizAnswer, QuestionCollection } from './types';
import { normalizeQuizAnswers } from './types';
const GitBankSelect = lazy(() => import('./components/GitBankSelect').then(m => ({ default: m.GitBankSelect })));
const ChapterSelect = lazy(() => import('./components/ChapterSelect').then(m => ({ default: m.ChapterSelect })));
const QuizInterface = lazy(() => import('./components/QuizInterface').then(m => ({ default: m.QuizInterface })));
const ResultsDashboard = lazy(() => import('./components/ResultsDashboard').then(m => ({ default: m.ResultsDashboard })));
const FlaggedQuestionsScreen = lazy(() => import('./components/FlaggedQuestionsScreen').then(m => ({ default: m.FlaggedQuestionsScreen })));

const QuestionSearch = lazy(() => import('./components/QuestionSearch').then(m => ({ default: m.QuestionSearch })));
const MarksCalculator = lazy(() => import('./components/MarksCalculator').then(m => ({ default: m.MarksCalculator })));
const SyllabusTrackerPage = lazy(() => import('../pages/SyllabusTrackerPage').then(m => ({ default: m.SyllabusTrackerPage })));

import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './hooks/useLanguage';
import { saveQuizResult } from './utils/storage';
import type { QuizResult } from './utils/storage';
import { SignedIn, SignedOut, UserButton, useUser, useAuth } from '@clerk/clerk-react';
const LoginScreen = lazy(() => import('./components/LoginScreen').then(m => ({ default: m.LoginScreen })));
import LoadingScreen from './components/LoadingScreen';
import { useQuizSession, clearLocalDrafts } from './hooks/useQuizSession';
import type { QuizSessionSave } from './hooks/useQuizSession';
import QuizResumeCard from './components/QuizResumeCard';
import { useCloudSync } from './hooks/useCloudSync';
import { useAcademicYear } from './preferences/useAcademicYear';
import { YearSelectionModal } from './components/YearSelectionModal';
import {
  ensureModuleDataLoaded,
  isModuleDataLoaded,
  startCorrectionsRefresh,
  getChaptersForModuleAndMode,
  findQuestionById,
  SYLLABUS_MODULES
} from './data';
import type { ModuleInfo } from './data';

import {currentPractice} from './learning/currentPractice';
import {continuationQuestions} from './learning/continuation';
import {freezeAttempt,restoreAttempt} from './learning/attemptSnapshot';
interface QuizPayload {
  childAnchor?:string;
  chapter: ChapterData;
  subject: SubjectData | null;
  questions: Question[];
  savedSession?: QuizSessionSave;
}

interface ResultPayload {
  topicResults?:TopicScore[];
  originalScore?:{correct:number;total:number;pct:number};
  historyNotice?:string;
  chapter: ChapterData;
  subject: SubjectData | null;
  questions: Question[];
  answers: Record<number, QuizAnswer>;
  elapsedSeconds: number;
  flaggedQuestions: Set<number>;
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
  selectedModule,
  setSelectedModule,
  studyMode,
  setStudyMode,
  screen,
  setScreen,
  activeChapters,
  studyModeNameMap,
  selectedChapter,
  handleSelectChapter,
  handleSelectHistory,
  customUserButton,
  selectedYear,
  handleSelectSubject,
  handleQuickStart,
  quizPayload,
  handleFinishQuiz,
  handleAnswerXP,
  resultPayload,
  handleRetake,
  handleRetryMissed,
  handleBackToChapters,
  isFromHistory,
  setIsFromHistory,
  historySource,
  t
}: {
  selectedModule: ModuleInfo | null;
  setSelectedModule: (m: ModuleInfo | null) => void;
  studyMode: 'mcq' | 'essay' | 'mixed' | null;
  setStudyMode: (m: 'mcq' | 'essay' | 'mixed' | null) => void;
  screen: Screen;
  setScreen: (s: Screen) => void;
  activeChapters: ChapterData[];
  studyModeNameMap: Record<string, string>;
  selectedChapter: ChapterData | null;
  handleSelectChapter: (c: ChapterData) => void;
  handleSelectHistory: (res: QuizResult, source: 'chapters' | 'history') => void;
  customUserButton: React.ReactNode;
  selectedYear: number | null;
  handleSelectSubject: (s: SubjectData, q: Question[]) => void;
  handleQuickStart: (q: Question[]) => void;
  quizPayload: QuizPayload | null;
  handleAnswerXP: (question: Question, answer: QuizAnswer) => void;
  handleFinishQuiz: (answers: Record<number, QuizAnswer>, elapsedSeconds: number, flaggedQuestions: Set<number>) => void;
  resultPayload: ResultPayload | null;
  handleRetake: () => void;
  handleRetryMissed: (questions: Question[]) => void;
  handleBackToChapters: () => void;
  isFromHistory: boolean;
  setIsFromHistory: (b: boolean) => void;
  historySource: 'chapters' | 'history' | null;
  t: (key: string) => string;
}) {
  const navigate = useNavigate();
  const { code, mode } = useParams<{ code: string; mode: string }>();
  const [gitCollection, setGitCollection] = useState<QuestionCollection>('practice');
  useEffect(() => { setGitCollection('practice'); }, [code, mode]);
  useEffect(() => {
    if (selectedModule?.code === 'MGL-3' && screen !== 'chapters' && selectedChapter?.bankSection) setGitCollection(selectedChapter.bankSection);
  }, [selectedModule?.code, selectedChapter, screen]);

  useEffect(() => {
    if (code) {
      const targetModule = lookupModule(code);
      if (targetModule) {
        setSelectedModule(targetModule);
      }
    }
    if (mode) {
      setStudyMode(mode as 'mcq' | 'essay' | 'mixed');
    }
    if (screen !== 'chapters' && screen !== 'subjects' && screen !== 'quiz' && screen !== 'results') {
      setScreen('chapters');
    }
  }, [code, mode, setSelectedModule, setStudyMode, setScreen, screen]);

  if (!selectedModule || !studyMode) {
    return <div>Loading module...</div>;
  }

  const gitBaseCrumbs = [
    { label: 'Portal', onClick: () => navigate('/') },
    { label: 'Year 3', onClick: () => navigate('/year-3') },
    { label: 'Semester 1', onClick: () => navigate('/year-3?semester=1') },
    { label: 'GIT & Liver', onClick: () => navigate('/year-3/mgl-3') },
    { label: studyModeNameMap[studyMode], onClick: () => { setGitCollection('practice'); setScreen('chapters'); } },
  ];
  const gitCollectionCrumbs = [
    ...gitBaseCrumbs,
    { label: 'Question bank', onClick: () => { setGitCollection('practice'); setScreen('chapters'); } },
    ...(gitCollection === 'past-exams' ? [{ label: 'Past exams & recalls', onClick: () => { setGitCollection('past-exams'); setScreen('chapters'); } }] : []),
  ];

  return (
    <>
      {screen === 'chapters' && (
        <Suspense fallback={<LoadingScreen compact label="Opening this view…"/>}>
          {selectedModule.code === 'MGL-3' ? <GitBankSelect
            chapters={activeChapters}
            collection={gitCollection}
            breadcrumbPath={gitBaseCrumbs}
            onCollectionChange={setGitCollection}
            studyModeName={studyModeNameMap[studyMode]}
            onSelectChapter={handleSelectChapter}
            userButton={customUserButton}
            onBackToModeSelect={() => navigate('/year-3/mgl-3')}
          /> : <ChapterSelect
            chapters={activeChapters}
            studyModeName={studyModeNameMap[studyMode]}
            moduleName={selectedModule.name}
            moduleCode={selectedModule.code}
            onSelectChapter={handleSelectChapter}
            onSelectHistory={(res) => handleSelectHistory(res, 'chapters')}
            onBackToModeSelect={() => {
              const match = location.pathname.match(/\/year-(\d+)/);
              const yr = match ? match[1] : '2';
              navigate(`/year-${yr}/${selectedModule.code.toLowerCase()}`);
            }}
            userButton={customUserButton}
            breadcrumbPath={[
              { label: t('portal') || 'Portal', onClick: () => navigate('/') },
              { label: t(`year${selectedYear || 2}`) || `Year ${selectedYear || 2}`, onClick: () => navigate(`/year-${selectedYear || 2}`) },
              { label: selectedModule?.name || '' }
            ]}
          />}
        </Suspense>
      )}

      {screen === 'subjects' && selectedChapter && (
        <Suspense fallback={<LoadingScreen compact label="Opening this view…"/>}>
          <SubjectSelect
            chapter={selectedChapter}
            moduleCode={selectedModule.code}
            breadcrumbPath={selectedModule.code === 'MGL-3' ? [...gitCollectionCrumbs, { label: selectedChapter.subjects[0]?.id ? selectedChapter.title.replace(/^Past exams — /, '') : selectedChapter.title }] : [
              { label: t('portal') || 'Portal', onClick: () => navigate('/') },
              { label: t(`year${selectedYear || 2}`) || `Year ${selectedYear || 2}`, onClick: () => navigate(`/year-${selectedYear || 2}`) },
              { label: selectedModule?.name || '', onClick: () => {
                const match = location.pathname.match(/\/year-(\d+)/);
                const yr = match ? match[1] : '2';
                navigate(`/year-${yr}/${selectedModule.code.toLowerCase()}`);
              }} ,
              { label: selectedChapter.title }
            ]}
            onBack={() => setScreen('chapters')}
            onSelectSubject={handleSelectSubject}
            onQuickStart={handleQuickStart}
            userButton={customUserButton}
          />
        </Suspense>
      )}

      {screen === 'quiz' && quizPayload && (
        <Suspense fallback={<LoadingScreen compact label="Opening this view…"/>}>
          <QuizInterface
            chapter={quizPayload.chapter}
            subject={quizPayload.subject}
            questions={quizPayload.questions}
            onBack={() => setScreen('subjects')}
            onFinish={handleFinishQuiz}
            onAnswer={handleAnswerXP}
            userButton={customUserButton}
            savedSession={quizPayload.savedSession}
            childAnchor={quizPayload.childAnchor}
            breadcrumbPath={selectedModule.code === 'MGL-3' ? [
              ...gitCollectionCrumbs,
              { label: quizPayload.chapter.title.replace(/^Past exams — /, ''), onClick: () => setScreen('subjects') },
              { label: quizPayload.subject?.name ?? 'All topics' },
            ] : undefined}
          />
        </Suspense>
      )}

      {screen === 'results' && resultPayload && (
        <Suspense fallback={<LoadingScreen compact label="Opening this view…"/>}>
          <ResultsDashboard
            chapter={resultPayload.chapter}
            subject={resultPayload.subject}
            questions={resultPayload.questions}
            answers={resultPayload.answers}
            elapsedSeconds={resultPayload.elapsedSeconds}
            flaggedQuestions={resultPayload.flaggedQuestions}
            originalScore={resultPayload.originalScore}
            historyNotice={resultPayload.historyNotice}
            topicResults={resultPayload.topicResults}
            onRetake={handleRetake}
            onRetryMissed={handleRetryMissed}
            onTryAnotherSubject={() => {
              if (isFromHistory) {
                setIsFromHistory(false);
                setScreen(historySource === 'chapters' ? 'chapters' : 'history');
                if (historySource !== 'chapters') navigate('/history');
              } else {
                setScreen('subjects');
              }
            }}
            onBackToChapters={handleBackToChapters}
            onBackToSubjects={() => {
              if (isFromHistory) {
                setIsFromHistory(false);
                setScreen(historySource === 'chapters' ? 'chapters' : 'history');
                if (historySource !== 'chapters') navigate('/history');
              } else {
                setScreen('subjects');
              }
            }}
            userButton={customUserButton}
            breadcrumbPath={selectedModule.code === 'MGL-3' ? [
              ...gitCollectionCrumbs,
              { label: resultPayload.chapter.title.replace(/^Past exams — /, ''), onClick: () => setScreen('subjects') },
              { label: resultPayload.subject?.name ?? 'All topics', onClick: () => setScreen('subjects') },
              { label: 'Results' },
            ] : undefined}
          />
        </Suspense>
      )}
    </>
  );
}

function MainApp() {
  const hasOwnerAccess = useOwnerAccess();
  const bankRevision = useBankRevision();
  const transitionTo = useViewTransition();
  const { t, language, toggleLanguage } = useLanguage();
  const { user } = useUser();
  const { enabled: shuffleEnabled } = useShufflePreference();
  const prepareQuestions = (questions: Question[]) => shuffleEnabled ? shuffledCopy(questions) : [...questions];
  useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize automatic cloud synchronization
  useCloudSync();

  // Startup cleanup: remove stale quiz sessions and local drafts (>7 days old or finished)
  useEffect(() => {
    if (!user?.id) return;
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const uid = user.id;
    const prefixes = ['asu_quiz_session:', 'asu_local_drafts:'];
    const toDelete: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const isMatch = prefixes.some(p => key.startsWith(`${p}${uid}:`));
      if (!isMatch) continue;
      try {
        const raw = localStorage.getItem(key);
        if (!raw) { toDelete.push(key); continue; }
        const parsed = JSON.parse(raw);
        const age = now - (parsed?.timestamp || 0);
        if (age > SEVEN_DAYS_MS || parsed?.finished === true) {
          toDelete.push(key);
        }
      } catch {
        toDelete.push(key);
      }
    }

    toDelete.forEach(k => localStorage.removeItem(k));
    if (toDelete.length > 0) {
      console.info(`[StartupCleanup] Removed ${toDelete.length} stale localStorage entries`);
    }
  }, [user?.id]);

  // ── 1. State Initializations ──────────────────────────────────────────────────

  // Student Year tracking
  const {year: studentYear, saveYear: setStudentYear, loading: yearLoading, error: yearError, retry: retryYear, localPreview} = useAcademicYear();

  // Navigation states
  const [screen, setScreen] = useState<Screen>(() => {
    try {
      const saved = safeStorage.getItem<string | null>('asu_portal_screen', null);
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
    try { const saved = safeStorage.getItem<string | null>('asu_portal_year', null); return saved ? Number(saved) : null; } catch { return null; }
  });
  const [selectedSemester, setSelectedSemester] = useState<number | null>(() => {
    try { const saved = safeStorage.getItem<string | null>('asu_portal_semester', null); return saved ? Number(saved) : null; } catch { return null; }
  });
  const [selectedModule, setSelectedModule] = useState<ModuleInfo | null>(() => {
    try { const saved = safeStorage.getItem<string | null>('asu_portal_module', null); return saved ? JSON.parse(saved) : null; } catch { return null; }
  });
  const [studyMode, setStudyMode] = useState<'mcq' | 'essay' | 'mixed' | null>(() => {
    try { const saved = safeStorage.getItem<string | null>('asu_portal_studyMode', null); return (saved as 'mcq' | 'essay' | 'mixed') || null; } catch { return null; }
  });

  const [showTrackerSelector, setShowTrackerSelector] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPortalsModal, setShowPortalsModal] = useState(false);
  
  // Quiz states
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(null);
  const [quizPayload, setQuizPayload] = useState<QuizPayload | null>(null);
  const [resumePayload, setResumePayload] = useState<QuizSessionSave | null>(null);
  const [resultPayload, setResultPayload] = useState<ResultPayload | null>(null);

  const transformedChapter = useMemo(() => {
    if (!selectedChapter) return null;
    if (selectedModule?.code === 'MGL-3') return toGitTopicChapter(selectedChapter);
    const isMINF = selectedModule?.code === 'MINF-1';
    const isMSS = selectedModule?.code === 'MSS-2' && selectedChapter.id >= 1 && selectedChapter.id <= 8;
    if (!isMINF && !isMSS) {
      return selectedChapter;
    }
    const parentSubject = selectedChapter.subjects[0];
    if (!parentSubject || !parentSubject.lectureNames) {
      return selectedChapter;
    }
    const virtualSubjects: SubjectData[] = parentSubject.lectureNames.map((lectureName, index) => {
      const lectureNum = index + 1;
      const questionsForLecture = parentSubject.questions.filter(
        (q) => q.lecture === lectureNum
      );
      return {
        id: parentSubject.id,
        name: lectureName,
        iconName: parentSubject.iconName,
        lectures: lectureName,
        lectureCount: 1,
        lectureNames: [lectureName],
        questions: questionsForLecture,
        lectureNum,
      };
    });
    return {
      ...selectedChapter,
      subjects: virtualSubjects,
    };
  }, [selectedChapter, selectedModule]);
  
  // UI States
  const [modalModule, setModalModule] = useState<ModuleInfo | null>(null);



  // Cloud sync/session hooks
  const { load: loadQuizSession, clear: clearQuizSession } = useQuizSession();
  const isRestoringHistoryRef = useRef(false);

  // ── 2. Helpers and Data Functions ─────────────────────────────────────────────

  // ── 3. Life-Cycle Effects ─────────────────────────────────────────────────────

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
  }, [transitionTo]);

  // Synchronize yearId with selectedYear dynamically from location.pathname
  useEffect(() => {
    const match = location.pathname.match(/\/year-(\d+)/);
    if (match) {
      const yr = Number(match[1]);
      if (selectedYear !== yr) {
        setSelectedYear(yr);
      }
    }
  }, [location.pathname, selectedYear]);

  // Sync state to localStorage
  useEffect(() => {
    safeStorage.setItem('asu_portal_screen', screen);
    if (selectedYear) safeStorage.setItem('asu_portal_year', selectedYear.toString());
    else safeStorage.removeItem('asu_portal_year');
    if (selectedSemester) safeStorage.setItem('asu_portal_semester', selectedSemester.toString());
    else safeStorage.removeItem('asu_portal_semester');
    if (selectedModule) safeStorage.setItem('asu_portal_module', JSON.stringify(selectedModule));
    else safeStorage.removeItem('asu_portal_module');
    if (studyMode) safeStorage.setItem('asu_portal_studyMode', studyMode);
    else safeStorage.removeItem('asu_portal_studyMode');
    
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
          return JSON.stringify(currentHistoryState[k]) !== JSON.stringify(stateRepresentation[k as keyof typeof stateRepresentation]);
        }
        return currentHistoryState[k] !== stateRepresentation[k as keyof typeof stateRepresentation];
      });

      if (isChanged) {
        window.history.pushState({ asuPortal: true, ...stateRepresentation }, '');
      }
    }
  }, [screen, selectedYear, selectedSemester, selectedModule, studyMode, selectedChapter, quizPayload, resultPayload]);

  // Auto-routing safety net to prevent black screen (empty layouts) due to inconsistent/missing states on refresh
  useLayoutEffect(() => {
    if (screen === 'chapters' && (!selectedModule || !studyMode)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
  }, [screen, selectedYear, selectedSemester, selectedModule, studyMode, selectedChapter, quizPayload, resultPayload, transitionTo]);

  const handleSelectChapter = (chapter: ChapterData) => {
    transitionTo(() => {
      setSelectedChapter(chapter);
      setScreen('subjects');
    });
  };

  const handleSelectSubject = (subject: SubjectData, questions: Question[]) => {
    const saved = loadQuizSession(transformedChapter!.id, subject.sessionKey ?? subject.name);
    if (saved && !saved.finished && (saved.questionIds ? sessionMatchesQuestions(questions, saved) : selectedModule?.code !== 'MGL-3')) {
      setResumePayload(saved);
      return;
    }
    transitionTo(() => {
      setQuizPayload({ chapter: transformedChapter!, subject, questions: prepareQuestions(questions) });
      setScreen('quiz');
    });
  };

  const handleQuickStart = (questions: Question[]) => {
    const saved = loadQuizSession(transformedChapter!.id, 'all');
    if (saved && !saved.finished && (saved.questionIds ? sessionMatchesQuestions(questions, saved) : selectedModule?.code !== 'MGL-3')) {
      setResumePayload(saved);
      return;
    }
    transitionTo(() => {
      setQuizPayload({ chapter: transformedChapter!, subject: null, questions: prepareQuestions(questions) });
      setScreen('quiz');
    });
  };

  const learning = useLearning();
  const openedStudyLink=useRef('');
  const [studyLinkError,setStudyLinkError]=useState('');
  useEffect(()=>{
    const params=new URLSearchParams(location.search);
    if(!params.has('question')&&!params.has('chapter')) { openedStudyLink.current='';return; }
    const match=location.pathname.match(/^\/year-(\d+)\/([^/]+)\/(mcq|essay|mixed)$/);
    if(!match)return;
    const signature=location.pathname+location.search;
    if(openedStudyLink.current===signature)return;
    if(params.has('missed')&&!learning.data){setStudyLinkError('Sync your learning records to open missed-question practice.');return;}
    const module=lookupModule(match[2]);if(!module)return;
    if(!isModuleDataLoaded(module.code))return;
    const chapters=getChaptersForModuleAndMode(module.code,match[3] as 'mcq'|'essay'|'mixed');
    const target=resolveStudyLink(chapters,params);
    openedStudyLink.current=signature;
    if(!target){setStudyLinkError('This question or chapter is no longer available in the published bank. Choose another chapter.');setScreen('chapters');return;}
    setStudyLinkError('');setSelectedYear(Number(match[1]));setSelectedModule(module);setStudyMode(match[3] as 'mcq'|'essay'|'mixed');
    const chapter=module.code==='MGL-3'?toGitTopicChapter(target.chapter):target.chapter;
    const subject=params.has('question')?{...(target.subject??chapter.subjects[0]),name:(target.subject?.name??'All subjects')+' · Search result',questions:target.questions}:target.subject;
    setSelectedChapter(chapter);
    let questions=params.has('question')?target.questions:prepareQuestions(target.questions);
    if(params.has('missed')){const missed=new Set(learning.data?.entries.filter(e=>e.moduleCode===module.code&&e.type!=='essay'&&!e.correct).map(e=>e.questionId)??[]);questions=questions.filter(q=>[...missed].some(id=>id===String(q.id)||id.startsWith(String(q.id)+'/')));if(!questions.length){setStudyLinkError('No latest missed questions remain in this topic.');setScreen('chapters');return;}}
    const resume=params.get('resume');const saved=resume?loadQuizSession(chapter.id,resume):null;
    const restored=saved?continuationQuestions(chapter,saved):null;
    if(resume&&!restored){setStudyLinkError('Your saved attempt has changed or is no longer on this device. The original draft is preserved; choose a chapter to start a new attempt.');setScreen('chapters');return;}
    const validSaved=saved??undefined;const custom=saved?resumeCustomPractice(chapter,saved,module.code):null;if(restored)questions=custom?.questions??restored;
    setQuizPayload({chapter,childAnchor:params.get('child')??undefined,subject:resume?(custom?.subject??{...(target.subject??chapter.subjects[0]),name:resume,questions}):params.has('missed')?missedPracticeSubject(subject,questions,chapter.accentColor):subject,questions:validSaved?(validSaved.questionIds?restoreQuestionOrder(questions,validSaved.questionIds)!:questions):questions,savedSession:validSaved});setScreen('quiz');
  },[location.pathname,location.search,bankRevision,learning.data]);

  const handleFinishQuiz = (answers: Record<number, QuizAnswer>, elapsedSeconds: number, flaggedQuestions: Set<number>) => {
    const questions = quizPayload!.questions;
    
    const scoreParts=questions.map((q,i)=>questionScore(q,answers[i]));
    const total=scoreParts.reduce((n,s)=>n+s.total,0);
    const correct=scoreParts.reduce((n,s)=>n+s.correct,0);
    const topicResults=topicScores(questions,answers);

    if(selectedModule && selectedYear===studentYear) learning.submit({moduleCode:selectedModule.code,items:questions.flatMap((q,i)=>answers[i]===undefined?[]:[{questionId:String(q.id),answer:answers[i]}])});
    setIsFromHistory(false);
    saveQuizResult({
      questionSnapshot:freezeAttempt(questions),
      topicResults,
      moduleCode: selectedModule?.code,
      year: selectedYear ?? undefined,
      semester: selectedSemester ?? undefined,
      chapterId: quizPayload!.chapter.id,
      chapterTitle: quizPayload!.chapter.title,
      subjectName: quizPayload!.subject?.name ?? 'All Subjects',
      scoreKind: questions.every(q=>q.type==='essay')?'self-reviewed':questions.some(q=>q.type==='essay'||q.type==='case'||q.type==='casestudy')?'mixed':'objective',
      correct,
      total,
      pct: total > 0 ? Math.round((correct / total) * 100) : 0,
      elapsedSeconds,
      questionIds: questions.map(q => q.id),
      answers,
      flaggedQuestionIds: Array.from(flaggedQuestions)
    });

    clearQuizSession(quizPayload!.chapter.id, quizPayload!.subject?.sessionKey ?? quizPayload!.subject?.name ?? 'all');
    clearLocalDrafts(quizPayload!.chapter.id, quizPayload!.subject?.sessionKey ?? quizPayload!.subject?.name ?? 'all');

    transitionTo(() => {
      setResultPayload({
        chapter: quizPayload!.chapter,
        subject: quizPayload!.subject,
        questions,
        answers,
        topicResults,
        elapsedSeconds,
        flaggedQuestions
      });
      setScreen('results');
    });
  };

  const handleSelectHistory = async (result: QuizResult, source: 'chapters' | 'history' = 'history') => {
    const modCode = result.moduleCode;
    if (!modCode) { window.alert('This historical session has no module metadata and cannot be restored safely. Its saved score is preserved in My Progress activity.'); return; }
    const scope=Object.entries(SYLLABUS_MODULES).flatMap(([year,sems])=>Object.entries(sems).flatMap(([semester,list])=>list.filter(m=>m.code===modCode).map(()=>({year:Number(year),semester:Number(semester)}))))[0];
    if (!scope) return;
    const yr=scope.year,sem=scope.semester;

    try{await ensureModuleDataLoaded(modCode);}catch{window.alert('This bank could not be loaded. Your saved result is preserved. Please retry.');return;}
    const originalQuestions=restoreAttempt(result.questionSnapshot);
    const moduleChapters = getChaptersForModuleAndMode(modCode, 'mixed');
    const storedChapter = resolveHistoryChapter(moduleChapters, result.chapterId, result.chapterTitle, result.questionIds);
    if (!storedChapter&&!originalQuestions) {window.alert('These questions are no longer published. Your original score remains in Activity.');return;}
    const fallback:ChapterData={id:result.chapterId,title:result.chapterTitle,subtitle:'Saved attempt',emoji:'',page:0,lectureRange:'',accentColor:'clinical' as const,subjects:[{id:'clinical',name:result.subjectName,iconName:'BookOpen',lectures:'Saved attempt',lectureCount:1,questions:originalQuestions??[]}]};
    const chapter = result.moduleCode === 'MGL-3' ? toGitTopicChapter(storedChapter??fallback) : storedChapter??fallback;

    let subject = chapter.subjects.find((s) => s.name === result.subjectName) || null;

    let questionsList: Question[] = [];
    let answersRecord = result.answers || {};
    let flaggedSet = new Set<number>((result.flaggedQuestionIds || []).map(Number));
    if (result.questionIds && Array.isArray(result.questionIds)) {
      const restored = restoreHistoryQuestions(result.questionIds,
        originalQuestions??chapter.subjects.flatMap(s => s.questions), answersRecord, result.flaggedQuestionIds || []);
      questionsList = restored.questions;
      answersRecord = restored.answers;
      flaggedSet = restored.flags;
    } else {
      questionsList = subject ? subject.questions : chapter.subjects.flatMap(s => s.questions);
    }

    if (result.topicResults?.length) subject={...(chapter.subjects[0]??fallback.subjects[0]),name:result.subjectName,questions:questionsList};

    if (result.subjectName.endsWith(' · Missed questions')) {
      const originalName = result.subjectName.slice(0, -' · Missed questions'.length);
      subject = missedPracticeSubject(chapter.subjects.find(s => s.name === originalName) ?? null, questionsList, chapter.accentColor);
    }


    // Try to locate the module definition
    let targetModule = SYLLABUS_MODULES[yr]?.[sem]?.find((m: ModuleInfo) => m.code === modCode) || null;

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
        answers: normalizeQuizAnswers(questionsList, answersRecord),
        originalScore:{correct:result.correct,total:result.total,pct:result.pct},
        topicResults:result.topicResults,
        historyNotice:originalQuestions?'Reviewing the question content and key saved with this attempt.':'Historical score preserved. Questions below use today’s bank; withdrawn items may be absent and current keys may differ.',
        elapsedSeconds: result.elapsedSeconds,
        flaggedQuestions: flaggedSet,
      });
      setIsFromHistory(true);
      setHistorySource(source);
      setScreen('results');
      navigate(`/year-${yr}/${modCode.toLowerCase()}/mixed`);
    });
  };

  const publishedPractice=(old:Question[])=>{
    if(!selectedModule)return [];
    const current=currentPractice(old,getChaptersForModuleAndMode(selectedModule.code,'mixed').flatMap(c=>c.subjects.flatMap(s=>s.questions)));
    if(current.length!==old.length)setStudyLinkError(`${old.length-current.length} withdrawn questions were omitted. New practice always uses the current published key.`);
    return current;
  };
  const handleRetryMissed = (missed: Question[]) => {
    if (!resultPayload || !missed.length) return;
    const current=publishedPractice(missed);if(!current.length){window.alert('These missed questions are no longer published. Your historical score is preserved.');return;}
    const questions = prepareQuestions(current);
    const subject = missedPracticeSubject(resultPayload.subject, questions, resultPayload.chapter.accentColor);
    if(questions.some(q=>q.practiceTopic))subject.sessionKey=selectedPractice(resultPayload.chapter,practiceTopics(resultPayload.chapter,selectedModule?.code),new Set(questions.map(q=>String(q.id)))).subject.sessionKey;
    clearQuizSession(resultPayload.chapter.id, subject.sessionKey??subject.name);
    clearLocalDrafts(resultPayload.chapter.id, subject.sessionKey??subject.name);
    transitionTo(() => {
      setIsFromHistory(false);
      setQuizPayload({chapter: resultPayload.chapter, subject, questions, savedSession: undefined});
      setResultPayload(null);
      setScreen('quiz');
    });
  };

  const handleRetake = () => {
    if (!quizPayload) return;
    const current=publishedPractice(quizPayload.questions);if(!current.length){window.alert('These questions are no longer published. Your historical score is preserved.');return;}
    transitionTo(() => {
      clearQuizSession(quizPayload.chapter.id, quizPayload.subject?.sessionKey ?? quizPayload.subject?.name ?? 'all');
      clearLocalDrafts(quizPayload.chapter.id, quizPayload.subject?.sessionKey ?? quizPayload.subject?.name ?? 'all');
      const custom=current.some(q=>q.practiceTopic)?selectedPractice(quizPayload.chapter,practiceTopics(quizPayload.chapter,selectedModule?.code),new Set(current.map(q=>String(q.id)))):null;
      setQuizPayload({ ...quizPayload, subject:custom?.subject??quizPayload.subject, savedSession: undefined, questions: prepareQuestions(custom?.questions??current) });
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
          navigate('/history');
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
  useEffect(() => {
    if (!bankRevision || !selectedModule || !studyMode) return;
    setSelectedChapter(previous => previous ? getChaptersForModuleAndMode(selectedModule.code, studyMode).find(chapter => chapter.id === previous.id) ?? previous : null);
  }, [bankRevision, selectedModule, studyMode]);

  const activeChapters = selectedModule && studyMode
    ? getChaptersForModuleAndMode(selectedModule.code, studyMode)
    : [];

  const studyModeNameMap = {
    mcq: 'MCQ Practice Mode',
    essay: 'Essay Study Mode',
    mixed: 'Mixed Exam Mode'
  };

  const customUserButton = useMemo(() => (
    <UserButton
      appearance={{
        baseTheme: undefined,
        elements: {
          userButtonBox: "w-9 h-9",
          userButtonTrigger: "w-9 h-9",
          userButtonAvatarBox: "w-9 h-9 border border-physiology shadow-md",
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

      <UserButton.UserProfilePage label="Learning profile" labelIcon={<GraduationCap size={16}/>} url="learning-profile">
        <div className={`learning-hero reward-banner-${learning.data?.profile.banner??'default'}`}><div><h2>{user?.firstName??'Your learning profile'}</h2><p>{learning.data?`Level ${learning.data.profile.level} · ${learning.data.profile.xp} personal XP`:'Your learning profile will appear after cloud sync.'}</p><p>{TITLES.find(t=>t.id===learning.data?.profile.title)?.name??'Medical Student'}</p><button className="learning-primary mt-4" onClick={()=>navigate('/learning')}>Open progress and rewards</button></div></div>
      </UserButton.UserProfilePage>
      <UserButton.MenuItems>
        <UserButton.Action label={language === "en" ? "Support ASUCodes" : "دعم ASUCodes"} labelIcon={<HeartHandshake size={16}/>} onClick={() => window.location.assign("/support")}/>
        {hasOwnerAccess && (
          <UserButton.Action label="Admin portal" labelIcon={<Layers size={16}/>} onClick={() => navigate('/admin')}/>
        )}

        <UserButton.Action
          label={language === 'en' ? "My Progress" : "تقدمي"}
          labelIcon={<Activity size={16} className="text-[#2dd4bf]" />}
          onClick={() => {
            transitionTo(() => navigate('/learning'));
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
          label="Report a website issue"
          labelIcon={<Mail size={16} className="text-gray-500" />}
          onClick={() => {
            setShowSupportModal(true);
          }}
        />
      </UserButton.MenuItems>
    </UserButton>
  ), [user, hasOwnerAccess, language, transitionTo, navigate, setQuizPayload, setResultPayload, setShowPortalsModal, setShowSupportModal, studentYear, setStudentYear, setScreen, setSelectedYear, setSelectedSemester, setSelectedModule, setStudyMode, setSelectedChapter, learning.data?.profile]);

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
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-physiology focus:text-white focus:rounded-lg focus:outline-none">
        Skip to content
      </a>
      <main id="main-content" className="w-full relative z-10">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-physiology/10 to-transparent dark:from-physiology/5 rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse duration-10000 will-change-transform transform-gpu"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-clinical/10 to-transparent dark:from-clinical/5 rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse duration-10000 will-change-transform transform-gpu" style={{ animationDelay: '2s' }}></div>
        </div>

        <>
          <CorrectionStatus />{studyLinkError&&<p role="alert" className="p-4 text-center">{studyLinkError}</p>}
          <RouteDataGate year={studentYear}><Routes location={location}>
            {/* Main Dashboard page */}
            <Route path="/" element={
              <Suspense fallback={<div className="fixed inset-0 bg-background pointer-events-none" />}>
                {yearLoading ? <div role="status" className="p-8 text-center text-muted-foreground">Loading your saved year…</div> : <Dashboard studentYear={studentYear}
                  userButton={customUserButton} 
                  onOpenTrackerSelector={() => navigate('/learning')}
                />}
              </Suspense>
            } />

            {/* Year Modules page */}
            {['1', '2', '3', '4', '5'].map(yr => (
              <Route key={`year-${yr}`} path={`/year-${yr}`} element={
                <Suspense fallback={<div className="fixed inset-0 bg-background pointer-events-none" />}>
                  <YearModules 
                    userButton={customUserButton} 
                  />
                </Suspense>
              } />
            ))}

            {/* Study Mode Selector page */}
            {['1', '2', '3', '4', '5'].map(yr => (
              <Route key={`year-mode-${yr}`} path={`/year-${yr}/:code`} element={
                <Suspense fallback={<div className="fixed inset-0 bg-background pointer-events-none" />}>
                  <StudyMode 
                    userButton={customUserButton} 
                    onStartStudyMode={(mode, mCode) => {
                      const targetModule = lookupModule(mCode);
                      if (targetModule) {
                        setSelectedModule(targetModule);
                        setStudyMode(mode);
                        if (targetModule.code === 'MGL-3') setSelectedChapter(null);
                        setScreen('chapters');
                        const match = location.pathname.match(/\/year-(\d+)/);
                        const yrMatch = match ? match[1] : yr;
                        navigate(`/year-${yrMatch}/${mCode.toLowerCase()}/${mode}`);
                      }
                    }}
                    onOpenSyllabus={(mCode) => {
                      const match = location.pathname.match(/\/year-(\d+)/);
                      const yrMatch = match ? match[1] : yr;
                      navigate(`/year-${yrMatch}/${mCode.toLowerCase()}/tracker`);
                    }}
                  />
                </Suspense>
              } />
            ))}

            {/* Chapters / Quiz sub-flow wrapper */}
            {['1', '2', '3', '4', '5'].map(yr => (
              <Route key={`year-quiz-${yr}`} path={`/year-${yr}/:code/:mode`} element={
                <FeatureErrorBoundary name="QuizFlow">
                  <QuizFlowWrapper 
                    selectedModule={selectedModule}
                    setSelectedModule={setSelectedModule}
                    studyMode={studyMode}
                    setStudyMode={setStudyMode}
                    screen={screen}
                    setScreen={setScreen}
                    activeChapters={activeChapters}
                    studyModeNameMap={studyModeNameMap}
                    selectedChapter={transformedChapter}
                    handleSelectChapter={handleSelectChapter}
                    handleSelectHistory={handleSelectHistory}
                    customUserButton={customUserButton}
                    selectedYear={selectedYear}
                    handleSelectSubject={handleSelectSubject}
                    handleQuickStart={handleQuickStart}
                    quizPayload={quizPayload}
                    handleAnswerXP={(q,answer)=>{if(selectedModule && selectedYear===studentYear)learning.submit({moduleCode:selectedModule.code,items:[{questionId:String(q.id),answer}]});}}
                    handleFinishQuiz={handleFinishQuiz}
                    resultPayload={resultPayload}
                    handleRetake={handleRetake}
                    handleRetryMissed={handleRetryMissed}
                    handleBackToChapters={handleBackToChapters}
                    isFromHistory={isFromHistory}
                    setIsFromHistory={setIsFromHistory}
                    historySource={historySource}
                    t={t}
                  />
                </FeatureErrorBoundary>
              } />
            ))}

            <Route path="/admin/*" element={<FeatureErrorBoundary name="AdminPortal"><Suspense fallback={<div role="status">Loading admin portal…</div>}><AdminPortal userButton={customUserButton}/></Suspense></FeatureErrorBoundary>} />
            {/* Tools pages */}
            <Route path="/learning" element={<Suspense fallback={<div role="status">Loading your learning…</div>}><LearningHub key={user?.id} userButton={customUserButton} onSelectHistory={res=>handleSelectHistory(res,'history')}/></Suspense>}/>
            <Route path="/study-tracker" element={<Navigate to="/learning?view=progress" replace/>}/>
            <Route path="/history" element={<Navigate to="/learning?view=activity" replace/>}/>

            <Route path="/case-solver" element={<Navigate to="/" replace/>}/>

            <Route path="/marks-calculator" element={
              <FeatureErrorBoundary name="MarksCalculator">
                <Suspense fallback={<LoadingScreen compact label="Opening this view…"/>}>
                  <MarksCalculator studentYear={studentYear??selectedYear??1}
                    onBack={() => navigate('/')}
                    userButton={customUserButton}
                  />
                </Suspense>
              </FeatureErrorBoundary>
            } />

            <Route path="/question-search" element={
              <Suspense fallback={<LoadingScreen compact label="Opening this view…"/>}>
                <QuestionSearch key={user?.id}
                  onBack={() => navigate('/')}
                  userButton={customUserButton}
                />
              </Suspense>
            } />

            <Route path="/analytics" element={<Navigate to="/learning?view=overview" replace/>}/>

            <Route path="/flagged-questions" element={
              <Suspense fallback={<LoadingScreen compact label="Opening this view…"/>}>
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
                    const found = qs[0] ? findQuestionById(qs[0].id) : null;
                    if (!found) return;
                    for (const [year, semesters] of Object.entries(SYLLABUS_MODULES)) {
                      for (const [semester, modules] of Object.entries(semesters)) {
                        const module = modules.find(m => m.code === found.moduleCode);
                        if (!module) continue;
                        setSelectedYear(Number(year));
                        setSelectedSemester(Number(semester));
                        setSelectedModule(module);
                        setStudyMode('mixed');
                        navigate(`/year-${year}/${module.code.toLowerCase()}/mixed`);
                        return;
                      }
                    }
                  }}
                  userButton={customUserButton}
                />
              </Suspense>
            } />
            
            {['1', '2', '3', '4', '5'].map(yr => (
              <Route key={`year-tracker-${yr}`} path={`/year-${yr}/:code/tracker`} element={
                <Suspense fallback={<LoadingScreen compact label="Opening this view…"/>}>
                  {yearLoading ? <div role="status">Loading your year…</div> : studentYear===Number(yr) ? <SyllabusTrackerPage key={user?.id} userButton={customUserButton} /> : <Navigate to="/learning" replace/>}
                </Suspense>
              } />
            ))}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes></RouteDataGate>

        {resumePayload && (
          <QuizResumeCard
            open={!!resumePayload}
            current={resumePayload.current}
            total={(() => {
              if(resumePayload.questionIds)return resumePayload.questionIds.length;
              const sub = transformedChapter?.subjects.find(s => s.name === resumePayload?.subjectName);
              if (sub) return sub.questions.length;
              return transformedChapter?.subjects.flatMap(s => s.questions).length ?? 0;
            })()}
            elapsedSeconds={resumePayload.elapsedSeconds}
            answeredCount={Object.values(resumePayload.answers).filter(a => a !== undefined && a !== null).length}
            onResume={() => {
              if (!resumePayload || !transformedChapter) return;
              const custom=resumeCustomPractice(transformedChapter,resumePayload,selectedModule?.code);
              const subject = custom?.subject??transformedChapter.subjects.find(s => s.name === resumePayload.subjectName) ?? null;
              const questions = custom?.questions??(subject ? subject.questions : transformedChapter.subjects.flatMap(s => s.questions));
              transitionTo(() => {
                setQuizPayload({ chapter: transformedChapter, subject, questions: resumePayload.questionIds ? restoreQuestionOrder(questions, resumePayload.questionIds)! : questions, savedSession: resumePayload });
                setResumePayload(null);
                setScreen('quiz');
              });
            }}
            onRestart={() => {
              if (!transformedChapter || !resumePayload) return;
              clearQuizSession(transformedChapter.id, resumePayload.subjectName);
              const custom=resumeCustomPractice(transformedChapter,resumePayload,selectedModule?.code);
              const subject = custom?.subject??transformedChapter.subjects.find(s => s.name === resumePayload.subjectName) ?? null;
              const questions = custom?.questions??(subject ? subject.questions : transformedChapter.subjects.flatMap(s => s.questions));
              setResumePayload(null);
              transitionTo(() => {
                setQuizPayload({ chapter: transformedChapter, subject, questions: prepareQuestions(questions) });
                setScreen('quiz');
              });
            }}
            onCancel={() => setResumePayload(null)}
          />
        )}

      </>
    </main>

      <AnimatePresence>
        {showTrackerSelector && (
          <Suspense fallback={null}>
            <StudyTrackerSelectorModal
              onClose={() => setShowTrackerSelector(false)}
              onSelectModule={(mod) => {
                setShowTrackerSelector(false);
                const yr = mod.code.endsWith('-1') ? '1' : mod.code.endsWith('-2') ? '2' : mod.code.endsWith('-3') ? '3' : mod.code.endsWith('-4') ? '4' : '5';
                navigate(`/year-${yr}/${mod.code.toLowerCase()}/tracker`);
              }}
            />
          </Suspense>
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
      {!yearLoading && !studentYear && (
        <YearSelectionModal localPreview={localPreview} onSelect={setStudentYear} loadError={yearError} onRetry={retryYear} />
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
                Report a website issue
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
              className="w-full py-3.5 mt-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold tracking-wide transition-all duration-200"
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
              className="w-full py-3.5 mt-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl text-xs font-bold tracking-wide transition-all duration-200"
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
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-physiology transition-colors duration-200 tracking-wide font-manrope">
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
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-anatomy transition-colors duration-200 tracking-wide font-manrope">
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
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-clinical transition-colors duration-200 tracking-wide font-manrope">
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
              className="w-full mt-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold tracking-wide transition-all duration-200"
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
  const {isLoaded,isSignedIn}=useAuth();
  const deferredMounted=useDeferredMount();
  useEffect(()=>{void import('../pages/Dashboard');void import('../pages/YearModules');},[]);
  useEffect(()=>{if(isLoaded&&isSignedIn){performance.mark('asu:shell-ready');void startCorrectionsRefresh();}},[isLoaded,isSignedIn]);

  return (
    <ThemeProvider>
      {!isLoaded&&<LoadingScreen/>}
      {isLoaded && (
        <>

          {/* Dynamic Floating Background Blobs & Interactive Dots */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {FX.DEFERRED_FX ? (
              deferredMounted && FX.reactiveBackground && (
                <Suspense fallback={null}>
                  <LazyInteractiveBackground />
                </Suspense>
              )
            ) : (
              FX.reactiveBackground && (
                <Suspense fallback={null}>
                  <EagerInteractiveBackground />
                </Suspense>
              )
            )}
            <div className="absolute top-[10%] left-[5%] h-[35vw] w-[35vw] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-physiology/30 to-transparent dark:from-physiology/20 blob-float-1" />
            <div className="absolute bottom-[10%] right-[5%] h-[40vw] w-[40vw] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-anatomy/30 to-transparent dark:from-anatomy/20 blob-float-2" />
          </div>

          <SignedIn>
            <BrowserRouter>
              <ReportProvider><LearningProvider><ProgressProvider>
                <MainApp />
                {FX.DEFERRED_FX ? (
                  deferredMounted && (
                    <Suspense fallback={null}>
                      {FX.gamification && <LazyLevelUpOverlay />}
                      {FX.confetti && <LazyConfettiManager />}
                      {FX.sound && <LazySoundManagerComponent />}
                    </Suspense>
                  )
                ) : (
                  FX.gamification && (
                    <Suspense fallback={null}>
                      <EagerLevelUpOverlay />
                    </Suspense>
                  )
                )}
              </ProgressProvider></LearningProvider></ReportProvider>
            </BrowserRouter>
          </SignedIn>
          <SignedOut>
            <Suspense fallback={<LoadingScreen />}>
              <LoginScreen />
            </Suspense>
          </SignedOut>
        </>
      )}
    </ThemeProvider>
  );
}
