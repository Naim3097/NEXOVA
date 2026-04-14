-- Candid Captures Template (Family Photography) - Variation 4
-- Theme: Warm Teal, Variants: hero=image_bg, features=list, testimonials=slider, pricing=cards
INSERT INTO templates (
  id, name, slug, category, industry, description, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Candid Captures',
  'candid-captures',
  'services',
  'Photography',
  'Heartwarming family photography that captures genuine moments. Perfect for family portraits, kids photography, and generational shoots.',
  true,
  ARRAY['family', 'photography', 'kids', 'children', 'portrait', 'outdoor', 'lifestyle'],
  '{
    "elements": [
      {
        "id": "candid-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Family Holiday Sessions Now Open - Create Memories That Last Forever!",
          "bgColor": "#0d9488",
          "textColor": "#ccfbf1",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Holiday slots filling fast:",
          "countdownEndDate": "2026-06-30T23:59:59"
        }
      },
      {
        "id": "candid-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "CANDID CAPTURES",
          "logo": "",
          "menuItems": [
            { "label": "Home", "url": "#hero-2" },
            { "label": "Sessions", "url": "#pricing-4" },
            { "label": "About", "url": "#features-5" },
            { "label": "Book", "url": "#form_with_payment-6" }
          ],
          "bgColor": "#f0fdfa",
          "textColor": "#0d9488",
          "isSticky": true,
          "layout": "center",
          "ctaButton": {
            "text": "Book Session",
            "url": "#form_with_payment-6"
          }
        }
      },
      {
        "id": "candid-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Capturing Your Family Story",
          "subheadline": "Authentic, joyful photography that celebrates your unique family. From playful kids to multi-generational portraits, we capture the love that binds you.",
          "ctaText": "View Sessions",
          "ctaUrl": "#pricing-4",
          "image": "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=1920&q=80",
          "bgColor": "#f0fdfa",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#ccfbf1",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 50,
          "buttonBgColor": "#0d9488",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "candid-pricing",
        "type": "pricing",
        "order": 4,
        "props": {
          "title": "Family Photography Sessions",
          "subtitle": "Choose the perfect session for your family",
          "layout": "cards",
          "enablePaymentIntegration": false,
          "plans": [
            {
              "name": "Mini Session",
              "price": "450",
              "currency": "RM",
              "period": "session",
              "description": "Perfect for small families or quick updates",
              "image": "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80",
              "features": [
                "30 Minutes",
                "1 Location",
                "15 Edited Photos",
                "Online Gallery",
                "Digital Downloads",
                "Print Credits (RM50)"
              ],
              "buttonText": "Book Mini",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            },
            {
              "name": "Classic Family",
              "price": "850",
              "currency": "RM",
              "period": "session",
              "description": "Our most popular family session",
              "image": "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80",
              "features": [
                "1 Hour Session",
                "2 Locations",
                "40 Edited Photos",
                "Outfit Change",
                "Online Gallery + USB",
                "Print Credits (RM100)",
                "Family Portrait Print (8x10)"
              ],
              "buttonText": "Book Classic",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": true
            },
            {
              "name": "Extended Family",
              "price": "1,500",
              "currency": "RM",
              "period": "session",
              "description": "Multi-generational and large family sessions",
              "image": "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=800&q=80",
              "features": [
                "2 Hours Session",
                "Multiple Locations",
                "80 Edited Photos",
                "All Family Combinations",
                "Canvas Print (16x20)",
                "Premium Photo Album",
                "Individual Family Groups",
                "Printed Thank You Cards"
              ],
              "buttonText": "Book Extended",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            }
          ]
        }
      },
      {
        "id": "candid-features",
        "type": "features",
        "order": 5,
        "props": {
          "title": "Why Families Love Us",
          "variant": "list",
          "features": [
            {
              "icon": "heart",
              "title": "Kid-Friendly Photographer",
              "description": "We specialize in working with children of all ages. Patient, playful, and great at capturing genuine smiles."
            },
            {
              "icon": "sun",
              "title": "Beautiful Outdoor Locations",
              "description": "We know all the best spots in the city for gorgeous family photos - parks, beaches, urban settings and more."
            },
            {
              "icon": "camera",
              "title": "Candid & Natural Style",
              "description": "No stiff posed photos here! We capture your family being yourselves - laughing, playing, and loving."
            },
            {
              "icon": "palette",
              "title": "Wardrobe Guidance",
              "description": "Free styling guide to help coordinate outfits. We want your family to look effortlessly put-together."
            },
            {
              "icon": "image",
              "title": "Timeless Editing",
              "description": "Classic, warm editing that will never go out of style. Your photos will look beautiful for generations."
            },
            {
              "icon": "gift",
              "title": "Heirloom Products",
              "description": "Beautiful albums, canvases, and prints to display in your home. These become treasured family heirlooms."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "candid-form-payment",
        "type": "form_with_payment",
        "order": 6,
        "props": {
          "title": "Book Your Family Session",
          "description": "Reserve your session with a deposit. Tell us about your family and we will plan the perfect shoot.",
          "submitButtonText": "Book & Pay Deposit",
          "submitButtonColor": "#0d9488",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "family-mini",
              "name": "Mini Session - Deposit",
              "description": "30 min, 15 photos, 1 location",
              "price": 150
            },
            {
              "id": "family-classic",
              "name": "Classic Family - Deposit",
              "description": "1 hr, 40 photos, 2 locations",
              "price": 250,
              "featured": true
            },
            {
              "id": "family-extended",
              "name": "Extended Family - Deposit",
              "description": "2 hrs, 80 photos, album included",
              "price": 400
            }
          ],
          "currency": "MYR",
          "bgColor": "#f0fdfa",
          "companyName": "Candid Captures Photography",
          "companyRegistration": ""
        }
      },
      {
        "id": "candid-testimonials",
        "type": "testimonials",
        "order": 7,
        "props": {
          "title": "Happy Families",
          "variant": "slider",
          "testimonials": [
            {
              "name": "The Wong Family",
              "role": "Family of 5",
              "quote": "Our kids are usually impossible to photograph but the photographer was amazing with them! The photos turned out better than we ever imagined. Absolutely love them!",
              "rating": 5
            },
            {
              "name": "The Lim Family",
              "role": "3 Generations",
              "quote": "We gathered our entire extended family for the first time in years. Candid Captures made everyone feel comfortable and captured so many beautiful moments.",
              "rating": 5
            },
            {
              "name": "The Ahmad Family",
              "role": "Parents + 2 Kids",
              "quote": "The classic session was perfect for us. We got so many wonderful shots at the beach. The kids had so much fun they forgot they were being photographed!",
              "rating": 5
            }
          ],
          "bgColor": "#f0fdfa"
        }
      },
      {
        "id": "candid-whatsapp",
        "type": "whatsapp_button",
        "order": 8,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I would like to book a family photography session. Can you share more details about your packages?",
          "buttonText": "Chat With Us",
          "buttonColor": "#25D366",
          "buttonSize": "md",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true
        }
      },
      {
        "id": "candid-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "Candid Captures",
          "description": "Capturing authentic family moments with love",
          "copyright": "2026 Candid Captures Photography. All rights reserved.",
          "bgColor": "#0d9488",
          "textColor": "#ccfbf1",
          "columns": [
            {
              "title": "Sessions",
              "links": [
                { "label": "Mini Session", "url": "#pricing-4" },
                { "label": "Classic Family", "url": "#pricing-4" },
                { "label": "Extended Family", "url": "#pricing-4" },
                { "label": "Book Now", "url": "#form_with_payment-6" }
              ]
            },
            {
              "title": "Connect",
              "links": [
                { "label": "About Us", "url": "#features-5" },
                { "label": "Portfolio", "url": "#" },
                { "label": "Reviews", "url": "#testimonials-7" },
                { "label": "Blog", "url": "#" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" },
            { "platform": "tiktok", "url": "https://tiktok.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Candid Captures - Family Photography That Tells Your Story",
      "description": "Authentic family photography capturing genuine moments of love and joy. Family portraits, kids photography, and multi-generational sessions.",
      "keywords": "family photography, kids photography, family portraits, outdoor photography, lifestyle photography, family photographer malaysia"
    },
    "theme": {
      "primaryColor": "#0d9488",
      "fontFamily": "Quicksand, sans-serif"
    }
  }'::jsonb
);
