import "jodit/es2021/jodit.min.css"

import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { PageSkeleton } from "@/components/admin/page-parts"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { ROUTES } from "@/config/site"
import { getCurrentUser } from "@/lib/auth/session"

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Detail admin" },
  robots: { index: false, follow: false },
}

/**
 * Admin shell. The session read sits behind Suspense so the frame streams
 * instantly; every page still checks its own permission (see requireUserOrRedirect).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-muted/40">
      <Suspense fallback={<aside className="hidden w-64 shrink-0 bg-brand-forest-dark lg:block" />}>
        <Chrome>{children}</Chrome>
      </Suspense>
    </div>
  )
}

async function Chrome({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect(ROUTES.login)

  return (
    <>
      <AdminSidebar role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar user={{ name: user.name, email: user.email, role: user.role }} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
            <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
          </div>
        </main>
      </div>
    </>
  )
}
