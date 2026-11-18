/** Jodit content begins with HTML block tags; older CMS records are Markdown. */
export function isRichTextHtml(value: string) {
  return /^\s*<(?:p|h[1-6]|ul|ol|blockquote|table|div|section|figure|pre|img|a|hr)\b/i.test(value)
}
