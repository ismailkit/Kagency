import type { Metadata } from 'next'
import type { ReactNode } from 'react'
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

/**
 * One framed band of the page, matching the bracketed page frame:
 * the first band uses the `--top` tier (rounded top + side rails), the rest use
 * `--center` (side rails only). The Footer closes the frame with `--bottom`.
 */
function FrameSection({
  tier,
  className = '',
  children,
}: {
  tier: 'top' | 'center'
  className?: string
  children: ReactNode
}) {
  return (
    <div className="site-shell">
      <div className={`section-container section-container--${tier} ${className}`.trim()}>
        {children}
      </div>
    </div>
  )
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-sans text-xs font-bold uppercase tracking-widest text-kblack-400">
        {label}
      </dt>
      <dd className="mt-1.5 font-display text-lg uppercase leading-tight">{children}</dd>
    </div>
  )
}

const PADX = 'px-6 md:px-12'

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
    <article className="pt-0">
      {/* ── Hero band (frame top) ────────────────────────────────────────── */}
      <FrameSection tier="top" className={`${PADX} pt-10 pb-12 md:pt-12 md:pb-14`}>
        <Link
          href="/the-agency"
          className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-wide text-kblack-400 transition-colors hover:text-kred-500"
        >
          <span aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="text-kred-500 transition-transform group-hover:translate-x-1.5"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: 'scaleX(-1)' }}
            >
              <path
                d="M10 19.25C4.89137 19.25 0.75 15.1086 0.75 10C0.75 4.89137 4.89137 0.75 10 0.75C15.1086 0.75 19.25 4.89137 19.25 10C19.25 15.1086 15.1086 19.25 10 19.25Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M10 6L9.295 6.705L12.085 9.5H6V10.5H12.085L9.295 13.295L10 14L14 10L10 6Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span style={{ textBoxTrim: 'trim-both' }}>Back to work</span>
        </Link>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {categoryLabel && (
            <span className="bg-kred-500 px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-white">
              {categoryLabel}
            </span>
          )}
          <span className="font-display text-sm uppercase tracking-wide text-kblack-400">
            {project.client}
          </span>
        </div>

        <h1 className="mt-5 max-w-[18ch] font-display text-5xl font-bold uppercase leading-[0.92] md:text-7xl">
          {project.title}
        </h1>

        {project.summary && (
          <p className="mt-6 max-w-2xl font-sans text-xl leading-relaxed text-kblack-500 md:text-2xl">
            {project.summary}
          </p>
        )}

        {/* Facts strip */}
        {(project.role || project.timeline || services.length > 0 || project.projectUrl) && (
          <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-6 border-t-[3px] border-kblack-500 pt-6 md:grid-cols-4">
            <Fact label="Client">{project.client}</Fact>
            {project.role && <Fact label="Role">{project.role}</Fact>}
            {project.timeline && <Fact label="Timeline">{project.timeline}</Fact>}
            {services.length > 0 && (
              <div>
                <dt className="font-sans text-xs font-bold uppercase tracking-widest text-kblack-400">
                  Services
                </dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {services.map((s) => (
                    <span
                      key={s}
                      className="border-[2px] border-kblack-500 px-2 py-0.5 font-sans text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        )}

        {project.projectUrl && (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block border-[3px] border-kblack-500 px-6 py-2.5 font-display text-lg uppercase transition-colors hover:bg-kblack-500 hover:text-white"
          >
            Visit live site ↗
          </a>
        )}
      </FrameSection>

      {/* ── Cover image (kept to a calm banner height) ───────────────────── */}
      {cover && (
        <FrameSection tier="center" className={`${PADX} py-8 md:py-10`}>
          <div className="overflow-hidden rounded-xl border-[3px] border-kblack-500">
            <Image
              src={cover}
              alt={project.title}
              width={1600}
              height={760}
              priority
              sizes="(max-width: 1440px) 96vw, 1440px"
              className="aspect-[16/7] w-full object-cover"
            />
          </div>
        </FrameSection>
      )}

      {/* ── Case-study body ──────────────────────────────────────────────── */}
      <FrameSection tier="center" className={`${PADX} py-12 md:py-16`}>
        {bodyHTML ? (
          <div className="mx-auto max-w-[68ch]">
            <p className="mb-8 font-sans text-xs font-bold uppercase tracking-widest text-kred-500">
              The case study
            </p>
            <div className="case-study-content" dangerouslySetInnerHTML={{ __html: bodyHTML }} />
          </div>
        ) : (
          <p className="mx-auto max-w-[68ch] font-sans text-lg text-kblack-400">
            The full case study for this project is coming soon.
          </p>
        )}
      </FrameSection>

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      {gallery.length > 0 && (
        <FrameSection tier="center" className={`${PADX} py-10 md:py-12`}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {gallery.map((g, i) => (
              <figure key={i} className="overflow-hidden rounded-xl border-[3px] border-kblack-500">
                <Image
                  src={g.url as string}
                  alt={g.caption || `${project.title} — image ${i + 1}`}
                  width={960}
                  height={640}
                  loading="lazy"
                  sizes="(max-width: 768px) 96vw, 720px"
                  className="aspect-[3/2] w-full object-cover"
                />
                {g.caption && (
                  <figcaption className="border-t-[3px] border-kblack-500 px-4 py-2.5 font-sans text-sm text-kblack-400">
                    {g.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </FrameSection>
      )}

      {/* ── Closing CTA (last band — no bottom border; Footer closes the frame) ── */}
      <FrameSection tier="center" className={`${PADX} py-16 text-center md:py-20`}>
        <p className="font-display text-sm uppercase tracking-widest text-kred-500">
          Let&apos;s build the next one
        </p>
        <p className="mx-auto mt-4 max-w-[20ch] font-display text-4xl font-bold uppercase leading-[0.95] md:text-6xl">
          Have a project in mind?
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-block border-[3px] border-kred-500 bg-kred-500 px-8 py-3 font-display text-xl uppercase text-white transition-colors hover:border-kred-700 hover:bg-kred-700"
          >
            Start a project
          </Link>
          <Link
            href="/#works"
            className="inline-block border-[3px] border-kblack-500 px-8 py-3 font-display text-xl uppercase transition-colors hover:bg-kblack-500 hover:text-white"
          >
            More work
          </Link>
        </div>
      </FrameSection>
    </article>
  )
}
