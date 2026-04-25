'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { mediaURL } from '@/lib/cms'
import type { CMSProject } from '@/lib/cms'

// ---------------------------------------------------------------------------
// Film-lamp SVG (decorative element above each poster card)
// ---------------------------------------------------------------------------
function FilmLamp() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 147 127"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M145.5 107.83V116.322C144.796 116.21 143.883 116.07 142.757 115.911C139.748 115.486 135.225 114.921 129.139 114.356C116.966 113.227 98.545 112.1 73.5 112.1C48.455 112.1 30.0337 113.227 17.8614 114.356C11.7753 114.921 7.2515 115.486 4.24317 115.911C3.11735 116.07 2.20378 116.21 1.5 116.322V107.83C1.5 107.562 1.67896 107.384 1.89006 107.357C8.86371 106.444 36.9078 103.1 73.5 103.1C110.092 103.1 138.136 106.444 145.11 107.357C145.321 107.384 145.5 107.562 145.5 107.83Z"
        stroke="white"
        strokeWidth="3"
      />
      <path
        d="M3.15504 116.052C10.344 114.878 31.6743 112.1 72.5 112.1C113.71 112.1 136.323 114.931 143.841 116.087C144.792 116.233 145.5 117.055 145.5 118.089C145.5 118.365 145.44 118.575 145.365 118.713C145.297 118.838 145.209 118.921 145.086 118.977C141.44 120.631 126.555 125.1 73.5 125.1C20.5226 125.1 5.60376 120.644 1.92975 118.984C1.80097 118.926 1.70959 118.839 1.63872 118.709C1.56109 118.567 1.5 118.352 1.5 118.07C1.5 117.033 2.20529 116.207 3.15504 116.052Z"
        stroke="white"
        strokeWidth="3"
      />
      <path
        d="M58.2862 49.1712L58.8052 48.3063L58.2 47.4994L55.6 44.0327C55.5351 43.9462 55.5 43.8409 55.5 43.7327V42.2201C55.5 41.9569 55.693 41.7645 55.9232 41.7472C58.9844 41.518 65.7077 41.0996 74 41.0996C82.2923 41.0996 89.0156 41.518 92.0768 41.7472C92.307 41.7645 92.5 41.9569 92.5 42.2201V43.6479C92.5 43.7691 92.456 43.8861 92.3763 43.9772L89.3711 47.4117L88.5969 48.2964L89.2712 49.2596L92.5 53.8722V54.7922C92.2899 54.778 92.0622 54.7627 91.8185 54.7465C90.4095 54.6526 88.468 54.5273 86.3381 54.402C82.0936 54.1523 77.0508 53.8994 74 53.8994C70.9492 53.8994 65.9064 54.1523 61.6619 54.402C59.532 54.5273 57.5905 54.6526 56.1815 54.7465C55.9378 54.7627 55.7101 54.778 55.5 54.7922V53.8149L58.2862 49.1712Z"
        stroke="white"
        strokeWidth="3"
      />
      <path
        d="M87.5 41.4977C86.778 41.4546 85.8308 41.4029 84.6931 41.3512C81.9252 41.2253 78.0271 41.0996 73.5 41.0996C68.9729 41.0996 65.0748 41.2253 62.3069 41.3512C61.1692 41.4029 60.222 41.4546 59.5 41.4977V17.6288C59.7245 17.4324 60.1913 17.0989 61.0711 16.7366C62.9457 15.9647 66.6037 15.0996 73.5 15.0996C80.3963 15.0996 84.0543 15.9647 85.9289 16.7366C86.8088 17.0989 87.2755 17.4324 87.5 17.6288V41.4977Z"
        stroke="white"
        strokeWidth="3"
      />
      <path
        d="M78.5 11.4045C78.4152 11.4002 78.3275 11.3959 78.2369 11.3915C77.0649 11.3356 75.4155 11.2797 73.5 11.2797C71.5845 11.2797 69.9351 11.3356 68.7631 11.3915C68.6725 11.3959 68.5848 11.4002 68.5 11.4045V2.21466C68.5421 2.19364 68.59 2.17125 68.6441 2.14784C69.2762 1.87432 70.6746 1.5 73.5 1.5C76.3254 1.5 77.7238 1.87432 78.3559 2.14784C78.41 2.17125 78.4579 2.19364 78.5 2.21466V11.4045Z"
        stroke="white"
        strokeWidth="3"
      />
      <path
        d="M89.2078 16.1044C89.1986 16.1041 89.1902 16.1038 89.1826 16.1035L89.1507 16.0996C89.089 16.092 88.9984 16.081 88.8808 16.0671C88.6456 16.0392 88.3025 15.9996 87.867 15.9522C86.9961 15.8573 85.7548 15.7311 84.2678 15.605C81.2981 15.353 77.3295 15.0996 73.3671 15.0996C69.404 15.0996 65.53 15.3531 62.6533 15.6053C61.2131 15.7316 60.0187 15.858 59.1828 15.9529C58.7647 16.0004 58.4361 16.0401 58.211 16.0681C58.107 16.081 58.025 16.0914 57.9665 16.0989C57.9627 16.0988 57.9587 16.0988 57.9546 16.0988C57.8835 16.0979 57.7798 16.0961 57.6535 16.0924C57.399 16.0851 57.0627 16.0705 56.7221 16.0423C56.4501 16.0197 56.203 15.9905 56.0041 15.9559C55.9591 15.7922 55.9212 15.5988 55.9027 15.3988C55.8806 15.1603 55.8899 14.9533 55.9218 14.7959C55.9418 14.6969 55.9662 14.6386 55.9828 14.6075C56.0158 14.5844 56.0939 14.5307 56.2394 14.4491C56.4898 14.3088 56.8504 14.1347 57.324 13.9387C58.2681 13.548 59.5884 13.1001 61.223 12.6767C64.4903 11.8304 68.9469 11.0996 74.0582 11.0996C83.5843 11.0996 89.6359 14.0737 91.1059 14.8226C91.1188 14.9118 91.1265 15.0407 91.1156 15.2063C91.0999 15.4468 91.05 15.6895 90.9852 15.8816C90.9732 15.9173 90.9615 15.9487 90.9505 15.9761C90.9407 15.9787 90.9302 15.9814 90.9191 15.9841C90.7308 16.031 90.4768 16.0658 90.1905 16.0864C89.9121 16.1064 89.6436 16.1103 89.4419 16.1089C89.3423 16.1081 89.2617 16.1061 89.2078 16.1044ZM90.8912 16.0993C90.8912 16.0992 90.8918 16.0983 90.893 16.0966C90.8918 16.0985 90.8912 16.0993 90.8912 16.0993Z"
        stroke="white"
        strokeWidth="3"
      />
      <path
        d="M142.168 106.881C141.222 106.776 139.959 106.64 138.41 106.483C134.72 106.106 129.411 105.605 122.928 105.104C109.966 104.102 92.3 103.1 73.5 103.1C54.7003 103.1 36.7854 104.102 23.5741 105.104C16.9671 105.605 11.5335 106.106 7.7501 106.482C6.20569 106.636 4.93613 106.768 3.97386 106.872C4.0451 106.613 4.12472 106.331 4.21324 106.028C4.75435 104.176 5.62701 101.526 6.94672 98.3651C9.58755 92.0393 14.009 83.6893 21.1267 75.5898C28.2951 67.4327 34.0449 62.9269 38.8049 60.2155C43.1659 57.7314 46.7453 56.7201 50.027 55.7929C50.3243 55.7089 50.6192 55.6256 50.9121 55.5419C54.2275 54.5946 59.6924 54.0981 64.4538 53.8475C66.8084 53.7236 68.9478 53.6616 70.4987 53.6306C71.2738 53.6151 71.9011 53.6073 72.3337 53.6035C72.55 53.6015 72.7176 53.6006 72.8306 53.6001L72.9584 53.5997L72.9903 53.5996L72.9979 53.5996L72.9997 53.5996L73 53.5996L73.0004 53.5996L73.0022 53.5996L73.0101 53.5996L73.0431 53.5997L73.1755 53.6001C73.2925 53.6006 73.466 53.6015 73.6902 53.6035C74.1386 53.6073 74.7895 53.6151 75.5962 53.6306C77.21 53.6616 79.4442 53.7237 81.9251 53.8477C86.9264 54.0978 92.7937 54.5942 96.6362 55.5548C104.333 57.479 119.536 65.3028 129.816 78.5205C134.919 85.0809 138.101 92.6501 140.009 98.6188C140.96 101.596 141.589 104.157 141.979 105.97C142.05 106.299 142.113 106.603 142.168 106.881Z"
        stroke="white"
        strokeWidth="3"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Light cone SVG (the warm yellow cone under the lamp)
