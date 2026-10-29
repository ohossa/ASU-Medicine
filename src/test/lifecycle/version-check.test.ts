import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isNewerVersion,
  fetchRemoteVersion,
  applyAppUpdate,
} from "../../app/hooks/useVersionCheck";
import type { AppVersionInfo } from "../../app/hooks/useVersionCheck";

describe("Version Invalidation & Auto-Update Engine", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("isNewerVersion comparison logic", () => {
    it("detects a newer version by git commit hash mismatch", () => {
      const local: AppVersionInfo = {
        version: "0.0.1",
        commit: "a1b2c3d",
        buildTime: "2026-10-29T00:00:00Z",
        timestamp: 1000,
      };
      const remote: AppVersionInfo = {
        version: "0.0.1",
        commit: "e4f5g6h",
        buildTime: "2026-10-29T01:00:00Z",
        timestamp: 2000,
      };

      expect(isNewerVersion(remote, local)).toBe(true);
    });

    it("returns false when commit hashes are identical", () => {
      const local: AppVersionInfo = {
        version: "0.0.1",
        commit: "a1b2c3d",
        buildTime: "2026-10-29T00:00:00Z",
        timestamp: 1000,
      };
      const remote: AppVersionInfo = {
        version: "0.0.1",
        commit: "a1b2c3d",
        buildTime: "2026-10-29T00:00:00Z",
        timestamp: 1000,
      };

      expect(isNewerVersion(remote, local)).toBe(false);
    });

    it("falls back to build timestamp when commits are 'dev'", () => {
      const local: AppVersionInfo = {
        version: "0.0.1",
        commit: "dev",
        buildTime: "2026-10-29T00:00:00Z",
        timestamp: 1000,
      };
      const newerRemote: AppVersionInfo = {
        version: "0.0.1",
        commit: "dev",
        buildTime: "2026-10-29T02:00:00Z",
        timestamp: 2000,
      };
      const olderRemote: AppVersionInfo = {
        version: "0.0.1",
        commit: "dev",
        buildTime: "2026-10-28T00:00:00Z",
        timestamp: 500,
      };

      expect(isNewerVersion(newerRemote, local)).toBe(true);
      expect(isNewerVersion(olderRemote, local)).toBe(false);
    });
  });

  describe("fetchRemoteVersion HTTP poller", () => {
    it("successfully retrieves and parses remote version.json", async () => {
      const mockVersion: AppVersionInfo = {
        version: "0.0.1",
        commit: "fresh99",
        buildTime: "2026-10-29T05:00:00Z",
        timestamp: 5000,
      };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockVersion,
        }),
      );

      const result = await fetchRemoteVersion();
      expect(result).toEqual(mockVersion);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/version.json?_t="),
        expect.objectContaining({ cache: "no-store" }),
      );
    });

    it("returns null gracefully on HTTP error status", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
        }),
      );

      const result = await fetchRemoteVersion();
      expect(result).toBeNull();
    });

    it("returns null gracefully on network failure", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new Error("Network offline")),
      );

      const result = await fetchRemoteVersion();
      expect(result).toBeNull();
    });
  });

  describe("applyAppUpdate execution", () => {
    it("dispatches asu:save-before-refresh and asu:apply-update before reloading", async () => {
      vi.useFakeTimers();
      const saveSpy = vi.fn();
      const applySpy = vi.fn();
      const reloadSpy = vi.fn();

      window.addEventListener("asu:save-before-refresh", saveSpy);
      window.addEventListener("asu:apply-update", applySpy);

      // Mock window.location.reload
      const originalReload = window.location.reload;
      Object.defineProperty(window.location, "reload", {
        value: reloadSpy,
        writable: true,
        configurable: true,
      });

      applyAppUpdate();

      expect(saveSpy).toHaveBeenCalledOnce();
      expect(applySpy).toHaveBeenCalledOnce();

      vi.advanceTimersByTime(150);
      expect(reloadSpy).toHaveBeenCalledOnce();

      window.removeEventListener("asu:save-before-refresh", saveSpy);
      window.removeEventListener("asu:apply-update", applySpy);
      Object.defineProperty(window.location, "reload", {
        value: originalReload,
        writable: true,
        configurable: true,
      });
      vi.useRealTimers();
    });
  });
});
