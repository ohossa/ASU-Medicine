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
});
