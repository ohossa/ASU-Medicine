import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(),
};

vi.mock("../../../server/supabase-client.js", () => ({
  getSupabase: () => mockSupabase,
}));

vi.mock("@clerk/backend", () => ({
  verifyToken: vi.fn(async () => ({ sub: "student_year3" })),
}));

vi.mock("../../../server/report-store.js", () => ({
  getRedisClient: vi.fn(() => ({
    scanKeys: vi.fn(async () => []),
    get: vi.fn(async () => null),
  })),
}));

describe("Sync Academic Year Preservation & Recovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("never flips Year 3 student to Year 1 when sync payload does not contain yearKey", async () => {
    const existingData = {
      theme: "dark",
      asu_portal_year: 3,
      "asu_preferences:student_year3:academic-year": { year: 3, version: 1, timestamp: 1000 },
    };

    let capturedUpsert: any = null;

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "user_progress") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn(async () => ({
            data: { academic_year: 3, data: existingData },
            error: null,
          })),
          upsert: vi.fn(async (row: any) => {
            capturedUpsert = row;
            return { error: null };
          }),
        };
      }
      if (table === "learning_profiles") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn(async () => ({
            data: { user_id: "student_year3", year: 3, xp: 2500, level: 6 },
            error: null,
          })),
          update: vi.fn().mockReturnThis(),
        };
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: vi.fn(async () => ({ data: null, error: null })) };
    });

    const handler = (await import("../../../api/sync.js")).default;

    const req: any = {
      method: "POST",
      headers: { authorization: "Bearer valid-token" },
      body: {
        theme: "light",
        "asu_quiz_session:student_year3:1:Anatomy": { answers: { 0: 1 }, timestamp: 2000 },
      },
    };

    let responseStatus = 0;
    let responseBody: any = null;
    const res: any = {
      setHeader: vi.fn(),
      status: vi.fn((code: number) => {
        responseStatus = code;
        return res;
      }),
      json: vi.fn((data: any) => {
        responseBody = data;
        return res;
      }),
    };

    await handler(req, res);

    expect(responseStatus).toBe(200);
    expect(responseBody).toEqual({ success: true });
    expect(capturedUpsert).not.toBeNull();
    // CRITICAL: academic_year MUST remain 3, NEVER 1!
    expect(capturedUpsert.academic_year).toBe(3);
  });

  it("heals academic_year in GET /api/sync if data contains asu_portal_year: 3", async () => {
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "user_progress") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn(async () => ({
            data: {
              academic_year: 1, // Corrupted default 1
              data: {
                theme: "dark",
                asu_portal_year: 3, // Real year
              },
            },
            error: null,
          })),
        };
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: vi.fn(async () => ({ data: null, error: null })) };
    });

    const handler = (await import("../../../api/sync.js")).default;

    const req: any = {
      method: "GET",
      headers: { authorization: "Bearer valid-token" },
    };

    let responseStatus = 0;
    let responseBody: any = null;
    const res: any = {
      setHeader: vi.fn(),
      status: vi.fn((code: number) => {
        responseStatus = code;
        return res;
      }),
      json: vi.fn((data: any) => {
        responseBody = data;
        return res;
      }),
    };

    await handler(req, res);

    expect(responseStatus).toBe(200);
    // GET must heal and return year: 3 in preference
    expect(responseBody.data["asu_preferences:student_year3:academic-year"]).toMatchObject({
      year: 3,
    });
  });
});
