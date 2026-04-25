import type { CMSService } from '@/lib/cms'
import { ScrollAnimate } from '@/components/ScrollAnimate'
import type { AnimType, AnimEasing } from '@/components/ScrollAnimate'

type Props = {
  services: CMSService[]
  title?: string
  // Scroll animations
  titleAnim?: boolean
  titleAnimType?: AnimType
  titleAnimEasing?: AnimEasing
  titleAnimDuration?: number
  titleAnimDelay?: number
  itemsAnim?: boolean
  itemsAnimType?: AnimType
  itemsAnimEasing?: AnimEasing
  itemsAnimDuration?: number
  itemsAnimDelay?: number
  itemsAnimStagger?: number
  paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const pxClass = {
  none: 'px-0',
  sm: 'px-4 md:px-6 lg:px-8',
  md: 'px-6 md:px-10 lg:px-16',
  lg: 'px-8 md:px-16 lg:px-24',
  xl: 'px-10 md:px-20 lg:px-32',
}

export function ServicesGrid({
  services,
  title,
  titleAnim,
  titleAnimType,
  titleAnimEasing,
  titleAnimDuration,
  titleAnimDelay,
  itemsAnim,
  itemsAnimType,
  itemsAnimEasing,
  itemsAnimDuration,
  itemsAnimDelay = 0,
  itemsAnimStagger = 100,
  paddingX = 'md' as const,
}: Props) {
  if (!title) return null

  return (
    <div className={`${pxClass[paddingX]} py-14 md:py-16`}>
      <div>
        <ScrollAnimate
          enabled={titleAnim}
          type={titleAnimType}
          easing={titleAnimEasing}
          duration={titleAnimDuration}
          delay={titleAnimDelay}
          as="h2"
          className="font-display text-4xl font-bold uppercase md:text-6xl"
        >
          {title}
        </ScrollAnimate>

        {services.length === 0 ? (
          <div className="mt-8 h-1 w-24 bg-kblack-100" />
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ScrollAnimate
                key={service.id}
                enabled={itemsAnim}
                type={itemsAnimType ?? 'fade-up'}
                easing={itemsAnimEasing}
                duration={itemsAnimDuration}
                delay={(itemsAnimDelay ?? 0) + i * itemsAnimStagger}
                as="li"
                className="list-none rounded-2xl border-[3px] border-kblack-500 p-6"
              >
                <p className="font-display text-sm uppercase tracking-wide text-kred-500">
                  {service.category}
                </p>
                <h3 className="mt-2 font-display text-3xl uppercase">{service.title}</h3>
                <p className="mt-4 font-sans text-lg leading-snug text-kblack-500">
                  {service.shortDescription}
                </p>
              </ScrollAnimate>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
