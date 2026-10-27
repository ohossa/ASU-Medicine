import { evalRedis } from "./report-store.js";

const HEARTBEAT_ZSET = "asu_presence:v1:heartbeat";
const USER_META_PREFIX = "asu_presence:v1:user:";
const ONLINE_WINDOW_SECONDS = 300; // 5 minutes

export interface PresencePayload {
  userId: string;
  alias?: string;
  moduleCode?: string;
}

export interface OnlineUserSummary {
  userId: string;
  alias?: string;
  moduleCode?: string;
  lastSeenSecondsAgo: number;
}

export const HEARTBEAT_LUA = `
local zset = KEYS[1]
local metaKey = KEYS[2]
local now = tonumber(ARGV[1])
local userId = ARGV[2]
local metaJson = ARGV[3]
local cutoff = now - tonumber(ARGV[4])

-- Record heartbeat timestamp for user
redis.call('ZADD', zset, now, userId)

-- Store metadata with 10-minute expiry
redis.call('SETEX', metaKey, 600, metaJson)

-- Prune entries older than 2 hours to keep zset compact
redis.call('ZREMRANGEBYSCORE', zset, '-inf', now - 7200)

-- Count active users in window
local count = redis.call('ZCOUNT', zset, cutoff, '+inf')
return count
`;

export async function recordPresence(payload: PresencePayload): Promise<number> {
  const now = Math.floor(Date.now() / 1000);
  const userId = payload.userId || "anonymous";
  const metaJson = JSON.stringify({
    alias: payload.alias || "Student",
    moduleCode: payload.moduleCode || "",
    updatedAt: new Date().toISOString(),
  });

  try {
    const res = await evalRedis(
      HEARTBEAT_LUA,
      [HEARTBEAT_ZSET, `${USER_META_PREFIX}${userId}`],
      [String(now), userId, metaJson, String(ONLINE_WINDOW_SECONDS)]
    );
    return typeof res === "number" ? res : 1;
  } catch {
    // If Redis is not configured in local environment, return 1
    return 1;
  }
}

export async function getOnlineUsers(): Promise<{
  onlineCount: number;
  onlineUserIds: string[];
  users: OnlineUserSummary[];
}> {
  const now = Math.floor(Date.now() / 1000);
  const cutoff = now - ONLINE_WINDOW_SECONDS;

  try {
    const rawIds = await evalRedis(
      "return redis.call('ZREVRANGEBYSCORE', KEYS[1], '+inf', ARGV[1], 'WITHSCORES')",
      [HEARTBEAT_ZSET],
      [String(cutoff)]
    );

    const onlineUserIds: string[] = [];
    const users: OnlineUserSummary[] = [];

    if (Array.isArray(rawIds)) {
      for (let i = 0; i < rawIds.length; i += 2) {
        const uid = String(rawIds[i]);
        const score = Number(rawIds[i + 1]);
        onlineUserIds.push(uid);

        let meta: any = null;
        try {
          const metaRaw = await evalRedis("return redis.call('GET', KEYS[1])", [`${USER_META_PREFIX}${uid}`]);
          if (metaRaw) meta = JSON.parse(String(metaRaw));
        } catch {
          // ignore
        }

        users.push({
          userId: uid,
          alias: meta?.alias,
          moduleCode: meta?.moduleCode,
          lastSeenSecondsAgo: Math.max(0, now - score),
        });
      }
    }

    return {
      onlineCount: onlineUserIds.length,
      onlineUserIds,
      users,
    };
  } catch {
    return {
      onlineCount: 0,
      onlineUserIds: [],
      users: [],
    };
  }
}
