import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Layers,
  BookOpen,
  CalendarDays,
  Clock,
  FileCheck2,
  Play,
  Sparkles,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { PortalShell } from '../app/components/PortalShell';
import { getModuleQuestionCounts, SYLLABUS_MODULES, type ModuleInfo } from '../app/data';
import { useOptionalLearning } from '../app/learning/LearningProvider';
import { pageVariants } from '../app/lib/motion';
import { MockExamConfigModal } from '../app/components/mock/MockExamConfigModal';
import { MockExamRunner } from '../app/components/mock/MockExamRunner';
import { MockExamResultsView } from '../app/components/mock/MockExamResultsView';
import { generateMockExamQuestions } from '../app/utils/mockExamGenerator';
import type { MockExamConfig, MockExamQuestion, MockExamResult } from '../app/types/mockExam';

interface StudyModeProps {
  userButton?: React.ReactNode;
  onStartStudyMode?: (mode: 'mcq' | 'essay' | 'mixed', moduleCode: string) => void;
  onOpenSyllabus?: (moduleCode: string) => void;
}

function lookupModule(mCode: string): (ModuleInfo & { year: number; semester: number }) | null {
  const code = mCode.toUpperCase();
  for (const yearStr of Object.keys(SYLLABUS_MODULES)) {
    const year = Number(yearStr);
    const semesters = SYLLABUS_MODULES[year];
    for (const semStr of Object.keys(semesters)) {
      const sem = Number(semStr);
      const match = semesters[sem].find((m) => m.code.toUpperCase() === code);
      if (match) return { ...match, year, semester: sem };
    }
  }
  return null;
}

