import { getProjects } from '@/lib/cms'

// llms.txt — a concise, LLM-friendly map of the site (https://llmstxt.org).
export const revalidate = 3600

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

  let projects: Awaited<ReturnType<typeof getProjects>> = []
  try {
    projects = await getProjects({ limit: 500 })
  } catch {
    // still emit the core file if the CMS is briefly unreachable
  }

  const clean = (s?: string) => (s || '').replace(/\s+/g, ' ').trim()

  const lines: string[] = [
    '# Kagency',
    '',
    '> Kagency is a digital services agency delivering brand strategy, UI/UX design, design systems, web development, and growth marketing — high-performance websites and digital products that convert.',
    '',
    '## Pages',
    `- [Home](${base}/): Agency overview and featured work`,
    `- [Services](${base}/services): What we do — strategy, branding, design, development, growth`,
    `- [The Agency](${base}/the-agency): About the studio, approach and people`,
    `- [About](${base}/about): Who we are`,
    `- [Contact](${base}/contact): Start a project`,
    `- [Legal](${base}/legal): Privacy, cookies and terms`,
    '',
    '## Case studies',
  ]

  const caseStudies = projects.filter((p) => p.slug)
  if (caseStudies.length) {
    for (const p of caseStudies) {
      const desc = clean(p.summary) || clean(p.client)
      lines.push(
        `- [${clean(p.title)}](${base}/projects/${encodeURIComponent(p.slug)})${desc ? `: ${desc}` : ''}`,
      )
    }
  } else {
    lines.push('- (none published yet)')
  }
  lines.push('')

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
