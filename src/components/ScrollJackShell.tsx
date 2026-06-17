'use client'

/**
 * ScrollJackShell
 *
 * Phase 1 — card entrance: as the section scrolls into view it appears as a
 * scaled-down rounded card (center-section style). It morphs to fullscreen by
 * the time its top edge hits the viewport top.
 *
 * Phase 2 — scroll-jack: once fullscreen, GSAP pins it and captures scroll.
 * Internal content is driven upward via translateY. On release the page continues.
 *
 * `scrubDuration` adds GSAP lag so motion is smooth rather than rigid.
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
  /** Overlay elements rendered above content (not translated, clicks pass through) */
  overlaySlot?: ReactNode
  /**
   * Fallback scroll-capture distance in vh when content fits in one screen.
   * Default 200.
   */
  extraScroll?: number
  /** GSAP scrub lag in seconds. Higher = smoother/softer. Default 1.2. */
  scrubDuration?: number
  className?: string
}

// Card appearance constants
const CARD_SCALE = 0.9 // 90% size — 5% gap each side
const CARD_RADIUS = 14 // px border-radius on the card
const CARD_RING = 0.12 // rgba alpha for inset ring border

export function ScrollJackShell({
  children,
  bgSlot,
  overlaySlot,
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

    // ── Phase 1: card → fullscreen ────────────────────────────────────────
    // The section is always h-screen in layout; transform:scale makes it look
    // like an inset card without affecting the scroll positions GSAP measures.
    section.style.transform = `scale(${CARD_SCALE})`
    section.style.borderRadius = `${CARD_RADIUS}px`
    section.style.transformOrigin = 'center top'
    section.style.boxShadow = `inset 0 0 0 1px rgba(255,255,255,${CARD_RING})`

    const expandTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 90%',
      end: 'top top',
      scrub: true,
      onUpdate(self) {
        const p = self.progress
        const scale = CARD_SCALE + (1 - CARD_SCALE) * p
        const radius = CARD_RADIUS * (1 - p)
        const alpha = (CARD_RING * (1 - p)).toFixed(3)
        section.style.transform = `scale(${scale})`
        section.style.borderRadius = `${radius}px`
        section.style.boxShadow = `inset 0 0 0 1px rgba(255,255,255,${alpha})`
      },
      onLeave() {
        // Fully expanded — clear all card styles so nothing overrides the pin
        section.style.transform = ''
        section.style.borderRadius = ''
        section.style.boxShadow = ''
        section.style.transformOrigin = ''
      },
      onEnterBack() {
        // Restore transform-origin when scrolling back up into the expand zone
        section.style.transformOrigin = 'center top'
      },
    })

    // ── Phase 2: pin + scroll-jack ────────────────────────────────────────
    const overflowY = Math.max(0, content.scrollHeight - window.innerHeight)
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

    const fadeState = { opacity: 0 }
    const fadeTween = gsap.to(fadeState, {
      opacity: 1,
      ease: 'power2.out',
      paused: true,
      onUpdate() {
        content.style.opacity = String(fadeState.opacity)
      },
    })

    // Hold opacity at 0 until ScrollTrigger takes control
    content.style.opacity = '0'

    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${captureDistance}`,
      pin: true,
      pinSpacing: true,
      scrub: scrubDuration,
      onUpdate(self) {
        tween.progress(self.progress)
        // Fade in over the first 40% of scroll, stay opaque after
        fadeTween.progress(Math.min(self.progress / 0.4, 1))
      },
    })

    // Refresh after first paint so late-loading children don't skew positions
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh())

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      expandTrigger.kill()
      pinTrigger.kill()
      tween.kill()
      fadeTween.kill()
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
    }
  }, [extraScroll, scrubDuration])

  return (
    // This div is what GSAP pins. Must be exactly viewport-sized + overflow:hidden.
    // During Phase 1 transform:scale makes it appear as a floating card.
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
      {/* Overlay layers: above content, stay in place while content translates */}
      {overlaySlot && (
        <div className="pointer-events-none absolute inset-0 z-2" aria-hidden="true">
          {overlaySlot}
        </div>
      )}
    </div>
  )
}
