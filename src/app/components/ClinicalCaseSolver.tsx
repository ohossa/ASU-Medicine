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
  {
    id: "meningitis_omar",
    code: "Case 101 — Neurology",
    patient: {
      name: "Omar Hamed",
      age: 22,
      gender: "Male",
      complaint: "Thunderclap headache, fever 39.5°C, neck stiffness, and photophobia for 18 hours.",
    },
    vitals: [
      { label: "Heart Rate", value: "116", unit: "bpm", severity: "critical" },
      { label: "Blood Pressure", value: "98/62", unit: "mmHg", severity: "warn" },
      { label: "Temperature", value: "39.5", unit: "°C", severity: "critical" },
      { label: "O₂ Saturation", value: "95", unit: "%", severity: "normal" },
    ],
    differentials: [
      { id: "bacterial_meningitis", name: "Bacterial Meningitis", hint: "Fever, neck stiffness, altered mental status, photophobia" },
      { id: "viral_encephalitis", name: "Viral Encephalitis", hint: "Fever and altered consciousness, often HSV-1" },
      { id: "sah", name: "Subarachnoid Hemorrhage", hint: "Thunderclap headache, but typically no fever" },
      { id: "tension_ha", name: "Tension Headache", hint: "Bilateral pressing pain, no fever or meningeal signs" },
      { id: "influenza", name: "Influenza", hint: "Fever and myalgias, but no meningeal signs" },
      { id: "brain_abscess", name: "Brain Abscess", hint: "Focal neurological signs, fever, progressive course" },
    ],
    correctDx: "bacterial_meningitis",
    tests: [
      { id: "lp_csf", name: "LP/CSF Analysis", cost: 45, delayMin: 30, result: "WBC 2,800/µL (90% neutrophils), Protein 280 mg/dL, Glucose 18 mg/dL", range: "WBC <5, Protein <45, Glucose >40", flag: "critical", trend: "up" },
      { id: "blood_culture", name: "Blood Culture", cost: 25, delayMin: 45, result: "Streptococcus pneumoniae isolated", range: "No growth", flag: "critical", trend: "up" },
      { id: "ct_head", name: "CT Head", cost: 55, delayMin: 40, result: "No mass, hemorrhage, or hydrocephalus", range: "—", flag: "normal", trend: "flat" },
      { id: "cbc", name: "CBC", cost: 15, delayMin: 20, result: "WBC 18,200/µL with left shift", range: "4,000 – 11,000", flag: "critical", trend: "up" },
      { id: "crp", name: "C-Reactive Protein", cost: 20, delayMin: 25, result: "185 mg/L", range: "< 10", flag: "critical", trend: "up" },
      { id: "procalcitonin", name: "Procalcitonin", cost: 30, delayMin: 30, result: "8.5 ng/mL", range: "< 0.25", flag: "critical", trend: "up" },
    ],
    keyTests: ["lp_csf", "blood_culture", "ct_head"],
    treatments: [
      { id: "ceftriaxone_vanc", name: "Ceftriaxone + Vancomycin", detail: "Empiric coverage for S. pneumoniae and N. meningitidis", correct: true },
      { id: "dexamethasone", name: "Dexamethasone", detail: "10 mg IV before or with first antibiotic dose", correct: true },
      { id: "acyclovir", name: "Acyclovir", detail: "Added empirically for possible HSV encephalitis", correct: false },
      { id: "sumatriptan", name: "Sumatriptan", detail: "For presumed migraine headache", correct: false },
      { id: "lumbar_puncture_diag", name: "Lumbar Puncture (Diagnostic)", detail: "Required for definitive CSF diagnosis", correct: true },
      { id: "mannitol_icp", name: "Mannitol for ICP", detail: "If signs of increased intracranial pressure", correct: false },
    ],
    diagnosisName: "Acute Bacterial Meningitis (Streptococcus pneumoniae)",
    diagnosisExplanation: "CSF analysis reveals elevated WBC count (2,800/µL) with neutrophil predominance, markedly low glucose (18 mg/dL), and high protein (280 mg/dL) — classic bacterial meningitis pattern. Gram stain shows gram-positive cocci, and blood culture confirms Streptococcus pneumoniae. Ceftriaxone + vancomycin provides empiric coverage for the most common bacterial pathogens. Dexamethasone administered before antibiotics reduces inflammatory complications and improves outcomes.",
    imageUrl: "/cases/meningitis_lp.png",
  },
  {
    id: "stroke_fatima",
    code: "Case 102 — Neurology",
    patient: {
      name: "Fatima Al-Rashid",
      age: 68,
      gender: "Female",
      complaint: "Sudden onset right-sided weakness and slurred speech 3 hours ago, with no headache.",
    },
    vitals: [
      { label: "Heart Rate", value: "88", unit: "bpm", severity: "normal" },
      { label: "Blood Pressure", value: "175/105", unit: "mmHg", severity: "critical" },
      { label: "Temperature", value: "36.7", unit: "°C", severity: "normal" },
      { label: "O₂ Saturation", value: "96", unit: "%", severity: "normal" },
    ],
    differentials: [
      { id: "ischemic_stroke", name: "Ischemic Stroke", hint: "Sudden focal deficits, hypertension risk factor" },
      { id: "hemorrhagic_stroke", name: "Hemorrhagic Stroke", hint: "Sudden onset but often with headache and vomiting" },
      { id: "tia", name: "Transient Ischemic Attack", hint: "Symptoms resolve within 24h, but workup urgent" },
      { id: "bells_palsy", name: "Bell's Palsy", hint: "Peripheral facial paralysis, no limb weakness" },
      { id: "complex_migraine", name: "Complex Migraine", hint: "Aura with neurological symptoms, gradual onset" },
      { id: "hypoglycemia", name: "Hypoglycemia", hint: "Can cause focal deficits but glucose usually low" },
    ],
    correctDx: "ischemic_stroke",
    tests: [
      { id: "nihss", name: "NIHSS Score", cost: 30, delayMin: 15, result: "8 (moderate stroke)", range: "0 – 42", flag: "warn", trend: "up" },
      { id: "ct_brain", name: "CT Brain Non-contrast", cost: 50, delayMin: 20, result: "No hemorrhage, early subtle hypodensity left MCA territory", range: "—", flag: "warn", trend: "up" },
      { id: "mri_dwi", name: "MRI DWI", cost: 60, delayMin: 45, result: "Acute left MCA territory infarct confirmed", range: "—", flag: "critical", trend: "up" },
      { id: "lipid_panel", name: "Lipid Panel", cost: 20, delayMin: 30, result: "LDL 168 mg/dL, HDL 38 mg/dL", range: "LDL <100, HDL >40", flag: "warn", trend: "up" },
      { id: "ecg_stroke", name: "ECG", cost: 35, delayMin: 15, result: "Normal sinus rhythm, no arrhythmia", range: "—", flag: "normal", trend: "flat" },
      { id: "carotid_us", name: "Carotid Doppler", cost: 40, delayMin: 35, result: "Left ICA 40% stenosis", range: "<50%", flag: "warn", trend: "up" },
    ],
    keyTests: ["ct_brain", "mri_dwi", "nihss"],
    treatments: [
      { id: "iv_tpa", name: "IV tPA (Alteplase)", detail: "0.9 mg/kg (max 90 mg) if within 4.5h window", correct: true },
      { id: "aspirin_325", name: "Aspirin 325mg", detail: "Antiplatelet for secondary prevention", correct: true },
      { id: "nimodipine", name: "Nimodipine", detail: "Used for SAH vasospasm prevention, not ischemic stroke", correct: false },
      { id: "labetalol_bp", name: "Labetalol for BP >220", detail: "Aggressive BP lowering harmful in acute ischemic stroke", correct: false },
      { id: "physio_refer", name: "Physiotherapy Referral", detail: "Early mobilization and rehabilitation", correct: true },
    ],
    diagnosisName: "Acute Left Middle Cerebral Artery (MCA) Ischemic Stroke",
    diagnosisExplanation: "CT brain shows no hemorrhage but early subtle hypodensity in the left MCA territory. MRI DWI confirms acute infarct. NIHSS score of 8 indicates moderate stroke severity with right arm/face weakness and speech involvement. Patient presented within the 4.5-hour window and received IV tPA. Aspirin was given for secondary prevention. Carotid stenosis (40%) is a contributing factor requiring ongoing management.",
    imageUrl: "/cases/stroke_mri.png",
  },
  {
    id: "ms_layla",
    code: "Case 103 — Neurology",
    patient: {
      name: "Layla Mahmoud",
      age: 29,
      gender: "Female",
      complaint: "Double vision for 2 weeks, tingling in left leg, and a previous episode of blurry vision 8 months ago that resolved completely.",
    },
    vitals: [
      { label: "Heart Rate", value: "72", unit: "bpm", severity: "normal" },
      { label: "Blood Pressure", value: "118/76", unit: "mmHg", severity: "normal" },
      { label: "Temperature", value: "36.9", unit: "°C", severity: "normal" },
      { label: "O₂ Saturation", value: "99", unit: "%", severity: "normal" },
    ],
    differentials: [
      { id: "ms", name: "Multiple Sclerosis", hint: "Dissemination in time and space, optic neuritis history" },
      { id: "optic_neuritis", name: "Optic Neuritis", hint: "Painful vision loss, but doesn't explain leg tingling" },
      { id: "conversion", name: "Conversion Disorder", hint: "Neurological symptoms inconsistent with organic findings" },
      { id: "b12_def", name: "Vitamin B12 Deficiency", hint: "Subacute combined degeneration, macrocytosis" },
      { id: "gbs", name: "Guillain-Barré Syndrome", hint: "Ascending paralysis, areflexia, albuminocytologic dissociation" },
      { id: "transverse_myelitis", name: "Transverse Myelitis", hint: "Bilateral motor/sensory deficits, sensory level" },
    ],
    correctDx: "ms",
    tests: [
      { id: "mri_brain", name: "Brain MRI with Gadolinium", cost: 55, delayMin: 45, result: "Multiple periventricular and juxtacortical T2 hyperintense lesions (Dawson's fingers), 3 lesions enhance with gadolinium", range: "—", flag: "critical", trend: "up" },
      { id: "vep", name: "Visual Evoked Potentials", cost: 40, delayMin: 35, result: "Prolonged P100 latency left eye (120ms), right eye normal", range: "<115ms", flag: "warn", trend: "up" },
      { id: "csf_oligo", name: "CSF Oligoclonal Bands", cost: 35, delayMin: 40, result: "Positive (bands present in CSF but not serum)", range: "Negative", flag: "critical", trend: "up" },
      { id: "serum_b12", name: "Serum B12", cost: 20, delayMin: 25, result: "285 pg/mL", range: "200 – 900", flag: "normal", trend: "flat" },
      { id: "aq", name: "Aquaporin-4 Antibody (AQP4)", cost: 45, delayMin: 50, result: "Negative", range: "Negative", flag: "normal", trend: "flat" },
      { id: "mri_cord", name: "MRI Cervical Spine", cost: 50, delayMin: 40, result: "No spinal cord lesions", range: "—", flag: "normal", trend: "flat" },
    ],
    keyTests: ["mri_brain", "csf_oligo", "vep"],
    treatments: [
      { id: "methylpred", name: "High-dose IV Methylprednisolone", detail: "1g daily for 3-5 days for acute relapse", correct: true },
      { id: "interferon_beta", name: "Interferon Beta-1a", detail: "Disease-modifying therapy for long-term prevention", correct: true },
      { id: "plasmapheresis", name: "Plasmapheresis", detail: "Used in refractory relapses or NMO, not standard MS relapse", correct: false },
      { id: "b12_im", name: "Vitamin B12 IM", detail: "For B12 deficiency, not indicated here", correct: false },
      { id: "amitriptyline", name: "Amitriptyline for Neuropathic Pain", detail: "Symptomatic treatment for dysesthesias", correct: true },
    ],
    diagnosisName: "Relapsing-Remitting Multiple Sclerosis",
    diagnosisExplanation: "MRI demonstrates periventricular and juxtacortical T2 hyperintense lesions with Dawson's finger appearance and gadolinium enhancement, fulfilling McDonald criteria for dissemination in space. Previous episode of optic neuritis (resolving blurry vision) establishes dissemination in time. CSF oligoclonal bands are positive, supporting intrathecal inflammation. VEP shows prolonged latency indicating prior left optic neuritis. High-dose steroids accelerate recovery from acute relapse; disease-modifying therapy prevents future relapses.",
    imageUrl: "/cases/ms_mri.png",
  },
  {
    id: "parkinson_hassan",
    code: "Case 104 — Neurology",
    patient: {
      name: "Hassan Ali",
      age: 71,
      gender: "Male",
      complaint: "Tremor in right hand at rest, stiffness, difficulty initiating walking, and masked facial expression for 1 year.",
    },
    vitals: [
      { label: "Heart Rate", value: "66", unit: "bpm", severity: "normal" },
      { label: "Blood Pressure", value: "132/84", unit: "mmHg", severity: "normal" },
      { label: "Temperature", value: "36.8", unit: "°C", severity: "normal" },
      { label: "O₂ Saturation", value: "98", unit: "%", severity: "normal" },
    ],
    differentials: [
      { id: "parkinson", name: "Parkinson's Disease", hint: "TRAP symptoms: tremor, rigidity, akinesia, postural instability" },
      { id: "essential_tremor", name: "Essential Tremor", hint: "Action tremor, improves with alcohol, family history" },
      { id: "drug_parkinson", name: "Drug-Induced Parkinsonism", hint: "Antipsychotic use, bilateral symmetric presentation" },
      { id: "nph", name: "Normal Pressure Hydrocephalus", hint: "Triad: gait disturbance, dementia, urinary incontinence" },
      { id: "psp", name: "Progressive Supranuclear Palsy", hint: "Vertical gaze palsy, early falls, symmetric" },
      { id: "depression", name: "Depression", hint: "Bradyphrenia and masked facies, but no true rigidity" },
    ],
    correctDx: "parkinson",
    tests: [
      { id: "dat_scan", name: "DaTSCAN (Dopamine Transporter Scan)", cost: 60, delayMin: 50, result: "Asymmetric bilateral putaminal uptake reduction, worse on left", range: "Normal symmetric uptake", flag: "critical", trend: "down" },
      { id: "mri_brain_park", name: "MRI Brain", cost: 50, delayMin: 40, result: "Mild generalized atrophy, no structural lesion, no hot cross bun sign", range: "—", flag: "normal", trend: "flat" },
      { id: "levodopa_trial", name: "Levodopa Challenge Trial", cost: 25, delayMin: 30, result: "40% improvement in UPDRS motor score after 1 week", range: "<30% improvement", flag: "warn", trend: "up" },
      { id: "ceruloplasmin", name: "Serum Ceruloplasmin", cost: 20, delayMin: 25, result: "28 mg/dL (normal)", range: "20 – 40", flag: "normal", trend: "flat" },
      { id: "copper_24h", name: "24-Hour Urinary Copper", cost: 25, delayMin: 40, result: "18 µg/24h (normal)", range: "<40", flag: "normal", trend: "flat" },
      { id: "uhdrs", name: "UPDRS Motor Score", cost: 30, delayMin: 20, result: "38/108 (moderate severity)", range: "—", flag: "warn", trend: "up" },
    ],
    keyTests: ["dat_scan", "levodopa_trial", "mri_brain_park"],
    treatments: [
      { id: "levodopa_carbidopa", name: "Levodopa/Carbidopa (Sinemet)", detail: "Gold standard; start low, titrate slowly", correct: true },
      { id: "pramipexole", name: "Pramipexole", detail: "Dopamine agonist for early disease or adjunct", correct: true },
      { id: "benztropine", name: "Benztropine", detail: "Anticholinergic, not first-line due to side effects", correct: false },
      { id: "propranolol", name: "Propranolol", detail: "First-line for essential tremor, not Parkinson's", correct: false },
      { id: "dbs", name: "Deep Brain Stimulation", detail: "For refractory cases, Hoehn-Yahr stage 2-4", correct: true },
    ],
    diagnosisName: "Idiopathic Parkinson's Disease (Hoehn & Yahr Stage 2)",
    diagnosisExplanation: "Classic presentation with resting tremor (asymmetric, starting unilaterally), rigidity, bradykinesia, and postural instability (TRAP). DaTSCAN demonstrates asymmetric dopaminergic deficit in the putamina, supporting the diagnosis. Dramatic response to levodopa challenge confirms idiopathic Parkinson's disease. MRI excludes structural causes and Wilson's disease (normal ceruloplasmin and copper). UPDRS score of 38 indicates moderate disease. Levodopa/carbidopa remains the most effective treatment, with dopamine agonists as alternatives in early disease.",
    imageUrl: "/cases/parkinson_dat.png",
  },
  {
    id: "status_khaled",
    code: "Case 105 — Neurology",
    patient: {
      name: "Khaled Saeed",
      age: 16,
      gender: "Male",
      complaint: "Witnessed generalized tonic-clonic seizure lasting over 10 minutes, now unresponsive with frothing at mouth.",
    },
    vitals: [
      { label: "Heart Rate", value: "142", unit: "bpm", severity: "critical" },
      { label: "Blood Pressure", value: "160/92", unit: "mmHg", severity: "critical" },
      { label: "Temperature", value: "38.2", unit: "°C", severity: "warn" },
      { label: "O₂ Saturation", value: "88", unit: "%", severity: "critical" },
    ],
    differentials: [
      { id: "status_epilep", name: "Status Epilepticus", hint: "Seizure >5 minutes requiring emergent intervention" },
      { id: "meningitis_sz", name: "Meningitis", hint: "Fever and seizures, neck stiffness expected" },
      { id: "hypoglycemic_sz", name: "Hypoglycemic Seizure", hint: "Low glucose triggering seizure, reversible" },
      { id: "pnes", name: "Psychogenic Nonepileptic Seizure", hint: "Asynchronous movements, no postictal state, suggestibility" },
      { id: "drug_overdose", name: "Drug Overdose", hint: "Toxic ingestion causing seizures, anticholinergic signs" },
      { id: "eclampsia_male", name: "Eclampsia", hint: "Not applicable to male patient", correct: false },
    ],
    correctDx: "status_epilep",
    tests: [
      { id: "eeg", name: "EEG", cost: 45, delayMin: 35, result: "Continuous generalized spike-and-wave activity, 3Hz", range: "Normal background", flag: "critical", trend: "up" },
      { id: "serum_gluc", name: "Serum Glucose", cost: 10, delayMin: 15, result: "118 mg/dL (normal)", range: "70 – 100", flag: "normal", trend: "flat" },
      { id: "electrolytes", name: "Serum Electrolytes", cost: 20, delayMin: 25, result: "Na 138, K 4.1, Cl 102, CO2 22 mEq/L", range: "Within normal limits", flag: "normal", trend: "flat" },
      { id: "ct_brain_sz", name: "CT Brain", cost: 50, delayMin: 30, result: "No acute hemorrhage or mass", range: "—", flag: "normal", trend: "flat" },
      { id: "tox_screen", name: "Toxicology Screen", cost: 35, delayMin: 40, result: "Negative for common substances", range: "Negative", flag: "normal", trend: "flat" },
      { id: "lactate", name: "Serum Lactate", cost: 15, delayMin: 20, result: "4.2 mEq/L (elevated)", range: "0.5 – 2.2", flag: "warn", trend: "up" },
    ],
    keyTests: ["eeg", "serum_gluc", "electrolytes"],
    treatments: [
      { id: "lorazepam_4mg", name: "IV Lorazepam 4mg Bolus", detail: "First-line treatment, may repeat once in 5-10 min", correct: true },
      { id: "phenytoin_load", name: "IV Phenytoin Load", detail: "20 mg/kg loading dose for seizure prevention", correct: true },
      { id: "propofol_inf", name: "IV Propofol Infusion", detail: "For refractory status epilepticus", correct: true },
      { id: "phenobarbital", name: "Phenobarbital", detail: "Second/third-line agent for super-refractory status", correct: true },
      { id: "ng_tube", name: "Insertion of Nasogastric Tube", detail: "Not indicated for seizure management", correct: false },
      { id: "observation", name: "Observation Only", detail: "Inappropriate, requires emergent pharmacological intervention", correct: false },
    ],
    diagnosisName: "Generalized Convulsive Status Epilepticus",
    diagnosisExplanation: "Generalized tonic-clonic seizure persisting >10 minutes meets criteria for status epilepticus, a neurological emergency requiring immediate intervention. Hypoglycemia has been excluded as a reversible cause (glucose 118 mg/dL). EEG confirms ongoing ictal activity. IV lorazepam is the first-line treatment to terminate seizure activity; if unsuccessful, phenytoin loading prevents seizure recurrence. Severe hypertension and tachycardia are sympathetic responses to continuous seizure activity. Elevated lactate reflects tissue hypoxia from sustained motor activity. Underlying etiology requires investigation once the patient is stabilized.",
    imageUrl: "/cases/status_eeg.png",
  },
  {
    id: "glaucoma_samira",
    code: "Case 201 — Ophthalmology",
    patient: {
      name: "Samira Othman",
      age: 58,
      gender: "Female",
      complaint: "Sudden severe right eye pain, blurred vision with halos around lights, headache, and nausea for 4 hours.",
    },
    vitals: [
      { label: "Heart Rate", value: "92", unit: "bpm", severity: "normal" },
      { label: "Blood Pressure", value: "148/92", unit: "mmHg", severity: "critical" },
      { label: "Temperature", value: "36.6", unit: "°C", severity: "normal" },
      { label: "O₂ Saturation", value: "98", unit: "%", severity: "normal" },
    ],
    differentials: [
      { id: "aacg", name: "Acute Angle-Closure Glaucoma", hint: "Severe pain, halos, mid-dilated fixed pupil,的红眼" },
      { id: "acute_uveitis", name: "Acute Uveitis", hint: "Pain, photophobia, but typically constricted pupil" },
      { id: "corneal_abrasion", name: "Corneal Abrasion", hint: "Pain with fluorescein staining, no halos" },
      { id: "cluster_ha", name: "Cluster Headache", hint: "Severe unilateral pain, autonomic features, no visual changes" },
      { id: "iritis", name: "Acute Iritis", hint: "Ciliary flush, miosis, cells in anterior chamber" },
      { id: "conjunctivitis", name: "Conjunctivitis", hint: "Redness and discharge, minimal pain, no halos" },
    ],
    correctDx: "aacg",
    tests: [
      { id: "iop", name: "Intraocular Pressure (IOP)", cost: 25, delayMin: 15, result: "52 mmHg right eye (normal <21)", range: "10 – 21 mmHg", flag: "critical", trend: "up" },
      { id: "gonioscopy", name: "Gonioscopy", cost: 35, delayMin: 20, result: "Right eye: closed angle 270°, Left eye: open angle", range: "Open angle", flag: "critical", trend: "up" },
      { id: "slit_lamp", name: "Slit Lamp Exam", cost: 30, delayMin: 15, result: "Right: shallow anterior chamber, mid-dilated fixed pupil, corneal edema with halos", range: "—", flag: "critical", trend: "up" },
      { id: "fundus_exam", name: "Dilated Fundus Exam", cost: 25, delayMin: 20, result: "Contraindicated in acute phase until pressure reduced", range: "—", flag: "normal", trend: "flat" },
      { id: "refraction", name: "Refraction", cost: 20, delayMin: 15, result: "Cannot perform due to corneal edema", range: "—", flag: "normal", trend: "flat" },
      { id: "van_herick", name: "Van Herick Test", cost: 15, delayMin: 10, result: "Right: grade 1 (very shallow), Left: grade 4", range: "Grade 3-4", flag: "warn", trend: "down" },
    ],
    keyTests: ["iop", "gonioscopy", "slit_lamp"],
    treatments: [
      { id: "pilocarpine_2", name: "Pilocarpine 2% Eye Drops", detail: "Miosis constricts pupil, opens trabecular meshwork", correct: true },
      { id: "acetazolamide_iv", name: "Acetazolamide 500mg IV", detail: "Carbonic anhydrase inhibitor, reduces aqueous production", correct: true },
      { id: "mannitol_iv_g", name: "Mannitol IV", detail: "Osmotic agent for refractory cases with high IOP", correct: true },
      { id: "timolol_05", name: "Timolol 0.5% Eye Drops", detail: "Beta-blocker as adjunct to reduce aqueous production", correct: true },
      { id: "atropine_1", name: "Atropine 1% Eye Drops", detail: "Would worsen condition by dilating pupil further", correct: false },
      { id: "observation_g", name: "Observation", detail: "Inappropriate, requires immediate intervention to prevent blindness", correct: false },
    ],
    diagnosisName: "Acute Primary Angle-Closure Glaucoma",
    diagnosisExplanation: "IOP of 52 mmHg (normal <21) confirms acute glaucoma. Slit lamp reveals a shallow anterior chamber with a mid-dilated fixed pupil and corneal edema producing the characteristic halos around lights. Gonioscopy confirms a closed angle in 270 degrees of the right eye. The acute attack occurs when the iris physically blocks the trabecular meshwork, preventing aqueous humor drainage. Pilocarpine constricts the pupil, pulling the iris away from the trabecular meshwork. Acetazolamide and timolol reduce aqueous production. Mannitol may be needed for refractory cases. Definitive treatment is laser peripheral iridotomy once inflammation subsides.",
    imageUrl: "/cases/glaucoma_gonioscopy.png",
  },
  {
    id: "retinal_det_youssef",
    code: "Case 202 — Ophthalmology",
    patient: {
      name: "Youssef Kamal",
      age: 42,
      gender: "Male",
      complaint: "Floaters and flashes in left eye for 3 days, now with a curtain-like shadow over peripheral vision.",
    },
    vitals: [
      { label: "Heart Rate", value: "74", unit: "bpm", severity: "normal" },
      { label: "Blood Pressure", value: "128/82", unit: "mmHg", severity: "normal" },
      { label: "Temperature", value: "36.7", unit: "°C", severity: "normal" },
      { label: "O₂ Saturation", value: "99", unit: "%", severity: "normal" },
    ],
    differentials: [
      { id: "retinal_detach", name: "Retinal Detachment", hint: "Flashes, floaters, and visual field defect progressing centrally" },
      { id: "pvd", name: "Posterior Vitreous Detachment", hint: "Benign, flashes/floaters without field loss", correct: false },
      { id: "crao", name: "Central Retinal Artery Occlusion", hint: "Painless monocular vision loss, cherry-red spot", correct: false },
      { id: "optic_neuritis_eye", name: "Optic Neuritis", hint: "Painful eye movement, afferent pupillary defect", correct: false },
      { id: "migraine_aur", name: "Migraine with Aura", hint: "Fortification spectra, gradual resolution", correct: false },
      { id: "ocular_migraine", name: "Ocular Migraine", hint: "Transient visual disturbance without headache", correct: false },
    ],
    correctDx: "retinal_detach",
    tests: [
      { id: "dilated_fundus", name: "Dilated Fundus Exam", cost: 30, delayMin: 20, result: "Horseshoe retinal tear at 2 o'clock position, bullous retinal detachment extending to macula", range: "—", flag: "critical", trend: "up" },
      { id: "oct", name: "Optical Coherence Tomography (OCT)", cost: 45, delayMin: 25, result: "Subretinal fluid confirmed, neurosensory retina detached, fovea threatened", range: "—", flag: "critical", trend: "up" },
      { id: "b_scan", name: "B-Scan Ultrasound", cost: 35, delayMin: 20, result: "Retinal detachment confirmed, no mass lesion", range: "—", flag: "critical", trend: "up" },
      { id: "visual_field", name: "Visual Field Test", cost: 25, delayMin: 30, result: "Extensive field loss left eye, superior and inferior altitudinal defects", range: "Full visual field", flag: "critical", trend: "down" },
      { id: "applanation", name: "Applanation Tonometry", cost: 20, delayMin: 15, result: "IOP 16 mmHg bilaterally (normal)", range: "10 – 21", flag: "normal", trend: "flat" },
      { id: "refraction_eye", name: "Refraction", cost: 20, delayMin: 15, result: "Cannot reliably measure due to media distortion", range: "—", flag: "normal", trend: "flat" },
    ],
    keyTests: ["dilated_fundus", "oct", "b_scan"],
    treatments: [
      { id: "scleral_buckle", name: "Scleral Buckling", detail: "Surgical repair reappoaches retina to RPE", correct: true },
      { id: "pars_plana_vit", name: "Pars Plana Vitrectomy", detail: "Vitreous removal and retinal reattachment for complex cases", correct: true },
      { id: "pneumatic_retino", name: "Pneumatic Retinopexy", detail: "Gas bubble injection for small, simple tears", correct: true },
      { id: "laser_photo", name: "Laser Photocoagulation", detail: "Effective for small peripheral tears before detachment", correct: true },
      { id: "observation_rd", name: "Observation", detail: "Cannot observe, will progress to blindness without treatment", correct: false },
      { id: "aspirin_81", name: "Aspirin 81mg", detail: "No role in acute retinal detachment management", correct: false },
    ],
    diagnosisName: "Rhegmatogenous Retinal Detachment Left Eye",
    diagnosisExplanation: "Fundus examination reveals a horseshoe tear at the 2 o'clock position with bullous retinal detachment extending to threaten the macula. OCT confirms subretinal fluid accumulation. Rhegmatogenous detachment occurs when liquid vitreous passes through a retinal break, accumulating between the neurosensory retina and retinal pigment epithelium. Urgent surgical intervention within 24 hours is critical to preserve central vision. Scleral buckling remains the gold standard for simple rhegmatogenous detachments; pars plana vitrectomy is preferred for cases with proliferative vitreoretinopathy or giant retinal tears.",
    imageUrl: "/cases/retinal_detachment.png",
  },
  {
    id: "amd_naglaa",
    code: "Case 203 — Ophthalmology",
    patient: {
      name: "Naglaa Farouk",
      age: 76,
      gender: "Female",
      complaint: "Progressive central vision blur in both eyes, difficulty reading and recognizing faces for 6 months.",
    },
    vitals: [
      { label: "Heart Rate", value: "70", unit: "bpm", severity: "normal" },
      { label: "Blood Pressure", value: "142/88", unit: "mmHg", severity: "warn" },
      { label: "Temperature", value: "36.5", unit: "°C", severity: "normal" },
      { label: "O₂ Saturation", value: "98", unit: "%", severity: "normal" },
    ],
    differentials: [
      { id: "amd", name: "Age-related Macular Degeneration", hint: "Central vision loss in elderly, drusen on exam" },
      { id: "diabetic_retinopathy", name: "Diabetic Retinopathy", hint: "Dot-blot hemorrhages, microaneurysms in diabetic patient" },
      { id: "cataracts", name: "Cataracts", hint: "Gradual vision loss, lens opacification" },
      { id: "glaucoma_chronic", name: "Glaucoma", hint: "Peripheral vision loss first, optic cupping" },
      { id: "csr", name: "Central Serous Retinopathy", hint: "Young males, self-limiting, no drusen" },
      { id: "amblyopia_eye", name: "Amblyopia", hint: "Developmental, not sudden onset in elderly", correct: false },
    ],
    correctDx: "amd",
    tests: [
      { id: "ffa", name: "Fundus Fluorescein Angiography (FFA)", cost: 50, delayMin: 40, result: "Bilateral choroidal neovascularization with classic wet AMD pattern, late leakage", range: "—", flag: "critical", trend: "up" },
      { id: "oct_amd", name: "Optical Coherence Tomography (OCT)", cost: 45, delayMin: 25, result: "Subretinal fluid, intraretinal cysts, pigment epithelial detachment both eyes", range: "—", flag: "critical", trend: "up" },
      { id: "amsler_grid", name: "Amsler Grid", cost: 10, delayMin: 10, result: "Metamorphopsia (wavy lines) both eyes, central scotoma", range: "—", flag: "critical", trend: "up" },
      { id: "fundus_photo", name: "Fundus Photography", cost: 30, delayMin: 20, result: "Multiple drusen, pigmentary changes, subretinal hemorrhage left eye", range: "—", flag: "critical", trend: "up" },
      { id: "indocyanine_green", name: "Indocyanine Green Angiography", cost: 55, delayMin: 45, result: "Confirms choroidal neovascular membrane location", range: "—", flag: "normal", trend: "flat" },
      { id: "refraction_amd", name: "Refraction", cost: 20, delayMin: 15, result: "BCVA 20/200 right eye, 20/400 left eye", range: "20/20", flag: "critical", trend: "down" },
    ],
    keyTests: ["ffa", "oct_amd", "amsler_grid"],
    treatments: [
      { id: "anti_vegf", name: "Anti-VEGF Intravitreal Injection", detail: "Ranibizumab, bevacizumab, or aflibercept to reduce neovascularization", correct: true },
      { id: "photodynamic", name: "Photodynamic Therapy", detail: "Verteporfin activated by laser for select CNV cases", correct: true },
      { id: "areds", name: "AREDS Supplementation", detail: "Vitamins C, E, zinc, copper for dry AMD to slow progression", correct: true },
      { id: "laser_amd", name: "Laser Photocoagulation", detail: "Not first-line for wet AMD, destroys retina", correct: false },
      { id: "no_treatment", name: "No Treatment Needed", detail: "Wet AMD requires active treatment to prevent blindness", correct: false },
      { id: "corrective_lenses", name: "Corrective Lenses Only", detail: "Cannot correct AMD-related vision loss", correct: false },
    ],
    diagnosisName: "Wet Age-Related Macular Degeneration (AMD) Both Eyes",
    diagnosisExplanation: "OCT reveals subretinal fluid and intraretinal cysts with pigment epithelial detachment — hallmarks of wet AMD. FFA confirms choroidal neovascularization with classic leakage pattern. Amsler grid demonstrates metamorphopsia (distorted straight lines) and central scotoma. Wet AMD occurs when abnormal choroidal blood vessels grow beneath the retina (choroidal neovascularization), leaking fluid and blood that damage the macula. Anti-VEGF therapy (ranibizumab, bevacizumab, or aflibercept) is the first-line treatment, reducing neovascularization and often improving visual acuity. AREDS vitamin supplementation slows progression in dry AMD and provides protection for the contralateral eye.",
    imageUrl: "/cases/amd_oct.png",
  },
  {
    id: "aom_mariam",
    code: "Case 204 — ENT",
    patient: {
      name: "Mariam Khalil",
      age: 4,
      gender: "Female",
      complaint: "Ear pulling, crying, fever 39°C for 2 days, decreased hearing, irritability, and difficulty sleeping.",
    },
    vitals: [
      { label: "Heart Rate", value: "128", unit: "bpm", severity: "critical" },
      { label: "Blood Pressure", value: "90/60", unit: "mmHg", severity: "warn" },
      { label: "Temperature", value: "39.1", unit: "°C", severity: "critical" },
      { label: "O₂ Saturation", value: "97", unit: "%", severity: "normal" },
    ],
    differentials: [
      { id: "aom", name: "Acute Otitis Media", hint: "Ear pain, fever, bulging red tympanic membrane" },
      { id: "otitis_externa", name: "Otitis Externa", hint: "Pain with tragal pressure, canal inflammation" },
      { id: "uri_aom", name: "Upper Respiratory Infection", hint: "Congestion, cough, but no ear-specific findings" },
      { id: "fb_ear", name: "Foreign Body in Ear", hint: "Unilateral, visible object in canal" },
      { id: "teething", name: "Teething", hint: "Irritability in infants, but no ear findings" },
      { id: "meningitis_aom", name: "Meningitis", hint: "Nuchal rigidity, altered consciousness, seizures" },
    ],
    correctDx: "aom",
    tests: [
      { id: "otoscopy", name: "Otoscopy", cost: 15, delayMin: 10, result: "Right ear: bulging erythematous tympanic membrane with loss of landmarks, no perforation", range: "Normal TM: pearly gray, landmarks visible", flag: "critical", trend: "up" },
      { id: "tympanometry", name: "Tympanometry", cost: 25, delayMin: 15, result: "Type B (flat) curve right ear, indicating middle ear effusion", range: "Type A (normal)", flag: "critical", trend: "down" },
      { id: "pneumatic_oto", name: "Pneumatic Otoscopy", cost: 20, delayMin: 15, result: "Decreased mobility of right tympanic membrane", range: "Normal mobility", flag: "warn", trend: "down" },
      { id: "throat_culture", name: "Throat Culture", cost: 15, delayMin: 30, result: "No pathogenic growth", range: "No growth", flag: "normal", trend: "flat" },
      { id: "cbc_aom", name: "CBC", cost: 15, delayMin: 20, result: "WBC 15,800/µL with left shift", range: "5,000 – 15,000", flag: "warn", trend: "up" },
      { id: "crt_aom", name: "CRP (C-Reactive Protein)", cost: 20, delayMin: 25, result: "45 mg/L (elevated)", range: "< 10", flag: "warn", trend: "up" },
    ],
    keyTests: ["otoscopy", "tympanometry", "pneumatic_oto"],
    treatments: [
      { id: "amoxicillin", name: "Amoxicillin", detail: "First-line antibiotic 80-90mg/kg/day divided BID for 10 days", correct: true },
      { id: "watchful_waiting", name: "Watchful Waiting", detail: "Not appropriate given severe symptoms and high fever", correct: false },
      { id: "ibuprofen_apap", name: "Ibuprofen + Acetaminophen", detail: "Pain control and fever reduction", correct: true },
      { id: "myringotomy_tubes", name: "Myringotomy + Tympanostomy Tubes", detail: "For recurrent AOM (3+ episodes/6 months) or treatment failure", correct: true },
      { id: "decongestant", name: "Decongestant Nasal Spray", detail: "Not effective for AOM, no role in treatment", correct: false },
      { id: "warm_compress", name: "Warm Compress", detail: "Symptomatic relief for ear pain", correct: true },
    ],
    diagnosisName: "Acute Bacterial Otitis Media Right Ear",
    diagnosisExplanation: "Otoscopy reveals a bulging, erythematous tympanic membrane with loss of landmarks — the hallmark of acute otitis media. Tympanometry shows Type B (flat) curve, confirming middle ear effusion and poor mobility. Pneumatic otoscopy demonstrates decreased tympanic membrane mobility. Viral prodrome often precedes bacterial superinfection; common pathogens include Streptococcus pneumoniae, Haemophilus influenzae, and Moraxella catarrhalis. Amoxicillin 80-90mg/kg/day provides appropriate coverage. Myringotomy with tube insertion is reserved for recurrent episodes or treatment failure. Pain control with analgesics and antipyretics is essential.",
    imageUrl: "/cases/aom_otoscopy.png",
  },
  {
    id: "ssnhl_tariq",
    code: "Case 205 — ENT",
    patient: {
      name: "Tariq Nassar",
      age: 55,
      gender: "Male",
      complaint: "Sudden deafness in left ear when waking up 3 days ago, with tinnitus, mild vertigo, and no ear pain.",
    },
    vitals: [
      { label: "Heart Rate", value: "78", unit: "bpm", severity: "normal" },
      { label: "Blood Pressure", value: "134/86", unit: "mmHg", severity: "normal" },
      { label: "Temperature", value: "36.7", unit: "°C", severity: "normal" },
      { label: "O₂ Saturation", value: "99", unit: "%", severity: "normal" },
    ],
    differentials: [
      { id: "ssnhl", name: "Sudden Sensorineural Hearing Loss", hint: "Idiopathic, rapid onset, unilateral, ENT emergency" },
      { id: "acoustic_neuroma", name: "Acoustic Neuroma (Vestibular Schwannoma)", hint: "Gradual progressive hearing loss, unilateral tinnitus" },
      { id: "meniere", name: "Ménière's Disease", hint: "Episodic vertigo, fluctuating hearing loss, tinnitus, aural fullness" },
      { id: "otosclerosis", name: "Otosclerosis", hint: "Conductive hearing loss, positive family history, young adult" },
      { id: "presbycusis", name: "Presbycusis", hint: "Bilateral symmetric high-frequency loss in elderly" },
      { id: "cerumen_impaction", name: "Cerumen Impaction", hint: "Gradual onset, bilateral possible, visible wax" },
    ],
    correctDx: "ssnhl",
    tests: [
      { id: "pure_tone", name: "Pure Tone Audiometry", cost: 35, delayMin: 25, result: "Left ear: >30dB sensorineural loss across 3 contiguous frequencies, Right ear normal", range: "<25 dB HL", flag: "critical", trend: "down" },
      { id: "mri_iac", name: "Brain MRI with IAC", cost: 60, delayMin: 50, result: "No acoustic neuroma, no stroke, internal auditory canals clear", range: "—", flag: "normal", trend: "flat" },
      { id: "tympanometry_ssnhl", name: "Tympanometry", cost: 25, delayMin: 15, result: "Type A curves bilaterally (normal middle ear function)", range: "Type A", flag: "normal", trend: "flat" },
      { id: "weber_rinne", name: "Weber & Rinne Test", cost: 10, delayMin: 10, result: "Weber lateralizes to right ear, Rinne AC>BC bilaterally (sensorineural pattern)", range: "—", flag: "warn", trend: "down" },
      { id: "audio_vestibular", name: "Vestibular Testing", cost: 40, delayMin: 35, result: "Mild left vestibular hypofunction consistent with acute unilateral lesion", range: "—", flag: "warn", trend: "up" },
      { id: "lab_ssnhl", name: "Basic Metabolic Panel", cost: 20, delayMin: 25, result: "All values within normal limits", range: "—", flag: "normal", trend: "flat" },
    ],
    keyTests: ["pure_tone", "mri_iac", "weber_rinne"],
    treatments: [
      { id: "prednisone_oral", name: "Oral Prednisone", detail: "High-dose 1mg/kg/day for 10-14 days, started within 72 hours", correct: true },
      { id: "intratympanic", name: "Intratympanic Steroid Injection", detail: "Salvage therapy if oral steroids fail, direct cochlear delivery", correct: true },
      { id: "hbot", name: "Hyperbaric Oxygen Therapy", detail: "Adjunctive treatment to improve cochlear oxygenation", correct: true },
      { id: "ginkgo", name: "Ginkgo Biloba", detail: "No evidence of benefit in clinical trials", correct: false },
      { id: "hearing_aid", name: "Hearing Aid", detail: "For permanent hearing loss after recovery fails", correct: true },
      { id: "watchful_wait", name: "Watchful Waiting", detail: "Time-sensitive condition; treatment within 2 weeks critical", correct: false },
    ],
    diagnosisName: "Idiopathic Sudden Sensorineural Hearing Loss (SSNHL) Left Ear",
    diagnosisExplanation: "Audiometry confirms >30 dB sensorineural hearing loss across 3 contiguous frequencies in the left ear — meeting criteria for SSNHL. Weber test lateralizes to the right (better ear), and Rinne test shows AC>BC bilaterally, confirming sensorineural rather than conductive loss. MRI of the internal auditory canals rules out acoustic neuroma and stroke. SSNHL is an ENT emergency; high-dose oral prednisone initiated within 72 hours significantly improves recovery rates. Intratympanic dexamethasone serves as salvage therapy when systemic steroids fail. Hyperbaric oxygen is an evidence-based adjunct. Recovery is inversely related to time to treatment.",
    imageUrl: "/cases/ssnhl_audiometry.png",
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
