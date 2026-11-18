import { ConsultationForm } from "@/components/marketing/consultation-form"
import { Reveal } from "@/components/motion/reveal"
import type { BusinessContent, HomeContent } from "@/services/content.service"

export function Consultation({ content: c, business: b }: { content: HomeContent; business: BusinessContent }) {
  return (
    <section id="consultation" className="scroll-mt-20 bg-brand-forest py-20 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <h2 className="mb-3 font-serif text-3xl font-normal tracking-tight sm:text-4xl lg:text-[44px]">
              {c.consultTitle}
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-emerald-100/75 sm:text-base">
              {c.consultIntro}
            </p>
            <ConsultationForm />
          </Reveal>

          <Reveal delay={0.15} className="w-full lg:col-span-5">
            <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xs transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08] sm:p-10">
              <div>
                <h3 className="font-serif text-2xl font-normal">{c.visitTitle}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-emerald-100/70">{c.visitText}</p>
              </div>
              <dl className="space-y-4 border-t border-white/10 pt-4 text-xs">
                <div>
                  <dt className="mb-0.5 text-[10px] font-semibold tracking-wider text-emerald-300/80 uppercase">Address</dt>
                  <dd className="text-white/90">
                    {b.address}
                    {b.mapUrl && (
                      <a href={b.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-brand-gold hover:text-white">
                        Open in Maps →
                      </a>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-[10px] font-semibold tracking-wider text-emerald-300/80 uppercase">Hours</dt>
                  <dd className="text-white/90">{b.hours}</dd>
                </div>
                {(b.phone || b.email) && (
                  <div>
                    <dt className="mb-0.5 text-[10px] font-semibold tracking-wider text-emerald-300/80 uppercase">Contact</dt>
                    <dd className="space-y-0.5 text-white/90">
                      {b.phone && <a href={`tel:${b.phone}`} className="block hover:text-brand-gold">{b.phone}</a>}
                      {b.email && <a href={`mailto:${b.email}`} className="block hover:text-brand-gold">{b.email}</a>}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
