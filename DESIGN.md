---
name: Kagency
description: Full-service creative studio — brand identity, design, development, strategy.
colors:
  kred-500: "#ed1d22"
  kred-700: "#920c0e"
  kred-50: "#fde7e8"
  kred-100: "#fbd0d0"
  kred-200: "#f8a5a7"
  kred-300: "#f47678"
  kred-400: "#f14c4e"
  site-bg: "#f4f4f0"
  surface: "#ffffff"
  ink: "#242424"
  ink-muted: "#4f4f4f"
  ink-faint: "#d4d4d4"
  near-black: "#080808"
  kyellow-500: "#ffd700"
typography:
  display:
    fontFamily: "Prequel, sans-serif"
    fontWeight: 700
    fontStyle: italic
    lineHeight: 0.95
    letterSpacing: "normal"
  display-reg:
    fontFamily: "Prequel, sans-serif"
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: "League Spartan, sans-serif"
    fontWeight: 400
    fontSize: "1rem"
    lineHeight: 1.5
  label:
    fontFamily: "League Spartan, sans-serif"
    fontWeight: 700
    letterSpacing: "0.05em"
    textTransform: uppercase
  handwritten:
    fontFamily: "PCD, cursive"
    fontWeight: 400
rounded:
  none: "0"
  input: "0.75rem"
  pill: "9999px"
  section-top: "1rem"
  section-bottom: "1rem"
spacing:
  sm: "1.5rem"
  md: "2.5rem"
  lg: "4rem"
  xl: "8rem"
components:
  button-primary:
    backgroundColor: "{colors.kred-500}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0.625rem 1.5rem"
  button-primary-hover:
    backgroundColor: "#c91519"
  button-outline:
    backgroundColor: "transparent"
    textColor: "currentColor"
    rounded: "{rounded.pill}"
    padding: "0.625rem 1.5rem"
  button-outline-hover:
    backgroundColor: "{colors.kred-500}"
    textColor: "{colors.surface}"
  button-text:
    backgroundColor: "transparent"
    textColor: "currentColor"
    rounded: "{rounded.none}"
  nav-link:
    backgroundColor: "transparent"
    rounded: "{rounded.pill}"
    padding: "0.375rem 0.75rem"
  nav-link-active:
    backgroundColor: "{colors.kred-500}"
    textColor: "{colors.surface}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "0.75rem 1rem"
---

# Design System: Kagency

## 1. Overview: The Confident Pitch

**Creative North Star: "The Confident Pitch"**

This system speaks before the conversation starts. Every element is placed with the certainty of an agency that already knows what you need: layouts that lead with work, typography that commands without shouting, and a red accent so rationed it functions as punctuation. There is no decoration for decoration's sake. Chrome is kept to a minimum so the portfolio can breathe.

The aesthetic is editorial without being precious. Heavy 3px borders frame sections the way a mat frames a print: the border is structure, not ornament. Display type is uppercase, italic, bold Prequel — a proprietary face that cannot be confused with anyone else. Handwritten PCD appears only where warmth earns its place: a client's name, a signature moment. Everything else runs on League Spartan: reliable, direct, never fussy.

Color is restrained by doctrine. Near-charcoal ink on off-white `#f4f4f0` is the resting state. `#ed1d22` enters only when it must. Its rarity is the brand statement.

**Key Characteristics:**
- Flat-by-default. Borders carry structure; shadows are absent at rest.
- Type-led hierarchy: display headlines above everything, body copy below the fold.
- Spacing deliberate and variable: no uniform padding across sections.
- Motion: GSAP scroll-driven, power2.out easing. Scrubbed entrance animations for sections, time-based fade/slide for elements.
- Red is a full stop, not a highlight color.

## 2. Colors: The Restrained Signal

The palette is nearly achromatic. Two neutrals do all the work; one accent is the signal.

### Primary
- **Signal Red** (`#ed1d22`): The brand accent. Used on active nav states, primary CTAs, mobile overlay backgrounds, progress bars, testimonial counter text, and the circled K logo. Never used as a fill on body text. Never used on multiple adjacent elements simultaneously. Less is the point.
- **Deep Signal Red** (`#920c0e`): Error states and pressed/disabled tones only. Not a design accent.

### Neutral
- **Parchment White** (`#f4f4f0`): Site background. Warm, not cold. Never pure white. This is the canvas.
- **Surface White** (`#ffffff`): Local surface elevations (input backgrounds, logo lockup backing). Not the site background.
- **Studio Ink** (`#242424`): Primary text and section borders. Near-charcoal, not pure black — retains warmth.
- **Mid Tone** (`#4f4f4f`): Supporting text, captions, secondary labels.
- **Faint Stroke** (`#d4d4d4`): Progress bar track, divider lines, inactive UI marks.
- **Press Black** (`#080808`): Reserved for scroll-jack hero sections with maximum contrast intent.

