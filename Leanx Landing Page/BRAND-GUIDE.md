# Lean.x Brand Design System

**Extracted Date:** December 1, 2025  
**Source:** Website Screenshot Analysis

---

## 🎨 Color Palette

The Lean.x brand uses a distinct tri-color palette featuring a soft purple, a fresh teal, and a warm yellow.

### Brand Colors

| Color Name | Hex | Swatch | Usage |
|------------|-----|--------|-------|
| **Lean Purple** | `#8479b2` | 🟣 | **Primary Action**: "Get Started" button, Upper Footer background. |
| **Lean Teal** | `#5bc2c6` | 🔵 | **Secondary Action**: "Register Now" button, Lower Footer background. |
| **Lean Yellow** | `#fdd056` | 🟡 | **Tertiary Action**: "Developer Portal", "Contact Sales" buttons. |
| **Lean Orange** | `#ff9f43` | 🟠 | **Logo Accent**: Used in the 'l' of the logo. |

### Text Colors

| Type | Hex | Usage |
|------|-----|-------|
| **Headings** | `#3d3d3d` | Main headlines, section titles (Dark Gray). |
| **Body** | `#757575` | Paragraph text, descriptions (Medium Gray). |
| **Inverse** | `#ffffff` | Text on Purple or Teal backgrounds. |

---

## ✍️ Typography

**Font Family:** Sans-serif (Segoe UI, Roboto, Helvetica Neue)

*   **Headings:** Semi-bold (600), Dark Gray (`#3d3d3d`)
*   **Body:** Regular (400), Medium Gray (`#757575`), Line-height 1.6

---

## 🧩 UI Components

### Buttons
All buttons in the Lean.x interface are **pill-shaped** (fully rounded corners).

*   **Get Started Button:** Purple background (`#8479b2`), White text.
*   **Register Now Button:** Teal background (`#5bc2c6`), White text.
*   **Developer/Contact Buttons:** Yellow background (`#fdd056`), Dark text.

### Footer
The footer has a unique split-color design:
*   **Top Section:** Purple (`#8479b2`) - Contains "Ready to get started?" CTA.
*   **Bottom Section:** Teal (`#5bc2c6`) - Contains links, address, and copyright.

### Icons
The brand uses isometric 3D-style icons featuring the brand colors (Yellow, Teal, Blue cubes and shapes).

---

## 🚀 Implementation

### CSS Variables
Link `brand-variables.css` to your project.

```css
.my-button {
    background-color: var(--lean-purple);
    color: var(--lean-text-light);
    border-radius: var(--btn-border-radius);
}
```

### SCSS
Import `brand-colors.scss`.

```scss
.footer {
    background-color: $lean-teal;
}
```
