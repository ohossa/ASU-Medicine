import { describe, it, expect } from "vitest";
import { validateDisplayName, isNameAllowed, sanitizeDisplayName } from "../../../server/profanity-filter.js";

describe("Bilingual Profanity and Name Filter", () => {
  describe("Valid student names (English & Arabic)", () => {
    const validNames = [
      "Ahmed Mohamed",
      "Omar Hossam",
      "Dr. Sarah",
      "نور الدين",
      "مريم محمود",
      "زياد طارق",
      "علي مصطفى",
      "Karim Ezzat",
      "Salma_99",
      "John-Paul",
      "فاطمة الزهراء",
      "Youssef A.",
    ];

    it.each(validNames)("allows legitimate name: %s", (name) => {
      const result = validateDisplayName(name);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe("Rejects English profanity and evasions", () => {
    const badEnglish = [
      "fuck you",
      "big dick",
      "bad bitch",
      "sh!thead",
      "f_u_c_k",
      "asshole123",
      "pornstar",
      "fuuuuck",
    ];

    it.each(badEnglish)("blocks English term: %s", (name) => {
      const result = validateDisplayName(name);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/appropriate academic display name/i);
    });
  });

  describe("Rejects Arabic profanity, insults and evasions", () => {
    const badArabic = [
      "شرموط",
      "شرمووووط",
      "متناك",
      "منيوك",
      "عرص المنصة",
      "كسمك",
      "طيز كبير",
      "زب كبير",
      "شرمـوطـة",
      "قحبة",
    ];

    it.each(badArabic)("blocks Arabic term: %s", (name) => {
      const result = validateDisplayName(name);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/appropriate academic display name/i);
    });
  });

  describe("Enforces length and character boundaries", () => {
    it("rejects too short names (< 3 chars)", () => {
      expect(validateDisplayName("ab").valid).toBe(false);
      expect(validateDisplayName("").valid).toBe(false);
    });

    it("rejects too long names (> 24 chars)", () => {
      expect(validateDisplayName("A".repeat(25)).valid).toBe(false);
    });

    it("rejects email addresses and websites", () => {
      expect(validateDisplayName("student@asu.edu.eg").valid).toBe(false);
      expect(validateDisplayName("visit google.com").valid).toBe(false);
    });

    it("rejects links and phone numbers", () => {
      expect(validateDisplayName("https://evil.site").valid).toBe(false);
      expect(validateDisplayName("+201012345678").valid).toBe(false);
    });
  });

  describe("sanitizeDisplayName", () => {
    it("cleans excessive spacing and control chars", () => {
      expect(sanitizeDisplayName("  Ahmed   Mohamed  ")).toBe("Ahmed Mohamed");
      expect(sanitizeDisplayName(null as any)).toBe("Student");
    });
  });

  describe("isNameAllowed shorthand", () => {
    it("returns boolean allowed and optional reason", () => {
      expect(isNameAllowed("Dr. Ahmed").allowed).toBe(true);
      expect(isNameAllowed("fuck").allowed).toBe(false);
      expect(isNameAllowed("fuck").reason).toBeDefined();
    });
  });
});
