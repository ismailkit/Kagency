'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { mediaURL } from '@/lib/cms'
import { SectionBlock, type ContainerStyle } from '@/components/SectionBlock'

type Props = {
  title: string
  subtitle: string
  image?: { url?: string; alt?: string } | string
  ctaLabel?: string
  ctaHref?: string
  containerStyle?: ContainerStyle
  useNoise?: boolean
}

export function LandingHero({
  title,
  subtitle,
  image,
  ctaLabel,
  ctaHref,
  containerStyle = 'center',
  useNoise = false,
}: Props) {
  const imageSrc = mediaURL(image) || '/assets/vector/jumping.svg'

  return (
    <SectionBlock
      styleType={containerStyle}
      noise={useNoise}
      className="px-6 py-16 md:px-24 md:py-24"
    >
      <div className="grid min-h-[65vh] grid-cols-1 items-center gap-8 md:grid-cols-[1.1fr_.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="font-display italic text-5xl font-bold uppercase leading-[0.95] text-kblack-500 md:text-7xl">
            {title}
          </h1>
          <p className="mt-10 max-w-2xl font-sans text-2xl font-medium leading-tight text-kblack-500 md:text-3xl">
            {subtitle}
          </p>

          {ctaLabel && ctaHref ? (
            <Link href={ctaHref} className="group mt-14 inline-flex items-center gap-3">
              <span className="font-display font-bold text-lg uppercase text-kred-500 underline md:text-xl">
                {ctaLabel}
              </span>
              <Image
                src="/assets/icons/ArrowForward.svg"
                alt="Arrow"
                width={16}
                height={16}
                className="transition-transform group-hover:translate-x-1.5"
              />
            </Link>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto w-full max-w-md md:max-w-xl"
        >
          <Image
            src={imageSrc}
            alt="Hero illustration"
            width={760}
            height={640}
            className="h-auto w-full"
            priority
          />
        </motion.div>
      </div>
    </SectionBlock>
  )
}
