import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  verifyToken: vi.fn(async () => ({ sub: "student_year3" })),
  r2Client: { send: vi.fn() },
  getR2Json: vi.fn(),
  putR2Json: vi.fn(),
}));

vi.mock("@clerk/backend", () => ({
  verifyToken: mocks.verifyToken,
}));

vi.mock("../../../server/r2-client.js", () => ({
  getR2Client: () => mocks.r2Client,
  getR2Json: mocks.getR2Json,
  putR2Json: mocks.putR2Json,
  getR2BucketName: () => "a-plus-storage",
}));

describe("Sync Academic Year Preservation & Recovery (Cloudflare R2)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("never flips Year 3 student to Year 1 when sync payload does not contain yearKey", async () => {
    const existingData = {
      theme: "dark",
      asu_portal_year: 3,
      "asu_preferences:student_year3:academic-year": { year: 3, version: 1, timestamp: 1000 },
    };

    mocks.getR2Json.mockResolvedValue({
      data: existingData,
      etag: '"r2-etag-1"',
      notModified: false,
    });

    let savedData: any = null;
    mocks.putR2Json.mockImplementation(async (_key: string, data: any) => {
      savedData = data;
      return { etag: '"r2-etag-2"' };
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
    expect(savedData).not.toBeNull();
    // CRITICAL: academic year in R2 progress MUST remain 3, NEVER 1!
    expect(savedData.asu_portal_year).toBe(3);
    expect(savedData["asu_preferences:student_year3:academic-year"]).toMatchObject({ year: 3 });
  });

  it("heals academic_year in GET /api/sync if data contains asu_portal_year: 3", async () => {
    mocks.getR2Json.mockResolvedValue({
      data: {
        theme: "dark",
        asu_portal_year: 3, // Real year present without explicit preference key
      },
      etag: '"r2-etag-3"',
      notModified: false,
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
