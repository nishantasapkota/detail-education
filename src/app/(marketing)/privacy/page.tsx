import type { Metadata } from "next"

import { Markdown } from "@/components/journal/markdown"
import { getLegalPage } from "@/services/content.service"

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getLegalPage("privacy")).title }
}

export default async function LegalPage() {
  const page = await getLegalPage("privacy")
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="mb-10 font-serif text-4xl tracking-tight text-brand-forest">{page.title}</h1>
      <Markdown className="text-gray-800">{page.body}</Markdown>
    </div>
  )
}
