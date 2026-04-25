import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { mediaURL } from '@/lib/cms'
import type { CMSMedia } from '@/lib/cms'
import { ScrollAnimate } from '@/components/ScrollAnimate'
import type { AnimType, AnimEasing } from '@/components/ScrollAnimate'

// ─── Types ──────────────────────────────────────────────────────────────────

export type FlexContentProps = {
  // Layout
  textAlign?: 'left' | 'center' | 'right'
  verticalAlign?: 'start' | 'center' | 'end'
  contentWidth?: 'sm' | 'md' | 'lg' | 'full'
  columnSplit?: '50-50' | '60-40' | '40-60' | '70-30' | '30-70'
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  paddingTop?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  paddingBottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'

  // Content
  eyebrow?: string
  eyebrowSize?: 'xs' | 'sm' | 'md'
  eyebrowWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
  heading?: string
  headingAccent?: string
  headingAccentSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  headingAccentX?: number
  headingAccentY?: number
  headingAccentHref?: string
  headingSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  headingStyle?: 'display' | 'sans' | 'handwritten'
  headingWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  body?: string
  bodySize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  bodyWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  ctaLabel?: string
  ctaHref?: string
  ctaStyle?: 'filled' | 'outline' | 'text'
  image?: CMSMedia | string
  imageAspect?: 'square' | 'video' | 'portrait' | 'landscape' | 'auto'

  // Colors
  colorEyebrow?: string
  colorHeading?: string
  colorBody?: string
  colorCta?: string

  // Custom content slot (replaces image panel)
  children?: ReactNode

  // ── Scroll animations (per element) ──────────────────────────────────────
  eyebrowAnim?: boolean
  eyebrowAnimType?: AnimType
  eyebrowAnimEasing?: AnimEasing
  eyebrowAnimDuration?: number
  eyebrowAnimDelay?: number

  headingAnim?: boolean
  headingAnimType?: AnimType
  headingAnimEasing?: AnimEasing
  headingAnimDuration?: number
  headingAnimDelay?: number

  accentAnim?: boolean
  accentAnimType?: AnimType
  accentAnimEasing?: AnimEasing
  accentAnimDuration?: number
  accentAnimDelay?: number

  bodyAnim?: boolean
  bodyAnimType?: AnimType
  bodyAnimEasing?: AnimEasing
  bodyAnimDuration?: number
  bodyAnimDelay?: number

  ctaAnim?: boolean
  ctaAnimType?: AnimType
  ctaAnimEasing?: AnimEasing
  ctaAnimDuration?: number
  ctaAnimDelay?: number

  slotAnim?: boolean
  slotAnimType?: AnimType
  slotAnimEasing?: AnimEasing
  slotAnimDuration?: number
  slotAnimDelay?: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const textAlignClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const contentWidthClass = {
  sm: 'max-w-xl',
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  full: 'max-w-none',
}

const gapClass = {
  sm: 'gap-6',
  md: 'gap-10',
  lg: 'gap-16',
  xl: 'gap-24',
}

const ptClass = {
  none: 'pt-0',
  sm: 'pt-6 md:pt-8 lg:pt-12',
  md: 'pt-10 md:pt-16 lg:pt-24',
  lg: 'pt-16 md:pt-24 lg:pt-36',
  xl: 'pt-20 md:pt-32 lg:pt-40',
}

const pbClass = {
  none: 'pb-0',
  sm: 'pb-6 md:pb-8 lg:pb-12',
  md: 'pb-10 md:pb-16 lg:pb-24',
  lg: 'pb-16 md:pb-24 lg:pb-36',
  xl: 'pb-20 md:pb-32 lg:pb-40',
}

const pxClass = {
  none: 'px-0',
  sm: 'px-4 md:px-6 lg:px-8',
  md: 'px-6 md:px-10 lg:px-16',
  lg: 'px-8 md:px-16 lg:px-24',
  xl: 'px-10 md:px-20 lg:px-32',
}

const headingSizeClass = {
  sm: 'text-2xl md:text-3xl',
  md: 'text-3xl md:text-4xl',
  lg: 'text-4xl md:text-6xl',
  xl: 'text-5xl md:text-7xl',
  '2xl': 'text-6xl md:text-9xl',
}

const headingWeightClass: Record<string, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
}

const bodySizeClass: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
}

const bodyWeightClass: Record<string, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const eyebrowSizeClass: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
}

