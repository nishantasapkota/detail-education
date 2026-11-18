import "server-only"

import { AppError } from "@/lib/api/errors"
import type { SingletonDef } from "@/lib/cms/types"
import { connectDB } from "@/lib/db/mongoose"
import { BUSINESS_DEFAULTS, HOME_DEFAULTS, PRIVACY_DEFAULTS, TERMS_DEFAULTS } from "@/data/site-content"

/**
 * Single editable documents (page copy, business details), stored in the
 * `site_content` collection under their key. Reads always merge over the
 * bundled defaults, so a new field never shows up empty.
 */

export const SINGLETON_DEFAULTS: Record<string, Record<string, unknown>> = {
  home: HOME_DEFAULTS,
  business: BUSINESS_DEFAULTS,
  privacy: PRIVACY_DEFAULTS,
  terms: TERMS_DEFAULTS,
}

type Stored = { values: Record<string, unknown>; updatedAt: string | null; updatedByName: string | null }

async function col() {
  return (await connectDB()).connection.collection<{ _id: string } & Record<string, unknown>>("site_content")
}

export async function readSingleton(def: SingletonDef): Promise<Stored> {
  const defaults = SINGLETON_DEFAULTS[def.key] ?? {}
  const doc = await (await col()).findOne({ _id: def.key })
  const merged = { ...defaults, ...(doc?.values as Record<string, unknown> | undefined) }
  const parsed = def.schema.safeParse(merged)
  return {
    values: parsed.success ? (parsed.data as Record<string, unknown>) : merged,
    updatedAt: doc?.updatedAt ? new Date(doc.updatedAt as Date).toISOString() : null,
    updatedByName: (doc?.updatedByName as string | undefined) ?? null,
  }
}

export async function saveSingleton(def: SingletonDef, input: unknown, actor: { id: string; name: string }) {
  const parsed = def.schema.safeParse(input)
  if (!parsed.success) throw AppError.fromZod(parsed.error, "Please fix the highlighted fields")
  await (await col()).updateOne(
    { _id: def.key },
    { $set: { values: parsed.data, updatedAt: new Date(), updatedBy: actor.id, updatedByName: actor.name } },
    { upsert: true }
  )
}

/** For public pages: stored values, or defaults if the database is unavailable. */
export async function readSingletonValues<T>(def: SingletonDef): Promise<T> {
  if (!process.env.MONGODB_URI) return SINGLETON_DEFAULTS[def.key] as T
  try {
    return (await readSingleton(def)).values as T
  } catch (error) {
    console.error(`[content] reading "${def.key}" failed; using defaults`, error)
    return SINGLETON_DEFAULTS[def.key] as T
  }
}
