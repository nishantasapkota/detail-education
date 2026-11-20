import { MediaImage } from "@/components/ui/media-image"
import type { Partner } from "@/services/content.service"

/**
 * Endless row of partner logos. The list is rendered twice and the track slides
 * by half its width, so the loop is seamless. Pauses on hover/focus and stops
 * under reduced motion (then the row simply scrolls by hand).
 */
export function PartnerMarquee({ kicker, title, partners }: { kicker: string; title: string; partners: Partner[] }) {
  // Short lists repeat so the track always overflows the viewport.
  const base = Array.from({ length: Math.max(1, Math.ceil(8 / partners.length)) }, () => partners).flat()
  const duration = `${Math.max(20, base.length * 4)}s`

  return (
    <section aria-labelledby="partners-title" className="border-b border-gray-100 bg-white py-14">
      <div className="mx-auto mb-8 max-w-7xl px-6 text-center lg:px-12">
        <span className="mb-2 block text-[11px] font-semibold tracking-wider text-brand-gold uppercase">{kicker}</span>
        <h2 id="partners-title" className="font-serif text-2xl font-normal tracking-tight text-brand-forest sm:text-3xl">
          {title}
        </h2>
      </div>

      <div className="group relative overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <ul
          className="flex w-max animate-marquee items-center group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ animationDuration: duration }}
        >
          {[0, 1].map((copy) =>
            base.map((p, i) => (
              <li key={`${copy}-${p.id}-${i}`} aria-hidden={copy === 1 || i >= partners.length || undefined} className="shrink-0 px-6 sm:px-10">
                <PartnerLogo partner={p} focusable={copy === 0 && i < partners.length} />
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  )
}

function PartnerLogo({ partner: p, focusable }: { partner: Partner; focusable: boolean }) {
  const mark = p.logo ? (
    <MediaImage
      src={p.logo}
      alt={p.name}
      width={160}
      height={64}
      className="h-12 w-auto max-w-[160px] object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-14"
    />
  ) : (
    <span className="block font-serif text-lg whitespace-nowrap text-gray-400 transition-colors duration-300 hover:text-brand-forest sm:text-xl">
      {p.name}
    </span>
  )

  if (!p.website) return <span title={p.name}>{mark}</span>
  return (
    <a href={p.website} target="_blank" rel="noopener noreferrer" title={p.name} tabIndex={focusable ? undefined : -1} className="block rounded-md focus-visible:outline-2 focus-visible:outline-brand-gold">
      {mark}
    </a>
  )
}
