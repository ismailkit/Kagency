'use client'

/**
 * ScrollBeliefs — GSAP scroll-pinned belief cycling.
 *
 * Root cause of previous bugs:
 * 1. Never use containerStyle='scroll-jack' on the parent section — that creates a second
 *    competing GSAP pin. Use containerStyle='normal' in the seed.
 * 2. Ghost div had both -translate-y-1/2 Tailwind class AND inline transform: these fight
 *    in Tailwind v4. Fixed: inline style only.
 * 3. Dots were React-state rendered and never updated. Fixed: dotRefs + GSAP onUpdate.
 * 4. CSS transitions fighting scrub. Fixed: GSAP .to() for panel cross-fades.
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

import { richTextToHTML } from '@/lib/richtext'
import type { RichTextContent } from '@/lib/richtext'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export interface Belief {
  number: string
  eyebrow?: string
  title: string
  body: RichTextContent
}

export type TitleSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type BodySize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const titleSizeClass: Record<TitleSize, string> = {
  sm: 'text-xl md:text-2xl lg:text-3xl',
  md: 'text-2xl md:text-3xl lg:text-4xl',
  lg: 'text-3xl md:text-4xl lg:text-5xl',
  xl: 'text-4xl md:text-5xl lg:text-6xl',
  '2xl': 'text-5xl md:text-6xl lg:text-7xl',
  '3xl': 'text-6xl md:text-7xl lg:text-8xl',
}

const bodySizeClass: Record<BodySize, string> = {
  sm: 'text-sm',
  md: 'text-base md:text-lg',
  lg: 'text-lg md:text-xl lg:text-2xl',
  xl: 'text-xl md:text-2xl lg:text-3xl',
  '2xl': 'text-2xl md:text-3xl lg:text-4xl',
}

export interface ScrollBeliefsProps {
  beliefs: Belief[]
  /** Scroll distance captured per belief in vh. Default 130. */
  vhPerBelief?: number
  /** GSAP scrub smoothness in seconds. Default 0.7. */
  scrub?: number
  /** Optional SVG markup rendered as decorative background on the right side. */
  backgroundSvg?: string
  /** Title font size. Default xl. */
  titleSize?: TitleSize | null
  /** Body font size. Default md. */
  bodySize?: BodySize | null
}

const CARD_SCALE = 0.92
const CARD_RADIUS = 12

