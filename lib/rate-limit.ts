import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Simple in-memory fallback for local development
const memoryCache = new Map<string, { count: number; expiresAt: number }>()

export const ratelimit = {
  limit: async (key: string) => {
    // Check if Upstash is configured properly
    const hasUpstash =
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_URL !== "https://eu1-golden-horse-12345.upstash.io" &&
      process.env.UPSTASH_REDIS_REST_TOKEN &&
      process.env.UPSTASH_REDIS_REST_TOKEN !== "token_12345"

    if (hasUpstash) {
      try {
        const realRatelimit = new Ratelimit({
          redis: Redis.fromEnv(),
          limiter: Ratelimit.slidingWindow(5, "10 m"),
          analytics: true,
        })
        return await realRatelimit.limit(key)
      } catch (e) {
        console.warn("Upstash Redis error, falling back to in-memory ratelimit:", e)
      }
    }

    // In-memory fallback (allows 5 requests per 10 minutes)
    const limitCount = 5
    const windowMs = 10 * 60 * 1000 // 10 minutes
    const now = Date.now()

    const record = memoryCache.get(key)
    if (!record || now > record.expiresAt) {
      const expiresAt = now + windowMs
      memoryCache.set(key, { count: 1, expiresAt })
      return {
        success: true,
        limit: limitCount,
        remaining: limitCount - 1,
        reset: expiresAt,
      }
    }

    if (record.count >= limitCount) {
      return {
        success: false,
        limit: limitCount,
        remaining: 0,
        reset: record.expiresAt,
      }
    }

    record.count += 1
    memoryCache.set(key, record)
    return {
      success: true,
      limit: limitCount,
      remaining: limitCount - record.count,
      reset: record.expiresAt,
    }
  }
}
