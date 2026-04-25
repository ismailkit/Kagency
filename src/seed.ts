/**
 * Seed script — fills Payload CMS with dummy data for local development.
 * Run with:  npm run seed
 *
 * It is idempotent: running it twice is safe. Existing docs are deleted by slug/title
 * before re-insertion so you always end up with a clean, consistent dataset.
 */

import 'dotenv/config'
import { getPayload } from 'payload'

import config from './payload.config.js'

const payload = await getPayload({ config })

// ─── helpers ────────────────────────────────────────────────────────────────

async function clearCollection(slug: 'services' | 'projects' | 'pages' | 'media') {
  const existing = await payload.find({ collection: slug, limit: 200, pagination: false })
  for (const doc of existing.docs) {
    await payload.delete({ collection: slug, id: doc.id })
  }
}

/**
 * Fetches an image from a URL, uploads it to the Payload media collection,
 * and returns the new document's ID (or null on failure).
 */
async function seedMedia(url: string, filename: string, alt: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`  ⚠ media fetch failed (${res.status}): ${filename}`)
      return null
    }
    const arrayBuffer = await res.arrayBuffer()
    const data = Buffer.from(arrayBuffer)
    const mimetype = res.headers.get('content-type') ?? 'image/jpeg'
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      file: { data, mimetype, name: filename, size: data.length },
    })
    console.log(`  ✓ media: ${filename}`)
    return String(doc.id)
  } catch (e) {
    console.warn(`  ⚠ media upload error: ${filename}`, e)
    return null
  }
}

// ─── Services ───────────────────────────────────────────────────────────────

await clearCollection('services')

const services = [
  {
    title: 'Brand Identity',
    category: 'Brand',
    shortDescription:
      'We craft logos, colour systems, and visual languages that make your brand impossible to ignore.',
    featured: true,
    order: 1,
  },
  {
    title: 'Art Direction',
    category: 'Design',
    shortDescription:
      'From concept to final pixel — photography, layout, and motion all guided by a single creative vision.',
    featured: true,
    order: 2,
  },
  {
    title: 'UI / UX Design',
    category: 'Design',
    shortDescription:
      'Products people enjoy using. We design interfaces grounded in research, not trends.',
    featured: true,
    order: 3,
  },
  {
    title: 'Web Development',
    category: 'Development',
    shortDescription:
      'Performant, accessible, and maintainable web apps built on modern stacks — Next.js, React, TypeScript.',
    featured: true,
    order: 4,
  },
  {
    title: 'Headless CMS',
    category: 'Development',
    shortDescription:
      'Content infrastructure your team can actually use — Payload, Sanity, Contentful, or custom.',
    featured: false,
    order: 5,
  },
  {
    title: 'Digital Strategy',
    category: 'Growth',
    shortDescription:
      'Channel mix, positioning, and growth roadmaps built from data, not guesswork.',
    featured: true,
    order: 6,
  },
  {
    title: 'SEO & Performance',
    category: 'Growth',
    shortDescription:
      'Core Web Vitals, structured data, and content strategy that earns organic traffic.',
    featured: false,
    order: 7,
  },
  {
    title: 'Campaign Design',
    category: 'Brand',
    shortDescription:
      'Cross-channel campaign assets — social, OOH, digital display — built from a single visual idea.',
    featured: false,
    order: 8,
  },
]

const createdServices: Array<{ id: string }> = []
for (const s of services) {
  const doc = await payload.create({ collection: 'services', data: s })
  createdServices.push({ id: String(doc.id) })
  console.log(`  ✓ service: ${s.title}`)
}

// ─── Projects ───────────────────────────────────────────────────────────────

await clearCollection('media')
await clearCollection('projects')

