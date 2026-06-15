import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocks } from '@/components/PageBlocks'
import {
  getPage,
  getProjects,
  getServices,
  getTestimonials,
  resolveWorksCategories,
} from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore our agency services across strategy, branding, product design, and web development.',
}

export default async function ServicesPage() {
  const [page, services, projects, testimonials] = await Promise.all([
    getPage('services'),
    getServices(),
    getProjects(),
    getTestimonials(),
  ])

  if (!page?.layout || page.layout.length === 0) {
    notFound()
  }

  const projectsByCategory = await resolveWorksCategories(page.layout)

  return (
    <PageBlocks
      blocks={page.layout}
      services={services}
      projects={projects}
      testimonials={testimonials}
      projectsByCategory={projectsByCategory}
      pageSettings={page.pageSettings}
    />
  )
}
