import type { Question } from '../types';

export function checkAnswerCorrect(q: Question, ans: unknown): boolean {
  if (ans === undefined || ans === null) return false;

  switch (q.type) {
    case 'mcq':
    case 'truefalse':
      return ans === q.correctIndex;

    case 'matching': {
      const pairs = q.pairs ?? [];
      const ansObj = ans as Record<string, unknown>;
      const scrambled: string[] = (ansObj?.scrambled as string[]) ?? [];
      const matches: Record<number, number> = (ansObj?.matches as Record<number, number>) ?? {};
      if (!pairs.length || !scrambled.length) return false;
      return pairs.every((p, i) => {
        const matchedIndex = matches[i];
        if (matchedIndex === undefined) return false;
        const matchedText = scrambled[matchedIndex];
        return matchedText === p.target;
      });
    }

    case 'essay':
      return (ans as Record<string, unknown>)?.selfGrade === 'correct';

    case 'fillblank': {
      const ansObj = ans as Record<string, unknown>;
      const inputs: string[] = (ansObj?.inputs as string[]) ?? [];
      const blanks: string[] = q.blanks ?? [];
      const accepted: string[][] = q.acceptedAnswers ?? [];
      if (!blanks.length) return false;
      return blanks.every((primary, i) => {
        const user = (inputs[i] ?? '').trim().toLowerCase();
        if (!user) return false;
        const alternatives = (accepted[i] ?? []).map((a: string) => a.trim().toLowerCase());
        return user === primary.trim().toLowerCase() || alternatives.includes(user);
      });
    }

    case 'case':
    case 'casestudy': {
      const subs = q.subQuestions ?? [];
      if (!subs.length) return false;
      const ansObj = ans as Record<string, unknown>;
      return subs.every((sq) => {
        const subAns = ansObj?.[sq.id];
        if (sq.type === 'mcq') {
          return subAns === sq.correctIndex;
        } else if (sq.type === 'fillblank') {
          return checkAnswerCorrect(sq, subAns);
        } else {
          return (subAns as Record<string, unknown>)?.selfGrade === 'correct';
        }
      });
    }

    default:
      return false;
  }
}
