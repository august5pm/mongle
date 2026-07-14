---
name: Mongle
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#d7c2be'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#a08c89'
  outline-variant: '#524341'
  surface-tint: '#ffb4a8'
  primary: '#ffd9d3'
  on-primary: '#51221b'
  primary-container: '#ffb3a7'
  on-primary-container: '#7a423a'
  inverse-primary: '#894e45'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#e2deff'
  on-tertiary: '#2d2a5b'
  tertiary-container: '#c4c0fa'
  on-tertiary-container: '#4f4c7f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#370e08'
  on-primary-fixed-variant: '#6d3830'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#e3dfff'
  tertiary-fixed-dim: '#c4c1fb'
  on-tertiary-fixed: '#181445'
  on-tertiary-fixed-variant: '#444173'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
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
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 40px
  gutter: 16px
  element-gap: 12px
---

## Brand & Style

The brand personality is **emotional, cozy, and cinematic**. It is designed to feel like a digital sanctuary for cinephiles—a place where the act of watching a movie transitions into a personal reflective journey. The design evokes a sense of "fluffiness" and dreaminess, balancing the high-fidelity impact of cinema with the intimate, tactile feel of a physical journal.

The aesthetic follows a **Soft-Cinematic Glassmorphism** style. It utilizes deep, immersive backgrounds to make movie posters pop, overlaid with translucent, soft-edged containers that mimic frosted glass. This creates a multi-layered depth that feels sophisticated yet approachable, moving away from cold corporate interfaces toward a warm, human-centric experience.

## Colors

The palette is rooted in a **Deep Cinematic Dark Mode** to provide a high-contrast foundation for media content.

- **Primary (Mongle Peach):** Used for primary actions, active states, and brand-heavy moments. It provides the "warmth" and "fluffiness" the name implies.
- **Secondary (Soft Violet):** Used for accents, categorization, and secondary interactive elements, bridging the gap between the dark background and the warm peach.
- **Tertiary (Deep Indigo):** Serves as the base surface color, providing a more harmonic and "dreamy" alternative to pure black.
- **Neutral:** A slightly warm off-white used for maximum readability of body text and journal entries.

Backgrounds should use subtle radial gradients of Deep Indigo to Soft Violet to prevent the UI from feeling flat.

## Typography

This design system employs a dual-typeface strategy to balance editorial elegance with modern app functionality.

- **Playfair Display (Serif):** Used for titles, movie names, and journal headings. It provides the "literary" feel of a personal diary and adds a touch of luxury.
- **Plus Jakarta Sans (Sans-serif):** Chosen for its soft, rounded terminals and high legibility. It handles all functional UI elements, metadata, and long-form journal text.

Large display titles should use tighter letter-spacing to feel more cohesive, while labels and small metadata should have increased letter-spacing to maintain clarity against dark, textured backgrounds.

## Layout & Spacing

The layout philosophy is **Fluid & Breathable**, emphasizing whitespace (or "dark space") to let movie posters and personal reflections breathe.

- **Grid:** A 12-column grid for desktop and a 4-column grid for mobile.
- **Margins:** Generous side margins (20px on mobile) ensure content doesn't feel cramped.
- **Rhythm:** An 8px linear scale drives all spacing. For journaling components, internal padding should be slightly larger (24px+) to create a "cushioned" and comfortable reading area.
- **Media-First:** Layouts prioritize large-scale imagery. Movie posters should often bleed into the background or use subtle masks to merge with the UI.

## Elevation & Depth

Depth is conveyed through **Glassmorphism and Ambient Glows** rather than traditional shadows.

1.  **Base Layer:** Deep Indigo gradient.
2.  **Surface Layer (Glass):** Semi-transparent (background-blur: 20px) panels with a 1px inner border (white at 10% opacity) to catch the light, mimicking a physical glass edge.
3.  **Floating Elements:** Buttons and active chips use a soft "Peach Glow"—a drop shadow with the primary color at 20-30% opacity and a high blur radius (15px+).
4.  **Transitions:** Use vertical translation (moving slightly upward) on hover or active states to simulate the element being lifted toward the user.

## Shapes

The shape language is **Ultra-Rounded (Pill-shaped)** to reinforce the "Mongle" brand feeling.

- **Main Containers:** Use a minimum radius of 24px.
- **Movie Posters:** These should also be rounded (16px to 24px) to soften the overall visual impact of the grid.
- **Interactive Elements:** Buttons and input fields should utilize fully rounded "pill" shapes. 
- **Icons:** Use icons with rounded caps and joins. Avoid sharp 90-degree corners in any custom iconography.

## Components

- **Buttons:** Primary buttons are pill-shaped, filled with the Mongle Peach gradient, using dark text for contrast. Secondary buttons use a glass effect with a subtle white border.
- **Journal Cards:** Large, soft-edged containers with a subtle frosted glass texture. They include a "sentiment icon" (e.g., a fluffy cloud) that changes color based on the mood of the entry.
- **Movie Chips:** Small, semi-transparent capsules used for genres or streaming platforms (Netflix, Disney+, etc.), featuring a blur-behind effect.
- **Input Fields:** Search bars and journal text areas should be minimally outlined with high corner radius. The focus state triggers a soft violet outer glow.
- **Recommendation Slider:** A horizontal scroll of movie posters with a "focus" state that scales the center poster by 1.1x and applies a vibrant background blur of the movie's key colors.
- **Mood Selector:** A custom component using "blob" shapes that morph slightly when selected, used for journaling how a movie made the user feel.