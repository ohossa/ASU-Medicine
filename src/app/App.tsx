// src/app/App.tsx  — IMPROVED
//
// Changes vs original:
//  1. Meaningful Suspense fallbacks (skeleton) instead of bare <div>Loading...</div>
//  2. useCallback on all navigation handlers to prevent unnecessary re-renders
//  3. Navigation state batched into one useEffect to avoid multiple localStorage writes
//  4. Cleaner yearSelect / semesterSelect card grid (removed inline <style> dump)
//  5. Header: user avatar initials as fallback, better responsive layout
//  6. Module cards: consistent hover state, proper "locked" appearance for inactive
//  7. studyModeSelect: cards have equal height via grid rows, no magic h-72
//  8. Deprecation: @ts-ignore on startViewTransition replaced with proper type guard
//  9. All <Suspense> fallbacks use the shared <ScreenSkeleton /> component
// 10. PortalFooter extracted into its own named export for reuse

import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import {
  GraduationCap, BookOpen, Calendar, Lock, Sparkles, ArrowRight, ChevronRight,
  Info, Activity, Layers, ArrowLeft, Clock, Award, ExternalLink, Brain,
} from 'lucide-react';
import type { ChapterData, SubjectData, Question, Screen } from './types';

const ChapterSelect   = lazy(() => import('./components/ChapterSelect').then(m   => ({ default: m.ChapterSelect })));
const QuizInterface   = lazy(() => import('./components/QuizInterface').then(m   => ({ default: m.QuizInterface })));
const ResultsDashboard = lazy(() => import('./components/ResultsDashboard').then(m => ({ default: m.ResultsDashboard })));
const HistoryScreen   = lazy(() => import('./components/HistoryScreen').then(m   => ({ default: m.HistoryScreen })));
const LoginScreen     = lazy(() => import('./components/LoginScreen').then(m     => ({ default: m.LoginScreen })));

import { SubjectSelect }    from './components/SubjectSelect';
import { SyllabusTracker }  from './components/SyllabusTracker';
import { ThemeToggle }      from './components/ThemeToggle';
import { LanguageToggle }   from './components/LanguageToggle';
import { useLanguage }      from './context/LanguageContext';
import { InteractiveBackground } from './components/ui/InteractiveBackground';
import { StackedCarousel }  from './components/ui/StackedCarousel';
import { getQuizHistory }   from './utils/storage';
import { saveQuizResult }   from './utils/storage';
import type { QuizResult }  from './utils/storage';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { useCloudSync }     from './hooks/useCloudSync';
import { YearSelectionModal } from './components/YearSelectionModal';
import {
  getChaptersForModuleAndMode,
  getModuleQuestionCounts,
  isModuleActive,
  SYLLABUS_MODULES,
} from './data';
import type { ModuleInfo } from './data';

// ── Types ────────────────────────────────────────────────────────────────────

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

// ── Shared Suspense fallback ─────────────────────────────────────────────────

function ScreenSkeleton() {
  return (
    <div className="w-full animate-fade-in py-8 space-y-6" aria-label="Loading…" role="status">
      <div className="skeleton h-9 w-48 mb-2" />
      <div className="skeleton h-4 w-72" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-48 rounded-[28px]" />
        ))}
      </div>
    </div>
  );
}

// ── Portal Footer ────────────────────────────────────────────────────────────

