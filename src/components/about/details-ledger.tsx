"use client"

import { useRef } from "react"

import { gsap, REDUCED_MOTION, useGSAP } from "@/components/motion/gsap"

/**
 * The about page's signature moment: a wall of the small things we handle,
 * ticked off one after another once the list scrolls into view. Rendered in
 * its finished state, so without JS or with reduced motion every item is
 * simply checked.
 */
export function DetailsLedger({ caption, items }: { caption: string; items: string[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(`not ${REDUCED_MOTION}`, () => {
        const step = Math.min(0.07, 2.4 / Math.max(items.length, 1))
        const tl = gsap
          .timeline({ paused: true })
          .from("[data-item]", {
            opacity: 0.32,
            duration: 0.4,
            stagger: step,
            ease: "power1.out",
          })
          .from(
            "[data-tick]",
            {
              scale: 0,
              autoAlpha: 0,
              duration: 0.4,
              stagger: step,
              ease: "back.out(2.4)",
              immediateRender: true,
            },
            "<0.1"
          )

        // Play once a fifth of the list is on screen. The huge top margin counts
        // anything already scrolled past as seen; that case jumps to the end.
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return
            observer.disconnect()
            if (entry.boundingClientRect.bottom < 0) tl.progress(1)
            else tl.play()
          },
          { rootMargin: "100000px 0px -20% 0px" }
        )
        observer.observe(el)
        return () => observer.disconnect()
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [items.length] }
  )

  return (
    <div ref={ref}>
      <h2 className="mb-6 text-sm font-medium text-brand-gold">{caption}</h2>
      <ul className="columns-2 gap-x-5 font-serif text-[0.9375rem] leading-snug text-brand-forest sm:flex sm:flex-wrap sm:gap-x-7 sm:gap-y-3 sm:text-[clamp(1.0625rem,1.5vw,1.3125rem)]">
        {items.map((item) => (
          <li
            key={item}
            data-item
            className="mb-2.5 flex break-inside-avoid items-baseline gap-2 sm:mb-0 sm:inline-flex"
          >
            <svg
              data-tick
              aria-hidden
              viewBox="0 0 12 12"
              className="size-[0.7em] shrink-0 translate-y-[0.05em] text-brand-gold"
            >
              <path
                d="M2 6.4 4.8 9 10 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
