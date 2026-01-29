-- Battery Shop Template (Automotive)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, usage_count, tags, data
) VALUES (
  gen_random_uuid(),
  'Battery Shop',
  'battery-shop',
  'automotive',
  'Automotive',
  'Professional car battery shop landing page with battery services showcase, booking form, testimonials, and WhatsApp integration. Perfect for battery retailers, auto electricians, and mobile battery replacement services.',
  'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "BatteryKing - Car Battery Specialist & Mobile Replacement",
      "description": "Car battery supply, testing, and mobile replacement service. Top brands at best prices with free installation. Available 24/7 for emergency battery rescue!",
      "ogType": "website",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "en"
    },
    "theme": {
      "primaryColor": "#eab308",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "⚡ FREE Battery Health Check + FREE Installation on All Purchases!",
          "bgColor": "#eab308",
          "textColor": "#1c1917",
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
          "logoText": "BATTERYKING",
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
          "headline": "Car Battery Dead? We Got You.",
          "subheadline": "Top brand car batteries at the best prices. Free testing, free installation, and 24/7 mobile replacement service anywhere in KL & Selangor.",
          "ctaText": "Get Battery Replaced Now",
          "ctaUrl": "#booking",
          "image": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=1920&h=1080&fit=crop",
          "bgColor": "#0f172a",
          "headlineColor": "#eab308",
          "subheadlineColor": "#e2e8f0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#eab308",
          "buttonTextColor": "#1c1917",
          "showCtaButton": true
        }
      },
      {
        "type": "product_carousel",
        "order": 3,
        "props": {
          "title": "Our Services",
          "subtitle": "Complete car battery solutions — from testing to replacement, we handle it all.",
          "products": [
            {
              "id": "svc-battery-replace",
              "code": "BAT-001",
              "name": "Battery Supply & Installation",
              "description": "Wide range of car batteries from top brands (Amaron, Varta, Century, Bosch). Free installation and old battery disposal included.",
              "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&h=400&fit=crop",
              "base_price": 180,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-mobile-replace",
              "code": "BAT-002",
              "name": "Mobile Battery Replacement",
              "description": "Battery died and you are stuck? We come to your location and replace your battery on the spot. Available 24/7 across KL & Selangor.",
              "image_url": "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=400&fit=crop",
              "base_price": 220,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-battery-test",
              "code": "BAT-003",
              "name": "Battery Health Check",
              "description": "Comprehensive battery load testing and health diagnostics. Know your battery condition before it fails. Free with any service.",
              "image_url": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
              "base_price": 0,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-jumpstart",
              "code": "BAT-004",
              "name": "Jump-Start Service",
              "description": "Emergency jump-start service to get you going. Our technician will also test your battery and alternator to find the root cause.",
              "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
              "base_price": 50,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-alternator",
              "code": "BAT-005",
              "name": "Alternator & Starter Repair",
              "description": "Alternator testing, repair, and replacement. Starter motor diagnosis and repair. Comprehensive electrical system check included.",
              "image_url": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=400&fit=crop",
              "base_price": 250,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-hybrid-battery",
              "code": "BAT-006",
              "name": "Hybrid & AGM Batteries",
              "description": "Specialised batteries for hybrid vehicles, start-stop systems, and luxury cars. AGM and EFB battery supply and fitting available.",
              "image_url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
              "base_price": 400,
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
          "priceColor": "#eab308"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose BatteryKing?",
          "features": [
            {
              "icon": "zap",
              "title": "24/7 Emergency Service",
              "description": "Battery died at 3am? No problem. Our mobile service operates round the clock to rescue you wherever you are.",
              "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop"
            },
            {
              "icon": "truck",
              "title": "We Come to You",
              "description": "Mobile battery replacement at your home, office, or roadside. No need to tow your car — we bring the battery to you.",
              "image": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&h=400&fit=crop"
            },
            {
              "icon": "dollar-sign",
              "title": "Best Price Guarantee",
              "description": "We offer the most competitive battery prices in the market. Price match guarantee — find it cheaper elsewhere, we will beat it.",
              "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "Up to 36-Month Warranty",
              "description": "All batteries come with manufacturer warranty of up to 36 months. Free replacement within warranty period.",
              "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"
            },
            {
              "icon": "check-circle",
              "title": "Free Installation",
              "description": "Every battery purchase includes free professional installation and old battery disposal. No hidden charges.",
              "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop"
            },
            {
              "icon": "award",
              "title": "Genuine Products Only",
              "description": "We only sell original, genuine batteries from authorised distributors. No refurbished or counterfeit products.",
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
          "title": "Book Battery Service",
          "description": "Schedule your battery replacement or check-up. For emergencies, call or WhatsApp us directly.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Vehicle Details & Issue (e.g. Toyota Vios 2021, battery dead, need mobile replacement)",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": true,
          "defaultCountryCode": "MY",
          "serviceName": "Battery Service",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 30,
          "slotDuration": 30,
          "startTime": "08:00",
          "endTime": "20:00",
          "availableDays": [0, 1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Book Now",
          "submitButtonColor": "#eab308",
          "submitButtonTextColor": "#1c1917",
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
            {"name": "Azlan Ismail", "role": "Honda City Owner", "quote": "Battery died in the basement parking at 10pm. Called BatteryKing and they arrived in 25 minutes! New battery installed on the spot. Excellent service!", "rating": 5},
            {"name": "Grace Lee", "role": "Toyota Camry Owner", "quote": "Best battery prices in town. Checked 5 shops before coming here and BatteryKing was the cheapest with genuine Amaron battery. Free installation too!", "rating": 5},
            {"name": "Mohd Faisal", "role": "Proton Saga Owner", "quote": "The free battery check saved me from being stranded. They found my battery was weak and replaced it before it died completely. Great preventive service!", "rating": 5},
            {"name": "Siew Ling", "role": "Perodua Myvi Owner", "quote": "Used their mobile service at my office parking. The technician was professional and quick. New battery installed in 15 minutes. Highly recommend!", "rating": 5},
            {"name": "Ravi Shankar", "role": "BMW 5 Series Owner", "quote": "Hard to find AGM battery for my BMW elsewhere. BatteryKing had it in stock and fitted it perfectly. Warranty card provided. Very trustworthy.", "rating": 5},
            {"name": "Nurul Izzah", "role": "Mazda 2 Owner", "quote": "3am emergency and they still came! The operator was friendly and professional. Charged a fair price with no midnight surcharge. Will recommend to everyone.", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I need a car battery replacement. Can you help?",
          "buttonText": "Chat on WhatsApp",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Battery issue? Chat with us!",
          "showHeadline": true,
          "headlineText": "Battery dead? We can help!",
          "headlineColor": "#1f2937"
        }
      },
      {
        "type": "footer",
        "order": 8,
        "props": {
          "logo": "",
          "logoText": "BATTERYKING",
          "description": "Your trusted car battery specialist. Top brands, best prices, and 24/7 mobile replacement service.",
          "columns": [
            {
              "title": "Our Services",
              "links": [
                {"label": "Battery Supply & Install", "url": "#services"},
                {"label": "Mobile Replacement", "url": "#services"},
                {"label": "Free Battery Check", "url": "#services"},
                {"label": "Jump-Start Service", "url": "#services"},
                {"label": "Alternator Repair", "url": "#services"},
                {"label": "Hybrid Batteries", "url": "#services"}
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
                {"label": "Emergency: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: hello@batteryking.my", "url": "mailto:hello@batteryking.my"},
                {"label": "Shop: Mon - Sun 8am - 8pm", "url": "#"},
                {"label": "Mobile: Available 24/7", "url": "#"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com"},
            {"platform": "instagram", "url": "https://instagram.com"}
          ],
          "copyright": "© 2026 BatteryKing. All rights reserved.",
          "bgColor": "#0f172a",
          "textColor": "#e2e8f0"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['battery', 'car battery', 'mobile battery', 'jump start', 'alternator', 'automotive', 'emergency', 'replacement']
);
