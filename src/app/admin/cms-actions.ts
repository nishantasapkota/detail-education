"use server"

import { updateTag } from "next/cache"

import { runAction } from "@/lib/api/action"
import { AppError } from "@/lib/api/errors"
import { requireUser } from "@/lib/auth/session"
import { getResource } from "@/lib/cms/registry"
import type { ResourceDef } from "@/lib/cms/types"
import { logActivity } from "@/services/activity.service"
import { createItem, deleteItem, toggleField, updateItem } from "@/services/cms.service"

/** Generic CMS actions: permission check → service → refresh public cache → audit log. */

function resolve(key: string): ResourceDef {
  const def = getResource(key)
  if (!def) throw AppError.notFound("Content type")
  return def
}

function refresh(def: ResourceDef) {
  for (const tag of def.cacheTags) updateTag(tag)
}

const titleOf = (def: ResourceDef, doc: Record<string, unknown>) =>
  String(doc[def.titleField] ?? def.singular)

export async function saveItemAction(key: string, id: string | null, input: unknown) {
  return runAction(async () => {
    const def = resolve(key)
    const user = await requireUser(def.permission)
    const doc = id ? await updateItem(def, id, input, user.id) : await createItem(def, input, user.id)
    refresh(def)
    await logActivity(user, {
      action: id ? "updated" : "created",
      resource: def.singular,
      title: titleOf(def, doc),
      href: `/admin/${def.key}/${doc.id}`,
    })
    return { id: doc.id }
  })
}

export async function deleteItemAction(key: string, id: string) {
  return runAction(async () => {
    const def = resolve(key)
    const user = await requireUser(def.permission)
    const doc = await deleteItem(def, id)
    refresh(def)
    await logActivity(user, { action: "deleted", resource: def.singular, title: titleOf(def, doc) })
    return { id }
  })
}

export async function toggleItemAction(key: string, id: string, field: string) {
  return runAction(async () => {
    const def = resolve(key)
    const user = await requireUser(def.permission)
    const { value, title } = await toggleField(def, id, field, user.id)
    refresh(def)
    await logActivity(user, {
      action: value ? `turned on “${field}” for` : `turned off “${field}” for`,
      resource: def.singular,
      title,
      href: `/admin/${def.key}/${id}`,
    })
    return { value }
  })
}
