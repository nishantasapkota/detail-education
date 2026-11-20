"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { ChevronDown, SlidersHorizontal } from "lucide-react"

import { DestinationCard } from "@/components/marketing/destination-card"
import { gsap, REDUCED_MOTION, useGSAP } from "@/components/motion/gsap"
import { cn } from "@/lib/utils"
import type { DestinationDTO, DestinationTab } from "@/types/destination"

type TabId = DestinationTab["id"]
const INTAKE_ORDER = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const INTAKE_ORDER_INDEX = new Map(INTAKE_ORDER.map((month, index) => [month, index]))
const normalizeIntake = (intake: string) =>
  INTAKE_ORDER.find((month) => intake.toLowerCase().includes(month.toLowerCase())) ?? intake

/** A compact category and intake filter above the destination carousel. */
export function DestinationTabs({
  tabs,
  destinations,
  heading,
}: {
  tabs: DestinationTab[]
  destinations: DestinationDTO[]
  heading: { title: string; accent: string; intro: string }
}) {
  const [active, setActive] = useState<TabId>("all")
  const [selectedIntake, setSelectedIntake] = useState("all")
  const [filterOpen, setFilterOpen] = useState(false)
  const baseId = useId()
  const rowRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  const intakeOptions = Array.from(
    new Set(destinations.flatMap((destination) => destination.intakes.map(normalizeIntake)))
  ).sort((a, b) => {
    const aIndex = INTAKE_ORDER_INDEX.get(a) ?? INTAKE_ORDER.length
    const bIndex = INTAKE_ORDER_INDEX.get(b) ?? INTAKE_ORDER.length
    return aIndex - bIndex || a.localeCompare(b)
  })
  const intakeMatches =
    selectedIntake === "all"
      ? destinations
      : destinations.filter((destination) =>
          destination.intakes.some((intake) => normalizeIntake(intake) === selectedIntake)
        )
  const visibleTabs = tabs
    .map((tab) => ({
      ...tab,
      count:
        tab.id === "all"
          ? intakeMatches.length
          : intakeMatches.filter((destination) => destination.categories.includes(tab.id)).length,
    }))
    .filter((tab) => tab.count > 0)
  const items =
    active === "all"
      ? intakeMatches
      : intakeMatches.filter((destination) => destination.categories.includes(active))
  const panelId = `${baseId}-panel`
  const filterPanelId = `${baseId}-filters`
  const filterCount = Number(active !== "all") + Number(selectedIntake !== "all")

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
    { scope: rowRef, dependencies: [active, selectedIntake], revertOnUpdate: false }
  )

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
  }, [syncEdges, active, selectedIntake])

  useEffect(() => {
    if (!filterOpen) return
    function closeOnOutsideClick(event: PointerEvent) {
      if (!filterRef.current?.contains(event.target as Node)) setFilterOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setFilterOpen(false)
    }
    document.addEventListener("pointerdown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [filterOpen])

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
          <div ref={filterRef} className="relative">
            <button
              id={`${baseId}-filter-button`}
              type="button"
              aria-expanded={filterOpen}
              aria-controls={filterPanelId}
              onClick={() => setFilterOpen((open) => !open)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-800 shadow-sm transition hover:border-gray-300 focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <SlidersHorizontal aria-hidden className="size-3.5" />
              Filters
              {filterCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-stone-900 text-[10px] text-white">
                  {filterCount}
                </span>
              )}
              <ChevronDown
                aria-hidden
                className={cn("size-3.5 transition-transform", filterOpen && "rotate-180")}
              />
            </button>
            {filterOpen && (
              <div
                id={filterPanelId}
                role="group"
                aria-labelledby={`${baseId}-filter-button`}
                className="absolute top-full right-0 z-30 mt-2 w-64 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor={`${baseId}-category`}
                      className="mb-1.5 block text-[11px] font-semibold tracking-wide text-gray-600 uppercase"
                    >
                      Category
                    </label>
                    <select
                      id={`${baseId}-category`}
                      value={active}
                      onChange={(event) => setActive(event.currentTarget.value as TabId)}
                      className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                    >
                      {visibleTabs.map((tab) => (
                        <option key={tab.id} value={tab.id}>
                          {tab.label} ({tab.count})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor={`${baseId}-intake`}
                      className="mb-1.5 block text-[11px] font-semibold tracking-wide text-gray-600 uppercase"
                    >
                      Intake
                    </label>
                    <select
                      id={`${baseId}-intake`}
                      value={selectedIntake}
                      onChange={(event) => {
                        setSelectedIntake(event.currentTarget.value)
                        setActive("all")
                      }}
                      className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                    >
                      <option value="all">All intakes</option>
                      {intakeOptions.map((intake) => (
                        <option key={intake} value={intake}>
                          {intake}
                        </option>
                      ))}
                    </select>
                  </div>
                  {filterCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setActive("all")
                        setSelectedIntake("all")
                      }}
                      className="pt-1 text-xs font-semibold text-brand-forest underline underline-offset-2"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            )}
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
        role="region"
        aria-label="Curated destination cards"
        aria-roledescription="carousel"
        // Padding inside the scroller leaves room for the hover lift and shadow,
        // which overflow clipping would otherwise cut off.
        className="no-scrollbar -mx-6 -my-4 flex snap-x snap-mandatory scroll-px-6 items-start gap-6 overflow-x-auto overscroll-x-contain px-6 py-4 pb-12 md:mx-0 md:scroll-px-0 md:px-0 lg:gap-8"
      >
        {items.length > 0 ? (
          items.map((d, i) => <DestinationCard key={d.slug} destination={d} index={i} />)
        ) : (
          <p className="px-2 py-12 text-sm text-gray-600" role="status">
            No destinations are listed for this intake yet.
          </p>
        )}
      </div>
    </>
  )
}
