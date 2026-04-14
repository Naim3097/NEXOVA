-- Timeless Imagery Template (Maternity/Newborn Photography) - Variation 5
-- Theme: Soft Rose, Variants: hero=image_left, features=alternating, testimonials=masonry, pricing=cards
INSERT INTO templates (
  id, name, slug, category, industry, description, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Timeless Imagery',
  'timeless-imagery',
  'services',
  'Photography',
  'Delicate maternity and newborn photography capturing the miracle of new life. Soft, dreamy aesthetic for expecting mothers and precious newborns.',
  true,
  ARRAY['maternity', 'newborn', 'photography', 'baby', 'pregnancy', 'studio', 'portrait'],
  '{
    "elements": [
      {
        "id": "timeless-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Capture These Precious Moments - Book Your Maternity or Newborn Session Today!",
          "bgColor": "#be185d",
          "textColor": "#fce7f3",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": false
        }
      },
      {
        "id": "timeless-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "TIMELESS IMAGERY",
          "logo": "",
          "menuItems": [
            { "label": "Home", "url": "#hero-2" },
            { "label": "Sessions", "url": "#pricing-4" },
            { "label": "Experience", "url": "#features-5" },
            { "label": "Book", "url": "#form_with_payment-6" }
          ],
          "bgColor": "#fdf2f8",
          "textColor": "#be185d",
          "isSticky": true,
          "layout": "split",
          "ctaButton": {
            "text": "Book Now",
            "url": "#form_with_payment-6"
          }
        }
      },
      {
        "id": "timeless-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_left",
          "headline": "Celebrating New Beginnings",
          "subheadline": "Exquisite maternity and newborn photography that captures the magic of new life. Every tiny detail, every loving glance, preserved forever in timeless images.",
          "ctaText": "View Sessions",
          "ctaUrl": "#pricing-4",
          "image": "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=1920&q=80",
          "bgColor": "#fdf2f8",
          "headlineColor": "#be185d",
          "subheadlineColor": "#db2777",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 100,
          "buttonBgColor": "#be185d",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "timeless-pricing",
        "type": "pricing",
        "order": 4,
        "props": {
          "title": "Photography Sessions",
          "subtitle": "Capture these fleeting moments with our specialized sessions",
          "layout": "cards",
          "enablePaymentIntegration": false,
          "plans": [
            {
              "name": "Maternity",
              "price": "650",
              "currency": "RM",
              "period": "session",
              "description": "Celebrate your beautiful pregnancy journey",
              "image": "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=800&q=80",
              "features": [
                "1 Hour Session",
                "Studio or Outdoor",
                "2 Outfit Changes",
                "Partner Included",
                "25 Edited Photos",
                "Online Gallery",
                "Print Credits (RM80)"
              ],
              "buttonText": "Book Maternity",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            },
            {
              "name": "Newborn",
              "price": "950",
              "currency": "RM",
              "period": "session",
              "description": "Capture your tiny miracle in the first weeks",
              "image": "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
              "features": [
                "2-3 Hours Session",
                "In-Studio with Props",
                "Multiple Setups & Poses",
                "Parent & Sibling Shots",
                "35 Edited Photos",
                "Online Gallery + USB",
                "Print Credits (RM100)",
                "Best within 14 days"
              ],
              "buttonText": "Book Newborn",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": true
            },
            {
              "name": "Bump to Baby",
              "price": "1,400",
              "currency": "RM",
              "period": "package",
              "description": "Complete journey from pregnancy to newborn",
              "image": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80",
              "features": [
                "Maternity Session",
                "Newborn Session",
                "50 Edited Photos Total",
                "Premium Photo Album",
                "Canvas Print (16x20)",
                "Priority Booking",
                "10% Savings",
                "Milestone Session Add-on Available"
              ],
              "buttonText": "Book Package",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            }
          ]
        }
      },
      {
        "id": "timeless-features",
        "type": "features",
        "order": 5,
        "props": {
          "title": "The Timeless Experience",
          "variant": "alternating",
          "features": [
            {
              "icon": "baby",
              "title": "Newborn Safety Certified",
              "description": "Your baby safety is our top priority. Our photographers are trained in safe newborn posing and handling techniques."
            },
            {
              "icon": "sparkles",
              "title": "Dreamy Studio Setting",
              "description": "Climate-controlled studio with soft lighting, beautiful props, and a calming atmosphere for comfortable sessions."
            },
            {
              "icon": "heart",
              "title": "Patient & Gentle",
              "description": "We work at baby pace. Expect feeding breaks, soothing time, and plenty of patience for the perfect shot."
            },
            {
              "icon": "palette",
              "title": "Curated Prop Collection",
              "description": "Extensive collection of wraps, headbands, outfits, and props. Choose your style - natural, whimsical, or classic."
            },
            {
              "icon": "image",
              "title": "Artistic Retouching",
              "description": "Gentle editing that enhances natural beauty. Baby skin is perfected while keeping a natural, timeless look."
            },
            {
              "icon": "gift",
              "title": "Heirloom Products",
              "description": "Premium albums, fine art prints, and keepsake boxes. These become treasured family heirlooms for generations."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "timeless-form-payment",
        "type": "form_with_payment",
        "order": 6,
        "props": {
          "title": "Book Your Session",
          "description": "Reserve your session with a deposit. For newborns, we recommend booking during pregnancy to secure your date.",
          "submitButtonText": "Book & Pay Deposit",
          "submitButtonColor": "#be185d",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "maternity-session",
              "name": "Maternity Session - Deposit",
              "description": "1 hr, 25 photos, studio/outdoor",
              "price": 200
            },
            {
              "id": "newborn-session",
              "name": "Newborn Session - Deposit",
              "description": "2-3 hrs, 35 photos, full styling",
              "price": 300,
              "featured": true
            },
            {
              "id": "bump-to-baby",
              "name": "Bump to Baby Package - Deposit",
              "description": "Maternity + Newborn + Album",
              "price": 400
            }
          ],
          "currency": "MYR",
          "bgColor": "#fdf2f8",
          "companyName": "Timeless Imagery Photography",
          "companyRegistration": ""
        }
      },
      {
        "id": "timeless-testimonials",
        "type": "testimonials",
        "order": 7,
        "props": {
          "title": "From Our Happy Parents",
          "variant": "masonry",
          "testimonials": [
            {
              "name": "Jessica & Mark",
              "role": "Parents to Baby Aria",
              "quote": "The newborn session was magical. Our baby was just 10 days old and the photographer was so gentle and patient. The photos are absolutely stunning!",
              "rating": 5
            },
            {
              "name": "Nurin Aisyah",
              "role": "First-time Mom",
              "quote": "I was nervous about my maternity shoot but they made me feel beautiful and comfortable. The photos captured my pregnancy glow perfectly.",
              "rating": 5
            },
            {
              "name": "Emily Chen",
              "role": "Mom of 2",
              "quote": "We did the Bump to Baby package and it was worth every penny. Watching the album showing my pregnancy and then our newborn is so special.",
              "rating": 5
            },
            {
              "name": "Priya Sharma",
              "role": "Parents to Baby Arjun",
              "quote": "The prop collection is amazing! They had the perfect setup for our baby. The tiny poses are incredible. Will treasure these forever.",
              "rating": 5
            }
          ],
          "bgColor": "#fdf2f8"
        }
      },
      {
        "id": "timeless-whatsapp",
        "type": "whatsapp_button",
        "order": 8,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I am interested in booking a maternity/newborn photography session. Can you share more details about availability?",
          "buttonText": "WhatsApp Us",
          "buttonColor": "#25D366",
          "buttonSize": "md",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true
        }
      },
      {
        "id": "timeless-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "Timeless Imagery",
          "description": "Capturing the miracle of new life, beautifully",
          "copyright": "2026 Timeless Imagery Photography. All rights reserved.",
          "bgColor": "#be185d",
          "textColor": "#fce7f3",
          "columns": [
            {
              "title": "Sessions",
              "links": [
                { "label": "Maternity", "url": "#pricing-4" },
                { "label": "Newborn", "url": "#pricing-4" },
                { "label": "Bump to Baby", "url": "#pricing-4" },
                { "label": "Book Now", "url": "#form_with_payment-6" }
              ]
            },
            {
              "title": "Info",
              "links": [
                { "label": "When to Book", "url": "#" },
                { "label": "What to Expect", "url": "#features-5" },
                { "label": "Portfolio", "url": "#" },
                { "label": "Reviews", "url": "#testimonials-7" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" },
            { "platform": "pinterest", "url": "https://pinterest.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Timeless Imagery - Maternity & Newborn Photography",
      "description": "Exquisite maternity and newborn photography capturing the magic of new life. Safe, gentle sessions for expecting mothers and precious newborns.",
      "keywords": "newborn photography, maternity photography, baby photography, pregnancy photos, newborn photographer malaysia, bump to baby"
    },
    "theme": {
      "primaryColor": "#be185d",
      "fontFamily": "Cormorant Garamond, serif"
    }
  }'::jsonb
);