export default function StudyMode({ userButton, onStartStudyMode, onOpenSyllabus }: StudyModeProps) {
  const navigate = useNavigate();
  const { code, yearId } = useParams<{ code: string; yearId: string }>();
  const moduleCode = (code || 'MEM-2').toUpperCase();

  const parsedYear = useMemo(() => {
    if (yearId) return yearId;
    const match = moduleCode.match(/-(\d+)/);
    return match ? match[1] : '2';
  }, [yearId, moduleCode]);

  const moduleInfo = useMemo(() => lookupModule(moduleCode), [moduleCode]);
  const counts = useMemo(() => getModuleQuestionCounts(moduleCode), [moduleCode]);

  // Learning progress analytics
  const learning = useOptionalLearning();
  const { solvedCount, accuracyPct, masteryPct } = useMemo(() => {
    if (!learning?.data?.entries) return { solvedCount: 0, accuracyPct: 0, masteryPct: 0 };
    const entries = learning.data.entries.filter(
      (e) => e.moduleCode.toUpperCase() === moduleCode.toUpperCase()
    );
    const uniqueQuestions = new Set(entries.map((e) => e.questionId));
    const solved = uniqueQuestions.size;
    const correctEntries = entries.filter((e) => e.correct || e.everCorrect);
    const uniqueCorrect = new Set(correctEntries.map((e) => e.questionId));
    const acc = solved > 0 ? Math.round((uniqueCorrect.size / solved) * 100) : 0;
    const total = counts.mcqCount > 0 ? counts.mcqCount : (counts.totalCount || 1);
    const mastery = Math.min(100, Math.round((uniqueCorrect.size / total) * 100));
    return { solvedCount: solved, accuracyPct: acc, masteryPct: mastery };
  }, [learning?.data?.entries, moduleCode, counts]);

  // Mock Exam States
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [examView, setExamView] = useState<'hub' | 'running' | 'results'>('hub');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [activeConfig, setActiveConfig] = useState<MockExamConfig | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<MockExamQuestion[]>([]);
  const [examResult, setExamResult] = useState<MockExamResult | null>(null);

  const handleStartMode = (e: React.MouseEvent, type: 'mcq' | 'essay' | 'mixed') => {
    e.preventDefault();
    if (onStartStudyMode) {
      onStartStudyMode(type, moduleCode);
    } else {
      navigate(`/year-${parsedYear}/${moduleCode.toLowerCase()}/${type}`);
    }
  };

  const handleOpenTracker = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenSyllabus) {
      onOpenSyllabus(moduleCode);
    } else {
      navigate(`/year-${parsedYear}/${moduleCode.toLowerCase()}/tracker`);
    }
  };

  // Launch fresh Mock Exam from config
  const handleLaunchMockExam = async (config: MockExamConfig) => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const generated = await generateMockExamQuestions(config);
      if (generated.length === 0) {
        setGenerationError('No questions found for the selected configuration.');
        setIsGenerating(false);
        return;
      }
      setActiveConfig(config);
      setActiveQuestions(generated);
      setIsConfigOpen(false);
      setExamView('running');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate mock exam.';
      setGenerationError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Retake exam with same configuration
  const handleRetakeExam = async () => {
    if (!activeConfig) return;
    await handleLaunchMockExam(activeConfig);
  };

  // Launch a focused retake of missed questions
  const handleRetryMissed = (missed: MockExamQuestion[]) => {
    if (missed.length === 0) return;
    const retryQuestions: MockExamQuestion[] = missed.map((q) => ({
      ...q,
      selectedOption: undefined,
      isFlagged: false,
      timeSpentSeconds: 0,
    }));
    const retryConfig: MockExamConfig = {
      moduleCode,
      preset: 'custom',
      questionCount: retryQuestions.length,
      durationMinutes: Math.max(5, Math.ceil(retryQuestions.length * 1.25)),
      mode: activeConfig?.mode || 'official',
    };
    setActiveConfig(retryConfig);
    setActiveQuestions(retryQuestions);
    setExamView('running');
  };

  // If inside an active mock exam simulation
  if (examView === 'running' && activeConfig && activeQuestions.length > 0) {
    return (
      <MockExamRunner
        questions={activeQuestions}
        config={activeConfig}
        onComplete={(result) => {
          setExamResult(result);
          setExamView('results');
        }}
        onExit={() => setExamView('hub')}
      />
    );
  }

  // If viewing post-exam analytics report
  if (examView === 'results' && examResult) {
    return (
      <MockExamResultsView
        result={examResult}
        onRetryMissed={handleRetryMissed}
        onRetakeExam={handleRetakeExam}
        onBackToHub={() => setExamView('hub')}
      />
    );
  }

  const CRUMBS = [
    { label: 'Portal', onClick: () => navigate('/') },
    { label: `Year ${parsedYear}`, onClick: () => navigate(`/year-${parsedYear}`) },
    { label: moduleCode },
  ];

  return (
    <PortalShell crumbs={CRUMBS} userButton={userButton}>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="w-full pb-20"
      >
        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* ── TOP BREADCRUMB / MODULE META ───────────────────────────── */}
          <section className="pt-10 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {moduleCode}
                </span>
                {moduleInfo && (
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Year {moduleInfo.year} • Semester {moduleInfo.semester} • {moduleInfo.cp} CP ({moduleInfo.marks} Marks)
                  </span>
                )}
              </div>

              <button
                onClick={() => navigate(`/year-${parsedYear}`)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5"
              >
                <ArrowLeft size={14} />
                Back to Modules
              </button>
            </div>

            <div className="mt-4">
              <h1 className="font-heading font-black tracking-tight text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-50">
                {moduleInfo?.name || moduleCode}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                Comprehensive Ain Shams medical question bank, official continuous assessment papers, and faculty-timed mock exam simulator.
              </p>
            </div>
          </section>

          {/* ── GENERATION ERROR ALERT ─────────────────────────────────── */}
          {generationError && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              <span>{generationError}</span>
            </div>
          )}

          {/* ── HERO COMMAND CARD (INSTANT LAUNCH & MASTERY) ──────────── */}
          <section className="mb-8">
            <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#151517]/80 backdrop-blur-xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
              {/* Subtle ambient background glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Left: Mastery Ring & Solved Stats */}
                <div className="flex items-center gap-5 sm:gap-6">
                  {/* Circular SVG Ring */}
                  <div className="relative flex items-center justify-center shrink-0 w-20 h-20 sm:w-24 sm:h-24">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="currentColor"
                        strokeWidth="7"
                        className="text-zinc-100 dark:text-zinc-800"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#10b981"
                        strokeWidth="7"
                        strokeDasharray={238.76}
                        strokeDashoffset={238.76 - (238.76 * masteryPct) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-heading font-black text-lg sm:text-xl text-zinc-900 dark:text-zinc-50 leading-none">
                        {masteryPct}%
                      </span>
                      <span className="text-[9px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mt-0.5">
                        Mastery
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-lg sm:text-xl text-zinc-900 dark:text-zinc-100">
                        Module Progress
                      </span>
                      {masteryPct >= 100 && (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {solvedCount.toLocaleString()} of {counts.mcqCount.toLocaleString()} MCQs solved
                    </p>
                    <div className="mt-2.5 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        {accuracyPct}% Accuracy
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">•</span>
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {counts.totalCount.toLocaleString()} Total Questions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Instant Launch CTAs */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={(e) => handleStartMode(e, 'mcq')}
                    className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-heading font-bold text-sm px-6 py-3.5 shadow-sm hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-all min-h-[44px] cursor-pointer"
                  >
                    <Play size={16} className="fill-white" />
                    <span>{solvedCount > 0 ? 'Resume Chapter Practice' : 'Start Practice'}</span>
                  </button>

                  <button
                    onClick={() => setIsConfigOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 font-heading font-bold text-sm px-5 py-3.5 transition-all min-h-[44px] cursor-pointer"
                  >
                    <Clock size={16} className="text-blue-500" />
                    <span>Timed Mock Exam</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── BENTO ACTION GRID ─────────────────────────────────────── */}
          <section className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg text-zinc-900 dark:text-zinc-100">
                Study Modes &amp; Curricular Tools
              </h2>
              <span className="text-xs font-medium text-zinc-400">
                Select an activity
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
              {/* Tile 1: Curriculum Chapters & Topics */}
              <div
                onClick={(e) => handleStartMode(e, 'mcq')}
                className="group relative flex flex-col justify-between rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#141416]/70 backdrop-blur-xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 cursor-pointer min-h-[190px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                      <Layers size={22} />
                    </span>
                    <span className="rounded-full px-3 py-1 text-[11px] font-bold tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {counts.mcqCount.toLocaleString()} MCQs
                    </span>
                  </div>

                  <h3 className="mt-5 font-heading font-black text-xl text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Curriculum Chapters &amp; Topics
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Browse question banks categorized by chapter and academic discipline. Instant feedback with faculty rationale.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/[0.05]">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                    Browse Chapters &amp; Solve
                  </span>
                  <ChevronRight size={16} className="text-zinc-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* Tile 2: Timed Mock Exam (Faculty Simulator) */}
              <div
                onClick={() => setIsConfigOpen(true)}
                className="group relative flex flex-col justify-between rounded-3xl border border-blue-500/20 dark:border-blue-500/30 bg-gradient-to-br from-blue-500/[0.04] to-indigo-500/[0.08] dark:from-blue-500/[0.07] dark:to-indigo-500/[0.12] backdrop-blur-xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 cursor-pointer min-h-[190px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                      <Clock size={22} />
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/25">
                      <Sparkles size={11} />
                      Ain Shams Simulation
                    </span>
                  </div>

                  <h3 className="mt-5 font-heading font-black text-xl text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Timed Mock Exam Simulator
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Test under realistic time constraints. Features Ain Shams grading curve (A+ to F), pace analytics, and faculty discipline radar.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-blue-200/40 dark:border-blue-400/10">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                    20 • 40 • 80 Qs Presets
                  </span>
                  <ChevronRight size={16} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Tile 3: Official Past Exams & Recalls */}
              <div
                onClick={(e) => handleStartMode(e, 'mixed')}
                className="group relative flex flex-col justify-between rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#141416]/70 backdrop-blur-xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 cursor-pointer min-h-[190px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                      <FileCheck2 size={22} />
                    </span>
                    <span className="rounded-full px-3 py-1 text-[11px] font-bold tracking-wide bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      Official Recalls
                    </span>
                  </div>

                  <h3 className="mt-5 font-heading font-black text-xl text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Past Papers &amp; Continuous Assessments
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Practice verified past exam questions, Midterms, CA1, CA2, and Final examination recalls curated for this module.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/[0.05]">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:underline">
                    Practice Past Papers
                  </span>
                  <ChevronRight size={16} className="text-zinc-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* Tile 4: Syllabus & Lecture Tracker */}
              <div
                onClick={handleOpenTracker}
                className="group relative flex flex-col justify-between rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#141416]/70 backdrop-blur-xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 cursor-pointer min-h-[190px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                      <CalendarDays size={22} />
                    </span>
                    <span className="rounded-full px-3 py-1 text-[11px] font-bold tracking-wide bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Syllabus
                    </span>
                  </div>

                  <h3 className="mt-5 font-heading font-black text-xl text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Syllabus &amp; Lecture Tracker
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Check off attended lectures, track topic mastery, write high-yield personal study notes, and organize revision timelines.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/[0.05]">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:underline">
                    Open Study Tracker
                  </span>
                  <ChevronRight size={16} className="text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* Adaptive Tile 5: Case Essays & Short Answers — Rendered ONLY when essays exist */}
              {counts.essayCount > 0 && (
                <div
                  onClick={(e) => handleStartMode(e, 'essay')}
                  className="group relative flex flex-col justify-between md:col-span-2 rounded-3xl border border-rose-500/20 dark:border-rose-500/30 bg-rose-500/[0.03] dark:bg-rose-500/[0.06] backdrop-blur-xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/50 cursor-pointer min-h-[190px]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
                        <BookOpen size={22} />
                      </span>
                      <span className="rounded-full px-3 py-1 text-[11px] font-bold tracking-wide bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25">
                        {counts.essayCount.toLocaleString()} Written Essays
                      </span>
                    </div>

                    <h3 className="mt-5 font-heading font-black text-xl text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      Case-Based Essays &amp; Short Answer Questions
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-3xl">
                      Practice essay cases and diagnostic scenarios with official Ain Shams model answers, clinical rationale, and grading rubrics.
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-rose-200/40 dark:border-rose-400/10">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:underline">
                      Start Essay Study Mode
                    </span>
                    <ChevronRight size={16} className="text-rose-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── FOOTER / NAVIGATION ───────────────────────────────────── */}
          <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-200/70 dark:border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <GraduationCap size={16} className="text-emerald-500" />
              <span>Ain Shams University Faculty of Medicine • Unified Curricular Hub</span>
            </div>

            <button
              onClick={() => navigate(`/year-${parsedYear}`)}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 px-5 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-zinc-50/50 dark:bg-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer min-h-[44px]"
            >
              <ArrowLeft size={14} />
              Return to Year {parsedYear} Modules
            </button>
          </section>
        </main>
      </motion.div>

      {/* ── MOCK EXAM CONFIGURATION MODAL ─────────────────────────── */}
      <MockExamConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onStartExam={handleLaunchMockExam}
        moduleCode={moduleCode}
        moduleName={moduleInfo?.name}
        totalAvailableQuestions={counts.mcqCount}
      />

      {/* ── EXAM GENERATION SPINNER OVERLAY ───────────────────────── */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md text-white">
          <div className="p-8 rounded-3xl bg-zinc-900/90 border border-white/10 flex flex-col items-center max-w-sm text-center shadow-2xl">
            <Loader2 size={36} className="animate-spin text-emerald-500 mb-4" />
            <h3 className="font-heading font-bold text-lg">Generating Mock Exam</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Curating balanced proportional questions across faculty disciplines...
            </p>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
