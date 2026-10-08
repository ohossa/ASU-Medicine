import { it, expect, vi, afterEach } from "vitest";
const mocks = vi.hoisted(() => ({
  overview: vi.fn(),
  readTutorUsage: vi.fn(),
}));
vi.mock("../../../server/tutor-metrics", () => ({
  readTutorUsage: mocks.readTutorUsage,
}));
vi.mock("../../../server/report-store", () => ({ reportStore: {} }));
vi.mock("../../../server/question-edit-store", () => ({ editStore: {} }));
vi.mock("../../../server/report-auth", () => ({
  authenticateReportUser: vi.fn(),
}));
vi.mock("../../../server/report-question", () => ({
  resolveReportQuestion: vi.fn(),
}));
vi.mock("../../../server/report-email", () => ({ sendReportEmail: vi.fn() }));
vi.mock("../../../server/report-service", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../server/report-service")>()),
  createReportService: () => ({ overview: mocks.overview }),
}));
import handler from "../../../api/question-reports";
import { ReportError } from "../../../server/report-service";
afterEach(() => vi.clearAllMocks());
function response() {
  const res = { setHeader: vi.fn(), status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
}
it("never reads private tutor metrics before owner authorization", async () => {
  mocks.overview.mockRejectedValue(new ReportError(403, "Owner only"));
  const res = response();
  await handler(
    {
      method: "GET",
      headers: { authorization: "Bearer student" },
      query: { action: "overview" },
    },
    res,
  );
  expect(res.status).toHaveBeenCalledWith(403);
  expect(mocks.readTutorUsage).not.toHaveBeenCalled();
});
it("retains report data when metrics storage is unavailable", async () => {
  mocks.overview.mockResolvedValue({ total: 7 });
  mocks.readTutorUsage.mockRejectedValue(new Error("private Redis details"));
  const res = response();
  await handler(
    {
      method: "GET",
      headers: { authorization: "Bearer owner" },
      query: { action: "overview" },
    },
    res,
  );
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ reports: { total: 7 }, tutor: null }),
  );
  expect(JSON.stringify(res.json.mock.calls)).not.toContain(
    "private Redis details",
  );
  expect(res.setHeader).toHaveBeenCalledWith(
    "Cache-Control",
    "private, no-store",
  );
});
