"use client"

import { useSearchParams } from "next/navigation"
import { useActionState } from "react"

import { loginAction } from "@/app/(auth)/actions"
import { Field } from "@/components/auth/field"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const callbackUrl = useSearchParams().get("callbackUrl") ?? ""
  const [state, formAction, pending] = useActionState(loginAction, null)

  return (
    <form action={formAction} className="grid gap-4" noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state?.values?.email}
        errors={state?.fieldErrors?.email}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        errors={state?.fieldErrors?.password}
      />
      {state?.message && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  )
}
