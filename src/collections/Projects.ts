import type { CollectionConfig } from 'payload'

import { canManageContent } from '../access/staff'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: () => true,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'featured', 'publishedAt'],
    // Live-preview the case-study page while editing.
    preview: (doc) =>
      doc?.slug
        ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/projects/${doc.slug}`
        : null,
  },
  hooks: {
    // Auto-generate the slug from the title when left blank, so publishers
    // don't have to hand-write it (and don't trip the unique constraint).
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && typeof data.title === 'string') {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL path: /projects/<slug>. Auto-filled from the title if left blank.',
      },
    },
    {
      name: 'client',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Design', value: 'design' },
        { label: 'Development', value: 'development' },
        { label: 'Brand', value: 'brand' },
        { label: 'Strategy', value: 'strategy' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Used to group projects in the Works showcase grid.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'One or two lines shown on cards and used as the default meta description.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hero / card image. Also used as the default social (OG) image.',
      },
    },
    // ── Case-study meta ──────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'text',
          label: 'Our role',
          admin: {
            width: '50%',
            description: 'e.g. Brand strategy · Web design & build',
          },
        },
        {
          name: 'timeline',
          type: 'text',
          label: 'Timeline / Year',
          admin: {
            width: '25%',
            description: 'e.g. 2026 · 6 weeks',
          },
        },
        {
          name: 'projectUrl',
          type: 'text',
          label: 'Live URL',
          admin: {
            width: '25%',
            description: 'https://…',
          },
        },
      ],
    },
    // ── Case-study body ──────────────────────────────────────────────────────
    {
      name: 'content',
      type: 'richText',
      label: 'Case study',
      admin: {
        description:
          'Full case-study write-up: the challenge, approach, and results. Headings, lists, quotes and links are supported.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Image', plural: 'Gallery images' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
