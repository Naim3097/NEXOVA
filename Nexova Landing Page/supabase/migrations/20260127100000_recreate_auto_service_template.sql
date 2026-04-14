-- Migration: Recreate Auto Service Workshop Template
-- Date: 2026-01-27
-- Purpose: Recreate with product_carousel for services, features with images for why choose us

-- Delete existing template
DELETE FROM templates WHERE slug = 'auto-service-workshop';

-- Insert updated template
INSERT INTO templates (
  id,
  name,
  slug,
  category,
  industry,
  description,
  thumbnail_url,
  preview_url,
  data,
  is_public,
  usage_count,
  tags
) VALUES (
  gen_random_uuid(),
  'Auto Service Workshop',
  'auto-service-workshop',
  'automotive',
  'Automotive',
  'A professional automotive service template perfect for car workshops, mechanics, and auto repair centers. Features service showcase with images, booking form for appointments, testimonials, and WhatsApp integration. Designed to convert visitors into booked customers.',
  'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "Auto Pro Service - Expert Car Care You Can Trust",
      "description": "Professional auto service with certified mechanics. Quality repairs, honest pricing, and your satisfaction guaranteed. Book your appointment today!",
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
          "message": "LIMITED OFFER: FREE 25-Point Vehicle Inspection With Every Service Booking!",
          "bgColor": "#dc2626",
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
          "logoText": "AUTO PRO SERVICE",
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
          "headline": "Expert Car Care You Can Trust",
          "subheadline": "Professional auto service with certified mechanics. Quality repairs, honest pricing, and your satisfaction guaranteed since 2010.",
          "ctaText": "Book Your Service Now",
          "ctaUrl": "#booking",
          "image": "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1920&h=1080&fit=crop",
          "bgColor": "#0f172a",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e2e8f0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 50,
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
          "subtitle": "Complete automotive care under one roof. From routine maintenance to major repairs, we handle it all.",
          "products": [
            {
              "id": "svc-engine",
              "code": "SVC-001",
              "name": "Engine Repair & Diagnostics",
              "description": "Advanced computer diagnostics and expert engine repairs for all makes and models. Our certified mechanics use state-of-the-art equipment.",
              "image_url": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
              "base_price": 150,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-oil",
              "code": "SVC-002",
              "name": "Oil Change & Maintenance",
              "description": "Regular maintenance services including oil change, filter replacement, and fluid top-up to keep your vehicle running smoothly.",
              "image_url": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=400&fit=crop",
              "base_price": 80,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-brake",
              "code": "SVC-003",
              "name": "Brake Service & Repair",
              "description": "Complete brake inspection, pad replacement, rotor resurfacing, and brake fluid flush. Your safety is our priority.",
              "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
              "base_price": 120,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-ac",
              "code": "SVC-004",
              "name": "Air Conditioning Service",
              "description": "A/C repair, gas recharge, compressor service, and full system diagnostics for optimal cooling performance.",
              "image_url": "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=400&fit=crop",
              "base_price": 100,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-tire",
              "code": "SVC-005",
              "name": "Tire & Wheel Services",
              "description": "Tire rotation, balancing, wheel alignment, and tire replacement. We stock all major tire brands at competitive prices.",
              "image_url": "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&h=400&fit=crop",
              "base_price": 60,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-battery",
              "code": "SVC-006",
              "name": "Battery & Electrical",
              "description": "Battery testing, charging, jump-start service, and replacement. We also handle alternator and starter motor repairs.",
              "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&h=400&fit=crop",
              "base_price": 90,
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
          "title": "Why Choose Auto Pro Service?",
          "features": [
            {
              "icon": "award",
              "title": "Certified Mechanics",
              "description": "Our team consists of ASE-certified technicians with over 10 years of experience working on all makes and models.",
              "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop"
            },
            {
              "icon": "dollar-sign",
              "title": "Transparent Pricing",
              "description": "No hidden fees or surprise charges. Get a detailed quote before any work begins so you know exactly what to expect.",
              "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
            },
            {
              "icon": "check-circle",
              "title": "Quality OEM Parts",
              "description": "We use only genuine OEM and high-quality aftermarket parts to ensure your vehicle gets the best components.",
              "image": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "12-Month Warranty",
              "description": "All our repairs come with a 12-month warranty on parts and labor. Drive with peace of mind knowing we stand behind our work.",
              "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"
            },
            {
              "icon": "clock",
              "title": "Quick Turnaround",
              "description": "Most services completed same-day. We value your time and work efficiently without compromising quality.",
              "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop"
            },
            {
              "icon": "gift",
              "title": "Free 25-Point Inspection",
              "description": "Complimentary vehicle health check with every service. We inspect brakes, fluids, belts, battery, tires, and more.",
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
          "title": "Book Your Service Appointment",
          "description": "Schedule your visit online and skip the wait. Choose your preferred date and time slot below.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Vehicle Details & Service Required (e.g. Honda Civic 2020, Oil Change)",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": true,
          "defaultCountryCode": "MY",
          "serviceName": "Car Service Appointment",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 60,
          "slotDuration": 60,
          "startTime": "08:00",
          "endTime": "18:00",
          "availableDays": [1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Confirm Booking",
          "submitButtonColor": "#dc2626",
          "bgColor": "#f8fafc",
          "google_sheets_enabled": false,
          "google_sheets_url": "",
          "requirePayment": false,
          "termsUrl": "#terms",
          "policyUrl": "#privacy"
        }
      },
      {
        "type": "testimonials",
        "order": 6,
        "props": {
          "variant": "grid",
          "title": "What Our Customers Say",
          "testimonials": [
            {"name": "Ahmad Razak", "role": "Honda Civic Owner", "quote": "Best workshop I have ever visited! They fixed my engine problem that 3 other workshops could not diagnose. Fair pricing and excellent service.", "rating": 5},
            {"name": "Sarah Lim", "role": "Toyota Vios Owner", "quote": "I always bring my car here for servicing. The staff is friendly, work is done quickly, and they always explain everything clearly.", "rating": 5},
            {"name": "Kumar Pillai", "role": "BMW 3 Series Owner", "quote": "Finally found a workshop I can trust with my BMW. Professional service at reasonable prices. Highly recommend!", "rating": 5},
            {"name": "Michelle Wong", "role": "Mazda CX-5 Owner", "quote": "The online booking system is so convenient! I booked my appointment, dropped off my car, and it was ready by evening. Great experience!", "rating": 5},
            {"name": "Rizal Hassan", "role": "Proton X70 Owner", "quote": "They found and fixed a brake issue during the free inspection. Could have been dangerous. Thank you for your honesty and thorough work!", "rating": 5},
            {"name": "Jenny Tan", "role": "Perodua Myvi Owner", "quote": "Very satisfied with the A/C repair. My car is cool again! The mechanic took time to explain what was wrong and showed me the faulty part.", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I would like to inquire about your car service and book an appointment.",
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
          "logoText": "AUTO PRO SERVICE",
          "description": "Your trusted partner for all automotive needs. Quality service, honest pricing, and customer satisfaction guaranteed since 2010.",
          "columns": [
            {
              "title": "Our Services",
              "links": [
                {"label": "Engine Repair", "url": "#services"},
                {"label": "Oil Change", "url": "#services"},
                {"label": "Brake Service", "url": "#services"},
                {"label": "A/C Service", "url": "#services"},
                {"label": "Tire Services", "url": "#services"},
                {"label": "Battery Service", "url": "#services"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Book Appointment", "url": "#booking"},
                {"label": "Our Team", "url": "#why-us"},
                {"label": "Testimonials", "url": "#testimonials"},
                {"label": "Contact Us", "url": "#contact"}
              ]
            },
            {
              "title": "Contact Info",
              "links": [
                {"label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: hello@autoproservice.my", "url": "mailto:hello@autoproservice.my"},
                {"label": "Mon - Sat: 8am - 6pm", "url": "#"},
                {"label": "123 Jalan Workshop, KL", "url": "#"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com/autoproservice"},
            {"platform": "instagram", "url": "https://instagram.com/autoproservice"},
            {"platform": "youtube", "url": "https://youtube.com/autoproservice"}
          ],
          "copyright": "© 2026 Auto Pro Service. All rights reserved.",
          "bgColor": "#0f172a",
          "textColor": "#e2e8f0"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['automotive', 'car-service', 'mechanic', 'workshop', 'repair', 'booking', 'appointment', 'auto']
);
