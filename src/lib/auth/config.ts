import type { NextAuthConfig } from "next-auth"

import { PROTECTED_PREFIXES, ROUTES } from "@/config/site"

/**
 * Lightweight Auth.js config shared by `src/proxy.ts` and the full setup in
 * `./index.ts`. It must not import the database, bcrypt or any provider that
 * needs them, because the proxy runs before every matched request and should
 * stay fast. Providers are added in `./index.ts`.
 */
export const authConfig = {
  pages: { signIn: ROUTES.login },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  trustHost: true, // Required on Vercel, where the host comes from the proxy.
  providers: [],
  callbacks: {
    /** Optimistic route check used by the proxy (cookie only, no DB). */
    authorized({ auth, request: { nextUrl } }) {
      const isProtected = PROTECTED_PREFIXES.some((p) => nextUrl.pathname.startsWith(p))
      // false -> redirect to pages.signIn. The login page is never redirected
      // here: a cookie can outlive its account (deleted/deactivated staff), so
      // only the login page itself, which checks the database, may bounce.
      return isProtected ? Boolean(auth?.user) : true
    },
    jwt({ token, user }) {
      if (user?.id) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token.id && session.user) session.user.id = token.id as string
      return session
    },
  },
} satisfies NextAuthConfig
