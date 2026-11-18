import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import type { Course, HomeContent } from "@/services/content.service"

export function TestPrep({ content: c, courses }: { content: HomeContent; courses: Course[] }) {
  return (
    <section id="testprep" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-normal tracking-tight text-brand-forest sm:text-4xl lg:text-[44px]">
            {c.testprepTitle}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">{c.testprepIntro}</p>
        </Reveal>

        <Reveal stagger={0.08} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {courses.map((t) => (
            <div
              key={t.slug}
              className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-gold/60 hover:shadow-xl"
            >
              <div>
                <div className="mb-4 flex items-baseline justify-between gap-2">
                  <h3 className="font-serif text-2xl font-bold text-brand-forest transition-colors group-hover:text-amber-700">
                    {t.name}
                  </h3>
                  {t.tag && (
                    <span className="rounded bg-gray-50 px-2 py-1 text-right text-[10px] font-semibold text-gray-400 uppercase transition-colors group-hover:bg-amber-50 group-hover:text-amber-800">
                      {t.tag}
                    </span>
                  )}
                </div>
                <p className="mb-6 text-xs leading-relaxed text-gray-500">{t.summary}</p>
                <ul className="mb-6 space-y-2 text-xs text-gray-600">
                  {t.points.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="text-gray-400 transition-colors group-hover:text-brand-gold">—</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs">
                <span className="font-medium text-gray-400">
                  {t.duration}
                  {t.fee && <span className="block text-gray-500">{t.fee}</span>}
                </span>
                <Link
                  href="/#consultation"
                  className="inline-flex items-center gap-1 font-semibold text-brand-forest transition-all duration-200 group-hover:translate-x-1 hover:text-brand-gold"
                >
                  Cohort timetable →
                </Link>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200/60 bg-brand-cream/70 p-6 shadow-xs transition-shadow duration-300 hover:shadow-md sm:flex-row">
          <div>
            <h3 className="text-sm font-bold text-brand-forest">{c.diagnosticTitle}</h3>
            <p className="mt-0.5 text-xs text-gray-500">{c.diagnosticText}</p>
          </div>
          <Link
            href="/#consultation"
            className="shrink-0 rounded-full bg-brand-forest px-5 py-2.5 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-forest-dark active:scale-[0.98]"
          >
            {c.diagnosticCta}
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
