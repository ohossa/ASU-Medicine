/**
 * server/security-logger.ts — Centralized Security Event Audit Logger
 *
 * Tracks and logs security-relevant occurrences:
 *  - Authentication failures (401)
 *  - Authorization / Admin route access denials (403)
 *  - Rate limit violations (429)
 *  - Malformed or oversized payload strikes (400, 413)
 *
 * Maintains an in-memory ring buffer for recent security events and
 * emits structured telemetry without blocking runtime requests.
 */

export interface SecurityEvent {
  timestamp: string;
  type: 'auth_failure' | 'forbidden_admin' | 'rate_limit_exceeded' | 'payload_too_large' | 'malformed_input';
  endpoint: string;
  userId?: string;
  ip?: string;
  details?: string;
}

const MAX_AUDIT_LOGS = 500;
const auditRingBuffer: SecurityEvent[] = [];

export function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
  const record: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  auditRingBuffer.push(record);
  if (auditRingBuffer.length > MAX_AUDIT_LOGS) {
    auditRingBuffer.shift();
  }

  // Structured console warning for real-time observability in Vercel / server logs
  if (process.env.NODE_ENV !== 'test') {
    console.warn(`[SECURITY_ALERT] [${record.type}] endpoint=${record.endpoint} user=${record.userId || 'anon'} details=${record.details || ''}`);
  }
}

export function getRecentSecurityEvents(limit = 50): SecurityEvent[] {
  return auditRingBuffer.slice(-limit).reverse();
}

export function clearSecurityLogsForTesting(): void {
  auditRingBuffer.length = 0;
}
