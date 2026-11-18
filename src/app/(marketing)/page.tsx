import type { Metadata } from "next"

import { Consultation } from "@/components/marketing/consultation"
import { Destinations } from "@/components/marketing/destinations"
import { Hero } from "@/components/marketing/hero"
import { Journal } from "@/components/marketing/journal"
import { Philosophy } from "@/components/marketing/philosophy"
import { Process } from "@/components/marketing/process"
import { StatsBar } from "@/components/marketing/stats-bar"
import { TestPrep } from "@/components/marketing/test-prep"
import { Testimonials } from "@/components/marketing/testimonials"
import { ScrollProgress } from "@/components/motion/scroll-progress"
import {
  getArticles,
  getBusiness,
  getCourses,
  getFeaturedTeamMember,
  getHomeContent,
  getServices,
  getTestimonials,
} from "@/services/content.service"

export async function generateMetadata(): Promise<Metadata> {
  const c = await getHomeContent()
  return { title: { absolute: c.seoTitle }, description: c.seoDescription }
}

/** Every piece of copy and every list here is edited in the admin. All reads are cached. */
export default async function HomePage() {
  const [content, business, services, courses, testimonials, member, articles] = await Promise.all([
    getHomeContent(),
    getBusiness(),
    getServices(),
    getCourses(),
    getTestimonials(),
    getFeaturedTeamMember(),
    getArticles({ limit: 3, featuredFirst: true }),
  ])

  return (
    <>
      <ScrollProgress />
      <Hero content={content} />
      <StatsBar stats={content.stats} whatsappUrl={business.whatsappUrl} />
      <Destinations content={content} />
      <Process content={content} steps={services} />
      <Philosophy content={content} member={member} />
      <TestPrep content={content} courses={courses} />
      <Journal content={content} articles={articles} />
      {testimonials.length > 0 && (
        <Testimonials kicker={content.storiesKicker} title={content.storiesTitle} items={testimonials} />
      )}
      <Consultation content={content} business={business} />
    </>
  )
}
