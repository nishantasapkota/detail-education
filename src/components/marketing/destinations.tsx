import Link from "next/link"

import { DestinationTabs } from "@/components/marketing/destination-tabs"
import { Reveal } from "@/components/motion/reveal"
import type { HomeContent } from "@/services/content.service"
import { listDestinations } from "@/services/destination.service"

/** Server part: loads destinations (cached) and hands them to the client tabs. */
export async function Destinations({ content: c }: { content: HomeContent }) {
  const { tabs, items } = await listDestinations()

  return (
    <section id="destinations" className="scroll-mt-20 bg-brand-cream/60 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-block rounded-full border border-amber-600/40 bg-amber-50/50 px-3.5 py-1 text-xs font-semibold tracking-wider text-amber-800 uppercase">
            Curated destinations
          </span>
          <span className="text-xs font-medium text-gray-400">/ Portfolio 2026/27</span>
        </div>

        <DestinationTabs tabs={tabs} destinations={items} heading={{ title: c.destTitle, accent: c.destTitleAccent, intro: c.destIntro }} />

        <Reveal className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-100/90 text-lg font-bold text-amber-800">
              ?
            </span>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Still comparing destinations?</h3>
              <p className="mt-0.5 text-xs leading-normal text-stone-600 sm:text-sm">
                Our senior counsellors compare university fees, visa acceptance rates, and living expenses side-by-side.
              </p>
            </div>
          </div>
          <Link
            href="/#consultation"
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-800 active:scale-[0.98] sm:text-sm"
          >
            Request Destination Comparison
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
