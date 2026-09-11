'use client'

/**
 * Builds one control per data-binding (ViewModel) property found in the selected
 * .riv file, so editors configure an animation against its real properties
 * instead of typing names blind.
 *
 * Payload's field schema is fixed at build time, so these can't be real Payload
 * fields — the whole set is stored in a single JSON field, and this component
 * renders the controls for it.
 *
 * Each property is either:
 *  - Ignored  — nothing is written, the file's own default stands.
 *  - Static   — a fixed value applied when the animation loads.
 *  - Scroll   — driven from scroll progress, remapped onto [min, max].
 *               Offered for numeric and boolean properties only.
 */

import { useField } from '@payloadcms/ui'
import { useEffect, useMemo, type CSSProperties } from 'react'
import { BINDABLE_TYPES, SCROLLABLE_TYPES, type RiveVMProperty } from '@/lib/rive/inspect'
import type { RiveBinding } from '@/lib/rive/bindings'
import { useRiveInspection } from './useRiveInspection'

type FieldComponentProps = {
  path: string
  field?: { label?: string; admin?: { description?: string } }
  readOnly?: boolean
}

interface StoredValue {
  bindings?: RiveBinding[]
  /** Snapshot of the last scan, so rows render without re-reading the file. */
  properties?: RiveVMProperty[]
}

const inputStyle: CSSProperties = { width: '100%', padding: '0.35rem 0.5rem' }
const rowStyle: CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: '4px',
  marginBottom: '0.75rem',
  padding: '0.75rem',
}
const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '0.5rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
  marginTop: '0.5rem',
}

function labelFor(property: RiveVMProperty) {
  return property.path
}

/**
 * A property is "ignored" when it has no stored row at all — so switching a row
 * to Ignore deletes it, and the file's own default stands.
 */
function modeOf(binding: RiveBinding | undefined): 'ignore' | 'static' | 'scroll' {
  if (!binding) return 'ignore'
  return binding.mode === 'scroll' ? 'scroll' : 'static'
}

/**
 * Seeds a value when a row is switched to Static, so the control shows what
 * will actually be written rather than sitting blank and writing nothing.
 */
function staticDefaults(property: RiveVMProperty): Partial<RiveBinding> {
  switch (property.type) {
    case 'number':
    case 'integer':
      return { valueNumber: 0 }
    case 'boolean':
      return { valueBoolean: false }
    case 'string':
      return { valueString: '' }
    case 'color':
      return { valueColor: '#ffffff' }
    case 'enumType':
      return { valueEnum: property.enumValues?.[0] ?? '' }
    default:
      return {}
  }
}

