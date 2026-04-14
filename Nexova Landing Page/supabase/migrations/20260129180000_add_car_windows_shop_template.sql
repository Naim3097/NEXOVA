-- Car Windows Shop Template (Automotive)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, usage_count, tags, data
) VALUES (
  gen_random_uuid(),
  'Car Windows Shop',
  'car-windows-shop',
  'automotive',
  'Automotive',
  'Professional car window and tinting shop landing page with services showcase, booking form, testimonials, and WhatsApp integration. Perfect for windscreen replacement, window tinting, and auto glass specialists.',
  'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "ClearView Auto Glass - Windscreen & Window Tinting Specialist",
      "description": "Professional windscreen replacement, window tinting, and auto glass services. Premium tint films, certified technicians, and same-day service. Get a quote today!",
      "ogType": "website",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "en"
    },
    "theme": {
      "primaryColor": "#0891b2",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "🚗 FREE Windscreen Chip Repair with Any Tinting Package! Limited Time Offer",
          "bgColor": "#0891b2",
          "textColor": "#ffffff",
          "showCountdown": true,
          "countdownLabel": "Offer ends in:",
          "countdownEndDate": "2026-03-31T23:59:59",
          "isSticky": true,
          "showCloseButton": true,
          "link": "#booking",
          "linkText": "Book Now"
        }
      },
      {
        "type": "navigation",
        "order": 1,
        "props": {
          "logo": "",
          "logoText": "CLEARVIEW AUTO GLASS",
          "menuItems": [
            {"label": "Services", "url": "#services"},
            {"label": "Why Us", "url": "#why-us"},
            {"label": "Testimonials", "url": "#testimonials"},
            {"label": "Book Now", "url": "#booking"}
          ],
          "ctaButton": {"text": "Get a Quote", "url": "#booking"},
          "bgColor": "#0f172a",
          "textColor": "#ffffff",
          "isSticky": true,
          "layout": "split"
        }
      },
      {
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Crystal Clear. Expert Care.",
          "subheadline": "Professional windscreen replacement, premium window tinting, and auto glass repair. Certified technicians with same-day service for all vehicle types.",
          "ctaText": "Get a Free Quote",
          "ctaUrl": "#booking",
          "image": "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1920&h=1080&fit=crop",
          "bgColor": "#0f172a",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e2e8f0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#0891b2",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "type": "product_carousel",
        "order": 3,
        "props": {
          "title": "Our Services",
          "subtitle": "Complete auto glass and tinting solutions — from repair to full replacement and premium tinting.",
          "products": [
            {
              "id": "svc-windscreen",
              "code": "WIN-001",
              "name": "Windscreen Replacement",
              "description": "OEM and equivalent windscreen replacement for all vehicle types. Includes calibration for vehicles with ADAS sensors. Same-day service available.",
              "image_url": "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=400&fit=crop",
              "base_price": 350,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-tinting",
              "code": "WIN-002",
              "name": "Premium Window Tinting",
              "description": "High-quality solar control tint films from 3M, Llumar, and V-Kool. Up to 99% UV rejection, heat reduction, and glare control. JPJ compliant.",
              "image_url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
              "base_price": 500,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-chip-repair",
              "code": "WIN-003",
              "name": "Windscreen Chip Repair",
              "description": "Repair stone chips and small cracks before they spread. Quick 30-minute repair that restores structural integrity and saves costly replacement.",
              "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
              "base_price": 60,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-side-glass",
              "code": "WIN-004",
              "name": "Side & Rear Glass Replacement",
              "description": "Replacement of side windows, quarter glass, and rear windscreen. Tempered and laminated glass options available for all makes.",
              "image_url": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop",
              "base_price": 200,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-ceramic-coat",
              "code": "WIN-005",
              "name": "Ceramic Tint Film",
              "description": "Premium ceramic tint film for superior heat rejection without signal interference. Perfect for vehicles with toll transponders and GPS.",
              "image_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
              "base_price": 800,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-sunroof",
              "code": "WIN-006",
              "name": "Sunroof Glass & Tinting",
              "description": "Sunroof and moonroof glass replacement and tinting. Specialised service for panoramic sunroofs with proper sealing and alignment.",
              "image_url": "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=400&fit=crop",
              "base_price": 450,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "layout": "grid",
          "columns": 3,
          "showPrice": true,
          "showDescription": true,
          "cardStyle": "shadow",
          "showAddToCart": false,
          "bgColor": "#f8fafc",
          "textColor": "#0f172a",
          "priceColor": "#0891b2"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose ClearView?",
          "features": [
            {
              "icon": "award",
              "title": "Certified Installers",
              "description": "Our technicians are factory-trained and certified in windscreen installation and tint film application. Perfect finish guaranteed.",
              "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop"
            },
            {
              "icon": "check-circle",
              "title": "Premium Materials Only",
              "description": "We use only top-grade glass and branded tint films (3M, Llumar, V-Kool). No cheap knockoffs. Genuine products with warranty cards.",
              "image": "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "Warranty Coverage",
              "description": "Up to 5-year warranty on tint films and 1-year warranty on windscreen installation. Covers bubbling, peeling, and defects.",
              "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"
            },
            {
              "icon": "dollar-sign",
              "title": "Insurance Claims",
              "description": "We handle windscreen insurance claims for major insurers. Zero out-of-pocket cost for eligible claims. Hassle-free process.",
              "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
            },
            {
              "icon": "clock",
              "title": "Same-Day Service",
              "description": "Most tinting and windscreen replacements completed within 2-4 hours. Drive in the morning, drive out by afternoon.",
              "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop"
            },
            {
              "icon": "truck",
              "title": "Mobile Service Available",
              "description": "Can not come to us? We offer mobile windscreen replacement at your home or office. Same quality, more convenience.",
              "image": "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=400&fit=crop"
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "booking_form",
        "order": 5,
        "props": {
          "title": "Book Your Appointment",
          "description": "Schedule your windscreen replacement, tinting, or glass repair. We will have everything ready for your visit.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Vehicle Details & Service Needed (e.g. Honda Civic 2023, full car tinting with ceramic film)",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": true,
          "defaultCountryCode": "MY",
          "serviceName": "Auto Glass Appointment",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 60,
          "slotDuration": 60,
          "startTime": "09:00",
          "endTime": "18:00",
          "availableDays": [1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Confirm Booking",
          "submitButtonColor": "#0891b2",
          "bgColor": "#f8fafc",
          "google_sheets_enabled": false,
          "google_sheets_url": "",
          "requirePayment": false
        }
      },
      {
        "type": "testimonials",
        "order": 6,
        "props": {
          "variant": "grid",
          "title": "What Our Customers Say",
          "testimonials": [
            {"name": "Syazwan Ali", "role": "Honda Civic Owner", "quote": "Got full car ceramic tinting done. The heat rejection is amazing! My car is so much cooler now. The installation was flawless with no bubbles. Top quality!", "rating": 5},
            {"name": "Karen Tan", "role": "Toyota Camry Owner", "quote": "Windscreen cracked from a stone chip. ClearView replaced it same day and handled my insurance claim. Zero cost to me! Very professional service.", "rating": 5},
            {"name": "Arif Hakim", "role": "Proton X50 Owner", "quote": "The V-Kool tint on my X50 looks amazing. Clean installation, no visible edges, and my car is noticeably cooler. Worth every ringgit!", "rating": 5},
            {"name": "Lisa Ooi", "role": "BMW X1 Owner", "quote": "They calibrated my ADAS after the windscreen change — not all shops do this. Important for safety. ClearView really knows their stuff.", "rating": 5},
            {"name": "Hafiz Rahman", "role": "Perodua Ativa Owner", "quote": "Brought my car in for a small chip repair. They fixed it in 20 minutes and did not try to sell me a new windscreen. Honest and trustworthy!", "rating": 5},
            {"name": "Sanjay Kumar", "role": "Mercedes C-Class Owner", "quote": "Premium service for premium cars. They used genuine Mercedes glass and the fit is perfect. Also did ceramic tinting. My car looks and feels brand new!", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I would like to get a quote for windscreen/tinting service.",
          "buttonText": "Chat on WhatsApp",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Need a quote? Chat with us!",
          "showHeadline": true,
          "headlineText": "Questions? We are here to help!",
          "headlineColor": "#1f2937"
        }
      },
      {
        "type": "footer",
        "order": 8,
        "props": {
          "logo": "",
          "logoText": "CLEARVIEW AUTO GLASS",
          "description": "Your trusted auto glass and tinting specialist. Premium products, certified installers, and warranty on every job.",
          "columns": [
            {
              "title": "Our Services",
              "links": [
                {"label": "Windscreen Replacement", "url": "#services"},
                {"label": "Window Tinting", "url": "#services"},
                {"label": "Chip Repair", "url": "#services"},
                {"label": "Side & Rear Glass", "url": "#services"},
                {"label": "Ceramic Tint", "url": "#services"},
                {"label": "Sunroof Services", "url": "#services"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Get a Quote", "url": "#booking"},
                {"label": "Why Choose Us", "url": "#why-us"},
                {"label": "Testimonials", "url": "#testimonials"},
                {"label": "Contact Us", "url": "#contact"}
              ]
            },
            {
              "title": "Contact Info",
              "links": [
                {"label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: hello@clearviewglass.my", "url": "mailto:hello@clearviewglass.my"},
                {"label": "Mon - Sat: 9am - 6pm", "url": "#"},
                {"label": "Sunday: By Appointment", "url": "#"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com"},
            {"platform": "instagram", "url": "https://instagram.com"},
            {"platform": "tiktok", "url": "https://tiktok.com"}
          ],
          "copyright": "© 2026 ClearView Auto Glass. All rights reserved.",
          "bgColor": "#0f172a",
          "textColor": "#e2e8f0"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['windscreen', 'tinting', 'window tint', 'auto glass', 'car windows', 'ceramic tint', 'automotive', 'glass repair']
);
