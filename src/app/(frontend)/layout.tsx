import type { Metadata } from 'next'
import { Barlow_Condensed, League_Spartan } from 'next/font/google'
import './globals.css'

import { Header } from '@/components/Header'

const barlowCondensed = Barlow_Condensed({
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
})

const leagueSpartan = League_Spartan({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Kagency | Creative Agency Portfolio',
    template: '%s | Kagency',
  },
  description:
    'Kagency is a bold digital agency portfolio focused on strategy, branding, design systems, and high-performance web experiences.',
  openGraph: {
    title: 'Kagency | Creative Agency Portfolio',
    description:
      'Strategy, design, development, and growth services from a modern agency studio.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kagency | Creative Agency Portfolio',
    description:
      'Strategy, design, development, and growth services from a modern agency studio.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${leagueSpartan.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white text-kblack-500 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
