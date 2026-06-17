import Image from 'next/image'
import Link from 'next/link'

import type { CMSProject } from '@/lib/cms'
import { mediaURL } from '@/lib/cms'
import { ScrollAnimate } from '@/components/ScrollAnimate'
import type { AnimType, AnimEasing } from '@/components/ScrollAnimate'
import { pxClass } from '@/lib/spacing'

type Props = {
  projects: CMSProject[]
  title?: string
  // Scroll animations
  titleAnim?: boolean
  titleAnimType?: AnimType
  titleAnimEasing?: AnimEasing
  titleAnimDuration?: number
  titleAnimDelay?: number
  itemsAnim?: boolean
  itemsAnimType?: AnimType
  itemsAnimEasing?: AnimEasing
  itemsAnimDuration?: number
  itemsAnimDelay?: number
  itemsAnimStagger?: number
  paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export function ProjectsGrid({
  projects,
  title,
  titleAnim,
  titleAnimType,
  titleAnimEasing,
  titleAnimDuration,
  titleAnimDelay,
  itemsAnim,
  itemsAnimType,
  itemsAnimEasing,
  itemsAnimDuration,
  itemsAnimDelay = 0,
  itemsAnimStagger = 100,
  paddingX = 'md' as const,
}: Props) {
  if (!title || projects.length === 0) return null

  return (
    <div className={`${pxClass[paddingX]}`}>
      <div>
        <ScrollAnimate
          enabled={titleAnim}
          type={titleAnimType}
          easing={titleAnimEasing}
          duration={titleAnimDuration}
          delay={titleAnimDelay}
          as="h2"
          className="font-display text-4xl font-bold uppercase md:text-6xl"
        >
          {title}
        </ScrollAnimate>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {projects.map((project, i) => {
            const image = mediaURL(project.coverImage)
            return (
              <ScrollAnimate
                key={project.id}
                enabled={itemsAnim}
                type={itemsAnimType ?? 'fade-up'}
                easing={itemsAnimEasing}
                duration={itemsAnimDuration}
                delay={(itemsAnimDelay ?? 0) + i * itemsAnimStagger}
                as="li"
                className="list-none"
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block overflow-hidden rounded-2xl border-[3px] border-kblack-500 transition-colors hover:border-kred-500"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={project.title}
                      width={960}
                      height={480}
                      className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-72 w-full bg-kblack-100" />
                  )}
                  <div className="p-6">
                    <p className="font-display text-sm uppercase tracking-wide text-kred-500">
                      {project.client}
                    </p>
                    <h3 className="mt-2 font-display text-3xl uppercase">{project.title}</h3>
                    <p className="mt-3 font-sans text-lg text-kblack-500">{project.summary}</p>
                    <span className="mt-4 inline-block font-sans text-sm font-bold uppercase tracking-wide text-kred-500 opacity-0 transition-opacity group-hover:opacity-100">
                      View case study →
                    </span>
                  </div>
                </Link>
              </ScrollAnimate>
            )
          })}
        </div>
      </div>
    </div>
  )
}
