import type { SubjectData } from "../types";
export function studyTopics(subject: SubjectData) {
  if (!subject.lectureNames?.length)
    return [
      { name: subject.name, lecture: undefined, questions: subject.questions },
    ];
  return subject.lectureNames
    .map((name, i) => ({
      name,
      lecture: i + 1,
      questions: subject.questions.filter((q) => (q.lecture ?? 1) === i + 1),
    }))
    .filter((t) => t.questions.length);
}
