import { describe, it, expect } from 'vitest';
import { resolveSmartRouting, resolveContentRouting } from '../../data-format-v2/scripts/import-batch';

// A mock QuestionBankFile matching the ASU Portal schema
const mockBank: any = {
  schemaVersion: 1,
  meta: {
    moduleCode: 'TEST-1',
    moduleName: 'Test Module',
    year: 1,
    semester: 1,
  },
  chapters: [
    {
      id: 1,
      title: 'First Chapter',
      subjects: [
        {
          id: 'anatomy',
          name: 'Anatomy',
          lectureCount: 2,
          lectureNames: [
            'Bony Orbit',
            'Orbital Fascia'
          ],
          questions: []
        },
        {
          id: 'histology',
          name: 'Histology',
          lectureCount: 1,
          lectureNames: [
            'The Eye'
          ],
          questions: []
        }
      ]
    },
    {
      id: 2,
      title: 'Second Chapter',
      subjects: [
        {
          id: 'anatomy',
          name: 'Anatomy',
          lectureCount: 1,
          lectureNames: [
            'Anatomy of the ear'
          ],
          questions: []
        },
        {
          id: 'clinical',
          name: 'Clinical',
          lectureCount: 2,
          lectureNames: [
            'Hearing Loss',
            'Taste and Smell Disorders'
          ],
          questions: []
        },
        {
          id: 'physiology',
          name: 'Physiology',
          lectureCount: 1,
          lectureNames: [
            'Posture and equilibrium'
          ],
          questions: []
        }
      ]
    }
  ]
};

describe('Smart Lecture-Name-Based Routing', () => {
  it('should match exact lecture name in topic and return correct routing info', () => {
    const incomingQuestion = {
      topic: 'Bony Orbit',
      subject: 'Anatomy',
      text: 'What is the shape of the orbital cavity?'
    };
    const route = resolveSmartRouting(mockBank, incomingQuestion);
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(1);
    expect(route!.subjectId).toBe('anatomy');
    expect(route!.lecture).toBe(1); // First lecture in Anatomy
  });

  it('should match exact lecture name (second item) and return correct routing', () => {
    const incomingQuestion = {
      topic: 'Orbital Fascia',
      subject: 'Anatomy',
      text: 'What is the orbital fascia?'
    };
    const route = resolveSmartRouting(mockBank, incomingQuestion);
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(1);
    expect(route!.subjectId).toBe('anatomy');
    expect(route!.lecture).toBe(2); // Second lecture in Anatomy
  });

  it('should match case-insensitively and ignore trailing whitespace', () => {
    const incomingQuestion = {
      topic: '  bony orbit  ',
      subject: 'Anatomy',
      text: 'Test question'
    };
    const route = resolveSmartRouting(mockBank, incomingQuestion);
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(1);
    expect(route!.subjectId).toBe('anatomy');
    expect(route!.lecture).toBe(1);
  });

  it('should fall back to substring matching if exact match not found', () => {
    const incomingQuestion = {
      topic: 'Orbital', // substring of "Orbital Fascia"
      subject: 'Anatomy',
      text: 'Test question'
    };
    const route = resolveSmartRouting(mockBank, incomingQuestion);
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(1);
    expect(route!.subjectId).toBe('anatomy');
    expect(route!.lecture).toBe(2);
  });

  it('should NOT substring match generic subject names (guard logic)', () => {
    const incomingQuestion = {
      topic: 'Anatomy', // is a generic subject name, should not match "Anatomy of the ear"
      subject: 'Anatomy',
      text: 'Test question'
    };
    const route = resolveSmartRouting(mockBank, incomingQuestion);
    expect(route).toBeNull(); // Guard should prevent substring matching on "Anatomy"
  });

  it('should match exact lecture name even if it is a subject name (though rare)', () => {
    // If a lecture name is exactly "Anatomy", it should match exactly
    const bankWithGenericLecture: any = {
      ...mockBank,
      chapters: [
        {
          id: 1,
          title: 'First Chapter',
          subjects: [
            {
              id: 'anatomy',
              name: 'Anatomy',
              lectureCount: 1,
              lectureNames: ['Anatomy'],
              questions: []
            }
          ]
        }
      ]
    };
    const incomingQuestion = {
      topic: 'Anatomy',
      text: 'Test question'
    };
    const route = resolveSmartRouting(bankWithGenericLecture, incomingQuestion);
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(1);
    expect(route!.subjectId).toBe('anatomy');
    expect(route!.lecture).toBe(1);
  });

  it('should return null if no matching lecture name is found in target bank', () => {
    const incomingQuestion = {
      topic: 'Non-existent Lecture Topic',
      subject: 'Anatomy',
      text: 'Test question'
    };
    const route = resolveSmartRouting(mockBank, incomingQuestion);
    expect(route).toBeNull();
  });
});

