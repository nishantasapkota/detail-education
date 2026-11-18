import "server-only"

/**
 * Rate limiting placeholder.
 *
 * In-memory counters do NOT work on serverless: every function instance has
 * its own memory and instances come and go, so a Map-based limiter would let
 * attackers through while giving a false sense of safety. That's why nothing
 * is implemented here.
 *
 * To enable real limiting on the free tier, use Upstash Redis (free plan) via
 * the Vercel Marketplace:
 *
 *   pnpm add @upstash/ratelimit @upstash/redis
 *
 *   import { Ratelimit } from "@upstash/ratelimit"
 *   import { Redis } from "@upstash/redis"
 *
 *   const ratelimit = new Ratelimit({
 *     redis: Redis.fromEnv(),               // UPSTASH_REDIS_REST_URL / _TOKEN
 *     limiter: Ratelimit.slidingWindow(10, "60 s"),
 *   })
 *
 *   const { success } = await ratelimit.limit(key)
 *   if (!success) throw new AppError("RATE_LIMITED", "Too many requests")
 *
 * Then replace the body of `assertRateLimit` below. Good places to call it:
 * login/register, /api/upload/sign, and write endpoints.
 */
export async function assertRateLimit(_key: string): Promise<void> {
  // Intentionally a no-op until Upstash is configured. See comment above.
}
