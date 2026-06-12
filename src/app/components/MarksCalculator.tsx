import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Calculator,
  HelpCircle,
  ArrowLeft,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

/* ---------------------------------- Types --------------------------------- */

interface Section {
  id: string;
  name: string;
  max: number;
}

type GradeKey = "A" | "B" | "C" | "D";

interface ModulePreset {
  id: string;
  name: string;
  sections: Section[];
  /** Minimum marks required for each grade */
  boundaries: Record<GradeKey, number>;
}

interface CustomSection {
  id: string;
  name: string;
  max: string; // raw input
}

type GradeStatus =
  | { kind: "achieved" }
  | { kind: "out-of-reach" }
  | { kind: "possible"; marksNeeded: number; pctNeeded: number };

/* --------------------------------- Presets -------------------------------- */

const PRESETS: ModulePreset[] = [
  {
    id: "cns",
    name: "CNS Module",
    sections: [
      { id: "cns-ca", name: "Continuous Assessment", max: 66 },
      { id: "cns-act", name: "Activities / Moodle", max: 12 },
      { id: "cns-prac", name: "Practical Exam", max: 78 },
      { id: "cns-final", name: "Final Exam (MCQ + Essay)", max: 104 },
    ],
    boundaries: { A: 221, B: 195, C: 169, D: 156 },
  },
  {
    id: "senses",
    name: "Special Senses",
    sections: [
      { id: "ss-ca", name: "Continuous Assessment & Activities", max: 24 },
      { id: "ss-prac", name: "Practical Exam", max: 24 },
      { id: "ss-final", name: "Final Exam (MCQ + Essay)", max: 32 },
    ],
    boundaries: { A: 68, B: 60, C: 52, D: 48 },
  },
  {
    id: "endocrine",
    name: "Endocrine & Metabolism",
    sections: [
      { id: "em-ca", name: "Continuous Assessment & Activities", max: 33 },
      { id: "em-prac", name: "Practical Exam", max: 33 },
      { id: "em-final", name: "Final Exam (MCQ + Essay)", max: 44 },
    ],
    boundaries: { A: 94, B: 83, C: 72, D: 66 },
  },
  {
    id: "research",
    name: "Fundamentals of Research",
    sections: [
      { id: "fr-mcq", name: "MCQ Quiz", max: 10 },
      { id: "fr-book", name: "Book Assignment", max: 2 },
      { id: "fr-moodle", name: "Moodle Assignments", max: 6 },
      { id: "fr-final", name: "Final MCQ Exam", max: 42 },
    ],
    boundaries: { A: 51, B: 45, C: 39, D: 36 },
  },
  {
    id: "behavioral",
    name: "Behavioral Sciences",
    sections: [
      { id: "bs-ca", name: "Continuous Assessment", max: 10 },
      { id: "bs-final", name: "Final Exam", max: 20 },
    ],
    boundaries: { A: 26, B: 23, C: 20, D: 18 },
  },
];

const CUSTOM_ID = "custom";
const GRADES: GradeKey[] = ["A", "B", "C", "D"];
const CUSTOM_PCTS: Record<GradeKey, number> = { A: 0.85, B: 0.75, C: 0.65, D: 0.6 };

const GRADE_COLORS: Record<GradeKey | "Fail", string> = {
  A: "text-emerald-400",
  B: "text-sky-400",
  C: "text-amber-400",
  D: "text-orange-400",
  Fail: "text-rose-400",
};

/* --------------------------------- Helpers -------------------------------- */

let uid = 0;
const nextId = () => `custom-${++uid}-${Date.now()}`;

function gradeFromScore(score: number, boundaries: Record<GradeKey, number>): GradeKey | "Fail" {
  for (const g of GRADES) if (score >= boundaries[g]) return g;
  return "Fail";
}

