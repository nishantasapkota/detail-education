import { ok, parseJson, withErrorHandling } from "@/lib/api/response"
import { assertRateLimit } from "@/lib/api/rate-limit"
import { requireUser } from "@/lib/auth/session"
import { signUploadSchema } from "@/lib/validations/upload"
import { getUploadTarget } from "@/services/upload.service"

/**
 * POST /api/upload/sign — tells the browser where to upload. With Cloudinary
 * configured it returns a short-lived signature for a direct upload (file
 * bytes never pass through this function); otherwise it points at
 * /api/upload, which stores the file in MongoDB.
 */
export const POST = withErrorHandling(async (request: Request) => {
  const user = await requireUser()
  await assertRateLimit(`upload-sign:${user.id}`)
  const { folder } = await parseJson(request, signUploadSchema)
  return ok(getUploadTarget(user.id, folder))
})
