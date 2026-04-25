'use client'

import { ScrollAnimate } from '@/components/ScrollAnimate'
import type { AnimType, AnimEasing } from '@/components/ScrollAnimate'

// ---------------------------------------------------------------------------
// Sunray SVG — thin rays emanating from centre, used as a rotating bg accent
// ---------------------------------------------------------------------------
function SunRay({ className }: { className?: string }) {
  return (
    <svg
      width="740"
      height="740"
      viewBox="0 0 740 740"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_199_12)">
        <path
          d="M300.206 -0.537842L293.094 0.873053L329.628 184.566L336.758 183.137L300.206 -0.537842Z"
          fill="#FEC303"
        />
        <path
          d="M440.013 -0.537842L403.467 183.141L410.596 184.556L447.149 0.864102L440.013 -0.537842Z"
          fill="#FEC303"
        />
        <path d="M366.482 44.3635V180.222H373.743V44.3635H366.482Z" fill="#FEC303" />
        <path
          d="M576.258 54.3662L472.213 210.089L478.253 214.121L582.316 58.3982L576.258 54.3662Z"
          fill="#FEC303"
        />
        <path
          d="M163.946 54.384L157.889 58.416L261.952 214.124L267.992 210.092L163.946 54.384Z"
          fill="#FEC303"
        />
        <path
          d="M249.047 67.7307L242.338 70.5066L294.323 196.008L301.032 193.232L249.047 67.7307Z"
          fill="#FEC303"
        />
        <path
          d="M491.162 67.7307L439.177 193.232L445.888 196.008L497.873 70.5066L491.162 67.7307Z"
          fill="#FEC303"
        />
        <path
          d="M142.812 137.023L137.673 142.162L233.723 238.211L238.862 233.072L142.812 137.023Z"
          fill="#FEC303"
        />
        <path
          d="M597.421 137.023L501.354 233.072L506.492 238.211L602.542 142.162L597.421 137.023Z"
          fill="#FEC303"
        />
        <path
          d="M59.0441 157.242L55.0121 163.298L210.735 267.342L214.767 261.303L59.0441 157.242Z"
          fill="#FEC303"
        />
        <path
          d="M681.155 157.242L525.448 261.304L529.479 267.343L685.187 163.299L681.155 157.242Z"
          fill="#FEC303"
        />
        <path
          d="M71.1637 241.695L68.3879 248.404L193.905 300.389L196.682 293.68L71.1637 241.695Z"
          fill="#FEC303"
        />
        <path
          d="M669.057 241.695L543.554 293.68L546.33 300.389L671.832 248.404L669.057 241.695Z"
          fill="#FEC303"
        />
        <path
          d="M1.51905 292.422L0.108154 299.556L183.787 336.103L185.202 328.974L1.51905 292.422Z"
          fill="#FEC303"
        />
        <path
          d="M738.694 292.437L555 328.971L556.428 336.1L740.107 299.554L738.694 292.437Z"
          fill="#FEC303"
        />
        <path d="M45.0116 365.834V373.095H180.87V365.834H45.0116Z" fill="#FEC303" />
        <path d="M559.346 365.834V373.095H695.204V365.834H559.346Z" fill="#FEC303" />
        <path
          d="M183.787 402.82L0.108154 439.366L1.51905 446.477L185.212 409.944L183.783 402.814L183.787 402.82Z"
          fill="#FEC303"
        />
        <path
          d="M556.426 402.82L555.009 409.95L738.702 446.502L740.113 439.366L556.426 402.82Z"
          fill="#FEC303"
        />
        <path
          d="M193.888 438.527L68.37 490.512L71.1459 497.223L196.663 445.238L193.888 438.527Z"
          fill="#FEC303"
        />
        <path
          d="M546.34 438.527L543.563 445.238L669.065 497.223L671.841 490.512L546.34 438.527Z"
          fill="#FEC303"
        />
        <path
          d="M210.738 471.578L55.03 575.622L59.062 581.679L214.77 477.617L210.738 471.578Z"
          fill="#FEC303"
        />
        <path
          d="M529.471 471.578L525.439 477.617L681.161 581.679L685.193 575.622L529.471 471.578Z"
          fill="#FEC303"
        />
        <path
          d="M233.723 500.709L137.673 596.758L142.812 601.897L238.862 505.848L233.723 500.709Z"
          fill="#FEC303"
        />
        <path
          d="M506.492 500.709L501.354 505.848L597.421 601.897L602.543 596.758L506.492 500.709Z"
          fill="#FEC303"
        />
        <path
          d="M261.952 524.802L157.889 680.524L163.946 684.556L267.99 528.833L261.952 524.802Z"
          fill="#FEC303"
        />
        <path
          d="M478.253 524.802L472.213 528.833L576.258 684.541L582.315 680.509L478.253 524.802Z"
          fill="#FEC303"
        />
        <path
          d="M294.331 542.919L242.346 668.421L249.056 671.197L301.041 545.696L294.331 542.919Z"
          fill="#FEC303"
        />
        <path
          d="M445.888 542.919L439.177 545.696L491.162 671.197L497.873 668.421L445.888 542.919Z"
          fill="#FEC303"
        />
        <path
          d="M410.588 554.342L403.458 555.775L440.005 739.454L447.122 738.043L410.588 554.342Z"
          fill="#FEC303"
        />
        <path
          d="M329.628 554.359L293.076 738.051L300.21 739.462L336.756 555.785L329.628 554.359Z"
          fill="#FEC303"
        />
        <path d="M366.482 558.704V694.563H373.743V558.704H366.482Z" fill="#FEC303" />
      </g>
      <defs></defs>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Ksun — spinning sunray behind a title/subtitle, standalone block
// ---------------------------------------------------------------------------
export type KsunProps = {
  title: string
  subtitle?: string
  // Scroll animations
  titleAnim?: boolean
  titleAnimType?: AnimType
  titleAnimEasing?: AnimEasing
  titleAnimDuration?: number
  titleAnimDelay?: number
  subtitleAnim?: boolean
  subtitleAnimType?: AnimType
  subtitleAnimEasing?: AnimEasing
  subtitleAnimDuration?: number
  subtitleAnimDelay?: number
  paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const pxClass = {
  none: 'px-0',
  sm: 'px-4 md:px-6 lg:px-8',
  md: 'px-6 md:px-10 lg:px-16',
  lg: 'px-8 md:px-16 lg:px-24',
  xl: 'px-10 md:px-20 lg:px-32',
}

export function Ksun({
  title,
  subtitle,
  titleAnim,
  titleAnimType,
  titleAnimEasing,
  titleAnimDuration,
  titleAnimDelay,
  subtitleAnim,
  subtitleAnimType,
  subtitleAnimEasing,
  subtitleAnimDuration,
  subtitleAnimDelay,
  paddingX = 'md' as const,
}: KsunProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center text-center overflow-hidden min-h-185 ${pxClass[paddingX]} py-20 md:py-28`}
    >
      {/* Spinning sunray — inset-0 fills the container, inner div spins (keeps transforms separate) */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div style={{ animation: 'spin 40s linear infinite' }}>
          <SunRay className="w-2xl h-2xl opacity-70" />
        </div>
      </div>

      {/* Text */}
      <div className="relative z-10 max-w-2xl">
        <ScrollAnimate
          enabled={titleAnim}
          type={titleAnimType}
          easing={titleAnimEasing}
          duration={titleAnimDuration}
          delay={titleAnimDelay}
          as="h2"
          className="font-display text-5xl italic font-bold uppercase leading-tight md:text-6xl"
        >
          {title}
        </ScrollAnimate>
        {subtitle && (
          <ScrollAnimate
            enabled={subtitleAnim}
            type={subtitleAnimType}
            easing={subtitleAnimEasing}
            duration={subtitleAnimDuration}
            delay={subtitleAnimDelay}
            as="p"
            className="mt-6 font-sans font-medium text-2xl leading-tight md:text-3xl"
          >
            {subtitle}
          </ScrollAnimate>
        )}
      </div>
    </div>
  )
}
