import { describe, it, expect, vi } from "vitest";
import {
  createReplyService,
  type ReplyStore,
} from "../../../server/report-replies";
import type { ReportReply } from "../../app/reports/reply-contracts";
const id = "r_" + "a".repeat(40),
  requestId = "11111111-1111-4111-8111-111111111111";
const input = {
  id,
  requestId,
  subject: "Your question report",
  body: "Thanks for reporting this. The correct answer remains A because of the anatomy described.",
};
function setup() {
  const rows = new Map<string, ReportReply>();
  let locked = false;
  let draft: any = null;
  const store: ReplyStore = {
    draft: async () => draft,
    saveDraft: async (d) => {
      if ((draft?.revision || 0) !== d.revision)
        throw Object.assign(new Error("conflict"), { status: 409 });
      draft = { ...d, revision: d.revision + 1 };
      return draft;
    },
    list: async () => [...rows.values()],
    reserve: async (r) => {
      const existing =
        rows.get(r.id) ||
        [...rows.values()].find(
          (old) =>
            old.reportId === r.reportId &&
            old.subject === r.subject &&
            old.body === r.body,
        );
      if (existing) return { reply: existing, created: false };
      rows.set(r.id, r);
      return { reply: r, created: true };
    },
    claim: async () => {
      if (locked) return false;
      locked = true;
      return true;
    },
    finish: async (r) => {
      rows.set(r.id, r);
      locked = false;
    },
  };
  const authenticate = vi.fn(async () => ({ id: "owner", isAdmin: true }));
  const getReport = vi.fn(async () => ({ id, reporterId: "student" }));
  const recipient = vi.fn(async () => "student@example.com");
  const send = vi.fn(async (_reply: ReportReply) => ({
    providerId: "email_1",
  }));
  const service = createReplyService({
    authenticate,
    getReport,
    recipient,
    store,
    send,
    configured: () => true,
  });
  return { service, rows, authenticate, getReport, recipient, send };
}
describe("Owner report replies", () => {
  it("stores a cloud draft and rejects stale concurrent edits", async () => {
    const s = setup();
    const draft = {
      id,
      revision: 0,
      subject: "Review",
      body: "A work in progress",
    };
    await expect(s.service.saveDraft("token", draft)).resolves.toMatchObject({
      revision: 1,
    });
    await expect(s.service.saveDraft("token", draft)).rejects.toMatchObject({
      status: 409,
    });
    expect(s.send).not.toHaveBeenCalled();
  });
  it("saves the exact reply and resolves recipient on the server", async () => {
    const s = setup();
    const r = await s.service.send("token", input);
    expect(r.state).toBe("accepted");
    expect(r.to).toBe("student@example.com");
    expect(r.body).toBe(input.body);
    expect(s.recipient).toHaveBeenCalledWith("student");
    expect(s.send).toHaveBeenCalledTimes(1);
  });
  it("rejects nonowners before reading private data", async () => {
    const s = setup();
    s.authenticate.mockResolvedValue({ id: "student", isAdmin: false });
    await expect(s.service.send("token", input)).rejects.toMatchObject({
      status: 403,
    });
    expect(s.getReport).not.toHaveBeenCalled();
  });
  it("rejects forged recipients and unfinished templates", async () => {
    const s = setup();
    await expect(
      s.service.send("token", { ...input, to: "other@example.com" }),
    ).rejects.toMatchObject({ status: 400 });
    await expect(
      s.service.send("token", {
        ...input,
        body: "Thank you. [Explain the reason here]",
      }),
    ).rejects.toMatchObject({ status: 400 });
    expect(s.send).not.toHaveBeenCalled();
  });
  it("does not send twice on repeated or concurrent requests", async () => {
    const s = setup();
    await Promise.all([
      s.service.send("token", input),
      s.service.send("token", input),
    ]);
    await s.service.send("token", input);
    expect(s.send).toHaveBeenCalledTimes(1);
  });
  it("deduplicates identical replies from two owner devices using different send references", async () => {
    const s = setup();
    await Promise.all([
      s.service.send("token", input),
      s.service.send("token", {
        ...input,
        requestId: "22222222-2222-4222-8222-222222222222",
      }),
    ]);
    expect(s.send).toHaveBeenCalledTimes(1);
    expect(s.rows.size).toBe(1);
  });
  it("rejects changed content under the same send reference", async () => {
    const s = setup();
    await s.service.send("token", input);
    await expect(
      s.service.send("token", {
        ...input,
        body: "This is a different response with new medical reasoning.",
      }),
    ).rejects.toMatchObject({ status: 409 });
    expect(s.send).toHaveBeenCalledTimes(1);
  });
  it("keeps ambiguous failures for a safe retry using the same key", async () => {
    const s = setup();
    s.send.mockRejectedValueOnce(new Error("timeout"));
    const r = await s.service.send("token", input);
    expect(r.state).toBe("uncertain");
    const retried = await s.service.send("token", input);
    expect(retried.state).toBe("accepted");
    expect(s.send.mock.calls[0][0].id).toBe(s.send.mock.calls[1][0].id);
  });
  it("blocks an expired ambiguous retry instead of risking duplicate delivery", async () => {
    const s = setup();
    s.send.mockRejectedValueOnce(new Error("timeout"));
    const r = await s.service.send("token", input);
    s.rows.set(r.id, { ...r, createdAt: "2020-01-01T00:00:00Z" });
    await expect(s.service.send("token", input)).rejects.toMatchObject({
      status: 409,
    });
    expect(s.send).toHaveBeenCalledTimes(1);
  });
  it("does not call the provider when configuration or verified email is missing", async () => {
    const s = setup();
    s.recipient.mockResolvedValue("");
    await expect(s.service.send("token", input)).rejects.toMatchObject({
      status: 422,
    });
    expect(s.send).not.toHaveBeenCalled();
  });
});
