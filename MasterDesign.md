# MasterDesign.md — Nexova Unified Design System

> Extracted from **Nexova Landing Page** (the reference UI).  
> This document is the single source of truth for combining all 4 projects into one cohesive website.

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Border Radius & Shadows](#5-border-radius--shadows)
6. [Gradient System](#6-gradient-system)
7. [Component Library](#7-component-library)
8. [Section Patterns](#8-section-patterns)
9. [Animation System](#9-animation-system)
10. [Page Architecture](#10-page-architecture)
11. [CSS Variables Reference](#11-css-variables-reference)
12. [Tailwind Config Reference](#12-tailwind-config-reference)
13. [Applying to Other Projects](#13-applying-to-other-projects)

---

## 1. Brand Identity

| Property | Value |
|---|---|
| **Brand Name** | Nexova |
| **Product Name** | X.IDE |
| **Tagline** | Build • Edit • Sell — All in one flow |
| **Logo file** | `/public/assets/landing/logo-nexova.png` |
| **Logo size** | `width: 120px, height: auto`, display at `h-8` |
| **Personality** | Clean, modern, professional, product-led SaaS |
| **GTM ID** | `GTM-5GQQ6L8N` |

---

## 2. Color System

### 2.1 Nexova Brand Tokens (Primary Palette)

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| **Navy** | `--nexova-navy` | `#455263` | Primary text, buttons default, headings |
| **Teal** | `--nexova-teal` | `#5FC7CD` | Primary accent, links, focus rings, icons |
| **Canvas Gray** | `--nexova-canvas-gray` | `#F8FAFC` | Page background, alternate section bg |
| **Surface White** | `--nexova-surface-white` | `#FFFFFF` | Cards, modals, nav background |
| **Divider Gray** | `--nexova-divider-gray` | `#E2E8F0` | Borders, dividers, input borders |
| **Muted Text** | `--nexova-muted-text` | `#969696` | Secondary text, captions, metadata |
| **Danger Red** | `--nexova-danger-red` | `#EF4444` | Errors, destructive actions |
| **Warning Yellow** | `--nexova-warning-yellow` | `#FFCE33` | Warnings, highlights |
| **Accent Purple** | `--nexova-accent-purple` | `#8273B5` | Accent alternative, "business types" labels |

### 2.2 Extended Brand Colors (used directly as hex in components)

| Name | Hex | Usage |
|---|---|---|
| Teal Light | `#5BC0BE` | Gradient start, hero button, navbar button |
| Purple | `#7C74EA` | Gradient end, hero button, feature badges |
| Purple Soft | `#8B80F9` | "BusinessTypes" heading accent |
| Dark Navy BG | `#2D2B4A` | Dark section background (Problem, GridFeatures) |
| Teal Deep | `#0E7490` | Pipeline step icon gradient end |
| Warning Amber | `#FBBF24` | Problem section subtitle highlight |
| Black | `#000000` | Hero H1, bold headings on white |

### 2.3 Semantic Color Tokens (Tailwind + CSS vars)

| Token | Light Mode HSL | Used For |
|---|---|---|
| `--background` | `210 40% 98%` | Page background |
| `--foreground` | `214 18% 33%` | Body text |
| `--card` | `0 0% 100%` | Card background |
| `--primary` | `214 18% 33%` | Primary interactive |
| `--accent` | `183 52% 59%` | Accent teal |
| `--border` | `214 32% 91%` | All borders |
| `--ring` | `183 52% 59%` | Focus rings |
| `--radius` | `0.75rem` | Base border radius |
| `--muted-foreground` | `0 0% 59%` | Secondary text |

---

## 3. Typography

### 3.1 Font Family

| Role | Font | Source |
|---|---|---|
| **Primary (all text)** | Satoshi | Local `.otf` files in `/public/fonts/satoshi/` |
| **CSS Variable** | `--font-satoshi` | Loaded via `next/font/local` |
| **Tailwind class** | `font-sans` | Maps to `["var(--font-satoshi)", "sans-serif"]` |
| **Fallback** | `sans-serif` | System default |

### 3.2 Font Weights Available

| Weight | File | Tailwind class |
|---|---|---|
| 300 | `Satoshi-Light.otf` | `font-light` |
| 400 | `Satoshi-Regular.otf` | `font-normal` |
| 500 | `Satoshi-Medium.otf` | `font-medium` |
| 700 | `Satoshi-Bold.otf` | `font-bold` |
| 900 | `Satoshi-Black.otf` | `font-black` |

### 3.3 Type Scale (as used in components)

| Element | Classes | Notes |
|---|---|---|
| **Hero H1** | `text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight` | Black `#000`, up to 72px |
| **Section H2** | `text-3xl sm:text-4xl md:text-5xl font-bold leading-tight` | Navy or gradient text |
| **Section H3** | `text-xl font-bold text-gray-900` | Card/feature titles |
| **Body / Lead** | `text-xl text-gray-500 leading-relaxed` | Section descriptions, max-w-2xl |
| **Body SM** | `text-sm text-gray-500 leading-relaxed` | Feature card body, captions |
| **Label / Meta** | `text-xs text-[#969696]` | Testimonial roles, metadata |
| **Nav Link** | `text-sm font-medium text-gray-600 hover:text-gray-900` | Navbar links |
| **Button Text** | `text-sm font-bold` (default) / `text-base font-medium` (lg) | Per button size |

---

## 4. Spacing & Layout

### 4.1 Container

```html
<!-- Standard container pattern used everywhere -->
<div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
```

| Property | Value |
|---|---|
| Max width | `max-w-7xl` (1280px) |
| Horizontal padding | `px-4` → `sm:px-6` → `lg:px-8` |
| Centering | `mx-auto` |

### 4.2 Section Vertical Spacing

| Section type | Classes |
|---|---|
| Standard light section | `py-20 sm:py-32` |
| Feature/grid section | `py-24` |
| CTA section | `py-24 sm:py-32` |
| Dark section (Problem) | `pt-[24vw] md:pt-[16vw] lg:pt-[10vw]` (viewport-relative, overlaps hero) |
| Hero overlap | `pb-[30vw] md:pb-[20vw] lg:pb-[15vw]` |

### 4.3 Grid Patterns

| Layout | Classes |
|---|---|
| 2-col feature | `grid lg:grid-cols-2 gap-12 lg:gap-24 items-center` |
| 3-col features | `grid md:grid-cols-2 lg:grid-cols-3 gap-6` |
| 3-col steps | `grid md:grid-cols-3 gap-8 md:gap-12` |
| Stack → row | `flex flex-col sm:flex-row items-center gap-4` |

### 4.4 Content Max Widths

| Context | Class |
|---|---|
| Hero headline area | `max-w-4xl mx-auto` |
| Body text / descriptions | `max-w-2xl mx-auto` |
| CTA section | `max-w-5xl` |
| Hero image / features | `max-w-6xl mx-auto` |
| CTA card | `max-w-4xl mx-auto` |

---

## 5. Border Radius & Shadows

### 5.1 Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-sm` | `calc(0.75rem - 4px)` = `8px` | Small elements |
| `rounded-md` | `calc(0.75rem - 2px)` = `10px` | Medium elements |
| `rounded-lg` | `0.75rem` = `12px` | Base Tailwind `rounded-lg` |
| `rounded-xl` | `0.75rem` (custom) | Buttons, inputs, tags |
| `rounded-2xl` | Tailwind default `16px` | Feature cards, list items |
| `rounded-3xl` | Tailwind default `24px` | Gradient-border boxes, testimonial cards |
| `rounded-full` | `9999px` | Pills, nav pill, CTA buttons, badges |
| `rounded-[22px]` | `22px` | Inner surface of gradient-border boxes |

### 5.2 Shadows

| Usage | Class |
|---|---|
| Default card | `shadow-sm` |
| Feature item hover | `hover:shadow-md` |
| Hero image | `drop-shadow-2xl` |
| Floating badge | `shadow-xl` |
| CTA card | `shadow-2xl` |
| Teal glow (buttons) | `shadow-lg shadow-[#5BC0BE]/20` |
| Pipeline step icon | `shadow-lg shadow-[#5BC0BE]/20` |

---

## 6. Gradient System

The entire brand uses **one primary gradient direction**:

```
from-[#5BC0BE]  →  to-[#7C74EA]
   Teal                Purple
```

### 6.1 Gradient Use Cases

| Context | Classes |
|---|---|
| **CTA / Primary buttons** | `bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA]` |
| **Heading text** | `text-transparent bg-clip-text bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA]` |
| **Gradient borders** | `p-[2px] rounded-3xl bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA]` |
| **Testimonial card borders** | `background: linear-gradient(135deg, #5BC0BE, #7C74EA)` |
| **Pipeline step icon** | `bg-gradient-to-br from-[#5BC0BE] to-[#0E7490]` |
| **Connector lines** | `bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA]` |

### 6.2 Background Glows (CTA ambient)

```html
<!-- Layered ambient glow for CTA / hero sections -->
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5BC0BE]/10 rounded-full blur-[100px]" />
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#7C74EA]/10 rounded-full blur-[80px]" />
```

---

## 7. Component Library

### 7.1 Button

Base: `rounded-xl text-sm font-bold transition-all`

| Variant | Classes | Use |
|---|---|---|
| `default` | `bg-[#455263] text-white hover:bg-[#333d4a]` | Generic actions |
| `teal` | `bg-[#5FC7CD] text-white hover:bg-[#4bb5bb]` | Accent actions |
| `outline` | `border border-[#E2E8F0] bg-white text-[#455263] hover:bg-[#F8FAFC] hover:text-[#5FC7CD]` | Secondary actions |
| `ghost` | `hover:bg-[#F8FAFC] hover:text-[#5FC7CD]` | Inline/nav |
| `link` | `text-[#5FC7CD] underline-offset-4 hover:underline` | Inline text |
| `destructive` | `bg-destructive text-destructive-foreground` | Delete/danger |

**Sizes:** `sm: h-9 px-3` / `default: h-10 px-4` / `lg: h-11 px-8`

**Landing page override (gradient pill):**
```html
class="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full px-8 h-12 text-base font-medium shadow-lg border-0"
```

### 7.2 Card

```html
<!-- Base card -->
<div class="rounded-2xl border border-[#E2E8F0] bg-card shadow-sm">
  <!-- CardHeader: p-6 -->
  <!-- CardContent: p-6 pt-0 -->
  <!-- CardFooter: p-6 pt-0 flex items-center -->
</div>
```

**Gradient border card:**
```html
<div class="p-[2px] rounded-3xl bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA]">
  <div class="bg-white rounded-[22px] w-full h-full p-8">
    <!-- content -->
  </div>
</div>
```

**Dark glassmorphism card (on dark bg):**
```html
<div class="bg-white/10 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/15 transition-colors duration-300">
```

### 7.3 Badge

| Variant | Classes |
|---|---|
| `default` | `bg-primary text-primary-foreground` |
| `teal` | `bg-[#5FC7CD]/10 text-[#5FC7CD]` |
| `success` | `bg-green-100 text-green-700` |
| `outline` | `text-foreground border` |

Base shape: `rounded-full px-2.5 py-0.5 text-xs font-semibold`

**Floating business type badge:**
```html
<div class="bg-white border border-gray-100 shadow-xl rounded-full px-6 py-3 flex items-center gap-2 transform -rotate-6">
```

### 7.4 Input

```html
<input class="flex h-10 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm
  placeholder:text-muted-foreground
  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5FC7CD] focus-visible:border-[#5FC7CD]
  disabled:cursor-not-allowed disabled:opacity-50" />
```

### 7.5 Navbar

```
Position: sticky top-0 z-50
Background: bg-white/80 backdrop-blur-md
Height: h-24
Layout: container max-w-7xl — logo | centered pill nav | right actions
Nav pill: bg-gray-100/80 rounded-full px-8 py-3 backdrop-blur-sm
CTA button: gradient pill (from-[#5BC0BE] to-[#7C74EA]) rounded-full
```

### 7.6 RevealOnScroll (Animation Wrapper)

```tsx
// Wraps any section — fade + slide up on scroll into view
<RevealOnScroll delay={200}>
  <Section />
</RevealOnScroll>

// Behaviour: opacity 0 + translateY(48px) → opacity 1 + translateY(0)
// Duration: 1000ms ease-out
// Trigger: IntersectionObserver at threshold 0.1, rootMargin -50px bottom
// Once triggered, stays visible (observer disconnects)
```

---

## 8. Section Patterns

### 8.1 Hero Section

```
Background: bg-white
Layout: text-center, max-w-4xl headline, flex buttons
H1 style: text-5xl→7xl font-bold tracking-tight text-black
Teal bullet: <span class="text-[#4FD1C5]">•</span>
CTA buttons: gradient pill + black pill, flex-col sm:flex-row
Hero image: -mb-[50vw] md:-mb-[35vw] (overlaps next section)
floating elements: animate-float / animate-float-slow, hidden md:block
Dotted decorative SVG lines: stroke="#E5E7EB" strokeDasharray="6 6"
```

### 8.2 Problem / Dark Section

```
Background: absolute image fill + bg-[#2D2B4A] fallback + bg-black/10 overlay
Text: text-white + text-[#FBBF24] for highlight
Padding: viewport-relative (overlaps hero and next section)
Purpose: Creates a dramatic contrast "pain point" moment
```

### 8.3 Features (3-step flow)

```
Background: bg-white
Cards: gradient border boxes (p-[2px] rounded-3xl)
Inner: bg-white rounded-[22px], image fill with object-contain
Connector: horizontal line bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA]
Hover: group-hover:-translate-y-2, image group-hover:scale-105
Label: text-gray-400 font-medium text-lg tracking-wide
```

### 8.4 Pipeline (Interactive Steps)

```
Background: bg-[#F8F9FB]
Layout: lg:grid-cols-2 gap-16 items-center
Left: numbered steps (01–04) with vertical line connector
Step icon: w-16 h-16 rounded-xl gradient bg, grayscale → color on hover
Active state: controlled by onMouseEnter (useState)
Right: stacked images fading between opacity via transition-opacity duration-700
```

### 8.5 JugglingTools (Split Feature)

```
Background: bg-white
Layout: lg:grid-cols-2 gap-12 lg:gap-24 items-center
Left: large image with drop-shadow-2xl, hover:scale-[1.02]
Right: feature list cards
  - p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md
  - icon (48×48) + h3 + p layout
  - flex items-start gap-6
```

### 8.6 GridFeatures (Dark Card Grid)

```
Background: same dark bg image as Problem, rotate-180 for variety
Grid: md:grid-cols-2 lg:grid-cols-3 gap-6
Cards: bg-white/10 backdrop-blur-sm border border-white/10 p-8 rounded-2xl
Text: text-white (title) + text-white/70 (body)
```

### 8.7 Testimonials (Auto-scrolling Marquee)

```
Background: bg-white (inferred from context)
Layout: Two rows scrolling in opposite directions (marquee/infinite scroll)
Card: gradient border (135deg, #5BC0BE, #7C74EA), p-[2px], rounded-3xl
Inner card: bg-white rounded-[22px], p-5, text-[#455263]
Card heights: fixed 13rem, variable widths (16–20rem)
Scroll: CSS or requestAnimationFrame, pauses on hover
```

### 8.8 BusinessTypes (Floating Badges + CTA Card)

```
Background: bg-white
Center: absolute positioned h2 inside relative positioned container
Badges: bg-white shadow-xl rounded-full px-6 py-3, with slight rotation (-6deg to 6deg)
Colors: text-[#4FD1C5] and text-[#8B80F9] alternated
Animation: animate-float / animate-float-slow
Bottom CTA card: rounded-3xl p-12 shadow-2xl border border-gray-100
  gradient bg glow: from-[#5BC0BE]/5 to-[#7C74EA]/5
  CTA button: gradient pill, full width on mobile
```

### 8.9 Pricing

```
Background: bg-white (inferred)
Plans: Free / Premium (highlighted) / Enterprise
Highlighted plan: gradient border, prominent styling
Features table: Check (✓) / X icons per plan, with Lock icon for premium
CTA routing: router.push to /signup or /contact
```

### 8.10 CTA Section

```
Background: bg-white + layered ambient gradient glows (absolute, z-0)
Layout: text-center, max-w-5xl container
H2: text-4xl→6xl font-bold + gradient text span
Primary button: gradient pill, h-14 px-10 text-lg hover:scale-105
Secondary button: ghost rounded-full with ArrowRight icon, group-hover translate-x-1
Footnote: text-sm text-gray-400 "No credit card required"
```

### 8.11 Footer

```
Background: border-t bg-gray-50
Layout: flex-col md:flex-row items-center justify-between gap-4 py-12
Brand: text-xl font-bold "X.IDE"
Copyright: text-sm text-gray-600
Nav links: Privacy / Terms / Contact, text-gray-600 hover:text-gray-900
```

---

## 9. Animation System

### 9.1 Custom Keyframes

```css
/* Float — used by hero floating elements and business type badges */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-20px); }
}

/* Usage */
.animate-float      { animation: float 6s ease-in-out infinite; }
.animate-float-slow { animation: float 8s ease-in-out infinite; }
```

### 9.2 Scroll Reveal

All page sections use `<RevealOnScroll>`:

```
Initial state:  opacity: 0,  transform: translateY(48px)
Revealed state: opacity: 1,  transform: translateY(0)
Transition:     duration-1000 ease-out
Delay:          0ms (hero) → 200ms (all subsequent sections)
Trigger:        IntersectionObserver, threshold 0.1, rootMargin -50px bottom
Behaviour:      One-shot (disconnects after triggering — stays visible)
```

### 9.3 Hover Transitions

| Pattern | Classes |
|---|---|
| Card lift | `hover:-translate-y-2 transition-transform duration-300` |
| Image scale | `group-hover:scale-105 transition-transform duration-500` |
| Button press | `hover:scale-105 transition-all` |
| Image hover | `hover:scale-[1.02] transition-transform duration-500` |
| Icon arrow | `group-hover:translate-x-1 transition-transform` |
| Step icon colour | `grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out` |
| Card bg | `hover:bg-white/15 transition-colors duration-300` |
| Shadow lift | `hover:shadow-md transition-all duration-300` |

### 9.4 Glassmorphism

```css
backdrop-blur-md   /* Navbar */
backdrop-blur-sm   /* Nav pill, dark feature cards */
bg-white/80        /* Navbar bg */
bg-white/10        /* Dark section cards */
bg-gray-100/80     /* Nav pill bg */
border-white/10    /* Dark card borders */
```

---

## 10. Page Architecture

### 10.1 Full Page Section Order

```
Navbar (sticky)
  └─ Hero              — bg-white, overlaps downward
  └─ Problem           — dark image bg, overlaps hero bottom
  └─ Features          — bg-white, 3-step gradient cards
  └─ Testimonials      — bg-white, auto-scroll marquee
  └─ Pipeline          — bg-[#F8F9FB], interactive steps
  └─ JugglingTools     — bg-white, split layout
  └─ GridFeatures      — dark image bg, card grid
  └─ BusinessTypes     — bg-white, floating badges
  └─ Pricing           — bg-white, 3-tier plans
  └─ CTA               — bg-white, ambient glow
Footer
```

### 10.2 Colour Rhythm (Section Alternation)

```
White → Dark → White → White → Light Gray → White → Dark → White → White → White → Gray footer
```

### 10.3 HTML/Body Setup

```html
<html lang="en" class="overflow-x-hidden">
<body class="bg-background text-foreground font-sans">
```

```css
html { scroll-behavior: smooth; }
section[id], div[id^="hero-"], div[id^="features-"] ... {
  scroll-margin-top: 4rem; /* offset for sticky navbar */
}
```

### 10.4 Z-Index Layering

| Element | z-index |
|---|---|
| Navbar | `z-50` |
| Hero section wrapper | `z-20` (above Problem overlap) |
| Problem section | `z-10` |
| Hero image | `z-10` inside section |
| Floating hero elements | `z-30` |
| Dark section bg | `z-0` |
| Dark section content | `z-10` |
| Glow elements | `z-0` (pointer-events-none) |

---

## 11. CSS Variables Reference

Paste this into any project's `globals.css` to immediately adopt the Nexova design system:

```css
@layer base {
  :root {
    --background: 210 40% 98%;
    --foreground: 214 18% 33%;
    --card: 0 0% 100%;
    --card-foreground: 214 18% 33%;
    --popover: 0 0% 100%;
    --popover-foreground: 214 18% 33%;
    --primary: 214 18% 33%;
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 98%;
    --secondary-foreground: 214 18% 33%;
    --muted: 210 40% 98%;
    --muted-foreground: 0 0% 59%;
    --accent: 183 52% 59%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 183 52% 59%;
    --radius: 0.75rem;

    /* Nexova Brand Tokens */
    --nexova-navy: #455263;
    --nexova-teal: #5fc7cd;
    --nexova-canvas-gray: #f8fafc;
    --nexova-surface-white: #ffffff;
    --nexova-divider-gray: #e2e8f0;
    --nexova-muted-text: #969696;
    --nexova-danger-red: #ef4444;
    --nexova-warning-yellow: #ffce33;
    --nexova-accent-purple: #8273b5;
  }
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-20px); }
}
.animate-float      { animation: float 6s ease-in-out infinite; }
.animate-float-slow { animation: float 8s ease-in-out infinite; }
```

---

## 12. Tailwind Config Reference

Minimal `tailwind.config` that applies the Nexova system to any Tailwind project:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-satoshi)', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        nexova: {
          navy: 'var(--nexova-navy)',
          teal: 'var(--nexova-teal)',
          'canvas-gray': 'var(--nexova-canvas-gray)',
          'surface-white': 'var(--nexova-surface-white)',
          'divider-gray': 'var(--nexova-divider-gray)',
          'muted-text': 'var(--nexova-muted-text)',
          'danger-red': 'var(--nexova-danger-red)',
          'warning-yellow': 'var(--nexova-warning-yellow)',
          'accent-purple': 'var(--nexova-accent-purple)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 13. Applying to Other Projects

### Projects Overview

| Project | Type | Current State | Target Port |
|---|---|---|---|
| **Nexova Landing Page** | Next.js 14 + Tailwind | ✅ Reference / Source of Truth | 3001 |
| **Nexova Elements** | Next.js 16 + Tailwind v4 | ✅ Running | 3000 |
| **Leanx Landing Page** | Static HTML + SCSS | ✅ Running (served) | 5500 |
| **Nexova Marketplace** | Static HTML | ✅ Running (served) | 5501 |

### 13.1 For Nexova Elements (Next.js 16 / Tailwind v4)

Tailwind v4 uses a different config approach (CSS-first). Steps to apply:

1. Add the CSS variables block (Section 11) to your `globals.css`
2. In Tailwind v4's `@import "tailwindcss"`, add theme tokens via `@theme` directive:
   ```css
   @theme {
     --color-nexova-teal: #5fc7cd;
     --color-nexova-navy: #455263;
     --color-nexova-purple: #7c74ea;
     --font-sans: "Satoshi", sans-serif;
   }
   ```
3. Copy the Satoshi font files from `Nexova Landing Page/public/fonts/satoshi/` into this project's `/public/fonts/satoshi/`
4. Add the float animation to globals.css

### 13.2 For Leanx Landing Page (Static HTML)

1. Add `brand-variables.css` (already exists — update it with Section 11 variables)
2. Link the Satoshi font via `@font-face` in CSS pointing to font files
3. Reference `nexova-teal`, `nexova-navy`, gradient values directly in class utilities
4. Replicate section patterns using plain HTML/CSS following the patterns in Section 8

### 13.3 For Nexova Marketplace (Static HTML)

> ⚠️ **MANDATORY — FULL DEPTH REQUIRED**
> Apply at the same depth as Nexova Elements. Every section, card, text element, and button must be updated. Do NOT stop at font + navbar. Partial application is not acceptable.

Full checklist:
- [x] Satoshi font via local `@font-face` (done)
- [x] Sticky Nexova navbar — frosted glass, pill nav, gradient CTA (done)
- [x] Body text color → `#455263` (navy), `--text-black: #455263` in `:root`
- [x] Page background → `#F8FAFC` (canvas gray) for non-hero sections
- [x] `problem-section` background → `#F8FAFC`
- [x] Feature cards → `background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);`
- [x] Feature card hover → `border-color: rgba(95,199,205,0.5); box-shadow: 0 8px 24px rgba(91,192,190,0.15);`
- [x] Section titles → color `#455263`, font-weight 700
- [x] Problem item border-left → `#5FC7CD`; bullet dot → `#5FC7CD`; hover dot → `#7C74EA`
- [x] CTA buttons → `background: linear-gradient(135deg, #5BC0BE, #7C74EA); color: white; border-radius: 9999px;`
- [x] Secondary CTA buttons → `border: 2px solid white; color: white` (on dark bg), hover → fill white, text `#455263`
- [x] Footer → background `#455263`, text white (already was — kept)
- [x] Sticky contact bar → gradient `linear-gradient(135deg, #5BC0BE, #7C74EA)`
- [x] Security/support badge cards → `border-left: 4px solid #5FC7CD`
- [x] Security section → `background: linear-gradient(135deg, #FFFFFF, #F8FAFC); border: 1px solid #E2E8F0;`
- [x] Testimonial card → `border: 1px solid #E2E8F0;`; quote mark → `#5FC7CD`
- [x] Testimonial author → color `#5FC7CD`
- [x] Behavior section overlay → `linear-gradient(135deg, rgba(69,82,99,0.80), rgba(91,192,190,0.65))`; fallback gradient `#455263 → #5BC0BE`
- [x] Hero section fallback gradient → `linear-gradient(135deg, #5BC0BE, #7C74EA)`
- [x] Capability cards → same white/border/shadow pattern as feature cards
- [x] About intro heading → `#455263`, font-weight 600
- [x] Applied to BOTH `index.html` AND `clothing-store-landing.html` ✅

### 13.4 Shared Principles for All Projects

1. **One gradient:** always `from-[#5BC0BE] to-[#7C74EA]` left-to-right
2. **One font:** Satoshi (weight 400/500/700/900)
3. **One primary color:** `#455263` (navy) for text, `#5FC7CD` (teal) for accent
4. **Pill buttons for CTAs:** always `rounded-full` with gradient for primary actions
5. **Reveal on scroll:** wrap sections in a fade+translate-up wrapper
6. **Container:** always `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
7. **Section alternation:** White → Dark → White rhythm
8. **Glassmorphism on dark:** `bg-white/10 backdrop-blur-sm border border-white/10`

---

*Last updated: March 2026 — extracted from Nexova Landing Page (localhost:3001)*
