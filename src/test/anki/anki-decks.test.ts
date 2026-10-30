import { describe, it, expect } from "vitest";
import {
  resolveDirectDownloadUrl,
  getModuleDeckGroups,
  getTotalAvailableDecksCount,
  getAnkiCommunityUrl,
  ANKI_WHATSAPP_GROUP_URL,
} from "../../app/data/ankiDecks";

describe("Anki Deck Catalog & Link Engine", () => {
  describe("community url", () => {
    it("returns official WhatsApp community group URL", () => {
      expect(ANKI_WHATSAPP_GROUP_URL).toContain("chat.whatsapp.com/Jc9rZktSszkIf2lfzCcL94");
      expect(getAnkiCommunityUrl()).toBe(ANKI_WHATSAPP_GROUP_URL);
    });
  });
  describe("resolveDirectDownloadUrl", () => {
    it("converts Google Drive share link into 1-tap direct export download URL", () => {
      const gdriveShareUrl =
        "https://drive.google.com/file/d/1XyZ9_aBcDeFgHiJkLmNoPqRsTuVwXyZ/view?usp=sharing";
      const directUrl = resolveDirectDownloadUrl(gdriveShareUrl);
      expect(directUrl).toBe(
        "https://drive.google.com/uc?export=download&id=1XyZ9_aBcDeFgHiJkLmNoPqRsTuVwXyZ",
      );
    });

    it("converts Google Drive open?id= link into 1-tap direct download URL", () => {
      const gdriveOpenUrl =
        "https://drive.google.com/open?id=1234567890abcdef_XYZ";
      const directUrl = resolveDirectDownloadUrl(gdriveOpenUrl);
      expect(directUrl).toBe(
        "https://drive.google.com/uc?export=download&id=1234567890abcdef_XYZ",
      );
    });

    it("converts GitHub blob link into raw usercontent CDN URL", () => {
      const githubBlobUrl =
        "https://github.com/omarhossa/ASU-Medical-Portal/blob/main/decks/MGL-3.apkg";
      const directUrl = resolveDirectDownloadUrl(githubBlobUrl);
      expect(directUrl).toBe(
        "https://raw.githubusercontent.com/omarhossa/ASU-Medical-Portal/main/decks/MGL-3.apkg",
      );
    });

    it("preserves GitHub release direct asset download URLs", () => {
      const githubReleaseUrl =
        "https://github.com/omarhossa/ASU-Medical-Portal/releases/download/v1.0.0/GIT_Part_1.apkg";
      const directUrl = resolveDirectDownloadUrl(githubReleaseUrl);
      expect(directUrl).toBe(githubReleaseUrl);
    });

    it("handles empty or whitespace strings gracefully", () => {
      expect(resolveDirectDownloadUrl("")).toBe("");
      expect(resolveDirectDownloadUrl("   ")).toBe("");
      expect(resolveDirectDownloadUrl(undefined)).toBe("");
    });
  });

  describe("getModuleDeckGroups", () => {
    it("returns correct modules for Year 3 Semester 1 including MGL-3 with available decks", () => {
      const groups = getModuleDeckGroups(3, 1);
      expect(groups.length).toBeGreaterThan(0);

      const mgl3Group = groups.find((g) => g.module.code === "MGL-3");
      expect(mgl3Group).toBeDefined();
      expect(mgl3Group?.decks.length).toBe(2);
      expect(mgl3Group?.decks[0].isAvailable).toBe(true);
      expect(mgl3Group?.decks[0].part).toBe(1);
      expect(mgl3Group?.decks[1].isAvailable).toBe(true);
      expect(mgl3Group?.decks[1].part).toBe(2);
    });

    it("provides pending deck placeholders for modules without uploaded decks", () => {
      const groups = getModuleDeckGroups(1, 1);
      expect(groups.length).toBeGreaterThan(0);
      const pendingModule = groups.find((g) => g.module.code === "IAE-1");
      expect(pendingModule).toBeDefined();
      expect(pendingModule?.decks[0].isAvailable).toBe(false);
    });
  });

  describe("getTotalAvailableDecksCount", () => {
    it("reports at least 2 available decks currently in registry", () => {
      const count = getTotalAvailableDecksCount();
      expect(count).toBeGreaterThanOrEqual(2);
    });
  });
});