### Accent (secondary, rare)
- **Yield Yellow** (`#ffd700`): Declared in tokens, not currently active in any component. Available for special callouts or campaign moments only.

### Named Rules
**The Rarity Rule.** Signal Red covers ≤10% of any given screen. Its rarity is the point. If you add it to a new element and it no longer feels like a surprise, it's overused.

**The Warmth Rule.** Never use `#000000` or `#ffffff` as-is. Parchment White and Studio Ink are the canonical neutrals. All new surfaces must tint toward them.

## 3. Typography: Authority and Warmth

**Display Font:** Prequel (local, woff2/woff), weight 700 italic for headlines, weight 400 normal for counters and labels that need display character without impact.

**Body Font:** League Spartan (Google, Latin subset), weight 400–700.

**Accent Font:** PCD (local, woff2), weight 400. Handwritten. Used sparingly for author names and signature moments.

**Character:** Prequel is proprietary and unmistakable — uppercase, condensed, with a slight forward lean at bold italic. It makes the system unplaceable. League Spartan grounds it: modern grotesque, capable of expressing data and warmth in the same sentence. PCD is the human signature in the margins.

### Hierarchy

- **Display** (Prequel, 700 italic, 5xl–7xl / clamp, line-height 0.95): Hero headlines and page heroes. Uppercase by default. Occasionally dropped to weight 400 for counters and italic editorial fragments.
- **Headline** (Prequel, 700, 3xl–5xl): Section headings, major callout numbers. Uppercase or small-caps treatment.
- **Title** (League Spartan, 700, 2xl–3xl): Sub-sections, testimonial roles, service category headers.
- **Body** (League Spartan, 400–500, base/lg/xl, line-height 1.5): Long-form copy. Max line length 65–75ch. Leading text on hero is `2xl–3xl font-medium` for scannable openers.
- **Label** (League Spartan, 700, sm, tracking-wide, uppercase): Navigation, button text, eyebrow lines, footer links, CTA pills.
- **Handwritten** (PCD, 400, contextual size): Client names in testimonials, signature editorial moments. Never used as a heading. Never used on more than one element per view.

### Named Rules
**The Italic Rule.** Italic in Prequel is reserved for hero headlines and the landing hero only. No italic in body copy. No italic body fallback. If the display font is unavailable, italic disappears entirely.

**The Handwritten Rule.** PCD appears once per visual cluster. Using it twice in the same viewport erases both instances' impact.

## 4. Elevation: Flat-by-Default

This system uses no box-shadows. Depth is conveyed entirely through **stroke weight, border geometry, and color contrast**.

The `section-container` class encodes the layout tier: `--top` rounds the upper corners and shows left/right/top borders; `--bottom` rounds the lower corners; `--center` shows only the vertical rails. This creates a bracketed, framed composition — sections nest inside a visible architectural grid rather than floating above a background.

Within sections, flatness is maintained: inputs sit on the surface with a heavy `3px` border stroke (`border-kblack-500`), not a subtle ring. There is no ambient glow, no hover elevation. The border IS the affordance.

### Shadow Vocabulary
No shadows are used at rest. The only motion-driven depth treatment is the `ScrollAnimate` scale entrance, where `transformOrigin` and slight scale from `0.82` mimic a depth reveal — the element appears to come forward from behind the plane.

### Named Rules
**The Flat Rule.** No `box-shadow` on any element at rest. If you're about to add one, replace it with a border, a color change, or a stronger type hierarchy instead.

**The Stroke Rule.** Section borders are always `3px solid`. Inputs are `3px solid`. The weight is structural, not decorative — it announces "here is where you interact."

## 5. Components

### Buttons

Buttons are direct and unambiguous. Two shapes, no in-between.

- **Shape:** Full pill (`border-radius: 9999px`) for all interactive buttons. No square corners, no moderate radius.
- **Primary:** `bg-kred-500 text-white`, padding `py-2.5 px-6` (FlexContent CTAs) to `py-3 px-6` (contact submit). Font: `font-sans font-bold uppercase tracking-wide text-sm` or `font-display text-xl uppercase` for the submit action.
- **Hover:** Background darkens to ~`#c91519`. No size change, no lift.
- **Disabled:** `opacity-50`. No style change.
- **Outline:** `border-2 border-current text-current rounded-full`. Hover inverts to filled kred on `hover:bg-kred-500 hover:text-white hover:border-kred-500`.
- **Text/Link CTA:** `font-display font-bold uppercase underline` in kred, with a circled arrow icon right. The arrow translates `+1.5` on hover. No border, no background.

### Navigation Links

