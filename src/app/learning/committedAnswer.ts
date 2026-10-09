interface AnswerQuestion { type: string; subQuestions?: Array<{ id: string | number; type: string }> }
/** Grade a case part as it is committed; never submit a typing draft for XP. */
export function committedAnswer(question: AnswerQuestion, answer: unknown): boolean {
  if (answer === undefined || answer === null) return false;
  if (question.type === 'mcq' || question.type === 'truefalse') return typeof answer === 'boolean' || typeof answer === 'number';
  if (typeof answer !== 'object') return false;
  const value = answer as Record<string, unknown>;
  if (question.type === 'essay') return value.selfGrade === 'correct' || value.selfGrade === 'incorrect';
  if (question.type === 'matching' || question.type === 'fillblank') return value.submitted === true;
  return (question.subQuestions ?? []).some(child => committedAnswer(child, value[child.id]));
}
export function committedAnswerValue(question: AnswerQuestion, answer: unknown): unknown {
  if (!committedAnswer(question, answer)) return undefined;
  if (question.type !== 'case' && question.type !== 'casestudy') return answer;
  const value = answer as Record<string, unknown>;
  return Object.fromEntries((question.subQuestions ?? []).flatMap(child => {
    const committed = committedAnswerValue(child, value[child.id]);
    return committed === undefined ? [] : [[child.id, committed]];
  }));
}
