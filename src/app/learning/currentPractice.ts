import type { Question } from "../types";
/** Historical keys are for review only. Every new attempt uses currently published content. */
export function currentPractice(previous: Question[], published: Question[]) {
  const byId = new Map(published.map((q) => [String(q.id), q]));
  return previous.flatMap((q) => {
    const current = byId.get(String(q.id));
    return current ? [q.practiceTopic ? {...current,practiceTopic:q.practiceTopic} : current] : [];
  });
}
