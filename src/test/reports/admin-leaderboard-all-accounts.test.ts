import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockClerkUsers: any[] = [
  {
    id: "user_top_01",
    firstName: "Salma",
    lastName: "Farouk",
    emailAddresses: [{ id: "e1", emailAddress: "salma.farouk@gmail.com", verification: { status: "verified" } }],
    primaryEmailAddressId: "e1",
    imageUrl: "https://img.clerk.com/salma.png",
    lastSignInAt: 1729000000000,
  },
  {
    id: "user_contender_02",
    firstName: "Ahmed",
    lastName: "Ezzat",
    emailAddresses: [{ id: "e2", emailAddress: "ahmed.ezzat@yahoo.com", verification: { status: "verified" } }],
    primaryEmailAddressId: "e2",
    imageUrl: "https://img.clerk.com/ahmed.png",
  },
  {
    id: "user_zero_xp_03",
    firstName: "Omar",
    lastName: "Khaled",
    emailAddresses: [{ id: "e3", emailAddress: "omar.khaled@outlook.com", verification: { status: "verified" } }],
    primaryEmailAddressId: "e3",
    imageUrl: "https://img.clerk.com/omar.png",
  },
];

vi.mock("@clerk/backend", () => ({
  createClerkClient: () => ({
    users: {
      getUserList: async () => ({ data: mockClerkUsers, totalCount: mockClerkUsers.length }),
      getUser: async () => ({
        id: "user_owner",
        emailAddresses: [{ emailAddress: "omarhmaged@gmail.com", verification: { status: "verified" } }],
      }),
    },
  }),
  verifyToken: async () => ({ sub: "user_owner" }),
}));

import {
  extractStudentName,
  extractStudentEmail,
  clearClerkUsersCache,
  getAdminAnalytics,
} from "../../../server/admin-analytics-service";
import * as supabaseClient from "../../../server/supabase-client";

describe("Admin Master Leaderboard: Real Names, Real Emails & All Accounts Roster", () => {
  beforeEach(() => {
    clearClerkUsersCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearClerkUsersCache();
  });

  describe("extractStudentName & extractStudentEmail", () => {
    it("extracts real full name from firstName and lastName", () => {
      const name = extractStudentName({ firstName: "Ahmed", lastName: "Maged" }, "student1", "user_123");
      expect(name).toBe("Ahmed Maged");
    });

    it("falls back to username if firstName/lastName are absent", () => {
      const name = extractStudentName({ firstName: null, lastName: null, username: "dr_omar" }, null, "user_123");
      expect(name).toBe("dr_omar");
    });

    it("intelligently formats name from email if no name or username provided", () => {
      const name = extractStudentName(
        { emailAddresses: [{ emailAddress: "salma.farouk@gmail.com" }] },
        null,
        "user_123"
      );
      expect(name).toBe("Salma Farouk");
    });

    it("uses alias as fallback when no name in Clerk", () => {
      const name = extractStudentName({}, "BioScholar99", "user_123");
      expect(name).toBe("BioScholar99");
    });

    it("extracts verified primary email address", () => {
      const email = extractStudentEmail({
        emailAddresses: [
          { id: "e1", emailAddress: "unverified@test.com" },
          { id: "e2", emailAddress: "primary@gmail.com", verification: { status: "verified" } },
        ],
        primaryEmailAddressId: "e2",
      });
      expect(email).toBe("primary@gmail.com");
    });

    it("never produces fake @student.asu.edu.eg email when email is absent", () => {
      const email = extractStudentEmail({});
      expect(email).toBe("");
    });
  });

  describe("Enrolled Clerk Accounts Integration", () => {
    it("fetches all Clerk accounts and merges them into the Admin Leaderboard", async () => {
      // Mock Supabase: user_top_01 and user_contender_02 have profiles; user_zero_xp_03 has NO profile
      const mockProfiles = [
        {
          user_id: "user_top_01",
          alias: "SalmaChamp",
          year: 3,
          xp: 8500,
          level: 18,
          streak: 20,
          best_streak: 20,
          last_day: "2026-10-30",
        },
        {
          user_id: "user_contender_02",
          alias: "AhmedE",
          year: 1,
          xp: 4200,
          level: 9,
          streak: 5,
          best_streak: 10,
          last_day: "2026-10-29",
        },
      ];

      vi.spyOn(supabaseClient, "getSupabase").mockReturnValue({
        from: vi.fn((table: string) => {
          if (table === "learning_profiles") {
            return {
              select: vi.fn(async () => ({ data: mockProfiles, error: null })),
            };
          }
          if (table === "user_progress") {
            return {
              select: vi.fn(async () => ({ data: [], error: null })),
            };
          }
          if (table === "learning_entries") {
            return {
              select: vi.fn(() => ({
                order: vi.fn(() => ({
                  limit: vi.fn(async () => ({ data: [], error: null })),
                })),
              })),
            };
          }
          if (table === "presence") {
            return {
              select: vi.fn(() => ({
                gt: vi.fn(async () => ({ data: [], count: 0 })),
              })),
            };
          }
          return { select: vi.fn(async () => ({ data: [], error: null })) };
        }),
      } as any);

      process.env.CLERK_SECRET_KEY = "sk_test_mock_key";

      const result = await getAdminAnalytics("test_owner_token");

      // Verified: ALL 3 accounts are present, including the 0 XP account who never solved questions!
      expect(result.students).toHaveLength(3);

      // 1. Check Salma (Top rank)
      const salma = result.students.find((s) => s.id === "user_top_01");
      expect(salma).toBeDefined();
      expect(salma?.name).toBe("Salma Farouk");
      expect(salma?.email).toBe("salma.farouk@gmail.com");
      expect(salma?.avatar).toBe("https://img.clerk.com/salma.png");
      expect(salma?.alias).toBe("SalmaChamp");
      expect(salma?.xp).toBe(8500);

      // 2. Check Ahmed (Second rank)
      const ahmed = result.students.find((s) => s.id === "user_contender_02");
      expect(ahmed).toBeDefined();
      expect(ahmed?.name).toBe("Ahmed Ezzat");
      expect(ahmed?.email).toBe("ahmed.ezzat@yahoo.com");
      expect(ahmed?.avatar).toBe("https://img.clerk.com/ahmed.png");
      expect(ahmed?.alias).toBe("AhmedE");

      // 3. Check Omar (0 XP account, signed up in Clerk but hasn't practiced yet)
      const omar = result.students.find((s) => s.id === "user_zero_xp_03");
      expect(omar).toBeDefined();
      expect(omar?.name).toBe("Omar Khaled");
      expect(omar?.email).toBe("omar.khaled@outlook.com");
      expect(omar?.avatar).toBe("https://img.clerk.com/omar.png");
      expect(omar?.xp).toBe(0);
      expect(omar?.level).toBe(1);
      expect(omar?.questionsAttempted).toBe(0);

      // Total accounts count in summary matches all 3
      expect(result.summary.totalStudents).toBe(3);
    });
  });
});
