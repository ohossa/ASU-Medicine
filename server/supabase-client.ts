/**
 * server/supabase-client.ts
 * 
 * Legacy Supabase Client (Decommissioned).
 * The ASU Medical Portal has fully migrated to Cloudflare D1 (Serverless Relational SQL)
 * and Cloudflare R2 (Zero-Egress Object Storage).
 * 
 * This stub provides backward compatibility for test mocks and legacy fallbacks.
 */

export interface LegacySupabaseClient {
  from: (table: string) => any;
}

export function getSupabase(): LegacySupabaseClient | null {
  return null;
}
