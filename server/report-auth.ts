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
  const pinnedId = process.env.REPORT_ADMIN_USER_ID;
  return {
    id: user.id,
    isAdmin: ownsEmail && (!pinnedId || pinnedId === user.id) && (process.env.VERCEL_ENV !== 'production' || Boolean(pinnedId)),
  };
}
