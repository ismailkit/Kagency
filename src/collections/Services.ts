import type { CollectionConfig } from 'payload'

import { canManageContent } from '../access/staff'

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    read: () => true,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'order'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: ['Design', 'Development', 'Brand', 'Growth', 'Other'],
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
    },
    {
      name: 'details',
      type: 'richText',
    },
    {
      name: 'iconSVG',
      type: 'textarea',
      admin: {
        description: 'Optional inline SVG markup for icon rendering',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
