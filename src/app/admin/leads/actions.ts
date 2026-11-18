"use server"

import { runAction } from "@/lib/api/action"
import { requireUser } from "@/lib/auth/session"
import { logActivity } from "@/services/activity.service"
import { addLeadNote, createStaffLead, deleteLead, updateLead } from "@/services/lead.service"

export async function updateLeadAction(id: string, input: { status?: string; assignedTo?: string | null }) {
  return runAction(async () => {
    const user = await requireUser("leads.manage")
    const res = await updateLead(id, input, user)
    if (res.changes.length) {
      await logActivity(user, {
        action: res.changes.join(", ").toLowerCase().startsWith("status") ? "updated status of" : "reassigned",
        resource: "Lead",
        title: res.fullName,
        href: `/admin/leads/${id}`,
      })
    }
  })
}

export async function addLeadNoteAction(id: string, body: string) {
  return runAction(async () => {
    const user = await requireUser("leads.manage")
    await addLeadNote(id, { body }, user)
  })
}

export async function createLeadAction(input: unknown) {
  return runAction(async () => {
    const user = await requireUser("leads.manage")
    const lead = await createStaffLead(input, user)
    await logActivity(user, { action: "added", resource: "Lead", title: lead.fullName, href: `/admin/leads/${lead.id}` })
    return lead
  })
}

export async function deleteLeadAction(id: string) {
  return runAction(async () => {
    const user = await requireUser("leads.manage")
    const lead = await deleteLead(id)
    await logActivity(user, { action: "deleted", resource: "Lead", title: lead.fullName })
  })
}
