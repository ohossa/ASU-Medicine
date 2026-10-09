import { it, expect, vi } from "vitest";
import { createLearningService } from "../../../server/learning-service";
const setup = () => {
  const deps = {
    authenticate: vi.fn(async () => ({ id: "owner" })),
    year: vi.fn(async () => 3),
    bank: vi.fn(
      async () =>
        new Map([
          [
            "q",
            {
              moduleCode: "MGL-3",
              chapterId: 1,
              chapterTitle: "Anatomy",
              subjectName: "Anatomy",
              version: "v",
              question: {
                id: "q",
                text: "Statement",
                type: "truefalse",
                correctIndex: 0,
                options: ["True", "False"],
              },
            },
          ],
        ]),
    ),
    award: vi.fn(async (_id: string, _year: number, _rewards: unknown[]) => ({
      personal: 5,
      competitive: 5,
    })),
    dashboard: vi.fn(async () => ({})),
    profile: vi.fn(async () => ({ level: 1 })),
    saveProfile: vi.fn(async () => ({})),
    rate: vi.fn(async () => true),
  };
  return { deps, service: createLearningService(deps) };
};
it("rejects claims from the wrong academic year before grading", async () => {
  const { deps, service } = setup();
  await expect(
    service.submit("token", {
      moduleCode: "MEM-2",
      items: [{ questionId: "q", answer: true }],
    }),
  ).rejects.toThrow("current academic year");
  expect(deps.bank).not.toHaveBeenCalled();
  expect(deps.award).not.toHaveBeenCalled();
});
it("derives rewards from canonical answers and ignores client XP fields", async () => {
  const { deps, service } = setup();
  await service.submit("token", {
    moduleCode: "MGL-3",
    xp: 99999,
    items: [{ questionId: "q", answer: false, correct: true }],
  });
  expect(deps.award.mock.calls[0]![2][0]).toMatchObject({
    personal: 0,
    competitive: 0,
    correct: false,
  });
});
it("rejects locked cosmetics and email-shaped aliases", async () => {
  const { service } = setup();
  await expect(service.settings("token", { banner: "sunset" })).rejects.toThrow(
    "unlock",
  );
  await expect(
    service.settings("token", { alias: "a@email.com" }),
  ).rejects.toThrow("alias");
});
it("authenticates before reading or writing private records", async () => {
  const { deps, service } = setup();
  deps.authenticate.mockRejectedValue(new Error("401"));
  await expect(service.submit("", {})).rejects.toThrow("401");
  expect(deps.year).not.toHaveBeenCalled();
  expect(deps.award).not.toHaveBeenCalled();
});
