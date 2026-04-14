-- Classic Barber Template
-- Theme: Dark with gold accents, Playfair Display typography
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Classic Barber',
  'classic-barber',
  'barber',
  'Grooming',
  'Premium barbershop template with dark luxurious aesthetic. Features services showcase, about section, team, gallery, client reviews, booking form, and contact info.',
  'https://images.unsplash.com/photo-1585747860019-8005b2f74e92?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1585747860019-8005b2f74e92?w=1200&h=800&fit=crop',
  true,
  ARRAY['barber', 'barbershop', 'grooming', 'haircut', 'men', 'salon', 'luxury'],
  '{
    "elements": [
      {
        "type": "navigation",
        "order": 0,
        "props": {
          "logoText": "",
          "logoIcon": "<svg viewBox=\"0 0 40 40\" fill=\"#c8a97e\"><circle cx=\"20\" cy=\"20\" r=\"18\" fill=\"none\" stroke=\"#c8a97e\" stroke-width=\"1.5\"/><text x=\"20\" y=\"26\" text-anchor=\"middle\" font-size=\"16\" font-family=\"serif\" fill=\"#c8a97e\">GB</text></svg>",
          "bgColor": "#0a0a0a",
          "textColor": "#c8a97e",
          "linkColor": "#999",
          "isSticky": true,
          "menuItems": [
            { "label": "Services", "url": "#services" },
            { "label": "Team", "url": "#team" },
            { "label": "Gallery", "url": "#gallery" },
            { "label": "Reviews", "url": "#reviews" },
            { "label": "Contact", "url": "#contact" }
          ]
        }
      },
      {
        "type": "hero",
        "order": 1,
        "props": {
          "textAlign": "left",
          "slides": [
            {
              "headline": "CRAFT.CUT.\nCONFIDENCE",
              "headlineFontSize": "clamp(2.8rem, 6vw, 4.5rem)",
              "subheadline": "THE ART OF MEN''S STYLE IN THE HEART OF THE CITY.",
              "ctaText": "BOOK APPOINTMENT",
              "ctaUrl": "#contact",
              "secondaryCtaText": "VIEW SERVICES",
              "secondaryCtaUrl": "#services",
              "bgImage": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=80",
              "headlineColor": "#ffffff",
              "subheadlineColor": "#aaa",
              "buttonBgColor": "transparent",
              "buttonTextColor": "#fff"
            },
            {
              "headline": "LEARN THE\nCRAFT",
              "headlineFontSize": "clamp(2.8rem, 6vw, 4.5rem)",
              "subheadline": "JOIN OUR BARBER ACADEMY. MASTER THE ART OF CUTTING, STYLING & GROOMING FROM INDUSTRY PROS.",
              "ctaText": "ENROLL NOW",
              "ctaUrl": "#contact",
              "secondaryCtaText": "VIEW PROGRAM",
              "secondaryCtaUrl": "#services",
              "bgImage": "https://images.unsplash.com/photo-1621605815971-fbc98d665571?w=1400&q=80",
              "headlineColor": "#ffffff",
              "subheadlineColor": "#aaa",
              "buttonBgColor": "#c8a97e",
              "buttonTextColor": "#0a0a0a"
            },
            {
              "headline": "PREMIUM\nHAIR WAX",
              "headlineFontSize": "clamp(2.8rem, 6vw, 4.5rem)",
              "subheadline": "STRONG HOLD. MATTE FINISH. HANDCRAFTED WITH NATURAL INGREDIENTS FOR THE PERFECT STYLE ALL DAY.",
              "ctaText": "SHOP NOW",
              "ctaUrl": "#contact",
              "secondaryCtaText": "LEARN MORE",
              "secondaryCtaUrl": "#about",
              "bgImage": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1400&q=80",
              "headlineColor": "#ffffff",
              "subheadlineColor": "#aaa",
              "buttonBgColor": "transparent",
              "buttonTextColor": "#fff"
            }
          ]
        }
      },
      {
        "type": "services-pricing",
        "order": 2,
        "props": {
          "title": "OUR SERVICES",
          "subtitle": "MEN''S GROOMING ESSENTIALS",
          "bgColor": "#111111",
          "services": [
            { "icon": "Scissors", "title": "MEN''S HAIRCUT", "description": "Classic and modern cuts for your style and face shape.", "price": "$45" },
            { "icon": "Sparkles", "title": "HOT TOWEL SHAVE", "description": "Smooth shave, includes warm lather & essential oils treatment.", "price": "$35" },
            { "icon": "Scissors", "title": "THE COMBO", "description": "A classic craft haircut and a smooth shave package deal.", "price": "$70" }
          ]
        }
      },
      {
        "type": "about",
        "order": 3,
        "props": {
          "title": "ABOUT US",
          "subtitle": "MORE THAN JUST A HAIRCUT",
          "bgColor": "#111111",
          "text": "We created this space for more than just grooming. It is a place where men can slow down, kick back, and enjoy — just the right music, expert craftsmanship, and the atmosphere of a classic gentleman''s club. We respect your time and style. You come in to exhale, and walk out feeling recharged and confident.",
          "image": "https://images.unsplash.com/photo-1621605815971-fbc98d665571?w=600&q=80",
          "stats": [
            { "value": "+2500", "label": "CLIENTS" },
            { "value": "3 YEARS", "label": "OF EXPERIENCE" },
            { "value": "45 MIN", "label": "HAIRCUT TIME" }
          ]
        }
      },
      {
        "type": "team",
        "order": 4,
        "props": {
          "title": "MEET THE TEAM",
          "subtitle": "YOUR STYLE IN GOOD HANDS",
          "bgColor": "#1a1a1a",
          "members": [
            { "name": "Erik Nielsen", "role": "MASTER BARBER", "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" },
            { "name": "Thomas Hayes", "role": "COLORIST", "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
            { "name": "Marco Rossi", "role": "JUNIOR", "image": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80" }
          ],
          "ctaText": "BOOK AN APPOINTMENT",
          "ctaUrl": "#contact"
        }
      },
      {
        "type": "gallery",
        "order": 5,
        "props": {
          "title": "OUR WORK",
          "subtitle": "EXAMPLES OF IMPECCABLE STYLE",
          "bgColor": "#111111",
          "images": [
            { "alt": "Classic Fade", "url": "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80" },
            { "alt": "Beard Trim", "url": "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&q=80" },
            { "alt": "Hot Towel Shave", "url": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&q=80" },
            { "alt": "Textured Crop", "url": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&q=80" },
            { "alt": "Pompadour Style", "url": "https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=500&q=80" },
            { "alt": "Straight Razor", "url": "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&q=80" }
          ],
          "ctaText": "BOOK ONLINE",
          "ctaUrl": "#contact"
        }
      },
      {
        "type": "testimonials",
        "order": 6,
        "props": {
          "variant": "grid",
          "title": "CLIENT REVIEWS",
          "subtitle": "WHAT OUR GUESTS SAY",
          "bgColor": "#1a1a1a",
          "testimonials": [
            { "name": "Lukas Weber", "role": "", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", "quote": "True professionals. Extremely satisfied with the result. The attention to detail is amazing.", "rating": 5 },
            { "name": "Oliver Smith", "role": "", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80", "quote": "Such a cool vibe, great drinks, and excellent service. Definitely coming back.", "rating": 5 },
            { "name": "Matteo Ricci", "role": "", "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80", "quote": "Sharp, fast, and high quality. Hands down the best barbershop in the city.", "rating": 5 }
          ]
        }
      },
      {
        "type": "contact",
        "order": 7,
        "props": {
          "title": "CONTACTS",
          "formTitle": "BOOK AN APPOINTMENT",
          "bgColor": "#111111",
          "contactItems": [
            { "icon": "MapPin", "text": "24 OXFORD STREET, LONDON, UK" },
            { "icon": "Clock", "text": "MON-SUN: 10AM – 10PM" },
            { "icon": "Smartphone", "text": "+44 20 7123 4567" }
          ],
          "services": ["Men''s Haircut", "Hot Towel Shave", "The Combo", "Beard Trim", "Kids Haircut"],
          "buttonText": "BOOK NOW"
        }
      },
      {
        "type": "footer",
        "order": 8,
        "props": {
          "bgColor": "#0a0a0a",
          "textColor": "#888",
          "copyright": "© The Grizzly Barbers",
          "socials": [
            { "platform": "instagram", "url": "#" },
            { "platform": "tiktok", "url": "#" },
            { "platform": "facebook", "url": "#" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "The Grizzly Barbers — Craft.Cut.Confidence",
      "description": "Premium barbershop offering classic haircuts, hot towel shaves, and the complete gentleman grooming experience in the heart of the city."
    },
    "theme": {
      "primaryColor": "#c8a97e",
      "fontFamily": "Satoshi"
    }
  }'
);
