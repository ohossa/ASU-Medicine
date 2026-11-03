export const CACHED_SESSION_KEY = 'asu:cached-auth';

export interface CachedSession {
  userId: string;
  fullName?: string | null;
  firstName?: string | null;
  username?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  lastActive: number;
}

/**
 * Returns the cached session snapshot stored synchronously in localStorage.
 * Used for instant, zero-latency first-paint authentication.
 */
export function getCachedSession(): CachedSession | null {
  try {
    const raw = localStorage.getItem(CACHED_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.userId === 'string' && parsed.userId.length > 0) {
      return parsed as CachedSession;
    }
  } catch {
    // Storage may be disabled or JSON malformed
  }
  return null;
}

/**
 * Updates the client's local session snapshot when authenticated.
 */
export function setCachedSession(
  session: Omit<CachedSession, 'lastActive'> & { lastActive?: number }
): void {
  try {
    const payload: CachedSession = {
      ...session,
      lastActive: session.lastActive ?? Date.now(),
    };
    localStorage.setItem(CACHED_SESSION_KEY, JSON.stringify(payload));
  } catch {
    // Storage quota or private mode restriction
  }
}

/**
 * Clears the local session snapshot upon explicit sign out or session revocation.
 */
export function clearCachedSession(): void {
  try {
    localStorage.removeItem(CACHED_SESSION_KEY);
  } catch {
    // Storage may be disabled
  }
}

/**
 * Determines whether we have a local cached session to optimistically render
 * the authenticated application shell without waiting for network authentication handshakes.
 */
export function isOptimisticallyAuthenticated(): boolean {
  return getCachedSession() !== null;
}
