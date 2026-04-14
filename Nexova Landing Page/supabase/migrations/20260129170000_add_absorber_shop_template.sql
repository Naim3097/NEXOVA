-- Absorber Shop Template (Automotive)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, usage_count, tags, data
) VALUES (
  gen_random_uuid(),
  'Absorber Shop',
  'absorber-shop',
  'automotive',
  'Automotive',
  'Professional shock absorber and suspension shop landing page with services showcase, booking form, testimonials, and WhatsApp integration. Perfect for absorber specialists, suspension shops, and automotive workshops.',
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "AbsorberPro - Suspension & Absorber Specialist",
      "description": "Expert shock absorber and suspension services. OEM and performance absorbers, spring replacement, and ride height adjustment. Restore your ride comfort today!",
      "ogType": "website",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "en"
    },
    "theme": {
      "primaryColor": "#2563eb",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "🔧 FREE Suspension Check + 10% OFF All Absorber Replacements This Month!",
          "bgColor": "#2563eb",
          "textColor": "#ffffff",
          "showCountdown": true,
          "countdownLabel": "Promo ends in:",
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
          "logoText": "ABSORBERPRO",
          "menuItems": [
            {"label": "Services", "url": "#services"},
            {"label": "Why Us", "url": "#why-us"},
            {"label": "Testimonials", "url": "#testimonials"},
            {"label": "Book Now", "url": "#booking"}
          ],
          "ctaButton": {"text": "Book Service", "url": "#booking"},
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
          "headline": "Ride Like New Again.",
          "subheadline": "Expert shock absorber and suspension services to restore your vehicle comfort and handling. OEM and performance parts available for all makes and models.",
          "ctaText": "Book Suspension Check",
          "ctaUrl": "#booking",
          "image": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&h=1080&fit=crop",
          "bgColor": "#0f172a",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e2e8f0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#2563eb",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "type": "product_carousel",
        "order": 3,
        "props": {
          "title": "Our Services",
          "subtitle": "Complete suspension and absorber solutions — from inspection to performance upgrades.",
          "products": [
            {
              "id": "svc-absorber-replace",
              "code": "ABS-001",
              "name": "Absorber Replacement",
              "description": "Front and rear shock absorber replacement using OEM or equivalent parts. Includes mounting hardware and professional installation.",
              "image_url": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
              "base_price": 350,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-spring-replace",
              "code": "ABS-002",
              "name": "Spring Replacement",
              "description": "Coil spring and leaf spring replacement for sagging or broken springs. Restores ride height and load-bearing capacity to factory specifications.",
              "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
              "base_price": 280,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-suspension-check",
              "code": "ABS-003",
              "name": "Suspension Inspection",
              "description": "Comprehensive suspension health check covering absorbers, springs, bushings, ball joints, and mounting points. Detailed report provided.",
              "image_url": "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=400&fit=crop",
              "base_price": 0,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-bushing",
              "code": "ABS-004",
              "name": "Bushing & Link Replacement",
              "description": "Worn bushings and stabiliser links cause rattling and poor handling. We replace with polyurethane or OEM bushings for a tight, quiet ride.",
              "image_url": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=400&fit=crop",
              "base_price": 150,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-performance",
              "code": "ABS-005",
              "name": "Performance Upgrade",
              "description": "Upgrade to performance absorbers and lowering springs from brands like Bilstein, KYB, and KW. Improved handling without sacrificing comfort.",
              "image_url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
              "base_price": 800,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-alignment",
              "code": "ABS-006",
              "name": "Post-Service Alignment",
              "description": "Wheel alignment after absorber or spring replacement is essential. Computerised 4-wheel alignment ensures proper tyre wear and straight tracking.",
              "image_url": "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&h=400&fit=crop",
              "base_price": 80,
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
          "priceColor": "#2563eb"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose AbsorberPro?",
          "features": [
            {
              "icon": "award",
              "title": "Suspension Specialist",
              "description": "We focus exclusively on suspension and absorber work. This specialisation means better expertise, faster service, and superior results.",
              "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop"
            },
            {
              "icon": "check-circle",
              "title": "OEM & Performance Parts",
              "description": "We stock genuine OEM absorbers and premium aftermarket brands like Bilstein, KYB, Monroe, and Sachs. The right part for every vehicle.",
              "image": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "12-Month Warranty",
              "description": "All absorber and spring replacements come with a 12-month warranty on parts and labour. Drive with confidence.",
              "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"
            },
            {
              "icon": "dollar-sign",
              "title": "Honest Pricing",
              "description": "Transparent quotes with no hidden charges. We explain the issue clearly and only replace what is actually needed.",
              "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
            },
            {
              "icon": "clock",
              "title": "Same-Day Service",
              "description": "Most absorber replacements completed within 2-3 hours. Book in the morning, drive home by afternoon with a refreshed ride.",
              "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop"
            },
            {
              "icon": "gift",
              "title": "Free Suspension Check",
              "description": "Complimentary visual suspension inspection with every visit. We check absorbers, springs, bushings, and more at no charge.",
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
          "title": "Book Your Suspension Service",
          "description": "Schedule your absorber replacement or suspension check. We will have the right parts ready for your appointment.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Vehicle Details & Issue (e.g. Proton X50 2023, bouncy ride, front absorber leaking)",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": true,
          "defaultCountryCode": "MY",
          "serviceName": "Suspension Service Appointment",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 60,
          "slotDuration": 60,
          "startTime": "09:00",
          "endTime": "18:00",
          "availableDays": [1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Confirm Booking",
          "submitButtonColor": "#2563eb",
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
            {"name": "Hakim Roslan", "role": "Proton X70 Owner", "quote": "My X70 was bouncing badly over bumps. AbsorberPro replaced all four absorbers and it feels like a brand new car! Smooth and stable. Great work!", "rating": 5},
            {"name": "Christine Yap", "role": "Honda Jazz Owner", "quote": "My car was making clunking sounds over speed bumps. They identified worn bushings and links, replaced them quickly. No more noise! Very knowledgeable team.", "rating": 5},
            {"name": "Zul Fikri", "role": "Perodua Bezza Owner", "quote": "Got the KYB absorbers installed here. The ride comfort improved dramatically. Fair price and the work was done in just 2 hours. Highly recommend!", "rating": 5},
            {"name": "Mei Ling", "role": "Toyota Vios Owner", "quote": "Went to AbsorberPro for a free check and they honestly told me my absorbers still had life. No unnecessary upselling. Will come back when it is time.", "rating": 5},
            {"name": "Imran Shah", "role": "BMW E90 Owner", "quote": "Upgraded to Bilstein B4 absorbers for my E90. The handling improvement is incredible. These guys know their suspension. True specialists!", "rating": 5},
            {"name": "Kavitha Devi", "role": "Mazda CX-5 Owner", "quote": "Spring snapped and they had the replacement in stock. Fixed within the same day and included a wheel alignment. Complete service from start to finish.", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I would like to inquire about absorber replacement for my car.",
          "buttonText": "Chat on WhatsApp",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Suspension issues? Chat with us!",
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
          "logoText": "ABSORBERPRO",
          "description": "Your trusted suspension and absorber specialist. OEM parts, expert installation, and ride comfort guaranteed.",
          "columns": [
            {
              "title": "Our Services",
              "links": [
                {"label": "Absorber Replacement", "url": "#services"},
                {"label": "Spring Replacement", "url": "#services"},
                {"label": "Suspension Check", "url": "#services"},
                {"label": "Bushing & Links", "url": "#services"},
                {"label": "Performance Upgrade", "url": "#services"},
                {"label": "Wheel Alignment", "url": "#services"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Book Service", "url": "#booking"},
                {"label": "Why Choose Us", "url": "#why-us"},
                {"label": "Testimonials", "url": "#testimonials"},
                {"label": "Contact Us", "url": "#contact"}
              ]
            },
            {
              "title": "Contact Info",
              "links": [
                {"label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: hello@absorberpro.my", "url": "mailto:hello@absorberpro.my"},
                {"label": "Mon - Sat: 9am - 6pm", "url": "#"},
                {"label": "Sunday: Closed", "url": "#"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com"},
            {"platform": "instagram", "url": "https://instagram.com"}
          ],
          "copyright": "© 2026 AbsorberPro. All rights reserved.",
          "bgColor": "#0f172a",
          "textColor": "#e2e8f0"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['absorber', 'shock absorber', 'suspension', 'spring', 'automotive', 'ride comfort', 'handling', 'KYB']
);
