/**
 * Testimonials-only seed. Safe to run without touching pages/services/projects.
 * Run with:  npm run seed:testimonials
 */

import 'dotenv/config'
import { getPayload } from 'payload'

import config from './payload.config.js'

const payload = await getPayload({ config })

// Clear existing testimonials only
const existing = await payload.find({ collection: 'testimonials', limit: 200, pagination: false })
for (const doc of existing.docs) {
  await payload.delete({ collection: 'testimonials', id: doc.id })
}

const testimonials = [
  {
    quote:
      "Kagency didn't just deliver a website. They delivered a brand presence. The attention to detail, the motion work, the typography. Everything felt considered and intentional.",
    author: 'Sophie Andersson',
    role: 'Chief Marketing Officer',
    company: 'Nordhavn Studio',
    featured: true,
    order: 1,
  },
  {
    quote:
      "We had a vague idea. Kagency turned it into something we're genuinely proud of. The process was collaborative, fast, and completely stress-free on our end.",
    author: 'James Okafor',
    role: 'Founder',
    company: 'Helix Ventures',
    featured: true,
    order: 2,
  },
  {
    quote:
      'The new platform cut our content publishing time in half. The headless CMS setup is exactly what we needed: powerful for developers, simple for our editors.',
    author: 'Marta Kowalski',
    role: 'Head of Digital',
    company: 'Meridian Publishing',
    featured: true,
    order: 3,
  },
  {
    quote:
      "Three months after launch, organic traffic is up 60% and our conversion rate has doubled. Kagency's work speaks for itself in the numbers.",
    author: 'Luca Ferretti',
    role: 'CEO',
    company: 'Volta Commerce',
    featured: false,
    order: 4,
  },
  {
    quote:
      'Working with Kagency felt less like hiring an agency and more like gaining a creative partner. They pushed back when we needed it and delivered beyond what we imagined.',
    author: 'Priya Nair',
    role: 'Product Director',
    company: 'Solace Health',
    featured: false,
    order: 5,
  },
]

for (const t of testimonials) {
  await payload.create({ collection: 'testimonials', data: t })
  console.log(`  ✓ testimonial: ${t.author}`)
}

console.log('\n✅  Testimonials seeded.')
process.exit(0)
