import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { PortalEntry, isSupportPath, isTermsPath, isPrivacyPath, isDisclaimerPath } from "./PortalEntry";
vi.mock("./pages/support/SupportPage", () => ({
  default: () => <h1>Public support</h1>,
}));
vi.mock("./pages/legal/TermsPage", () => ({
  default: () => <h1>Terms of Service</h1>,
}));
vi.mock("./pages/legal/PrivacyPage", () => ({
  default: () => <h1>Privacy Policy</h1>,
}));
vi.mock("./pages/legal/MedicalDisclaimerPage", () => ({
  default: () => <h1>Medical Disclaimer</h1>,
}));
vi.mock("./StudyEntry", () => ({ default: () => <h1>Private study app</h1> }));
afterEach(cleanup);
describe("Public support and legal entry isolation", () => {
  it("recognizes public support and legal routes", () => {
    expect(isSupportPath("/support")).toBe(true);
    expect(isSupportPath("/support/")).toBe(true);
    expect(isTermsPath("/terms")).toBe(true);
    expect(isTermsPath("/terms/")).toBe(true);
    expect(isPrivacyPath("/privacy")).toBe(true);
    expect(isDisclaimerPath("/disclaimer")).toBe(true);
    expect(isSupportPath("/admin")).toBe(false);
    expect(isSupportPath("/supportive")).toBe(false);
  });
  it("keeps the normal study entry for academic and admin routes", async () => {
    render(<PortalEntry pathname="/admin" />);
    expect(await screen.findByText("Private study app")).toBeInTheDocument();
    expect(screen.queryByText("Public support")).toBeNull();
  });
  it("renders support directly without mounting the authenticated study app", async () => {
    render(<PortalEntry pathname="/support" />);
    expect(await screen.findByText("Public support")).toBeInTheDocument();
    expect(screen.queryByText("Private study app")).toBeNull();
  });
  it("renders legal pages without mounting the authenticated study app", async () => {
    render(<PortalEntry pathname="/terms" />);
    expect(await screen.findByText("Terms of Service")).toBeInTheDocument();

    cleanup();
    render(<PortalEntry pathname="/privacy" />);
    expect(await screen.findByText("Privacy Policy")).toBeInTheDocument();

    cleanup();
    render(<PortalEntry pathname="/disclaimer" />);
    expect(await screen.findByText("Medical Disclaimer")).toBeInTheDocument();
  });
});
