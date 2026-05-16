---
name: High-Utility Financial Ledger
colors:
  surface: '#fcf8f9'
  surface-dim: '#ddd9d9'
  surface-bright: '#fcf8f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f3'
  surface-container: '#f1eded'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e2'
  on-surface: '#1c1b1c'
  on-surface-variant: '#46464b'
  inverse-surface: '#313031'
  inverse-on-surface: '#f4f0f0'
  outline: '#77777c'
  outline-variant: '#c7c6cb'
  surface-tint: '#5d5e65'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#191b22'
  on-primary-container: '#82838b'
  inverse-primary: '#c5c6ce'
  secondary: '#665975'
  on-secondary: '#ffffff'
  secondary-container: '#ead9fa'
  on-secondary-container: '#6a5d79'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#191c1d'
  on-tertiary-container: '#828485'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2eb'
  primary-fixed-dim: '#c5c6ce'
  on-primary-fixed: '#191b22'
  on-primary-fixed-variant: '#45464e'
  secondary-fixed: '#eddcfd'
  secondary-fixed-dim: '#d1c0e0'
  on-secondary-fixed: '#21172e'
  on-secondary-fixed-variant: '#4e425c'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c5c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#fcf8f9'
  on-background: '#1c1b1c'
  surface-variant: '#e5e2e2'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is built on a foundation of **Corporate Modernism** with a heavy emphasis on **High-Contrast Utility**. It aims to evoke feelings of precision, financial security, and effortless efficiency. The target audience—business owners, accountants, and freelancers—requires a tool that prioritizes data density without sacrificing legibility. 

The aesthetic is "Technical Premium": a stark interplay between deep, authoritative darks and sophisticated, muted accents. It utilizes ample negative space in content areas to balance the dense information architecture inherent in invoice management.

## Colors
The palette is dominated by **Dark Navy (#0f1117)**, used for structural navigation and primary branding to establish a grounded, professional atmosphere. The **Muted Lavender (#827491)** serves as a sophisticated accent for secondary actions, focused states, and subtle UI highlights, providing a calm, professional counterpoint to the dark base.

Surface hierarchy is strictly managed:
- **Primary Surface**: Pure White (#FFFFFF) for maximum contrast in data tables and invoice views.
- **Secondary Surface**: Light Gray (#f9fafb) for dashboard backgrounds and grouping elements.
- **Semantic Status**: A dedicated quartet of Green, Amber, Red, and Gray provides immediate visual telemetry for invoice lifecycles.

## Typography
This design system utilizes **Geist** for its entire typographic scale. Geist’s monospaced-inspired geometric qualities provide the technical precision necessary for numerical data and financial tables.

- **Headlines**: Use SemiBold weights with tight letter-spacing to maintain a strong, authoritative presence.
- **Numerical Data**: Always use tabular figures (tnum) for invoice amounts and dates to ensure vertical alignment in tables.
- **Labels**: Small caps or medium-weight sans-serifs are used for secondary metadata to differentiate from body content.

## Layout & Spacing
The layout follows a strict **12-column fluid grid** for the main content area, while the primary navigation is housed in a fixed-width (280px) left sidebar. 

**Spacing Rhythm:**
- All spatial relationships are derived from an **8px base unit**.
- **Desktop**: 40px outer margins with 24px gutters. Content is centered in a 1280px max-width container.
- **Tablet**: Transition to a 1 column layout for tables with horizontal scrolling or "Card View" reflow.
- **Mobile**: 16px margins. Sidebars transition to a bottom sheet or hidden drawer.
- Use "Stack" patterns (Vertical spacing) to group related form fields and "Inline" patterns for action buttons.

## Elevation & Depth
The design system employs **Tonal Layering** combined with **Ambient Shadows** to create a refined hierarchy. 

1. **Base Layer**: The background (#f9fafb) acts as the canvas.
2. **Surface Layer**: Main cards and content containers use Pure White with a 1px border (#e5e7eb) and a very soft, diffused shadow (Offset: 0, 4px; Blur: 12px; Opacity: 4% Black).
3. **Interactive Layer**: Hover states for cards increase shadow depth slightly.
4. **Overlay Layer**: Modals and dropdowns use a more pronounced shadow (Blur: 24px, Opacity: 10% Black) to indicate focus.

Avoid heavy drop shadows or glows. Depth should feel "paper-thin" and architectural.

## Shapes
The shape language is defined by a consistent **12px (0.75rem)** radius across all primary UI components (Cards, Buttons, Inputs). This "Rounded" approach softens the high-contrast color palette, making the interface feel approachable despite its technical nature.

- **Small Elements**: Checkboxes and small tags use a 4px (0.25rem) radius.
- **Large Elements**: Dashboard sections and main invoice containers use the standard 12px.
- **Interactive States**: Buttons retain the 12px radius, but may transition to a pill-shape (999px) only for specific "Status" chips.

## Components
- **Buttons**: Primary buttons use the Dark Navy (#0f1117) background with White text for authoritative action. Secondary buttons are outlined or use the Muted Lavender (#827491) accent.
- **Data Tables**: The "Hero" of the system. Use 1px horizontal dividers only. Row headers should be SemiBold. Include a clear hover state (Light Gray fill) for row interactivity.
- **Status Chips**: Small, pill-shaped indicators using low-saturation backgrounds of the status colors with high-saturation text (e.g., Light Green background with Dark Green text for "Paid").
- **Input Fields**: Sleek, 12px rounded borders with a 1px stroke. Focus state should use a 2px Dark Navy or Muted Lavender ring. Use Geist Mono for currency input fields.
- **Side Navigation**: Fixed Dark Navy sidebar. Active links are indicated by the Muted Lavender accent, either as a left-side vertical bar or a subtle background tint.
- **Invoice Cards**: Summary cards used for mobile or dashboard overviews. Must include the 12px border radius and the subtle ambient shadow.