const eyebrowWeightClass: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const accentSizeMap: Record<string, string> = {
  xs: '1rem',
  sm: '1.25rem',
  md: '1.875rem',
  lg: '2.25rem',
  xl: '3rem',
  '2xl': '3.75rem',
  '3xl': '4.5rem',
  '4xl': '6rem',
}

const headingFontClass = {
  display: 'font-display italic uppercase leading-tight',
  sans: 'font-sans leading-tight',
  handwritten: 'font-handwritten',
}

const aspectClass = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[2/3]',
  landscape: 'aspect-[4/3]',
  auto: '',
}

// Column split: [textCols, imageCols] as Tailwind grid-cols fractions
const splitCols: Record<string, [string, string]> = {
  '50-50': ['md:w-1/2', 'md:w-1/2'],
  '60-40': ['md:w-3/5', 'md:w-2/5'],
  '40-60': ['md:w-2/5', 'md:w-3/5'],
  '70-30': ['md:w-[70%]', 'md:w-[30%]'],
  '30-70': ['md:w-[30%]', 'md:w-[70%]'],
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FlexContent({
  textAlign = 'left',
  verticalAlign = 'center',
  contentWidth = 'lg',
  columnSplit = '50-50',
  gap = 'md',
  paddingTop = 'md',
  paddingBottom = 'md',
  paddingX = 'md',
  eyebrow,
  eyebrowSize = 'xs',
  eyebrowWeight = 'bold',
  heading,
  headingSize = 'lg',
  headingStyle = 'display',
  headingWeight = 'bold',
  headingAccent,
  headingAccentSize = 'md',
  headingAccentX = -1,
  headingAccentY = -0.75,
  headingAccentHref,
  body,
  bodySize = 'xl',
  bodyWeight = 'normal',
  ctaLabel,
  ctaHref,
  ctaStyle = 'filled',
  image,
  imageAspect = 'landscape',
  colorEyebrow,
  colorHeading,
  colorBody,
  colorCta,
  children,
  eyebrowAnim,
  eyebrowAnimType,
  eyebrowAnimEasing,
  eyebrowAnimDuration,
  eyebrowAnimDelay,
  headingAnim,
  headingAnimType,
  headingAnimEasing,
  headingAnimDuration,
  headingAnimDelay,
  accentAnim,
  accentAnimType,
  accentAnimEasing,
  accentAnimDuration,
  accentAnimDelay,
  bodyAnim,
  bodyAnimType,
  bodyAnimEasing,
  bodyAnimDuration,
  bodyAnimDelay,
  ctaAnim,
  ctaAnimType,
  ctaAnimEasing,
  ctaAnimDuration,
  ctaAnimDelay,
  slotAnim,
  slotAnimType,
  slotAnimEasing,
  slotAnimDuration,
  slotAnimDelay,
}: FlexContentProps) {
  const imageSrc = mediaURL(image) ?? null
  const isHorizontal = false
  const hasImage = !!imageSrc || !!children

  const [textCol, imgCol] = splitCols[columnSplit] ?? splitCols['50-50']

  const slotEl = children ? (
    <ScrollAnimate
      enabled={slotAnim}
      type={slotAnimType}
      easing={slotAnimEasing}
      duration={slotAnimDuration}
      delay={slotAnimDelay}
      className={`w-full shrink-0 ${isHorizontal ? imgCol : ''}`}
    >
      {children}
    </ScrollAnimate>
  ) : hasImage ? (
    <ScrollAnimate
      enabled={slotAnim}
      type={slotAnimType}
      easing={slotAnimEasing}
      duration={slotAnimDuration}
      delay={slotAnimDelay}
      className={`relative w-full shrink-0 ${isHorizontal ? imgCol : ''} ${aspectClass[imageAspect ?? 'landscape']}`}
    >
      <Image
        src={imageSrc!}
        alt=""
        fill={imageAspect !== 'auto'}
        width={imageAspect === 'auto' ? 1200 : undefined}
        height={imageAspect === 'auto' ? 800 : undefined}
        className={`object-cover${imageAspect === 'auto' ? ' w-full h-auto' : ''}`}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </ScrollAnimate>
  ) : null

  const ctaEl =
    ctaLabel && ctaHref ? (
      ctaStyle === 'text' ? (
        <Link
          href={ctaHref}
          className="group inline-flex items-center gap-3"
          style={colorCta ? { color: colorCta } : undefined}
        >
          <span className="font-display font-bold text-lg uppercase underline underline-offset-4 transition-colors group-hover:text-kred-500">
            {ctaLabel}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1.5 shrink-0"
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
      ) : (
        <Link
          href={ctaHref}
          style={
            colorCta
              ? {
                  color: ctaStyle !== 'filled' ? colorCta : undefined,
                  borderColor: ctaStyle === 'outline' ? colorCta : undefined,
                  backgroundColor: ctaStyle === 'filled' ? colorCta : undefined,
                }
              : undefined
          }
          className={`inline-block font-sans font-bold uppercase tracking-wide text-sm rounded-full px-6 py-2.5 transition ${
            ctaStyle === 'filled'
              ? 'bg-kred-500 text-white hover:bg-kred-600'
              : 'border-2 border-current hover:bg-kred-500 hover:text-white hover:border-kred-500'
          }`}
        >
          {ctaLabel}
        </Link>
      )
    ) : null

  const textEl = (
    <div
      className={`flex flex-col ${isHorizontal ? textCol : 'w-full'} ${gapClass[gap ?? 'md']} ${textAlignClass[textAlign ?? 'left']}`}
    >
      {eyebrow && (
        <ScrollAnimate
          enabled={eyebrowAnim}
          type={eyebrowAnimType}
          easing={eyebrowAnimEasing}
          duration={eyebrowAnimDuration}
          delay={eyebrowAnimDelay}
          as="p"
          className={`font-sans uppercase tracking-widest ${eyebrowSizeClass[eyebrowSize]} ${eyebrowWeightClass[eyebrowWeight]}`}
          style={colorEyebrow ? { color: colorEyebrow } : undefined}
        >
          {eyebrow}
        </ScrollAnimate>
      )}
      {heading && (
        <div className="relative block overflow-visible">
          <ScrollAnimate
            enabled={headingAnim}
            type={headingAnimType}
            easing={headingAnimEasing}
            duration={headingAnimDuration}
            delay={headingAnimDelay}
            as="h2"
            className={`${headingSizeClass[headingSize]} ${headingFontClass[headingStyle]} ${headingWeightClass[headingWeight]}`}
            style={colorHeading ? { color: colorHeading } : undefined}
          >
            {heading}
          </ScrollAnimate>
          {headingAccent && (
            <ScrollAnimate
              enabled={accentAnim}
              type={accentAnimType}
              easing={accentAnimEasing}
              duration={accentAnimDuration}
              delay={accentAnimDelay}
              as="span"
              className="absolute font-handwritten text-kyellow-500 -rotate-12 pointer-events-none"
              style={{
                bottom: `${headingAccentY}rem`,
                right: `${headingAccentX}rem`,
                fontSize: accentSizeMap[headingAccentSize],
              }}
            >
              {headingAccentHref ? (
                <a
                  href={headingAccentHref}
                  className="pointer-events-auto cursor-pointer hover:opacity-70 transition-opacity"
                >
                  {headingAccent}
                </a>
              ) : (
                headingAccent
              )}
            </ScrollAnimate>
          )}
        </div>
      )}
      {body && (
        <ScrollAnimate
          enabled={bodyAnim}
          type={bodyAnimType}
          easing={bodyAnimEasing}
          duration={bodyAnimDuration}
          delay={bodyAnimDelay}
          as="p"
          className={`font-sans leading-relaxed ${bodySizeClass[bodySize]} ${bodyWeightClass[bodyWeight]}`}
          style={colorBody ? { color: colorBody } : undefined}
        >
          {body}
        </ScrollAnimate>
      )}
      {ctaEl && (
        <ScrollAnimate
          enabled={ctaAnim}
          type={ctaAnimType}
          easing={ctaAnimEasing}
          duration={ctaAnimDuration}
          delay={ctaAnimDelay}
          className={
            textAlign === 'center'
              ? 'flex justify-center'
              : textAlign === 'right'
                ? 'flex justify-end'
                : ''
          }
        >
          {ctaEl}
        </ScrollAnimate>
      )}
    </div>
  )

  const wrapClass = `mx-auto ${pxClass[paddingX]} ${ptClass[paddingTop]} ${pbClass[paddingBottom]} ${contentWidthClass[contentWidth]}`

  if (!hasImage) {
    return <div className={wrapClass}>{textEl}</div>
  }

  return (
    <div className={`${wrapClass} flex flex-col ${gapClass[gap]}`}>
      {textEl}
      {slotEl}
    </div>
  )
}
