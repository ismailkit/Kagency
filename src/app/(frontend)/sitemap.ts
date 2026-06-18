import type { MetadataRoute } from 'next'

import { getProjects } from '@/lib/cms'

// Re-generate hourly so newly published case studies appear without a redeploy.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/the-agency`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/legal`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // CMS post type: projects / case studies.
  let projectRoutes: MetadataRoute.Sitemap = []
  try {
    const projects = await getProjects({ limit: 500 })
    projectRoutes = projects
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${base}/projects/${encodeURIComponent(p.slug)}`,
        lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
        changeFrequency: 'monthly',
        priority: p.featured ? 0.9 : 0.8,
      }))
  } catch {
    // Keep the static routes even if the CMS is briefly unreachable.
  }

  return [...staticRoutes, ...projectRoutes]
}
