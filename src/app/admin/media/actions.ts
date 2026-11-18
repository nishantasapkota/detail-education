"use server"

import { runAction } from "@/lib/api/action"
import { requireUser } from "@/lib/auth/session"
import { logActivity } from "@/services/activity.service"
import {
  addMedia,
  deleteMedia,
  listMedia,
  updateMediaAlt,
  type AddMediaInput,
} from "@/services/media.service"

export async function listMediaAction(query: { q?: string; page?: number }) {
  return runAction(async () => {
    await requireUser("media.manage")
    return listMedia({ ...query, limit: 24 })
  })
}

export async function addMediaAction(input: AddMediaInput) {
  return runAction(async () => {
    const user = await requireUser("media.manage")
    const item = await addMedia(input, user)
    await logActivity(user, { action: "uploaded", resource: "Image", title: item.name, href: "/admin/media" })
    return item
  })
}

export async function updateMediaAltAction(id: string, alt: string) {
  return runAction(async () => {
    await requireUser("media.manage")
    await updateMediaAlt(id, alt)
  })
}

export async function deleteMediaAction(id: string) {
  return runAction(async () => {
    const user = await requireUser("media.manage")
    const item = await deleteMedia(id)
    await logActivity(user, { action: "deleted", resource: "Image", title: item.name })
  })
}
