import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { formatDate, PageHeader, Panel } from "@/components/admin/page-parts"
import { requireUserOrRedirect } from "@/lib/auth/session"
import { PAGES } from "@/lib/cms/singletons"
import { readSingleton } from "@/services/singleton.service"

export const metadata: Metadata = { title: "Pages" }

export default async function PagesPage() {
  await requireUserOrRedirect("content.manage")
  const pages = await Promise.all(Object.values(PAGES).map(async (def) => ({ def, meta: await readSingleton(def) })))

  return (
    <>
      <PageHeader title="Pages" description="Copy for the home page and legal pages." />
      <div className="grid gap-4 sm:grid-cols-2">
        {pages.map(({ def, meta }) => (
          <Link key={def.key} href={`/admin/pages/${def.key}`} className="group">
            <Panel className="flex h-full flex-col p-5 transition-colors group-hover:border-brand-gold/60">
              <h2 className="font-medium">{def.title}</h2>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{def.description}</p>
              <p className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                {meta.updatedAt ? `Edited ${formatDate(meta.updatedAt)}${meta.updatedByName ? ` by ${meta.updatedByName}` : ""}` : "Not edited yet"}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </p>
            </Panel>
          </Link>
        ))}
      </div>
    </>
  )
}