describe('Content-Based Routing (question text fallback)', () => {
  it('should route a question about "bony orbit" from text alone (no metadata)', () => {
    const incomingQuestion = {
      text: 'The bony orbit is formed by how many bones? What is the shape of the orbital cavity?'
    };
    const route = resolveContentRouting(mockBank, incomingQuestion);
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(1);
    expect(route!.subjectId).toBe('anatomy');
    expect(route!.lecture).toBe(1); // "Bony Orbit" is lecture 1 in anatomy
  });

  it('should route a question mentioning "orbital fascia" from text alone', () => {
    const incomingQuestion = {
      text: 'Describe the layers of the orbital fascia and their clinical significance in orbital surgery.'
    };
    const route = resolveContentRouting(mockBank, incomingQuestion);
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(1);
    expect(route!.subjectId).toBe('anatomy');
    expect(route!.lecture).toBe(2); // "Orbital Fascia" is lecture 2
  });

  it('should route a question about "hearing loss" from text alone', () => {
    const incomingQuestion = {
      text: 'A 45-year-old patient presents with progressive hearing loss in both ears. What are the causes?'
    };
    const route = resolveContentRouting(mockBank, incomingQuestion);
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(2);
    expect(route!.subjectId).toBe('clinical');
    expect(route!.lecture).toBe(1); // "Hearing Loss" is lecture 1 in clinical
  });

  it('should route a question mentioning "posture and equilibrium" from text', () => {
    const incomingQuestion = {
      text: 'Explain how the vestibular system contributes to maintaining posture and equilibrium during movement.'
    };
    const route = resolveContentRouting(mockBank, incomingQuestion);
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(2);
    expect(route!.subjectId).toBe('physiology');
    expect(route!.lecture).toBe(1); // "Posture and equilibrium"
  });

  it('should return null for very short question text', () => {
    const incomingQuestion = {
      text: 'Short?'
    };
    const route = resolveContentRouting(mockBank, incomingQuestion);
    expect(route).toBeNull();
  });

  it('should return null when question text has no matching lecture keywords', () => {
    const incomingQuestion = {
      text: 'What is the mechanism of action of insulin in glucose metabolism and cellular uptake?'
    };
    const route = resolveContentRouting(mockBank, incomingQuestion);
    expect(route).toBeNull();
  });

  it('should NOT match on generic/stop words alone (e.g. "the", "and", "function")', () => {
    const incomingQuestion = {
      text: 'What is the function of the and in the introduction to the clinical anatomy?'
    };
    const route = resolveContentRouting(mockBank, incomingQuestion);
    expect(route).toBeNull();
  });

  it('should prefer higher-scoring matches when multiple lectures could match', () => {
    const incomingQuestion = {
      text: 'Discuss the taste and smell disorders including anosmia and ageusia in clinical practice.'
    };
    const route = resolveContentRouting(mockBank, incomingQuestion);
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(2);
    expect(route!.subjectId).toBe('clinical');
    expect(route!.lecture).toBe(2); // "Taste and Smell Disorders" - higher score than "Hearing Loss"
  });
});
