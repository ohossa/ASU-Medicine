import { ensureModuleDataLoaded, getChaptersForModuleAndMode } from '../data';
import type { MockExamConfig, MockExamQuestion } from '../types/mockExam';

/**
 * Deterministically and proportionally generates a Mock Exam from the module's questions.
 */
export async function generateMockExamQuestions(config: MockExamConfig): Promise<MockExamQuestion[]> {
  const code = config.moduleCode.toUpperCase();
  await ensureModuleDataLoaded(code);

  const chapters = getChaptersForModuleAndMode(code, 'mcq');

  const pool: MockExamQuestion[] = [];

  for (const chapter of chapters) {
    for (const subject of chapter.subjects) {
      if (config.selectedSubjects && config.selectedSubjects.length > 0) {
        if (!config.selectedSubjects.includes(subject.id) && !config.selectedSubjects.includes(subject.name)) {
          continue;
        }
      }

      for (const q of subject.questions) {
        if (!q.text) continue;
        pool.push({
          ...q,
          subjectName: subject.name,
          chapterTitle: chapter.title,
          isFlagged: false,
          timeSpentSeconds: 0,
        });
      }
    }
  }

  if (pool.length === 0) {
    return [];
  }

  // Group by subject for balanced curricular distribution
  const bySubject = new Map<string, MockExamQuestion[]>();
  for (const q of pool) {
    const sName = q.subjectName || 'General';
    if (!bySubject.has(sName)) {
      bySubject.set(sName, []);
    }
    bySubject.get(sName)!.push(q);
  }

  // Shuffle within each subject group using Fisher-Yates
  const shuffle = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const targetCount = Math.min(config.questionCount, pool.length);
  const selected: MockExamQuestion[] = [];
  const subjectKeys = Array.from(bySubject.keys());

  // Proportional round-robin sampling across subjects
  const shuffledSubjects = subjectKeys.map(k => ({
    name: k,
    questions: shuffle(bySubject.get(k)!),
    idx: 0,
  }));

  let round = 0;
  while (selected.length < targetCount) {
    let addedInRound = false;
    for (const group of shuffledSubjects) {
      if (group.idx < group.questions.length && selected.length < targetCount) {
        selected.push(group.questions[group.idx]);
        group.idx++;
        addedInRound = true;
      }
    }
    if (!addedInRound) break;
    round++;
  }

  // Final random shuffle so subjects are mixed realistically
  return shuffle(selected);
}
