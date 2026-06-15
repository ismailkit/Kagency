/**
 * Seed: Legal page — Privacy Policy, Terms of Service, App EULA,
 * Payment Terms, and IP policy for Kagency LLC (New Mexico).
 * Conforms with Google Play, Apple App Store, Stripe, and US state requirements.
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

const D = {
  colorEyebrow: '#ed1d22',
  colorHeading: '#ffffff',
  colorBody: 'rgba(255,255,255,0.65)',
  colorCta: '#ffffff',
}

const clause = (num: string, eyebrow: string, heading: string, body: string, cStyle = 'center') =>
  dark(
    {
      blockType: 'flexContent',
      eyebrow: `${num} / ${eyebrow}`,
      heading,
      body: txt(body),
      ...D,
    },
    { containerStyle: cStyle },
  )

async function seed() {
  const payload = await getPayload({ config: payloadConfig })

  const slug = 'legal'

  const layout = [
    // ── 1. Hero ──────────────────────────────────────────────────────────────
    dark(
      {
        blockType: 'pageHero',
        title: 'the fine print.\nplain language.',
        subtitle: txt(
          'Privacy Policy, Terms of Service, and legal information for Kagency LLC.\nEffective date: April 4, 2026.',
        ),
      },
      { containerStyle: 'top' },
    ),

    // ── 2. Who We Are ────────────────────────────────────────────────────────
    dark(
      {
        blockType: 'flexContent',
        eyebrow: 'THE COMPANY',
        heading: 'Kagency LLC.\nNew Mexico.',
        body: txt(
          'Kagency LLC is a Limited Liability Company organized under the laws of the State of New Mexico (File No. 3183532, filed April 4, 2026). Our registered address is 1209 Mountain Road PL NE, Suite R, Albuquerque, NM 87110.\n\nWe operate globally as a design and development agency and as a publisher of software products, including mobile applications distributed through the Apple App Store and Google Play.',
        ),
        ...D,
      },
      { containerStyle: 'center' },
    ),

    // ── 3. Privacy Policy ────────────────────────────────────────────────────
    clause(
      '01',
      'PRIVACY POLICY',
      'what we collect\nand why.',
      'We collect information you give us directly: your name, email address, company name, and project details when you use our contact form or sign up for our products.\n\nFor our software products and mobile apps, we may collect: device identifiers, usage analytics (via Google Analytics or equivalent), crash reports, and in-app purchase records processed by Apple or Google. We do not sell your personal data to third parties.\n\nWe use your data to: respond to inquiries, deliver our services, process payments, improve our products, and comply with legal obligations.',
    ),

    // ── 4. Third-Party Services ──────────────────────────────────────────────
    clause(
      '02',
      'THIRD-PARTY SERVICES',
      'the partners\nwe work with.',
      "Stripe, Inc. processes all payments. Your payment data is handled by Stripe under their own privacy policy and is never stored on our servers. Stripe is PCI DSS Level 1 certified.\n\nApple and Google collect and process in-app purchase and subscription data under their respective developer agreements. Use of our mobile apps is also governed by Apple's and Google's standard platform terms.\n\nWe may use Google Analytics, Vercel Analytics, or similar tools to understand aggregate usage. These tools may set cookies or collect anonymised identifiers. You can opt out via your browser settings or a Do Not Track signal.",
    ),

    // ── 5. Cookies ───────────────────────────────────────────────────────────
    clause(
      '03',
      'COOKIES',
      'small files,\ntransparent use.',
      'Our website uses strictly necessary cookies to function (session, security). We may also use analytics cookies with your consent.\n\nWe do not use advertising or tracking cookies. You can disable cookies in your browser at any time without losing core functionality. Disabling analytics cookies has no effect on your experience.',
    ),

    // ── 6. Terms of Service ──────────────────────────────────────────────────
    clause(
      '04',
      'TERMS OF SERVICE',
      'the rules\nfor working together.',
      'By engaging Kagency LLC for agency services or using our products, you agree to these terms. Each agency engagement is also governed by a signed proposal or master services agreement, which takes precedence over this page in the event of any conflict.\n\nWe deliver work to professional standards. We are not liable for indirect, incidental, or consequential losses. Our total liability for any single engagement is capped at the fees paid for that engagement.\n\nWe reserve the right to suspend or terminate access to our products if you breach these terms, abuse our systems, or engage in fraudulent activity.',
    ),

    // ── 7. Payment and Billing ───────────────────────────────────────────────
    clause(
      '05',
      'PAYMENT AND BILLING',
      'how we charge\nand what happens next.',
      'Agency projects are billed per the agreed milestones in your signed proposal. Invoices are due within 14 days of issue unless stated otherwise.\n\nSubscription products are billed monthly or annually via Stripe. You may cancel at any time; cancellation takes effect at the end of the current billing period. We do not issue refunds for partial billing periods unless required by applicable law.\n\nFailed payments may result in service suspension after a reasonable grace period. We will notify you before any suspension.',
    ),

    // ── 8. Intellectual Property ─────────────────────────────────────────────
    clause(
      '06',
      'INTELLECTUAL PROPERTY',
      'your work belongs\nto you.',
      'Upon full payment, all final deliverables produced specifically for you under an agency engagement transfer to you in full: source files, design assets, copy, and code.\n\nKagency LLC retains ownership of proprietary frameworks, tools, libraries, and reusable components developed independently. We may license these to you as part of an engagement.\n\nWe retain the right to display completed work in our portfolio and marketing materials. You may request that we withhold specific work by notifying us in writing.',
    ),

    // ── 9. Mobile App EULA ──────────────────────────────────────────────────
    clause(
      '07',
      'MOBILE APP LICENSE',
      'end user license\nagreement.',
      'Our mobile applications are licensed, not sold. We grant you a non-exclusive, non-transferable, revocable license to use our apps on devices you own or control, solely for personal or internal business use.\n\nYou may not reverse engineer, decompile, or create derivative works from our apps. You may not use our apps to violate applicable law or the rights of others.\n\nFor apps distributed via the Apple App Store: Apple is not a party to this agreement and bears no responsibility for our apps or their content. In the event of any third-party claim relating to the app (including IP infringement), Kagency LLC, not Apple or Google, is solely responsible.\n\nFor subscription apps: auto-renewal terms are disclosed at the point of purchase in accordance with App Store and Google Play requirements.',
    ),

    // ── 10. Data Rights ──────────────────────────────────────────────────────
    clause(
      '08',
      'YOUR DATA RIGHTS',
      'CCPA, GDPR,\nand your controls.',
      'If you are a California resident, you have the right under the CCPA to know what personal data we collect, request deletion, and opt out of any sale (we do not sell data).\n\nIf you are in the European Economic Area or United Kingdom, you have the right to access, correct, or delete your personal data, restrict or object to processing, and lodge a complaint with your local supervisory authority.\n\nTo exercise any of these rights, email us at legal@kagency.com. We will respond within 30 days.',
    ),

    // ── 11. Governing Law ────────────────────────────────────────────────────
    clause(
      '09',
      'GOVERNING LAW',
      'New Mexico.\nUnited States.',
      'These terms are governed by the laws of the State of New Mexico, United States, without regard to its conflict of law provisions.\n\nAny dispute arising under these terms will be resolved in the state or federal courts located in Bernalillo County, New Mexico, and you consent to the exclusive jurisdiction of those courts.\n\nFor clients located in the European Union, additional consumer protection rights under EU law apply and are not limited by the above.',
    ),

    // ── 12. Changes ──────────────────────────────────────────────────────────
    clause(
      '10',
      'CHANGES TO THESE TERMS',
      'we will tell you\nwhen things change.',
      'We may update these terms from time to time. Material changes will be communicated by email to active clients and subscribers, and by updating the effective date at the top of this page.\n\nContinued use of our services after a change constitutes acceptance of the updated terms. If you do not agree, you may stop using our services.',
    ),

    // ── 13. CTA ──────────────────────────────────────────────────────────────
    darkGrad(
      {
        blockType: 'flexContent',
        eyebrow: 'QUESTIONS ABOUT LEGAL',
        heading: 'we are happy to walk you\nthrough any of this.',
        body: txt(
          'For legal inquiries, data requests, or DPA questions, reach us at legal@kagency.com.\nFor everything else, use the contact form.',
        ),
        ctaLabel: 'Contact us ->',
        ctaHref: '/contact',
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
    title: 'legal',
    slug,
    excerpt:
      'Privacy Policy, Terms of Service, mobile app EULA, and payment terms for Kagency LLC, a New Mexico LLC.',
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
