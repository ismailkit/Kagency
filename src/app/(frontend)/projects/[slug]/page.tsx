import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getAllProjectSlugs, getProject, mediaURL } from '@/lib/cms'
import type { CMSProject, CMSService } from '@/lib/cms'
import { richTextToHTML } from '@/lib/richtext'

export const revalidate = 60

const CATEGORY_LABELS: Record<string, string> = {
  design: 'Design',
  development: 'Development',
  brand: 'Brand',
  strategy: 'Strategy',
  other: 'Project',
}

type RouteParams = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}

  const title = project.meta?.title || `${project.title} | Kagency`
  const description = project.meta?.description || project.summary
  const image = mediaURL(project.meta?.image) || mediaURL(project.coverImage) || undefined
  const url = `/projects/${project.slug}`

  return {
    // absolute → bypass the "%s | Kagency" template so we don't double the suffix
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

function serviceTitle(s: CMSService | string): string | null {
  if (!s) return null
  return typeof s === 'string' ? null : (s.title ?? null)
}

export default async function ProjectPage({ params }: RouteParams) {
  const { slug } = await params
  const project: CMSProject | null = await getProject(slug)
  if (!project) notFound()

  const cover = mediaURL(project.coverImage)
  const categoryLabel = project.category ? (CATEGORY_LABELS[project.category] ?? 'Project') : null
  const services = (project.services ?? []).map(serviceTitle).filter(Boolean) as string[]
  const bodyHTML = richTextToHTML(project.content)
  const gallery = (project.gallery ?? [])
    .map((g) => ({ url: mediaURL(g.image), caption: g.caption }))
    .filter((g) => g.url)

  return (
    <article className="pb-24">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className="site-shell pt-10 md:pt-14">
        <Link
          href="/#works"
          className="inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-wide text-kblack-400 transition-colors hover:text-kred-500"
        >
          <span aria-hidden="true">←</span> Back to work
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {categoryLabel && (
            <span className="bg-kred-500 px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-white">
              {categoryLabel}
            </span>
          )}
          <span className="font-display text-sm uppercase tracking-wide text-kblack-400">
            {project.client}
          </span>
        </div>

        <h1 className="mt-5 max-w-[16ch] font-display text-5xl font-bold uppercase leading-[0.95] md:text-7xl">
          {project.title}
        </h1>

        {project.summary && (
          <p className="mt-6 max-w-3xl font-sans text-xl leading-relaxed text-kblack-500 md:text-2xl">
            {project.summary}
          </p>
        )}
      </header>

      {/* ── Cover image ──────────────────────────────────────────────────── */}
      {cover && (
        <div className="site-shell mt-10">
          <div className="overflow-hidden rounded-2xl border-[3px] border-kblack-500">
            <Image
              src={cover}
              alt={project.title}
              width={1920}
              height={1080}
              priority
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ── Body + meta sidebar ──────────────────────────────────────────── */}
      <div className="site-shell mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_18rem] lg:gap-16">
        <div className="order-2 lg:order-1">
          {bodyHTML ? (
            <div className="case-study-content" dangerouslySetInnerHTML={{ __html: bodyHTML }} />
          ) : (
            <p className="font-sans text-lg text-kblack-400">
              The full case study for this project is coming soon.
            </p>
          )}
        </div>

        {/* Meta rail */}
        <aside className="order-1 lg:order-2">
          <dl className="flex flex-col gap-5 border-t-[3px] border-kblack-500 pt-5">
            <div>
              <dt className="font-sans text-xs font-bold uppercase tracking-widest text-kblack-400">
                Client
              </dt>
              <dd className="mt-1 font-display text-lg uppercase">{project.client}</dd>
            </div>
            {project.role && (
              <div>
                <dt className="font-sans text-xs font-bold uppercase tracking-widest text-kblack-400">
                  Role
                </dt>
                <dd className="mt-1 font-sans text-base">{project.role}</dd>
              </div>
            )}
            {project.timeline && (
              <div>
                <dt className="font-sans text-xs font-bold uppercase tracking-widest text-kblack-400">
                  Timeline
                </dt>
                <dd className="mt-1 font-sans text-base">{project.timeline}</dd>
              </div>
            )}
            {services.length > 0 && (
              <div>
                <dt className="font-sans text-xs font-bold uppercase tracking-widest text-kblack-400">
                  Services
                </dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {services.map((s) => (
                    <span
                      key={s}
                      className="border-[2px] border-kblack-500 px-2 py-0.5 font-sans text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            )}
            {project.projectUrl && (
              <div>
                <dt className="font-sans text-xs font-bold uppercase tracking-widest text-kblack-400">
                  Live
                </dt>
                <dd className="mt-1">
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-lg uppercase text-kred-500 underline"
                  >
                    Visit site ↗
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </div>

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      {gallery.length > 0 && (
        <div className="site-shell mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {gallery.map((g, i) => (
            <figure
              key={i}
              className="overflow-hidden rounded-2xl border-[3px] border-kblack-500"
            >
              <Image
                src={g.url as string}
                alt={g.caption || `${project.title} — image ${i + 1}`}
                width={960}
                height={640}
                loading="lazy"
                className="h-auto w-full object-cover"
              />
              {g.caption && (
                <figcaption className="border-t-[3px] border-kblack-500 px-4 py-2 font-sans text-sm text-kblack-400">
                  {g.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <div className="site-shell mt-20 border-t-[3px] border-kblack-500 pt-10 text-center">
        <p className="font-display text-3xl font-bold uppercase md:text-5xl">
          Have a project in mind?
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block border-[3px] border-kred-500 bg-kred-500 px-8 py-3 font-display text-xl uppercase text-white transition-colors hover:bg-kred-700 hover:border-kred-700"
        >
          Start a project
        </Link>
      </div>
    </article>
  )
}