export function RiveBindingsField({ path, field, readOnly }: FieldComponentProps) {
  const { value, setValue } = useField<StoredValue>({ path })
  const { inspection, status, error, src, refresh } = useRiveInspection(path)

  const stored = useMemo<StoredValue>(() => value ?? {}, [value])

  // Prefer a live read; fall back to the snapshot so a page opened offline (or
  // with the media server down) still shows what was configured. Lists, images
  // and artboard references are filtered out — there is no meaningful control
  // to offer for them, and an empty row just reads as broken.
  const properties = (inspection?.properties ?? stored.properties ?? []).filter((p) =>
    BINDABLE_TYPES.includes(p.type),
  )

  // Persist the scanned property list whenever a fresh read differs from the
  // snapshot, so `type` travels with the data to the frontend.
  useEffect(() => {
    if (readOnly || !inspection) return
    const next = inspection.properties
    if (JSON.stringify(next) === JSON.stringify(stored.properties ?? [])) return
    // `true` = don't mark the form modified: this is a cached read, not an edit,
    // and otherwise merely opening a page would prompt about unsaved changes.
    setValue({ ...stored, properties: next }, true)
    // `stored` is derived from `value`; re-running on every keystroke is fine
    // because the JSON comparison above makes this a no-op unless it changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspection, readOnly])

  const bindings = stored.bindings ?? []
  const bindingFor = (p: RiveVMProperty) => bindings.find((b) => b.path === p.path)

  const update = (property: RiveVMProperty, patch: Partial<RiveBinding> | null) => {
    if (readOnly) return
    const rest = bindings.filter((b) => b.path !== property.path)

    if (patch === null) {
      setValue({ ...stored, bindings: rest })
      return
    }

    const existing = bindingFor(property) ?? { path: property.path, type: property.type }
    setValue({
      ...stored,
      bindings: [...rest, { ...existing, ...patch, path: property.path, type: property.type }],
    })
  }

  const description = field?.admin?.description

  return (
    <div className="field-type" style={{ marginBottom: '1.5rem' }}>
      <label className="field-label">{field?.label ?? 'Rive data properties'}</label>
      {description && <div className="field-description">{description}</div>}

      <div style={{ alignItems: 'center', display: 'flex', gap: '0.75rem', margin: '0.5rem 0' }}>
        <button
          className="btn btn--style-secondary btn--size-small"
          disabled={!src || status === 'loading' || readOnly}
          onClick={refresh}
          type="button"
        >
          {status === 'loading' ? 'Reading…' : 'Re-read file'}
        </button>
        <span className="field-description" style={{ margin: 0 }}>
          {!src && 'Select a Rive file above first.'}
          {src && status === 'error' && error}
          {src && status === 'ready' && properties.length === 0 && (
            <>This file has no data-binding properties — nothing to configure.</>
          )}
          {src && status === 'ready' && properties.length > 0 && (
            <>
              {properties.length} propert{properties.length === 1 ? 'y' : 'ies'}
              {inspection?.viewModelName ? ` from “${inspection.viewModelName}”` : ''}
            </>
          )}
        </span>
      </div>

      {properties.map((property) => {
        const binding = bindingFor(property)
        const mode = modeOf(binding)
        const canScroll = SCROLLABLE_TYPES.includes(property.type)

        return (
          <div key={property.path} style={rowStyle}>
            <div style={{ alignItems: 'center', display: 'flex', gap: '0.75rem' }}>
              <strong style={{ flex: 1 }}>{labelFor(property)}</strong>
              <code style={{ color: 'var(--theme-elevation-500)', fontSize: '0.75rem' }}>
                {property.type}
              </code>
              <select
                disabled={readOnly}
                onChange={(e) => {
                  const next = e.target.value
                  if (next === 'ignore') update(property, null)
                  else if (next === 'scroll') update(property, { mode: 'scroll' })
                  else update(property, { mode: 'static', ...staticDefaults(property) })
                }}
                value={mode}
              >
                <option value="ignore">Ignore</option>
                <option value="static">Static value</option>
                {canScroll && <option value="scroll">Drive from scroll</option>}
              </select>
            </div>

            {mode === 'static' && (
              <div style={{ marginTop: '0.5rem' }}>
                {(property.type === 'number' || property.type === 'integer') && (
                  <input
                    disabled={readOnly}
                    onChange={(e) =>
                      update(property, {
                        mode: 'static',
                        valueNumber: e.target.value === '' ? null : Number(e.target.value),
                      })
                    }
                    step={property.type === 'integer' ? 1 : 'any'}
                    style={inputStyle}
                    type="number"
                    value={binding?.valueNumber ?? ''}
                  />
                )}

                {property.type === 'boolean' && (
                  <select
                    disabled={readOnly}
                    onChange={(e) =>
                      update(property, { mode: 'static', valueBoolean: e.target.value === 'true' })
                    }
                    style={inputStyle}
                    value={binding?.valueBoolean === true ? 'true' : 'false'}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                )}

                {property.type === 'string' && (
                  <input
                    disabled={readOnly}
                    onChange={(e) =>
                      update(property, { mode: 'static', valueString: e.target.value })
                    }
                    style={inputStyle}
                    type="text"
                    value={binding?.valueString ?? ''}
                  />
                )}

                {property.type === 'color' && (
                  <input
                    disabled={readOnly}
                    onChange={(e) =>
                      update(property, { mode: 'static', valueColor: e.target.value })
                    }
                    style={{ height: '2.25rem', width: '4rem' }}
                    type="color"
                    value={binding?.valueColor ?? '#ffffff'}
                  />
                )}

                {property.type === 'enumType' && (
                  <select
                    disabled={readOnly}
                    onChange={(e) => update(property, { mode: 'static', valueEnum: e.target.value })}
                    style={inputStyle}
                    value={binding?.valueEnum ?? ''}
                  >
                    <option value="">— choose —</option>
                    {(property.enumValues ?? []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {property.type === 'trigger' && (
                  <div className="field-description" style={{ margin: 0 }}>
                    Triggers are fired by the animation itself — nothing to set here.
                  </div>
                )}
              </div>
            )}

            {mode === 'scroll' && (
              <div style={gridStyle}>
                <label className="field-description">
                  Value at start
                  <input
                    disabled={readOnly}
                    onChange={(e) =>
                      update(property, { scrollMin: Number(e.target.value) })
                    }
                    style={inputStyle}
                    type="number"
                    value={binding?.scrollMin ?? 0}
                  />
                </label>
                <label className="field-description">
                  Value at end
                  <input
                    disabled={readOnly}
                    onChange={(e) => update(property, { scrollMax: Number(e.target.value) })}
                    style={inputStyle}
                    type="number"
                    value={binding?.scrollMax ?? 100}
                  />
                </label>
                <label className="field-description">
                  Scroll start
                  <input
                    disabled={readOnly}
                    onChange={(e) => update(property, { scrollStart: e.target.value })}
                    placeholder="top bottom"
                    style={inputStyle}
                    type="text"
                    value={binding?.scrollStart ?? ''}
                  />
                </label>
                <label className="field-description">
                  Scroll end
                  <input
                    disabled={readOnly}
                    onChange={(e) => update(property, { scrollEnd: e.target.value })}
                    placeholder="bottom top"
                    style={inputStyle}
                    type="text"
                    value={binding?.scrollEnd ?? ''}
                  />
                </label>
                <label className="field-description">
                  Scrub lag (s)
                  <input
                    disabled={readOnly}
                    onChange={(e) => update(property, { scrollScrub: Number(e.target.value) })}
                    step="0.1"
                    style={inputStyle}
                    type="number"
                    value={binding?.scrollScrub ?? 0.5}
                  />
                </label>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
