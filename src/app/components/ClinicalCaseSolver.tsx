// src/app/components/ClinicalCaseSolver.tsx
// ASU Medical Portal — Interactive clinical case simulator.

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity, Clock, Heart, Check, X,
  ArrowRight, ArrowLeft, Award, FileText,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { PortalShell } from "./PortalShell";

/* ================================ Theme Resolvers ========================== */

interface ThemeColors {
  bg: string;
  glass: string;
  glassBorder: string;
  hairline: string;
  glassShadow: string;
  text: string;
  sub: string;
  faint: string;
  teal: string;
  purple: string;
  amber: string;
  red: string;
  font: string;
  mono: string;
}

const getT = (themeMode: "light" | "dark"): ThemeColors => {
  const isDark = themeMode === "dark";
  return {
    bg: "transparent",
    glass: isDark ? "rgba(18,18,20,0.55)" : "rgba(255,255,255,0.75)",
    glassBorder: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(24,24,27,0.08)",
    hairline: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(24,24,27,0.06)",
    glassShadow: isDark ? "0 24px 64px rgba(0,0,0,0.45)" : "0 24px 64px rgba(0,0,0,0.08)",
    text: isDark ? "rgba(255,255,255,0.92)" : "rgba(24,24,27,0.92)",
    sub: isDark ? "rgba(255,255,255,0.55)" : "rgba(24,24,27,0.65)",
    faint: isDark ? "rgba(255,255,255,0.32)" : "rgba(24,24,27,0.42)",
    teal: isDark ? "#2dd4bf" : "#0d9488",
    purple: isDark ? "#a855f7" : "#7c3aed",
    amber: isDark ? "#fbbf24" : "#d97706",
    red: isDark ? "#f87171" : "#dc2626",
    font: `-apple-system, "SF Pro Display", "SF Pro Text", Inter, sans-serif`,
    mono: `"SF Mono", ui-monospace, Menlo, monospace`,
  };
};

/* ============================== Case Data Definitions ======================= */

type Severity = "normal" | "warn" | "critical";

interface Vital { label: string; value: string; unit: string; severity: Severity }
interface Differential { id: string; name: string; hint: string }
interface LabTest {
  id: string; name: string; cost: number; delayMin: number;
  result: string; range: string; flag: Severity; trend: "up" | "down" | "flat";
}
interface Treatment { id: string; name: string; detail: string; correct: boolean }

interface CaseData {
  id: string;
  code: string;
  patient: {
    name: string;
    age: number;
    gender: string;
    complaint: string;
  };
  vitals: Vital[];
  differentials: Differential[];
  correctDx: string;
  tests: LabTest[];
  keyTests: string[];
  treatments: Treatment[];
  diagnosisName: string;
  diagnosisExplanation: string;
  imageUrl: string;
}

