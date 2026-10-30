/**
 * High-Performance Bilingual (Arabic & English) Display Name Validator & Profanity Filter
 * Designed specifically for ASU Medical Portal to ensure academic integrity while
 * respecting authentic Arabic and English student names.
 */

// 1. English Word Lists for Inappropriate Content
const ENGLISH_BLOCKED_TERMS = [
  "fuck", "fuk", "fck", "f u c k", "motherfucker",
  "shit", "shyt", "bullshit", "asshole", "asswipe", "bitch",
  "cunt", "dick", "cock", "pussy", "vagina", "penis",
  "nigger", "nigga", "faggot", "fag", "bastard", "slut",
  "whore", "porn", "porno", "sex", "nude", "horny",
  "boobs", "tits", "blowjob", "handjob", "cum", "dildo"
];

// 2. Arabic Word Lists (Insults, Vulgarities & Sexual Slang)
// Words with length <= 3 MUST only match on word boundaries to protect legitimate names (e.g., مصطفى contains مص).
const ARABIC_BOUNDARY_TERMS = [
  "عرص", "خول", "زب", "طيز", "نيك", "سكس", "مص", "لحس", "قذر", "وسخ"
];

const ARABIC_ROOT_TERMS = [
  "شرموط", "شرموطه", "شرموطة", "متناك", "منيوك",
  "كسم", "كس ام", "كسخت", "منيكه", "منيكة",
  "قحبه", "قحبة", "دعاره", "دعارة", "ابن الوسخه", "ابن الكلب",
  "عاهر", "عاهرة", "تناك", "ينيك", "اباحي", "اباحيه", "اباحية",
  "زبي", "طيزي", "كسك", "طياز", "لوطي", "مخنث", "ابن الشرموطه", "كسمك"
];

/**
 * Normalizes Arabic text:
 * - Strips tashkeel (diacritics)
 * - Strips tatweel (kashida)
 * - Normalizes alef forms (أ, إ, آ, ٱ -> ا)
 * - Normalizes taa marbouta (ة -> ه)
 * - Normalizes alef maqsura (ى -> ي)
 * - Collapses repeated characters (e.g. شرمووووط -> شرموط)
 */
export function normalizeArabic(text: string): string {
  if (!text) return "";
  let clean = text
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[\u200B-\u200D\uFEFF]/g, "");

  clean = clean.replace(/(.)\1{2,}/g, "$1");
  return clean.trim();
}

/**
 * Normalizes English text:
 * - Lowercase
 * - Common leetspeak substitutions (e.g. 1 / ! -> i, 0 -> o, $ / 5 -> s, @ -> a)
 * - Strips separators inside words
 * - Collapses duplicate letters
 */
export function normalizeEnglish(text: string): string {
  if (!text) return "";
  let clean = text.toLowerCase()
    .replace(/[@]/g, "a")
    .replace(/[$5]/g, "s")
    .replace(/[0]/g, "o")
    .replace(/[1!|]/g, "i")
    .replace(/[3]/g, "e")
    .replace(/[+]/g, "t")
    .replace(/[\u200B-\u200D\uFEFF]/g, "");

  const collapsedPunctuation = clean.replace(/[^a-z0-9]/g, "");
  const collapsedRepeats = clean.replace(/(.)\1{2,}/g, "$1");

  return `${clean} ${collapsedPunctuation} ${collapsedRepeats}`;
}

export interface NameValidationResult {
  valid: boolean;
  error?: string;
  errorAr?: string;
}

/**
 * Validates whether a public display name is acceptable.
 */
