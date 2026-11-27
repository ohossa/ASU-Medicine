import { beforeEach, expect, it, vi } from "vitest";
import { readAdminLearningSnapshot, refreshAdminLearningSnapshot } from "../../../server/admin-learning-snapshot";

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
}));
vi.mock("../../../server/d1-client.js", () => ({
  d1Transaction: mocks.transaction,
  isD1Configured: () => true,
}));
vi.mock("../../../server/r2-client.js", () => ({
  getR2Json: mocks.get,
  putR2Json: mocks.put,
}));

beforeEach(() => vi.resetAllMocks());

it("reuses the same snapshot across reads and preserves it when the scheduled aggregation fails", async () => {
  mocks.transaction.mockResolvedValue([[{ total_attempts: 10 }], [], [], [], [], []]);
  mocks.put.mockImplementation(async (_key, snapshot) => {
    mocks.get.mockResolvedValue({ data: snapshot });
  });

  const generatedAt = await refreshAdminLearningSnapshot();
  expect(generatedAt).toEqual(expect.any(String));
  expect(mocks.transaction).toHaveBeenCalledTimes(1);
  expect(mocks.transaction.mock.calls[0][0]).toHaveLength(6);
  const published = await readAdminLearningSnapshot();
  expect(published).toMatchObject({ generatedAt, overallKpis: [{ total_attempts: 10 }] });
  expect(await readAdminLearningSnapshot()).toEqual(published);
  expect(mocks.transaction).toHaveBeenCalledTimes(1);

  mocks.transaction.mockRejectedValue(new Error("D1 unavailable"));
  await expect(refreshAdminLearningSnapshot()).rejects.toThrow("D1 unavailable");
  expect(mocks.put).toHaveBeenCalledTimes(1);
  expect(await readAdminLearningSnapshot()).toEqual(published);
});

it("rejects an unavailable snapshot without running an aggregation on the request path", async () => {
  mocks.get.mockResolvedValue({ data: null });
  await expect(readAdminLearningSnapshot()).rejects.toThrow("Admin learning snapshot is unavailable.");
  expect(mocks.transaction).not.toHaveBeenCalled();
});
