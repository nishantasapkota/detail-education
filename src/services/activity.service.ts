import "server-only"

import { connectDB } from "@/lib/db/mongoose"
import type { SessionUser } from "@/lib/auth/session"

export type ActivityEntry = {
  id: string
  actorName: string
  action: string
  resource: string
  title: string
  href: string | null
  at: string
}

/**
 * Append-only audit trail of staff actions ("Rina updated Destination USA").
 * Never throws: a failed log must not fail the user's action.
 */
export async function logActivity(
  actor: Pick<SessionUser, "id" | "name">,
  entry: { action: string; resource: string; title: string; href?: string | null }
) {
  try {
    const conn = await connectDB()
    await conn.connection.collection("activity").insertOne({
      actorId: actor.id,
      actorName: actor.name,
      action: entry.action,
      resource: entry.resource,
      title: entry.title.slice(0, 200),
      href: entry.href ?? null,
      at: new Date(),
    })
  } catch (error) {
    console.error("[activity] failed to log", error)
  }
}

export async function listActivity(limit = 20, page = 1): Promise<ActivityEntry[]> {
  const conn = await connectDB()
  const docs = await conn.connection
    .collection("activity")
    .find({})
    .sort({ at: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray()
  return docs.map((d) => ({
    id: d._id.toString(),
    actorName: String(d.actorName ?? "Someone"),
    action: String(d.action),
    resource: String(d.resource),
    title: String(d.title ?? ""),
    href: (d.href as string | null) ?? null,
    at: new Date(d.at as Date).toISOString(),
  }))
}
