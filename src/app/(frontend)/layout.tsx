import type { Metadata } from 'next'
import { League_Spartan } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PageSettingsProvider } from '@/components/PageSettingsContext'

const prequel = localFont({
  variable: '--font-display',
  src: [
    {
      path: './assets/fonts/Prequel-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './assets/fonts/Prequel-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './assets/fonts/Prequel-bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './assets/fonts/Prequel-bold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: './assets/fonts/Prequel-bolditalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: './assets/fonts/Prequel-bolditalic.woff',
      weight: '700',
      style: 'italic',
    },
  ],
  display: 'swap',
})

const pcd = localFont({
  variable: '--font-handwritten',
  src: [
    {
      path: './assets/fonts/PCD.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
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
    description: 'Strategy, design, development, and growth services from a modern agency studio.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kagency | Creative Agency Portfolio',
    description: 'Strategy, design, development, and growth services from a modern agency studio.',
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
      className={`${prequel.variable} ${leagueSpartan.variable} ${pcd.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white text-kblack-500 antialiased">
        <PageSettingsProvider>
          <Header />
          <main className="flex-1 overflow-hidden">{children}</main>
          <Footer />
        </PageSettingsProvider>
      </body>
    </html>
  )
}
