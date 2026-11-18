"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Reveal } from "@/components/motion/reveal"
import { MediaImage } from "@/components/ui/media-image"
import { cn } from "@/lib/utils"
import type { Testimonial } from "@/services/content.service"

const GAP = 24

export function Testimonials({ kicker, title, items }: { kicker: string; title: string; items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    setAtStart(track.scrollLeft <= 8)
    setAtEnd(track.scrollLeft >= max - 8)
    const cards = Array.from(track.children) as HTMLElement[]
    let closest = 0
    cards.forEach((c, i) => {
      if (Math.abs(c.offsetLeft - track.scrollLeft) < Math.abs(cards[closest].offsetLeft - track.scrollLeft)) closest = i
    })
    setIndex(closest)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(sync)
    }
    sync()
    track.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [sync])

  const step = (dir: 1 | -1) => {
    const track = trackRef.current
    const card = track?.firstElementChild as HTMLElement | null
    track?.scrollBy({ left: dir * ((card?.offsetWidth ?? 360) + GAP), behavior: "smooth" })
  }

  const goTo = (i: number) => {
    const track = trackRef.current
    const card = track?.children[i] as HTMLElement | undefined
    if (track && card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" })
  }

  const arrow =
    "flex size-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-xs transition-all duration-200 hover:border-brand-forest hover:text-brand-forest active:scale-90 disabled:cursor-not-allowed disabled:opacity-35"

  return (
    <section id="stories" className="scroll-mt-20 border-t border-gray-100 bg-brand-cream/30 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <Reveal className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="mb-2 block text-[11px] font-semibold tracking-wider text-brand-gold uppercase">{kicker}</span>
            <h2 className="font-serif text-3xl font-normal tracking-tight text-brand-forest sm:text-4xl">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Previous testimonial" disabled={atStart} onClick={() => step(-1)} className={arrow}>
              ‹
            </button>
            <button type="button" aria-label="Next testimonial" disabled={atEnd} onClick={() => step(1)} className={arrow}>
              ›
            </button>
          </div>
        </Reveal>

        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pt-1 pb-4"
          aria-roledescription="carousel"
        >
          {items.map((t) => (
            <figure
              key={t.id}
              className="flex w-[88vw] shrink-0 snap-start flex-col justify-between rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-[360px] lg:w-[380px]"
            >
              <div>
                <span aria-hidden className="mb-4 block font-serif text-4xl leading-none text-brand-gold">
                  “
                </span>
                <blockquote className="mb-6 text-xs leading-relaxed text-gray-600 sm:text-sm">{t.quote}</blockquote>
              </div>
              <figcaption className="flex items-center gap-3 border-t border-gray-50 pt-4">
                {t.photo ? (
                  <MediaImage src={t.photo} alt="" width={32} height={32} className="size-8 rounded-full object-cover" />
                ) : (
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-forest font-serif text-xs font-bold text-white">
                    {t.name[0]}
                  </span>
                )}
                <span>
                  <span className="block text-xs font-bold text-brand-forest">{t.name}</span>
                  <span className="block text-[11px] text-gray-400">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="order-2 text-center text-[11px] text-gray-400 sm:order-1 sm:text-left">
            {items.some((t) => !t.verified) && "Some stories are illustrative and are being verified with students."}
          </p>
          <div className="order-1 flex items-center gap-2 sm:order-2">
            {items.map((t, i) => (
              <button
                key={t.id}
                type="button"
                aria-label={`Go to story ${i + 1}`}
                aria-current={index === i}
                onClick={() => goTo(i)}
                className={cn(
                  "size-2.5 rounded-full transition-all",
                  index === i ? "w-6 bg-brand-forest" : "bg-gray-300 hover:bg-gray-400"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
