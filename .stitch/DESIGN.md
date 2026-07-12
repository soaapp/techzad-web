---
name: Techzad Studio Baseline
colors:
  surface-base: '#F5F6F7'
  surface-low: '#EFF1F2'
  surface: '#FFFFFF'
  surface-container: '#E6E8EA'
  surface-high: '#E0E3E4'
  surface-highest: '#DADDDF'
  on-surface: '#1A1D1E'
  on-surface-variant: '#595C5D'
  outline: '#757778'
  outline-variant: '#ABADAE'
  primary: '#1A1D1E'
  primary-soft: '#2C2F30'
  accent: '#C29A4D'
  dark-surface-base: '#0E1112'
  dark-surface-low: '#16191A'
  dark-surface: '#202425'
  dark-on-surface: '#E8EAEB'
  dark-on-surface-variant: '#ABADAE'
  dark-accent: '#E0BC7A'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: clamp(40px, 7vw, 72px)
    fontWeight: '800'
    lineHeight: '1.05'
    letterSpacing: -0.03em
  heading-section:
    fontFamily: Inter
    fontSize: clamp(28px, 4vw, 36px)
    fontWeight: '800'
    lineHeight: normal
    letterSpacing: -0.025em
  heading-card:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '700'
    lineHeight: normal
    letterSpacing: -0.015em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.65'
    letterSpacing: '0'
  body-large:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.55'
    letterSpacing: '0'
  label-small:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: normal
    letterSpacing: 0.06em
rounded:
  sm: 0.5rem
  DEFAULT: 0.75rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  full: 9999px
spacing:
  unit: 4px
  page-gutter: 24px
  card-padding: 28px
  grid-gap: 20px
  section-compact: 32px
  section-base: 64px
  section-large: 96px
  content-max: 960px
---

# Design System: Techzad Studio Baseline

**Project ID:** 15330532366296180517

## 1. Visual Theme & Atmosphere

Techzad's current site presents a quiet, polished parent-studio identity. It uses cool-to-warm neutral surfaces, charcoal typography, a restrained gold accent, and generous vertical spacing to distinguish the company from the brighter blue visual language of its Sidekick product. The atmosphere is calm, privacy-conscious, and carefully composed.

The visual hierarchy relies on centered hero typography, white surface cards, subtle borders, soft radii, and minimal hover lift. Automatic light and dark palettes preserve the same surface-tier relationships across system preferences. The overall result feels approachable and sophisticated, with more emphasis on restraint than visual spectacle.

## 2. Color Palette & Roles

### Primary Foundation

- **Studio Mist** `#F5F6F7` is the light-mode page background.
- **Quiet Gray** `#EFF1F2` separates the contact and footer regions.
- **Clean White** `#FFFFFF` is the primary card and badge surface.
- **Layered Grays** `#E6E8EA`, `#E0E3E4`, and `#DADDDF` form the surface elevation scale.
- **Night Base** `#0E1112` and **Night Surface** `#202425` are the dark-mode equivalents.

### Accent & Interactive

- **Studio Charcoal** `#1A1D1E` is both the primary brand color and the light-mode CTA fill.
- **Soft Charcoal** `#2C2F30` is the primary hover state.
- **Warm Gold** `#C29A4D` appears primarily in the hero gradient and service-icon tint.
- **Dark Gold** `#E0BC7A` preserves the accent's warmth in dark mode.
- **Sidekick Blue** `#0846ED` to `#1A73E8` is reserved for the Sidekick product mark.

### Typography & Text Hierarchy

- **Primary Ink** `#1A1D1E` carries headings and high-emphasis copy.
- **Secondary Ink** `#595C5D` carries body copy, metadata, navigation, and supporting text.
- **Outline Gray** `#757778` is used for stronger interactive borders.
- **Quiet Outline** `#ABADAE` is the default card and divider border.
- Dark mode reverses these roles with `#E8EAEB` and `#ABADAE`.

### Functional States

The current one-page marketing site has no form validation, alerts, or transactional states. Hover states are communicated through border strengthening, charcoal changes, and a restrained two-pixel lift. Focus styling should be added explicitly during implementation to reach WCAG 2.2 expectations.

## 3. Typography Rules

### Hierarchy & Weights

