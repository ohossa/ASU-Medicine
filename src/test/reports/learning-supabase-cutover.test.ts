import { describe, it, expect, vi, beforeEach } from "vitest";
import { award } from "../../../server/learning-store";
import { cairoDay } from "../../../server/learning-policy";
import * as supabaseClient from "../../../server/supabase-client";

describe("Supabase-First Learning & Cutover Resilience", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calculates XP, updates profile, and awards points directly via Supabase", async () => {
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
      opt_in: true,
      banner: "default",
      title: "student",
      weekly_xp: 500,
      current_week: "2026-10-26",
    };

    let savedProfile: any = null;
    const savedEntries: any[] = [];

    const mockSupabase: any = {
      from: vi.fn((table: string) => {
        if (table === "learning_profiles") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({ data: mockProfile, error: null })),
              })),
            })),
            upsert: vi.fn(async (row: any) => {
              savedProfile = row;
              return { data: row, error: null };
            }),
          };
        }
        if (table === "learning_entries") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                in: vi.fn(async () => ({ data: [], error: null })), // None previously solved
              })),
            })),
            upsert: vi.fn(async (entry: any) => {
              savedEntries.push(entry);
              return { data: entry, error: null };
            }),
          };
        }
        return {
          select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle: vi.fn(async () => ({ data: null })) })) })),
        };
      }),
    };

    vi.spyOn(supabaseClient, "getSupabase").mockReturnValue(mockSupabase);

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

    // Verified: Saved to Supabase learning_entries
    expect(savedEntries).toHaveLength(2);
    expect(savedEntries[0].question_id).toBe("q1");
    expect(savedEntries[0].correct).toBe(true);
    expect(savedEntries[0].ever_correct).toBe(true);

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
      opt_in: true,
      banner: "default",
      title: "student",
      weekly_xp: 200,
      current_week: "2026-10-26",
    };

    const mockSupabase: any = {
      from: vi.fn((table: string) => {
        if (table === "learning_profiles") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({ data: mockProfile, error: null })),
              })),
            })),
            upsert: vi.fn(async () => ({ error: null })),
          };
        }
        if (table === "learning_entries") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                in: vi.fn(async () => ({
                  data: [{ question_id: "already_done", ever_correct: true }],
                  error: null,
                })),
              })),
            })),
            upsert: vi.fn(async () => ({ error: null })),
          };
        }
        return {};
      }),
    };

    vi.spyOn(supabaseClient, "getSupabase").mockReturnValue(mockSupabase);

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
