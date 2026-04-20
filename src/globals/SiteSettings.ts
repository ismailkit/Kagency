import type { GlobalConfig } from 'payload'

import { canManageContent } from '../access/staff'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: canManageContent,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Kagency',
    },
    {
      name: 'siteTagline',
      type: 'text',
      defaultValue: 'Agency portfolio and creative studio',
    },
    {
      name: 'defaultMetaTitle',
      type: 'text',
      defaultValue: 'Kagency - Creative Agency Portfolio',
    },
    {
      name: 'defaultMetaDescription',
      type: 'textarea',
      defaultValue:
        'Kagency is a bold creative agency portfolio focused on strategy, design, and digital product experiences.',
    },
    {
      name: 'socialImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'contactEmail',
      type: 'email',
      defaultValue: 'hello@kagency.com',
    },
  ],
}
