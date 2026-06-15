'use client'

import { useRef, useState } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

export function ContactForm() {
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
      // Reset widget so the user can try again
      turnstileRef.current?.reset()
      tokenRef.current = null
    }
  }

  return (
    <form action={onSubmit} className="mt-10 grid gap-4">
      <input
        required
        name="name"
        placeholder="Name"
        className="rounded-xl border-[3px] border-kblack-500 px-4 py-3 font-sans text-lg"
      />
      <input
        required
        type="email"
        name="email"
        placeholder="Email"
        className="rounded-xl border-[3px] border-kblack-500 px-4 py-3 font-sans text-lg"
      />
      <input
        name="company"
        placeholder="Company"
        className="rounded-xl border-[3px] border-kblack-500 px-4 py-3 font-sans text-lg"
      />
      <textarea
        required
        name="message"
        placeholder="Tell us about your project"
        rows={5}
        className="rounded-xl border-[3px] border-kblack-500 px-4 py-3 font-sans text-lg"
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
        className="rounded-full bg-kred-500 px-6 py-3 font-display text-xl uppercase text-white disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
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
