import "server-only"

import { Types } from "mongoose"
import { z } from "zod"

import { AppError } from "@/lib/api/errors"
import { connectDB } from "@/lib/db/mongoose"
import { uploadedImageSchema } from "@/lib/validations/upload"
import { assertOwnedImage, deleteImage } from "@/services/upload.service"

/**
 * Media library: one record per uploaded image, wherever the bytes live
 * (MongoDB GridFS or Cloudinary). CMS image fields store the record's URL.
 */

export type MediaItem = {
  id: string
  url: string
  publicId: string
  name: string
  alt: string
  size: number
  mimeType: string
  width: number | null
  height: number | null
  uploadedByName: string
  createdAt: string
}

export const addMediaSchema = uploadedImageSchema.extend({
  name: z.string().trim().min(1).max(200),
  size: z.number().int().min(0).max(50 * 1024 * 1024),
  mimeType: z.string().max(60),
  alt: z.string().trim().max(160).default(""),
})
export type AddMediaInput = z.input<typeof addMediaSchema>

async function col() {
  return (await connectDB()).connection.collection("media")
}

function toItem(d: Record<string, unknown>): MediaItem {
  return {
    id: String(d._id),
    url: String(d.url),
    publicId: String(d.publicId),
    name: String(d.name ?? ""),
    alt: String(d.alt ?? ""),
    size: Number(d.size ?? 0),
    mimeType: String(d.mimeType ?? ""),
    width: (d.width as number | null) ?? null,
    height: (d.height as number | null) ?? null,
    uploadedByName: String(d.uploadedByName ?? ""),
    createdAt: new Date(d.createdAt as Date).toISOString(),
  }
}

export async function listMedia(query: { q?: string; page?: number; limit?: number } = {}) {
  const limit = Math.min(query.limit ?? 30, 100)
  const page = Math.max(query.page ?? 1, 1)
  const q = query.q?.trim().slice(0, 100)
  const re = q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") : null
  const filter = re ? { $or: [{ name: re }, { alt: re }] } : {}
  const c = await col()
  const [docs, total] = await Promise.all([
    c.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
    c.countDocuments(filter),
  ])
  return { items: docs.map(toItem), total, page, totalPages: Math.max(1, Math.ceil(total / limit)) }
}

export async function addMedia(input: AddMediaInput, user: { id: string; name: string }) {
  const data = addMediaSchema.parse(input)
  // The uploader must own the file they register (checked against storage).
  await assertOwnedImage(user.id, { publicId: data.publicId, url: data.url })
  const doc = {
    ...data,
    width: data.width ?? null,
    height: data.height ?? null,
    uploadedBy: user.id,
    uploadedByName: user.name,
    createdAt: new Date(),
  }
  const { insertedId } = await (await col()).insertOne(doc)
  return toItem({ _id: insertedId, ...doc })
}

export async function updateMediaAlt(id: string, alt: string) {
  if (!Types.ObjectId.isValid(id)) throw AppError.notFound("Image")
  const value = z.string().trim().max(160).parse(alt)
  const res = await (await col()).updateOne({ _id: new Types.ObjectId(id) }, { $set: { alt: value } })
  if (!res.matchedCount) throw AppError.notFound("Image")
}

export async function deleteMedia(id: string) {
  if (!Types.ObjectId.isValid(id)) throw AppError.notFound("Image")
  const doc = await (await col()).findOneAndDelete({ _id: new Types.ObjectId(id) })
  if (!doc) throw AppError.notFound("Image")
  await deleteImage(String(doc.publicId))
  return toItem(doc)
}
