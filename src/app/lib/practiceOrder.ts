/** Presentation only: preserve source IDs, topic numbers and order within each collection. */
export function isPastExamSection(section: {bankSection?: string; title?: string; name?: string}): boolean {
 return section.bankSection === 'past-exams' || /\b(?:past|previous)\s+(?:exam(?:ination)?s?|papers?)\b|الامتحانات السابقة|امتحانات سابقة/i.test(section.title || section.name || '');
}
export function pastExamsFirst<T extends {bankSection?: string; title?: string; name?: string}>(sections: readonly T[]): T[] {
 return [...sections.filter(isPastExamSection), ...sections.filter(section=>!isPastExamSection(section))];
}
