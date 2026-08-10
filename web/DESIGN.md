# Design System — Vibrant Bites Recipe App

> **Source:** Stitch project `projects/9997559073370894433`  
> **Theme name:** Delicious Pop  
> **Color mode:** Light  
> **Device target:** Desktop

---

## Brand & Style

This design system is built on a **"Vibrant Gourmet"** aesthetic, merging the high-energy look of modern social media with the warmth of a premium culinary experience. The target audience is young, food-conscious urbanites who value both aesthetics and accessibility.

The visual style is a blend of **Minimalism** and **Tactile Modernism** — expansive white space and a soft cream foundation let food photography shine, while "squishy" interactive elements (large radii, subtle lifts, high-saturation accents) make the UI feel bouncy and responsive. The emotional goal is to evoke optimism, hunger, and effortless discovery.

---

## Color Palette

### Brand Colors (override palette)
| Token | Value | Usage |
|-------|-------|-------|
| Primary (Coral Punch) | `#ff6b6b` | CTAs, active states, appetite-driving accents |
| Secondary (Mustard) | `#ffd166` | Highlights, ratings, warnings |
| Tertiary (Mint) | `#06d6a0` | Fresh tags, success states, dietary indicators |
| Neutral | `#fdfcf8` | Background base |

### Full Named Colors (Material Design tokens)
| Token | Value |
|-------|-------|
| `background` | `#faf9f5` |
| `on-background` | `#1b1c1a` |
| `surface` | `#faf9f5` |
| `surface-dim` | `#dbdad6` |
| `surface-bright` | `#faf9f5` |
| `surface-container-lowest` | `#ffffff` |
| `surface-container-low` | `#f4f4f0` |
| `surface-container` | `#efeeea` |
| `surface-container-high` | `#e9e8e4` |
| `surface-container-highest` | `#e3e2df` |
| `on-surface` | `#1b1c1a` |
| `on-surface-variant` | `#584140` |
| `surface-variant` | `#e3e2df` |
| `inverse-surface` | `#2f312e` |
| `inverse-on-surface` | `#f2f1ed` |
| `outline` | `#8c706f` |
| `outline-variant` | `#e0bfbd` |
| `surface-tint` | `#ae2f34` |
| `primary` | `#ae2f34` |
| `primary-container` | `#ff6b6b` |
| `on-primary` | `#ffffff` |
| `on-primary-container` | `#6d0010` |
| `inverse-primary` | `#ffb3b0` |
| `primary-fixed` | `#ffdad8` |
| `primary-fixed-dim` | `#ffb3b0` |
| `on-primary-fixed` | `#410006` |
| `on-primary-fixed-variant` | `#8c1520` |
| `secondary` | `#785a00` |
| `secondary-container` | `#ffd167` |
| `on-secondary` | `#ffffff` |
| `on-secondary-container` | `#765900` |
| `secondary-fixed` | `#ffdf9b` |
| `secondary-fixed-dim` | `#edc157` |
| `on-secondary-fixed` | `#251a00` |
| `on-secondary-fixed-variant` | `#5b4300` |
| `tertiary` | `#006c4f` |
| `tertiary-container` | `#00b083` |
| `on-tertiary` | `#ffffff` |
| `on-tertiary-container` | `#003b29` |
| `tertiary-fixed` | `#54fdc4` |
| `tertiary-fixed-dim` | `#27e0a9` |
| `on-tertiary-fixed` | `#002116` |
| `on-tertiary-fixed-variant` | `#00513b` |
| `error` | `#ba1a1a` |
| `error-container` | `#ffdad6` |
| `on-error` | `#ffffff` |
| `on-error-container` | `#93000a` |

---

## Typography

### Fonts
| Role | Font Family | Google Fonts import name |
|------|-------------|--------------------------|
| Headline / Display / Label | **Plus Jakarta Sans** | `Plus+Jakarta+Sans` |
| Body / Long-form | **Be Vietnam Pro** | `Be+Vietnam+Pro` |

