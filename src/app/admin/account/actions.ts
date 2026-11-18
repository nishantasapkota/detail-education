"use server"

import { runAction } from "@/lib/api/action"
import { requireUser } from "@/lib/auth/session"
import { updateOwnAccount } from "@/services/staff.service"

export async function updateAccountAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser()
    return updateOwnAccount(user.id, input)
  })
}
