const PUBLIC_CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'
const CMS_URL = process.env.CMS_INTERNAL_URL || PUBLIC_CMS_URL

type QueryValue = string | number | boolean

function withQuery(path: string, query: Record<string, QueryValue | undefined>) {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value))
    }
  })

  return `${CMS_URL}${path}?${params.toString()}`
}

async function cmsFetch<T>(path: string, query: Record<string, QueryValue | undefined> = {}): Promise<T | null> {
  try {
    const res = await fetch(withQuery(path, query), {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export type CMSMedia = {
  url?: string
  alt?: string
  filename?: string
}

export type CMSPage = {
  title?: string
  slug?: string
  layout?: CMSLayoutBlock[]
  excerpt?: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    metaImage?: CMSMedia | string
  }
}

export type CMSLayoutBlock =
  | {
      id?: string
      blockType: 'landingHero'
      title: string
      subtitle: string
      image?: CMSMedia | string
      cta?: {
        label?: string
        href?: string
      }
      containerStyle?: 'normal' | 'center' | 'top' | 'bottom'
      useNoise?: boolean
    }
  | {
      id?: string
      blockType: 'pageHero'
      title: string
      subtitle?: string
      containerStyle?: 'normal' | 'center' | 'top' | 'bottom'
      useNoise?: boolean
    }
  | {
      id?: string
      blockType: 'servicesGrid'
      title: string
      featuredOnly?: boolean
      limit?: number
      containerStyle?: 'normal' | 'center' | 'top' | 'bottom'
      useNoise?: boolean
    }
  | {
      id?: string
      blockType: 'projectsGrid'
      title: string
      featuredOnly?: boolean
      limit?: number
      containerStyle?: 'normal' | 'center' | 'top' | 'bottom'
      useNoise?: boolean
    }
  | {
      id?: string
      blockType: 'contactForm'
      title: string
      subtitle?: string
      containerStyle?: 'normal' | 'center' | 'top' | 'bottom'
      useNoise?: boolean
    }

export type CMSService = {
  id: string
  title: string
  category: string
  shortDescription: string
  featured?: boolean
}

export type CMSProject = {
  id: string
  title: string
  slug: string
  client: string
  summary: string
  featured?: boolean
  coverImage?: CMSMedia | string
}

type DocsResponse<T> = {
  docs: T[]
}

export async function getPage(slug: string) {
  const data = await cmsFetch<DocsResponse<CMSPage>>('/api/pages', {
    'where[slug][equals]': slug,
    depth: 2,
    limit: 1,
  })

  return data?.docs?.[0] ?? null
}

export async function getServices() {
  const data = await cmsFetch<DocsResponse<CMSService>>('/api/services', {
    depth: 1,
    limit: 50,
    sort: 'order',
  })

  return data?.docs ?? []
}

export async function getFeaturedProjects() {
  return getProjects({ featuredOnly: true, limit: 6 })
}

export async function getProjects({ featuredOnly, limit }: { featuredOnly?: boolean; limit?: number } = {}) {
  const data = await cmsFetch<DocsResponse<CMSProject>>('/api/projects', {
    depth: 2,
    limit: limit ?? 50,
    sort: '-publishedAt',
    'where[featured][equals]': featuredOnly ? true : undefined,
  })

  return data?.docs ?? []
}

export async function getSiteSettings() {
  return cmsFetch('/api/globals/site-settings', { depth: 1 })
}

export function mediaURL(media?: CMSMedia | string | null) {
  if (!media) return null
  if (typeof media === 'string') return `${PUBLIC_CMS_URL}${media}`
  return media.url ? `${PUBLIC_CMS_URL}${media.url}` : null
}
