import type { CMSService } from '@/lib/cms'
import { SectionBlock, type ContainerStyle } from '@/components/SectionBlock'

type Props = {
  services: CMSService[]
  title?: string
  containerStyle?: ContainerStyle
  useNoise?: boolean
}

export function ServicesGrid({ services, title, containerStyle = 'center', useNoise = false }: Props) {
  if (!title) return null

  return (
    <SectionBlock styleType={containerStyle} noise={useNoise} className="px-6 py-14 md:px-10 md:py-16">
      <div>
        <h2 className="font-display text-4xl font-bold uppercase md:text-6xl">{title}</h2>

        {services.length === 0 ? (
          <div className="mt-8 h-1 w-24 bg-kblack-100" />
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="rounded-2xl border-[3px] border-kblack-500 p-6">
                <p className="font-display text-sm uppercase tracking-wide text-kred-500">{service.category}</p>
                <h3 className="mt-2 font-display text-3xl uppercase">{service.title}</h3>
                <p className="mt-4 font-sans text-lg leading-snug text-kblack-500">{service.shortDescription}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </SectionBlock>
  )
}
