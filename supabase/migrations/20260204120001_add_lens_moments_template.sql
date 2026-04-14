-- Lens & Moments Template (Event Photography) - Variation 1
-- Theme: Deep Purple, Variants: hero=image_left, features=list, testimonials=slider, pricing=cards
INSERT INTO templates (
  id, name, slug, category, industry, description, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Lens & Moments',
  'lens-moments',
  'services',
  'Photography',
  'Professional event photography service page for corporate events, parties, and celebrations. Features packages, portfolio showcase, and booking form.',
  true,
  ARRAY['event', 'photography', 'services', 'packages', 'booking', 'corporate', 'party'],
  '{
    "elements": [
      {
        "id": "lens-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Now Booking for 2026 Events - Early Bird Discount 15% Off!",
          "bgColor": "#581c87",
          "textColor": "#f3e8ff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Early bird ends:",
          "countdownEndDate": "2026-03-31T23:59:59"
        }
      },
      {
        "id": "lens-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "LENS & MOMENTS",
          "logo": "",
          "menuItems": [
            { "label": "Home", "url": "#hero-2" },
            { "label": "Packages", "url": "#pricing-4" },
            { "label": "Why Us", "url": "#features-5" },
            { "label": "Book Now", "url": "#form_with_payment-6" }
          ],
          "bgColor": "#faf5ff",
          "textColor": "#581c87",
          "isSticky": true,
          "layout": "center",
          "ctaButton": {
            "text": "Get Quote",
            "url": "#form_with_payment-6"
          }
        }
      },
      {
        "id": "lens-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_left",
          "headline": "Capturing Every Moment That Matters",
          "subheadline": "Professional event photography for corporate functions, gala dinners, product launches, and celebrations. We turn your events into lasting memories.",
          "ctaText": "View Packages",
          "ctaUrl": "#pricing-4",
          "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80",
          "bgColor": "#faf5ff",
          "headlineColor": "#581c87",
          "subheadlineColor": "#7c3aed",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 100,
          "buttonBgColor": "#581c87",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "lens-pricing",
        "type": "pricing",
        "order": 4,
        "props": {
          "title": "Event Photography Packages",
          "subtitle": "Professional coverage for events of all sizes",
          "layout": "cards",
          "enablePaymentIntegration": false,
          "plans": [
            {
              "name": "Half Day",
              "price": "1,500",
              "currency": "RM",
              "period": "event",
              "description": "Perfect for short events and small gatherings",
              "image": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
              "features": [
                "4 Hours Coverage",
                "1 Photographer",
                "150+ Edited Photos",
                "Online Gallery",
                "Digital Downloads",
                "Quick Turnaround (7 days)"
              ],
              "buttonText": "Choose Half Day",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            },
            {
              "name": "Full Day",
              "price": "2,800",
              "currency": "RM",
              "period": "event",
              "description": "Complete coverage for full-day corporate events",
              "image": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
              "features": [
                "8 Hours Coverage",
                "2 Photographers",
                "300+ Edited Photos",
                "Online Gallery + USB",
                "Same-Day Preview (20 photos)",
                "Event Highlights Slideshow",
                "Social Media Ready Images"
              ],
              "buttonText": "Choose Full Day",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": true
            },
            {
              "name": "Premium",
              "price": "5,000",
              "currency": "RM",
              "period": "event",
              "description": "Multi-day events and VIP functions",
              "image": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
              "features": [
                "Up to 2 Days Coverage",
                "3 Photographers",
                "500+ Edited Photos",
                "Event Videography (3-5 min)",
                "Drone Aerial Shots",
                "Express Delivery (3 days)",
                "Dedicated Project Manager",
                "Printed Photo Book"
              ],
              "buttonText": "Choose Premium",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            }
          ]
        }
      },
      {
        "id": "lens-features",
        "type": "features",
        "order": 5,
        "props": {
          "title": "Why Choose Lens & Moments",
          "variant": "list",
          "features": [
            {
              "icon": "camera",
              "title": "Professional Equipment",
              "description": "State-of-the-art cameras, lenses, and lighting equipment to capture stunning images in any environment."
            },
            {
              "icon": "users",
              "title": "Experienced Team",
              "description": "Over 200 corporate events photographed. We understand business etiquette and event flow."
            },
            {
              "icon": "zap",
              "title": "Fast Turnaround",
              "description": "Get your edited photos within 3-7 days. Same-day previews available for urgent needs."
            },
            {
              "icon": "shield",
              "title": "Insured & Professional",
              "description": "Fully insured with professional liability coverage. We sign NDAs for confidential events."
            },
            {
              "icon": "image",
              "title": "Variety of Shots",
              "description": "From candid moments to formal group photos, stage coverage to networking shots - we capture it all."
            },
            {
              "icon": "award",
              "title": "Award-Winning Quality",
              "description": "Recipient of Best Event Photography 2024 & 2025. Your event deserves the best."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "lens-form-payment",
        "type": "form_with_payment",
        "order": 6,
        "props": {
          "title": "Book Your Event Photography",
          "description": "Secure your date with a booking deposit. Tell us about your event and we will get back to you.",
          "submitButtonText": "Book & Pay Deposit",
          "submitButtonColor": "#581c87",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "event-halfday",
              "name": "Half Day Package - Deposit",
              "description": "4 Hours, 1 Photographer, 150+ Photos",
              "price": 300
            },
            {
              "id": "event-fullday",
              "name": "Full Day Package - Deposit",
              "description": "8 Hours, 2 Photographers, 300+ Photos",
              "price": 500,
              "featured": true
            },
            {
              "id": "event-premium",
              "name": "Premium Package - Deposit",
              "description": "2 Days, 3 Photographers, Video, Drone",
              "price": 1000
            }
          ],
          "currency": "MYR",
          "bgColor": "#faf5ff",
          "companyName": "Lens & Moments Photography",
          "companyRegistration": ""
        }
      },
      {
        "id": "lens-testimonials",
        "type": "testimonials",
        "order": 7,
        "props": {
          "title": "What Our Clients Say",
          "variant": "slider",
          "testimonials": [
            {
              "name": "Maybank Corporate",
              "role": "Annual Gala Dinner 2025",
              "quote": "Lens & Moments delivered exceptional coverage of our 500-pax gala dinner. The team was professional and the photos were delivered within 5 days. Highly recommended!",
              "rating": 5
            },
            {
              "name": "TechStart Malaysia",
              "role": "Product Launch Event",
              "quote": "They captured every detail of our product launch perfectly. The same-day preview helped us share on social media immediately. Great work!",
              "rating": 5
            },
            {
              "name": "Hilton KL",
              "role": "Wedding Exhibition 2025",
              "quote": "We hired them for our 3-day exhibition. Professional, punctual, and the quality of photos was outstanding. Will definitely work with them again.",
              "rating": 5
            }
          ],
          "bgColor": "#faf5ff"
        }
      },
      {
        "id": "lens-whatsapp",
        "type": "whatsapp_button",
        "order": 8,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I am interested in your event photography services. I would like to get a quote for my upcoming event.",
          "buttonText": "WhatsApp Us",
          "buttonColor": "#25D366",
          "buttonSize": "md",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true
        }
      },
      {
        "id": "lens-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "Lens & Moments",
          "description": "Professional event photography that captures every moment",
          "copyright": "2026 Lens & Moments Photography. All rights reserved.",
          "bgColor": "#581c87",
          "textColor": "#f3e8ff",
          "columns": [
            {
              "title": "Quick Links",
              "links": [
                { "label": "Packages", "url": "#pricing-4" },
                { "label": "Why Choose Us", "url": "#features-5" },
                { "label": "Book Now", "url": "#form_with_payment-6" },
                { "label": "Reviews", "url": "#testimonials-7" }
              ]
            },
            {
              "title": "Services",
              "links": [
                { "label": "Corporate Events", "url": "#" },
                { "label": "Gala Dinners", "url": "#" },
                { "label": "Product Launches", "url": "#" },
                { "label": "Conferences", "url": "#" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" },
            { "platform": "linkedin", "url": "https://linkedin.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Lens & Moments - Professional Event Photography",
      "description": "Capture your corporate events, gala dinners, and celebrations with our professional photography services. Fast turnaround and stunning quality.",
      "keywords": "event photography, corporate photography, gala dinner, product launch, conference photography, event photographer malaysia"
    },
    "theme": {
      "primaryColor": "#581c87",
      "fontFamily": "Inter"
    }
  }'::jsonb
);
