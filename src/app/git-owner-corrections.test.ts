import { describe, it, expect } from 'vitest';
import bank from '../imports/year-3/semester-1/MGL-3.json';
interface CorrectionQuestion {
  id: string;
  text: string;
  explanation: string;
  options?: string[];
  correctIndex?: number;
}
const preparedBank = bank as unknown as {
  chapters: Array<{ bankSection?: string; subjects: Array<{ questions: CorrectionQuestion[] }> }>;
};
const questions = preparedBank.chapters.flatMap(c => c.subjects.flatMap(s => s.questions));
const find = (id: string) => questions.find(q => q.id === id)!;
describe('Past exam owner corrections', () => {
  it('restores the chief-cell question with an available correct option', () => {
    const q = find('MGL3-CH3-HIST-0583');
    expect(q).toBeDefined();
    expect(q.options![q.correctIndex!]).toBe('Chief cells');
    expect(q.explanation).toMatch(/rough ER|rough endoplasmic reticulum/i);
    expect(preparedBank.chapters.find(c=>c.subjects.some(s=>s.questions.some(x=>x.id===q.id)))!.bankSection).toBe('past-exams');
  });
  it('keeps the corrected gastric-emptying and acute-mumps answers', () => {
    const gastrin=find('MGL3-CH2-PHYS-0292'), mumps=find('MGL3-CH5-PATH-0095');
    expect(gastrin.options![gastrin.correctIndex!]).toBe('Gastrin');
    expect(mumps.options![mumps.correctIndex!]).toBe('IgM');
  });
  it('asks the preserved vomiting response and matches the supplied E answer', () => {
    const q=find('MGL3-CH2-PHYS-0299');
    expect(q.text).toMatch(/remains possible|remains effective|still occur/i);
    expect(q.correctIndex).toBe(4);
    expect(q.options![4]).toBe('Vomiting caused by motion sickness');
    expect(q.explanation).toMatch(/vestibular/i);
  });
  it('excludes the four exam stems with several valid options', () => {
    for(const id of ['MGL3-CH1-ANAT-0127','MGL3-CH1-ANAT-0396','MGL3-CH2-PHYS-0132','MGL3-CH2-PHYS-0289'])
      expect(questions.some(q=>q.id===id),id).toBe(false);
  });
});
