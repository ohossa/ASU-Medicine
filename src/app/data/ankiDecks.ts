import { SYLLABUS_MODULES } from "../data";
import type { ModuleInfo } from "../data";

export interface AnkiDeck {
  id: string;
  moduleCode: string;
  title: string;
  part?: string | number;
  description: string;
  cardCount?: number;
  fileSize?: string;
  downloadUrl?: string;
  provider?: "github" | "gdrive" | "direct";
  isAvailable: boolean;
}

export interface ModuleDeckGroup {
  module: ModuleInfo;
  year: number;
  semester: number;
  decks: AnkiDeck[];
}

/**
 * Converts Google Drive share links, GitHub blob links, or direct URLs
 * into 1-tap instant download links for mobile and desktop clients.
 */
export function resolveDirectDownloadUrl(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";

  // 1. Google Drive Share Link conversion
  // Matches: https://drive.google.com/file/d/<FILE_ID>/view... or ?id=<FILE_ID>
  const gdriveFileMatch = trimmed.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
  );
  if (gdriveFileMatch && gdriveFileMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${gdriveFileMatch[1]}`;
  }

  const gdriveIdMatch = trimmed.match(
    /drive\.google\.com\/(?:open|uc)\?.*id=([a-zA-Z0-9_-]+)/,
  );
  if (gdriveIdMatch && gdriveIdMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${gdriveIdMatch[1]}`;
  }

  // 2. GitHub Blob link conversion to raw CDN
  // Matches: https://github.com/<owner>/<repo>/blob/<branch>/<path>
  const githubBlobMatch = trimmed.match(
    /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/,
  );
  if (githubBlobMatch) {
    const [, owner, repo, branch, path] = githubBlobMatch;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  }

  // 3. GitHub Releases or standard direct URLs are already 1-tap direct downloads
  return trimmed;
}

/**
 * Official LURO Anki WhatsApp Community Group link.
 * Can be updated with your direct WhatsApp group invite link (e.g. https://chat.whatsapp.com/...).
 */
export const ANKI_WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/invite";

/**
 * Returns the effective Anki community URL.
 * If a custom group link has been configured, opens that link;
 * otherwise directs to Omar's WhatsApp with a prefilled community request.
 */
export function getAnkiCommunityUrl(): string {
  if (
    ANKI_WHATSAPP_GROUP_URL &&
    ANKI_WHATSAPP_GROUP_URL !== "https://chat.whatsapp.com/invite"
  ) {
    return ANKI_WHATSAPP_GROUP_URL;
  }
  return (
    "https://wa.me/201040479155?text=" +
    encodeURIComponent(
      "Hi Omar, I'd like to join the LURO / ASU Anki WhatsApp community!",
    )
  );
}

/**
 * Canonical registry of Anki decks for Ain Shams University Medical Portal.
 * You can paste either a GitHub Release URL or a Google Drive share link into downloadUrl.
 */
export const ANKI_DECKS_REGISTRY: Record<string, AnkiDeck[]> = {
  // Year 3, Semester 1: GIT & Liver Module (MGL-3)
  "MGL-3": [
    {
      id: "mgl3-part-1",
      moduleCode: "MGL-3",
      title: "GIT & Liver — Part 1",
      part: 1,
      description:
        "Upper GIT, Esophagus, Stomach, Duodenum & Peritoneal Cavity. Every card includes textbook page references.",
      cardCount: 620,
      fileSize: "28 MB",
      downloadUrl:
        "https://github.com/omarhossa/ASU-Medical-Portal/releases/download/v1.0.0-anki/GIT_Part_1.apkg",
      provider: "github",
      isAvailable: true,
    },
    {
      id: "mgl3-part-2",
      moduleCode: "MGL-3",
      title: "GIT & Liver — Part 2",
      part: 2,
      description:
        "Small & Large Intestine, Hepatobiliary System, Pancreas & Clinical Pathology. Loaded with high-yield lecture figures.",
      cardCount: 740,
      fileSize: "34 MB",
      downloadUrl:
        "https://github.com/omarhossa/ASU-Medical-Portal/releases/download/v1.0.0-anki/GIT_Part_2.apkg",
      provider: "github",
      isAvailable: true,
    },
  ],
};

/**
 * Returns all module deck groups for a given academic year and semester.
 */
export function getModuleDeckGroups(
  year: number,
  semester: number,
): ModuleDeckGroup[] {
  const semesterModules = SYLLABUS_MODULES[year]?.[semester] || [];

  return semesterModules.map((mod) => {
    const decks = ANKI_DECKS_REGISTRY[mod.code] || [
      {
        id: `${mod.code.toLowerCase()}-deck-pending`,
        moduleCode: mod.code,
        title: `${mod.name} Flashcards`,
        description:
          "High-yield spaced repetition cards in preparation with textbook page citations.",
        isAvailable: false,
      },
    ];

    return {
      module: mod,
      year,
      semester,
      decks,
    };
  });
}

/**
 * Get total count of available Anki decks across the entire portal.
 */
export function getTotalAvailableDecksCount(): number {
  return Object.values(ANKI_DECKS_REGISTRY).reduce(
    (acc, decks) => acc + decks.filter((d) => d.isAvailable).length,
    0,
  );
}