- **Shape:** Pill (`rounded-full`) on hover and active states.
- **Default:** Transparent background, `text-sm font-bold uppercase tracking-wide`.
- **Active:** `bg-kred-500 text-white`.
- **Hover:** Same as active.
- **Mobile:** Full-screen kred overlay (`bg-kred-500`), GSAP clip-path circle reveal from top-right corner.

### Section Containers

The defining structural component. Sections are framed by `section-container` with variant geometry:

- **`--normal`:** No border. Full bleed content.
- **`--center`:** Left and right borders only (`3px solid kblack-500`). Vertical rails. Content floats between them.
- **`--top`:** Left, right, and top borders. Top corners rounded at `1rem`. Section opens at the top.
- **`--bottom`:** Left, right, and bottom borders. Bottom corners rounded at `1rem`. Closes the frame.
- **`--scroll-jack`:** No border. Full width. Managed by `ScrollJackShell`.

### Inputs / Fields

- **Style:** `rounded-xl border-[3px] border-kblack-500`. Background white. Heavy stroke signals precision and directness.
- **Focus:** Browser default (no custom ring yet). A future pass should add `focus:ring-2 focus:ring-kred-500 focus:border-kred-500`.
- **Placeholder:** Default color, `font-sans text-lg`.
- **Error:** Text color `kred-700`, displayed as a `<p>` below the field.
- **Textarea:** Same treatment, `rows={5}`.

### Testimonials Block

Signature component. Not a card grid.

- **Layout:** Single quote at a time. Left/right arrow navigation. Quote mark SVG (kred, 32×24, static). Author row: avatar + **PCD handwritten name in kred** + role in sans.
- **Transition:** CSS `animate-testimonial-in` — `opacity 0→1` + `translateY 12→0`, 450ms `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
- **Counter:** `font-display italic` — large current number (`text-4xl`) + small total (`text-xs`). Outside the animated content div so it doesn't flash.
- **Progress bar:** `h-1 w-32 rounded-full` track (`#ededed`), kred fill, `transition-all duration-500 ease-out`.

### FlexContent Block

The workhorse layout block. Text column + optional image column. Eyebrow → Heading → Accent → Body → CTA, each independently animatable via `ScrollAnimate`.

- **Eyebrow:** Small uppercase sans, configurable weight/size.
- **Heading:** Configurable font (display/sans/handwritten), size sm–2xl, weight and color overridable.
- **Body:** Sans, size sm–2xl, leading-tight.
- **Image:** `next/image` with configurable aspect ratio, position (above-title / above-text / below-text), and alignment.

## 6. Do's and Don'ts

### Do:
- **Do** keep Signal Red (`#ed1d22`) on ≤10% of any screen surface. Its rarity is the brand statement.
- **Do** use `font-display italic font-bold uppercase` (Prequel) for hero headlines. This is the face of the brand.
- **Do** use PCD (handwritten) for exactly one accent per visual cluster — a client name, a signature word.
- **Do** use `3px solid` borders on section containers and inputs. The weight is structural.
- **Do** use pill-shaped buttons (`rounded-full`) for all interactive actions without exception.
- **Do** vary section padding intentionally: `sm` for compact tiers, `xl` for hero-scale breathing room.
- **Do** use GSAP `power2.out` for all scroll-driven motion. No bounce, no elastic.
- **Do** use Parchment White (`#f4f4f0`) as the site background, never pure `#fff` or `#000`.
- **Do** apply `reduced-motion` safe guards on all `ScrollAnimate` and entrance animations.
- **Do** let the portfolio work lead every section. Layout decisions serve the work, not the other way around.

### Don't:
- **Don't** use `box-shadow` on any element at rest. Depth comes from borders and contrast.
- **Don't** add gradient text (`background-clip: text`). Use a single solid color — emphasis via weight or size.
- **Don't** use glassmorphism (`backdrop-filter: blur`) decoratively. It contradicts the direct, flat aesthetic.
- **Don't** use `border-left` or `border-right` as a colored stripe accent on cards, callouts, or list items. Section borders are structural frames, not decorative tags.
- **Don't** build identical card grids: icon + heading + body, repeated. FlexContent layouts, single-column lists, or full-bleed portfolio panels all outperform a card grid here.
- **Don't** write hero metric tiles (big number, small label, supporting stats, gradient accent). This is the generic agency template the brand explicitly rejects.
- **Don't** use scrolljack for its own sake. `containerStyle: 'scroll-jack'` is for hero moments only, not section navigation.
- **Don't** use 3D blobs, heavy parallax, or particle effects. Personality comes from precision and timing, not motion volume.
- **Don't** use em dashes. Use commas, colons, semicolons, periods, or parentheses.
- **Don't** design a screen where swapping the logo would leave the identity intact. Every layout decision should feel like it could only be Kagency.
