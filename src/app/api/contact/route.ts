import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, company, message, turnstileToken } = body as Record<string, string>

  // Validate required fields
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Verify Turnstile token
  if (!turnstileToken) {
    return NextResponse.json({ error: 'Missing Turnstile token' }, { status: 400 })
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const verifyForm = new URLSearchParams()
  verifyForm.set('secret', secretKey)
  verifyForm.set('response', turnstileToken)
  // Forward client IP when available
  const clientIP = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')
  if (clientIP) verifyForm.set('remoteip', clientIP)

  const verifyRes = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    body: verifyForm,
  })

  const verifyData = (await verifyRes.json()) as { success: boolean; 'error-codes'?: string[] }

  if (!verifyData.success) {
    return NextResponse.json({ error: 'Turnstile verification failed' }, { status: 400 })
  }

  // Save submission via Payload local API
  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'contact-submissions',
      data: { name, email, company: company ?? '', message },
    })

    // Notify the inbox (best-effort — never block the response on email).
    const to = process.env.CONTACT_TO || 'submissions@kagency.dev'
    const esc = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    try {
      await payload.sendEmail({
        to,
        replyTo: email,
        subject: `New contact form submission — ${name}`,
        html: `
          <h2>New contact form submission</h2>
          <p><strong>Name:</strong> ${esc(name)}</p>
          <p><strong>Email:</strong> ${esc(email)}</p>
          <p><strong>Company:</strong> ${esc(company || '—')}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap">${esc(message)}</p>
        `,
        text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\nCompany: ${
          company || '—'
        }\n\nMessage:\n${message}`,
      })
    } catch (mailErr) {
      console.error('[contact route] email notification failed:', mailErr)
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('[contact route] Payload create failed:', err)
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }
}
