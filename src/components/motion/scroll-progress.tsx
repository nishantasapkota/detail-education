"use client"

import { useRef } from "react"

import { gsap, useGSAP } from "@/components/motion/gsap"

/** Thin bar at the top of the viewport that tracks page scroll. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      ref.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      }
    )
  })

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left scale-x-0 bg-primary"
    />
  )
}
