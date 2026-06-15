/**
 * One-time migration: convert all plain string values stored in Lexical richText
 * fields to proper Lexical JSON documents.
 *
 * Affected field names: body, subtitle
 *
 * Usage:
 *   npx tsx src/migrate-richtext.ts
 *
 * Safe to run multiple times — already-converted Lexical objects are left untouched.
 */

import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

// ── Lexical document builder ─────────────────────────────────────────────────

/**
 * Wrap a plain string in a minimal valid Lexical document.
 * Preserves newlines by splitting on \n and creating one paragraph per line.
 */
function stringToLexical(text: string) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  const paragraphs = (lines.length ? lines : [text]).map((line) => ({
    children: [
      {
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text: line,
        type: 'text',
        version: 1,
      },
    ],
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

// ── Field names that are now richText ────────────────────────────────────────

const RICHTEXT_FIELDS = new Set(['body', 'subtitle'])

// ── Recursive migrator ───────────────────────────────────────────────────────

/**
 * Recursively walk `obj` and convert any string value whose key is in
 * RICHTEXT_FIELDS into a Lexical JSON document. Returns true if any change was made.
 */
function migrate(obj: Record<string, unknown>): boolean {
  let changed = false

  for (const key of Object.keys(obj)) {
    const val = obj[key]

    if (RICHTEXT_FIELDS.has(key) && typeof val === 'string') {
      console.log(
        `  → converting field "${key}": "${val.slice(0, 60)}${val.length > 60 ? '…' : ''}"`,
      )
      obj[key] = stringToLexical(val)
      changed = true
    } else if (Array.isArray(val)) {
      for (const item of val) {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          if (migrate(item as Record<string, unknown>)) changed = true
        }
      }
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      if (migrate(val as Record<string, unknown>)) changed = true
    }
  }

  return changed
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const uri = process.env.DATABASE_URL
  if (!uri) {
    console.error('DATABASE_URL is not set in .env')
    process.exit(1)
  }

  console.log('Connecting to MongoDB…')
  await mongoose.connect(uri)
  const db = mongoose.connection.db
  if (!db) {
    console.error('Could not get DB handle')
    process.exit(1)
  }

  const COLLECTIONS = [
    {
      name: 'pages',
      label: (d: Record<string, unknown>) => `"${d['title']}" (slug: ${d['slug']})`,
    },
    { name: 'services', label: (d: Record<string, unknown>) => `"${d['title']}"` },
  ]

  let totalUpdated = 0

  for (const { name, label } of COLLECTIONS) {
    const collection = db.collection(name)
    const docs = await collection.find({}).toArray()
    console.log(`\nCollection "${name}": ${docs.length} doc(s)`)

    for (const doc of docs) {
      const d = doc as Record<string, unknown>
      console.log(`  ${label(d)}`)
      const changed = migrate(d)

      if (changed) {
        const { _id, ...rest } = d
        await collection.replaceOne({ _id }, rest)
        console.log(`    ✓ updated`)
        totalUpdated++
      } else {
        console.log(`    — no string fields found, skipping`)
      }
    }
  }

  console.log(`\nDone. Updated ${totalUpdated} doc(s) total.`)
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
