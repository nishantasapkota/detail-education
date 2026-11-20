"use client"

import { useId, useState } from "react"
import { ArrowUpRight, ChevronDown } from "lucide-react"

import type { DocumentationCountryId } from "@/config/documentation"
import type { DocumentationTimelineData } from "@/data/documentation-timelines"

const COUNTRY_MAPS: Record<
  DocumentationCountryId,
  { viewBox: string; x: number; y: number }
> = {
  canada: { viewBox: "6 6 31 22", x: 21.5, y: 17.32 },
  japan: { viewBox: "110 14 22 22", x: 120.5, y: 24.25 },
  uk: { viewBox: "61 9 14 13", x: 67.5, y: 15.59 },
  usa: { viewBox: "28 13 24 17", x: 40, y: 21.65 },
  finland: { viewBox: "68 2 16 13", x: 76, y: 8.5 },
  australia: { viewBox: "110 40 28 23", x: 124.5, y: 51.96 },
  germany: { viewBox: "66 9 14 13", x: 72.5, y: 15.59 },
}

function DestinationMap({ id, name }: { id: DocumentationCountryId; name: string }) {
  const map = COUNTRY_MAPS[id]
  const gradientId = `destination-map-glow-${useId().replace(/:/g, "")}`

  return (
    <div className="relative mt-6 aspect-[2.1/1] overflow-hidden rounded-2xl">
      <svg
        viewBox={map.viewBox}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Map of ${name} and the surrounding region`}
        className="absolute inset-0 size-full"
      >
        <defs>
          <radialGradient id={gradientId}>
            <stop offset="0%" stopColor="#E39D48" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#E39D48" stopOpacity="0" />
          </radialGradient>
        </defs>
        <image
          href="/images/world-lines.svg"
          x="0"
          y="0"
          width="135"
          height="64"
          opacity="0.48"
          style={{ filter: "brightness(0) saturate(100%)" }}
        />
        <circle cx={map.x} cy={map.y} r="4.6" fill={`url(#${gradientId})`} />
        <circle
          cx={map.x}
          cy={map.y}
          r="1.8"
          fill="none"
          stroke="#E39D48"
          strokeWidth="0.25"
          strokeDasharray="0.65 0.45"
        />
        <circle cx={map.x} cy={map.y} r="0.65" fill="#E39D48" />
      </svg>
      <span className="absolute right-3 bottom-2.5 text-[9px] font-semibold tracking-[0.16em] text-brand-muted/65 uppercase">
        {name}
      </span>
    </div>
  )
}

export function DocumentationTimeline({
  countries,
}: {
  countries: DocumentationTimelineData[]
}) {
  const [selectedCountry, setSelectedCountry] = useState<DocumentationCountryId>(
    countries.find((item) => item.id === "japan")?.id ?? countries[0]?.id ?? "japan"
  )
  const country = countries.find((item) => item.id === selectedCountry) ?? countries[0]
  if (!country) return null

  return (
    <section
      id="documentation-timeline"
      aria-labelledby="documentation-timeline-title"
      className="scroll-mt-20 bg-brand-cream/70 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-10 flex flex-col justify-between gap-8 lg:mb-12 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-forest/10 bg-white/75 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-brand-forest uppercase">
              <span aria-hidden className="size-1.5 rounded-full bg-brand-gold" />
              Student visa planning
            </span>
            <h2
              id="documentation-timeline-title"
              className="mt-5 font-serif text-4xl leading-[1.08] font-normal tracking-tight text-brand-forest sm:text-5xl lg:text-[56px]"
            >
              Your documents, <span className="text-brand-gold">in order.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-muted sm:text-base">
              Country-by-country paperwork milestones and target windows for Nepal-based
              student applicants.
            </p>
          </div>

          <div className="w-full shrink-0 sm:max-w-xs">
            <label
              htmlFor="documentation-country"
              className="mb-2 block text-xs font-semibold text-brand-forest"
            >
              Choose a destination
            </label>
            <div className="relative">
              <select
                id="documentation-country"
                value={selectedCountry}
                onChange={(event) =>
                  setSelectedCountry(event.currentTarget.value as DocumentationCountryId)
                }
                className="h-12 w-full appearance-none rounded-xl border border-brand-border bg-white px-4 pr-11 text-sm font-semibold text-brand-forest shadow-sm transition outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
              >
                {countries.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-brand-muted"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:gap-6">
          <aside className="relative flex h-fit flex-col self-start overflow-hidden bg-transparent text-brand-forest lg:sticky lg:top-24">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-brand-muted uppercase">
                  Destination guide
                </p>
                <h3 className="mt-2 font-serif text-3xl font-normal tracking-tight sm:text-4xl">
                  {country.name}
                </h3>
              </div>
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-brand-border font-serif text-lg font-semibold text-brand-gold">
                {country.code}
              </span>
            </div>

            <DestinationMap id={country.id} name={country.name} />

            <p className="mt-5 text-sm font-medium text-brand-muted">{country.route}</p>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-brand-border p-3.5">
                <dt className="text-[10px] font-semibold tracking-wider text-brand-muted uppercase">
                  Target intakes
                </dt>
                <dd className="mt-1.5 text-xs leading-relaxed font-medium text-brand-forest">
                  {country.targetIntakes}
                </dd>
              </div>
              <div className="rounded-2xl border border-brand-border p-3.5">
                <dt className="text-[10px] font-semibold tracking-wider text-brand-muted uppercase">
                  Guide timeline
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-brand-gold">
                  {country.guideTimeline}
                </dd>
              </div>
              <div className="col-span-2 rounded-2xl border border-brand-border p-3.5">
                <dt className="text-[10px] font-semibold tracking-wider text-brand-muted uppercase">
                  Authority & location
                </dt>
                <dd className="mt-1.5 text-xs leading-relaxed font-medium text-brand-forest">
                  {country.authority}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-[11px] leading-relaxed text-brand-muted">
              Estimated planning timeline from your guide. Official processing times can
              vary.
            </p>

            <a
              href={country.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="group mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-brand-gold/60 px-4 py-2.5 text-xs font-semibold text-brand-forest transition hover:bg-brand-gold hover:text-brand-forest focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              {country.officialLabel}
              <ArrowUpRight
                aria-hidden
                className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </aside>

          <ol
            aria-label={`${country.name} documentation milestones`}
            aria-live="polite"
            className="pt-6 lg:pt-0"
          >
            {country.steps.map((step, index) => (
              <li
                key={step.title}
                className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 pb-8 last:pb-0 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5"
              >
                <div className="relative flex justify-center">
                  <span className="relative z-10 flex size-9 items-center justify-center rounded-full border border-brand-gold/35 bg-brand-cream text-xs font-bold text-brand-forest tabular-nums sm:size-10">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {index < country.steps.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute top-10 bottom-0 w-px bg-brand-border sm:top-11"
                    />
                  )}
                </div>

                <div className="min-w-0 pt-0.5">
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-brand-gold uppercase">
                    {step.timing}
                  </p>
                  <h4 className="mt-1.5 text-base font-semibold text-brand-forest sm:text-lg">
                    {step.title}
                  </h4>
                  <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-brand-muted sm:text-sm">
                    {step.description}
                  </p>
                  <ul
                    className="mt-3 flex flex-wrap gap-2"
                    aria-label={`${step.title} supporting documents`}
                  >
                    {step.documents.map((document) => (
                      <li
                        key={document}
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand-mint/75 px-2.5 py-1.5 text-[10px] font-medium text-brand-forest sm:text-[11px]"
                      >
                        <span
                          aria-hidden
                          className="size-1 shrink-0 rounded-full bg-brand-forest-mid"
                        />
                        {document}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {country.notes.length > 0 && (
          <aside className="mt-5 rounded-2xl border border-brand-gold/25 bg-white/85 p-5 sm:p-6">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-brand-gold uppercase">
                  Local checklist
                </p>
                <h3 className="mt-1 font-serif text-xl font-medium text-brand-forest">
                  Notes for Nepal applicants
                </h3>
              </div>
              <p className="text-[10px] text-brand-muted">
                Confirm current requirements before applying.
              </p>
            </div>
            <ul className="grid gap-3 text-xs leading-relaxed text-brand-muted sm:grid-cols-2 sm:text-sm">
              {country.notes.map((note) => (
                <li key={note} className="flex gap-2.5">
                  <span
                    aria-hidden
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-gold"
                  />
                  {note}
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </section>
  )
}
