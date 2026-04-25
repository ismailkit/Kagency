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

async function cmsFetch<T>(
  path: string,
  query: Record<string, QueryValue | undefined> = {},
): Promise<T | null> {
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

export type BackgroundLayer =
  | {
      type: 'solid'
      color: string
      opacity?: number
      blendMode?: string
      enableTransform?: boolean
      bgSize?: string
      bgPosition?: string
      bgRepeat?: string
    }
  | {
      type: 'gradient'
      value: string
      opacity?: number
      blendMode?: string
      enableTransform?: boolean
      bgSize?: string
      bgPosition?: string
      bgRepeat?: string
    }
  | {
      type: 'image'
      url?: string
      image?: CMSMedia | string
      enableTransform?: boolean
      bgSize?: string
      bgPosition?: string
      bgRepeat?: string
      blendMode?: string
      opacity?: number
    }
  | {
      type: 'svg'
      svgCode: string
      opacity?: number
      blendMode?: string
      svgTop?: string
      svgRight?: string
      svgBottom?: string
      svgLeft?: string
      svgTransform?: string
    }

export type CMSMedia = {
  url?: string
  alt?: string
  filename?: string
}

// Shared animation prop types for all content blocks
type AnimType =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'stagger-words'
type AnimEasing = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring'
type AnimProps<P extends string> = {
  [K in `${P}Anim`]?: boolean
} & {
  [K in `${P}AnimType`]?: AnimType
} & {
  [K in `${P}AnimEasing`]?: AnimEasing
} & {
  [K in `${P}AnimDuration`]?: number
} & {
  [K in `${P}AnimDelay`]?: number
}

// Convenience helper — used below to add anim fields per element
type SA<P extends string> = AnimProps<P>

export type CMSPageSettings = {
  pageTheme?: 'light' | 'dark'
  noise?: 'solid' | 'gradient' | 'none'
  backgrounds?: BackgroundLayer[]
}

export type CMSPage = {
  title?: string
  slug?: string
  layout?: CMSSection[]
  excerpt?: string
  pageSettings?: CMSPageSettings
  seo?: {
    metaTitle?: string
    metaDescription?: string
    metaImage?: CMSMedia | string
  }
}

export type CMSContentBlock =
  | ({
      id?: string
      blockType: 'landingHero'
      title: string
      subtitle: string
      image?: CMSMedia | string
      cta?: { label?: string; href?: string }
      paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    } & SA<'title'> &
      SA<'subtitle'> &
      SA<'cta'> &
      SA<'image'>)
  | ({
      id?: string
      blockType: 'pageHero'
      title: string
      subtitle?: string
      paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    } & SA<'title'> &
      SA<'subtitle'> &
      SA<'content'>)
  | ({
      id?: string
      blockType: 'servicesGrid'
      title: string
      featuredOnly?: boolean
      limit?: number
      itemsAnimStagger?: number
      paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    } & SA<'title'> &
      SA<'items'>)
  | ({
      id?: string
      blockType: 'projectsGrid'
      title: string
      featuredOnly?: boolean
      limit?: number
      itemsAnimStagger?: number
      paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    } & SA<'title'> &
      SA<'items'>)
  | ({
      id?: string
      blockType: 'contactForm'
      title: string
      subtitle?: string
      paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    } & SA<'title'> &
      SA<'subtitle'> &
      SA<'content'>)
  | {
      id?: string
      blockType: 'flexContent'
      textAlign?: 'left' | 'center' | 'right'
      verticalAlign?: 'start' | 'center' | 'end'
      contentWidth?: 'sm' | 'md' | 'lg' | 'full'
      columnSplit?: '50-50' | '60-40' | '40-60' | '70-30' | '30-70'
      gap?: 'sm' | 'md' | 'lg' | 'xl'
      paddingTop?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
      paddingBottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
      paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
      eyebrow?: string
      eyebrowSize?: 'xs' | 'sm' | 'md'
      eyebrowWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
      heading?: string
      headingAccent?: string
      headingAccentSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
      headingAccentX?: number
      headingAccentY?: number
      headingAccentHref?: string
      headingAccentPage?: { slug?: string } | string
      headingSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
      headingStyle?: 'display' | 'sans' | 'handwritten'
      headingWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
      body?: string
      bodySize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
      bodyWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
      ctaLabel?: string
      ctaHref?: string
      ctaPage?: { slug?: string } | string
      ctaStyle?: 'filled' | 'outline' | 'text'
      image?: CMSMedia | string
      imageAspect?: 'square' | 'video' | 'portrait' | 'landscape' | 'auto'
      colorEyebrow?: string
      colorHeading?: string
      colorBody?: string
      colorCta?: string
      // Scroll animations per element
      eyebrowAnim?: boolean
      eyebrowAnimType?:
        | 'fade'
        | 'fade-up'
        | 'fade-down'
        | 'fade-left'
        | 'fade-right'
        | 'slide-up'
        | 'slide-down'
        | 'slide-left'
        | 'slide-right'
        | 'stagger-words'
      eyebrowAnimEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring'
      eyebrowAnimDuration?: number
      eyebrowAnimDelay?: number
      headingAnim?: boolean
      headingAnimType?:
        | 'fade'
        | 'fade-up'
        | 'fade-down'
        | 'fade-left'
        | 'fade-right'
        | 'slide-up'
        | 'slide-down'
        | 'slide-left'
        | 'slide-right'
        | 'stagger-words'
      headingAnimEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring'
      headingAnimDuration?: number
      headingAnimDelay?: number
      accentAnim?: boolean
      accentAnimType?:
        | 'fade'
        | 'fade-up'
        | 'fade-down'
        | 'fade-left'
        | 'fade-right'
        | 'slide-up'
        | 'slide-down'
        | 'slide-left'
        | 'slide-right'
        | 'stagger-words'
      accentAnimEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring'
      accentAnimDuration?: number
      accentAnimDelay?: number
      bodyAnim?: boolean
      bodyAnimType?:
        | 'fade'
        | 'fade-up'
        | 'fade-down'
        | 'fade-left'
        | 'fade-right'
        | 'slide-up'
        | 'slide-down'
        | 'slide-left'
        | 'slide-right'
        | 'stagger-words'
      bodyAnimEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring'
      bodyAnimDuration?: number
      bodyAnimDelay?: number
      ctaAnim?: boolean
      ctaAnimType?:
        | 'fade'
        | 'fade-up'
        | 'fade-down'
        | 'fade-left'
        | 'fade-right'
        | 'slide-up'
        | 'slide-down'
        | 'slide-left'
        | 'slide-right'
        | 'stagger-words'
      ctaAnimEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring'
      ctaAnimDuration?: number
      ctaAnimDelay?: number
      slotAnim?: boolean
      slotAnimType?:
        | 'fade'
        | 'fade-up'
        | 'fade-down'
        | 'fade-left'
        | 'fade-right'
        | 'slide-up'
        | 'slide-down'
        | 'slide-left'
        | 'slide-right'
        | 'stagger-words'
      slotAnimEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring'
      slotAnimDuration?: number
      slotAnimDelay?: number
    }
  | ({
      id?: string
      blockType: 'ksun'
      title: string
      subtitle?: string
      paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    } & SA<'title'> &
      SA<'subtitle'>)
  | ({
      id?: string
      blockType: 'landingWorks'
      /** Three category slugs, one per poster card (left → right) */
      columns: Array<{
        category: string
        label: string
        cardTitle?: string
        cardSubtitle?: string
      }>
      paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    } & SA<'section'>)
  | {
      id?: string
      blockType: 'rive'
      riveFile?: CMSMedia | string | null
      riveUrl?: string
      artboard?: string
      animation?: string
      stateMachine?: string
      scrollInput?: string
      mode?: 'autoplay' | 'loop' | 'scroll-scrub'
      fit?: 'contain' | 'cover' | 'fill' | 'fitWidth' | 'fitHeight' | 'none'
      alignment?:
        | 'center'
        | 'topLeft'
        | 'topCenter'
        | 'topRight'
        | 'centerLeft'
        | 'centerRight'
        | 'bottomLeft'
        | 'bottomCenter'
        | 'bottomRight'
      aspect?: '16/9' | '4/3' | '1/1' | '9/16' | '3/4' | 'auto'
      animDuration?: number
      scrubStart?: string
      scrubEnd?: string
    }

export type CMSSection = {
  id?: string
  blockType: 'section'
  containerStyle?: 'normal' | 'center' | 'top' | 'bottom' | 'scroll-jack'
  scrollJackHeight?: number
  scrollJackScrub?: number
  paddingTop?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  paddingBottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  useNoise?: 'solid' | 'gradient' | 'none' | boolean | null
  backgrounds?: BackgroundLayer[]
  borderType?: 'none' | 'solid' | 'gradient'
  borderColor?: string
  borderGradient?: string
  allowOverflow?: boolean
  flexDirection?: 'column' | 'row' | 'row-reverse' | 'column-reverse'
  flexJustify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  flexAlign?: 'start' | 'center' | 'end' | 'stretch'
  flexGap?: 'sm' | 'md' | 'lg' | 'xl'
  flexWrap?: boolean
  block?: CMSContentBlock[]
}

/** @deprecated use CMSSection */
export type CMSLayoutBlock = CMSSection

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
  category?: string
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

export async function getProjects({
  featuredOnly,
  limit,
  category,
}: { featuredOnly?: boolean; limit?: number; category?: string } = {}) {
  const data = await cmsFetch<DocsResponse<CMSProject>>('/api/projects', {
    depth: 2,
    limit: limit ?? 50,
    sort: '-publishedAt',
    'where[featured][equals]': featuredOnly ? true : undefined,
    'where[category][equals]': category ?? undefined,
  })

  return data?.docs ?? []
}

/** Fetch projects for multiple categories in one round-trip each, returns a map. */
export async function getProjectsByCategories(
  categories: string[],
): Promise<Record<string, CMSProject[]>> {
  const results = await Promise.all(
    categories.map(async (cat) => {
      const projects = await getProjects({ category: cat })
      return [cat, projects] as const
    }),
  )
  return Object.fromEntries(results)
}

export async function getSiteSettings() {
  return cmsFetch('/api/globals/site-settings', { depth: 1 })
}

/**
 * Given a page's layout blocks, collect any `landingWorks` category slugs and
 * fetch projects for all of them in parallel.  Safe to call even if there are
 * no `landingWorks` blocks — returns an empty object in that case.
 */
export async function resolveWorksCategories(
  layout: CMSSection[] | undefined,
): Promise<Record<string, CMSProject[]>> {
  if (!layout?.length) return {}

  const categories = new Set<string>()
  for (const section of layout) {
    for (const inner of section.block ?? []) {
      if (inner?.blockType === 'landingWorks') {
        for (const col of inner.columns ?? []) {
          if (col.category) categories.add(col.category)
        }
      }
    }
  }

  if (categories.size === 0) return {}
  return getProjectsByCategories([...categories])
}

export function mediaURL(media?: CMSMedia | string | null) {
  if (!media) return null
  if (typeof media === 'string') return media.startsWith('/') ? media : `${PUBLIC_CMS_URL}${media}`
  if (!media.url) return null
  return media.url.startsWith('/') ? media.url : `${PUBLIC_CMS_URL}${media.url}`
}
