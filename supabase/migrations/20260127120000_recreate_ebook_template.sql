-- Migration: Recreate Ebook Sales Page Template
-- Date: 2026-01-27
-- Purpose: Recreate ebook template with product showcase (add to cart), form with payment, and full section layout

-- Delete existing ebook template
DELETE FROM templates WHERE slug = 'ebook-sales-page';

-- Insert updated ebook template
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
  'Ebook Sales Page',
  'ebook-sales-page',
  'digital-products',
  'Education',
  'A high-converting ebook sales page template perfect for authors, coaches, and digital product creators. Features product showcase with add to cart, order form with payment integration, testimonials, and WhatsApp support. Designed to maximize digital product sales.',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "Transform Your Life - Best-Selling Ebooks & Digital Guides",
      "description": "Discover our collection of best-selling ebooks and digital guides. Practical knowledge on business, productivity, finance, and personal growth. Instant digital delivery.",
      "ogType": "product",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "en"
    },
    "theme": {
      "primaryColor": "#7c3aed",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "LAUNCH SALE: 40% OFF All Ebooks - Use Code LAUNCH40 at Checkout!",
          "bgColor": "#7c3aed",
          "textColor": "#ffffff",
          "showCountdown": true,
          "countdownLabel": "Sale ends in:",
          "countdownEndDate": "2026-03-31T23:59:59",
          "isSticky": true,
          "showCloseButton": true,
          "link": "#products",
          "linkText": "Shop Now"
        }
      },
      {
        "type": "navigation",
        "order": 1,
        "props": {
          "logo": "",
          "logoText": "BOOKWISE",
          "menuItems": [
            {"label": "Ebooks", "url": "#products"},
            {"label": "Why Us", "url": "#why-us"},
            {"label": "Reviews", "url": "#testimonials"},
            {"label": "Order Now", "url": "#order"}
          ],
          "ctaButton": {"text": "Get Your Copy", "url": "#order"},
          "bgColor": "#ffffff",
          "textColor": "#1e293b",
          "isSticky": true,
          "layout": "split"
        }
      },
      {
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Unlock Your Full Potential",
          "subheadline": "Best-selling ebooks packed with actionable strategies for business, productivity, and personal growth. Join 10,000+ readers who transformed their lives.",
          "ctaText": "Browse Collection",
          "ctaUrl": "#products",
          "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop",
          "bgColor": "#1e1b4b",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e0e7ff",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#7c3aed",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "type": "product_carousel",
        "order": 3,
        "props": {
          "title": "Our Ebook Collection",
          "subtitle": "Practical guides written by industry experts. Instant PDF download after purchase.",
          "products": [
            {
              "id": "ebook-business",
              "code": "EBK-001",
              "name": "The Startup Blueprint",
              "description": "A step-by-step guide to launching your business from zero. Covers validation, funding, marketing, and scaling. 250+ pages of actionable advice.",
              "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop",
              "base_price": 49,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "ebook-productivity",
              "code": "EBK-002",
              "name": "Peak Productivity System",
              "description": "Master time management, eliminate distractions, and 10x your output. Includes templates, checklists, and daily planners.",
              "image_url": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop",
              "base_price": 39,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "ebook-finance",
              "code": "EBK-003",
              "name": "Financial Freedom Guide",
              "description": "Learn to budget, invest, and build wealth from scratch. Covers stocks, property, crypto, and passive income strategies for Malaysians.",
              "image_url": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
              "base_price": 59,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "ebook-marketing",
              "code": "EBK-004",
              "name": "Digital Marketing Mastery",
              "description": "Complete guide to social media marketing, SEO, email campaigns, and paid ads. Real case studies and proven frameworks.",
              "image_url": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop",
              "base_price": 45,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "ebook-mindset",
              "code": "EBK-005",
              "name": "Mindset Shift",
              "description": "Transform your thinking, overcome limiting beliefs, and develop an unstoppable growth mindset. Backed by psychology and neuroscience.",
              "image_url": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop",
              "base_price": 35,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "ebook-bundle",
              "code": "EBK-006",
              "name": "Complete Bundle (All 5 Books)",
              "description": "Get all 5 ebooks at a massive discount! Save over 50% compared to buying individually. The ultimate self-improvement library.",
              "image_url": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
              "base_price": 99,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "layout": "grid",
          "columns": 3,
          "showPrice": true,
          "showDescription": true,
          "cardStyle": "shadow",
          "showAddToCart": true,
          "addToCartButtonColor": "#7c3aed",
          "addToCartButtonText": "Add to Cart",
          "bgColor": "#faf5ff",
          "textColor": "#1e1b4b",
          "priceColor": "#7c3aed"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose BookWise?",
          "features": [
            {
              "icon": "zap",
              "title": "Instant Digital Delivery",
              "description": "Get your ebook immediately after purchase. Download as PDF and start reading in minutes on any device.",
              "image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop"
            },
            {
              "icon": "award",
              "title": "Expert Authors",
              "description": "Written by industry professionals and successful entrepreneurs with real-world experience and proven results.",
              "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
            },
            {
              "icon": "refresh-cw",
              "title": "Lifetime Updates",
              "description": "Every ebook purchase includes free lifetime updates. As we improve and expand content, you get the latest version.",
              "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "30-Day Money Back",
              "description": "Not satisfied? Get a full refund within 30 days, no questions asked. We stand behind the quality of our content.",
              "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
            },
            {
              "icon": "book-open",
              "title": "Actionable Content",
              "description": "No fluff or filler. Every chapter includes practical exercises, templates, and step-by-step action plans you can use immediately.",
              "image": "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&h=400&fit=crop"
            },
            {
              "icon": "users",
              "title": "Community Access",
              "description": "Join our exclusive reader community for discussions, accountability, and networking with like-minded individuals.",
              "image": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop"
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Order Your Ebooks Now",
          "description": "Fill in your details below to complete your purchase. Instant download link will be sent to your email.",
          "nameLabel": "Full Name",
          "mobileLabel": "Phone Number",
          "emailLabel": "Email Address",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {"id": "ebook-business", "name": "The Startup Blueprint", "description": "Complete startup guide - 250+ pages", "price": 49, "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop", "featured": false},
            {"id": "ebook-productivity", "name": "Peak Productivity System", "description": "Time management & productivity guide", "price": 39, "image": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&h=200&fit=crop", "featured": false},
            {"id": "ebook-finance", "name": "Financial Freedom Guide", "description": "Investing & wealth building for Malaysians", "price": 59, "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop", "featured": false},
            {"id": "ebook-marketing", "name": "Digital Marketing Mastery", "description": "Social media, SEO & paid ads guide", "price": 45, "image": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=200&h=200&fit=crop", "featured": false},
            {"id": "ebook-mindset", "name": "Mindset Shift", "description": "Growth mindset & personal development", "price": 35, "image": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200&h=200&fit=crop", "featured": false},
            {"id": "ebook-bundle", "name": "Complete Bundle (All 5 Books)", "description": "Save 50%+ - All ebooks included", "price": 99, "image": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop", "featured": true}
          ],
          "currency": "MYR",
          "submitButtonText": "Complete Purchase",
          "submitButtonColor": "#7c3aed",
          "bgColor": "#faf5ff",
          "termsUrl": "#terms",
          "policyUrl": "#privacy",
          "contactUrl": "#contact",
          "companyName": "BookWise Digital Sdn Bhd",
          "companyRegistration": "SSM: 202601012345"
        }
      },
      {
        "type": "testimonials",
        "order": 6,
        "props": {
          "variant": "grid",
          "title": "What Our Readers Say",
          "testimonials": [
            {"name": "Aiman Hakim", "role": "Entrepreneur", "quote": "The Startup Blueprint literally changed my business trajectory. I went from confused to launching my first product in 3 months. Worth every sen!", "rating": 5},
            {"name": "Jessica Ng", "role": "Marketing Manager", "quote": "Digital Marketing Mastery is hands down the best marketing ebook I have read. The frameworks are practical and I implemented them the same week.", "rating": 5},
            {"name": "Farah Nadia", "role": "Freelancer", "quote": "Peak Productivity System helped me manage my freelance work so much better. I am now earning more while working fewer hours. Incredible!", "rating": 5},
            {"name": "Daniel Lim", "role": "Fresh Graduate", "quote": "The Financial Freedom Guide opened my eyes to investing. At 25, I have already started building my portfolio thanks to this ebook.", "rating": 5},
            {"name": "Syafiq Rahman", "role": "Content Creator", "quote": "I bought the Complete Bundle and it was the best investment I made this year. Each book complements the others perfectly.", "rating": 5},
            {"name": "Mei Ling", "role": "HR Professional", "quote": "Mindset Shift is a game-changer. The exercises helped me overcome my impostor syndrome and finally go for that promotion. Got it!", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I am interested in your ebooks. Can I know more about the available titles?",
          "buttonText": "Ask Us Anything",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Have questions? Chat with us!",
          "showHeadline": true,
          "headlineText": "Need help choosing? We are here!",
          "headlineColor": "#1e293b"
        }
      },
      {
        "type": "footer",
        "order": 8,
        "props": {
          "logo": "",
          "logoText": "BOOKWISE",
          "description": "Empowering individuals with practical knowledge through high-quality digital books. Read, learn, and transform your life.",
          "columns": [
            {
              "title": "Our Ebooks",
              "links": [
                {"label": "The Startup Blueprint", "url": "#products"},
                {"label": "Peak Productivity System", "url": "#products"},
                {"label": "Financial Freedom Guide", "url": "#products"},
                {"label": "Digital Marketing Mastery", "url": "#products"},
                {"label": "Mindset Shift", "url": "#products"},
                {"label": "Complete Bundle", "url": "#products"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Order Now", "url": "#order"},
                {"label": "Reader Reviews", "url": "#testimonials"},
                {"label": "About the Authors", "url": "#why-us"},
                {"label": "FAQ", "url": "#faq"}
              ]
            },
            {
              "title": "Support",
              "links": [
                {"label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: hello@bookwise.my", "url": "mailto:hello@bookwise.my"},
                {"label": "Refund Policy", "url": "#refund"},
                {"label": "Terms & Conditions", "url": "#terms"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com/bookwisemy"},
            {"platform": "instagram", "url": "https://instagram.com/bookwisemy"},
            {"platform": "twitter", "url": "https://twitter.com/bookwisemy"}
          ],
          "copyright": "© 2026 BookWise Digital Sdn Bhd. All rights reserved.",
          "bgColor": "#1e1b4b",
          "textColor": "#e0e7ff"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['ebook', 'digital-product', 'book', 'education', 'course', 'download', 'pdf', 'sales-page']
);
