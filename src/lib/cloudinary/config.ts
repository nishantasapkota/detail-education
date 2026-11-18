import "server-only"

import { v2 as cloudinary } from "cloudinary"

import { AppError } from "@/lib/api/errors"

let configured = false

/** Cloudinary keys, or a clear error when they are not set. */
export function getCloudinaryKeys() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    throw new AppError("INTERNAL_ERROR", "Cloudinary is not configured")
  }
  return { cloudName, apiKey, apiSecret }
}

/** Server-side Cloudinary SDK, configured lazily so builds don't need secrets. */
export function getCloudinary() {
  if (!configured) {
    const keys = getCloudinaryKeys()
    cloudinary.config({
      cloud_name: keys.cloudName,
      api_key: keys.apiKey,
      api_secret: keys.apiSecret,
      secure: true,
    })
    configured = true
  }
  return cloudinary
}
