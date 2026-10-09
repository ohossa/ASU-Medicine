/** Immutable attempts from different devices are unioned by ID, newest first. */
export function mergeHistory(...values: unknown[]): unknown[] {
  const byId = new Map<string, Record<string, unknown>>();
  for (const value of values) {
    const rows = typeof value === 'string' ? JSON.parse(value) : value;
    if (!Array.isArray(rows)) continue;
    for (const row of rows) {
      if (!row || typeof row !== 'object' || typeof row.id !== 'string' || typeof row.pct !== 'number') continue;
      if (!byId.has(row.id)) byId.set(row.id, row);
    }
  }
  return [...byId.values()].sort((a,b)=>(Date.parse(String(b.date))||0)-(Date.parse(String(a.date))||0)).slice(0,50);
}
/** Saved sessions and preferences never regress to an older device timestamp. */
export function newerValue(current: unknown, incoming: unknown): unknown {
  const time=(v:unknown)=>v&&typeof v==='object'&&'timestamp' in v&&typeof v.timestamp==='number'?v.timestamp:0;
  return time(current)>time(incoming)?current:incoming;
}
export const SYNC_CAS_LUA = `
local old = redis.call('GET', KEYS[1])
if (old or '') ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[1], ARGV[2])
return 1
`;
