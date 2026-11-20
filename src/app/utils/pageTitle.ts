/**
 * A-Plus Dynamic Browser Tab Title & Canonical Meta Manager
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

function ensureMetaTag(selector: string, attrName: string, attrVal: string, contentVal: string): void {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute("content", contentVal);
}

export function updatePageHead({
  pageName,
  pathname,
  description,
}: {
  pageName?: string | null;
  pathname?: string;
  description?: string;
}): void {
  if (typeof document === "undefined") return;

  // 1. Update Title
  const formattedTitle = formatPageTitle(pageName);
  document.title = formattedTitle;

  // 2. Update Canonical URL & Social Meta URLs
  if (pathname !== undefined) {
    const cleanPath = pathname === "/" || pathname === "" ? "/" : pathname.replace(/\/+$/, "");
    const canonicalUrl = `https://asu.codes${cleanPath}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // Sync OpenGraph and Twitter URLs
    ensureMetaTag('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    ensureMetaTag('meta[name="twitter:url"]', "name", "twitter:url", canonicalUrl);
    ensureMetaTag('meta[property="og:title"]', "property", "og:title", formattedTitle);
    ensureMetaTag('meta[name="twitter:title"]', "name", "twitter:title", formattedTitle);
  }

  // 3. Update Meta Description
  if (description) {
    ensureMetaTag('meta[name="description"]', "name", "description", description);
    ensureMetaTag('meta[property="og:description"]', "property", "og:description", description);
    ensureMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
  }
}

export function updateDocumentTitle(pageName?: string | null): void {
  updatePageHead({ pageName });
}
