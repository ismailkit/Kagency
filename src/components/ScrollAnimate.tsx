'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, type ElementType, type CSSProperties, type ReactNode } from 'react'

// Register ScrollTrigger once on the client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type AnimType =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'stagger-words'

export type AnimEasing = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring'

export interface ScrollAnimateProps {
  enabled?: boolean
  type?: AnimType
  easing?: AnimEasing
  /** Duration in milliseconds */
  duration?: number
  /** Delay in milliseconds */
  delay?: number
  /** HTML tag to render as (defaults to div) */
  as?: 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'section' | 'li'
  className?: string
  style?: CSSProperties
  children: ReactNode
}

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Map our easing names to GSAP ease strings
const EASE_MAP: Record<AnimEasing, string> = {
  ease: 'power1.inOut',
  'ease-in': 'power2.in',
  'ease-out': 'power2.out',
  'ease-in-out': 'power2.inOut',
  linear: 'none',
  spring: 'back.out(1.5)',
}

type GsapVars = { opacity?: number; x?: number; y?: number }

function buildFromVars(type: AnimType): GsapVars {
  switch (type) {
    case 'fade':
      return { opacity: 0 }
    case 'fade-up':
      return { opacity: 0, y: 32 }
    case 'fade-down':
      return { opacity: 0, y: -32 }
    case 'fade-left':
      return { opacity: 0, x: 32 }
    case 'fade-right':
      return { opacity: 0, x: -32 }
    case 'slide-up':
      return { opacity: 0, y: 90 }
    case 'slide-down':
      return { opacity: 0, y: -90 }
    case 'slide-left':
      return { opacity: 0, x: 90 }
    case 'slide-right':
      return { opacity: 0, x: -90 }
    case 'stagger-words':
      return {}
  }
}

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function ScrollAnimate({
  enabled = false,
  type = 'fade-up',
  easing = 'ease-out',
  duration = 600,
  delay = 0,
  as = 'div',
  className,
  style,
  children,
}: ScrollAnimateProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!enabled || !ref.current) return

    const el = ref.current
    const ease = EASE_MAP[easing] ?? 'power2.out'

    const ctx = gsap.context(() => {
      if (type === 'stagger-words') {
        const words = Array.from(el.querySelectorAll<HTMLElement>('[data-word]'))
        if (!words.length) return
        // Build a timeline so stagger + scrub work together
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            end: 'top 65%',
            scrub: 1,
          },
        })
        tl.from(words, { opacity: 0, y: 22, ease, stagger: 0.07 })
      } else {
        const from = buildFromVars(type)
        if (!Object.keys(from).length) return
        gsap.from(el, {
          ...from,
          ease,
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            end: 'top 65%',
            scrub: 1,
          },
        })
      }
    })

    return () => ctx.revert()
  }, [enabled, type, easing])

  const Tag = as as ElementType

  const renderContent = () => {
    // Render word spans only when animation is active so GSAP can target them
    if (enabled && type === 'stagger-words' && typeof children === 'string') {
      return children.split(' ').map((word, i) => (
        <span key={i} data-word="" style={{ display: 'inline-block', marginRight: '0.28em' }}>
          {word}
        </span>
      ))
    }
    return children
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    <Tag ref={ref as any} className={className} style={style}>
      {renderContent()}
    </Tag>
  )
}
