'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas'
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

export type RiveMode = 'autoplay' | 'loop' | 'scroll-scrub'

export type RiveAspect = '16/9' | '4/3' | '1/1' | '9/16' | '3/4' | 'auto'

export interface RiveBlockProps {
  /** URL to the .riv file */
  riveUrl: string
  /** Optional artboard name (defaults to the file's default artboard) */
  artboard?: string
  /** Animation name to play / scrub */
  animation?: string
  /** State machine name */
  stateMachine?: string
  /**
   * Name of a 0–100 Number input in the state machine to drive with scroll.
   * When set, scroll progress is mapped to input.value (0 → 100).
   * When not set, rive.scrub(animation, progress * animDuration) is used.
   */
  scrollInput?: string
  mode?: RiveMode
  fit?: RiveFit
  alignment?: RiveAlignment
  aspect?: RiveAspect
  /**
   * Duration of the animation in seconds.
   * Only needed for the direct timeline scrub fallback (no state machine input).
   */
  animDuration?: number
  /** ScrollTrigger start string, e.g. "top 80%" */
  scrubStart?: string
  /** ScrollTrigger end string, e.g. "bottom 20%" */
  scrubEnd?: string
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
  scrollInput,
  mode = 'autoplay',
  fit = 'contain',
  alignment = 'center',
  aspect = '16/9',
  animDuration = 2,
  scrubStart = 'top 80%',
  scrubEnd = 'bottom 20%',
}: RiveBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isScrollScrub = mode === 'scroll-scrub'

  // For scroll-scrub: autoplay to ensure the animation enters the animator's
  // active list, then we pause it once loaded and take manual control.
  const { rive, RiveComponent } = useRive({
    src: riveUrl,
    artboard: artboard || undefined,
    animations: !stateMachine && animation ? [animation] : undefined,
    stateMachines: stateMachine ? [stateMachine] : undefined,
    autoplay: true,
    layout: new Layout({
      fit: FIT_MAP[fit] ?? Fit.Contain,
      alignment: ALIGN_MAP[alignment] ?? Alignment.Center,
    }),
  })

  // State machine number input (0–100) driven by scroll progress
  const smInput = useStateMachineInput(rive, stateMachine ?? '', scrollInput ?? '')
  // Keep smInput in a ref so the scroll effect never needs it as a dep
  const smInputRef = useRef(smInput)
  smInputRef.current = smInput

  // In scroll-scrub mode, pause the animation once rive is ready so it holds
  // frame 0 and waits for ScrollTrigger to advance it.
  useEffect(() => {
    if (!isScrollScrub || !rive) return
    if (animation && !stateMachine) {
      rive.pause(animation)
    }
  }, [isScrollScrub, rive, animation, stateMachine])

  // Scroll-scrub: drive animation progress via GSAP ScrollTrigger
  // Uses a proxy tween + scrub so the motion is smooth and not rigid.
  useEffect(() => {
    if (!isScrollScrub || !rive || !containerRef.current) return

    const state = { val: 0 }
    const tween = gsap.to(state, {
      val: 1,
      ease: 'none',
      paused: true,
      onUpdate() {
        const p = state.val
        if (smInputRef.current != null) {
          // State machine number input approach (Rive-recommended for scroll scrub)
          smInputRef.current.value = p * 100
        } else if (animation) {
          // Direct timeline scrub
          rive.scrub(animation, p * animDuration)
        }
      },
    })

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: scrubStart,
      end: scrubEnd,
      animation: tween,
      scrub: 1, // seconds of lag — smooth, not rigid
    })

    // Refresh after setup so positions are calculated against the final layout
    ScrollTrigger.refresh()

    return () => {
      trigger.kill()
      tween.kill()
    }
  }, [isScrollScrub, rive, animation, animDuration, scrubStart, scrubEnd])
  // smInput intentionally omitted — accessed via smInputRef to avoid trigger recreation

  const aspectStyle =
    aspect && aspect !== 'auto'
      ? { aspectRatio: aspect.replace('/', ' / ') }
      : { minHeight: '300px' }

  return (
    <div ref={containerRef} className="w-full" style={aspectStyle}>
      <RiveComponent className="w-full h-full" />
    </div>
  )
}
