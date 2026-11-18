import "server-only"

import { Types } from "mongoose"

import { AppError } from "@/lib/api/errors"
import { serializeDoc, type CmsDoc } from "@/lib/cms/serialize"
import type { ResourceDef } from "@/lib/cms/types"
import { connectDB } from "@/lib/db/mongoose"

/**
 * Generic storage for CMS resources. Zod (from the resource definition) is the
 * schema: nothing reaches MongoDB without passing it. Permission checks live
 * in the server actions that call this.
 */

export type ListQuery = { q?: string; filter?: string; page?: number; limit?: number }
export type ListResult = { items: CmsDoc[]; total: number; page: number; totalPages: number }

async function collection(def: ResourceDef) {
  const conn = await connectDB()
  return conn.connection.collection(def.collection)
}

function objectId(id: string) {
  if (!Types.ObjectId.isValid(id)) throw AppError.notFound("Item")
  return new Types.ObjectId(id)
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export async function listItems(def: ResourceDef, query: ListQuery = {}): Promise<ListResult> {
  const limit = Math.min(Math.max(query.limit ?? 20, 1), 100)
  const page = Math.max(query.page ?? 1, 1)
  const filter: Record<string, unknown> = {}

  const q = query.q?.trim().slice(0, 100)
  if (q) {
    const re = new RegExp(escapeRegex(q), "i")
    filter.$or = def.searchFields.map((f) => ({ [f]: re }))
  }
  if (def.filter && query.filter && def.filter.options.some((o) => o.value === query.filter)) {
    filter[def.filter.name] = query.filter // matches scalars and array members alike
  }

  const col = await collection(def)
  const [docs, total] = await Promise.all([
    col
      .find(filter)
      .sort({ ...def.defaultSort, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    col.countDocuments(filter),
  ])
  return {
    items: docs.map(serializeDoc),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}

export async function getItem(def: ResourceDef, id: string): Promise<CmsDoc> {
  const doc = await (await collection(def)).findOne({ _id: objectId(id) })
  if (!doc) throw AppError.notFound(def.singular)
  return serializeDoc(doc)
}

function parse(def: ResourceDef, input: unknown) {
  const parsed = def.schema.safeParse(input)
  if (!parsed.success) throw AppError.fromZod(parsed.error, "Please fix the highlighted fields")
  return parsed.data as Record<string, unknown>
}

async function assertUnique(def: ResourceDef, data: Record<string, unknown>, exceptId?: Types.ObjectId) {
  if (!def.uniqueField) return
  const clash = await (await collection(def)).findOne(
    { [def.uniqueField]: data[def.uniqueField], ...(exceptId && { _id: { $ne: exceptId } }) },
    { projection: { _id: 1 } }
  )
  if (clash) {
    throw new AppError(
      "CONFLICT",
      `Another ${def.singular.toLowerCase()} already uses this ${def.uniqueField}`,
      { [def.uniqueField]: ["Already in use"] }
    )
  }
}

export async function createItem(def: ResourceDef, input: unknown, actorId: string): Promise<CmsDoc> {
  const data = parse(def, input)
  await assertUnique(def, data)
  const now = new Date()
  const doc = { ...data, createdAt: now, updatedAt: now, createdBy: actorId, updatedBy: actorId }
  const { insertedId } = await (await collection(def)).insertOne(doc)
  return serializeDoc({ _id: insertedId, ...doc })
}

export async function updateItem(
  def: ResourceDef,
  id: string,
  input: unknown,
  actorId: string
): Promise<CmsDoc> {
  const _id = objectId(id)
  const data = parse(def, input)
  await assertUnique(def, data, _id)
  const result = await (await collection(def)).findOneAndUpdate(
    { _id },
    { $set: { ...data, updatedAt: new Date(), updatedBy: actorId } },
    { returnDocument: "after" }
  )
  if (!result) throw AppError.notFound(def.singular)
  return serializeDoc(result)
}

export async function deleteItem(def: ResourceDef, id: string): Promise<CmsDoc> {
  const doc = await (await collection(def)).findOneAndDelete({ _id: objectId(id) })
  if (!doc) throw AppError.notFound(def.singular)
  return serializeDoc(doc)
}

/** Flips a boolean field (e.g. published) straight from the list view. */
export async function toggleField(def: ResourceDef, id: string, field: string, actorId: string) {
  const isBooleanField = def.sections.some((s) =>
    s.fields.some((f) => f.name === field && f.type === "boolean")
  )
  if (!isBooleanField) throw AppError.badRequest("This field can't be toggled")
  const _id = objectId(id)
  const col = await collection(def)
  const current = await col.findOne({ _id }, { projection: { [field]: 1, [def.titleField]: 1 } })
  if (!current) throw AppError.notFound(def.singular)
  const value = !current[field]
  await col.updateOne({ _id }, { $set: { [field]: value, updatedAt: new Date(), updatedBy: actorId } })
  return { value, title: String(current[def.titleField] ?? def.singular) }
}

export async function countItems(def: ResourceDef, filter: Record<string, unknown> = {}) {
  return (await collection(def)).countDocuments(filter)
}
