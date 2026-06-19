import type { Question } from '../types';

export function assignDefaultDifficulty(q: Question): 1 | 2 | 3 | 4 | 5 {
  if (q.difficulty !== undefined) return q.difficulty;
  let score = 3;
  if (q.type === 'truefalse') score = 1;
  if (q.type === 'matching') score = 3;
  if (q.type === 'essay') score = 4;
  if (q.type === 'case_study') score = 5;
  
  const complexTerms = /(?:metabolism|pathophysiology|pharmacokinetics|immunohistochemistry|cerebellopontine|electroencephalographic|neurotransmitters|immunofluorescence)/i;
  if (complexTerms.test(q.text)) score += 1;
  
  if (q.type === 'mcq' && Array.isArray(q.options)) {
    if (q.options.length <= 2) score -= 1;
    if (q.options.length >= 5) score += 1;
    if (q.options.some(o => /all of the above|none of the above/i.test(o))) score += 1;
  }
  
  if (q.explanation && q.explanation.length > 500) score += 1;
  if (q.explanation && q.explanation.length < 80) score -= 1;
  
  return Math.max(1, Math.min(5, score)) as 1 | 2 | 3 | 4 | 5;
}

export function assignDefaultBloomLevel(q: Question): NonNullable<Question['bloomLevel']> {
  if (q.bloomLevel !== undefined) return q.bloomLevel;
  if (/what is|name|list|identify|define/i.test(q.text)) return 'remember';
  if (/why does|explain|how does|describe/i.test(q.text)) return 'understand';
  if (/apply|calculate|determine|prescribe/i.test(q.text)) return 'apply';
  if (/compare|contrast|differentiate|analyze|evaluate causes/i.test(q.text)) return 'analyze';
  if (/best|most appropriate|most likely|prioritize|justify/i.test(q.text)) return 'evaluate';
  if (/design|create|formulate|synthesize/i.test(q.text)) return 'create';
  if (q.type === 'truefalse') return 'remember';
  if (q.type === 'case_study') return 'evaluate';
  if (q.type === 'essay') return 'analyze';
  return 'apply';
}