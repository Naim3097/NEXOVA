# MegaEdit.md — Nexova Unified Site: Full Master Plan

> **Status:** Pre-implementation blueprint  
> **Created:** March 17, 2026  
> **Scope:** Site audit → merger architecture → SEO/performance master plan  
> **Base codebase:** `Nexova Landing Page/` (Next.js 14, extends to become the unified Nexova platform)

> ⛔ **HARD CONSTRAINT — NO BACKEND INTERFERENCE**  
> All edits in this plan are **front-end and UI only**. No changes to API routes, server-side logic, database schema, authentication, middleware, or any backend integrations. The backend is considered stable and must not be touched under any circumstances.

---

## Table of Contents

1. [Site Audit: Understanding All Four Projects](#1-site-audit-understanding-all-four-projects)
2. [Ecosystem Map](#2-ecosystem-map)
3. [Unified Architecture Decision](#3-unified-architecture-decision)
4. [Unified URL & Route Structure](#4-unified-url--route-structure)
5. [Design System Unification Plan](#5-design-system-unification-plan)
6. [UX & Navigation Unification](#6-ux--navigation-unification)
7. [Implementation Phases](#7-implementation-phases)
8. [Performance & Speed Audit](#8-performance--speed-audit)
9. [Mobile Optimization Audit](#9-mobile-optimization-audit)
10. [Crawlability Audit](#10-crawlability-audit)
11. [HTTPS & Security Audit](#11-https--security-audit)
12. [Mobile-First Indexing Compliance](#12-mobile-first-indexing-compliance)
13. [Schema Markup Plan](#13-schema-markup-plan)
14. [Canonicalization Strategy](#14-canonicalization-strategy)
15. [404 & Error Handling](#15-404--error-handling)
16. [HTML Markup Standards](#16-html-markup-standards)
17. [XML Sitemap Strategy](#17-xml-sitemap-strategy)
18. [Structured Data Enhancement](#18-structured-data-enhancement)
19. [Preferred Domain & Redirect Setup](#19-preferred-domain--redirect-setup)
20. [Hreflang & International SEO](#20-hreflang--international-seo)
21. [SSL Certificate Plan](#21-ssl-certificate-plan)
22. [SEO Growth Opportunities](#22-seo-growth-opportunities)
23. [Implementation Rules & Safety Protocol](#23-implementation-rules--safety-protocol)
24. [File-by-File Checklist](#24-file-by-file-checklist)

---

## 1. Site Audit: Understanding All Four Projects

### 1.1 Nexova Landing Page — X.IDE (THE CORE PRODUCT)

**Location:** `Nexova Landing Page/`  
**Stack:** Next.js 14.2.35 · React 18.3.1 · TypeScript · Tailwind CSS 3.4.19 · Supabase · Vercel  
**Status:** Production-ready, deployed on Vercel  

**What it is:**  
The flagship SaaS product — a no-code/low-code landing page builder called **X.IDE**, engineered specifically for Malaysian SMBs, e-commerce sellers, and digital product creators. The core value proposition is "Build • Edit • Sell — All in one flow" with **native LeanX payment integration** (FPX, e-wallets), inventory management, conversion tracking, and analytics all built-in.

**Market positioning:**
- Competes vs. Shopify, Wix, Webflow — but is Malaysia-native
- Cheaper (RM79/month vs RM300+ Shopify)
- FPX + TnG + GrabPay + Boost + ShopeePay natively — no plugins
- In-built tracking pixels (Meta, TikTok, Google Ads)

**All current routes:**
| Route | Purpose |
|-------|---------|
| `/` | Marketing landing page (Hero, Problem, Features, Testimonials, Pipeline, Pricing, CTA) |
| `/signup` | Email + password registration |
| `/login` | Email + password login |
| `/forgot-password` | Password reset |
| `/builder` | Visual drag-and-drop page editor (17 element types) |
| `/dashboard` | Project management hub |
| `/dashboard/admin` | Admin-only panel |
| `/dashboard/analytics/:projectId` | Analytics for published pages |
| `/dashboard/products` | Product inventory management |
| `/dashboard/forms/:projectId` | Form submissions viewer |
| `/dashboard/transactions` | Payment history |
| `/dashboard/settings` | Profile, integrations, pixels, LeanX keys |
| `/dashboard/subscription` | Plan management |
| `/dashboard/integrations` | Connect Google, Meta, TikTok |
| `/dashboard/billing` | Payment methods, invoices |
| `/projects/:projectId` | Project detail and settings |
| `/pricing` | Standalone pricing page |
| `/templates` | Template gallery |
| `/s/:subdomain` | User-published pages (subdomain) |
| `/d/:customDomain` | Custom domain published pages |
| `/p/:projectId` | Direct project preview |
| `/payment/:transactionId` | LeanX payment callback |
| `/api/*` | 24 API endpoint groups |
| `robots.txt` | SEO crawl config |
| `sitemap.xml` | Dynamic sitemap |

**Subscription tiers:**
- **Free:** RM0 — 1 project, 5 products, subdomain only
- **Premium:** RM79/month — unlimited projects, custom domain, analytics, pixels, bump offers
- **Enterprise:** Custom — e-invoice, affiliate management, dedicated manager

**Builder elements (17 total):**
Announcement Bar, Navigation Header, Footer, Hero Section, Features, Media, Testimonials, FAQ, Tabs, Pricing Table, Payment Button (LeanX), Product Carousel, Lead Form, Booking Form, Form with Payment, CTA Block, WhatsApp Button

**Key integrations:** LeanX, Google Sheets, Google Analytics, Meta Pixel (Conversions API), TikTok Pixel, Resend (email), Vercel Domain API

**Design language:** Satoshi font, Navy (#455263), Teal (#5FC7CD), gradient #5BC0BE → #7C74EA, canvas gray bg, glassmorphism nav, RevealOnScroll animations

---

### 1.2 Leanx Landing Page — Template Marketplace

**Location:** `Leanx Landing Page/`  
**Stack:** Static HTML5 · Vanilla CSS · Vanilla JavaScript (no framework)  
**Status:** Developed design asset, not yet deployed as part of unified site  

**What it is:**  
A **website template marketplace** operated under the Lean.x brand — a curated storefront of 70+ professional website templates across categories (Blog, E-Commerce, Fitness, Medical, Portfolio, Restaurant, SAAS, Legal). Templates are sold individually ($29–$69) or via subscription ($12.38/month).

**Pages:**
| Page | Purpose |
|------|---------|
| `index.html` | Browse and filter templates by category |
| `signup.html` | Split-screen registration form |
| `template-detail.html` | Individual template details, sidebar pricing |
| `branding-kit.html` | Internal brand standards reference |

**Template categories:** Blog, E-Commerce, Fitness, Medical, Portfolio, Restaurant, SAAS, Legal  
**Price range:** $29–$69 per template / $12.38/month subscription

**Design language:** Very close to Nexova but slightly differentiated — same Satoshi font, same teal/purple gradient (#5BC0BE → #7C74EA), same Navy (#455263) text — but with Lean-branded purple (#8479b2 / #7C74EA) as primary CTA. Overall: identical design system, nearly ready to unify.

**Content gap vs. current Nexova `/templates`:**  
The Nexova Landing Page has a `/templates` route but it's less developed than this dedicated marketplace. The Leanx Landing Page is the fuller, more polished template browsing experience that should **replace and enrich** the current `/templates` route.

---

### 1.3 Nexova Elements — Design Component Library

**Location:** `Nexova Elements/`  
**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion 12  
**Status:** Standalone standalone app, separate from main platform  

**What it is:**  
A **curated design gallery and component library** for the Nexova ecosystem — 100+ animations, 29 production-ready layout blocks, and 30+ Elementor widget references. Each animation has live preview, a code viewer with copy-to-clipboard, and a real-time customization control panel.

**Routes:**
| Route | Purpose |
|-------|---------|
| `/` | Animation gallery (100 items, 3-column grid) |
| `/layouts` | Layout blocks (29 items, full-width) |
| `/elementor-widgets` | Elementor/Pro widget reference (30+) |

**Animation categories (15+):** 3D & Immersion, Typography, Vector, UI Elements, Interaction, Background, Style, Data, Marketing, Navigation, Feedback, Forms, Character & Media, Text Effects, Advanced

**Key features:**
- Live demo preview per animation (dark preview box)
- Full source code viewer with syntax highlighting
- Copy-to-clipboard on each animation's code
- Real-time customization (color picker, sliders, dropdowns)
- Category tag organization

**Design language:** Identical to Nexova — same teal/purple gradient, Satoshi font, glassmorphism header, ambient glow effects. Fully design-compatible with no conversion work needed.

**Current link:** CTA in header points to `http://localhost:3001` (dev URL → will need to be updated to production Nexova URL).

---

### 1.4 Nexova Marketplace — Lean.x Payment Gateway Marketing

**Location:** `Nexova Marketplace/`  
**Stack:** Static HTML5 · Inline CSS · Vanilla JavaScript (no framework)  
**Status:** Developed design asset, Malay-language, not yet integrated into unified site  

**What it is:**  
A **Malay-language marketing/landing page for the Lean.x payment gateway** — specifically targeting Malaysian retail business owners (SMEs). The landing page focuses on the **pain** of slow payment settlement, then pitches Lean.x as a same-day settlement solution with 65-minute onboarding.

**Pages:**
| Page | Purpose |
|------|---------|
| `index.html` | Payment gateway solution (general retail) |
| `clothing-store-landing.html` | Same content, activated for "Clothing Store" vertical |

**Content (in Malay):**
- Hero: "How many sales have you lost due to slow payments?"
- Problem section: 4 pain points (slow settlement, too many apps, no cash flow, 3-month bank approval)
- Solution section: 9 Lean.x features (same-day settlement, unified QR, real-time reports, PCI-DSS, 65-min setup, cross-border, API)
- Statistics: 87% Malaysian use e-wallet, 73% expect instant confirmation, 2.3x conversion lift, 65% cart abandonment
- 3 testimonials from Malaysian business owners
- Final CTA with sticky contact footer

**Design language:** Matches Nexova exactly — Satoshi font, same teal (#5FC7CD) + purple gradient, same Navy (#455263) text. "Powered by Nexova Digital" in footer.

**Strategy for unified site:** This becomes the `/leanx` or `/payments` marketing page with bilingual support (BM + EN). The Lean.x payment gateway is woven into the Nexova product story as its embedded payment solution.

---

## 2. Ecosystem Map

```
NEXOVA UNIFIED PLATFORM (Goal)
│
├── Marketing & Discovery Layer
│   ├── /                    ← Main Nexova landing (from: Nexova Landing Page)
│   ├── /leanx               ← Lean.x marketing page (from: Nexova Marketplace, bilingual)
│   ├── /elements            ← Design inspiration library (from: Nexova Elements)  
│   └── /templates           ← Enhanced template marketplace (from: Leanx Landing Page)
│
├── Product Layer (X.IDE)
│   ├── /builder             ← The actual page builder app
│   ├── /pricing             ← Unified pricing (Nexova + Lean.x tiers)
│   └── /dashboard/*         ← User workspace
│
├── Published Pages Layer
│   ├── /s/:subdomain        ← User published pages (free)
│   └── /d/:customDomain     ← User custom domain pages (premium)
│
└── Content & SEO Layer (new)
    ├── /blog                ← Content marketing, SEO growth
    ├── /changelog           ← Product updates
    ├── /about               ← Company story
    └── /contact             ← Contact + support

CURRENT → UNIFIED MAPPING:
┌─────────────────────────────────────────────────────────────────────┐
│  Nexova Landing Page  →  Base codebase (keep and expand)            │
│  Leanx Landing Page   →  Migrate to /templates as React components  │
│  Nexova Elements      →  Migrate to /elements as sub-app route      │
│  Nexova Marketplace   →  Migrate to /leanx as bilingual page        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Unified Architecture Decision

### 3.1 Base Codebase: Nexova Landing Page

**Decision:** The `Nexova Landing Page/` codebase is the **central hub**. All other sites migrate into it.

**Rationale:**
- Only site with a real backend (Supabase + Next.js API routes)
- Only site with authentication and user accounts
- Already has routing, Tailwind config, design system, Satoshi fonts
- Deployed to Vercel — easiest to extend
- Has all payment, analytics, and builder infrastructure

### 3.2 Migration Strategy Per Project

| Source Site | Migration Method | Target Route | Effort |
|-------------|-----------------|--------------|--------|
| Leanx Landing Page | Convert static HTML → React/TSX components | `/templates` | Medium |
| Nexova Elements | Port Next.js 16 app components into Next.js 14 (or upgrade base) | `/elements` | Medium–High |
| Nexova Marketplace | Convert static HTML → React/TSX, add bilingual toggle | `/leanx` | Low–Medium |

### 3.3 Framework Version Unification

**Issue:** Nexova Elements uses Next.js **16** + React **19** + Tailwind **4**, while Nexova Landing Page uses Next.js **14** + React **18** + Tailwind **3**.

**Decision:**  
- **Option A (Recommended):** Upgrade `Nexova Landing Page` to Next.js 15/16, React 19, Tailwind 4 — then port Nexova Elements components in.
- **Option B (Safer, Faster):** Keep Nexova Landing Page on Next.js 14 and downgrade the Elements components to be compatible. (Loses some Framer Motion 12 features.)
- **Option C (Fallback):** Use `<iframe>` embeds for `/elements` (quick, but bad for SEO and UX).

**Recommendation:** Go with **Option A** — upgrade the base app incrementally. This gives us a modern stack (App Router, React 19 concurrent features, Tailwind 4 for JIT). Risk is managed by testing each phase before pushing.

### 3.4 Single Monorepo Structure (Post-Merge)

```
NEXOVA WEBSITE/
  MasterDesign.md
  MegaEdit.md
  Nexova Landing Page/          ← THE UNIFIED APP (everything merges here)
    app/
      (marketing)/
        page.tsx                ← / (main landing)
        leanx/
          page.tsx              ← /leanx (Lean.x payment gateway marketing)
        elements/
          page.tsx              ← /elements (animation gallery)
          layouts/page.tsx      ← /elements/layouts
          widgets/page.tsx      ← /elements/widgets
        templates/
          page.tsx              ← /templates (template marketplace)
          [slug]/page.tsx       ← /templates/:slug (individual template)
        blog/
          page.tsx              ← /blog
          [slug]/page.tsx       ← /blog/:slug
        about/page.tsx          ← /about
        changelog/page.tsx      ← /changelog
      (auth)/                   ← Existing auth routes
      (public)/                 ← Existing published pages
      dashboard/                ← Existing dashboard
      builder/                  ← Existing builder
      api/                      ← Existing API routes
    components/
      landing/                  ← Existing landing components
      elements/                 ← NEW: Ported from Nexova Elements
      templates/                ← NEW: Enhanced from Leanx Landing Page
      leanx/                    ← NEW: Ported from Nexova Marketplace
      shared/                   ← NEW: Shared across all sections
      seo/                      ← Existing SEO components
    ...
  Leanx Landing Page/           ← Archive (keep for reference)
  Nexova Elements/              ← Archive (keep for reference)
  Nexova Marketplace/           ← Archive (keep for reference)
```

---

## 4. Unified URL & Route Structure

### 4.1 Complete URL Map

| URL | Content | Source Site | Priority |
|-----|---------|-------------|----------|
| `nexova.co/` | Main marketing landing | **Planned — TBD later** | P-Later |
| `nexova.co/templates` | Template marketplace (browse) | Leanx Landing Page | P0 |
| `nexova.co/templates/[slug]` | Individual template detail | Leanx Landing Page | P1 |
| `nexova.co/elements` | Animation gallery | Nexova Elements | P1 |
| `nexova.co/elements/layouts` | Layout blocks | Nexova Elements | P2 |
| `nexova.co/elements/widgets` | Elementor widgets | Nexova Elements | P2 |
| `nexova.co/leanx` | Lean.x payment gateway marketing | Nexova Marketplace | P1 |
| `nexova.co/pricing` | Unified pricing (Nexova + Lean.x) | Nexova Landing Page | P0 |
| `nexova.co/blog` | Content marketing + SEO | New | P1 |
| `nexova.co/about` | Company story, team | New | P2 |
| `nexova.co/changelog` | Product updates | New | P2 |
| `nexova.co/contact` | Contact + support form | New | P1 |
| `nexova.co/signup` | Registration | Nexova Landing Page | P0 |
| `nexova.co/login` | Login | Nexova Landing Page | P0 |
| `nexova.co/builder` | X.IDE page builder | Nexova Landing Page | P0 |
| `nexova.co/dashboard` | User workspace | Nexova Landing Page | P0 |
| `nexova.co/s/[sub]` | Published user pages | Nexova Landing Page | P0 |

### 4.2 Redirect Strategy (301 Permanent)

Any old standalone Leanx/Marketplace URLs (if previously deployed) should 301 redirect to the new unified routes. These should be defined in `next.config.js` as redirect rules.

```js
// next.config.js — redirects
module.exports = {
  async redirects() {
    return [
      // Old standalone Leanx template URLs → unified
      { source: '/index', destination: '/templates', permanent: true },
      { source: '/template-detail', destination: '/templates', permanent: true },
      // Trailing slash normalization
      { source: '/templates/', destination: '/templates', permanent: true },
      { source: '/elements/', destination: '/elements', permanent: true },
    ]
  }
}
```

---

## 5. Design System Unification Plan

> **Ground truth:** `MasterDesign.md` is the single source of truth. All four sites already use highly compatible design languages — unification is 80% already done by color/font alignment.

### 5.1 What Already Matches Across All Four Sites

| Design Element | All Sites | Notes |
|----------------|-----------|-------|
| Font | Satoshi | All four use Satoshi OTF |
| Primary gradient | #5BC0BE → #7C74EA | Consistent across all |
| Text dark | #455263 (Navy) | Consistent |
| Body text | #6B7280 | Consistent |
| Canvas bg | #F8FAFC | Consistent |
| Dividers | #E2E8F0 | Consistent |
| Accent teal | #5FC7CD | Consistent |
| Border radius | rounded-xl / 12px base | Close enough |
| Button shape | Pill / rounded-full for primary | Consistent |
| Sticky glassmorphism nav | Yes | All four sites |

### 5.2 What Needs Standardization

| Element | Current Inconsistency | Resolution |
|---------|----------------------|------------|
| Lean Purple | #8479b2 (old Leanx) vs #7C74EA (Nexova) | Unify to #7C74EA |
| Lean Yellow | #fdd056 (Leanx branding) | Remove — not in Nexova system |
| Lean Orange | #ff9f43 (logo accent) | Remove from UI components |
| Malay-only copy | Nexova Marketplace fully in BM | Add English version with BM toggle |
| Footer style | Dark #455263 bg (Leanx) vs light gray (Nexova Landing) | Use Nexova standard: border-t bg-gray-50 |
| Heading sizes | 3.5rem in Leanx vs 5xl-7xl in Nexova | Adopt Nexova scale |
| Error states | Not handled in static sites | Add globally |

### 5.3 Shared CSS Variables (Add to `globals.css`)

```css
/* Already in Nexova Landing Page globals.css — enforce on all migrated pages */
:root {
  /* Core brand */
  --nexova-navy: #455263;
  --nexova-teal: #5fc7cd;
  --nexova-teal-gradient-start: #5bc0be;
  --nexova-purple-gradient-end: #7c74ea;
  --nexova-canvas-gray: #f8fafc;
  --nexova-surface-white: #ffffff;
  --nexova-divider-gray: #e2e8f0;
  --nexova-muted-text: #969696;
  --nexova-danger-red: #ef4444;
  --nexova-warning-yellow: #ffce33;
  --nexova-accent-purple: #8273b5;

  /* Lean.x specific (sub-brand, consistent with Nexova) */
  --leanx-teal: #5bc2c6;
  --leanx-purple: #7c74ea;   /* aligned to Nexova */

  /* Gradient */
  --nexova-gradient: linear-gradient(135deg, #5bc0be, #7c74ea);
  --nexova-gradient-right: linear-gradient(to right, #5bc0be, #7c74ea);
}
```

### 5.4 Typography Standards (Unified)

All pages must use:
```css
font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

The Satoshi font files at `/public/fonts/satoshi/` in the Nexova Landing Page are already complete (5 weights: 300/400/500/700/900). All migrated pages reference these same files via `next/font/local`.

### 5.5 Component Standardization

When migrating static HTML pages to React, always use the **existing Nexova component library** from `Nexova Landing Page/components/ui/`:
- `Button` — from `@/components/ui/button`
- `Card`, `CardHeader`, `CardContent`, `CardFooter` — from `@/components/ui/card`  
- `Badge` — from `@/components/ui/badge`
- `Input` — from `@/components/ui/input`

Do NOT create custom button/card/input components in migrated pages — use the ones that already exist.

---

## 6. UX & Navigation Unification

### 6.1 The Shared Navbar (Universal)

The unified navbar must appear identically on all sections of the site. Current Nexova Landing Page navbar is the reference:

```
[Logo: Nexova] | [How It Works] [Templates] [Elements] [Lean.x] [Pricing] | [Sign In] [Start Building →]
```

Upgrade the existing `Navbar` component to include the new routes:
- Add `Templates` → `/templates`
- Add `Elements` → `/elements`
- Add `Lean.x` → `/leanx`
- Keep: `Pricing` → `/pricing`
- Keep: `Sign In` → `/login`
- Keep: `Start Building` CTA → `/signup`

Mobile hamburger menu must expand and include all these links cleanly.

### 6.2 Cross-Section Internal Linking (UX Cohesion)

These contextual crosslinks prevent isolated sections and make the site feel connected:

| On Page | Add Link To | Context |
|---------|-------------|---------|
| `/` Hero | `/builder` | "Launch Builder" primary CTA |
| `/` Pricing | `/leanx` | "Lean.x handles payments seamlessly" |
| `/templates` browse | `/signup` | "Subscribe for unlimited access" |
| `/templates/[slug]` sidebar | `/builder` | "Load this template in X.IDE" |
| `/elements` gallery | `/builder` | "Use this in your landing page →" |
| `/leanx` | `/pricing` | "See plans that include Lean.x integration" |
| `/pricing` | `/leanx` | "Native Malaysian payments — learn more" |
| `/builder` sidebar | `/elements` | "Browse animation library" |
| `/dashboard` | `/templates` | "Need a new template?" banner |

### 6.3 Consistent Footer (Universal)

Replace all individual site footers with a single unified footer component:

```
[Nexova Logo]    Product          Resources        Company          Payments
                 X.IDE Builder    Elements         About            Lean.x
                 Templates        Blog             Contact          How it works
                 Pricing          Changelog
                 
© 2026 Nexova. All rights reserved. | Privacy Policy | Terms of Service
Powered by Lean.x — Same-day settlements for Malaysian business
```

### 6.4 Page Transition Feel

All migrated pages must implement:
- `RevealOnScroll` wrapper on each section (already exists in Nexova Landing Page)
- Consistent CSS transitions: `transition-all duration-300`
- Hover states: card lift `hover:-translate-y-2`
- Button hover: `hover:opacity-90` or gradient buttons with `hover:scale-105`

This ensures every page — whether it's the animation gallery or the Lean.x payment page — feels like it belongs to the same app.

---

## 6.5 UX Smoothness & Aesthetic Consistency Standards

> This section is the **aesthetic contract** for the entire unified site. Every component on every page must pass every rule here. No exceptions.

### 6.5.1 The "Same App" Rule

A user must never be able to tell they've moved from one originally-separate site to another. This means:

- Same navbar, same logo position, same CTA button — on every single page
- Same footer — on every single page
- Hero sections follow the same structural formula (badge label → H1 → lead text → CTAs)
- Sections breathe the same — `py-20 sm:py-32` for standard sections, never cramped
- Cards look the same across all sections — `rounded-2xl border border-[#E2E8F0] bg-white shadow-sm`
- Dark sections (if used) always use `bg-[#2D2B4A]` with consistent white text treatment
- The gradient `from-[#5BC0BE] to-[#7C74EA]` is the **only** gradient used — no deviations

### 6.5.2 Section Rhythm Rule

Every page follows the same visual rhythm so the eye moves predictably:

```
Light bg section
  ↓
Dark bg section (optional — for drama/contrast)
  ↓
Light bg section
  ↓
Light gray section (#F8FAFC)
  ↓
Light bg section
  ↓
Final CTA (light bg + ambient glow)
```

No two dark sections back-to-back. No two identical background tones back-to-back unless separated by a card-heavy section. The rhythm creates breathing room.

### 6.5.3 Spacing Consistency (Non-Negotiable)

| Context | Class | Never Use |
|---------|-------|-----------|
| Section vertical padding | `py-20 sm:py-32` | `py-8`, `py-10`, arbitrary px values |
| Section inner gap (grid) | `gap-6`, `gap-8`, `gap-12` | `gap-3`, `gap-16` for standard grids |
| Container | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | Full-bleed without container, or `max-w-5xl` for standard sections |
| Card padding | `p-6` (small), `p-8` (standard) | `p-3`, `p-4` for content cards |
| Heading → body gap | `mt-4` or `mt-6` | `mt-1`, `mt-2` — too tight |
| Section headline → body | `mb-16` or `mb-12` below headline group | Skipping it entirely |

### 6.5.4 Typography Consistency (Non-Negotiable)

Every section heading follows **one of two patterns only**:

**Pattern A — Plain bold:**
```tsx
<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#455263] leading-tight">
  Section Title
</h2>
```

**Pattern B — Gradient accent word:**
```tsx
<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#455263] leading-tight">
  Build Landing Pages{' '}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA]">
    That Convert
  </span>
</h2>
```

Never mix both patterns in the same heading. Never use a different font weight than `font-bold` for section H2s. Never use a different color for H2s outside of Navy `#455263` or the gradient.

**Section lead text (below H2):**
```tsx
<p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
  Supporting description, always centered for hero-like sections.
</p>
```

### 6.5.5 Button Consistency (Non-Negotiable)

Two button types only on marketing pages. No custom variants.

**Primary (gradient pill):**
```tsx
className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full px-8 h-12 text-base font-medium shadow-lg border-0 transition-all duration-300"
```

**Secondary (ghost/outline pill):**
```tsx
className="border border-[#E2E8F0] bg-white text-[#455263] hover:bg-[#F8FAFC] hover:text-[#5FC7CD] rounded-full px-8 h-12 text-base font-medium transition-all duration-300"
```

CTAs that sit together (Primary + Secondary) always follow this layout:
```tsx
<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
  <PrimaryButton />
  <SecondaryButton />
</div>
```
On mobile → stacked column. On sm+ → row. Always centered. Never left-aligned on marketing pages.

### 6.5.6 Card Consistency

**Standard light card:**
```tsx
className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 hover:shadow-md transition-all duration-300"
```

**Gradient border card (premium feel):**
```tsx
// Outer wrapper
className="p-[2px] rounded-3xl bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA]"
// Inner content
className="bg-white rounded-[22px] w-full h-full p-8"
```

**Dark glassmorphism card (on dark bg sections):**
```tsx
className="bg-white/10 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/15 transition-colors duration-300"
```

Use each card type in the right context — never use a dark card on a light background, never use a light card on a dark section background.

### 6.5.7 Scroll Animation Consistency

Every section on every page **must** be wrapped in `<RevealOnScroll>`:

```tsx
<RevealOnScroll delay={200}>
  <YourSection />
</RevealOnScroll>
```

- First section on a page (hero): no delay or `delay={0}`
- Every subsequent section: `delay={200}`
- Never use inline `opacity-0` or manual `IntersectionObserver` — use only `RevealOnScroll` so behaviour is identical everywhere

### 6.5.8 Hover Micro-interactions

Every interactive element must respond to hover. These are the only approved patterns — use them consistently:

| Element | Hover Effect | Class |
|---------|-------------|-------|
| Standard card | Lift + shadow increase | `hover:-translate-y-2 hover:shadow-md transition-all duration-300` |
| Image inside card | Subtle scale | `group-hover:scale-105 transition-transform duration-500` |
| Primary gradient button | Slight fade | `hover:opacity-90 transition-all` |
| Secondary button | Background fill + teal text | `hover:bg-[#F8FAFC] hover:text-[#5FC7CD] transition-all duration-300` |
| Nav link | Teal text | `hover:text-[#5FC7CD] transition-colors duration-200` |
| Icon/arrow in CTA | Translate right | `group-hover:translate-x-1 transition-transform` |
| Feature icon | Grayscale → color | `grayscale group-hover:grayscale-0 transition-all duration-500` |
| Template card image | Scale 1.05 | `hover:scale-105 transition-transform duration-300` |

### 6.5.9 Section Intro Label (Badge) Pattern

Every major section should open with a small pill badge above the heading to orient the user:

```tsx
<div className="flex items-center justify-center gap-2 mb-6">
  <span className="bg-[#5FC7CD]/10 text-[#5FC7CD] text-xs font-semibold px-3 py-1 rounded-full">
    TEMPLATES
  </span>
</div>
```

This same badge pattern is used across Landing Page, and must be replicated on every new page section: Templates, Elements, Lean.x.

### 6.5.10 Mobile-First Aesthetic Rules

- All text must be left-aligned on mobile (`text-left sm:text-center` for hero sections)
- Grids collapse to 1 column on mobile: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- No `hidden` on any content — only layout changes (stack vs. side-by-side)
- Sticky navbar reduces height gracefully: `h-20 sm:h-24`
- Buttons go full-width on mobile only for the CTA hero: `w-full sm:w-auto`
- Padding scales: `px-4 sm:px-6 lg:px-8` — never raw `px-16` without responsive prefix

### 6.5.11 What "Seamless" Means in Practice

If you land on `/templates` after visiting `/elements`, you should feel:
- ✅ Same navbar, same logo
- ✅ Same hero section structure (badge → headline → lead → CTA)
- ✅ Same card style for browsable content
- ✅ Same footer
- ✅ Same font, same heading sizes
- ✅ Same animation on scroll (RevealOnScroll)
- ✅ Same teal/purple color accents
- ✅ Same button shapes and hover behavior

If any of these feel even slightly off, it breaks the illusion of a unified product. Audit every new component against this list before considering it done.

---

## 7. Implementation Phases

> **Rule:** Never break the live site. All changes are additive routes first, then replace existing once validated.

### Phase 0 – Preparation (Before Any Edits)

> ⛔ No backend files touched in any phase. All phases are UI/front-end only.

- [ ] Set up a Git branch: `feature/unified-site`
- [ ] Snapshot each existing folder with a git commit
- [ ] Confirm Vercel deployment pipeline (auto-deploy from branch)
- [ ] Upgrade `Nexova Landing Page` from Next.js 14 → 15 (test build passes — front-end only, no API route changes)
- [ ] Confirm Tailwind 3 → 4 compatibility (large change; test carefully against existing styles)
- [ ] Copy all Satoshi font files from `Leanx Landing Page/assets/fonts/` and `Nexova Marketplace/assets/fonts/` to confirm they match `/public/fonts/satoshi/` (they do — identical files)

### Phase 1 – Shared Infrastructure

> **Note:** The home page (`/`) will be built later as a separate effort. Do not touch `app/page.tsx` during this phase. All infrastructure built here must work independently of the home page.

- [ ] **Upgrade Shared Navbar:** Add routes for Templates, Elements, Lean.x to existing Navbar component
- [ ] **Create Unified Footer Component:** Replace footer in `app/layout.tsx` with new comprehensive footer
- [ ] **Add new routes as empty pages (scaffolding):**
  - `app/(marketing)/leanx/page.tsx` → placeholder "Coming soon"
  - `app/(marketing)/elements/page.tsx` → placeholder
  - `app/(marketing)/about/page.tsx` → placeholder
  - `app/(marketing)/blog/page.tsx` → placeholder
- [ ] **Update `sitemap.xml`** generation to include new routes
- [ ] **Update `robots.txt`** to confirm all new marketing routes are indexable
- [ ] **Verify `middleware.ts`** does not block any new marketing routes

### Phase 2 – Templates Marketplace Migration (`/templates`)

- [ ] Port `Leanx Landing Page/index.html` hero + search + filter section → `components/templates/TemplateHero.tsx`
- [ ] Port template card grid → `components/templates/TemplateGrid.tsx`
- [ ] Port category filter pills → `components/templates/CategoryFilter.tsx`
- [ ] Port `template-detail.html` → `app/(marketing)/templates/[slug]/page.tsx`
- [ ] Port sticky sidebar (pricing, CTAs) → `components/templates/TemplateSidebar.tsx`
- [ ] Port signup form from `signup.html` → Connect to existing `/signup` route (do not duplicate auth)
- [ ] Convert all inline CSS → Tailwind utility classes (standardize to Nexova design system)
- [ ] Replace Leanx-specific purple (#8479b2) → Nexova purple (#7C74EA) everywhere
- [ ] Add "Load in X.IDE" button on each template detail → links to `/builder?template=[slug]`
- [ ] Write metadata (title, description) for each template for SEO
- [ ] Add Schema Markup `Product` for each template

### Phase 3 – Lean.x Page Migration (`/leanx`)

> **Note on the two Nexova Marketplace pages:** The source folder has `index.html` (general retail) and `clothing-store-landing.html` (fashion/clothing vertical). Both are structurally identical — only the nav pill active state differs. Rather than creating two separate routes that duplicate content, the unified strategy is: **one main `/leanx` page** with an **industry verticals section** that shows how Lean.x applies across retail, fashion, F&B, services, etc. This avoids duplicate content, consolidates SEO value, and is more scalable. If specific industry landing pages are needed for ad campaigns later, they can be added as `/leanx/clothing`, `/leanx/retail`, etc. with `noindex` (for paid traffic only, not organic).

- [ ] Port `Nexova Marketplace/index.html` → `app/(marketing)/leanx/page.tsx` (primary source)
- [ ] Incorporate clothing-store content as an **"Industries We Serve"** section within the same page (not a separate route)
- [ ] Create reusable components:
  - `components/leanx/LeanxHero.tsx` — Bilingual (BM + EN toggle)
  - `components/leanx/ProblemSection.tsx`
  - `components/leanx/SolutionGrid.tsx` (9 feature cards)
  - `components/leanx/IndustriesSection.tsx` — Retail, Fashion, F&B, Services, Electronics (covers both source pages)
  - `components/leanx/SecurityBadges.tsx`
  - `components/leanx/Statistics.tsx`
  - `components/leanx/LeanxTestimonials.tsx`
  - `components/leanx/LeanxCTA.tsx`
- [ ] Add bilingual toggle (BM ↔ EN) — Store preference in localStorage
- [ ] Convert all inline CSS → Tailwind classes + Nexova design tokens
- [ ] Replace placeholder CTAs (`href="#"`) with real `/signup` or `/contact` links
- [ ] Add Schema Markup `Service` for Lean.x payment service
- [ ] Add Lean.x SEO metadata (title: "Lean.x by Nexova — Fast Payment Settlement for Malaysian Businesses")

### Phase 4 – Elements Migration (`/elements`)

- [ ] Port `Nexova Elements/src/app/page.tsx` → `app/(marketing)/elements/page.tsx`
- [ ] Port `Nexova Elements/src/app/layouts/page.tsx` → `app/(marketing)/elements/layouts/page.tsx`
- [ ] Port `Nexova Elements/src/app/elementor-widgets/page.tsx` → `app/(marketing)/elements/widgets/page.tsx`
- [ ] Port `components/UnifiedHeader.tsx` → adapt to use unified Nexova Navbar (replace standalone header)
- [ ] Port all 100+ animation demo components → `components/elements/demos/`
- [ ] Port `AnimationCard.tsx`, `LayoutCard.tsx`, etc. → `components/elements/`
- [ ] Port `data/` folder (animation/layout/widget data) → `src/data/elements/`
- [ ] Update "Go to Nexova" CTA from `localhost:3001` → `/builder`
- [ ] Verify Framer Motion is already in `Nexova Landing Page/package.json` (check — `framer-motion` may need to be added)
- [ ] Resolve Tailwind 4 vs 3 class conflicts (if upgrading base to TW4, this is smooth; if staying TW3, adjust Elements classes)
- [ ] Add SEO metadata for `/elements`, `/elements/layouts`, `/elements/widgets`

### Phase 5 – New Content Pages

- [ ] `/about` — Company story, Nexova + Lean.x partnership, team (even if just names/titles for now)
- [ ] `/blog` — Blog index page with placeholder articles about Malaysian e-commerce, landing page tips, payment solutions
- [ ] `/contact` — Simple contact form connected to existing `/api/help` endpoint
- [ ] `/changelog` — Product updates/release notes
- [ ] Each page must have proper H1, meta title, meta description, Open Graph tags

### Phase 6 – SEO & Performance

All 20 SEO audit items (detailed in sections 8–22 below) implemented in a single focused sprint after content pages are live.

### Phase 7 – QA & Launch Validation

- [ ] Run Lighthouse on all key pages — target 90+ performance, 100 SEO score
- [ ] Test all internal links (no broken links)
- [ ] Test Navbar and Footer on mobile (320px, 375px, 768px breakpoints)
- [ ] Test LeanX payment flow end-to-end
- [ ] Test auth flows (signup, login, password reset)
- [ ] Validate all Schema Markup via Google's Rich Results Test
- [ ] Submit sitemap to Google Search Console
- [ ] Verify `robots.txt` is correct
- [ ] Check canonical URLs on all pages
- [ ] Test bilingual toggle on `/leanx`

---

## 8. Performance & Speed Audit

### 8.1 Current Issues (Identified Across All Sites)

| Issue | Where | Impact |
|-------|-------|--------|
| Large background images not optimized | Nexova Marketplace (1920x1080 .png), Nexova Landing Page | LCP, CLS |
| No lazy loading on template card images | Leanx Landing Page static HTML | LCP |
| Static HTML sites have no automatic optimization | Leanx Landing Page, Nexova Marketplace | No Next.js Image opt |
| 100+ animation components in Nexova Elements load eagerly | Nexova Elements | TTI, JS bundle size |
| No CDN beyond Vercel | All | TTFB for global users |
| Client-side Framer Motion animations: heavy bundle | Nexova Elements | JS parse time |
| No explicit `<link rel="preconnect">` for Google Fonts or Supabase | Nexova Landing Page | DNS resolution |
| `backdrop-filter: blur()` used extensively | All | GPU-heavy on low-end mobile |

### 8.2 Fixes to Implement

**Image Optimization:**
- Replace all `<img>` tags with Next.js `<Image>` component throughout migrated pages
- Use `priority` prop only on LCP images (hero image, above-the-fold assets)
- Use `loading="lazy"` (the default in Next/Image) for all other images
- Convert background PNGs (1920x1080, 1080x1920) to WebP format — minimum 60% file size reduction
- Serve responsive images: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
- Add `width` and `height` to all images to prevent CLS

**JavaScript Bundle:**
- All Nexova Elements animation demos already use `dynamic(() => import(...), { ssr: false })` — maintain this in the ported version
- Apply `React.lazy` + `Suspense` on `/elements` animation components
- Use Next.js `<Script strategy="lazyOnload">` for tracking pixels (Meta, TikTok, Google Analytics)
- Move Google Analytics / GTM to `afterInteractive` strategy

**Caching:**
```js
// next.config.js — add Cache-Control headers
async headers() {
  return [
    {
      source: '/fonts/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
    },
    {
      source: '/_next/static/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
    },
    {
      source: '/assets/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }]
    },
  ]
}
```

**CDN:** Vercel automatically serves via Vercel Edge Network (global CDN). Ensure all static assets are in `/public/` so they are CDN-distributed. Database calls (Supabase) go via Vercel serverless — use Upstash Redis cache layer (already present) for frequent reads.

**Reducing HTTP Requests:**
- Satoshi font files: Currently 5 separate `.otf` requests. Continue using `next/font/local` — Next.js already bundles these efficiently.
- CSS: Tailwind purges unused CSS at build time — ensure `content` array in `tailwind.config.ts` covers all new routes/components
- Minimize third-party scripts: Load only necessary pixels per page type (landing page loads Meta + Google; dashboard does NOT load meta pixel from Nexova side)

**Server Response Time:**
- Middleware (`middleware.ts`) runs on every request — audit it to ensure it is lightweight; avoid database calls in middleware
- Published pages (`/s/:subdomain`, `/d/:customDomain`) should be served from Supabase-cached HTML, not re-generated on every request
- Use ISR (Incremental Static Regeneration) for `/templates` and `/elements` pages — they don't change frequently

```tsx
// app/(marketing)/templates/page.tsx
export const revalidate = 3600; // Revalidate hourly

// app/(marketing)/elements/page.tsx
export const revalidate = 86400; // Revalidate daily
```

---

## 9. Mobile Optimization Audit

### 9.1 Current Issues

| Issue | Where |
|-------|-------|
| Nexova Marketplace sticky footer overlaps content on mobile (140px bottom padding) | Nexova Marketplace |
| Filter pills in Leanx Landing Page overflow horizontally on 375px screens | Leanx Landing Page |
| Nexova Elements animation cards use `h-48` fixed height — may truncate on small screens | Nexova Elements |
| Background `backdrop-filter: blur(12px)` has performance issues on old Android | All sites |
| Some hero sections use viewport-relative padding (`pt-[24vw]`) — can be extreme on small tablets | Nexova Landing Page |
| Font sizes in Nexova Marketplace hero: `3.5rem` on desktop, only `2.5rem` on mobile — needs test | Nexova Marketplace |
| Flex wrapping: some button groups don't wrap to column on mobile | Multiple |

### 9.2 Mobile Standards to Enforce

**Responsive Breakpoints (Tailwind):**
- `sm:` = 640px (phones landscape)
- `md:` = 768px (tablets)
- `lg:` = 1024px (small laptops)
- `xl:` = 1280px (desktops)
- `2xl:` = 1536px (large displays)

**Font size floor — no body text below 16px on mobile:**
```css
/* Enforce readable text */
body { font-size: 1rem; } /* Always ≥ 16px */
.text-sm { font-size: 0.875rem; } /* 14px — use only for labels/metadata */
```

**Tap targets — minimum 44x44px:**
All buttons, links, and interactive elements (including nav links, filter pills) must have min `h-11` (44px) for mobile.

**No horizontal scroll:**
```css
html, body { overflow-x: hidden; }
```
Already in Nexova Landing Page — enforce on all new pages.

**No Flash, No Intrusive Popups:**
- Upgrade modals (UpgradePlanModal, HelpButton) to use non-intrusive slide-up drawers on mobile
- Remove any CSS modal that triggers on scroll position for mobile users
- No sticky banners that cover more than 20% of the mobile viewport

**Touch-Friendly Navigation:**
- Hamburger menu must be full-screen overlay on mobile, not a tiny dropdown
- Minimum hamburger button size: `h-11 w-11`
- All dropdown menus must be swipeable on touch devices

**Image sizes on mobile:**
- Hero images: provide mobile-specific images via `<Image src={...} sizes="100vw" />`
- Template card images: 4:3 aspect ratio, load at correct resolution for device

### 9.3 Mobile Page Speed (SEO Prompt 10) — Dedicated Audit

Mobile speed is weighted more heavily by Google than desktop. These are the explicit targets and fixes for the unified site:

**Core Web Vitals targets (mobile):**
| Metric | Target | What it measures |
|--------|--------|------------------|
| LCP (Largest Contentful Paint) | < 2.5s | When the main content loads |
| INP (Interaction to Next Paint) | < 200ms | Responsiveness to taps/clicks |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability, no jumping |

**Scoring target:** 90+ on Google PageSpeed Insights (mobile) for all marketing pages (`/templates`, `/elements`, `/leanx`, `/pricing`).

**Specific mobile speed optimizations:**

1. **Render-blocking resources:** No `<link rel="stylesheet">` in `<head>` that isn't critical. Tailwind generates a single optimized CSS file at build — nothing extra added.

2. **Font display:** Use `font-display: swap` on all Satoshi `@font-face` declarations so text remains visible while fonts load instead of going invisible (FOIT).
   ```css
   @font-face {
     font-family: 'Satoshi';
     font-display: swap; /* ← critical for mobile LCP */
     src: url('/fonts/satoshi/Satoshi-Regular.otf') format('opentype');
   }
   ```

3. **Hero image is always the LCP element** — it must use `<Image priority />` (preloads immediately) and be served in WebP format.

4. **Avoid layout shift (CLS):** Every `<Image>` must have explicit `width` and `height`. Every font load must use `font-display: swap`. No dynamically injected content above the fold before hydration.

5. **Defer non-critical JS:** Tracking pixels (Meta, TikTok, GA4) must use Next.js `<Script strategy="lazyOnload">` — they must never block first paint on mobile.

6. **Reduce JS parse time on mobile:** The `/elements` page with 100+ animation components is the highest JS-weight page. Every animation demo is already `dynamic(() => import(...), { ssr: false })` — verify this is maintained. On mobile, the 3-column grid collapses to 1 column, which alone reduces visible renders significantly.

7. **Test tool:** After each phase, run `https://pagespeed.web.dev/` against the live URL and screenshot the mobile score. Target must be ≥ 90 before the phase is considered complete.

---

## 10. Crawlability Audit

### 10.1 Current `robots.txt` Analysis

Located at `Nexova Landing Page/app/robots.txt/`. Review what is currently disallowed. The following rules must apply to the unified site:

```
User-agent: *
Allow: /
Allow: /templates
Allow: /elements
Allow: /leanx
Allow: /pricing
Allow: /blog
Allow: /about
Allow: /contact
Allow: /changelog

# Block authenticated app routes (not meaningful to index)
Disallow: /dashboard
Disallow: /builder
Disallow: /api/
Disallow: /auth/
Disallow: /account/

# Block published user pages (don't index these as nexova.co content)
Disallow: /s/
Disallow: /d/
Disallow: /p/
Disallow: /payment/

Sitemap: https://nexova.co/sitemap.xml
```

### 10.2 URL Structure Best Practices

**Good:** `nexova.co/templates/saas-bold-template` (descriptive slug)  
**Bad:** `nexova.co/template-detail?template=7` (query param ID — not SEO-friendly)

All template pages must use descriptive slugs:
```
/templates/saas-bold-template
/templates/medical-elegant-template
/templates/fitness-minimal-template
```

**URL rules:**
- All lowercase
- Hyphens as word separator (not underscores, not spaces)
- No trailing slashes (normalize via redirect)
- No query parameters in canonical URLs for content pages

### 10.3 Internal Link Audit

Create a mental map of internal links — every page must be reachable from at least one other page within 3 clicks from the homepage. See section 6.2 for the internal link strategy.

**Broken link prevention:**
- The Nexova Elements CTA "Go to Nexova" currently points to `http://localhost:3001` — this must be changed to `https://nexova.co/builder` before deployment
- Any `href="#"` placeholder links in Nexova Marketplace must be replaced with real routes

### 10.4 Crawl Error Prevention

- All `404` pages must have the custom error page (see Section 15)
- Server errors (`500`) must return proper error page, not framework default
- `getStaticPaths` / `generateStaticParams` on dynamic routes must always include `fallback: 'blocking'` to avoid 404s for valid URLs

### 10.5 Website Structure & Breadcrumbs (SEO Prompt 11)

Google uses site structure to understand content hierarchy. Deep pages (3 levels: `/templates/[slug]`, `/elements/layouts`, `/blog/[slug]`) must have both **visible UI breadcrumbs** and **BreadcrumbList schema** (see Section 13.6).

**Visible Breadcrumb UI Component** — create `components/shared/Breadcrumb.tsx`:

```tsx
// components/shared/Breadcrumb.tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem { label: string; href?: string; }

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[#969696] mb-8">
      {items.map((item, i) => (
        <>
          {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
          {item.href
            ? <Link href={item.href} className="hover:text-[#5FC7CD] transition-colors">{item.label}</Link>
            : <span className="text-[#455263] font-medium">{item.label}</span>
          }
        </>
      ))}
    </nav>
  );
}
```

**Usage on each deep page:**
```tsx
// /templates/[slug]
<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Templates', href: '/templates' },
  { label: template.name },
]} />

// /elements/layouts
<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Elements', href: '/elements' },
  { label: 'Layout Blocks' },
]} />

// /blog/[slug]
<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: post.title },
]} />
```

**Internal linking hierarchy rule (3-click rule):**  
Every page on the site must be reachable from the homepage within 3 clicks:
- Homepage → Templates → any template detail ✅ (2 clicks)
- Homepage → Elements → Layouts ✅ (2 clicks)
- Homepage → Lean.x ✅ (1 click from nav)
- Homepage → Blog → any post ✅ (2 clicks)

No orphan pages — every new page added must be linked from at least one other page.

---

## 11. HTTPS & Security Audit

### 11.1 Current Security State

**Nexova Landing Page (strong baseline):**
- ✅ Supabase auth with JWT, httpOnly cookies
- ✅ Row-Level Security on all database tables
- ✅ Zod input validation on all API POST endpoints
- ✅ DOMPurify on user-generated HTML (prevents XSS in published pages)
- ✅ HMAC-SHA256 LeanX webhook verification
- ✅ Rate limiting (token bucket per user)
- ✅ CSRF: Origin/Referer validation
- ✅ Vercel auto-manages SSL (Let's Encrypt)

**Issues in static sites (will be resolved when migrated to Next.js):**
- ❌ Leanx Landing Page / Nexova Marketplace: No CSRF protection on forms
- ❌ Nexova Marketplace: signup form destination endpoint unknown — likely unprotected
- ❌ No Content Security Policy headers set anywhere

### 11.2 Fixes to Implement

**Content Security Policy (CSP):** Add to `next.config.js`:
```js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://analytics.tiktok.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https: blob:",
            "font-src 'self' data:",
            "connect-src 'self' https://*.supabase.co https://api.leanx.dev wss://*.supabase.co",
            "frame-src 'self' https://www.youtube.com",
          ].join('; ')
        },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ]
    }
  ]
}
```

**Form Security on Migrated Pages:**
- All forms in migrated Leanx/Marketplace pages must go through Next.js API routes (not direct fetch to unknown endpoints)
- Add CSRF token to the contact form on `/contact`

**Admin Access:**
- The admin email whitelist in `/lib/admin.ts` is maintained — no change needed

**Dependency Updates:**
- Run `npm audit` after merge — resolve any high-severity vulnerabilities
- Pin all dependencies to specific minor versions (not `*` or `^`)

---

## 12. Mobile-First Indexing Compliance

### 12.1 Google Mobile-First Indexing Requirements

Google indexes the **mobile version** of pages. Every piece of content visible on desktop must also be visible (not hidden permanently behind JS, not display:none) on mobile.

**Checklist per page:**

- [ ] Same H1, H2, H3 heading text on mobile as desktop (no CSS `display:none` on text content)
- [ ] Same structured data JSON-LD on mobile (embedded in page, not conditionally rendered)
- [ ] Same `<meta>` tags (title, description) — already server-side rendered in Next.js ✅
- [ ] Same images — mobile image sources must be content-sufficient (not decorative-only swaps)
- [ ] Verify that no content is loaded ONLY via client-side JS that could be missed by Googlebot

**Specific risk areas:**
- Nexova Elements: Animation previews are `{ ssr: false }` — their descriptions/titles must still be SSR'd
- Template cards on `/templates` — if loaded with client-side filtering, ensure initial state renders all cards server-side
- Lean.x statistics section — content must be in HTML, not just counted up by JavaScript

### 12.2 Implementation

Use **React Server Components** (Next.js App Router) for all content sections. Only interactive elements (animation previews, filter controls, code viewer) should be Client Components.

```tsx
// CORRECT: Server Component for content
// app/(marketing)/templates/page.tsx
import { templates } from '@/data/templates';

export default function TemplatesPage() {
  return (
    <main>
      <TemplateHero />     {/* Server Component - SSR */}
      <TemplateGrid templates={templates} /> {/* Server Component - SSR */}
      <CategoryFilter />   {/* Client Component - interactive only */}
    </main>
  );
}
```

---

## 13. Schema Markup Plan

### 13.1 Organization Schema (Site-wide, in `layout.tsx`)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nexova",
  "url": "https://nexova.co",
  "logo": "https://nexova.co/assets/landing/logo-nexova.png",
  "description": "No-code landing page builder with native Malaysian payments for SMBs",
  "sameAs": [
    "https://www.facebook.com/nexova",
    "https://www.instagram.com/nexova",
    "https://www.linkedin.com/company/nexova"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "url": "https://nexova.co/contact"
  }
}
```

### 13.2 SoftwareApplication Schema (`/` and `/pricing`)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "X.IDE by Nexova",
  "applicationCategory": "WebApplication",
  "operatingSystem": "Web",
  "url": "https://nexova.co",
  "description": "No-code landing page builder with built-in LeanX payment integration for Malaysian businesses",
  "offers": [
    {
      "@type": "Offer",
      "name": "Free Plan",
      "price": "0",
      "priceCurrency": "MYR",
      "eligibleRegion": "MY"
    },
    {
      "@type": "Offer",
      "name": "Premium Plan",
      "price": "79",
      "priceCurrency": "MYR",
      "billingIncrement": "P1M",
      "eligibleRegion": "MY"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "150"
  }
}
```

### 13.3 Product Schema (Each template on `/templates/[slug]`)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "SaaS Bold Template",
  "description": "Professional SaaS landing page template with bold typography",
  "brand": { "@type": "Brand", "name": "Lean.x by Nexova" },
  "category": "Website Template",
  "offers": {
    "@type": "Offer",
    "price": "69",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://nexova.co/templates/saas-bold-template"
  }
}
```

### 13.4 Service Schema (`/leanx`)

```json
{
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "Lean.x Payment Gateway",
  "description": "Malaysian payment gateway with same-day settlement, FPX, e-wallets, and 65-minute onboarding for SMEs",
  "provider": {
    "@type": "Organization",
    "name": "Nexova"
  },
  "areaServed": "MY",
  "serviceType": "Payment Processing",
  "url": "https://nexova.co/leanx"
}
```

### 13.5 FAQPage Schema (`/pricing`, `/leanx`)

Add for all FAQ sections (already have FAQ builder element):

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is X.IDE?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "X.IDE is a no-code landing page builder with built-in Malaysian payment integration via Lean.x."
      }
    }
  ]
}
```

### 13.6 BreadcrumbList Schema (All deep pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nexova.co" },
    { "@type": "ListItem", "position": 2, "name": "Templates", "item": "https://nexova.co/templates" },
    { "@type": "ListItem", "position": 3, "name": "SaaS Bold Template", "item": "https://nexova.co/templates/saas-bold-template" }
  ]
}
```

### 13.7 Implementation Method

Create a reusable `JsonLd` component:

```tsx
// components/seo/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Never put schema in `<Head>` (deprecated in App Router) — put it in the `<head>` section of the page's `generateMetadata` export or directly in the page component's return JSX.

---

## 14. Canonicalization Strategy

### 14.1 Canonical URL Rules

- Every page has exactly ONE canonical URL — no `?` query parameters in canonical
- `www.nexova.co` and `nexova.co` both 301 redirect to `https://nexova.co` (see Section 19)
- Templates: `nexova.co/templates` is the canonical browse page; `nexova.co/templates/[slug]` for each template
- Never let `/templates?category=saas` be indexed — use URL path-based filtering if needed, or add `?category=saas` → `<link rel="canonical" href="https://nexova.co/templates">` pointing back to base

**In Next.js App Router**, canonical is set via `generateMetadata`:

```tsx
// app/(marketing)/templates/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    alternates: {
      canonical: `https://nexova.co/templates/${params.slug}`,
    },
  };
}
```

### 14.2 Duplicate Content Prevention

- Do NOT let `/templates/` (with trailing slash) and `/templates` both be indexable → 301 the trailing slash version
- Published user pages (`/s/:subdomain`) must have `<meta name="robots" content="noindex, nofollow">` — they are user content, not Nexova content
- Template preview pages (`/p/:projectId`) must have `noindex` — they are temporary previews
- Add `canonical` pointing to the main product page if element/widget pages duplicate content across `/elements`, `/elements/layouts`, etc.

### 14.3 Canonical URLs for Pagination & Filtered Content (SEO Prompt 13)

The `/templates` page has category filtering (Blog, E-Commerce, Fitness, Medical, etc.) and may eventually have pagination if the template library grows. Handle as follows:

**Category filtering (client-side):**
Filter state is managed client-side via React state (not URL query params). This means:
- The URL stays as `nexova.co/templates` regardless of which category is selected
- Googlebot sees a single URL with all templates rendered on initial SSR
- No duplicate URLs, no canonical issue
- This is the **recommended approach** for the templates page

**If URL-based filtering is ever added** (e.g., `/templates?category=saas`), apply:
```tsx
// Always point canonical back to base templates page
export async function generateMetadata({ searchParams }) {
  return {
    alternates: {
      canonical: 'https://nexova.co/templates', // Always canonical to base
    },
    robots: searchParams.category ? 'noindex, follow' : 'index, follow',
  };
}
```

**If pagination is ever added** (e.g., `/templates?page=2`), use:
```html
<!-- On page 1 -->
<link rel="next" href="https://nexova.co/templates?page=2" />
<link rel="canonical" href="https://nexova.co/templates" />

<!-- On page 2 -->
<link rel="prev" href="https://nexova.co/templates" />
<link rel="next" href="https://nexova.co/templates?page=3" />
<link rel="canonical" href="https://nexova.co/templates?page=2" />

<!-- On last page -->
<link rel="prev" href="https://nexova.co/templates?page=N-1" />
<link rel="canonical" href="https://nexova.co/templates?page=N" />
```

In Next.js App Router, add these via `generateMetadata`:
```tsx
alternates: {
  canonical: currentPageUrl,
},
// Add <link> tags for prev/next via custom head injection if Next.js doesn't natively support rel=prev/next
```

**For `/elements` sub-routes** (`/elements/layouts`, `/elements/widgets`):
- Each is a distinct page with distinct content — each has its own canonical, no rel=prev/next needed
- They do NOT share a canonical with `/elements`

---

## 15. 404 & Error Handling

### 15.1 Custom 404 Page

Create `app/not-found.tsx` (App Router), which automatically handles all 404s:

```
┌─────────────────────────────────────────────────────────┐
│  [Nexova Logo]                                          │
│                                                         │
│  404                                                    │
│  Page not found                                         │
│  The page you're looking for doesn't exist.            │
│                                                         │
│  [← Go Home]   [Browse Templates]   [Open Builder]     │
│                                                         │
│  Popular destinations:                                  │
│  • X.IDE Builder    • Template Marketplace              │
│  • Elements Library • Lean.x Payments                   │
└─────────────────────────────────────────────────────────┘
```

**Design:** Use the full Nexova design system — gradient accent, Satoshi font, Navy text. Do not use a blank/generic error page.

### 15.2 Custom 500 Page

Create `app/error.tsx` (App Router) and `app/global-error.tsx`:

- Brief, friendly message: "Something went wrong. We're looking into it."
- Link back to home
- No technical error messages exposed to user
- Log error server-side (use Vercel's built-in error monitoring)

### 15.3 Redirect Audit

Before launch, use a crawler (e.g., Screaming Frog) to find all internal links that 404. Any found links should be:
- 301 redirected to the correct current URL (if content moved)
- Removed from the page (if content is gone)
- Updated in-place (if the link is just wrong)

**301 vs 302:**
- 301 (Permanent): Use for all URL consolidation, domain changes, trailing slash normalization
- 302 (Temporary): Use ONLY if content will return to that URL (e.g., during maintenance)
- Never use 302 for permanent redirects

---

## 16. HTML Markup Standards

### 16.1 Semantic Heading Hierarchy

**Rule:** One H1 per page, always the most important topic of the page. H2s for sections, H3s for subsections.

| Page | H1 | H2 Examples |
|------|----|-------------|
| `/` | "Build • Edit • Sell — All in one flow" | "Why Choose X.IDE", "Features", "How It Works", "Pricing" |
| `/templates` | "Professional Website Templates" | "Browse by Category", "Featured Templates", "Get Unlimited Access" |
| `/elements` | "Nexova Elements" | "Animation Gallery", "Layout Blocks", "Elementor Widgets" |
| `/leanx` | "Fast Payments for Malaysian Businesses" | "The Problem", "Lean.x Solution", "Security & Compliance", "What Merchants Say" |
| `/pricing` | "Simple, Transparent Pricing" | "Compare Plans", "Frequently Asked Questions" |

**Never:** Use headings for visual styling only (use CSS classes instead). Never skip levels (H1 → H3, skipping H2).

### 16.2 Image ALT Attributes

All `<Image>` and `<img>` elements must have descriptive `alt` text:

```tsx
// ✅ CORRECT
<Image src="/assets/hero-builder.png" alt="X.IDE drag-and-drop landing page builder interface showing a product page being built" />

// ❌ WRONG
<Image src="/assets/hero-builder.png" alt="" />
<Image src="/assets/hero-builder.png" alt="image" />
<Image src="/assets/hero-builder.png" alt="hero" />
```

Decorative images (ambient glow SVGs, divider lines) should use `alt=""` (empty string = presentational).

### 16.3 Meta Tags (Per Page)

Every page must have in its `generateMetadata()`:

```tsx
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Page-Specific Title | Nexova',  // 50–60 characters
    description: 'Page-specific description, action-oriented, 140–160 characters',
    openGraph: {
      title: '...',
      description: '...',
      images: [{ url: 'https://nexova.co/og/page-name.jpg', width: 1200, height: 630 }],
      type: 'website',
      url: 'https://nexova.co/page-name',
      siteName: 'Nexova',
    },
    twitter: {
      card: 'summary_large_image',
      title: '...',
      description: '...',
      images: ['https://nexova.co/og/page-name.jpg'],
    },
    alternates: {
      canonical: 'https://nexova.co/page-name',
    },
  };
}
```

**OG Image standard:** Create `/public/og/` folder with 1200x630px PNG/JPG images for each major page. Use a consistent branded template (Nexova gradient + page title + logo).

### 16.4 Title Tag Strategy

| Page | Title Format |
|------|-------------|
| Home | `Build Landing Pages with Payments Built-In | Nexova X.IDE` |
| Templates | `Professional Website Templates for Every Industry | Nexova` |
| Elements | `100+ Web Animations & Layout Blocks | Nexova Elements` |
| Lean.x | `Fast Payment Settlement for Malaysian SMEs | Lean.x by Nexova` |
| Pricing | `Pricing Plans — Free to Premium | Nexova X.IDE` |
| Blog | `Website Building & Malaysian E-Commerce Insights | Nexova Blog` |
| 404 | `Page Not Found | Nexova` |

### 16.5 No Inline Styles (Migrated Pages)

All migrated pages (from static HTML) must have inline `style=""` attributes converted to Tailwind CSS classes. The only exceptions are:
- Dynamic styles calculated at runtime (e.g., progress bar width based on data)
- Framer Motion animated styles (managed by the library)
- Custom CSS animations defined in `globals.css`

---

## 17. XML Sitemap Strategy

### 17.1 Current Sitemap

Located at `Nexova Landing Page/app/sitemap.xml/`. This is likely a static or minimally dynamic file.

### 17.2 New Dynamic Sitemap

Replace the current sitemap with a fully dynamic `app/sitemap.ts` (App Router):

```ts
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { templates } from '@/data/templates';
import { animations } from '@/data/elements';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nexova.co';
  const now = new Date();

  // Static marketing pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`,             lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/templates`,    lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/elements`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/leanx`,        lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/pricing`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blog`,         lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${baseUrl}/contact`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${baseUrl}/changelog`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.5 },
  ];

  // Dynamic template pages
  const templatePages: MetadataRoute.Sitemap = templates.map(t => ({
    url: `${baseUrl}/templates/${t.slug}`,
    lastModified: t.updatedAt ?? now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Blog posts (from CMS/data source)
  // const blogPages = await fetchBlogPosts()...

  return [...staticPages, ...templatePages];
}
```

**Rules:**
- Only include pages that are:
  - Indexable (not `noindex`)
  - Real content (not auth routes, dashboard routes, API routes)
  - Returning 200 OK (not 404 or redirects)
- Include `lastModified` dates — Google uses these for recrawl priority
- Include `priority` values relative to importance (1.0 = most important)
- Sitemap is accessible at `https://nexova.co/sitemap.xml` — reference this in `robots.txt`

---

## 18. Structured Data Enhancement

### 18.1 Rich Snippet Opportunities

| Schema Type | Expected Rich Result | Page |
|-------------|---------------------|------|
| `SoftwareApplication` | Star rating, price in search | `/`, `/pricing` |
| `Product` | Price, availability badge | `/templates/[slug]` |
| `FAQPage` | Expandable Q&A in SERP | `/pricing`, `/leanx` |
| `HowTo` | Step-by-step rich result | Future `/how-it-works` page |
| `BreadcrumbList` | Breadcrumb path in SERP | All deep pages |
| `FinancialService` | Service card in search | `/leanx` |
| `BlogPosting` | Author, date in SERP | `/blog/[slug]` |
| `VideoObject` | Video thumbnail in results | Future tutorial videos |

### 18.2 Testing

After implementation, test every schema with:
1. **Google Rich Results Test:** `https://search.google.com/test/rich-results`
2. **Schema.org Validator:** `https://validator.schema.org/`

Validate that no required fields are missing and no errors are reported.

---

## 19. Preferred Domain & Redirect Setup

### 19.1 Domain Configuration

**Preferred domain:** `https://nexova.co` (no www)  
(If the actual domain is different, update all references accordingly)

**Required redirects in Vercel Dashboard + `next.config.js`:**

```
http://nexova.co         → 301 → https://nexova.co     (HTTP to HTTPS)
https://www.nexova.co    → 301 → https://nexova.co     (www to non-www)
http://www.nexova.co     → 301 → https://nexova.co     (both)
nexova.co/index          → 301 → nexova.co/           (if any index references exist)
```

**Verify in Google Search Console:**
- Set preferred domain in Search Console settings
- After setting, submit sitemap from preferred domain URL

### 19.2 Vercel Domain Setup

In Vercel project settings → Domains:
- Add both `nexova.co` and `www.nexova.co`
- Mark `nexova.co` as primary
- Vercel auto-handles the redirect from www → non-www
- Vercel auto-provisions SSL for both

---

## 20. Hreflang & International SEO

### 20.1 Current Language Situation

| Site | Language |
|------|---------|
| Nexova Landing Page | English |
| Leanx Landing Page | English |
| Nexova Elements | English |
| Nexova Marketplace | **Malay (BM)** — entirely |

### 20.2 Strategy

The unified site has a bilingual opportunity — particularly for `/leanx` which targets Malaysian businesses. The strategy:

**Primary language:** English (`en`) — global reach, SEO authority  
**Secondary language:** Malay (`ms-MY`) — local Malaysian market penetration

**Implementation:**

```tsx
// For /leanx — bilingual page
// Store preference in localStorage, default to 'en'
// Toggle in top-right of the /leanx page

// In page metadata:
export async function generateMetadata() {
  return {
    alternates: {
      languages: {
        'en': 'https://nexova.co/leanx',
        'ms-MY': 'https://nexova.co/leanx?lang=ms', // OR separate route
      },
      canonical: 'https://nexova.co/leanx',
    },
  };
}
```

**Hreflang tags in `<head>`:**
```html
<link rel="alternate" hreflang="en" href="https://nexova.co/leanx" />
<link rel="alternate" hreflang="ms-MY" href="https://nexova.co/leanx?lang=ms" />
<link rel="alternate" hreflang="x-default" href="https://nexova.co/leanx" />
```

**Important:** `x-default` always points to the English version (or most universal version).

**Do NOT implement hreflang on:**
- Dashboard, builder, auth pages — these are not content pages
- `/elements` — English only
- `/templates` — English only (templates are professional, English-focused)

---

## 21. SSL Certificate Plan

### 21.1 Current State

- Nexova Landing Page is deployed on Vercel → Auto SSL via Let's Encrypt ✅
- User custom domains (Premium) also get auto-issued SSL via Vercel Domain API ✅
- All API calls use HTTPS (Supabase, LeanX API) ✅

### 21.2 Verification Steps Post-Launch

1. Visit `https://nexova.co` — browser should show green padlock / secure indicator
2. Visit `https://www.nexova.co` — should 301 to `https://nexova.co`
3. Visit `http://nexova.co` — should 301 to `https://nexova.co`
4. Check SSL expiry: Vercel auto-renews 30 days before expiry — no manual action needed
5. Test with SSL Labs: `https://www.ssllabs.com/ssltest/analyze.html?d=nexova.co` — target grade **A** or **A+**
6. Ensure no mixed content warnings (no `http://` asset URLs in HTML)

### 21.3 Security Headers Check

Use `https://securityheaders.com/?q=nexova.co` to verify all security headers (from Section 11.2) are live.

---

## 22. SEO Growth Opportunities

### 22.1 Keyword Strategy

**Primary keywords (Nexova product):**
- "no code landing page builder Malaysia"
- "landing page builder Malaysia"
- "landing page with payment Malaysia"
- "FPX payment integration landing page"
- "Malaysian business website builder"
- "X.IDE page builder"

**Primary keywords (Lean.x):**
- "payment gateway Malaysia"
- "same day settlement Malaysia"
- "FPX payment gateway"
- "e-wallet payment gateway Malaysia"
- "online payment Malaysia SME"
- "Lean.x payment"

**Primary keywords (Templates):**
- "website templates for small business"
- "SaaS landing page template"
- "fitness website template"
- "restaurant website template"
- "ecommerce website template"

**Primary keywords (Elements):**
- "web animation library React"
- "Framer Motion examples"
- "CSS animation examples"
- "landing page UI components"

### 22.2 Content Marketing (Blog)

Create a minimum 10 foundational blog posts targeting high-intent keywords:

| Title | Target Keyword | Intent |
|-------|---------------|--------|
| "How to Create a Landing Page with Payment in Malaysia (2026)" | landing page payment Malaysia | Informational → Conversion |
| "FPX vs e-Wallet: Which Payment Method Do Malaysians Prefer?" | FPX vs e-wallet Malaysia | Informational |
| "7 Reasons Malaysian SMEs Are Switching from Shopify to X.IDE" | X.IDE vs Shopify | Comparison |
| "How to Set Up LeanX Payment Gateway in 65 Minutes" | LeanX payment setup | Tutorial |
| "Best Website Templates for Malaysian Online Businesses" | website templates Malaysia | Informational |
| "Landing Page vs. Website: What You Actually Need to Sell Online" | landing page vs website | Informational |
| "How to Track Your Sales with Meta Pixel on Landing Pages" | Meta Pixel landing page | Tutorial |
| "The Ultimate Guide to Selling Digital Products Online in Malaysia" | sell digital products Malaysia | Informational |
| "TikTok Ads + Landing Pages: Complete Setup for Malaysian Sellers" | TikTok ads landing page Malaysia | Tutorial |
| "Getting Your First 100 Orders from a Landing Page" | landing page conversions | Informational |

### 22.3 On-Page SEO Quick Wins

- **FAQ sections on /pricing and /leanx** — target "People Also Ask" (PAA) slots in Google SERP
- **Comparison tables** on `/pricing` with competitor names (Shopify, Wix, Webflow) — capture comparison search intent
- **Video embed** on homepage showing builder in action — `VideoObject` schema + increased dwell time
- **User testimonials** with rich names, companies, and Malay/English mix — add `Review` schema
- **Template category pages** (e.g., `/templates/saas`, `/templates/fitness`) — each targets "saas website template" etc.
- **Case studies** (even brief ones) showing merchant results — strong conversion + SEO value

### 22.4 Technical SEO Quick Wins

- **Core Web Vitals targets:** LCP < 2.5s, FID/INP < 200ms, CLS < 0.1
- **Page Speed target:** 90+ mobile, 95+ desktop (Lighthouse / PageSpeed Insights)
- **Enable Vercel Analytics** for real-user Core Web Vitals monitoring
- **Google Search Console:** Submit sitemap, monitor coverage, fix any coverage errors
- **Bing Webmaster Tools:** Submit sitemap (Bing has significant traffic in Malaysia)
- **Google My Business:** Create a listing for Nexova if applicable

### 22.5 Link Building Opportunities

- **Product Hunt launch** for X.IDE — significant initial traffic + backlinks
- **AppSumo** listing — SaaS marketplaces drive qualified backlinks
- **Malaysian SME directories** — free business listings
- **Tech blogs in Malaysia** — Pitching product review content
- **Guest posts** on Malay-language business blogs — targets BM keywords
- **LeanX → Nexova reciprocal links** — the two brands should link to each other in their content

---

## 23. Implementation Rules & Safety Protocol

### 23.1 The Golden Rules (Never Break These)

0. **⛔ NEVER touch backend code.** This means zero edits to: `app/api/*`, `lib/*`, `supabase/*`, `middleware.ts`, `scripts/*`, `store/*`, `utils/*` (server-side), `.env*`, any Supabase schema, RLS policies, or any server-side integration (LeanX, Resend, Google OAuth, Vercel Domain API). All work is front-end UI only.

1. **Never edit / (root route) landing page while it's live without testing on a branch first.** The landing page is the conversion funnel — any broken state = lost customers.

2. **Never modify auth routes without end-to-end testing.** Broken auth = users locked out = churn.

3. **Always use the existing UI components** from `components/ui/` — do not create new Button, Card, or Input components.

4. **Every new public route must have `generateMetadata()`** with title, description, canonical, og.

5. **Every migrated page must pass `npm run build` without TypeScript errors** before merging.

6. **Every form must validate on both client AND server.** Never trust client-side alone.

7. **No secrets in code.** API keys, LeanX credentials, Supabase URLs must be in `.env.local` (never committed). Verify `.gitignore` includes `.env*`.

8. **No `href="#"` links in production.** Replace all placeholder links before launching any page.

9. **Test Lighthouse mobile score before merging any phase.** Target ≥ 85 on performance, 100 on SEO.

10. **The `/s/:subdomain` and `/d/:customDomain` published user pages must always have `noindex, nofollow` meta.** Never let user-generated content dilute Nexova's domain authority.

### 23.2 Git Workflow

```
main (production)
  └── feature/unified-site
        ├── feature/unified-nav-footer (Phase 1)
        ├── feature/templates-page (Phase 2)
        ├── feature/leanx-page (Phase 3)
        ├── feature/elements-page (Phase 4)
        └── feature/seo-audit (Phase 6)
```

Merge strategy: `feature/*` → `feature/unified-site` → test → `main`

### 23.3 Component Phase-In Approach

For every migrated section:
1. **Build the React component** (convert from HTML)
2. **Add Tailwind classes** (convert inline CSS)
3. **Add TypeScript types** for all props
4. **Add SSR-safe defaults** (no window/document access at render time)
5. **Test mobile layout** (375px iPhone-size)
6. **Add metadata** (generateMetadata)
7. **Add schema markup** (JsonLd component)
8. **Test Lighthouse** (before merging)

---

## 24. File-by-File Checklist

### 24.1 Files to Create (New)

| File | Purpose | Phase |
|------|---------|-------|
| `app/(marketing)/leanx/page.tsx` | Lean.x marketing page | 3 |
| `app/(marketing)/elements/page.tsx` | Animation gallery | 4 |
| `app/(marketing)/elements/layouts/page.tsx` | Layout blocks | 4 |
| `app/(marketing)/elements/widgets/page.tsx` | Elementor widgets | 4 |
| `app/(marketing)/about/page.tsx` | About page | 5 |
| `app/(marketing)/blog/page.tsx` | Blog index | 5 |
| `app/(marketing)/blog/[slug]/page.tsx` | Blog post | 5 |
| `app/(marketing)/contact/page.tsx` | Contact page | 5 |
| `app/(marketing)/changelog/page.tsx` | Changelog | 5 |
| `app/not-found.tsx` | Custom 404 | 1 |
| `app/error.tsx` | Custom 500 | 1 |
| `app/global-error.tsx` | Global error boundary | 1 |
| `app/sitemap.ts` | Dynamic sitemap | 6 |
| `components/shared/UnifiedNavbar.tsx` | Updated navbar | 1 |
| `components/shared/UnifiedFooter.tsx` | Updated footer | 1 |
| `components/seo/JsonLd.tsx` | Schema markup helper | 6 |
| `components/leanx/LeanxHero.tsx` | Lean.x hero section | 3 |
| `components/leanx/ProblemSection.tsx` | Problem section | 3 |
| `components/leanx/SolutionGrid.tsx` | 9 feature cards | 3 |
| `components/leanx/SecurityBadges.tsx` | Security badges | 3 |
| `components/leanx/Statistics.tsx` | Malaysia stats | 3 |
| `components/leanx/LeanxTestimonials.tsx` | Merchant testimonials | 3 |
| `components/leanx/LeanxCTA.tsx` | CTA section | 3 |
| `components/templates/TemplateHero.tsx` | Templates hero | 2 |
| `components/templates/TemplateGrid.tsx` | Template cards grid | 2 |
| `components/templates/CategoryFilter.tsx` | Filter pills | 2 |
| `components/templates/TemplateSidebar.tsx` | Detail page sidebar | 2 |
| `components/elements/AnimationCard.tsx` | Animation preview card | 4 |
| `components/elements/LayoutCard.tsx` | Layout block card | 4 |
| `components/elements/WidgetCard.tsx` | Widget card | 4 |
| `data/templates.ts` | Template data | 2 |
| `data/elements/animations.ts` | Animation data | 4 |
| `data/elements/layouts.ts` | Layout data | 4 |
| `data/elements/widgets.ts` | Widget data | 4 |
| `public/og/home.jpg` | OG image: home | 6 |
| `public/og/templates.jpg` | OG image: templates | 6 |
| `public/og/elements.jpg` | OG image: elements | 6 |
| `public/og/leanx.jpg` | OG image: leanx | 6 |

### 24.2 Files to Modify (Existing)

> ⛔ Only front-end files listed here. Backend files (`app/api/*`, `lib/*`, `supabase/*`, `middleware.ts`, `store/*`, `scripts/*`, `utils/*`) are completely off-limits.

| File | Change | Phase |
|------|--------|-------|
| `app/layout.tsx` | Use UnifiedNavbar + UnifiedFooter, add org Schema (JSX/UI only) | 1 |
| `app/robots.txt/route.ts` | Update Allow/Disallow rules | 1 |
| `next.config.js` | Add redirects, security headers (headers only), image domains, ISR — no server logic | 1 |
| `tailwind.config.ts` | Add new routes to `content` array, add new design tokens | 1 |
| `app/globals.css` | Add unified CSS variables, bilingual font support | 1 |
| `app/(marketing)/templates/page.tsx` | Replace with rich template marketplace (UI only, no API changes) | 2 |
| `app/page.tsx` | Home page — **to be built later, skip for now** | TBD |
| `app/pricing/page.tsx` | Add generateMetadata, FAQPage schema (UI/metadata only) | 6 |
| `middleware.ts` | ⛔ DO NOT TOUCH — backend routing logic | — |
| `package.json` | Add framer-motion if missing, front-end dependencies only | 1 |

**⛔ Permanent never-touch list (backend):**

| Path | Reason |
|------|--------|
| `app/api/*` | All server-side API endpoints |
| `lib/*` | Backend utilities (Supabase, LeanX, OAuth, caching, admin) |
| `supabase/*` | Database migrations, RLS policies, schema |
| `middleware.ts` | Auth and routing middleware |
| `scripts/*` | Backend scripts |
| `store/*` | Server-side state/store |
| `utils/*` (server-side) | Any utility touching Node.js APIs |
| `.env`, `.env.local`, `.env.production` | All environment variables |
| `contexts/AuthContext.tsx` | Auth context — hands off |

### 24.3 Files to Archive (Not Delete)

| Folder | Action |
|--------|--------|
| `Leanx Landing Page/` | Keep as reference, add README saying "Migrated to /templates" |
| `Nexova Elements/` | Keep as reference, add README saying "Migrated to /elements" |
| `Nexova Marketplace/` | Keep as reference, add README saying "Migrated to /leanx" |

---

## Quick Reference: Design Tokens (Universal)

```
PRIMARY GRADIENT:  #5BC0BE → #7C74EA  (135deg or right)
NAVY TEXT:         #455263
TEAL ACCENT:       #5FC7CD
CANVAS BG:         #F8FAFC
WHITE SURFACE:     #FFFFFF
DIVIDER:           #E2E8F0
MUTED TEXT:        #969696
DANGER:            #EF4444
FONT:              Satoshi (300/400/500/700/900) → fallback sans-serif
BASE RADIUS:       0.75rem (rounded-xl)
PILL RADIUS:       9999px (rounded-full)
SHADOW DEFAULT:    shadow-sm
SHADOW HOVER:      shadow-md
TRANSITION:        transition-all duration-300
CONTAINER:         max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
SECTION PADDING:   py-20 sm:py-32
CARD BG (dark):    bg-white/10 backdrop-blur-sm border border-white/10
SCROLL REVEAL:     opacity 0 → 1, translateY 48px → 0, duration 1000ms
```

---

*MegaEdit.md — Last updated March 17, 2026 — Nexova Unified Site Blueprint*
