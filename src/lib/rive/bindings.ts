'use client'

/**
 * Data-binding values an editor configured in the CMS, and the code that
 * applies them to a live Rive instance.
 *
 * Two modes per property:
 *  - `static` — set once when the animation loads.
 *  - `scroll` — driven continuously from the scroll position of the nearest
 *    section, remapping scroll progress 0–1 onto [min, max].
 *
 * This generalises the original single-property scroll scrub. Both can coexist:
 * legacy `riveScrub*` config still drives its one property, and bindings drive
 * whatever else is listed.
 */

import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RiveDataType } from './inspect'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RiveBinding {
  /** Slash path into the ViewModel instance, e.g. "Theme/accent". */
  path: string
  type: RiveDataType
  mode?: 'static' | 'scroll'

  // Static values — only the one matching `type` is read.
  valueNumber?: number | null
  valueBoolean?: boolean | null
  valueString?: string | null
  valueColor?: string | null
  valueEnum?: string | null

  // Scroll mode
  scrollMin?: number | null
  scrollMax?: number | null
  scrollStart?: string | null
  scrollEnd?: string | null
  scrollScrub?: number | null
}

/** Shape of the JSON blob the admin field stores. */
export interface RiveBindingsValue {
  /** Property list captured at scan time, so the UI can render without re-reading the file. */
  bindings?: RiveBinding[]
}

// Structural view of the ViewModel instance imperative API.
interface VMInstance {
  number?: (path: string) => { value: number } | null
  boolean?: (path: string) => { value: boolean } | null
  string?: (path: string) => { value: string } | null
  color?: (path: string) => { value: number } | null
  enum?: (path: string) => { value: string } | null
  trigger?: (path: string) => { trigger: () => void } | null
}

interface RiveLike {
  viewModelInstance?: VMInstance | null
}

// ─── Value writing ───────────────────────────────────────────────────────────

/** "#rrggbb" / "#aarrggbb" → the 32-bit ARGB int Rive colour properties take. */
export function parseColor(input: string | null | undefined): number | null {
  if (!input) return null
  const hex = input.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]+$/.test(hex)) return null
  if (hex.length === 6) return (0xff000000 | parseInt(hex, 16)) >>> 0
  if (hex.length === 8) return parseInt(hex, 16) >>> 0
  return null
}

/** Writes one value to the bound ViewModel property. Silently no-ops if absent. */
export function writeBinding(vm: VMInstance, binding: RiveBinding, value: number | boolean | string) {
  const { path, type } = binding
  try {
    switch (type) {
      case 'number':
      case 'integer': {
        const prop = vm.number?.(path)
        if (prop) prop.value = Number(value)
        break
      }
      case 'boolean': {
        const prop = vm.boolean?.(path)
        if (prop) prop.value = Boolean(value)
        break
      }
      case 'string': {
        const prop = vm.string?.(path)
        if (prop) prop.value = String(value)
        break
      }
      case 'color': {
        const parsed = parseColor(String(value))
        if (parsed === null) break
        const prop = vm.color?.(path)
        if (prop) prop.value = parsed
        break
      }
      case 'enumType': {
        const prop = vm.enum?.(path)
        if (prop) prop.value = String(value)
        break
      }
      default:
        break
    }
  } catch {
    // Property renamed or removed since the file was scanned — skip it rather
    // than taking down the whole animation.
  }
}

/** Reads the static value an editor set for this binding, in its own type. */
function staticValue(binding: RiveBinding): number | boolean | string | null {
  switch (binding.type) {
    case 'number':
    case 'integer':
      return typeof binding.valueNumber === 'number' ? binding.valueNumber : null
    case 'boolean':
      return typeof binding.valueBoolean === 'boolean' ? binding.valueBoolean : null
    case 'string':
      return binding.valueString ?? null
    case 'color':
      return binding.valueColor ?? null
    case 'enumType':
      return binding.valueEnum ?? null
    default:
      return null
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Applies `bindings` to `rive`.
 *
 * Static bindings are written once the instance is ready. Scroll bindings get
 * one ScrollTrigger each, measured against `triggerEl` (or the nearest section).
 */
export function useRiveBindings(
  rive: unknown,
  bindings: RiveBinding[] | null | undefined,
  containerRef: RefObject<HTMLElement | null>,
) {
  // Re-run when the configured bindings actually change, not on every render.
  const key = bindings?.length ? JSON.stringify(bindings) : ''

  useEffect(() => {
    if (!rive || !key) return

    const vm = (rive as RiveLike).viewModelInstance
    if (!vm) return

    const parsed = JSON.parse(key) as RiveBinding[]
    const triggers: ScrollTrigger[] = []

    // Resolve the scroll trigger element once — the framed section this
    // animation belongs to, matching how the legacy scrub picks its target.
    const el = containerRef.current
    const section =
      el?.closest('.section-block') ?? el?.closest('section') ?? el?.parentElement ?? el ?? undefined

    for (const binding of parsed) {
      if (!binding?.path) continue

      if (binding.mode === 'scroll') {
        const min = typeof binding.scrollMin === 'number' ? binding.scrollMin : 0
        const max = typeof binding.scrollMax === 'number' ? binding.scrollMax : 100

        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: binding.scrollStart || 'top bottom',
            end: binding.scrollEnd || 'bottom top',
            scrub: typeof binding.scrollScrub === 'number' ? binding.scrollScrub : 0.5,
            onUpdate: (self) => {
              const raw = min + (max - min) * self.progress
              // Booleans flip at the midpoint of the configured range.
              const value = binding.type === 'boolean' ? raw >= (min + max) / 2 : raw
              writeBinding(vm, binding, value)
            },
          }),
        )
        continue
      }

      const value = staticValue(binding)
      if (value !== null) writeBinding(vm, binding, value)
    }

    return () => {
      for (const trigger of triggers) trigger.kill()
    }
    // `containerRef` is a stable ref object; `key` covers the binding content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rive, key])
}
