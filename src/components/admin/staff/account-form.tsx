"use client"

import { useRouter } from "next/navigation"
import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"

import { updateAccountAction } from "@/app/admin/account/actions"
import { Panel } from "@/components/admin/page-parts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AccountForm({ name }: { name: string }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [pending, start] = useTransition()
  const err = (k: string) => errors[k]?.[0] && <p className="text-xs text-destructive">{errors[k][0]}</p>

  return (
    <Panel className="max-w-xl p-5">
      <form
        ref={formRef}
        noValidate
        className="grid gap-5"
        action={(fd) =>
          start(async () => {
            const res = await updateAccountAction(Object.fromEntries(fd))
            if (!res.success) {
              setErrors(res.error.fieldErrors ?? {})
              return void toast.error(res.error.message)
            }
            setErrors({})
            toast.success(res.data.passwordChanged ? "Saved. Your password is changed." : "Saved")
            for (const k of ["currentPassword", "newPassword"]) {
              const input = formRef.current?.elements.namedItem(k) as HTMLInputElement | null
              if (input) input.value = ""
            }
            router.refresh()
          })
        }
      >
        <div className="grid gap-1.5">
          <Label htmlFor="a-name">Name</Label>
          <Input id="a-name" name="name" defaultValue={name} required autoComplete="name" />
          {err("name")}
        </div>
        <fieldset className="grid gap-4 border-t pt-5">
          <legend className="mb-1 text-sm font-medium">Change password (optional)</legend>
          <div className="grid gap-1.5">
            <Label htmlFor="a-current">Current password</Label>
            <Input id="a-current" name="currentPassword" type="password" autoComplete="current-password" />
            {err("currentPassword")}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="a-new">New password</Label>
            <Input id="a-new" name="newPassword" type="password" autoComplete="new-password" />
            <p className="text-xs text-muted-foreground">At least 8 characters, with a letter and a number.</p>
            {err("newPassword")}
          </div>
        </fieldset>
        <div>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Panel>
  )
}
