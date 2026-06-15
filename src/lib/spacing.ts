// ─── Shared horizontal padding scale ─────────────────────────────────────────
// Single source of truth used by all content blocks and section wrappers.
// import { pxClass } from '@/lib/spacing'

export type PaddingXSize = 'none' | 'sm' | 'md' | 'lg' | 'xl'

export const pxClass: Record<PaddingXSize, string> = {
  none: 'px-0',
  sm: 'px-4 md:px-6 lg:px-8',
  md: 'px-6 md:px-10 lg:px-16',
  lg: 'px-8 md:px-16 lg:px-24',
  xl: 'px-10 md:px-20 lg:px-32',
}
