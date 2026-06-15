'use client'

import Image from 'next/image'
import { useId } from 'react'
import { mediaURL } from '@/lib/cms'
import { pxClass } from '@/lib/spacing'
import type { CMSMedia } from '@/lib/cms'

// ─── Types ────────────────────────────────────────────────────────────────────

export type LogoCarouselDirection = 'left' | 'right' | 'up' | 'down'
export type LogoCarouselGap = 'sm' | 'md' | 'lg' | 'xl'
export type LogoCarouselRowGap = 'sm' | 'md' | 'lg'
export type LogoCarouselPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl'

export interface LogoItem {
  id?: string
  image?: CMSMedia | string
  alt?: string
  href?: string
  label?: string
}

export interface LogoCarouselProps {
  logos: LogoItem[]
  /** Number of stacked marquee rows (1-3). Default 1. */
  rows?: number
  /** Primary scroll direction for odd rows. Default 'left'. */
  direction?: LogoCarouselDirection
  /** Reverse direction on even-numbered rows. Default true. */
  alternateRows?: boolean
  /** Animation duration in seconds — lower is faster. Default 40. */
  speed?: number
  /** Gap between logos inside a row. Default 'lg'. */
  gap?: LogoCarouselGap
  /** Gap between rows. Default 'md'. */
  rowGap?: LogoCarouselRowGap
  /** Max height of each logo in px. Default 48. */
  logoHeight?: number
  /** Pause animation on mouse hover. Default true. */
  pauseOnHover?: boolean
  /** Fade mask on the left and right (or top/bottom) edges. Default true. */
  fadeEdges?: boolean
  /** Convert all logos to grayscale. Default false. */
  grayscale?: boolean
  paddingX?: LogoCarouselPadding
  paddingTop?: LogoCarouselPadding
  paddingBottom?: LogoCarouselPadding
}

// ─── Gap maps ─────────────────────────────────────────────────────────────────

const GAP_PX: Record<LogoCarouselGap, number> = {
  sm: 16,
  md: 32,
  lg: 56,
  xl: 80,
}

const ROW_GAP_PX: Record<LogoCarouselRowGap, number> = {
  sm: 12,
  md: 24,
  lg: 40,
}

const PT_CLASS: Record<LogoCarouselPadding, string> = {
  none: '',
  sm: 'pt-4 md:pt-6',
  md: 'pt-8 md:pt-12',
  lg: 'pt-12 md:pt-20',
  xl: 'pt-16 md:pt-28',
}

const PB_CLASS: Record<LogoCarouselPadding, string> = {
  none: '',
  sm: 'pb-4 md:pb-6',
  md: 'pb-8 md:pb-12',
  lg: 'pb-12 md:pb-20',
  xl: 'pb-16 md:pb-28',
}

// ─── Helper: opposite direction ───────────────────────────────────────────────

function oppositeDir(dir: LogoCarouselDirection): LogoCarouselDirection {
  if (dir === 'left') return 'right'
  if (dir === 'right') return 'left'
  if (dir === 'up') return 'down'
  return 'up'
}

// ─── Single logo item ─────────────────────────────────────────────────────────

function LogoCard({
  item,
  height,
  grayscale,
  gap,
}: {
  item: LogoItem
  height: number
  grayscale: boolean
  gap: number
}) {
  const url = typeof item.image === 'object' ? (mediaURL(item.image) ?? '') : (item.image ?? '')
  const alt = item.alt ?? ''

  const img = url ? (
    <Image
      src={url}
      alt={alt}
      width={0}
      height={height}
      sizes={`${height * 4}px`}
      style={{
        height,
        width: 'auto',
        maxWidth: height * 5, // cap at 5:1 aspect ratio
        objectFit: 'contain',
        filter: grayscale ? 'grayscale(1)' : undefined,
        transition: 'filter 0.3s ease',
        userSelect: 'none',
        flexShrink: 0,
      }}
      unoptimized={url.endsWith('.svg')}
      draggable={false}
    />
  ) : null

  const inner = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0,
        marginRight: gap,
      }}
    >
      {img}
      {item.label && (
        <span style={{ fontSize: 11, opacity: 0.5, whiteSpace: 'nowrap' }}>{item.label}</span>
      )}
    </div>
  )

  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
        {inner}
      </a>
    )
  }
  return inner
}

