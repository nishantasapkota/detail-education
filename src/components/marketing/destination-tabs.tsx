"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"

import { DestinationCard } from "@/components/marketing/destination-card"
import { gsap, REDUCED_MOTION, useGSAP } from "@/components/motion/gsap"
import { cn } from "@/lib/utils"
import type { DestinationDTO, DestinationTab } from "@/types/destination"

type TabId = DestinationTab["id"]

/**
 * Accessible tabs (WAI-ARIA tabs pattern): each tab shows only its
 * destinations, in a one-row carousel (3 cards visible on desktop, 2 on
 * tablet, 1 on phones). Arrow keys / Home / End move between tabs.
 */
export function DestinationTabs({
  tabs,
  destinations,
  heading,
}: {
  tabs: DestinationTab[]
  destinations: DestinationDTO[]
  heading: { title: string; accent: string; intro: string }
}) {
  const visibleTabs = tabs.filter((t) => t.count > 0)
  const [active, setActive] = useState<TabId>("all")
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const rowRef = useRef<HTMLDivElement>(null)

  const items = active === "all" ? destinations : destinations.filter((d) => d.categories.includes(active))
  const tabId = (id: TabId) => `${baseId}-tab-${id}`
  const panelId = `${baseId}-panel`

  // Animate the new set of cards in whenever the tab changes.
  useGSAP(
    () => {
      rowRef.current?.scrollTo({ left: 0 })
      if (window.matchMedia(REDUCED_MOTION).matches) return
      gsap.fromTo(
        "[data-card]",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.07, clearProps: "transform" }
      )
    },
    { scope: rowRef, dependencies: [active], revertOnUpdate: false }
  )

  function select(index: number) {
    const tab = visibleTabs[index]
    if (!tab) return
    setActive(tab.id)
    tabRefs.current[index]?.focus()
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const last = visibleTabs.length - 1
    const next = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[e.key]
    if (next === undefined) return
    e.preventDefault()
    select(next)
  }

  // Carousel edges, so the arrows can disable themselves (and hide when everything fits).
  const [edges, setEdges] = useState({ start: true, end: true })
  const syncEdges = useCallback(() => {
    const row = rowRef.current
    if (!row) return
    const max = row.scrollWidth - row.clientWidth
    setEdges({ start: row.scrollLeft <= 4, end: row.scrollLeft >= max - 4 })
  }, [])

  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    syncEdges()
    row.addEventListener("scroll", syncEdges, { passive: true })
    const observer = new ResizeObserver(syncEdges)
    observer.observe(row)
    return () => {
      row.removeEventListener("scroll", syncEdges)
      observer.disconnect()
    }
  }, [syncEdges, active])

  /**
   * Moves exactly one card: scrolls to the next (or previous) card's start.
   * Targeting a real card edge avoids scroll-snap overshooting a fixed distance.
   */
  const scroll = (dir: 1 | -1) => {
    const row = rowRef.current
    if (!row) return
    const cards = Array.from(row.querySelectorAll<HTMLElement>("[data-card]"))
    const origin = cards[0]?.offsetLeft ?? 0
    const starts = cards.map((c) => c.offsetLeft - origin)
    const current = row.scrollLeft
    const target =
      dir > 0 ? starts.find((s) => s > current + 4) : [...starts].reverse().find((s) => s < current - 4)
    if (target === undefined) return
    row.scrollTo({ left: Math.min(target, row.scrollWidth - row.clientWidth), behavior: "smooth" })
  }
  const fits = edges.start && edges.end

  return (
    <>
      <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <h2 className="font-serif text-4xl leading-[1.1] font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-[56px]">
            {heading.title} {heading.accent && <span className="font-normal text-amber-700 italic">{heading.accent}</span>}
          </h2>
          <p className="mt-3.5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            {heading.intro}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-4">
          <div
            role="tablist"
            aria-label="Destination categories"
            className="no-scrollbar inline-flex max-w-full items-center overflow-x-auto rounded-full border border-gray-200/80 bg-gray-100/90 p-1 text-xs font-medium"
          >
            {visibleTabs.map((t, i) => {
              const selected = t.id === active
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  id={tabId(t.id)}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(t.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 whitespace-nowrap transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-gold active:scale-95",
                    selected ? "bg-stone-900 font-semibold text-white shadow-xs" : "text-gray-700 hover:bg-white/60 hover:text-stone-900"
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[10px] tabular-nums",
                      selected ? "bg-white/15 text-white/80" : "bg-gray-200/80 text-gray-500"
                    )}
                  >
                    {t.count}
                  </span>
                </button>
              )
            })}
          </div>
          <div className={cn("flex items-center gap-2", fits && "invisible")} aria-hidden={fits || undefined}>
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                aria-label={dir < 0 ? "Previous destination" : "Next destination"}
                aria-controls={panelId}
                disabled={dir < 0 ? edges.start : edges.end}
                onClick={() => scroll(dir)}
                className="flex size-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-all duration-200 hover:border-stone-900 hover:text-stone-900 active:scale-90 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-gray-300 disabled:hover:text-gray-700"
              >
                {dir < 0 ? "←" : "→"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={rowRef}
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(active)}
        aria-roledescription="carousel"
        // Padding inside the scroller leaves room for the hover lift and shadow,
        // which overflow clipping would otherwise cut off.
        className="no-scrollbar -mx-6 -my-4 flex snap-x snap-mandatory scroll-px-6 items-start gap-6 overflow-x-auto overscroll-x-contain px-6 py-4 pb-12 md:mx-0 md:scroll-px-0 md:px-0 lg:gap-8"
      >
        {items.map((d, i) => (
          <DestinationCard key={d.slug} destination={d} index={i} />
        ))}
      </div>
    </>
  )
}
