import "server-only"

import { Readable } from "node:stream"

import { Types } from "mongoose"

import { UPLOAD } from "@/config/site"
import { AppError } from "@/lib/api/errors"
import { getCloudinary, getCloudinaryKeys } from "@/lib/cloudinary/config"
import { getImageBucket } from "@/lib/db/gridfs"
import {
  MONGO_IMAGE_PREFIX,
  mongoImageUrl,
  type UploadedImage,
  type UploadTarget,
} from "@/lib/validations/upload"

/**
 * New image uploads go directly to Cloudinary. MongoDB stores image URLs and
 * media metadata; GridFS access remains only to serve/delete older uploads.
 */

function userFolder(userId: string, sub?: string) {
  return [UPLOAD.folderRoot, userId, sub].filter(Boolean).join("/")
}

const isMongoImage = (publicId: string) => publicId.startsWith(MONGO_IMAGE_PREFIX)
const mongoIdOf = (publicId: string) => publicId.slice(MONGO_IMAGE_PREFIX.length)

/** Tells the browser where to send the file. */
export function getUploadTarget(userId: string, sub?: string): UploadTarget {
  // Only the params included here are covered by the signature, so the
  // client can't change the folder.
  const keys = getCloudinaryKeys()
  const timestamp = Math.round(Date.now() / 1000)
  const folder = userFolder(userId, sub)
  const signature = getCloudinary().utils.api_sign_request({ timestamp, folder }, keys.apiSecret)

  return { provider: "cloudinary", signature, timestamp, folder, apiKey: keys.apiKey, cloudName: keys.cloudName }
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
