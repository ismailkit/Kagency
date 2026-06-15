/**
 * Lightweight Lexical JSON → HTML serializer.
 *
 * Works in both server and client contexts (no Payload server-side imports).
 * All user-supplied text is HTML-escaped before output, making the result safe
 * for dangerouslySetInnerHTML. Link hrefs are validated to accepted schemes only.
 *
 * Existing plain-string CMS values are also handled: they are wrapped in a <p>
 * so legacy content continues to render without re-entry.
 */

type TextNode = {
  type: 'text'
  text: string
  format?: number
}

type LexicalNode =
  | TextNode
  | {
      type: string
      tag?: string
      listType?: string
      children?: LexicalNode[]
      fields?: { url?: string; newTab?: boolean; [key: string]: unknown }
    }

/** Value returned by a Payload richText (Lexical) field from the REST API. */
export type RichTextContent = string | { root: { children: LexicalNode[] } } | null | undefined

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Only allow safe URL schemes to prevent javascript: injection. */
function safeSrc(url: unknown): string {
  if (typeof url !== 'string' || !url) return '#'
  if (
    url.startsWith('/') ||
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('mailto:')
  )
    return url
  return '#'
}

function serializeNode(node: LexicalNode): string {
  if (node.type === 'text') {
    const tn = node as TextNode
    let html = escapeHtml(tn.text ?? '')
    const fmt = tn.format ?? 0
    if (fmt & 1) html = `<strong>${html}</strong>`
    if (fmt & 2) html = `<em>${html}</em>`
    if (fmt & 4) html = `<s>${html}</s>`
    if (fmt & 8) html = `<u>${html}</u>`
    if (fmt & 16) html = `<code>${html}</code>`
    return html
  }

  const el = node as {
    type: string
    tag?: string
    listType?: string
    children?: LexicalNode[]
    fields?: { url?: string; newTab?: boolean }
  }
  const inner = (el.children ?? []).map(serializeNode).join('')

  switch (el.type) {
    case 'paragraph':
      return inner ? `<p>${inner}</p>` : ''
    case 'heading': {
      const tag = el.tag ?? 'h2'
      return `<${tag}>${inner}</${tag}>`
    }
    case 'list': {
      const tag = el.listType === 'number' ? 'ol' : 'ul'
      return `<${tag}>${inner}</${tag}>`
    }
    case 'listitem':
      return `<li>${inner}</li>`
    case 'link': {
      const href = safeSrc(el.fields?.url)
      const target = el.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${href}"${target}>${inner}</a>`
    }
    case 'linebreak':
      return '<br>'
    default:
      return inner
  }
}

/**
 * Convert a Payload richText field value (Lexical JSON or legacy plain string) to
 * a safe HTML string ready for dangerouslySetInnerHTML.
 */
export function richTextToHTML(content: RichTextContent): string {
  if (!content) return ''
  if (typeof content === 'string') {
    // Legacy plain-text value — wrap in a paragraph so it renders consistently
    return `<p>${escapeHtml(content)}</p>`
  }
  const root = (content as { root?: { children?: LexicalNode[] } }).root
  if (!root?.children) return ''
  return root.children.map(serializeNode).join('')
}
