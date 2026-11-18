import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3.5 transition-transform duration-200 active:scale-95">
      <span className="flex size-10 items-center justify-center rounded-lg bg-brand-forest font-serif text-2xl font-bold text-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-forest-dark group-hover:shadow-md">
        D
      </span>
      <span className="flex flex-col">
        <span className="text-base font-bold tracking-wider text-brand-forest uppercase">Detail</span>
        <span className="-mt-1 hidden text-[11px] font-medium tracking-widest text-gray-500 uppercase sm:block">
          Education Consultancy
        </span>
      </span>
    </Link>
  )
}
