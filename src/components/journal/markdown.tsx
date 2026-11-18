import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"

/** Renders staff-written Markdown. Raw HTML is ignored, so nothing unsafe gets through. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose-detail", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: c }) => {
            const external = href?.startsWith("http")
            return (
              <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
                {c}
              </a>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
