'use client'

/**
 * ServicesShowcase — GSAP scroll-pinned service cycling with CRT monitor visual.
 *
 * Layout: left panel shows service headline + body; right panel is an SVG CRT
 * monitor whose yellow screen displays the bullet list in monospace type.
 * On scroll index change the monitor screen flickers (GSAP opacity burst) then
 * the new bullet list appears; the left panel slides out/in simultaneously.
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

import { richTextToHTML } from '@/lib/richtext'
import type { RichTextContent } from '@/lib/richtext'
import { pxClass } from '@/lib/spacing'
import type { PaddingXSize } from '@/lib/spacing'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export interface ServiceItem {
  eyebrow?: string
  headline: string
  body: RichTextContent
  bullets: Array<{ item: string }>
}

export interface ServicesShowcaseProps {
  services: ServiceItem[]
  /** Scroll distance captured per service in vh. Default 150. */
  vhPerService?: number
  /** GSAP scrub smoothness in seconds. Default 0.6. */
  scrub?: number
  paddingX?: PaddingXSize
}

const CARD_SCALE = 0.93
const CARD_RADIUS = 14

export function ServicesShowcase({
  services,
  vhPerService = 150,
  scrub = 0.6,
  paddingX = 'xl',
}: ServicesShowcaseProps) {
  const total = services.length
  const sectionRef = useRef<HTMLDivElement>(null)
  const leftPanelsRef = useRef<HTMLDivElement[]>([])
  const screenPanelsRef = useRef<HTMLDivElement[]>([])
  const progressRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const progressEl = progressRef.current
    const screen = screenRef.current
    const leftPanels = leftPanelsRef.current.slice(0, total)
    const screenPanels = screenPanelsRef.current.slice(0, total)
    if (!section || !progressEl || !screen || leftPanels.length === 0) return

    // ── Phase 1: card entrance morph ────────────────────────────────────
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

    // ── Phase 2: pin + service cycling ──────────────────────────────────
    leftPanels.forEach((p, i) => {
      gsap.set(p, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 32 })
    })
    screenPanels.forEach((p, i) => {
      gsap.set(p, { opacity: i === 0 ? 1 : 0 })
    })

    const captureDistance = (vhPerService / 100) * window.innerHeight * total
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

        if (index !== lastIndex) {
          // Left panel transition
          const leaving = leftPanels[lastIndex]
          const entering = leftPanels[index]

          if (leaving) {
            gsap.to(leaving, {
              opacity: 0,
              y: -28,
              duration: 0.3,
              ease: 'power2.out',
              overwrite: true,
            })
          }
          if (entering) {
            gsap.set(entering, { y: 32 })
            gsap.to(entering, {
              opacity: 1,
              y: 0,
              duration: 0.42,
              ease: 'power2.out',
              overwrite: true,
            })
          }

          // Screen flicker → content swap
          const leavingScreen = screenPanels[lastIndex]
          const enteringScreen = screenPanels[index]

          gsap
            .timeline()
            .to(screen, { opacity: 0.04, duration: 0.05 })
            .to(screen, { opacity: 0.75, duration: 0.04 })
            .to(screen, { opacity: 0.06, duration: 0.04 })
            .call(() => {
              if (leavingScreen) gsap.set(leavingScreen, { opacity: 0 })
              if (enteringScreen) gsap.set(enteringScreen, { opacity: 1 })
            })
            .to(screen, { opacity: 1, duration: 0.09 })

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
  }, [services, vhPerService, scrub, total])

  if (!total) return null

  return (
    <div
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ background: 'var(--kred-500)' }}
    >
      {/* Progress rail */}
      <div
        className="absolute inset-x-0 top-0 z-20 h-px"
        style={{ background: 'rgba(255,255,255,0)' }}
        aria-hidden="true"
      >
        <div ref={progressRef} className="h-full" style={{ width: '0%', background: 'gold' }} />
      </div>

      {/* Main layout */}
      <div
        className={`relative z-10 flex flex-col lg:flex-row w-full h-full items-center ${pxClass[paddingX]} pt-6 pb-4 lg:pt-0 lg:pb-0 gap-6 lg:gap-16`}
      >
        {/* ── Left: text panels ── */}
        <div className="relative h-[38%] lg:h-auto flex-1 lg:max-w-[45%] self-stretch">
          {services.map((svc, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) leftPanelsRef.current[i] = el
              }}
              className="absolute md:top-0 inset-0 flex flex-col justify-center"
              aria-hidden={i !== 0}
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {/* Eyebrow */}
              {svc.eyebrow && (
                <p
                  className="font-sans font-bold uppercase mb-5"
                  style={{
                    fontSize: '1rem',
                    letterSpacing: '0.3em',
                    color: 'gold',
                  }}
                >
                  {svc.eyebrow}
                </p>
              )}

              {/* Headline */}
              <h2
                className="font-display font-black text-white uppercase leading-none"
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 8.5rem)',
                  letterSpacing: '-0.02em',
                }}
              >
                {svc.headline}
              </h2>

              {/* Rule */}
              <div
                className="my-6"
                style={{ width: '2.5rem', height: '1px', background: 'rgba(255,255,255,0.12)' }}
              />

              {/* Body */}
              <div
                className="font-sans text-white text-xl leading-relaxed richtext"
                style={{ maxWidth: '44ch' }}
                dangerouslySetInnerHTML={{ __html: richTextToHTML(svc.body) }}
              />
            </div>
          ))}
        </div>

        {/* ── Right: line-art monitor ── */}
        <div className="h-[55%] w-full md:w-auto lg:h-auto shrink-0 flex-1 flex items-center justify-center">
          <div className="relative w-full" style={{ maxWidth: 'clamp(320px,52vw,720px)' }}>
            {/*
              ViewBox 600 × 580.
              Screen rect: x=52 y=44 w=496 h=320
              Percentages: left=52/600=8.67%  top=44/580=7.59%
                           w=496/600=82.67%   h=320/580=55.17%
            */}
            <svg
              viewBox="0 0 600 580"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
              aria-hidden="true"
            >
              {/* ── Bezel outer ── */}
              <rect
                x="8"
                y="8"
                width="584"
                height="430"
                rx="10"
                stroke="white"
                strokeWidth="3"
                fill="none"
              />

              {/* ── Screen border ── */}
              <rect
                x="52"
                y="44"
                width="496"
                height="320"
                rx="2"
                stroke="white"
                strokeWidth="3"
                fill="#FACC15"
              />

              {/* ── Scanlines on screen ── */}
              {Array.from({ length: 53 }, (_, n) => (
                <line
                  key={n}
                  x1="52"
                  y1={50 + n * 6}
                  x2="548"
                  y2={50 + n * 6}
                  stroke="black"
                  strokeWidth="3"
                  strokeOpacity="0.06"
                />
              ))}

              {/* ── Corner tick marks ── */}
              {/* top-left */}
              <line x1="52" y1="57" x2="52" y2="44" stroke="white" strokeWidth="3" />
              <line x1="52" y1="44" x2="70" y2="44" stroke="white" strokeWidth="3" />
              {/* top-right */}
              <line x1="548" y1="44" x2="548" y2="57" stroke="white" strokeWidth="3" />
              <line x1="548" y1="44" x2="530" y2="44" stroke="white" strokeWidth="3" />
              {/* bottom-left */}
              <line x1="52" y1="352" x2="52" y2="364" stroke="white" strokeWidth="3" />
              <line x1="52" y1="364" x2="70" y2="364" stroke="white" strokeWidth="3" />
              {/* bottom-right */}
              <line x1="548" y1="364" x2="548" y2="352" stroke="white" strokeWidth="3" />
              <line x1="548" y1="364" x2="530" y2="364" stroke="white" strokeWidth="3" />

              {/* ── Chin rule ── */}
              <line x1="8" y1="408" x2="592" y2="408" stroke="white" strokeWidth="3" />

              {/* ── Power LED (circle outline) ── */}
              <circle cx="300" cy="422" r="4" stroke="white" strokeWidth="3" fill="none" />

              {/* ── Brand label ── */}
              <text
                x="300"
                y="444"
                textAnchor="middle"
                fill="white"
                fillOpacity="0.35"
                fontFamily="ui-monospace, monospace"
                fontSize="7"
                letterSpacing="5"
              >
                KAGENCY
              </text>

              {/* ── Stand neck ── */}
              <line x1="272" y1="438" x2="266" y2="510" stroke="white" strokeWidth="3" />
              <line x1="328" y1="438" x2="334" y2="510" stroke="white" strokeWidth="3" />

              {/* ── Stand base ── */}
              <line x1="190" y1="510" x2="410" y2="510" stroke="white" strokeWidth="3" />
              <line x1="190" y1="510" x2="178" y2="524" stroke="white" strokeWidth="3" />
              <line x1="410" y1="510" x2="422" y2="524" stroke="white" strokeWidth="3" />

              {/* ── Vent lines ── */}
              {[0, 1, 2, 3].map((n) => (
                <line
                  key={n}
                  x1={510}
                  y1={378 + n * 8}
                  x2={550}
                  y2={378 + n * 8}
                  stroke="white"
                  strokeWidth="3"
                  strokeOpacity="0.35"
                />
              ))}
            </svg>

            {/* Screen text overlay — aligned to screen rect */}
            {/* top=44/580=7.59%  left=52/600=8.67%  w=496/600=82.67%  h=320/580=55.17% */}
            <div
              ref={screenRef}
              className="absolute overflow-hidden"
              style={{
                top: '7.59%',
                left: '8.67%',
                width: '82.67%',
                height: '55.17%',
                background: 'transparent',
              }}
            >
              {services.map((svc, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    if (el) screenPanelsRef.current[i] = el
                  }}
                  className="absolute inset-0 flex flex-col justify-center"
                  style={{
                    opacity: i === 0 ? 1 : 0,
                    padding: 'clamp(0.75rem, 3%, 1.5rem) clamp(1rem, 4%, 2rem)',
                  }}
                >
                  <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
                    {(svc.bullets ?? []).map((b, j) => (
                      <li
                        key={j}
                        className="font-pixel text-xl flex items-baseline font-bold gap-2"
                        style={{
                          lineHeight: 1.4,
                          color: '#1a1a00',
                        }}
                      >
                        <span
                          className="shrink-0"
                          style={{ marginTop: '0.05em', fontSize: '0.7em' }}
                        >
                          ▶
                        </span>
                        {b.item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Service counter — bottom left */}
      <div
        className="absolute bottom-8 z-20 font-mono text-xs"
        style={{
          left: 'clamp(2.5rem, 8vw, 7rem)',
          color: 'rgba(255,255,255,0.18)',
          letterSpacing: '0.2em',
        }}
        aria-hidden="true"
      >
        {services.map((_, i) => (
          <span key={i} className="mr-3">
            {String(i + 1).padStart(2, '0')}
          </span>
        ))}
      </div>

      {/* Scroll hint — bottom center */}
      <div
        className="absolute z-20 flex flex-col items-center gap-2 bottom-8"
        style={{
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
    </div>
  )
}
