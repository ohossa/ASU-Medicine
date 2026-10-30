import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSupabase = {
  from: vi.fn(),
};

vi.mock("../../../server/supabase-client.js", () => ({
  getSupabase: () => mockSupabase,
}));

vi.mock("../../../server/report-store.js", () => ({
  evalRedis: vi.fn(async () => null),
}));

describe("Learning XP Recovery & Progress Resilience", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("self-heals XP and level when a student has answered questions in learning_entries", async () => {
    const existingEntries = Array.from({ length: 25 }, (_, i) => ({
      question_id: `q_${i + 1}`,
      ever_correct: true,
      correct: true,
    }));

    let updatedProfileData: any = null;

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "learning_profiles") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn(async () => ({
            data: {
              user_id: "student_recovery_1",
              year: 3,
              xp: 0, // Corrupted / zeroed
              level: 1, // Corrupted / level 1
              alias: "Ahmed",
              opt_in: true,
            },
            error: null,
          })),
          update: vi.fn((data: any) => {
            updatedProfileData = data;
            return {
              eq: vi.fn(async () => ({ error: null })),
            };
          }),
        };
      }
      if (table === "learning_entries") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn(async () => ({
            data: existingEntries,
            error: null,
          })),
        };
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: vi.fn(async () => ({ data: null, error: null })) };
    });

    const { getProfile } = await import("../../../server/learning-store.js");
    const profile = await getProfile("student_recovery_1", 3);

    // 25 unique questions * 10 XP each = 250 XP
    expect(profile.xp).toBe(250);
    expect(profile.level).toBe(1); // floor(250/500) + 1 = 1
    expect(updatedProfileData).not.toBeNull();
    expect(updatedProfileData.xp).toBe(250);
  });

  it("preserves cross-module entries in dashboard so MGL-3 is never zeroed", async () => {
    const mixedEntries = [
      {
        id: "entry_1",
        user_id: "student_recovery_2",
        module_code: "MGL-3",
        chapter_id: 1,
        question_id: "q_mgl_1",
        correct: true,
        ever_correct: true,
        first_correct: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "entry_2",
        user_id: "student_recovery_2",
        module_code: "MSS-2",
        chapter_id: 1,
        question_id: "q_mss_1",
        correct: true,
        ever_correct: true,
        first_correct: true,
        created_at: new Date().toISOString(),
      },
    ];

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "learning_profiles") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn(async () => ({ data: [], error: null })),
          maybeSingle: vi.fn(async () => ({
            data: {
              user_id: "student_recovery_2",
              year: 3,
              xp: 20,
              level: 1,
              alias: "Salma",
              opt_in: true,
            },
            error: null,
          })),
        };
      }
      if (table === "learning_entries") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn(async () => ({
            data: mixedEntries,
            error: null,
          })),
        };
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: vi.fn(async () => ({ data: null, error: null })) };
    });

    const { dashboard } = await import("../../../server/learning-store.js");
    const result = await dashboard("student_recovery_2", 3);

    expect(result.entries.length).toBe(2);
    // Verifies MGL-3 entry is present and visible
    expect(result.entries.some((e) => e.moduleCode === "MGL-3")).toBe(true);
    // Verifies MSS-2 entry is also preserved
    expect(result.entries.some((e) => e.moduleCode === "MSS-2")).toBe(true);
  });

  it("ensures learning_profiles row is upserted before learning_entries in award()", async () => {
    const executionOrder: string[] = [];

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "learning_profiles") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn(async () => ({
            data: {
              user_id: "new_student",
              year: 3,
              xp: 0,
              level: 1,
              streak: 0,
              best_streak: 0,
            },
            error: null,
          })),
          upsert: vi.fn(async () => {
            executionOrder.push("learning_profiles_upsert");
            return { error: null };
          }),
        };
      }
      if (table === "learning_entries") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          upsert: vi.fn(async () => {
            executionOrder.push("learning_entries_upsert");
            return { error: null };
          }),
        };
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: vi.fn(async () => ({ data: null, error: null })) };
    });

    const { award } = await import("../../../server/learning-store.js");
    const res = await award("new_student", 3, [
      {
        moduleCode: "MGL-3",
        chapterId: 1,
        questionId: "q_brand_new_1",
        personal: 10,
        competitive: 10,
        correct: true,
      },
    ]);

    expect(res).toEqual({ personal: 10, competitive: 10 });
    // Foreign key guarantee: learning_profiles MUST be upserted BEFORE learning_entries!
    expect(executionOrder[0]).toBe("learning_profiles_upsert");
    expect(executionOrder[1]).toBe("learning_entries_upsert");
  });
});
