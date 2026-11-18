import { Reveal } from "@/components/motion/reveal"
import type { HomeContent, Service } from "@/services/content.service"

export function Process({ content: c, steps }: { content: HomeContent; steps: Service[] }) {
  return (
    <section id="process" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-normal tracking-tight text-brand-forest sm:text-4xl lg:text-[44px]">
            {c.processTitleBefore}{" "}
            {c.processTitleHighlight && (
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10 italic">{c.processTitleHighlight}</span>
                <svg
                  aria-hidden
                  viewBox="0 0 240 60"
                  fill="none"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -inset-x-3 -inset-y-1.5 h-[calc(100%+12px)] w-[calc(100%+24px)] animate-breathe text-brand-gold motion-reduce:animate-none"
                >
                  <ellipse cx="120" cy="30" rx="114" ry="24" stroke="currentColor" strokeDasharray="5 3" strokeWidth="1.8" />
                </svg>
              </span>
            )}{" "}
            {c.processTitleAfter}
          </h2>
          <p className="mt-3 text-sm text-gray-500 sm:text-base">{c.processIntro}</p>
        </Reveal>

        <Reveal
          stagger={0.08}
          className="grid grid-cols-1 gap-8 border-b border-gray-100 pb-16 md:grid-cols-3 lg:grid-cols-5"
        >
          {steps.map((s, i) => (
            <div
              key={s.slug}
              className="group space-y-3 rounded-b-xl border-t-2 border-gray-200 p-2 pt-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-gold hover:bg-brand-cream/30"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-bold text-brand-forest transition-all duration-300 group-hover:scale-110 group-hover:text-brand-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase transition-colors group-hover:text-brand-forest">
                  {s.stage}
                </span>
              </div>
              <h3 className="text-sm font-bold text-brand-forest transition-colors group-hover:text-amber-700">{s.title}</h3>
              <p className="text-xs leading-relaxed text-gray-500 transition-colors group-hover:text-gray-700">{s.summary}</p>
              {s.linkLabel && (
                <span className="block pt-2 text-[11px] font-medium text-brand-gold transition-transform duration-300 group-hover:translate-x-1.5">
                  {s.linkLabel} →
                </span>
              )}
            </div>
          ))}
        </Reveal>

        <ul className="flex flex-wrap items-center justify-center gap-6 pt-10 text-xs font-medium text-gray-600 sm:gap-10">
          {c.trustPoints.map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="flex size-4 animate-check-ripple items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800 motion-reduce:animate-none">
                ✓
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
