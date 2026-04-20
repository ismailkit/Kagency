import Image from 'next/image'

import type { CMSProject } from '@/lib/cms'
import { mediaURL } from '@/lib/cms'
import { SectionBlock, type ContainerStyle } from '@/components/SectionBlock'

type Props = {
  projects: CMSProject[]
  title?: string
  containerStyle?: ContainerStyle
  useNoise?: boolean
}

export function ProjectsGrid({ projects, title, containerStyle = 'bottom', useNoise = false }: Props) {
  if (!title || projects.length === 0) return null

  return (
    <SectionBlock styleType={containerStyle} noise={useNoise} className="px-6 py-14 md:px-10 md:py-16">
      <div>
        <h2 className="font-display text-4xl font-bold uppercase md:text-6xl">{title}</h2>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {projects.map((project) => {
            const image = mediaURL(project.coverImage)
            return (
              <article key={project.id} className="overflow-hidden rounded-2xl border-[3px] border-kblack-500">
                {image ? (
                  <Image
                    src={image}
                    alt={project.title}
                    width={960}
                    height={480}
                    className="h-72 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-72 w-full bg-kblack-100" />
                )}
                <div className="p-6">
                  <p className="font-display text-sm uppercase tracking-wide text-kred-500">{project.client}</p>
                  <h3 className="mt-2 font-display text-3xl uppercase">{project.title}</h3>
                  <p className="mt-3 font-sans text-lg text-kblack-500">{project.summary}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </SectionBlock>
  )
}
