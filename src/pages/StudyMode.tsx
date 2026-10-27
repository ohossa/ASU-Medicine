import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, Activity, BookOpen, Layers, CalendarDays, ChevronRight, ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { PortalShell } from '../app/components/PortalShell';
import { getModuleQuestionCounts } from '../app/data';
import { motion } from 'motion/react';
import { pageVariants } from '../app/lib/motion';

/* ────────────────────────────────────────────────
   MODE DEFINITIONS & APPLE DESIGN SYSTEM TOKENS
   ──────────────────────────────────────────────── */
type ModeType = 'mcq' | 'essay' | 'mixed';

interface ModeConfig {
  type: ModeType;
  title: string;
  desc: string;
  cta: string;
  icon: LucideIcon;
  accent: string;
  badgeBg: string;
  badgeText: string;
  btnClass: string;
}

const MODES: ModeConfig[] = [
  {
    type: 'mcq',
    title: 'MCQ Practice Mode',
    desc: 'Loads only multiple-choice, true/false, and fill-in-the-blank questions for rapid recall.',
    cta: 'Start MCQ Practice',
    icon: Activity,
    accent: '#22c55e',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    btnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow-[0_8px_20px_rgba(34,197,94,0.3)] focus-visible:ring-emerald-500',
  },
  {
    type: 'essay',
    title: 'Essay Study Mode',
    desc: 'Loads written/short answer and case-based essay questions with detailed model answers.',
    cta: 'Start Essay Study',
    icon: BookOpen,
    accent: '#ef4444',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-600 dark:text-rose-400',
    btnClass: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm hover:shadow-[0_8px_20px_rgba(239,68,68,0.3)] focus-visible:ring-rose-500',
  },
  {
    type: 'mixed',
    title: 'Mixed Exam Mode',
    desc: 'Combines MCQ and Essay databases to generate a comprehensive, hybrid practice exam.',
    cta: 'Generate Mixed Exam',
    icon: Layers,
    accent: '#3b82f6',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-600 dark:text-blue-400',
    btnClass: 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow-[0_8px_20px_rgba(59,130,246,0.3)] focus-visible:ring-blue-500',
  },
];

export interface StudyModeProps {
  userButton?: React.ReactNode;
  onStartStudyMode?: (mode: ModeType, moduleCode: string) => void;
  onOpenSyllabus?: (moduleCode: string) => void;
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

  const counts = useMemo(() => {
    return getModuleQuestionCounts(moduleCode);
  }, [moduleCode]);

  // Adaptively filter out Essay and Mixed modes if the module contains 0 essays
  const visibleModes = useMemo(() => {
    return MODES.filter((mode) => {
      if (mode.type === 'essay' || mode.type === 'mixed') {
        return counts.essayCount > 0;
      }
      return true;
    });
  }, [counts.essayCount]);

  const getModeCount = (type: ModeType) => {
    if (type === 'mcq') return counts.mcqCount;
    if (type === 'essay') return counts.essayCount;
    return counts.totalCount;
  };

