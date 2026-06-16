import { ImageResponse } from 'next/og'

// Branded Open Graph / Twitter card image, generated at the edge.
// Next.js auto-wires the output into og:image and twitter:image for the site.
export const runtime = 'nodejs'
export const alt = 'Kagency — Digital Services Agency'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ed1d22',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        {/* Top row: wordmark + tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 44,
              fontWeight: 900,
              letterSpacing: 8,
            }}
          >
            KAGENCY
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#ffd700',
            }}
          >
            ● studio
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 116,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: -2,
              textTransform: 'uppercase',
            }}
          >
            Digital Services
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 116,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: -2,
              textTransform: 'uppercase',
              color: '#ffd700',
            }}
          >
            Agency
          </div>
        </div>

        {/* Bottom row: services + url */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            fontSize: 26,
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex' }}>
            Strategy · Branding · Design · Web · Growth
          </div>
          <div style={{ display: 'flex', fontWeight: 800 }}>kagency.dev</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
