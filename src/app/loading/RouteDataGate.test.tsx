import { it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { RouteDataGate } from "./RouteDataGate";
const load = vi.hoisted(() => ({
  module: vi.fn(),
  year: vi.fn(),
  all: vi.fn(),
}));
vi.mock("../data", () => ({
  ensureModuleDataLoaded: load.module,
  ensureYearDataLoaded: load.year,
  ensureDataLoaded: load.all,
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
it("home needs no banks and a selected module failure stays recoverable", async () => {
  const first = render(
    <MemoryRouter initialEntries={["/"]}>
      <RouteDataGate year={3}>
        <p>Home</p>
      </RouteDataGate>
    </MemoryRouter>,
  );
  expect(screen.getByText("Home")).toBeVisible();
  expect(load.all).not.toHaveBeenCalled();
  first.unmount();
  load.module
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(undefined);
  render(
    <MemoryRouter initialEntries={["/year-3/mgl-3/mcq"]}>
      <RouteDataGate year={3}>
        <p>Ready chapter</p>
      </RouteDataGate>
    </MemoryRouter>,
  );
  await screen.findByText("Question bank unavailable");
  expect(screen.queryByText("Ready chapter")).toBeNull();
  fireEvent.click(screen.getByText("Retry loading"));
  await screen.findByText("Ready chapter");
  expect(load.module).toHaveBeenCalledWith("MGL-3");
  expect(load.all).not.toHaveBeenCalled();
});
