"use client"

import { ExternalLink, LogOut, Menu, UserRound } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { signOutAction } from "@/app/(auth)/actions"
import { AdminBrand, AdminNav } from "@/components/admin/sidebar"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ROLE_LABELS, type Role } from "@/lib/auth/roles"

type Props = { user: { name: string; email: string; role: Role } }

export function AdminTopbar({ user }: Props) {
  const [open, setOpen] = useState(false)
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 lg:px-8">
      <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
        <Menu />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 border-none bg-brand-forest-dark p-0 text-white">
          <SheetTitle className="sr-only">Admin menu</SheetTitle>
          <div className="flex h-16 items-center border-b border-white/10 px-6">
            <AdminBrand />
          </div>
          <div className="overflow-y-auto">
            <AdminNav role={user.role} onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="ml-auto flex items-center gap-1">
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
        >
          View site <ExternalLink className="size-3.5" />
        </Link>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="ml-1 flex items-center gap-2 rounded-full p-0.5 pr-2 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              />
            }
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-brand-forest text-xs font-semibold text-white">
              {initials || <UserRound className="size-4" />}
            </span>
            <span className="hidden text-left text-sm leading-tight sm:block">
              <span className="block font-medium">{user.name}</span>
              <span className="block text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <span className="block text-sm font-medium">{user.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/admin/account" />}>
              <UserRound /> My account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => void signOutAction()}>
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
