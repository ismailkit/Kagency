/**
 * Seed: Contact page.
 */

import 'dotenv/config'
import { getPayload } from 'payload'

import payloadConfig from './payload.config.ts'

const txt = (text: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: text.split('\n').map((line) => ({
      type: 'paragraph',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      textFormat: 0,
      textStyle: '',
      children: line.length
        ? [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal' as const,
              style: '',
              text: line,
              version: 1,
            },
          ]
        : [],
    })),
  },
})

// ── SVG watermarks ───────────────────────────────────────────────────────────
const K_MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 178.2 177.81" width="700" height="700" opacity="0.07"><path fill="#ffffff" d="M68.95,103.42c-4.98,6.31-7.64,13.2-11.09,19.61-8.71,16.2-17.41,32.4-25.94,48.69-2.5,4.78-6.08,6.64-11.29,5.95-6.07-.81-12.1-1.85-17.82-4.05-2.3-.88-4.11-1.92-1.59-5.35,10.87-14.8,21.16-30.04,30.09-46.11,13.45-24.22,26.73-48.54,39.75-72.99,1.16-2.17,4.53-5.48,2.24-7.4-2.32-1.95-5.1,1.72-7.48,3.12-11.57,6.81-22.55,14.63-34.94,20.01-2.12.92-4.54,2.63-6.38.94-1.63-1.5.26-4.01.37-6.05.54-10.37,9.79-11.69,16.23-15.27,13.36-7.42,26.39-15.34,39.26-23.54,9.05-5.76,18.36-6.55,28.44-3.42,3.61,1.12,3.68,3.01,2.21,5.5-10.12,17.23-18.93,35.15-28.17,52.84-.71,1.35-1.89,2.87-.61,3.99,1.15,1,2.33-.57,3.35-1.35,12.84-9.7,25.04-20.15,36.68-31.26,12.15-11.6,23.81-23.67,33.91-37.14,1.96-2.61,3.72-5.39,5.39-8.2,1.36-2.29,2.68-2.62,4.65-.69,2.93,2.88,6.16,5.47,8.92,8.5,4.49,4.93,4,11.38-1,16.86-12.62,13.83-27.01,25.69-41.85,36.97-10.86,8.25-22.09,16.01-33.18,23.96-1.2.86-2.43,1.97-3.78,2.24-3.55.71-2.74,2.43-1.53,4.62,7.99,14.39,16.32,28.54,27.26,40.98,4.58,5.21,9.5,9.93,15.76,13.05,3.4,1.69,3.84,3.65.22,5.33-8.46,3.93-16.8,8.09-26.78,6.38-5.43-.93-9.28-3.81-12.77-7.53-10.62-11.32-17.13-25.15-23.59-39.01-1.5-3.22-3.1-6.4-4.94-10.19Z"/></svg>`

// ── Section builders ─────────────────────────────────────────────────────────
type Bg = Record<string, unknown>
type SectionExtra = Record<string, unknown>

const dark = (block: unknown, extra: SectionExtra = {}): Record<string, unknown> => ({
  blockType: 'section',
  backgrounds: [{ type: 'solid', color: '#080808' }] as Bg[],
  borderType: 'solid',
  borderColor: 'rgba(255,255,255,0.18)',
  ...extra,
  block: Array.isArray(block) ? block : [block],
})

const darkGrad = (block: unknown, extra: SectionExtra = {}): Record<string, unknown> =>
  dark(block, {
    borderType: 'gradient',
    borderGradient:
      'linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(244,244,240,0) 100%)',
    ...extra,
  })

const darkSvg = (
  block: unknown,
  svgCode: string,
  pos: SectionExtra,
  extra: SectionExtra = {},
): Record<string, unknown> =>
  dark(block, {
    backgrounds: [
      { type: 'solid', color: '#080808' },
      { type: 'svg', svgCode, ...pos },
    ] as Bg[],
    ...extra,
  })

