import { Mail, MessageCircle, Phone } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LeadWorkspace } from "@/components/admin/leads/lead-workspace"
import { formatDate, PageHeader, Panel, StatusPill } from "@/components/admin/page-parts"
import { AppError } from "@/lib/api/errors"
import { requireUserOrRedirect } from "@/lib/auth/session"
import { getLead } from "@/services/lead.service"
import { listAssignableStaff } from "@/services/staff.service"

export const metadata: Metadata = { title: "Lead" }

export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  await requireUserOrRedirect("leads.manage")
  const { id } = await params
  const [lead, staff] = await Promise.all([
    getLead(id).catch((e: unknown) => {
      if (e instanceof AppError && e.code === "NOT_FOUND") notFound()
      throw e
    }),
    listAssignableStaff(),
  ])
  const digits = lead.phone.replace(/\D/g, "")

  return (
    <>
      <PageHeader
        title={lead.fullName}
        description={`Received ${formatDate(lead.createdAt, true)} via ${lead.source}`}
        back={{ href: "/admin/leads", label: "Leads" }}
        actions={<StatusPill status={lead.status} className="text-sm" />}
      />
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
        <LeadWorkspace lead={lead} staff={staff} />
        <Panel className="p-5">
          <h2 className="mb-4 font-medium">Contact</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Phone</dt>
              <dd>{lead.phone}</dd>
            </div>
            {lead.email && (
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="break-all">{lead.email}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-muted-foreground">Preferred country</dt>
              <dd>{lead.country}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Study level</dt>
              <dd>{lead.studyLevel}</dd>
            </div>
          </dl>
          <div className="mt-5 grid gap-2">
            <a
              href={`https://wa.me/${digits}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-brand-forest-mid px-3 py-2 text-sm font-medium text-white hover:bg-brand-forest"
            >
              <MessageCircle className="size-4" /> WhatsApp
            </a>
            <a href={`tel:${lead.phone}`} className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
              <Phone className="size-4" /> Call
            </a>
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
                <Mail className="size-4" /> Email
              </a>
            )}
          </div>
        </Panel>
      </div>
    </>
  )
}
