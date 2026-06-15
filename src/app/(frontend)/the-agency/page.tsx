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
  title: 'The Agency',
  description:
    'View selected agency portfolio work and our approach to modern digital storytelling.',
}

export default async function TheAgencyPage() {
  const [page, services, projects, testimonials] = await Promise.all([
    getPage('the-agency'),
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
