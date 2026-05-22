---
name: Mediterranean Tech
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#434654'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2052d6'
  primary: '#003197'
  on-primary: '#ffffff'
  primary-container: '#0345ca'
  on-primary-container: '#b6c4ff'
  inverse-primary: '#b6c4ff'
  secondary: '#006a66'
  on-secondary: '#ffffff'
  secondary-container: '#32f8ef'
  on-secondary-container: '#006f6a'
  tertiary: '#00405d'
  on-tertiary: '#ffffff'
  tertiary-container: '#00587f'
  on-tertiary-container: '#87ceff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164f'
  on-primary-fixed-variant: '#003bb0'
  secondary-fixed: '#38fbf2'
  secondary-fixed-dim: '#00ddd5'
  on-secondary-fixed: '#00201e'
  on-secondary-fixed-variant: '#00504c'
  tertiary-fixed: '#c8e6ff'
  tertiary-fixed-dim: '#88ceff'
  on-tertiary-fixed: '#001e2e'
  on-tertiary-fixed-variant: '#004c6d'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
  surface-base: '#F8FAFC'
  surface-glass: rgba(255, 255, 255, 0.7)
  deep-navy: '#022B7D'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  margin-mobile: 20px
  margin-desktop: 80px
  gutter: 24px
  container-max: 1200px
---

## Brand & Style

This design system embodies the intersection of Mediterranean vitality and high-stakes entrepreneurship. It is built to feel innovative yet grounded, professional yet energetic. The aesthetic direction is **Modern Corporate with Glassmorphic accents**, prioritizing high-clarity layouts that reflect the intellectual rigor of a tech summit.

The style leverages heavy whitespace to denote premium quality, paired with vibrant, light-emitting accents that suggest forward-thinking momentum. It avoids the heaviness of traditional corporate systems by introducing translucent layers and soft, sweeping gradients that mimic the clarity of the Balearic sea.

## Colors

The palette is centered on a high-contrast interaction between **Deep Blue** and **Bright Cyan**. The Deep Blue provides the professional foundation and authority required for a tech forum, while the Cyan acts as a "digital glow," highlighting calls to action and key data points.

**Soft Blue** is utilized primarily for background washes and subtle UI grounding. A "Deep Navy" variant is reserved for footer areas or high-impact text to ensure optimal legibility over the Primary color. Surface colors remain near-white to maintain a light, airy "Mediterranean" feel, punctuated by glassmorphic overlays that use a 70% opacity white with a 12px backdrop blur.

## Typography

The system utilizes **Inter** exclusively to ensure a systematic, utilitarian appearance that scales perfectly across devices. 

Headings use a **Heavy (800) weight** with tight letter spacing to create an "editorial tech" look that commands attention. For mobile optimization, the largest display sizes are reduced significantly to ensure headlines remain within the viewport without excessive wrapping. Labels use uppercase styling to provide a clear secondary hierarchy for metadata like dates or categories.

## Layout & Spacing

This design system uses a **Fluid Grid** model with a 12-column layout for desktop and a 4-column layout for mobile. 

The spacing rhythm is based on a **linear 8px scale**. 
- **Desktop:** Generous 80px side margins to focus the content toward the center, creating a premium "gallery" feel.
- **Mobile:** Margins are tightened to 20px to maximize real estate for text-heavy session descriptions.
- **Vertical Spacing:** Section blocks should use 120px padding on desktop and 64px on mobile to maintain clear visual separation between distinct topics or talks.

## Elevation & Depth

Depth in this design system is achieved through **Glassmorphism and Tonal layering** rather than traditional heavy shadows.

1.  **The Base:** Flat, neutral surface (`#F8FAFC`).
2.  **The Container:** Elevated cards use a 1px border in a lighter tint of the primary color (`#E0E7FF`) with a very subtle, diffused shadow (0px 4px 20px rgba(3, 69, 202, 0.05)).
3.  **The Glass Layer:** Navigation bars and modal overlays use a semi-transparent white background with a `backdrop-filter: blur(12px)`. This keeps the "Mediterranean" light passing through the UI.
4.  **Interaction:** On hover, elements should slightly lift and increase the saturation of their cyan accents, rather than becoming significantly darker.

## Shapes

The shape language is **distinctly Rounded**. This softens the "tech" edge of the design system, making it more approachable and modern. 

- **Standard Buttons & Inputs:** Use the base 0.5rem (8px) radius.
- **Feature Cards & Modals:** Use the 1rem (16px) radius for a more prominent, friendly appearance.
- **Avatar/Image containers:** Always use a 1.5rem (24px) radius or full pill-shape to contrast against the structured grid.

## Components

### Buttons
- **Primary:** Solid Deep Blue (`#0345ca`) with white text. High-contrast, 0.5rem radius.
- **Secondary:** Gradient border (Cyan to Soft Blue) with Deep Blue text. 
- **Action:** Full Bright Cyan (`#00eae1`) for high-conversion items like "Register Now."

### Input Fields
Field backgrounds should be white with a subtle 1px border in `#CBD5E1`. Upon focus, the border transitions to a 2px Deep Blue stroke with a soft Cyan outer glow.

### Cards
Cards are the primary container for speaker profiles and talk abstracts. They feature a white background, 1rem roundedness, and a subtle Cyan top-accent bar (3px height) to link the component to the brand identity.

### Chips/Tags
Used for "Topic" categories (e.g., AI, Fintech). Use a light tint of the primary color with Deep Blue text. Tags are always pill-shaped to distinguish them from actionable buttons.

### Navigation
A glassmorphic top-bar that remains sticky. Links use the `label-caps` typography style, transitioning from Black to Primary Blue on hover.