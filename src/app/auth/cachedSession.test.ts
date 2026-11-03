import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getCachedSession,
  setCachedSession,
  clearCachedSession,
  isOptimisticallyAuthenticated,
  CACHED_SESSION_KEY,
} from './cachedSession';

describe('cachedSession', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns null and false when no session is cached', () => {
    expect(getCachedSession()).toBeNull();
    expect(isOptimisticallyAuthenticated()).toBe(false);
  });

  it('saves and synchronously retrieves a cached session', () => {
    const session = {
      userId: 'user_12345',
      fullName: 'Omar Hossa',
      firstName: 'Omar',
      email: 'omar@example.com',
      imageUrl: 'https://example.com/avatar.jpg',
    };

    setCachedSession(session);

    expect(isOptimisticallyAuthenticated()).toBe(true);
    const retrieved = getCachedSession();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.userId).toBe('user_12345');
    expect(retrieved?.fullName).toBe('Omar Hossa');
    expect(retrieved?.email).toBe('omar@example.com');
    expect(typeof retrieved?.lastActive).toBe('number');
  });

  it('clears cached session cleanly on sign out', () => {
    setCachedSession({ userId: 'user_999', firstName: 'Alice' });
    expect(isOptimisticallyAuthenticated()).toBe(true);

    clearCachedSession();
    expect(isOptimisticallyAuthenticated()).toBe(false);
    expect(getCachedSession()).toBeNull();
    expect(localStorage.getItem(CACHED_SESSION_KEY)).toBeNull();
  });

  it('safely handles corrupted or invalid JSON in storage', () => {
    localStorage.setItem(CACHED_SESSION_KEY, 'invalid-json{{{');
    expect(getCachedSession()).toBeNull();
    expect(isOptimisticallyAuthenticated()).toBe(false);

    localStorage.setItem(CACHED_SESSION_KEY, JSON.stringify({ notAUserId: 123 }));
    expect(getCachedSession()).toBeNull();
    expect(isOptimisticallyAuthenticated()).toBe(false);
  });
});
