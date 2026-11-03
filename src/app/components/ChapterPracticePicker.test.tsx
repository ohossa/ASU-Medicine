import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChapterPracticePicker } from './ChapterPracticePicker';
import type { ChapterData, Question } from '../types';

vi.mock('../preferences/ShuffleSwitch', () => ({
  ShuffleSwitch: () => <button role="switch" aria-checked="false">Shuffle questions</button>,
}));

const q = (id: string, text: string, lecture = 1): Question => ({
  id,
  lecture,
  type: 'mcq',
  text,
  explanation: '',
  subjectColor: 'anatomy',
  correctIndex: 0,
});

const sampleChapters: ChapterData[] = [
  {
    id: 1,
    title: 'Cervical Spine',
    subtitle: 'Neck vertebra',
    emoji: '🦴',
    page: 1,
    lectureRange: '1-2',
    accentColor: 'anatomy',
    subjects: [
      {
        id: 'anatomy',
        name: 'Anatomy',
        iconName: 'Bone',
        lectures: '2 Lectures',
        lectureCount: 2,
        lectureNames: ['Atlas & Axis', 'Vertebral Artery'],
        questions: [
          q('q1', 'What passes through foramen transversarium?', 1),
          q('q2', 'Dens articulates with which arch?', 2),
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Thorax Wall',
    subtitle: 'Ribs and intercostal spaces',
    emoji: '🫁',
    page: 2,
    lectureRange: '1',
    accentColor: 'physiology',
    subjects: [
      {
        id: 'physiology',
        name: 'Physiology',
        iconName: 'Activity',
        lectures: '1 Lecture',
        lectureCount: 1,
        lectureNames: ['Intercostal Muscles'],
        questions: [q('q3', 'External intercostal action during inspiration', 1)],
      },
    ],
  },
];

describe('ChapterPracticePicker', () => {
  const onStartMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // HTMLDialogElement mock for jsdom
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    });
  });

  it('renders the compact action banner with title and action button', () => {
    render(
      <ChapterPracticePicker
        chapters={sampleChapters}
        moduleName="Locomotor Module"
        moduleCode="MLS-1"
        onStart={onStartMock}
      />
    );

    expect(screen.getByText('Build your practice')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /choose chapters/i })).toBeInTheDocument();
  });

  it('opens the dialog when "Choose chapters" is clicked and lists all chapters', () => {
    render(
      <ChapterPracticePicker
        chapters={sampleChapters}
        moduleName="Locomotor Module"
        moduleCode="MLS-1"
        onStart={onStartMock}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /choose chapters/i }));

    expect(screen.getByText('Choose your practice')).toBeInTheDocument();
    expect(screen.getByText('Cervical Spine')).toBeInTheDocument();
    expect(screen.getByText('Thorax Wall')).toBeInTheDocument();
  });

  it('selects all questions when "Select all" is clicked, and starts practice with combined payload', () => {
    render(
      <ChapterPracticePicker
        chapters={sampleChapters}
        moduleName="Locomotor Module"
        moduleCode="MLS-1"
        onStart={onStartMock}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /choose chapters/i }));

    const selectAllBtn = screen.getByRole('button', { name: /select all/i });
    fireEvent.click(selectAllBtn);

    const startBtn = screen.getByRole('button', { name: /start practice/i });
    expect(startBtn).not.toBeDisabled();

    fireEvent.click(startBtn);

    expect(onStartMock).toHaveBeenCalledTimes(1);
    const [virtualChapter, subject, questions] = onStartMock.mock.calls[0];

    expect(virtualChapter.id).toBe(0);
    expect(virtualChapter.title).toBe('Multi-Chapter Custom Practice');
    expect(questions).toHaveLength(3);
    expect(subject.lectureCount).toBe(3);
  });

  it('allows expanding chapter to view topics and toggle topic checkboxes individually', () => {
    render(
      <ChapterPracticePicker
        chapters={sampleChapters}
        moduleName="Locomotor Module"
        moduleCode="MLS-1"
        onStart={onStartMock}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /choose chapters/i }));

    // Expand the first chapter
    const expandBtn = screen.getByRole('button', { name: /show topics of cervical spine/i });
    fireEvent.click(expandBtn);

    // Topic titles should now be visible
    expect(screen.getByText('Atlas & Axis')).toBeInTheDocument();
    expect(screen.getByText('Vertebral Artery')).toBeInTheDocument();

    // Check only the first topic
    const atlasCheckbox = screen.getByRole('checkbox', { name: 'Atlas & Axis' });
    fireEvent.click(atlasCheckbox);

    const startBtn = screen.getByRole('button', { name: /start practice/i });
    expect(startBtn).not.toBeDisabled();

    fireEvent.click(startBtn);

    expect(onStartMock).toHaveBeenCalledTimes(1);
    const [, , questions] = onStartMock.mock.calls[0];
    expect(questions).toHaveLength(1);
    expect(questions[0].id).toBe('q1');
  });

  it('filters chapters and topics using search input', () => {
    render(
      <ChapterPracticePicker
        chapters={sampleChapters}
        moduleName="Locomotor Module"
        moduleCode="MLS-1"
        onStart={onStartMock}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /choose chapters/i }));

    const searchInput = screen.getByLabelText(/find a chapter or topic/i);
    fireEvent.change(searchInput, { target: { value: 'intercostal' } });

    // Thorax Wall should match, Cervical Spine should not match
    expect(screen.getByText('Thorax Wall')).toBeInTheDocument();
    expect(screen.queryByText('Cervical Spine')).not.toBeInTheDocument();
  });

  describe('MRS-2 Continuous II Exam Assessment', () => {
    const sampleMrsChapters: ChapterData[] = [
      {
        id: 1,
        title: 'Structure of the Respiratory System',
        subtitle: 'Anatomy and Histology',
        emoji: '🫁',
        page: 1,
        lectureRange: '1-7',
        accentColor: 'anatomy',
        subjects: [
          {
            id: 'anatomy',
            name: 'Anatomy',
            iconName: 'Bone',
            lectures: '4 Lectures',
            lectureCount: 4,
            lectureNames: ['Nose & Sinuses', 'Larynx & Trachea', 'Lungs & Pleura', 'Thoracic Wall'],
            questions: [
              q('mrs-anat-1', 'Nose blood supply', 1),
              q('mrs-anat-2', 'Larynx nerve supply', 2),
              q('mrs-anat-3', 'Bronchopulmonary segments', 3), // EXCLUDED from Continuous II
              q('mrs-anat-4', 'Intercostal space contents', 4),
            ],
          },
          {
            id: 'histology',
            name: 'Histology',
            iconName: 'Microscope',
            lectures: '3 Lectures',
            lectureCount: 3,
            lectureNames: ['Upper Resp Tract', 'Lower Resp Tract', 'Alveolar Wall'],
            questions: [
              q('mrs-hist-1', 'Respiratory epithelium cell types', 1),
              q('mrs-hist-2', 'Clara / Club cells feature', 2),
              q('mrs-hist-3', 'Blood air barrier layers', 3), // EXCLUDED from Continuous II
            ],
          },
        ],
      },
      {
        id: 2,
        title: 'Function and Metabolism',
        subtitle: 'Physiology and Biochemistry',
        emoji: '⚡',
        page: 2,
        lectureRange: '1-6',
        accentColor: 'physiology',
        subjects: [
          {
            id: 'physiology',
            name: 'Physiology',
            iconName: 'Activity',
            lectures: '3 Lectures',
            lectureCount: 3,
            lectureNames: ['Mechanics & Surfactant', 'Lung Volumes', 'Gas Exchange'],
            questions: [
              q('mrs-phys-1', 'Surfactant composition and function', 1),
              q('mrs-phys-2', 'Functional residual capacity definition', 2),
              q('mrs-phys-3', 'Oxygen hemoglobin dissociation curve', 3), // EXCLUDED
            ],
          },
          {
            id: 'biochem',
            name: 'Biochemistry',
            iconName: 'Dna',
            lectures: '3 Lectures',
            lectureCount: 3,
            lectureNames: ['Oxidative Phosphorylation', 'Krebs Cycle', 'Surfactant Lipids'],
            questions: [
              q('mrs-biochem-1', 'Complex I inhibitor rotenone', 1),
              q('mrs-biochem-2', 'Pyruvate dehydrogenase regulation', 2),
              q('mrs-biochem-3', 'Dipalmitoylphosphatidylcholine structure', 3), // EXCLUDED
            ],
          },
        ],
      },
      {
        id: 3,
        title: 'Diseases and Therapeutics',
        subtitle: 'Pathology, Pharmacology, Microbiology & Parasitology',
        emoji: '🧪',
        page: 3,
        lectureRange: '1-10',
        accentColor: 'pathology',
        subjects: [
          {
            id: 'pathology',
            name: 'Pathology',
            iconName: 'Stethoscope',
            lectures: '3 Lectures',
            lectureCount: 3,
            lectureNames: ['Obstructive Diseases', 'Pneumonia', 'Pleural Diseases'],
            questions: [
              q('mrs-path-1', 'Emphysema centriacinar vs panacinar', 1),
              q('mrs-path-2', 'Lobar pneumonia stages', 2), // EXCLUDED
              q('mrs-path-3', 'Mesothelioma etiology and asbestos', 3),
            ],
          },
          {
            id: 'pharma',
            name: 'Pharmacology',
            iconName: 'Pill',
            lectures: '2 Lectures',
            lectureCount: 2,
            lectureNames: ['Asthma Therapy', 'Antitussives'],
            questions: [
              q('mrs-pharma-1', 'Salbutamol mechanism of action', 1),
              q('mrs-pharma-2', 'Dextromethorphan receptor target', 2), // EXCLUDED
            ],
          },
          {
            id: 'microbiology',
            name: 'Microbiology',
            iconName: 'Bug',
            lectures: '2 Lectures',
            lectureCount: 2,
            lectureNames: ['Upper Resp Bacterial', 'Lower Resp Viral'],
            questions: [
              q('mrs-micro-1', 'Streptococcus pneumoniae optochin sensitivity', 1),
              q('mrs-micro-2', 'Influenza hemagglutinin mutation', 2), // EXCLUDED
            ],
          },
          {
            id: 'parasitology',
            name: 'Parasitology',
            iconName: 'Skull',
            lectures: '1 Lecture',
            lectureCount: 1,
            lectureNames: ['Hydatid Disease'],
            questions: [
              q('mrs-para-1', 'Echinococcus granulosus cyst histology', 1), // EXCLUDED
            ],
          },
        ],
      },
    ];

    it('renders the dedicated Continuous II action button in the banner when moduleCode is MRS-2', () => {
      render(
        <ChapterPracticePicker
          chapters={sampleMrsChapters}
          moduleName="Respiratory System"
          moduleCode="MRS-2"
          onStart={onStartMock}
        />
      );

      expect(screen.getByRole('button', { name: /continuous ii exam \(ca-2\)/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /choose chapters/i })).toBeInTheDocument();
    });

    it('does NOT render the Continuous II button for other modules (e.g. MLS-1)', () => {
      render(
        <ChapterPracticePicker
          chapters={sampleChapters}
          moduleName="Locomotor Module"
          moduleCode="MLS-1"
          onStart={onStartMock}
        />
      );

      expect(screen.queryByRole('button', { name: /continuous ii exam \(ca-2\)/i })).not.toBeInTheDocument();
    });

    it('opens directly to the Continuous II tab and displays blueprint details when clicking Continuous II banner button', () => {
      render(
        <ChapterPracticePicker
          chapters={sampleMrsChapters}
          moduleName="Respiratory System"
          moduleCode="MRS-2"
          onStart={onStartMock}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /continuous ii exam \(ca-2\)/i }));

      // Tab should be active
      const ca2Tab = screen.getByRole('tab', { name: /continuous ii blueprint \(ca-2\)/i });
      expect(ca2Tab).toHaveAttribute('data-active', 'true');

      // Blueprint details card should be present
      expect(screen.getByText(/continuous ii assessment \(ca-2\)/i)).toBeInTheDocument();
      expect(screen.getByText(/30 lectures/i)).toBeInTheDocument();
      expect(screen.getByText(/38 marks/i)).toBeInTheDocument();
      expect(screen.getByText(/38 Marks · 49 min/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /start 38-mcq blueprint mock exam \(49 min\)/i })
      ).toBeInTheDocument();

      // Units pills should be visible
      expect(screen.getByText(/unit i — upper respiratory tract/i)).toBeInTheDocument();
      expect(screen.getByText(/unit ii — lower respiratory tract/i)).toBeInTheDocument();
      expect(screen.getByText(/unit iv — physiology of respiration/i)).toBeInTheDocument();
      expect(screen.getByText(/unit v — lung diseases-1/i)).toBeInTheDocument();
      expect(screen.getByText(/unit vi — glucose oxidation and shuttles/i)).toBeInTheDocument();
    });

    it('prunes excluded lectures (e.g. Parasitology, L3 Lungs & Pleura) in the Continuous II tab', () => {
      render(
        <ChapterPracticePicker
          chapters={sampleMrsChapters}
          moduleName="Respiratory System"
          moduleCode="MRS-2"
          onStart={onStartMock}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /continuous ii exam \(ca-2\)/i }));

      // Expand Chapter 1
      const expandBtnCh1 = screen.getByRole('button', {
        name: /show topics of structure of the respiratory system/i,
      });
      fireEvent.click(expandBtnCh1);

      // Whitelisted topics in Ch 1:
      expect(screen.getByText('Nose & Sinuses')).toBeInTheDocument();
      expect(screen.getByText('Larynx & Trachea')).toBeInTheDocument();
      expect(screen.getByText('Thoracic Wall')).toBeInTheDocument();
      expect(screen.getByText('Upper Resp Tract')).toBeInTheDocument();
      expect(screen.getByText('Lower Resp Tract')).toBeInTheDocument();

      // Excluded topics in Ch 1 should NOT be present:
      expect(screen.queryByText('Lungs & Pleura')).not.toBeInTheDocument();
      expect(screen.queryByText('Alveolar Wall')).not.toBeInTheDocument();

      // Expand Chapter 3
      const expandBtnCh3 = screen.getByRole('button', {
        name: /show topics of diseases and therapeutics/i,
      });
      fireEvent.click(expandBtnCh3);

      // Entire Parasitology was excluded (0 lectures)
      expect(screen.queryByText('Hydatid Disease')).not.toBeInTheDocument();
      // Excluded Pathology L2 and Pharma L2
      expect(screen.queryByText('Pneumonia')).not.toBeInTheDocument();
      expect(screen.queryByText('Antitussives')).not.toBeInTheDocument();
    });

    it('launches official 38-MCQ Blueprint Mock Exam when clicking "Start 38-MCQ Blueprint Mock Exam"', () => {
      render(
        <ChapterPracticePicker
          chapters={sampleMrsChapters}
          moduleName="Respiratory System"
          moduleCode="MRS-2"
          onStart={onStartMock}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /continuous ii exam \(ca-2\)/i }));

      const mockBtn = screen.getByRole('button', { name: /start 38-mcq blueprint mock exam \(49 min\)/i });
      fireEvent.click(mockBtn);

      expect(onStartMock).toHaveBeenCalledTimes(1);
      const [virtualChapter, subject, questions] = onStartMock.mock.calls[0];

      expect(virtualChapter.title).toContain('Official Continuous II Assessment');
      expect(virtualChapter.subtitle).toContain('38 MCQs · 49 Minutes');
      expect(subject.name).toContain('Continuous II Mock Exam');
      expect(subject.sessionKey).toMatch(/^mrs-ca2-mock:/);
      expect(questions.length).toBeGreaterThan(0);
    });

    it('allows toggling between All Module Content and Continuous II tabs smoothly', () => {
      render(
        <ChapterPracticePicker
          chapters={sampleMrsChapters}
          moduleName="Respiratory System"
          moduleCode="MRS-2"
          onStart={onStartMock}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /choose chapters/i }));

      // Starts on 'All Module Content'
      const allTab = screen.getByRole('tab', { name: /all module content/i });
      const ca2Tab = screen.getByRole('tab', { name: /continuous ii blueprint \(ca-2\)/i });
      expect(allTab).toHaveAttribute('data-active', 'true');
      expect(ca2Tab).toHaveAttribute('data-active', 'false');

      // Click CA-2 Tab
      fireEvent.click(ca2Tab);
      expect(ca2Tab).toHaveAttribute('data-active', 'true');
      expect(allTab).toHaveAttribute('data-active', 'false');
      expect(screen.getByText(/continuous ii assessment \(ca-2\)/i)).toBeInTheDocument();

      // Click back to All Tab
      fireEvent.click(allTab);
      expect(allTab).toHaveAttribute('data-active', 'true');
      expect(screen.queryByText(/continuous ii assessment \(ca-2\)/i)).not.toBeInTheDocument();
    });

    it('starts Continuous II custom practice with custom header and selected questions', () => {
      render(
        <ChapterPracticePicker
          chapters={sampleMrsChapters}
          moduleName="Respiratory System"
          moduleCode="MRS-2"
          onStart={onStartMock}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /continuous ii exam \(ca-2\)/i }));

      // Select all in CA-2 tab
      fireEvent.click(screen.getByRole('button', { name: /select all/i }));

      const startBtn = screen.getByRole('button', { name: /start practice/i });
      expect(startBtn).not.toBeDisabled();
      fireEvent.click(startBtn);

      expect(onStartMock).toHaveBeenCalledTimes(1);
      const [virtualChapter, , questions] = onStartMock.mock.calls[0] as [
        ChapterData,
        unknown,
        Question[]
      ];

      expect(virtualChapter.title).toBe('Continuous II Custom Practice (CA-2)');
      expect(virtualChapter.subtitle).toContain('Continuous II Assessment');
      // Only the 13 whitelisted questions should be included, not the 8 excluded questions!
      expect(questions).toHaveLength(13);
      const questionIds = questions.map(q => q.id);
      expect(questionIds).not.toContain('mrs-anat-3');
      expect(questionIds).not.toContain('mrs-hist-3');
      expect(questionIds).not.toContain('mrs-phys-3');
      expect(questionIds).not.toContain('mrs-biochem-3');
      expect(questionIds).not.toContain('mrs-path-2');
      expect(questionIds).not.toContain('mrs-pharma-2');
      expect(questionIds).not.toContain('mrs-micro-2');
      expect(questionIds).not.toContain('mrs-para-1');
    });
  });
});
