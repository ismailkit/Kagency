'use client'

import { useRef, useState, type CSSProperties } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

export type ContactFormAlign = 'left' | 'center' | 'right'

export interface ContactFormStyle {
  /** Text alignment for the form + button. Default 'left'. */
  align?: ContactFormAlign
  /** Accent colour — submit button background + field focus ring. Default brand red. */
  accentColor?: string
  /** Field border colour. Default near-black. */
  borderColor?: string
  /** Field + label text colour. Default near-black. */
  textColor?: string
  /** Submit button text colour. Default white. */
  buttonTextColor?: string
  /** Submit button label. Default 'Send Message'. */
  submitLabel?: string
}

// Responsive, on-brand defaults — match the rest of the site when nothing is set.
const DEFAULTS = {
  align: 'left' as ContactFormAlign,
  accentColor: '#ed1d22',
  borderColor: '#242424',
  textColor: '#242424',
  buttonTextColor: '#ffffff',
  submitLabel: 'Send Message',
}

const alignItems: Record<ContactFormAlign, string> = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
}

export function ContactForm(props: ContactFormStyle = {}) {
  const align = props.align ?? DEFAULTS.align
  const accentColor = props.accentColor || DEFAULTS.accentColor
  const borderColor = props.borderColor || DEFAULTS.borderColor
  const textColor = props.textColor || DEFAULTS.textColor
  const buttonTextColor = props.buttonTextColor || DEFAULTS.buttonTextColor
  const submitLabel = props.submitLabel || DEFAULTS.submitLabel

  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [tokenError, setTokenError] = useState(false)
  const turnstileRef = useRef<TurnstileInstance>(null)
  const tokenRef = useRef<string | null>(null)

  async function onSubmit(formData: FormData) {
    const token = tokenRef.current
    if (!token) {
      setTokenError(true)
      return
    }
    setTokenError(false)
    setStatus('loading')

    const body = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      company: String(formData.get('company') || ''),
      message: String(formData.get('message') || ''),
      turnstileToken: token,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('ok')
    } catch {
      setStatus('error')
      turnstileRef.current?.reset()
      tokenRef.current = null
    }
  }

  // CSS variables consumed by the .cf-field rules in globals.css.
  const rootStyle = {
    textAlign: align,
    '--cf-accent': accentColor,
    '--cf-border': borderColor,
    '--cf-text': textColor,
  } as CSSProperties

  const fieldClass = 'cf-field rounded-xl border-[3px] px-4 py-3 font-sans text-lg'

  return (
    <form action={onSubmit} className={`mt-10 grid gap-4 ${alignItems[align]}`} style={rootStyle}>
      <input required name="name" placeholder="Name" className={`w-full ${fieldClass}`} />
      <input required type="email" name="email" placeholder="Email" className={`w-full ${fieldClass}`} />
      <input name="company" placeholder="Company" className={`w-full ${fieldClass}`} />
      <textarea
        required
        name="message"
        placeholder="Tell us about your project"
        rows={5}
        className={`w-full ${fieldClass}`}
      />
      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={(token) => {
          tokenRef.current = token
          setTokenError(false)
        }}
        onExpire={() => {
          tokenRef.current = null
        }}
        onError={() => {
          tokenRef.current = null
        }}
      />
      {tokenError && (
        <p className="font-sans text-sm text-kred-700">Please complete the security check.</p>
      )}
      <button
        disabled={status === 'loading'}
        style={{ backgroundColor: accentColor, color: buttonTextColor }}
        className="rounded-full px-6 py-3 font-display text-xl uppercase disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : submitLabel}
      </button>
      {status === 'ok' ? (
        <p className="font-sans text-lg text-green-700">Thanks. We will get back to you.</p>
      ) : null}
      {status === 'error' ? (
        <p className="font-sans text-lg text-kred-700">Could not submit. Please try again.</p>
      ) : null}
    </form>
  )
}
