# Nexova Design System & UX Guidelines

**Philosophy:** Human-Centric Professionalism

Nexova's design language is built on the integration of Microsoft-like fluid interactions and a distinct, approachable color palette. We prioritize a "human" aesthetic—soft, welcoming, and clear—over the rigid, blocky, or overly "generated" look often associated with AI tools.

---

## 1. Core Visual Principles

### "Microsoft-like" Smoothness

We aim for the polished feel of modern productivity suites (like Microsoft 365 or Fluid Framework).

- **Transitions:** All interactive elements (buttons, links, inputs) use `transition-all` for seamless state changes.
- **Subtlety:** Shadows are soft (`shadow-sm`, `shadow-lg` with low opacity) rather than harsh.
- **Airiness:** Generous padding (`p-6`, `p-8`) and whitespace prevent density overload.
- **Rounded Geometry:** We use `rounded-xl` (extra large) and `rounded-2xl` for containers and buttons to soften the UI, moving away from sharp, industrial corners.

### The "Human" Touch (Not AI)

We explicitly avoid design patterns that look "machine-generated" or overly "tech-heavy."

- **No Thick Indicators:** We do not use thick accent borders (e.g., `border-l-4`) on cards. This is often an "AI dashboard" trope. We use clean, 1px borders instead.
- **Explanatory UI:** We use friendly helper boxes (Teal/Blue backgrounds) to explain _why_ a setting exists, rather than just presenting raw data fields.
- **Contextual Help:** Sections often include "How to..." guides directly inline, treating the user as a person learning the tool, not an operator.

---

## 2. Color Palette

### Primary Brand Colors

- **Nexova Navy (`#455263`)**: Used for primary text, headings, and primary actions. It communicates stability and structure.
  - _Usage_: Headings (`h1`, `h2`), Primary Buttons, Strong Labels.
- **Nexova Teal (`#5FC7CD`)**: The creative accent. Used for active states, brand highlights, and "success" or "ready" states.
  - _Usage_: Icons, Links, Focus Rings, Toggles (Active), Call-to-actions (hover states).

### Neutral Foundation

- **Canvas Gray (`#F8FAFC`)**: The main application background. Slightly warmer/softer than pure white.
- **Surface White (`#FFFFFF`)**: Used for cards, sidebars, and input fields.
- **Divider Gray (`#E2E8F0`)**: Used for borders and separators. Subtle and non-intrusive.
- **Muted Text (`#969696`)**: Secondary information, placeholders, and inactive icons.

### Semantic/functional Colors

- **Danger Red (`#EF4444`)**: Destructive actions (Delete Account).
- **Warning Yellow (`#FFCE33`)**: Notices, "Required" alerts, Profile initials.
- **Accent Purple (`#8273B5`)**: Occasional secondary functional icons (e.g., API/Integration features).

---

## 3. UI Component Patterns

### Layout & Containers

- **Main Shell:** Fixed Sidebar (White) + Scrollable Main Content (Canvas Gray).
- **Cards:**
  - Background: White
  - Border: `border border-[#E2E8F0]`
  - Radius: `rounded-2xl`
  - Shadow: `shadow-sm`
  - _Note: Cards should feel like physical paper on a desk, not digital readouts._

### Typography

- **Headings:** Bold, Navy (`#455263`), tighter tracking (`tracking-tight`).
- **Body:** Sans-serif, readable.
- **Forms:** Labels are bold and Navy. Helper text is Muted Gray.

### Interactive Elements

- **Buttons:**
  - **Primary:** Navy bg (`bg-[#455263]`), White text, rounded-xl. Hover usually lightens slightly or adds shadow.
  - **Secondary/Outline:** White bg, Border (`border-[#E2E8F0]`), Navy text. Hover turns bg to Gray (`#F8FAFC`) and text to Teal (`#5FC7CD`).
  - **Ghost/Link:** Text styling only, hover transitions to Teal.
- **Inputs:**
  - Standard `rounded-xl` with `border-[#E2E8F0]`.
  - **Focus State:** `ring-1 ring-[#5FC7CD] border-[#5FC7CD]` (No default browser blue rings).

---

## 4. Implementation Guidelines (CSS/Tailwind)

| Element             | Recommended Classes                                                                |
| :------------------ | :--------------------------------------------------------------------------------- |
| **Page Background** | `bg-[#F8FAFC]`                                                                     |
| **Card**            | `bg-white rounded-2xl border border-[#E2E8F0] shadow-sm`                           |
| **Primary Button**  | `bg-[#455263] text-white rounded-xl font-bold hover:bg-[#333d4a] transition-all`   |
| **Action Icon**     | `text-[#969696] hover:text-[#5FC7CD] transition-colors`                            |
| **Input Field**     | `bg-white border-[#E2E8F0] rounded-xl focus:border-[#5FC7CD] focus:ring-[#5FC7CD]` |

---

_This document serves as the source of truth for maintainers to ensure Nexova remains cohesive, human-friendly, and distinct from generic AI-generated interfaces._
