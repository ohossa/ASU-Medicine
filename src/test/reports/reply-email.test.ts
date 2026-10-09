import { it, expect, vi, afterEach } from "vitest";
import { sendReportReply } from "../../../server/report-email";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
it("sends plain text only to the frozen recipient with a stable idempotency key", async () => {
  vi.stubEnv("RESEND_API_KEY", "test_key");
  vi.stubEnv("REPORT_EMAIL_FROM", "ASUCodes <support@example.com>");
  const fetch = vi.fn(
    async (
      _url: string,
      _options: { body: string; headers: Record<string, string> },
    ) => ({ ok: true, json: async () => ({ id: "email1" }) }),
  );
  vi.stubGlobal("fetch", fetch);
  await sendReportReply({
    id: "reply_1",
    reportId: "r_1",
    to: "student@example.com",
    subject: "Review",
    body: "Your report review.",
    createdAt: "2026-10-10",
    createdBy: "owner",
    state: "pending",
  });
  const options = fetch.mock.calls[0][1];
  expect(JSON.parse(options.body)).toMatchObject({
    to: ["student@example.com"],
    reply_to: "omarhmaged@gmail.com",
    text: "Your report review.",
  });
  expect(options.headers["Idempotency-Key"]).toBe("report-reply/reply_1");
});
