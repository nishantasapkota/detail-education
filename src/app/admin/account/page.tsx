import type { Metadata } from "next"

import { AccountForm } from "@/components/admin/staff/account-form"
import { PageHeader } from "@/components/admin/page-parts"
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/auth/roles"
import { requireUserOrRedirect } from "@/lib/auth/session"

export const metadata: Metadata = { title: "My account" }

export default async function AccountPage() {
  const me = await requireUserOrRedirect()
  return (
    <>
      <PageHeader
        title="My account"
        description={`${me.email} · ${ROLE_LABELS[me.role]}: ${ROLE_DESCRIPTIONS[me.role]}`}
      />
      <AccountForm name={me.name} />
    </>
  )
}
