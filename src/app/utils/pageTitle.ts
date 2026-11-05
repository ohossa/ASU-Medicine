/**
 * A-Plus Dynamic Browser Tab Title Manager
 * Standard format: "[Page Name] · A-Plus"
 * Root / default: "A-Plus · Medical Portal"
 */

export const BASE_BRAND = "A-Plus";
export const DEFAULT_FULL_TITLE = "A-Plus · Medical Portal";

export function formatPageTitle(pageName?: string | null): string {
  if (!pageName || !pageName.trim() || pageName.trim().toLowerCase() === "home") {
    return DEFAULT_FULL_TITLE;
  }
  return `${pageName.trim()} · ${BASE_BRAND}`;
}

export function updateDocumentTitle(pageName?: string | null): void {
  if (typeof document === "undefined") return;
  document.title = formatPageTitle(pageName);
}