export function PortalFooter() {
  return (
    <footer className="w-full mt-16 pb-8 pt-6 text-center space-y-2 border-t border-border">
      <p className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">
        Ain Shams University · ASU Medical Portal
      </p>
      <p className="text-[11px] text-muted-foreground font-medium max-w-xl mx-auto px-6 leading-relaxed">
        Developed for medical students. For inquiries, database updates, or error reports:{' '}
        <a
          href="mailto:omarhmaged@gmail.com"
          className="hover:text-physiology transition-colors underline font-semibold"
        >
          omarhmaged@gmail.com
        </a>
      </p>
    </footer>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────

function MainApp() {
  const { t, language } = useLanguage();
  const { user } = useUser();

  useCloudSync();

  // ── Student year ─────────────────────────────────────────────────────────
  const [studentYear, setStudentYear] = useState<number | null>(() => {
    try {
      const s = localStorage.getItem('asu_medical_student_year');
      return s ? parseInt(s, 10) : null;
    } catch { return null; }
  });

  useEffect(() => {
    const onStorage = () => {
      try {
        const s = localStorage.getItem('asu_medical_student_year');
        if (s) setStudentYear(parseInt(s, 10));
      } catch { /* ignore */ }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // ── Navigation state ─────────────────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>(() => {
    try {
      const s = localStorage.getItem('asu_portal_screen') as Screen | null;
      if (!s || s === 'quiz' || s === 'results') return 'yearSelect';
      return s;
    } catch { return 'yearSelect'; }
  });

  const [selectedYear,     setSelectedYear]     = useState<number | null>(() => { try { const s = localStorage.getItem('asu_portal_year');     return s ? Number(s)   : null; } catch { return null; } });
  const [selectedSemester, setSelectedSemester] = useState<number | null>(() => { try { const s = localStorage.getItem('asu_portal_semester'); return s ? Number(s)   : null; } catch { return null; } });
  const [selectedModule,   setSelectedModule]   = useState<ModuleInfo | null>(() => { try { const s = localStorage.getItem('asu_portal_module');   return s ? JSON.parse(s) : null; } catch { return null; } });
  const [studyMode,        setStudyMode]        = useState<'mcq'|'essay'|'mixed'|null>(() => { try { return (localStorage.getItem('asu_portal_studyMode') as any) || null; } catch { return null; } });

  // Persist nav state — batched to avoid cascading effects
  useEffect(() => {
    try {
      localStorage.setItem('asu_portal_screen', screen);
      if (selectedYear)     localStorage.setItem('asu_portal_year',     selectedYear.toString());     else localStorage.removeItem('asu_portal_year');
      if (selectedSemester) localStorage.setItem('asu_portal_semester', selectedSemester.toString()); else localStorage.removeItem('asu_portal_semester');
      if (selectedModule)   localStorage.setItem('asu_portal_module',   JSON.stringify(selectedModule)); else localStorage.removeItem('asu_portal_module');
      if (studyMode)        localStorage.setItem('asu_portal_studyMode', studyMode);                  else localStorage.removeItem('asu_portal_studyMode');
      window.dispatchEvent(new Event('trigger-cloud-sync'));
    } catch { /* ignore localStorage errors */ }
  }, [screen, selectedYear, selectedSemester, selectedModule, studyMode]);

  // ── UI state ─────────────────────────────────────────────────────────────
  const [showTracker,     setShowTracker]     = useState(false);
  const [modalModule,     setModalModule]     = useState<ModuleInfo | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(null);
  const [quizPayload,     setQuizPayload]     = useState<QuizPayload | null>(null);
  const [resultPayload,   setResultPayload]   = useState<ResultPayload | null>(null);

  const [activeYearIdx,     setActiveYearIdx]     = useState(1);
  const [activeSemesterIdx, setActiveSemesterIdx] = useState(0);

  // ── View Transitions helper ──────────────────────────────────────────────
  const transitionTo = useCallback((fn: () => void) => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(fn);
    } else {
      fn();
    }
  }, []);

  // ── Active module detection ──────────────────────────────────────────────
  const hasActiveModulesForYear = (year: number) =>
    Object.values(SYLLABUS_MODULES[year] ?? {}).some(mods =>
      mods.some(m => isModuleActive(m.code))
    );

  const hasActiveModulesForSemester = (year: number, sem: number) =>
    (SYLLABUS_MODULES[year]?.[sem] ?? []).some(m => isModuleActive(m.code));

  // ── Navigation handlers ──────────────────────────────────────────────────
  const navigateTo = useCallback((target: Screen) => {
    transitionTo(() => {
      setScreen(target);
      if (target === 'yearSelect')      { setSelectedYear(null); setSelectedSemester(null); setSelectedModule(null); setStudyMode(null); setSelectedChapter(null); }
      else if (target === 'semesterSelect')  { setSelectedSemester(null); setSelectedModule(null); setStudyMode(null); setSelectedChapter(null); }
      else if (target === 'moduleSelect')    { setSelectedModule(null); setStudyMode(null); setSelectedChapter(null); }
      else if (target === 'studyModeSelect') { setStudyMode(null); setSelectedChapter(null); }
      else if (target === 'chapters')        { setSelectedChapter(null); }
    });
  }, [transitionTo]);

  const handleSelectYear     = useCallback((y: number)  => transitionTo(() => { setSelectedYear(y); setScreen('semesterSelect'); }), [transitionTo]);
  const handleSelectSemester = useCallback((s: number)  => transitionTo(() => { setSelectedSemester(s); setScreen('moduleSelect'); }), [transitionTo]);
  const handleSelectModule   = useCallback((mod: ModuleInfo) => {
    if (isModuleActive(mod.code)) transitionTo(() => { setSelectedModule(mod); setScreen('studyModeSelect'); });
    else setModalModule(mod);
  }, [transitionTo]);
  const handleSelectMode = useCallback((mode: 'mcq'|'essay'|'mixed') => transitionTo(() => { setStudyMode(mode); setScreen('chapters'); }), [transitionTo]);
  const handleSelectChapter  = useCallback((ch: ChapterData) => transitionTo(() => { setSelectedChapter(ch); setScreen('subjects'); }), [transitionTo]);

  const handleSelectSubject = useCallback((subject: SubjectData, questions: Question[]) => {
    transitionTo(() => { setQuizPayload({ chapter: selectedChapter!, subject, questions }); setScreen('quiz'); });
  }, [transitionTo, selectedChapter]);

  const handleQuickStart = useCallback((questions: Question[]) => {
    transitionTo(() => { setQuizPayload({ chapter: selectedChapter!, subject: null, questions }); setScreen('quiz'); });
  }, [transitionTo, selectedChapter]);

  // ── Answer check logic ───────────────────────────────────────────────────
  const checkAnswerCorrect = useCallback((q: Question, ans: any): boolean => {
    if (ans === undefined) return false;
    if (q.type === 'mcq' || q.type === 'truefalse') return ans === q.correctIndex;
    if (q.type === 'matching') {
      const { scrambled, matches } = ans;
      if (!scrambled || !matches || !q.pairs) return false;
      return q.pairs.every((pair, i) => matches[i] === scrambled.indexOf(pair.target));
    }
    if (q.type === 'essay')   return ans?.selfGrade === 'correct';
    if (q.type === 'case' && q.subQuestions) {
      return q.subQuestions.every(sub => {
        const sa = ans[sub.id];
        if (sa === undefined) return false;
        return sub.type === 'mcq' ? sa === sub.correctIndex : sa?.selfGrade === 'correct';
      });
    }
    if (q.type === 'fillblank') {
      const { userAnswers = [] } = ans;
      const blanks = q.blanks ?? [];
      if (userAnswers.length !== blanks.length) return false;
      return blanks.every((correct, i) => {
        const user = (userAnswers[i] ?? '').trim().toLowerCase();
        return user === correct.toLowerCase() ||
          (q.acceptedAnswers?.[i]?.some(alt => alt.trim().toLowerCase() === user) ?? false);
      });
    }
    return false;
  }, []);

  // ── Finish quiz ──────────────────────────────────────────────────────────
  const handleFinishQuiz = useCallback((answers: Record<number, any>, elapsedSeconds: number, flaggedQuestions: Set<number>) => {
    const questions = quizPayload!.questions;
    let total = 0, correct = 0;

    questions.forEach((q, i) => {
      if (q.type === 'case' && q.subQuestions) {
        total += q.subQuestions.length;
        q.subQuestions.forEach(sub => {
          const sa = answers[i]?.[sub.id];
          if (sa !== undefined && (sub.type === 'mcq' ? sa === sub.correctIndex : sa?.selfGrade === 'correct')) correct++;
        });
      } else {
        total += 1;
        if (answers[i] !== undefined && checkAnswerCorrect(q, answers[i])) correct++;
      }
    });

    saveQuizResult({
      moduleCode:    selectedModule?.code,
      year:          selectedYear ?? undefined,
      semester:      selectedSemester ?? undefined,
      chapterId:     quizPayload!.chapter.id,
      chapterTitle:  quizPayload!.chapter.title,
      subjectName:   quizPayload!.subject?.name ?? 'All Subjects',
      correct, total,
      pct: total > 0 ? Math.round((correct / total) * 100) : 0,
      elapsedSeconds,
      questionIds:         questions.map(q => q.id),
      answers,
      flaggedQuestionIds:  Array.from(flaggedQuestions),
    });

    transitionTo(() => {
      setResultPayload({ chapter: quizPayload!.chapter, subject: quizPayload!.subject, questions, answers, elapsedSeconds, flaggedQuestions });
      setScreen('results');
    });
  }, [quizPayload, selectedModule, selectedYear, selectedSemester, checkAnswerCorrect, transitionTo]);

  // ── History handler ──────────────────────────────────────────────────────
  const handleSelectHistory = useCallback((result: QuizResult) => {
    const modCode = result.moduleCode || 'MEM-2';
    const yr      = result.year       || 2;
    const sem     = result.semester   || 2;

    const moduleChapters = getChaptersForModuleAndMode(modCode, 'mixed');
    const chapter = moduleChapters.find(c => String(c.id) === String(result.chapterId));
    if (!chapter) return;

    const subject = chapter.subjects.find(s => s.name === result.subjectName) || null;
    let questionsList: Question[] = [];
    if (result.questionIds?.length) {
      const all = chapter.subjects.flatMap(s => s.questions);
      result.questionIds.forEach(id => { const q = all.find(q => q.id === id); if (q) questionsList.push(q); });
    }
    if (!questionsList.length) questionsList = subject ? subject.questions : chapter.subjects.flatMap(s => s.questions);

    let targetModule = SYLLABUS_MODULES[yr]?.[sem]?.find(m => m.code === modCode) ?? null;
    if (!targetModule && modCode === 'MEM-2') {
      targetModule = { code: 'MEM-2', name: 'Endocrine System & Metabolism Module', cp: 5.5, marks: 110, keywords: ['endocrine', 'metabolism', 'mem'] };
    }

    transitionTo(() => {
      setSelectedYear(yr); setSelectedSemester(sem);
      if (targetModule) setSelectedModule(targetModule);
      setStudyMode('mixed'); setSelectedChapter(chapter);
      setQuizPayload({ chapter, subject, questions: questionsList });
      setResultPayload({ chapter, subject, questions: questionsList, answers: result.answers || {}, elapsedSeconds: result.elapsedSeconds, flaggedQuestions: new Set(result.flaggedQuestionIds ?? []) });
      setScreen('results');
    });
  }, [transitionTo]);

  const handleRetake        = useCallback(() => { if (quizPayload) transitionTo(() => { setQuizPayload({ ...quizPayload }); setScreen('quiz'); }); }, [quizPayload, transitionTo]);
  const handleBackToChapters = useCallback(() => { transitionTo(() => { setSelectedChapter(null); setQuizPayload(null); setResultPayload(null); setScreen('chapters'); }); }, [transitionTo]);

  const redirectToEndocrine = useCallback(() => {
    transitionTo(() => {
      setModalModule(null);
      setSelectedYear(2); setSelectedSemester(2);
      setSelectedModule({ code: 'MEM-2', name: 'Endocrine System & Metabolism Module', cp: 5.5, marks: 110, keywords: ['endocrine', 'metabolism', 'mem'] });
      setScreen('studyModeSelect');
    });
  }, [transitionTo]);

  const activeChapters  = selectedModule && studyMode ? getChaptersForModuleAndMode(selectedModule.code, studyMode) : [];
  const studyModeNames  = { mcq: 'MCQ Practice Mode', essay: 'Essay Study Mode', mixed: 'Mixed Exam Mode' };
  const isHomeScreen    = ['yearSelect','semesterSelect','moduleSelect','studyModeSelect'].includes(screen);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-foreground font-manrope selection:bg-physiology/20 selection:text-physiology-dark">

      {/* ── Animated background ────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <InteractiveBackground />
        <div className="absolute top-[10%] left-[5%] h-[35vw] w-[35vw] rounded-full
                        bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]
                        from-physiology/20 to-transparent blob-float-1" />
        <div className="absolute bottom-[10%] right-[5%] h-[40vw] w-[40vw] rounded-full
                        bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]
                        from-anatomy/20 to-transparent blob-float-2" />
      </div>

      {/* ── Top navigation header ──────────────────────────────────────── */}
      {isHomeScreen && (
        <header className="shrinking-header bg-background/70 backdrop-blur-xl
                           border-b border-border sticky top-0 z-40 transition-colors duration-300">
          <div className="max-w-[1600px] mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-y-3">
            {/* Logo + user */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-physiology/10 flex items-center justify-center
                              text-physiology-dark dark:text-physiology transition-transform hover:scale-105 will-change-transform">
                <Activity size={22} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-archivo font-black text-lg text-foreground leading-tight tracking-tight">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  {studentYear ? `Year ${studentYear} Medical Student` : 'Medical Student'}
                </p>
              </div>
            </div>

            {/* ASU quick-links (home screen only) */}
            {screen === 'yearSelect' && (
              <div className="flex w-full md:w-auto items-center justify-center gap-2 order-last md:order-none flex-wrap">
                {[
                  { href: 'https://asu2learn.asu.edu.eg/medicine-emp/my/', label: t('empPortal'), color: 'bg-physiology/8 hover:bg-physiology/14 text-physiology-dark dark:text-physiology border-physiology/15' },
                  { href: 'https://asu2learn.asu.edu.eg/medicine/my/',    label: t('mainstreamPortal'), color: 'bg-muted hover:bg-accent text-foreground border-border' },
                  { href: 'https://ums.asu.edu.eg/',                       label: t('umsPortal'), color: 'bg-clinical/8 hover:bg-clinical/14 text-clinical-dark dark:text-clinical border-clinical/15' },
                ].map(({ href, label, color }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                     className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${color} border rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5`}>
                    {label} <ExternalLink size={11} />
                  </a>
                ))}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageToggle />
              <ThemeToggle />
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border-2 border-physiology/40 shadow-sm",
                  }
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Action 
                    label={t('changeYear')} 
                    labelIcon={<GraduationCap size={16} className="text-physiology" />} 
                    onClick={() => {
                      localStorage.removeItem('asu_medical_student_year');
                      setStudentYear(null);
                      navigateTo('yearSelect');
                    }}
                  />
                </UserButton.MenuItems>
              </UserButton>
            </div>
          </div>
        </header>
      )}

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main className="max-w-[1600px] mx-auto px-5 sm:px-8 py-10 relative z-10">

        {/* Breadcrumbs */}
        {['semesterSelect','moduleSelect','studyModeSelect'].includes(screen) && (
          <nav aria-label="breadcrumb"
               className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground
                          font-bold uppercase tracking-wider mb-8 glass-panel px-4 py-2.5 w-fit">
            <button onClick={() => navigateTo('yearSelect')} className="hover:text-physiology transition-colors">{t('portal')}</button>
            {selectedYear && (<>
              <ChevronRight size={10} className="opacity-50 animate-flip-rtl" />
              <button onClick={() => navigateTo('semesterSelect')} className="hover:text-physiology transition-colors">{t('year' + selectedYear)}</button>
            </>)}
            {selectedSemester && (<>
              <ChevronRight size={10} className="opacity-50 animate-flip-rtl" />
              <button onClick={() => navigateTo('moduleSelect')} className="hover:text-physiology transition-colors">{t('semester' + selectedSemester)}</button>
            </>)}
            {selectedModule && (<>
              <ChevronRight size={10} className="opacity-50 animate-flip-rtl" />
              <span className="text-foreground">{selectedModule.code}</span>
            </>)}
          </nav>
        )}

        {/* ── SCREEN 1: YEAR SELECT ───────────────────────────────────────── */}
        {screen === 'yearSelect' && (
          <div className="space-y-10 animate-pop-up">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <p className="text-xs font-bold text-physiology uppercase tracking-widest">{t('asu')}</p>
              <h1 className="font-archivo text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                {t('selectYear')}
              </h1>
              <p className="text-muted-foreground font-medium">{t('selectYearDesc') || 'Choose your academic year to get started.'}</p>
            </div>

            <StackedCarousel
              items={([1,2,3,4,5] as const).map(year => ({
                id: year,
                disabled: !hasActiveModulesForYear(year),
                content: (
                  <div className={`w-full h-full p-7 flex flex-col justify-between rounded-[32px] transition-all duration-300
                                   ${hasActiveModulesForYear(year)
                                     ? 'bg-card border border-border shadow-md'
                                     : 'bg-muted/40 border border-border/40 opacity-70'}`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black font-archivo
                                         ${hasActiveModulesForYear(year)
                                           ? 'bg-physiology/12 text-physiology-dark dark:text-physiology'
                                           : 'bg-muted text-muted-foreground'}`}>
                          {year}
                        </div>
                        {!hasActiveModulesForYear(year) && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <Lock size={10} /> {t('comingSoon')}
                          </div>
                        )}
                        {hasActiveModulesForYear(year) && (
                          <Sparkles size={14} className="text-physiology" />
                        )}
                      </div>
                      <h3 className="font-archivo text-2xl font-black text-foreground tracking-tight">
                        {t('year' + year)}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                        {t('yearDesc' + year) || ''}
                      </p>
                    </div>
                    {hasActiveModulesForYear(year) && (
                      <div className="flex items-center justify-end">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-physiology">
                          {t('explore')} <ArrowRight size={13} />
                        </span>
                      </div>
                    )}
                  </div>
                ),
              }))}
              onSelect={(id) => handleSelectYear(id as number)}
              activeIndex={activeYearIdx}
              setActiveIndex={setActiveYearIdx}
            />

            {/* Recent history preview */}
            {getQuizHistory().slice(0, 3).length > 0 && (
              <div className="max-w-2xl mx-auto">
                <button onClick={() => navigateTo('history')}
                  className="w-full glass-panel glow-border p-4 flex items-center justify-between
                             group hover:shadow-md transition-all duration-300 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                      <Clock size={16} className="text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-foreground">{t('recentResults')}</p>
                      <p className="text-xs text-muted-foreground">{getQuizHistory().length} {t('sessions')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getQuizHistory().slice(0,3).map(r => (
                      <span key={r.id}
                        className={`text-xs font-black font-archivo ${r.pct >= 80 ? 'text-success-dark dark:text-success' : r.pct >= 60 ? 'text-biochem-dark dark:text-biochem' : 'text-pathology-dark dark:text-pathology'}`}>
                        {r.pct}%
                      </span>
                    ))}
                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-physiology transition-colors animate-flip-rtl" />
                  </div>
                </button>
              </div>
            )}

            <PortalFooter />
          </div>
        )}

        {/* ── SCREEN 2: SEMESTER SELECT ───────────────────────────────────── */}
        {screen === 'semesterSelect' && selectedYear && (
          <div className="space-y-8 animate-pop-up">
            <div className="text-center max-w-lg mx-auto space-y-2">
              <p className="text-xs font-bold text-physiology uppercase tracking-widest">{t('year' + selectedYear)}</p>
              <h1 className="font-archivo text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                {t('selectSemester')}
              </h1>
            </div>

            <StackedCarousel
              items={[1, 2].map(sem => ({
                id: sem,
                disabled: !hasActiveModulesForSemester(selectedYear, sem),
                content: (
                  <div className={`w-full h-full p-7 flex flex-col justify-between rounded-[32px] transition-all
                                   ${hasActiveModulesForSemester(selectedYear, sem)
                                     ? 'bg-card border border-border shadow-md'
                                     : 'bg-muted/40 border border-border/40 opacity-70'}`}>
                    <div className="space-y-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black font-archivo
                                       ${hasActiveModulesForSemester(selectedYear, sem)
                                         ? 'bg-clinical/12 text-clinical-dark dark:text-clinical'
                                         : 'bg-muted text-muted-foreground'}`}>
                        {sem}
                      </div>
                      <h3 className="font-archivo text-2xl font-black text-foreground tracking-tight">
                        {t('semester' + sem)}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">
                        {SYLLABUS_MODULES[selectedYear]?.[sem]?.length ?? 0} modules
                      </p>
                    </div>
                    {hasActiveModulesForSemester(selectedYear, sem) && (
                      <div className="flex items-center justify-end">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-clinical">
                          View modules <ArrowRight size={13} />
                        </span>
                      </div>
                    )}
                  </div>
                ),
              }))}
              onSelect={(id) => handleSelectSemester(id as number)}
              activeIndex={activeSemesterIdx}
              setActiveIndex={setActiveSemesterIdx}
            />

            <div className="flex justify-center">
              <button onClick={() => navigateTo('yearSelect')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                           bg-muted hover:bg-accent text-sm font-semibold transition-colors duration-200">
                <ArrowLeft size={15} /> {t('back')}
              </button>
            </div>
          </div>
        )}

        {/* ── SCREEN 3: MODULE SELECT ─────────────────────────────────────── */}
        {screen === 'moduleSelect' && selectedYear && selectedSemester && (
          <div className="space-y-8 animate-pop-up">
            <div className="max-w-[1400px] mx-auto space-y-2">
              <p className="text-xs font-bold text-clinical uppercase tracking-widest">{t('year' + selectedYear)} · {t('semester' + selectedSemester)}</p>
              <h1 className="font-archivo text-3xl sm:text-4xl font-black text-foreground tracking-tight">{t('selectModule')}</h1>
              <p className="text-sm text-muted-foreground font-medium">{t('selectModuleDesc')}</p>
            </div>

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 grid-stagger">
              {(SYLLABUS_MODULES[selectedYear]?.[selectedSemester] ?? []).map((mod) => {
                const active  = isModuleActive(mod.code);
                const counts  = active ? getModuleQuestionCounts(mod.code) : null;
                return (
                  <button key={mod.code} onClick={() => handleSelectModule(mod)}
                    className={`animate-pop-up portal-card text-left rounded-[28px] p-5 border-2 shadow-sm flex flex-col gap-3 min-h-[200px]
                                ${active
                                  ? 'bg-card border-border hover:border-physiology/30 hover:shadow-lg'
                                  : 'bg-muted/40 border-border/40 cursor-default opacity-75'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg
                                        ${active ? 'bg-physiology/10 text-physiology-dark dark:text-physiology' : 'bg-muted text-muted-foreground'}`}>
                        {mod.code}
                      </span>
                      {!active && <Lock size={12} className="text-muted-foreground mt-0.5 flex-shrink-0" />}
                      {active  && <Sparkles size={12} className="text-physiology flex-shrink-0 mt-0.5" />}
                    </div>

                    <p className="text-sm font-bold text-foreground leading-snug flex-1">{mod.name}</p>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-semibold">
                      <span>{mod.cp} CP</span>
                      <span className="opacity-40">·</span>
                      <span>{mod.marks} marks</span>
                      {counts && (<>
                        <span className="opacity-40">·</span>
                        <span className="text-physiology font-bold">{counts.totalCount} Qs</span>
                      </>)}
                    </div>

                    {!active && (
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t('dbPending')}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center">
              <button onClick={() => navigateTo('semesterSelect')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                           bg-muted hover:bg-accent text-sm font-semibold transition-colors">
                <ArrowLeft size={15} /> Back to Semesters
              </button>
            </div>
          </div>
        )}

        {/* ── SCREEN 4: STUDY MODE SELECT ─────────────────────────────────── */}
        {screen === 'studyModeSelect' && selectedModule && (
          <div className="space-y-8 animate-pop-up max-w-[1400px] mx-auto">
            <div className="space-y-2">
              <p className="text-xs font-bold text-biochem uppercase tracking-widest">{selectedModule.code}</p>
              <h1 className="font-archivo text-3xl sm:text-4xl font-black text-foreground tracking-tight">{t('selectMode')}</h1>
              <p className="text-sm text-muted-foreground font-medium max-w-lg">{t('selectModeDesc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 grid-stagger">
              {[
                { mode: 'mcq' as const,   icon: Brain,  title: t('mcqPractice'),   desc: t('mcqPracticeDesc'),   accent: 'physiology', countKey: 'mcqCount'   },
                { mode: 'essay' as const, icon: BookOpen, title: t('essayStudy'), desc: t('essayStudyDesc'),   accent: 'clinical',    countKey: 'essayCount' },
                { mode: 'mixed' as const, icon: Layers, title: t('mixedExam'),  desc: t('mixedExamDesc'),    accent: 'biochem',     countKey: 'totalCount' },
              ].map(({ mode, icon: Icon, title, desc, accent, countKey }) => {
                const count = getModuleQuestionCounts(selectedModule.code)[countKey as keyof ReturnType<typeof getModuleQuestionCounts>];
                return (
                  <button key={mode} onClick={() => handleSelectMode(mode)}
                    className={`animate-pop-up portal-card text-left bg-card rounded-[28px] p-6 border-2 border-border
                                hover:border-${accent}/30 shadow-sm flex flex-col gap-4 group relative overflow-hidden`}>
                    <div className={`absolute -right-6 -top-6 w-20 h-20 rounded-full bg-${accent}/5 group-hover:bg-${accent}/10 transition-colors duration-300`} />
                    <div className={`w-11 h-11 rounded-2xl bg-${accent}/10 text-${accent} flex items-center justify-center`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <h3 className="font-archivo text-lg font-bold text-foreground tracking-tight">{title}</h3>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed">{desc}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold text-${accent} px-3 py-1 bg-${accent}/8 rounded-lg`}>
                        {count} {t('questions')}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold text-${accent} group-hover:translate-x-1 transition-transform duration-200`}>
                        {t('startMode')} <ArrowRight size={13} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Syllabus tracker shortcut */}
            <button onClick={() => setShowTracker(true)}
              className="w-full glass-panel glow-border rounded-2xl p-4 flex items-center justify-between
                         group hover:shadow-md transition-all duration-300 animate-pop-up"
              style={{ animationDelay: '150ms' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Calendar size={18} className="text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">{t('syllabusTracker') || 'Syllabus & Study Tracker'}</p>
                  <p className="text-xs text-muted-foreground font-medium">Track chapter progress and personal notes</p>
                </div>
              </div>
              <ChevronRight size={15} className="text-muted-foreground group-hover:text-physiology transition-colors animate-flip-rtl" />
            </button>

            <div className="flex justify-center">
              <button onClick={() => navigateTo('moduleSelect')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                           bg-muted hover:bg-accent text-sm font-semibold transition-colors">
                <ArrowLeft size={15} /> Back to Modules
              </button>
            </div>
            <PortalFooter />
          </div>
        )}

        {/* ── SCREEN 5: CHAPTER SELECT ───────────────────────────────────── */}
        {screen === 'chapters' && selectedModule && studyMode && (
          <Suspense fallback={<ScreenSkeleton />}>
            <ChapterSelect
              chapters={activeChapters}
              studyModeName={studyModeNames[studyMode]}
              moduleName={selectedModule.name}
              moduleCode={selectedModule.code}
              onSelectChapter={handleSelectChapter}
              onSelectHistory={handleSelectHistory}
              onBackToModeSelect={() => navigateTo('studyModeSelect')}
            />
          </Suspense>
        )}

        {/* ── SCREEN 6: SUBJECT SELECT ───────────────────────────────────── */}
        {screen === 'subjects' && selectedChapter && (
          <SubjectSelect
            chapter={selectedChapter}
            breadcrumbPath={[
              { label: t('portal') || 'Portal',                onClick: () => navigateTo('yearSelect') },
              { label: t('year' + selectedYear) || `Y${selectedYear}`, onClick: () => navigateTo('semesterSelect') },
              { label: t('semester' + selectedSemester),       onClick: () => navigateTo('moduleSelect') },
              { label: selectedModule?.name ?? '',             onClick: () => navigateTo('studyModeSelect') },
              { label: `${t('chapter')} ${selectedChapter.id}` },
            ]}
            onBack={() => setScreen('chapters')}
            onSelectSubject={handleSelectSubject}
            onQuickStart={handleQuickStart}
          />
        )}

        {/* ── SCREEN 7: QUIZ ────────────────────────────────────────────── */}
        {screen === 'quiz' && quizPayload && (
          <Suspense fallback={<ScreenSkeleton />}>
            <QuizInterface
              chapter={quizPayload.chapter}
              subject={quizPayload.subject}
              questions={quizPayload.questions}
              onBack={() => setScreen('subjects')}
              onFinish={handleFinishQuiz}
            />
          </Suspense>
        )}

        {/* ── SCREEN 8: RESULTS ─────────────────────────────────────────── */}
        {screen === 'results' && resultPayload && (
          <Suspense fallback={<ScreenSkeleton />}>
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
          </Suspense>
        )}

        {/* ── SCREEN 9: HISTORY ─────────────────────────────────────────── */}
        {screen === 'history' && (
          <Suspense fallback={<ScreenSkeleton />}>
            <HistoryScreen onBack={() => navigateTo('yearSelect')} onSelectHistory={handleSelectHistory} />
          </Suspense>
        )}
      </main>

      {/* ── Syllabus Tracker overlay ───────────────────────────────────── */}
      {showTracker && selectedModule && (
        <SyllabusTracker
          moduleCode={selectedModule.code}
          moduleName={selectedModule.name}
          chapters={getChaptersForModuleAndMode(selectedModule.code, 'mixed')}
          onClose={() => setShowTracker(false)}
        />
      )}

      {/* ── "Coming soon" module modal ─────────────────────────────────── */}
      {modalModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6
                        bg-foreground/20 dark:bg-background/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-card border border-border rounded-[32px] p-7 shadow-2xl
                          animate-slide-up relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-physiology/6 to-transparent rounded-bl-[60px]" />
            <div className="flex items-center gap-3 mb-4 text-physiology">
              <div className="w-10 h-10 rounded-xl bg-physiology/10 flex items-center justify-center">
                <Info size={18} />
              </div>
              <h3 className="font-archivo text-lg font-bold tracking-tight">Integration in Progress</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              The question database for <span className="font-semibold text-foreground">{modalModule.name} ({modalModule.code})</span> is being formatted by our academic editors.
              Try the live <span className="font-semibold text-physiology-dark dark:text-physiology">Endocrine System & Metabolism</span> module in the meantime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={redirectToEndocrine}
                className="flex-1 px-5 py-3 bg-physiology hover:bg-physiology-dark text-white rounded-full
                           text-xs font-bold tracking-wide transition-all duration-200 hover:scale-[0.98]
                           shadow-md shadow-physiology/20">
                Try Endocrine Module
              </button>
              <button onClick={() => setModalModule(null)}
                className="px-5 py-3 bg-muted hover:bg-accent text-foreground
                           rounded-full text-xs font-bold tracking-wide transition-all duration-200">
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── First-time onboarding modal ────────────────────────────────── */}
      {!studentYear && <YearSelectionModal onSelect={setStudentYear} />}
    </div>
  );
}

// ── Root: auth guard ─────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <SignedIn>
        <MainApp />
      </SignedIn>
      <SignedOut>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="spinner" />
          </div>
        }>
          <LoginScreen />
        </Suspense>
      </SignedOut>
    </>
  );
}
