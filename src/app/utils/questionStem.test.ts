import { describe, expect, it } from 'vitest';
import { cleanQuestionStem } from './questionStem';
import { ensureDataLoaded, getChaptersForModuleAndMode } from '../data';

describe('Question stem source numbering', () => {
  it.each([
    ['42. Which nerve supplies the tongue?', 'Which nerve supplies the tongue?'],
    ['42- only muscle supplied by vagus', 'only muscle supplied by vagus'],
    ['6 -Chronic hepatitis occurs when:', 'Chronic hepatitis occurs when:'],
    ['Question 9:A patient presents with pain.', 'A patient presents with pain.'],
    ['Question 10A 54 years old man presents.', 'A 54 years old man presents.'],
    ['Q2. Mention the muscles.', 'Mention the muscles.'],
    ['2. Question 2:A 22-year-old female presents.', 'A 22-year-old female presents.'],
    ['(42) Which structure is affected?', 'Which structure is affected?'],
    ['29-33. Match the muscles.', 'Match the muscles.'],
    ['16–20. Match the vessels.', 'Match the vessels.'],
    ['14 Ondansetron is effective in the following types of vomiting except:', 'Ondansetron is effective in the following types of vomiting except:'],
  ])('removes the source label in %s', (input, expected) => {
    expect(cleanQuestionStem(input)).toBe(expected);
  });
  it.each([
    '45 year old man develops gastric ulcer.',
    '10 boys are hospitalized with diarrhea.',
    '0.5 mg is administered.',
    'Q10 is a mitochondrial coenzyme.',
    '5-fluorouracil inhibits which enzyme?',
    '1,25-dihydroxyvitamin D acts on which receptor?',
    '1st intermediate host is:',
    '1ry bile acids are synthesized where?',
    '2/3 of the tongue is supplied by:',
    'Which nerve supplies the anterior 2/3?\n1. Explain its course.\n2. Name its branches.',
    'Which structure is affected?',
  ])('preserves clinical numbers and internal lists in %s', input => {
    expect(cleanQuestionStem(input)).toBe(input);
  });
  it('cleans live bank stems without changing source records, IDs or answers', async () => {
    await ensureDataLoaded();
    const questions = getChaptersForModuleAndMode('MGL-3', 'mixed').flatMap(c => c.subjects.flatMap(s => s.questions));
    const question = questions.find(q => q.text.includes('most posterior portion of the tongue is the:'))!;
    expect(question.text).toBe('The first lymph node receiving lymphatic drainage from the most posterior portion of the tongue is the:');
    expect(question.options?.[question.correctIndex!]).toMatch(/Jugulodigastric/i);
  });
});
