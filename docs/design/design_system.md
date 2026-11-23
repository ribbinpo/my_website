---
name: "Studio 01 — Editorial Neo-Brutalist"
description: "High-contrast creative studio design system blending condensed brutalist typography, crisp 1px structural grids, muted concrete surfaces, and vibrant anime-tech accents."
---

## Overview

**Studio 01** is an editorial neo-brutalist design system built for creative animation, character design, and digital art studios. It pairs the tactile discipline of print zines and technical specification sheets with expressive, high-energy anime-tech illustration.

- **Brand Personality:** Bold, curious, craft-obsessed, and unapologetically graphic.
- **Target Audience:** Creative directors, brand founders, interactive producers, and art-forward collaborators.
- **Visual Style:** High-Contrast Editorial Brutalism — heavy uppercase display headlines punctuated by hot-magenta square periods, muted warm-concrete and off-white paper grounds, deep charcoal-navy dark bands, and flat 1px structural hairlines with zero drop shadows.

## Colors

The palette anchors on deep charcoal-ink (`#020610` / `#191F2A`) against muted warm concrete (`#D8DBD5`) and crisp off-white (`#F8FAF4`) surfaces. Three signature graphic accents — **Electric Cyan** (`#72D7D3`), **Apricot Peach** (`#F9B988`), and **Hot Magenta** (`#E83E8C`) — provide band-level color blocking, illustration halos, and micro-punctuation without diluting text legibility.

- **Primary & Ink:** Deep charcoal navy (`#020610` and `#191F2A`) serves as the primary action fill, dark-band surface, and display ink.
- **Signature Accents:** `accent-cyan` powers marquee tickers and technical highlights; `accent-peach` warms studio narrative bands and character halos; `accent-magenta` is reserved strictly for slashes (`/`), square headline periods (`.`), and micro-indicators.
- **Surfaces & Hairlines:** Light surfaces step from `#F8FAF4` down to `#D8DBD5` (`surface-dim`) for hero grounds, separated by `1px` `outline-variant` (`#C6C6CC`) or `primary` structural borders.

```yaml
colors:
  accent-cyan: "#72D7D3"
  accent-peach: "#F9B988"
  accent-magenta: "#E83E8C"
  light:
    primary: "#020610"
    on-primary: "#FFFFFF"
    primary-container: "#191F2A"
    on-primary-container: "#D8DDE8"
    secondary: "#006A67"
    on-secondary: "#FFFFFF"
    secondary-container: "#8FF3EF"
    on-secondary-container: "#003736"
    tertiary: "#83532B"
    on-tertiary: "#FFFFFF"
    tertiary-container: "#FFDCC3"
    on-tertiary-container: "#2F1500"
    error: "#BA1A1A"
    on-error: "#FFFFFF"
    error-container: "#FFDAD6"
    on-error-container: "#93000A"
    background: "#F8FAF4"
    on-background: "#191D19"
    surface: "#F8FAF4"
    surface-dim: "#D8DBD5"
    surface-bright: "#F8FAF4"
    surface-container-lowest: "#FFFFFF"
    surface-container-low: "#F2F4EE"
    surface-container: "#ECEFE9"
    surface-container-high: "#E6E9E3"
    surface-container-highest: "#E0E3DD"
    on-surface: "#191D19"
    surface-variant: "#E2E2E8"
    on-surface-variant: "#45474C"
    outline: "#76777C"
    outline-variant: "#C6C6CC"
    inverse-surface: "#2E312D"
    inverse-on-surface: "#EFF2EB"
    inverse-primary: "#C1C6D5"
    shadow: "#000000"
    scrim: "#000000"
  dark:
    primary: "#C1C6D5"
    on-primary: "#191F2A"
    primary-container: "#191F2A"
    on-primary-container: "#DDE2F2"
    secondary: "#72D7D3"
    on-secondary: "#003736"
    secondary-container: "#00504E"
    on-secondary-container: "#8FF3EF"
    tertiary: "#F9B988"
    on-tertiary: "#2F1500"
    tertiary-container: "#4D2702"
    on-tertiary-container: "#FFDCC3"
    error: "#FFB4AB"
    on-error: "#690005"
    error-container: "#93000A"
    on-error-container: "#FFDAD6"
    background: "#111411"
    on-background: "#E0E3DD"
    surface: "#111411"
    surface-dim: "#111411"
    surface-bright: "#363A36"
    surface-container-lowest: "#0B0F0C"
    surface-container-low: "#191D19"
    surface-container: "#1D211D"
    surface-container-high: "#272B27"
    surface-container-highest: "#323632"
    on-surface: "#E0E3DD"
    surface-variant: "#45474C"
    on-surface-variant: "#C6C6CC"
    outline: "#8F9096"
    outline-variant: "#45474C"
    inverse-surface: "#E0E3DD"
    inverse-on-surface: "#2E312D"
    inverse-primary: "#595E6B"
    shadow: "#000000"
    scrim: "#000000"
```

