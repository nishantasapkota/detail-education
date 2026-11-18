import "server-only"

import { forbidden, redirect } from "next/navigation"
import { cache } from "react"

import { ROUTES } from "@/config/site"
import { AppError } from "@/lib/api/errors"
import { auth } from "@/lib/auth"
import { can, type Permission, type Role } from "@/lib/auth/roles"
import { getStaffById } from "@/services/user.service"

export type SessionUser = {
  id: string
  name: string
  email: string
  image: string | null
  role: Role
}

/**
 * Data Access Layer entry point for "who is calling?". The proxy only does an
 * optimistic cookie check; every server action, route handler and admin page
 * must still call one of these before touching data.
 *
 * Role and active state are read from the database on each request (deduped
 * per request by `cache`), so demoting or deactivating someone takes effect
 * immediately, not when their session cookie expires.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth()
  const id = session?.user?.id
  if (!id) return null
  const staff = await getStaffById(id)
  if (!staff) return null
  return { id: staff.id, name: staff.name, email: staff.email, image: staff.image, role: staff.role }
})

/** For route handlers and server actions: throws 401 / 403 AppErrors. */
export async function requireUser(permission?: Permission): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) throw AppError.unauthorized()
  if (permission && !can(user.role, permission)) throw AppError.forbidden()
  return user
}

/** For pages: redirects to login, or renders the 403 page. */
export async function requireUserOrRedirect(permission?: Permission): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) redirect(ROUTES.login)
  if (permission && !can(user.role, permission)) forbidden()
  return user
}
