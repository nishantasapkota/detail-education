import Image from "next/image"

import { Reveal } from "@/components/motion/reveal"
import type { HomeContent, TeamMember } from "@/services/content.service"

export function Philosophy({ content: c, member }: { content: HomeContent; member: TeamMember | null }) {
  return (
    <section id="about" className="scroll-mt-20 bg-brand-cream/40 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {member && (
            <Reveal className="lg:col-span-6">
              <figure className="group relative flex min-h-[460px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-brand-forest p-8 text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-950/30 sm:p-10">
                {member.photo ? (
                  <div className="pointer-events-none absolute -bottom-4 right-2 h-72 w-56 opacity-90 transition-transform duration-500 select-none group-hover:scale-105 sm:right-6 sm:h-80 sm:w-64">
                    <Image src={member.photo} alt="" fill sizes="256px" className="object-contain object-bottom drop-shadow-2xl" />
                  </div>
                ) : (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-6 -bottom-16 font-serif text-[18rem] leading-none text-white/[0.04] italic transition-transform duration-500 select-none group-hover:scale-105"
                  >
                    {member.name[0]}
                  </span>
                )}
                <div className="relative z-10">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-emerald-200">
                      Dedicated 1-on-1 advisor
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-emerald-200/80">
                      <span className="size-2 animate-node-ping rounded-full bg-emerald-500 motion-reduce:animate-none" />
                      Direct in Kathmandu
                    </span>
                  </div>
                  {member.quote && (
                    <blockquote className="max-w-sm font-serif text-2xl leading-snug font-light tracking-tight text-white/95 italic sm:text-3xl">
                      “{member.quote}”
                    </blockquote>
                  )}
                </div>
                <figcaption className="relative z-10 mt-6 flex flex-col justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-end">
                  <div>
                    <p className="font-serif text-xl font-medium">{member.name}</p>
                    {member.title && <p className="mt-0.5 text-xs text-emerald-100/75">{member.title}</p>}
                    <p className="pt-2 text-[10px] font-semibold tracking-wider text-brand-gold uppercase">Kathmandu student care</p>
                  </div>
                  {member.yearsExperience > 0 && (
                    <p className="flex items-center gap-2 text-xs font-medium text-emerald-200/90">
                      <span className="font-bold text-brand-gold">✓</span> {member.yearsExperience}+ yrs guidance
                    </p>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          )}

          <div className={member ? "space-y-8 lg:col-span-6" : "space-y-8 lg:col-span-8 lg:col-start-3"}>
            <Reveal>
              <h2 className="font-serif text-3xl font-normal tracking-tight text-brand-forest sm:text-4xl">{c.aboutTitle}</h2>
            </Reveal>
            <Reveal stagger={0.08} className="space-y-6">
              {c.aboutPoints.map((p, i) => (
                <div key={p.title} className="flex items-start gap-4 rounded-xl p-2 transition-colors duration-200 hover:bg-white/60">
                  <span className="mt-1 font-serif text-xs font-bold text-brand-gold">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-sm font-bold text-brand-forest">{p.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{p.body}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
