import { useCallback, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Activity, Heart, Calculator, Search, GraduationCap,
  Lock, ChevronRight, ArrowRight,
} from 'lucide-react';
import { PortalShell } from '../app/components/PortalShell';
import { applySubjectTheme } from '../app/theme/subjectThemes';
import { pulse } from '../app/lib/pulseEngine';
import { CardShell } from '../components/cards/PremiumCards';
import { motion } from 'motion/react';
import { pageVariants } from '../app/lib/motion';

/* ────────────────────────────────────────────────
   DATA — real content, no lorem ipsum
   ──────────────────────────────────────────────── */
type Year = {
  id: number;
  label: string;
  phase: string;
  subtitle: string;
  cp: number;
  marks: number;
  active: boolean;
  accent: string;   // hex
  glow: string;     // rgba for radial corner glow
};

const YEARS: Year[] = [
  { id: 1, label: "Year 1", phase: "Foundations",        subtitle: "PRE-CLERKSHIP", cp: 27, marks: 540, active: false, accent: "#22c55e", glow: "rgba(34,197,94,0.18)" },
  { id: 2, label: "Year 2", phase: "Foundations",        subtitle: "PRE-CLERKSHIP", cp: 27, marks: 540, active: true,  accent: "#3b82f6", glow: "rgba(59,130,246,0.18)" },
  { id: 3, label: "Year 3", phase: "Transitional Phase", subtitle: "PRE-CLERKSHIP", cp: 30, marks: 600, active: false, accent: "#a855f7", glow: "rgba(168,85,247,0.18)" },
  { id: 4, label: "Year 4", phase: "Clinical Phase",     subtitle: "CLERKSHIP",     cp: 32, marks: 640, active: false, accent: "#f97316", glow: "rgba(249,115,22,0.18)" },
  { id: 5, label: "Year 5", phase: "Clinical Phase",     subtitle: "CLERKSHIP",     cp: 32, marks: 640, active: false, accent: "#f43f5e", glow: "rgba(244,63,94,0.18)" },
];

const TOOLS = [
  { title: "Full History",     icon: Activity,      accent: "#22c55e", badge: null,        sub: "View all your past quiz sessions and results", route: "/history" },
  { title: "Case Solver",      icon: Heart,         accent: "#a855f7", badge: "New Game",  sub: "Solve randomized clinical cases for fun", route: "/case-solver" },
  { title: "Marks Calculator", icon: Calculator,    accent: "#f87171", badge: "Predictor", sub: "Calculate requirements and target scores", route: "/marks-calculator" },
  { title: "Question Search",  icon: Search,        accent: "#2dd4bf", badge: "Search",    sub: "Search text in all database questions and answers", route: "/question-search" },
  { title: "Study Tracker",    icon: GraduationCap, accent: "#22c55e", badge: "Syllabus",  sub: "Track syllabus and lecture study progress", route: "/study-tracker" },
];

/* Spring-feel curve for carousel transitions */
const SPRING = "cubic-bezier(0.34, 1.45, 0.45, 1)";

interface DashboardProps {
  userButton?: React.ReactNode;
  onOpenTrackerSelector?: () => void;
}