## Typography

A three-role typographic hierarchy pairs **Schibsted Grotesk** (extra-bold, tight-tracked uppercase for display and section headlines), **Commissioner** (clean, open-counter humanist sans for body copy and descriptions), and **Spline Sans Mono** (technical uppercase micro-labels, index numbers `01 //`, and category tags).

- Display and headline levels are set in uppercase with tight negative tracking (`-0.03em`) and compact line height (`1.0`–`1.15`).
- Monospace labels use wide positive tracking (`0.08em`) in uppercase for technical contrast against heavy display blocks.

```yaml
typography:
  display-lg:
    fontFamily: "Schibsted Grotesk"
    fontSize: 64px
    fontWeight: 900
    lineHeight: 64px
    letterSpacing: -2px
  display-lg-mobile:
    fontFamily: "Schibsted Grotesk"
    fontSize: 32px
    fontWeight: 900
    lineHeight: 34px
    letterSpacing: -1px
  display-md:
    fontFamily: "Schibsted Grotesk"
    fontSize: 48px
    fontWeight: 900
    lineHeight: 50px
    letterSpacing: -1.5px
  display-md-mobile:
    fontFamily: "Schibsted Grotesk"
    fontSize: 28px
    fontWeight: 900
    lineHeight: 30px
    letterSpacing: -0.75px
  headline-lg:
    fontFamily: "Schibsted Grotesk"
    fontSize: 36px
    fontWeight: 800
    lineHeight: 40px
    letterSpacing: -1px
  headline-lg-mobile:
    fontFamily: "Schibsted Grotesk"
    fontSize: 24px
    fontWeight: 800
    lineHeight: 28px
    letterSpacing: -0.5px
  headline-md:
    fontFamily: "Schibsted Grotesk"
    fontSize: 24px
    fontWeight: 800
    lineHeight: 28px
    letterSpacing: -0.5px
  title-lg:
    fontFamily: "Schibsted Grotesk"
    fontSize: 18px
    fontWeight: 800
    lineHeight: 24px
    letterSpacing: -0.25px
  title-md:
    fontFamily: "Schibsted Grotesk"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 22px
    letterSpacing: 0px
  body-lg:
    fontFamily: "Commissioner"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-md:
    fontFamily: "Commissioner"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 21px
    letterSpacing: 0px
  body-sm:
    fontFamily: "Commissioner"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0.1px
  label-lg:
    fontFamily: "Spline Sans Mono"
    fontSize: 13px
    fontWeight: 700
    lineHeight: 18px
    letterSpacing: 1px
  label-md:
    fontFamily: "Spline Sans Mono"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.9px
  label-sm:
    fontFamily: "Spline Sans Mono"
    fontSize: 10px
    fontWeight: 600
    lineHeight: 14px
    letterSpacing: 0.8px
```

## Layout & Spacing

The layout uses a **12-Column Editorial Grid** on desktop (`max-width: 1280px`) with full-bleed color-blocked horizontal bands (`Hero`, `Marquee Ticker`, `Selected Work`, `Services`, `Our Studio`, `Contact`, `Footer`) separated by `1px` full-width structural rules.

