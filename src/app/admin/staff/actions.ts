"use server"

import { runAction } from "@/lib/api/action"
import { requireUser } from "@/lib/auth/session"
import { logActivity } from "@/services/activity.service"
import { createStaff, deleteStaff, resetStaffPassword, updateStaff } from "@/services/staff.service"

export async function createStaffAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser("users.manage")
    const res = await createStaff(input)
    await logActivity(user, { action: "added", resource: "Staff member", title: res.user.name, href: "/admin/staff" })
    return res
  })
}

export async function updateStaffAction(id: string, input: unknown) {
  return runAction(async () => {
    const user = await requireUser("users.manage")
    const staff = await updateStaff(id, input, user.id)
    await logActivity(user, { action: "updated", resource: "Staff member", title: staff.name, href: "/admin/staff" })
  })
}

export async function resetStaffPasswordAction(id: string) {
  return runAction(async () => {
    const user = await requireUser("users.manage")
    const res = await resetStaffPassword(id)
    await logActivity(user, { action: "reset the password of", resource: "Staff member", title: res.name })
    return res
  })
}

export async function deleteStaffAction(id: string) {
  return runAction(async () => {
    const user = await requireUser("users.manage")
    const res = await deleteStaff(id, user.id)
    await logActivity(user, { action: "removed", resource: "Staff member", title: res.name })
  })
}
