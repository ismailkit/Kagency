'use client'

/**
 * CookieConsent — a free, dependency-free GDPR-style consent banner wired to
 * Google Consent Mode v2. Consent defaults to "denied" (set in the root layout
 * before any Google tag loads); this component lets the visitor grant/deny the
 * Analytics and Marketing categories and pushes the choice to gtag + dataLayer
 * so GTM and GA4 (G-15V660E572) honour it. The choice is stored in localStorage
 * so it persists and is re-applied before tags fire on the next visit.
 */

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'kagency_consent'

type Categories = { analytics: boolean; marketing: boolean }

type GtagConsent = Record<string, 'granted' | 'denied'>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

function toGcm(cats: Categories): GtagConsent {
  const ads = cats.marketing ? 'granted' : 'denied'
  return {
    analytics_storage: cats.analytics ? 'granted' : 'denied',
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  }
}

function apply(cats: Categories) {
  const gcm = toGcm(cats)
  window.gtag?.('consent', 'update', gcm)
  window.dataLayer?.push({ event: 'cookie_consent_update', consent: cats })
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ categories: cats, gcm, ts: Date.now() }))
  } catch {
    /* storage unavailable — choice applies for this session only */
  }
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [hasChoice, setHasChoice] = useState(true)
  const [cats, setCats] = useState<Categories>({ analytics: false, marketing: false })

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(STORAGE_KEY)
    } catch {
      stored = null
    }
    if (stored) {
      try {
        setCats(JSON.parse(stored).categories ?? { analytics: false, marketing: false })
      } catch {
        /* ignore malformed value */
      }
      setHasChoice(true)
      setOpen(false)
    } else {
      setHasChoice(false)
      setOpen(true)
    }
    setMounted(true)
  }, [])

  // Render nothing during SSR / first paint to avoid a hydration mismatch + flash.
  if (!mounted) return null

  function decide(next: Categories) {
    apply(next)
    setCats(next)
    setHasChoice(true)
    setOpen(false)
    setShowPrefs(false)
  }

  // Floating re-open trigger once a choice exists (GDPR: allow withdrawal anytime)
  if (!open) {
    if (!hasChoice) return null
    return (
      <button
        type="button"
        onClick={() => {
          setShowPrefs(true)
          setOpen(true)
        }}
        aria-label="Cookie settings"
        className="fixed bottom-4 left-4 z-[60] flex h-10 w-10 items-center justify-center border-[3px] border-kblack-500 bg-white text-kblack-500 transition-colors hover:bg-kred-500 hover:text-white hover:border-kred-500"
        title="Cookie settings"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-4-4 4 4 0 0 1-4-4 2 2 0 0 0-2-2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="13" r="1.2" fill="currentColor" />
          <circle cx="14" cy="16" r="1.2" fill="currentColor" />
          <circle cx="15.5" cy="11" r="1.2" fill="currentColor" />
        </svg>
      </button>
    )
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t-[3px] border-kblack-500 bg-white text-kblack-500"
    >
      <div className="site-shell flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="font-sans">
          <p className="text-base font-bold uppercase tracking-wide">We use cookies</p>
          <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-kblack-400">
            We use cookies to run this site and, with your consent, to measure traffic and improve
            your experience. You can accept all, reject non-essential cookies, or choose what to
            allow. See our{' '}
            <a href="/legal" className="font-semibold text-kred-500 underline">
              privacy &amp; cookie policy
            </a>
            .
          </p>

          {showPrefs && (
            <div className="mt-4 flex flex-col gap-3">
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" checked disabled className="mt-1 h-4 w-4 accent-kblack-500" />
                <span>
                  <span className="font-bold uppercase tracking-wide">Necessary</span> — always on.
                  Required for the site to function.
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={cats.analytics}
                  onChange={(e) => setCats((c) => ({ ...c, analytics: e.target.checked }))}
                  className="mt-1 h-4 w-4 accent-kred-500"
                />
                <span>
                  <span className="font-bold uppercase tracking-wide">Analytics</span> — anonymous
                  usage measurement (Google Analytics).
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={cats.marketing}
                  onChange={(e) => setCats((c) => ({ ...c, marketing: e.target.checked }))}
                  className="mt-1 h-4 w-4 accent-kred-500"
                />
                <span>
                  <span className="font-bold uppercase tracking-wide">Marketing</span> — ads
                  personalisation and remarketing.
                </span>
              </label>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {!showPrefs ? (
            <button
              type="button"
              onClick={() => setShowPrefs(true)}
              className="text-sm font-bold uppercase tracking-wide underline"
            >
              Customize
            </button>
          ) : (
            <button
              type="button"
              onClick={() => decide(cats)}
              className="border-[3px] border-kblack-500 px-5 py-2 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-kblack-500 hover:text-white"
            >
              Save choices
            </button>
          )}
          <button
            type="button"
            onClick={() => decide({ analytics: false, marketing: false })}
            className="border-[3px] border-kblack-500 px-5 py-2 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-kblack-500 hover:text-white"
          >
            Reject all
          </button>
          <button
            type="button"
            onClick={() => decide({ analytics: true, marketing: true })}
            className="border-[3px] border-kred-500 bg-kred-500 px-5 py-2 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-kred-700 hover:border-kred-700"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}
