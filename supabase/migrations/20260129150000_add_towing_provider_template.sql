-- Towing Provider Template (Automotive)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, usage_count, tags, data
) VALUES (
  gen_random_uuid(),
  'Towing Provider',
  'towing-provider',
  'automotive',
  'Automotive',
  'Professional towing and roadside assistance landing page with service showcase, booking form, testimonials, and WhatsApp integration. Perfect for tow truck companies, roadside assistance providers, and vehicle recovery services.',
  'https://images.unsplash.com/photo-1562920618-5801e7e1ae1b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1562920618-5801e7e1ae1b?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "RescueTow - 24/7 Towing & Roadside Assistance",
      "description": "Fast and reliable towing service available 24/7. Flatbed towing, roadside assistance, accident recovery, and long-distance transport. Call us anytime!",
      "ogType": "website",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "en"
    },
    "theme": {
      "primaryColor": "#dc2626",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "🚨 24/7 Emergency Towing Available — Call Now for Immediate Assistance!",
          "bgColor": "#dc2626",
          "textColor": "#ffffff",
          "showCountdown": false,
          "isSticky": true,
          "showCloseButton": true,
          "link": "#booking",
          "linkText": "Request Tow"
        }
      },
      {
        "type": "navigation",
        "order": 1,
        "props": {
          "logo": "",
          "logoText": "RESCUETOW",
          "menuItems": [
            {"label": "Services", "url": "#services"},
            {"label": "Why Us", "url": "#why-us"},
            {"label": "Testimonials", "url": "#testimonials"},
            {"label": "Request Tow", "url": "#booking"}
          ],
          "ctaButton": {"text": "Request Tow", "url": "#booking"},
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
          "headline": "Stranded? We Will Be There.",
          "subheadline": "24/7 professional towing and roadside assistance. Fast response, safe transport, and affordable rates across Malaysia.",
          "ctaText": "Request Tow Now",
          "ctaUrl": "#booking",
          "image": "https://images.unsplash.com/photo-1562920618-5801e7e1ae1b?w=1920&h=1080&fit=crop",
          "bgColor": "#0f172a",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e2e8f0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#dc2626",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "type": "product_carousel",
        "order": 3,
        "props": {
          "title": "Our Services",
          "subtitle": "Complete towing and roadside assistance solutions — anytime, anywhere.",
          "products": [
            {
              "id": "svc-flatbed",
              "code": "TOW-001",
              "name": "Flatbed Towing",
              "description": "Safe and damage-free flatbed towing for all vehicle types including sedans, SUVs, and luxury cars. GPS-tracked for real-time updates.",
              "image_url": "https://images.unsplash.com/photo-1562920618-5801e7e1ae1b?w=600&h=400&fit=crop",
              "base_price": 150,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-accident",
              "code": "TOW-002",
              "name": "Accident Recovery",
              "description": "Emergency accident vehicle recovery with trained operators. We handle police reports coordination and insurance claims assistance.",
              "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
              "base_price": 250,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-roadside",
              "code": "TOW-003",
              "name": "Roadside Assistance",
              "description": "Battery jump-start, flat tyre change, fuel delivery, and lockout service. Quick response to get you back on the road.",
              "image_url": "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=400&fit=crop",
              "base_price": 80,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-longdistance",
              "code": "TOW-004",
              "name": "Long-Distance Transport",
              "description": "Interstate and long-distance vehicle transport across Malaysia. Secure flatbed transport with full insurance coverage.",
              "image_url": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
              "base_price": 500,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-motorcycle",
              "code": "TOW-005",
              "name": "Motorcycle Towing",
              "description": "Specialised motorcycle towing with dedicated bike cradles. Safe transport for all motorcycle types from scooters to superbikes.",
              "image_url": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=400&fit=crop",
              "base_price": 100,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-commercial",
              "code": "TOW-006",
              "name": "Commercial Vehicle Towing",
              "description": "Heavy-duty towing for vans, lorries, and commercial vehicles. Equipped with industrial winch and heavy-duty flatbed.",
              "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&h=400&fit=crop",
              "base_price": 350,
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
          "priceColor": "#dc2626"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose RescueTow?",
          "features": [
            {
              "icon": "clock",
              "title": "24/7 Availability",
              "description": "We operate round the clock, 365 days a year. Whether it is 2am or during a holiday, we are always ready to help.",
              "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop"
            },
            {
              "icon": "zap",
              "title": "Fast Response Time",
              "description": "Average arrival time of 30 minutes within city areas. GPS-tracked fleet ensures the nearest truck reaches you quickly.",
              "image": "https://images.unsplash.com/photo-1562920618-5801e7e1ae1b?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "Fully Insured",
              "description": "All our towing operations are fully insured. Your vehicle is protected from pickup to drop-off with comprehensive coverage.",
              "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"
            },
            {
              "icon": "dollar-sign",
              "title": "Transparent Pricing",
              "description": "No hidden charges or surprise fees. Get a clear quote before we dispatch. What we quote is what you pay.",
              "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
            },
            {
              "icon": "truck",
              "title": "Modern Fleet",
              "description": "Well-maintained fleet of flatbed trucks and recovery vehicles equipped with the latest towing technology.",
              "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop"
            },
            {
              "icon": "award",
              "title": "Trained Operators",
              "description": "All our operators are trained and certified in safe vehicle recovery. Professional handling guaranteed for every job.",
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
          "title": "Request Towing Service",
          "description": "Fill in your details and we will dispatch the nearest available truck. For emergencies, call us directly.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Pickup Location, Vehicle Type & Issue (e.g. Jalan Ampang, Honda Civic, Flat tyre)",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": true,
          "defaultCountryCode": "MY",
          "serviceName": "Towing Service Request",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 60,
          "slotDuration": 60,
          "startTime": "00:00",
          "endTime": "23:59",
          "availableDays": [0, 1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Request Tow Now",
          "submitButtonColor": "#dc2626",
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
            {"name": "Farid Azman", "role": "Accident Recovery Client", "quote": "Had an accident at 11pm and they arrived in 25 minutes. Very professional handling of my car. Even helped coordinate with the police. Truly a lifesaver!", "rating": 5},
            {"name": "Amanda Chong", "role": "Breakdown Assistance", "quote": "My car broke down on the highway during a road trip. Called RescueTow and they came so fast! Towed my car safely to the nearest workshop. Thank you!", "rating": 5},
            {"name": "Kamal Arif", "role": "Long-Distance Transport", "quote": "Used their long-distance service to transport my car from KL to Penang. Car arrived in perfect condition. Very reasonable pricing too.", "rating": 5},
            {"name": "Priya Nair", "role": "Roadside Assistance", "quote": "Battery died in a shopping mall parking lot. They came and jump-started my car within 20 minutes. Quick, efficient, and affordable!", "rating": 5},
            {"name": "David Lau", "role": "Flatbed Towing Client", "quote": "I only trust flatbed towing for my lowered car. RescueTow handled it perfectly. No scrapes, no damage. Will use again.", "rating": 5},
            {"name": "Nurul Huda", "role": "Motorcycle Towing", "quote": "My motorcycle broke down far from home. They have a special cradle for bikes which is great. Safe delivery and the driver was very careful.", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I need towing assistance. Please help!",
          "buttonText": "Chat on WhatsApp",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Need a tow? Chat with us!",
          "showHeadline": true,
          "headlineText": "Emergency? We are here 24/7!",
          "headlineColor": "#1f2937"
        }
      },
      {
        "type": "footer",
        "order": 8,
        "props": {
          "logo": "",
          "logoText": "RESCUETOW",
          "description": "Your trusted 24/7 towing and roadside assistance partner. Fast response, safe transport, and transparent pricing.",
          "columns": [
            {
              "title": "Our Services",
              "links": [
                {"label": "Flatbed Towing", "url": "#services"},
                {"label": "Accident Recovery", "url": "#services"},
                {"label": "Roadside Assistance", "url": "#services"},
                {"label": "Long-Distance Transport", "url": "#services"},
                {"label": "Motorcycle Towing", "url": "#services"},
                {"label": "Commercial Towing", "url": "#services"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Request Tow", "url": "#booking"},
                {"label": "Why Choose Us", "url": "#why-us"},
                {"label": "Testimonials", "url": "#testimonials"},
                {"label": "Contact Us", "url": "#contact"}
              ]
            },
            {
              "title": "Contact Info",
              "links": [
                {"label": "Emergency: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: help@rescuetow.my", "url": "mailto:help@rescuetow.my"},
                {"label": "Available 24/7", "url": "#"},
                {"label": "All of Malaysia", "url": "#"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com"},
            {"platform": "instagram", "url": "https://instagram.com"}
          ],
          "copyright": "© 2026 RescueTow. All rights reserved.",
          "bgColor": "#0f172a",
          "textColor": "#e2e8f0"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['towing', 'tow truck', 'roadside assistance', 'recovery', 'emergency', 'automotive', 'breakdown', 'transport']
);
