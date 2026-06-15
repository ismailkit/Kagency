'use client'

/**
 * ConsolidationBlock — Full-width dark callout about consolidating vendors.
 * Two-line display title with the second line in accent colour, animated entrance.
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

export interface ConsolidationBlockProps {
  titleLine1: string
  titleLine2: string
  body: RichTextContent
  paddingX?: PaddingXSize
}

export function ConsolidationBlock({
  titleLine1,
  titleLine2,
  body,
  paddingX = 'xl',
}: ConsolidationBlockProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const accentRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = [accentRef.current, line1Ref.current, line2Ref.current, bodyRef.current].filter(
      Boolean,
    )
    gsap.set(els, { opacity: 0, y: 44 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 68%',
        once: true,
      },
    })

    tl.to(accentRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
      .to(line1Ref.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.3')
      .to(line2Ref.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.55')
      .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden bg-[#242424] py-20 md:py-24 lg:py-36 ${pxClass[paddingX]}`}
    >
      {/* Title */}
      <h2 className="font-display font-black uppercase leading-tight tracking-tight mb-10 text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
        <span ref={line1Ref} className="block text-white">
          {titleLine1}
        </span>
        <span ref={line2Ref} className="block text-kred-500">
          {titleLine2}
        </span>
      </h2>

      {/* Body */}
      <div
        ref={bodyRef}
        className="font-sans leading-relaxed text-white richtext text-base lg:text-lg xl:text-xl max-w-[60ch]"
        dangerouslySetInnerHTML={{ __html: richTextToHTML(body) }}
      />

      {/* Background large number — decorative */}
      <div
        className="pointer-events-none select-none absolute right-8 md:right-16 lg:right-32 top-1/2 -translate-y-1/2 leading-none font-display font-black text-white/2.5 tracking-tighter text-[12rem] md:text-[18rem] lg:text-[25rem] xl:text-[30rem]"
        aria-hidden="true"
      >
        1
      </div>
    </section>
  )
}
