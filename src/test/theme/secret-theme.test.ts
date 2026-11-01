import { describe, it, expect } from 'vitest';
import {
  isStarlightEligible,
  isUserStarlightEligible,
  STARLIGHT_AUTHORIZED_EMAILS,
} from '../../app/config/secretThemes';

describe('Secret Themes Access Control', () => {
  it('authorizes exact match emails in allowlist', () => {
    expect(STARLIGHT_AUTHORIZED_EMAILS).toContain('sarahrateb@gmail.com');
    expect(STARLIGHT_AUTHORIZED_EMAILS).toContain('omarhmaged@gmail.com');
    expect(isStarlightEligible('sarahrateb@gmail.com')).toBe(true);
    expect(isStarlightEligible('omarhmaged@gmail.com')).toBe(true);
  });

  it('normalizes whitespace and casing before checking', () => {
    expect(isStarlightEligible('  SarahRateb@Gmail.Com ')).toBe(true);
    expect(isStarlightEligible('OmarHMaged@GMAIL.COM')).toBe(true);
  });

  it('strictly rejects non-allowlisted emails', () => {
    expect(isStarlightEligible('other.student@gmail.com')).toBe(false);
    expect(isStarlightEligible('')).toBe(false);
    expect(isStarlightEligible(null)).toBe(false);
    expect(isStarlightEligible(undefined)).toBe(false);
    expect(isStarlightEligible('sarahrateb@yahoo.com')).toBe(false);
  });

  it('validates Clerk user object with primaryEmailAddress', () => {
    const user = {
      primaryEmailAddress: { emailAddress: 'sarahrateb@gmail.com' },
      emailAddresses: [{ emailAddress: 'sarahrateb@gmail.com' }],
    };
    expect(isUserStarlightEligible(user)).toBe(true);
  });

  it('validates Clerk user object with secondary email addresses', () => {
    const user = {
      primaryEmailAddress: { emailAddress: 'personal@asu.edu.eg' },
      emailAddresses: [
        { emailAddress: 'personal@asu.edu.eg' },
        { emailAddress: 'omarhmaged@gmail.com' },
      ],
    };
    expect(isUserStarlightEligible(user)).toBe(true);
  });

  it('rejects unauthorized Clerk user objects', () => {
    const user = {
      primaryEmailAddress: { emailAddress: 'stranger@example.com' },
      emailAddresses: [{ emailAddress: 'stranger@example.com' }],
    };
    expect(isUserStarlightEligible(user)).toBe(false);
    expect(isUserStarlightEligible(null)).toBe(false);
    expect(isUserStarlightEligible(undefined)).toBe(false);
  });
});
