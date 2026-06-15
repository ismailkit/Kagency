/**
 * Demo: copy-only edit using patchPage. Run with:
 *   node --import=tsx/esm src/scripts/patch-page-demo.ts
 *
 * This script just READS the home page layout and prints a short map so you
 * can see what `path` to use when targeting blocks. No writes are performed.
 */

import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config.js'

const payload = await getPayload({ config })

const slug = process.argv[2] ?? 'home'

const found = await payload.find({
  collection: 'pages' as any,
  where: { slug: { equals: slug } },
  limit: 1,
  depth: 0,
})

if (!found.docs.length) {
  console.error(`No page with slug '${slug}'.`)
  process.exit(1)
}

const doc: any = found.docs[0]
console.log(`\nPage: /${slug}  (${doc.id})`)
console.log(`Layout has ${doc.layout?.length ?? 0} top-level blocks:\n`)

doc.layout?.forEach((sec: any, i: number) => {
  const inner: any[] = sec?.block ?? []
  const innerSummary = inner
    .map((b, j) => `      [${i}, 'block', ${j}] -> ${b.blockType}`)
    .join('\n')
  console.log(`  [${i}] ${sec.blockType}${inner.length ? '\n' + innerSummary : ''}`)
})

console.log('')
process.exit(0)
