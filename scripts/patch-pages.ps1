$file = "C:\Users\IK\Kagency\src\collections\Pages.ts"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# 1. Add scale types to ANIM_TYPE_OPTIONS
$old1 = "  { label: 'Stagger Words', value: 'stagger-words' },`n]"
$new1 = @"
  { label: 'Stagger Words', value: 'stagger-words' },
  { label: 'Scale', value: 'scale' },
  { label: 'Scale Up', value: 'scale-up' },
  { label: 'Scale Down', value: 'scale-down' },
  { label: 'Scale Left', value: 'scale-left' },
  { label: 'Scale Right', value: 'scale-right' },
]
"@
if (-not $content.Contains($old1)) { Write-Error "ERR1: stagger-words pattern not found"; exit 1 }
$content = $content.Replace($old1, $new1.TrimEnd("`n"))
Write-Host "OK1: scale types added"

# 2. Add entrance animation fields before flex layout comment
# We search for the unique substring and inject before the line that contains it
$flexCommentLine = "Flex layout (for child blocks)"
if (-not $content.Contains($flexCommentLine)) { Write-Error "ERR2: flex layout comment not found"; exit 1 }

$entranceFields = @"
            // -- Section entrance animation ---
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
                    condition: (_: unknown, s: { entranceAnim?: boolean; containerStyle?: string }) =>
                      !!s?.entranceAnim && s?.containerStyle !== 'scroll-jack',
                  },
                },
                {
                  name: 'entranceEasing',
                  type: 'select' as const,
                  label: 'Easing',
                  defaultValue: 'ease-out',
                  options: ANIM_EASING_OPTIONS,
                  admin: {
                    condition: (_: unknown, s: { entranceAnim?: boolean; containerStyle?: string }) =>
                      !!s?.entranceAnim && s?.containerStyle !== 'scroll-jack',
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
                    condition: (_: unknown, s: { entranceAnim?: boolean; containerStyle?: string }) =>
                      !!s?.entranceAnim && s?.containerStyle !== 'scroll-jack',
                  },
                },
              ],
            },

"@
# Inject entrance fields just before the flex layout comment line (preserving original line)
$content = $content.Replace($flexCommentLine, $entranceFields + $flexCommentLine)
Write-Host "OK2: entrance animation fields added"

[System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "DONE: Pages.ts saved"
