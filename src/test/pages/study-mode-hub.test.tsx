import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import StudyMode from '../../pages/StudyMode';

// Mock PortalShell to render cleanly in tests
vi.mock('../../app/components/PortalShell', () => ({
  PortalShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock LearningProvider
vi.mock('../../app/learning/LearningProvider', () => ({
  useOptionalLearning: () => ({
    data: {
      profile: { xp: 120, level: 2 },
      entries: [
        {
          moduleCode: 'MGL-3',
          questionId: 'q-101',
          correct: true,
          everCorrect: true,
        },
      ],
    },
  }),
}));

// Mock data helpers
const mockCounts = {
  mcqCount: 250,
  essayCount: 0,
  totalCount: 250,
};

vi.mock('../../app/data', () => ({
  getModuleQuestionCounts: () => mockCounts,
  SYLLABUS_MODULES: {
    3: {
      1: [
        {
          code: 'MGL-3',
          name: 'Gastrointestinal & Liver Module',
          cp: 13,
          marks: 260,
          keywords: ['git', 'liver'],
        },
      ],
    },
  },
  ensureModuleDataLoaded: vi.fn(),
  getChaptersForModuleAndMode: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mockCounts.essayCount = 0; // reset default
});

describe('StudyMode Unified Command Hub (Apple Liquid Glass Bento Grid)', () => {
  it('renders official module name, year metadata, and mastery stats', () => {
    render(
      <MemoryRouter initialEntries={['/year-3/mgl-3']}>
        <Routes>
          <Route path="/year-3/:code" element={<StudyMode />} />
        </Routes>
      </MemoryRouter>
    );

    // Module badge & full title
    expect(screen.getByText('MGL-3')).toBeInTheDocument();
    expect(screen.getByText('Gastrointestinal & Liver Module')).toBeInTheDocument();
    expect(screen.getByText(/Year 3 • Semester 1 • 13 CP/)).toBeInTheDocument();

    // Mastery Progress in Hero Card
    expect(screen.getByText('Module Progress')).toBeInTheDocument();
    expect(screen.getByText(/1 of 250 MCQs solved/)).toBeInTheDocument();
  });

  it('triggers instant chapter practice from the 1-click Hero button', () => {
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

    // Hero button says "Resume Chapter Practice" because 1 question was solved in mock
    const resumeBtn = screen.getByRole('button', { name: /Resume Chapter Practice/i });
    expect(resumeBtn).toBeInTheDocument();

    fireEvent.click(resumeBtn);
    expect(handleStartStudyMode).toHaveBeenCalledWith('mcq', 'MGL-3');
  });

  it('renders core Bento tiles (Chapters, Mock Exam, Past Papers, Tracker)', () => {
    render(
      <MemoryRouter initialEntries={['/year-3/mgl-3']}>
        <Routes>
          <Route path="/year-3/:code" element={<StudyMode />} />
        </Routes>
      </MemoryRouter>
    );

    // Bento Tile 1: Curriculum Chapters
    expect(screen.getByText('Curriculum Chapters & Topics')).toBeInTheDocument();
    expect(screen.getAllByText(/250 MCQs/).length).toBeGreaterThanOrEqual(1);

    // Bento Tile 2: Timed Mock Exam Simulator
    expect(screen.getByText('Timed Mock Exam Simulator')).toBeInTheDocument();
    expect(screen.getByText(/Ain Shams Simulation/)).toBeInTheDocument();

    // Bento Tile 3: Official Past Papers
    expect(screen.getByText('Past Papers & Continuous Assessments')).toBeInTheDocument();

    // Bento Tile 4: Syllabus Tracker
    expect(screen.getByText('Syllabus & Lecture Tracker')).toBeInTheDocument();
  });

  it('adaptively hides essay tile when module has 0 essays', () => {
    mockCounts.essayCount = 0;

    render(
      <MemoryRouter initialEntries={['/year-3/mgl-3']}>
        <Routes>
          <Route path="/year-3/:code" element={<StudyMode />} />
        </Routes>
      </MemoryRouter>
    );

    // Case Essays tile must NOT be rendered when count is 0
    expect(screen.queryByText(/Case-Based Essays & Short Answer Questions/i)).not.toBeInTheDocument();
  });

  it('adaptively reveals essay tile when module has essays', () => {
    mockCounts.essayCount = 42;

    render(
      <MemoryRouter initialEntries={['/year-3/mgl-3']}>
        <Routes>
          <Route path="/year-3/:code" element={<StudyMode />} />
        </Routes>
      </MemoryRouter>
    );

    // Case Essays tile MUST be rendered when count is > 0
    expect(screen.getByText(/Case-Based Essays & Short Answer Questions/i)).toBeInTheDocument();
    expect(screen.getByText(/42 Written Essays/)).toBeInTheDocument();
  });

  it('opens Mock Exam Configuration modal when clicking the simulator tile', () => {
    render(
      <MemoryRouter initialEntries={['/year-3/mgl-3']}>
        <Routes>
          <Route path="/year-3/:code" element={<StudyMode />} />
        </Routes>
      </MemoryRouter>
    );

    // Simulator tile click
    const simTile = screen.getByText('Timed Mock Exam Simulator').closest('div');
    expect(simTile).not.toBeNull();
    fireEvent.click(simTile!);

    // Modal dialog pops up
    expect(screen.getByText('Timed Mock Exam Simulation')).toBeInTheDocument();
    expect(screen.getByText('Official Exam Mode')).toBeInTheDocument();
  });
});
