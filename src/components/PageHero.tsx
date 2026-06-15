import type { ReactNode } from 'react'

import { richTextToHTML } from '@/lib/richtext'
import type { RichTextContent } from '@/lib/richtext'
import { ScrollAnimate } from '@/components/ScrollAnimate'
import type { AnimType, AnimEasing } from '@/components/ScrollAnimate'
import { pxClass } from '@/lib/spacing'

type Props = {
  title: string
  subtitle?: RichTextContent
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
          as="div"
          className="mt-8 max-w-3xl font-sans text-2xl leading-tight md:text-4xl richtext"
        >
          <span dangerouslySetInnerHTML={{ __html: richTextToHTML(subtitle) }} />
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
