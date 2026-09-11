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
 *
 * Layout note: the pinned element (sectionRef) must never carry a transform.
 * The card scale lives on an inner wrapper (cardRef) instead — a transform on
 * the pinned element itself both fights GSAP's own writes during the pin and,
 * if it survives into the pinned span, renders the "fullscreen" section at 90%.
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

function ringShadow(alpha: number) {
  return alpha > 0.001 ? `inset 0 0 0 1px rgba(255,255,255,${alpha.toFixed(3)})` : 'none'
}

export function ScrollJackShell({
  children,
  bgSlot,
  overlaySlot,
  extraScroll = 200,
  scrubDuration = 1.2,
  className = '',
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const card = cardRef.current
    const content = contentRef.current
    if (!section || !card || !content) return

    // ── Phase 1: card → fullscreen ────────────────────────────────────────
    // Set through GSAP, not raw style writes: GSAP caches an element's transform
    // state, and writing transformOrigin behind its back desyncs that cache.
    gsap.set(card, {
      scale: CARD_SCALE,
      borderRadius: CARD_RADIUS,
      transformOrigin: 'center top',
    })
    card.style.boxShadow = ringShadow(CARD_RING)

    // The ring alpha rides along with the tween's progress. onRefresh matters
    // most: it is the callback that fires when the page is loaded already
    // scrolled into the section, where scroll-crossing callbacks never run.
    const setRing = (progress: number) => {
      card.style.boxShadow = ringShadow(CARD_RING * (1 - progress))
    }

    // A real scrubbed tween rather than hand-rolled onUpdate/onLeave callbacks:
    // GSAP renders a scrubbed tween at the correct progress for ANY scroll
    // position, including a page loaded already scrolled past the end. The old
    // callback-driven state stayed stuck at the initial card scale in that case,
    // which is what left the "fullscreen" pinned section rendering at 90%.
    const cardTween = gsap.fromTo(
      card,
      { scale: CARD_SCALE, borderRadius: CARD_RADIUS },
      {
        scale: 1,
        borderRadius: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 90%',
          end: 'top top',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => setRing(self.progress),
          onToggle: (self) => setRing(self.progress),
          onRefresh: (self) => setRing(self.progress),
        },
      },
    )

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
      cardTween.scrollTrigger?.kill()
      cardTween.kill()
      pinTrigger.kill()
      tween.kill()
      fadeTween.kill()
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      gsap.set(card, { clearProps: 'transform,transformOrigin,borderRadius' })
      card.style.boxShadow = ''
    }
  }, [extraScroll, scrubDuration])

  return (
    // This div is what GSAP pins. Must be exactly viewport-sized, and must stay
    // transform-free so the pin measures and renders at the full viewport.
    <div
      ref={sectionRef}
      className={`relative w-full h-screen overflow-hidden ${className}`.trim()}
    >
      {/* Card wrapper: carries the entrance scale / radius / ring. */}
      <div ref={cardRef} className="absolute inset-0 overflow-hidden">
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
    </div>
  )
}
