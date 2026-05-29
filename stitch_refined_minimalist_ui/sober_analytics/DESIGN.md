---
name: Sober Analytics
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45474c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#46645c'
  on-secondary: '#ffffff'
  secondary-container: '#c8eadf'
  on-secondary-container: '#4c6a62'
  tertiary: '#0a0054'
  on-tertiary: '#ffffff'
  tertiary-container: '#18008f'
  on-tertiary-container: '#8481ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#c8eadf'
  secondary-fixed-dim: '#adcdc3'
  on-secondary-fixed: '#01201a'
  on-secondary-fixed-variant: '#2f4c45'
  tertiary-fixed: '#e2dfff'
  tertiary-fixed-dim: '#c3c0ff'
  on-tertiary-fixed: '#0f0069'
  on-tertiary-fixed-variant: '#3323cc'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 24px
  unit-xl: 48px
---

## Brand & Style

The design system is built on a foundation of **Minimalism** and **Modern Corporate** aesthetics. It is designed for high-focus productivity where the interface recedes to allow the user's data and tasks to take center stage. The mood is "sober"—calculated, calm, and highly professional—targeting power users who value efficiency over visual noise. 

The emotional response should be one of clarity and control. By utilizing generous whitespace and a restricted palette, the system eliminates cognitive load and provides a high-fidelity, premium feel that differentiates it from more "playful" or cluttered task managers.

## Colors

The palette is anchored by a deep **Slate Navy** (#1E293B) for primary text and structural elements, providing a sophisticated alternative to pure black. The background uses a soft **Off-White** (#F8FAFC) to reduce eye strain.

- **Primary (Slate Navy):** Used for headings, primary buttons, and heavy navigational elements.
- **Secondary (Muted Forest):** (#3E5C54) Reserved for success states and secondary actions that need a grounded, organic feel.
- **Tertiary (Soft Indigo):** (#4F46E5) Used sparingly for interactive highlights and focus indicators.
- **Neutrals:** A range of cool grays (Slate-100 to Slate-400) are used for borders, secondary text, and inactive states to maintain the "sober" aesthetic.

## Typography

This design system utilizes a dual-font strategy. **Plus Jakarta Sans** provides a modern, slightly geometric character for headings, while **Inter** ensures maximum legibility for data-dense body content and UI labels.

Headings use tight letter spacing and heavy weights to establish clear hierarchy. Body text is optimized for readability with generous line heights. Labels are intentionally small and occasionally all-caps to differentiate them from actionable content.

## Layout & Spacing

The system follows a **Fixed Grid** model for desktop, centered within the viewport to maintain a sense of order. 

- **Grid:** A 12-column grid with 24px gutters.
- **Rhythm:** An 8px linear scaling system governs all padding and margins. 
- **Whitespace:** Use "generous" spacing (unit-xl) between major sections to emphasize the minimal aesthetic.
- **Mobile:** Transition to a fluid single-column layout with 16px side margins. Cards should lose their external shadows on mobile to prioritize screen real estate, utilizing subtle 1px borders instead.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Ambient Shadows**. Instead of heavy dropshadows, the design system uses multiple soft, low-opacity layers to create a "lifted" effect.

- **Level 0 (Surface):** The main background (#F8FAFC).
- **Level 1 (Cards):** White surfaces (#FFFFFF) with a very thin, soft border (Slate-200) and a subtle 4px blur shadow.
- **Level 2 (Overlays/Modals):** High-elevation surfaces with a 12px blur shadow and a 10% opacity Slate Navy tint to ground the element.
- **Active States:** Subtle inset shadows are used for pressed buttons to mimic physical depression without being overtly skeuomorphic.

## Shapes

The shape language is **Soft** and restrained. A 0.25rem (4px) base radius is applied to standard inputs and small components. 

- **Cards & Modals:** Use `rounded-lg` (8px) to provide a modern feel without appearing "bubbly."
- **Primary Buttons:** May use slightly higher roundedness for tactile differentiation, but avoid full pill shapes to maintain the professional, sober tone.
- **Data Visualizations:** Bars and charts should use sharp or minimally rounded corners (2px) to look precise and technical.

## Components

### Buttons
- **Primary:** Slate Navy background, white text. No gradient. Subtle 1px top-highlight.
- **Secondary:** Transparent background, Slate-200 border, Slate Navy text.
- **Ghost:** No border or background until hover; then a very light Slate-100 fill.

### Input Fields
- Use a light gray background (#F1F5F9) instead of white to clearly define the hit area against white cards. 
- Focus state: 1px border of Soft Indigo with a 3px outer glow of the same color at 10% opacity.

### Chips/Tags
- Rectangular with 4px radius. 
- Use very desaturated background tints of the accent colors (e.g., Forest Green at 10% opacity) with high-contrast dark text for the category.

### Cards
- White background. 
- Padding should be a minimum of 24px (unit-lg) to ensure the content doesn't feel cramped.
- Headers within cards should be separated by a subtle Slate-100 divider line.

### Progress Bars
- Background: Slate-100.
- Fill: Muted Forest for positive progress, Soft Indigo for neutral/processing.
- Height: 6px for a refined, thin appearance.