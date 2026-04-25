'use client'

import Link from 'next/link'

import { KLogo } from '@/components/KLogo'
import { usePageSettings } from '@/components/PageSettingsContext'

const footerLinks = [
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
  { name: 'Legal', href: '/legal' },
]

export function Footer() {
  const { pageTheme } = usePageSettings()
  const isDark = pageTheme === 'dark'

  return (
    <footer className={`site-shell${isDark ? ' text-white' : ''} mb-4`}>
      <div
        className={`section-container section-container--bottom${isDark ? ' border-white' : ''}`}
      >
        <div className="flex items-center justify-between gap-6 px-6 py-8 md:px-10">
          {/* K logo — homepage link */}
          <div className="block">
            <Link href="/" aria-label="Home" className="absolute -bottom-5">
              <span
                className={`flex items-center justify-center rounded-full transition ${
                  isDark ? 'bg-transparent text-white' : 'bg-white text-kred-500'
                }`}
              >
                <KLogo className="h-10 w-10" />
              </span>
            </Link>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-end gap-4 font-sans text-sm font-bold uppercase tracking-wide">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full px-3 pb-0.75 pt-1.5 transition hover:bg-kred-500 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="cursor-pointer">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="rounded-full uppercase px-3 pb-0.75 pt-1.5 transition hover:bg-kred-500 hover:text-white"
                >
                  Back to top
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="flex justify-between align-baseline mt-8">
        <span className="uppercase text-sm text-center font-bold tracking-wide">
          Made with ❤️ by{' '}
          <a href="https://kagency.dev" className="underline">
            Kagency
          </a>
          .
        </span>
        <span className="uppercase text-sm text-center font-bold tracking-wide">
          &copy; {new Date().getFullYear()} Kagency. All rights reserved.{' '}
        </span>
      </div>
    </footer>
  )
}
