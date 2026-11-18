import { AppError } from "@/lib/api/errors"
import { assertRateLimit } from "@/lib/api/rate-limit"
import { created, withErrorHandling } from "@/lib/api/response"
import { requireUser } from "@/lib/auth/session"
import { isCloudinaryEnabled } from "@/lib/env"
import { storeImageInMongo } from "@/services/upload.service"

/**
 * POST /api/upload (multipart, field "file") — stores an image in MongoDB.
 * Only used while Cloudinary is not configured.
 */
export const POST = withErrorHandling(async (request: Request) => {
  const user = await requireUser()
  if (isCloudinaryEnabled()) {
    throw AppError.badRequest("Uploads go directly to Cloudinary. Request a signature first.")
  }
  await assertRateLimit(`upload:${user.id}`)

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    throw AppError.badRequest("Send the image as multipart form data")
  }
  const file = form.get("file")
  if (!(file instanceof File)) throw AppError.badRequest('Missing "file" field')

  return created(await storeImageInMongo(user.id, file))
})
