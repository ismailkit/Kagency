'use client'

import gsap from 'gsap'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Logo } from '@/components/Logo'
import { usePageSettings } from '@/components/PageSettingsContext'

const links = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'The Agency', href: '/the-agency' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { pageTheme } = usePageSettings()
  const isDark = pageTheme === 'dark'
  const navRef = useRef<HTMLElement>(null)

  // Animate mobile nav open/close via GSAP clipPath
  useEffect(() => {
    if (!navRef.current) return
    gsap.to(navRef.current, {
      clipPath: isOpen ? 'circle(1500px at 90% 10%)' : 'circle(24px at 110% -10%)',
      duration: isOpen ? 0.55 : 0.35,
      ease: isOpen ? 'power2.out' : 'power3.in',
    })
  }, [isOpen])

  return (
    <header className="site-shell relative z-50 pt-8 md:pt-10">
      <div className={`ms-6 flex items-center justify-between gap-4 py-5`}>
        <Link
          href="/"
          className={`logo-wrap md:-mb-12 ${isDark ? 'bg-kblack-500' : 'bg-white'}`}
          aria-label="Kagency home"
        >
          <Logo
            className={`h-auto w-44 md:w-64 -rotate-3 ${isDark ? 'text-white' : 'text-[#e42125]'}`}
          />
        </Link>

        {/* Hamburger — three CSS lines, no SVG morphing needed */}
        <button
          className="z-60 relative inline-flex h-10 w-10 flex-col items-center justify-center gap-1.25 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span
            className={`block h-[2.5px] w-5.5 bg-current origin-center transition-transform duration-300${
              isOpen ? ' translate-y-[7.5px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-[2.5px] w-5.5 bg-current transition-opacity duration-200${
              isOpen ? ' opacity-0' : ''
            }`}
          />
          <span
            className={`block h-[2.5px] w-5.5 bg-current origin-center transition-transform duration-300${
              isOpen ? ' -translate-y-[7.5px] -rotate-45' : ''
            }`}
          />
        </button>

        <nav className="hidden md:block">
          <ul
            className={`flex items-center gap-4 font-sans text-sm leading-none font-bold uppercase tracking-wide${isDark ? ' text-white' : ''}`}
          >
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`rounded-full px-3 pb-0.75 pt-1.5 transition ${
                      isActive ? 'bg-kred-500 text-white' : 'hover:bg-kred-500 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile nav — GSAP animates clipPath, pointer-events toggled via state */}
      <nav
        ref={navRef}
        style={{
          clipPath: 'circle(24px at 110% -10%)',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-kred-500 md:hidden"
      >
        <ul className="flex flex-col items-center gap-7 font-sans text-3xl font-bold uppercase text-white">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-full px-6 py-1 hover:bg-white hover:text-kred-500"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
