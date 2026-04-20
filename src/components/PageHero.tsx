import type { ReactNode } from 'react'

import { SectionBlock, type ContainerStyle } from '@/components/SectionBlock'

type Props = {
  title: string
  subtitle?: string
  containerStyle?: ContainerStyle
  useNoise?: boolean
  children?: ReactNode
}

export function PageHero({ title, subtitle, containerStyle = 'center', useNoise = false, children }: Props) {
  return (
    <SectionBlock styleType={containerStyle} noise={useNoise} className="px-6 py-14 md:px-10 md:py-16">
      <div>
        <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] md:text-7xl">{title}</h1>
        {subtitle ? <p className="mt-8 max-w-3xl font-sans text-2xl leading-tight md:text-4xl">{subtitle}</p> : null}
        {children}
      </div>
    </SectionBlock>
  )
}
