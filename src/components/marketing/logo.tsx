import Link from "next/link"
import Image from "next/image"

type LogoProps = {
  className?: string
  priority?: boolean
}

export function Logo({ className = "", priority = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Detail Education Consultancy home"
      className={`inline-flex shrink-0 items-center transition-transform duration-200 active:scale-95 ${className}`}
    >
      <Image
        src="/images/detail-education-consultancy-logo.png"
        alt="Detail Education Consultancy"
        width={192}
        height={96}
        priority={priority}
        className="h-auto w-36 sm:w-40"
      />
    </Link>
  )
}