### Type Scale
| Token | Font | Size | Weight | Line Height | Letter Spacing |
|-------|------|------|--------|-------------|----------------|
| `display-lg` | Plus Jakarta Sans | 48px | 800 | 1.1 | -0.02em |
| `headline-lg` | Plus Jakarta Sans | 32px | 700 | 1.2 | -0.01em |
| `headline-lg-mobile` | Plus Jakarta Sans | 28px | 700 | 1.2 | — |
| `headline-md` | Plus Jakarta Sans | 24px | 700 | 1.3 | — |
| `body-lg` | Be Vietnam Pro | 18px | 400 | 1.6 | — |
| `body-md` | Be Vietnam Pro | 16px | 400 | 1.5 | — |
| `label-md` | Plus Jakarta Sans | 14px | 600 | 1.4 | 0.02em |
| `label-sm` | Plus Jakarta Sans | 12px | 700 | 1.2 | — |

---

## Spacing

Base unit: **8px** — all spacing values are multiples of 8.

| Token | Value | CSS Variable |
|-------|-------|--------------|
| `xs` | 4px | `--spacing-xs` |
| `sm` | 12px | `--spacing-sm` |
| `base` | 8px | `--spacing-base` |
| `md` | 24px | `--spacing-md` |
| `lg` | 40px | `--spacing-lg` |
| `xl` | 64px | `--spacing-xl` |
| `gutter` | 20px | `--spacing-gutter` |
| `margin-mobile` | 16px | `--spacing-margin-mobile` |
| `margin-desktop` | 48px | `--spacing-margin-desktop` |

---

## Border Radius (Roundness)

Shape language: **Hyper-Rounded** geometries for a soft, organic feel.

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 0.25rem (4px) | Subtle chips, small badges |
| `rounded` (DEFAULT) | 0.5rem (8px) | Standard inputs, tags |
| `rounded-md` | 0.75rem (12px) | Secondary buttons |
| `rounded-lg` | 1rem (16px) | Primary buttons (minimum) |
| `rounded-xl` | 1.5rem (24px) | Cards, large containers |
| `rounded-full` | 9999px | Pills, avatars, circular icons |

---

## Layout & Grid

| Context | Columns | Max Width | Margin | Gutter |
|---------|---------|-----------|--------|--------|
| Desktop | 12 | 1200px | 48px | 20px |
| Mobile | 4 | 100% | 16px | 20px |

---

## Elevation & Depth

This system uses **Ambient, Tinted Depth** — no harsh drop shadows.

| Level | Usage | Shadow spec |
|-------|-------|-------------|
| Surface | Cards at rest | `0 4px 10px rgba(255,107,107,0.04)` |
| Interactive | Cards on hover | `0 8px 20px rgba(255,107,107,0.08)` + `scale(1.02)` |
| Floating | FABs, badges | Higher-contrast shadow, clearly detached from canvas |

---

## Component Guidelines

### Buttons
- **Primary:** Solid Coral Punch (`#ff6b6b`) fill, white text, 2px bottom shadow-border in darker coral. Hover = subtle lift (translateY(-2px)).
- **Secondary:** Transparent bg, 1.5px coral outline.
- Minimum radius: `rounded-lg` (1rem). No sharp corners anywhere.

### Cards
- White (`#ffffff`) background on cream (`#faf9f5`) surface.
- `rounded-xl` (1.5rem / 24px) corner radius with `overflow-hidden`.
- Titles use `headline-md` type scale.
- Food images: 1:1 aspect ratio preferred.
- Rest shadow: tinted coral at 4% opacity. Hover shadow: 8% opacity + scale(1.02).

### Chips & Badges
- Pill-shaped (`rounded-full`).
- Floating badges: top-right overlay on images.
- Use secondary (Mustard) or tertiary (Mint) colors.
- Typography: `label-sm`.

### Input Fields
- Rest: Light grey background (`#f8f9fa`), no visible border.
- Focus: 2px Coral Punch border + soft outer glow (`box-shadow: 0 0 0 3px rgba(255,107,107,0.2)`).

### Icons
- Line icons with **2.5px stroke width** for visual weight consistency.
