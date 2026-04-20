import type { CollectionConfig } from 'payload'

import { canManageContent } from '../access/staff'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
        description: 'Use home, about, services, the-agency, contact',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: [
        {
          slug: 'landingHero',
          labels: {
            singular: 'Landing Hero',
            plural: 'Landing Heroes',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'subtitle',
              type: 'textarea',
              required: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'cta',
              type: 'group',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                },
                {
                  name: 'href',
                  type: 'text',
                },
              ],
            },
            {
              name: 'containerStyle',
              type: 'select',
              defaultValue: 'center',
              options: [
                { label: 'Normal section', value: 'normal' },
                { label: 'Center section', value: 'center' },
                { label: 'Top section', value: 'top' },
                { label: 'Bottom section', value: 'bottom' },
              ],
            },
            {
              name: 'useNoise',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          slug: 'pageHero',
          labels: {
            singular: 'Page Hero',
            plural: 'Page Heroes',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'subtitle',
              type: 'textarea',
            },
            {
              name: 'containerStyle',
              type: 'select',
              defaultValue: 'center',
              options: [
                { label: 'Normal section', value: 'normal' },
                { label: 'Center section', value: 'center' },
                { label: 'Top section', value: 'top' },
                { label: 'Bottom section', value: 'bottom' },
              ],
            },
            {
              name: 'useNoise',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          slug: 'servicesGrid',
          labels: {
            singular: 'Services Grid',
            plural: 'Services Grids',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'featuredOnly',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'limit',
              type: 'number',
              min: 1,
              max: 50,
              admin: {
                description: 'Leave empty for all matching services.',
              },
            },
            {
              name: 'containerStyle',
              type: 'select',
              defaultValue: 'center',
              options: [
                { label: 'Normal section', value: 'normal' },
                { label: 'Center section', value: 'center' },
                { label: 'Top section', value: 'top' },
                { label: 'Bottom section', value: 'bottom' },
              ],
            },
            {
              name: 'useNoise',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          slug: 'projectsGrid',
          labels: {
            singular: 'Projects Grid',
            plural: 'Projects Grids',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'featuredOnly',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'limit',
              type: 'number',
              min: 1,
              max: 50,
              admin: {
                description: 'Leave empty for all matching projects.',
              },
            },
            {
              name: 'containerStyle',
              type: 'select',
              defaultValue: 'bottom',
              options: [
                { label: 'Normal section', value: 'normal' },
                { label: 'Center section', value: 'center' },
                { label: 'Top section', value: 'top' },
                { label: 'Bottom section', value: 'bottom' },
              ],
            },
            {
              name: 'useNoise',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          slug: 'contactForm',
          labels: {
            singular: 'Contact Form',
            plural: 'Contact Forms',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'subtitle',
              type: 'textarea',
            },
            {
              name: 'containerStyle',
              type: 'select',
              defaultValue: 'bottom',
              options: [
                { label: 'Normal section', value: 'normal' },
                { label: 'Center section', value: 'center' },
                { label: 'Top section', value: 'top' },
                { label: 'Bottom section', value: 'bottom' },
              ],
            },
            {
              name: 'useNoise',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
