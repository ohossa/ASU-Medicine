import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  verifyToken: vi.fn(),
  supabase: null as any,
}));

vi.mock("@clerk/backend", () => ({
  verifyToken: mocks.verifyToken,
}));

vi.mock("../../../server/supabase-client", () => ({
  getSupabase: () => mocks.supabase,
}));

describe("Supabase-First Sync API (/api/sync)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLERK_SECRET_KEY = "test_clerk_secret";
  });

  const mockRes = () => {
    const res: any = {
      statusCode: 200,
      headers: {},
      body: null,
      setHeader: vi.fn((k: string, v: string) => {
        res.headers[k] = v;
      }),
      status: vi.fn((code: number) => {
        res.statusCode = code;
        return res;
      }),
      json: vi.fn((data: any) => {
        res.body = data;
        return res;
      }),
    };
    return res;
  };

  it("loads academic year preference from Supabase user_progress on GET without Redis", async () => {
    mocks.verifyToken.mockResolvedValue({
      sub: "user_sync_test",
    });

    mocks.supabase = {
      from: vi.fn((table: string) => {
        if (table === "user_progress") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({
                  data: {
                    academic_year: 3,
                    data: {
                      "asu_preferences:user_sync_test:academic-year": {
                        year: 3,
                        version: 1,
                        timestamp: 1234567890,
                      },
                    },
                  },
                  error: null,
                })),
              })),
            })),
          };
        }
        return {};
      }),
    };

    const { default: handler } = await import("../../../api/sync");
    const req: any = {
      method: "GET",
      headers: {
        authorization: "Bearer valid_token",
      },
    };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.data["asu_preferences:user_sync_test:academic-year"]).toEqual({
      year: 3,
      version: 1,
      timestamp: 1234567890,
    });
  });

  it("returns empty data object (200 OK) for brand new users without crashing or touching Redis", async () => {
    mocks.verifyToken.mockResolvedValue({
      sub: "new_student_999",
    });

    mocks.supabase = {
      from: vi.fn((table: string) => {
        if (table === "user_progress") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({ data: null, error: null })),
              })),
            })),
          };
        }
        if (table === "learning_profiles") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({ data: null, error: null })),
              })),
            })),
          };
        }
        return {};
      }),
    };

    const { default: handler } = await import("../../../api/sync");
    const req: any = {
      method: "GET",
      headers: {
        authorization: "Bearer valid_token",
      },
    };
    const res = mockRes();

    await handler(req, res);

    // Verified: HTTP 200 with empty object, zero 500 error!
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ data: {} });
  });

  it("persists academic year preference to Supabase user_progress and learning_profiles on POST", async () => {
    mocks.verifyToken.mockResolvedValue({
      sub: "user_save_year_test",
    });

    let savedProgress: any = null;
    let savedProfileYear: any = null;

    mocks.supabase = {
      from: vi.fn((table: string) => {
        if (table === "user_progress") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({ data: null, error: null })),
              })),
            })),
            upsert: vi.fn(async (row: any) => {
              savedProgress = row;
              return { error: null };
            }),
          };
        }
        if (table === "learning_profiles") {
          return {
            upsert: vi.fn(async (row: any) => {
              savedProfileYear = row;
              return { error: null };
            }),
          };
        }
        return {};
      }),
    };

    const { default: handler } = await import("../../../api/sync");
    const yearKey = "asu_preferences:user_save_year_test:academic-year";
    const req: any = {
      method: "POST",
      headers: {
        authorization: "Bearer valid_token",
        "content-type": "application/json",
      },
      body: {
        [yearKey]: { year: 4, version: 1, timestamp: 999999 },
      },
    };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true });

    // Verified: Saved to user_progress with academic_year: 4
    expect(savedProgress).not.toBeNull();
    expect(savedProgress.user_id).toBe("user_save_year_test");
    expect(savedProgress.academic_year).toBe(4);
    expect(savedProgress.data[yearKey]).toEqual({ year: 4, version: 1, timestamp: 999999 });

    // Verified: Synchronized with learning_profiles
    expect(savedProfileYear).not.toBeNull();
    expect(savedProfileYear.user_id).toBe("user_save_year_test");
    expect(savedProfileYear.year).toBe(4);
  });
});
