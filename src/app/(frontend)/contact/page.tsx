import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageBlocks } from '@/components/PageBlocks'
import { getPage, getProjects, getServices } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start your project with Kagency. Tell us your goals and we will shape the roadmap.',
}

export default async function ContactPage() {
  const [page, services, projects] = await Promise.all([getPage('contact'), getServices(), getProjects()])

  if (!page?.layout || page.layout.length === 0) {
    notFound()
  }

  return <PageBlocks blocks={page.layout} services={services} projects={projects} />
}
