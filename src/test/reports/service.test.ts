import { describe, it, expect, vi } from "vitest";
import { createReportService } from "../../../server/report-service";
const input = {
  requestId: "b06709ac-9efb-43d2-94c6-43e8b6b57d31",
  moduleCode: "MEM-2",
  chapterId: 1,
  questionId: "Q1",
  category: "wrong_answer",
  explanation: "The key and explanation disagree.",
};
function setup(admin = false) {
  let saved: any;
  const deps = {
    authenticate: vi.fn(async () => ({ id: "student1", isAdmin: admin })),
    resolveQuestion: vi.fn(async () => ({
      moduleCode: "MEM-2",
      chapterId: 1,
      chapterTitle: "Chapter",
      subjectName: "Anatomy",
      version: "hash",
      question: {
        id: "Q1",
        type: "mcq",
        text: "Question?",
        options: ["A", "B"],
        correctIndex: 0,
      },
    })),
    store: {
      create: vi.fn(async (report: any) => {
        if (saved) return { report: saved, created: false };
        saved = report;
        return { report, created: true };
      }),
      get: vi.fn(async () => saved),
      list: vi.fn(async () => ({
        reports: saved ? [saved] : [],
        total: saved ? 1 : 0,
        counts: { new: saved ? 1 : 0, reviewing: 0, fixed: 0, dismissed: 0 },
      })),
      update: vi.fn(async (_id: string, _revision: number, patch: any) => {
        saved = { ...saved, ...patch, revision: saved.revision + 1 };
        return saved;
      }),
      notification: vi.fn(async (_id: string, state: any) => {
        saved.notification = state;
      }),
    },
    sendEmail: vi.fn(async () => ({
      state: "sent" as const,
      providerId: "email1",
    })),
  };
  return { service: createReportService(deps), deps, saved: () => saved };
}
describe("Question report service", () => {
  it("stores a canonical snapshot and emails once across a retried submission", async () => {
    const { service, deps, saved } = setup();
    await service.submit("token", input);
    await service.submit("token", input);
    expect(deps.sendEmail).toHaveBeenCalledTimes(1);
    expect(saved().snapshot.version).toBe("hash");
    expect(saved().reporterId).toBe("student1");
    expect(saved().status).toBe("new");
  });
  it("keeps a saved report when email fails and exposes no private data to the student", async () => {
    const { service, deps, saved } = setup();
    deps.sendEmail.mockRejectedValue(new Error("provider secret"));
    const result = await service.submit("token", input);
    expect(saved()).toBeTruthy();
    expect(deps.store.notification).toHaveBeenCalledWith(expect.any(String), {
      state: "failed",
    });
    expect(result).not.toHaveProperty("reporterId");
    expect(JSON.stringify(result)).not.toContain("secret");
  });
  it("blocks students from the inbox, updates and notification retries", async () => {
    const { service, deps } = setup();
    await expect(service.list("token", {})).rejects.toMatchObject({
      status: 403,
    });
    await expect(
      service.update("token", {
        id: "x",
        revision: 1,
        status: "fixed",
        notes: "",
      }),
    ).rejects.toMatchObject({ status: 403 });
    await expect(service.retry("token", { id: "x" })).rejects.toMatchObject({
      status: 403,
    });
    expect(deps.store.list).not.toHaveBeenCalled();
    expect(deps.store.update).not.toHaveBeenCalled();
  });
  it("rejects invalid category, huge explanation and spoofed fields", async () => {
    for (const patch of [
      { category: "anything" },
      { explanation: "x".repeat(2001) },
      { reporterId: "owner" },
    ]) {
      const { service, deps } = setup();
      await expect(
        service.submit("token", { ...input, ...patch }),
      ).rejects.toMatchObject({ status: 400 });
      expect(deps.store.create).not.toHaveBeenCalled();
    }
  });
  it("requires explanation for other and rejects unknown question references", async () => {
    const { service, deps } = setup();
    await expect(
      service.submit("token", { ...input, category: "other", explanation: "" }),
    ).rejects.toMatchObject({ status: 400 });
    deps.resolveQuestion.mockRejectedValue({ status: 404 });
    await expect(service.submit("token", input)).rejects.toMatchObject({
      status: 404,
    });
  });
  it("allows only the owner to update a report with revision and audit identity", async () => {
    const { service, saved } = setup(true);
    const result = await service.submit("token", input);
    await service.update("token", {
      id: result.id,
      revision: 1,
      status: "reviewing",
      notes: "Checking the source",
    });
    expect(saved()).toMatchObject({
      status: "reviewing",
      notes: "Checking the source",
      updatedBy: "student1",
      revision: 2,
    });
  });
});
