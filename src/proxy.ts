import NextAuth from "next-auth"

import { authConfig } from "@/lib/auth/config"

/**
 * Route protection (Next.js 16 renamed `middleware.ts` to `proxy.ts`).
 *
 * Uses the DB-free auth config, so this only decodes the session cookie and
 * runs `callbacks.authorized`. It is an optimistic check for fast redirects —
 * real authorization happens in the service/DAL layer (see lib/auth/session.ts).
 */
const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  // Run on pages only: skip API routes, Next internals and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)"],
}
