'use client'

import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type RiveBgFit =
  | 'contain'
  | 'cover'
  | 'fill'
  | 'fitWidth'
  | 'fitHeight'
  | 'none'
  | 'scaleDown'

export type RiveBgAlignment =
  | 'center'
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'centerLeft'
  | 'centerRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'

export interface RiveBgScrollScrub {
  /**
   * Name of the value to drive from scroll. This is resolved against BOTH:
   *  - a data-binding (ViewModel) Number/Boolean property (Rive's "data" workflow), and
   *  - a classic state machine Number/Boolean input,
   * so it works whichever way the .riv was authored.
   */
  inputName: string
  /** Input type — number (default) or boolean (driven by threshold at 50% progress). */
  inputType?: 'number' | 'boolean'
  /** Rive input value when scroll is at scrollStart. Default 0. */
  valueMin?: number
  /** Rive input value when scroll is at scrollEnd. Default 100. */
  valueMax?: number
  /** GSAP ScrollTrigger start string, e.g. "top bottom". Default "top bottom". */
  scrollStart?: string
  /** GSAP ScrollTrigger end string, e.g. "bottom top". Default "bottom top". */
  scrollEnd?: string
  /** Scrub lag in seconds. 0 = snap. Default 0.5. */
  scrubStrength?: number
}

export interface RiveBackgroundProps {
  /** Resolved URL to the .riv file. */
  src: string
  /** Artboard name — leave undefined for the file's default artboard. */
  artboard?: string
  /** State machine to activate. */
  stateMachine?: string
  /** Rive canvas fit within the background container. Default 'cover'. */
  fit?: RiveBgFit
  /** Rive canvas alignment. Default 'center'. */
  alignment?: RiveBgAlignment
  /** Layer opacity (0–1). Default 1. */
  opacity?: number
  /** CSS mix-blend-mode. Default 'normal'. */
  blendMode?: string
  /** Scroll-driven Rive input scrub config. */
  scrub?: RiveBgScrollScrub
}

// Minimal shape of Rive's data-binding (ViewModel) instance imperative API.
interface ViewModelLike {
  number?: (path: string) => { value: number } | null
  boolean?: (path: string) => { value: boolean } | null
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

const FIT_MAP: Record<RiveBgFit, Fit> = {
  contain: Fit.Contain,
  cover: Fit.Cover,
  fill: Fit.Fill,
  fitWidth: Fit.FitWidth,
  fitHeight: Fit.FitHeight,
  none: Fit.None,
  scaleDown: Fit.ScaleDown,
}

const ALIGN_MAP: Record<RiveBgAlignment, Alignment> = {
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

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Renders a Rive animation as an absolute-fill background layer.
 * Place inside a relatively-positioned container (e.g. a section).
 *
 * Supports:
 * - Artboard and state machine selection
 * - Fit / alignment (all Rive options including scaleDown)
 * - Scroll scrub: drive any named Number or Boolean state machine input
 *   proportionally to the scroll position of the parent container.
 */
export function RiveBackground({
  src,
  artboard,
  stateMachine,
  fit = 'cover',
  alignment = 'center',
  opacity = 1,
  blendMode,
  scrub,
}: RiveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollTriggerRef = useRef<ReturnType<typeof ScrollTrigger.create> | null>(null)

  const { rive, RiveComponent } = useRive({
    src,
    artboard: artboard || undefined,
    stateMachines: stateMachine ? [stateMachine] : undefined,
    autoplay: true,
    // Bind the artboard's default ViewModel instance so scroll-scrub can drive
    // data-binding (ViewModel) properties, not only state machine inputs.
    autoBind: true,
    layout: new Layout({
      fit: FIT_MAP[fit] ?? Fit.Cover,
      alignment: ALIGN_MAP[alignment] ?? Alignment.Center,
    }),
  })

  // ── Visibility gating — pause when off-screen ───────────────────────────
  useEffect(() => {
    if (!rive || !containerRef.current) return
    const el = containerRef.current

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            rive.play(stateMachine)
          } else {
            rive.pause(stateMachine)
          }
        }
      },
      { threshold: 0.01 },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [rive, stateMachine])

  // ── Scroll scrub — drive a Rive value from scroll ───────────────────────
  // Works with data-binding (ViewModel) properties AND state machine inputs, so
  // it no longer requires a state machine to be set (data binding can stand alone).
  useEffect(() => {
    if (!rive || !scrub?.inputName || !containerRef.current) return

    // Lazily get the parent section element as the scroll trigger target.
    // Walk up from our absolute-positioned container to the framed section block.
    const section =
      containerRef.current.closest('.section-block') ??
      containerRef.current.closest('section') ??
      containerRef.current.parentElement ??
      containerRef.current

    const {
      inputName,
      inputType = 'number',
      valueMin = 0,
      valueMax = 100,
      scrollStart = 'top bottom',
      scrollEnd = 'bottom top',
      scrubStrength = 0.5,
    } = scrub

    // Proxy object for GSAP to tween
    const proxy = { progress: 0 }

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: section,
      start: scrollStart,
      end: scrollEnd,
      scrub: scrubStrength,
      onUpdate: (self) => {
        // Remap scroll progress (0–1) to the configured value range
        const rawValue = valueMin + (valueMax - valueMin) * self.progress
        const asBool = rawValue >= (valueMin + valueMax) / 2

        // 1) Data binding (ViewModel) property — Rive's modern "data" workflow.
        try {
          const vmi = (rive as unknown as { viewModelInstance?: ViewModelLike | null })
            .viewModelInstance
          if (vmi) {
            if (inputType === 'boolean') {
              const prop = vmi.boolean?.(inputName)
              if (prop) prop.value = asBool
            } else {
              const prop = vmi.number?.(inputName)
              if (prop) prop.value = rawValue
            }
          }
        } catch {
          // not data-bound or instance not ready yet — ScrollTrigger retries next tick
        }

        // 2) Classic state machine input — legacy / non-data-bound files.
        if (stateMachine) {
          try {
            const inputs = rive.stateMachineInputs(stateMachine)
            const input = inputs?.find((i) => i.name === inputName)
            if (input) input.value = inputType === 'boolean' ? asBool : rawValue
          } catch {
            // state machine not ready yet
          }
        }
      },
    })

    return () => {
      scrollTriggerRef.current?.kill()
      scrollTriggerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rive, stateMachine, scrub?.inputName])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity,
        mixBlendMode: blendMode as React.CSSProperties['mixBlendMode'] | undefined,
      }}
    >
      <RiveComponent
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
