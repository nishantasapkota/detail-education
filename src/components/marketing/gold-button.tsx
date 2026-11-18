import Link from "next/link"

import { cn } from "@/lib/utils"

const SIZES = {
  sm: "px-5 py-2.5 text-xs tracking-wide shadow-sm hover:shadow-md",
  lg: "px-8 py-3.5 text-sm shadow-lg hover:shadow-xl",
}

/** The amber pill CTA used across the marketing page. */
export function GoldButton({
  href,
  size = "lg",
  className,
  children,
}: {
  href: string
  size?: keyof typeof SIZES
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "btn-sheen inline-flex items-center whitespace-nowrap justify-center rounded-full bg-brand-gold font-semibold text-brand-forest transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-gold-hover active:scale-[0.98]",
        SIZES[size],
        className
      )}
    >
      {children}
    </Link>
  )
}
