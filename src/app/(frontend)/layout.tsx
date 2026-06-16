import type { Metadata } from 'next'
import { League_Spartan, VT323 } from 'next/font/google'
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

const vt323 = VT323({
  variable: '--font-pixel',
  subsets: ['latin'],
  weight: '400',
})

const SITE_NAME = 'Kagency'
const SITE_DESCRIPTION =
  'Kagency is a digital services agency delivering brand strategy, UI/UX design, design systems, web development, and growth marketing — building high-performance websites and digital products that convert.'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Digital Services Agency | Kagency',
    template: '%s | Kagency',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'digital services agency',
    'digital agency',
    'creative agency',
    'web design agency',
    'web development',
    'branding',
    'brand strategy',
    'UI/UX design',
    'design systems',
    'growth marketing',
    'SEO',
    'product design',
    'Kagency',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Digital Services Agency | Kagency',
    description: SITE_DESCRIPTION,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Services Agency | Kagency',
    description: SITE_DESCRIPTION,
    creator: '@kagency',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
      className={`${prequel.variable} ${leagueSpartan.variable} ${pcd.variable} ${vt323.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen text-kblack-500 antialiased">
        <PageSettingsProvider>
          <Header />
          <main className="flex-1 overflow-hidden">{children}</main>
          <Footer />
        </PageSettingsProvider>
      </body>
    </html>
  )
}
