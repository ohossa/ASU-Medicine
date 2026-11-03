import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import type { ChapterData } from '../types';
import { practiceTopics } from './customPractice';
import {
  MRS_CONTINUOUS_II_CONFIG,
  isMrsContinuousTopic,
  filterMrsContinuousTopics,
  filterMrsContinuousChapters,
  generateMrsContinuousMockExam,
} from './mrsContinuousExam';

describe('MRS-2 Continuous II Assessment Blueprint Engine', () => {
  const mrsBank = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '../../imports/year-2/semester-1/MRS-2.json'),
      'utf8'
    )
  );
  const chapters = mrsBank.chapters as ChapterData[];

  it('validates official 2026/2027 faculty blueprint parameters', () => {
    expect(MRS_CONTINUOUS_II_CONFIG.moduleCode).toBe('MRS-2');
    expect(MRS_CONTINUOUS_II_CONFIG.totalLectures).toBe(30);
    expect(MRS_CONTINUOUS_II_CONFIG.totalMarks).toBe(38);
    expect(MRS_CONTINUOUS_II_CONFIG.durationMinutes).toBe(49);

    const totalMarks = MRS_CONTINUOUS_II_CONFIG.units.reduce((sum, u) => sum + u.marks, 0);
    expect(totalMarks).toBe(38);

    expect(MRS_CONTINUOUS_II_CONFIG.units.find(u => u.id === 'unit-1')?.marks).toBe(10);
    expect(MRS_CONTINUOUS_II_CONFIG.units.find(u => u.id === 'unit-2')?.marks).toBe(8);
    expect(MRS_CONTINUOUS_II_CONFIG.units.find(u => u.id === 'unit-4')?.marks).toBe(9);
    expect(MRS_CONTINUOUS_II_CONFIG.units.find(u => u.id === 'unit-5')?.marks).toBe(7);
    expect(MRS_CONTINUOUS_II_CONFIG.units.find(u => u.id === 'unit-6')?.marks).toBe(4);
  });

  it('correctly identifies whether an individual topic belongs to Continuous II', () => {
    const allTopics = chapters.flatMap(ch => practiceTopics(ch, 'MRS-2'));
    const noseTopic = allTopics.find(t => t.title.includes('Nose, Nasal Cavity'));
    const lungsTopic = allTopics.find(t => t.title.includes('Lungs, Bronchial Tree'));

    expect(noseTopic).toBeDefined();
    expect(lungsTopic).toBeDefined();
    expect(isMrsContinuousTopic(noseTopic!, 'MRS-2')).toBe(true);
    expect(isMrsContinuousTopic(lungsTopic!, 'MRS-2')).toBe(false);
  });

  it('filters all module topics down to exactly the 13 Continuous II topics with 1,282 questions', () => {
    const allTopics = chapters.flatMap(ch => practiceTopics(ch, 'MRS-2'));
    expect(allTopics.length).toBe(27); // Total 27 topics in full module

    const continuousTopics = filterMrsContinuousTopics(allTopics, 'MRS-2');
    expect(continuousTopics.length).toBe(13);

    const totalContinuousQuestions = continuousTopics.reduce(
      (sum, t) => sum + t.questions.length,
      0
    );
    expect(totalContinuousQuestions).toBe(1282);

    // Verify unassessed topics are strictly excluded
    const excludedTitles = [
      'Pulmonary Trematodes',
      'Pulmonary Eosinophilia',
      'Respiratory Arthropods',
      'Lung Tumors & Neoplasms',
      'Infectious Pulmonary Diseases',
      'Pulmonary Gas Exchange',
      'Gas Transport, Regulation of Respiration',
      'Antitussives, Expectorants & Mucolytics',
      'Antimicrobial & Antitubercular Pharmacotherapy',
      'Lower Respiratory Bacterial Infections',
      'Lungs, Bronchial Tree & Pleura',
      'Bronchial Tree, Alveoli & Respiratory Membrane',
      'Pulmonary Surfactant Metabolism & Molecular Basis of Lung Disease',
    ];

    for (const title of excludedTitles) {
      expect(
        continuousTopics.some(t => t.title.includes(title)),
        `Excluded topic '${title}' should not be in Continuous II`
      ).toBe(false);
    }
  });

  it('filterMrsContinuousChapters produces clean scoped chapters omitting Parasitology and unassessed topics', () => {
    const filteredChapters = filterMrsContinuousChapters(chapters, 'MRS-2');
    expect(filteredChapters).toHaveLength(3);

    // Chapter 1: Anatomy (3 topics) + Histology (2 topics)
    const ch1 = filteredChapters.find(c => c.id === 1)!;
    expect(ch1.subjects).toHaveLength(2);
    expect(ch1.subjects[0].lectureNames).toEqual([
      'Nose, Nasal Cavity & Paranasal Sinuses',
      'Pharynx, Larynx & Trachea',
      'Thoracic Cage, Intercostal Spaces & Diaphragm',
    ]);
    expect(ch1.subjects[1].lectureNames).toEqual([
      'Upper Respiratory Tract & Olfactory Mucosa',
      'Larynx, Epiglottis & Trachea',
    ]);

    // Chapter 2: Physiology (2 topics) + Biochemistry (2 topics)
    const ch2 = filteredChapters.find(c => c.id === 2)!;
    expect(ch2.subjects).toHaveLength(2);
    expect(ch2.subjects[0].lectureNames).toEqual([
      'Mechanics of Breathing, Compliance & Surfactant',
      'Lung Volumes, Capacities & Spirometry',
    ]);
    expect(ch2.subjects[1].lectureNames).toEqual([
      'Oxidative Phosphorylation & Electron Transport Chain',
      'Krebs Cycle, Pyruvate Oxidation & Metabolic Shuttles',
    ]);

    // Chapter 3: Pathology (2 topics) + Pharma (1 topic) + Microbiology (1 topic) + 0 Parasitology
    const ch3 = filteredChapters.find(c => c.id === 3)!;
    expect(ch3.subjects).toHaveLength(3);
    const subIds = ch3.subjects.map(s => s.id);
    expect(subIds).toContain('pathology');
    expect(subIds).toContain('pharma');
    expect(subIds).toContain('microbiology');
    expect(subIds).not.toContain('parasitology');
  });

  it('generateMrsContinuousMockExam generates exactly 38 questions following the faculty quota', () => {
    const mockExam = generateMrsContinuousMockExam(chapters, 'en', 'test-seed-123');

    expect(mockExam.questions).toHaveLength(38);
    expect(mockExam.virtualChapter.title).toContain('Continuous II Assessment');
    expect(mockExam.virtualChapter.subtitle).toContain('38 MCQs · 49 Minutes');

    // Verify all 38 IDs are unique
    const uniqueIds = new Set(mockExam.questions.map(q => q.id));
    expect(uniqueIds.size).toBe(38);

    // Verify questions come only from Continuous II pool
    const allTopics = chapters.flatMap(ch => practiceTopics(ch, 'MRS-2'));
    const continuousTopicKeys = new Set(
      filterMrsContinuousTopics(allTopics, 'MRS-2').map(t => t.key)
    );

    for (const q of mockExam.questions) {
      expect(q.practiceTopic).toBeDefined();
      expect(continuousTopicKeys.has(q.practiceTopic!.key)).toBe(true);
    }
  });
});
