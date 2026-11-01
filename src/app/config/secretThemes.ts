/**
 * Secret Themes Configuration
 * Controls access to exclusive bespoke themes (e.g., Starlight Cosmic Velvet).
 */

export const STARLIGHT_AUTHORIZED_EMAILS: readonly string[] = [
  "sarahrateb@gmail.com",
  "omarhmaged@gmail.com",
];

export const STARLIGHT_STORAGE_KEY = "asu_theme_starlight";

/**
 * Checks if a given raw email string is authorized for the Starlight theme.
 */
export function isStarlightEligible(email?: string | null): boolean {
  if (!email || typeof email !== "string") return false;
  const normalized = email.trim().toLowerCase();
  return STARLIGHT_AUTHORIZED_EMAILS.some(
    (authorized) => authorized.toLowerCase() === normalized,
  );
}

/**
 * Checks if a Clerk user object possesses any authorized email address.
 */
export function isUserStarlightEligible(
  user:
    | {
        primaryEmailAddress?: { emailAddress?: string | null } | null;
        emailAddresses?: Array<{ emailAddress?: string | null }>;
      }
    | null
    | undefined,
): boolean {
  if (!user) return false;
  if (isStarlightEligible(user.primaryEmailAddress?.emailAddress)) return true;
  if (Array.isArray(user.emailAddresses)) {
    return user.emailAddresses.some((addr) =>
      isStarlightEligible(addr.emailAddress),
    );
  }
  return false;
}
