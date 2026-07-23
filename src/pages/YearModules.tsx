import { useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { PortalShell } from '../app/components/PortalShell';
import { getQuizHistoryForModule } from '../app/utils/storage';
import { getModuleQuestionCounts, isModuleActive, SYLLABUS_MODULES } from '../app/data';
import { applySubjectTheme } from '../app/theme/subjectThemes';
import { CardShell } from '../components/cards/PremiumCards';
import { motion } from 'motion/react';
import { pageVariants } from '../app/lib/motion';

/* ────────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────────── */
const YEAR_PHASES: Record<number, string> = {
  1: 'Foundations',
  2: 'Foundations',
  3: 'Transitional Phase',
  4: 'Clinical Phase',
  5: 'Clinical Phase',
};

type Module = {
  code: string;
  name: string;
  cp: number;
  marks: number | null;
  accent: string; // Theme mapping key
};

type Semester = {
  label: string;
  stats: string;
  modules: Module[];
};


/* ────────────────────────────────────────────────
   CIRCULAR PROGRESS RING — fills green per completion
   ──────────────────────────────────────────────── */
function ProgressRing({ answered, total }: { answered: number; total: number }) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  const R = 16;
  const C = 2 * Math.PI * R;
  return (
    <div className="flex items-center gap-2" title={`${answered}/${total} questions answered`}>
      <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
        {pct}%
      </span>
      <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
        <circle cx="20" cy="20" r={R} fill="none" strokeWidth="3.5"
                className="stroke-zinc-200 dark:stroke-white/[0.08]" />
        <circle
          cx="20" cy="20" r={R} fill="none" strokeWidth="3.5"
          stroke="#22c55e" strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C - (C * pct) / 100}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
    </div>
  );
}

interface YearModulesProps {
  userButton?: React.ReactNode;
}

