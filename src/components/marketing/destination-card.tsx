import Link from "next/link"

import { MediaImage } from "@/components/ui/media-image"
import { cn } from "@/lib/utils"
import type { DestinationDTO } from "@/types/destination"

/** Staggered heights/offsets from the design, by column (desktop only). */
const COLUMN_LAYOUT = ["md:min-h-[560px]", "md:min-h-[500px] md:mt-10", "md:min-h-[460px] md:mt-20"]

export function DestinationCard({ destination: d, index }: { destination: DestinationDTO; index: number }) {
  return (
    <article
      data-card
      className={cn(
        "card-shimmer group relative flex min-h-[480px] w-[85vw] shrink-0 snap-start sm:w-[380px] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)] flex-col justify-between overflow-hidden rounded-[28px] border border-white/5 bg-stone-900 p-7 text-white shadow-xl transition-[translate,box-shadow,border-color] duration-500 ease-out hover:-translate-y-2 hover:border-white/20 hover:shadow-2xl hover:shadow-stone-900/25",
        COLUMN_LAYOUT[index % 3]
      )}
    >
      {d.image ? (
        <MediaImage
          src={d.image}
          alt={d.imageAlt}
          fill
          sizes="(min-width: 768px) 33vw, 85vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        // No photo yet: a branded placeholder instead of a broken image.
        <div aria-hidden className="absolute inset-0 bg-brand-forest">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgb(227_157_72/0.28),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:32px_32px]" />
          <span className="absolute -top-6 -right-4 font-serif text-[11rem] leading-none text-white/[0.06] italic transition-transform duration-700 group-hover:scale-105">
            {d.name[0]}
          </span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/20" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px]",
              d.featured
                ? "bg-amber-600 font-bold tracking-wider text-white uppercase shadow-md"
                : "border border-white/20 bg-stone-900/70 font-medium tracking-wide text-white/95 backdrop-blur-md"
            )}
          >
            {d.badge}
          </span>
          <span className="mt-0.5 font-mono text-[11px] tracking-tight text-white/70">{d.coords}</span>
        </div>
        <span className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-stone-900/70 font-serif text-xs font-bold backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400/50">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative z-10 mt-auto pt-8">
        <div className="mb-2 flex flex-wrap items-center">
          <span className="font-serif text-sm font-medium text-amber-300 italic">{d.kicker}</span>
          {d.meta && (
            <>
              <span className="mx-2 text-xs text-white/40">•</span>
              <span className="text-xs font-medium text-white/80">{d.meta}</span>
            </>
          )}
        </div>
        <h3
          className={cn(
            "mb-2.5 font-serif font-semibold tracking-tight transition-colors group-hover:text-amber-100",
            d.featured ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
          )}
        >
          {d.name}
        </h3>
        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-stone-300 sm:text-sm">{d.body}</p>
        {d.intakes.length > 0 && (
          <p className="mb-4 text-[11px] leading-relaxed text-stone-300">
            <span className="font-semibold text-amber-200">Intakes</span>
            <span aria-hidden> · </span>
            {d.intakes.join(" · ")}
          </p>
        )}
        <div className="mb-5 flex flex-wrap gap-2">
          {d.chips.map((c) => (
            <span key={c} className="rounded-md border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-sm">
              {c}
            </span>
          ))}
        </div>
        {d.featured ? (
          <Link
            href="/#consultation"
            className="group/btn flex w-full items-center justify-between rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-950 shadow-md transition-all duration-300 hover:bg-amber-50 hover:shadow-lg active:scale-[0.98]"
          >
            {d.cta}
            <span className="text-base font-bold transition-transform duration-300 group-hover/btn:translate-x-2">→</span>
          </Link>
        ) : (
          <Link
            href="/#consultation"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-300 transition-all duration-200 group-hover:translate-x-1.5 hover:text-white"
          >
            {d.cta} <span className="text-base font-bold">→</span>
          </Link>
        )}
      </div>
    </article>
  )
}
