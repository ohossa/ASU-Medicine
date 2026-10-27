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
    expect(data.summary.onlineNow).toBeGreaterThanOrEqual(1);
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

  describe("Admin Master Leaderboard Multi-Metric Dynamic Ranking & Podium Logic", () => {
    it("correctly ranks students dynamically across all 5 metrics (xp, questions, accuracy, time, streak)", async () => {
      const data = await getAdminAnalytics("test_owner_token");
      const students = data.students;

      // 1. Rank by Total XP
      const byXP = [...students].sort((a, b) => b.xp - a.xp);
      expect(byXP[0].xp).toBeGreaterThanOrEqual(byXP[1].xp);
      expect(byXP[0].name).toBe("Salma Farouk"); // 8100 XP

      // 2. Rank by Questions Solved
      const byQuestions = [...students].sort((a, b) => b.questionsAttempted - a.questionsAttempted);
      expect(byQuestions[0].questionsAttempted).toBeGreaterThanOrEqual(byQuestions[1].questionsAttempted);
      expect(byQuestions[0].questionsAttempted).toBe(690);

      // 3. Rank by Accuracy %
      const byAccuracy = [...students].sort((a, b) => b.accuracy - a.accuracy);
      expect(byAccuracy[0].accuracy).toBeGreaterThanOrEqual(byAccuracy[1].accuracy);
      expect(byAccuracy[0].accuracy).toBe(95); // Ahmed Ezzat 95%

      // 4. Rank by Study Time
      const byTime = [...students].sort((a, b) => b.studyTimeMinutes - a.studyTimeMinutes);
      expect(byTime[0].studyTimeMinutes).toBeGreaterThanOrEqual(byTime[1].studyTimeMinutes);
      expect(byTime[0].studyTimeMinutes).toBe(1040);

      // 5. Rank by Study Streak
      const byStreak = [...students].sort((a, b) => b.streak - a.streak);
      expect(byStreak[0].streak).toBeGreaterThanOrEqual(byStreak[1].streak);
      expect(byStreak[0].streak).toBe(42); // Hana El-Sayed 42d
    });

    it("extracts distinct Top 3 podium performers based on active sort metric", async () => {
      const data = await getAdminAnalytics("test_owner_token");
      const byXP = [...data.students].sort((a, b) => b.xp - a.xp);

      const gold = byXP[0];
      const silver = byXP[1];
      const bronze = byXP[2];

      expect(gold).toBeDefined();
      expect(silver).toBeDefined();
      expect(bronze).toBeDefined();

      expect(gold.id).not.toBe(silver.id);
      expect(silver.id).not.toBe(bronze.id);
      expect(gold.xp).toBeGreaterThan(silver.xp);
      expect(silver.xp).toBeGreaterThan(bronze.xp);
    });

    it("filters students accurately by search query, cohort year, and online presence", async () => {
      const data = await getAdminAnalytics("test_owner_token");

      // Search by partial name
      const searchMatch = data.students.filter((s) =>
        s.name.toLowerCase().includes("salma") || s.email.toLowerCase().includes("salma")
      );
      expect(searchMatch.length).toBe(1);
      expect(searchMatch[0].name).toBe("Salma Farouk");

      // Filter by academic year
      const year1Students = data.students.filter((s) => s.year === 1);
      expect(year1Students.length).toBeGreaterThanOrEqual(1);
      expect(year1Students.every((s) => s.year === 1)).toBe(true);

      // Filter by online status
      const onlineStudents = data.students.filter((s) => s.isOnline);
      expect(onlineStudents.length).toBeGreaterThan(0);
      expect(onlineStudents.every((s) => s.isOnline)).toBe(true);
    });
  });
});
