import { describe, it, expect } from 'vitest';
import {
  selectedMultiChapterPractice,
  resumeMultiChapterPractice,
} from './customPractice';
import type { ChapterData, Question } from '../types';

const makeQuestion = (id: string, lecture = 1): Question => ({
  id,
  lecture,
  type: 'mcq',
  text: `Question ${id}`,
  explanation: '',
  subjectColor: 'anatomy',
  correctIndex: 0,
});

const chapter1: ChapterData = {
  id: 1,
  title: 'Neck Anatomy',
  subtitle: 'Cervical region',
  emoji: '🦴',
  page: 1,
  lectureRange: '1-2',
  accentColor: 'anatomy',
  subjects: [
    {
      id: 'anatomy',
      name: 'Anatomy',
      iconName: 'Bone',
      lectures: '2 Lectures',
      lectureCount: 2,
      lectureNames: ['Triangles of Neck', 'Carotid Sheath'],
      questions: [makeQuestion('q1-1', 1), makeQuestion('q1-2', 2)],
    },
  ],
};

const chapter2: ChapterData = {
  id: 2,
  title: 'Thorax Anatomy',
  subtitle: 'Mediastinum and lungs',
  emoji: '🫁',
  page: 2,
  lectureRange: '1-2',
  accentColor: 'physiology',
  subjects: [
    {
      id: 'physiology',
      name: 'Physiology',
      iconName: 'Activity',
      lectures: '1 Lecture',
      lectureCount: 1,
      lectureNames: ['Pleura & Lungs'],
      questions: [makeQuestion('q2-1', 1), makeQuestion('q2-2', 1)],
    },
  ],
};

describe('selectedMultiChapterPractice', () => {
  it('combines questions across multiple chapters deterministically with topic attribution', () => {
    const chapters = [chapter1, chapter2];
    const selectedIds = new Set(['q1-1', 'q2-1']);

    const run = selectedMultiChapterPractice(chapters, selectedIds, 'TEST-1', 'en');

    expect(run.questions).toHaveLength(2);
    expect(run.questions[0].id).toBe('q1-1');
    expect(run.questions[0].practiceTopic?.title).toBe('Triangles of Neck');
    expect(run.questions[1].id).toBe('q2-1');
    expect(run.questions[1].practiceTopic?.title).toBe('Pleura & Lungs');

    // Virtual chapter properties
    expect(run.virtualChapter.id).toBe(0);
    expect(run.virtualChapter.title).toBe('Multi-Chapter Custom Practice');
    expect(run.virtualChapter.subtitle).toContain('2 topics across 2 chapters');

    // Subject session key is deterministic
    expect(run.subject.sessionKey).toMatch(/^custom:2:[0-9a-f]+$/);
    expect(run.subject.lectureCount).toBe(2);
  });

  it('renders localized Arabic text when language is ar', () => {
    const chapters = [chapter1, chapter2];
    const selectedIds = new Set(['q1-2']);

    const run = selectedMultiChapterPractice(chapters, selectedIds, 'TEST-1', 'ar');

    expect(run.virtualChapter.title).toBe('تدريب مخصص عبر الفصول');
    expect(run.subject.lectures).toBe('موضوعات مختارة');
    expect(run.subject.name).toBe('Carotid Sheath'); // single topic preserves topic name
  });

  it('handles empty selection gracefully', () => {
    const chapters = [chapter1, chapter2];
    const run = selectedMultiChapterPractice(chapters, new Set(), 'TEST-1', 'en');

    expect(run.questions).toHaveLength(0);
    expect(run.subject.lectureCount).toBe(0);
  });
});

describe('resumeMultiChapterPractice', () => {
  it('restores exact saved question order and subject configuration', () => {
    const chapters = [chapter1, chapter2];
    const initialRun = selectedMultiChapterPractice(chapters, new Set(['q1-1', 'q2-1']), 'TEST-1', 'en');

    const saved = {
      subjectName: initialRun.subject.sessionKey!,
      questionIds: ['q2-1', 'q1-1'], // Reordered question IDs
    };

    const resumed = resumeMultiChapterPractice(chapters, saved, 'TEST-1', 'en');

    expect(resumed).not.toBeNull();
    expect(resumed?.questions.map(q => q.id)).toEqual(['q2-1', 'q1-1']);
    expect(resumed?.questions[0].practiceTopic?.title).toBe('Pleura & Lungs');
    expect(resumed?.questions[1].practiceTopic?.title).toBe('Triangles of Neck');
  });

  it('returns null if question IDs do not match or are invalid', () => {
    const chapters = [chapter1, chapter2];
    const initialRun = selectedMultiChapterPractice(chapters, new Set(['q1-1']), 'TEST-1', 'en');

    const saved = {
      subjectName: initialRun.subject.sessionKey!,
      questionIds: ['non-existent-id'],
    };

    const resumed = resumeMultiChapterPractice(chapters, saved, 'TEST-1', 'en');
    expect(resumed).toBeNull();
  });
});
