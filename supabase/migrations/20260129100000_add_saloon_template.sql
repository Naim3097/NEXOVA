-- Saloon Template
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Saloon',
  'saloon',
  'saloon',
  'Saloon',
  'Professional saloon landing page with service showcase, booking form, testimonials, and FAQ. Perfect for hair salons, beauty parlors, and nail studios.',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=800&fit=crop',
  true,
  ARRAY['saloon', 'hair salon', 'beauty', 'spa', 'nail', 'booking', 'services'],
  '{
    "elements": [
      {
        "id": "saloon-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "✨ Grand Opening Special! 30% OFF All Services - Limited Time Only",
          "bgColor": "#be185d",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": false
        }
      },
      {
        "id": "saloon-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "GLOW STUDIO",
          "logo": "",
          "menuItems": [
            { "label": "Services", "url": "#product_carousel-4" },
            { "label": "Reviews", "url": "#testimonials-6" },
            { "label": "FAQ", "url": "#faq-7" }
          ],
          "bgColor": "#ffffff",
          "textColor": "#1f2937",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Book Now",
            "url": "#booking_form-5"
          }
        }
      },
      {
        "id": "saloon-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Your Beauty, Our Passion",
          "subheadline": "Experience premium hair and beauty treatments in a relaxing environment. Our skilled stylists are dedicated to making you look and feel your best.",
          "ctaText": "Book Appointment",
          "ctaUrl": "#booking_form-5",
          "image": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80",
          "bgColor": "#fdf2f8",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#fce7f3",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 50,
          "buttonBgColor": "#be185d",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "saloon-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Why Choose Glow Studio?",
          "variant": "grid",
          "features": [
            {
              "icon": "sparkles",
              "title": "Expert Stylists",
              "description": "Our team of certified stylists brings years of experience and stays updated with the latest trends."
            },
            {
              "icon": "heart",
              "title": "Premium Products",
              "description": "We use only top-quality, salon-grade products to ensure the best results for your hair and skin."
            },
            {
              "icon": "shield",
              "title": "Hygienic Environment",
              "description": "Strict hygiene protocols with sanitized tools and clean workstations for your safety and comfort."
            },
            {
              "icon": "star",
              "title": "Satisfaction Guaranteed",
              "description": "Your satisfaction is our priority. We ensure every client leaves happy and confident."
            },
            {
              "icon": "clock",
              "title": "Flexible Hours",
              "description": "Open 7 days a week with extended hours to fit your busy schedule. Walk-ins welcome!"
            },
            {
              "icon": "award",
              "title": "Award-Winning Service",
              "description": "Recognised as one of the top salons in the area with multiple beauty industry awards."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "saloon-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Our Services",
          "subtitle": "From haircuts to full makeovers, we offer a wide range of beauty treatments tailored to your needs.",
          "products": [
            {
              "id": "svc-haircut",
              "code": "SAL-001",
              "name": "Haircut & Styling",
              "description": "Professional haircut and blow-dry styling by our expert stylists. Includes consultation, wash, cut, and styling.",
              "image_url": "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop",
              "base_price": 45,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-coloring",
              "code": "SAL-002",
              "name": "Hair Colouring",
              "description": "Full hair colouring service using premium products. Includes balayage, highlights, and full colour options.",
              "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop",
              "base_price": 150,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-treatment",
              "code": "SAL-003",
              "name": "Hair Treatment & Spa",
              "description": "Deep conditioning treatment and relaxing scalp spa to rejuvenate and nourish your hair from root to tip.",
              "image_url": "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=400&fit=crop",
              "base_price": 80,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#fdf2f8"
        }
      },
      {
        "id": "saloon-booking",
        "type": "booking_form",
        "order": 5,
        "props": {
          "title": "Book Your Appointment",
          "description": "Reserve your slot online. Pick your preferred date and time and we will confirm your booking.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Preferred Service / Stylist",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": false,
          "defaultCountryCode": "MY",
          "serviceName": "Salon Appointment",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 60,
          "slotDuration": 60,
          "startTime": "10:00",
          "endTime": "20:00",
          "availableDays": [0, 1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Confirm Booking",
          "submitButtonColor": "#be185d",
          "bgColor": "#ffffff",
          "google_sheets_enabled": false
        }
      },
      {
        "id": "saloon-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "What Our Clients Say",
          "variant": "grid",
          "testimonials": [
            {
              "name": "Aisyah Rahman",
              "role": "Regular Client",
              "quote": "The best salon experience I have ever had! The stylist understood exactly what I wanted and the result was gorgeous. Will definitely be coming back.",
              "rating": 5
            },
            {
              "name": "Michelle Tan",
              "role": "Hair Colouring Client",
              "quote": "I was nervous about colouring my hair for the first time but the team made me feel so comfortable. The balayage turned out perfect! Highly recommend.",
              "rating": 5
            },
            {
              "name": "Priya Devi",
              "role": "Bridal Package Client",
              "quote": "Had my bridal hair and makeup done here. The team was so professional and patient. I felt like a princess on my big day. Thank you Glow Studio!",
              "rating": 5
            }
          ],
          "bgColor": "#fdf2f8"
        }
      },
      {
        "id": "saloon-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Frequently Asked Questions",
          "variant": "single_column",
          "questions": [
            {
              "question": "Do I need to book an appointment?",
              "answer": "We recommend booking an appointment to secure your preferred time slot, but walk-ins are also welcome subject to availability."
            },
            {
              "question": "How long does a hair colouring session take?",
              "answer": "A full hair colouring session typically takes 2-3 hours depending on the technique and hair length. Highlights or balayage may take slightly longer."
            },
            {
              "question": "What products do you use?",
              "answer": "We use premium salon-grade products from trusted brands to ensure the best results and minimal damage to your hair."
            },
            {
              "question": "Do you offer packages for weddings or events?",
              "answer": "Yes! We offer special bridal and event packages that include hair styling, makeup, and trial sessions. Contact us for customised packages."
            },
            {
              "question": "What is your cancellation policy?",
              "answer": "We kindly request at least 24 hours notice for cancellations. Late cancellations or no-shows may incur a small fee."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "saloon-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "centered",
          "headline": "Ready for a New Look?",
          "description": "Book your appointment today and let our expert stylists transform your look. Walk-ins welcome!",
          "buttonText": "Book Now",
          "buttonUrl": "#booking_form-5",
          "bgGradient": "linear-gradient(135deg, #be185d 0%, #9d174d 100%)"
        }
      },
      {
        "id": "saloon-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "GLOW STUDIO",
          "description": "Your one-stop beauty destination for hair, skin, and nails.",
          "copyright": "2026 Glow Studio. All rights reserved.",
          "bgColor": "#1f2937",
          "textColor": "#f9fafb",
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
                { "label": "Mon - Fri: 10am - 8pm", "url": "#" },
                { "label": "Sat - Sun: 10am - 6pm", "url": "#" },
                { "label": "Public Holidays: Closed", "url": "#" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Glow Studio - Premium Hair & Beauty Salon",
      "description": "Experience premium hair and beauty treatments at Glow Studio. Expert stylists, top-quality products, and a relaxing environment. Book your appointment today!",
      "keywords": "hair salon, beauty salon, haircut, hair colouring, hair treatment, beauty parlor, salon appointment"
    },
    "theme": {
      "primaryColor": "#be185d",
      "fontFamily": "Inter"
    }
  }'::jsonb
);