export default function YearModules({ userButton }: YearModulesProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { yearId } = useParams<{ yearId: string }>();

  const yr = useMemo(() => {
    const match = location.pathname.match(/\/year-(\d+)/);
    return match ? Number(match[1]) : (Number(yearId) || 2);
  }, [location.pathname, yearId]);

  const [tab, setTab] = useState(1); // Semester 2 active by default

  const semestersData = useMemo(() => {
    const yrModules = SYLLABUS_MODULES[yr] || {};
    return Object.entries(yrModules).map(([semId, mods]) => {
      const semNum = Number(semId);
      let totalCp = 0;
      let totalMarks = 0;
      const modules = mods.map(m => {
        totalCp += m.cp;
        totalMarks += typeof m.marks === 'number' ? m.marks : 0;
        return {
          code: m.code,
          name: m.name,
          cp: m.cp,
          marks: m.marks,
          accent: `year${yr}`, // dynamic accent for the year
        };
      });

      return {
        label: `Semester ${semNum}`,
        stats: `${mods.length} MODULES • ${totalCp} CP • ${totalMarks} MARKS`,
        modules
      };
    });
  }, [yr]);

  const activeTab = useMemo(() => {
    return tab < semestersData.length ? tab : Math.max(0, semestersData.length - 1);
  }, [tab, semestersData.length]);

  const sem = semestersData[activeTab] || { label: '', stats: '', modules: [] };

  // Helper to calculate progress dynamically using localStorage quiz history
  const getModuleProgress = (moduleCode: string) => {
    const history = getQuizHistoryForModule(moduleCode);
    const attemptedIds = new Set<string | number>();
    history.forEach(h => {
      if (h.questionIds) {
        h.questionIds.forEach(id => attemptedIds.add(id));
      }
    });
    const counts = getModuleQuestionCounts(moduleCode);
    return {
      answered: Math.min(attemptedIds.size, counts.totalCount),
      total: counts.totalCount
    };
  };

  const handleStartModule = (e: React.MouseEvent, mod: Module) => {
    e.preventDefault();
    if (!isModuleActive(mod.code)) return;
    
    // Apply subject theme on click so visual skin updates
    applySubjectTheme(mod.accent);
    navigate(`/year-${yr}/${mod.code.toLowerCase()}`);
  };

  return (
    <PortalShell
      crumbs={[{ label: "Portal", onClick: () => navigate('/') }, { label: `Year ${yr}` }]}
      userButton={userButton}
    >
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="w-full"
      >
        <main className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* ── PAGE HEADER ─────────────────────────────────────── */}
        <section className="pt-14 pb-8 lg:pt-20">
          <h1 className="font-heading font-black tracking-[-0.03em] text-4xl sm:text-5xl lg:text-[56px]">
            Year {yr} Modules
          </h1>
          <span className="mt-4 inline-block rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em]
                           bg-zinc-100/70 dark:bg-white/[0.05] backdrop-blur-md
                           border border-zinc-200/60 dark:border-white/[0.07]
                           text-zinc-500 dark:text-zinc-400">
            YEAR {yr} • {yr <= 2 ? 'PRE-CLERKSHIP' : (yr === 3 ? 'PARACLINICAL' : 'CLERKSHIP')}
          </span>
        </section>

        {/* ── SEMESTER TAB SWITCHER ───────────────────────────── */}
        <div className="relative border-b border-zinc-200/70 dark:border-white/[0.06]">
          <div className="grid grid-cols-2 max-w-md">
            {semestersData.map((s, i) => (
              <button key={s.label} onClick={() => setTab(i)}
                      className="pb-4 pt-2 text-left transition-colors cursor-pointer border-0 bg-transparent">
                <span className={`font-heading text-[16px] transition-colors duration-300 block ${
                  activeTab === i
                    ? "font-bold text-zinc-900 dark:text-white"
                    : "font-medium text-zinc-400 dark:text-zinc-600"
                }`}>
                  {s.label}
                </span>
                <span className={`mt-1 block text-[10px] font-semibold tracking-[0.15em] transition-colors duration-300 ${
                  activeTab === i ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-300 dark:text-zinc-700"
                }`}>
                  {s.stats}
                </span>
              </button>
            ))}
          </div>
          {/* Animated green underline — slides between tabs */}
          {semestersData.length > 0 && (
            <span
              className="absolute bottom-0 h-[2.5px] rounded-full bg-[#22c55e]"
              style={{
                width: `calc(min(28rem, 100%) / ${semestersData.length})`,
                transform: `translateX(${activeTab * 100}%)`,
                transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          )}
        </div>

        {/* ── MODULE CARDS GRID ───────────────────────────────── */}
        <section key={activeTab}
                 className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-2 lg:grid-cols-3 animate-grid-in">
          {sem.modules.map(m => {
            const active = isModuleActive(m.code);
            const counts = getModuleQuestionCounts(m.code);
            const progress = getModuleProgress(m.code);
            
            // Map theme keys
            const theme = applySubjectTheme(m.accent);
            
            return (
              <CardShell
                key={m.code}
                accent={active ? theme.accent : "#71717a"}
                onClick={active ? (e) => handleStartModule(e, m) : undefined}
                className={`group flex flex-col h-full ${
                  active
                    ? "cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(34,197,94,0.25)] dark:hover:shadow-[0_24px_50px_-20px_rgba(34,197,94,0.15)]"
                    : "saturate-50 opacity-70"
                }`}
              >
                <div className="p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-[11px] font-semibold tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                        {m.code}
                      </span>
                      {active ? (
                        <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold
                                         bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                          Live ({counts.totalCount} questions)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold
                                         bg-zinc-100/70 dark:bg-white/[0.05] backdrop-blur-md
                                         border border-zinc-200/60 dark:border-white/[0.08]
                                         text-zinc-500 dark:text-zinc-400">
                          <Lock size={10} /> Coming Soon
                        </span>
                      )}
                    </div>

                    <h2 className="mt-5 font-heading font-bold text-[18px] leading-snug pb-6">
                      {m.name}
                    </h2>
                  </div>

                  <div>
                    <div className="text-[12px] text-zinc-500 dark:text-zinc-400">
                      CP: <strong className="text-zinc-900 dark:text-zinc-100">{m.cp}</strong>
                      <span className="mx-2 opacity-40">|</span>
                      Marks: <strong className="text-zinc-900 dark:text-zinc-100">{m.marks}</strong>
                    </div>

                    <hr className="my-4 border-zinc-200/70 dark:border-white/[0.06]" />

                    <div className="flex items-center justify-between">
                      {active ? (
                        <button
                          onClick={(e) => handleStartModule(e, m)}
                          className="flex items-center gap-1.5 font-heading font-bold text-[14px] text-[#22c55e] border-0 bg-transparent cursor-pointer pl-0 text-left"
                        >
                          Start <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ) : (
                        <span className="text-[13px] font-medium text-zinc-300 dark:text-zinc-600">Locked</span>
                      )}
                      {active && (
                        <ProgressRing answered={progress.answered} total={progress.total} />
                      )}
                    </div>
                  </div>
                </div>
              </CardShell>
            );
          })}
        </section>

        {/* ── BACK BUTTON ─────────────────────────────────────── */}
        <div className="flex justify-center pb-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-[14px] font-semibold cursor-pointer bg-transparent
                       border-zinc-200/80 dark:border-white/[0.08]
                       text-zinc-600 dark:text-zinc-300
                       hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors group"
          >
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
        </div>
      </main>
      </motion.div>
    </PortalShell>
  );
}
