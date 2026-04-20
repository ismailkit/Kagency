'use client'

import { motion, type Variants } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'The Agency', href: '/the-agency' },
  { name: 'Contact', href: '/contact' },
]

const sidebarVariants: Variants = {
  open: {
    clipPath: 'circle(1500px at 90% 10%)',
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
    },
  },
  closed: {
    clipPath: 'circle(24px at 110% -10%)',
    transition: {
      delay: 0.25,
      type: 'spring',
      stiffness: 420,
      damping: 42,
    },
  },
}

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="site-shell relative z-50 pt-8 md:pt-10">
      <div className="ms-6 flex items-center justify-between gap-4 bg-white py-5">
        <Link href="/" className="logo-wrap p-2 bg-white md:-mb-12" aria-label="Kagency home">
          <Image
            src="/assets/logo.svg"
            alt="Kagency logo"
            width={224}
            height={64}
            className="h-auto w-44 md:w-64 -rotate-3"
            sizes="(min-width: 768px) 224px, 176px"
            priority
          />
        </Link>

        <button
          className="z-60 inline-flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <motion.svg width="34" height="34" viewBox="0 0 23 23">
            <motion.path
              animate={isOpen ? { d: 'M 3 2.5 L 17 16.5' } : { d: 'M 2 7.5 L 20 7.5' }}
              fill="transparent"
              strokeWidth="2.5"
              stroke="currentColor"
              strokeLinecap="round"
            />
            <motion.path
              animate={isOpen ? { d: 'M 3 16.5 L 17 2.5' } : { d: 'M 2 2.5 L 20 2.5' }}
              fill="transparent"
              strokeWidth="2.5"
              stroke="currentColor"
              strokeLinecap="round"
            />
            <motion.path
              animate={isOpen ? { opacity: 0 } : { opacity: 1, d: 'M 2 12.5 L 20 12.5' }}
              fill="transparent"
              strokeWidth="2.5"
              stroke="currentColor"
              strokeLinecap="round"
            />
          </motion.svg>
        </button>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-4 font-sans text-lg font-bold uppercase tracking-wide">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                      className={`rounded-full px-5 pb-1.25 pt-2 transition ${
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

      <motion.nav
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed inset-0 z-50 flex items-center justify-center bg-kred-500 md:hidden"
      >
        <ul className="flex flex-col items-center gap-7 font-sans text-3xl font-bold uppercase text-white">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setIsOpen(false)} className="rounded-full px-6 py-1 hover:bg-white hover:text-kred-500">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </motion.nav>
    </header>
  )
}
