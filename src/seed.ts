/**
 * Seed script: fills Payload CMS with dummy data for local development.
 * Run with:  npm run seed
 *
 * Idempotent: safe to run twice. Existing docs in target collections are
 * cleared before re-insertion so you always end up with a clean dataset.
 *
 * Content-only. No styling fields. CMS defaults govern visuals.
 */

import 'dotenv/config'
import { getPayload } from 'payload'

import config from './payload.config.js'

const payload = await getPayload({ config })

// ── helpers ────────────────────────────────────────────────────────────────

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
      console.warn(`  ! media fetch failed (${res.status}): ${filename}`)
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
    console.log(`  + media: ${filename}`)
    return String(doc.id)
  } catch (e) {
    console.warn(`  ! media upload error: ${filename}`, e)
    return null
  }
}

/** Minimal valid Lexical document wrapping plain-text paragraphs. */
function txt(text: string) {
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

const fc = (fields: Record<string, unknown>) => ({ blockType: 'flexContent', ...fields })
const sec = (block: unknown) => ({
  blockType: 'section',
  block: Array.isArray(block) ? block : [block],
})

// ── Services ───────────────────────────────────────────────────────────────

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
      'From concept to final pixel. Photography, layout, and motion all guided by a single creative vision.',
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
      'Performant, accessible, and maintainable web apps built on modern stacks: Next.js, React, TypeScript.',
    featured: true,
    order: 4,
  },
  {
    title: 'Headless CMS',
    category: 'Development',
    shortDescription:
      'Content infrastructure your team can actually use. Payload, Sanity, Contentful, or custom.',
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
      'Cross-channel campaign assets across social, OOH, and digital display, built from a single visual idea.',
    featured: false,
    order: 8,
  },
]

const createdServices: Array<{ id: string }> = []
for (const s of services) {
  const doc = await payload.create({ collection: 'services', data: s })
  createdServices.push({ id: String(doc.id) })
  console.log(`  + service: ${s.title}`)
}

// ── Projects + media ──────────────────────────────────────────────────────

await clearCollection('media')
await clearCollection('projects')

