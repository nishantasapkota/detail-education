import { MediaImage } from "@/components/ui/media-image"
import type { AboutContent } from "@/services/content.service"

/**
 * A short letter from the CEO: portrait on the left, set against an offset
 * gold block (the same device as the hero), the letter in serif on the right.
 */
export function CeoMessage({ content: c }: { content: AboutContent }) {
  const paragraphs = c.ceoMessage
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  if (paragraphs.length === 0) return null

  const initial = c.ceoName.match(/[A-Za-z]/)?.[0] ?? "D"

  return (
    <section aria-labelledby="ceo-message" className="bg-brand-mint py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-start gap-14 px-6 lg:grid-cols-12 lg:gap-12 lg:px-12">
        <div className="mx-auto w-full max-w-[340px] lg:sticky lg:top-32 lg:col-span-4 lg:mx-0">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-[26px] bg-brand-gold"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-brand-forest">
              {c.ceoPhoto ? (
                <MediaImage
                  src={c.ceoPhoto}
                  alt={c.ceoName}
                  fill
                  sizes="340px"
                  className="object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center font-serif text-[10rem] text-white/10 italic select-none"
                >
                  {initial}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <h2
            id="ceo-message"
            className="font-serif text-3xl tracking-tight text-brand-forest sm:text-4xl"
          >
            {c.ceoHeading}
          </h2>
          <div className="mt-10 max-w-[62ch] font-serif text-[1.1875rem] leading-[1.7] text-brand-charcoal sm:text-xl">
            {c.ceoGreeting && (
              <p className="mb-6 text-brand-forest italic">{c.ceoGreeting}</p>
            )}
            <div className="space-y-6">
              {paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            {(c.ceoSignoff || c.ceoName) && (
              <div className="mt-12 border-t border-brand-forest/15 pt-8">
                {c.ceoSignoff && <p className="text-brand-muted">{c.ceoSignoff}</p>}
                {c.ceoName && (
                  <p className="mt-2 text-[1.75rem] leading-tight text-brand-forest italic">
                    {c.ceoName}
                  </p>
                )}
                {c.ceoRole && (
                  <p className="mt-1 font-sans text-sm text-brand-muted">{c.ceoRole}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
