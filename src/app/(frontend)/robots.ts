import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

  return {
    rules: [
      {
        userAgent: '*',
        // Crawl everything public; keep the CMS admin and write APIs out of the index.
        // /api/media is explicitly allowed so images stay crawlable.
        allow: ['/', '/api/media/'],
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
