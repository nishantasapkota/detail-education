import type { Metadata } from "next"

import { PageHeader } from "@/components/admin/page-parts"
import { StaffManager } from "@/components/admin/staff/staff-manager"
import { requireUserOrRedirect } from "@/lib/auth/session"
import { listStaff } from "@/services/staff.service"

export const metadata: Metadata = { title: "Staff" }

export default async function StaffPage() {
  const me = await requireUserOrRedirect("users.manage")
  const staff = await listStaff()
  return (
    <>
      <PageHeader title="Staff" description="Who can sign in to this admin, and what each person can do." />
      <StaffManager staff={staff} meId={me.id} />
    </>
  )
}
