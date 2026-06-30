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

// A mock bank that mirrors the NEW MSS-2 subject-centric structure (8 chapters, 1 subject each)
const mockMSS2Bank: any = {
  schemaVersion: 1,
  meta: { moduleCode: 'MSS-2', moduleName: 'Special Senses Module', year: 2, semester: 2 },
  chapters: [
    {
      id: 1, title: 'Anatomy',
      subjects: [{
        id: 'anatomy', name: 'Anatomy', lectureCount: 17,
        lectureNames: [
          'Bony Orbit', 'Orbital Fascia', 'Extra-ocular Muscles', 'Lacrimal Apparatus',
          'Nerves of the Orbit', 'Vessels of the Orbit', 'Anatomy of the Eyelids (palpebrae)',
          'Development of the eye', 'Visual Pathway', 'Visual Reflexes',
          'Anatomy of the ear', 'Auditory Pathway', 'Development of the Ear',
          'Anatomy of the Facial Nerve', 'Medial Longitudinal Fasciculus (Bundle)',
          'Vestibular Pathway', 'Olfactory & Taste Pathways'
        ],
        questions: []
      }]
    },
    {
      id: 2, title: 'Histology',
      subjects: [{
        id: 'histology', name: 'Histology', lectureCount: 3,
        lectureNames: ['The Eye', 'The Ear', 'Structure of the Ear'],
        questions: []
      }]
    },
    {
      id: 3, title: 'Biochemistry',
      subjects: [{
        id: 'biochem', name: 'Biochemistry', lectureCount: 2,
        lectureNames: ['Visual cycle and vitamin A', 'Deficiency of vitamin A'],
        questions: []
      }]
    },
    {
      id: 4, title: 'Physiology',
      subjects: [{
        id: 'physiology', name: 'Physiology', lectureCount: 12,
        lectureNames: [
          'Introduction to Vision Physiology and Vision Optics',
          'Light path through cornea, Aqueous humor and Lens',
          'Accommodation, Errors of refraction, and Iris',
          'Organization and Functions of Retinal Neurons',
          'Photoreceptors',
          'Dark and light adaptation, and visual cortex',
          'Color Vision, Binocular Vision, and Eye Movements',
          'Physiology & Physics of Sound & Function of External and Middle Ear',
          'Physiology Function of Inner Ear',
          'Discrimination of Sounds and Hearing Impairment and Hearing Tests',
          'Physiology of Smell and Taste (Chemical Senses)',
          'Posture and equilibrium'
        ],
        questions: []
      }]
    },
    {
      id: 5, title: 'Microbiology',
      subjects: [{
        id: 'microbiology', name: 'Microbiology', lectureCount: 2,
        lectureNames: ['Infections of The Eye', 'Infections of The Ear'],
        questions: []
      }]
    },
    {
      id: 6, title: 'Pathology',
      subjects: [{
        id: 'pathology', name: 'Pathology', lectureCount: 2,
        lectureNames: ['Diseases of The Eye', 'Diseases of The Ear'],
        questions: []
      }]
    },
    {
      id: 7, title: 'Pharmacology',
      subjects: [{
        id: 'pharma', name: 'Pharmacology', lectureCount: 1,
        lectureNames: ['Drug Therapy of Glaucoma'],
        questions: []
      }]
    },
    {
      id: 8, title: 'Clinical',
      subjects: [{
        id: 'clinical', name: 'Clinical', lectureCount: 3,
        lectureNames: ['Basic Neuro-ophthalmic Examination', 'Hearing Loss', 'Taste and Smell Disorders'],
        questions: []
      }]
    }
  ]
};

