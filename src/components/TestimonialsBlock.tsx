'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import { pxClass } from '@/lib/spacing'

import { mediaURL } from '@/lib/cms'
import type { CMSTestimonial } from '@/lib/cms'
import { richTextToHTML } from '@/lib/richtext'
import type { RichTextContent } from '@/lib/richtext'

// ── Sizing helpers ──────────────────────────────────────────────────────────

// ── Arrow button ────────────────────────────────────────────────────────────
function ArrowButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous testimonial' : 'Next testimonial'}
      className="group cursor-pointer flex h-13 w-13 shrink-0 items-center justify-center text-kred-500 rounded-full transition-colors"
      style={{ border: '3px solid currentColor' }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: direction === 'prev' ? 'rotate(180deg)' : undefined }}
      >
        <path
          d="M3 9h12M10 4l5 5-5 5"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

// ── Props ───────────────────────────────────────────────────────────────────
export interface TestimonialsBlockProps {
  testimonials: CMSTestimonial[]
  title?: string
  subtitle?: RichTextContent
  paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

// ── Component ───────────────────────────────────────────────────────────────
export function TestimonialsBlock({
  testimonials,
  title,
  subtitle,
  paddingX = 'md',
}: TestimonialsBlockProps) {
  const [current, setCurrent] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const total = testimonials.length

  // Prevent height flicker on variable-length slides
  const contentRef = useRef<HTMLDivElement>(null)
  const maxHeightRef = useRef(0)
  const [minHeight, setMinHeight] = useState(0)

  const go = useCallback(
    (dir: 1 | -1) => {
      setCurrent((c) => (c + dir + total) % total)
      setAnimKey((k) => k + 1)
    },
    [total],
  )

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [go])

  // Measure content height after each slide change, lock to max seen
  useEffect(() => {
    if (!contentRef.current) return
    const h = contentRef.current.getBoundingClientRect().height
    if (h > maxHeightRef.current) {
      maxHeightRef.current = h
      setMinHeight(h)
    }
  }, [animKey])

  // Touch/swipe
  const touchStartX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    touchStartX.current = null
  }

  if (!total) return null

  const t = testimonials[current]
  const avatarSrc = mediaURL(t.avatar) ?? null
  const progressPct = ((current + 1) / total) * 100

  return (
    <div className={`w-full ${pxClass[paddingX] ?? ''}`}>
      <div className="mx-auto max-w-4xl py-16">
        {/* Section heading */}
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="font-display text-3xl uppercase tracking-widest md:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="mt-3 font-sans text-lg opacity-70"
                dangerouslySetInnerHTML={{ __html: richTextToHTML(subtitle) }}
              />
            )}
          </div>
        )}

        {/* Card: arrows flanking the content, vertically centred */}
        <div
          className="flex items-center justify-center gap-8 md:gap-14"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Left arrow */}
          {total > 1 && <ArrowButton direction="prev" onClick={() => go(-1)} />}

          {/* Quote content — fixed width so centering is stable */}
          <div className="w-full max-w-4xl md:px-16">
            {/* Quote mark — static, does not re-animate on slide change */}
            <div className="mb-4 flex justify-start">
              <svg
                width="32"
                height="24"
                viewBox="0 0 64 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="text-kred-500"
              >
                <path
                  d="M0 48V29.143C0 20.571 2.286 13.524 6.857 8C11.619 2.476 18.286 0 27.048 0l2.857 4.571C24.19 5.524 20.381 7.619 17.524 11.048 14.857 14.286 13.333 18.095 13.143 22.476H24V48H0ZM40 48V29.143C40 20.571 42.286 13.524 46.857 8 51.619 2.476 58.286 0 67.048 0l2.857 4.571C64.19 5.524 60.381 7.619 57.524 11.048 54.857 14.286 53.333 18.095 53.143 22.476H64V48H40Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Animated region — only quote text + author slide-fade on change */}
            <div
              key={animKey}
              ref={contentRef}
              className="animate-testimonial-in"
              style={minHeight ? { minHeight } : undefined}
            >
              {/* Quote text — sans, paragraph size */}
              <blockquote className="font-sans text-base leading-relaxed md:text-lg">
                {t.quote}
              </blockquote>

              {/* Author row */}
              <div className="mt-6 flex items-center gap-3">
                {avatarSrc && (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-current/30">
                    <Image
                      src={avatarSrc}
                      alt={t.author}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                )}
                <div>
                  {/* Name — handwritten, kred */}
                  <p className="text-4xl font-medium leading-tight font-handwritten text-kred-500">
                    {t.author}
                  </p>
                  {(t.role || t.company) && (
                    <p className="mt-2 font-sans font-bold text-xs uppercase tracking-widest opacity-50">
                      {[t.role, t.company].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right arrow */}
          {total > 1 && <ArrowButton direction="next" onClick={() => go(1)} />}
        </div>

        {/* Counter + progress — below slide row, aligned to content left via matching spacers */}
        {total > 1 && (
          <div className="flex justify-center gap-8 md:gap-14 md:mt-16 mt-8">
            {/* Invisible spacer matching arrow width */}
            <div className="h-13 w-13 shrink-0" aria-hidden="true" />
            <div className="w-full max-w-xl">
              <div className="flex flex-col items-start gap-1.5">
                <div
                  className="flex items-start gap-1 font-display italic leading-none tabular-nums"
                  aria-label={`${current + 1} of ${total}`}
                >
                  <span className="text-4xl">{String(current + 1).padStart(2, '0')}</span>
                  <span className="text-xs">
                    <span>/</span>
                    {String(total).padStart(2, '0')}
                  </span>
                </div>
                <div
                  className="h-1 w-32 overflow-hidden rounded-full"
                  style={{ backgroundColor: '#ededed' }}
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPct}%`, backgroundColor: 'var(--kred-500)' }}
                  />
                </div>
              </div>
            </div>
            {/* Invisible spacer matching arrow width */}
            <div className="h-13 w-13 shrink-0" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  )
}
