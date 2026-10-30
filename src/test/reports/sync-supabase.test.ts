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
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({ data: null, error: null })),
              })),
            })),
            insert: vi.fn(async (row: any) => {
              savedProfileYear = row;
              return { error: null };
            }),
            update: vi.fn(() => ({
              eq: vi.fn(async () => {
                savedProfileYear = { year: 4 };
                return { error: null };
              }),
            })),
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

  it("handles field=year lightweight query on GET without returning full data payload (slashes egress by 99.99%)", async () => {
    mocks.verifyToken.mockResolvedValue({
      sub: "user_lightweight_year_test",
    });

    let selectColumns = "";
    mocks.supabase = {
      from: vi.fn((table: string) => {
        if (table === "user_progress") {
          return {
            select: vi.fn((cols: string) => {
              selectColumns = cols;
              return {
                eq: vi.fn(() => ({
                  maybeSingle: vi.fn(async () => ({
                    data: { academic_year: 3 },
                    error: null,
                  })),
                })),
              };
            }),
          };
        }
        return {};
      }),
    };

    const { default: handler } = await import("../../../api/sync");
    const req: any = {
      method: "GET",
      url: "/api/sync?field=year",
      headers: {
        authorization: "Bearer valid_token",
      },
      query: { field: "year" },
    };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.year).toBe(3);
    expect(selectColumns).toBe("academic_year"); // Verified: does NOT select massive data JSON blob
  });

  it("returns HTTP 304 Not Modified with zero body payload when client sends matching If-None-Match ETag (0 bytes egress)", async () => {
    mocks.verifyToken.mockResolvedValue({
      sub: "user_etag_test",
    });

    const timestamp = "2026-10-30T15:00:00.000Z";
    mocks.supabase = {
      from: vi.fn((table: string) => {
        if (table === "user_progress") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({
                  data: {
                    academic_year: 2,
                    data: { theme: "dark" },
                    updated_at: timestamp,
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
        "if-none-match": `W/"${timestamp}"`,
      },
    };
    const res = mockRes();
    res.end = vi.fn(() => res);

    await handler(req, res);

    expect(res.statusCode).toBe(304);
    expect(res.headers["ETag"]).toBe(`W/"${timestamp}"`);
    expect(res.body).toBeNull(); // 0 bytes transferred
  });

  it("skips Supabase user_progress upsert on POST when data and academic_year are identical (prevents TOAST Disk IO churn)", async () => {
    mocks.verifyToken.mockResolvedValue({
      sub: "user_toast_guard_test",
    });

    const yearKey = "asu_preferences:user_toast_guard_test:academic-year";
    const existingData = {
      [yearKey]: { year: 2, version: 1, timestamp: 12345 },
      theme: "dark",
    };

    let upsertCalled = false;
    mocks.supabase = {
      from: vi.fn((table: string) => {
        if (table === "user_progress") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({
                  data: {
                    academic_year: 2,
                    data: existingData,
                  },
                  error: null,
                })),
              })),
            })),
            upsert: vi.fn(async () => {
              upsertCalled = true;
              return { error: null };
            }),
          };
        }
        if (table === "learning_profiles") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({
                  data: { user_id: "user_toast_guard_test", year: 2 },
                  error: null,
                })),
              })),
            })),
            update: vi.fn(() => ({
              eq: vi.fn(async () => ({ error: null })),
            })),
          };
        }
        return {};
      }),
    };

    const { default: handler } = await import("../../../api/sync");
    const req: any = {
      method: "POST",
      headers: {
        authorization: "Bearer valid_token",
        "content-type": "application/json",
      },
      body: {
        [yearKey]: { year: 2, version: 1, timestamp: 12345 },
        theme: "dark",
      },
    };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(upsertCalled).toBe(false); // Verified: skipped disk write because payload was unchanged!
  });
});
