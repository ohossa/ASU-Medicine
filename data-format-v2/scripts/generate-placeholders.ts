import { mkdir, writeFile, readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';

/* ═══════════════════════════════════════════════════════════════
   Placeholder Module JSON Generator
   Creates minimal placeholder JSON files for every uncovered module.
   ═══════════════════════════════════════════════════════════════ */

const existingModules = new Set([
  'MCNS-2', 'MEM-2', 'MSS-2', 'P3-2', 'R-2',
]);

interface ModuleInfo {
  code: string;
  name: string;
  year: number;
  semester: number;
  creditPoints: number;
  totalMarks: number;
  keywords: string[];
  chapters: { id: number; title: string; emoji: string; lectureRange: string }[];
}

const MODULES: ModuleInfo[] = [
  // Year 1 — Semester 1
  { code: 'IAE-1', name: 'Introduction to Anatomy & Embryology', year: 1, semester: 1, creditPoints: 3, totalMarks: 60, keywords: ['anatomy', 'embryology', 'iae'], chapters: [{ id: 1, title: 'Introduction to Anatomy', emoji: '🦴', lectureRange: 'Lectures 1' }, { id: 2, title: 'General Embryology', emoji: '🧬', lectureRange: 'Lectures 2' }] },
  { code: 'IPHY-1', name: 'Introduction to Physiology', year: 1, semester: 1, creditPoints: 3, totalMarks: 60, keywords: ['physiology', 'iphy'], chapters: [{ id: 1, title: 'Homeostasis & Membrane Transport', emoji: '⚖️', lectureRange: 'Lectures 1' }, { id: 2, title: 'Autonomic Nervous System', emoji: '🧠', lectureRange: 'Lectures 2' }, { id: 3, title: 'Excitable Tissues', emoji: '⚡', lectureRange: 'Lectures 3' }] },
  { code: 'IBM-1', name: 'Introduction to Medical Biochemistry', year: 1, semester: 1, creditPoints: 3, totalMarks: 60, keywords: ['biochemistry', 'ibm'], chapters: [{ id: 1, title: 'Cell Chemistry & Biophysics', emoji: '🧪', lectureRange: 'Lectures 1' }, { id: 2, title: 'Enzymes & Bioenergetics', emoji: '🔬', lectureRange: 'Lectures 2' }] },
  { code: 'IHC-1', name: 'Introduction to Histology & Cell Biology', year: 1, semester: 1, creditPoints: 3, totalMarks: 60, keywords: ['histology', 'cell biology', 'ihc'], chapters: [{ id: 1, title: 'Cytology & Cell Cytoplasm', emoji: '🔬', lectureRange: 'Lectures 1' }, { id: 2, title: 'Epithelial & Connective Tissues', emoji: '🧫', lectureRange: 'Lectures 2' }] },
  { code: 'MIM-1', name: 'Immunology Module', year: 1, semester: 1, creditPoints: 3, totalMarks: 60, keywords: ['immunology', 'mim'], chapters: [{ id: 1, title: 'Innate Immunity', emoji: '🛡️', lectureRange: 'Lectures 1' }, { id: 2, title: 'Adaptive Immunity', emoji: '🦠', lectureRange: 'Lectures 2' }, { id: 3, title: 'Clinical Immunology', emoji: '🧪', lectureRange: 'Lectures 3' }] },
  { code: 'MBMG-1', name: 'Molecular Biology & Medical Genetics', year: 1, semester: 1, creditPoints: 3, totalMarks: 60, keywords: ['molecular biology', 'genetics', 'mbmg'], chapters: [{ id: 1, title: 'Molecular Biology & DNA', emoji: '🧬', lectureRange: 'Lectures 1' }, { id: 2, title: 'Genetics & Hereditary Disorders', emoji: '📊', lectureRange: 'Lectures 2' }] },
  { code: 'P1-1', name: 'Introduction to ICT & Medical Terminology', year: 1, semester: 1, creditPoints: 1, totalMarks: 20, keywords: ['ict', 'medical terminology', 'p1'], chapters: [{ id: 1, title: 'Medical Terminology & Prefixes/Suffixes', emoji: '📝', lectureRange: 'Lectures 1' }, { id: 2, title: 'Healthcare Information & Communication Technology', emoji: '💻', lectureRange: 'Lectures 2' }] },

  // Year 1 — Semester 2
  { code: 'IPAT-1', name: 'Introduction to Pathology', year: 1, semester: 2, creditPoints: 3, totalMarks: 60, keywords: ['pathology', 'ipat'], chapters: [{ id: 1, title: 'Cellular Injury & Adaptations', emoji: '🦠', lectureRange: 'Lectures 1' }, { id: 2, title: 'Inflammation & Repair', emoji: '🔥', lectureRange: 'Lectures 2' }, { id: 3, title: 'Hemodynamics & Neoplasia', emoji: '❤️', lectureRange: 'Lectures 3' }] },
  { code: 'IPHA-1', name: 'Introduction to Clinical Pharmacology', year: 1, semester: 2, creditPoints: 3, totalMarks: 60, keywords: ['pharmacology', 'ipha'], chapters: [{ id: 1, title: 'Pharmacokinetics & Pharmacodynamics', emoji: '💊', lectureRange: 'Lectures 1' }, { id: 2, title: 'Autonomic Pharmacology', emoji: '🧠', lectureRange: 'Lectures 2' }] },
  { code: 'MINF-1', name: 'Infection Module', year: 1, semester: 2, creditPoints: 3, totalMarks: 60, keywords: ['infection', 'microbiology', 'minf'], chapters: [{ id: 1, title: 'General & Systemic Bacteriology', emoji: '🦠', lectureRange: 'Lectures 1' }, { id: 2, title: 'Virology, Mycology & Parasitology', emoji: '🧫', lectureRange: 'Lectures 2' }] },
  { code: 'MLS-1', name: 'Locomotor Module', year: 1, semester: 2, creditPoints: 3, totalMarks: 60, keywords: ['locomotor', 'anatomy', 'mls'], chapters: [{ id: 1, title: 'Upper Limb Anatomy & Injuries', emoji: '💪', lectureRange: 'Lectures 1' }, { id: 2, title: 'Lower Limb Anatomy & Injuries', emoji: '🦵', lectureRange: 'Lectures 2' }, { id: 3, title: 'Spine & Musculoskeletal Pathologies', emoji: '🦴', lectureRange: 'Lectures 3' }] },
  { code: 'BLS-HE-1', name: 'Basic Life Support & Clinical Examination', year: 1, semester: 2, creditPoints: 2, totalMarks: 40, keywords: ['bls', 'cpr', 'clinical examination', 'bls-he'], chapters: [{ id: 1, title: 'Basic Life Support (BLS) & CPR', emoji: '🚑', lectureRange: 'Lectures 1' }, { id: 2, title: 'Medical History Taking', emoji: '📝', lectureRange: 'Lectures 2' }, { id: 3, title: 'General Clinical Examination', emoji: '🩺', lectureRange: 'Lectures 3' }] },
  { code: 'P2-1', name: 'Presentation, Learning & Time Management Skills', year: 1, semester: 2, creditPoints: 1, totalMarks: 20, keywords: ['presentation', 'learning', 'p2'], chapters: [{ id: 1, title: 'Learning Strategies & Memory Techniques', emoji: '🧠', lectureRange: 'Lectures 1' }, { id: 2, title: 'Effective Presentation & Communication Skills', emoji: '🎤', lectureRange: 'Lectures 2' }, { id: 3, title: 'Time Management & Goal Setting', emoji: '⏰', lectureRange: 'Lectures 3' }] },

  // Year 2 — Semester 1
  { code: 'MBL-2', name: 'Blood & Lymphatic System', year: 2, semester: 1, creditPoints: 4, totalMarks: 80, keywords: ['blood', 'lymphatic', 'hematology', 'mbl'], chapters: [{ id: 1, title: 'Erythrocytes & Anemias', emoji: '🩸', lectureRange: 'Lectures 1' }, { id: 2, title: 'Leukocytes & Lymphatics', emoji: '🛡️', lectureRange: 'Lectures 2' }, { id: 3, title: 'Hemostasis & Bleeding Disorders', emoji: '🩹', lectureRange: 'Lectures 3' }] },
  { code: 'MRS-2', name: 'Respiratory System', year: 2, semester: 1, creditPoints: 4, totalMarks: 80, keywords: ['respiratory', 'pulmonology', 'mrs'], chapters: [{ id: 1, title: 'Respiratory Tract Anatomy & Histology', emoji: '🫁', lectureRange: 'Lectures 1' }, { id: 2, title: 'Pulmonary Physiology', emoji: '💨', lectureRange: 'Lectures 2' }, { id: 3, title: 'Respiratory Pathologies & Pharmacology', emoji: '💊', lectureRange: 'Lectures 3' }] },
  { code: 'MCVS-2', name: 'Cardiovascular System', year: 2, semester: 1, creditPoints: 4.5, totalMarks: 90, keywords: ['cardiovascular', 'cardiology', 'mcvs'], chapters: [{ id: 1, title: 'Cardiac Anatomy & Histology', emoji: '❤️', lectureRange: 'Lectures 1' }, { id: 2, title: 'Electrophysiology & ECG', emoji: '⚡', lectureRange: 'Lectures 2' }, { id: 3, title: 'Hemodynamics & Blood Pressure', emoji: '📈', lectureRange: 'Lectures 3' }, { id: 4, title: 'Cardiovascular Pathologies & Pharmacology', emoji: '💊', lectureRange: 'Lectures 4' }] },

  // Year 2 — Semester 2
  // MCNS-2, MEM-2, MSS-2, P3-2, R-2 exist

  // Year 3 — Semester 1
  { code: 'MGL-3', name: 'GIT & Liver', year: 3, semester: 1, creditPoints: 5.5, totalMarks: 110, keywords: ['git', 'liver', 'gastroenterology', 'mgl'], chapters: [{ id: 1, title: 'Upper GI Tract (Oral to Stomach)', emoji: '🍽️', lectureRange: 'Lectures 1' }, { id: 2, title: 'Lower GI Tract (Intestines)', emoji: '🥗', lectureRange: 'Lectures 2' }, { id: 3, title: 'Hepatobiliary System & Pancreas', emoji: '🫀', lectureRange: 'Lectures 3' }, { id: 4, title: 'Gastrointestinal Pathologies & Drugs', emoji: '💊', lectureRange: 'Lectures 4' }] },
  { code: 'MUG-3', name: 'Urogenital System', year: 3, semester: 1, creditPoints: 5, totalMarks: 100, keywords: ['urogenital', 'renal', 'mug'], chapters: [{ id: 1, title: 'Renal System & Electrolytes', emoji: '🫘', lectureRange: 'Lectures 1' }, { id: 2, title: 'Male Reproductive System', emoji: '♂️', lectureRange: 'Lectures 2' }, { id: 3, title: 'Female Reproductive System', emoji: '♀️', lectureRange: 'Lectures 3' }, { id: 4, title: 'Urogenital Pathologies & Drugs', emoji: '💊', lectureRange: 'Lectures 4' }] },
  { code: 'P4-3', name: 'Medical Ethics', year: 3, semester: 1, creditPoints: 1, totalMarks: 20, keywords: ['ethics', 'bioethics', 'p4'], chapters: [{ id: 1, title: 'Principles of Bioethics & Autonomy', emoji: '⚖️', lectureRange: 'Lectures 1' }, { id: 2, title: 'Informed Consent, Confidentiality & Professionalism', emoji: '📄', lectureRange: 'Lectures 2' }, { id: 3, title: 'Ethical Dilemmas in Clinical Practice', emoji: '🏥', lectureRange: 'Lectures 3' }] },
  { code: 'P5-3', name: 'Doctor-Patient Communication', year: 3, semester: 1, creditPoints: 1, totalMarks: 20, keywords: ['communication', 'doctor-patient', 'p5'], chapters: [{ id: 1, title: 'Active Listening & Verbal/Non-Verbal Communication', emoji: '🗣️', lectureRange: 'Lectures 1' }, { id: 2, title: 'Breaking Bad News & Handling Difficult Patients', emoji: '💔', lectureRange: 'Lectures 2' }] },

  // Year 3 — Semester 2
  { code: 'CEO-3', name: 'Community, Environmental & Occupational Medicine', year: 3, semester: 2, creditPoints: 2, totalMarks: 40, keywords: ['community medicine', 'epidemiology', 'ceo'], chapters: [{ id: 1, title: 'Public Health & Epidemiology', emoji: '🌍', lectureRange: 'Lectures 1' }, { id: 2, title: 'Environmental & Occupational Hazards', emoji: '⚠️', lectureRange: 'Lectures 2' }] },
  { code: 'FT-3', name: 'Forensic Medicine & Clinical Toxicology', year: 3, semester: 2, creditPoints: 2, totalMarks: 40, keywords: ['forensic', 'toxicology', 'ft'], chapters: [{ id: 1, title: 'Forensic Thanatology & Traumatology', emoji: '🔍', lectureRange: 'Lectures 1' }, { id: 2, title: 'Clinical Toxicology', emoji: '☠️', lectureRange: 'Lectures 2' }] },
  { code: 'ORL-3', name: 'Otorhinolaryngology', year: 3, semester: 2, creditPoints: 2, totalMarks: 40, keywords: ['ent', 'orl', 'otorhinolaryngology'], chapters: [{ id: 1, title: 'Otology & Rhinology', emoji: '👂', lectureRange: 'Lectures 1' }, { id: 2, title: 'Laryngology & Head/Neck Diseases', emoji: '🗣️', lectureRange: 'Lectures 2' }] },
  { code: 'MED1-3', name: 'Foundation of Internal Medicine', year: 3, semester: 2, creditPoints: 2, totalMarks: 40, keywords: ['internal medicine', 'med1'], chapters: [{ id: 1, title: 'Clinical History & Communication', emoji: '📝', lectureRange: 'Lectures 1' }, { id: 2, title: 'Physical Examination Skills', emoji: '🩺', lectureRange: 'Lectures 2' }] },
  { code: 'P6-3', name: 'Leadership & Management Skills', year: 3, semester: 2, creditPoints: 1, totalMarks: 20, keywords: ['leadership', 'management', 'p6'], chapters: [{ id: 1, title: 'Leadership Styles & Team Dynamics', emoji: '👥', lectureRange: 'Lectures 1' }, { id: 2, title: 'Healthcare Management, Quality & Conflict Resolution', emoji: '🏥', lectureRange: 'Lectures 2' }] },
  { code: 'R-3', name: 'Scientific Research', year: 3, semester: 2, creditPoints: 1, totalMarks: 20, keywords: ['research', 'r3'], chapters: [{ id: 1, title: 'Designing a Scientific Research Proposal', emoji: '📑', lectureRange: 'Lectures 1' }, { id: 2, title: 'Scientific Writing, Citation & Publication Ethics', emoji: '✍️', lectureRange: 'Lectures 2' }] },

  // Year 4 — Semester 1
  { code: 'MED2-4', name: 'General & Special Internal Medicine 1', year: 4, semester: 1, creditPoints: 5.5, totalMarks: 110, keywords: ['internal medicine', 'med2'], chapters: [{ id: 1, title: 'Cardiology', emoji: '❤️', lectureRange: 'Lectures 1' }, { id: 2, title: 'Pulmonology', emoji: '🫁', lectureRange: 'Lectures 2' }, { id: 3, title: 'Gastroenterology & Hepatology', emoji: '🍽️', lectureRange: 'Lectures 3' }, { id: 4, title: 'Nephrology', emoji: '🫘', lectureRange: 'Lectures 4' }] },
  { code: 'FAM-4', name: 'Family Medicine', year: 4, semester: 1, creditPoints: 2, totalMarks: 40, keywords: ['family medicine', 'primary care', 'fam'], chapters: [{ id: 1, title: 'Primary Care & Disease Prevention', emoji: '🏥', lectureRange: 'Lectures 1' }] },
  { code: 'P7-4', name: 'Communication within a Medical Team', year: 4, semester: 1, creditPoints: 1, totalMarks: 20, keywords: ['communication', 'team', 'p7'], chapters: [{ id: 1, title: 'Interprofessional Communication & Collaboration', emoji: '🤝', lectureRange: 'Lectures 1' }, { id: 2, title: 'Handover Protocols, SBAR & Team Safety', emoji: '📋', lectureRange: 'Lectures 2' }] },

  // Year 4 — Semester 2
  { code: 'MED3-4', name: 'General & Special Internal Medicine 2', year: 4, semester: 2, creditPoints: 5.5, totalMarks: 110, keywords: ['internal medicine', 'med3'], chapters: [{ id: 1, title: 'Neurology', emoji: '🧠', lectureRange: 'Lectures 1' }, { id: 2, title: 'Endocrinology & Diabetes', emoji: '🍬', lectureRange: 'Lectures 2' }, { id: 3, title: 'Hematology & Oncology', emoji: '🩸', lectureRange: 'Lectures 3' }, { id: 4, title: 'Rheumatology & Clinical Immunology', emoji: '🦴', lectureRange: 'Lectures 4' }, { id: 5, title: 'Geriatrics & Psychiatry', emoji: '👴', lectureRange: 'Lectures 5' }] },
  { code: 'PED-4', name: 'Pediatrics', year: 4, semester: 2, creditPoints: 3.5, totalMarks: 70, keywords: ['pediatrics', 'ped'], chapters: [{ id: 1, title: 'Growth, Development & Nutrition', emoji: '👶', lectureRange: 'Lectures 1' }, { id: 2, title: 'Neonatology', emoji: '🍼', lectureRange: 'Lectures 2' }, { id: 3, title: 'Pediatric Infectious Diseases & Systemic Pathology', emoji: '🦠', lectureRange: 'Lectures 3' }] },

  // Year 5 — Semester 1
  { code: 'OO-5', name: 'Ophthalmology', year: 5, semester: 1, creditPoints: 2, totalMarks: 40, keywords: ['ophthalmology', 'eye', 'oo'], chapters: [{ id: 1, title: 'Optics & Refraction', emoji: '👓', lectureRange: 'Lectures 1' }, { id: 2, title: 'Anterior & Posterior Segment Diseases', emoji: '👁️', lectureRange: 'Lectures 2' }, { id: 3, title: 'Neuro-ophthalmology & Eye Injuries', emoji: '🧠', lectureRange: 'Lectures 3' }] },
  { code: 'SUR1-5', name: 'General & Special Surgery 1', year: 5, semester: 1, creditPoints: 4, totalMarks: 80, keywords: ['surgery', 'sur1'], chapters: [{ id: 1, title: 'Perioperative Care & General Surgery', emoji: '🏥', lectureRange: 'Lectures 1' }, { id: 2, title: 'Abdominal & Hernia Surgery', emoji: '🩹', lectureRange: 'Lectures 2' }, { id: 3, title: 'Endocrine & Breast Surgery', emoji: '💊', lectureRange: 'Lectures 3' }] },
  { code: 'EM1-5', name: 'Emergency Medicine & Trauma 1', year: 5, semester: 1, creditPoints: 2, totalMarks: 40, keywords: ['emergency', 'trauma', 'em1'], chapters: [{ id: 1, title: 'Resuscitation & Critical Care', emoji: '🚑', lectureRange: 'Lectures 1' }, { id: 2, title: 'Advanced Trauma Life Support', emoji: '🩺', lectureRange: 'Lectures 2' }] },

  // Year 5 — Semester 2
  { code: 'SUR2-5', name: 'General & Special Surgery 2', year: 5, semester: 2, creditPoints: 4, totalMarks: 80, keywords: ['surgery', 'sur2'], chapters: [{ id: 1, title: 'Orthopedics & Musculoskeletal Trauma', emoji: '🦴', lectureRange: 'Lectures 1' }, { id: 2, title: 'Urology & Male Genital Surgery', emoji: '♂️', lectureRange: 'Lectures 2' }, { id: 3, title: 'Neurosurgery & Specialty Surgery', emoji: '🧠', lectureRange: 'Lectures 3' }] },
  { code: 'EM2-5', name: 'Emergency Medicine & Trauma 2', year: 5, semester: 2, creditPoints: 2, totalMarks: 40, keywords: ['emergency', 'trauma', 'em2'], chapters: [{ id: 1, title: 'Environmental & Toxicological Emergencies', emoji: '☠️', lectureRange: 'Lectures 1' }] },
  { code: 'OG-5', name: 'Obstetrics & Gynecology', year: 5, semester: 2, creditPoints: 3.5, totalMarks: 70, keywords: ['obstetrics', 'gynecology', 'og'], chapters: [{ id: 1, title: 'Antenatal Care & Pregnancy Complications', emoji: '🤰', lectureRange: 'Lectures 1' }, { id: 2, title: 'Labor & Obstetric Emergencies', emoji: '👶', lectureRange: 'Lectures 2' }, { id: 3, title: 'General Gynecology & Gynecologic Oncology', emoji: '♀️', lectureRange: 'Lectures 3' }] },
];

function buildPlaceholder(info: ModuleInfo) {
  return {
    schemaVersion: 1,
    comingSoon: true,
    meta: {
      moduleCode: info.code,
      moduleName: info.name,
      year: info.year,
      semester: info.semester,
      creditPoints: info.creditPoints,
      totalMarks: info.totalMarks,
      keywords: info.keywords,
    },
    chapters: info.chapters.map((ch) => ({
      id: ch.id,
      title: ch.title,
      subtitle: ch.title,
      emoji: ch.emoji,
      page: ch.id,
      lectureRange: ch.lectureRange,
      subjects: [] as any[],
      keywords: [] as string[],
    })),
  };
}

async function main() {
  let created = 0;
  let skipped = 0;

  for (const info of MODULES) {
    if (existingModules.has(info.code)) {
      skipped++;
      continue;
    }

    const dir = join('src', 'imports', `year-${info.year}`, `semester-${info.semester}`);
    await mkdir(dir, { recursive: true });

    const filePath = join(dir, `${info.code}.json`);
    const data = buildPlaceholder(info);
    await writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    created++;
    console.log(`✅ Created ${filePath}`);
  }

  console.log(`\n═══════════════════════════════════════════════════════════════`);
  console.log(`  Placeholder Generation Report`);
  console.log(`═══════════════════════════════════════════════════════════════`);
  console.log(`  Created:  ${created}`);
  console.log(`  Skipped (already exist): ${skipped}`);
  console.log(`═══════════════════════════════════════════════════════════════`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
