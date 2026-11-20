import type { Metadata } from "next"

import { AboutHero } from "@/components/about/about-hero"
import { CeoMessage } from "@/components/about/ceo-message"
import { DetailsLedger } from "@/components/about/details-ledger"
import { GoldButton } from "@/components/marketing/gold-button"
import { Reveal } from "@/components/motion/reveal"
import { MediaImage } from "@/components/ui/media-image"
import {
  getAboutContent,
  getBusiness,
  getTeam,
  type TeamMember,
} from "@/services/content.service"

export async function generateMetadata(): Promise<Metadata> {
  const c = await getAboutContent()
  return { title: c.seoTitle, description: c.seoDescription }
}

/** All copy is edited in Admin → Pages → About page; people come from Team. */
export default async function AboutPage() {
  const [c, business, team] = await Promise.all([
    getAboutContent(),
    getBusiness(),
    getTeam(),
  ])
  const featured = team.find((m) => m.featured && m.quote) ?? team.find((m) => m.quote)
  const paragraphs = c.storyBody
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <>
      <AboutHero content={c} business={business} />

      {/* The photo hangs into this band, so it starts with extra room on top. */}
      {c.ledger.length > 0 && (
        <section className="relative bg-[#f5f1e8]">
          <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 lg:px-12 lg:pt-24">
            <DetailsLedger caption={c.ledgerCaption} items={c.ledger} />
          </div>
        </section>
      )}

      {/* Story */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-12 lg:gap-12 lg:px-12">
          <div className="lg:col-span-4">
            <h2 className="font-serif text-3xl leading-tight tracking-tight text-brand-forest sm:text-4xl lg:sticky lg:top-32">
              {c.storyTitle}
            </h2>
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6">
            <div className="max-w-[62ch] space-y-6 font-serif text-[1.1875rem] leading-[1.7] text-brand-charcoal sm:text-xl">
              {paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            {featured && (
              <figure className="mt-14 max-w-[52ch] border-l-2 border-brand-gold pl-6">
                <blockquote className="font-serif text-2xl leading-snug text-brand-forest italic sm:text-[1.75rem]">
                  “{featured.quote}”
                </blockquote>
                <figcaption className="mt-4 text-sm text-brand-muted">
                  <span className="font-semibold text-brand-forest">{featured.name}</span>
                  {featured.title && <>, {featured.title}</>}
                </figcaption>
              </figure>
            )}
          </Reveal>
        </div>
      </section>

      <CeoMessage content={c} />

      {/* Principles */}
      {c.principles.length > 0 && (
        <section className="bg-brand-cream py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <h2 className="max-w-xl font-serif text-3xl tracking-tight text-brand-forest sm:text-4xl">
              {c.principlesTitle}
            </h2>
            <dl className="mt-14 grid gap-x-16 gap-y-12 sm:grid-cols-2">
              {c.principles.map((p) => (
                <div key={p.title} className="border-t border-brand-forest/15 pt-6">
                  <dt className="font-serif text-2xl leading-snug text-brand-forest">
                    {p.title}
                  </dt>
                  <dd className="mt-3 max-w-[48ch] leading-relaxed text-brand-muted">
                    {p.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* People */}
      {team.length > 0 && (
        <section id="team" className="scroll-mt-20 bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl tracking-tight text-brand-forest sm:text-4xl">
                {c.teamTitle}
              </h2>
              {c.teamIntro && (
                <p className="mt-4 text-lg leading-relaxed text-brand-muted">
                  {c.teamIntro}
                </p>
              )}
            </div>
            {team.length === 1 ? (
              <SoloMember member={team[0]} showQuote={team[0] !== featured} />
            ) : (
              <ul className="mt-14 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((m) => (
                  <li key={m.name}>
                    <Portrait member={m} />
                    <MemberText member={m} className="mt-6" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Visit */}
      <section className="bg-brand-forest py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-6">
            <h2 className="font-serif text-4xl tracking-tight text-[#F5F1E8] sm:text-5xl">
              {c.visitTitle}
            </h2>
            <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-emerald-100/75">
              {c.visitText}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <GoldButton href="/#consultation">{c.visitCta}</GoldButton>
              {business.mapUrl && (
                <a
                  href={business.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-emerald-100 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-brand-gold"
                >
                  Open in Google Maps
                </a>
              )}
            </div>
          </div>
          <dl className="grid content-start gap-7 text-base lg:col-span-5 lg:col-start-8">
            <Fact label="Office">{business.address}</Fact>
            <Fact label="Open">{business.hours}</Fact>
            <Fact label="WhatsApp">
              <a
                href={business.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/30 underline-offset-4 hover:decoration-brand-gold"
              >
                Message us on WhatsApp
              </a>
            </Fact>
            {business.phone && (
              <Fact label="Phone">
                <a href={`tel:${business.phone}`} className="hover:text-brand-gold">
                  {business.phone}
                </a>
              </Fact>
            )}
            {business.email && (
              <Fact label="Email">
                <a href={`mailto:${business.email}`} className="hover:text-brand-gold">
                  {business.email}
                </a>
              </Fact>
            )}
          </dl>
        </div>
      </section>
    </>
  )
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-white/10 pt-5 sm:grid-cols-[7rem_1fr] sm:gap-6">
      <dt className="text-sm text-emerald-100/60">{label}</dt>
      <dd className="text-[#F5F1E8]">{children}</dd>
    </div>
  )
}

function Portrait({
  member,
  className = "",
}: {
  member: TeamMember
  className?: string
}) {
  return (
    <div
      className={`relative aspect-[4/5] overflow-hidden rounded-2xl ${member.photo ? "bg-brand-forest" : "bg-brand-mint"} ${className}`}
    >
      {member.photo ? (
        <MediaImage
          src={member.photo}
          alt={member.name}
          fill
          sizes="(min-width: 1024px) 380px, 90vw"
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center font-serif text-[9rem] text-brand-forest/15 italic select-none"
        >
          {member.name[0]}
        </span>
      )}
    </div>
  )
}

function MemberText({
  member,
  className = "",
}: {
  member: TeamMember
  className?: string
}) {
  return (
    <div className={className}>
      <h3 className="font-serif text-2xl text-brand-forest">{member.name}</h3>
      {(member.title || member.yearsExperience > 0) && (
        <p className="mt-1 text-sm text-brand-muted">
          {member.title}
          {member.title && member.yearsExperience > 0 && ", "}
          {member.yearsExperience > 0 &&
            `${member.yearsExperience} years advising students`}
        </p>
      )}
      {member.bio && (
        <p className="mt-4 max-w-[52ch] leading-relaxed text-brand-charcoal/85">
          {member.bio}
        </p>
      )}
    </div>
  )
}

function SoloMember({ member, showQuote }: { member: TeamMember; showQuote: boolean }) {
  return (
    <div className="mt-14 grid items-center gap-10 md:grid-cols-12">
      <Portrait
        member={member}
        className="max-w-xs md:col-span-4 md:max-w-none lg:col-span-3"
      />
      <div className="md:col-span-8 lg:col-span-6 lg:col-start-5">
        {showQuote && member.quote && (
          <p className="mb-8 font-serif text-2xl leading-snug text-brand-forest italic sm:text-3xl">
            “{member.quote}”
          </p>
        )}
        <MemberText member={member} />
      </div>
    </div>
  )
}
