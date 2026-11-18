"use client"

import { useRef } from "react"

import { gsap, REDUCED_MOTION, useGSAP } from "@/components/motion/gsap"
import { cn } from "@/lib/utils"

type RevealProps = React.ComponentProps<"div"> & {
  /** Animate direct children one after another instead of the wrapper. */
  stagger?: number
  /** Start offset in px. */
  y?: number
  delay?: number
}

/**
 * Fades and lifts content in when it scrolls into view.
 *
 * Uses IntersectionObserver rather than ScrollTrigger: it never goes stale
 * after a resize, font swap or anchor jump. Content the user has already
 * scrolled past is shown at once, so nothing can stay hidden. Without JS, or
 * with reduced motion, content is simply visible.
 */
export function Reveal({ stagger, y = 32, delay = 0, className, children, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || window.matchMedia(REDUCED_MOTION).matches) return

      const targets = stagger ? Array.from(el.children) : [el]
      gsap.set(targets, { autoAlpha: 0, y })

      // The huge top margin makes anything *above* the viewport count as seen,
      // so jumping past a section (anchor link, fast scroll) can't strand it hidden.
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          observer.disconnect()
          if (entry.boundingClientRect.bottom < 0) {
            gsap.set(targets, { autoAlpha: 1, y: 0 })
            return
          }
          gsap.to(targets, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            delay,
            ease: "power3.out",
            stagger,
          })
        },
        { rootMargin: "100000px 0px -12% 0px" }
      )
      observer.observe(el)
      return () => observer.disconnect()
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  )
}
