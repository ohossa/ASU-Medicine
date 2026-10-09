import { createClerkClient, verifyToken } from "@clerk/backend";
import { ReportError, type Identity } from "./report-service.js";
export const OWNER_EMAIL = "omarhmaged@gmail.com";
export async function authenticateReportUser(token: string): Promise<Identity> {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey)
    throw new ReportError(
      503,
      "Reporting is being configured. Please try again later.",
    );
  if (!token) throw new ReportError(401, "Please sign in to continue.");
  let claims;
  try {
    claims = await verifyToken(token, {
      secretKey,
      authorizedParties: (
        process.env.REPORT_ALLOWED_ORIGINS ||
        "https://asu.codes,https://www.asu.codes"
      )
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  } catch {
    throw new ReportError(
      401,
      "Your session has expired. Please sign in again.",
    );
  }
  if (!claims.sub) throw new ReportError(401, "Please sign in to continue.");
  const user = await createClerkClient({ secretKey }).users.getUser(claims.sub);
  const ownsEmail = user.emailAddresses.some(
    (e) =>
      e.emailAddress.toLowerCase() === OWNER_EMAIL &&
      e.verification?.status === "verified",
  );
  const primaryEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)
    ?? user.emailAddresses.find(e => e.verification?.status === 'verified')
    ?? user.emailAddresses[0];
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  const pinnedId = process.env.REPORT_ADMIN_USER_ID;
  return {
    id: user.id,
    reporter: {
      name: name || null,
      username: user.username || null,
      email: primaryEmail?.emailAddress || null,
      emailVerified: primaryEmail?.verification?.status === 'verified',
    },
    isAdmin: ownsEmail && (!pinnedId || pinnedId === user.id) && (process.env.VERCEL_ENV !== 'production' || Boolean(pinnedId)),
  };
}

// Resolve the current account on the server, including reports submitted before profile capture existed.
export async function verifiedReporterEmail(userId: string): Promise<string> {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) throw new ReportError(503, 'Reporter email lookup is unavailable.');
  try {
    const user = await createClerkClient({secretKey}).users.getUser(userId);
    const verified = user.emailAddresses.filter(e => e.verification?.status === 'verified');
    return (verified.find(e => e.id === user.primaryEmailAddressId) || verified[0])?.emailAddress || '';
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) return '';
    throw new ReportError(503, 'The student email could not be checked. Please try again.');
  }
}
