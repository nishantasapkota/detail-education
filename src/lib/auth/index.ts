import "server-only"

import NextAuth from "next-auth"
import type { Provider } from "next-auth/providers"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

import { authConfig } from "@/lib/auth/config"
import { isGoogleAuthEnabled } from "@/lib/env"
import { loginSchema } from "@/lib/validations/auth"
import { findActiveStaffByEmail, verifyCredentials } from "@/services/user.service"

const providers: Provider[] = [
  Credentials({
    credentials: { email: {}, password: {} },
    async authorize(raw) {
      const parsed = loginSchema.safeParse(raw)
      if (!parsed.success) return null
      return verifyCredentials(parsed.data)
    },
  }),
]

// Google is optional: it only shows up when both env vars are set.
if (isGoogleAuthEnabled()) {
  providers.push(Google) // reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  callbacks: {
    ...authConfig.callbacks,
    /** Staff only: Google accounts must match an existing, active staff email. */
    async signIn({ account, user }) {
      if (account?.provider !== "google") return true
      return Boolean(user.email && (await findActiveStaffByEmail(user.email)))
    },
    async jwt({ token, user, account }) {
      // Map the Google profile to our own Mongo user id.
      if (account?.provider === "google" && user?.email) {
        const staff = await findActiveStaffByEmail(user.email)
        if (staff) token.id = staff.id
        return token
      }
      return authConfig.callbacks.jwt({ token, user })
    },
  },
})
