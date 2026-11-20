import { Reveal } from "@/components/motion/reveal"
import { MediaImage } from "@/components/ui/media-image"
import type { VisaSuccess } from "@/services/content.service"

export function VisaGallery({
  kicker,
  title,
  intro,
  items,
}: {
  kicker: string
  title: string
  intro: string
  items: VisaSuccess[]
}) {
  return (
    <section id="visas" className="scroll-mt-20 bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <Reveal className="mb-10 max-w-2xl">
          <span className="mb-2 block text-[11px] font-semibold tracking-wider text-brand-gold uppercase">{kicker}</span>
          <h2 className="font-serif text-3xl font-normal tracking-tight text-brand-forest sm:text-4xl">{title}</h2>
          {intro && <p className="mt-3 text-sm leading-relaxed text-gray-500">{intro}</p>}
        </Reveal>

        <Reveal stagger={0.06} className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((v) => (
            <figure
              key={v.id}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-cream shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <MediaImage
                src={v.photo}
                alt={`${v.name}${v.country ? `, ${v.country} visa granted` : ", visa granted"}`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase shadow-xs backdrop-blur-sm">
                <svg aria-hidden viewBox="0 0 16 16" className="size-3 fill-current">
                  <path d="M6.5 11.2 3.3 8l1.1-1.1 2.1 2.1 5.1-5.1L12.7 5z" />
                </svg>
                Visa granted
              </span>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pt-10 pb-4 text-white">
                <span className="block text-sm font-bold">{v.name}</span>
                <span className="block text-[11px] text-white/80">
                  {[v.country, v.university, v.intake].filter(Boolean).join(" · ")}
                </span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