const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`

console.log('\n  Uploading cover images...')
const covers: Record<string, string | null> = {}

const coverDefs: Array<{ key: string; url: string; filename: string; alt: string }> = [
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
  {
    title: 'Lucent Editorial',
    slug: 'lucent-editorial',
    client: 'Lucent Magazine',
    category: 'design',
    summary:
      'Full art-direction overhaul for a quarterly print and digital magazine. Grid systems, typography hierarchy, and a new image treatment language.',
    featured: true,
  },
  {
    title: 'Forma Studio Site',
    slug: 'forma-studio-site',
    client: 'Forma Architecture',
    category: 'design',
    summary:
      'Editorial portfolio site for a boutique architecture studio. Clean white space, oversized imagery, and tactile micro-interactions.',
    featured: false,
  },
  {
    title: 'Sable Product UI',
    slug: 'sable-product-ui',
    client: 'Sable Finance',
    category: 'design',
    summary:
      'End-to-end product design for a challenger bank. Onboarding, dashboard, and cards management across iOS and web.',
    featured: true,
  },
  {
    title: "Christy's Restaurant Group",
    slug: 'christys-restaurant-group',
    client: "Christy's",
    category: 'development',
    summary:
      'Flagship site for a multi-location fine-dining group. Next.js 15, Payload CMS, animated menu explorer, and online booking integration.',
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
      'Full-stack event discovery and ticketing app. React Native mobile, Next.js web portal, and a Payload-backed promoter CMS.',
    featured: true,
  },
  {
    title: 'Veld Spirits',
    slug: 'veld-spirits',
    client: 'Veld',
    category: 'brand',
    summary:
      'Brand identity for a craft distillery. Naming, wordmark, bottle label system, and brand book covering voice, tone, and photography guidelines.',
    featured: true,
  },
  {
    title: 'Meridian Co-Working',
    slug: 'meridian-coworking',
    client: 'Meridian Spaces',
    category: 'brand',
    summary:
      'Full rebrand for a premium co-working chain across 6 cities. Logo, colour palette, wayfinding, and digital touchpoints.',
    featured: true,
  },
  {
    title: 'Ova Skincare',
    slug: 'ova-skincare',
    client: 'Ova',
    category: 'brand',
    summary:
      'Launch brand for a science-led skincare line. Wordmark, packaging system, e-commerce art direction, and social identity.',
    featured: false,
  },
  {
    title: 'Pivot Growth Roadmap',
    slug: 'pivot-growth-roadmap',
    client: 'Pivot SaaS',
    category: 'strategy',
    summary:
      'Six-month embedded growth engagement. Funnel audit, channel prioritisation, A/B testing framework, and a 30/60/90 execution plan.',
    featured: true,
  },
  {
    title: 'Halo Market Entry',
    slug: 'halo-market-entry',
    client: 'Halo Health',
    category: 'strategy',
    summary:
      'Market entry strategy for a digital health startup expanding into three new European markets. Positioning, pricing, and GTM playbook.',
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
  console.log(`  + project: ${p.title}`)
}

// ── Pages: Home only ──────────────────────────────────────────────────────
// Other pages live in dedicated seed files (seed-about.ts, seed-services.ts, etc.).

await clearCollection('pages')

await payload.create({
  collection: 'pages',
  data: {
    title: 'Home',
    slug: 'home',
    excerpt: 'You have an idea. We have the passion, the flair, and the craft to make it real.',
    layout: [
      // 1. Hero
      sec({
        blockType: 'landingHero',
        title:
          'HI, WE ARE KAGENCY.\nyou have an idea?\nwe have the passion, the flair,\nand the craft to make it REAL.',
        subtitle: txt(
          "We don't just build. We partner. From first sketch to live product, we are with you. And we never give up on you.",
        ),
        cta: { label: 'See our work \u2192', href: '/the-agency' },
      }),

      // 2. Social proof numbers
      sec({
        blockType: 'beliefsCounter',
        beliefs: [
          {
            number: '+20',
            title: 'Brands shaped',
            body: txt(
              'Identities, wordmarks, and visual systems we built from a blank page. Each one designed to be remembered, not blended in.',
            ),
          },
          {
            number: '+50',
            title: 'Partners served',
            body: txt(
              'Companies and startups who stopped working with vendors and started working with us. Most have been with us for years.',
            ),
          },
          {
            number: '+10',
            title: 'Markets entered',
            body: txt(
              'Countries where we have launched products, optimized search, or stood up entire digital presences. Local knowledge, global craft.',
            ),
          },
        ],
      }),

      // 3. Strip CTA
      sec(
        fc({
          eyebrow: 'and counting',
          heading: 'the next one\ncould be YOURS.',
          body: txt(
            'When we partner up, you do not just buy a project. You join a small list of clients we are actively building with, every week.',
          ),
          ctaLabel: "Let's chat! \u2192",
          ctaHref: '/contact',
        }),
      ),

      // 4. INVESTED. AND EFFICIENT.
      sec(
        fc({
          eyebrow: 'why we are different',
          heading: 'INVESTED.\nAND EFFICIENT.',
          headingAccent: 'we know the stakes.',
          body: txt(
            'We own digital products ourselves. We know what it costs when something breaks at 2am, when SEO slips, when a launch falls flat.\nSo when we work on yours, we treat it like ours. Every decision, every line of code, every strategy call.\nOne team. Everything your digital presence needs. One line to call.',
          ),
          ctaLabel: 'More about what we do \u2192',
          ctaHref: '/services',
        }),
      ),

      // 5. Works showcase
      sec({
        blockType: 'landingWorks',
        title: 'WORK WE SHIPPED.',
        subtitle:
          'A look at the brands, products, and partnerships we have shaped. Click any column to dig deeper.',
        columns: [
          {
            label: 'Design',
            category: 'design',
            cardTitle: 'Visual systems',
            cardSubtitle: 'identity, UI, art direction',
          },
          {
            label: 'Development',
            category: 'development',
            cardTitle: 'Products in market',
            cardSubtitle: 'web apps, mobile, e-commerce',
          },
          {
            label: 'Brand',
            category: 'brand',
            cardTitle: 'Brand worlds',
            cardSubtitle: 'strategy, voice, packaging',
          },
        ],
      }),

      // 6. Testimonials
      sec({
        blockType: 'testimonialsBlock',
        title: "don't take OUR word for it.",
        subtitle: 'Real partners. Real reviews. No staged copywriting.',
      }),

      // 7. Footer CTA
      sec(
        fc({
          heading: "LIKE WHAT YOU SEE?\ngood. let's make something\nyou'll be PROUD OF.",
          body: txt('End-to-end digital solutions. Bold by default. Built to last.'),
          ctaLabel: 'Send us a message \u2192',
          ctaHref: '/contact',
        }),
      ),
    ],
  },
})
console.log('  + page: home')

console.log('\nSeed complete (services + projects + media + home).')
console.log('Run dedicated seeds for the other pages:')
console.log('  npm run seed:about       npm run seed:services')
console.log('  npm run seed:the-agency  npm run seed:contact')
console.log('  npm run seed:legal       npm run seed:testimonials')
process.exit(0)