const CASES: CaseData[] = [
  {
    id: "hypo_mona",
    code: "Case 014 — Endocrine",
    patient: {
      name: "Mona El-Sayed",
      age: 45,
      gender: "Female",
      complaint: "Severe fatigue, 8 kg weight gain over 6 months, cold intolerance, and a sluggish heart rate.",
    },
    vitals: [
      { label: "Heart Rate", value: "52", unit: "bpm", severity: "critical" },
      { label: "Blood Pressure", value: "104/68", unit: "mmHg", severity: "normal" },
      { label: "Temperature", value: "35.9", unit: "°C", severity: "warn" },
      { label: "O₂ Saturation", value: "97", unit: "%", severity: "normal" },
    ],
    differentials: [
      { id: "hypo", name: "Primary Hypothyroidism", hint: "Cold intolerance, bradycardia, weight gain" },
      { id: "anemia", name: "Anemia", hint: "Fatigue, but lacks pallor / tachycardia" },
      { id: "mdd", name: "Major Depression", hint: "Fatigue and weight change overlap" },
      { id: "pit", name: "Hypopituitarism", hint: "Central cause; check axis hormones" },
      { id: "cfs", name: "Chronic Fatigue Syndrome", hint: "Diagnosis of exclusion" },
      { id: "chf", name: "Congestive Heart Failure", hint: "Fatigue, but no edema / dyspnea" },
    ],
    correctDx: "hypo",
    tests: [
      { id: "tsh", name: "Serum TSH", cost: 20, delayMin: 30, result: "18.5 mIU/L", range: "0.4 – 4.0", flag: "critical", trend: "up" },
      { id: "ft4", name: "Free T4", cost: 25, delayMin: 30, result: "0.5 ng/dL", range: "0.8 – 1.8", flag: "warn", trend: "down" },
      { id: "cbc", name: "CBC", cost: 15, delayMin: 20, result: "Hb 12.8 g/dL", range: "12.0 – 15.5", flag: "normal", trend: "flat" },
      { id: "ekg", name: "EKG", cost: 35, delayMin: 15, result: "Sinus bradycardia, 52 bpm", range: "60 – 100 bpm", flag: "warn", trend: "down" },
      { id: "lipid", name: "Lipid Profile", cost: 20, delayMin: 45, result: "LDL 168 mg/dL", range: "< 130", flag: "warn", trend: "up" },
      { id: "cxr", name: "Chest X-ray", cost: 50, delayMin: 60, result: "No acute findings", range: "—", flag: "normal", trend: "flat" },
    ],
    keyTests: ["tsh", "ft4"],
    treatments: [
      { id: "levo", name: "Levothyroxine Replacement", detail: "Start 50 µg daily, titrate to TSH", correct: true },
      { id: "beta", name: "Beta-blockers", detail: "Rate control", correct: false },
      { id: "iron", name: "Iron Supplements", detail: "Empiric ferrous sulfate", correct: false },
      { id: "diet", name: "Diet & Exercise Counseling", detail: "Lifestyle adjunct", correct: true },
    ],
    diagnosisName: "Primary Hypothyroidism secondary to Hashimoto's Thyroiditis",
    diagnosisExplanation: "Markedly elevated TSH (18.5 mIU/L) with low Free T4 confirms primary gland failure. The bradycardia, hypothermia, and weight gain resolve with levothyroxine titration; anti-TPO antibodies would confirm the autoimmune etiology.",
    imageUrl: "/cases/thyroid_ultrasound.png",
  },
  {
    id: "dka_youssef",
    code: "Case 029 — Metabolic",
    patient: {
      name: "Youssef Ibrahim",
      age: 19,
      gender: "Male",
      complaint: "Deep, rapid breathing (Kussmaul), abdominal pain, nausea, confusion, and extreme thirst for 2 days.",
    },
    vitals: [
      { label: "Heart Rate", value: "122", unit: "bpm", severity: "critical" },
      { label: "Blood Pressure", value: "95/60", unit: "mmHg", severity: "warn" },
      { label: "Temperature", value: "37.8", unit: "°C", severity: "normal" },
      { label: "O₂ Saturation", value: "99", unit: "%", severity: "normal" },
    ],
    differentials: [
      { id: "dka", name: "Diabetic Ketoacidosis", hint: "High blood glucose, metabolic acidosis, ketonuria" },
      { id: "app", name: "Acute Appendicitis", hint: "Abdominal pain, but lacks metabolic hyperventilation" },
      { id: "tox", name: "Salicylate Toxicity", hint: "Acidosis, but blood glucose is typically normal" },
      { id: "hhs", name: "Hyperosmolar State", hint: "Extreme glucose, but no severe acidosis/ketones" },
      { id: "pan", name: "Acute Pancreatitis", hint: "Severe abdominal pain, but no primary ketosis" },
      { id: "gas", name: "Gastroenteritis", hint: "Vomiting, but lacks metabolic air hunger" },
    ],
    correctDx: "dka",
    tests: [
      { id: "gluc", name: "Serum Glucose", cost: 10, delayMin: 15, result: "420 mg/dL", range: "70 – 100", flag: "critical", trend: "up" },
      { id: "ph", name: "Arterial pH", cost: 25, delayMin: 20, result: "7.15", range: "7.35 – 7.45", flag: "critical", trend: "down" },
      { id: "ket", name: "Serum Ketones", cost: 15, delayMin: 15, result: "Strongly positive", range: "Negative", flag: "critical", trend: "up" },
      { id: "bicarb", name: "Serum Bicarbonate", cost: 15, delayMin: 20, result: "10 mEq/L", range: "22 – 28", flag: "critical", trend: "down" },
      { id: "cbc", name: "CBC", cost: 15, delayMin: 20, result: "WBC 14,000/µL", range: "4,000 – 11,000", flag: "warn", trend: "up" },
      { id: "ua", name: "Urine Analysis", cost: 15, delayMin: 15, result: "Glucosuria (4+), Ketonuria (4+)", range: "Negative", flag: "critical", trend: "up" },
    ],
    keyTests: ["gluc", "ph", "ket"],
    treatments: [
      { id: "ns", name: "IV Fluids (Normal Saline)", detail: "Aggressive isotonic fluid resuscitation", correct: true },
      { id: "ins", name: "Continuous IV Insulin", detail: "0.1 U/kg/h to suppress ketogenesis", correct: true },
      { id: "k", name: "Potassium Replacement", detail: "Replace once K+ < 5.2 mEq/L to prevent arrhythmia", correct: true },
      { id: "hco3", name: "Sodium Bicarbonate IV", detail: "Indicated only if pH < 6.9", correct: false },
    ],
    diagnosisName: "Diabetic Ketoacidosis (DKA)",
    diagnosisExplanation: "Severe hyperglycemia (420 mg/dL), metabolic acidosis (pH 7.15, Bicarb 10), and ketonuria confirm DKA. The primary triggers are often missed insulin doses or underlying infection. Fluid resuscitation and insulin infusion are vital to clear ketosis; potassium replacement must be started promptly as insulin shifts potassium intracellularly.",
    imageUrl: "/cases/dka_monitor.png",
  },
  {
    id: "cush_sarah",
    code: "Case 053 — Adrenal",
    patient: {
      name: "Sarah Mansour",
      age: 32,
      gender: "Female",
      complaint: "Progressive weight gain in the face ('moon face') and upper back ('buffalo hump'), purple abdominal stretch marks, and new onset hypertension.",
    },
    vitals: [
      { label: "Heart Rate", value: "78", unit: "bpm", severity: "normal" },
      { label: "Blood Pressure", value: "152/96", unit: "mmHg", severity: "critical" },
      { label: "Temperature", value: "36.8", unit: "°C", severity: "normal" },
      { label: "O₂ Saturation", value: "98", unit: "%", severity: "normal" },
    ],
    differentials: [
      { id: "cush", name: "Cushing's Syndrome", hint: "Centripetal obesity, striae, cortisol excess" },
      { id: "pcos", name: "PCOS", hint: "Hirsutism and obesity, but lacks severe hypercortisolism signs" },
      { id: "met", name: "Metabolic Syndrome", hint: "Obesity and hypertension, but normal cortisol suppression" },
      { id: "pheo", name: "Pheochromocytoma", hint: "Hypertension is paroxysmal with headache/sweating" },
      { id: "hypo", name: "Primary Hypothyroidism", hint: "Weight gain and fatigue, but lacks purple striae" },
      { id: "hyper", name: "Essential Hypertension", hint: "High blood pressure without systemic endocrine signs" },
    ],
    correctDx: "cush",
    tests: [
      { id: "cort", name: "24h Urinary Free Cortisol", cost: 30, delayMin: 60, result: "240 µg/24h", range: "10 – 50", flag: "critical", trend: "up" },
      { id: "dex", name: "Low-Dose Dexamethasone suppression", cost: 35, delayMin: 45, result: "Cortisol 12 µg/dL (No suppression)", range: "< 1.8", flag: "critical", trend: "up" },
      { id: "acth", name: "Plasma ACTH", cost: 25, delayMin: 30, result: "2.1 pg/mL (Suppressed)", range: "6 – 50", flag: "warn", trend: "down" },
      { id: "ct", name: "Adrenal CT Scan", cost: 60, delayMin: 40, result: "Right adrenal mass, 3.2 cm", range: "Normal adrenals", flag: "critical", trend: "up" },
      { id: "k", name: "Serum Potassium", cost: 15, delayMin: 20, result: "3.2 mEq/L", range: "3.5 – 5.0", flag: "warn", trend: "down" },
      { id: "a1c", name: "HbA1c", cost: 20, delayMin: 30, result: "6.2% (Prediabetes)", range: "< 5.7%", flag: "warn", trend: "up" },
    ],
    keyTests: ["cort", "dex", "ct"],
    treatments: [
      { id: "surg", name: "Right Adrenalectomy", detail: "Surgical removal of the hyperfunctioning adenoma", correct: true },
      { id: "keto", name: "Ketoconazole therapy", detail: "Medical suppression of cortisol pre-operatively", correct: true },
      { id: "spiro", name: "Spironolactone", detail: "Aldosterone antagonist to treat hypokalemia & BP", correct: true },
      { id: "hydro", name: "High-dose Hydrocortisone", detail: "Physiologic replacement, started intra-operatively", correct: true },
    ],
    diagnosisName: "ACTH-Independent Cushing's Syndrome (Adrenal Adenoma)",
    diagnosisExplanation: "Elevated urinary free cortisol and failure to suppress on dexamethasone confirm Cushing's Syndrome. The low/suppressed ACTH level (2.1 pg/mL) indicates an adrenal origin rather than a pituitary source. The adrenal CT scan localized a 3.2 cm right adrenal adenoma. Adrenalectomy is the curative therapy, and potassium correction with spironolactone helps stabilize the patient.",
    imageUrl: "/cases/cushings_ct.png",
  },
];

