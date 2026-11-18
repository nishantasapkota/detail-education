"use client"

import { useRef } from "react"

import { gsap, REDUCED_MOTION, useGSAP } from "@/components/motion/gsap"

type Segment = { text: string; accent: boolean }

/** "Your journey, handled in *detail.*" → plain and accent segments. */
function parse(title: string): Segment[] {
  return title
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part) => (part.startsWith("*") && part.endsWith("*") ? { text: part.slice(1, -1), accent: true } : { text: part, accent: false }))
}

/**
 * Editorial hero headline. Words rise out of a mask one after another; the
 * accent phrase (wrapped in *asterisks* in the admin) is set in gold italic
 * with a hand-drawn underline that draws itself in after the words land.
 */
export function HeroTitle({ title, eyebrow }: { title: string; eyebrow?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const segments = parse(title)
  const plain = segments.map((s) => s.text).join("")

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`not ${REDUCED_MOTION}`, () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
        tl.from("[data-eyebrow]", { autoAlpha: 0, y: 12, duration: 0.7 })
          .from("[data-word]", { yPercent: 115, rotate: 2, duration: 1.1, stagger: 0.06 }, "-=0.35")
          .fromTo(
            "[data-underline]",
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" },
            "-=0.45"
          )
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <div ref={ref}>
      {eyebrow && (
        <p data-eyebrow className="mb-7 flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-brand-gold uppercase">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-brand-gold/60 motion-reduce:animate-none" />
            <span className="relative size-2 rounded-full bg-brand-gold" />
          </span>
          {eyebrow}
        </p>
      )}

      <h1
        aria-label={plain}
        className="font-serif text-[clamp(3rem,5.6vw,5.25rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-balance text-[#F5F1E8]"
      >
        {segments.map((seg, si) =>
          seg.text
            .split(/(\s+)/)
            .filter(Boolean)
            .map((word, wi) =>
              /^\s+$/.test(word) ? (
                " "
              ) : (
                <span key={`${si}-${wi}`} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]">
                  <span data-word className="inline-block will-change-transform">
                    {seg.accent ? <Accent>{word}</Accent> : word}
                  </span>
                </span>
              )
            )
        )}
      </h1>
    </div>
  )
}

/** Gold italic with a gradient sheen and a drawn underline. */
function Accent({ children }: { children: string }) {
  return (
    <span className="relative inline-block pr-[0.06em]">
      <span className="bg-[linear-gradient(100deg,#F6C67A_0%,#E39D48_45%,#C9782A_100%)] bg-clip-text font-medium text-transparent italic">
        {children}
      </span>
      <svg
        aria-hidden
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[0.06em] left-0 h-[0.22em] w-full overflow-visible text-brand-gold"
      >
        <path
          data-underline
          d="M3 13 C 40 5, 90 4, 130 8 S 185 14, 197 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="0"
        />
      </svg>
    </span>
  )
}
