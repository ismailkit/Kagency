import { ContactForm } from '@/components/ContactForm'
import { LandingHero } from '@/components/LandingHero'
import { PageHero } from '@/components/PageHero'
import { ProjectsGrid } from '@/components/ProjectsGrid'
import { ServicesGrid } from '@/components/ServicesGrid'
import type { CMSLayoutBlock, CMSProject, CMSService } from '@/lib/cms'

type Props = {
  blocks: CMSLayoutBlock[]
  services: CMSService[]
  projects: CMSProject[]
}

function applyLimit<T>(items: T[], limit?: number) {
  if (!limit || limit < 1) return items
  return items.slice(0, limit)
}

export function PageBlocks({ blocks, services, projects }: Props) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.blockType}-${block.id || index}`

        if (block.blockType === 'landingHero') {
          return (
            <LandingHero
              key={key}
              title={block.title}
              subtitle={block.subtitle}
              image={block.image}
              ctaLabel={block.cta?.label}
              ctaHref={block.cta?.href}
              containerStyle={block.containerStyle}
              useNoise={block.useNoise}
            />
          )
        }

        if (block.blockType === 'pageHero') {
          return (
            <PageHero
              key={key}
              title={block.title}
              subtitle={block.subtitle}
              containerStyle={block.containerStyle}
              useNoise={block.useNoise}
            />
          )
        }

        if (block.blockType === 'servicesGrid') {
          const source = block.featuredOnly ? services.filter((service) => service.featured) : services
          return (
            <ServicesGrid
              key={key}
              services={applyLimit(source, block.limit)}
              title={block.title}
              containerStyle={block.containerStyle}
              useNoise={block.useNoise}
            />
          )
        }

        if (block.blockType === 'projectsGrid') {
          const source = block.featuredOnly ? projects.filter((project) => project.featured) : projects
          return (
            <ProjectsGrid
              key={key}
              projects={applyLimit(source, block.limit)}
              title={block.title}
              containerStyle={block.containerStyle}
              useNoise={block.useNoise}
            />
          )
        }

        if (block.blockType === 'contactForm') {
          return (
            <PageHero
              key={key}
              title={block.title}
              subtitle={block.subtitle}
              containerStyle={block.containerStyle}
              useNoise={block.useNoise}
            >
              <div className="mx-auto max-w-3xl">
                <ContactForm />
              </div>
            </PageHero>
          )
        }

        return null
      })}
    </>
  )
}
