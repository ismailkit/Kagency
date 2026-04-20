'use client'

import { useState } from 'react'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  async function onSubmit(formData: FormData) {
    setStatus('loading')

    const body = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      company: String(formData.get('company') || ''),
      message: String(formData.get('message') || ''),
    }

    try {
      const res = await fetch(`${CMS_URL}/api/contact-submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Request failed')
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form action={onSubmit} className="mt-10 grid gap-4">
      <input required name="name" placeholder="Name" className="rounded-xl border-[3px] border-kblack-500 px-4 py-3 font-sans text-lg" />
      <input required type="email" name="email" placeholder="Email" className="rounded-xl border-[3px] border-kblack-500 px-4 py-3 font-sans text-lg" />
      <input name="company" placeholder="Company" className="rounded-xl border-[3px] border-kblack-500 px-4 py-3 font-sans text-lg" />
      <textarea required name="message" placeholder="Tell us about your project" rows={5} className="rounded-xl border-[3px] border-kblack-500 px-4 py-3 font-sans text-lg" />
      <button disabled={status === 'loading'} className="rounded-full bg-kred-500 px-6 py-3 font-display text-xl uppercase text-white disabled:opacity-50">
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
      {status === 'ok' ? <p className="font-sans text-lg text-green-700">Thanks. We will get back to you.</p> : null}
      {status === 'error' ? <p className="font-sans text-lg text-kred-700">Could not submit. Please try again.</p> : null}
    </form>
  )
}