// Curated Unsplash photos — format: photo-{id}?w=1200&q=80&auto=format&fit=crop
const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`

console.log('\n  Uploading cover images...')
const covers: Record<string, string | null> = {}

const coverDefs: Array<{ key: string; url: string; filename: string; alt: string }> = [
  // Design
  {
    key: 'lucent-editorial',
    url: U('1507003211169-0a1dd7228f2d'),
    filename: 'lucent-editorial.jpg',
    alt: 'Lucent Editorial magazine spread',
  },
  {
    key: 'forma-studio-site',
    url: U('1487958449943-2429e8be8625'),
    filename: 'forma-studio-site.jpg',
    alt: 'Forma Architecture portfolio',
  },
  {
    key: 'sable-product-ui',
    url: U('1551288049-bebda4e38f71'),
    filename: 'sable-product-ui.jpg',
    alt: 'Sable Finance product UI',
  },
  // Development
  {
    key: 'christys-restaurant-group',
    url: U('1414235077428-338989a2e8c0'),
    filename: 'christys.jpg',
    alt: "Christy's fine dining plating",
  },
  {
    key: 'apex-commerce-platform',
    url: U('1556742049-0cfed4f6a45d'),
    filename: 'apex-commerce.jpg',
    alt: 'Apex Commerce retail experience',
  },
  {
    key: 'nocturne-events-app',
    url: U('1459749411175-04bf5292ceea'),
    filename: 'nocturne-events.jpg',
    alt: 'Nocturne live event crowd',
  },
  // Brand
  {
    key: 'veld-spirits',
    url: U('1569529465841-dfecdab7503b'),
    filename: 'veld-spirits.jpg',
    alt: 'Veld craft spirits bottle',
  },
  {
    key: 'meridian-coworking',
    url: U('1497366216548-37526070297c'),
    filename: 'meridian-coworking.jpg',
    alt: 'Meridian co-working open space',
  },
  {
    key: 'ova-skincare',
    url: U('1556228578-8c89e6adf883'),
    filename: 'ova-skincare.jpg',
    alt: 'Ova skincare product line',
  },
  // Strategy
  {
    key: 'pivot-growth-roadmap',
    url: U('1454165804606-c3d57bc86b40'),
    filename: 'pivot-growth.jpg',
    alt: 'Pivot SaaS growth planning session',
  },
  {
    key: 'halo-market-entry',
    url: U('1576091160399-112ba8d25d1d'),
    filename: 'halo-health.jpg',
    alt: 'Halo Health market strategy',
  },
]

for (const def of coverDefs) {
  covers[def.key] = await seedMedia(def.url, def.filename, def.alt)
}

const projects = [
  // Design
  {
    title: 'Lucent Editorial',
    slug: 'lucent-editorial',
    client: 'Lucent Magazine',
    category: 'design',
    summary:
      'Full art-direction overhaul for a quarterly print and digital magazine — grid systems, typography hierarchy, and a new image treatment language.',
    featured: true,
  },
  {
    title: 'Forma Studio Site',
    slug: 'forma-studio-site',
    client: 'Forma Architecture',
    category: 'design',
    summary:
      'Editorial portfolio site for a boutique architecture studio — clean white space, oversized imagery, and tactile micro-interactions.',
    featured: false,
  },
  {
    title: 'Sable Product UI',
    slug: 'sable-product-ui',
    client: 'Sable Finance',
    category: 'design',
    summary:
      'End-to-end product design for a challenger bank — onboarding, dashboard, and cards management across iOS and web.',
    featured: true,
  },

  // Development
  {
    title: "Christy's Restaurant Group",
    slug: 'christys-restaurant-group',
    client: "Christy's",
    category: 'development',
    summary:
      'Flagship site for a multi-location fine-dining group — Next.js 15, Payload CMS, animated menu explorer, and online booking integration.',
    featured: true,
  },
  {
    title: 'Apex Commerce Platform',
    slug: 'apex-commerce-platform',
    client: 'Apex Retail',
    category: 'development',
    summary:
      'Custom headless storefront on Next.js + Shopify Storefront API with split-testing, personalisation engine, and real-time inventory.',
    featured: false,
  },
  {
    title: 'Nocturne Events App',
    slug: 'nocturne-events-app',
    client: 'Nocturne',
    category: 'development',
    summary:
      'Full-stack event discovery and ticketing app — React Native mobile, Next.js web portal, and a Payload-backed promoter CMS.',
    featured: true,
  },

  // Brand
  {
    title: 'Veld Spirits',
    slug: 'veld-spirits',
    client: 'Veld',
    category: 'brand',
    summary:
      'Brand identity for a craft distillery — naming, wordmark, bottle label system, and brand book covering voice, tone, and photography guidelines.',
    featured: true,
  },
  {
    title: 'Meridian Co-Working',
    slug: 'meridian-coworking',
    client: 'Meridian Spaces',
    category: 'brand',
    summary:
      'Full rebrand for a premium co-working chain across 6 cities — logo, colour palette, wayfinding, and digital touchpoints.',
    featured: true,
  },
  {
    title: 'Ova Skincare',
    slug: 'ova-skincare',
    client: 'Ova',
    category: 'brand',
    summary:
      'Launch brand for a science-led skincare line — wordmark, packaging system, e-commerce art direction, and social identity.',
    featured: false,
  },

  // Strategy
  {
    title: 'Pivot Growth Roadmap',
    slug: 'pivot-growth-roadmap',
    client: 'Pivot SaaS',
    category: 'strategy',
    summary:
      'Six-month embedded growth engagement — funnel audit, channel prioritisation, A/B testing framework, and a 30/60/90 execution plan.',
    featured: true,
  },
  {
    title: 'Halo Market Entry',
    slug: 'halo-market-entry',
    client: 'Halo Health',
    category: 'strategy',
    summary:
      'Market entry strategy for a digital health startup expanding into three new European markets — positioning, pricing, and GTM playbook.',
    featured: false,
  },
]

for (const p of projects) {
  const coverId = covers[p.slug]
  await payload.create({
    collection: 'projects',
    data: {
      ...p,
      ...(coverId ? { coverImage: coverId } : {}),
      services: createdServices.slice(0, 2).map((s) => s.id),
      publishedAt: new Date().toISOString(),
    },
  })
  console.log(`  ✓ project: ${p.title}`)
}

// ─── Pages ──────────────────────────────────────────────────────────────────

await clearCollection('pages')

// Helper to wrap a content block in a section block
function section(
  block: Record<string, unknown>,
  opts: {
    containerStyle?: string
    useNoise?: 'solid' | 'gradient' | 'none'
    bgColor?: string
  } = {},
) {
  return {
    blockType: 'section',
    containerStyle: opts.containerStyle ?? 'normal',
    useNoise: opts.useNoise ?? 'none',
    backgrounds: opts.bgColor
      ? [{ type: 'solid', color: opts.bgColor, opacity: 1, blendMode: 'normal' }]
      : [],
    block: [block],
  }
}

// ── Home ──────────────────────────────────────────────────────────────────

await payload.create({
  collection: 'pages',
  data: {
    title: 'Home',
    slug: 'home',
    excerpt: 'We make digital things people actually want to use.',
    layout: [
      section(
        {
          blockType: 'landingHero',
          title: 'We make digital things people actually want to use.',
          subtitle:
            'Kagency is a full-service creative studio — brand, design, and engineering under one roof.',
          cta: { label: 'See Our Work', href: '/the-agency' },
        },
        { bgColor: '#242424', useNoise: 'solid' },
      ),
      section(
        {
          blockType: 'landingWorks',
          title: 'Our Work',
          subtitle: "Brands built to last. Products built to grow. Here's what we've been making.",
          columns: [
            {
              label: 'Design',
              category: 'design',
              cardTitle: 'Visual Work',
              cardSubtitle: 'identity & UI',
            },
            {
              label: 'Development',
              category: 'development',
              cardTitle: 'Built Things',
              cardSubtitle: 'web & apps',
            },
            {
              label: 'Brand',
              category: 'brand',
              cardTitle: 'Brand Worlds',
              cardSubtitle: 'strategy & voice',
            },
          ],
        },
        { bgColor: '#f4f4f0' },
      ),
      section(
        {
          blockType: 'servicesGrid',
          title: 'What We Do',
          featuredOnly: true,
        },
        { bgColor: '#ffffff' },
      ),
    ],
  },
})
console.log('  ✓ page: home')

// ── The Agency ────────────────────────────────────────────────────────────

await payload.create({
  collection: 'pages',
  data: {
    title: 'The Agency',
    slug: 'the-agency',
    excerpt: 'A look at our process, our work, and our people.',
    layout: [
      section(
        {
          blockType: 'pageHero',
          title: 'The Agency',
          subtitle:
            'We are a tight team of designers, engineers, and strategists who ship work we are proud of.',
        },
        { bgColor: '#242424' },
      ),
      section(
        {
          blockType: 'projectsGrid',
          title: 'Selected Work',
          featuredOnly: true,
          limit: 6,
        },
        { bgColor: '#f4f4f0' },
      ),
    ],
  },
})
console.log('  ✓ page: the-agency')

// ── Services ──────────────────────────────────────────────────────────────

await payload.create({
  collection: 'pages',
  data: {
    title: 'Services',
    slug: 'services',
    excerpt: 'Everything you need from a single studio.',
    layout: [
      section(
        {
          blockType: 'pageHero',
          title: 'Services',
          subtitle: 'From idea to launch — strategy, design, and engineering in one place.',
        },
        { bgColor: '#242424' },
      ),
      section(
        {
          blockType: 'servicesGrid',
          title: 'What We Offer',
          featuredOnly: false,
        },
        { bgColor: '#f4f4f0' },
      ),
    ],
  },
})
console.log('  ✓ page: services')

// ── About ─────────────────────────────────────────────────────────────────

await payload.create({
  collection: 'pages',
  data: {
    title: 'About',
    slug: 'about',
    excerpt: 'Why we built Kagency and how we work.',
    layout: [
      section(
        {
          blockType: 'pageHero',
          title: 'About',
          subtitle:
            'We started Kagency because great work rarely comes from siloed agencies. Design, engineering, and strategy need to breathe the same air.',
        },
        { bgColor: '#242424' },
      ),
      section(
        {
          blockType: 'projectsGrid',
          title: 'Work We Are Proud Of',
          featuredOnly: false,
          limit: 4,
        },
        { bgColor: '#f4f4f0' },
      ),
    ],
  },
})
console.log('  ✓ page: about')

// ── Contact ───────────────────────────────────────────────────────────────

await payload.create({
  collection: 'pages',
  data: {
    title: 'Contact',
    slug: 'contact',
    excerpt: 'Start a conversation.',
    layout: [
      section(
        {
          blockType: 'contactForm',
          title: "Let's Talk",
          subtitle: 'Tell us about your project. We will get back to you within one business day.',
        },
        { bgColor: '#242424' },
      ),
    ],
  },
})
console.log('  ✓ page: contact')

console.log('\n✅  Seed complete.')
process.exit(0)
