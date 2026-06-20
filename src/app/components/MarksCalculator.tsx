import React, { useMemo, useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  ChevronRight,
  Sparkles,
  Settings,
} from "lucide-react";
import { SYLLABUS_MODULES } from "../data";
import { useTheme } from "../hooks/useTheme";

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

/* ----------------------------- Year 2 Presets ----------------------------- */

const OFFICIAL_PRESETS: Record<string, ModulePreset> = {
  "MCNS-2": {
    id: "MCNS-2",
    name: "CNS Module",
    sections: [
      { id: "cns-ca", name: "Continuous Assessment", max: 66 },
      { id: "cns-act", name: "Activities / Moodle", max: 12 },
      { id: "cns-prac", name: "Practical Exam", max: 78 },
      { id: "cns-final-1", name: "CNS 1", max: 62 },
      { id: "cns-final-2", name: "CNS 2", max: 42 },
    ],
    boundaries: { A: 221, B: 195, C: 169, D: 156 },
  },
  "MSS-2": {
    id: "MSS-2",
    name: "Special Senses",
    sections: [
      { id: "ss-ca", name: "Continuous Assessment & Activities", max: 24 },
      { id: "ss-prac", name: "Practical Exam", max: 24 },
      { id: "ss-final", name: "Final Exam (MCQ + Essay)", max: 32 },
    ],
    boundaries: { A: 68, B: 60, C: 52, D: 48 },
  },
  "MEM-2": {
    id: "MEM-2",
    name: "Endocrine & Metabolism",
    sections: [
      { id: "em-ca", name: "Continuous Assessment & Activities", max: 33 },
      { id: "em-prac", name: "Practical Exam", max: 33 },
      { id: "em-final", name: "Final Exam (MCQ + Essay)", max: 44 },
    ],
    boundaries: { A: 94, B: 83, C: 72, D: 66 },
  },
  "R-2": {
    id: "R-2",
    name: "Fundamentals of Research",
    sections: [
      { id: "fr-mcq", name: "MCQ Quiz", max: 10 },
      { id: "fr-book", name: "Book Assignment", max: 2 },
      { id: "fr-moodle", name: "Moodle Assignments", max: 6 },
      { id: "fr-final", name: "Final MCQ Exam", max: 42 },
    ],
    boundaries: { A: 51, B: 45, C: 39, D: 36 },
  },
  "P3-2": {
    id: "P3-2",
    name: "Behavioral Sciences",
    sections: [
      { id: "bs-final", name: "Final Exam", max: 30 },
    ],
    boundaries: { A: 26, B: 23, C: 20, D: 18 },
  },
};

const CUSTOM_ID = "custom";
const GRADES: GradeKey[] = ["A", "B", "C", "D"];
const CUSTOM_PCTS: Record<GradeKey, number> = { A: 0.85, B: 0.75, C: 0.65, D: 0.6 };

const GRADE_COLORS: Record<GradeKey | "Fail", string> = {
  A: "text-emerald-600 dark:text-emerald-400",
  B: "text-sky-600 dark:text-sky-400",
  C: "text-amber-600 dark:text-amber-400",
  D: "text-orange-600 dark:text-orange-400",
  Fail: "text-rose-600 dark:text-rose-400",
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

function getModulePreset(code: string, name: string, total: number): ModulePreset {
  // If we have an official Year 2 Semester 2 preset:
  if (OFFICIAL_PRESETS[code]) {
    return OFFICIAL_PRESETS[code];
  }

  // Otherwise, dynamically generate standard sections:
  const sections: Section[] = [];
  const ca = Math.round(total * 0.3);
  sections.push({ id: `${code}-ca`, name: "Continuous Assessment", max: ca });

  if (total > 30) {
    const prac = Math.round(total * 0.3);
    sections.push({ id: `${code}-prac`, name: "Practical / Midterm Exam", max: prac });
    sections.push({ id: `${code}-final`, name: "Final Exam", max: total - ca - prac });
  } else {
    sections.push({ id: `${code}-final`, name: "Final Exam", max: total - ca });
  }

  return {
    id: code,
    name: name,
    sections,
    boundaries: {
      A: Math.ceil(total * CUSTOM_PCTS.A),
      B: Math.ceil(total * CUSTOM_PCTS.B),
      C: Math.ceil(total * CUSTOM_PCTS.C),
      D: Math.ceil(total * CUSTOM_PCTS.D),
    },
  };
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
  const { isDark } = useTheme();

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0, 0, 0, 0.04)"}
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
        <span className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white tabular-nums">
          {clamped.toFixed(1)}%
        </span>
        <span className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-white/40 mt-1">{label}</span>
      </div>
    </div>
  );
}

