"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { navForRole } from "@/components/admin/nav"
import type { Role } from "@/lib/auth/roles"
import { cn } from "@/lib/utils"

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`)
}

/** Role-filtered navigation. Used in the desktop rail and the mobile drawer. */
export function AdminNav({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-6 px-3 py-4" aria-label="Admin">
      {navForRole(role).map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-widest text-white/40 uppercase">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-white/10 font-medium text-white"
                        : "text-white/65 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0", active ? "text-brand-gold" : "text-white/45")} />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function AdminBrand() {
  return (
    <Link href="/admin" className="flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand-gold font-serif text-xl font-bold text-brand-forest">
        D
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold tracking-wider text-white uppercase">Detail</span>
        <span className="block text-[10px] tracking-widest text-white/50 uppercase">Admin</span>
      </span>
    </Link>
  )
}

export function AdminSidebar({ role }: { role: Role }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto bg-brand-forest-dark lg:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-6">
        <AdminBrand />
      </div>
      <AdminNav role={role} />
    </aside>
  )
}