export function validateDisplayName(rawName: unknown): NameValidationResult {
  if (typeof rawName !== "string") {
    return {
      valid: false,
      error: "Name must be a valid text string.",
      errorAr: "يجب أن يكون الاسم نصاً صحيحاً.",
    };
  }

  const trimmed = rawName.trim();

  // Length checks
  if (trimmed.length < 3) {
    return {
      valid: false,
      error: "Display name must be at least 3 characters long.",
      errorAr: "يجب أن يتكون اسم العرض من 3 أحرف على الأقل.",
    };
  }

  if (trimmed.length > 24) {
    return {
      valid: false,
      error: "Display name cannot exceed 24 characters.",
      errorAr: "لا يمكن أن يتجاوز اسم العرض 24 حرفاً.",
    };
  }

  // Reject email addresses or domains
  if (/@/.test(trimmed) || /\.(com|org|net|edu|eg|gov|io|app)/i.test(trimmed)) {
    return {
      valid: false,
      error: "Display name alias cannot contain email addresses or websites.",
      errorAr: "لا يمكن أن يحتوي اسم العرض على بريد إلكتروني أو مواقع إنترنت.",
    };
  }

  // Reject URLs or phone numbers
  if (/(https?:\/\/|www\.)/i.test(trimmed) || /\+?\d{8,}/.test(trimmed.replace(/\s+/g, ""))) {
    return {
      valid: false,
      error: "Display name alias cannot contain links or phone numbers.",
      errorAr: "لا يمكن أن يحتوي اسم العرض على روابط أو أرقام هواتف.",
    };
  }

  // 1. Check profanity on normalized representations FIRST (before strict char regex, to catch leetspeak profanities)
  const normalizedAr = normalizeArabic(trimmed);
  const normalizedEn = normalizeEnglish(trimmed);

  // Check Arabic boundary-only terms (e.g. مص, زب, خول)
  for (const term of ARABIC_BOUNDARY_TERMS) {
    const normTerm = normalizeArabic(term);
    const regex = new RegExp(`(^|\\s|_|[0-9])${normTerm}($|\\s|_|[0-9])`, "i");
    if (regex.test(normalizedAr)) {
      return {
        valid: false,
        error: "Please choose an appropriate academic display name.",
        errorAr: "الرجاء اختيار اسم ملائم للمنصة التعليمية الأكاديمية.",
      };
    }
  }

  // Check Arabic root terms (longer forms like شرموط, متناك)
  for (const term of ARABIC_ROOT_TERMS) {
    const normTerm = normalizeArabic(term);
    if (normalizedAr.includes(normTerm)) {
      return {
        valid: false,
        error: "Please choose an appropriate academic display name.",
        errorAr: "الرجاء اختيار اسم ملائم للمنصة التعليمية الأكاديمية.",
      };
    }
  }

  // Check English blocked terms
  const tokens = normalizedEn.split(/\s+/);
  for (const term of ENGLISH_BLOCKED_TERMS) {
    const termRegex = new RegExp(`\\b${term}\\b`, "i");
    if (termRegex.test(normalizedEn)) {
      return {
        valid: false,
        error: "Please choose an appropriate academic display name.",
        errorAr: "الرجاء اختيار اسم ملائم للمنصة التعليمية الأكاديمية.",
      };
    }
    for (const token of tokens) {
      if (token === term || (term.length >= 4 && token.includes(term))) {
        return {
          valid: false,
          error: "Please choose an appropriate academic display name.",
          errorAr: "الرجاء اختيار اسم ملائم للمنصة التعليمية الأكاديمية.",
        };
      }
    }
  }

  // 2. Enforce allowed characters: Unicode letters, digits, spaces, dots (for Dr. or initials), apostrophes, hyphens, underscores
  const validCharRegex = /^[\p{L}\p{N} ._'-]+$/u;
  if (!validCharRegex.test(trimmed)) {
    return {
      valid: false,
      error: "Name can only contain letters, numbers, spaces, periods, hyphens, and apostrophes.",
      errorAr: "يجب أن يحتوي الاسم على أحرف، أرقام، مسافات، نقاط، أو شرطات فقط.",
    };
  }

  return { valid: true };
}

/**
 * Returns whether the name is allowed (boolean shorthand for server/client checks).
 */
export function isNameAllowed(name: string): { allowed: boolean; reason?: string } {
  const result = validateDisplayName(name);
  return {
    allowed: result.valid,
    reason: result.error,
  };
}

/**
 * Sanitizes a display name by removing non-standard control chars and collapsing whitespace.
 */
export function sanitizeDisplayName(name: string): string {
  if (typeof name !== "string") return "Student";
  return name
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
