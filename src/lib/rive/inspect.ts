'use client'

/**
 * Reads a .riv file's shape without rendering it: artboards, state machines,
 * and the data-binding (ViewModel) properties an editor can drive.
 *
 * Used by the admin panel to build controls that match whatever is actually in
 * the uploaded file, rather than making editors type property names by hand.
 *
 * Everything here is browser-only — it loads the Rive WASM runtime.
 */

import { Rive } from '@rive-app/react-canvas'

// ─── Types ───────────────────────────────────────────────────────────────────

/** Mirrors Rive's DataType enum. */
export type RiveDataType =
  | 'none'
  | 'string'
  | 'number'
  | 'boolean'
  | 'color'
  | 'list'
  | 'enumType'
  | 'trigger'
  | 'viewModel'
  | 'integer'
  | 'listIndex'
  | 'image'
  | 'artboard'

/** Property types an editor can meaningfully set or drive from scroll. */
export const BINDABLE_TYPES: RiveDataType[] = [
  'number',
  'integer',
  'boolean',
  'string',
  'color',
  'enumType',
  'trigger',
]

/** Types that can be driven continuously from scroll progress. */
export const SCROLLABLE_TYPES: RiveDataType[] = ['number', 'integer', 'boolean']

export interface RiveVMProperty {
  /** Slash-separated path accepted by ViewModelInstance accessors, e.g. "Theme/accent". */
  path: string
  /** Leaf name as authored in Rive. */
  name: string
  type: RiveDataType
  /** Allowed values — enumType only. */
  enumValues?: string[]
}

export interface RiveArtboardInfo {
  name: string
  animations: string[]
  stateMachines: string[]
}

export interface RiveInspection {
  artboards: RiveArtboardInfo[]
  /** Name of the artboard's default ViewModel, if the file uses data binding. */
  viewModelName: string | null
  properties: RiveVMProperty[]
}

// Structural shapes for the bits of the runtime we read. Typed locally so a
// runtime upgrade that reshapes these degrades to "nothing found" rather than
// throwing inside the admin panel.
interface VMInstanceLike {
  properties?: { name: string; type: string }[]
  viewModel?: (path: string) => VMInstanceLike | null
  enum?: (path: string) => { values?: string[] } | null
  viewModelName?: string
}

// Guard against self-referencing ViewModels, which would otherwise recurse forever.
const MAX_DEPTH = 5

// ─── Canvas ──────────────────────────────────────────────────────────────────

/**
 * Rive always needs a canvas, even when we only want to read the file. An
 * OffscreenCanvas keeps this out of the DOM entirely; the detached <canvas>
 * fallback covers browsers without it.
 */
function createScratchCanvas(): HTMLCanvasElement | OffscreenCanvas {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(1, 1)
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas
}

// ─── Property walking ────────────────────────────────────────────────────────

function collectProperties(
  instance: VMInstanceLike | null | undefined,
  prefix: string,
  depth: number,
  out: RiveVMProperty[],
) {
  if (!instance || depth > MAX_DEPTH) return

  let props: { name: string; type: string }[] = []
  try {
    props = instance.properties ?? []
  } catch {
    return
  }

  for (const prop of props) {
    if (!prop?.name) continue
    const path = prefix ? `${prefix}/${prop.name}` : prop.name
    const type = prop.type as RiveDataType

    if (type === 'viewModel') {
      // Nested ViewModel — descend so editors see "Group/property" paths, which
      // is exactly what the instance accessors take.
      let nested: VMInstanceLike | null = null
      try {
        nested = instance.viewModel?.(path) ?? null
      } catch {
        nested = null
      }
      collectProperties(nested, path, depth + 1, out)
      continue
    }

    const entry: RiveVMProperty = { path, name: prop.name, type }

    // Enum options live on the instance, not the property descriptor.
    if (type === 'enumType') {
      try {
        entry.enumValues = instance.enum?.(path)?.values ?? undefined
      } catch {
        // leave undefined — the field falls back to a free-text input
      }
    }

    out.push(entry)
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export class RiveInspectError extends Error {}

/**
 * Loads `src` and reports what it contains. Always cleans up the Rive instance.
 *
 * @param src       Resolved URL to the .riv file.
 * @param artboard  Artboard to bind for property discovery. Defaults to the
 *                  file's default artboard.
 */
export function inspectRiveFile(src: string, artboard?: string): Promise<RiveInspection> {
  if (!src) return Promise.reject(new RiveInspectError('No Rive file selected.'))

  return new Promise<RiveInspection>((resolve, reject) => {
    let instance: Rive | null = null
    let settled = false

    // A file that never loads (404, wrong MIME type, corrupt) would otherwise
    // leave the admin panel spinning forever.
    const timeout = setTimeout(() => {
      fail('Timed out loading the Rive file.')
    }, 15000)

    const destroy = () => {
      try {
        instance?.cleanup()
      } catch {
        // already torn down
      }
      instance = null
    }

    function fail(message: string) {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      destroy()
      reject(new RiveInspectError(message))
    }

    function succeed() {
      if (settled) return
      settled = true
      clearTimeout(timeout)

      if (!instance) {
        reject(new RiveInspectError('Rive reported a load with no instance.'))
        return
      }

      // Read BEFORE tearing down — every getter below is backed by WASM memory
      // that cleanup() frees.
      let inspection: RiveInspection
      try {
        inspection = readInspection(instance)
      } catch (err) {
        destroy()
        reject(
          new RiveInspectError(
            err instanceof Error ? err.message : 'Could not read the Rive file.',
          ),
        )
        return
      }

      destroy()
      resolve(inspection)
    }

    try {
      instance = new Rive({
        src,
        canvas: createScratchCanvas(),
        artboard: artboard || undefined,
        autoplay: false,
        // Binds the artboard's default ViewModel instance, which is what exposes
        // both the property list and each enum's allowed values.
        autoBind: true,
        onLoad: succeed,
        onLoadError: () =>
          fail('Could not load the Rive file — check the URL or upload.'),
      })
    } catch (err) {
      fail(err instanceof Error ? err.message : 'Could not start the Rive runtime.')
    }
  })
}

function readInspection(rive: Rive): RiveInspection {
  const artboards: RiveArtboardInfo[] = []

  try {
    for (const ab of rive.contents?.artboards ?? []) {
      artboards.push({
        name: ab.name,
        animations: ab.animations ?? [],
        stateMachines: (ab.stateMachines ?? []).map((sm) => sm.name),
      })
    }
  } catch {
    // contents unavailable — leave the list empty, pickers fall back to text
  }

  const properties: RiveVMProperty[] = []
  let viewModelName: string | null = null

  try {
    const instance = rive.viewModelInstance as unknown as VMInstanceLike | null
    if (instance) {
      viewModelName = instance.viewModelName ?? null
      collectProperties(instance, '', 0, properties)
    }
  } catch {
    // file has no data binding — properties stays empty, which is a valid result
  }

  return { artboards, viewModelName, properties }
}
