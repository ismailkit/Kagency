import { PageBlocks } from '@/components/PageBlocks'
import { getPage, getProjects, getServices } from '@/lib/cms'
import { notFound } from 'next/navigation'

export default async function HomePage() {
  const [page, services, projects] = await Promise.all([
    getPage('home'),
    getServices(),
    getProjects(),
  ])

  if (!page?.layout || page.layout.length === 0) {
    notFound()
  }

  return <PageBlocks blocks={page.layout} services={services} projects={projects} />
}
