# Template Creation Guide

This guide documents how to create templates for the Page Builder. Follow this guide to ensure templates work correctly in both the builder canvas and published pages.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Supported Element Types](#supported-element-types)
3. [Template SQL Structure](#template-sql-structure)
4. [Element Props Reference](#element-props-reference)
5. [Publishing System](#publishing-system)
6. [Troubleshooting Checklist](#troubleshooting-checklist)

---

## Architecture Overview

Templates in this system have **three rendering contexts**:

1. **Builder Canvas** (`components/builder/Canvas.tsx`)
   - React components for live editing
   - Located in `components/builder/elements/`

2. **Preview Mode** (`app/builder/preview/page.tsx`)
   - Uses the same React components as Canvas

3. **Published HTML** (`lib/publishing/html-generator.ts`)
   - Static HTML generation for published pages
   - Each element type needs a corresponding HTML generator function

### Critical: Publishing Support

**Every element type used in a template MUST be supported in the HTML generator.**

The HTML generator's `generateBodyContent` function contains a switch statement that maps element types to their HTML generators. If an element type is missing from this switch statement, it will NOT render in published pages.

**Files to check/update when adding new element types:**
- `types/index.ts` - Add to `ElementType` union
- `components/builder/Canvas.tsx` - Add case in `renderElement` switch
- `components/builder/elements/index.ts` - Export the component
- `lib/publishing/html-generator.ts` - Add case in `generateBodyContent` switch
- Create HTML generator in `lib/publishing/` if needed

---

## Supported Element Types

The following element types are supported in both the builder and published pages:

| Element Type | Builder Component | HTML Generator | Status |
|-------------|-------------------|----------------|--------|
| `announcement_bar` | AnnouncementBarElement | Inline | Supported |
| `navigation` | NavigationElement | Inline | Supported |
| `hero` | HeroElement | Inline | Supported |
| `features` | FeaturesElement | Inline | Supported |
| `testimonials` | TestimonialsElement | Inline | Supported |
| `faq` | FAQElement | Inline | Supported |
| `cta` | CTAElement | Inline | Supported |
| `pricing` | PricingElement | `generatePricingHTML` | Supported |
| `payment_button` | PaymentButtonElement | `generatePaymentButtonHTML` | Supported |
| `footer` | FooterElement | Inline | Supported |
| `lead_form` | LeadFormElement | `generateLeadFormHTML` | Supported |
| `whatsapp_button` | WhatsAppButtonElement | `generateWhatsAppButtonHTML` | Supported |
| `form_with_payment` | FormWithPaymentElement | `generateFormWithPaymentHTML` | Supported |
| `booking_form` | BookingFormElement | `generateBookingFormHTML` | Supported |
| `product_carousel` | ProductCarouselElement | `generateProductCarouselHTML` | Supported |

---

## Template SQL Structure

Templates are stored in the `templates` table. Here's the structure:

```sql
INSERT INTO templates (
  id,
  name,
  slug,
  category,
  industry,
  description,
  thumbnail_url,
  preview_url,
  data,
  is_public,
  usage_count,
  tags
) VALUES (
  gen_random_uuid(),
  'Template Name',
  'template-slug',
  'category-name',
  'Industry Name',
  'Template description...',
  'https://placehold.co/400x300/...',
  'https://placehold.co/1200x800/...',
  jsonb_build_object(
    'elements', jsonb_build_array(
      -- Elements go here
    ),
    'seo_settings', jsonb_build_object(
      'title', 'Page Title',
      'description', 'Meta description...',
      'ogType', 'website',
      'twitterCard', 'summary_large_image',
      'robotsIndex', true,
      'robotsFollow', true,
      'language', 'en'
    ),
    'theme', jsonb_build_object(
      'primaryColor', '#hexcolor',
      'fontFamily', 'Inter'
    )
  ),
  true,  -- is_public
  0,     -- usage_count
  ARRAY['tag1', 'tag2', 'tag3']
);
```

### Element Structure

Each element in the `elements` array must have:

```sql
jsonb_build_object(
  'id', 'unique-element-id',
  'type', 'element_type',  -- Must match ElementType
  'order', 1,              -- Display order (1-based)
  'props', jsonb_build_object(
    -- Element-specific props
  )
)
```

---

## Element Props Reference

### announcement_bar

```json
{
  "message": "Announcement text",
  "bgColor": "#dc2626",
  "textColor": "#ffffff",
  "showCountdown": false,
  "countdownLabel": "Ends in:",
  "countdownEndDate": "2026-12-31T23:59:59",
  "isSticky": true,
  "showCloseButton": true,
  "link": "#section",
  "linkText": "Learn More"
}
```

### navigation

```json
{
  "logo": "https://url-to-logo.png",
  "logoText": "BRAND NAME",
  "menuItems": [
    { "label": "Home", "url": "#" },
    { "label": "Features", "url": "#features" }
  ],
  "ctaButton": {
    "text": "Get Started",
    "url": "#cta"
  },
  "bgColor": "#0f172a",
  "textColor": "#ffffff",
  "isSticky": true,
  "layout": "split"
}
```

### hero

Variants: `image_left`, `image_bg`, `centered`

```json
{
  "variant": "image_bg",
  "headline": "Main Headline",
  "subheadline": "Supporting text",
  "ctaText": "Call to Action",
  "ctaUrl": "#section",
  "image": "https://url-to-image.jpg",
  "bgColor": "#0f172a",
  "headlineColor": "#ffffff",
  "subheadlineColor": "#e2e8f0",
  "imageOpacity": 60,
  "buttonBgColor": "#dc2626",
  "buttonTextColor": "#ffffff"
}
```

### features

Variants: `grid`, `list`, `alternating`

```json
{
  "title": "Section Title",
  "subtitle": "Section subtitle",
  "variant": "grid",
  "features": [
    {
      "title": "Feature Title",
      "description": "Feature description",
      "icon": "check-circle"
    }
  ],
  "bgColor": "#f8fafc",
  "backgroundImage": "https://optional-bg-image.jpg",
  "backgroundOpacity": 20
}
```

Available icons: `check-circle`, `shield`, `zap`, `clock`, `star`, `heart`, `settings`, `droplet`, `wind`, `circle`, `award`, `dollar-sign`, `gift`, etc.

### testimonials

Variants: `slider`, `grid`, `masonry`

```json
{
  "title": "What Our Customers Say",
  "subtitle": "Optional subtitle",
  "variant": "grid",
  "testimonials": [
    {
      "name": "Customer Name",
      "role": "Customer Role/Title",
      "avatar": "https://optional-avatar.jpg",
      "quote": "Testimonial text...",
      "rating": 5
    }
  ],
  "bgColor": "#f1f5f9"
}
```

### faq

Variants: `single_column`, `two_column`

```json
{
  "title": "Frequently Asked Questions",
  "subtitle": "Optional subtitle",
  "variant": "single_column",
  "questions": [
    {
      "question": "Question text?",
      "answer": "Answer text..."
    }
  ],
  "bgColor": "#ffffff"
}
```

### cta

Variants: `centered`, `split`, `banner`

```json
{
  "variant": "centered",
  "headline": "Ready to Get Started?",
  "description": "Supporting description text",
  "buttonText": "Sign Up Now",
  "buttonUrl": "#signup",
  "bgGradient": "linear-gradient(to right, #3b82f6, #2563eb)",
  "buttonColor": "#ffffff",
  "buttonTextColor": "#3b82f6",
  "buttonSize": "lg"
}
```

### pricing

Layouts: `cards`, `table`

```json
{
  "title": "Pricing Plans",
  "subtitle": "Choose the plan that fits you",
  "layout": "cards",
  "plans": [
    {
      "name": "Basic",
      "price": "29",
      "currency": "RM",
      "period": "/month",
      "description": "Perfect for starters",
      "features": ["Feature 1", "Feature 2"],
      "buttonText": "Get Started",
      "buttonUrl": "#",
      "highlighted": false,
      "enablePayment": false,
      "priceNumeric": 29
    }
  ],
  "bgColor": "#ffffff",
  "enablePaymentIntegration": false
}
```

### lead_form

```json
{
  "title": "Get in Touch",
  "description": "Fill out the form below",
  "nameLabel": "Full Name",
  "emailLabel": "Email Address",
  "phoneLabel": "Phone Number",
  "messageLabel": "Message",
  "showName": true,
  "showEmail": true,
  "showPhone": true,
  "showMessage": true,
  "nameRequired": true,
  "emailRequired": true,
  "phoneRequired": false,
  "messageRequired": false,
  "submitButtonText": "Send Message",
  "submitButtonColor": "#2563eb",
  "bgColor": "#ffffff",
  "google_sheets_enabled": false,
  "google_sheets_url": ""
}
```

### booking_form

```json
{
  "title": "Book Your Appointment",
  "description": "Select your preferred date and time",
  "nameLabel": "Full Name",
  "phoneLabel": "Phone Number",
  "emailLabel": "Email Address",
  "remarkLabel": "Notes / Remarks",
  "showName": true,
  "showPhone": true,
  "showEmail": true,
  "showRemark": true,
  "nameRequired": true,
  "phoneRequired": true,
  "emailRequired": false,
  "remarkRequired": false,
  "defaultCountryCode": "MY",
  "serviceName": "Consultation",
  "servicePrice": 0,
  "currency": "MYR",
  "duration": 60,
  "slotDuration": 60,
  "startTime": "09:00",
  "endTime": "18:00",
  "availableDays": [1, 2, 3, 4, 5],
  "blockedDates": [],
  "submitButtonText": "Confirm Booking",
  "submitButtonColor": "#2563eb",
  "bgColor": "#ffffff",
  "google_sheets_enabled": false,
  "google_sheets_url": "",
  "requirePayment": false,
  "termsUrl": "#terms",
  "policyUrl": "#privacy"
}
```

**Available Days**: 0 = Sunday, 1 = Monday, ... 6 = Saturday

### whatsapp_button

```json
{
  "phoneNumber": "60123456789",
  "message": "Hi! I would like to inquire about...",
  "buttonText": "Chat on WhatsApp",
  "buttonColor": "#25D366",
  "buttonSize": "md",
  "position": "fixed",
  "fixedPosition": "bottom-right",
  "showIcon": true,
  "tooltipText": "Need help? Chat with us!",
  "showHeadline": false
}
```

### payment_button

```json
{
  "products": [
    {
      "id": "prod-1",
      "name": "Product Name",
      "description": "Product description",
      "price": 99,
      "image": "https://product-image.jpg",
      "featured": true
    }
  ],
  "currency": "MYR",
  "buttonText": "Buy Now",
  "buttonColor": "#2563eb",
  "buttonSize": "lg",
  "enableBumpOffer": false,
  "successMessage": "Thank you for your purchase!",
  "failureMessage": "Payment failed. Please try again.",
  "bgColor": "#ffffff"
}
```

### form_with_payment

```json
{
  "title": "Order Form",
  "description": "Complete the form to place your order",
  "products": [
    {
      "id": "prod-1",
      "name": "Product Name",
      "description": "Description",
      "price": 99
    }
  ],
  "currency": "MYR",
  "showName": true,
  "showEmail": true,
  "showPhone": true,
  "showAddress": false,
  "nameRequired": true,
  "emailRequired": true,
  "phoneRequired": true,
  "addressRequired": false,
  "submitButtonText": "Place Order",
  "submitButtonColor": "#2563eb",
  "bgColor": "#ffffff"
}
```

### product_carousel

Layouts: `carousel`, `grid`

```json
{
  "title": "Our Products",
  "subtitle": "Browse our collection",
  "products": [],
  "layout": "carousel",
  "columns": 3,
  "showPrice": true,
  "showDescription": true,
  "cardStyle": "shadow",
  "bgColor": "#ffffff",
  "textColor": "#111827",
  "priceColor": "#2563eb"
}
```

Note: Products are typically loaded dynamically from the products table.

### footer

```json
{
  "logo": "https://logo-url.png",
  "logoText": "BRAND NAME",
  "description": "Company description text",
  "columns": [
    {
      "title": "Column Title",
      "links": [
        { "label": "Link Label", "url": "#" }
      ]
    }
  ],
  "socialLinks": [
    { "platform": "facebook", "url": "https://facebook.com/page" },
    { "platform": "instagram", "url": "https://instagram.com/page" }
  ],
  "copyright": "© 2026 Company Name. All rights reserved.",
  "bgColor": "#0f172a",
  "textColor": "#e2e8f0"
}
```

---

## Publishing System

### How Publishing Works

1. When a user publishes a project, `lib/publishing/html-generator.ts` is called
2. The `generateFullHTML` function iterates through all elements
3. For each element, `generateBodyContent` is called with the element's type
4. The switch statement routes to the appropriate HTML generator

### HTML Generator Location

- Simple elements: Inline in `html-generator.ts`
- Complex elements: Separate files in `lib/publishing/`:
  - `pricing-generator.ts`
  - `payment-button-generator.ts`
  - `lead-form-generator.ts`
  - `whatsapp-button-generator.ts`
  - `form-with-payment-generator.ts`
  - `booking-form-generator.ts`
  - `product-carousel-generator.ts`

### Adding a New Element Type

1. **Add type to `types/index.ts`:**
   ```typescript
   export type ElementType =
     | 'existing_type'
     | 'new_element_type';  // Add here
   ```

2. **Create React component in `components/builder/elements/`**

3. **Export from `components/builder/elements/index.ts`**

4. **Add to `Canvas.tsx` switch statement:**
   ```typescript
   case 'new_element_type':
     elementContent = <NewElementComponent props={element.props as any} {...commonProps} />;
     break;
   ```

5. **Add HTML generator in `html-generator.ts`:**
   ```typescript
   case 'new_element_type':
     return generateNewElementHTML(element);
   ```

6. **Create generator function** (inline or separate file)

---

## Troubleshooting Checklist

### Element Not Rendering in Published Pages

1. **Check `types/index.ts`**
   - Is the element type in the `ElementType` union?

2. **Check `html-generator.ts`**
   - Is there a case for this element type in `generateBodyContent`?
   - Does the case return HTML (not empty string)?

3. **Check the HTML generator function**
   - Does it exist and export correctly?
   - Is it imported in `html-generator.ts`?

4. **Verify template migration**
   - Is the element `type` spelled exactly as in `ElementType`?
   - Is the element `order` set correctly?

### Common Mistakes

1. **Type mismatch**: Element type in template doesn't match `ElementType` enum
   - Wrong: `'booking-form'` (with hyphen)
   - Correct: `'booking_form'` (with underscore)

2. **Missing HTML generator case**: Element type exists but no case in switch statement

3. **Props structure mismatch**: Template props don't match expected structure

4. **Order gaps**: Element orders should be sequential (1, 2, 3...)

### Testing Templates

1. **In Builder**: Load template and verify all elements render
2. **In Preview**: Check preview mode renders correctly
3. **Published**: Publish the project and verify the live page
   - Check browser console for errors
   - Verify all interactive elements work (forms, buttons, etc.)

---

## Example: Complete Template Migration

Here's a complete example of a template migration file:

```sql
-- Migration: Add Example Template
-- Date: YYYY-MM-DD
-- Purpose: Create a template for [purpose]

INSERT INTO templates (
  id,
  name,
  slug,
  category,
  industry,
  description,
  thumbnail_url,
  preview_url,
  data,
  is_public,
  usage_count,
  tags
) VALUES (
  gen_random_uuid(),
  'Example Template',
  'example-template',
  'business',
  'General',
  'A professional template for...',
  'https://placehold.co/400x300/2563eb/ffffff?text=Example',
  'https://placehold.co/1200x800/2563eb/ffffff?text=Preview',
  jsonb_build_object(
    'elements', jsonb_build_array(
      -- 1. Announcement Bar
      jsonb_build_object(
        'id', 'elem-1',
        'type', 'announcement_bar',
        'order', 1,
        'props', jsonb_build_object(
          'message', 'Special Offer!',
          'bgColor', '#dc2626',
          'textColor', '#ffffff',
          'isSticky', true,
          'showCloseButton', true
        )
      ),
      -- 2. Navigation
      jsonb_build_object(
        'id', 'elem-2',
        'type', 'navigation',
        'order', 2,
        'props', jsonb_build_object(
          'logoText', 'BRAND',
          'menuItems', jsonb_build_array(
            jsonb_build_object('label', 'Home', 'url', '#'),
            jsonb_build_object('label', 'Features', 'url', '#features')
          ),
          'bgColor', '#0f172a',
          'textColor', '#ffffff',
          'isSticky', true
        )
      ),
      -- 3. Hero
      jsonb_build_object(
        'id', 'elem-3',
        'type', 'hero',
        'order', 3,
        'props', jsonb_build_object(
          'variant', 'centered',
          'headline', 'Welcome to Our Site',
          'subheadline', 'Discover what we offer',
          'ctaText', 'Get Started',
          'ctaUrl', '#cta',
          'bgColor', '#ffffff'
        )
      ),
      -- 4. Footer
      jsonb_build_object(
        'id', 'elem-4',
        'type', 'footer',
        'order', 4,
        'props', jsonb_build_object(
          'logoText', 'BRAND',
          'copyright', '© 2026 Brand. All rights reserved.',
          'bgColor', '#0f172a',
          'textColor', '#e2e8f0'
        )
      )
    ),
    'seo_settings', jsonb_build_object(
      'title', 'Example Template - Page Title',
      'description', 'Meta description for SEO',
      'ogType', 'website',
      'twitterCard', 'summary_large_image',
      'robotsIndex', true,
      'robotsFollow', true,
      'language', 'en'
    ),
    'theme', jsonb_build_object(
      'primaryColor', '#2563eb',
      'fontFamily', 'Inter'
    )
  ),
  true,
  0,
  ARRAY['example', 'business', 'general']
);
```

---

## Version History

| Date | Change |
|------|--------|
| 2026-01-20 | Added `booking_form` element support to HTML generator |
| 2026-01-20 | Initial guide creation |
