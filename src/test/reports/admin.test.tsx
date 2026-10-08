import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import AdminPortal from "../../pages/AdminPortal";
vi.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({ getToken: async () => "token" }),
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: { id: "owner", fullName: "Omar" },
  }),
}));
vi.mock("../../app/hooks/useLanguage", () => ({
  useLanguage: () => ({ language: "en" }),
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
describe("Private admin portal", () => {
  it("shows access denial without requesting the report inbox", async () => {
    const fetch = vi.fn(async () => ({
      ok: false,
      status: 403,
      json: async () => ({ error: "This portal is restricted to the owner." }),
    }));
    vi.stubGlobal("fetch", fetch);
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AdminPortal />
      </MemoryRouter>,
    );
    await screen.findByText("This portal is restricted to the owner.");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Recent reports")).not.toBeInTheDocument();
  });
  it("shows a genuine empty inbox after server authorization", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => ({
        ok: true,
        json: async () =>
          url.includes("action=access")
            ? { isAdmin: true }
            : {
                reports: [],
                total: 0,
                counts: { new: 0, reviewing: 0, fixed: 0, dismissed: 0 },
              },
      })),
    );
    render(
      <MemoryRouter initialEntries={["/admin/reports"]}>
        <AdminPortal />
      </MemoryRouter>,
    );
    await screen.findByText("No reports here yet");
    expect(
      screen.getByRole("heading", { name: "Question reports" }),
    ).toBeInTheDocument();
  });
});
