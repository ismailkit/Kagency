'use client'

import { useEffect, useRef } from 'react'

/**
 * Rive playback speed.
 *
 * The Rive runtime has no public speed setter — `LinearAnimationInstance.speed`
 * is read-only and state machines advance straight off the frame delta. What it
 * does expose (internally) is `_boundDraw`, the rAF callback it re-reads from
 * the instance every time it schedules a frame:
 *
 *   this.frameRequestId = requestAnimationFrame(this._boundDraw)
 *
 * and inside `draw` the whole advance is derived from one value:
 *
 *   const elapsedTime = (time - this.lastRenderTime) / 1000
 *
 * So swapping `_boundDraw` for a wrapper that feeds Rive a clock running at
 * `speed` × wall-clock scales every linear animation AND every state machine
 * uniformly, without touching the artboard or re-rendering React.
 *
 * `lastRenderTime` is reset to 0 by Rive on pause/stop and re-seeded from the
 * incoming timestamp on the next frame, so the scaled clock survives
 * pause/resume without a jump.
 */

type DrawFn = (time: number, onSecond?: () => void) => void

interface RiveDrawLoop {
  _boundDraw?: DrawFn
}

/** Clamp to a sane range — 0 would freeze the animation with no way back. */
const MIN_SPEED = 0.05
const MAX_SPEED = 10

export function normalizeRiveSpeed(speed: number | null | undefined): number {
  if (typeof speed !== 'number' || !Number.isFinite(speed)) return 1
  return Math.min(MAX_SPEED, Math.max(MIN_SPEED, speed))
}

/**
 * Runs `rive` at `speed` × its authored rate. 1 = untouched.
 *
 * No-ops (leaving playback at 1×) if a future runtime drops `_boundDraw`, so an
 * upgrade degrades to normal speed rather than a blank canvas.
 */
export function useRivePlaybackSpeed(rive: unknown, speed: number | null | undefined) {
  const speedRef = useRef(1)

  // Read live inside the wrapper so a speed change never restarts the clock.
  useEffect(() => {
    speedRef.current = normalizeRiveSpeed(speed)
  }, [speed])

  useEffect(() => {
    if (!rive) return
    // Nothing to patch at 1× — keep the runtime's own callback in place.
    if (normalizeRiveSpeed(speed) === 1) return

    const loop = rive as RiveDrawLoop
    const original = loop._boundDraw
    if (typeof original !== 'function') return

    let lastReal: number | null = null
    let scaled = 0

    const patched: DrawFn = (time, onSecond) => {
      if (lastReal === null) {
        // Seed from the real timestamp so frame 1 behaves exactly as it would
        // unpatched (Rive treats a falsy lastRenderTime as "first frame").
        lastReal = time
        scaled = time
      }
      scaled += (time - lastReal) * speedRef.current
      lastReal = time
      original(scaled, onSecond)
    }

    loop._boundDraw = patched

    return () => {
      // Only hand back if nobody else has since replaced it.
      if (loop._boundDraw === patched) loop._boundDraw = original
    }
    // `speed` is intentionally only a re-arm trigger: the live value is read
    // from the ref, so changing it mid-flight does not reset the scaled clock.
  }, [rive, speed])
}
