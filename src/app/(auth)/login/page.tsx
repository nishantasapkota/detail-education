import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { Divider } from "@/components/auth/divider"
import { GoogleButton } from "@/components/auth/google-button"
import { LoginForm } from "@/components/auth/login-form"
import { Skeleton } from "@/components/ui/skeleton"
import { ROUTES } from "@/config/site"
import { getCurrentUser } from "@/lib/auth/session"
import { isGoogleAuthEnabled } from "@/lib/env"

export const metadata: Metadata = { title: "Staff sign in", robots: { index: false } }

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="font-serif text-3xl text-brand-forest">Staff sign in</h1>
      <p className="mt-1 mb-6 text-sm text-gray-500">For Detail counsellors and editors.</p>
      {/* The forms read ?callbackUrl, which is request data. */}
      <Suspense fallback={<Skeleton className="h-56 w-full" />}>
        <div className="grid gap-4">
          {isGoogleAuthEnabled() && (
            <>
              <GoogleButton />
              <Divider label="or" />
            </>
          )}
          <LoginForm />
        </div>
      </Suspense>
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
      <p className="mt-6 text-center text-xs text-gray-400">
        No account? Ask an admin to add you.
      </p>
    </div>
  )
}

/** Already signed in with a live account? Go straight to the admin. */
async function RedirectIfSignedIn() {
  if (await getCurrentUser()) redirect(ROUTES.dashboard)
  return null
}
