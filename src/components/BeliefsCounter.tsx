'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { richTextToHTML } from '@/lib/richtext'
import type { RichTextContent } from '@/lib/richtext'

// ── Types ────────────────────────────────────────────────────────────────────

export interface Belief {
  number: string
  title: string
  body: RichTextContent
}

export interface BeliefsCounterProps {
  beliefs: Belief[]
}

// ── Arrow button (matches TestimonialsBlock style) ───────────────────────────

function Arrow({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous belief' : 'Next belief'}
      className="group flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-200"
      style={{ border: '2px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.5)' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = '#ed1d22'
        el.style.color = '#ed1d22'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = 'rgba(255,255,255,0.18)'
        el.style.color = 'rgba(255,255,255,0.5)'
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
        style={{ transform: direction === 'prev' ? 'rotate(180deg)' : undefined }}
      >
        <path
          d="M3 9h12M10 4l5 5-5 5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

// ── Component ────────────────────────────────────────────────────────────────

export function BeliefsCounter({ beliefs }: BeliefsCounterProps) {
  const [mounted, setMounted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const total = beliefs.length

  useEffect(() => {
    setMounted(true)
  }, [])

  const go = useCallback(
    (idx: number) => {
      setCurrent(((idx % total) + total) % total)
      setAnimKey((k) => k + 1)
    },
    [total],
  )

  const prev = useCallback(() => go(current - 1), [current, go])
  const next = useCallback(() => go(current + 1), [current, go])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next])

  // Touch / swipe
  const touchStartX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    touchStartX.current = null
  }

  if (!total) return null

  const belief = beliefs[current]
  const progressPct = ((current + 1) / total) * 100

  return (
    <div
      className="relative w-full overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress rail — top edge */}
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: 'rgba(255,255,255,0.08)' }}
        aria-hidden="true"
      >
        <div
          className="h-full transition-[width] duration-700 ease-out"
          style={{ width: `${progressPct}%`, background: '#ed1d22' }}
        />
      </div>

      {/* Ghost watermark number — right-anchored, absolutely positioned */}
      <div
        key={`ghost-${animKey}`}
        aria-hidden="true"
        className="animate-belief-ghost-in pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 font-display font-black leading-none"
        style={{
          fontSize: 'clamp(8rem, 30vw, 22rem)',
          color: '#ffd700',
          opacity: 0.07,
          lineHeight: 1,
          // Bleed slightly beyond the right edge for drama
          transform: 'translateY(-50%) translateX(8%)',
        }}
      >
        {belief.number}
      </div>

      {/* Main layout */}
      <div className="relative z-10 flex min-h-[68vh] flex-col justify-between px-6 py-20 md:px-16 lg:px-24">
        {/* Animating content region */}
        <div key={`content-${animKey}`} className="animate-belief-content-in max-w-2xl">
          {/* Counter fraction: 01 ── 04 */}
          <div className="mb-10 flex items-center gap-4">
            <span
              className="font-sans text-sm font-bold uppercase tracking-[0.2em]"
              style={{ color: '#ffd700' }}
            >
              {belief.number}
            </span>
            <span className="h-px w-14" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <span
              className="font-sans text-sm font-bold uppercase tracking-[0.2em]"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              {String(total).padStart(2, '0')}
            </span>
          </div>

          {/* Belief heading */}
          <h2
            className="font-display font-bold text-white leading-[1.05]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.75rem)' }}
          >
            {belief.title}
          </h2>

          {/* Belief body */}
          <p
            className="mt-8 max-w-xl font-sans text-base leading-relaxed md:text-lg"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            dangerouslySetInnerHTML={{ __html: mounted ? richTextToHTML(belief.body) : '' }}
          />
        </div>

        {/* Navigation bar */}
        <div className="flex items-center gap-4 pt-16">
          <Arrow direction="prev" onClick={prev} />
          <Arrow direction="next" onClick={next} />

          {/* Dot indicators */}
          <div className="ml-6 flex items-center gap-3">
            {beliefs.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to belief ${i + 1}`}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: i === current ? '2rem' : '0.5rem',
                  height: '0.5rem',
                  background: i === current ? '#ed1d22' : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>

          {/* Keyboard hint */}
          <p
            className="ml-auto hidden font-sans text-xs uppercase tracking-[0.15em] md:block"
            style={{ color: 'rgba(255,255,255,0.18)' }}
          >
            ← → navigate
          </p>
        </div>
      </div>
    </div>
  )
}