// ─── Single marquee row ───────────────────────────────────────────────────────

function MarqueeRow({
  logos,
  direction,
  speed,
  gap,
  logoHeight,
  grayscale,
  pauseOnHover,
  trackClass,
  wrapperClass,
}: {
  logos: LogoItem[]
  direction: LogoCarouselDirection
  speed: number
  gap: number
  logoHeight: number
  grayscale: boolean
  pauseOnHover: boolean
  /** CSS class name for the animating track element */
  trackClass: string
  /** CSS class name for the outer overflow-hidden wrapper */
  wrapperClass: string
}) {
  const isVertical = direction === 'up' || direction === 'down'
  const isReverse = direction === 'right' || direction === 'down'
  const keyframe = isVertical ? 'marquee-vert' : 'marquee-horiz'

  // Duplicate logos for seamless loop
  const doubled = [...logos, ...logos]

  if (isVertical) {
    return (
      <div
        className={wrapperClass}
        style={{
          height: logoHeight * 5 + gap * 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          className={trackClass}
          style={{
            display: 'flex',
            flexDirection: 'column',
            animationName: keyframe,
            animationDuration: `${speed}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDirection: isReverse ? 'reverse' : 'normal',
          }}
        >
          {doubled.map((item, i) => (
            <div
              key={i}
              style={{ marginBottom: gap, flexShrink: 0 }}
              aria-hidden={i >= logos.length}
            >
              <LogoCard item={item} height={logoHeight} grayscale={grayscale} gap={0} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={wrapperClass} style={{ overflow: 'hidden', position: 'relative' }}>
      <div
        className={trackClass}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: 'max-content',
          animationName: keyframe,
          animationDuration: `${speed}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDirection: isReverse ? 'reverse' : 'normal',
        }}
      >
        {doubled.map((item, i) => (
          <div key={i} aria-hidden={i >= logos.length}>
            <LogoCard item={item} height={logoHeight} grayscale={grayscale} gap={gap} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LogoCarousel({
  logos = [],
  rows = 1,
  direction = 'left',
  alternateRows = true,
  speed = 40,
  gap = 'lg',
  rowGap = 'md',
  logoHeight = 48,
  pauseOnHover = true,
  fadeEdges = true,
  grayscale = false,
  paddingX = 'md',
  paddingTop = 'md',
  paddingBottom = 'md',
}: LogoCarouselProps) {
  const uid = useId().replace(/:/g, '')
  const gapPx = GAP_PX[gap]
  const rowGapPx = ROW_GAP_PX[rowGap]
  const clampedRows = Math.max(1, Math.min(3, rows))
  const isVertical = direction === 'up' || direction === 'down'

  if (!logos.length) return null

  const wrapperCls = `lc-wrap-${uid}`
  const trackCls = `lc-track-${uid}`

  // Build inline CSS for keyframes + pause-on-hover
  const css = `
    @keyframes marquee-horiz {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes marquee-vert {
      from { transform: translateY(0); }
      to   { transform: translateY(-50%); }
    }
    ${
      pauseOnHover
        ? `.${wrapperCls}:hover .${trackCls} { animation-play-state: paused !important; }`
        : ''
    }
  `

  const isV = isVertical
  const maskStyle: React.CSSProperties = fadeEdges
    ? isV
      ? {
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        }
      : {
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }
    : {}

  return (
    <div
      className={`${wrapperCls} ${pxClass[paddingX]} ${PT_CLASS[paddingTop]} ${PB_CLASS[paddingBottom]}`}
      style={{ overflow: 'hidden', ...maskStyle }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {Array.from({ length: clampedRows }).map((_, rowIndex) => {
        const rowDir = alternateRows && rowIndex % 2 === 1 ? oppositeDir(direction) : direction
        return (
          <div key={rowIndex} style={rowIndex > 0 ? { marginTop: rowGapPx } : undefined}>
            <MarqueeRow
              logos={logos}
              direction={rowDir}
              speed={speed}
              gap={gapPx}
              logoHeight={logoHeight}
              grayscale={grayscale}
              pauseOnHover={pauseOnHover}
              trackClass={trackCls}
              wrapperClass=""
            />
          </div>
        )
      })}
    </div>
  )
}
