/** Presentation only: preserve source IDs, topic numbers and order within each collection. */
export function isPastExamSection(section: {bankSection?: string; title?: string; name?: string}): boolean {
 return section.bankSection === 'past-exams' || /\b(?:past|previous)\s+(?:exam(?:ination)?s?|papers?)\b|الامتحانات السابقة|امتحانات سابقة/i.test(section.title || section.name || '');
}
export function pastExamsFirst<T extends {bankSection?: string; title?: string; name?: string}>(sections: readonly T[]): T[] {
 return [...sections.filter(isPastExamSection), ...sections.filter(section=>!isPastExamSection(section))];
}

/** Empty exam collections have no navigation entry in the selected study mode. */
export function visiblePracticeChapters<T extends {bankSection?: string; title?: string; name?: string; subjects: readonly {questions: readonly unknown[]}[]}>(sections: readonly T[]): T[] {
 return sections.filter(section => !isPastExamSection(section) || section.subjects.some(subject => subject.questions.length > 0));
}
