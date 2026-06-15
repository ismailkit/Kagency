/**
 * Content-only page patcher.
 *
 * Updates targeted fields on an existing page WITHOUT touching styling,
 * animations, layout structure, or any block you didn't address. Reads the
 * current document, deep-merges the patch, writes it back.
 *
 * Use this for copy edits. Never call payload.update with a full `layout` array
 * if you want to preserve admin-side styling.
 *
 * USAGE:
 *
 *   import { patchPage, txt } from './lib/patch-page.ts'
 *
 *   await patchPage(payload, 'about', {
 *     // Top-level page fields (excerpt, title, etc.)
 *     fields: { excerpt: 'New excerpt copy.' },
 *
 *     // Block-level patches. `path` walks layout[]. Within a Section block,
 *     // its inner block lives at path [sectionIndex, 'block', innerIndex].
 *     blocks: [
 *       // Section 0 -> pageHero: just change the title
 *       { path: [0, 'block', 0], set: { title: 'New hero title' } },
 *
 *       // Section 1 -> flexContent: heading + body + CTA
 *       {
 *         path: [1, 'block', 0],
 *         set: {
 *           eyebrow: 'OUR POSITION',
 *           heading: 'WE ARE NOT HERE TO EXECUTE SPECS.',
 *           body: txt('We are here to ship work that earns its keep.'),
 *           ctaLabel: 'Get in touch \u2192',
 *           ctaHref: '/contact',
 *         },
 *       },
 *
 *       // Nested array: pillar 0 inside aboutPillars
 *       { path: [2, 'block', 0, 'pillars', 0], set: { body: 'New pillar body.' } },
 *     ],
 *   })
 *
 * Anything not in `set` is preserved (colors, paddings, animations, bgSVG,
 * borders, sizes, etc.). Anything not in `blocks` is preserved (whole sections
 * stay as-is, including their order).
 */

import type { Payload } from 'payload'

/** Minimal valid Lexical document wrapping plain-text paragraphs (one per line). */
export function txt(text: string) {
  const lines = text.split(/\r?\n/)
  const paragraphs = lines.map((line) => ({
    children: line.length
      ? [{ detail: 0, format: 0, mode: 'normal', style: '', text: line, type: 'text', version: 1 }]
      : [],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
  }))
  return {
    root: {
      children: paragraphs,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

type Path = ReadonlyArray<string | number>

interface BlockPatch {
  /** Address inside layout[]. Examples:
   *  - [0]                     -> layout[0] (a Section block itself)
   *  - [0, 'block', 0]         -> the first inner block of Section at layout[0]
   *  - [2, 'block', 0, 'pillars', 0]  -> nested array element
   */
  path: Path
  /** Field name -> new value. Only listed fields are written. */
  set: Record<string, unknown>
}

interface PatchPageInput {
  /** Top-level page fields to update (e.g. excerpt, title). Optional. */
  fields?: Record<string, unknown>
  /** Targeted block patches. Optional. */
  blocks?: BlockPatch[]
}

function getAt(root: unknown, path: Path): unknown {
  let cur: any = root
  for (const key of path) {
    if (cur == null) return undefined
    cur = cur[key as any]
  }
  return cur
}

export async function patchPage(
  payload: Payload,
  slug: string,
  input: PatchPageInput,
): Promise<void> {
  const found = await payload.find({
    collection: 'pages' as any,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  if (!found.docs.length) {
    throw new Error(`patchPage: no page with slug '${slug}'`)
  }

  const doc: any = found.docs[0]
  // Deep clone so we never mutate the cached doc.
  const next: any = JSON.parse(JSON.stringify(doc))

  // Top-level fields.
  if (input.fields) {
    for (const [k, v] of Object.entries(input.fields)) {
      next[k] = v
    }
  }

  // Block-level patches: walk path, then merge listed fields only.
  if (input.blocks?.length) {
    if (!Array.isArray(next.layout)) {
      throw new Error(`patchPage: page '${slug}' has no layout array`)
    }
    for (const patch of input.blocks) {
      const target = getAt(next.layout, patch.path) as Record<string, unknown> | undefined
      if (!target || typeof target !== 'object') {
        throw new Error(`patchPage: path [${patch.path.join(', ')}] not found on page '${slug}'`)
      }
      for (const [k, v] of Object.entries(patch.set)) {
        ;(target as any)[k] = v
      }
    }
  }

  // Strip Payload-managed fields that update() rejects on write.
  delete next.id
  delete next.createdAt
  delete next.updatedAt
  delete next._id

  await payload.update({
    collection: 'pages' as any,
    id: doc.id,
    data: next,
    depth: 0,
  })
}
