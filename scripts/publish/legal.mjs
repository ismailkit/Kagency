/**
 * Publish the /legal page (content in src/content/legal.ts) to a running site through the
 * REST API. Needs no database access and no PowerShell, so it works against the live site
 * from any computer:
 *
 *   PAYLOAD_URL=https://kagency.dev PAYLOAD_API_KEY=<admin API key> npm run publish:legal
 *   npm run publish:legal -- --dry-run     # show what would be sent, change nothing
 *
 * Upserts by slug: updates the existing page, never deletes anything.
 */
import { legalPage } from '../../src/content/legal.ts'
import { baseUrl, upsertBySlug } from './payload-client.mjs'

const dry = process.argv.includes('--dry-run')

console.log(`/legal → ${baseUrl()} (${legalPage.layout.length} sections)${dry ? ' [dry run]' : ''}`)
if (dry) {
  for (const s of legalPage.layout) {
    const b = s.block[0]
    console.log(`  - ${b.blockType}: ${(b.eyebrow || b.title || '').replace(/\n/g, ' ')}`)
  }
  process.exit(0)
}

const { action, id } = await upsertBySlug('pages', legalPage.slug, legalPage)
console.log(`✓ ${action} /legal (id ${id}) — check ${baseUrl()}/legal`)
