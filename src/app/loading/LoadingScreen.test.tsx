import { it, expect, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import LoadingScreen from "../components/LoadingScreen";
it("uses an honest indeterminate status and disappears immediately when ready", () => {
  const { rerender } = render(
    <LoadingScreen isLoading label="Preparing your study space" />,
  );
  expect(screen.getByRole("status")).toHaveTextContent(
    "Preparing your study space",
  );
  expect(screen.queryByText("100%")).toBeNull();
  rerender(<LoadingScreen isLoading={false} />);
  expect(screen.queryByRole("status")).toBeNull();
  cleanup();
});
it("does not simulate completion with a timer", () => {
  vi.useFakeTimers();
  render(<LoadingScreen />);
  vi.advanceTimersByTime(10000);
  expect(screen.getByRole("status")).toBeInTheDocument();
  cleanup();
  vi.useRealTimers();
});
