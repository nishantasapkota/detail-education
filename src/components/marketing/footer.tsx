import Link from "next/link"

import { getBusiness } from "@/services/content.service"

const EXPLORE = [
  { href: "/#destinations", label: "Destinations" },
  { href: "/#testprep", label: "Test preparation" },
  { href: "/#stories", label: "Success stories" },
  { href: "/journal", label: "Insights & guides" },
  { href: "/#about", label: "About us" },
]

const SOCIALS = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
  { key: "linkedin", label: "LinkedIn" },
] as const

export async function MarketingFooter() {
  const b = await getBusiness()
  const socials = SOCIALS.filter((s) => b[s.key])

  return (
    <footer className="border-t border-gray-100 bg-white py-16 text-xs text-gray-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="space-y-3 md:col-span-5">
            <p className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-brand-forest uppercase">Detail</span>
              <span className="text-[10px] text-gray-400">Education Consultancy</span>
            </p>
            <p className="max-w-sm leading-relaxed">{b.tagline}</p>
            {socials.length > 0 && (
              <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-2">
                {socials.map((s) => (
                  <li key={s.key}>
                    <a href={b[s.key]!} target="_blank" rel="noopener noreferrer" className="hover:text-brand-forest">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <nav className="space-y-2.5 md:col-span-3" aria-label="Explore">
            <h2 className="font-semibold tracking-wider text-brand-forest uppercase">Explore</h2>
            <ul className="space-y-2">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-brand-forest">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-2.5 md:col-span-4">
            <h2 className="font-semibold tracking-wider text-brand-forest uppercase">Let&apos;s connect</h2>
            <ul className="space-y-2">
              <li>{b.address}</li>
              {b.phone && (
                <li>
                  <a href={`tel:${b.phone}`} className="hover:text-brand-forest">
                    {b.phone}
                  </a>
                </li>
              )}
              {b.email && (
                <li>
                  <a href={`mailto:${b.email}`} className="hover:text-brand-forest">
                    {b.email}
                  </a>
                </li>
              )}
              <li>
                <a href={b.whatsappUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand-forest">
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <Link href="/#consultation" className="transition-colors hover:text-brand-forest">
                  Arrange an office visit
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-100 pt-12 text-[11px] text-gray-400">
          <span className="mr-auto">
            © <CopyrightYear /> {b.name}. All rights reserved.
          </span>
          <Link href="/privacy" className="hover:text-brand-forest">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-brand-forest">
            Terms
          </Link>
          <Link href="/login" className="hover:text-brand-forest">
            Staff login
          </Link>
        </div>
      </div>
    </footer>
  )
}

/** Cached so the static shell can include it; refreshes when the cache does. */
async function CopyrightYear() {
  "use cache"
  return new Date().getFullYear()
}
