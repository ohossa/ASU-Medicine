import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  verifyToken: vi.fn(),
  r2Client: null as any,
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

describe("Cloudflare R2 Zero-Egress Sync API (/api/sync)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLERK_SECRET_KEY = "test_clerk_secret";
    mocks.r2Client = { send: vi.fn() };
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
      end: vi.fn(() => res),
    };
    return res;
  };

  it("returns 304 Not Modified when client If-None-Match matches R2 ETag", async () => {
    mocks.verifyToken.mockResolvedValue({ sub: "user_r2_test" });
    mocks.getR2Json.mockResolvedValue({
      data: null,
      etag: '"r2-etag-123"',
      notModified: true,
    });

    const { default: handler } = await import("../../../api/sync");
    const req: any = {
      method: "GET",
      url: "/api/sync",
      headers: {
        authorization: "Bearer valid_token",
        "if-none-match": '"r2-etag-123"',
      },
    };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(304);
    expect(res.end).toHaveBeenCalled();
  });

  it("loads user progress successfully from R2 on GET", async () => {
    mocks.verifyToken.mockResolvedValue({ sub: "user_r2_test" });
    mocks.getR2Json.mockResolvedValue({
      data: {
        "asu_study_tracker:user_r2_test:card1": { solved: true },
        "asu_preferences:user_r2_test:academic-year": { year: 2, version: 1 },
      },
      etag: '"r2-etag-456"',
      notModified: false,
    });

    const { default: handler } = await import("../../../api/sync");
    const req: any = {
      method: "GET",
      url: "/api/sync",
      headers: {
        authorization: "Bearer valid_token",
      },
    };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.data["asu_study_tracker:user_r2_test:card1"]).toEqual({ solved: true });
    expect(res.headers["ETag"]).toBe('"r2-etag-456"');
  });

  it("handles ?field=year efficiently using R2 data", async () => {
    mocks.verifyToken.mockResolvedValue({ sub: "user_r2_test" });
    mocks.getR2Json.mockResolvedValue({
      data: {
        asu_portal_year: 3,
        "asu_preferences:user_r2_test:academic-year": { year: 3, version: 1 },
      },
      etag: '"r2-etag-789"',
      notModified: false,
    });

    const { default: handler } = await import("../../../api/sync");
    const req: any = {
      method: "GET",
      url: "/api/sync?field=year",
      headers: {
        authorization: "Bearer valid_token",
      },
    };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.year).toBe(3);
  });

  it("saves student progress to Cloudflare R2 on POST", async () => {
    mocks.verifyToken.mockResolvedValue({ sub: "user_r2_test" });
    mocks.getR2Json.mockResolvedValue({
      data: {
        "existing_key": { value: 1 },
      },
      notModified: false,
    });
    mocks.putR2Json.mockResolvedValue({ etag: '"r2-new-etag"' });

    const { default: handler } = await import("../../../api/sync");
    const req: any = {
      method: "POST",
      url: "/api/sync",
      headers: {
        authorization: "Bearer valid_token",
      },
      body: {
        "new_key": { value: 2 },
        "asu_preferences:user_r2_test:academic-year": { year: 2, version: 1, timestamp: 123456 },
      },
    };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mocks.putR2Json).toHaveBeenCalledWith(
      "users/user_r2_test/progress.json",
      expect.objectContaining({
        existing_key: { value: 1 },
        new_key: { value: 2 },
        asu_portal_year: 2,
      })
    );
  });

  it("succeeds on POST and persists directly to Cloudflare R2", async () => {
    mocks.verifyToken.mockResolvedValue({ sub: "user_r2_test" });
    mocks.getR2Json.mockResolvedValue({ data: {}, notModified: false });
    mocks.putR2Json.mockResolvedValue({ etag: '"r2-ok"' });

    const { default: handler } = await import("../../../api/sync");
    const req: any = {
      method: "POST",
      url: "/api/sync",
      headers: {
        authorization: "Bearer valid_token",
      },
      body: {
        "test_progress": { score: 100 },
      },
    };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mocks.putR2Json).toHaveBeenCalled();
  });
});
