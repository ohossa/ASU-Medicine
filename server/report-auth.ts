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
  let user: import("@clerk/backend").User | null = null;
  try {
    user = await createClerkClient({ secretKey }).users.getUser(claims.sub);
  } catch (err) {
    console.warn("Clerk getUser lookup failed; using verified claims identity:", err);
  }
  const emailList = user?.emailAddresses || [];
  const primaryEmail =
    emailList.find((e) => e.id === user?.primaryEmailAddressId) ??
    emailList.find((e) => e.verification?.status === "verified") ??
    emailList[0];
  const name = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
    : (claims as any)?.name || null;
  const pinnedId = process.env.REPORT_ADMIN_USER_ID;
  const ownsEmail =
    emailList.some(
      (e) =>
        e.emailAddress.toLowerCase() === OWNER_EMAIL &&
        e.verification?.status === "verified",
    ) || ((claims as any)?.email?.toLowerCase() === OWNER_EMAIL);
  return {
    id: user?.id || claims.sub,
    reporter: {
      name: name || null,
      username: user?.username || (claims as any)?.username || null,
      email: primaryEmail?.emailAddress || (claims as any)?.email || null,
      emailVerified: primaryEmail?.verification?.status === "verified" || Boolean((claims as any)?.email),
    },
    isAdmin:
      ownsEmail &&
      (!pinnedId || pinnedId === (user?.id || claims.sub)) &&
      (process.env.VERCEL_ENV !== "production" || Boolean(pinnedId)),
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
