import "server-only"

import { Types } from "mongoose"

import { AppError } from "@/lib/api/errors"
import type { SessionUser } from "@/lib/auth/session"
import { connectDB } from "@/lib/db/mongoose"
import {
  LEAD_STATUSES,
  leadNoteSchema,
  leadSchema,
  leadUpdateSchema,
  staffLeadSchema,
  type LeadInput,
  type LeadStatus,
} from "@/lib/validations/lead"
import { Lead } from "@/models/Lead"
import { User } from "@/models/User"

export type LeadNote = { id: string; body: string; authorName: string; kind: "note" | "event"; createdAt: string }

export type LeadRow = {
  id: string
  fullName: string
  phone: string
  email: string | null
  country: string
  studyLevel: string
  source: string
  status: LeadStatus
  assignedTo: string | null
  assignedName: string | null
  createdAt: string
  lastActivityAt: string
}

export type LeadDetail = LeadRow & { notes: LeadNote[] }

type RawLead = Record<string, unknown> & { _id: Types.ObjectId }

function toRow(d: RawLead): LeadRow {
  return {
    id: d._id.toString(),
    fullName: String(d.fullName),
    phone: String(d.phone),
    email: (d.email as string | null) ?? null,
    country: String(d.country),
    studyLevel: String(d.studyLevel),
    source: String(d.source ?? "website"),
    status: (LEAD_STATUSES as readonly string[]).includes(String(d.status)) ? (d.status as LeadStatus) : "new",
    assignedTo: (d.assignedTo as string | null) ?? null,
    assignedName: (d.assignedName as string | null) ?? null,
    createdAt: new Date(d.createdAt as Date).toISOString(),
    lastActivityAt: new Date((d.lastActivityAt ?? d.updatedAt ?? d.createdAt) as Date).toISOString(),
  }
}

function parseId(id: string) {
  if (!Types.ObjectId.isValid(id)) throw AppError.notFound("Lead")
  return new Types.ObjectId(id)
}

/** Public consultation form. */
export async function createLead(input: LeadInput): Promise<{ id: string }> {
  const data = leadSchema.parse(input)
  await connectDB()
  const lead = await Lead.create({ ...data, phone: `+977${data.phone}`, source: "website" })
  return { id: lead._id.toString() }
}

/** Lead entered by staff (walk-in, phone…). */
export async function createStaffLead(input: unknown, actor: SessionUser) {
  const data = staffLeadSchema.parse(input)
  await connectDB()
  const lead = await Lead.create({
    ...data,
    phone: `+977${data.phone}`,
    notes: [{ body: `Added by ${actor.name} (${data.source})`, authorId: actor.id, authorName: actor.name, kind: "event" }],
  })
  return { id: lead._id.toString(), fullName: lead.fullName }
}

export type LeadQuery = { q?: string; status?: string; mine?: boolean; page?: number; userId?: string }

export async function listLeads(query: LeadQuery) {
  await connectDB()
  const limit = 25
  const page = Math.max(query.page ?? 1, 1)
  const filter: Record<string, unknown> = {}
  if (query.status && (LEAD_STATUSES as readonly string[]).includes(query.status)) filter.status = query.status
  if (query.mine && query.userId) filter.assignedTo = query.userId
  const q = query.q?.trim().slice(0, 80)
  if (q) {
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    filter.$or = [{ fullName: re }, { phone: re }, { email: re }]
  }

  const base = { ...filter }
  delete base.status
  const [docs, total, counts] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).select("-notes").lean<RawLead[]>(),
    Lead.countDocuments(filter),
    Lead.aggregate<{ _id: string; n: number }>([{ $match: base }, { $group: { _id: "$status", n: { $sum: 1 } } }]),
  ])
  const byStatus = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0])) as Record<LeadStatus, number>
  for (const c of counts) if (c._id in byStatus) byStatus[c._id as LeadStatus] = c.n

  return {
    items: docs.map(toRow),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    byStatus,
    all: Object.values(byStatus).reduce((a, b) => a + b, 0),
  }
}

