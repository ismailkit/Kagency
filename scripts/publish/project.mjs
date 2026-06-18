/**
 * Publish (create or update) a project / case study from a JSON spec.
 *
 *   npm run publish:project -- path/to/spec.json
 *
 * The spec is plain JSON an AI (or human) can author. Images are local paths or
 * URLs (uploaded automatically); the case-study body is markdown (converted to
 * Lexical); services are matched by title. Upsert is by `slug` — safe to re-run.
 *
 * See scripts/publish/README.md for the full spec format + an example.
 */
import { readFile } from 'node:fs/promises'

import {
  baseUrl,
  markdownToLexical,
  resolveServiceIds,
  uploadMedia,
  upsertBySlug,
} from './payload-client.mjs'

function slugify(s = '') {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const specPath = process.argv[2]
if (!specPath) {
  console.error('Usage: npm run publish:project -- <spec.json>')
  process.exit(1)
}

const spec = JSON.parse(await readFile(specPath, 'utf8'))
const slug = spec.slug || slugify(spec.title)
if (!slug) throw new Error('spec must include "title" or "slug"')
if (!spec.title || !spec.client || !spec.category || !spec.summary) {
  throw new Error('spec must include title, client, category and summary (all required)')
}

console.log(`Publishing project "${slug}" → ${baseUrl()}`)

// 1) Media
let coverImage
if (spec.coverImage) {
  console.log('  • uploading cover image…')
  coverImage = await uploadMedia(spec.coverImage)
}

const gallery = []
for (const g of spec.gallery || []) {
  console.log(`  • uploading gallery image ${g.src}…`)
  const id = await uploadMedia(g)
  if (id) gallery.push({ image: id, ...(g.caption ? { caption: g.caption } : {}) })
}

// 2) Relationships + rich text
const services = await resolveServiceIds(spec.services || [])
const content = await markdownToLexical(spec.contentMarkdown)

// 3) SEO image (explicit src, or reuse the cover)
let metaImage
if (spec.meta?.imageSrc) {
  metaImage = await uploadMedia({ src: spec.meta.imageSrc, alt: spec.meta?.title || spec.title })
} else if (spec.meta?.useCoverImage && coverImage) {
  metaImage = coverImage
}

// 4) Assemble + upsert
const data = {
  title: spec.title,
  slug,
  client: spec.client,
  category: spec.category,
  summary: spec.summary,
  role: spec.role,
  timeline: spec.timeline,
  projectUrl: spec.projectUrl,
  featured: spec.featured ?? false,
  publishedAt: spec.publishedAt,
  ...(coverImage ? { coverImage } : {}),
  ...(gallery.length ? { gallery } : {}),
  ...(services.length ? { services } : {}),
  ...(content ? { content } : {}),
  ...(spec.meta
    ? {
        meta: {
          ...(spec.meta.title ? { title: spec.meta.title } : {}),
          ...(spec.meta.description ? { description: spec.meta.description } : {}),
          ...(metaImage ? { image: metaImage } : {}),
        },
      }
    : {}),
}
for (const k of Object.keys(data)) if (data[k] === undefined) delete data[k]

const result = await upsertBySlug('projects', slug, data)
console.log(`\n✓ ${result.action} project "${slug}" (id ${result.id})`)
console.log(`  View: ${baseUrl()}/projects/${slug}`)