Inter is the sole type family, chosen for a modern, neutral, product-oriented voice and broad platform fallback coverage. The hero uses an extra-bold responsive display size from 40px to 72px, tight 1.05 leading, and -0.03em tracking. Section headings use 28px to 36px at weight 800; cards use 18px to 22px at weight 700.

Body text remains between 14.5px and 18px with relaxed 1.55 to 1.7 leading. Navigation, badges, product status, and footer labels use 11px to 14px sizes. Product status is uppercase with 0.06em tracking.

### Spacing Principles

Display type is tightly tracked while body copy remains untracked and comfortably led. Supporting paragraphs are limited to approximately 540px to 720px, while the full content container is capped at 960px. Text spacing favors short blocks and clear sectional pauses.

## 4. Component Stylings

### Buttons

Buttons use full pill geometry, medium-to-semibold text, 10px by 18px base padding, and 150ms transitions. The primary CTA is solid charcoal with reversed text; the small contact action uses a transparent surface with a quiet outline. Text links remove the pill container and rely on a color shift. Arrow movement is limited to two pixels on hover.

### Cards & Product Containers

Service and product cards use white surfaces, 1px quiet-gray borders, 24px radii, and 28px internal padding. They have no resting shadow. Hover strengthens the border and lifts the card by two pixels. Product cards use a horizontal media-object structure with a 64px branded mark and flexible text body.

### Navigation

The sticky navigation uses a 92% surface-colored translucent background, 12px backdrop blur, and a faint bottom border. The wordmark is heavy and compact. Navigation links are 14px medium-weight secondary text with a simple foreground-color hover. At widths below 640px, non-contact links are hidden.

### Inputs & Forms

The current site has no input components. Contact is handled through a mailto CTA. Any future inputs should inherit the surface/outline hierarchy, use at least 44px targets, and add a visible non-color-only focus ring.

### Service Icons and Product Marks

Service icons use 22px line SVGs inside 44px soft-gold containers with 12px radii. Product marks are two-letter initials centered inside 64px gradient tiles. Sidekick uses its blue product gradient; Orden currently inherits the same mark treatment.

## 5. Layout Principles

### Grid & Structure

The page uses a centered 960px maximum container with 24px edge padding. The hero is centered within a 720px column. Services use a three-column equal grid above 860px and collapse to one column below it. Product cards are horizontal rows on larger screens and stack on small screens.

### Whitespace Strategy

The system follows a loose 4px base rhythm, with recurring 8px, 12px, 16px, 20px, 24px, 28px, 32px, 40px, 64px, 80px, and 96px values. Major sections usually receive 64px vertical padding, while the hero and final narrative areas reach 80px to 96px.

### Alignment & Visual Balance

The hero and contact CTA are centered. Services and work sections switch to left-aligned content within centered containers. Equal card widths and consistent surface treatments create a controlled, balanced rhythm. The About section narrows back to 720px and remains left aligned.

### Responsive Behavior & Touch

- At 860px, the service grid becomes a single column.
- At 640px, container padding drops to 20px, the hero becomes more compact, secondary navigation links disappear, product cards stack, and product links wrap.
- Tap targets should be audited and raised to a 44px minimum where the existing compact controls fall short.
- The site respects system dark mode; reduced-motion support is not yet explicit.

## 6. Design System Notes for Stitch Generation

### Language to Use

Use phrases such as refined Canadian technology studio, calm neutral surfaces, privacy-conscious product craft, centered editorial hero, soft surface hierarchy, restrained warm-gold accent, and quiet high-contrast dark mode.

### Color References

Preserve Studio Mist, Clean White, Primary Ink, Secondary Ink, Quiet Outline, and Warm Gold as the baseline. Keep Sidekick Blue scoped to the Sidekick product rather than extending it to the parent brand.

### Component Prompts

1. Create a centered studio hero using extra-bold Inter, a small outlined company badge, concise supporting copy, and a compact trust line.
2. Create service cards with clean white surfaces, quiet borders, soft 24px corners, small line icons in warm-gold containers, and subtle two-pixel hover lift.
3. Create horizontal product cards with a compact branded mark, uppercase status label, direct product description, and understated text links.

### Incremental Iteration

Treat this document as the faithful baseline import. Preserve its content hierarchy and light/dark surface system when generating comparisons. For a less template-like evolution, test asymmetry, stronger editorial rules, more specific infrastructure proof, fewer pill shapes, and varied service layouts without inventing metrics, customers, or testimonials.
