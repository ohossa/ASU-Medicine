import { it, expect, vi, afterEach, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
import { SiteUpdateNotice } from "./SiteUpdateNotice";
beforeEach(() => {
  sessionStorage.clear();
});
afterEach(() => {
  vi.useRealTimers();
  cleanup();
  vi.unstubAllGlobals();
});
it("offers a refresh for a replaced controller and saves first", () => {
  const worker = Object.assign(new EventTarget(), { controller: {} });
  vi.stubGlobal("navigator", { serviceWorker: worker });
  const reload = vi.fn(),
    saved = vi.fn();
  window.addEventListener("asu:save-before-refresh", saved);
  render(<SiteUpdateNotice reload={reload} />);
  expect(
    screen.queryByRole("button", { name: "Save and refresh" }),
  ).not.toBeInTheDocument();
  act(() => worker.dispatchEvent(new Event("controllerchange")));
  fireEvent.click(screen.getByRole("button", { name: "Save and refresh" }));
  expect(saved).toHaveBeenCalledOnce();
  expect(reload).toHaveBeenCalledOnce();
  expect(saved.mock.invocationCallOrder[0]).toBeLessThan(
    reload.mock.invocationCallOrder[0],
  );
  window.removeEventListener("asu:save-before-refresh", saved);
});
it("does not interrupt first-time installation", () => {
  const worker = Object.assign(new EventTarget(), { controller: null });
  vi.stubGlobal("navigator", { serviceWorker: worker });
  render(<SiteUpdateNotice />);
  act(() => worker.dispatchEvent(new Event("controllerchange")));
  expect(
    screen.queryByRole("button", { name: "Save and refresh" }),
  ).not.toBeInTheDocument();
});
it("never auto-reloads while a quiz is active, but auto-reloads idle tabs after grace period", () => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
  const worker = Object.assign(new EventTarget(), { controller: {} });
  vi.stubGlobal("navigator", { serviceWorker: worker });
  const reload = vi.fn();
  const { rerender } = render(<SiteUpdateNotice reload={reload} isQuizActive={true} />);
  act(() => worker.dispatchEvent(new Event("controllerchange")));
  act(() => vi.advanceTimersByTime(5000));
  expect(reload).not.toHaveBeenCalled();
  expect(screen.getByText("Update ready")).toBeInTheDocument();

  rerender(<SiteUpdateNotice reload={reload} isQuizActive={false} />);
  expect(screen.getByText("Updating app…")).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(1600));
  expect(reload).toHaveBeenCalledOnce();
});
