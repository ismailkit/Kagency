/**
 * Minimal REST client for publishing content into Payload programmatically.
 *
 * Auth: a Payload user API key (admin → Account → Enable API Key).
 *   Header format: `Authorization: users API-Key <key>`
 *
 * Env:
 *   PAYLOAD_URL      base URL (default http://localhost:3000) — local OR https://kagency.dev
 *   PAYLOAD_API_KEY  the user's API key (required for writes)
 *
 * Everything goes through the REST API, so Payload validation + hooks (auto-slug,
 * SEO, image sizes) run — nothing is written straight to Mongo. Upserts are by
 * slug, so re-running updates the existing doc instead of wiping the collection.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const BASE = (process.env.PAYLOAD_URL || 'http://localhost:3000').replace(/\/$/, '')
const API_KEY = process.env.PAYLOAD_API_KEY || ''

export function baseUrl() {
  return BASE
}

function authHeaders(extra = {}) {
  if (!API_KEY) throw new Error('PAYLOAD_API_KEY is not set (generate one in the admin)')
  return { Authorization: `users API-Key ${API_KEY}`, ...extra }
}

async function api(pathname, init = {}) {
  const res = await fetch(`${BASE}${pathname}`, init)
  const text = await res.text()
  let json
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    json = { raw: text }
  }
  if (!res.ok) {
    throw new Error(`${init.method || 'GET'} ${pathname} → ${res.status}: ${text.slice(0, 400)}`)
  }
  return json
}

const docOf = (r) => r?.doc ?? r

export async function findOneBySlug(collection, slug) {
  const q = new URLSearchParams({ 'where[slug][equals]': slug, limit: '1', depth: '0' })
  const data = await api(`/api/${collection}?${q.toString()}`, { headers: authHeaders() })
  return data?.docs?.[0] ?? null
}

export async function createDoc(collection, data) {
  return docOf(
    await api(`/api/${collection}`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }),
  )
}

export async function updateDoc(collection, id, data) {
  return docOf(
    await api(`/api/${collection}/${id}`, {
      method: 'PATCH',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }),
  )
}

/** Create the doc, or update the existing one with the same slug. Never deletes. */
export async function upsertBySlug(collection, slug, data) {
  const existing = await findOneBySlug(collection, slug)
  if (existing) {
    const doc = await updateDoc(collection, existing.id, data)
    return { id: existing.id, action: 'updated', doc }
  }
  const doc = await createDoc(collection, data)
  return { id: doc?.id, action: 'created', doc }
}

/** Upload an image (local path OR http(s) URL) to the media collection → returns its id. */
export async function uploadMedia({ src, alt, caption } = {}) {
  if (!src) return undefined
  let buf
  let filename
  let contentType = 'application/octet-stream'
  if (/^https?:\/\//i.test(src)) {
    const r = await fetch(src)
    if (!r.ok) throw new Error(`fetch image ${src} → ${r.status}`)
    buf = Buffer.from(await r.arrayBuffer())
    contentType = r.headers.get('content-type') || contentType
    filename = path.basename(new URL(src).pathname) || 'image'
  } else {
    buf = await readFile(src)
    filename = path.basename(src)
  }
  const form = new FormData()
  form.append('file', new Blob([buf], { type: contentType }), filename)
  form.append('_payload', JSON.stringify({ alt: alt || filename, ...(caption ? { caption } : {}) }))
  const data = await api(`/api/media`, { method: 'POST', headers: authHeaders(), body: form })
  return docOf(data)?.id
}

/** Resolve service titles → relationship ids (unknown titles are skipped with a warning). */
export async function resolveServiceIds(titles = []) {
  const ids = []
  for (const t of titles) {
    if (!t) continue
    const q = new URLSearchParams({ 'where[title][equals]': t, limit: '1', depth: '0' })
    const data = await api(`/api/services?${q.toString()}`, { headers: authHeaders() })
    const id = data?.docs?.[0]?.id
    if (id) ids.push(id)
    else console.warn(`  ! service not found: "${t}" (skipped)`)
  }
  return ids
}

/** Convert markdown → Lexical editor state matching the site's configured editor. */
let _editorConfig
export async function markdownToLexical(markdown) {
  if (!markdown || !markdown.trim()) return undefined
  const { convertMarkdownToLexical, editorConfigFactory } = await import(
    '@payloadcms/richtext-lexical'
  )
  if (!_editorConfig) {
    const mod = await import('../../src/payload.config.ts')
    const sanitizedConfig = await mod.default
    _editorConfig = await editorConfigFactory.default({ config: sanitizedConfig })
  }
  return convertMarkdownToLexical({ editorConfig: _editorConfig, markdown })
}
