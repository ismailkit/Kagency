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
  title: 'About',
  description: 'Learn about Kagency, our approach, and the team behind each digital experience.',
}

export default async function AboutPage() {
  const [page, services, projects, testimonials] = await Promise.all([
    getPage('about'),
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
