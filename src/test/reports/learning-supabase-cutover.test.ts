import { describe, it, expect, vi, beforeEach } from "vitest";
import { award } from "../../../server/learning-store";
import { cairoDay } from "../../../server/learning-policy";
import * as d1Client from "../../../server/d1-client";

describe("Cloudflare D1 Learning Store & Cutover Resilience", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calculates XP, updates profile, and awards points directly via Cloudflare D1", async () => {
    const today = cairoDay();
    const d = new Date(today + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() - 1);
    const yesterday = d.toISOString().slice(0, 10);

    const mockProfile = {
      user_id: "user_test_123",
      year: 3,
      xp: 2450, // Almost level 5 -> 6 (at 2500)
      competitive_xp: 2450,
      level: 5,
      streak: 4,
      best_streak: 4,
      last_day: yesterday,
      alias: "Test Student",
      opt_in: 1,
      banner: "default",
      title: "student",
      weekly_xp: 500,
      current_week: "2026-10-26",
    };

    let savedProfile: any = null;
    const savedEntries: any[] = [];

    vi.spyOn(d1Client, "isD1Configured").mockReturnValue(true);

    vi.spyOn(d1Client, "d1QueryFirst").mockImplementation(async (sql: string) => {
      if (sql.includes("FROM learning_profiles")) {
        return mockProfile;
      }
      return null;
    });

    vi.spyOn(d1Client, "d1Query").mockImplementation(async (sql: string) => {
      if (sql.includes("FROM learning_entries")) {
        return []; // None previously solved
      }
      return [];
    });

    vi.spyOn(d1Client, "d1Execute").mockImplementation(async (sql: string, params?: any[]) => {
      if (sql.includes("UPDATE learning_profiles SET")) {
        savedProfile = {
          year: params?.[0],
          xp: params?.[1],
          competitive_xp: params?.[2],
          level: params?.[3],
          streak: params?.[4],
          best_streak: params?.[5],
          last_day: params?.[6],
        };
      }
      return { success: true, changes: 1 };
    });

    vi.spyOn(d1Client, "d1Batch").mockImplementation(async (statements: any[]) => {
      savedEntries.push(...statements);
      return [];
    });

    const rewards = [
      {
        questionId: "q1",
        moduleCode: "MGL-3",
        chapterId: 1,
        subject: "Anatomy",
        topic: "Liver",
        type: "mcq",
        correct: true,
        personal: 30,
        competitive: 30,
        contentVersion: "v1",
      },
      {
        questionId: "q2",
        moduleCode: "MGL-3",
        chapterId: 1,
        subject: "Anatomy",
        topic: "Liver",
        type: "mcq",
        correct: true,
        personal: 30,
        competitive: 30,
        contentVersion: "v1",
      },
    ];

    const result = await award("user_test_123", 3, rewards);

    // Verified: Earned 60 XP
    expect(result).toEqual({ personal: 60, competitive: 60 });

    // Verified: Saved to D1 learning_entries via d1Batch
    expect(savedEntries).toHaveLength(2);

    // Verified: Leveled up from Level 5 to Level 6! (2450 + 60 = 2510 XP >= 2500)
    expect(savedProfile).not.toBeNull();
    expect(savedProfile.xp).toBe(2510);
    expect(savedProfile.level).toBe(6);
    expect(savedProfile.streak).toBe(5); // Increased streak from yesterday
    expect(savedProfile.best_streak).toBe(5);
  });

  it("does not re-award XP for questions already solved correctly", async () => {
    const mockProfile = {
      user_id: "user_test_456",
      year: 3,
      xp: 1000,
      competitive_xp: 1000,
      level: 3,
      streak: 1,
      best_streak: 1,
      last_day: "2026-10-29",
      alias: "Test Student",
      opt_in: 1,
      banner: "default",
      title: "student",
      weekly_xp: 200,
      current_week: "2026-10-26",
    };

    vi.spyOn(d1Client, "isD1Configured").mockReturnValue(true);

    vi.spyOn(d1Client, "d1QueryFirst").mockImplementation(async (sql: string) => {
      if (sql.includes("FROM learning_profiles")) {
        return mockProfile;
      }
      return null;
    });

    vi.spyOn(d1Client, "d1Query").mockImplementation(async (sql: string) => {
      if (sql.includes("FROM learning_entries")) {
        return [{ question_id: "already_done", ever_correct: 1 }];
      }
      return [];
    });

    vi.spyOn(d1Client, "d1Execute").mockImplementation(async () => {
      return { success: true, changes: 1 };
    });

    vi.spyOn(d1Client, "d1Batch").mockImplementation(async () => {
      return [];
    });

    const rewards = [
      {
        questionId: "already_done",
        moduleCode: "MGL-3",
        chapterId: 1,
        subject: "Anatomy",
        topic: "Liver",
        type: "mcq",
        correct: true,
        personal: 20,
        competitive: 20,
        contentVersion: "v1",
      },
    ];

    const result = await award("user_test_456", 3, rewards);

    // Deduped: Zero additional XP because already completed
    expect(result).toEqual({ personal: 0, competitive: 0 });
  });
});
