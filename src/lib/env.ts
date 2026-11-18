import "server-only"

import { z } from "zod"

/**
 * Server-side environment variables, validated with zod.
 *
 * Validation runs on first access (not at import time) so `next build` can run
 * in CI without secrets, while any request that touches a missing variable
 * fails immediately with a readable error instead of a cryptic driver error.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required")
    .refine((v) => v.startsWith("mongodb://") || v.startsWith("mongodb+srv://"), {
      message: "MONGODB_URI must start with mongodb:// or mongodb+srv://",
    }),
  MONGODB_DB_NAME: z.string().min(1, "MONGODB_DB_NAME is required"),
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.url().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  // Optional: without these, uploaded images are stored in MongoDB instead.
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
})

export type ServerEnv = z.infer<typeof serverSchema>

let cached: ServerEnv | undefined

/** Empty strings in .env files mean "unset". */
function readProcessEnv() {
  return Object.fromEntries(
    Object.entries(process.env).map(([k, v]) => [k, v === "" ? undefined : v])
  )
}

export function getEnv(): ServerEnv {
  if (cached) return cached
  const parsed = serverSchema.safeParse(readProcessEnv())
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n")
    throw new Error(`Invalid environment variables:\n${issues}\nSee .env.example.`)
  }
  cached = parsed.data
  return cached
}

const perKey = new Map<string, unknown>()

/**
 * Lazily validated env object. Each read validates only that variable, so a
 * feature works as soon as its own variables are set (e.g. the database runs
 * locally before Cloudinary keys exist). Use `getEnv()` to check everything.
 */
export const env = new Proxy({} as ServerEnv, {
  get(_, key: string) {
    if (perKey.has(key)) return perKey.get(key)
    const field = serverSchema.shape[key as keyof ServerEnv]
    if (!field) return undefined
    const parsed = field.safeParse(readProcessEnv()[key])
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "is invalid"
      throw new Error(`Invalid environment variable ${key}: ${message}. See .env.example.`)
    }
    perKey.set(key, parsed.data)
    return parsed.data
  },
})

export const isGoogleAuthEnabled = () =>
  Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)

/**
 * Where uploaded images go. Cloudinary once its three server keys are set,
 * otherwise MongoDB (GridFS). Switching needs no code change.
 */
export const isCloudinaryEnabled = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  )
