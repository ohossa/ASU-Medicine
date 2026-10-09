import { it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import LearningHub from "../../pages/LearningHub";
vi.mock('@clerk/clerk-react',()=>({useUser:()=>({user:{id:'test-user'}})}));
const mocks = vi.hoisted(() => ({ settings: vi.fn(), year: 3 }));
vi.mock("../../app/preferences/useAcademicYear", () => ({
  useAcademicYear: () => ({ year: mocks.year, loading: false, error: null }),
}));
vi.mock("../../app/components/PortalShell", () => ({
  PortalShell: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("../../app/data", () => ({
  correctionRevision:0,
  isModuleDataLoaded:()=>true,
  SYLLABUS_MODULES: {
    3: {
      1: [
        { code: "MGL-3", name: "GIT", cp: 13 },
        { code: "MUG-3", name: "Urogenital" },
      ],
    },
    2: { 1: [{ code: "MEM-2", name: "Endocrine" }] },
  },
  getChaptersForModuleAndMode: () => [],
  ensureModuleDataLoaded: async()=>{},
  getModuleQuestionCounts:()=>({totalCount:0}),
}));
vi.mock("../../app/learning/LearningProvider", () => ({
  useLearning: () => ({
    data: {
      profile: {
        xp: 50,
        level: 1,
        streak: 1,
        bestStreak: 1,
        alias: "Omar",
        optIn: false,
        banner: "default",
        title: "student",
      },
      entries: [],
      leaderboard: [],
    },
    loading: false,
    pending: 0,
    error: "",
    settings: mocks.settings,
    period: "weekly",
    setPeriod: vi.fn(),
    retry: vi.fn(),
  }),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
it("shows only the selected year and labels unavailable content honestly", () => {
  render(
    <MemoryRouter>
      <LearningHub />
    </MemoryRouter>,
  );
  expect(screen.getByText("GIT")).toBeInTheDocument();
  expect(screen.getByText("Urogenital")).toBeInTheDocument();
  expect(screen.queryByText("Endocrine")).not.toBeInTheDocument();
  expect(screen.getAllByText("Coming soon")).toHaveLength(2);
});
it("keeps high-level cosmetics locked and makes public rankings opt-in", async () => {
  render(
    <MemoryRouter>
      <LearningHub />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Rewards" }));
  expect(screen.getByRole("button", { name: /Sunset/ })).toBeDisabled();
  expect(screen.getByRole("checkbox")).not.toBeChecked();
  await act(async()=>fireEvent.click(screen.getByRole("checkbox")));
  expect(mocks.settings).toHaveBeenCalledWith({ optIn: true });
});
it('unifies overview, progress, activity and rewards with labelled semester scope',()=>{
 render(<MemoryRouter><LearningHub /></MemoryRouter>);
 for(const name of ['Overview','Progress','Activity','Rewards']) expect(screen.getByRole('button',{name})).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Activity'}));
 expect(screen.getByRole('heading',{name:'Study activity'})).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Progress'}));
 expect(screen.getByRole('button',{name:'Semester 1'})).toHaveAttribute('aria-pressed','true');
});
