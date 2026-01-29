-- Tyre Shop Template (Automotive)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, usage_count, tags, data
) VALUES (
  gen_random_uuid(),
  'Tyre Shop',
  'tyre-shop',
  'automotive',
  'Automotive',
  'Professional tyre shop landing page with tyre services showcase, booking form, testimonials, and WhatsApp integration. Perfect for tyre shops, tyre dealers, and wheel alignment centres.',
  'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "TyrePro Centre - Premium Tyres & Expert Fitting",
      "description": "Quality tyres from top brands at competitive prices. Professional tyre fitting, wheel alignment, balancing, and rotation. Book your appointment today!",
      "ogType": "website",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "en"
    },
    "theme": {
      "primaryColor": "#ea580c",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "🔥 BUY 3 FREE 1 on Selected Tyres! Limited Time Offer",
          "bgColor": "#ea580c",
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
          "logoText": "TYREPRO CENTRE",
          "menuItems": [
            {"label": "Services", "url": "#services"},
            {"label": "Why Us", "url": "#why-us"},
            {"label": "Testimonials", "url": "#testimonials"},
            {"label": "Book Now", "url": "#booking"}
          ],
          "ctaButton": {"text": "Book Appointment", "url": "#booking"},
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
          "headline": "Premium Tyres. Expert Fitting.",
          "subheadline": "Quality tyres from top brands at competitive prices. Professional fitting, wheel alignment, and balancing by certified technicians.",
          "ctaText": "Book Your Fitting Now",
          "ctaUrl": "#booking",
          "image": "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=1920&h=1080&fit=crop",
          "bgColor": "#0f172a",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e2e8f0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#ea580c",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "type": "product_carousel",
        "order": 3,
        "props": {
          "title": "Our Services",
          "subtitle": "Complete tyre care solutions — from new tyre supply to alignment and balancing.",
          "products": [
            {
              "id": "svc-tyre-supply",
              "code": "TYR-001",
              "name": "Tyre Supply & Fitting",
              "description": "Wide range of tyres from top brands including Michelin, Continental, Bridgestone, and Yokohama. Professional fitting with computerised balancing included.",
              "image_url": "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&h=400&fit=crop",
              "base_price": 250,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-alignment",
              "code": "TYR-002",
              "name": "Wheel Alignment",
              "description": "Precision 4-wheel computerised alignment to ensure even tyre wear, better fuel efficiency, and improved handling. Suitable for all vehicle types.",
              "image_url": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
              "base_price": 80,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-balancing",
              "code": "TYR-003",
              "name": "Tyre Balancing & Rotation",
              "description": "Computerised wheel balancing and tyre rotation service to maximise tyre lifespan and ensure a smooth, vibration-free ride.",
              "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
              "base_price": 50,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-puncture",
              "code": "TYR-004",
              "name": "Puncture Repair",
              "description": "Fast and reliable puncture repair using industry-standard plug and patch methods. Emergency roadside puncture assistance also available.",
              "image_url": "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=400&fit=crop",
              "base_price": 30,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-nitrogen",
              "code": "TYR-005",
              "name": "Nitrogen Filling",
              "description": "Nitrogen tyre inflation for better pressure retention, improved fuel efficiency, and longer tyre life. Recommended for all vehicle types.",
              "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&h=400&fit=crop",
              "base_price": 20,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-sport-tyre",
              "code": "TYR-006",
              "name": "Performance & Sport Tyres",
              "description": "High-performance tyres for sports cars and enthusiasts. Premium brands with superior grip, handling, and durability for spirited driving.",
              "image_url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
              "base_price": 500,
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
          "priceColor": "#ea580c"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose TyrePro Centre?",
          "features": [
            {
              "icon": "award",
              "title": "Authorised Dealer",
              "description": "Authorised dealer for top tyre brands. Every tyre comes with full manufacturer warranty and authenticity guarantee.",
              "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop"
            },
            {
              "icon": "dollar-sign",
              "title": "Best Price Guarantee",
              "description": "We match any competitor price on the same tyre. Get the best deal without compromising on quality or service.",
              "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
            },
            {
              "icon": "check-circle",
              "title": "Certified Technicians",
              "description": "Our fitters are factory-trained and certified. Your vehicle is in safe hands with precise fitting and alignment.",
              "image": "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "Free Tyre Inspection",
              "description": "Complimentary tyre health check including tread depth, pressure, and sidewall condition. No appointment needed.",
              "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"
            },
            {
              "icon": "clock",
              "title": "Express Service",
              "description": "Most tyre changes completed within 30 minutes. No long waits — get back on the road quickly and safely.",
              "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop"
            },
            {
              "icon": "truck",
              "title": "Mobile Service Available",
              "description": "Can not come to us? We come to you! Mobile tyre fitting and emergency roadside tyre service available.",
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
          "title": "Book Your Tyre Service",
          "description": "Schedule your tyre fitting or service appointment online. Choose your preferred date and time.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Vehicle Details & Tyre Size (e.g. Honda City 2022, 185/55R16)",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": true,
          "defaultCountryCode": "MY",
          "serviceName": "Tyre Service Appointment",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 45,
          "slotDuration": 45,
          "startTime": "09:00",
          "endTime": "18:00",
          "availableDays": [1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Confirm Booking",
          "submitButtonColor": "#ea580c",
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
            {"name": "Hafiz Ibrahim", "role": "Proton X50 Owner", "quote": "Great selection of tyres and the fitting was done in 20 minutes! Price was cheaper than the dealer. Will definitely come back.", "rating": 5},
            {"name": "Jason Ng", "role": "Honda Civic Owner", "quote": "Had my alignment done here and the difference is night and day. Car drives straight as an arrow now. Very professional team.", "rating": 5},
            {"name": "Siti Aminah", "role": "Perodua Ativa Owner", "quote": "They helped me choose the right tyre for my budget. No pushy upselling, just honest advice. The new tyres are fantastic!", "rating": 5},
            {"name": "Raj Kumar", "role": "Toyota Hilux Owner", "quote": "Got a puncture on the highway and called their mobile service. They came within 30 minutes and fixed it on the spot. Lifesaver!", "rating": 5},
            {"name": "Aiman Zafri", "role": "BMW 320i Owner", "quote": "Best tyre shop in the area. They stock performance tyres that other shops do not carry. Fitting was precise and balanced perfectly.", "rating": 5},
            {"name": "Linda Tan", "role": "Mazda 3 Owner", "quote": "Fair pricing, fast service, and friendly staff. The nitrogen filling keeps my tyre pressure stable much longer. Highly recommend!", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I would like to inquire about tyre prices and book an appointment.",
          "buttonText": "Chat on WhatsApp",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Need help? Chat with us!",
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
          "logoText": "TYREPRO CENTRE",
          "description": "Your trusted tyre specialist. Quality tyres, expert fitting, and competitive prices since 2015.",
          "columns": [
            {
              "title": "Our Services",
              "links": [
                {"label": "Tyre Supply & Fitting", "url": "#services"},
                {"label": "Wheel Alignment", "url": "#services"},
                {"label": "Tyre Balancing", "url": "#services"},
                {"label": "Puncture Repair", "url": "#services"},
                {"label": "Nitrogen Filling", "url": "#services"},
                {"label": "Performance Tyres", "url": "#services"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Book Appointment", "url": "#booking"},
                {"label": "Why Choose Us", "url": "#why-us"},
                {"label": "Testimonials", "url": "#testimonials"},
                {"label": "Contact Us", "url": "#contact"}
              ]
            },
            {
              "title": "Contact Info",
              "links": [
                {"label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: hello@tyreprocentre.my", "url": "mailto:hello@tyreprocentre.my"},
                {"label": "Mon - Sat: 9am - 6pm", "url": "#"},
                {"label": "Sunday: Closed", "url": "#"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com"},
            {"platform": "instagram", "url": "https://instagram.com"}
          ],
          "copyright": "© 2026 TyrePro Centre. All rights reserved.",
          "bgColor": "#0f172a",
          "textColor": "#e2e8f0"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['tyre', 'tire', 'wheel', 'alignment', 'balancing', 'automotive', 'car', 'fitting']
);