function parseScore(raw: string): number | null {
  if (raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/* ----------------------------- Sub-components ----------------------------- */

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] ${className}`}
    >
      {children}
    </div>
  );
}

function ProgressRing({ pct, label }: { pct: number; label: string }) {
  const size = 168;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const clamped = Math.min(Math.max(pct, 0), 100);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (clamped / 100) * circ }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tracking-tight text-white tabular-nums">
          {clamped.toFixed(1)}%
        </span>
        <span className="text-[11px] uppercase tracking-widest text-white/40 mt-1">{label}</span>
      </div>
    </div>
  );
}

/* ------------------------------ Main component ----------------------------- */

export function MarksCalculator({ onBack }: { onBack: () => void }) {
  const [activeModuleId, setActiveModuleId] = useState<string>(PRESETS[0].id);
  const [scores, setScores] = useState<Record<string, string>>({});

  // Custom module state
  const [customName, setCustomName] = useState("My Custom Module");
  const [customSections, setCustomSections] = useState<CustomSection[]>([
    { id: nextId(), name: "Continuous Assessment", max: "40" },
    { id: nextId(), name: "Final Exam", max: "60" },
  ]);

  const isCustom = activeModuleId === CUSTOM_ID;

  /* Resolve the active module (preset or custom-built) */
  const activeModule: ModulePreset = useMemo(() => {
    if (!isCustom) return PRESETS.find((p) => p.id === activeModuleId)!;

    const sections: Section[] = customSections
      .map((s) => ({ id: s.id, name: s.name.trim() || "Untitled Section", max: Number(s.max) }))
      .filter((s) => Number.isFinite(s.max) && s.max > 0);

    const total = sections.reduce((sum, s) => sum + s.max, 0);
    return {
      id: CUSTOM_ID,
      name: customName.trim() || "Custom Module",
      sections,
      boundaries: {
        A: Math.ceil(total * CUSTOM_PCTS.A),
        B: Math.ceil(total * CUSTOM_PCTS.B),
        C: Math.ceil(total * CUSTOM_PCTS.C),
        D: Math.ceil(total * CUSTOM_PCTS.D),
      },
    };
  }, [isCustom, activeModuleId, customSections, customName]);

  const total = useMemo(
    () => activeModule.sections.reduce((sum, s) => sum + s.max, 0),
    [activeModule],
  );

  /* Core calculation */
  const calc = useMemo(() => {
    let entered = 0;
    let remainingMax = 0;
    const errors: Record<string, string> = {};

    for (const s of activeModule.sections) {
      const raw = scores[s.id] ?? "";
      const val = parseScore(raw);
      if (raw.trim() === "") {
        remainingMax += s.max;
      } else if (val === null) {
        errors[s.id] = "Enter a valid number";
        remainingMax += s.max;
      } else if (val < 0) {
        errors[s.id] = "Score cannot be negative";
        remainingMax += s.max;
      } else if (val > s.max) {
        errors[s.id] = `Maximum is ${s.max}`;
        remainingMax += s.max;
      } else {
        entered += val;
      }
    }

    const guaranteed = gradeFromScore(entered, activeModule.boundaries);
    const potential = gradeFromScore(entered + remainingMax, activeModule.boundaries);

    const gradeStatuses: Record<GradeKey, GradeStatus> = {} as Record<GradeKey, GradeStatus>;
    for (const g of GRADES) {
      const min = activeModule.boundaries[g];
      if (entered >= min) {
        gradeStatuses[g] = { kind: "achieved" };
      } else if (min > entered + remainingMax) {
        gradeStatuses[g] = { kind: "out-of-reach" };
      } else {
        const marksNeeded = min - entered;
        const pctNeeded = remainingMax > 0 ? (marksNeeded / remainingMax) * 100 : 0;
        gradeStatuses[g] = { kind: "possible", marksNeeded, pctNeeded };
      }
    }

    return { entered, remainingMax, errors, guaranteed, potential, gradeStatuses };
  }, [activeModule, scores]);

  /* Handlers */
  const selectModule = (id: string) => {
    setActiveModuleId(id);
    setScores({});
  };

  const resetScores = () => setScores({});

  const addCustomSection = () =>
    setCustomSections((prev) => [...prev, { id: nextId(), name: "", max: "" }]);

  const removeCustomSection = (id: string) => {
    setCustomSections((prev) => prev.filter((s) => s.id !== id));
    setScores((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updateCustomSection = (id: string, patch: Partial<CustomSection>) =>
    setCustomSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const pctAchieved = total > 0 ? (calc.entered / total) * 100 : 0;

  /* ---------------------------------- Render --------------------------------- */

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white antialiased selection:bg-sky-500/30">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              aria-label="Go back"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl transition-colors hover:bg-white/[0.08]"
            >
              <ArrowLeft size={18} className="text-white/70" />
            </button>
            <div>
              <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">
                <Calculator size={22} className="text-sky-400" />
                Marks Calculator
              </h1>
              <p className="text-sm text-white/40">ASU · Year 2 · Semester 2</p>
            </div>
          </div>
          <button
            onClick={resetScores}
            className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-white/70 backdrop-blur-xl transition-colors hover:bg-white/[0.08]"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ------------------------------ LEFT: Inputs ------------------------------ */}
          <GlassCard className="p-5 sm:p-6">
            {/* Module tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              {[...PRESETS, { id: CUSTOM_ID, name: "Custom" } as ModulePreset].map((m) => (
                <button
                  key={m.id}
                  onClick={() => selectModule(m.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                    activeModuleId === m.id
                      ? "bg-white text-black shadow-lg"
                      : "border border-white/[0.08] bg-white/[0.03] text-white/60 hover:bg-white/[0.08]"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            {/* Custom builder */}
            <AnimatePresence initial={false}>
              {isCustom && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mb-5 space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Module name"
                      className="w-full rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2 text-sm placeholder-white/25 outline-none transition-colors focus:border-sky-400/50"
                    />
                    {customSections.map((s) => (
                      <div key={s.id} className="flex items-center gap-2">
                        <input
                          value={s.name}
                          onChange={(e) => updateCustomSection(s.id, { name: e.target.value })}
                          placeholder="Section name"
                          className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2 text-sm placeholder-white/25 outline-none focus:border-sky-400/50"
                        />
                        <input
                          value={s.max}
                          onChange={(e) => updateCustomSection(s.id, { max: e.target.value })}
                          placeholder="Max"
                          inputMode="decimal"
                          className="w-20 rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2 text-sm placeholder-white/25 outline-none focus:border-sky-400/50"
                        />
                        <button
                          onClick={() => removeCustomSection(s.id)}
                          aria-label="Remove section"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] text-white/40 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addCustomSection}
                      className="flex items-center gap-1.5 text-sm text-sky-400 transition-colors hover:text-sky-300"
                    >
                      <Plus size={15} /> Add section
                    </button>
                    <p className="text-xs text-white/35">
                      Module total: <span className="font-medium text-white/70 tabular-nums">{total}</span> marks ·
                      Boundaries auto-set at A ≥85%, B ≥75%, C ≥65%, D ≥60%
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Section score inputs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-white/80">{activeModule.name}</h2>
                <span className="text-xs text-white/35 tabular-nums">Total: {total} marks</span>
              </div>

              {activeModule.sections.length === 0 && (
                <p className="flex items-center gap-2 text-sm text-white/40">
                  <HelpCircle size={15} /> Add at least one section with a max score.
                </p>
              )}

              {activeModule.sections.map((s) => {
                const error = calc.errors[s.id];
                return (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor={`score-${s.id}`} className="min-w-0 flex-1 truncate text-sm text-white/70">
                        {s.name}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          id={`score-${s.id}`}
                          value={scores[s.id] ?? ""}
                          onChange={(e) => setScores((p) => ({ ...p, [s.id]: e.target.value }))}
                          placeholder="—"
                          inputMode="decimal"
                          className={`w-20 rounded-lg border bg-black/30 px-3 py-2 text-right text-sm tabular-nums placeholder-white/25 outline-none transition-colors ${
                            error
                              ? "border-rose-500/50 focus:border-rose-400"
                              : "border-white/[0.08] focus:border-sky-400/50"
                          }`}
                        />
                        <span className="w-12 text-xs text-white/35 tabular-nums">/ {s.max}</span>
                      </div>
                    </div>
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-1.5 flex items-center gap-1 text-xs text-rose-400"
                        >
                          <AlertTriangle size={12} /> {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>

          {/* ------------------------------ RIGHT: Results ----------------------------- */}
          <div className="space-y-6">
            {/* Progress ring */}
            <GlassCard className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-around">
              <ProgressRing pct={pctAchieved} label="Achieved" />
              <div className="space-y-2 text-center sm:text-left">
                <p className="text-sm text-white/40">Marks entered</p>
                <p className="text-2xl font-semibold tabular-nums">
                  {calc.entered}
                  <span className="text-base font-normal text-white/35"> / {total}</span>
                </p>
                <p className="text-xs text-white/40 tabular-nums">
                  {calc.remainingMax} marks still on the table
                </p>
              </div>
            </GlassCard>

            {/* Worst / Best case */}
            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  { label: "Guaranteed Minimum", grade: calc.guaranteed, hint: "If you score 0 on remaining" },
                  { label: "Maximum Potential", grade: calc.potential, hint: "If you ace everything left" },
                ] as const
              ).map(({ label, grade, hint }) => (
                <GlassCard key={label} className="p-4 text-center">
                  <p className="text-[11px] uppercase tracking-widest text-white/40">{label}</p>
                  <motion.p
                    key={`${label}-${grade}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`my-2 text-4xl font-bold ${GRADE_COLORS[grade]}`}
                  >
                    {grade}
                  </motion.p>
                  <p className="text-[11px] text-white/35">{hint}</p>
                </GlassCard>
              ))}
            </div>

            {/* Target grade cards */}
            <GlassCard className="p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-white/80">
                <Award size={16} className="text-amber-400" /> Target Grades
              </h2>
              <div className="space-y-3">
                {GRADES.map((g) => {
                  const status = calc.gradeStatuses[g];
                  const min = activeModule.boundaries[g];
                  return (
                    <motion.div
                      key={g}
                      layout
                      className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 ${
                        status.kind === "achieved"
                          ? "border-emerald-500/25 bg-emerald-500/[0.06]"
                          : status.kind === "out-of-reach"
                            ? "border-rose-500/20 bg-rose-500/[0.04] opacity-60"
                            : "border-amber-500/20 bg-amber-500/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xl font-bold ${GRADE_COLORS[g]}`}>{g}</span>
                        <span className="text-xs text-white/40 tabular-nums">≥ {min} marks</span>
                      </div>
                      <div className="text-right">
                        {status.kind === "achieved" && (
                          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                            <CheckCircle2 size={15} /> Achieved
                          </span>
                        )}
                        {status.kind === "out-of-reach" && (
                          <span className="flex items-center gap-1.5 text-sm font-medium text-rose-400">
                            <AlertTriangle size={15} /> Out of Reach
                          </span>
                        )}
                        {status.kind === "possible" && (
                          <div className="text-sm">
                            <span className="font-medium text-amber-400 tabular-nums">
                              +{status.marksNeeded} marks needed
                            </span>
                            <p className="text-xs text-white/40 tabular-nums">
                              Need {status.pctNeeded.toFixed(0)}% on remaining
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
