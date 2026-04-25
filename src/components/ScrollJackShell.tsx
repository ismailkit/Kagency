'use client'

/**
 * ScrollJackShell
 *
 * When this section scrolls into view (top hits top of viewport), GSAP pins it
 * via `position: fixed` + `overflow: hidden`, capturing page scroll.
 * Internal content is driven upward via translateY as the user scrolls.
 * Once all content has been revealed, the pin releases and the page continues.
 *
 * Scroll capture distance = actual content overflow height.
 * Falls back to `extraScroll` vh if content fits in one screen.
 *
 * `scrubDuration` adds a GSAP lag (seconds) so the motion is smooth/not rigid.
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, type ReactNode } from 'react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

type Props = {
  /** Content that will be scroll-jacked */
  children: ReactNode
  /** Background elements rendered behind content (not translated) */
  bgSlot?: ReactNode
  /**
   * Fallback scroll-capture distance in vh when content fits in one screen.
   * Default 200.
   */
  extraScroll?: number
  /** GSAP scrub lag in seconds. Higher = smoother/softer. Default 1.2. */
  scrubDuration?: number
  className?: string
}

export function ScrollJackShell({
  children,
  bgSlot,
  extraScroll = 200,
  scrubDuration = 1.2,
  className = '',
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    // Pixels of content that extend beyond the viewport
    const overflowY = Math.max(0, content.scrollHeight - window.innerHeight)
    // Total scroll distance to capture: real overflow, or extraScroll as fallback
    const captureDistance = overflowY > 0 ? overflowY : (extraScroll / 100) * window.innerHeight

    const state = { val: 0 }

    const tween = gsap.to(state, {
      val: 1,
      ease: 'none',
      paused: true,
      onUpdate() {
        if (overflowY <= 0) return
        content.style.transform = `translateY(${-(state.val * overflowY)}px)`
      },
    })

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      // captureDistance is the extra scroll space GSAP will hold the pin for
      end: `+=${captureDistance}`,
      // pin: true → GSAP sets position:fixed on the section, adds a spacer div
      pin: true,
      pinSpacing: true,
      animation: tween,
      scrub: scrubDuration,
    })

    // Refresh after first paint so any late-loading children (images, Rive)
    // don't invalidate trigger positions
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh())

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      trigger.kill()
      tween.kill()
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
    }
  }, [extraScroll, scrubDuration])

  return (
    // This div is what GSAP pins. It must be exactly viewport-sized and overflow:hidden.
    <div
      ref={sectionRef}
      className={`relative w-full h-screen overflow-hidden ${className}`.trim()}
    >
      {/* Background layers: absolute, stays in place while content translates */}
      {bgSlot && (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          {bgSlot}
        </div>
      )}
      {/* Content: translateY applied here to "scroll" it upward */}
      <div ref={contentRef} className="relative z-1" style={{ willChange: 'transform' }}>
        {children}
      </div>
    </div>
  )
}
