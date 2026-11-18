"use server"

import { AuthError } from "next-auth"
import { z } from "zod"

import { ROUTES } from "@/config/site"
import type { FieldErrors } from "@/lib/api/errors"
import { assertRateLimit } from "@/lib/api/rate-limit"
import { signIn, signOut } from "@/lib/auth"
import { safeRedirect } from "@/lib/safe-redirect"
import { loginSchema } from "@/lib/validations/auth"

export type AuthFormState = {
  message?: string
  fieldErrors?: FieldErrors
  /** Echoed back so the form keeps what the user typed (never passwords). */
  values?: { email?: string }
} | null

const str = (fd: FormData, key: string) => {
  const v = fd.get(key)
  return typeof v === "string" ? v : ""
}

export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const raw = { email: str(formData, "email"), password: str(formData, "password") }
  const values = { email: raw.email }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { values, fieldErrors: z.flattenError(parsed.error).fieldErrors as FieldErrors }
  }

  await assertRateLimit(`login:${parsed.data.email}`)
  try {
    // On success this throws Next's redirect signal, which must propagate.
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: safeRedirect(formData.get("callbackUrl"), ROUTES.dashboard),
    })
    return null
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        values,
        message:
          error.type === "CredentialsSignin"
            ? "Invalid email or password"
            : "Could not sign you in. Please try again.",
      }
    }
    throw error
  }
}

export async function googleSignInAction(formData: FormData) {
  await signIn("google", { redirectTo: safeRedirect(formData.get("callbackUrl"), ROUTES.dashboard) })
}

export async function signOutAction() {
  await signOut({ redirectTo: ROUTES.login })
}
