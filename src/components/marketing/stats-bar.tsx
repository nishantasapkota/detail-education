import { WhatsAppIcon } from "@/components/marketing/whatsapp-icon"
import type { HomeContent } from "@/services/content.service"

export function StatsBar({ stats, whatsappUrl }: { stats: HomeContent["stats"]; whatsappUrl: string }) {
  return (
    <section className="border-b border-gray-100 bg-white py-6">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 md:flex-row md:items-center lg:px-12">
        <dl className="grid flex-1 grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-12">
          {stats.map((s) => (
            <div key={s.value + s.line1} className="group flex cursor-default items-baseline gap-2">
              <dt className="sr-only">{`${s.line1} ${s.line2}`}</dt>
              <dd className="font-serif text-2xl font-bold text-brand-forest transition-colors duration-300 group-hover:text-amber-700 lg:text-3xl">
                {s.value}
              </dd>
              <dd aria-hidden className="text-xs leading-tight font-medium text-gray-500">
                {s.line1}
                <br />
                {s.line2}
              </dd>
            </div>
          ))}
        </dl>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex w-fit items-center gap-2.5 rounded-full bg-brand-forest-mid px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#073526] hover:shadow-md active:scale-[0.98]"
        >
          <WhatsAppIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
          WhatsApp
        </a>
      </div>
    </section>
  )
}
