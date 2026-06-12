import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const STRUCTURE = {
  'year-1': {
    'semester-1': [
      'IAE-1 [Introduction to Anatomy and Embryology]',
      'IPHY-1 [Introduction to Physiology]',
      'IBM-1 [Introduction to Medical Biochemistry]',
      'IHC-1 [Introduction to Histology and Cell Biology]',
      'MIM-1 [Immunology Module]',
      'MBMG-1 [Molecular Biology and Medical Genetics]'
    ],
    'semester-2': [
      'IPAT-1 [Introduction to Pathology]',
      'IPHA-1 [Introduction to Clinical Pharmacology]',
      'MINF-1 [Infection Module]',
      'MLS-1 [Locomotor Module]'
    ]
  },
  'year-2': {
    'semester-1': [
      'MBL-2 [Blood and Lymphatic System]',
      'MRS-2 [Respiratory System]',
      'MCVS-2 [Cardiovascular System]'
    ],
    'semester-2': [
      'MCNS-2 [Central Nervous System]',
      'MSS-2 [Special Senses]',
      'MEM-2 [Endocrine System and Metabolism]'
    ]
  },
  'year-3': {
    'semester-1': [
      'MGL-3 [GIT and Liver]',
      'MUG-3 [Urogenital System]'
    ],
    'semester-2': [
      'CEO-3 [Community Environmental and Occupational Medicine]',
      'FT-3 [Forensic Medicine and Clinical Toxicology]',
      'ORL-3 [Otorhinolaryngology]',
      'MED1-3 [Foundation of Internal Medicine]'
    ]
  },
  'year-4': {
    'semester-1': [
      'MED2-4 [General and Special Internal Medicine 1]',
      'FAM-4 [Family Medicine]'
    ],
    'semester-2': [
      'MED3-4 [General and Special Internal Medicine 2]',
      'PED-4 [Pediatrics]'
    ]
  },
  'year-5': {
    'semester-1': [
      'OO-5 [Ophthalmology]',
      'SUR1-5 [General and Special Surgery 1]',
      'EM1-5 [Emergency Medicine and Trauma 1]'
    ],
    'semester-2': [
      'SUR2-5 [General and Special Surgery 2]',
      'EM2-5 [Emergency Medicine and Trauma 2]',
      'OG-5 [Obstetrics and Gynecology]'
    ]
  }
};

const INTAKE_ROOT = 'data-format-v2/question-intake';
const SUBFOLDERS = ['_raw', '_ready', '_imported', '_reports', '_rejected'];

async function main() {
  for (const [year, semesters] of Object.entries(STRUCTURE)) {
    for (const [semester, modules] of Object.entries(semesters)) {
      for (const moduleName of modules) {
        for (const sub of SUBFOLDERS) {
          const path = join(INTAKE_ROOT, year, semester, moduleName, sub);
          await mkdir(path, { recursive: true });
        }
      }
    }
  }
  console.log('Successfully created all intake folders.');
}

main().catch(console.error);
