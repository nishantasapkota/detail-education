"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useTransition } from "react"
import { toast } from "sonner"

import { addLeadNoteAction, deleteLeadAction, updateLeadAction } from "@/app/admin/leads/actions"
import { selectClass } from "@/components/admin/cms/field-input"
import { formatDate, Panel } from "@/components/admin/page-parts"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { LEAD_STATUSES } from "@/lib/validations/lead"
import { cn } from "@/lib/utils"
import type { LeadDetail } from "@/services/lead.service"

/** Status, assignment and the notes timeline for one lead. */
export function LeadWorkspace({ lead, staff }: { lead: LeadDetail; staff: { id: string; name: string }[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const noteRef = useRef<HTMLTextAreaElement>(null)

  const update = (patch: { status?: string; assignedTo?: string | null }) =>
    start(async () => {
      const res = await updateLeadAction(lead.id, patch)
      if (!res.success) return void toast.error(res.error.message)
      toast.success("Updated")
      router.refresh()
    })

  const addNote = (fd: FormData) =>
    start(async () => {
      const body = String(fd.get("body") ?? "")
      const res = await addLeadNoteAction(lead.id, body)
      if (!res.success) return void toast.error(res.error.message)
      if (noteRef.current) noteRef.current.value = ""
      router.refresh()
    })

  const remove = () => {
    if (!window.confirm(`Delete ${lead.fullName}'s lead and all notes? This can't be undone.`)) return
    start(async () => {
      const res = await deleteLeadAction(lead.id)
      if (!res.success) return void toast.error(res.error.message)
      toast.success("Lead deleted")
      router.replace("/admin/leads")
    })
  }

  return (
    <div className="space-y-6">
      <Panel className="grid gap-4 p-5 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <label htmlFor="lead-status" className="text-sm font-medium">
            Status
          </label>
          <select
            key={lead.status /* remount when the server changes it (e.g. first note) */}
            id="lead-status"
            className={cn(selectClass, "capitalize")}
            defaultValue={lead.status}
            disabled={pending}
            onChange={(e) => update({ status: e.target.value })}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="lead-owner" className="text-sm font-medium">
            Counsellor
          </label>
          <select
            key={lead.assignedTo ?? "none"}
            id="lead-owner"
            className={selectClass}
            defaultValue={lead.assignedTo ?? ""}
            disabled={pending}
            onChange={(e) => update({ assignedTo: e.target.value || null })}
          >
            <option value="">Unassigned</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </Panel>

      <Panel>
        <div className="border-b px-5 py-4">
          <h2 className="font-medium">Notes &amp; history</h2>
        </div>
        <form action={addNote} className="grid gap-2 border-b p-5">
          <Textarea
            ref={noteRef}
            name="body"
            rows={3}
            required
            placeholder="Log a call, what they asked, next steps…"
            aria-label="New note"
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={pending}>
              Add note
            </Button>
          </div>
        </form>
        {lead.notes.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">No notes yet.</p>
        ) : (
          <ol className="divide-y">
            {lead.notes.map((n) => (
              <li key={n.id} className={cn("px-5 py-3.5", n.kind === "event" && "bg-muted/30")}>
                <p className={cn("text-sm whitespace-pre-wrap", n.kind === "event" && "text-muted-foreground")}>{n.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {n.authorName} · {formatDate(n.createdAt, true)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </Panel>

      <div className="flex justify-end">
        <Button variant="destructive" size="sm" onClick={remove} disabled={pending}>
          <Trash2 /> Delete lead
        </Button>
      </div>
    </div>
  )
}
