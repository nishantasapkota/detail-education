import { z } from "zod"

/** Body for POST /api/upload/sign. */
export const signUploadSchema = z.object({
  /** Optional sub-folder under the user's folder, e.g. "projects". */
  folder: z
    .string()
    .regex(/^[a-z0-9-]{1,32}$/, "Folder may only contain lowercase letters, numbers and dashes")
    .optional(),
})
export type SignUploadInput = z.infer<typeof signUploadSchema>

/** Cloudinary signature; the browser sends these fields to Cloudinary. */
export type SignedUploadParams = {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
}

/** Uploads always go directly to Cloudinary. */
export type UploadTarget = { provider: "cloudinary" } & SignedUploadParams

/** Legacy GridFS images are served from here; new uploads go to Cloudinary. */
export const MONGO_IMAGE_PREFIX = "mongo:"
export const mongoImageUrl = (id: string) => `/api/images/${id}`
const MONGO_IMAGE_URL = /^\/api\/images\/[a-f\d]{24}$/i

function isAllowedImageUrl(u: string) {
  if (MONGO_IMAGE_URL.test(u)) return true
  try {
    const url = new URL(u)
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com"
  } catch {
    return false
  }
}

/**
 * An image reference saved after an upload. `publicId` is the source of
 * truth; `url` is stored for convenience and re-checked on the server.
 */
export const uploadedImageSchema = z.object({
  publicId: z.string().min(1).max(255),
  url: z.string().max(1024).refine(isAllowedImageUrl, {
    message: "Image must be hosted on Cloudinary or uploaded to this app",
  }),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
})
export type UploadedImage = z.infer<typeof uploadedImageSchema>
