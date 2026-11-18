import "server-only"

import mongoose from "mongoose"

import { env } from "@/lib/env"

/**
 * Cached Mongoose connection for serverless.
 *
 * Each Vercel function instance keeps its module scope between invocations
 * (Fluid Compute reuses instances), so we keep one connection promise on
 * `globalThis`. That also survives hot reloads in `next dev`, which would
 * otherwise open a new connection on every file save.
 */
type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalForMongoose = globalThis as typeof globalThis & {
  __mongoose?: MongooseCache
}

const cache: MongooseCache = (globalForMongoose.__mongoose ??= {
  conn: null,
  promise: null,
})

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn

  if (!cache.promise) {
    cache.promise = mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
      // Fail fast instead of queueing queries while disconnected — a hung
      // query would burn the whole serverless time budget.
      bufferCommands: false,
      serverSelectionTimeoutMS: 5_000,
      // Small pool: each function instance handles few concurrent requests.
      maxPoolSize: 10,
    })
  }

  try {
    cache.conn = await cache.promise
  } catch (error) {
    // Reset so the next invocation retries instead of reusing a rejected promise.
    cache.promise = null
    throw error
  }

  return cache.conn
}

/** Round-trips to the server. Used by /api/health. */
export async function pingDB(): Promise<number> {
  const started = Date.now()
  const conn = await connectDB()
  await conn.connection.db?.admin().ping()
  return Date.now() - started
}
