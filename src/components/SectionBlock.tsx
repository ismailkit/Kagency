import type { ReactNode } from 'react'

export type ContainerStyle = 'normal' | 'center' | 'top' | 'bottom'

type Props = {
  children: ReactNode
  styleType?: ContainerStyle
  noise?: boolean
  className?: string
}

function styleClass(styleType: ContainerStyle) {
  if (styleType === 'top') return 'section-container--top'
  if (styleType === 'bottom') return 'section-container--bottom'
  if (styleType === 'center') return 'section-container--center'
  return 'section-container--normal'
}

export function SectionBlock({ children, styleType = 'normal', noise = false, className = '' }: Props) {
  return (
    <section className={`section-block ${noise ? 'is-noise' : ''}`.trim()}>
      <div className={`site-shell section-container ${styleClass(styleType)} ${className}`.trim()}>{children}</div>
    </section>
  )
}
