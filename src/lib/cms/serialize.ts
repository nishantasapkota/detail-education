import { Types } from "mongoose"

const { ObjectId } = Types

export type CmsDoc = Record<string, unknown> & { id: string; createdAt?: string; updatedAt?: string }

/** Turns a Mongo document into plain JSON (ids and dates as strings) for client components. */
export function serializeDoc(doc: Record<string, unknown>): CmsDoc {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(doc)) {
    if (key === "_id") out.id = String(value)
    else out[key] = serializeValue(value)
  }
  return out as CmsDoc
}

function serializeValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString()
  if (value instanceof ObjectId) return value.toHexString()
  if (Array.isArray(value)) return value.map(serializeValue)
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serializeValue(v)]))
  }
  return value
}
