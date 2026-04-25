'use client'

import Image from 'next/image'
import Link from 'next/link'

import { mediaURL } from '@/lib/cms'
import { ScrollAnimate } from '@/components/ScrollAnimate'
import type { AnimType, AnimEasing } from '@/components/ScrollAnimate'

type Props = {
  title: string
  subtitle: string
  image?: { url?: string; alt?: string } | string
  ctaLabel?: string
  ctaHref?: string
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
  ctaAnim?: boolean
  ctaAnimType?: AnimType
  ctaAnimEasing?: AnimEasing
  ctaAnimDuration?: number
  ctaAnimDelay?: number
  imageAnim?: boolean
  imageAnimType?: AnimType
  imageAnimEasing?: AnimEasing
  imageAnimDuration?: number
  imageAnimDelay?: number
  paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const pxClass = {
  none: 'px-0',
  sm: 'px-4 md:px-6 lg:px-8',
  md: 'px-6 md:px-10 lg:px-16',
  lg: 'px-8 md:px-16 lg:px-24',
  xl: 'px-10 md:px-20 lg:px-32',
}

export function LandingHero({
  title,
  subtitle,
  image,
  ctaLabel,
  ctaHref,
  titleAnim,
  titleAnimType = 'fade-up',
  titleAnimEasing = 'ease-out',
  titleAnimDuration = 550,
  titleAnimDelay = 0,
  subtitleAnim,
  subtitleAnimType = 'fade-up',
  subtitleAnimEasing = 'ease-out',
  subtitleAnimDuration = 550,
  subtitleAnimDelay = 100,
  ctaAnim,
  ctaAnimType = 'fade-up',
  ctaAnimEasing = 'ease-out',
  ctaAnimDuration = 500,
  ctaAnimDelay = 200,
  imageAnim,
  imageAnimType = 'fade',
  imageAnimEasing = 'ease-out',
  imageAnimDuration = 600,
  imageAnimDelay = 100,
  paddingX = 'md' as const,
}: Props) {
  const imageSrc = mediaURL(image) || '/assets/vector/jumping.svg'

  return (
    <div className={`${pxClass[paddingX]} py-16`}>
      <div className="grid min-h-[65vh] grid-cols-1 items-center gap-8 md:grid-cols-[1.1fr_.9fr]">
        <div>
          <ScrollAnimate
            enabled={titleAnim}
            type={titleAnimType}
            easing={titleAnimEasing}
            duration={titleAnimDuration}
            delay={titleAnimDelay}
            as="h1"
            className="font-display italic text-5xl font-bold uppercase leading-tight text-kblack-500 md:text-7xl"
          >
            {title}
          </ScrollAnimate>
          <ScrollAnimate
            enabled={subtitleAnim}
            type={subtitleAnimType}
            easing={subtitleAnimEasing}
            duration={subtitleAnimDuration}
            delay={subtitleAnimDelay}
            as="p"
            className="mt-10 max-w-lg font-sans text-2xl font-medium leading-tight text-kblack-500 md:text-3xl"
          >
            {subtitle}
          </ScrollAnimate>

          {ctaLabel && ctaHref ? (
            <ScrollAnimate
              enabled={ctaAnim}
              type={ctaAnimType}
              easing={ctaAnimEasing}
              duration={ctaAnimDuration}
              delay={ctaAnimDelay}
              className="mt-14 inline-block"
            >
              <Link href={ctaHref} className="group inline-flex items-center gap-3">
                <span className="font-display font-bold text-lg uppercase text-kred-500 underline md:text-xl">
                  {ctaLabel}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="text-kred-500 transition-transform group-hover:translate-x-1.5"
                >
                  <path
                    d="M10 19.25C4.89137 19.25 0.75 15.1086 0.75 10C0.75 4.89137 4.89137 0.75 10 0.75C15.1086 0.75 19.25 4.89137 19.25 10C19.25 15.1086 15.1086 19.25 10 19.25Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 6L9.295 6.705L12.085 9.5H6V10.5H12.085L9.295 13.295L10 14L14 10L10 6Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
            </ScrollAnimate>
          ) : null}
        </div>

        <ScrollAnimate
          enabled={imageAnim}
          type={imageAnimType}
          easing={imageAnimEasing}
          duration={imageAnimDuration}
          delay={imageAnimDelay}
          className="mx-auto w-full max-w-md md:max-w-xl"
        >
          <Image
            src={imageSrc}
            alt="Hero illustration"
            width={760}
            height={640}
            className="h-auto w-full"
            priority
          />
        </ScrollAnimate>
      </div>
    </div>
  )
}
