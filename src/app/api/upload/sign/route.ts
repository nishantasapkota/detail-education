import { ok, parseJson, withErrorHandling } from "@/lib/api/response"
import { assertRateLimit } from "@/lib/api/rate-limit"
import { requireUser } from "@/lib/auth/session"
import { signUploadSchema } from "@/lib/validations/upload"
import { getUploadTarget } from "@/services/upload.service"

/**
 * POST /api/upload/sign — returns a short-lived signature for a direct
 * Cloudinary upload. File bytes never pass through this function.
 */
export const POST = withErrorHandling(async (request: Request) => {
  const user = await requireUser()
  await assertRateLimit(`upload-sign:${user.id}`)
  const { folder } = await parseJson(request, signUploadSchema)
  return ok(getUploadTarget(user.id, folder))
})
