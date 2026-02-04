-- Golden Hour Studios Template (Portrait Photography) - Variation 2
-- Theme: Golden/Amber, Variants: hero=image_bg, features=alternating, testimonials=masonry, pricing=cards
INSERT INTO templates (
  id, name, slug, category, industry, description, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Golden Hour Studios',
  'golden-hour-studios',
  'services',
  'Photography',
  'Professional portrait photography studio for personal branding, headshots, and creative portraits. Warm and inviting aesthetic.',
  true,
  ARRAY['portrait', 'photography', 'headshots', 'personal branding', 'studio', 'professional'],
  '{
    "elements": [
      {
        "id": "golden-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Spring Special - Free Hair & Makeup Touch-up With Every Portrait Session!",
          "bgColor": "#b45309",
          "textColor": "#fef3c7",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Offer ends:",
          "countdownEndDate": "2026-04-30T23:59:59"
        }
      },
      {
        "id": "golden-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "GOLDEN HOUR STUDIOS",
          "logo": "",
          "menuItems": [
            { "label": "Home", "url": "#hero-2" },
            { "label": "Sessions", "url": "#pricing-4" },
            { "label": "About", "url": "#features-5" },
            { "label": "Book", "url": "#form_with_payment-6" }
          ],
          "bgColor": "#fffbeb",
          "textColor": "#b45309",
          "isSticky": true,
          "layout": "split",
          "ctaButton": {
            "text": "Book Session",
            "url": "#form_with_payment-6"
          }
        }
      },
      {
        "id": "golden-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Your Story, Beautifully Told",
          "subheadline": "Professional portrait photography that captures your authentic self. From personal branding to creative portraits, we bring out the best in you.",
          "ctaText": "Explore Sessions",
          "ctaUrl": "#pricing-4",
          "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80",
          "bgColor": "#fffbeb",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#fef3c7",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 55,
          "buttonBgColor": "#b45309",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "golden-pricing",
        "type": "pricing",
        "order": 4,
        "props": {
          "title": "Portrait Sessions",
          "subtitle": "Choose the perfect session for your needs",
          "layout": "cards",
          "enablePaymentIntegration": false,
          "plans": [
            {
              "name": "Mini Session",
              "price": "350",
              "currency": "RM",
              "period": "session",
              "description": "Quick refresh for your social profiles",
              "image": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
              "features": [
                "30 Minutes Session",
                "1 Outfit / 1 Look",
                "10 Edited Photos",
                "Online Gallery",
                "Digital Downloads",
                "1 Week Delivery"
              ],
              "buttonText": "Book Mini",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            },
            {
              "name": "Signature",
              "price": "750",
              "currency": "RM",
              "period": "session",
              "description": "Complete personal branding experience",
              "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
              "features": [
                "1.5 Hours Session",
                "3 Outfits / Looks",
                "30 Edited Photos",
                "Hair & Makeup Touch-up",
                "Indoor + Outdoor Shots",
                "Print-Ready Files",
                "5 Days Delivery"
              ],
              "buttonText": "Book Signature",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": true
            },
            {
              "name": "Editorial",
              "price": "1,500",
              "currency": "RM",
              "period": "session",
              "description": "Magazine-style creative portraits",
              "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
              "features": [
                "3 Hours Session",
                "5 Outfits / Looks",
                "50 Edited Photos",
                "Professional Hair & Makeup",
                "Multiple Locations",
                "Creative Direction",
                "Behind-the-Scenes Video",
                "3 Days Delivery"
              ],
              "buttonText": "Book Editorial",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            }
          ]
        }
      },
      {
        "id": "golden-features",
        "type": "features",
        "order": 5,
        "props": {
          "title": "The Golden Hour Experience",
          "variant": "alternating",
          "features": [
            {
              "icon": "sun",
              "title": "Natural Light Specialists",
              "description": "Our studio is designed to harness beautiful natural light. We also shoot during golden hour for that magical warm glow."
            },
            {
              "icon": "palette",
              "title": "Curated Wardrobe",
              "description": "Access our studio wardrobe with elegant pieces you can borrow. Perfect if you need outfit options."
            },
            {
              "icon": "sparkles",
              "title": "Professional Styling",
              "description": "Hair and makeup services included in Signature and Editorial packages. Look your absolute best."
            },
            {
              "icon": "heart",
              "title": "Confidence Coaching",
              "description": "Not comfortable in front of the camera? We guide you through poses and expressions naturally."
            },
            {
              "icon": "image",
              "title": "Artistic Editing",
              "description": "Each photo is carefully edited with our signature warm, timeless aesthetic. No over-filtered looks."
            },
            {
              "icon": "gift",
              "title": "Print Products Available",
              "description": "Order beautiful prints, canvases, and photo books. Perfect for gifts or decorating your space."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "golden-form-payment",
        "type": "form_with_payment",
        "order": 6,
        "props": {
          "title": "Book Your Portrait Session",
          "description": "Reserve your spot with a session deposit. We will contact you to discuss your vision and schedule.",
          "submitButtonText": "Book & Pay Deposit",
          "submitButtonColor": "#b45309",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "portrait-mini",
              "name": "Mini Session - Deposit",
              "description": "30 min, 1 look, 10 photos",
              "price": 100
            },
            {
              "id": "portrait-signature",
              "name": "Signature Session - Deposit",
              "description": "1.5 hrs, 3 looks, 30 photos, H&MU",
              "price": 200,
              "featured": true
            },
            {
              "id": "portrait-editorial",
              "name": "Editorial Session - Deposit",
              "description": "3 hrs, 5 looks, 50 photos, Full styling",
              "price": 400
            }
          ],
          "currency": "MYR",
          "bgColor": "#fffbeb",
          "companyName": "Golden Hour Studios",
          "companyRegistration": ""
        }
      },
      {
        "id": "golden-testimonials",
        "type": "testimonials",
        "order": 7,
        "props": {
          "title": "Client Love",
          "variant": "masonry",
          "testimonials": [
            {
              "name": "Amanda Lee",
              "role": "Entrepreneur",
              "quote": "The Signature session was exactly what I needed for my personal brand. The photos are stunning and really capture my personality. Highly recommend!",
              "rating": 5
            },
            {
              "name": "Dr. Farah Ahmad",
              "role": "Medical Professional",
              "quote": "Needed new headshots for my clinic website. The team made me feel so comfortable and the results exceeded my expectations. Very professional!",
              "rating": 5
            },
            {
              "name": "Ryan Tan",
              "role": "Actor/Model",
              "quote": "The Editorial session was incredible! The creative direction and attention to detail made for an amazing portfolio update. Will definitely be back.",
              "rating": 5
            },
            {
              "name": "Sarah Yusof",
              "role": "Content Creator",
              "quote": "Love my new profile photos! The golden hour outdoor shots are absolutely dreamy. The styling advice was so helpful too.",
              "rating": 5
            }
          ],
          "bgColor": "#fffbeb"
        }
      },
      {
        "id": "golden-whatsapp",
        "type": "whatsapp_button",
        "order": 8,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I am interested in booking a portrait session at Golden Hour Studios. Can you share more details?",
          "buttonText": "Chat With Us",
          "buttonColor": "#25D366",
          "buttonSize": "md",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true
        }
      },
      {
        "id": "golden-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "Golden Hour Studios",
          "description": "Where every portrait tells your unique story",
          "copyright": "2026 Golden Hour Studios. All rights reserved.",
          "bgColor": "#b45309",
          "textColor": "#fef3c7",
          "columns": [
            {
              "title": "Sessions",
              "links": [
                { "label": "Mini Session", "url": "#pricing-4" },
                { "label": "Signature Session", "url": "#pricing-4" },
                { "label": "Editorial Session", "url": "#pricing-4" },
                { "label": "Book Now", "url": "#form_with_payment-6" }
              ]
            },
            {
              "title": "Contact",
              "links": [
                { "label": "Our Studio", "url": "#" },
                { "label": "FAQ", "url": "#" },
                { "label": "Portfolio", "url": "#" },
                { "label": "Reviews", "url": "#testimonials-7" }
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
      "title": "Golden Hour Studios - Professional Portrait Photography",
      "description": "Capture your authentic self with our professional portrait photography. Personal branding, headshots, and creative portraits in beautiful natural light.",
      "keywords": "portrait photography, headshots, personal branding, professional photos, studio photography, golden hour photographer"
    },
    "theme": {
      "primaryColor": "#b45309",
      "fontFamily": "Playfair Display, serif"
    }
  }'::jsonb
);
