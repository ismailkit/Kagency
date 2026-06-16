import type { Metadata } from 'next'
import { Caveat, League_Spartan, Oswald, VT323 } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const GTM_ID = 'GTM-PX7LRCMB'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PageSettingsProvider } from '@/components/PageSettingsContext'

/*
 * ⚠ TEMPORARY FONT SUBSTITUTION — font licensing in progress.
 * Prequel (display/heading) and PCD (handwritten accent) are proprietary LOCAL
 * faces. Until licensing clears we route their CSS variables to visually-similar
 * Google Fonts: Oswald ≈ Prequel's condensed uppercase display; Caveat ≈ PCD's
 * handwriting. League Spartan (body) and VT323 (pixel accent) are already
 * Google/OFL fonts, so they are unchanged.
 *
 * TO REVERT once licensed: restore the `localFont` import, un-comment the two
 * blocks below, delete the Oswald/Caveat consts, and put `prequel.variable` /
 * `pcd.variable` back into the <html> className. The Prequel/PCD font files are
 * kept in ./assets/fonts — nothing was removed.
 *
 * import localFont from 'next/font/local'
 * const prequel = localFont({
 *   variable: '--font-display',
 *   src: [
 *     { path: './assets/fonts/Prequel-Regular.woff2',    weight: '400', style: 'normal' },
 *     { path: './assets/fonts/Prequel-Regular.woff',     weight: '400', style: 'normal' },
 *     { path: './assets/fonts/Prequel-bold.woff2',       weight: '700', style: 'normal' },
 *     { path: './assets/fonts/Prequel-bold.woff',        weight: '700', style: 'normal' },
 *     { path: './assets/fonts/Prequel-bolditalic.woff2', weight: '700', style: 'italic' },
 *     { path: './assets/fonts/Prequel-bolditalic.woff',  weight: '700', style: 'italic' },
 *   ],
 *   display: 'swap',
 * })
 * const pcd = localFont({
 *   variable: '--font-handwritten',
 *   src: [{ path: './assets/fonts/PCD.woff2', weight: '400', style: 'normal' }],
 *   display: 'swap',
 * })
 */

// Temporary Google substitute for Prequel (condensed uppercase display).
const oswald = Oswald({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

// Temporary Google substitute for PCD (handwritten accent).
const caveat = Caveat({
  variable: '--font-handwritten',
  subsets: ['latin'],
  weight: ['400', '700'],
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
    // ?v=3 cache-busts the favicon: browsers and the Cloudflare edge cache
    // favicons very aggressively, so a new URL forces every client to re-fetch
    // (clients that cached the old 404 would otherwise keep showing no icon).
    icon: [{ url: '/favicon.ico?v=3', sizes: 'any' }],
    shortcut: '/favicon.ico?v=3',
    apple: '/favicon.ico?v=3',
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
      className={`${oswald.variable} ${leagueSpartan.variable} ${caveat.variable} ${vt323.variable}`}
      suppressHydrationWarning
    >
      {/* Google Tag Manager — loaded early via next/script (equivalent to the head snippet) */}
      <Script id="gtm-base" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <body className="min-h-screen text-kblack-500 antialiased">
        {/* Google Tag Manager (noscript) — immediately after opening body */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <PageSettingsProvider>
          <Header />
          <main className="flex-1 overflow-hidden">{children}</main>
          <Footer />
        </PageSettingsProvider>
      </body>
    </html>
  )
}
