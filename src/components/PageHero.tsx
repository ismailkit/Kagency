import type { ReactNode } from 'react'

import { ScrollAnimate } from '@/components/ScrollAnimate'
import type { AnimType, AnimEasing } from '@/components/ScrollAnimate'

type Props = {
  title: string
  subtitle?: string
  children?: ReactNode
  // Scroll animations
  titleAnim?: boolean
  titleAnimType?: AnimType
  titleAnimEasing?: AnimEasing
  titleAnimDuration?: number
  titleAnimDelay?: number
  subtitleAnim?: boolean
  subtitleAnimType?: AnimType
  subtitleAnimEasing?: AnimEasing
  subtitleAnimDuration?: number
  subtitleAnimDelay?: number
  contentAnim?: boolean
  contentAnimType?: AnimType
  contentAnimEasing?: AnimEasing
  contentAnimDuration?: number
  contentAnimDelay?: number
  paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const pxClass = {
  none: 'px-0',
  sm: 'px-4 md:px-6 lg:px-8',
  md: 'px-6 md:px-10 lg:px-16',
  lg: 'px-8 md:px-16 lg:px-24',
  xl: 'px-10 md:px-20 lg:px-32',
}

export function PageHero({
  title,
  subtitle,
  children,
  titleAnim,
  titleAnimType,
  titleAnimEasing,
  titleAnimDuration,
  titleAnimDelay,
  subtitleAnim,
  subtitleAnimType,
  subtitleAnimEasing,
  subtitleAnimDuration,
  subtitleAnimDelay,
  contentAnim,
  contentAnimType,
  contentAnimEasing,
  contentAnimDuration,
  contentAnimDelay,
  paddingX = 'md' as const,
}: Props) {
  return (
    <div className={`${pxClass[paddingX]} py-14 md:py-16`}>
      <ScrollAnimate
        enabled={titleAnim}
        type={titleAnimType}
        easing={titleAnimEasing}
        duration={titleAnimDuration}
        delay={titleAnimDelay}
        as="h1"
        className="font-display text-5xl font-bold uppercase leading-[0.95] md:text-7xl"
      >
        {title}
      </ScrollAnimate>
      {subtitle ? (
        <ScrollAnimate
          enabled={subtitleAnim}
          type={subtitleAnimType}
          easing={subtitleAnimEasing}
          duration={subtitleAnimDuration}
          delay={subtitleAnimDelay}
          as="p"
          className="mt-8 max-w-3xl font-sans text-2xl leading-tight md:text-4xl"
        >
          {subtitle}
        </ScrollAnimate>
      ) : null}
      {children ? (
        <ScrollAnimate
          enabled={contentAnim}
          type={contentAnimType}
          easing={contentAnimEasing}
          duration={contentAnimDuration}
          delay={contentAnimDelay}
        >
          {children}
        </ScrollAnimate>
      ) : null}
    </div>
  )
}
