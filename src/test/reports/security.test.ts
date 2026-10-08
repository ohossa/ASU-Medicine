import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { authenticateReportUser } from "../../../server/report-auth";
import { sendReportEmail } from "../../../server/report-email";
import type { QuestionReport } from "../../app/reports/contracts";
const clerk = vi.hoisted(() => ({ verifyToken: vi.fn(), getUser: vi.fn() }));
vi.mock("@clerk/backend", () => ({
  verifyToken: clerk.verifyToken,
  createClerkClient: () => ({ users: { getUser: clerk.getUser } }),
}));
beforeEach(() => {
  vi.stubEnv("CLERK_SECRET_KEY", "mock");
  vi.stubEnv("REPORT_ADMIN_USER_ID", "");
  clerk.verifyToken.mockResolvedValue({ sub: "u1" });
  clerk.getUser.mockResolvedValue({
    id: "u1",
    emailAddresses: [
      {
        emailAddress: "omarhmaged@gmail.com",
        verification: { status: "verified" },
      },
    ],
  });
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});
describe("Report authentication", () => {
  it("captures the authenticated primary email and name without using a secondary address", async () => {
    clerk.getUser.mockResolvedValue({
      id: "student1", firstName: "Sara", lastName: "Ali", username: "sara",
      primaryEmailAddressId: "primary",
      emailAddresses: [
        { id: "secondary", emailAddress: "secondary@example.com", verification: { status: "verified" } },
        { id: "primary", emailAddress: "sara@example.com", verification: { status: "verified" } },
      ],
    });
    const identity = await authenticateReportUser("token");
    expect(identity).toMatchObject({ id: "student1", isAdmin: false, reporter: {
      name: "Sara Ali", username: "sara", email: "sara@example.com", emailVerified: true,
    } });
  });
  it("handles missing profile details and preserves unverified email status", async () => {
    clerk.getUser.mockResolvedValue({ id: "student1", emailAddresses: [] });
    expect((await authenticateReportUser("token"))).toMatchObject({reporter: {
      name: null, username: null, email: null, emailVerified: false,
    }});
    clerk.getUser.mockResolvedValue({ id: "student1", username: "student", emailAddresses: [
      { emailAddress: "student@example.com", verification: { status: "unverified" } },
    ] });
    expect((await authenticateReportUser("token"))).toMatchObject({reporter: {
      name: null, username: "student", email: "student@example.com", emailVerified: false,
    }});
  });
  it("requires a verified owner email and honors a pinned user ID", async () => {
    expect((await authenticateReportUser("token")).isAdmin).toBe(true);
    vi.stubEnv("REPORT_ADMIN_USER_ID", "someone-else");
    expect((await authenticateReportUser("token")).isAdmin).toBe(false);
  });
  it("requires an explicit owner account pin in production",async()=>{
    vi.stubEnv('VERCEL_ENV','production');
    expect((await authenticateReportUser('token')).isAdmin).toBe(false);
    vi.stubEnv('REPORT_ADMIN_USER_ID','u1');
    expect((await authenticateReportUser('token')).isAdmin).toBe(true);
  });
  it("does not grant admin for unverified or student email", async () => {
    for (const emailAddresses of [
      [
        {
          emailAddress: "omarhmaged@gmail.com",
          verification: { status: "unverified" },
        },
      ],
      [
        {
          emailAddress: "student@example.com",
          verification: { status: "verified" },
        },
      ],
    ]) {
      clerk.getUser.mockResolvedValue({ id: "u1", emailAddresses });
      expect((await authenticateReportUser("token")).isAdmin).toBe(false);
    }
  });
  it("fails closed without backend configuration, tokens, or valid sessions", async () => {
    await expect(authenticateReportUser("")).rejects.toMatchObject({
      status: 401,
    });
    clerk.verifyToken.mockRejectedValue(new Error("secret"));
    await expect(authenticateReportUser("bad")).rejects.toMatchObject({
      status: 401,
    });
    vi.stubEnv("CLERK_SECRET_KEY", "");
    await expect(authenticateReportUser("token")).rejects.toMatchObject({
      status: 503,
    });
  });
  it("validates token authorized parties", async () => {
    await authenticateReportUser("token");
    expect(clerk.verifyToken).toHaveBeenCalledWith(
      "token",
      expect.objectContaining({
        authorizedParties: ["https://asu.codes", "https://www.asu.codes"],
      }),
    );
  });
});
const report = {
  id: "r_123",
  category: "wrong_answer",
  explanation: "<script>bad</script>",
  snapshot: {
    moduleCode: "MEM-2",
    chapterTitle: "Example",
    subjectName: "Anatomy",
    question: { id: "Q1", text: "Question?" },
  },
} as QuestionReport;
describe("Report email delivery", () => {
  it("records missing configuration without pretending to send", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect(await sendReportEmail(report)).toEqual({ state: "unconfigured" });
  });
  it("sends only to the owner, as plain text, with a private review link and idempotency key", async () => {
    vi.stubEnv("RESEND_API_KEY", "mock");
    vi.stubEnv("REPORT_EMAIL_FROM", "ASU <reports@example.com>");
    const fetch = vi.fn(async (_url: string, _options: RequestInit) => ({
      ok: true,
      json: async () => ({ id: "provider1" }),
    }));
    vi.stubGlobal("fetch", fetch);
    expect(await sendReportEmail(report)).toEqual({
      state: "sent",
      providerId: "provider1",
    });
    const options = fetch.mock.calls[0][1];
    const payload = JSON.parse(String(options.body));
    expect(payload.to).toEqual(["omarhmaged@gmail.com"]);
    expect(payload.html).toBeUndefined();
    expect(payload.text).toContain("/admin/reports?report=r_123");
    expect(options.headers).toMatchObject({
      "Idempotency-Key": "question-report/r_123",
    });
  });
  it("does not treat an unsuccessful provider response as delivered", async () => {
    vi.stubEnv("RESEND_API_KEY", "mock");
    vi.stubEnv("REPORT_EMAIL_FROM", "reports@example.com");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false })),
    );
    await expect(sendReportEmail(report)).rejects.toThrow(
      "Email provider rejected",
    );
  });
});
