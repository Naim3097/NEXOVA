-- Migration: Add Clinic & Healthcare Template
-- Date: 2026-01-27
-- Purpose: Create a professional clinic/healthcare template with booking, services showcase, and WhatsApp integration

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
  'Healthcare Clinic',
  'healthcare-clinic',
  'healthcare',
  'Healthcare',
  'A professional healthcare clinic template perfect for medical clinics, dental practices, aesthetic centers, and wellness clinics. Features service showcase with images, online appointment booking, patient testimonials, and WhatsApp integration. Designed to build trust and convert visitors into patients.',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "HealthFirst Clinic - Your Trusted Healthcare Partner",
      "description": "Professional healthcare services with experienced doctors. General checkups, dental care, aesthetic treatments, and more. Book your appointment online today!",
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
          "message": "NEW PATIENTS: Get a FREE Health Screening with your first visit!",
          "bgColor": "#0891b2",
          "textColor": "#ffffff",
          "showCountdown": false,
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
          "logoText": "HEALTHFIRST CLINIC",
          "menuItems": [
            {"label": "Services", "url": "#services"},
            {"label": "Why Us", "url": "#why-us"},
            {"label": "Testimonials", "url": "#testimonials"},
            {"label": "Book Now", "url": "#booking"}
          ],
          "ctaButton": {"text": "Book Appointment", "url": "#booking"},
          "bgColor": "#ffffff",
          "textColor": "#1e293b",
          "isSticky": true,
          "layout": "split"
        }
      },
      {
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Your Health, Our Priority",
          "subheadline": "Experienced doctors, modern facilities, and compassionate care. We are here to help you and your family stay healthy and happy.",
          "ctaText": "Book Your Appointment",
          "ctaUrl": "#booking",
          "image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=1080&fit=crop",
          "bgColor": "#0f172a",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e0f2fe",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 50,
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
          "subtitle": "Comprehensive healthcare services tailored to your needs. From general checkups to specialized treatments.",
          "products": [
            {
              "id": "svc-general",
              "code": "CLN-001",
              "name": "General Consultation",
              "description": "Comprehensive health assessments with experienced doctors. Includes physical examination, vital signs check, and medical advice.",
              "image_url": "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600&h=400&fit=crop",
              "base_price": 80,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-dental",
              "code": "CLN-002",
              "name": "Dental Care",
              "description": "Complete dental services including cleaning, fillings, whitening, and orthodontics. Gentle care for the whole family.",
              "image_url": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=400&fit=crop",
              "base_price": 120,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-aesthetic",
              "code": "CLN-003",
              "name": "Aesthetic Treatments",
              "description": "Advanced aesthetic procedures including facial treatments, laser therapy, and skin rejuvenation by certified specialists.",
              "image_url": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop",
              "base_price": 250,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-lab",
              "code": "CLN-004",
              "name": "Lab Tests & Diagnostics",
              "description": "On-site laboratory for blood tests, X-rays, ultrasound, and comprehensive health screening packages.",
              "image_url": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop",
              "base_price": 150,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-physio",
              "code": "CLN-005",
              "name": "Physiotherapy",
              "description": "Rehabilitation and physiotherapy sessions for sports injuries, chronic pain, and post-surgery recovery.",
              "image_url": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
              "base_price": 100,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-pediatric",
              "code": "CLN-006",
              "name": "Pediatric Care",
              "description": "Specialized care for infants, children, and adolescents. Vaccinations, growth monitoring, and childhood illness treatment.",
              "image_url": "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&h=400&fit=crop",
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
          "bgColor": "#f0f9ff",
          "textColor": "#1e293b",
          "priceColor": "#0891b2"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose HealthFirst Clinic?",
          "features": [
            {
              "icon": "award",
              "title": "Experienced Doctors",
              "description": "Our team of board-certified physicians brings over 20 years of combined experience across multiple specialties.",
              "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop"
            },
            {
              "icon": "heart",
              "title": "Patient-Centered Care",
              "description": "We listen, we care, and we put your health first. Every treatment plan is tailored to your unique needs.",
              "image": "https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=600&h=400&fit=crop"
            },
            {
              "icon": "zap",
              "title": "Modern Facilities",
              "description": "State-of-the-art medical equipment and a comfortable, hygienic environment for your peace of mind.",
              "image": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&h=400&fit=crop"
            },
            {
              "icon": "clock",
              "title": "Minimal Wait Time",
              "description": "Book online and skip the queue. Our efficient scheduling ensures you are seen promptly at your appointment time.",
              "image": "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "Insurance Accepted",
              "description": "We accept all major insurance panels including AIA, Prudential, Great Eastern, and government programs.",
              "image": "https://images.unsplash.com/photo-1563213126-a4273aed2016?w=600&h=400&fit=crop"
            },
            {
              "icon": "map-pin",
              "title": "Convenient Location",
              "description": "Centrally located with ample parking. Easy access via public transport. Open 7 days a week for your convenience.",
              "image": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&h=400&fit=crop"
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
          "description": "Schedule your visit online. Choose your preferred date and time, and our team will confirm your booking.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Reason for Visit / Preferred Doctor",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": false,
          "defaultCountryCode": "MY",
          "serviceName": "Clinic Appointment",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 30,
          "slotDuration": 30,
          "startTime": "08:00",
          "endTime": "21:00",
          "availableDays": [0, 1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Confirm Appointment",
          "submitButtonColor": "#0891b2",
          "bgColor": "#f0f9ff",
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
          "title": "What Our Patients Say",
          "testimonials": [
            {"name": "Nurul Aisyah", "role": "Regular Patient", "quote": "The doctors here truly care about their patients. Dr. Lim took the time to explain everything and made me feel at ease. Best clinic experience I have had.", "rating": 5},
            {"name": "David Chen", "role": "Dental Patient", "quote": "I used to be terrified of dentists but the team here is so gentle and professional. My dental cleaning was completely painless. Highly recommend!", "rating": 5},
            {"name": "Priya Sharma", "role": "Aesthetic Patient", "quote": "Amazing results from my facial treatment! The aesthetic doctor explained every step and the results exceeded my expectations. Will definitely come back.", "rating": 5},
            {"name": "Ahmad Faiz", "role": "Parent", "quote": "We bring all three of our kids here for checkups and vaccinations. The pediatric doctor is wonderful with children - they actually look forward to their visits!", "rating": 5},
            {"name": "Lisa Tan", "role": "Physiotherapy Patient", "quote": "After my knee surgery, the physiotherapy sessions here helped me recover much faster than expected. The therapist was knowledgeable and encouraging.", "rating": 5},
            {"name": "Raj Kumar", "role": "Health Screening Patient", "quote": "Got my annual health screening done here. Very organized, minimal waiting, and the doctor explained all results thoroughly. Great value for the price.", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I would like to inquire about your clinic services and book an appointment.",
          "buttonText": "Chat with Us",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Need help? Chat with us!",
          "showHeadline": true,
          "headlineText": "Have questions? We are here to help!",
          "headlineColor": "#1e293b"
        }
      },
      {
        "type": "footer",
        "order": 8,
        "props": {
          "logo": "",
          "logoText": "HEALTHFIRST CLINIC",
          "description": "Your trusted healthcare partner. Providing quality medical care with compassion and excellence since 2015.",
          "columns": [
            {
              "title": "Our Services",
              "links": [
                {"label": "General Consultation", "url": "#services"},
                {"label": "Dental Care", "url": "#services"},
                {"label": "Aesthetic Treatments", "url": "#services"},
                {"label": "Lab Tests", "url": "#services"},
                {"label": "Physiotherapy", "url": "#services"},
                {"label": "Pediatric Care", "url": "#services"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Book Appointment", "url": "#booking"},
                {"label": "Our Doctors", "url": "#why-us"},
                {"label": "Patient Reviews", "url": "#testimonials"},
                {"label": "Insurance Panels", "url": "#insurance"}
              ]
            },
            {
              "title": "Contact Us",
              "links": [
                {"label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: hello@healthfirstclinic.my", "url": "mailto:hello@healthfirstclinic.my"},
                {"label": "Mon - Sun: 8am - 9pm", "url": "#"},
                {"label": "45 Jalan Kesihatan, KL", "url": "#"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com/healthfirstclinic"},
            {"platform": "instagram", "url": "https://instagram.com/healthfirstclinic"}
          ],
          "copyright": "© 2026 HealthFirst Clinic. All rights reserved.",
          "bgColor": "#0f172a",
          "textColor": "#e2e8f0"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['clinic', 'healthcare', 'medical', 'doctor', 'dental', 'aesthetic', 'booking', 'appointment', 'hospital']
);
