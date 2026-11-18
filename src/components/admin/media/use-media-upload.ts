"use client"

import { useState } from "react"
import { toast } from "sonner"

import { addMediaAction } from "@/app/admin/media/actions"
import { uploadImage, UploadError } from "@/lib/upload-client"
import type { MediaItem } from "@/services/media.service"

/** Reads an image's pixel size in the browser (storage may not report it). */
function readDimensions(file: File): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      resolve({})
      URL.revokeObjectURL(url)
    }
    img.src = url
  })
}

/** Uploads files (to MongoDB or Cloudinary) and adds them to the media library. */
export function useMediaUpload(onUploaded?: (item: MediaItem) => void) {
  const [progress, setProgress] = useState<number | null>(null)

  async function upload(files: FileList | File[]) {
    const list = Array.from(files)
    for (const [index, file] of list.entries()) {
      try {
        setProgress(0)
        const [dims, stored] = await Promise.all([
          readDimensions(file),
          uploadImage(file, {
            folder: "media",
            onProgress: (p) => setProgress(Math.round(((index + p / 100) / list.length) * 100)),
          }),
        ])
        const result = await addMediaAction({
          ...stored,
          width: stored.width ?? dims.width,
          height: stored.height ?? dims.height,
          name: file.name,
          size: file.size,
          mimeType: file.type,
        })
        if (!result.success) throw new UploadError(result.error.message)
        onUploaded?.(result.data)
      } catch (error) {
        toast.error(`${file.name}: ${error instanceof UploadError ? error.message : "Upload failed"}`)
      }
    }
    setProgress(null)
  }

  return { upload, progress, uploading: progress !== null }
}
