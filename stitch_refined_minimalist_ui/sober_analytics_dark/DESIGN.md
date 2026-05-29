---
name: Sober Analytics Dark
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#ffb3af'
  on-tertiary: '#650911'
  tertiary-container: '#fc7c78'
  on-tertiary-container: '#711419'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#842225'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
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
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
This design system is a high-performance, data-centric interface designed for deep focus and clarity. It targets professionals in finance, technology, and analytics who require a sophisticated workspace for monitoring complex metrics.

The aesthetic follows a **Corporate Modern** approach with **Glassmorphism** influences. By utilizing a deep slate foundation, the UI reduces eye strain during long sessions while allowing vibrant data visualizations to pop. The emotional response is one of precision, stability, and intelligent oversight. Layouts are structured and systematic, emphasizing logical information architecture over decorative flair.

## Colors
The palette is rooted in a "Deep Slate" dark mode. The background uses a rich dark base, while surfaces climb through lighter slate values to indicate hierarchy and interactivity. 

**Accents:**
- **Emerald (#10b981):** Used for primary actions, success states, and positive data trends. Adjusted for high vibrancy against dark backgrounds.
- **Indigo (#6366f1):** Used for secondary actions, informational callouts, and secondary data sets. 

**Neutral Tones:**
Text follows a strict hierarchy using White (#FFFFFF) for titles, Slate 50 (#f8fafc) for body text, and Slate 400 (#94a3b8) for captions and disabled states. This ensures WCAG AA compliance for readability on all slate surfaces.

## Typography
The typography relies exclusively on **Plus Jakarta Sans** to maintain a modern, clean, and approachable technical feel. 

- **Headlines:** Use Bold or Semi-Bold weights with slight negative letter-spacing to feel "locked-in" and authoritative.
- **Body:** Standardized on 16px for optimal legibility. Use the "Slate 50" text color to ensure softness against the dark background.
- **Labels:** Used for data headers and small UI elements, often employing Medium or Semi-Bold weights and slight tracking for clarity at small scales.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for desktop and a 4-column structure for mobile. 

- **Rhythm:** A strict 8px baseline grid governs all vertical and horizontal spacing. 
- **Containers:** Content is housed in modular containers that utilize the `surface_low` color. 
- **Adaptation:** On mobile, margins shrink to 16px and gutters to 16px, while desktop maintains a spacious 48px margin to project a premium, uncrowded feel.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and **Glassmorphism**. Shadows are avoided in favor of luminosity and border-strokes.

1. **Base (Level 0):** Background (#0f172a).
2. **Surface (Level 1):** `surface_low` (#1e293b). Used for primary cards and content areas.
3. **Overlay (Level 2):** `surface_high` (#334155). Used for modals, tooltips, and floating menus.

To define boundaries, use a 1px border of `surface_high` or a 10% white opacity stroke on all elevated cards. This creates a "glass" edge that catches the virtual light.

## Shapes
Following the "ROUND_FOUR" specification (interpreted as a consistent 0.5rem base), the shape language is professional but softened. 

- **Standard Components:** Buttons, inputs, and small cards use a 0.5rem (8px) radius.
- **Large Containers:** Section containers and dashboards use 1rem (16px) to frame content more distinctively.
- **Interactive Elements:** Active states should never change shape, only fill or stroke color.

## Components
- **Buttons:** Primary buttons use Emerald (#10b981) with white text. Secondary buttons use a `surface_high` fill with a subtle 1px slate-400 border.
- **Input Fields:** Use `surface_low` as the background with a 1px `surface_high` border. On focus, the border transitions to Indigo (#6366f1).
- **Cards:** Cards should have no shadow; instead, use a 1px border of #334155. For "active" or "selected" cards, use a thin Emerald top-border (2px).
- **Chips:** Small, pill-shaped tags using Indigo at 15% opacity with an Indigo text color for meta-data categorization.
- **Lists:** Use subtle horizontal dividers (#334155) with 16px of vertical padding between items.
- **Data Visualization:** Charts should use Emerald, Indigo, and a supplementary Cyan to ensure distinct data paths in dark mode.