import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatPageTitle, updateDocumentTitle, DEFAULT_FULL_TITLE } from "../../app/utils/pageTitle";

describe("Browser Tab Title Management", () => {
  const originalTitle = document.title;

  beforeEach(() => {
    document.title = originalTitle;
  });

  afterEach(() => {
    document.title = originalTitle;
    vi.restoreAllMocks();
  });

  it("produces compact root title on cold load or home", () => {
    expect(formatPageTitle()).toBe("A-Plus · Medical Portal");
    expect(formatPageTitle("")).toBe("A-Plus · Medical Portal");
    expect(formatPageTitle("Home")).toBe("A-Plus · Medical Portal");
    expect(formatPageTitle("home")).toBe("A-Plus · Medical Portal");
  });

  it("formats standard academic module and practice mode titles", () => {
    expect(formatPageTitle("MRS-2")).toBe("MRS-2 · A-Plus");
    expect(formatPageTitle("MRS-2 MCQ")).toBe("MRS-2 MCQ · A-Plus");
    expect(formatPageTitle("MRS-2 Quiz")).toBe("MRS-2 Quiz · A-Plus");
    expect(formatPageTitle("MRS-2 Results")).toBe("MRS-2 Results · A-Plus");
    expect(formatPageTitle("MRS-2 Tracker")).toBe("MRS-2 Tracker · A-Plus");
    expect(formatPageTitle("MGL-3")).toBe("MGL-3 · A-Plus");
  });

  it("formats administrative portal and utility titles", () => {
    expect(formatPageTitle("Admin Operations")).toBe("Admin Operations · A-Plus");
    expect(formatPageTitle("Reports Inbox")).toBe("Reports Inbox · A-Plus");
    expect(formatPageTitle("Question Studio")).toBe("Question Studio · A-Plus");
    expect(formatPageTitle("Portal Analytics")).toBe("Portal Analytics · A-Plus");
    expect(formatPageTitle("Learning Hub")).toBe("Learning Hub · A-Plus");
    expect(formatPageTitle("Anki Decks")).toBe("Anki Decks · A-Plus");
    expect(formatPageTitle("Marks Calculator")).toBe("Marks Calculator · A-Plus");
    expect(formatPageTitle("Question Search")).toBe("Question Search · A-Plus");
    expect(formatPageTitle("Flagged Questions")).toBe("Flagged Questions · A-Plus");
  });

  it("formats support and legal page titles", () => {
    expect(formatPageTitle("Support")).toBe("Support · A-Plus");
    expect(formatPageTitle("الدعم")).toBe("الدعم · A-Plus");
    expect(formatPageTitle("Terms of Service")).toBe("Terms of Service · A-Plus");
    expect(formatPageTitle("Privacy Policy")).toBe("Privacy Policy · A-Plus");
    expect(formatPageTitle("Medical Disclaimer")).toBe("Medical Disclaimer · A-Plus");
    expect(formatPageTitle("Page Not Found")).toBe("Page Not Found · A-Plus");
  });

  it("sets document.title to compact string under 30 characters avoiding truncation", () => {
    updateDocumentTitle("Support");
    expect(document.title).toBe("Support · A-Plus");
    expect(document.title.length).toBeLessThan(30);

    updateDocumentTitle("MRS-2 MCQ");
    expect(document.title).toBe("MRS-2 MCQ · A-Plus");
    expect(document.title.length).toBeLessThan(30);

    updateDocumentTitle("");
    expect(document.title).toBe(DEFAULT_FULL_TITLE);
    expect(document.title.length).toBeLessThan(30);
  });
});
