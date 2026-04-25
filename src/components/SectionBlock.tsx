import type { CSSProperties, ReactNode } from 'react'
import { ScrollJackShell } from '@/components/ScrollJackShell'

export type ContainerStyle = 'normal' | 'center' | 'top' | 'bottom' | 'scroll-jack'

export type BackgroundLayer =
  | {
      type: 'solid'
      color: string
      opacity?: number
      blendMode?: string
      enableTransform?: boolean
      bgSize?: string
      bgPosition?: string
      bgRepeat?: string
    }
  | {
      type: 'gradient'
      value: string
      opacity?: number
      blendMode?: string
      enableTransform?: boolean
      bgSize?: string
      bgPosition?: string
      bgRepeat?: string
    }
  | {
      type: 'image'
      url: string
      enableTransform?: boolean
      bgSize?: string
      bgPosition?: string
      bgRepeat?: string
      blendMode?: string
      opacity?: number
    }
  | {
      type: 'svg'
      svgCode: string
      opacity?: number
      blendMode?: string
      svgTop?: string
      svgRight?: string
      svgBottom?: string
      svgLeft?: string
      svgTransform?: string
    }

export type NoiseType = 'solid' | 'gradient' | 'none' | boolean | null

type PaddingSize = 'none' | 'sm' | 'md' | 'lg' | 'xl'

type Props = {
  children: ReactNode
  styleType?: ContainerStyle
  paddingTop?: PaddingSize
  paddingBottom?: PaddingSize
  paddingX?: PaddingSize
  noise?: NoiseType
  className?: string
  backgrounds?: BackgroundLayer[]
  borderType?: 'none' | 'solid' | 'gradient'
  borderColor?: string
  borderGradient?: string
  allowOverflow?: boolean
  direction?: 'column' | 'row' | 'row-reverse' | 'column-reverse'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'center' | 'end' | 'stretch'
  wrap?: boolean
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  /** Extra vertical scroll space in vh (scroll-jack only). Default 200. */
  scrollJackHeight?: number
  /** Scrub smoothness in seconds (scroll-jack only). Default 1.2. */
  scrollJackScrub?: number
}

function noiseClass(noise: NoiseType): string {
  if (!noise || noise === 'none') return ''
  if (noise === 'gradient') return 'is-noise--gradient'
  return 'is-noise'
}

function styleClass(styleType: ContainerStyle) {
  if (styleType === 'top') return 'section-container--top'
  if (styleType === 'bottom') return 'section-container--bottom'
  if (styleType === 'center') return 'section-container--center'
  return 'section-container--normal'
}

const directionClass = {
  column: 'flex-col',
  'column-reverse': 'flex-col-reverse',
  row: 'flex-col md:flex-row',
  'row-reverse': 'flex-col md:flex-row-reverse',
}

const justifyClass = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

const alignClass = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const gapClass = {
  sm: 'gap-6',
  md: 'gap-10',
  lg: 'gap-16',
  xl: 'gap-24',
}

const paddingTopClass: Record<NonNullable<PaddingSize>, string> = {
  none: 'pt-0',
  sm: 'pt-6 md:pt-8 lg:pt-12',
  md: 'pt-10 md:pt-16 lg:pt-24',
  lg: 'pt-16 md:pt-24 lg:pt-36',
  xl: 'pt-20 md:pt-32 lg:pt-52',
}

const paddingBottomClass: Record<NonNullable<PaddingSize>, string> = {
  none: 'pb-0',
  sm: 'pb-6 md:pb-8 lg:pb-12',
  md: 'pb-10 md:pb-16 lg:pb-24',
  lg: 'pb-16 md:pb-24 lg:pb-36',
  xl: 'pb-20 md:pb-32 lg:pb-52',
}

const paddingXClass: Record<NonNullable<PaddingSize>, string> = {
  none: 'px-0',
  sm: 'px-4 md:px-6 lg:px-8',
  md: 'px-6 md:px-10 lg:px-16',
  lg: 'px-8 md:px-16 lg:px-24',
  xl: 'px-10 md:px-20 lg:px-32',
}

function layerStyle(layer: BackgroundLayer): CSSProperties {
  const blend = layer.blendMode as CSSProperties['mixBlendMode'] | undefined
  if (layer.type === 'solid') {
    const s: CSSProperties = {
      background: layer.color,
      opacity: layer.opacity ?? 1,
      mixBlendMode: blend,
    }
    if (layer.enableTransform) {
      if (layer.bgSize) s.backgroundSize = layer.bgSize
      if (layer.bgPosition) s.backgroundPosition = layer.bgPosition
      if (layer.bgRepeat) s.backgroundRepeat = layer.bgRepeat as CSSProperties['backgroundRepeat']
    }
    return s
  }
  if (layer.type === 'gradient') {
    const s: CSSProperties = {
      background: layer.value,
      opacity: layer.opacity ?? 1,
      mixBlendMode: blend,
    }
    if (layer.enableTransform) {
      if (layer.bgSize) s.backgroundSize = layer.bgSize
      if (layer.bgPosition) s.backgroundPosition = layer.bgPosition
      if (layer.bgRepeat) s.backgroundRepeat = layer.bgRepeat as CSSProperties['backgroundRepeat']
    }
    return s
  }
  return {
    backgroundImage: `url(${layer.url})`,
    backgroundSize: layer.enableTransform && layer.bgSize ? layer.bgSize : 'cover',
    backgroundPosition: layer.enableTransform && layer.bgPosition ? layer.bgPosition : 'center',
    backgroundRepeat: (layer.enableTransform && layer.bgRepeat
      ? layer.bgRepeat
      : 'no-repeat') as CSSProperties['backgroundRepeat'],
    opacity: layer.opacity ?? 1,
    mixBlendMode: blend,
  }
}

