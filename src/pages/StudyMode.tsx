import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowRight, ArrowLeft, Activity, BookOpen, Layers, CalendarDays, ChevronRight,
} from 'lucide-react';
import { PortalShell } from '../app/components/PortalShell';
import { getModuleQuestionCounts, SYLLABUS_MODULES } from '../app/data';
import { CardShell, IconBadge } from '../components/cards/PremiumCards';
import { motion } from 'framer-motion';
import { pageVariants } from '../app/lib/motion';

/* ────────────────────────────────────────────────
   DATA — exact content per spec
   ──────────────────────────────────────────────── */
type Mode = {
  type: 'mcq' | 'essay' | 'mixed';
  title: string;
  desc: string;
  cta: string;
  icon: typeof Activity;
  accent: string;
};

const MODES: Mode[] = [
  {
    type: 'mcq',
    title: "MCQ Practice Mode",
    desc: "Loads only multiple-choice, true/false, and fill-in-the-blank questions for rapid recall.",
    cta: "Start Practice",
    icon: Activity,
    accent: "#22c55e",
  },
  {
    type: 'essay',
    title: "Essay Study Mode",
    desc: "Loads written/short answer and case-based essay questions with detailed model answers.",
    cta: "Start Study",
    icon: BookOpen,
    accent: "#ef4444",
  },
  {
    type: 'mixed',
    title: "Mixed Exam Mode",
    desc: "Combines MCQ and Essay databases to generate a comprehensive, hybrid practice exam.",
    cta: "Generate Exam",
    icon: Layers,
    accent: "#3b82f6",
  },
];

interface StudyModeProps {
  userButton?: React.ReactNode;
  onStartStudyMode?: (mode: 'mcq' | 'essay' | 'mixed', moduleCode: string) => void;
  onOpenSyllabus?: (moduleCode: string) => void;
}

