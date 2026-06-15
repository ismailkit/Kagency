'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
import { useEffect, useRef } from 'react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type RiveFit = 'contain' | 'cover' | 'fill' | 'fitWidth' | 'fitHeight' | 'none'

export type RiveAlignment =
  | 'center'
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'centerLeft'
  | 'centerRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'

export type RiveMode = 'autoplay' | 'loop'

export type RiveAspect = '16/9' | '4/3' | '1/1' | '9/16' | '3/4' | 'auto'

/**
 * GSAP scroll-driven transform on the Rive container wrapper.
 * Desktop (lg+) and mobile values are applied independently via gsap.matchMedia.
 * Any property left undefined is not animated.
 */
export interface ScrollTransformConfig {
  enabled?: boolean
  /** ScrollTrigger start. Default: "top bottom" */
  start?: string
  /** ScrollTrigger end. Default: "top 20%" */
  end?: string
  /** Scrub lag in seconds. 0 = rigid lock to scroll. Default: 1 */
  scrub?: number
  // ── Desktop (lg+) from → to ──────────────────────────────────────────────
  xFrom?: number
  xTo?: number
  yFrom?: number
  yTo?: number
  scaleFrom?: number
  scaleTo?: number
  opacityFrom?: number
  opacityTo?: number
  // ── Mobile overrides (fallback to desktop values when omitted) ─────────────
  mobileXFrom?: number
  mobileXTo?: number
  mobileYFrom?: number
  mobileYTo?: number
  mobileScaleFrom?: number
  mobileScaleTo?: number
  mobileOpacityFrom?: number
  mobileOpacityTo?: number
}

export interface RiveBlockProps {
  /** URL to the .riv file */
  riveUrl: string
  /** Optional artboard name (defaults to the file's default artboard) */
  artboard?: string
  /** Animation name to play */
  animation?: string
  /** State machine name */
  stateMachine?: string
  mode?: RiveMode
  fit?: RiveFit
  alignment?: RiveAlignment
  aspect?: RiveAspect
  /** Scroll-driven CSS transform applied to the container wrapper */
  scrollTransform?: ScrollTransformConfig
}

// ─── Maps ────────────────────────────────────────────────────────────────────

const FIT_MAP: Record<RiveFit, Fit> = {
  contain: Fit.Contain,
  cover: Fit.Cover,
  fill: Fit.Fill,
  fitWidth: Fit.FitWidth,
  fitHeight: Fit.FitHeight,
  none: Fit.None,
}

const ALIGN_MAP: Record<RiveAlignment, Alignment> = {
  center: Alignment.Center,
  topLeft: Alignment.TopLeft,
  topCenter: Alignment.TopCenter,
  topRight: Alignment.TopRight,
  centerLeft: Alignment.CenterLeft,
  centerRight: Alignment.CenterRight,
  bottomLeft: Alignment.BottomLeft,
  bottomCenter: Alignment.BottomCenter,
  bottomRight: Alignment.BottomRight,
}

// ─── Component ───────────────────────────────────────────────────────────────

