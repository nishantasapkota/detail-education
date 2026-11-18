"use server"

import { updateTag } from "next/cache"

import { runAction } from "@/lib/api/action"
import { AppError } from "@/lib/api/errors"
import { requireUser } from "@/lib/auth/session"
import { getSingleton } from "@/lib/cms/singletons"
import { logActivity } from "@/services/activity.service"
import { saveSingleton } from "@/services/singleton.service"

export async function saveSingletonAction(key: string, input: unknown) {
  return runAction(async () => {
    const def = getSingleton(key)
    if (!def) throw AppError.notFound("Page")
    const user = await requireUser(def.permission)
    await saveSingleton(def, input, user)
    for (const tag of def.cacheTags) updateTag(tag)
    await logActivity(user, {
      action: "edited",
      resource: "Page",
      title: def.title,
      href: def.key === "business" ? "/admin/business" : `/admin/pages/${def.key}`,
    })
  })
}
