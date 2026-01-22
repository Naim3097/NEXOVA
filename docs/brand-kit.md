# Product Page Builder - Brand Kit & Design System

A comprehensive guide to the design language, colors, typography, and component patterns used throughout the application.

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Border Radius](#border-radius)
5. [Shadows](#shadows)
6. [Button Styles](#button-styles)
7. [Component Patterns](#component-patterns)
8. [Builder Elements](#builder-elements)
9. [Responsive Design](#responsive-design)
10. [Accessibility](#accessibility)

---

## Color Palette

### Primary Colors

| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| **Primary** | `#1e293b` | `hsl(222.2 47.4% 11.2%)` | Main brand color, primary buttons |
| **Primary Foreground** | `#f8fafc` | `hsl(210 40% 98%)` | Text on primary backgrounds |
| **Blue 600** | `#2563eb` | - | Action buttons, links, highlights |
| **Blue 500** | `#3b82f6` | - | Hover states, accents |

### Neutral Colors

| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| **Background** | `#ffffff` | `hsl(0 0% 100%)` | Main background |
| **Foreground** | `#0f172a` | `hsl(222.2 84% 4.9%)` | Primary text |
| **Muted** | `#f1f5f9` | `hsl(210 40% 96.1%)` | Subtle backgrounds |
| **Muted Foreground** | `#64748b` | `hsl(215.4 16.3% 46.9%)` | Secondary text |
| **Border** | `#e2e8f0` | `hsl(214.3 31.8% 91.4%)` | Borders, dividers |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Destructive** | `#ef4444` | Errors, delete actions |
| **Success** | `#22c55e` | Success states, confirmations |
| **Warning** | `#eab308` | Warnings, cautions |
| **Info** | `#3b82f6` | Informational alerts |

### Default Element Colors

| Property | Hex | Usage |
|----------|-----|-------|
| Headline Color | `#111827` | Section headings |
| Subheadline Color | `#4b5563` | Subtitles, descriptions |
| Button Background | `#2563eb` | CTA buttons |
| Button Text | `#ffffff` | Button labels |
| Section Background | `#f9fafb` | Alternating section backgrounds |

### Dark Mode Colors

| Name | HSL | Usage |
|------|-----|-------|
| Background | `hsl(222.2 84% 4.9%)` | Dark background |
| Foreground | `hsl(210 40% 98%)` | Light text |
| Secondary | `hsl(217.2 32.6% 17.5%)` | Card backgrounds |
| Border | `hsl(217.2 32.6% 17.5%)` | Dark borders |

### Chart/Accent Colors

| Name | HSL | Visual |
|------|-----|--------|
| Chart 1 | `hsl(12 76% 61%)` | Orange |
| Chart 2 | `hsl(173 58% 39%)` | Teal |
| Chart 3 | `hsl(197 37% 24%)` | Dark Blue |
| Chart 4 | `hsl(43 74% 66%)` | Yellow |
| Chart 5 | `hsl(27 87% 67%)` | Orange-Red |

---

## Typography

### Font Family

- **Primary Font**: Inter (Google Fonts)
- **Subset**: Latin
- **Fallback**: system-ui, sans-serif

### Font Sizes

| Scale | Class | Size | Usage |
|-------|-------|------|-------|
| Hero | `text-5xl` / `text-6xl` | 3rem / 3.75rem | Main hero headlines |
| H1 | `text-4xl` | 2.25rem | Page titles |
| H2 | `text-2xl` | 1.5rem | Section titles |
| H3 | `text-xl` | 1.25rem | Card titles |
| H4 | `text-lg` | 1.125rem | Subsection titles |
| Body | `text-base` | 1rem | Default body text |
| Small | `text-sm` | 0.875rem | Secondary text, labels |
| XS | `text-xs` | 0.75rem | Badges, captions |

### Font Weights

| Weight | Class | Value | Usage |
|--------|-------|-------|-------|
| Bold | `font-bold` | 700 | Headlines, emphasis |
| Semibold | `font-semibold` | 600 | Section titles, buttons |
| Medium | `font-medium` | 500 | Labels, navigation |
| Regular | `font-normal` | 400 | Body text |

### Line Heights

- **Headings**: `leading-tight` (1.25)
- **Body**: `leading-normal` (1.5)
- **Labels**: `leading-none` (1)

---

## Spacing & Layout

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `p-1` | 0.25rem (4px) | Minimal spacing |
| `p-2` | 0.5rem (8px) | Tight spacing |
| `p-3` | 0.75rem (12px) | Compact components |
| `p-4` | 1rem (16px) | Standard spacing |
| `p-6` | 1.5rem (24px) | Card padding |
| `p-8` | 2rem (32px) | Large cards |

### Common Patterns

| Pattern | Classes | Usage |
|---------|---------|-------|
| Section Padding | `py-20 px-4` | Full-width sections |
| Card Padding | `p-6` | Card content |
| Button Padding | `px-4 py-2` | Default buttons |
| Large Button | `px-8 py-3` | CTA buttons |
| Container | `max-w-7xl mx-auto` | Page content width |
| Gap | `gap-2` to `gap-8` | Flex/Grid spacing |

### Layout Containers

```css
/* Max widths */
max-w-7xl  → 80rem (1280px)  /* Main container */
max-w-3xl  → 48rem (768px)   /* Content width */
max-w-md   → 28rem (448px)   /* Forms, modals */
```

---

## Border Radius

### CSS Variables

```css
--radius: 0.5rem;  /* 8px - Base radius */
```

### Radius Scale

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Small elements |
| `rounded-md` | 6px | Inputs, small buttons |
| `rounded-lg` | 8px | Cards, sections |
| `rounded-xl` | 12px | Large cards |
| `rounded-2xl` | 16px | Modals, featured cards |
| `rounded-full` | 9999px | Badges, avatars, pills |

---

## Shadows

### Shadow Scale

| Class | Usage |
|-------|-------|
| `shadow-sm` | Subtle elevation (cards) |
| `shadow-md` | Medium elevation (dropdowns) |
| `shadow-lg` | Standard elevation (modals, floating) |
| `shadow-xl` | Prominent elevation (hero images) |
| `shadow-2xl` | Maximum elevation (success modals) |

### Common Applications

- **Cards**: `shadow-sm` or `shadow-md`
- **Dialogs/Modals**: `shadow-lg`
- **Toasts**: `shadow-lg`
- **Dropdowns**: `shadow-md`
- **Featured elements**: `shadow-xl` to `shadow-2xl`

---

## Button Styles

### Variants

| Variant | Classes | Usage |
|---------|---------|-------|
| **Default** | `bg-primary text-primary-foreground hover:bg-primary/90` | Primary actions |
| **Secondary** | `bg-secondary text-secondary-foreground hover:bg-secondary/80` | Secondary actions |
| **Outline** | `border border-input bg-background hover:bg-accent` | Tertiary actions |
| **Ghost** | `hover:bg-accent hover:text-accent-foreground` | Subtle actions |
| **Destructive** | `bg-destructive text-destructive-foreground hover:bg-destructive/90` | Delete, cancel |
| **Link** | `text-primary underline-offset-4 hover:underline` | Text links |

### Sizes

| Size | Classes | Dimensions |
|------|---------|------------|
| Default | `h-10 px-4 py-2` | 40px height |
| Small | `h-9 rounded-md px-3` | 36px height |
| Large | `h-11 rounded-md px-8` | 44px height |
| Icon | `h-10 w-10` | 40x40px square |

### Base Styles

```css
/* All buttons inherit these */
inline-flex items-center justify-center gap-2
whitespace-nowrap rounded-md text-sm font-medium
transition-colors
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-ring focus-visible:ring-offset-2
disabled:pointer-events-none disabled:opacity-50
```

---

## Component Patterns

### Cards

```css
rounded-lg border bg-card text-card-foreground shadow-sm
/* Header */ flex flex-col space-y-1.5 p-6
/* Content */ p-6 pt-0
/* Footer */ flex items-center p-6 pt-0
```

### Inputs

```css
flex h-10 w-full rounded-md border border-input
bg-background px-3 py-2 text-sm
placeholder:text-muted-foreground
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-ring focus-visible:ring-offset-2
disabled:cursor-not-allowed disabled:opacity-50
```

### Badges

```css
inline-flex items-center rounded-full border
px-2.5 py-0.5 text-xs font-semibold
transition-colors
```

### Alerts

```css
relative w-full rounded-lg border p-4
/* With icon */ [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4
[&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11
```

### Dialogs

```css
/* Backdrop */
fixed inset-0 bg-black/50 backdrop-blur-sm z-50

/* Content */
fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
bg-background rounded-lg shadow-lg p-6
max-w-3xl w-full max-h-[90vh] overflow-y-auto
```

### Toasts

```css
relative flex w-full items-center justify-between
space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg
/* Animations */
data-[state=open]:animate-in data-[state=closed]:animate-out
data-[state=open]:slide-in-from-top-full
data-[state=closed]:slide-out-to-right-full
```

---

## Builder Elements

### Selection States

| State | Classes |
|-------|---------|
| Selected | `ring-4 ring-blue-500` |
| Hovered | `ring-2 ring-blue-300` |
| Transition | `transition-all` |

### Section Base

```css
/* Standard section */
py-20 px-4 scroll-margin-top: 4rem

/* Container */
max-width: 80rem; margin: 0 auto;

/* Overflow */
overflow: hidden; position: relative;
```

### Featured Elements

```css
ring-2 ring-blue-500 shadow-xl
/* Badge */
bg-blue-500 text-white text-sm font-semibold
px-3 py-1 rounded-full
```

---

## Responsive Design

### Breakpoints

| Breakpoint | Min-width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Common Patterns

```css
/* Grid columns */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Flex direction */
flex-col md:flex-row

/* Visibility */
hidden md:block  /* Hide on mobile */
md:hidden        /* Hide on desktop */

/* Spacing adjustments */
p-4 md:p-6 lg:p-8
```

---

## Accessibility

### Focus States

```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-ring
focus-visible:ring-offset-2
```

### Color Contrast

- All text meets WCAG AA standards
- Primary text on background: 12.63:1 ratio
- Muted text on background: 4.54:1 ratio

### Motion & Animation

```css
/* Smooth scrolling */
html { scroll-behavior: smooth; }

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

### Keyboard Navigation

- All interactive elements are focusable
- Tab order follows visual order
- Focus rings are visible on keyboard navigation

---

## File References

| File | Purpose |
|------|---------|
| `/tailwind.config.ts` | Tailwind configuration, theme extensions |
| `/app/globals.css` | CSS variables, global styles |
| `/components/ui/button.tsx` | Button component variants |
| `/components/ui/card.tsx` | Card component |
| `/components/ui/input.tsx` | Input component |
| `/components/ui/badge.tsx` | Badge component |
| `/components/ui/alert.tsx` | Alert component |
| `/components/ui/dialog.tsx` | Dialog/Modal component |
| `/components/builder/elements/` | Builder element components |

---

## Technology Stack

- **CSS Framework**: Tailwind CSS v3
- **Component Library**: shadcn/ui
- **Styling Approach**: Utility-first with component composition
- **Font Loading**: Next.js Google Fonts optimization
- **Dark Mode**: CSS custom properties with class-based toggle

---

*Last updated: January 2026*
