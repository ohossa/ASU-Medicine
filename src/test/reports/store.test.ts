import { describe, it, expect } from "vitest";
import {
  encodeStoredReport,
  decodeStoredReport,
} from "../../../server/report-store";
import type { QuestionReport } from "../../app/reports/contracts";

describe("Stored report snapshots", () => {
  it("keeps nested empty arrays opaque during database status and notification updates", () => {
    const report = {
      id: "r_test",
      status: "new",
      revision: 1,
      snapshot: {
        version: "unchanged",
        question: {
          id: "Q1",
          type: "case",
          options: [],
          subQuestions: [{ id: "S1", options: [] }],
        },
      },
    } as unknown as QuestionReport;
    const stored = JSON.parse(encodeStoredReport(report));
    expect(typeof stored.snapshot).toBe("string");
    stored.status = "reviewing";
    stored.revision += 1;
    stored.notification = { state: "sent" };
    const updated = decodeStoredReport(JSON.stringify(stored));
    expect(updated.snapshot).toEqual(report.snapshot);
    expect(updated.status).toBe("reviewing");
    expect(updated.notification.state).toBe("sent");
  });
});
