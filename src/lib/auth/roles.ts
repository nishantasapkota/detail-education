/**
 * Staff roles and what each may do. Pages, server actions and API routes all
 * check permissions through `can()`, so this file is the single source of truth.
 */

export const ROLES = ["admin", "counsellor", "writer"] as const
export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  counsellor: "Counsellor",
  writer: "Content writer",
}

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "Everything, including staff accounts and business settings.",
  counsellor: "Leads, applications, appointments, events and testimonials.",
  writer: "Journal, pages, destinations, courses, services and media.",
}

const ALL: readonly Role[] = ROLES

export const PERMISSIONS = {
  "dashboard.view": ALL,
  "leads.manage": ["admin", "counsellor"],
  "applications.manage": ["admin", "counsellor"],
  "appointments.manage": ["admin", "counsellor"],
  "events.manage": ["admin", "counsellor"],
  "testimonials.manage": ["admin", "counsellor", "writer"],
  "content.manage": ["admin", "writer"],
  "media.manage": ALL,
  "settings.manage": ["admin"],
  "users.manage": ["admin"],
  "activity.view": ["admin"],
} as const satisfies Record<string, readonly Role[]>

export type Permission = keyof typeof PERMISSIONS

export function can(role: Role | null | undefined, permission: Permission): boolean {
  return !!role && (PERMISSIONS[permission] as readonly Role[]).includes(role)
}