/* ============================ Motion variants ============================= */

const stageMotion = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.06 } },
  exit: { x: -20, opacity: 0, transition: { duration: 0.25 } },
};

const item = {
  initial: { y: 14, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const sevColor = (s: Severity, T: ThemeColors) => (s === "critical" ? T.red : s === "warn" ? T.amber : T.teal);

/* ============================== Primitives ================================ */

function SectionTitle({ icon: Icon, color, children }: {
  icon: React.ElementType; color: string; children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const T = getT(theme);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18 }}>
      <Icon size={15} color={color} strokeWidth={2.2} />
      <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: T.sub }}>
        {children}
      </span>
    </div>
  );
}

function PillButton({ children, onClick, disabled, variant = "ghost" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; variant?: "ghost" | "solid";
}) {
  const { theme } = useTheme();
  const T = getT(theme);
  const solid = variant === "solid";
  const isDark = theme === "dark";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      animate={{ opacity: disabled ? 0.35 : 1 }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: solid ? "13px 26px" : "12px 20px", borderRadius: 999,
        border: solid ? "none" : `1px solid ${isDark ? "rgba(255,255,255,0.14)" : "rgba(24,24,27,0.14)"}`,
        background: solid ? (isDark ? "#fff" : "#18181b") : "transparent",
        color: solid ? (isDark ? "#0b0b0c" : "#fff") : T.sub,
        fontFamily: T.font, fontSize: 14, fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </motion.button>
  );
}

