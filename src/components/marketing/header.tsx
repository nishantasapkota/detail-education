import Link from "next/link"

import { GoldButton } from "@/components/marketing/gold-button"
import { Logo } from "@/components/marketing/logo"
import { NAV_LINKS } from "@/config/marketing"

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 shadow-[0_1px_10px_rgba(0,0,0,0.03)] backdrop-blur-md transition-colors hover:border-gray-200/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link-draw py-1 transition-colors hover:text-brand-forest">
              {l.label}
            </Link>
          ))}
        </nav>
        <GoldButton href="/#consultation" size="sm">
          Book free counselling
        </GoldButton>
      </div>
    </header>
  )
}
