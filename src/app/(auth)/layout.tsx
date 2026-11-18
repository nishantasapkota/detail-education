import { Logo } from "@/components/marketing/logo"

/** Staff sign-in. Always light, in the brand palette. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-brand-cream text-brand-charcoal [color-scheme:light]">
      <header className="mx-auto flex h-20 w-full max-w-7xl items-center px-6 lg:px-12">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-20">{children}</main>
    </div>
  )
}