  const handleStartMode = (type: ModeType) => {
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
        className="w-full"
      >
        <main className="mx-auto max-w-6xl px-5 lg:px-8">
          {/* ── HEADER ───────────────────────────────────────────── */}
          <section className="pt-14 pb-10 text-center lg:pt-20">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-wide bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              Module Loaded: {moduleCode}
            </span>
            <h1 className="mt-5 font-heading font-black tracking-[-0.03em] text-4xl lg:text-[48px] text-zinc-900 dark:text-zinc-50">
              Select Study Mode
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
              {counts.essayCount > 0
                ? 'Choose the question formats you wish to practice. You can focus on MCQs, essays, or a mixed exam.'
                : 'Practice multiple-choice, true/false, and clinical questions from the verified faculty question bank.'}
            </p>
          </section>

          {/* ── MODE CARDS (Apple Liquid Glass with Full-Width Capsule Buttons) ── */}
          <section
            className={`grid gap-6 ${
              visibleModes.length === 1
                ? 'max-w-xl mx-auto grid-cols-1'
                : 'grid-cols-1 md:grid-cols-3'
            }`}
          >
            {visibleModes.map((mode) => {
              const count = getModeCount(mode.type);
              const Icon = mode.icon;

              return (
                <div
                  key={mode.type}
                  className="group relative flex flex-col justify-between rounded-3xl border p-6 sm:p-7
                             bg-white/85 dark:bg-[#141414]/85 backdrop-blur-xl
                             border-zinc-200/80 dark:border-white/[0.08]
                             shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                             hover:border-zinc-300 dark:hover:border-white/20
                             transition-all duration-300"
                >
                  {/* Top content */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`grid h-12 w-12 place-items-center rounded-2xl ${mode.badgeBg} ${mode.badgeText}`}
                      >
                        <Icon size={24} />
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-white/[0.06]">
                        {count.toLocaleString()} Qs
                      </span>
                    </div>

                    <h2 className="mt-5 font-heading font-black text-xl text-zinc-900 dark:text-zinc-50">
                      {mode.title}
                    </h2>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {mode.desc}
                    </p>
                  </div>

                  {/* Bottom: Stat pill & Full-width Apple capsule CTA button */}
                  <div className="mt-8 pt-5 border-t border-zinc-100 dark:border-white/[0.06]">
                    <div className="mb-4 flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      <span>Available Questions</span>
                      <span className="font-heading font-bold text-zinc-900 dark:text-zinc-200">
                        {count.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleStartMode(mode.type)}
                      className={`min-h-[48px] w-full flex items-center justify-center gap-2 rounded-2xl
                                 font-heading font-bold text-sm tracking-wide transition-all duration-200
                                 cursor-pointer select-none active:scale-[0.98]
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                                 dark:focus-visible:ring-offset-zinc-900 ${mode.btnClass}`}
                    >
                      <span>{mode.cta}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </section>

          {/* ── SYLLABUS & STUDY TRACKER BAR ────────────────────── */}
          <button
            onClick={handleOpenTracker}
            className="w-full text-left cursor-pointer bg-transparent border-0 p-0 block mt-8"
          >
            <div
              className="group flex items-center justify-between rounded-3xl border p-5
                         bg-white/80 dark:bg-[#141414]/80 backdrop-blur-sm
                         border-zinc-200/80 dark:border-white/[0.07]
                         transition-all duration-300
                         hover:border-[#22c55e]/35
                         hover:shadow-[0_0_0_1px_rgba(34,197,94,0.15),0_16px_40px_-20px_rgba(34,197,94,0.2)]"
            >
              <div className="flex items-center gap-4">
                <span
                  className="grid h-11 w-11 place-items-center rounded-xl
                             bg-zinc-100 dark:bg-white/[0.06] text-zinc-500 dark:text-zinc-400"
                >
                  <CalendarDays size={20} />
                </span>
                <div>
                  <p className="font-heading font-bold text-[15px] text-zinc-900 dark:text-zinc-50">
                    Syllabus &amp; Study Tracker
                  </p>
                  <p className="text-[12.5px] text-zinc-500 dark:text-zinc-400">
                    Keep track of your chapter progress and personal notes
                  </p>
                </div>
              </div>
              <span
                className="grid h-10 w-10 place-items-center rounded-full border
                           border-zinc-200/80 dark:border-white/[0.1]
                           text-zinc-500 dark:text-zinc-400 transition-all duration-300
                           group-hover:bg-[#22c55e] group-hover:border-[#22c55e] group-hover:text-white"
              >
                <ChevronRight size={17} />
              </span>
            </div>
          </button>

          {/* ── BACK BUTTON ─────────────────────────────────────── */}
          <div className="flex justify-center py-14">
            <motion.button
              whileHover="hover"
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(`/year-${parsedYear}`)}
              className="flex min-h-[44px] items-center gap-2.5 rounded-full border px-6 py-3 text-[14px] font-bold cursor-pointer
                         border-zinc-200/80 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.02]
                         text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white
                         shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_20px_rgba(255,255,255,0.02)]
                         transition-all backdrop-blur-sm relative overflow-hidden"
            >
              <motion.div
                variants={{
                  initial: { x: 0 },
                  hover: { x: -4 },
                }}
                initial="initial"
                animate="initial"
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center justify-center"
              >
                <ArrowLeft size={15} />
              </motion.div>
              Back to Modules
            </motion.button>
          </div>
        </main>
      </motion.div>
    </PortalShell>
  );
}