/* ============================ Vitals monitor ============================== */

function EcgWaveform() {
  const { theme } = useTheme();
  const T = getT(theme);
  const isDark = theme === "dark";
  const beat = "h14 l4 -5 l4 5 h8 l5 -26 l6 40 l5 -14 h10 q6 0 9 -6 q3 6 9 6 h14";
  const d = `M0 40 ${beat.repeat(20)}`;

  // Define grid line colors matching the theme
  const gridColor = isDark ? "rgba(45, 212, 191, 0.08)" : "rgba(13, 148, 136, 0.06)";
  const majorGridColor = isDark ? "rgba(45, 212, 191, 0.18)" : "rgba(13, 148, 136, 0.15)";

  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      borderRadius: 12,
      height: 80,
      background: isDark ? "rgba(0, 0, 0, 0.15)" : "rgba(0, 0, 0, 0.02)",
      border: T.hairline
    }}>
      <svg
        width="100%" height="100%" viewBox="0 0 880 80" preserveAspectRatio="none" fill="none"
      >
        <defs>
          <pattern id="ecg-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke={gridColor} strokeWidth="0.5" />
          </pattern>
          <pattern id="ecg-grid-major" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke={majorGridColor} strokeWidth="1" />
          </pattern>
          
          <linearGradient id="portal-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000" />
            <stop offset="4%" stopColor="#fff" />
            <stop offset="96%" stopColor="#fff" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
          
          <mask id="portal-mask">
            <rect width="880" height="80" fill="url(#portal-grad)" />
          </mask>
        </defs>

        {/* Grid Background */}
        <rect width="880" height="80" fill="url(#ecg-grid)" />
        <rect width="880" height="80" fill="url(#ecg-grid-major)" />

        {/* Masked Wave */}
        <g mask="url(#portal-mask)">
          <motion.g
            animate={{ x: [0, -880] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
          >
            {/* Soft Glow Underlay */}
            <path d={d} stroke={T.teal} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round"
              style={{ filter: `blur(4px)`, opacity: 0.35 }} />
            
            {/* Sharp Main Line */}
            <path d={d} stroke={T.teal} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 4px ${T.teal})` }} />
          </motion.g>
        </g>
      </svg>
    </div>
  );
}

function VitalsMonitor({ currentCase }: { currentCase: CaseData }) {
  const { theme } = useTheme();
  const T = getT(theme);
  const isDark = theme === "dark";
  const glassCard = {
    background: T.glass,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: T.glassBorder,
    borderRadius: 22,
    boxShadow: T.glassShadow,
  };
  return (
    <div style={{ ...glassCard, padding: 24 }}>
      <SectionTitle icon={Activity} color={T.teal}>Vitals Monitor</SectionTitle>
      <EcgWaveform />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 12, marginTop: 18 }}>
        {currentCase.vitals.map((v) => (
          <motion.div key={v.label} variants={item}
            style={{ padding: "12px 14px", borderRadius: 14, background: isDark ? "rgba(255,255,255,0.025)" : "rgba(24,24,27,0.035)", border: T.hairline }}>
            <p style={{ margin: 0, fontSize: 10.5, letterSpacing: 0.6, textTransform: "uppercase", color: T.faint }}>{v.label}</p>
            <motion.p
              animate={v.severity !== "normal" ? { opacity: [1, 0.55, 1] } : undefined}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{ margin: "6px 0 0", fontFamily: T.mono, fontSize: 19, fontWeight: 600, color: sevColor(v.severity, T), fontVariantNumeric: "tabular-nums" }}
            >
              {v.value}<span style={{ fontSize: 11, color: T.faint, marginLeft: 4 }}>{v.unit}</span>
            </motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ================================ Stages ================================== */

function StagePresentation({ currentCase }: { currentCase: CaseData }) {
  const { theme } = useTheme();
  const T = getT(theme);
  const glassCard = {
    background: T.glass,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: T.glassBorder,
    borderRadius: 22,
    boxShadow: T.glassShadow,
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div style={{ display: "grid", gap: 18 }}>
        <motion.div variants={item} style={{ ...glassCard, padding: 28 }}>
          <SectionTitle icon={FileText} color={T.purple}>Patient Presentation</SectionTitle>
          <h2 style={{ margin: 0, fontSize: 21, fontWeight: 650, letterSpacing: -0.3 }}>{currentCase.patient.name}</h2>
          <p style={{ margin: "6px 0 14px", fontSize: 13, color: T.sub }}>
            {currentCase.patient.age} years • {currentCase.patient.gender}
          </p>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: T.text }}>
            <span style={{ color: T.faint }}>Chief complaint — </span>{currentCase.patient.complaint}
          </p>
        </motion.div>
        <motion.div variants={item}><VitalsMonitor currentCase={currentCase} /></motion.div>
      </div>

      <motion.div
        variants={item}
        style={{
          ...glassCard,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          border: T.glassBorder,
        }}
      >
        <div style={{ padding: "20px 24px 12px" }}>
          <SectionTitle icon={Activity} color={T.purple}>Case Scan Reference</SectionTitle>
        </div>
        <div style={{ flex: 1, position: "relative", minHeight: 280, background: "rgba(0,0,0,0.15)" }}>
          <img
            src={currentCase.imageUrl}
            alt="Clinical scan mockup"
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              inset: 0,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

function StageDifferentials({ currentCase, ranked, setRanked }: {
  currentCase: CaseData; ranked: string[]; setRanked: (r: string[]) => void;
}) {
  const { theme } = useTheme();
  const T = getT(theme);
  const isDark = theme === "dark";
  const glassCard = {
    background: T.glass,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: T.glassBorder,
    borderRadius: 22,
    boxShadow: T.glassShadow,
  };
  const toggle = (id: string) =>
    setRanked(ranked.includes(id) ? ranked.filter((r) => r !== id)
      : ranked.length < 3 ? [...ranked, id] : ranked);

  const ordinal = ["1st", "2nd", "3rd"];

  return (
    <div style={{ ...glassCard, padding: 28 }}>
      <SectionTitle icon={Heart} color={T.purple}>Differential Diagnosis — pin your top 3 in order</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 14 }}>
        {currentCase.differentials.map((d) => {
          const rank = ranked.indexOf(d.id);
          const selected = rank !== -1;
          return (
            <motion.button
              key={d.id} type="button" variants={item}
              onClick={() => toggle(d.id)}
              whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              style={{
                position: "relative", textAlign: "left", padding: "18px 18px",
                borderRadius: 16, fontFamily: T.font, cursor: "pointer",
                background: selected ? (isDark ? "rgba(45,212,191,0.06)" : "rgba(13,148,136,0.06)") : (isDark ? "rgba(255,255,255,0.025)" : "rgba(24,24,27,0.03)"),
                border: `1px solid ${selected ? T.teal : (isDark ? "rgba(255,255,255,0.10)" : "rgba(24,24,27,0.12)")}`,
                color: T.text,
              }}
            >
              {selected && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 24 }}
                  style={{
                    position: "absolute", top: -9, right: -9, width: 30, height: 30,
                    display: "grid", placeItems: "center", borderRadius: "50%",
                    background: T.teal, color: isDark ? "#0b0b0c" : "#fff", fontSize: 11, fontWeight: 700,
                  }}
                >
                  {ordinal[rank]}
                </motion.span>
              )}
              <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600 }}>{d.name}</p>
              <p style={{ margin: "6px 0 0", fontSize: 12, lineHeight: 1.5, color: T.sub }}>{d.hint}</p>
            </motion.button>
          );
        })}
      </div>
      <p style={{ margin: "18px 0 0", fontSize: 12.5, color: T.faint }}>
        {ranked.length} / 3 differentials pinned
      </p>
    </div>
  );
}

function TrendArrow({ trend, color }: { trend: LabTest["trend"]; color: string }) {
  const { theme } = useTheme();
  const T = getT(theme);
  if (trend === "flat") return <span style={{ color: T.faint, fontSize: 11 }}>—</span>;
  return (
    <span style={{ color, fontSize: 11, fontWeight: 700 }}>
      {trend === "up" ? "▲" : "▼"}
    </span>
  );
}

function StageInvestigations({ currentCase, ordered, setOrdered, ran, setRan }: {
  currentCase: CaseData; ordered: string[]; setOrdered: (o: string[]) => void;
  ran: boolean; setRan: (r: boolean) => void;
}) {
  const { theme } = useTheme();
  const T = getT(theme);
  const isDark = theme === "dark";
  const glassCard = {
    background: T.glass,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: T.glassBorder,
    borderRadius: 22,
    boxShadow: T.glassShadow,
  };
  const toggle = (id: string) =>
    !ran && setOrdered(ordered.includes(id) ? ordered.filter((o) => o !== id) : [...ordered, id]);

  const cost = ordered.reduce((s, id) => s + currentCase.tests.find((t) => t.id === id)!.cost, 0);
  const delay = ordered.reduce((s, id) => s + currentCase.tests.find((t) => t.id === id)!.delayMin, 0);
  const results = currentCase.tests.filter((t) => ordered.includes(t.id));

  return (
    <div style={{ ...glassCard, padding: 28 }}>
      <SectionTitle icon={Clock} color={T.purple}>Investigations Panel</SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: ran ? "repeat(auto-fit, minmax(280px, 1fr))" : "1fr", gap: 24 }}>
        {/* Left: checklist / tests run */}
        <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
          {(ran ? results : currentCase.tests).map((t) => {
            const on = ordered.includes(t.id);
            return (
              <motion.button
                key={t.id} type="button" variants={item}
                onClick={() => toggle(t.id)}
                whileHover={ran ? undefined : { scale: 1.015 }}
                whileTap={ran ? undefined : { scale: 0.98 }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  padding: "13px 16px", borderRadius: 13, fontFamily: T.font,
                  background: on ? (isDark ? "rgba(168,85,247,0.08)" : "rgba(124,58,237,0.08)") : (isDark ? "rgba(255,255,255,0.025)" : "rgba(24,24,27,0.03)"),
                  border: `1px solid ${on ? (isDark ? "rgba(168,85,247,0.5)" : "rgba(124,58,237,0.5)") : (isDark ? "rgba(255,255,255,0.10)" : "rgba(24,24,27,0.12)")}`,
                  color: T.text, cursor: ran ? "default" : "pointer", textAlign: "left",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: 6, display: "grid", placeItems: "center",
                    border: `1px solid ${on ? T.purple : (isDark ? "rgba(255,255,255,0.2)" : "rgba(24,24,27,0.2)")}`,
                    background: on ? T.purple : "transparent",
                  }}>
                    {on && <Check size={12} color={isDark ? "#0b0b0c" : "#fff"} strokeWidth={3} />}
                  </span>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{t.name}</span>
                </span>
                {!ran && (
                  <span style={{ fontSize: 11, color: T.faint, fontFamily: T.mono }}>
                    {t.cost} pts · {t.delayMin}m
                  </span>
                )}
              </motion.button>
            );
          })}

          <motion.div variants={item} style={{
            display: "flex", justifyContent: "space-between", padding: "12px 4px 0",
            fontSize: 12.5, color: T.sub, borderTop: T.hairline, marginTop: 6,
          }}>
            <span>Resource cost: <b style={{ color: cost > 90 ? T.amber : T.text }}>{cost} pts</b></span>
            <span>Delay: <b style={{ color: T.text }}>{delay} min</b></span>
          </motion.div>

          {!ran && (
            <motion.div variants={item} style={{ marginTop: 8 }}>
              <PillButton variant="solid" disabled={ordered.length === 0} onClick={() => setRan(true)}>
                Run Selected Tests <ArrowRight size={14} />
              </PillButton>
            </motion.div>
          )}
        </div>

        {/* Right: lab report */}
        <AnimatePresence>
          {ran && (
            <motion.div
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ borderLeft: T.hairline, paddingLeft: 24 }}
            >
              <p style={{ margin: "0 0 14px", fontSize: 11.5, letterSpacing: 1.2, textTransform: "uppercase", color: T.faint }}>
                Laboratory Report
              </p>
              <div style={{ display: "grid", gap: 2 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr auto", gap: 10, padding: "8px 12px", fontSize: 10.5, letterSpacing: 0.6, textTransform: "uppercase", color: T.faint }}>
                  <span>Test</span><span>Result</span><span>Reference</span><span />
                </div>
                {results.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    style={{
                      display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr auto", gap: 10,
                      alignItems: "center", padding: "12px", borderRadius: 11,
                      background: t.flag !== "normal" ? `${sevColor(t.flag, T)}0d` : (isDark ? "rgba(255,255,255,0.02)" : "rgba(24,24,27,0.02)"),
                      border: `1px solid ${t.flag !== "normal" ? `${sevColor(t.flag, T)}33` : (isDark ? "rgba(255,255,255,0.05)" : "rgba(24,24,27,0.05)")}`,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 12.5, color: sevColor(t.flag, T), fontWeight: 600 }}>{t.result}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 11.5, color: T.faint }}>{t.range}</span>
                    <TrendArrow trend={t.trend} color={sevColor(t.flag, T)} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* =================------------- Outcome rings =================------------- */

function Ring({ percent, color, label, display, size = 120, stroke = 9, delay = 0 }: {
  percent: number; color: string; label: string; display: string;
  size?: number; stroke?: number; delay?: number;
}) {
  const { theme } = useTheme();
  const T = getT(theme);
  const isDark = theme === "dark";
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <motion.div variants={item} style={{ display: "grid", justifyItems: "center", gap: 10 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={isDark ? "rgba(255,255,255,0.07)" : "rgba(24,24,27,0.07)"} strokeWidth={stroke} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c - (c * percent) / 100 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay }}
            style={{ filter: `drop-shadow(0 0 8px ${color}55)` }}
          />
        </svg>
        <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: T.text }}>
          {display}
        </span>
      </div>
      <span style={{ fontSize: 11.5, letterSpacing: 0.8, textTransform: "uppercase", color: T.sub, textAlign: "center" }}>{label}</span>
    </motion.div>
  );
}

function StageOutcome({ currentCase, ranked, ordered, prescribed, setPrescribed, submitted, setSubmitted, onBack, onRestart }: {
  currentCase: CaseData; ranked: string[]; ordered: string[];
  prescribed: string[]; setPrescribed: (p: string[]) => void;
  submitted: boolean; setSubmitted: (s: boolean) => void;
  onBack?: () => void; onRestart: () => void;
}) {
  const { theme } = useTheme();
  const T = getT(theme);
  const isDark = theme === "dark";
  const glassCard = {
    background: T.glass,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: T.glassBorder,
    borderRadius: 22,
    boxShadow: T.glassShadow,
  };

  /* ---- Scoring ---- */
  const scores = useMemo(() => {
    const rank = ranked.indexOf(currentCase.correctDx);
    const dxScore = rank === 0 ? 100 : rank === 1 ? 75 : rank === 2 ? 50 : 20;

    const keyHits = currentCase.keyTests.filter((k) => ordered.includes(k)).length;
    const waste = ordered.filter((id) => !currentCase.keyTests.includes(id) && id !== "ekg" && id !== "k" && id !== "ua").length;
    const effScore = Math.max(0, Math.min(100, keyHits * 35 + (ordered.length > 0 ? 15 : 0) - waste * 12));

    const rxRight = prescribed.filter((p) => currentCase.treatments.find((t) => t.id === p)!.correct).length;
    const rxWrong = prescribed.length - rxRight;
    const rxScore = Math.max(0, Math.min(100, rxRight * 35 - rxWrong * 20 + 30));

    const composite = dxScore * 0.4 + effScore * 0.3 + rxScore * 0.3;
    const grade = composite >= 80 ? "A" : composite >= 60 ? "B" : "C";
    return { dxScore, effScore, grade, gradePct: composite };
  }, [currentCase, ranked, ordered, prescribed]);

  const toggleRx = (id: string) =>
    !submitted && setPrescribed(prescribed.includes(id) ? prescribed.filter((p) => p !== id) : [...prescribed, id]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      {/* Prescription picker */}
      <motion.div variants={item} style={{ ...glassCard, padding: 28 }}>
        <SectionTitle icon={Heart} color={T.teal}>Treatment Plan</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 12 }}>
          {currentCase.treatments.map((tx) => {
            const on = prescribed.includes(tx.id);
            const verdict = submitted ? (tx.correct ? T.teal : on ? T.red : (isDark ? "rgba(255,255,255,0.10)" : "rgba(24,24,27,0.12)")) : on ? T.teal : (isDark ? "rgba(255,255,255,0.10)" : "rgba(24,24,27,0.12)");
            return (
              <motion.button
                key={tx.id} type="button"
                onClick={() => toggleRx(tx.id)}
                whileHover={submitted ? undefined : { scale: 1.02 }}
                whileTap={submitted ? undefined : { scale: 0.97 }}
                style={{
                  textAlign: "left", padding: "16px 18px", borderRadius: 15, fontFamily: T.font,
                  background: on ? (isDark ? "rgba(45,212,191,0.05)" : "rgba(13,148,136,0.05)") : (isDark ? "rgba(255,255,255,0.025)" : "rgba(24,24,27,0.03)"),
                  border: `1px solid ${verdict}`, color: T.text,
                  cursor: submitted ? "default" : "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{tx.name}</span>
                  {submitted && (tx.correct
                    ? <Check size={15} color={T.teal} strokeWidth={2.6} />
                    : on && <X size={15} color={T.red} strokeWidth={2.6} />)}
                </div>
                <p style={{ margin: "5px 0 0", fontSize: 12, color: T.sub }}>{tx.detail}</p>
              </motion.button>
            );
          })}
        </div>
        {!submitted && (
          <div style={{ marginTop: 20 }}>
            <PillButton variant="solid" disabled={prescribed.length === 0} onClick={() => setSubmitted(true)}>
              Submit Plan <Check size={14} />
            </PillButton>
          </div>
        )}
      </motion.div>

      {/* Resolution + scorecard */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            variants={{
              initial: { y: 24, opacity: 0 },
              animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 } },
              exit: { y: 24, opacity: 0, transition: { duration: 0.3 } }
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ display: "grid", gap: 18 }}
          >
            <div style={{
              ...glassCard, padding: 26,
              border: `1px solid ${isDark ? "rgba(45,212,191,0.35)" : "rgba(13,148,136,0.35)"}`,
              background: isDark ? "linear-gradient(135deg, rgba(45,212,191,0.10), rgba(18,18,20,0.55))" : "linear-gradient(135deg, rgba(13,148,136,0.10), rgba(255,255,255,0.75))",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Award size={16} color={T.teal} />
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: T.teal }}>
                  Diagnostic Resolution
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: 19, fontWeight: 650, letterSpacing: -0.3 }}>
                {currentCase.diagnosisName}
              </h3>
              <p style={{ margin: "10px 0 0", fontSize: 13.5, lineHeight: 1.65, color: T.sub }}>
                {currentCase.diagnosisExplanation}
              </p>
            </div>

            <div style={{ ...glassCard, padding: "30px 26px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
              <Ring percent={scores.dxScore} color={T.teal} label="Diagnostic Accuracy" display={`${scores.dxScore}%`} delay={0.1} />
              <Ring percent={scores.effScore} color={T.purple} label="Resource Efficiency" display={`${scores.effScore}%`} delay={0.25} />
              <Ring percent={scores.gradePct} color={T.amber} label="Critical Thinking" display={scores.grade} delay={0.4} />
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <PillButton onClick={onRestart}>Solve Another Case</PillButton>
              {onBack && <PillButton variant="solid" onClick={onBack}>Back to Dashboard <ArrowRight size={14} /></PillButton>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================== Main export =============================== */

const STAGE_LABELS = ["Presentation", "Differentials", "Investigations", "Treatment"];

export function ClinicalCaseSolver({ onBack, userButton }: { onBack?: () => void; userButton?: React.ReactNode }) {
  const { theme } = useTheme();
  const T = getT(theme);
  const isDark = theme === "dark";

  // Select a random case index on mount
  const [currentCaseIndex, setCurrentCaseIndex] = useState(() => Math.floor(Math.random() * CASES.length));
  
  const [stage, setStage] = useState(0);
  const [ranked, setRanked] = useState<string[]>([]);
  const [ordered, setOrdered] = useState<string[]>([]);
  const [ran, setRan] = useState(false);
  const [prescribed, setPrescribed] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const currentCase = CASES[currentCaseIndex];

  const canAdvance =
    stage === 0 ? true :
    stage === 1 ? ranked.length === 3 :
    stage === 2 ? ran : false;

  const restart = () => {
    // Pick a different random case to ensure uniqueness on next play
    let nextIdx = currentCaseIndex;
    if (CASES.length > 1) {
      while (nextIdx === currentCaseIndex) {
        nextIdx = Math.floor(Math.random() * CASES.length);
      }
    }
    setCurrentCaseIndex(nextIdx);
    setStage(0); 
    setRanked([]); 
    setOrdered([]); 
    setRan(false);
    setPrescribed([]); 
    setSubmitted(false);
  };

  const crumbs = [{ label: "Portal", onClick: onBack }, { label: "Case Solver" }];

  return (
    <PortalShell crumbs={crumbs} userButton={userButton}>
      <main style={{
        minHeight: "100vh", background: T.bg, fontFamily: T.font, color: T.text,
        padding: "clamp(24px, 4vw, 56px)", WebkitFontSmoothing: "antialiased", overflowX: "hidden",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Header + stepper */}
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 30 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div>
                <h1 style={{ margin: "4px 0 0", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 700, letterSpacing: -0.6 }}>
                  {currentCase.code}
                </h1>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {STAGE_LABELS.map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: "50%", display: "grid", placeItems: "center",
                    fontSize: 11, fontWeight: 700,
                    background: i < stage ? T.teal : i === stage ? (isDark ? "rgba(45,212,191,0.15)" : "rgba(13,148,136,0.15)") : (isDark ? "rgba(255,255,255,0.04)" : "rgba(24,24,27,0.05)"),
                    border: `1px solid ${i <= stage ? T.teal : (isDark ? "rgba(255,255,255,0.10)" : "rgba(24,24,27,0.12)")}`,
                    color: i < stage ? (isDark ? "#0b0b0c" : "#fff") : i === stage ? T.teal : T.faint,
                  }}>
                    {i < stage ? <Check size={12} strokeWidth={3} /> : i + 1}
                  </span>
                </div>
              ))}
            </div>
          </header>

          {/* Stage body */}
          <AnimatePresence mode="wait">
            <motion.div key={stage} variants={stageMotion} initial="initial" animate="animate" exit="exit">
              {stage === 0 && <StagePresentation currentCase={currentCase} />}
              {stage === 1 && <StageDifferentials currentCase={currentCase} ranked={ranked} setRanked={setRanked} />}
              {stage === 2 && <StageInvestigations currentCase={currentCase} ordered={ordered} setOrdered={setOrdered} ran={ran} setRan={setRan} />}
              {stage === 3 && (
                <StageOutcome
                  currentCase={currentCase}
                  ranked={ranked} ordered={ordered}
                  prescribed={prescribed} setPrescribed={setPrescribed}
                  submitted={submitted} setSubmitted={setSubmitted}
                  onBack={onBack} onRestart={restart}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Stage navigation */}
          {stage < 3 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <PillButton disabled={stage === 0} onClick={() => setStage((s) => s - 1)}>
                <ArrowLeft size={14} /> Back
              </PillButton>
              <PillButton variant="solid" disabled={!canAdvance} onClick={() => setStage((s) => s + 1)}>
                {stage === 2 ? "Proceed to Treatment" : "Continue"} <ArrowRight size={14} />
              </PillButton>
            </div>
          )}
        </div>
      </main>
    </PortalShell>
  );
}
