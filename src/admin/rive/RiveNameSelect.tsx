'use client'

/**
 * Replaces the free-text "Artboard" / "State machine" inputs with pickers
 * populated from the selected .riv file.
 *
 * Stays a plain string field underneath, so no data migration and the frontend
 * is unchanged. Falls back to a text input whenever the file can't be read, or
 * when the stored value isn't in the file (a renamed artboard shouldn't silently
 * vanish from the form).
 */

import { useField } from '@payloadcms/ui'
import { useRiveInspection } from './useRiveInspection'

/** Subset of the props Payload hands a custom client field component. */
type FieldComponentProps = {
  path: string
  field?: { label?: string; admin?: { description?: string } }
  readOnly?: boolean
}

function NameSelect({
  path,
  label,
  description,
  options,
  loading,
  error,
  readOnly,
}: {
  path: string
  label: string
  description?: string
  options: string[]
  loading: boolean
  error: string | null
  readOnly?: boolean
}) {
  const { value, setValue } = useField<string>({ path })
  const current = value ?? ''

  // Keep an unknown stored value selectable rather than dropping it.
  const choices = current && !options.includes(current) ? [current, ...options] : options
  const canPick = !error && choices.length > 0

  return (
    <div className="field-type" style={{ marginBottom: '1.5rem' }}>
      <label className="field-label" htmlFor={path}>
        {label}
      </label>

      {canPick ? (
        <select
          disabled={readOnly || loading}
          id={path}
          onChange={(e) => setValue(e.target.value || null)}
          style={{ width: '100%', padding: '0.5rem' }}
          value={current}
        >
          <option value="">{loading ? 'Reading file…' : '— default —'}</option>
          {choices.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      ) : (
        <input
          disabled={readOnly}
          id={path}
          onChange={(e) => setValue(e.target.value || null)}
          placeholder={loading ? 'Reading file…' : 'Type a name'}
          style={{ width: '100%', padding: '0.5rem' }}
          type="text"
          value={current}
        />
      )}

      {description && <div className="field-description">{description}</div>}
      {error && (
        <div className="field-description" style={{ color: 'var(--theme-error-500)' }}>
          {error} Type the name manually.
        </div>
      )}
    </div>
  )
}

export function RiveArtboardSelect({ path, field, readOnly }: FieldComponentProps) {
  const { inspection, status, error } = useRiveInspection(path)

  return (
    <NameSelect
      description={field?.admin?.description}
      error={error}
      label={field?.label ?? 'Artboard'}
      loading={status === 'loading'}
      options={(inspection?.artboards ?? []).map((a) => a.name)}
      path={path}
      readOnly={readOnly}
    />
  )
}

export function RiveStateMachineSelect({ path, field, readOnly }: FieldComponentProps) {
  const { inspection, status, error } = useRiveInspection(path)

  // Flatten across artboards and de-duplicate: editors pick a state machine by
  // name, and the same name on two artboards is one choice to them.
  const names = Array.from(
    new Set<string>((inspection?.artboards ?? []).flatMap((a) => a.stateMachines)),
  )

  return (
    <NameSelect
      description={field?.admin?.description}
      error={error}
      label={field?.label ?? 'State machine'}
      loading={status === 'loading'}
      options={names}
      path={path}
      readOnly={readOnly}
    />
  )
}
