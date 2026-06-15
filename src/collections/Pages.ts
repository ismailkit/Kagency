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
  { label: 'Scale', value: 'scale' },
  { label: 'Scale Up', value: 'scale-up' },
  { label: 'Scale Down', value: 'scale-down' },
  { label: 'Scale Left', value: 'scale-left' },
  { label: 'Scale Right', value: 'scale-right' },
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
    name: 'stateMachine',

    type: 'text' as const,

    label: 'State machine name',

    admin: {
      description: 'Name of the state machine to activate (optional).',
    },
  },

  // --- Playback --------------------------------------------

  {
    name: 'mode',

    type: 'select' as const,

    label: 'Playback mode',

    defaultValue: 'autoplay',

    options: [
      { label: 'Autoplay (once)', value: 'autoplay' },

      { label: 'Loop', value: 'loop' },
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

  // --- Scroll transform ------------------------------------

  {
    type: 'collapsible' as const,

    label: 'Scroll transform',

    admin: { initCollapsed: true },

    fields: [
      {
        name: 'stEnabled',
        type: 'checkbox' as const,
        label: 'Enable scroll transform',
        defaultValue: false,
        admin: { description: 'Animate this element with GSAP as it scrolls into view.' },
      },

      {
        type: 'row' as const,
        fields: [
          {
            name: 'stStart',
            type: 'text' as const,
            label: 'Trigger start',
            defaultValue: 'top bottom',
            admin: {
              description: 'e.g. "top bottom", "top 80%"',
              condition: (_: unknown, s: { stEnabled?: boolean }) => !!s?.stEnabled,
            },
          },
          {
            name: 'stEnd',
            type: 'text' as const,
            label: 'Trigger end',
            defaultValue: 'top 20%',
            admin: {
              description: 'e.g. "top 20%", "center center"',
              condition: (_: unknown, s: { stEnabled?: boolean }) => !!s?.stEnabled,
            },
          },
          {
            name: 'stScrub',
            type: 'number' as const,
            label: 'Scrub (s)',
            defaultValue: 1,
            min: 0,
            max: 10,
            admin: {
              description: '0 = rigid lock to scroll, >0 = lag in seconds',
              condition: (_: unknown, s: { stEnabled?: boolean }) => !!s?.stEnabled,
            },
          },
        ],
      },

      {
        type: 'row' as const,
        fields: [
          {
            name: 'stXFrom',
            type: 'number' as const,
            label: 'X from (px)',
            admin: {
              description: 'Leave blank to skip. e.g. 200 = slide in from right',
              condition: (_: unknown, s: { stEnabled?: boolean }) => !!s?.stEnabled,
            },
          },
          {
            name: 'stXTo',
            type: 'number' as const,
            label: 'X to (px)',
            defaultValue: 0,
            admin: { condition: (_: unknown, s: { stEnabled?: boolean }) => !!s?.stEnabled },
          },
        ],
      },

      {
        type: 'row' as const,
        fields: [
          {
            name: 'stYFrom',
            type: 'number' as const,
            label: 'Y from (px)',
            admin: {
              description: 'Leave blank to skip. e.g. 100 = slide in from below',
              condition: (_: unknown, s: { stEnabled?: boolean }) => !!s?.stEnabled,
            },
          },
          {
            name: 'stYTo',
            type: 'number' as const,
            label: 'Y to (px)',
            defaultValue: 0,
            admin: { condition: (_: unknown, s: { stEnabled?: boolean }) => !!s?.stEnabled },
          },
        ],
      },

      {
        type: 'row' as const,
        fields: [
          {
            name: 'stScaleFrom',
            type: 'number' as const,
            label: 'Scale from',
            admin: {
              description: 'Leave blank to skip. e.g. 0.8 = scale up on entrance',
              condition: (_: unknown, s: { stEnabled?: boolean }) => !!s?.stEnabled,
            },
          },
          {
            name: 'stScaleTo',
            type: 'number' as const,
            label: 'Scale to',
            defaultValue: 1,
            admin: { condition: (_: unknown, s: { stEnabled?: boolean }) => !!s?.stEnabled },
          },
        ],
      },

      {
        type: 'row' as const,
        fields: [
          {
            name: 'stOpacityFrom',
            type: 'number' as const,
            label: 'Opacity from',
            min: 0,
            max: 1,
            admin: {
              description: 'Leave blank to skip. e.g. 0 = fade in',
              condition: (_: unknown, s: { stEnabled?: boolean }) => !!s?.stEnabled,
            },
          },
          {
            name: 'stOpacityTo',
            type: 'number' as const,
            label: 'Opacity to',
            defaultValue: 1,
            min: 0,
            max: 1,
            admin: { condition: (_: unknown, s: { stEnabled?: boolean }) => !!s?.stEnabled },
          },
        ],
      },

      {
        name: 'stMobileOverride',
        type: 'checkbox' as const,
        label: 'Different values on mobile',
        defaultValue: false,
        admin: {
          description: 'Set separate from/to values for screens below lg (1024px)',
          condition: (_: unknown, s: { stEnabled?: boolean }) => !!s?.stEnabled,
        },
      },

      {
        type: 'row' as const,
        fields: [
          {
            name: 'stMobileXFrom',
            type: 'number' as const,
            label: 'Mobile X from (px)',
            admin: {
              condition: (_: unknown, s: { stEnabled?: boolean; stMobileOverride?: boolean }) =>
                !!s?.stEnabled && !!s?.stMobileOverride,
            },
          },
          {
            name: 'stMobileXTo',
            type: 'number' as const,
            label: 'Mobile X to (px)',
            defaultValue: 0,
            admin: {
              condition: (_: unknown, s: { stEnabled?: boolean; stMobileOverride?: boolean }) =>
                !!s?.stEnabled && !!s?.stMobileOverride,
            },
          },
        ],
      },

      {
        type: 'row' as const,
        fields: [
          {
            name: 'stMobileYFrom',
            type: 'number' as const,
            label: 'Mobile Y from (px)',
            admin: {
              condition: (_: unknown, s: { stEnabled?: boolean; stMobileOverride?: boolean }) =>
                !!s?.stEnabled && !!s?.stMobileOverride,
            },
          },
          {
            name: 'stMobileYTo',
            type: 'number' as const,
            label: 'Mobile Y to (px)',
            defaultValue: 0,
            admin: {
              condition: (_: unknown, s: { stEnabled?: boolean; stMobileOverride?: boolean }) =>
                !!s?.stEnabled && !!s?.stMobileOverride,
            },
          },
        ],
      },

      {
        type: 'row' as const,
        fields: [
          {
            name: 'stMobileScaleFrom',
            type: 'number' as const,
            label: 'Mobile scale from',
            admin: {
              condition: (_: unknown, s: { stEnabled?: boolean; stMobileOverride?: boolean }) =>
                !!s?.stEnabled && !!s?.stMobileOverride,
            },
          },
          {
            name: 'stMobileScaleTo',
            type: 'number' as const,
            label: 'Mobile scale to',
            defaultValue: 1,
            admin: {
              condition: (_: unknown, s: { stEnabled?: boolean; stMobileOverride?: boolean }) =>
                !!s?.stEnabled && !!s?.stMobileOverride,
            },
          },
        ],
      },

      {
        type: 'row' as const,
        fields: [
          {
            name: 'stMobileOpacityFrom',
            type: 'number' as const,
            label: 'Mobile opacity from',
            min: 0,
            max: 1,
            admin: {
              condition: (_: unknown, s: { stEnabled?: boolean; stMobileOverride?: boolean }) =>
                !!s?.stEnabled && !!s?.stMobileOverride,
            },
          },
          {
            name: 'stMobileOpacityTo',
            type: 'number' as const,
            label: 'Mobile opacity to',
            defaultValue: 1,
            min: 0,
            max: 1,
            admin: {
              condition: (_: unknown, s: { stEnabled?: boolean; stMobileOverride?: boolean }) =>
                !!s?.stEnabled && !!s?.stMobileOverride,
            },
          },
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

        { label: 'Video', value: 'video' },

        { label: 'Rive Animation', value: 'rive' },
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
      name: 'videoSrc',

      type: 'text' as const,

      label: 'Video URL / path',

      admin: {
        description: 'Absolute URL or /media/… path to an mp4/webm file.',

        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'video',
      },
    },

    {
      name: 'videoFile',

      type: 'upload' as const,

      relationTo: 'media' as const,

      label: 'Video File (Media Library)',

      admin: {
        description:
          'Pick a video from the Media Library. Takes precedence over Video URL if both are set.',

        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'video',
      },
    },

    {
      name: 'videoAutoplay',

      type: 'checkbox' as const,

      label: 'Autoplay',

      defaultValue: true,

      admin: {
        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'video',
      },
    },

    {
      name: 'videoLoop',

      type: 'checkbox' as const,

      label: 'Loop',

      defaultValue: true,

      admin: {
        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'video',
      },
    },

    {
      name: 'videoMuted',

      type: 'checkbox' as const,

      label: 'Muted',

      defaultValue: true,

      admin: {
        description: 'Must be true for autoplay to work in most browsers.',

        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'video',
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

    // ── Rive background fields ───────────────────────────────────────────

    {
      name: 'riveFile',

      type: 'upload' as const,

      relationTo: 'media' as const,

      label: 'Rive File (.riv)',

      admin: {
        description:
          'Upload a .riv file from the Media library. Takes priority over the URL field.',

        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'rive',
      },
    },

    {
      name: 'riveUrl',

      type: 'text' as const,

      label: 'Rive URL (fallback)',

      admin: {
        description: 'External URL to a .riv file. Used only when no file is uploaded above.',

        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'rive',
      },
    },

    {
      type: 'row' as const,

      fields: [
        {
          name: 'riveArtboard',

          type: 'text' as const,

          label: 'Artboard name',

          admin: {
            description: "Leave blank for the file's default artboard.",

            condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'rive',
          },
        },

        {
          name: 'riveStateMachine',

          type: 'text' as const,

          label: 'State machine name',

          admin: {
            condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'rive',
          },
        },
      ],
    },

    {
      type: 'row' as const,

      fields: [
        {
          name: 'riveFit',

          type: 'select' as const,

          label: 'Fit',

          defaultValue: 'cover',

          options: [
            { label: 'Cover', value: 'cover' },
            { label: 'Contain', value: 'contain' },
            { label: 'Fill', value: 'fill' },
            { label: 'Fit Width', value: 'fitWidth' },
            { label: 'Fit Height', value: 'fitHeight' },
            { label: 'Scale Down', value: 'scaleDown' },
            { label: 'None', value: 'none' },
          ],

          admin: {
            condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'rive',
          },
        },

        {
          name: 'riveAlignment',

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

          admin: {
            condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'rive',
          },
        },
      ],
    },

    // ── Rive scroll scrub ────────────────────────────────────────────────

    {
      name: 'riveScrubEnabled',

      type: 'checkbox' as const,

      label: 'Enable scroll scrub (drive Rive input from scroll)',

      defaultValue: false,

      admin: {
        condition: (_: unknown, siblingData: { type?: string }) => siblingData?.type === 'rive',
      },
    },

    {
      name: 'riveScrubProperty',

      type: 'text' as const,

      label: 'Rive input name',

      admin: {
        description: 'Name of the Number or Boolean state machine input to scrub.',

        condition: (_: unknown, siblingData: { type?: string; riveScrubEnabled?: boolean }) =>
          siblingData?.type === 'rive' && !!siblingData?.riveScrubEnabled,
      },
    },

    {
      name: 'riveScrubInputType',

      type: 'select' as const,

      label: 'Input type',

      defaultValue: 'number',

      options: [
        { label: 'Number', value: 'number' },
        { label: 'Boolean (triggered at 50% scroll)', value: 'boolean' },
      ],

      admin: {
        condition: (_: unknown, siblingData: { type?: string; riveScrubEnabled?: boolean }) =>
          siblingData?.type === 'rive' && !!siblingData?.riveScrubEnabled,
      },
    },

    {
      type: 'row' as const,

      fields: [
        {
          name: 'riveScrubMin',

          type: 'number' as const,

          label: 'Value at scroll start',

          defaultValue: 0,

          admin: {
            condition: (_: unknown, siblingData: { type?: string; riveScrubEnabled?: boolean }) =>
              siblingData?.type === 'rive' && !!siblingData?.riveScrubEnabled,
          },
        },

        {
          name: 'riveScrubMax',

          type: 'number' as const,

          label: 'Value at scroll end',

          defaultValue: 100,

          admin: {
            condition: (_: unknown, siblingData: { type?: string; riveScrubEnabled?: boolean }) =>
              siblingData?.type === 'rive' && !!siblingData?.riveScrubEnabled,
          },
        },
      ],
    },

    {
      type: 'row' as const,

      fields: [
        {
          name: 'riveScrubStart',

          type: 'text' as const,

          label: 'Scroll trigger start',

          defaultValue: 'top bottom',

          admin: {
            description: 'e.g. "top bottom", "top 80%"',

            condition: (_: unknown, siblingData: { type?: string; riveScrubEnabled?: boolean }) =>
              siblingData?.type === 'rive' && !!siblingData?.riveScrubEnabled,
          },
        },

        {
          name: 'riveScrubEnd',

          type: 'text' as const,

          label: 'Scroll trigger end',

          defaultValue: 'bottom top',

          admin: {
            description: 'e.g. "bottom top", "bottom 20%"',

            condition: (_: unknown, siblingData: { type?: string; riveScrubEnabled?: boolean }) =>
              siblingData?.type === 'rive' && !!siblingData?.riveScrubEnabled,
          },
        },

        {
          name: 'riveScrubStrength',

          type: 'number' as const,

          label: 'Scrub lag (s)',

          defaultValue: 0.5,

          min: 0,

          max: 10,

          admin: {
            description: '0 = snap to scroll. >0 = lag in seconds.',

            condition: (_: unknown, siblingData: { type?: string; riveScrubEnabled?: boolean }) =>
              siblingData?.type === 'rive' && !!siblingData?.riveScrubEnabled,
          },
        },
      ],
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
          type: 'row' as const,
          fields: [
            {
              name: 'headerTheme',
              type: 'select' as const,
              label: 'Header theme override',
              options: [
                { label: 'Inherit from page', value: 'inherit' },
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ],
              defaultValue: 'inherit',
              admin: {
                description: 'Override the page theme for the header only.',
              },
            },
            {
              name: 'footerTheme',
              type: 'select' as const,
              label: 'Footer theme override',
              options: [
                { label: 'Inherit from page', value: 'inherit' },
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ],
              defaultValue: 'inherit',
              admin: {
                description: 'Override the page theme for the footer only.',
              },
            },
          ],
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
              type: 'row' as const,
              fields: [
                {
                  name: 'minHeightMobile',
                  type: 'select' as const,
                  label: 'Min height (mobile)',
                  defaultValue: 'auto',
                  options: [
                    { label: 'Auto', value: 'auto' },
                    { label: '50vh', value: '50vh' },
                    { label: '75vh', value: '75vh' },
                    { label: 'Full screen (100vh)', value: 'screen' },
                  ],
                },
                {
                  name: 'minHeightDesktop',
                  type: 'select' as const,
                  label: 'Min height (desktop)',
                  defaultValue: 'auto',
                  options: [
                    { label: 'Auto', value: 'auto' },
                    { label: '50vh', value: '50vh' },
                    { label: '75vh', value: '75vh' },
                    { label: 'Full screen (100vh)', value: 'screen' },
                  ],
                },
              ],
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
            // ──             // -- Section entrance animation ---
            {
              name: 'entranceAnim',
              type: 'checkbox' as const,
              label: 'Enable entrance animation',
              defaultValue: false,
              admin: {
                description: 'Scale / slide / fade this section in as it enters the viewport.',
                condition: (_: unknown, s: { containerStyle?: string }) =>
                  s?.containerStyle !== 'scroll-jack',
              },
            },
            {
              type: 'row' as const,
              fields: [
                {
                  name: 'entranceType',
                  type: 'select' as const,
                  label: 'Animation type',
                  defaultValue: 'scale',
                  options: ANIM_TYPE_OPTIONS,
                  admin: {
                    condition: (
                      _: unknown,
                      s: { entranceAnim?: boolean; containerStyle?: string },
                    ) => !!s?.entranceAnim && s?.containerStyle !== 'scroll-jack',
                  },
                },
                {
                  name: 'entranceEasing',
                  type: 'select' as const,
                  label: 'Easing',
                  defaultValue: 'ease-out',
                  options: ANIM_EASING_OPTIONS,
                  admin: {
                    condition: (
                      _: unknown,
                      s: { entranceAnim?: boolean; containerStyle?: string },
                    ) => !!s?.entranceAnim && s?.containerStyle !== 'scroll-jack',
                  },
                },
                {
                  name: 'entranceDuration',
                  type: 'number' as const,
                  label: 'Duration (ms)',
                  defaultValue: 700,
                  min: 100,
                  max: 3000,
                  admin: {
                    condition: (
                      _: unknown,
                      s: { entranceAnim?: boolean; containerStyle?: string },
                    ) => !!s?.entranceAnim && s?.containerStyle !== 'scroll-jack',
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

                    { name: 'subtitle', type: 'richText' as const, required: true },

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

                    { name: 'subtitle', type: 'richText' as const },

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

                    { name: 'subtitle', type: 'richText' as const },

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

                    { name: 'subtitle', type: 'richText' as const },

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

                    { name: 'body', type: 'richText' as const },

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

                    // ── Image size & position ────────────────────────────────
                    {
                      type: 'row' as const,
                      fields: [
                        {
                          name: 'imageWidth',
                          type: 'number' as const,
                          label: 'Image width (px)',
                          admin: {
                            description:
                              'Optional fixed width in pixels. Leave blank for full width.',
                            condition: (_: unknown, s: { image?: unknown }) => !!s?.image,
                          },
                        },
                        {
                          name: 'imageHeight',
                          type: 'number' as const,
                          label: 'Image height (px)',
                          admin: {
                            description: 'Optional fixed height in pixels.',
                            condition: (_: unknown, s: { image?: unknown }) => !!s?.image,
                          },
                        },
                      ],
                    },
                    {
                      type: 'row' as const,
                      fields: [
                        {
                          name: 'imagePosition',
                          type: 'select' as const,
                          label: 'Image position',
                          defaultValue: 'below-text',
                          options: [
                            { label: 'Above title', value: 'above-title' },
                            { label: 'Above body text', value: 'above-text' },
                            { label: 'Below text (default)', value: 'below-text' },
                          ],
                          admin: {
                            condition: (_: unknown, s: { image?: unknown }) => !!s?.image,
                          },
                        },
                        {
                          name: 'imageAlign',
                          type: 'select' as const,
                          label: 'Image alignment',
                          defaultValue: 'left',
                          options: [
                            { label: 'Left', value: 'left' },
                            { label: 'Center', value: 'center' },
                            { label: 'Right', value: 'right' },
                          ],
                          admin: {
                            condition: (_: unknown, s: { image?: unknown }) => !!s?.image,
                          },
                        },
                      ],
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
                              name: 'colorHeadingAccent',

                              type: 'text' as const,

                              label: 'Accent color',

                              admin: {
                                description: 'CSS color for the heading accent text',
                                condition: (_: unknown, s: { headingAccent?: string }) =>
                                  !!s?.headingAccent,
                              },
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
                {
                  slug: 'scrollBeliefs',
                  labels: { singular: 'Scroll Beliefs', plural: 'Scroll Beliefs' },
                  fields: [
                    {
                      name: 'beliefs',
                      type: 'array' as const,
                      label: 'Beliefs',
                      minRows: 2,
                      maxRows: 8,
                      fields: [
                        { name: 'number', type: 'text' as const, label: 'Number (e.g. 01)' },
                        {
                          name: 'eyebrow',
                          type: 'text' as const,
                          label: 'Eyebrow (label above title)',
                        },
                        { name: 'title', type: 'text' as const, label: 'Title', required: true },
                        { name: 'body', type: 'richText' as const, label: 'Body text' },
                      ],
                    },
                    {
                      type: 'row' as const,
                      fields: [
                        {
                          name: 'titleSize',
                          type: 'select' as const,
                          label: 'Title size',
                          defaultValue: 'xl',
                          options: [
                            { label: 'SM', value: 'sm' },
                            { label: 'MD', value: 'md' },
                            { label: 'LG', value: 'lg' },
                            { label: 'XL', value: 'xl' },
                            { label: '2XL', value: '2xl' },
                            { label: '3XL', value: '3xl' },
                          ],
                        },
                        {
                          name: 'bodySize',
                          type: 'select' as const,
                          label: 'Body size',
                          defaultValue: 'md',
                          options: [
                            { label: 'SM', value: 'sm' },
                            { label: 'MD', value: 'md' },
                            { label: 'LG', value: 'lg' },
                            { label: 'XL', value: 'xl' },
                            { label: '2XL', value: '2xl' },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'vhPerBelief',
                      type: 'number' as const,
                      label: 'Scroll distance per belief (vh)',
                      defaultValue: 120,
                      min: 60,
                      max: 300,
                      admin: {
                        description: 'How much scroll each belief captures. Default 120vh.',
                      },
                    },
                    {
                      name: 'scrub',
                      type: 'number' as const,
                      label: 'Scrub smoothness (s)',
                      defaultValue: 0.8,
                      min: 0,
                      max: 3,
                      admin: { description: 'GSAP scrub lag. 0 = rigid, higher = softer.' },
                    },
                    {
                      name: 'backgroundSvg',
                      type: 'textarea' as const,
                      label: 'Background SVG (optional)',
                      admin: {
                        description:
                          'Raw SVG markup rendered decoratively on the right side. Leave empty for no background graphic.',
                      },
                    },
                  ],
                },
                {
                  slug: 'beliefsCounter',
                  labels: { singular: 'Beliefs Counter', plural: 'Beliefs Counters' },
                  fields: [
                    {
                      name: 'beliefs',
                      type: 'array' as const,
                      label: 'Beliefs',
                      minRows: 2,
                      maxRows: 8,
                      fields: [
                        { name: 'number', type: 'text' as const, label: 'Number (e.g. 01)' },
                        { name: 'title', type: 'text' as const, label: 'Title', required: true },
                        { name: 'body', type: 'richText' as const, label: 'Body text' },
                      ],
                    },
                  ],
                },
                {
                  slug: 'aboutPillars',
                  labels: { singular: 'About Pillars', plural: 'About Pillars' },
                  fields: [
                    {
                      name: 'pillars',
                      type: 'array' as const,
                      label: 'Pillars',
                      minRows: 2,
                      maxRows: 6,
                      fields: [
                        {
                          name: 'label',
                          type: 'text' as const,
                          label: 'Label (large display text)',
                          required: true,
                        },
                        {
                          name: 'descriptor',
                          type: 'text' as const,
                          label: 'Descriptor (small right-aligned text)',
                        },
                        { name: 'body', type: 'richText' as const, label: 'Expanded body text' },
                      ],
                    },
                  ],
                },
                {
                  slug: 'servicesShowcase',
                  labels: { singular: 'Services Showcase', plural: 'Services Showcases' },
                  fields: [
                    {
                      name: 'services',
                      type: 'array' as const,
                      label: 'Services',
                      minRows: 1,
                      maxRows: 8,
                      fields: [
                        {
                          name: 'eyebrow',
                          type: 'text' as const,
                          label: 'Eyebrow (e.g. SERVICE 01 — WEB & MOBILE)',
                        },
                        {
                          name: 'headline',
                          type: 'text' as const,
                          label: 'Headline (large display word)',
                          required: true,
                        },
                        { name: 'body', type: 'richText' as const, label: 'Body text' },
                        {
                          name: 'bullets',
                          type: 'array' as const,
                          label: 'Bullet list (shown on monitor screen)',
                          fields: [
                            { name: 'item', type: 'text' as const, label: 'Item', required: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'row' as const,
                      fields: [
                        {
                          name: 'vhPerService',
                          type: 'number' as const,
                          label: 'Scroll distance per service (vh)',
                          defaultValue: 150,
                          min: 60,
                          max: 300,
                          admin: {
                            description: 'How much scroll each service captures. Default 150vh.',
                          },
                        },
                        {
                          name: 'scrub',
                          type: 'number' as const,
                          label: 'Scrub smoothness (s)',
                          defaultValue: 0.6,
                          min: 0,
                          max: 3,
                          admin: { description: 'GSAP scrub lag. 0 = rigid, higher = softer.' },
                        },
                        {
                          name: 'paddingX',
                          type: 'select' as const,
                          label: 'Padding left/right',
                          defaultValue: 'xl',
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
                  ],
                },
                {
                  slug: 'consolidationBlock',
                  labels: { singular: 'Consolidation Block', plural: 'Consolidation Blocks' },
                  fields: [
                    {
                      name: 'titleLine1',
                      type: 'text' as const,
                      label: 'Title — line 1 (white)',
                      required: true,
                    },
                    {
                      name: 'titleLine2',
                      type: 'text' as const,
                      label: 'Title — line 2 (accent colour)',
                      required: true,
                    },
                    { name: 'body', type: 'richText' as const, label: 'Body text' },
                    {
                      name: 'paddingX',
                      type: 'select' as const,
                      label: 'Padding left/right',
                      defaultValue: 'xl',
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
                  slug: 'testimonialsBlock',
                  labels: { singular: 'Testimonials', plural: 'Testimonials' },
                  fields: [
                    { name: 'title', type: 'text' as const },
                    { name: 'subtitle', type: 'richText' as const },
                    {
                      name: 'featuredOnly',
                      type: 'checkbox' as const,
                      defaultValue: false,
                      admin: { description: 'Only show testimonials marked as featured.' },
                    },
                    {
                      name: 'limit',
                      type: 'number' as const,
                      min: 1,
                      max: 50,
                      admin: {
                        description: 'Maximum number of testimonials to show. Leave empty for all.',
                      },
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
                // ── Logo Carousel ─────────────────────────────────────────
                {
                  slug: 'logoCarousel',
                  labels: { singular: 'Logo Carousel', plural: 'Logo Carousels' },
                  fields: [
                    // Logos array
                    {
                      name: 'logos',
                      type: 'array' as const,
                      label: 'Logos',
                      minRows: 1,
                      fields: [
                        {
                          name: 'image',
                          type: 'upload' as const,
                          relationTo: 'media' as const,
                          required: true,
                          admin: { description: 'Accepts SVG and PNG.' },
                        },
                        { name: 'alt', type: 'text' as const, label: 'Alt text' },
                        { name: 'href', type: 'text' as const, label: 'Link URL (optional)' },
                        { name: 'label', type: 'text' as const, label: 'Caption label (optional)' },
                      ],
                    },
                    // Layout row
                    {
                      type: 'row' as const,
                      fields: [
                        {
                          name: 'rows',
                          type: 'select' as const,
                          label: 'Rows',
                          defaultValue: '1',
                          options: [
                            { label: '1', value: '1' },
                            { label: '2', value: '2' },
                            { label: '3', value: '3' },
                          ],
                        },
                        {
                          name: 'direction',
                          type: 'select' as const,
                          label: 'Direction',
                          defaultValue: 'left',
                          options: [
                            { label: 'Left (default)', value: 'left' },
                            { label: 'Right', value: 'right' },
                            { label: 'Up', value: 'up' },
                            { label: 'Down', value: 'down' },
                          ],
                        },
                        {
                          name: 'alternateRows',
                          type: 'checkbox' as const,
                          label: 'Alternate row direction',
                          defaultValue: true,
                          admin: {
                            description: 'Even rows scroll in the opposite direction.',
                          },
                        },
                      ],
                    },
                    // Speed & gap row
                    {
                      type: 'row' as const,
                      fields: [
                        {
                          name: 'speed',
                          type: 'number' as const,
                          label: 'Duration (s) — lower = faster',
                          defaultValue: 40,
                          min: 5,
                          max: 300,
                          admin: {
                            description: 'Seconds to complete one full loop. Default 40.',
                          },
                        },
                        {
                          name: 'gap',
                          type: 'select' as const,
                          label: 'Gap between logos',
                          defaultValue: 'lg',
                          options: [
                            { label: 'Small (16px)', value: 'sm' },
                            { label: 'Medium (32px)', value: 'md' },
                            { label: 'Large (56px)', value: 'lg' },
                            { label: 'X-Large (80px)', value: 'xl' },
                          ],
                        },
                        {
                          name: 'rowGap',
                          type: 'select' as const,
                          label: 'Gap between rows',
                          defaultValue: 'md',
                          options: [
                            { label: 'Small (12px)', value: 'sm' },
                            { label: 'Medium (24px)', value: 'md' },
                            { label: 'Large (40px)', value: 'lg' },
                          ],
                        },
                      ],
                    },
                    // Logo height & options row
                    {
                      type: 'row' as const,
                      fields: [
                        {
                          name: 'logoHeight',
                          type: 'number' as const,
                          label: 'Logo height (px)',
                          defaultValue: 48,
                          min: 16,
                          max: 200,
                        },
                        {
                          name: 'pauseOnHover',
                          type: 'checkbox' as const,
                          label: 'Pause on hover',
                          defaultValue: true,
                        },
                        {
                          name: 'fadeEdges',
                          type: 'checkbox' as const,
                          label: 'Fade edges',
                          defaultValue: true,
                          admin: {
                            description: 'Gradient fade mask on the leading/trailing edges.',
                          },
                        },
                        {
                          name: 'grayscale',
                          type: 'checkbox' as const,
                          label: 'Grayscale logos',
                          defaultValue: false,
                        },
                      ],
                    },
                    // Padding row
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
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