describe('MSS-2 Subject-Centric Smart Routing', () => {
  it('routes Anatomy: Bony Orbit → chapter 1, anatomy, lecture 1', () => {
    const route = resolveSmartRouting(mockMSS2Bank, { topic: 'Bony Orbit', subject: 'Anatomy', text: '' });
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(1);
    expect(route!.subjectId).toBe('anatomy');
    expect(route!.lecture).toBe(1);
  });

  it('routes Anatomy: Anatomy of the Facial Nerve → chapter 1, anatomy, lecture 14', () => {
    const route = resolveSmartRouting(mockMSS2Bank, { topic: 'Anatomy of the Facial Nerve', subject: 'Anatomy', text: '' });
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(1);
    expect(route!.subjectId).toBe('anatomy');
    expect(route!.lecture).toBe(14);
  });

  it('routes Anatomy: Olfactory & Taste Pathways → chapter 1, anatomy, lecture 17', () => {
    const route = resolveSmartRouting(mockMSS2Bank, { topic: 'Olfactory & Taste Pathways', subject: 'Anatomy', text: '' });
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(1);
    expect(route!.subjectId).toBe('anatomy');
    expect(route!.lecture).toBe(17);
  });

  it('routes Histology: The Eye → chapter 2, histology, lecture 1', () => {
    const route = resolveSmartRouting(mockMSS2Bank, { topic: 'The Eye', subject: 'Histology', text: '' });
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(2);
    expect(route!.subjectId).toBe('histology');
    expect(route!.lecture).toBe(1);
  });

  it('routes Physiology: Accommodation, Errors of refraction, and Iris → chapter 4, physiology, lecture 3', () => {
    const route = resolveSmartRouting(mockMSS2Bank, { topic: 'Accommodation, Errors of refraction, and Iris', subject: 'Physiology', text: '' });
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(4);
    expect(route!.subjectId).toBe('physiology');
    expect(route!.lecture).toBe(3);
  });

  it('routes Physiology: Posture and equilibrium → chapter 4, physiology, lecture 12', () => {
    const route = resolveSmartRouting(mockMSS2Bank, { topic: 'Posture and equilibrium', subject: 'Physiology', text: '' });
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(4);
    expect(route!.subjectId).toBe('physiology');
    expect(route!.lecture).toBe(12);
  });

  it('routes Microbiology: Infections of The Eye → chapter 5, microbiology, lecture 1', () => {
    const route = resolveSmartRouting(mockMSS2Bank, { topic: 'Infections of The Eye', subject: 'Microbiology', text: '' });
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(5);
    expect(route!.subjectId).toBe('microbiology');
    expect(route!.lecture).toBe(1);
  });

  it('routes Pathology: Diseases of The Ear → chapter 6, pathology, lecture 2', () => {
    const route = resolveSmartRouting(mockMSS2Bank, { topic: 'Diseases of The Ear', subject: 'Pathology', text: '' });
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(6);
    expect(route!.subjectId).toBe('pathology');
    expect(route!.lecture).toBe(2);
  });

  it('routes Pharmacology: Drug Therapy of Glaucoma → chapter 7, pharma, lecture 1', () => {
    const route = resolveSmartRouting(mockMSS2Bank, { topic: 'Drug Therapy of Glaucoma', subject: 'Pharmacology', text: '' });
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(7);
    expect(route!.subjectId).toBe('pharma');
    expect(route!.lecture).toBe(1);
  });

  it('routes Clinical (Ophthalmology): Basic Neuro-ophthalmic Examination → chapter 8, clinical, lecture 1', () => {
    const route = resolveSmartRouting(mockMSS2Bank, { topic: 'Basic Neuro-ophthalmic Examination', subject: 'Clinical', text: '' });
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(8);
    expect(route!.subjectId).toBe('clinical');
    expect(route!.lecture).toBe(1);
  });

  it('routes Clinical (ENT): Hearing Loss → chapter 8, clinical, lecture 2', () => {
    const route = resolveSmartRouting(mockMSS2Bank, { topic: 'Hearing Loss', subject: 'Clinical', text: '' });
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(8);
    expect(route!.subjectId).toBe('clinical');
    expect(route!.lecture).toBe(2);
  });

  it('routes Clinical (ENT): Taste and Smell Disorders → chapter 8, clinical, lecture 3', () => {
    const route = resolveSmartRouting(mockMSS2Bank, { topic: 'Taste and Smell Disorders', subject: 'Clinical', text: '' });
    expect(route).not.toBeNull();
    expect(route!.chapter.id).toBe(8);
    expect(route!.subjectId).toBe('clinical');
    expect(route!.lecture).toBe(3);
  });
});