export default function Dashboard({ userButton, onOpenTrackerSelector }: DashboardProps) {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(1); // Year 2 centered
  const dragX = useRef<number | null>(null);

  useEffect(() => {
    // On year focus: applySubjectTheme so the background re-skins
    applySubjectTheme('year' + YEARS[activeIdx].id);
  }, [activeIdx]);

  /* Swipe: pointer-based so it works on touch + mouse */
  const onPointerDown = (e: React.PointerEvent) => { dragX.current = e.clientX; };
  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (dragX.current === null) return;
    const dx = e.clientX - dragX.current;
    if (dx < -48) setActiveIdx(i => Math.min(i + 1, YEARS.length - 1));
    if (dx > 48)  setActiveIdx(i => Math.max(i - 1, 0));
    dragX.current = null;
  }, []);

  const handleEnterYear = (e: React.MouseEvent, year: Year) => {
    e.preventDefault();
    if (!year.active) return;
    
    // On 'Enter': pulse burst for transition bloom at click coordinates
    const x = e.clientX || window.innerWidth / 2;
    const y = e.clientY || window.innerHeight / 2;
    pulse.burst(x, y, 'correct');
    
    navigate(`/year-${year.id}`);
  };

  const handleToolClick = (tool: typeof TOOLS[0]) => {
    if (tool.title === "Study Tracker") {
      if (onOpenTrackerSelector) {
        onOpenTrackerSelector();
      } else {
        navigate(tool.route);
      }
    } else {
      navigate(tool.route);
    }
  };

  return (
    <PortalShell
      crumbs={[{ label: 'Portal' }]}
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
        {/* ── HERO ────────────────────────────────────────────── */}
        <section className="pt-16 pb-10 text-center lg:pt-24">
          <h1 className="font-heading font-black tracking-[-0.03em] text-4xl sm:text-5xl lg:text-[64px] lg:leading-[1.05]">
            Select Your Year
          </h1>
          <p
            dir="rtl"
            className="mt-5 font-quran text-xl sm:text-2xl lg:text-[28px] text-[#22c55e]"
          >
            ﴿وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا﴾
          </p>
        </section>

        {/* ── 3D STACKED CARD CAROUSEL ──────────────────────── */}
        <section
          className="relative mx-auto h-[420px] sm:h-[440px] select-none touch-pan-y"
          style={{ perspective: "1400px" }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {YEARS.map((year, i) => {
            const offset = i - activeIdx;
            const abs = Math.abs(offset);
            return (
              <CardShell
                key={year.id}
                accent={year.accent}
                accent2={year.id === 2 ? "#a855f7" : undefined}
                onClick={(e) => {
                  if (i === activeIdx) {
                    if (year.active) {
                      handleEnterYear(e, year);
                    }
                  } else {
                    setActiveIdx(i);
                  }
                }}
                className="absolute left-1/2 top-1/2 w-[320px] sm:w-[420px] lg:w-[480px] h-[340px] sm:h-[360px] cursor-pointer"
                style={{
                  transform: `translate(-50%, -50%)
                              translateX(${offset * 56}%)
                              scale(${1 - abs * 0.1})
                              rotateY(${offset * -7}deg)`,
                  opacity: abs > 2 ? 0 : 1 - abs * 0.35,
                  zIndex: 10 - abs,
                  transition: `transform 0.6s ${SPRING}, opacity 0.4s ease`,
                  pointerEvents: abs > 2 ? "none" : "auto",
                }}
              >
                <div className="p-7 flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between">
                    <span
                      className="rounded-full px-3.5 py-1.5 text-[12px] font-heading font-bold text-white"
                      style={{ backgroundColor: year.accent }}
                    >
                      {year.label}
                    </span>
                    {!year.active && (
                      <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-widest
                                       bg-zinc-100/70 dark:bg-white/[0.06] backdrop-blur-md
                                       border border-zinc-200/60 dark:border-white/[0.08]
                                       text-zinc-500 dark:text-zinc-400">
                        <Lock size={11} /> LOCKED
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="font-heading font-black text-2xl sm:text-3xl tracking-tight">
                      {year.phase}
                    </h2>
                    <p className="mt-1 text-[11px] font-semibold tracking-[0.25em] text-zinc-400 dark:text-zinc-500">
                      {year.subtitle}
                    </p>

                    <div className="mt-5 flex gap-6 text-[13px] text-zinc-500 dark:text-zinc-400">
                      <span>Credit Points: <strong className="text-zinc-900 dark:text-zinc-100">{year.cp} CP</strong></span>
                      <span>Total Marks: <strong className="text-zinc-900 dark:text-zinc-100">{year.marks}</strong></span>
                    </div>

                    {year.active && (
                      <div className="mt-5 flex items-center justify-between">
                        <span className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#22c55e]">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
                          </span>
                          ACTIVE MODULES
                        </span>
                        <button
                          onClick={(e) => handleEnterYear(e, year)}
                          className="flex items-center gap-1.5 text-[14px] font-heading font-bold
                                     text-zinc-900 dark:text-white group border-0 bg-transparent cursor-pointer"
                        >
                          Enter <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </CardShell>
            );
          })}
        </section>

        {/* Dot indicators */}
        <div className="mt-2 flex justify-center gap-2">
          {YEARS.map((y, i) => (
            <button
              key={y.id}
              onClick={() => setActiveIdx(i)}
              aria-label={`Go to ${y.label}`}
              className="h-2 rounded-full transition-all duration-500 border-0 cursor-pointer"
              style={{
                width: i === activeIdx ? 24 : 8,
                backgroundColor: i === activeIdx ? y.accent : "rgba(128,128,128,0.3)",
              }}
            />
          ))}
        </div>

        {/* ── TOOLS ───────────────────────────────────────────── */}
        <hr className="my-14 border-zinc-200/70 dark:border-white/[0.06]" />

        <section className="pb-20">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-gradient-to-b from-[#22c55e] to-[#3b82f6]" />
            <h3 className="font-heading font-black text-xl tracking-tight">Tools</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.title}
                  onClick={() => handleToolClick(tool)}
                  className="group rounded-3xl border p-5 text-left cursor-pointer
                             bg-white dark:bg-[#141414]
                             border-zinc-200/80 dark:border-white/[0.07]
                             transition-all duration-300
                             hover:-translate-y-1
                             hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.25)]
                             dark:hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.9)]
                             dark:hover:border-white/[0.12]"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="grid h-11 w-11 place-items-center rounded-xl"
                      style={{ backgroundColor: `${tool.accent}1f`, color: tool.accent }}
                    >
                      <Icon size={20} />
                    </span>
                    {tool.badge && (
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide backdrop-blur-md"
                        style={{ backgroundColor: `${tool.accent}1a`, color: tool.accent, border: `1px solid ${tool.accent}33` }}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="mt-4 font-heading font-bold text-[15px]">{tool.title}</h4>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">{tool.sub}</p>
                </button>
              );
            })}
          </div>
        </section>
      </main>
      </motion.div>
    </PortalShell>
  );
}
