import { afterEach, describe, expect, it, vi } from "vitest";
import { reportRequest } from "../../app/reports/client";
afterEach(() => vi.unstubAllGlobals());
describe("Report API responses", () => {
  it("rejects an HTML fallback even when the server returns HTTP 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => {
          throw new SyntaxError("HTML instead of JSON");
        },
      })),
    );
    await expect(reportRequest(async () => "token")).rejects.toThrow(
      "temporarily unavailable",
    );
  });
  it("rejects a null response instead of treating it as success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => null })),
    );
    await expect(reportRequest(async () => "token")).rejects.toThrow(
      "temporarily unavailable",
    );
  });
});