export function RiveBlock({
  riveUrl,
  artboard,
  animation,
  stateMachine,
  mode = 'autoplay',
  fit = 'contain',
  alignment = 'center',
  aspect = '16/9',
  scrollTransform,
}: RiveBlockProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Resolved play target — state machine takes priority over bare animation name
  const playTarget = stateMachine ?? animation ?? undefined

  const { rive, RiveComponent } = useRive({
    src: riveUrl,
    artboard: artboard || undefined,
    animations: !stateMachine && animation ? [animation] : undefined,
    stateMachines: stateMachine ? [stateMachine] : undefined,
    // autoplay: false — we gate playback via IntersectionObserver so off-screen
    // elements never waste CPU and re-plays are predictable.
    autoplay: false,
    layout: new Layout({
      fit: FIT_MAP[fit] ?? Fit.Contain,
      alignment: ALIGN_MAP[alignment] ?? Alignment.Center,
    }),
  })

  // Viewport gating — play when ≥10 % visible, pause/stop when hidden
  useEffect(() => {
    if (!rive || !containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            rive.play(playTarget)
          } else {
            // pause keeps current frame; stop resets — use stop for one-shot, pause for loop
            if (mode === 'loop') {
              rive.pause(playTarget)
            } else {
              rive.stop(playTarget)
            }
          }
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [rive, playTarget, mode])

  // Scroll transform — GSAP fromTo on the wrapper div.
  // Uses gsap.matchMedia conditions so desktop/mobile tweens are auto-cleaned up.
  useEffect(() => {
    if (!scrollTransform?.enabled || !wrapperRef.current) return

    const {
      start = 'top bottom',
      end = 'top 20%',
      scrub = 1,
      xFrom,
      xTo = 0,
      yFrom,
      yTo = 0,
      scaleFrom,
      scaleTo = 1,
      opacityFrom,
      opacityTo = 1,
      mobileXFrom,
      mobileXTo = 0,
      mobileYFrom,
      mobileYTo = 0,
      mobileScaleFrom,
      mobileScaleTo = 1,
      mobileOpacityFrom,
      mobileOpacityTo = 1,
    } = scrollTransform

    const el = wrapperRef.current
    const scrubVal = scrub > 0 ? scrub : true

    const mm = gsap.matchMedia()

    // Both queries share one callback — GSAP passes resolved conditions
    mm.add({ isDesktop: '(min-width: 1024px)', isMobile: '(max-width: 1023px)' }, (ctx) => {
      const { isDesktop } = ctx.conditions as { isDesktop: boolean; isMobile: boolean }

      const from: gsap.TweenVars = {}
      const to: gsap.TweenVars = {}

      if (isDesktop) {
        if (xFrom !== undefined) {
          from.x = xFrom
          to.x = xTo
        }
        if (yFrom !== undefined) {
          from.y = yFrom
          to.y = yTo
        }
        if (scaleFrom !== undefined) {
          from.scale = scaleFrom
          to.scale = scaleTo
        }
        if (opacityFrom !== undefined) {
          from.opacity = opacityFrom
          to.opacity = opacityTo
        }
      } else {
        const mxf = mobileXFrom ?? xFrom
        const myf = mobileYFrom ?? yFrom
        const msf = mobileScaleFrom ?? scaleFrom
        const mof = mobileOpacityFrom ?? opacityFrom
        if (mxf !== undefined) {
          from.x = mxf
          to.x = mobileXTo ?? xTo
        }
        if (myf !== undefined) {
          from.y = myf
          to.y = mobileYTo ?? yTo
        }
        if (msf !== undefined) {
          from.scale = msf
          to.scale = mobileScaleTo ?? scaleTo
        }
        if (mof !== undefined) {
          from.opacity = mof
          to.opacity = mobileOpacityTo ?? opacityTo
        }
      }

      if (!Object.keys(from).length) return

      gsap.fromTo(el, from, {
        ...to,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: scrubVal,
          invalidateOnRefresh: true,
        },
      })

      // Recalculate positions after layout settles
      ScrollTrigger.refresh()
    })

    return () => {
      mm.revert()
    }
    // Primitive deps so the effect only re-runs when values actually change
  }, [
    scrollTransform?.enabled,
    scrollTransform?.start,
    scrollTransform?.end,
    scrollTransform?.scrub,
    scrollTransform?.xFrom,
    scrollTransform?.xTo,
    scrollTransform?.yFrom,
    scrollTransform?.yTo,
    scrollTransform?.scaleFrom,
    scrollTransform?.scaleTo,
    scrollTransform?.opacityFrom,
    scrollTransform?.opacityTo,
    scrollTransform?.mobileXFrom,
    scrollTransform?.mobileXTo,
    scrollTransform?.mobileYFrom,
    scrollTransform?.mobileYTo,
    scrollTransform?.mobileScaleFrom,
    scrollTransform?.mobileScaleTo,
    scrollTransform?.mobileOpacityFrom,
    scrollTransform?.mobileOpacityTo,
  ])

  const aspectStyle =
    aspect && aspect !== 'auto'
      ? { aspectRatio: aspect.replace('/', ' / ') }
      : { minHeight: '300px' }

  return (
    <div ref={wrapperRef} className="w-full">
      <div ref={containerRef} className="w-full" style={aspectStyle}>
        <RiveComponent className="w-full h-full" />
      </div>
    </div>
  )
}
