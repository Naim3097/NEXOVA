# Template Creation Guide
## X.IDE v2 Page Builder

**Version:** 1.0
**Last Updated:** 2026-01-09
**Purpose:** Comprehensive guide for creating high-converting sales page templates

---

## Table of Contents

1. [Template Philosophy](#template-philosophy)
2. [Template Structure](#template-structure)
3. [Element Order & Flow](#element-order--flow)
4. [Best Practices](#best-practices)
5. [Element Configuration Guide](#element-configuration-guide)
6. [Design Principles](#design-principles)
7. [Content Strategy](#content-strategy)
8. [Auto-Product Creation](#auto-product-creation)
9. [Database Schema](#database-schema)
10. [SQL Template Example](#sql-template-example)
11. [Testing Checklist](#testing-checklist)

---

## Template Philosophy

### Core Principles

1. **Conversion-Focused** - Every element should drive toward a conversion goal
2. **Mobile-First** - Design for mobile, enhance for desktop
3. **Social Proof Heavy** - Build trust through testimonials and proof
4. **Value Clarity** - Make benefits crystal clear
5. **Urgency & Scarcity** - Use countdowns and limited offers appropriately

### Target Audience

Templates are designed for:
- Digital product sellers (ebooks, courses)
- Service providers (consulting, coaching)
- E-commerce merchants
- Event organizers
- Educational institutions

---

## Template Structure

### Required Template Metadata

```javascript
{
  name: string,              // Template display name
  slug: string,              // URL-friendly identifier (kebab-case)
  category: string,          // Category for filtering (lowercase)
  industry: string,          // Target industry (Title Case)
  description: string,       // 1-2 sentences, conversion-focused
  thumbnail_url: string,     // 400x300px placeholder image
  preview_url: string,       // 1200x800px preview image
  tags: string[],           // Array of searchable tags
  is_public: boolean,        // Visibility flag (true for all templates)
  usage_count: number,       // Start at 0
  data: {                    // Template configuration
    theme: {},              // Theme settings
    elements: [],           // Page elements (11 recommended)
    seo_settings: {}        // Default SEO config
  }
}
```

### Theme Configuration

```javascript
theme: {
  primaryColor: string,      // Main brand color (hex)
  fontFamily: string         // Font stack (default: 'Inter')
}
```

---

## Element Order & Flow

### Recommended 11-Element Structure

This is the **proven conversion flow** used in the Ebook Sales Page template:

| Order | Element Type | Purpose | Required |
|-------|-------------|---------|----------|
| 0 | **Announcement Bar** | Create urgency with countdown | ✅ |
| 1 | **Navigation** | Brand identity + easy navigation | ✅ |
| 2 | **Hero** | Capture attention + state main offer | ✅ |
| 3 | **Pain Points** (Features Grid) | Agitate the problem | ✅ |
| 4 | **Benefits** (Features Grid) | Present the solution | ✅ |
| 5 | **Pricing Table** | Show packages & pricing | ✅ |
| 6 | **Value Stack** (Features Grid) | Break down what's included | ✅ |
| 7 | **Testimonials** | Social proof & trust building | ✅ |
| 8 | **CTA Section** | Final conversion push | ✅ |
| 9 | **FAQ** | Handle objections | ✅ |
| 10 | **Footer** | Legal links + contact info | ✅ |

### Psychology Behind the Flow

1. **Urgency** (Announcement) - Immediate action motivation
2. **Trust** (Navigation) - Professional branding
3. **Hook** (Hero) - Big promise/benefit
4. **Problem** (Pain Points) - Agitate pain
5. **Solution** (Benefits) - Position as answer
6. **Proof** (Pricing) - Show value options
7. **Value** (Stack) - Justify price
8. **Social Proof** (Testimonials) - Reduce risk
9. **Action** (CTA) - Push to convert
10. **Objection Handling** (FAQ) - Remove doubts
11. **Footer** (Trust) - Legitimacy

---

## Best Practices

### Universal Rules

#### DO ✅
- Use **image variant** for hero sections (not centered/split)
- Include countdown timers for urgency
- Show 6 items in grid sections (pain points, benefits)
- Use 3 pricing tiers (Basic, Premium, Elite)
- Include 6 testimonials with 5-star ratings
- Add 8 FAQ questions minimum
- Use anchor links in navigation (#pricing, #faq)
- Set sticky navigation (isSticky: true)
- Include social media links in footer

#### DON'T ❌
- Don't use "centered" variant for hero (use "image" instead)
- Don't skip the announcement bar countdown
- Don't use fewer than 6 testimonials
- Don't forget to set highlighted plan (Premium)
- Don't use generic placeholder text
- Don't skip social proof elements
- Don't forget anchor links for navigation
- Don't use more than 11 elements (keeps pages focused)

### Content Guidelines

#### Headlines
- **Hero Title:** Lead with the biggest benefit/savings
  - Example: "Save Up To RM2,421 In Your First Year"
- **Subheadline:** Add urgency or deadline
  - Example: "Limited Time Offer - Enroll by January 31, 2026"

#### Descriptions
- Keep sentences short (10-15 words max)
- Use active voice
- Focus on outcomes, not features
- Include specific numbers when possible

#### CTAs (Call-to-Actions)
- Use action verbs: "Enroll Now", "Get Started", "Save Big"
- Include benefit: "Enroll Now - Save RM2,421"
- Make it urgent: "Limited Time Offer"
- Repeat CTAs 3-5 times throughout page

---

## Element Configuration Guide

### 1. Announcement Bar

**Purpose:** Create urgency with countdown timer

```javascript
{
  type: 'announcement_bar',
  order: 0,
  props: {
    message: 'SPECIAL PROMOTION ENDS IN',        // All caps for urgency
    bgColor: '#ef4444',                          // Red for urgency
    textColor: '#ffffff',                        // White for contrast
    showCountdown: true,                         // Always show countdown
    countdownLabel: 'Ends in:',                  // Label before timer
    countdownEndDate: (NOW() + INTERVAL '30 days')::text,  // 30 days from now
    isSticky: true,                              // Stick to top
    showCloseButton: false,                      // Force visibility
    link: '#pricing',                            // Scroll to pricing
    linkText: 'Get Started Now'                  // Action-oriented
  }
}
```

**Design Notes:**
- Red background creates urgency
- Always show countdown (don't allow dismissal on templates)
- Link directly to pricing or checkout section

---

### 2. Navigation Header

**Purpose:** Brand identity + easy navigation

```javascript
{
  type: 'navigation',
  order: 1,
  props: {
    logo: '',                                    // Empty for text logo
    logoText: 'YOUR ACADEMY',                    // Placeholder brand name
    menuItems: [
      { label: 'Home', url: '#' },
      { label: 'Benefits', url: '#benefits' },   // Anchor link
      { label: 'Pricing', url: '#pricing' },     // Anchor link
      { label: 'Testimonials', url: '#testimonials' },
      { label: 'FAQ', url: '#faq' }
    ],
    ctaButton: {
      text: 'Enroll Now',                        // Clear action
      url: '#pricing'                            // Direct to conversion
    },
    bgColor: '#ffffff',                          // White for clean look
    textColor: '#111827',                        // Dark text for contrast
    isSticky: true,                              // Always sticky
    layout: 'split'                              // Logo left, CTA right
  }
}
```

**Design Notes:**
- Keep 5 menu items max
- All links should be anchor links (#section)
- CTA button in header is critical for conversions
- Always use sticky navigation

---

### 3. Hero Section

**Purpose:** Capture attention + state main offer

**⚠️ IMPORTANT: Always use "image" variant for templates**

```javascript
{
  type: 'hero',
  order: 2,
  props: {
    variant: 'image',                            // ✅ ALWAYS USE IMAGE VARIANT
    title: 'Save Up To RM2,421 In Your First Year',  // Big benefit
    subtitle: 'Limited Time Offer - Enroll by January 31, 2026',  // Urgency
    description: 'Transform your learning journey with our comprehensive program...',
    primaryButton: {
      text: 'Enroll Now - Save RM2,421',         // Include benefit in CTA
      url: '#pricing'
    },
    secondaryButton: {
      text: 'Learn More',
      url: '#benefits'
    },
    image: 'https://images.unsplash.com/photo-[id]?w=1200&h=800&fit=crop',
    bgColor: '#f0fdfa'                           // Light background tint
  }
}
```

**Design Notes:**
- **ALWAYS use 'image' variant** - This shows background image with overlay
- Title should state the biggest benefit (usually monetary savings)
- Subtitle adds deadline/urgency
- Primary button = conversion action
- Secondary button = learn more (softer ask)
- Use high-quality Unsplash images (1200x800 minimum)

---

### 4. Pain Points Section

**Purpose:** Agitate the problem before presenting solution

```javascript
{
  type: 'features',
  order: 3,
  props: {
    title: 'Are You Struggling With These Challenges?',
    subtitle: 'You are not alone. Here are common problems we help solve:',
    variant: 'grid',                             // Grid layout for 6 items
    features: [
      {
        title: 'Lack of structured learning path',
        description: 'Without a clear roadmap, it is easy to feel lost...',
        icon: 'x-circle'                         // X icon for problems
      },
      // ... 5 more items (6 total)
    ]
  }
}
```

**Design Notes:**
- Use 'x-circle' icon for all pain points
- Keep 6 pain points for visual balance (2x3 grid)
- Make them relatable to target audience
- Use empathetic language ("You are not alone")

---

### 5. Benefits Section

**Purpose:** Present the solution with value propositions

```javascript
{
  type: 'features',
  order: 4,
  props: {
    title: 'Why Choose Our Program?',
    subtitle: 'Everything you need to succeed in one comprehensive package',
    variant: 'grid',
    features: [
      {
        title: '10+ Years Experience',
        description: 'Proven track record of helping students achieve their goals',
        icon: 'award'                            // Positive icon
      },
      {
        title: 'Free Enrichment Programs',
        description: 'Access exclusive workshops and bonus content at no extra cost',
        icon: 'gift'
      },
      {
        title: 'Quarterly Progress Reports',
        description: 'Regular assessments to track your improvement',
        icon: 'trending-up'
      },
      {
        title: 'Comprehensive Curriculum',
        description: 'Step-by-step lessons covering everything from basics to advanced',
        icon: 'check-circle'
      },
      {
        title: 'Exclusive 2026 Promotion',
        description: 'Special discount available only for early enrollments',
        icon: 'dollar-sign'
      },
      {
        title: '1000+ Successful Students',
        description: 'Join thousands who have transformed their lives',
        icon: 'users'
      }
    ]
  }
}
```

**Design Notes:**
- Use positive/achievement icons (award, gift, check-circle, etc.)
- Keep 6 benefits (mirrors 6 pain points)
- Include quantifiable claims (years, number of students)
- Focus on outcomes, not features

**Icon Recommendations:**
- Experience: `award`, `star`
- Free stuff: `gift`, `sparkles`
- Progress: `trending-up`, `chart`
- Quality: `check-circle`, `shield`
- Money: `dollar-sign`, `piggy-bank`
- Community: `users`, `heart`

---

### 6. Pricing Table

**Purpose:** Show packages & pricing options

```javascript
{
  type: 'pricing',
  order: 5,
  props: {
    title: 'Choose Your Package',
    subtitle: 'Save up to 50% with our limited-time promotion',
    layout: 'cards',                             // Cards layout, not table
    plans: [
      {
        name: 'Basic Package',
        price: '99',
        currency: 'RM',
        period: 'one-time',
        description: 'Perfect for beginners starting their journey',
        features: [
          'Access to core curriculum',
          'Monthly progress reports',
          'Email support',
          'Digital learning materials',
          'Certificate of completion'
        ],
        buttonText: 'Get Started',
        buttonUrl: '#checkout',
        highlighted: false                       // Not highlighted
      },
      {
        name: 'Premium Package',                 // MOST POPULAR
        price: '199',
        currency: 'RM',
        period: 'one-time',
        description: 'Most popular - Best value for serious learners',
        features: [
          'Everything in Basic',
          'Quarterly diagnostic tests',
          'Free enrichment classes',
          'Priority support',
          'Exclusive webinars',
          '1-on-1 coaching sessions'
        ],
        buttonText: 'Enroll Now - Save RM200',   // Emphasize savings
        buttonUrl: '#checkout',
        highlighted: true                        // ✅ ALWAYS HIGHLIGHT MIDDLE
      },
      {
        name: 'Elite Package',
        price: '349',
        currency: 'RM',
        period: 'one-time',
        description: 'Ultimate package with personalized attention',
        features: [
          'Everything in Premium',
          'Weekly 1-on-1 mentoring',
          'Customized learning path',
          'Lifetime access to updates',
          'VIP community access',
          'Job placement assistance'
        ],
        buttonText: 'Go Elite',
        buttonUrl: '#checkout',
        highlighted: false
      }
    ]
  }
}
```

**Design Notes:**
- **Always use 3 pricing tiers** (good-better-best psychology)
- **Always highlight the middle tier** (most popular = Premium)
- Use 'cards' layout, not 'table'
- Price progression: ~1:2:3.5 ratio
- Features should build on each other ("Everything in Basic +...")
- CTA text should reinforce savings on middle tier

**Pricing Psychology:**
- Low tier: Entry point (conversion starter)
- Middle tier: Sweet spot (highest conversions) ⭐
- High tier: Anchor (makes middle look affordable)

---

### 7. Value Stack Section

**Purpose:** Break down what's included in the promotion

```javascript
{
  type: 'features',
  order: 6,
  props: {
    title: 'What Is Included In This Promotion?',
    subtitle: 'Total value worth RM4,621 - Now only RM2,200',  // Show savings
    variant: 'grid',
    features: [
      {
        title: 'Registration Fee Waived',
        description: 'Save RM500 on enrollment - normally charged for all new students',
        icon: 'dollar-sign'
      },
      {
        title: 'Free Assessment Tests',
        description: 'Worth RM300 - Quarterly diagnostic tests to track your progress',
        icon: 'clipboard'
      },
      {
        title: 'Free Enrichment Classes',
        description: 'Worth RM800 - Access to all bonus workshops and masterclasses',
        icon: 'sparkles'
      },
      {
        title: 'Premium Learning Materials',
        description: 'Worth RM421 - Digital and physical resources included',
        icon: 'book'
      }
    ]
  }
}
```

**Design Notes:**
- Use 4 value items (2x2 grid)
- Include specific monetary values ("Worth RM300")
- Show total value vs. promo price in subtitle
- Icons should be service/product related

**Value Stacking Formula:**
- Item 1: Fee waiver (removes friction)
- Item 2-3: Bonus features (adds value)
- Item 4: Physical goods (tangible value)
- Total should be 2-3x the sale price

---

### 8. Testimonials Section

**Purpose:** Social proof & trust building

```javascript
{
  type: 'testimonials',
  order: 7,
  props: {
    title: 'What Our Students Say',
    subtitle: 'Join thousands of satisfied learners who transformed their lives',
    variant: 'grid',                             // Grid layout for 6
    testimonials: [
      {
        name: 'Sarah Johnson',
        role: 'Parent of 2 Students',            // Add credibility
        quote: 'My children grades improved dramatically within 3 months...',
        rating: 5                                // Always 5 stars
      },
      // ... 5 more (6 total)
    ]
  }
}
```

**Design Notes:**
- **Always include 6 testimonials** (3x2 grid)
- **All testimonials should be 5 stars** (build confidence)
- Mix customer types (parents, students, professionals)
- Keep quotes to 2-3 sentences
- Include specific outcomes ("straight As", "3 months")
- No avatars (text-only for cleaner design)

**Testimonial Formula:**
- Opening: Initial state/problem
- Middle: Experience with product
- Close: Specific result achieved

---

### 9. CTA Section

**Purpose:** Final conversion push with urgency

```javascript
{
  type: 'cta',
  order: 8,
  props: {
    title: 'Ready to Transform Your Learning Journey?',
    description: 'Join now and save up to RM2,421. Limited time offer ends January 31, 2026. Do not miss out!',
    buttonText: 'Enroll Now - Save Big',
    buttonUrl: '#pricing',
    buttonBgColor: '#10b981',                    // Green = action
    buttonTextColor: '#ffffff',
    buttonSize: 'large',
    buttonFontSize: 20,
    bgColor: '#f0fdf4'                           // Light green tint
  }
}
```

**Design Notes:**
- Use green for CTA (action color)
- Restate the offer and deadline
- Button should be large and prominent
- Include "Save" or benefit in button text

---

### 10. FAQ Section

**Purpose:** Handle objections and answer questions

```javascript
{
  type: 'faq',
  order: 9,
  props: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about our program',
    variant: 'accordion',                        // Accordion style
    questions: [
      {
        question: 'What is included in the program?',
        answer: 'The program includes comprehensive curriculum materials...'
      },
      // ... 7 more (8 total minimum)
    ]
  }
}
```

**Design Notes:**
- Include **minimum 8 questions**
- Cover common objections:
  1. What's included? (Product details)
  2. How long is access? (Duration/limits)
  3. Money-back guarantee? (Risk reversal)
  4. Can I upgrade? (Flexibility)
  5. Payment methods? (Purchase friction)
  6. When does promotion end? (Urgency)
  7. Group discounts? (Additional value)
  8. Still have questions? (Contact info)
- Last question should always invite contact

---

### 11. Footer

**Purpose:** Legal links, contact info, trust signals

```javascript
{
  type: 'footer',
  order: 10,
  props: {
    logo: '',
    logoText: 'YOUR ACADEMY',
    description: 'Empowering learners to achieve their full potential...',
    columns: [
      {
        title: 'Quick Links',
        links: [
          { label: 'Home', url: '#' },
          { label: 'About Us', url: '#about' },
          { label: 'Programs', url: '#programs' },
          { label: 'Contact', url: '#contact' }
        ]
      },
      {
        title: 'Programs',
        links: [
          { label: 'Basic Package', url: '#pricing' },
          { label: 'Premium Package', url: '#pricing' },
          { label: 'Elite Package', url: '#pricing' },
          { label: 'Enrichment Classes', url: '#enrichment' }
        ]
      },
      {
        title: 'Support',
        links: [
          { label: 'FAQ', url: '#faq' },
          { label: 'Contact Us', url: '#contact' },
          { label: 'Privacy Policy', url: '#privacy' },
          { label: 'Terms of Service', url: '#terms' }
        ]
      }
    ],
    socialLinks: [
      { platform: 'facebook', url: 'https://facebook.com/youracademy' },
      { platform: 'twitter', url: 'https://twitter.com/youracademy' },
      { platform: 'instagram', url: 'https://instagram.com/youracademy' }
    ],
    copyright: '© 2026 Your Academy. All rights reserved.',
    bgColor: '#1f2937',                          // Dark background
    textColor: '#ffffff'                         // White text
  }
}
```

**Design Notes:**
- Use 3 columns for organization
- Include social media links (Facebook, Twitter, Instagram minimum)
- Dark background (#1f2937) for contrast
- Always include Privacy Policy and Terms links

---

## Design Principles

### Color Psychology

| Color | Use For | Hex Code |
|-------|---------|----------|
| **Red** | Urgency, countdown | #ef4444 |
| **Green** | Action, CTA buttons | #10b981 |
| **Blue** | Trust, info | #3b82f6 |
| **Dark Gray** | Footer, text | #1f2937 |
| **White** | Clean backgrounds | #ffffff |
| **Light Tints** | Section backgrounds | #f0fdfa, #f0fdf4 |

### Typography

- **Font:** Inter (clean, modern, readable)
- **Hierarchy:**
  - H1 (Hero): 48-64px
  - H2 (Sections): 36-42px
  - H3 (Cards): 20-24px
  - Body: 16-18px
  - Small: 14px

### Spacing

- Section padding: 80px top/bottom (desktop), 40px (mobile)
- Element gaps: 24px
- Card padding: 32px
- Button padding: 16px 32px

### Responsive Breakpoints

- Mobile: < 768px (1 column)
- Tablet: 768-1024px (2 columns)
- Desktop: > 1024px (3 columns)

---

## Content Strategy

### Copy Formula: PAS (Problem-Agitate-Solution)

1. **Problem** (Pain Points Section)
   - Identify 6 specific pain points
   - Use "you" language
   - Make it emotional

2. **Agitate** (Hero + Benefits)
   - Show what they're missing
   - Use specific numbers
   - Create urgency

3. **Solution** (Benefits + Pricing)
   - Position product as answer
   - Show transformation
   - Remove risk (guarantee)

### Conversion Triggers

| Trigger | Where to Use | Example |
|---------|-------------|---------|
| **Urgency** | Announcement bar, hero | "Ends January 31" |
| **Scarcity** | Pricing | "Limited spots available" |
| **Social Proof** | Testimonials | "1000+ students" |
| **Authority** | Benefits | "10+ years experience" |
| **Value** | Value stack | "Worth RM4,621, now RM2,200" |
| **Risk Reversal** | FAQ | "30-day money-back guarantee" |

---

## Auto-Product Creation

### Overview

**🎉 NEW FEATURE:** Templates with pricing elements now **automatically create products** in the user's inventory when they create a project!

### How It Works

When a user creates a project from a template containing a **Pricing Table** element:

1. **System detects pricing data** in template
2. **Products are auto-created** for each pricing plan
3. **Products appear in user's inventory** with source tracking
4. **Pricing table is linked** to actual product IDs
5. **User can manage products** from Products page

### Example: Ebook Sales Page Template

**Template has 3 pricing plans** →
- Basic Package (RM 99)
- Premium Package (RM 199)
- Elite Package (RM 349)

**User creates project** →
- 3 products automatically created
- All fields populated from template
- Source tracked as "📄 Ebook Sales Page"

**User sees in Products page:**

| Code | Name | Source | Stock | Price | Status |
|------|------|--------|-------|-------|--------|
| BASIC-PKG-001 | Basic Package | **📄 Ebook Sales Page** | 999 | RM 99.00 | active |
| PREMIUM-PKG-001 | Premium Package | **📄 Ebook Sales Page** | 999 | RM 199.00 | active |
| ELITE-PKG-001 | Elite Package | **📄 Ebook Sales Page** | 999 | RM 349.00 | active |

### Product Fields Auto-Populated

```javascript
{
  code: "PREMIUM-PACKAGE-1736391234567",  // Auto-generated
  name: "Premium Package",                // From pricing plan name
  description: "Most popular - Best...",  // From plan description
  stock: 999,                             // Default for digital products
  base_price: 199.00,                     // From plan price
  currency: "RM",                         // From plan currency
  quantity_pricing: [],                   // Empty initially
  notes: "Auto-created from Ebook...",    // Helpful note
  status: "active",                       // Active by default
  source_project_id: "[project-uuid]",    // Link to project
  source_template: "Ebook Sales Page",    // Template name
  is_template_product: true               // Auto-created flag
}
```

### Benefits for Users

**Before (Manual Process):**
1. Create project from template
2. Navigate to Products page
3. Manually create Basic Package
4. Manually create Premium Package
5. Manually create Elite Package
6. Return to builder
7. Select products from dropdown
8. **Total time:** ~10 minutes

**After (Automatic):**
1. Create project from template
2. ✅ Products already created
3. ✅ Products already linked
4. Edit or publish immediately
5. **Total time:** ~30 seconds

**Time saved:** 95% faster! 🚀

### Template Requirements

For auto-product creation to work, ensure your template has:

#### 1. Pricing Element Required

```javascript
{
  type: 'pricing',
  order: 5,  // Any order number
  props: {
    plans: [
      {
        name: string,        // ✅ REQUIRED
        price: string,       // ✅ REQUIRED (numeric)
        currency: string,    // ✅ REQUIRED
        description: string, // Recommended
        features: array,     // Optional
        buttonText: string,  // Optional
        buttonUrl: string,   // Optional
        highlighted: boolean // Optional
      }
    ]
  }
}
```

#### 2. Valid Plan Data

Each plan **must** have:
- **name** - Clear product name (e.g., "Basic Package")
- **price** - Numeric value as string (e.g., "99" or "199.00")
- **currency** - Currency code (e.g., "RM", "USD", "SGD")
- **description** - Brief description (recommended for clarity)

#### 3. Realistic Pricing

Set prices that:
- Make sense for the industry
- Follow good-better-best psychology
- Can be edited by users later
- Include currency appropriate for target market

### Product Management

#### Users Can Edit:
- ✅ Product name
- ✅ Description
- ✅ Price (updates everywhere)
- ✅ Stock quantity
- ✅ Currency
- ✅ Status (active/inactive)
- ✅ Notes
- ✅ Product images

#### System-Managed Fields:
- 🔒 Source project ID (read-only)
- 🔒 Source template name (read-only)
- 🔒 is_template_product flag (read-only)
- 🔒 Product code (auto-generated)

### Source Tracking Display

Products page shows source for each product:

**Template Products:**
```
📄 Ebook Sales Page
```
- Blue badge
- Template name shown
- Indicates auto-created

**Manual Products:**
```
Manual
```
- Gray text
- No badge
- User-created

### Database Schema (Products)

New columns added for source tracking:

```sql
ALTER TABLE products
ADD COLUMN source_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
ADD COLUMN source_template TEXT,
ADD COLUMN is_template_product BOOLEAN DEFAULT false;
```

### Best Practices for Template Creators

#### DO ✅
- Include pricing element in all sales templates
- Use 3 pricing tiers (good-better-best)
- Set realistic default prices
- Include clear descriptions for each plan
- Highlight the middle tier (highest conversions)
- Use appropriate currency for target market

#### DON'T ❌
- Don't skip the pricing element on sales templates
- Don't use unrealistic prices (e.g., $1 or $1,000,000)
- Don't leave plan descriptions empty
- Don't forget currency field
- Don't use inconsistent currencies across plans

### Testing Product Creation

After creating a template with pricing, test:

1. **Create project from template**
2. **Check Products page** - Should see auto-created products
3. **Verify source badge** - Should show template name
4. **Check product details** - All fields populated correctly
5. **Test editing** - Users can edit product details
6. **Test deletion** - Users can delete if needed
7. **Check pricing element** - Linked to product IDs

### Future Enhancements

**Phase 2 Features** (not yet implemented):

1. **Bi-directional Sync**
   - Update product → Pricing updates automatically
   - Update pricing → Product updates automatically

2. **Product Variants**
   - Size, color, material options
   - Different pricing per variant

3. **Bulk Operations**
   - Update all template products at once
   - Delete all products from a template

4. **Analytics Integration**
   - Track which products convert best
   - Show revenue per product

### Example: Complete Pricing Element

```javascript
jsonb_build_object(
  'type', 'pricing',
  'order', 5,
  'props', jsonb_build_object(
    'title', 'Choose Your Package',
    'subtitle', 'Save up to 50% with our limited-time promotion',
    'layout', 'cards',
    'plans', jsonb_build_array(
      jsonb_build_object(
        'name', 'Basic Package',           // → Product name
        'price', '99',                     // → base_price
        'currency', 'RM',                  // → currency
        'period', 'one-time',
        'description', 'Perfect for beginners...', // → description
        'features', jsonb_build_array(
          'Access to core curriculum',
          'Monthly progress reports',
          'Email support',
          'Digital learning materials',
          'Certificate of completion'
        ),
        'buttonText', 'Get Started',
        'buttonUrl', '#checkout',
        'highlighted', false
      ),
      // Premium and Elite packages...
    )
  )
)
```

This pricing data will automatically create products when users use the template!

---

## Database Schema

### Templates Table Structure

```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  preview_url TEXT,
  data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Data JSONB Structure

```javascript
{
  theme: {
    primaryColor: string,
    fontFamily: string
  },
  elements: [
    {
      type: string,        // Element type (hero, features, etc.)
      order: number,       // Display order (0-10)
      props: object        // Element-specific properties
    }
  ],
  seo_settings: {
    title: string,
    description: string
  }
}
```

---

## SQL Template Example

### Complete Template Insertion

```sql
INSERT INTO templates (
  name,
  slug,
  category,
  industry,
  description,
  thumbnail_url,
  preview_url,
  tags,
  is_public,
  usage_count,
  data
) VALUES (
  'Ebook Sales Page',
  'ebook-sales-page',
  'ebook',
  'Education',
  'A high-converting sales page template perfect for ebooks...',
  'https://placehold.co/400x300/22c55e/ffffff?text=Ebook',
  'https://placehold.co/1200x800/22c55e/ffffff?text=Ebook+Sales+Page',
  ARRAY['ebook', 'digital-product', 'course', 'sales'],
  true,
  0,
  jsonb_build_object(
    'theme', jsonb_build_object(
      'primaryColor', '#10b981',
      'fontFamily', 'Inter'
    ),
    'elements', jsonb_build_array(
      -- Element 0: Announcement Bar
      jsonb_build_object(
        'type', 'announcement_bar',
        'order', 0,
        'props', jsonb_build_object(
          'message', 'SPECIAL PROMOTION ENDS IN',
          'bgColor', '#ef4444',
          'textColor', '#ffffff',
          'showCountdown', true,
          'countdownLabel', 'Ends in:',
          'countdownEndDate', (NOW() + INTERVAL '30 days')::text,
          'isSticky', true,
          'showCloseButton', false,
          'link', '#pricing',
          'linkText', 'Get Started Now'
        )
      ),
      -- Element 1: Navigation
      -- Element 2: Hero (variant: 'image' ✅)
      -- ... (continue for all 11 elements)
    ),
    'seo_settings', jsonb_build_object(
      'title', 'Your Template Title',
      'description', 'Your template description'
    )
  )
);
```

---

## Testing Checklist

### Pre-Launch Verification

#### Visual Testing
- [ ] All 11 elements render correctly
- [ ] Hero uses 'image' variant (not 'centered')
- [ ] Countdown timer displays and counts down
- [ ] Navigation is sticky on scroll
- [ ] Mobile menu works (hamburger icon)
- [ ] Pricing table shows 3 plans
- [ ] Premium plan is highlighted
- [ ] All anchor links work (#pricing, #faq, etc.)
- [ ] Footer social icons display
- [ ] Colors match theme settings

#### Content Testing
- [ ] No Lorem Ipsum text
- [ ] All CTAs are action-oriented
- [ ] Pricing includes savings messaging
- [ ] Testimonials show 5 stars
- [ ] FAQ has 8+ questions
- [ ] Value stack shows monetary values
- [ ] Benefits include icons
- [ ] Pain points use X-circle icon

#### Functional Testing
- [ ] Template appears in gallery
- [ ] "Use This Template" creates project
- [ ] All elements load in builder
- [ ] Properties panel shows all fields
- [ ] Countdown calculates correctly
- [ ] Published page renders correctly
- [ ] Mobile responsive on all breakpoints

#### SEO Testing
- [ ] Meta title is descriptive
- [ ] Meta description is compelling
- [ ] Images have alt text placeholders
- [ ] Headings use proper hierarchy (H1, H2, H3)

---

## Quick Reference

### Must-Have Elements (Non-Negotiable)

1. ✅ Announcement Bar with countdown
2. ✅ Sticky Navigation
3. ✅ Hero with 'image' variant
4. ✅ 6 Pain Points (features grid)
5. ✅ 6 Benefits (features grid)
6. ✅ 3 Pricing Tiers (middle highlighted)
7. ✅ Value Stack (4 items)
8. ✅ 6 Testimonials (5 stars)
9. ✅ Large CTA Section
10. ✅ 8+ FAQ Questions
11. ✅ Complete Footer

### Color Scheme Quick Picks

| Template Type | Primary | Accent | CTA |
|--------------|---------|--------|-----|
| **Education** | #10b981 (Green) | #ef4444 (Red) | #10b981 |
| **Tech/SaaS** | #3b82f6 (Blue) | #8b5cf6 (Purple) | #3b82f6 |
| **E-commerce** | #f59e0b (Amber) | #ef4444 (Red) | #10b981 |
| **Health** | #22c55e (Green) | #06b6d4 (Cyan) | #22c55e |

### Icon Mapping

| Concept | Recommended Icons |
|---------|------------------|
| **Problems** | x-circle |
| **Benefits** | check-circle, award, star |
| **Money** | dollar-sign, piggy-bank |
| **Time** | clock, calendar |
| **People** | users, user-check |
| **Learning** | book, graduation-cap |
| **Support** | shield, heart |
| **Growth** | trending-up, bar-chart |

---

## Appendix: Common Mistakes

### ❌ Avoid These Pitfalls

1. **Using 'centered' hero variant** - Always use 'image'
2. **Forgetting countdown end date** - Set to realistic future date
3. **Not highlighting middle pricing tier** - Premium should be highlighted
4. **Using fewer than 6 testimonials** - Need 6 for grid layout
5. **Missing sticky navigation** - Users need easy access to sections
6. **No anchor links** - Navigation items should link to sections
7. **Generic CTAs** - "Click here" vs "Enroll Now - Save RM2,421"
8. **Weak value stack** - Show specific monetary values
9. **No urgency** - Every template needs deadline/countdown
10. **Inconsistent tone** - Match industry (formal for education, casual for creative)

---

## Support & Resources

### Template Development Flow

1. **Research** - Analyze reference sales pages
2. **Plan** - Map out 11 elements and flow
3. **Copy** - Write compelling content
4. **Build** - Create SQL INSERT statement
5. **Test** - Verify all 11 elements work
6. **Refine** - Adjust colors, spacing, copy
7. **Document** - Update template guide if needed

### Tools

- **Placeholder Images:** https://placehold.co
- **Stock Photos:** https://unsplash.com
- **Icons:** Lucide React (built-in)
- **Color Picker:** https://colorhunt.co
- **Copy Formulas:** PAS (Problem-Agitate-Solution)

### Questions?

For template-related questions or improvements to this guide, refer to:
- `TEMPLATE_RESET_SUMMARY.md` - Latest template changelog
- `PRD_PHASE_10.md` - Element specifications
- Reference implementation: Ebook Sales Page template

---

**Last Updated:** 2026-01-09
**Template Version:** 1.1 (with Auto-Product Creation)
**Guide Maintainer:** X.IDE Development Team

**Remember:** Every template should be conversion-focused, mobile-responsive, and follow the proven 11-element structure. Templates with pricing elements will automatically create products in users' inventories, saving 95% of setup time. When in doubt, refer back to the Ebook Sales Page template as the gold standard.
