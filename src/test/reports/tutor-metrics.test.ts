import { it, expect, vi, afterEach } from "vitest";
const mocks = vi.hoisted(() => ({ evalRedis: vi.fn() }));
vi.mock("../../../server/report-store", () => mocks);
import {
  recordTutorUsage,
  readTutorUsage,
  cairoDay,
} from "../../../server/tutor-metrics";
afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});
it("uses Cairo calendar days at UTC midnight boundaries", () => {
  expect(cairoDay(new Date("2026-10-08T22:30:00Z"))).toBe("2026-10-09");
});
it("records anonymous atomic counters and only approved provider limit headers", async () => {
  mocks.evalRedis.mockResolvedValue(1);
  await recordTutorUsage(
    200,
    { prompt_tokens: 12, completion_tokens: 8, total_tokens: 20 },
    new Headers({
      "x-ratelimit-remaining-requests": "987",
      "x-ratelimit-remaining-tokens": "NaN",
      authorization: "private",
    }),
  );
  const [script, keys, args] = mocks.evalRedis.mock.calls[0];
  expect(script).toContain("HINCRBY");
  expect(keys[0]).toMatch(/^asu_tutor:v1:day:\d{4}-\d{2}-\d{2}:groq$/);
  expect(args.slice(0, 5)).toEqual(["1", "0", "12", "8", "20"]);
  const sample = JSON.parse(args[5]);
  expect(sample.remainingRequests).toBe(987);
  expect(sample.remainingTokens).toBeNull();
  expect(JSON.stringify(sample)).not.toContain("private");
  expect(JSON.stringify(sample)).not.toContain("authorization");
});
it("cannot interrupt a tutor response when metrics storage fails", async () => {
  mocks.evalRedis.mockRejectedValue(new Error("storage down"));
  await expect(
    recordTutorUsage(429, undefined, new Headers()),
  ).resolves.toBeUndefined();
});
it("reads recorded counters without inventing a live quota", async () => {
  mocks.evalRedis.mockResolvedValue([
    JSON.stringify({
      requests: 3,
      successes: 2,
      failures: 1,
      inputTokens: 20,
      outputTokens: 10,
      totalTokens: 30,
    }),
    "",
  ]);
  expect(await readTutorUsage()).toMatchObject({
    requests: 3,
    successes: 2,
    failures: 1,
    totalTokens: 30,
    quota: null,
  });
});
