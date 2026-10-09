import { it, expect, vi, afterEach } from "vitest";
const mocks = vi.hoisted(() => ({ getUser: vi.fn() }));
vi.mock("@clerk/backend", () => ({
  createClerkClient: () => ({ users: { getUser: mocks.getUser } }),
  verifyToken: vi.fn(),
}));
import { verifiedReporterEmail } from "../../../server/report-auth";
afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});
it("resolves current verified email for old reports without a captured profile", async () => {
  vi.stubEnv("CLERK_SECRET_KEY", "test-key");
  mocks.getUser.mockResolvedValue({
    primaryEmailAddressId: "primary",
    emailAddresses: [
      {
        id: "primary",
        emailAddress: "current@example.com",
        verification: { status: "verified" },
      },
    ],
  });
  expect(await verifiedReporterEmail("old-student")).toBe(
    "current@example.com",
  );
  expect(mocks.getUser).toHaveBeenCalledWith("old-student");
});
it("never uses an unverified primary email", async () => {
  vi.stubEnv("CLERK_SECRET_KEY", "test-key");
  mocks.getUser.mockResolvedValue({
    primaryEmailAddressId: "unverified",
    emailAddresses: [
      {
        id: "unverified",
        emailAddress: "unverified@example.com",
        verification: { status: "unverified" },
      },
      {
        id: "verified",
        emailAddress: "verified@example.com",
        verification: { status: "verified" },
      },
    ],
  });
  expect(await verifiedReporterEmail("student")).toBe("verified@example.com");
});
it("keeps deleted or unverified accounts reply-ineligible", async () => {
  vi.stubEnv("CLERK_SECRET_KEY", "test-key");
  mocks.getUser.mockResolvedValue({ emailAddresses: [] });
  expect(await verifiedReporterEmail("student")).toBe("");
  mocks.getUser.mockRejectedValue({ status: 404 });
  expect(await verifiedReporterEmail("deleted")).toBe("");
});
it("does not expose provider details when identity lookup fails", async () => {
  vi.stubEnv("CLERK_SECRET_KEY", "test-key");
  mocks.getUser.mockRejectedValue(new Error("private credential detail"));
  await expect(verifiedReporterEmail("student")).rejects.toMatchObject({
    status: 503,
    message: "The student email could not be checked. Please try again.",
  });
});
