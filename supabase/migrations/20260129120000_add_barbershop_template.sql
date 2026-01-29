-- Barbershop Template
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Barbershop',
  'barbershop',
  'barber',
  'Barber',
  'Modern barbershop landing page with service showcase, booking form, testimonials, and FAQ. Perfect for barbershops, men grooming studios, and hair studios.',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&h=800&fit=crop',
  true,
  ARRAY['barbershop', 'barber', 'haircut', 'grooming', 'men', 'fade', 'booking'],
  '{
    "elements": [
      {
        "id": "barber-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "💈 Walk-ins Welcome! First-Time Customers Get 20% OFF",
          "bgColor": "#1c1917",
          "textColor": "#fbbf24",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": false
        }
      },
      {
        "id": "barber-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "THE SHARP EDGE",
          "logo": "",
          "menuItems": [
            { "label": "Services", "url": "#product_carousel-4" },
            { "label": "Reviews", "url": "#testimonials-6" },
            { "label": "FAQ", "url": "#faq-7" }
          ],
          "bgColor": "#1c1917",
          "textColor": "#fafaf9",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Book Now",
            "url": "#booking_form-5"
          }
        }
      },
      {
        "id": "barber-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Where Style Meets Precision",
          "subheadline": "Premium grooming experience for the modern gentleman. Expert barbers, classic techniques, and a welcoming atmosphere.",
          "ctaText": "Book Your Cut",
          "ctaUrl": "#booking_form-5",
          "image": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80",
          "bgColor": "#1c1917",
          "headlineColor": "#fbbf24",
          "subheadlineColor": "#e7e5e4",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#fbbf24",
          "buttonTextColor": "#1c1917",
          "showCtaButton": true
        }
      },
      {
        "id": "barber-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Why Choose The Sharp Edge?",
          "variant": "grid",
          "features": [
            {
              "icon": "award",
              "title": "Master Barbers",
              "description": "Our barbers are highly skilled professionals with years of experience in classic and modern cutting techniques."
            },
            {
              "icon": "sparkles",
              "title": "Premium Products",
              "description": "We use only top-tier grooming products to ensure the best results and a luxury experience every visit."
            },
            {
              "icon": "clock",
              "title": "No Long Waits",
              "description": "Book your slot online and walk right in. We respect your time with efficient scheduling and punctual service."
            },
            {
              "icon": "shield",
              "title": "Clean & Hygienic",
              "description": "Sterilised tools, fresh towels, and a spotless environment. Your health and comfort are our top priority."
            },
            {
              "icon": "users",
              "title": "All Ages Welcome",
              "description": "From kids to seniors, we cater to all ages with specialised cuts and grooming services for everyone."
            },
            {
              "icon": "star",
              "title": "5-Star Rated",
              "description": "Consistently rated 5 stars by our customers. Experience the service that keeps them coming back."
            }
          ],
          "bgColor": "#fafaf9"
        }
      },
      {
        "id": "barber-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Our Services",
          "subtitle": "From classic cuts to modern fades, we offer a full range of grooming services for the modern man.",
          "products": [
            {
              "id": "svc-haircut",
              "code": "BAR-001",
              "name": "Classic Haircut & Fade",
              "description": "Precision haircut with your choice of fade style. Includes wash, cut, styling, and hot towel finish.",
              "image_url": "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop",
              "base_price": 35,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-beard",
              "code": "BAR-002",
              "name": "Beard Trim & Grooming",
              "description": "Professional beard shaping, trimming, and grooming with hot towel treatment and premium beard oil application.",
              "image_url": "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-combo",
              "code": "BAR-003",
              "name": "The Full Experience",
              "description": "Complete grooming package including haircut, beard trim, hot towel facial, scalp massage, and hair styling.",
              "image_url": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop",
              "base_price": 55,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#f5f5f4"
        }
      },
      {
        "id": "barber-booking",
        "type": "booking_form",
        "order": 5,
        "props": {
          "title": "Book Your Appointment",
          "description": "Reserve your seat and skip the wait. Choose your preferred date, time, and barber.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Preferred Barber / Service",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": false,
          "defaultCountryCode": "MY",
          "serviceName": "Barber Appointment",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 45,
          "slotDuration": 45,
          "startTime": "10:00",
          "endTime": "21:00",
          "availableDays": [0, 1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Confirm Booking",
          "submitButtonColor": "#fbbf24",
          "submitButtonTextColor": "#1c1917",
          "bgColor": "#ffffff",
          "google_sheets_enabled": false
        }
      },
      {
        "id": "barber-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "What Our Clients Say",
          "variant": "grid",
          "testimonials": [
            {
              "name": "Adam Razak",
              "role": "Regular Client",
              "quote": "Best barbershop in town! The attention to detail on my fade is always on point. The hot towel finish is the cherry on top. Highly recommend!",
              "rating": 5
            },
            {
              "name": "Danish Hakim",
              "role": "First-Time Client",
              "quote": "First time here and I am already a loyal customer. The barber took time to understand what I wanted and delivered perfectly. Great vibe too!",
              "rating": 5
            },
            {
              "name": "Ryan Lee",
              "role": "Beard Grooming Client",
              "quote": "Finally found a place that knows how to handle beards properly. The beard trim and grooming service is top notch. My beard has never looked this good.",
              "rating": 5
            }
          ],
          "bgColor": "#f5f5f4"
        }
      },
      {
        "id": "barber-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Frequently Asked Questions",
          "variant": "single_column",
          "questions": [
            {
              "question": "Do I need to book an appointment?",
              "answer": "We recommend booking online to secure your slot, but walk-ins are always welcome. Booking ensures no waiting time."
            },
            {
              "question": "How long does a haircut take?",
              "answer": "A standard haircut takes about 30-45 minutes. The Full Experience package takes approximately 60-75 minutes."
            },
            {
              "question": "Do you offer services for kids?",
              "answer": "Yes! We welcome kids aged 5 and above. Our barbers are experienced with children and make the experience fun and comfortable."
            },
            {
              "question": "What payment methods do you accept?",
              "answer": "We accept cash, debit/credit cards, and e-wallets including Touch n Go, GrabPay, and DuitNow QR."
            },
            {
              "question": "Can I request a specific barber?",
              "answer": "Absolutely! When booking online, you can select your preferred barber. You can also mention it in the remarks field."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "barber-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "centered",
          "headline": "Ready for a Fresh Cut?",
          "description": "Book your appointment now and experience the best grooming service in town. Walk-ins also welcome!",
          "buttonText": "Book Your Slot",
          "buttonUrl": "#booking_form-5",
          "bgGradient": "linear-gradient(135deg, #1c1917 0%, #292524 100%)"
        }
      },
      {
        "id": "barber-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "THE SHARP EDGE",
          "description": "Premium barbershop for the modern gentleman.",
          "copyright": "2026 The Sharp Edge. All rights reserved.",
          "bgColor": "#1c1917",
          "textColor": "#fafaf9",
          "columns": [
            {
              "title": "Quick Links",
              "links": [
                { "label": "Services", "url": "#product_carousel-4" },
                { "label": "Book Appointment", "url": "#booking_form-5" },
                { "label": "Reviews", "url": "#testimonials-6" },
                { "label": "FAQ", "url": "#faq-7" }
              ]
            },
            {
              "title": "Operating Hours",
              "links": [
                { "label": "Mon - Sat: 10am - 9pm", "url": "#" },
                { "label": "Sunday: 10am - 6pm", "url": "#" },
                { "label": "Public Holidays: 10am - 4pm", "url": "#" }
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
      "title": "The Sharp Edge - Premium Barbershop",
      "description": "Experience premium grooming at The Sharp Edge. Expert barbers, classic and modern cuts, beard grooming, and a welcoming atmosphere. Book your appointment today!",
      "keywords": "barbershop, barber, haircut, fade, beard trim, grooming, men haircut, barber near me"
    },
    "theme": {
      "primaryColor": "#fbbf24",
      "fontFamily": "Inter"
    }
  }'::jsonb
);