const light = (block: unknown, extra: SectionExtra = {}): Record<string, unknown> => ({
  blockType: 'section',
  backgrounds: [{ type: 'solid', color: '#f4f4f0' }] as Bg[],
  borderType: 'gradient',
  borderGradient: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(244,244,240,0) 100%)',
  ...extra,
  block: Array.isArray(block) ? block : [block],
})

const D = {
  colorEyebrow: '#ed1d22',
  colorHeading: '#ffffff',
  colorBody: 'rgba(255,255,255,0.65)',
  colorCta: '#ffffff',
}

async function seed() {
  const payload = await getPayload({ config: payloadConfig })

  const slug = 'contact'

  const layout = [
    // ── 1. Hero: dark, white border, K watermark ────────────────────────────
    darkSvg(
      {
        blockType: 'pageHero',
        title: "let's make something\nyou'll be PROUD OF.",
        subtitle: txt(
          'Tell us what you are working on. Real ideas, real plans, real headaches. All welcome.\nWe read every message ourselves and reply within one business day.',
        ),
      },
      K_MARK,
      { svgRight: '-8%', svgTop: '-15%', svgTransform: 'rotate(-8deg) scale(1.1)' },
      { containerStyle: 'top' },
    ),

    // ── 2. Contact form: light section ──────────────────────────────────────
    light(
      {
        blockType: 'contactForm',
        title: 'tell us about your project.',
        subtitle: txt(
          'The more you share, the better we can help. Budget range, timeline, what you have tried, what is not working. All of it useful.',
        ),
      },
      { containerStyle: 'bottom' },
    ),

    // ── 3. Reasons header: dark ──────────────────────────────────────────────
    dark(
      {
        blockType: 'flexContent',
        eyebrow: 'WHEN TO REACH OUT',
        heading: 'three good reasons\nto send that message.',
        ...D,
      },
      { containerStyle: 'top' },
    ),

    // ── 4. Reason 01: dark ───────────────────────────────────────────────────
    dark(
      {
        blockType: 'flexContent',
        eyebrow: '01',
        heading: 'you have a real project.',
        body: txt(
          'Site, app, brand, automation, or all four. You know what you want shipped, and you want a team that ships it well the first time.',
        ),
        ...D,
      },
      { containerStyle: 'center' },
    ),

    // ── 5. Reason 02: dark ───────────────────────────────────────────────────
    dark(
      {
        blockType: 'flexContent',
        eyebrow: '02',
        heading: 'something stopped working.',
        body: txt(
          'Your site, your funnel, your search rankings. We diagnose, we fix, we make sure it does not happen again.',
        ),
        ...D,
      },
      { containerStyle: 'center' },
    ),

    // ── 6. Reason 03: dark ───────────────────────────────────────────────────
    dark(
      {
        blockType: 'flexContent',
        eyebrow: '03',
        heading: 'you want a real partner.',
        body: txt(
          'You do not want a vendor. You want a team that treats your business like it is theirs. That is the relationship we are built for.',
        ),
        ...D,
      },
      { containerStyle: 'center' },
    ),

    // ── 7. Consolidation: dark ───────────────────────────────────────────────
    dark(
      {
        blockType: 'consolidationBlock',
        titleLine1: 'one direct line.',
        titleLine2: 'every layer.',
        body: txt(
          'When you partner with Kagency, you get one direct line for hosting, domains, dev, design, SEO, and support. All of it. No ticket queues. No rotating account managers. Just us.',
        ),
      },
      { containerStyle: 'center' },
    ),

    // ── 8. CTA: dark, gradient border ────────────────────────────────────────
    darkGrad(
      {
        blockType: 'flexContent',
        eyebrow: 'WHILE YOU WAIT',
        heading: 'see what we have\nbuilt for others.',
        body: txt('A few selected projects, with the brands and outcomes behind them.'),
        ctaLabel: 'See our work ->',
        ctaHref: '/the-agency',
        ...D,
      },
      { containerStyle: 'bottom' },
    ),
  ]

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const data = {
    title: 'contact',
    slug,
    excerpt: "Let's make something you'll be proud of. One direct line, one team, every layer.",
    pageSettings: { pageTheme: 'dark' as const },
    layout: layout as any,
    _status: 'published' as const,
  }

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
