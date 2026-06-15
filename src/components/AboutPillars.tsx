'use client'

/**
 * AboutPillars — interactive accordion for the About page.
 *
 * Three full-width row buttons. Click to expand body copy below.
 * GSAP handles the height/opacity animation — no CSS transitions on layout props.
 * No border-left stripe. Full horizontal rules between rows only.
 */

import gsap from 'gsap'
import { useRef, useState } from 'react'

import { richTextToHTML } from '@/lib/richtext'
import type { RichTextContent } from '@/lib/richtext'

export interface Pillar {
  label: string
  descriptor: string
  body: RichTextContent
}

export interface AboutPillarsProps {
  pillars: Pillar[]
}

export function AboutPillars({ pillars }: AboutPillarsProps) {
  const [active, setActive] = useState<number | null>(null)
  const bodyRefs = useRef<HTMLDivElement[]>([])

  function toggle(index: number) {
    const wasOpen = active === index
    const prevOpen = active

    // Collapse currently open row
    if (prevOpen !== null) {
      const el = bodyRefs.current[prevOpen]
      if (el)
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.26,
          ease: 'power2.inOut',
          overwrite: true,
        })
    }

    if (wasOpen) {
      setActive(null)
      return
    }

    // Expand new row
    setActive(index)
    const el = bodyRefs.current[index]
    if (el) {
      gsap.set(el, { height: 'auto', opacity: 1 })
      gsap.from(el, { height: 0, opacity: 0, duration: 0.42, ease: 'power2.out', overwrite: true })
    }
  }

  return (
    <div className="w-full" role="list">
      {pillars.map((pillar, i) => {
        const isActive = active === i
        return (
          <div
            key={pillar.label}
            role="listitem"
            style={{ borderTop: i > 0 ? '1px solid rgba(244,244,240,0.07)' : 'none' }}
          >
            <button
              type="button"
              className="w-full text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
              onClick={() => toggle(i)}
              aria-expanded={isActive}
            >
              <div
                className="flex items-center justify-between gap-4"
                style={{
                  paddingTop: 'clamp(1rem, 2.25vw, 1.75rem)',
                  paddingBottom: 'clamp(1rem, 2.25vw, 1.75rem)',
                  paddingLeft: 'clamp(1.5rem, 7vw, 5.5rem)',
                  paddingRight: 'clamp(1.5rem, 7vw, 5.5rem)',
                }}
              >
                {/* Label */}
                <span
                  className="font-display font-bold uppercase"
                  style={{
                    fontSize: 'clamp(2rem, 4.5vw, 4.25rem)',
                    lineHeight: 0.95,
                    letterSpacing: '-0.01em',
                    color: isActive ? '#ed1d22' : '#f4f4f0',
                    transition: 'color 0.25s ease',
                  }}
                >
                  {pillar.label}
                </span>

                {/* Right: descriptor + toggle */}
                <div className="flex items-center gap-5 shrink-0">
                  <span
                    className="hidden sm:block font-sans uppercase"
                    style={{
                      fontSize: '0.6rem',
                      letterSpacing: '0.24em',
                      color: '#d4d4d4',
                      opacity: isActive ? 0 : 0.45,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    {pillar.descriptor}
                  </span>

                  {/* + / × icon — CSS transition only on transform and color, no layout property */}
                  <span
                    className="font-display font-bold select-none"
                    style={{
                      fontSize: '1.5rem',
                      lineHeight: 1,
                      display: 'inline-block',
                      color: isActive ? '#ed1d22' : 'rgba(212,212,212,0.5)',
                      transform: isActive ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'color 0.25s ease, transform 0.3s ease',
                    }}
                  >
                    +
                  </span>
                </div>
              </div>
            </button>

            {/* Expandable body — GSAP height animation, overflow hidden */}
            <div
              ref={(el) => {
                if (el) bodyRefs.current[i] = el
              }}
              style={{ height: 0, overflow: 'hidden', opacity: 0 }}
              aria-hidden={!isActive}
            >
              <p
                className="font-sans leading-relaxed"
                style={{
                  fontSize: 'clamp(0.95rem, 1.15vw, 1.05rem)',
                  lineHeight: 1.65,
                  color: 'rgba(212,212,212,0.75)',
                  maxWidth: '62ch',
                  paddingLeft: 'clamp(1.5rem, 7vw, 5.5rem)',
                  paddingRight: 'clamp(1.5rem, 7vw, 5.5rem)',
                  paddingBottom: 'clamp(1.25rem, 2.5vw, 2rem)',
                }}
                dangerouslySetInnerHTML={{ __html: richTextToHTML(pillar.body) }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
