"use client"

import { KeyRound, MoreHorizontal, Plus, Trash2, UserX, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import {
  createStaffAction,
  deleteStaffAction,
  resetStaffPasswordAction,
  updateStaffAction,
} from "@/app/admin/staff/actions"
import { selectClass } from "@/components/admin/cms/field-input"
import { formatDate, Panel, StatusPill } from "@/components/admin/page-parts"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES, type Role } from "@/lib/auth/roles"
import { cn } from "@/lib/utils"
import type { StaffRow } from "@/services/staff.service"

export function StaffManager({ staff, meId }: { staff: StaffRow[]; meId: string }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [adding, setAdding] = useState(false)
  const [secret, setSecret] = useState<{ name: string; email?: string; password: string } | null>(null)

  const run = (fn: () => Promise<{ success: boolean; error?: { message: string } }>, ok: string) =>
    start(async () => {
      const res = await fn()
      if (!res.success) return void toast.error(res.error?.message ?? "Something went wrong")
      toast.success(ok)
      router.refresh()
    })

  return (
    <>
      <Panel>
        <div className="flex items-center justify-between border-b p-3 pl-5">
          <p className="text-sm text-muted-foreground">{staff.length} people</p>
          <Button onClick={() => setAdding(true)}>
            <Plus /> Add staff
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-5 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Last sign-in</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => {
                const isMe = s.id === meId
                return (
                  <tr key={s.id} className={cn("border-b last:border-0", !s.active && "opacity-60")}>
                    <td className="px-5 py-3">
                      <span className="font-medium">
                        {s.name} {isMe && <span className="text-xs font-normal text-muted-foreground">(you)</span>}
                      </span>
                      <span className="block text-xs text-muted-foreground">{s.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        aria-label={`Role for ${s.name}`}
                        className={cn(selectClass, "w-40")}
                        defaultValue={s.role}
                        disabled={isMe || pending}
                        title={isMe ? "You can't change your own role" : undefined}
                        onChange={(e) => run(() => updateStaffAction(s.id, { role: e.target.value as Role }), "Role updated")}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={s.active ? "active" : "closed"} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {s.lastLoginAt ? formatDate(s.lastLoginAt, true) : "Never"}
                    </td>
                    <td className="px-2 py-3">
                      {!isMe && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${s.name}`} />}
                          >
                            <MoreHorizontal />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                start(async () => {
                                  const res = await resetStaffPasswordAction(s.id)
                                  if (!res.success) return void toast.error(res.error.message)
                                  setSecret({ name: res.data.name, password: res.data.tempPassword })
                                })
                              }
                            >
                              <KeyRound /> Reset password
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                run(
                                  () => updateStaffAction(s.id, { active: !s.active }),
                                  s.active ? "Deactivated" : "Reactivated"
                                )
                              }
                            >
                              {s.active ? <UserX /> : <UserCheck />} {s.active ? "Deactivate" : "Reactivate"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => {
                                if (window.confirm(`Remove ${s.name}? Deactivating keeps their history; removing deletes the account.`)) {
                                  run(() => deleteStaffAction(s.id), "Removed")
                                }
                              }}
                            >
                              <Trash2 /> Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="mt-6 p-5">
        <h2 className="mb-3 font-medium">Roles</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          {ROLES.map((r) => (
            <div key={r}>
              <dt className="font-medium">{ROLE_LABELS[r]}</dt>
              <dd className="text-muted-foreground">{ROLE_DESCRIPTIONS[r]}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <AddStaffDialog
        open={adding}
        onOpenChange={setAdding}
        onCreated={(name, email, password) => {
          setAdding(false)
          setSecret({ name, email, password })
          router.refresh()
        }}
      />

      <Dialog open={!!secret} onOpenChange={(o) => !o && setSecret(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Temporary password for {secret?.name}</DialogTitle>
            <DialogDescription>
              Share it privately. It is shown only once; ask them to change it from “My account” after signing in.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted p-4 text-center font-mono text-lg tracking-wide select-all">
            {secret?.password}
          </div>
          {secret?.email && <p className="text-sm text-muted-foreground">Sign-in email: {secret.email}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (secret) void navigator.clipboard.writeText(secret.password)
                toast.success("Copied")
              }}
            >
              Copy
            </Button>
            <Button onClick={() => setSecret(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function AddStaffDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onCreated: (name: string, email: string, password: string) => void
}) {
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [pending, start] = useTransition()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a staff member</DialogTitle>
          <DialogDescription>They get a temporary password to sign in with.</DialogDescription>
        </DialogHeader>
        <form
          noValidate
          className="grid gap-4"
          action={(fd) =>
            start(async () => {
              const res = await createStaffAction(Object.fromEntries(fd))
              if (!res.success) {
                setErrors(res.error.fieldErrors ?? {})
                return void toast.error(res.error.message)
              }
              setErrors({})
              onCreated(res.data.user.name, res.data.user.email, res.data.tempPassword)
            })
          }
        >
          <div className="grid gap-1.5">
            <Label htmlFor="s-name">Name</Label>
            <Input id="s-name" name="name" required aria-invalid={!!errors.name || undefined} />
            {errors.name && <p className="text-xs text-destructive">{errors.name[0]}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="s-email">Email</Label>
            <Input id="s-email" name="email" type="email" required aria-invalid={!!errors.email || undefined} />
            {errors.email && <p className="text-xs text-destructive">{errors.email[0]}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="s-role">Role</Label>
            <select id="s-role" name="role" defaultValue="counsellor" className={selectClass}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]} — {ROLE_DESCRIPTIONS[r]}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding…" : "Add staff member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
