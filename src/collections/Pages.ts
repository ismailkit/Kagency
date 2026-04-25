import type { CollectionConfig } from 'payload'

import { canManageContent } from '../access/staff'

// --- Animation field helpers -------------------------------------------------

const ANIM_TYPE_OPTIONS = [
  { label: 'Fade', value: 'fade' },

  { label: 'Fade Up', value: 'fade-up' },

  { label: 'Fade Down', value: 'fade-down' },

  { label: 'Fade Left', value: 'fade-left' },

  { label: 'Fade Right', value: 'fade-right' },

  { label: 'Slide Up', value: 'slide-up' },

  { label: 'Slide Down', value: 'slide-down' },

  { label: 'Slide Left', value: 'slide-left' },

  { label: 'Slide Right', value: 'slide-right' },

  { label: 'Stagger Words', value: 'stagger-words' },
]

const ANIM_EASING_OPTIONS = [
  { label: 'Ease', value: 'ease' },

  { label: 'Ease In', value: 'ease-in' },

  { label: 'Ease Out', value: 'ease-out' },

  { label: 'Ease In-Out', value: 'ease-in-out' },

  { label: 'Linear', value: 'linear' },

  { label: 'Spring', value: 'spring' },
]

// --- Rive block fields (reused in top-level block + flexContent slot) --------

const riveBlockFields = [
  // --- Source ---------------------------------------------

  {
    name: 'riveFile',

    type: 'upload' as const,

    relationTo: 'media' as const,

    label: 'Rive file (.riv)',

    admin: {
      description: 'Upload a .riv file from the Media library. Takes priority over the URL field.',
    },
  },

  {
    name: 'riveUrl',

    type: 'text' as const,

    label: 'Rive URL (fallback)',

    admin: {
      description: 'External URL to a .riv file. Used only when no file is uploaded above.',
    },
  },

  // --- Artboard & animations -------------------------------

  {
    type: 'row' as const,

    fields: [
      {
        name: 'artboard',

        type: 'text' as const,

        label: 'Artboard',

        admin: {
          description: 'Name of the artboard to render. Leave blank for the default artboard.',
        },
      },

      {
        name: 'animation',

        type: 'text' as const,

        label: 'Animation name',

        admin: {
          description:
            'Name of the animation to play or scrub. Not needed when using a state machine.',
        },
      },
    ],
  },

  // --- State machine ---------------------------------------

  {
    type: 'row' as const,

    fields: [
      {
        name: 'stateMachine',

        type: 'text' as const,

        label: 'State machine name',

        admin: {
          description: 'Name of the state machine to activate (optional).',
        },
      },

      {
        name: 'scrollInput',

        type: 'text' as const,

        label: 'Scroll input name',

        admin: {
          description:
            'Name of a 0�100 Number input in the state machine to drive with scroll progress. Recommended for state-machine-based scroll scrub.',
        },
      },
    ],
  },

  // --- Playback --------------------------------------------

  {
    type: 'row' as const,

    fields: [
      {
        name: 'mode',

        type: 'select' as const,

        label: 'Playback mode',

        defaultValue: 'autoplay',

        options: [
          { label: 'Autoplay', value: 'autoplay' },

          { label: 'Loop', value: 'loop' },

          { label: 'Scroll scrub', value: 'scroll-scrub' },
        ],
      },

      {
        name: 'animDuration',

        type: 'number' as const,

        label: 'Animation duration (s)',

        defaultValue: 2,

        min: 0.1,

        max: 120,

        admin: {
          description:
            'Duration of the animation in seconds. Required for direct timeline scrub (when no scroll input is set).',

          condition: (_: unknown, s: { mode?: string }) => s?.mode === 'scroll-scrub',
        },
      },
    ],
  },

  // --- Scroll scrub range ----------------------------------

  {
    type: 'row' as const,

    fields: [
      {
        name: 'scrubStart',

        type: 'text' as const,

        label: 'Scrub start',

        defaultValue: 'top 80%',

        admin: {
          description: 'GSAP ScrollTrigger start, e.g. "top 80%". Scrubbing begins here.',

          condition: (_: unknown, s: { mode?: string }) => s?.mode === 'scroll-scrub',
        },
      },

      {
        name: 'scrubEnd',

        type: 'text' as const,

        label: 'Scrub end',

        defaultValue: 'bottom 20%',

        admin: {
          description: 'GSAP ScrollTrigger end, e.g. "bottom 20%". Scrubbing ends here.',

          condition: (_: unknown, s: { mode?: string }) => s?.mode === 'scroll-scrub',
        },
      },
    ],
  },

  // --- Display ---------------------------------------------

  {
    type: 'row' as const,

    fields: [
      {
        name: 'fit',

        type: 'select' as const,

        label: 'Fit',

        defaultValue: 'contain',

        options: [
          { label: 'Contain', value: 'contain' },

          { label: 'Cover', value: 'cover' },

          { label: 'Fill', value: 'fill' },

          { label: 'Fit width', value: 'fitWidth' },

          { label: 'Fit height', value: 'fitHeight' },

          { label: 'None', value: 'none' },
        ],
      },

      {
        name: 'alignment',

        type: 'select' as const,

        label: 'Alignment',

        defaultValue: 'center',

        options: [
          { label: 'Center', value: 'center' },

          { label: 'Top left', value: 'topLeft' },

          { label: 'Top center', value: 'topCenter' },

          { label: 'Top right', value: 'topRight' },

          { label: 'Center left', value: 'centerLeft' },

          { label: 'Center right', value: 'centerRight' },

          { label: 'Bottom left', value: 'bottomLeft' },

          { label: 'Bottom center', value: 'bottomCenter' },

          { label: 'Bottom right', value: 'bottomRight' },
        ],
      },

      {
        name: 'aspect',

        type: 'select' as const,

        label: 'Aspect ratio',

        defaultValue: '16/9',

        options: [
          { label: '16 : 9', value: '16/9' },

          { label: '4 : 3', value: '4/3' },

          { label: '1 : 1', value: '1/1' },

          { label: '9 : 16', value: '9/16' },

          { label: '3 : 4', value: '3/4' },

          { label: 'Auto (fill height)', value: 'auto' },
        ],
      },
    ],
  },
]