export function SectionBlock({
  children,
  styleType = 'normal',
  paddingTop = 'none',
  paddingBottom = 'none',
  paddingX,
  noise = false,
  className = '',
  backgrounds = [],
  borderType,
  borderColor,
  borderGradient,
  allowOverflow = false,
  direction,
  justify,
  align,
  wrap = false,
  gap,
  scrollJackHeight = 200,
  scrollJackScrub = 1.2,
}: Props) {
  const ptClass = paddingTopClass[paddingTop]
  const pbClass = paddingBottomClass[paddingBottom]
  const pxClass = paddingX ? paddingXClass[paddingX] : ''
  const hasGradientBorder = borderType === 'gradient' && !!borderGradient
  const borderCss: CSSProperties =
    borderType === 'solid' && borderColor
      ? ({ '--section-border': borderColor } as CSSProperties)
      : hasGradientBorder
        ? ({ '--section-border-gradient': borderGradient } as CSSProperties)
        : {}

  // Split bg layers: non-SVG rendered first, SVG rendered after — all at section-block level
  const outerLayers = backgrounds.filter(
    (l): l is Exclude<BackgroundLayer, { type: 'svg' }> => l.type !== 'svg',
  )
  const svgLayers = backgrounds.filter(
    (l): l is Extract<BackgroundLayer, { type: 'svg' }> => l.type === 'svg',
  )

  const contentEl = direction ? (
    <div
      className={[
        'flex',
        directionClass[direction],
        justify ? justifyClass[justify] : '',
        align ? alignClass[align] : '',
        gap ? gapClass[gap] : '',
        wrap ? 'flex-wrap' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  ) : (
    children
  )

  // ── Scroll-jack: sticky fullscreen section with captured scroll ──────────
  if (styleType === 'scroll-jack') {
    // Background elements rendered inside ScrollJackShell's bg slot
    // so they stay fixed while content translates
    const bgEl = (
      <>
        {outerLayers.map((layer, i) => (
          <div key={i} aria-hidden="true" className="section-bg-layer" style={layerStyle(layer)} />
        ))}
        {svgLayers.map((layer, i) => (
          <div
            key={`svg-${i}`}
            aria-hidden="true"
            className="section-bg-layer"
            style={{
              overflow: 'visible',
              opacity: layer.opacity ?? 1,
              mixBlendMode: layer.blendMode as CSSProperties['mixBlendMode'] | undefined,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: layer.svgTop ?? 'auto',
                right: layer.svgRight ?? 'auto',
                bottom: layer.svgBottom ?? 'auto',
                left: layer.svgLeft ?? 'auto',
                ...(layer.svgTransform ? { transform: layer.svgTransform } : {}),
              }}
              dangerouslySetInnerHTML={{ __html: layer.svgCode }}
            />
          </div>
        ))}
        {noise && noise !== 'none' && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-1 bg-[url('/assets/noise.png')] bg-size-[400px_400px] ${
              noise === 'gradient'
                ? 'mask-[linear-gradient(to_bottom,transparent_0%,black_100%)] opacity-80'
                : 'opacity-80'
            }`}
          />
        )}
      </>
    )

    return (
      <ScrollJackShell
        bgSlot={bgEl}
        extraScroll={scrollJackHeight}
        scrubDuration={scrollJackScrub}
        className={hasGradientBorder ? 'has-gradient-border' : ''}
      >
        <section
          className="section-block relative"
          style={allowOverflow ? { overflow: 'visible' } : undefined}
        >
          <div
            className={`section-container section-container--scroll-jack ${
              hasGradientBorder ? 'has-gradient-border' : ''
            } ${ptClass} ${pbClass} ${pxClass} ${className}`.trim()}
            style={Object.keys(borderCss).length ? borderCss : undefined}
          >
            {contentEl}
          </div>
        </section>
      </ScrollJackShell>
    )
  }

  return (
    <section
      className={`section-block ${noiseClass(noise)}`.trim()}
      style={allowOverflow ? { overflow: 'visible' } : undefined}
    >
      {/* Solid / gradient / image bg layers — z-index: 0, below noise (z=1) */}
      {outerLayers.map((layer, i) => (
        <div key={i} aria-hidden="true" className="section-bg-layer" style={layerStyle(layer)} />
      ))}
      {/* SVG bg layers — also z-index: 0, siblings of outerLayers.
          Must live here (not inside section-container) so noise (z=1) and
          the section-container border (z=1, later in DOM) always paint on top. */}
      {svgLayers.map((layer, i) => (
        <div
          key={`svg-${i}`}
          aria-hidden="true"
          className="section-bg-layer"
          style={{
            overflow: 'visible',
            opacity: layer.opacity ?? 1,
            mixBlendMode: layer.blendMode as CSSProperties['mixBlendMode'] | undefined,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: layer.svgTop ?? 'auto',
              right: layer.svgRight ?? 'auto',
              bottom: layer.svgBottom ?? 'auto',
              left: layer.svgLeft ?? 'auto',
              ...(layer.svgTransform ? { transform: layer.svgTransform } : {}),
            }}
            // SVG code comes from the CMS admin — only accessible to canManageContent staff
            dangerouslySetInnerHTML={{ __html: layer.svgCode }}
          />
        </div>
      ))}
      {/* Section content — z-index: 1, always above all bg layers and noise */}
      <div
        className={`site-shell section-container ${styleClass(styleType)}${hasGradientBorder ? ' has-gradient-border' : ''} ${ptClass} ${pbClass} ${pxClass} ${className}`.trim()}
        style={Object.keys(borderCss).length ? borderCss : undefined}
      >
        {contentEl}
      </div>
    </section>
  )
}
