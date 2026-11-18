"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { createLeadAction } from "@/app/admin/leads/actions"
import { selectClass } from "@/components/admin/cms/field-input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LEAD_COUNTRIES, LEAD_SOURCES, LEAD_STUDY_LEVELS } from "@/lib/validations/lead"

/** Quick form for walk-ins and phone enquiries. */
export function AddLeadButton() {
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [pending, start] = useTransition()
  const router = useRouter()

  const submit = (fd: FormData) =>
    start(async () => {
      const res = await createLeadAction(Object.fromEntries(fd))
      if (!res.success) {
        setErrors(res.error.fieldErrors ?? {})
        toast.error(res.error.message)
        return
      }
      toast.success("Lead added")
      setOpen(false)
      router.push(`/admin/leads/${res.data.id}`)
    })

  const err = (k: string) => errors[k]?.[0] && <p className="text-xs text-destructive">{errors[k][0]}</p>

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus /> Add lead
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a lead</DialogTitle>
          </DialogHeader>
          <form action={submit} className="grid gap-4" noValidate>
            <div className="grid gap-1.5">
              <Label htmlFor="l-name">Full name</Label>
              <Input id="l-name" name="fullName" required aria-invalid={!!errors.fullName || undefined} />
              {err("fullName")}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="l-phone">Mobile (without +977)</Label>
                <Input id="l-phone" name="phone" type="tel" inputMode="numeric" required aria-invalid={!!errors.phone || undefined} />
                {err("phone")}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="l-email">Email (optional)</Label>
                <Input id="l-email" name="email" type="email" aria-invalid={!!errors.email || undefined} />
                {err("email")}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-1.5">
                <Label htmlFor="l-country">Country</Label>
                <select id="l-country" name="country" className={selectClass}>
                  {LEAD_COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="l-level">Level</Label>
                <select id="l-level" name="studyLevel" className={selectClass}>
                  {LEAD_STUDY_LEVELS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="l-source">Source</Label>
                <select id="l-source" name="source" defaultValue="walk-in" className={selectClass}>
                  {LEAD_SOURCES.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Adding…" : "Add lead"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