export default function StudyMode({ userButton, onStartStudyMode, onOpenSyllabus }: StudyModeProps) {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const moduleCode = (code || 'MEM-2').toUpperCase();

  // Find module details dynamically from database
  const selectedModule = useMemo(() => {
    for (const year of Object.values(SYLLABUS_MODULES)) {
      for (const sem of Object.values(year)) {
        const found = sem.find(m => m.code.toLowerCase() === moduleCode.toLowerCase());
        if (found) return found;
      }
    }
    return null;
  }, [moduleCode]);

  const counts = useMemo(() => {
    return getModuleQuestionCounts(moduleCode);
  }, [moduleCode]);

  const getModeCount = (type: Mode['type']) => {
    if (type === 'mcq') return counts.mcqCount;
    if (type === 'essay') return counts.essayCount;
    return counts.totalCount;
  };

  const handleStartMode = (e: React.MouseEvent, type: Mode['type']) => {
    e.preventDefault();
    if (onStartStudyMode) {
      onStartStudyMode(type, moduleCode);
    } else {
      navigate(`/year-2/${moduleCode.toLowerCase()}/${type}`);
    }
  };

  const handleOpenTracker = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenSyllabus) {
      onOpenSyllabus(moduleCode);
    } else {
      navigate(`/year-2/${moduleCode.toLowerCase()}/tracker`);
    }
  };

  const CRUMBS = [
    { label: "Portal", onClick: () => navigate('/') },
    { label: "Year 2", onClick: () => navigate('/year-2') },
    { label: moduleCode },
  ];

  return (
    <PortalShell
      crumbs={CRUMBS}
      userButton={userButton}
    >
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="w-full"
      >
        <main className="mx-auto max-w-6xl px-5 lg:px-8">
        {/* ── PAGE HEADER ─────────────────────────────────────── */}
        <section className="pt-14 pb-10 text-center lg:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-wide
                           bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            Module Loaded: {moduleCode}
          </span>
          <h1 className="mt-5 font-heading font-black tracking-[-0.03em] text-4xl lg:text-[48px]">
            Select Study Mode
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] font-medium leading-relaxed
                        text-zinc-500 dark:text-zinc-400">
            Choose the question formats you wish to practice. You can focus on MCQs,
            essays, or a mixed exam.
          </p>
        </section>

        {/* ── THREE MODE CARDS — staggered pop-in ─────────────── */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {MODES.map((mode, i) => {
            const Icon = mode.icon;
            const count = getModeCount(mode.type);
            return (
              <CardShell
                key={mode.title}
                accent={mode.accent}
                onClick={(e) => handleStartMode(e, mode.type)}
                className="group flex flex-col transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.5,1)] hover:-translate-y-1.5 animate-card-pop opacity-0 cursor-pointer"
                style={{
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <IconBadge accent={mode.accent}>
                      <Icon size={21} className="transition-transform duration-300 group-hover:scale-110" />
                    </IconBadge>

                    <h2 className="mt-5 font-heading font-bold text-[19px] tracking-tight">{mode.title}</h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {mode.desc}
                    </p>
                  </div>

                  <div>
                    {/* Glowing heartbeat waveform — drawn live via dash animation */}
                    <svg viewBox="0 0 280 48" className="mt-5 w-full" fill="none">
                      <path
                        d="M0 24 H70 L82 24 L92 8 L104 40 L114 16 L122 24 H170 L180 24 L188 14 L198 34 L206 24 H280"
                        stroke={mode.accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
                        className="animate-ekg"
                        style={{ filter: `drop-shadow(0 0 5px ${mode.accent}) drop-shadow(0 0 14px ${mode.accent}60)` }}
                      />
                    </svg>

                    {/* Stat block + CTA */}
                    <div className="mt-5 flex items-center justify-between rounded-2xl border p-3
                                    border-white/50 dark:border-white/[0.08]
                                    bg-white/40 dark:bg-white/[0.04] backdrop-blur-md">
                      <div className="pr-2">
                        <p className="font-heading text-[18px] sm:text-[20px] font-black leading-none">{count.toLocaleString()}</p>
                        <p className="mt-1 text-[8.5px] font-bold tracking-[0.15em] text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                          QUESTIONS AVAILABLE
                        </p>
                      </div>
                      <span
                         className="study-mode-cta rounded-full px-3.5 py-2 font-heading text-[12.5px] font-bold transition-all duration-300 border whitespace-nowrap"
                         style={{
                           color: mode.accent,
                           borderColor: `${mode.accent}4d`,
                           ['--cta-accent' as any]: mode.accent,
                           ['--cta-accent-light' as any]: `${mode.accent}2e`,
                         }}
                      >
                        {mode.cta} →
                      </span>
                    </div>
                  </div>
                </div>
              </CardShell>
            );
          })}
        </section>

        {/* ── SYLLABUS & STUDY TRACKER BAR ────────────────────── */}
        <button
          onClick={handleOpenTracker}
          className="w-full text-left cursor-pointer bg-transparent border-0 p-0 block mt-6"
        >
          <div className="group flex items-center justify-between rounded-3xl border p-5
                         bg-white/80 dark:bg-[#141414]/80 backdrop-blur-sm
                         border-zinc-200/80 dark:border-white/[0.07]
                         transition-all duration-300
                         hover:border-[#22c55e]/35
                         hover:shadow-[0_0_0_1px_rgba(34,197,94,0.15),0_16px_40px_-20px_rgba(34,197,94,0.2)]">
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl
                               bg-zinc-100 dark:bg-white/[0.06] text-zinc-500 dark:text-zinc-400">
                <CalendarDays size={20} />
              </span>
              <div>
                <p className="font-heading font-bold text-[15px]">Syllabus &amp; Study Tracker</p>
                <p className="text-[12.5px] text-zinc-500 dark:text-zinc-400">
                  Keep track of your chapter progress and personal notes
                </p>
              </div>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full border
                             border-zinc-200/80 dark:border-white/[0.1]
                             text-zinc-500 dark:text-zinc-400 transition-all duration-300
                             group-hover:bg-[#22c55e] group-hover:border-[#22c55e] group-hover:text-white">
              <ChevronRight size={17} />
            </span>
          </div>
        </button>

        {/* ── BACK BUTTON ─────────────────────────────────────── */}
        <div className="flex justify-center py-14">
          <button onClick={() => navigate('/year-2')}
             className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-[14px] font-semibold cursor-pointer bg-transparent
                        border-zinc-200/80 dark:border-white/[0.08]
                        text-zinc-600 dark:text-zinc-300
                        hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors group">
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
            Back to Modules
          </button>
        </div>
      </main>
      </motion.div>
    </PortalShell>
  );
}
