import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import * as d1Client from "../../../server/d1-client";
import * as r2Client from "../../../server/r2-client";
import { createCloudflareBackup, getBackupStatus } from "../../../server/cloudflare-backup-service";
import adminBackupHandler from "../../../api/admin-backup";

vi.mock("@clerk/backend", () => ({
  createClerkClient: () => ({
    users: {
      getUser: async () => ({
        id: "user_owner",
        emailAddresses: [{ id: "e1", emailAddress: "omarhmaged@gmail.com", verification: { status: "verified" } }],
        primaryEmailAddressId: "e1",
      }),
    },
  }),
  verifyToken: async () => ({ sub: "user_owner" }),
}));

describe("Enterprise Data Preservation & Anti-Loss Invariants", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.CLERK_SECRET_KEY = "sk_test_mock_secret_key";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("1. Cloudflare Backup Service: Complete Snapshotting & Pagination", () => {
    it("chunks table queries and produces an intact snapshot with cryptographic checksum", async () => {
      vi.spyOn(d1Client, "isD1Configured").mockReturnValue(true);

      const mockEntries = Array.from({ length: 25 }, (_, i) => ({
        user_id: `user_${i}`,
        module_code: "MGL-3",
        question_id: `q_${i}`,
        correct: 1,
      }));

      vi.spyOn(d1Client, "d1Query").mockImplementation(async (sql: string) => {
        if (sql.includes("FROM learning_entries")) {
          return mockEntries;
        }
        if (sql.includes("FROM learning_profiles")) {
          return [{ user_id: "user_1", xp: 500, level: 2 }];
        }
        return [];
      });

      const putSpy = vi.spyOn(r2Client, "putR2Json").mockResolvedValue({ etag: '"etag-123"' });
      vi.spyOn(r2Client, "getR2Client").mockReturnValue({} as any);

      const result = await createCloudflareBackup({ storeInR2: true });

      expect(result.snapshot).toBeDefined();
      expect(result.snapshot.metadata.version).toBe(1);
      expect(result.snapshot.metadata.totalRecords).toBe(26); // 25 entries + 1 profile
      expect(result.snapshot.metadata.tableCounts.learning_entries).toBe(25);
      expect(result.snapshot.metadata.tableCounts.learning_profiles).toBe(1);
      expect(result.snapshot.metadata.sha256).toMatch(/^[a-f0-9]{64}$/); // Valid SHA256
      expect(result.r2Key).toContain("backups/snapshots/snapshot-");

      // Verified: persisted to both timestamped archive and latest pointer
      expect(putSpy).toHaveBeenCalledTimes(2);
    });

    it("fetches backup vault status accurately", async () => {
      vi.spyOn(d1Client, "isD1Configured").mockReturnValue(true);
      vi.spyOn(d1Client, "d1Query").mockImplementation(async (sql: string) => {
        if (sql.includes("count(*) as count FROM learning_entries")) return [{ count: 59173 }];
        if (sql.includes("count(*) as count FROM learning_profiles")) return [{ count: 422 }];
        return [{ count: 0 }];
      });

      vi.spyOn(r2Client, "getR2Json").mockResolvedValue({
        data: {
          metadata: {
            timestamp: "2026-11-20T10:00:00.000Z",
            totalRecords: 59595,
            sha256: "test_hash",
          },
        },
        notModified: false,
      });

      vi.spyOn(r2Client, "getR2Client").mockReturnValue({
        send: async () => ({
          Contents: [{ Key: "backups/snapshots/snapshot-2026-11-20.json", Size: 38000000, LastModified: new Date() }],
        }),
      } as any);

      const status = await getBackupStatus();
      expect(status.isConfigured).toBe(true);
      expect(status.totalLiveRecords).toBe(59595);
      expect(status.tableCounts.learning_entries).toBe(59173);
      expect(status.tableCounts.learning_profiles).toBe(422);
      expect(status.lastBackup?.totalRecords).toBe(59595);
      expect(status.availableSnapshots).toHaveLength(1);
    });
  });

  describe("2. Admin Backup API Handler Security & Operations", () => {
    it("blocks unauthorized requests with 401", async () => {
      let statusCode = 0;
      let jsonBody: any = null;

      const req: any = { headers: {}, query: {} };
      const res: any = {
        setHeader: vi.fn(),
        status: (code: number) => {
          statusCode = code;
          return { json: (b: any) => { jsonBody = b; } };
        },
      };

      await adminBackupHandler(req, res);
      expect(statusCode).toBe(401);
      expect(jsonBody?.error).toContain("Unauthorized");
    });

    it("allows verified owner to query status", async () => {
      vi.spyOn(d1Client, "isD1Configured").mockReturnValue(true);
      vi.spyOn(d1Client, "d1Query").mockResolvedValue([{ count: 10 }]);

      let statusCode = 0;
      let jsonBody: any = null;

      const req: any = {
        headers: { authorization: "Bearer valid_owner_token" },
        query: { action: "status" },
      };
      const res: any = {
        setHeader: vi.fn(),
        status: (code: number) => {
          statusCode = code;
          return {
            json: (b: any) => { jsonBody = b; },
            send: (c: any) => { jsonBody = c; },
          };
        },
      };

      await adminBackupHandler(req, res);
      expect(statusCode).toBe(200);
      expect(jsonBody?.ok).toBe(true);
      expect(jsonBody?.status).toBeDefined();
    });

    it("allows verified owner to trigger on-demand snapshot creation", async () => {
      vi.spyOn(d1Client, "isD1Configured").mockReturnValue(true);
      vi.spyOn(d1Client, "d1Query").mockResolvedValue([]);
      vi.spyOn(r2Client, "putR2Json").mockResolvedValue({ etag: '"etag-1"' });
      vi.spyOn(r2Client, "getR2Client").mockReturnValue({} as any);

      let statusCode = 0;
      let jsonBody: any = null;

      const req: any = {
        method: "POST",
        headers: { authorization: "Bearer valid_owner_token" },
        query: { action: "create" },
      };
      const res: any = {
        setHeader: vi.fn(),
        status: (code: number) => {
          statusCode = code;
          return {
            json: (b: any) => { jsonBody = b; },
            send: (c: any) => { jsonBody = c; },
          };
        },
      };

      await adminBackupHandler(req, res);
      expect(statusCode).toBe(200);
      expect(jsonBody?.ok).toBe(true);
      expect(jsonBody?.metadata).toBeDefined();
    });

    it("streams a downloadable JSON snapshot file for action=download", async () => {
      vi.spyOn(r2Client, "getR2Json").mockResolvedValue({
        data: {
          metadata: { timestamp: "2026-11-20T10:00:00.000Z", totalRecords: 100 },
          tables: {},
        },
        notModified: false,
      });

      const headersSet: Record<string, string> = {};
      let sentContent: any = null;

      const req: any = {
        headers: { authorization: "Bearer valid_owner_token" },
        query: { action: "download" },
      };
      const res: any = {
        setHeader: (k: string, v: string) => { headersSet[k] = v; },
        status: () => ({
          json: (b: any) => { sentContent = b; },
          send: (c: any) => { sentContent = c; },
        }),
        send: (content: any) => { sentContent = content; },
      };

      await adminBackupHandler(req, res);
      expect(headersSet["Content-Disposition"]).toContain("attachment; filename=\"asu-portal-backup-");
      expect(sentContent).toBeDefined();
      const parsed = JSON.parse(sentContent);
      expect(parsed.metadata.totalRecords).toBe(100);
    });
  });

  describe("3. Codebase Architectural Invariants", () => {
    it("guarantees no LIMIT 5000 bottleneck exists for global learning_entries calculations", () => {
      const filePath = path.resolve(process.cwd(), "server/admin-analytics-service.ts");
      const content = fs.readFileSync(filePath, "utf8");

      // Verify the old LIMIT 5000 query that caused the data truncation is strictly gone
      expect(content).not.toContain("LIMIT 5000");

      // Verify that SQL aggregations are used instead
      expect(content).toContain("SELECT count(*) as total_attempts");
      expect(content).toContain("GROUP BY user_id");
      expect(content).toContain("GROUP BY module_code");
    });
  });
});
