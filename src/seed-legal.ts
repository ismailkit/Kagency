/**
 * Seed: writes the /legal page (content in src/content/legal.ts) straight into the database.
 * For the live site use `npm run publish:legal` instead: it goes through the REST API and needs
 * no database access. Run: npm run seed:legal
 */

import 'dotenv/config'
import { getPayload } from 'payload'

import { legalPage } from './content/legal.ts'
import payloadConfig from './payload.config.ts'

async function seed() {
  const payload = await getPayload({ config: payloadConfig })
  const { slug } = legalPage

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const data = legalPage as any

  if (existing.docs.length) {
    await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
    console.log(`✓ updated /${slug}`)
  } else {
    await payload.create({ collection: 'pages', data })
    console.log(`✓ created /${slug}`)
  }

  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