export async function getLead(id: string): Promise<LeadDetail> {
  await connectDB()
  const d = await Lead.findById(parseId(id)).lean<RawLead>()
  if (!d) throw AppError.notFound("Lead")
  const notes = ((d.notes as Record<string, unknown>[]) ?? [])
    .map((n) => ({
      id: String(n._id),
      body: String(n.body),
      authorName: String(n.authorName),
      kind: (n.kind === "event" ? "event" : "note") as "note" | "event",
      createdAt: new Date(n.createdAt as Date).toISOString(),
    }))
    .reverse()
  return { ...toRow(d), notes }
}

/** Status / assignment change. Each change is recorded on the timeline. */
export async function updateLead(id: string, input: unknown, actor: SessionUser) {
  const data = leadUpdateSchema.parse(input)
  await connectDB()
  const lead = await Lead.findById(parseId(id))
  if (!lead) throw AppError.notFound("Lead")

  const events: string[] = []
  if (data.status && data.status !== lead.status) {
    events.push(`Status: ${lead.status} → ${data.status}`)
    lead.status = data.status
  }
  if (data.assignedTo !== undefined && data.assignedTo !== lead.assignedTo) {
    if (data.assignedTo) {
      const staff = await User.findOne({ _id: data.assignedTo, active: { $ne: false } }).select("name")
      if (!staff) throw AppError.badRequest("That staff member doesn't exist")
      lead.assignedTo = data.assignedTo
      lead.assignedName = staff.name
      events.push(`Assigned to ${staff.name}`)
    } else {
      lead.assignedTo = null
      lead.assignedName = null
      events.push("Unassigned")
    }
  }
  if (events.length === 0) return { fullName: lead.fullName, changes: [] }

  for (const body of events) lead.notes.push({ body, authorId: actor.id, authorName: actor.name, kind: "event" })
  lead.lastActivityAt = new Date()
  await lead.save()
  return { fullName: lead.fullName, changes: events }
}

export async function addLeadNote(id: string, input: unknown, actor: SessionUser) {
  const { body } = leadNoteSchema.parse(input)
  await connectDB()
  const res = await Lead.updateOne(
    { _id: parseId(id) },
    {
      $push: { notes: { body, authorId: actor.id, authorName: actor.name, kind: "note", createdAt: new Date() } },
      $set: { lastActivityAt: new Date(), ...(await firstContact(id)) },
    }
  )
  if (!res.matchedCount) throw AppError.notFound("Lead")
}

/** The first note on a brand-new lead moves it to "contacted". */
async function firstContact(id: string) {
  const lead = await Lead.findById(id).select("status").lean<{ status: string }>()
  return lead?.status === "new" ? { status: "contacted" } : {}
}

export async function deleteLead(id: string) {
  await connectDB()
  const doc = await Lead.findByIdAndDelete(parseId(id)).select("fullName").lean<{ fullName: string }>()
  if (!doc) throw AppError.notFound("Lead")
  return doc
}

export async function leadStats() {
  await connectDB()
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const [newThisWeek, open, byStatus, recent] = await Promise.all([
    Lead.countDocuments({ createdAt: { $gte: weekAgo } }),
    Lead.countDocuments({ status: { $in: ["new", "contacted", "counselling", "applied"] } }),
    Lead.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
    Lead.find({}).sort({ createdAt: -1 }).limit(6).select("-notes").lean<RawLead[]>(),
  ])
  return {
    newThisWeek,
    open,
    unassignedNew: await Lead.countDocuments({ status: "new", assignedTo: null }),
    byStatus: LEAD_STATUSES.map((s) => ({ status: s, count: byStatus.find((b) => b._id === s)?.n ?? 0 })),
    recent: recent.map(toRow),
  }
}
