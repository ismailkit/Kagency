import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocks } from '@/components/PageBlocks'
import { getPage, getProjects, getServices } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore our agency services across strategy, branding, product design, and web development.',
}

export default async function ServicesPage() {
  const [page, services, projects] = await Promise.all([getPage('services'), getServices(), getProjects()])

  if (!page?.layout || page.layout.length === 0) {
    notFound()
  }

  return <PageBlocks blocks={page.layout} services={services} projects={projects} />
}