function animFields(prefix: string, label: string) {
  const togKey = `${prefix}Anim`

  const cond = (_: unknown, s: Record<string, unknown>) => !!s?.[togKey]

  return [
    {
      name: togKey,

      type: 'checkbox' as const,

      label: `Animate ${label}`,

      defaultValue: false,
    },

    {
      type: 'row' as const,

      fields: [
        {
          name: `${prefix}AnimType`,

          type: 'select' as const,

          label: 'Type',

          defaultValue: 'fade-up',

          options: ANIM_TYPE_OPTIONS,

          admin: { condition: cond },
        },

        {
          name: `${prefix}AnimEasing`,

          type: 'select' as const,

          label: 'Easing',

          defaultValue: 'ease-out',

          options: ANIM_EASING_OPTIONS,

          admin: { condition: cond },
        },

        {
          name: `${prefix}AnimDuration`,

          type: 'number' as const,

          label: 'Duration (ms)',

          defaultValue: 600,

          min: 50,

          max: 4000,

          admin: { condition: cond },
        },

        {
          name: `${prefix}AnimDelay`,

          type: 'number' as const,

          label: 'Delay (ms)',

          defaultValue: 0,

          min: 0,

          max: 5000,

          admin: { condition: cond },
        },
      ],
    },
  ]
}

