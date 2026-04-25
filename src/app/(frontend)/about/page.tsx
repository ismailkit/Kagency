import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocks } from '@/components/PageBlocks'
import { getPage, getProjects, getServices, resolveWorksCategories } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Kagency, our approach, and the team behind each digital experience.',
}

export default async function AboutPage() {
  const [page, services, projects] = await Promise.all([
    getPage('about'),
    getServices(),
    getProjects(),
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
      projectsByCategory={projectsByCategory}
      pageSettings={page.pageSettings}
    />
  )
}
