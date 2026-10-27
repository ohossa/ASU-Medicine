import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import StudyMode from '../../pages/StudyMode';

// Mock PortalShell to render cleanly in tests
vi.mock('../../app/components/PortalShell', () => ({
  PortalShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock data question counts
const mockCounts = {
  mcqCount: 250,
  essayCount: 30,
  totalCount: 280,
};

vi.mock('../../app/data', () => ({
  getModuleQuestionCounts: () => mockCounts,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mockCounts.mcqCount = 250;
  mockCounts.essayCount = 30;
  mockCounts.totalCount = 280;
});

describe('StudyMode Apple Design Curricular Selector', () => {
  it('renders module header and all 3 mode cards when module has essays', () => {
    render(
      <MemoryRouter initialEntries={['/year-3/mgl-3']}>
        <Routes>
          <Route path="/year-3/:code" element={<StudyMode />} />
        </Routes>
      </MemoryRouter>
    );

    // Module badge & header
    expect(screen.getByText('Module Loaded: MGL-3')).toBeInTheDocument();
    expect(screen.getByText('Select Study Mode')).toBeInTheDocument();
    expect(
      screen.getByText(/Choose the question formats you wish to practice/i)
    ).toBeInTheDocument();

    // 3 Mode Cards
    expect(screen.getByText('MCQ Practice Mode')).toBeInTheDocument();
    expect(screen.getByText('Essay Study Mode')).toBeInTheDocument();
    expect(screen.getByText('Mixed Exam Mode')).toBeInTheDocument();

    // Full-width Apple capsule buttons
    expect(screen.getByRole('button', { name: /Start MCQ Practice/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Essay Study/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Mixed Exam/i })).toBeInTheDocument();

    // Syllabus bar and Back button
    expect(screen.getByText('Syllabus & Study Tracker')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Modules/i })).toBeInTheDocument();
  });

  it('invokes onStartStudyMode with the correct mode type and module code when buttons are clicked', () => {
    const handleStartStudyMode = vi.fn();

    render(
      <MemoryRouter initialEntries={['/year-3/mgl-3']}>
        <Routes>
          <Route
            path="/year-3/:code"
            element={<StudyMode onStartStudyMode={handleStartStudyMode} />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Click MCQ
    fireEvent.click(screen.getByRole('button', { name: /Start MCQ Practice/i }));
    expect(handleStartStudyMode).toHaveBeenCalledWith('mcq', 'MGL-3');

    // Click Essay
    fireEvent.click(screen.getByRole('button', { name: /Start Essay Study/i }));
    expect(handleStartStudyMode).toHaveBeenCalledWith('essay', 'MGL-3');

    // Click Mixed
    fireEvent.click(screen.getByRole('button', { name: /Generate Mixed Exam/i }));
    expect(handleStartStudyMode).toHaveBeenCalledWith('mixed', 'MGL-3');
  });

  it('adaptively hides Essay and Mixed modes when module has 0 essays', () => {
    mockCounts.mcqCount = 180;
    mockCounts.essayCount = 0;
    mockCounts.totalCount = 180;

    render(
      <MemoryRouter initialEntries={['/year-1/bls-he-1']}>
        <Routes>
          <Route path="/year-1/:code" element={<StudyMode />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Module Loaded: BLS-HE-1')).toBeInTheDocument();

    // MCQ is rendered
    expect(screen.getByText('MCQ Practice Mode')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start MCQ Practice/i })).toBeInTheDocument();

    // Essay & Mixed modes must NOT be rendered
    expect(screen.queryByText('Essay Study Mode')).not.toBeInTheDocument();
    expect(screen.queryByText('Mixed Exam Mode')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Start Essay Study/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Generate Mixed Exam/i })).not.toBeInTheDocument();
  });

  it('opens syllabus tracker via onOpenSyllabus callback', () => {
    const handleOpenSyllabus = vi.fn();

    render(
      <MemoryRouter initialEntries={['/year-3/mgl-3']}>
        <Routes>
          <Route
            path="/year-3/:code"
            element={<StudyMode onOpenSyllabus={handleOpenSyllabus} />}
          />
        </Routes>
      </MemoryRouter>
    );

    const trackerBtn = screen.getByText('Syllabus & Study Tracker').closest('button');
    expect(trackerBtn).not.toBeNull();
    fireEvent.click(trackerBtn!);

    expect(handleOpenSyllabus).toHaveBeenCalledWith('MGL-3');
  });

  it('navigates back to parent year when Back to Modules is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/year-2/cvs-2']}>
        <Routes>
          <Route path="/year-2/:code" element={<StudyMode />} />
          <Route path="/year-2" element={<div>Year 2 Overview</div>} />
        </Routes>
      </MemoryRouter>
    );

    const backBtn = screen.getByRole('button', { name: /Back to Modules/i });
    fireEvent.click(backBtn);

    expect(screen.getByText('Year 2 Overview')).toBeInTheDocument();
  });
});
