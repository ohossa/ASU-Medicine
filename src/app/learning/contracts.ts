export interface LearningProfile {
  xp: number;
  competitiveXp: number;
  level: number;
  streak: number;
  bestStreak: number;
  lastDay: string;
  year: number;
  alias: string;
  optIn: boolean;
  banner: string;
  title: string;
}
export interface LearningEntry {
  firstCorrect?: boolean;
  firstAt?: string;
  contentVersion?: string;
  moduleCode: string;
  chapterId: number;
  questionId: string;
  topic: string;
  subject: string;
  correct: boolean;
  everCorrect: boolean;
  at: string;
  type: string;
}
export interface LearningDashboard {
  profile: LearningProfile;
  entries: LearningEntry[];
  leaderboard: Array<{
    alias: string;
    xp: number;
    level: number;
    banner: string;
    isYou: boolean;
  }>;
  week: string;
}
export interface LearningSubmission {
  moduleCode: string;
  items: Array<{ questionId: string; answer: unknown }>;
}
export const REWARDS = [
  { id: "default", name: "Classic", level: 1 },
  { id: "aurora", name: "Aurora", level: 3 },
  { id: "ocean", name: "Ocean", level: 5 },
  { id: "sunset", name: "Sunset", level: 10 },
] as const;
export const TITLES = [
  { id: "student", name: "Medical Student", level: 1 },
  { id: "explorer", name: "Knowledge Explorer", level: 3 },
  { id: "scholar", name: "Clinical Scholar", level: 5 },
  { id: "mentor", name: "Study Mentor", level: 10 },
] as const;
