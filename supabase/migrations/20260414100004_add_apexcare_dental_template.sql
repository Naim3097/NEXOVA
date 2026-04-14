-- ApexCare Dental Clinic Template (Healthcare)
-- Theme: Professional blue, Satoshi typography
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'ApexCare — Dental Clinic',
  'apexcare-dental',
  'healthcare',
  'Healthcare',
  'A modern, professional dental clinic landing page. Includes hero, about, services list, appointment booking, team showcase, testimonials, blog, and footer.',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=800&fit=crop',
  true,
  ARRAY['dental', 'clinic', 'healthcare', 'medical', 'professional', 'blue'],
  '{
    "elements": [
      {
        "type": "dc-navigation",
        "order": 0,
        "props": {
          "logo": "ApexCare",
          "links": [
            { "label": "Home", "href": "#" },
            { "label": "About", "href": "#about" },
            { "label": "Oral Health", "href": "#services" },
            { "label": "Pricing", "href": "#booking" },
            { "label": "Contacts", "href": "#footer" }
          ],
          "ctaText": "Let''s Talk"
        }
      },
      {
        "type": "dc-hero",
        "order": 1,
        "props": {
          "headline": "Compassionate care, exceptional results.",
          "brandLabel": "Pro Health",
          "subheadline": "Our team of experienced doctors and healthcare professionals are committed to providing quality care and personalized attention to our patients.",
          "videoCtaText": "See how we work",
          "bgImage": "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1400&q=80",
          "patientBadge": {
            "value": "150K +",
            "label": "Patient Recover",
            "avatars": [
              "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&q=80",
              "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&q=80"
            ]
          },
          "stats": [
            { "value": "20+", "label": "Years of experience" },
            { "value": "95%", "label": "Patient satisfaction rating" },
            { "value": "5000+", "label": "Patients served annually" },
            { "value": "10+", "label": "Healthcare providers on staff" }
          ]
        }
      },
      {
        "type": "dc-about",
        "order": 2,
        "props": {
          "badge": "LEARN ABOUT US",
          "headline": "Your trusted partners\nin dental care",
          "description": "At ApexCare, we believe that a healthy smile is the gateway to a happy life. Our team of dedicated dental professionals combines state-of-the-art technology with compassionate care to provide you the best dental experience possible.",
          "ctaText": "Meet Doctor",
          "image": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=700&q=80"
        }
      },
      {
        "type": "dc-reasons",
        "order": 3,
        "props": {
          "badge": "WHY CHOOSE US",
          "headline": "The top reasons our\npatients love us",
          "certification": "Certified by the American Dental Association",
          "certCta": "Schedule Your Visit",
          "reasons": [
            { "icon": "tooth", "title": "Experienced & Caring Dentists", "description": "With over 25 years of experience, our team provides expert care with a gentle touch, ensuring a comfortable and effective experience every time." },
            { "icon": "tech", "title": "State-of-the-Art Technology", "description": "We use the latest dental technology to provide precise, efficient, and effective treatments, reducing discomfort." },
            { "icon": "family", "title": "Comprehensive Care for the Whole Family", "description": "From routine check-ups to advanced treatments, we offer dental services for all ages." }
          ],
          "imageCard": {
            "image": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80",
            "title": "Affordable &\nTransparent Pricing"
          }
        }
      },
      {
        "type": "dc-services",
        "order": 4,
        "props": {
          "badge": "OUR SERVICES",
          "headline": "Our comprehensive\ndental services",
          "moreCtaText": "More Service",
          "services": [
            { "name": "General Dentistry", "desc": "Regular check-ups, cleanings, fillings, and preventive care to keep your smile healthy and bright." },
            { "name": "Cosmetic Dentistry", "desc": "Teeth whitening, veneers, bonding, and smile makeovers for a confident, radiant appearance." },
            { "name": "Orthodontics", "desc": "Braces, clear aligners, and corrective treatments to straighten teeth and improve your bite." },
            { "name": "Oral Surgery", "desc": "Extractions, implants, and surgical procedures performed with precision and patient comfort in mind." },
            { "name": "Pediatric Dentistry", "desc": "Gentle, kid-friendly dental care designed to build healthy habits from childhood." },
            { "name": "Emergency Care", "desc": "Same-day urgent dental care for injuries, severe pain, and unexpected dental emergencies." }
          ],
          "image": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&q=80",
          "reviewCard": {
            "text": "The best dental experience I have ever had. Truly caring and professional team!",
            "author": "Anna Roberts",
            "role": "Regular Patient",
            "rating": 5
          }
        }
      },
      {
        "type": "dc-booking",
        "order": 5,
        "props": {
          "badge": "APPOINTMENT BOOKING",
          "headline": "Easy & quick\nappointment booking",
          "fields": [
            { "label": "Full name", "placeholder": "Full name *", "type": "text" },
            { "label": "Email", "placeholder": "Email *", "type": "email" },
            { "label": "Appointment date", "placeholder": "Appointment date *", "type": "date" },
            { "label": "Appointment time", "placeholder": "Appointment time *", "type": "time" },
            { "label": "Phone number", "placeholder": "Phone number *", "type": "tel", "fullWidth": true },
            { "label": "Additional Notes", "placeholder": "Additional Notes *", "type": "textarea", "fullWidth": true }
          ],
          "ctaText": "Reserve Your Spot",
          "image": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=700&q=80"
        }
      },
      {
        "type": "dc-testimonial",
        "order": 6,
        "props": {
          "badge": "OUR PATIENTS",
          "quote": "The staff made me feel so comfortable and cared for. First-class treatment, friendly service, and a brighter smile — I couldn''t ask for better care!",
          "author": "Cooper Aranda",
          "role": "Patient",
          "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
          "image": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&q=80"
        }
      },
      {
        "type": "dc-team",
        "order": 7,
        "props": {
          "headline": "Your trusted dental\nprofessionals",
          "ctaText": "View Doctor Today",
          "doctors": [
            { "name": "Dr. John Smith", "role": "Oral Surgeon", "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80" },
            { "name": "Dr. Emily Lee", "role": "Orthodontist", "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80" },
            { "name": "Dr. Sarah Thompson", "role": "Periodontist", "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80" },
            { "name": "Dr. Ashley", "role": "Endodontist", "image": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&q=80" }
          ]
        }
      },
      {
        "type": "dc-blog",
        "order": 8,
        "props": {
          "headline": "From our blog: tips & insights for\nhealthy smiles",
          "ctaText": "Check All Insights",
          "posts": [
            { "date": "October 9, 2025", "title": "6 Tips to Keep Your Teeth Healthy", "excerpt": "Learn the essential daily habits that protect your teeth and gums for years to come.", "image": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&q=80" },
            { "date": "September 6, 2025", "title": "How to Choose the Right Toothbrush", "excerpt": "Find out what to look for when picking the perfect toothbrush for your dental health.", "image": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&q=80" }
          ]
        }
      },
      {
        "type": "dc-footer",
        "order": 9,
        "props": {
          "logo": "ApexCare",
          "tagline": "Dental Care Excellence\nTrusted by Your Family",
          "address": "Suite 12, Medical Plaza,\n123 Health St, NY 10001",
          "phone": "+1(234) 123-56",
          "email": "info@apexcare.com",
          "quickLinks": [
            { "label": "About", "href": "#about" },
            { "label": "Services", "href": "#services" },
            { "label": "Pricing", "href": "#booking" },
            { "label": "Coverage", "href": "#" }
          ],
          "socialLinks": ["facebook", "twitter", "instagram"],
          "newsletter": {
            "placeholder": "Enter your email",
            "ctaText": "Subscribe"
          },
          "copyright": "© 2025 ApexCare. All rights reserved."
        }
      }
    ],
    "theme": {
      "primaryColor": "#1e3a6e",
      "fontFamily": "Satoshi"
    }
  }'
);
