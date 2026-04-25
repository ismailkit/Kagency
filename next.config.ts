import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
const siteURL = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: siteURL.protocol.replace(':', '') as 'http' | 'https',
        hostname: siteURL.hostname,
        port: siteURL.port,
        pathname: '/api/media/file/**',
      },
      // also allow the canonical /media/** path (used in production)
      {
        protocol: siteURL.protocol.replace(':', '') as 'http' | 'https',
        hostname: siteURL.hostname,
        port: siteURL.port,
        pathname: '/media/**',
      },
      // allow localhost explicitly so dev works regardless of NEXT_PUBLIC_SITE_URL
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/file/**',
      },
      // Unsplash CDN for seed/placeholder images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig)
