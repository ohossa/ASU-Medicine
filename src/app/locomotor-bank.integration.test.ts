import { beforeAll, describe, it, expect } from 'vitest';
import bank from '../imports/year-1/semester-2/MLS-1.json';
import { validateModuleFile } from '../../data-format-v2/scripts/validate-banks';
import { ensureDataLoaded, getChaptersForModuleAndMode, getModuleQuestionCounts, isModuleActive } from './data';
import type { Question, QuizAnswer } from './types';
import { checkAnswerCorrect } from './utils/quiz';
import { restoreHistoryQuestions } from './utils/historyQuestions';
import { getMissedQuestions } from './utils/missedQuestions';
import { practiceTopics, selectedPractice } from './learning/customPractice';
import { sessionMatchesQuestions } from './preferences/shuffle';

const canonical = (bank as unknown as { chapters: { subjects: { questions: Question[] }[] }[] }).chapters.flatMap(c => c.subjects.flatMap(s => s.questions));
const loaded = () => getChaptersForModuleAndMode('MLS-1', 'mixed').flatMap(c => c.subjects.flatMap(s => s.questions));

describe('Year 1 Semester 2 Locomotor Module (MLS-1) intake integration', () => {
  beforeAll(async () => {
    await ensureDataLoaded();
  });

  it('validates MLS-1 schema, metadata, active status and unique question IDs', () => {
    expect(validateModuleFile(bank as Parameters<typeof validateModuleFile>[0])).toEqual([]);
    expect(bank.meta).toMatchObject({
      moduleCode: 'MLS-1',
      year: 1,
      semester: 2,
      creditPoints: 3,
      totalMarks: 60,
    });
    expect(canonical.length).toBe(2134);
    expect(isModuleActive('MLS-1')).toBe(true);
    expect(bank.chapters.map(c => c.title)).toEqual([
      'Upper Limb Anatomy & Injuries',
      'Lower Limb Anatomy & Injuries',
      'Spine & Musculoskeletal Pathologies',
    ]);
    expect(new Set(canonical.map(q => q.id)).size).toBe(canonical.length);
  });

  it('preserves all questions, types, options, keys, and grading through the runtime loader', () => {
    const runtime = loaded();
    expect(runtime).toHaveLength(canonical.length);
    expect(getModuleQuestionCounts('MLS-1').totalCount).toBe(canonical.length);
    const byId = new Map(runtime.map(q => [q.id, q]));

    for (const source of canonical) {
      const q = byId.get(source.id)!;
      expect(q, `Question ${source.id} must exist`).toBeDefined();
      expect(q.type).toBe(source.type);
      expect(q.text).toBe(source.text);
      expect(q.lecture).toBe(source.lecture);
      expect(q.options).toEqual(source.options);
      expect(q.correctIndex).toBe(source.correctIndex);
      expect(q.modelAnswer ?? null).toEqual(source.modelAnswer ?? null);
      expect(q.explanation).toBe(source.explanation);
      expect(q.contentVersion).toMatch(/^[a-f0-9]{64}$/);

      if (q.type === 'mcq') {
        expect(checkAnswerCorrect(q, q.correctIndex)).toBe(true);
        expect(checkAnswerCorrect(q, ((q.correctIndex ?? 0) + 1) % (q.options?.length || 4))).toBe(false);
        expect(checkAnswerCorrect(q, undefined)).toBe(false);
      }

      if (q.type === 'case') {
        expect(Array.isArray(q.subQuestions)).toBe(true);
        for (const child of q.subQuestions ?? []) {
          expect(child.modelAnswer?.length).toBeGreaterThan(5);
        }
      }
    }
  });

  it('provides complete practice topics with working batch selection', () => {
    const chapters = getChaptersForModuleAndMode('MLS-1', 'mixed');
    const topics = chapters.flatMap(c => practiceTopics(c, 'MLS-1'));
    const nonEmptyTopics = topics.filter(t => t.questions.length > 0);
    expect(nonEmptyTopics.length).toBeGreaterThan(20);
    expect(nonEmptyTopics.reduce((n, t) => n + t.questions.length, 0)).toBe(canonical.length);

    for (const chapter of chapters) {
      const chapterNonEmpty = practiceTopics(chapter, 'MLS-1').filter(t => t.questions.length > 0);
      for (const topic of chapterNonEmpty) {
        for (const count of [20, 40, topic.questions.length]) {
          const subset = topic.questions.slice(0, count);
          const run = selectedPractice(chapter, practiceTopics(chapter, 'MLS-1'), new Set(subset.map(q => String(q.id))));
          expect(run.questions.map(q => q.id)).toEqual(subset.map(q => q.id));
          expect(run.subject.name).toBe(topic.title);
        }
      }
    }
  });

  it('maintains session stability, missed questions tracking, and version tamper detection', () => {
    const qs = loaded().filter(q => q.type === 'mcq').slice(0, 40);
    const answers: Record<number, QuizAnswer> = {};
    qs.forEach((q, i) => {
      answers[i] = q.correctIndex!;
    });
    const restored = restoreHistoryQuestions(qs.map(q => q.id), [...qs].reverse(), answers, []);
    expect(restored.questions.map(q => q.id)).toEqual(qs.map(q => q.id));
    expect(getMissedQuestions(restored.questions, restored.answers)).toEqual([]);

    delete restored.answers[0];
    expect(getMissedQuestions(restored.questions, restored.answers).map(q => q.id)).toEqual([qs[0].id]);

    const saved = { questionIds: qs.map(q => q.id), questionVersions: qs.map(q => q.contentVersion!) };
    expect(sessionMatchesQuestions(qs, saved)).toBe(true);
    expect(sessionMatchesQuestions(qs, { ...saved, questionVersions: saved.questionVersions.map((v, i) => (i === 0 ? 'tampered' : v)) })).toBe(false);
  });
});
