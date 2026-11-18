import type { Metadata } from "next"

import { SingletonForm } from "@/components/admin/cms/singleton-form"
import { formatDate, PageHeader } from "@/components/admin/page-parts"
import { requireUserOrRedirect } from "@/lib/auth/session"
import { business } from "@/lib/cms/singletons"
import { readSingleton } from "@/services/singleton.service"

export const metadata: Metadata = { title: "Business details" }

export default async function BusinessPage() {
  await requireUserOrRedirect(business.permission)
  const { values, updatedAt, updatedByName } = await readSingleton(business)
  return (
    <>
      <PageHeader
        title="Business details"
        description={updatedAt ? `Last edited ${formatDate(updatedAt, true)}${updatedByName ? ` by ${updatedByName}` : ""}` : business.description}
      />
      <SingletonForm singletonKey="business" values={values} />
    </>
  )
}
