"use client"

import dynamic from "next/dynamic"
import MarkdownIt from "markdown-it"
import { useMemo, useState } from "react"

import { isRichTextHtml } from "@/lib/rich-text"

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <div className="min-h-80 animate-pulse bg-muted" />,
})

const markdown = new MarkdownIt({ html: false, linkify: true })

/** Visual HTML editor; existing Markdown is converted when opened for editing. */
export function RichTextInput({
  id,
  value,
  onChange,
  rows = 12,
  invalid,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  rows?: number
  invalid: boolean
}) {
  const initialHtml = useMemo(() => (isRichTextHtml(value) ? value : markdown.render(value)), [value])
  const [html, setHtml] = useState(initialHtml)
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write and format your content…",
      minHeight: Math.max(320, rows * 24),
      toolbarAdaptive: false,
      statusbar: false,
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      buttons: [
        "bold", "italic", "underline", "strikethrough", "|",
        "ul", "ol", "|", "outdent", "indent", "|",
        "font", "fontsize", "brush", "paragraph", "|",
        "align", "|", "link", "table", "|", "undo", "redo", "|", "hr", "eraser",
      ],
    }),
    [rows]
  )

  return (
    <div id={id} aria-invalid={invalid || undefined} className={invalid ? "overflow-hidden rounded-md border border-destructive" : "overflow-hidden rounded-md border"}>
      <JoditEditor
        value={html}
        config={config}
        tabIndex={0}
        onChange={setHtml}
        onBlur={(nextHtml) => {
          setHtml(nextHtml)
          onChange(nextHtml)
        }}
      />
    </div>
  )
}
