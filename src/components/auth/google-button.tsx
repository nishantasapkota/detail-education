"use client"

import { useSearchParams } from "next/navigation"

import { googleSignInAction } from "@/app/(auth)/actions"
import { Button } from "@/components/ui/button"

export function GoogleButton() {
  const callbackUrl = useSearchParams().get("callbackUrl") ?? ""
  return (
    <form action={googleSignInAction}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <Button type="submit" variant="outline" size="lg" className="w-full">
        Continue with Google
      </Button>
    </form>
  )
}
