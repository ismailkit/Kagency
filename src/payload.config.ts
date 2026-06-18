import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { GenerateTitle, GenerateDescription, GenerateURL } from '@payloadcms/plugin-seo/types'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { ContactSubmissions } from './collections/ContactSubmissions'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const cmsURL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'
const webURL = process.env.WEB_URL || 'http://localhost:3000'
const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kagency.dev'

// ── SEO plugin generators (used for the auto-fill buttons + previews) ────────
const generateTitle: GenerateTitle = ({ doc }) =>
  doc?.title ? `${doc.title} | Kagency` : 'Kagency'
const generateDescription: GenerateDescription = ({ doc }) => doc?.summary ?? ''
const generateURL: GenerateURL = ({ doc }) => `${siteURL}/projects/${doc?.slug ?? ''}`
const allowedOrigins = Array.from(
  new Set([
    cmsURL,
    webURL,
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://localhost:3000',
    'http://localhost:3001',
  ]),
)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' - Kagency CMS',
    },
    suppressHydrationWarning: true,
  },
  collections: [Users, Media, Pages, Services, Projects, ContactSubmissions, Testimonials],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  // SMTP email (nodemailer). Only enabled when SMTP_HOST is configured — otherwise
  // Payload falls back to logging emails to the console, so the app still runs
  // without credentials. Submissions are always saved regardless of email.
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromName: process.env.EMAIL_FROM_NAME || 'Kagency',
        defaultFromAddress: process.env.EMAIL_FROM || 'no-reply@kagency.dev',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
      })
    : undefined,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  sharp,
  plugins: [
    seoPlugin({
      collections: ['projects'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle,
      generateDescription,
      generateURL,
    }),
  ],
})
