import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { PortalEntry, isSupportPath } from "./PortalEntry";
vi.mock("./pages/support/SupportPage", () => ({
  default: () => <h1>Public support</h1>,
}));
vi.mock("./StudyEntry", () => ({ default: () => <h1>Private study app</h1> }));
afterEach(cleanup);
describe("Public support entry isolation", () => {
  it("recognizes only the public support route", () => {
    expect(isSupportPath("/support")).toBe(true);
    expect(isSupportPath("/support/")).toBe(true);
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
});
