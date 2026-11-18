import "server-only"

import sanitizeHtml from "sanitize-html"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"
import { isRichTextHtml } from "@/lib/rich-text"

const richHtmlOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "a", "blockquote", "br", "code", "del", "div", "em", "h1", "h2", "h3", "h4", "h5", "h6",
    "hr", "img", "li", "ol", "p", "pre", "s", "span", "strong", "sub", "sup", "table", "tbody",
    "td", "th", "thead", "tr", "u", "ul",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan", "scope"],
    "*": ["style"],
  },
  allowedStyles: {
    "*": {
      "text-align": [/^(left|right|center|justify)$/],
      color: [/^(#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]{1,20})$/i],
      "background-color": [/^(#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]{1,20})$/i],
      "font-size": [/^\d+(\.\d+)?(px|em|rem|%)$/],
      "font-family": [/^[\w\s,'"-]{1,100}$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
}

/** Renders sanitized Jodit HTML and continues to support existing Markdown content. */
export function RichContent({ children, className }: { children: string; className?: string }) {
  const proseClass = cn("prose-detail", className)

  if (isRichTextHtml(children)) {
    return <div className={proseClass} dangerouslySetInnerHTML={{ __html: sanitizeHtml(children, richHtmlOptions) }} />
  }

  return (
    <div className={proseClass}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: linkChildren }) => {
            const external = href?.startsWith("http")
            return (
              <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
                {linkChildren}
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
