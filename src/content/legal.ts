/**
 * Content of the /legal page for kagency.dev (Privacy, Cookies, Website Terms, Terms of Service).
 * Shared by `npm run publish:legal` (live site, through the REST API: the normal way) and
 * `npm run seed:legal` (direct database write, local development).
 * Written to match what the site actually does; have a lawyer review it.
 */

const UPDATED = 'November 13, 2026'

const CO = {
  name: 'Kagency LLC',
  fileNo: '3183532',
  address: '1209 Mountain Road PL NE, Suite R, Albuquerque, NM 87110, United States',
  legalEmail: 'legal@kagency.dev',
}

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

const layout = [
  // ── Hero ─────────────────────────────────────────────────────────────────
  dark(
    {
      blockType: 'pageHero',
      title: 'the fine print.\nplain language.',
      subtitle: txt(
        `Privacy Policy, Cookie Policy, Website Terms and Terms of Service for ${CO.name}.\nEffective April 4, 2026. Last updated ${UPDATED}.`,
      ),
    },
    { containerStyle: 'top' },
  ),

  // ── Who we are ───────────────────────────────────────────────────────────
  dark(
    {
      blockType: 'flexContent',
      eyebrow: 'THE COMPANY',
      heading: 'Kagency LLC.\nNew Mexico.',
      body: txt(
        `${CO.name} ("Kagency", "we", "us") is a limited liability company organized under the laws of the State of New Mexico, United States (File No. ${CO.fileNo}, filed April 4, 2026). Registered office: ${CO.address}.\n\nWe are a digital services agency (brand strategy, design, development and growth) and a publisher of software products, including Katalogue. This page covers kagency.dev and our agency services. Each software product has its own terms and privacy policy, published on its own site.\n\nLegal and privacy questions: ${CO.legalEmail}.`,
      ),
      ...D,
    },
    { containerStyle: 'center' },
  ),

  // ── 01 Privacy: what we collect ──────────────────────────────────────────
  clause(
    '01',
    'PRIVACY POLICY',
    'what we collect\nand why.',
    `${CO.name} is the controller of the personal data described here. We collect:\n\n— Contact form: your name, email address, company (optional) and message. Stored in our website database and emailed to our team inbox so we can reply.\n— Emails, calls and meetings: what you tell us when you write or talk to us about a project.\n— Clients: contact and billing details of the people we work with, contracts, invoices and project correspondence.\n— Analytics, only if you accept analytics cookies: pages viewed, referring site, device and browser type, approximate location derived from your IP address, collected by Google Analytics 4 through Google Tag Manager.\n— Bot protection: our contact form uses Cloudflare Turnstile, which processes your IP address and technical browser signals to tell people from bots.\n— Technical logs: our server and network provider record IP addresses, requested pages and times for security and troubleshooting.\n\nWe do not collect sensitive data on purpose. Please do not send it through the contact form.`,
  ),

  // ── 02 How we use it ─────────────────────────────────────────────────────
  clause(
    '02',
    'HOW WE USE IT',
    'purposes and\nlegal bases.',
    `— To answer your enquiry and prepare a proposal (steps you asked for before a contract, and our legitimate interest in replying).\n— To deliver, invoice and support our services (performance of a contract).\n— To keep the site and forms secure and free of spam (legitimate interest).\n— To measure and improve the site with analytics (your consent, which you can withdraw at any time).\n— To meet tax, accounting and other legal duties (legal obligation).\n\nWe do not sell your personal data, do not "share" it for cross-context behavioural advertising, and do not make decisions about you by automated means alone. We only send you marketing emails if you ask for them, and every such email has an unsubscribe link.\n\nWhen we handle personal data inside a client project (for example a client's customer list or a website's form submissions), we act as the client's processor, on the client's instructions, under the data processing terms in our agreement. That data is covered by the client's privacy policy, not this one.`,
  ),

  // ── 03 Who we share with ─────────────────────────────────────────────────
  clause(
    '03',
    'WHO WE SHARE WITH',
    'the partners\nwe work with.',
    `We share personal data only with providers that process it for us under contract, or where the law requires it:\n\n— Our hosting provider, which runs the server that hosts this website and its database.\n— Cloudflare, Inc., for network delivery, security and bot protection (Turnstile).\n— Our email provider, which delivers contact-form notifications and our emails.\n— Google LLC / Google Ireland Ltd, for Google Tag Manager and Google Analytics 4 and, only with your marketing consent, Google advertising measurement.\n— Payment processors and banks we use to receive invoice payments. We never see or store full card numbers.\n— Accountants, lawyers and auditors, and public authorities where the law requires.\n— A buyer or successor of our business, if it is ever sold (you would be told).\n\nSoftware products we publish may use other providers. For example, Katalogue is sold through Paddle.com as Merchant of Record; its privacy policy lists its providers.`,
  ),

  // ── 04 Cookies ───────────────────────────────────────────────────────────
  clause(
    '04',
    'COOKIE POLICY',
    'small files,\nyour choice.',
    `Necessary (always on): your cookie choice, stored in your browser's local storage as "kagency_consent" until you change it; Cloudflare security and Turnstile cookies, which protect the site and forms.\n\nAnalytics (only with your consent): Google Analytics cookies "_ga" and "_ga_<ID>", kept up to 2 years, to count visits and see how the site is used.\n\nMarketing (only with your consent): Google advertising cookies, used to measure and personalise ads if we run campaigns.\n\nGoogle Consent Mode: until you choose, and if you reject, Google tags load in a restricted mode. They set no analytics or advertising cookies and send only cookieless signals (for example that a page was viewed), which Google uses in aggregate.\n\nChange your mind at any time with the cookie button at the bottom left of every page. You can also block or delete cookies in your browser settings, or install Google's opt-out add-on at tools.google.com/dlpage/gaoptout.\n\nDo Not Track and Global Privacy Control: we do not respond to Do Not Track signals, because there is no common standard for them. If your browser sends a Global Privacy Control signal, we treat it as a refusal of marketing cookies.`,
  ),

  // ── 05 Transfers, retention, security ────────────────────────────────────
  clause(
    '05',
    'TRANSFERS AND RETENTION',
    'where it goes,\nhow long it stays.',
    `We are based in the United States, and our providers operate in the United States, the European Union and elsewhere. When we transfer personal data from the EEA, UK or Switzerland, we rely on the EU-U.S. Data Privacy Framework (and its UK and Swiss extensions) where the recipient is certified, or on the European Commission's Standard Contractual Clauses (with the UK addendum).\n\nHow long we keep it:\n— Enquiries that do not become projects: up to 2 years after our last contact.\n— Client and billing records: for the engagement, then 7 years for tax and legal claims.\n— Analytics data: the retention period set in Google Analytics, at most 14 months.\n— Server and security logs: up to 30 days, unless needed to investigate an incident.\n\nWe protect data with HTTPS, access controls, a firewall-protected server, and by limiting who on our team can see it. If a breach puts your data at risk, we will tell you and the authorities as the law requires.`,
  ),

  // ── 06 Your rights ───────────────────────────────────────────────────────
  clause(
    '06',
    'YOUR DATA RIGHTS',
    'GDPR, U.S. state laws,\nand your controls.',
    `Wherever you live, you can ask to access, correct, export or delete your personal data, or to stop a particular use of it. Write to ${CO.legalEmail}. We answer within 30 days (one month in the EEA and UK), may need to confirm your identity first, and do not charge for it.\n\nEEA, UK and Switzerland: you also have the right to restrict processing, to object to processing based on legitimate interests, to withdraw consent at any time without affecting earlier processing, and to complain to your data-protection authority.\n\nCalifornia and other U.S. states with consumer-privacy laws: you have the right to know, access, correct and delete your data, to data portability, to opt out of sale, sharing, targeted advertising and profiling (we do none of these), to use an authorised agent, and not to be discriminated against for using your rights. If we decline your request, you can appeal by replying to our answer.\n\nChildren: our site and services are for businesses and are not directed to children under 16. We do not knowingly collect their data; if you think we have, tell us and we will delete it.`,
  ),

  // ── 07 Website terms of use ──────────────────────────────────────────────
  clause(
    '07',
    'WEBSITE TERMS OF USE',
    'using this\nwebsite.',
    `By using kagency.dev you agree to these website terms.\n\nThe site's text, design, code, images, animations and our logos belong to ${CO.name} or our licensors. Case studies show work we did for clients; their names, logos and trademarks belong to them and are shown with permission. You may view and share links to the site, but may not copy, republish or scrape its content for commercial use, or use it to train AI models, without our written permission.\n\nDo not misuse the site: no attempts to break in, overload it, send spam through the forms, or impersonate others.\n\nThe site is for general information. Nothing on it is an offer that binds us until we both sign a proposal. Links to other sites are provided for convenience; we are not responsible for their content or practices. The site is provided "as is", without warranties, and we may change or withdraw it at any time.`,
  ),

  // ── 08 Agency services ───────────────────────────────────────────────────
  clause(
    '08',
    'TERMS OF SERVICE',
    'the rules for\nworking together.',
    `These terms apply to every agency engagement, together with the proposal, statement of work or master services agreement we both sign (the "Agreement"). If they conflict, the signed Agreement wins.\n\nScope: we deliver what the Agreement describes. Anything else is a change. We will quote changes in writing before doing the work, and they may move the timeline.\n\nYour part: you provide content, access, feedback and approvals on time, and confirm you have the rights to everything you give us (text, images, fonts, trademarks, data). Timelines depend on timely feedback; delays on your side move the schedule.\n\nApproval: you review each deliverable within 10 business days of delivery. A deliverable is accepted when you approve it, use it in production, or do not report a material defect within that period.\n\nThird-party costs: fonts, stock media, plugins, hosting, domains and software subscriptions are licensed to you under their own terms and are paid by you, directly or re-invoiced at cost, unless the Agreement says otherwise.\n\nConfidentiality: each of us keeps the other's non-public information confidential and uses it only for the engagement, during it and for 3 years after (trade secrets for as long as they remain secret). This does not cover information that is public, already known, independently developed or that the law requires us to disclose.\n\nWe act as an independent contractor. We may use vetted subcontractors and remain responsible for their work.`,
  ),

  // ── 09 Fees and payment ──────────────────────────────────────────────────
  clause(
    '09',
    'FEES AND PAYMENT',
    'how we charge\nand what happens next.',
    `Fees, deposits and milestones are set in the Agreement. Unless it says otherwise, invoices are due within 14 days of issue, in the currency stated, by bank transfer or card through our payment processor. Fees exclude taxes, which are added where they apply. Bank and currency-conversion charges on your side are yours.\n\nIf an invoice is more than 14 days overdue, we will remind you, and may pause work and withhold the transfer of deliverables until it is paid. We tell you before pausing anything.\n\nIf you cancel an engagement, you pay for work done up to the cancellation and for third-party costs we have committed to. Deposits cover work scheduled for you and are non-refundable unless the Agreement says otherwise, or the law requires a refund.\n\nRetainers and recurring services renew as stated in the Agreement and can be cancelled with the notice it specifies (30 days if it says nothing). Our software products are sold under their own terms and refund policies.`,
  ),

  // ── 10 Intellectual property ─────────────────────────────────────────────
  clause(
    '10',
    'INTELLECTUAL PROPERTY',
    'your work belongs\nto you.',
    `Upon full payment, we assign to you all rights in the final deliverables made specifically for you under the Agreement: final design files, copy, source code and assets. Until then, you have a licence to review them only.\n\nWe keep ownership of our pre-existing and independently developed tools, frameworks, libraries, templates and know-how. Where they are built into your deliverables, you receive a perpetual, worldwide, non-exclusive, royalty-free licence to use them as part of those deliverables. Unused concepts, drafts and alternatives remain ours.\n\nOpen-source and third-party components stay under their own licences, which you agree to follow.\n\nWe may show completed work, your name and logo in our portfolio and marketing after it is public. Tell us in writing if you want any of it kept private and we will respect that.\n\nAI tools: we may use AI-assisted tools in our process, under human direction and review. We do not put your confidential information into tools that train on it.`,
  ),

  // ── 11 Warranties and liability ──────────────────────────────────────────
  clause(
    '11',
    'WARRANTIES AND LIABILITY',
    'what we promise,\nwhat we do not.',
    `We perform our services with reasonable skill and care, to professional industry standards. If a deliverable does not match the agreed specification and you tell us within 30 days of acceptance, we will fix it at no charge. That is your main remedy for defects.\n\nApart from that, and to the maximum extent the law allows, our services and deliverables are provided without other warranties, express or implied, including merchantability, fitness for a particular purpose and non-infringement of third-party materials you supplied. We do not guarantee specific business results such as rankings, traffic or revenue.\n\nTo the maximum extent the law allows, neither party is liable for indirect, incidental, special, consequential or punitive damages, or for lost profits, revenue, data or goodwill. Our total liability arising out of an engagement is limited to the fees you paid us for it in the 12 months before the claim.\n\nThese limits do not apply to fraud, wilful misconduct, a party's confidentiality breach, your payment obligations, or liability that cannot be limited by law. You will defend us against claims that materials you supplied infringe someone's rights; we will defend you against claims that original work we created for you infringes someone's rights.`,
  ),

  // ── 12 Software and apps ─────────────────────────────────────────────────
  clause(
    '12',
    'SOFTWARE AND APPS',
    'products have\ntheir own terms.',
    `Software we publish is licensed, not sold, under its own end user licence agreement, terms of sale and privacy policy, shown on the product's website and at purchase. For Katalogue, see katalogue.kagency.dev/legal. Paddle.com is the Merchant of Record for Katalogue orders.\n\nFor apps distributed through the Apple App Store or Google Play, the store's own terms also apply. Apple and Google are not parties to our licence and are not responsible for the app, its maintenance, support or any claims about it; ${CO.name} is. For App Store apps, Apple and its subsidiaries are third-party beneficiaries of the licence and may enforce it. Subscriptions bought in an app are billed and renewed by the store, as disclosed at purchase, and are managed and cancelled in your store account.`,
  ),

  // ── 13 Termination and governing law ─────────────────────────────────────
  clause(
    '13',
    'TERMINATION AND GOVERNING LAW',
    'New Mexico.\nUnited States.',
    `Either party may end an engagement in writing if the other materially breaches the Agreement and does not fix it within 15 days of notice, or as the Agreement otherwise allows. Payment, intellectual-property, confidentiality and liability terms survive.\n\nThese terms and every Agreement are governed by the laws of the State of New Mexico, United States, without regard to conflict-of-law rules. Before starting proceedings, we will both try in good faith to settle a dispute by talking for 30 days. After that, the state or federal courts in Bernalillo County, New Mexico, have exclusive jurisdiction, and both parties consent to them.\n\nNeither party is liable for delays caused by events beyond its reasonable control. Nothing here limits rights that consumers have under the mandatory law of the country where they live.`,
  ),

  // ── 14 Changes ───────────────────────────────────────────────────────────
  clause(
    '14',
    'CHANGES TO THESE TERMS',
    'we will tell you\nwhen things change.',
    'We may update this page from time to time and will change the date at the top when we do. Material changes are emailed to active clients before they take effect. A signed Agreement keeps the terms in force when it was signed unless we both agree otherwise.',
  ),

  // ── CTA ──────────────────────────────────────────────────────────────────
  darkGrad(
    {
      blockType: 'flexContent',
      eyebrow: 'QUESTIONS ABOUT LEGAL',
      heading: 'we are happy to walk you\nthrough any of this.',
      body: txt(
        `For legal questions, data requests or a data processing agreement, write to ${CO.legalEmail}.\n${CO.name} · ${CO.address}.\nFor everything else, use the contact form.`,
      ),
      ctaLabel: 'Contact us ->',
      ctaHref: '/contact',
      ...D,
    },
    { containerStyle: 'bottom' },
  ),
]

export const legalPage = {
  title: 'legal',
  slug: 'legal',
  excerpt:
    'Privacy Policy, Cookie Policy, Website Terms and Terms of Service for Kagency LLC, a New Mexico limited liability company.',
  pageSettings: { pageTheme: 'dark' as const },
  layout,
  _status: 'published' as const,
}