export function ScrollBeliefs({
  beliefs,
  vhPerBelief = 130,
  scrub = 0.7,
  backgroundSvg,
  titleSize,
  bodySize,
}: ScrollBeliefsProps) {
  const resolvedTitleSize = titleSizeClass[titleSize ?? 'xl']
  const resolvedBodySize = bodySizeClass[bodySize ?? 'md']
  const total = beliefs.length
  const sectionRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement[]>([])
  const dotRefs = useRef<HTMLDivElement[]>([])
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const progressEl = progressRef.current
    const panels = panelsRef.current.slice(0, total)
    const dots = dotRefs.current.slice(0, total)
    if (!section || !progressEl || panels.length === 0) return

    // ── Phase 1: card entrance morph ─────────────────────────────────────
    // Scales up from card to fullscreen as section scrolls into the viewport.
    gsap.set(section, {
      scale: CARD_SCALE,
      borderRadius: CARD_RADIUS,
      transformOrigin: 'center top',
    })

    const expandTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 88%',
      end: 'top top',
      scrub: true,
      onUpdate(self) {
        const p = self.progress
        gsap.set(section, {
          scale: CARD_SCALE + (1 - CARD_SCALE) * p,
          borderRadius: CARD_RADIUS * (1 - p),
        })
      },
      onLeave() {
        gsap.set(section, { scale: 1, borderRadius: 0 })
      },
      onEnterBack() {
        gsap.set(section, { transformOrigin: 'center top' })
      },
    })

    // ── Phase 2: pin + belief cycling ────────────────────────────────────
    // Initialise all panels: first visible, rest hidden below.
    panels.forEach((p, i) => {
      gsap.set(p, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 28 })
    })

    // Initialise dots
    const setDot = (index: number) => {
      dots.forEach((dot, i) => {
        if (!dot) return
        dot.style.height = i === index ? '1.5rem' : '0.3125rem'
        dot.style.background = i === index ? '#ed1d22' : 'rgba(255,255,255,0.18)'
      })
    }
    setDot(0)

    const captureDistance = (vhPerBelief / 100) * window.innerHeight * total
    let lastIndex = 0

    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${captureDistance}`,
      pin: true,
      pinSpacing: true,
      scrub,
      onUpdate(self) {
        const rawIdx = self.progress * total
        const index = Math.min(Math.floor(rawIdx), total - 1)

        // Progress rail
        progressEl.style.width = `${self.progress * 100}%`

        // Panel cross-fade — only fire on belief change
        if (index !== lastIndex) {
          const leaving = panels[lastIndex]
          const entering = panels[index]
          if (leaving) {
            gsap.to(leaving, {
              opacity: 0,
              y: -20,
              duration: 0.36,
              ease: 'power2.out',
              overwrite: true,
            })
          }
          if (entering) {
            gsap.set(entering, { y: 26 })
            gsap.to(entering, {
              opacity: 1,
              y: 0,
              duration: 0.44,
              ease: 'power2.out',
              overwrite: true,
            })
          }
          setDot(index)
          lastIndex = index
        }
      },
    })

    requestAnimationFrame(() => ScrollTrigger.refresh())
    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      expandTrigger.kill()
      pinTrigger.kill()
      window.removeEventListener('resize', onResize)
    }
  }, [beliefs, vhPerBelief, scrub, total])

  if (!total) return null

  return (
    <div
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ background: '#242424' }}
    >
      {/* Progress rail */}
      <div
        className="absolute inset-x-0 top-0 z-20 h-0.5"
        style={{ background: 'rgba(255,255,255,0.05)' }}
        aria-hidden="true"
      >
        <div ref={progressRef} className="h-full" style={{ width: '0%', background: '#ed1d22' }} />
      </div>

      {/* Optional SVG background — right side decorative element */}
      {backgroundSvg && (
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute"
          style={{
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0.07,
            width: 'clamp(18rem, 40vw, 36rem)',
          }}
          dangerouslySetInnerHTML={{ __html: backgroundSvg }}
        />
      )}

      {/* Thin vertical rule — left of content, geometric anchor */}
      <div
        className="absolute left-0 top-0 bottom-0 z-10 w-px"
        style={{ background: 'rgba(255,255,255,0.06)', left: 'clamp(1.5rem, 7vw, 5.5rem)' }}
        aria-hidden="true"
      />

      {/* Scroll hint — bottom center */}
      <div
        className="absolute z-20 flex flex-col items-center gap-2"
        style={{
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.15)',
        }}
        aria-hidden="true"
      >
        <span
          className="font-sans uppercase"
          style={{ fontSize: '0.6rem', letterSpacing: '0.28em' }}
        >
          scroll
        </span>
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
          <path
            d="M6 0v12M1 7l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Belief panels */}
      <div className="absolute inset-0 top-1/3 z-10" aria-live="polite">
        {beliefs.map((belief, i) => (
          <div
            key={belief.title || belief.number || i}
            ref={(el) => {
              if (el) panelsRef.current[i] = el
            }}
            className="absolute max-w-xl"
            aria-hidden={i !== 0}
            style={{
              left: 'clamp(2.5rem, 9vw, 7rem)',
              opacity: i === 0 ? 1 : 0,
            }}
          >
            {/* Eyebrow — shown if eyebrow field is set, falls back to number if non-empty */}
            {(belief.eyebrow?.trim() || (belief.number && belief.number.trim())) && (
              <p
                className="font-sans font-bold uppercase"
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.3em',
                  color: '#ed1d22',
                  marginBottom: '0.5rem',
                }}
              >
                {belief.eyebrow?.trim() || belief.number}
              </p>
            )}

            {/* Title */}
            <h2
              className={`font-display font-bold text-white uppercase ${resolvedTitleSize}`}
              style={{ lineHeight: 1.06 }}
            >
              {belief.title}
            </h2>

            {/* Thin rule below title */}
            <div
              className="my-5"
              style={{ width: '2.5rem', height: '1px', background: 'rgba(255,255,255,0.15)' }}
            />

            {/* Body */}
            <p
              className={`font-sans leading-relaxed ${resolvedBodySize}`}
              style={{ color: 'rgba(255,255,255,0.42)', maxWidth: '44ch' }}
              dangerouslySetInnerHTML={{ __html: richTextToHTML(belief.body) }}
            />
          </div>
        ))}
      </div>

      {/* Dot indicator — right edge */}
      <div
        className="absolute z-20 flex flex-col items-center gap-2"
        style={{ right: 'clamp(1.5rem, 4vw, 3rem)', top: '50%', transform: 'translateY(-50%)' }}
        aria-hidden="true"
      >
        {beliefs.map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) dotRefs.current[i] = el
            }}
            className="rounded-full"
            style={{
              width: '0.3125rem',
              height: i === 0 ? '1.5rem' : '0.3125rem',
              background: i === 0 ? '#ed1d22' : 'rgba(255,255,255,0.18)',
              transition: 'height 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
