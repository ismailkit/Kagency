import type { CollectionConfig } from 'payload'

import { canManageContent } from '../access/staff'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  upload: {
    adminThumbnail: 'card',
    imageSizes: [
      {
        name: 'thumb',
        width: 320,
      },
      {
        name: 'card',
        width: 960,
      },
      {
        name: 'hero',
        width: 1920,
      },
    ],
    mimeTypes: ['image/*', 'video/*', 'application/octet-stream', 'text/plain'],
  },
}
