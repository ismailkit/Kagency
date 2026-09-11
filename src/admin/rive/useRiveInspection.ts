'use client'

/**
 * Resolves the .riv file selected on the current block and reads its shape,
 * so admin fields can offer real artboard / state machine / property choices.
 *
 * Shared by every Rive admin field on a block, with a module-level cache keyed
 * by URL so three fields on one block cause one WASM load, not three.
 */

import { useConfig, useFormFields } from '@payloadcms/ui'
import { useCallback, useEffect, useState } from 'react'
import { inspectRiveFile, type RiveInspection } from '@/lib/rive/inspect'

type Status = 'idle' | 'loading' | 'ready' | 'error'

export interface UseRiveInspectionResult {
  status: Status
  inspection: RiveInspection | null
  error: string | null
  /** Resolved .riv URL, or null when no file is selected on this block. */
  src: string | null
  /** Drops the cache entry and re-reads — for when the file is replaced in place. */
  refresh: () => void
}

const cache = new Map<string, Promise<RiveInspection>>()

function load(src: string, force = false): Promise<RiveInspection> {
  if (force) cache.delete(src)
  let pending = cache.get(src)
  if (!pending) {
    pending = inspectRiveFile(src)
    // A failed read must not be cached, or a transient error sticks for the
    // whole admin session.
    pending.catch(() => cache.delete(src))
    cache.set(src, pending)
  }
  return pending
}

/** Replaces the final segment of a field path, e.g. `a.1.riveBindings` → `a.1.riveFile`. */
function siblingPath(path: string, name: string): string {
  const segments = path.split('.')
  segments[segments.length - 1] = name
  return segments.join('.')
}

/**
 * @param path           This field's own form path — Payload passes it to custom
 *                       components as a prop. Sibling paths are derived from it.
 * @param fileFieldName  Name of the sibling upload field (`riveFile` on both
 *                       the Rive block and background layers).
 * @param urlFieldName   Name of the sibling fallback URL text field.
 */
export function useRiveInspection(
  path: string,
  fileFieldName = 'riveFile',
  urlFieldName = 'riveUrl',
): UseRiveInspectionResult {
  const { config } = useConfig()

  const fileValue = useFormFields(([fields]) => fields[siblingPath(path, fileFieldName)]?.value)
  const urlValue = useFormFields(([fields]) => fields[siblingPath(path, urlFieldName)]?.value)

  const [src, setSrc] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [inspection, setInspection] = useState<RiveInspection | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  // ── Resolve the upload relationship to a URL ───────────────────────────
  useEffect(() => {
    let cancelled = false

    const resolve = async () => {
      // Upload fields hold either a populated doc or a bare id, depending on
      // whether form state came from the server or a fresh selection.
      if (fileValue && typeof fileValue === 'object') {
        const url = (fileValue as { url?: string }).url
        if (url) return url
      }

      const id =
        typeof fileValue === 'string'
          ? fileValue
          : ((fileValue as { id?: string } | null)?.id ?? null)

      if (id) {
        try {
          const res = await fetch(
            `${config.serverURL}${config.routes.api}/media/${id}?depth=0`,
            { credentials: 'include' },
          )
          if (res.ok) {
            const doc = (await res.json()) as { url?: string }
            if (doc?.url) {
              return doc.url.startsWith('http') ? doc.url : `${config.serverURL}${doc.url}`
            }
          }
        } catch {
          // fall through to the manual URL below
        }
      }

      return typeof urlValue === 'string' && urlValue ? urlValue : null
    }

    void resolve().then((resolved) => {
      if (!cancelled) setSrc(resolved)
    })

    return () => {
      cancelled = true
    }
  }, [fileValue, urlValue, config.serverURL, config.routes.api])

  // ── Read the file ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!src) {
      setStatus('idle')
      setInspection(null)
      setError(null)
      return
    }

    let cancelled = false
    setStatus('loading')
    setError(null)

    load(src, nonce > 0)
      .then((result) => {
        if (cancelled) return
        setInspection(result)
        setStatus('ready')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setInspection(null)
        setError(err instanceof Error ? err.message : 'Could not read the Rive file.')
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [src, nonce])

  const refresh = useCallback(() => {
    if (src) cache.delete(src)
    setNonce((n) => n + 1)
  }, [src])

  return { status, inspection, error, src, refresh }
}
