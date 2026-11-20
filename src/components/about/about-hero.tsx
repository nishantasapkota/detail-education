import { Check, ChevronRight, House, Sparkle } from "lucide-react"
import Link from "next/link"

import { GoldButton } from "@/components/marketing/gold-button"
import { WhatsAppIcon } from "@/components/marketing/whatsapp-icon"
import { MediaImage } from "@/components/ui/media-image"
import type { AboutContent, BusinessContent } from "@/services/content.service"

/** "Big moves are made *of small details.*" → the plain lead and the gold line. */
function splitTitle(title: string) {
  const match = title.match(/^(.*?)\*([^*]+)\*(.*)$/)
  if (!match) return { lead: title, accent: "" }
  return { lead: `${match[1]}${match[3]}`.trim(), accent: match[2].trim() }
}

const SOCIAL_ICONS = {
  facebook: <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V21M6 11h8" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
    </>
  ),
  tiktok: (
    <>
      <path d="M13 3v12.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M13 3c.5 2.8 2.6 4.6 5.5 4.8" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor" />
    </>
  ),
} as const

const SOCIAL_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
} as const

/**
 * About page opening: copy on the left; on the right a cut-out student photo
 * standing in front of a gold block, with the social card and a note floating
 * around it. The photo hangs below the green band into the checklist section.
 */
export function AboutHero({
  content: c,
  business,
}: {
  content: AboutContent
  business: BusinessContent
}) {
  const { lead, accent } = splitTitle(c.heroTitle)
  const socials = (Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[]).filter(
    (k) => business[k]
  )

  return (
    <section className="relative z-10 bg-brand-forest text-[#F5F1E8]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgb(227_157_72/0.14)_0%,transparent_55%)]"
      />
      <div className="relative mx-auto max-w-7xl px-6 pt-10 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2.5 text-sm text-emerald-100/70"
        >
          <Link
            href="/"
            aria-label="Home"
            className="inline-flex rounded transition-colors hover:text-white"
          >
            <House aria-hidden className="size-[18px]" strokeWidth={1.8} />
          </Link>
          <ChevronRight aria-hidden className="size-3.5" />
          <span aria-current="page" className="font-semibold text-[#F5F1E8]">
            About us
          </span>
        </nav>

        <div className="mt-10 flex flex-wrap items-end gap-x-12 gap-y-8">
          <div className="min-w-0 flex-[1_1_500px] pb-12 lg:pb-[88px]">
            {c.heroBadge && (
              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-[18px] py-2 text-sm font-medium text-[#f0c78f]">
                <Sparkle
                  aria-hidden
                  className="size-4 text-brand-gold"
                  strokeWidth={1.8}
                />
                {c.heroBadge}
              </p>
            )}
            <h1 className="mt-7 font-serif text-[clamp(3rem,5.6vw,5rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-balance">
              <span className="block">{lead}</span>
              {accent && (
                <span className="block font-medium text-brand-gold italic">{accent}</span>
              )}
            </h1>
            <p className="mt-7 max-w-[46ch] text-lg leading-relaxed text-pretty text-emerald-100/80 lg:text-[19px]">
              {c.heroIntro}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <GoldButton href="/#consultation">{c.visitCta}</GoldButton>
              <Link
                href="#team"
                className="inline-flex min-h-12 items-center rounded-full border border-white/25 px-7 text-sm font-medium text-[#F5F1E8] transition-colors hover:border-white/50 hover:bg-white/10"
              >
                Meet the team
              </Link>
            </div>
          </div>

          {/* The stage keeps the composition at 540 × 600 and scales down on phones. */}
          <div className="flex min-w-0 flex-[1_1_460px] justify-center">
            <div className="relative -my-[120px] h-[600px] w-[540px] shrink-0 scale-[0.6] sm:my-0 sm:scale-100">
              <div
                aria-hidden
                className="absolute top-[240px] left-[322px] h-[360px] w-[270px] rounded-[26px] bg-[#f5f1e8]"
              />
              <div
                aria-hidden
                className="absolute top-[30px] left-[286px] h-[540px] w-[200px] rounded-[26px] bg-brand-gold"
              />
              <div
                aria-hidden
                className="absolute top-[380px] left-[120px] size-[150px] rounded-full border-[1.5px] border-brand-gold/55"
              />
              <svg
                aria-hidden
                width="230"
                height="120"
                viewBox="0 0 230 120"
                className="absolute top-[250px] -left-10 z-30"
              >
                <path
                  d="M8 104 C 60 110, 90 60, 140 66 S 190 40, 196 22"
                  fill="none"
                  stroke="rgb(245 241 232 / 0.45)"
                  strokeWidth="2"
                  strokeDasharray="5 7"
                  strokeLinecap="round"
                />
                <g transform="translate(186 6) rotate(-18)">
                  <path d="M0 18 L36 0 L22 34 L16 22 Z" fill="#f5f1e8" />
                  <path d="M16 22 L36 0" stroke="#0d271f" strokeWidth="1.4" />
                  <path d="M16 22 L14 32 L22 34" fill="#d8cfbd" />
                </g>
              </svg>

              {c.heroImage && (
                <>
                  {/* Her own outline, filled dark and nudged right: a silhouette cast on the blocks behind her.
                    It fades out before the green band ends, so it never greys the light section below. */}
                  <div
                    aria-hidden
                    className="absolute -bottom-[55px] left-[106px] z-10 h-[654px] w-[407px] -translate-y-1.5 [mask-image:linear-gradient(to_bottom,#000_72%,transparent_90%)]"
                  >
                    <MediaImage
                      src={c.heroImage}
                      alt=""
                      fill
                      sizes="407px"
                      className="object-cover object-top opacity-45 brightness-0"
                    />
                  </div>
                  <div className="absolute -bottom-[55px] left-[78px] z-20 h-[654px] w-[407px] [mask-image:linear-gradient(to_bottom,#000_91%,transparent_100%)]">
                    <MediaImage
                      src={c.heroImage}
                      alt="A smiling student holding a stack of books"
                      fill
                      priority
                      sizes="407px"
                      className="object-cover object-top"
                    />
                  </div>
                </>
              )}

              <div className="absolute top-0 left-0 z-30 rounded-[18px] bg-white px-[18px] py-4 text-brand-forest shadow-[0_24px_50px_-18px_rgb(0_0_0/0.45)]">
                <p className="font-serif text-[22px] leading-tight font-semibold">
                  Follow our students
                </p>
                <ul className="mt-3 flex gap-2">
                  {socials.map((k) => (
                    <li key={k}>
                      <a
                        href={business[k]!}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={SOCIAL_LABELS[k]}
                        className="flex size-11 items-center justify-center rounded-full bg-brand-forest text-[#F5F1E8] transition-transform hover:-translate-y-0.5"
                      >
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          className="size-[18px]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {SOCIAL_ICONS[k]}
                        </svg>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href={business.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="flex size-11 items-center justify-center rounded-full bg-brand-gold text-brand-forest transition-transform hover:-translate-y-0.5"
                    >
                      <WhatsAppIcon className="size-[18px]" />
                    </a>
                  </li>
                </ul>
              </div>

              {c.heroNote && (
                <p className="absolute right-0 bottom-[60px] z-30 flex max-w-[220px] items-center gap-2.5 rounded-[14px] border border-white/15 bg-brand-forest px-4 py-3 text-[13px] leading-snug shadow-[0_18px_40px_-16px_rgb(0_0_0/0.55)]">
                  <span
                    aria-hidden
                    className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold"
                  >
                    <Check className="size-3.5" strokeWidth={2.4} />
                  </span>
                  {c.heroNote}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