/* ------------------------------ Main component ----------------------------- */

export function MarksCalculator({ onBack, userButton }: { onBack: () => void; userButton?: React.ReactNode }) {

  // Navigation & Selection state loaded from localStorage for persistent user session
  const [selectedPreset, setSelectedPreset] = useState<ModulePreset | null>(() => {
    try {
      const saved = localStorage.getItem('asu_marks_calculator_selected_preset');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [selectedYearTab, setSelectedYearTab] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('asu_marks_calculator_year_tab');
      return saved ? Number(saved) : 2;
    } catch {
      return 2;
    }
  });

  const [selectedSemesterTab, setSelectedSemesterTab] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('asu_marks_calculator_semester_tab');
      return saved ? Number(saved) : 2;
    } catch {
      return 2;
    }
  });

  // Scores inputs mapping
  const [scores, setScores] = useState<Record<string, string>>({});

  // Custom module builder state
  const [customName, setCustomName] = useState(() => {
    try {
      const saved = localStorage.getItem('asu_marks_calculator_custom_name');
      return saved || "My Custom Module";
    } catch {
      return "My Custom Module";
    }
  });

  const [customSections, setCustomSections] = useState<CustomSection[]>(() => {
    try {
      const saved = localStorage.getItem('asu_marks_calculator_custom_sections');
      return saved ? JSON.parse(saved) : [
        { id: nextId(), name: "Continuous Assessment", max: "40" },
        { id: nextId(), name: "Final Exam", max: "60" },
      ];
    } catch {
      return [
        { id: nextId(), name: "Continuous Assessment", max: "40" },
        { id: nextId(), name: "Final Exam", max: "60" },
      ];
    }
  });

  // Effects to save states to localStorage and trigger cloud synchronization
  useEffect(() => {
    if (selectedPreset) {
      localStorage.setItem('asu_marks_calculator_selected_preset', JSON.stringify(selectedPreset));
    } else {
      localStorage.removeItem('asu_marks_calculator_selected_preset');
    }
    import("../hooks/useCloudSync").then(m => m.triggerCloudSync());
  }, [selectedPreset]);

  useEffect(() => {
    localStorage.setItem('asu_marks_calculator_year_tab', String(selectedYearTab));
    import("../hooks/useCloudSync").then(m => m.triggerCloudSync());
  }, [selectedYearTab]);

  useEffect(() => {
    localStorage.setItem('asu_marks_calculator_semester_tab', String(selectedSemesterTab));
    import("../hooks/useCloudSync").then(m => m.triggerCloudSync());
  }, [selectedSemesterTab]);

  useEffect(() => {
    localStorage.setItem('asu_marks_calculator_custom_name', customName);
    import("../hooks/useCloudSync").then(m => m.triggerCloudSync());
  }, [customName]);

  useEffect(() => {
    localStorage.setItem('asu_marks_calculator_custom_sections', JSON.stringify(customSections));
    import("../hooks/useCloudSync").then(m => m.triggerCloudSync());
  }, [customSections]);

  // Load scores for the selected module preset on preset change
  useLayoutEffect(() => {
    if (selectedPreset) {
      try {
        const savedAll = localStorage.getItem('asu_marks_calculator_scores');
        const all = savedAll ? JSON.parse(savedAll) : {};
        const presetScores = all[selectedPreset.id] || {};
        // eslint-disable-next-line react-hooks/set-state-in-effect -- data hydration from localStorage must happen before paint
        setScores(presetScores);
      } catch (e) {
        console.error("Failed to load scores:", e);
      }
    } else {
      setScores({});
    }
  }, [selectedPreset]);

  // Save scores to localStorage and trigger cloud sync when scores change
  useEffect(() => {
    if (!selectedPreset) return;
    try {
      const savedAll = localStorage.getItem('asu_marks_calculator_scores');
      const all = savedAll ? JSON.parse(savedAll) : {};
      
      if (JSON.stringify(all[selectedPreset.id]) !== JSON.stringify(scores)) {
        all[selectedPreset.id] = scores;
        localStorage.setItem('asu_marks_calculator_scores', JSON.stringify(all));
        import("../hooks/useCloudSync").then(m => m.triggerCloudSync());
      }
    } catch (e) {
      console.error("Failed to save scores:", e);
    }
  }, [scores, selectedPreset]);

  // Listen for storage events (e.g. from cloud pull syncing on another device)
  useEffect(() => {
    const handleStorage = () => {
      try {
        const savedPreset = localStorage.getItem('asu_marks_calculator_selected_preset');
        if (savedPreset) {
          const parsedPreset = JSON.parse(savedPreset);
          setSelectedPreset(prev => JSON.stringify(prev) !== JSON.stringify(parsedPreset) ? parsedPreset : prev);
        } else {
          setSelectedPreset(null);
        }
        
        const savedYear = localStorage.getItem('asu_marks_calculator_year_tab');
        if (savedYear) {
          setSelectedYearTab(Number(savedYear));
        }

        const savedSem = localStorage.getItem('asu_marks_calculator_semester_tab');
        if (savedSem) {
          setSelectedSemesterTab(Number(savedSem));
        }

        const savedCustomName = localStorage.getItem('asu_marks_calculator_custom_name');
        if (savedCustomName) {
          setCustomName(savedCustomName);
        }

        const savedCustomSections = localStorage.getItem('asu_marks_calculator_custom_sections');
        if (savedCustomSections) {
          const parsedSections = JSON.parse(savedCustomSections);
          setCustomSections(prev => JSON.stringify(prev) !== JSON.stringify(parsedSections) ? parsedSections : prev);
        }

        const activePreset = savedPreset ? JSON.parse(savedPreset) : null;
        if (activePreset) {
          const savedAll = localStorage.getItem('asu_marks_calculator_scores');
          const all = savedAll ? JSON.parse(savedAll) : {};
          const presetScores = all[activePreset.id] || {};
          setScores(prev => JSON.stringify(prev) !== JSON.stringify(presetScores) ? presetScores : prev);
        }
      } catch (e) {
        console.error("Failed to load synced storage", e);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isCustom = selectedPreset?.id === CUSTOM_ID;

  /* Resolve the active module details */
  const activeModule: ModulePreset = useMemo(() => {
    if (!selectedPreset) {
      return {
        id: "",
        name: "",
        sections: [],
        boundaries: { A: 0, B: 0, C: 0, D: 0 },
      };
    }

    if (selectedPreset.id !== CUSTOM_ID) {
      return selectedPreset;
    }

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
  }, [selectedPreset, customSections, customName]);

  const total = useMemo(
    () => activeModule.sections.reduce((sum, s) => sum + s.max, 0),
    [activeModule],
  );

  /* Core calculator predictions logic */
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
  const selectModulePreset = (preset: ModulePreset) => {
    try {
      const savedAll = localStorage.getItem('asu_marks_calculator_scores');
      const all = savedAll ? JSON.parse(savedAll) : {};
      const presetScores = all[preset.id] || {};
      setScores(presetScores);
    } catch {
      setScores({});
    }
    setSelectedPreset(preset);
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

  const handleCustomize = () => {
    if (!selectedPreset) return;
    setCustomName(selectedPreset.name);
    setCustomSections(
      selectedPreset.sections.map((s) => ({
        id: s.id,
        name: s.name,
        max: String(s.max),
      }))
    );
    // Switch to custom preset mode
    setSelectedPreset({
      id: CUSTOM_ID,
      name: selectedPreset.name,
      sections: selectedPreset.sections,
      boundaries: selectedPreset.boundaries,
    });
  };

  const pctAchieved = total > 0 ? (calc.entered / total) * 100 : 0;

  /* ---------------------------------- Render --------------------------------- */

  return (
    <div className="min-h-screen text-foreground antialiased selection:bg-sky-500/30 transition-colors duration-300">
      {/* Ambient glow background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* VIEW 1: Selection Dashboard */}
        {!selectedPreset ? (
          <div>
            {/* Header */}
            <header className="mb-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  aria-label="Go back to dashboard"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.04] backdrop-blur-xl transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.08] cursor-pointer text-gray-700 dark:text-white"
                >
                  <ArrowLeft size={18} className="text-current" />
                </button>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">ASU Tools</h1>
                  <p className="text-xs text-gray-500 dark:text-white/40">Home · Marks Calculator</p>
                </div>
              </div>
              {userButton && <div className="shrink-0">{userButton}</div>}
            </header>

            {/* Selection Title */}
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 dark:text-sky-400">
                <Calculator size={28} />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-gray-950 via-gray-900 to-gray-700 dark:from-white dark:via-white dark:to-white/60 bg-clip-text text-transparent">
                Marks Calculator & Predictor
              </h2>
              <p className="text-sm text-gray-600 dark:text-white/50 leading-relaxed">
                Choose a module from the official curriculum below to estimate target exam marks required for your desired grade, or construct a custom module.
              </p>
            </div>

            {/* Year Selector Tabs */}
            <div className="flex justify-center border-b border-gray-200 dark:border-white/[0.06] mb-8">
              <div className="flex gap-2 p-1 overflow-x-auto pb-2">
                {[1, 2, 3, 4, 5].map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYearTab(y)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      selectedYearTab === y
                        ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-md font-semibold"
                        : "text-gray-500 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Year {y}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setCustomName("My Custom Module");
                    setCustomSections([
                      { id: nextId(), name: "Continuous Assessment", max: "40" },
                      { id: nextId(), name: "Final Exam", max: "60" },
                    ]);
                    setSelectedPreset({
                      id: CUSTOM_ID,
                      name: "My Custom Module",
                      sections: [
                        { id: "ca", name: "Continuous Assessment", max: 40 },
                        { id: "final", name: "Final Exam", max: 60 },
                      ],
                      boundaries: { A: 85, B: 75, C: 65, D: 60 },
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={15} /> Custom Module
                </button>
              </div>
            </div>

            {/* Semester Selector Toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-full bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] p-1">
                {[1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSemesterTab(s)}
                    className={`rounded-full px-6 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedSemesterTab === s
                        ? "bg-white dark:bg-white/15 text-gray-950 dark:text-white shadow-sm dark:shadow-md border border-gray-200 dark:border-white/10"
                        : "text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70"
                    }`}
                  >
                    Semester {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {(SYLLABUS_MODULES[selectedYearTab]?.[selectedSemesterTab] || []).map((m) => {
                const isOfficialPreset = !!OFFICIAL_PRESETS[m.code];
                return (
                  <button
                    key={m.code}
                    onClick={() => selectModulePreset(getModulePreset(m.code, m.name, m.marks))}
                    className="portal-card text-left bg-card hover:bg-gray-100/50 dark:hover:bg-white/[0.05] rounded-2xl p-5 border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.12] transition-all flex justify-between items-center group cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-sky-700 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-400/10 px-2 py-0.5 rounded">
                          {m.code}
                        </span>
                        {isOfficialPreset ? (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/[0.08] px-2 py-0.5 rounded flex items-center gap-1">
                            <Sparkles size={10} /> Detailed Preset
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-gray-500 dark:text-white/40 bg-gray-100 dark:bg-white/[0.05] px-2 py-0.5 rounded">
                            Standard Predictor
                          </span>
                        )}
                      </div>
                      <h3 className="font-archivo text-base font-bold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors line-clamp-1">
                        {m.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-white/40 font-medium">
                        {m.cp} CP · {m.marks} Marks total
                      </p>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-gray-400 dark:text-white/30 group-hover:text-gray-700 dark:group-hover:text-white/60 group-hover:translate-x-1 transition-all shrink-0"
                    />
                  </button>
                );
              })}
              {(SYLLABUS_MODULES[selectedYearTab]?.[selectedSemesterTab] || []).length === 0 && (
                <div className="col-span-full py-16 text-center text-gray-400 dark:text-white/30 text-sm">
                  No modules configured for this semester yet.
                </div>
              )}
            </div>
          </div>
        ) : (
          
          /* VIEW 2: Calculator Screen */
          <div>
            {/* Header */}
            <header className="mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedPreset(null)}
                  aria-label="Go back to selection screen"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.04] backdrop-blur-xl transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.08] cursor-pointer text-gray-700 dark:text-white"
                >
                  <ArrowLeft size={18} className="text-current" />
                </button>
                <div>
                  <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl text-gray-900 dark:text-white">
                    <Calculator size={22} className="text-sky-500 dark:text-sky-400" />
                    Marks Calculator
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-white/40">
                    {isCustom ? "Custom Builder" : `ASU · Year ${selectedYearTab} · Semester ${selectedSemesterTab}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetScores}
                  className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.04] px-4 py-2 text-sm text-gray-700 dark:text-white/70 backdrop-blur-xl transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.08] cursor-pointer"
                >
                  <RefreshCw size={14} />
                  Reset
                </button>
                {userButton && <div className="shrink-0">{userButton}</div>}
              </div>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* ------------------------------ LEFT: Inputs ------------------------------ */}
              <GlassCard className="p-5 sm:p-6">
                
                {/* Custom builder UI */}
                <AnimatePresence initial={false}>
                  {isCustom && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mb-5 space-y-3 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-secondary p-4">
                        <input
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="Module name"
                          className="w-full rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-black/30 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none transition-colors focus:border-sky-500"
                        />
                        {customSections.map((s) => (
                          <div key={s.id} className="flex items-center gap-2">
                            <input
                              value={s.name}
                              onChange={(e) => updateCustomSection(s.id, { name: e.target.value })}
                              placeholder="Section name"
                              className="min-w-0 flex-1 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-black/30 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-sky-500"
                            />
                            <input
                              value={s.max}
                              onChange={(e) => updateCustomSection(s.id, { max: e.target.value })}
                              placeholder="Max"
                              inputMode="decimal"
                              className="w-20 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-black/30 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-sky-500"
                            />
                            <button
                              onClick={() => removeCustomSection(s.id)}
                              aria-label="Remove section"
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 dark:border-white/[0.06] text-gray-400 dark:text-white/40 transition-colors hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={addCustomSection}
                          className="flex items-center gap-1.5 text-sm text-sky-700 dark:text-sky-400 transition-colors hover:text-sky-600 dark:hover:text-sky-300 cursor-pointer"
                        >
                          <Plus size={15} /> Add section
                        </button>
                        <p className="text-xs text-gray-500 dark:text-white/35">
                          Module total: <span className="font-medium text-gray-700 dark:text-white/70 tabular-nums">{total}</span> marks ·
                          Boundaries auto-set at A ≥85%, B ≥75%, C ≥65%, D ≥60%
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Section score inputs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-950 dark:text-white/80">{activeModule.name}</h2>
                    <span className="text-xs text-gray-500 dark:text-white/35 tabular-nums">Total: {total} marks</span>
                  </div>

                  {activeModule.sections.length === 0 && (
                    <p className="flex items-center gap-2 text-sm text-gray-400 dark:text-white/40">
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
                        className="rounded-xl border border-gray-200 dark:border-white/[0.06] bg-card p-3.5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <label htmlFor={`score-${s.id}`} className="min-w-0 flex-1 truncate text-sm text-gray-800 dark:text-white/70 font-medium">
                            {s.name}
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              id={`score-${s.id}`}
                              value={scores[s.id] ?? ""}
                              onChange={(e) => setScores((p) => ({ ...p, [s.id]: e.target.value }))}
                              placeholder="—"
                              inputMode="decimal"
                              className={`w-20 rounded-lg border bg-white dark:bg-black/30 px-3 py-2 text-right text-sm tabular-nums text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none transition-colors ${
                                error
                                  ? "border-rose-500/50 focus:border-rose-500"
                                  : "border-gray-200 dark:border-white/[0.08] focus:border-sky-500"
                              }`}
                            />
                            <span className="w-12 text-xs text-gray-500 dark:text-white/35 tabular-nums">/ {s.max}</span>
                          </div>
                        </div>
                        <AnimatePresence>
                          {error && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-semibold"
                            >
                              <AlertTriangle size={12} /> {error}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Customize layout button for preset/standard modules */}
                {!isCustom && (
                  <button
                    onClick={handleCustomize}
                    className="mt-6 w-full flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-white/50 hover:text-sky-700 dark:hover:text-sky-400 hover:border-sky-300 dark:hover:border-sky-500/30 transition-all py-3 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-secondary hover:bg-sky-500/5 cursor-pointer"
                  >
                    <Settings size={13} /> Customize Section Layout
                  </button>
                )}
              </GlassCard>

              {/* ------------------------------ RIGHT: Results ----------------------------- */}
              <div className="space-y-6">
                {/* Progress ring */}
                <GlassCard className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-around">
                  <ProgressRing pct={pctAchieved} label="Achieved" />
                  <div className="space-y-2 text-center sm:text-left">
                    <p className="text-sm text-gray-500 dark:text-white/40">Marks entered</p>
                    <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                      {calc.entered}
                      <span className="text-base font-normal text-gray-400 dark:text-white/35"> / {total}</span>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-white/40 tabular-nums">
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
                      <p className="text-[11px] uppercase tracking-widest text-gray-550 dark:text-white/40">{label}</p>
                      <motion.p
                        key={`${label}-${grade}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`my-2 text-4xl font-bold ${GRADE_COLORS[grade]}`}
                      >
                        {grade}
                      </motion.p>
                      <p className="text-[11px] text-gray-400 dark:text-white/35">{hint}</p>
                    </GlassCard>
                  ))}
                </div>

                {/* Target grade cards */}
                <GlassCard className="p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white/80">
                    <Award size={16} className="text-amber-500" /> Target Grades
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
                              ? "border-emerald-500/25 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06]"
                              : status.kind === "out-of-reach"
                                ? "border-rose-500/20 bg-rose-500/[0.02] dark:bg-rose-500/[0.04] opacity-60"
                                : "border-amber-500/20 bg-amber-500/[0.02] dark:bg-amber-500/[0.04]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-xl font-bold ${GRADE_COLORS[g]}`}>{g}</span>
                            <span className="text-xs text-gray-500 dark:text-white/40 tabular-nums">≥ {min} marks</span>
                          </div>
                          <div className="text-right">
                            {status.kind === "achieved" && (
                              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={15} /> Achieved
                              </span>
                            )}
                            {status.kind === "out-of-reach" && (
                              <span className="flex items-center gap-1.5 text-sm font-medium text-rose-600 dark:text-rose-400">
                                <AlertTriangle size={15} /> Out of Reach
                              </span>
                            )}
                            {status.kind === "possible" && (
                              <div className="text-sm">
                                <span className="font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                                  +{status.marksNeeded} marks needed
                                </span>
                                <p className="text-xs text-gray-500 dark:text-white/40 tabular-nums">
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
        )}
      </div>
    </div>
  );
}
