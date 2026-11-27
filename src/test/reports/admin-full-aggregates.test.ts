import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as snapshots from "../../../server/admin-learning-snapshot";
import * as d1Client from "../../../server/d1-client";
import { getAdminAnalytics, clearClerkUsersCache } from "../../../server/admin-analytics-service";

vi.mock("@clerk/backend", () => ({
  createClerkClient: () => ({
    users: {
      getUserList: async () => ({
        data: [
          {
            id: "user_top_48",
            firstName: "Top",
            lastName: "Student",
            emailAddresses: [{ id: "e1", emailAddress: "top@student.com", verification: { status: "verified" } }],
            primaryEmailAddressId: "e1",
          },
        ],
        totalCount: 1,
      }),
      getUser: async () => ({
        id: "user_owner",
        emailAddresses: [{ emailAddress: "omarhmaged@gmail.com", verification: { status: "verified" } }],
      }),
    },
  }),
  verifyToken: async () => ({ sub: "user_owner" }),
}));

describe("Admin Analytics Full Aggregations (No 5000 Limit Truncation)", () => {
  beforeEach(() => {
    clearClerkUsersCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calculates total questions solved and study hours across all entries via SQL aggregations", async () => {
    vi.spyOn(d1Client, "isD1Configured").mockReturnValue(true);
    vi.spyOn(d1Client, "d1Query").mockImplementation(async (sql: string) => {
      if (sql.includes("FROM learning_profiles")) {
        return [
          {
            user_id: "user_top_48",
            alias: "TopStudent",
            year: 1,
            xp: 23950,
            level: 48,
            streak: 5,
            best_streak: 10,
          },
        ];
      }
      return [];
    });

    vi.spyOn(snapshots, "readAdminLearningSnapshot").mockResolvedValue({
      generatedAt: "2026-11-27T01:00:00Z",
      overallKpis: [{ total_attempts: 59172, total_correct: 48782 }],
      studentTotals: [{ user_id: "user_top_48", attempts: 2375, correct: 2224 }],
      studentBreakdowns: [{ user_id: "user_top_48", module_code: "MGL-3", attempts: 2375, correct: 2224 }],
      moduleAggs: [{ module_code: "MGL-3", attempts: 21241, correct: 18000, unique_students: 68 }],
      topFailures: [],
      recentEvents: [],
    });

    process.env.CLERK_SECRET_KEY = "sk_test_key";
    const result = await getAdminAnalytics("mock_owner_token");

    expect(result.learningSnapshotAt).toBe("2026-11-27T01:00:00Z");
    expect(vi.mocked(d1Client.d1Query).mock.calls.some(([sql]) => sql.includes("FROM learning_entries"))).toBe(false);

    // 1. Total questions solved must account for all 59,172 live attempts + baseline (62,133)
    expect(result.summary.totalQuestionsSolved).toBe(62133);

    // 2. Total study hours must reflect real practice time (at ~1.8 min/question = 1,775h + 110h baseline = 1,885h)
    expect(result.summary.totalStudyHours).toBe(1885);

    // 3. Accuracy must be ~82%
    expect(result.summary.overallAccuracy).toBe(82);

    // 4. Top student must have their true 2,375 attempts and Level 48
    const topStudent = result.students.find((s) => s.id === "user_top_48");
    expect(topStudent).toBeDefined();
    expect(topStudent?.level).toBe(48);
    expect(topStudent?.xp).toBe(23950);
    expect(topStudent?.questionsAttempted).toBe(2375);
    expect(topStudent?.questionsCorrect).toBe(2224);
    expect(topStudent?.accuracy).toBe(94);
  });
});
