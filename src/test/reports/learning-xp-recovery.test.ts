import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  d1Query: vi.fn(),
  d1QueryFirst: vi.fn(),
  d1Execute: vi.fn(),
  d1Transaction: vi.fn(),
  isD1Configured: vi.fn(() => true),
}));

vi.mock("../../../server/d1-client.js", () => ({
  d1Query: mocks.d1Query,
  d1QueryFirst: mocks.d1QueryFirst,
  d1Execute: mocks.d1Execute,
  d1Transaction: mocks.d1Transaction,
  isD1Configured: mocks.isD1Configured,
}));

describe("Learning XP Recovery & Progress Resilience (Cloudflare D1)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isD1Configured.mockReturnValue(true);
  });

  it("self-heals XP and level when a student has answered questions in learning_entries", async () => {
    const existingEntries = Array.from({ length: 25 }, (_, i) => ({
      question_id: `q_${i + 1}`,
      ever_correct: 1,
      correct: 1,
    }));

    let updatedProfileData: any = null;

    mocks.d1QueryFirst.mockImplementation(async (sql: string, _params: any[]) => {
      if (sql.includes("FROM learning_profiles")) {
        return {
          user_id: "student_recovery_1",
          year: 3,
          xp_reconciled: updatedProfileData ? 1 : 0,
          xp: updatedProfileData?.xp ?? 0,
          competitive_xp: 0,
          level: 1,
          alias: "Ahmed",
          opt_in: 1,
        };
      }
      return null;
    });

    mocks.d1Query.mockImplementation(async (sql: string, _params: any[]) => {
      if (sql.includes("count(distinct question_id)")) {
        const unique = new Set(existingEntries.filter((e) => e.ever_correct || e.correct).map((e) => e.question_id)).size;
        return [{ unique_correct: unique }];
      }
      if (sql.includes("FROM learning_entries")) {
        return existingEntries;
      }
      return [];
    });

    mocks.d1Execute.mockImplementation(async (sql: string, params: any[]) => {
      if (sql.includes("INSERT INTO learning_profiles")) {
        updatedProfileData = {
          xp: params[2],
          competitive_xp: params[3],
          level: params[4],
          user_id: params[0],
        };
        return { success: true, changes: 1 };
      }
      return { success: true, changes: 0 };
    });

    const { getProfile } = await import("../../../server/learning-store.js");
    const profile = await getProfile("student_recovery_1", 3);

    // 25 unique questions * 10 XP each = 250 XP
    expect(profile.xp).toBe(250);
    expect(profile.level).toBe(1); // floor(250/500) + 1 = 1
    expect(updatedProfileData).not.toBeNull();
    expect(updatedProfileData.xp).toBe(250);
    await getProfile("student_recovery_1", 3);
    expect(mocks.d1Query).toHaveBeenCalledTimes(1);
  });

  it("preserves cross-module entries in dashboard so MGL-3 is never zeroed", async () => {
    const mixedEntries = [
      {
        id: "entry_1",
        user_id: "student_recovery_2",
        module_code: "MGL-3",
        chapter_id: 1,
        question_id: "q_mgl_1",
        subject: "Genetics",
        topic: "Mutation",
        type: "mcq",
        correct: 1,
        ever_correct: 1,
        first_correct: 1,
        attempts_count: 1,
        content_version: "v1",
        created_at: new Date().toISOString(),
      },
      {
        id: "entry_2",
        user_id: "student_recovery_2",
        module_code: "MSS-2",
        chapter_id: 1,
        question_id: "q_mss_1",
        subject: "Special Senses",
        topic: "Vision",
        type: "mcq",
        correct: 1,
        ever_correct: 1,
        first_correct: 1,
        attempts_count: 1,
        content_version: "v1",
        created_at: new Date().toISOString(),
      },
    ];

    mocks.d1QueryFirst.mockImplementation(async (sql: string) => {
      if (sql.includes("FROM learning_profiles")) {
        return {
          user_id: "student_recovery_2",
          year: 3,
          xp_reconciled: 1,
          xp: 20,
          competitive_xp: 20,
          level: 1,
          alias: "Salma",
          opt_in: 1,
        };
      }
      return null;
    });

    mocks.d1Query.mockImplementation(async (sql: string) => {
      if (sql.includes("FROM learning_entries")) {
        return mixedEntries;
      }
      if (sql.includes("ORDER BY competitive_xp DESC")) {
        return [];
      }
      return [];
    });

    const { dashboard } = await import("../../../server/learning-store.js");
    const result = await dashboard("student_recovery_2", 3);

    expect(result.entries.length).toBe(2);
    // Verifies MGL-3 entry is present and visible
    expect(result.entries.some((e) => e.moduleCode === "MGL-3")).toBe(true);
    // Verifies MSS-2 entry is also preserved
    expect(result.entries.some((e) => e.moduleCode === "MSS-2")).toBe(true);
  });

});
