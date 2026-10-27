import { it, expect, describe } from "vitest";
import {
  verifyOwner,
  getAdminAnalytics,
  OWNER_EMAIL,
} from "../../../server/admin-analytics-service";
import handler from "../../../api/admin-analytics";

function mockResponse() {
  const res: any = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: null as any,
    setHeader(key: string, value: string) {
      this.headers[key] = value;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: any) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

describe("Admin Analytics Security & Restriction (omarhmaged@gmail.com)", () => {
  it("rejects missing authorization token with 401", async () => {
    await expect(verifyOwner("")).rejects.toThrow("Sign in to access admin analytics.");
  });

  it("strictly enforces owner email restriction to omarhmaged@gmail.com", async () => {
    expect(OWNER_EMAIL).toBe("omarhmaged@gmail.com");
    await expect(verifyOwner("invalid_student_token")).rejects.toThrow(
      "Access restricted to portal owner omarhmaged@gmail.com."
    );
  });

  it("authorizes valid owner token for omarhmaged@gmail.com", async () => {
    const owner = await verifyOwner("test_owner_token");
    expect(owner.email).toBe("omarhmaged@gmail.com");
  });

  it("fetches comprehensive admin analytics with all required subsystems", async () => {
    const data = await getAdminAnalytics("test_owner_token");

    // Summary validation
    expect(data.summary).toBeDefined();
    expect(data.summary.totalStudents).toBeGreaterThan(0);
    expect(data.summary.totalQuestionsSolved).toBeGreaterThan(0);
    expect(data.summary.overallAccuracy).toBeGreaterThan(0);
    expect(data.summary.moduleCount).toBeGreaterThan(0);

    // Students validation
    expect(Array.isArray(data.students)).toBe(true);
    expect(data.students.length).toBeGreaterThan(0);
    const firstStudent = data.students[0];
    expect(firstStudent.name).toBeDefined();
    expect(firstStudent.email).toBeDefined();
    expect(firstStudent.xp).toBeGreaterThan(0);
    expect(firstStudent.moduleBreakdown).toBeDefined();

    // Modules validation
    expect(Array.isArray(data.modules)).toBe(true);
    expect(data.modules.length).toBeGreaterThanOrEqual(20);
    const gitModule = data.modules.find((m) => m.code === "MGL-3");
    expect(gitModule).toBeDefined();
    expect(gitModule?.name).toContain("GIT");

    // Hardest questions validation
    expect(Array.isArray(data.hardestQuestions)).toBe(true);
    expect(data.hardestQuestions.length).toBeGreaterThan(0);
    expect(data.hardestQuestions[0].failureRate).toBeGreaterThan(0);
  });

  it("API handler blocks unauthorized non-owner requests with 401/403", async () => {
    const res = mockResponse();
    await handler(
      {
        method: "GET",
        headers: { authorization: "Bearer student_token" },
      },
      res
    );

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toContain("Access restricted to portal owner omarhmaged@gmail.com.");
  });

  it("API handler succeeds for verified owner token and sets security headers", async () => {
    const res = mockResponse();
    await handler(
      {
        method: "GET",
        headers: { authorization: "Bearer test_owner_token" },
      },
      res
    );

    expect(res.statusCode).toBe(200);
    expect(res.headers["Cache-Control"]).toBe("private, no-store");
    expect(res.headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(res.body.summary).toBeDefined();
    expect(res.body.students).toBeDefined();
  });

  it("API handler rejects non-GET methods with 405 Method Not Allowed", async () => {
    const res = mockResponse();
    await handler(
      {
        method: "POST",
        headers: { authorization: "Bearer test_owner_token" },
      },
      res
    );

    expect(res.statusCode).toBe(405);
    expect(res.headers["Allow"]).toBe("GET");
  });
});
