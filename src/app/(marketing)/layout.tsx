import { MarketingFooter } from "@/components/marketing/footer"
import { MarketingHeader } from "@/components/marketing/header"
import { SmoothScroll } from "@/components/motion/smooth-scroll"

/**
 * Public site chrome. The design is light-only, so this subtree uses brand
 * colours directly and ignores the app's dark theme.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-white text-brand-charcoal selection:bg-brand-gold/30 selection:text-brand-forest [color-scheme:light]">
      <SmoothScroll>
        <MarketingHeader />
        <main className="flex-1">{children}</main>
        <MarketingFooter />
      </SmoothScroll>
    </div>
  )
}