- **Grid & Columns:** Desktop uses 12 columns with `24px` gutters and `32px` page margins; tablet (`768px`) collapses to 8 columns; mobile (`390px`) collapses to 4 columns with `16px` gutters and `16px` page margins.
- **Rhythm:** All internal component padding and band spacing derive from a strict `4px` / `8px` base unit. Keep internal card padding (`16px`–`24px`) distinct from vertical section rhythm (`48px`–`64px`).

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 16px
  gutter-lg: 24px
  gutter-xl: 32px
  section: 48px
  page-margin: 32px
```

## Elevation & Depth

**Flat & Structural.** Elevation is communicated exclusively through **tonal band shifts** (concrete `#D8DBD5`, off-white `#F8FAF4`, dark charcoal `#191F2A`, peach `#F9B988`, cyan `#72D7D3`) and **crisp `1px` solid borders** (`outline-variant` or `primary`).

- **Zero Drop Shadows:** Never apply blurred drop shadows or soft ambient elevation to cards, buttons, or navigation bars.
- **Rule-Separated Grids:** Multi-column sections (such as the 3-column Services row or Selected Work cards) use `1px` vertical dividers and `1px` framed image containers to establish hierarchy.

## Shapes

Geometry is **sharp and architectural**, reinforcing the print-editorial and technical-spec aesthetic.

- **Cards, Inputs, & Buttons:** Use `none` (`0px`) or `xs` (`2px`) for structural containers, primary CTA buttons (`VIEW OUR WORK ↗`, `LET'S TALK ↗`), and bordered portfolio frames.
- **Badges & Pills:** Reserve `full` (`9999px`) strictly for circular character halos, numbered index badges, and small circular icon buttons (e.g., `+` expand triggers or social icons).

```yaml
rounded:
  none: 0px
  xs: 2px
  sm: 4px
  DEFAULT: 2px
  md: 4px
  lg: 8px
  full: 9999px
```

## Motion & Micro-interaction

Motion is **crisp, mechanical, and immediate** — inspired by print registration marks snapping into place and camera-shutter cuts.

- **Interactive Feedback:** Buttons, links, and `+` card triggers respond within `100ms` using sharp `transform` shifts (e.g., `translate(2px, -2px)` on diagonal `↗` arrows) and instant background/ink inversions.
- **Section & Marquee Rhythm:** Horizontal ticker strips glide continuously at a steady linear pace; drawer or modal reveals decelerate briskly over `220ms`.
- **Restraint:** Honor `prefers-reduced-motion`; animate only `transform` and `opacity`.

```yaml
motion:
  state-change:
    duration: 100ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-enter:
    duration: 220ms
    delay: 0ms
    timingFunction: cubic-bezier(0.16, 1, 0.3, 1)
  surface-exit:
    duration: 140ms
    delay: 0ms
    timingFunction: cubic-bezier(0.4, 0, 1, 1)
```

## Voice & Content Strategy

Studio 01 writes with **concise, confident, human-first clarity** — never corporate jargon, never bloated paragraphs.

- **Tone of Voice:** Direct, imaginative, craft-led. Short declarative statements ("We create worlds with character.", "A small studio for brighter worlds.") paired with warm, approachable subcopy.
- **Capitalisation:** Display headlines, navigation items, and technical mono labels (`SELECTED WORK`, `01 // CHARACTER DESIGN`) use **ALL CAPS**; body copy and descriptions use **Sentence case**.
- **Action Labels:** Buttons use short, outcome-driven verb phrases paired with a directional arrow (`VIEW OUR WORK ↗`, `LET'S TALK ↗`, `ALL WORK →`).
- **Indexing & Punctuation:** Use two-digit zero-padded indices (`01`, `02`, `03`) with forward slashes (`/`) as category separators and a trailing square dot as a visual signature on major headlines.

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Badge** → `@components/badge.html`: `badge-numeric`, `badge-dot`
- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Typography** → `@components/typography.html`: `typography-display`, `typography-body`, `typography-label`
