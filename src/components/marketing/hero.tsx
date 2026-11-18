import Link from "next/link"

import { GoldButton } from "@/components/marketing/gold-button"
import { HeroTitle } from "@/components/marketing/hero-title"
import { RouteMap } from "@/components/marketing/route-map"
import { Reveal } from "@/components/motion/reveal"
import type { HomeContent } from "@/services/content.service"

export function Hero({ content: c }: { content: HomeContent }) {
  return (
    <section className="relative overflow-hidden bg-brand-forest pt-16 pb-20 text-white lg:pt-24 lg:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgb(227_157_72/0.12)_0%,transparent_65%)] opacity-80"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="relative z-10 lg:col-span-6 lg:pr-4">
            <HeroTitle title={c.heroTitle} eyebrow={c.heroEyebrow} />
            <Reveal stagger={0.12} y={20} delay={0.7} className="mt-8 space-y-8">
              <p className="max-w-md text-lg leading-relaxed text-pretty text-emerald-100/75 lg:text-xl">
                {c.heroSubtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <GoldButton href="/#consultation">{c.heroPrimaryCta}</GoldButton>
                <Link
                  href="/#destinations"
                  className="rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20 active:scale-[0.98]"
                >
                  {c.heroSecondaryCta}
                </Link>
              </div>
              <div className="flex items-center gap-2.5 pt-3 text-xs font-medium text-emerald-200/90 lg:text-sm">
                <span className="inline-flex animate-check-ripple items-center justify-center rounded-full p-0.5 text-base text-brand-gold motion-reduce:animate-none">
                  ✓
                </span>
                {c.heroNote}
              </div>
            </Reveal>
          </div>

          <div className="relative flex flex-col items-center justify-center gap-4 min-[1400px]:-mr-20 lg:col-span-6 lg:-mr-6 lg:min-h-[480px] xl:-mr-12 2xl:-mr-28">
            <RouteMap />
            <Link
              href="/#destinations"
              className="group max-w-[260px] animate-float self-end rounded-2xl border border-white/60 bg-white/95 p-4 text-brand-charcoal shadow-2xl backdrop-blur-md transition-shadow duration-300 hover:shadow-emerald-950/20 motion-reduce:animate-none min-[1400px]:mr-20 lg:mr-6 xl:mr-12 2xl:mr-28"
            >
              <span className="flex items-start justify-between gap-2">
                <span>
                  <span className="block text-xs font-bold text-brand-forest">
                    {c.mapCardTitle}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-gray-500">
                    {c.mapCardText}
                  </span>
                </span>
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs text-emerald-800 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
