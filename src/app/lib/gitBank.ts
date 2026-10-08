import type { QuizSessionSave } from '../hooks/useQuizSession';
import type { ChapterData, QuestionCollection, SubjectData, Question } from '../types';

/** GIT stores separate navigation chapters for each collection; question IDs stay unchanged. */
export function selectGitCollection(chapters: ChapterData[], collection: QuestionCollection): ChapterData[] {
  return chapters.filter(chapter => (chapter.bankSection ?? 'practice') === collection);
}

/** Present each ordered iNerd topic as a selectable card, preserving its lecture number. */
export function toGitTopicChapter(chapter: ChapterData): ChapterData {
  const topics: SubjectData[] = chapter.subjects.flatMap(subject =>
    subject.lectureNum !== undefined ? [subject] : (subject.lectureNames ?? []).map((name, index) => ({
      ...subject,
      name,
      lectures: name,
      lectureCount: 1,
      lectureNames: [name],
      lectureNum: index + 1,
      questions: subject.questions.filter(question => question.lecture === index + 1),
    })),
  );
  return { ...chapter, subjects: topics };
}

/** Saved answers use array indices; switching mode must never attach them to another list. */
export function canResumeGitSession(session: Pick<QuizSessionSave, 'questionIds'>, questions: Question[]): boolean {
  return Boolean(session.questionIds && session.questionIds.length === questions.length
    && session.questionIds.every((id, index) => String(id) === String(questions[index].id)));
}