// ---------------------------------------------------------------------------
function LightCone() {
  return (
    <svg
      width="100%"
      viewBox="0 0 345 246"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-x-0 top-0 w-full pointer-events-none"
      aria-hidden="true"
    >
      <path
        d="M105.655 5.45214C112.844 4.27842 134.174 1.5 175 1.5C216.21 1.5 238.823 4.33097 246.341 5.48754C247.292 5.6338 248 6.45507 248 7.48952C248 7.76559 247.94 7.97489 247.865 8.11293C247.797 8.23863 247.709 8.32173 247.586 8.37775C243.94 10.0313 229.055 14.5 176 14.5C123.023 14.5 108.104 10.0444 104.43 8.38474C104.301 8.32657 104.21 8.23987 104.139 8.10972C104.061 7.96718 104 7.75235 104 7.4703C104 6.43327 104.705 5.6072 105.655 5.45214Z"
        fill="#FEC303"
        stroke="white"
        strokeWidth="3"
      />
      <path
        d="M106 6.90039H246L344.5 221.024C344.5 221.024 297.802 245.4 167.5 245.4C37.1976 245.4 0 221.024 0 221.024L106 6.90039Z"
        fill="url(#paint0_linear_733_1876)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_733_1876"
          x1="176.293"
          y1="4.40039"
          x2="176.293"
          y2="143.297"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FEC303" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FEC303" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Single cycling poster card
// ---------------------------------------------------------------------------
type Column = {
  category: string
  label: string
  cardTitle?: string
  cardSubtitle?: string
}

type PosterCardProps = {
  column: Column
  projects: CMSProject[]
  delay?: number
}

const CYCLE_INTERVAL = 7000

function PosterCard({ column, projects, delay = 0 }: PosterCardProps) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [flickering, setFlickering] = useState(false)

  useEffect(() => {
    if (projects.length < 2) return
    const initialDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setVisible(false)
        setFlickering(true)
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % projects.length)
          setVisible(true)
        }, 400)
        setTimeout(() => setFlickering(false), 500)
      }, CYCLE_INTERVAL)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(initialDelay)
  }, [projects.length, delay])

  const current = projects[index]
  const imageSrc = current ? (mediaURL(current.coverImage) ?? null) : null

  return (
    <div className="flex flex-col items-center gap-20">
      {/* Lamp */}
      <div className="relative w-full max-w-45 mx-auto">
        <div className="relative z-10 text-white">
          <FilmLamp />
        </div>
        <div
          className="absolute inset-x-[-40%] top-[88%] z-0"
          style={flickering ? { animation: 'bulb-flicker 0.5s linear' } : undefined}
        >
          <LightCone />
        </div>
      </div>

      {/* Poster card — outer frame */}
      <div
        className="relative w-full border-[3px] border-white rounded-sm p-2"
        style={{ aspectRatio: '2/3' }}
      >
        {/* Inner image area — overlays are clipped here, not on the frame */}
        <div className="relative w-full h-full overflow-hidden rounded-sm">
          {/* Category label tab */}
          <div className="absolute top-2 left-2 z-20 bg-kred-500 px-2 py-0.5">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-white">
              {column.label}
            </span>
          </div>

          {/* Image crossfade */}
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={current?.title ?? ''}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-opacity duration-500"
              style={{ opacity: visible ? 1 : 0 }}
            />
          ) : (
            <div className="absolute inset-0 bg-kblack-500" />
          )}

          {/* Bottom info overlay */}
          {current && (
            <div
              className="absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-black/80 to-transparent p-4 transition-opacity duration-500"
              style={{ opacity: visible ? 1 : 0 }}
            >
              <p className="font-display text-xs uppercase tracking-wider text-white/60">
                {current.client}
              </p>
              <p className="font-display text-lg font-bold uppercase leading-tight text-white">
                {current.title}
              </p>
            </div>
          )}

          {/* Empty state */}
          {projects.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-white/30">
              <span className="font-display text-sm uppercase">No projects</span>
            </div>
          )}
        </div>
      </div>

      {/* Handwritten caption */}
      {(column.cardTitle || column.cardSubtitle) && (
        <div className="text-center">
          {column.cardTitle && (
            <p className="font-display text-6xl italic text-white leading-tight font-extrabold">
              {column.cardTitle}
            </p>
          )}
          {column.cardSubtitle && (
            <p className="font-handwritten text-6xl -rotate-12 text-kyellow-500">
              {column.cardSubtitle}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

import { ScrollAnimate } from '@/components/ScrollAnimate'
import type { AnimType, AnimEasing } from '@/components/ScrollAnimate'

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export type LandingWorksProps = {
  columns: Column[]
  projectsByCategory: Record<string, CMSProject[]>
  // Scroll animations
  sectionAnim?: boolean
  sectionAnimType?: AnimType
  sectionAnimEasing?: AnimEasing
  sectionAnimDuration?: number
  sectionAnimDelay?: number
  paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const pxClass = {
  none: 'px-0',
  sm: 'px-4 md:px-6 lg:px-8',
  md: 'px-6 md:px-10 lg:px-16',
  lg: 'px-8 md:px-16 lg:px-24',
  xl: 'px-10 md:px-20 lg:px-32',
}

export function LandingWorks({
  columns,
  projectsByCategory,
  sectionAnim,
  sectionAnimType,
  sectionAnimEasing,
  sectionAnimDuration,
  sectionAnimDelay,
  paddingX = 'md' as const,
}: LandingWorksProps) {
  return (
    <ScrollAnimate
      enabled={sectionAnim}
      type={sectionAnimType}
      easing={sectionAnimEasing}
      duration={sectionAnimDuration}
      delay={sectionAnimDelay}
      className={`flex flex-col items-center ${pxClass[paddingX]} gap-10`}
    >
      <div className="relative grid w-full max-w-6xl grid-cols-1 gap-16 sm:grid-cols-3">
        {columns.map((col, i) => (
          <PosterCard
            key={col.category}
            column={col}
            projects={projectsByCategory[col.category] ?? []}
            delay={i * 1200}
          />
        ))}
      </div>
    </ScrollAnimate>
  )
}
