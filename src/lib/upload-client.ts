import { UPLOAD } from "@/config/site"
import type { UploadedImage, UploadTarget } from "@/lib/validations/upload"
import type { ApiResponse } from "@/types/api"

export class UploadError extends Error {}

const mb = (bytes: number) => Math.round(bytes / 1024 / 1024)

export function validateFile(file: File, maxBytes: number = UPLOAD.maxBytes): string | null {
  if (!(UPLOAD.acceptedTypes as readonly string[]).includes(file.type)) {
    return "Unsupported file type. Use JPG, PNG, WebP, AVIF or GIF."
  }
  if (file.size > maxBytes) return `File is too large. Max ${mb(maxBytes)} MB.`
  return null
}

async function getUploadTarget(folder?: string): Promise<UploadTarget> {
  const res = await fetch("/api/upload/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  })
  const json = (await res.json()) as ApiResponse<UploadTarget>
  if (!json.success) throw new UploadError(json.error.message)
  return json.data
}

/** POSTs a form with XHR (not fetch) so we get upload progress. */
function postWithProgress<T>(
  url: string,
  form: FormData,
  parse: (status: number, body: unknown) => T,
  options: { onProgress?: (percent: number) => void; signal?: AbortSignal }
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) options.onProgress?.(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      try {
        resolve(parse(xhr.status, JSON.parse(xhr.responseText)))
      } catch (error) {
        reject(error instanceof UploadError ? error : new UploadError("Unexpected response from the server"))
      }
    }
    xhr.onerror = () => reject(new UploadError("Network error during upload"))
    xhr.onabort = () => reject(new UploadError("Upload cancelled"))
    options.signal?.addEventListener("abort", () => xhr.abort())
    xhr.send(form)
  })
}

type CloudinaryUploadResponse = {
  public_id: string
  secure_url: string
  width: number
  height: number
  error?: { message: string }
}

/**
 * Uploads an image wherever the server says: straight to Cloudinary with a
 * signature, or to our own /api/upload (stored in MongoDB) when Cloudinary
 * is not configured yet. Callers don't need to know which.
 */
export async function uploadImage(
  file: File,
  options: { folder?: string; onProgress?: (percent: number) => void; signal?: AbortSignal } = {}
): Promise<UploadedImage> {
  const precheck = validateFile(file)
  if (precheck) throw new UploadError(precheck)

  const target = await getUploadTarget(options.folder)
  const form = new FormData()
  form.append("file", file)

  if (target.provider === "mongodb") {
    const tooBig = validateFile(file, target.maxBytes)
    if (tooBig) throw new UploadError(tooBig)
    return postWithProgress(
      target.uploadUrl,
      form,
      (_status, body) => {
        const json = body as ApiResponse<UploadedImage>
        if (!json.success) throw new UploadError(json.error.message)
        return json.data
      },
      options
    )
  }

  form.append("api_key", target.apiKey)
  form.append("timestamp", String(target.timestamp))
  form.append("signature", target.signature)
  form.append("folder", target.folder)

  const result = await postWithProgress(
    `https://api.cloudinary.com/v1_1/${target.cloudName}/image/upload`,
    form,
    (status, body) => {
      const json = body as CloudinaryUploadResponse
      if (status < 200 || status >= 300) throw new UploadError(json.error?.message ?? "Upload failed")
      return json
    },
    options
  )
  return { publicId: result.public_id, url: result.secure_url, width: result.width, height: result.height }
}
