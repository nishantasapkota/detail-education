import "server-only"

import { Readable } from "node:stream"

import { Types } from "mongoose"

import { UPLOAD } from "@/config/site"
import { AppError } from "@/lib/api/errors"
import { getCloudinary, getCloudinaryKeys } from "@/lib/cloudinary/config"
import { getImageBucket } from "@/lib/db/gridfs"
import { isCloudinaryEnabled } from "@/lib/env"
import { sniffImageType } from "@/lib/image-sniff"
import {
  MONGO_IMAGE_PREFIX,
  mongoImageUrl,
  type UploadedImage,
  type UploadTarget,
} from "@/lib/validations/upload"

/**
 * Image storage with two backends:
 * - Cloudinary (direct signed browser uploads) when its keys are set.
 * - MongoDB GridFS (file posted to /api/upload) otherwise.
 * Saved images keep working after you switch: each one records where it lives
 * in its `publicId` (`mongo:<id>` vs a Cloudinary path).
 */

function userFolder(userId: string, sub?: string) {
  return [UPLOAD.folderRoot, userId, sub].filter(Boolean).join("/")
}

const isMongoImage = (publicId: string) => publicId.startsWith(MONGO_IMAGE_PREFIX)
const mongoIdOf = (publicId: string) => publicId.slice(MONGO_IMAGE_PREFIX.length)

/** Tells the browser where to send the file. */
export function getUploadTarget(userId: string, sub?: string): UploadTarget {
  if (!isCloudinaryEnabled()) {
    return { provider: "mongodb", uploadUrl: "/api/upload", maxBytes: UPLOAD.maxBytesViaServer }
  }

  // Only the params included here are covered by the signature, so the
  // client can't change the folder.
  const keys = getCloudinaryKeys()
  const timestamp = Math.round(Date.now() / 1000)
  const folder = userFolder(userId, sub)
  const signature = getCloudinary().utils.api_sign_request({ timestamp, folder }, keys.apiSecret)

  return { provider: "cloudinary", signature, timestamp, folder, apiKey: keys.apiKey, cloudName: keys.cloudName }
}

/** Stores an uploaded file in GridFS after checking its real type and size. */
export async function storeImageInMongo(userId: string, file: File): Promise<UploadedImage> {
  if (file.size === 0) throw AppError.badRequest("The file is empty")
  if (file.size > UPLOAD.maxBytesViaServer) {
    throw AppError.badRequest(`File is too large. Max ${UPLOAD.maxBytesViaServer / 1024 / 1024} MB.`)
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  const contentType = sniffImageType(bytes)
  if (!contentType || !(UPLOAD.acceptedTypes as readonly string[]).includes(contentType)) {
    throw AppError.badRequest("Unsupported file type. Use JPG, PNG, WebP, AVIF or GIF.")
  }

  const bucket = await getImageBucket()
  const id = new Types.ObjectId()
  await new Promise<void>((resolve, reject) => {
    const stream = bucket.openUploadStreamWithId(id, file.name.slice(0, 200) || "image", {
      metadata: { owner: userId, contentType },
    })
    stream.once("finish", () => resolve())
    stream.once("error", reject)
    stream.end(Buffer.from(bytes))
  })

  const hex = id.toHexString()
  return { publicId: `${MONGO_IMAGE_PREFIX}${hex}`, url: mongoImageUrl(hex) }
}

/** Opens a stored image for streaming, or null when it does not exist. */
export async function openMongoImage(id: string) {
  if (!Types.ObjectId.isValid(id)) return null
  const bucket = await getImageBucket()
  const _id = new Types.ObjectId(id)
  const file = await bucket.find({ _id }).limit(1).next()
  if (!file) return null

  const contentType = (file.metadata?.contentType as string | undefined) ?? "application/octet-stream"
  const body = Readable.toWeb(bucket.openDownloadStream(_id)) as ReadableStream<Uint8Array>
  return { body, contentType, length: file.length }
}

/**
 * Checks that an image the client sends back really belongs to this user, so
 * nobody can attach someone else's upload to their project.
 */
export async function assertOwnedImage(userId: string, image: UploadedImage) {
  if (isMongoImage(image.publicId)) {
    const id = mongoIdOf(image.publicId)
    if (!Types.ObjectId.isValid(id) || image.url !== mongoImageUrl(id)) {
      throw AppError.forbidden("Image reference is invalid")
    }
    const bucket = await getImageBucket()
    const file = await bucket.find({ _id: new Types.ObjectId(id) }).limit(1).next()
    if (!file || file.metadata?.owner !== userId) {
      throw AppError.forbidden("Image does not belong to the current user")
    }
    return
  }

  if (!image.publicId.startsWith(`${userFolder(userId)}/`)) {
    throw AppError.forbidden("Image does not belong to the current user")
  }
  const url = new URL(image.url)
  if (!url.pathname.startsWith(`/${getCloudinaryKeys().cloudName}/`)) {
    throw AppError.forbidden("Image is not hosted on this Cloudinary account")
  }
}

/** Best-effort cleanup; a failed delete must never fail the user's request. */
export async function deleteImage(publicId: string) {
  try {
    if (isMongoImage(publicId)) {
      const bucket = await getImageBucket()
      await bucket.delete(new Types.ObjectId(mongoIdOf(publicId)))
    } else {
      await getCloudinary().uploader.destroy(publicId, { invalidate: true })
    }
  } catch (error) {
    console.error("[images] failed to delete", publicId, error)
  }
}