const backgroundsField = {
  name: 'backgrounds',

  type: 'array' as const,

  label: 'Background Layers',

  admin: {
    description: 'Stacked bottom-to-top like Figma. First layer = bottom of stack.',
  },

  fields: [
    {
      name: 'type',

      type: 'select' as const,

      required: true,

      defaultValue: 'solid',

      options: [
        { label: 'Solid Color', value: 'solid' },

        { label: 'Gradient', value: 'gradient' },

        { label: 'Image', value: 'image' },

        { label: 'Inline SVG', value: 'svg' },
      ],
    },

    {
      name: 'color',

      type: 'text' as const,

      label: 'Color (hex, rgb(), hsl(), oklch()…)',

      admin: {
        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'solid',
      },
    },

    {
      name: 'gradient',

      type: 'text' as const,

      label: 'Gradient (full CSS: linear-gradient(…) or radial-gradient(…))',

      admin: {
        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'gradient',
      },
    },

    {
      name: 'image',

      type: 'upload' as const,

      relationTo: 'media' as const,

      admin: {
        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'image',
      },
    },

    {
      name: 'svgCode',

      type: 'textarea' as const,

      label: 'SVG Code',

      admin: {
        description:
          'Paste the full <svg>…</svg> markup. The SVG renders inline — not as an <img>. Width/height are set on the <svg> element itself.',

        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'svg',
      },
    },

    {
      name: 'svgTop',

      type: 'text' as const,

      label: 'SVG Top',

      admin: {
        description: 'CSS top — relative to the section content area. E.g. 0, 50%, -20px',

        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'svg',
      },
    },

    {
      name: 'svgRight',

      type: 'text' as const,

      label: 'SVG Right',

      admin: {
        description: 'CSS right — relative to the section content area. E.g. 0, 10%, -40px',

        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'svg',
      },
    },

    {
      name: 'svgBottom',

      type: 'text' as const,

      label: 'SVG Bottom',

      admin: {
        description: 'CSS bottom — relative to the section content area. E.g. 0, 50%, -20px',

        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'svg',
      },
    },

    {
      name: 'svgLeft',

      type: 'text' as const,

      label: 'SVG Left',

      admin: {
        description: 'CSS left — relative to the section content area. E.g. 0, 10%, -40px',

        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'svg',
      },
    },

    {
      name: 'svgTransform',

      type: 'text' as const,

      label: 'SVG Transform',

      admin: {
        description:
          'CSS transform applied to the SVG element. E.g. scale(1.2), rotate(45deg), translate(-50%, -50%)',

        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'svg',
      },
    },

    {
      name: 'enableTransform',

      type: 'checkbox' as const,

      label: 'Enable Background Transform',

      defaultValue: false,

      admin: {
        description: 'Override background position, size and repeat.',
      },
    },

    {
      name: 'bgSize',

      type: 'text' as const,

      label: 'Background Size',

      admin: {
        description: 'CSS background-size: cover, contain, 100% auto, 200px…',

        condition: (_: unknown, siblingData: { enableTransform?: boolean }) =>
          siblingData?.enableTransform === true,
      },
    },

    {
      name: 'bgPosition',

      type: 'text' as const,

      label: 'Background Position',

      admin: {
        description: 'CSS background-position: center, top left, 50% 25%…',

        condition: (_: unknown, siblingData: { enableTransform?: boolean }) =>
          siblingData?.enableTransform === true,
      },
    },

    {
      name: 'bgRepeat',

      type: 'select' as const,

      label: 'Background Repeat',

      defaultValue: 'no-repeat',

      options: [
        { label: 'No Repeat', value: 'no-repeat' },

        { label: 'Repeat', value: 'repeat' },

        { label: 'Repeat X', value: 'repeat-x' },

        { label: 'Repeat Y', value: 'repeat-y' },
      ],

      admin: {
        condition: (_: unknown, siblingData: { enableTransform?: boolean }) =>
          siblingData?.enableTransform === true,
      },
    },

    {
      name: 'blendMode',

      type: 'select' as const,

      defaultValue: 'normal',

      options: [
        { label: 'Normal', value: 'normal' },

        { label: 'Multiply', value: 'multiply' },

        { label: 'Screen', value: 'screen' },

        { label: 'Overlay', value: 'overlay' },

        { label: 'Darken', value: 'darken' },

        { label: 'Lighten', value: 'lighten' },

        { label: 'Color Dodge', value: 'color-dodge' },

        { label: 'Color Burn', value: 'color-burn' },

        { label: 'Hard Light', value: 'hard-light' },

        { label: 'Soft Light', value: 'soft-light' },

        { label: 'Difference', value: 'difference' },

        { label: 'Exclusion', value: 'exclusion' },
      ],
    },

    {
      name: 'opacity',

      type: 'number' as const,

      defaultValue: 1,

      min: 0,

      max: 1,

      admin: {
        step: 0.01,

        description: '0 = transparent · 1 = fully opaque',
      },
    },
  ],
}

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
      name: 'pageSettings',

      label: 'Page Settings',

      type: 'group',

      admin: {
        description: 'Global visual settings applied to the whole page.',
      },

      fields: [
        {
          name: 'pageTheme',

          type: 'select',

          defaultValue: 'light',

          options: [
            { label: 'Light', value: 'light' },

            { label: 'Dark', value: 'dark' },
          ],

          admin: {
            description: 'Dark: header/footer are transparent, logo turns white.',
          },
        },

        {
          name: 'noise',

          label: 'Page-wide Noise',

          type: 'select',

          defaultValue: 'none',

          options: [
            { label: 'None', value: 'none' },

            { label: 'Solid', value: 'solid' },

            { label: 'Gradient (transparent → noise)', value: 'gradient' },
          ],
        },

        backgroundsField,
      ],
    },

    {
      name: 'layout',

      type: 'blocks',

      required: true,

      blocks: [
        {
          slug: 'section',

          labels: { singular: 'Section', plural: 'Sections' },

          fields: [
            {
              name: 'containerStyle',
              type: 'select' as const,
              defaultValue: 'normal',
              options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Center', value: 'center' },
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' },
                { label: 'Scroll Jack (fullscreen capture)', value: 'scroll-jack' },
              ],
            },
            {
              name: 'borderType',

              type: 'select' as const,

              label: 'Border',

              defaultValue: 'none',

              options: [
                { label: 'None (default)', value: 'none' },

                { label: 'Solid Color', value: 'solid' },

                { label: 'Gradient', value: 'gradient' },
              ],
            },

            {
              name: 'borderColor',

              type: 'text' as const,

              label: 'Border Color (CSS color)',

              admin: {
                description: 'E.g. #ffffff, rgba(255,255,255,0.3)',

                condition: (_: unknown, siblingData: { borderType?: string }) =>
                  siblingData?.borderType === 'solid',
              },
            },

            {
              name: 'borderGradient',

              type: 'text' as const,

              label: 'Border Gradient (CSS gradient)',

              admin: {
                description:
                  'Full CSS gradient: linear-gradient(to right, #f00, #00f). Note: border-radius is not preserved.',

                condition: (_: unknown, siblingData: { borderType?: string }) =>
                  siblingData?.borderType === 'gradient',
              },
            },

            {
              type: 'row' as const,

              fields: [
                {
                  name: 'paddingTop',

                  type: 'select' as const,

                  label: 'Padding Top',

                  defaultValue: 'none',

                  options: [
                    { label: 'None', value: 'none' },

                    { label: 'Small', value: 'sm' },

                    { label: 'Medium', value: 'md' },

                    { label: 'Large', value: 'lg' },

                    { label: 'X-Large', value: 'xl' },
                  ],
                },

                {
                  name: 'paddingBottom',

                  type: 'select' as const,

                  label: 'Padding Bottom',

                  defaultValue: 'none',

                  options: [
                    { label: 'None', value: 'none' },

                    { label: 'Small', value: 'sm' },

                    { label: 'Medium', value: 'md' },

                    { label: 'Large', value: 'lg' },

                    { label: 'X-Large', value: 'xl' },
                  ],
                },

                {
                  name: 'paddingX',

                  type: 'select' as const,

                  label: 'Padding Left/Right',

                  defaultValue: 'none',

                  options: [
                    { label: 'None', value: 'none' },

                    { label: 'Small', value: 'sm' },

                    { label: 'Medium', value: 'md' },

                    { label: 'Large', value: 'lg' },

                    { label: 'X-Large', value: 'xl' },
                  ],
                },
              ],
            },

            {
              name: 'allowOverflow',

              type: 'checkbox' as const,

              label: 'Allow overflow',

              defaultValue: false,

              admin: {
                description:
                  'Lets background layers bleed beyond this section into adjacent sections.',
              },
            },

            {
              name: 'useNoise',

              type: 'select' as const,

              defaultValue: 'none',

              options: [
                { label: 'None', value: 'none' },

                { label: 'Solid Noise', value: 'solid' },

                { label: 'Gradient (transparent → noise)', value: 'gradient' },
              ],
            },

            backgroundsField,

            // -- Scroll-jack settings (only when containerStyle = scroll-jack) ---
            {
              type: 'row' as const,
              fields: [
                {
                  name: 'scrollJackHeight',
                  type: 'number' as const,
                  label: 'Scroll height (vh)',
                  defaultValue: 200,
                  min: 50,
                  max: 1000,
                  admin: {
                    description:
                      'Extra vertical space (in vh) that the section captures for scrolling.',
                    condition: (_: unknown, s: { containerStyle?: string }) =>
                      s?.containerStyle === 'scroll-jack',
                  },
                },
                {
                  name: 'scrollJackScrub',
                  type: 'number' as const,
                  label: 'Scrub smoothness (s)',
                  defaultValue: 1.2,
                  min: 0,
                  max: 5,
                  admin: {
                    description: 'GSAP scrub lag in seconds. 0 = rigid, higher = softer.',
                    condition: (_: unknown, s: { containerStyle?: string }) =>
                      s?.containerStyle === 'scroll-jack',
                  },
                },
              ],
            },
            // ── Flex layout (for child blocks) ──────────────────────────

            {
              type: 'row' as const,

              fields: [
                {
                  name: 'flexDirection',

                  type: 'select' as const,

                  label: 'Direction',

                  admin: { description: 'Leave empty for block stacking (default).' },

                  options: [
                    { label: 'Column', value: 'column' },

                    { label: 'Row', value: 'row' },

                    { label: 'Row reverse', value: 'row-reverse' },

                    { label: 'Column reverse', value: 'column-reverse' },
                  ],
                },

                {
                  name: 'flexJustify',

                  type: 'select' as const,

                  label: 'Justify',

                  defaultValue: 'start',

                  options: [
                    { label: 'Start', value: 'start' },

                    { label: 'Center', value: 'center' },

                    { label: 'End', value: 'end' },

                    { label: 'Space between', value: 'between' },

                    { label: 'Space around', value: 'around' },

                    { label: 'Space evenly', value: 'evenly' },
                  ],

                  admin: {
                    condition: (_: unknown, s: { flexDirection?: string }) => !!s?.flexDirection,
                  },
                },

                {
                  name: 'flexAlign',

                  type: 'select' as const,

                  label: 'Align',

                  defaultValue: 'stretch',

                  options: [
                    { label: 'Stretch', value: 'stretch' },

                    { label: 'Start', value: 'start' },

                    { label: 'Center', value: 'center' },

                    { label: 'End', value: 'end' },
                  ],

                  admin: {
                    condition: (_: unknown, s: { flexDirection?: string }) => !!s?.flexDirection,
                  },
                },

                {
                  name: 'flexGap',

                  type: 'select' as const,

                  label: 'Gap',

                  defaultValue: 'md',

                  options: [
                    { label: 'Small', value: 'sm' },

                    { label: 'Medium', value: 'md' },

                    { label: 'Large', value: 'lg' },

                    { label: 'X-Large', value: 'xl' },
                  ],

                  admin: {
                    condition: (_: unknown, s: { flexDirection?: string }) => !!s?.flexDirection,
                  },
                },

                {
                  name: 'flexWrap',

                  type: 'checkbox' as const,

                  label: 'Wrap',

                  defaultValue: false,

                  admin: {
                    condition: (_: unknown, s: { flexDirection?: string }) => !!s?.flexDirection,
                  },
                },
              ],
            },

            {
              name: 'block',

              label: 'Content Blocks',

              type: 'blocks' as const,

              minRows: 0,

              blocks: [
                {
                  slug: 'landingHero',

                  labels: { singular: 'Landing Hero', plural: 'Landing Heroes' },

                  fields: [
                    { name: 'title', type: 'text' as const, required: true },

                    { name: 'subtitle', type: 'textarea' as const, required: true },

                    { name: 'image', type: 'upload' as const, relationTo: 'media' as const },

                    {
                      name: 'cta',

                      type: 'group' as const,

                      fields: [
                        { name: 'label', type: 'text' as const },

                        { name: 'href', type: 'text' as const },
                      ],
                    },

                    {
                      name: 'paddingX',

                      type: 'select' as const,

                      label: 'Padding left/right',

                      defaultValue: 'md',

                      options: [
                        { label: 'None', value: 'none' },

                        { label: 'Small', value: 'sm' },

                        { label: 'Medium', value: 'md' },

                        { label: 'Large', value: 'lg' },

                        { label: 'X-Large', value: 'xl' },
                      ],
                    },

                    {
                      type: 'collapsible' as const,

                      label: 'Scroll animations',

                      admin: { initCollapsed: true },

                      fields: [
                        ...animFields('title', 'title'),

                        ...animFields('subtitle', 'subtitle'),

                        ...animFields('cta', 'CTA'),

                        ...animFields('image', 'image'),
                      ],
                    },
                  ],
                },

                {
                  slug: 'pageHero',

                  labels: { singular: 'Page Hero', plural: 'Page Heroes' },

                  fields: [
                    { name: 'title', type: 'text' as const, required: true },

                    { name: 'subtitle', type: 'textarea' as const },

                    {
                      name: 'paddingX',

                      type: 'select' as const,

                      label: 'Padding left/right',

                      defaultValue: 'md',

                      options: [
                        { label: 'None', value: 'none' },

                        { label: 'Small', value: 'sm' },

                        { label: 'Medium', value: 'md' },

                        { label: 'Large', value: 'lg' },

                        { label: 'X-Large', value: 'xl' },
                      ],
                    },

                    {
                      type: 'collapsible' as const,

                      label: 'Scroll animations',

                      admin: { initCollapsed: true },

                      fields: [
                        ...animFields('title', 'title'),

                        ...animFields('subtitle', 'subtitle'),

                        ...animFields('content', 'content slot'),
                      ],
                    },
                  ],
                },

                {
                  slug: 'servicesGrid',

                  labels: { singular: 'Services Grid', plural: 'Services Grids' },

                  fields: [
                    { name: 'title', type: 'text' as const, required: true },

                    { name: 'featuredOnly', type: 'checkbox' as const, defaultValue: false },

                    {
                      name: 'limit',

                      type: 'number' as const,

                      min: 1,

                      max: 50,

                      admin: { description: 'Leave empty for all matching services.' },
                    },

                    {
                      name: 'paddingX',

                      type: 'select' as const,

                      label: 'Padding left/right',

                      defaultValue: 'md',

                      options: [
                        { label: 'None', value: 'none' },

                        { label: 'Small', value: 'sm' },

                        { label: 'Medium', value: 'md' },

                        { label: 'Large', value: 'lg' },

                        { label: 'X-Large', value: 'xl' },
                      ],
                    },

                    {
                      type: 'collapsible' as const,

                      label: 'Scroll animations',

                      admin: { initCollapsed: true },

                      fields: [
                        ...animFields('title', 'title'),

                        ...animFields('items', 'grid items'),

                        {
                          name: 'itemsAnimStagger',

                          type: 'number' as const,

                          label: 'Item stagger (ms)',

                          defaultValue: 100,

                          min: 0,

                          max: 1000,

                          admin: {
                            description: 'Delay added per item (0 = all at once).',

                            condition: (_: unknown, s: { itemsAnim?: boolean }) => !!s?.itemsAnim,
                          },
                        },
                      ],
                    },
                  ],
                },

                {
                  slug: 'projectsGrid',

                  labels: { singular: 'Projects Grid', plural: 'Projects Grids' },

                  fields: [
                    { name: 'title', type: 'text' as const, required: true },

                    { name: 'featuredOnly', type: 'checkbox' as const, defaultValue: true },

                    {
                      name: 'limit',

                      type: 'number' as const,

                      min: 1,

                      max: 50,

                      admin: { description: 'Leave empty for all matching projects.' },
                    },

                    {
                      name: 'paddingX',

                      type: 'select' as const,

                      label: 'Padding left/right',

                      defaultValue: 'md',

                      options: [
                        { label: 'None', value: 'none' },

                        { label: 'Small', value: 'sm' },

                        { label: 'Medium', value: 'md' },

                        { label: 'Large', value: 'lg' },

                        { label: 'X-Large', value: 'xl' },
                      ],
                    },

                    {
                      type: 'collapsible' as const,

                      label: 'Scroll animations',

                      admin: { initCollapsed: true },

                      fields: [
                        ...animFields('title', 'title'),

                        ...animFields('items', 'grid items'),

                        {
                          name: 'itemsAnimStagger',

                          type: 'number' as const,

                          label: 'Item stagger (ms)',

                          defaultValue: 100,

                          min: 0,

                          max: 1000,

                          admin: {
                            description: 'Delay added per item (0 = all at once).',

                            condition: (_: unknown, s: { itemsAnim?: boolean }) => !!s?.itemsAnim,
                          },
                        },
                      ],
                    },
                  ],
                },

                {
                  slug: 'contactForm',

                  labels: { singular: 'Contact Form', plural: 'Contact Forms' },

                  fields: [
                    { name: 'title', type: 'text' as const, required: true },

                    { name: 'subtitle', type: 'textarea' as const },

                    {
                      name: 'paddingX',

                      type: 'select' as const,

                      label: 'Padding left/right',

                      defaultValue: 'md',

                      options: [
                        { label: 'None', value: 'none' },

                        { label: 'Small', value: 'sm' },

                        { label: 'Medium', value: 'md' },

                        { label: 'Large', value: 'lg' },

                        { label: 'X-Large', value: 'xl' },
                      ],
                    },

                    {
                      type: 'collapsible' as const,

                      label: 'Scroll animations',

                      admin: { initCollapsed: true },

                      fields: [
                        ...animFields('title', 'title'),

                        ...animFields('subtitle', 'subtitle'),

                        ...animFields('content', 'form slot'),
                      ],
                    },
                  ],
                },

                {
                  slug: 'ksun',

                  labels: { singular: 'Ksun', plural: 'Ksuns' },

                  fields: [
                    { name: 'title', type: 'text' as const, required: true },

                    { name: 'subtitle', type: 'textarea' as const },

                    {
                      name: 'paddingX',

                      type: 'select' as const,

                      label: 'Padding left/right',

                      defaultValue: 'md',

                      options: [
                        { label: 'None', value: 'none' },

                        { label: 'Small', value: 'sm' },

                        { label: 'Medium', value: 'md' },

                        { label: 'Large', value: 'lg' },

                        { label: 'X-Large', value: 'xl' },
                      ],
                    },

                    {
                      type: 'collapsible' as const,

                      label: 'Scroll animations',

                      admin: { initCollapsed: true },

                      fields: [
                        ...animFields('title', 'title'),

                        ...animFields('subtitle', 'subtitle'),
                      ],
                    },
                  ],
                },

                {
                  slug: 'flexContent',

                  labels: { singular: 'Flex Content', plural: 'Flex Content Blocks' },

                  fields: [
                    // -- Layout ----------------------------------------------

                    {
                      type: 'row' as const,

                      fields: [
                        {
                          name: 'textAlign',

                          type: 'select' as const,

                          label: 'Text align',

                          defaultValue: 'left',

                          options: [
                            { label: 'Left', value: 'left' },

                            { label: 'Center', value: 'center' },

                            { label: 'Right', value: 'right' },
                          ],
                        },

                        {
                          name: 'contentWidth',

                          type: 'select' as const,

                          label: 'Max width',

                          defaultValue: 'lg',

                          options: [
                            { label: 'Small (576px)', value: 'sm' },

                            { label: 'Medium (768px)', value: 'md' },

                            { label: 'Large (1024px)', value: 'lg' },

                            { label: 'Full width', value: 'full' },
                          ],
                        },

                        {
                          name: 'columnSplit',

                          type: 'select' as const,

                          label: 'Column split',

                          defaultValue: '50-50',

                          options: [
                            { label: '50 / 50', value: '50-50' },

                            { label: '60 / 40', value: '60-40' },

                            { label: '40 / 60', value: '40-60' },

                            { label: '70 / 30', value: '70-30' },

                            { label: '30 / 70', value: '30-70' },
                          ],
                        },
                      ],
                    },

                    {
                      type: 'row' as const,

                      fields: [
                        {
                          name: 'paddingTop',

                          type: 'select' as const,

                          label: 'Padding top',

                          defaultValue: 'md',

                          options: [
                            { label: 'None', value: 'none' },

                            { label: 'Small', value: 'sm' },

                            { label: 'Medium', value: 'md' },

                            { label: 'Large', value: 'lg' },

                            { label: 'X-Large', value: 'xl' },
                          ],
                        },

                        {
                          name: 'paddingBottom',

                          type: 'select' as const,

                          label: 'Padding bottom',

                          defaultValue: 'md',

                          options: [
                            { label: 'None', value: 'none' },

                            { label: 'Small', value: 'sm' },

                            { label: 'Medium', value: 'md' },

                            { label: 'Large', value: 'lg' },

                            { label: 'X-Large', value: 'xl' },
                          ],
                        },

                        {
                          name: 'paddingX',

                          type: 'select' as const,

                          label: 'Padding left/right',

                          defaultValue: 'md',

                          options: [
                            { label: 'None', value: 'none' },

                            { label: 'Small', value: 'sm' },

                            { label: 'Medium', value: 'md' },

                            { label: 'Large', value: 'lg' },

                            { label: 'X-Large', value: 'xl' },
                          ],
                        },

                        {
                          name: 'gap',

                          type: 'select' as const,

                          label: 'Content gap',

                          defaultValue: 'md',

                          options: [
                            { label: 'Small', value: 'sm' },

                            { label: 'Medium', value: 'md' },

                            { label: 'Large', value: 'lg' },

                            { label: 'X-Large', value: 'xl' },
                          ],
                        },
                      ],
                    },

                    // ── Content ─────────────────────────────────────────────

                    { name: 'eyebrow', type: 'text' as const, label: 'Eyebrow label' },

                    {
                      type: 'row' as const,

                      fields: [
                        {
                          name: 'eyebrowSize',

                          type: 'select' as const,

                          label: 'Eyebrow size',

                          defaultValue: 'xs',

                          options: [
                            { label: 'XS', value: 'xs' },

                            { label: 'SM', value: 'sm' },

                            { label: 'MD', value: 'md' },
                          ],

                          admin: {
                            condition: (_: unknown, s: { eyebrow?: string }) => !!s?.eyebrow,
                          },
                        },

                        {
                          name: 'eyebrowWeight',

                          type: 'select' as const,

                          label: 'Eyebrow weight',

                          defaultValue: 'bold',

                          options: [
                            { label: 'Normal', value: 'normal' },

                            { label: 'Medium', value: 'medium' },

                            { label: 'Semibold', value: 'semibold' },

                            { label: 'Bold', value: 'bold' },
                          ],

                          admin: {
                            condition: (_: unknown, s: { eyebrow?: string }) => !!s?.eyebrow,
                          },
                        },
                      ],
                    },

                    {
                      name: 'heading',

                      type: 'text' as const,
                    },

                    {
                      type: 'row' as const,

                      fields: [
                        {
                          name: 'headingSize',

                          type: 'select' as const,

                          label: 'Heading size',

                          defaultValue: 'lg',

                          options: [
                            { label: 'Small', value: 'sm' },

                            { label: 'Medium', value: 'md' },

                            { label: 'Large', value: 'lg' },

                            { label: 'X-Large', value: 'xl' },

                            { label: '2X-Large', value: '2xl' },
                          ],
                        },

                        {
                          name: 'headingStyle',

                          type: 'select' as const,

                          label: 'Heading font',

                          defaultValue: 'display',

                          options: [
                            { label: 'Display (condensed italic)', value: 'display' },

                            { label: 'Sans (bold)', value: 'sans' },

                            { label: 'Handwritten', value: 'handwritten' },
                          ],
                        },

                        {
                          name: 'headingWeight',

                          type: 'select' as const,

                          label: 'Heading weight',

                          defaultValue: 'bold',

                          options: [
                            { label: 'Light', value: 'light' },

                            { label: 'Normal', value: 'normal' },

                            { label: 'Medium', value: 'medium' },

                            { label: 'Semibold', value: 'semibold' },

                            { label: 'Bold', value: 'bold' },

                            { label: 'Extrabold', value: 'extrabold' },

                            { label: 'Black', value: 'black' },
                          ],
                        },
                      ],
                    },

                    { name: 'body', type: 'textarea' as const },

                    {
                      type: 'row' as const,

                      fields: [
                        {
                          name: 'bodySize',

                          type: 'select' as const,

                          label: 'Body size',

                          defaultValue: 'xl',

                          options: [
                            { label: 'SM', value: 'sm' },

                            { label: 'MD', value: 'md' },

                            { label: 'LG', value: 'lg' },

                            { label: 'XL', value: 'xl' },

                            { label: '2XL', value: '2xl' },
                          ],

                          admin: { condition: (_: unknown, s: { body?: string }) => !!s?.body },
                        },

                        {
                          name: 'bodyWeight',

                          type: 'select' as const,

                          label: 'Body weight',

                          defaultValue: 'normal',

                          options: [
                            { label: 'Light', value: 'light' },

                            { label: 'Normal', value: 'normal' },

                            { label: 'Medium', value: 'medium' },

                            { label: 'Semibold', value: 'semibold' },

                            { label: 'Bold', value: 'bold' },
                          ],

                          admin: { condition: (_: unknown, s: { body?: string }) => !!s?.body },
                        },
                      ],
                    },

                    {
                      name: 'headingAccent',

                      type: 'text' as const,

                      label: 'Heading accent (handwritten)',
                    },

                    {
                      type: 'row' as const,

                      fields: [
                        {
                          name: 'headingAccentSize',

                          type: 'select' as const,

                          label: 'Accent size',

                          defaultValue: 'md',

                          options: [
                            { label: 'XS', value: 'xs' },

                            { label: 'SM', value: 'sm' },

                            { label: 'MD', value: 'md' },

                            { label: 'LG', value: 'lg' },

                            { label: 'XL', value: 'xl' },

                            { label: '2XL', value: '2xl' },

                            { label: '3XL', value: '3xl' },

                            { label: '4XL', value: '4xl' },
                          ],

                          admin: {
                            condition: (_: unknown, s: { headingAccent?: string }) =>
                              !!s?.headingAccent,
                          },
                        },

                        {
                          name: 'headingAccentX',

                          type: 'number' as const,

                          label: 'Accent X offset (rem)',

                          defaultValue: -1,

                          admin: {
                            condition: (_: unknown, s: { headingAccent?: string }) =>
                              !!s?.headingAccent,
                          },
                        },

                        {
                          name: 'headingAccentY',

                          type: 'number' as const,

                          label: 'Accent Y offset (rem)',

                          defaultValue: -0.75,

                          admin: {
                            condition: (_: unknown, s: { headingAccent?: string }) =>
                              !!s?.headingAccent,
                          },
                        },
                      ],
                    },

                    {
                      name: 'headingAccentPage',

                      type: 'relationship' as const,

                      relationTo: 'pages' as const,

                      label: 'Accent link (page)',

                      admin: {
                        condition: (_: unknown, s: { headingAccent?: string }) =>
                          !!s?.headingAccent,
                      },
                    },

                    {
                      type: 'row' as const,

                      fields: [
                        { name: 'ctaLabel', type: 'text' as const, label: 'CTA label' },

                        { name: 'ctaHref', type: 'text' as const, label: 'CTA URL (manual)' },

                        {
                          name: 'ctaPage',

                          type: 'relationship' as const,

                          relationTo: 'pages' as const,

                          label: 'CTA page',

                          admin: { description: 'Overrides CTA URL when set.' },
                        },

                        {
                          name: 'ctaStyle',

                          type: 'select' as const,

                          label: 'CTA style',

                          defaultValue: 'filled',

                          options: [
                            { label: 'Filled', value: 'filled' },

                            { label: 'Outline', value: 'outline' },

                            { label: 'Text link', value: 'text' },
                          ],
                        },
                      ],
                    },

                    {
                      name: 'image',

                      type: 'upload' as const,

                      relationTo: 'media' as const,
                    },

                    {
                      name: 'imageAspect',

                      type: 'select' as const,

                      label: 'Image aspect ratio',

                      defaultValue: 'landscape',

                      options: [
                        { label: 'Landscape 4:3', value: 'landscape' },

                        { label: 'Video 16:9', value: 'video' },

                        { label: 'Square 1:1', value: 'square' },

                        { label: 'Portrait 2:3', value: 'portrait' },

                        { label: 'Auto (natural size)', value: 'auto' },
                      ],

                      admin: {
                        condition: (_: unknown, s: { image?: unknown }) => !!s?.image,
                      },
                    },

                    // ── Colors ──────────────────────────────────────────────

                    {
                      type: 'collapsible' as const,

                      label: 'Text colors',

                      fields: [
                        {
                          type: 'row' as const,

                          fields: [
                            {
                              name: 'colorEyebrow',

                              type: 'text' as const,

                              label: 'Eyebrow color',

                              admin: { description: 'CSS color e.g. #ed1d22' },
                            },

                            {
                              name: 'colorHeading',

                              type: 'text' as const,

                              label: 'Heading color',

                              admin: { description: 'CSS color' },
                            },

                            {
                              name: 'colorBody',

                              type: 'text' as const,

                              label: 'Body color',

                              admin: { description: 'CSS color' },
                            },

                            {
                              name: 'colorCta',

                              type: 'text' as const,

                              label: 'CTA color',

                              admin: { description: 'CSS color' },
                            },
                          ],
                        },
                      ],
                    },

                    // -- Animations ----------------------------------------------------------

                    {
                      type: 'collapsible' as const,

                      label: 'Scroll animations',

                      admin: { initCollapsed: true },

                      fields: [
                        ...animFields('eyebrow', 'eyebrow'),

                        ...animFields('heading', 'heading'),

                        ...animFields('accent', 'accent'),

                        ...animFields('body', 'body'),

                        ...animFields('cta', 'CTA'),

                        ...animFields('slot', 'image / slot'),
                      ],
                    },
                  ],
                },

                {
                  slug: 'landingWorks',

                  labels: { singular: 'Landing Works', plural: 'Landing Works' },

                  fields: [
                    {
                      name: 'columns',

                      type: 'array' as const,

                      minRows: 3,

                      maxRows: 3,

                      label: 'Poster Columns (exactly 3)',

                      admin: {
                        description:
                          'Each column cycles through projects of the selected category. Left \u2192 right.',
                      },

                      fields: [
                        {
                          name: 'label',

                          type: 'text' as const,

                          required: true,

                          admin: {
                            description: 'Display label shown on the card (e.g. "Design").',
                          },
                        },

                        {
                          name: 'category',

                          type: 'select' as const,

                          required: true,

                          options: [
                            { label: 'Design', value: 'design' },

                            { label: 'Development', value: 'development' },

                            { label: 'Brand', value: 'brand' },

                            { label: 'Strategy', value: 'strategy' },

                            { label: 'Other', value: 'other' },
                          ],
                        },

                        {
                          name: 'cardTitle',

                          type: 'text' as const,

                          admin: { description: 'Handwritten title shown below the poster card.' },
                        },

                        {
                          name: 'cardSubtitle',

                          type: 'text' as const,

                          admin: {
                            description: 'Handwritten subtitle shown below the poster card.',
                          },
                        },
                      ],
                    },

                    {
                      type: 'collapsible' as const,

                      label: 'Scroll animations',

                      admin: { initCollapsed: true },

                      fields: [...animFields('section', 'section')],
                    },

                    {
                      name: 'paddingX',

                      type: 'select' as const,

                      label: 'Padding left/right',

                      defaultValue: 'md',

                      options: [
                        { label: 'None', value: 'none' },

                        { label: 'Small', value: 'sm' },

                        { label: 'Medium', value: 'md' },

                        { label: 'Large', value: 'lg' },

                        { label: 'X-Large', value: 'xl' },
                      ],
                    },
                  ],
                },

                // --- Rive ----------------------------------------------------

                {
                  slug: 'rive',

                  labels: { singular: 'Rive Animation', plural: 'Rive Animations' },

                  fields: riveBlockFields,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
