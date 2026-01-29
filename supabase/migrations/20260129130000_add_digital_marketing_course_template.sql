-- Digital Marketing Course Template (Digital Products)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Digital Marketing Course',
  'digital-marketing-course',
  'digital-products',
  'Education',
  'Professional digital marketing course landing page with tiered product sets, payment form, testimonials, and FAQ. Perfect for online courses, workshops, and digital education products.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
  true,
  ARRAY['digital marketing', 'course', 'online learning', 'education', 'digital products', 'marketing', 'bundle'],
  '{
    "elements": [
      {
        "id": "dmc-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "🔥 Early Bird Offer! Enroll Now & Save Up To 40% - Limited Slots Available",
          "bgColor": "#4f46e5",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Offer ends in:",
          "countdownEndDate": "2026-03-31T23:59:59"
        }
      },
      {
        "id": "dmc-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "MARKETPRO ACADEMY",
          "logo": "",
          "menuItems": [
            { "label": "Packages", "url": "#product_carousel-4" },
            { "label": "Reviews", "url": "#testimonials-7" },
            { "label": "FAQ", "url": "#faq-6" }
          ],
          "bgColor": "#ffffff",
          "textColor": "#1f2937",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Enroll Now",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "dmc-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Master Digital Marketing in 30 Days",
          "subheadline": "Learn proven strategies to grow any business online. From social media mastery to paid ads and SEO — everything you need to become a digital marketing expert.",
          "ctaText": "View Packages",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
          "bgColor": "#eef2ff",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e0e7ff",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#4f46e5",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "dmc-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Why Choose MarketPro Academy?",
          "variant": "grid",
          "features": [
            {
              "icon": "video",
              "title": "50+ Video Lessons",
              "description": "Comprehensive video modules covering every aspect of digital marketing, from beginner to advanced strategies."
            },
            {
              "icon": "award",
              "title": "Industry-Certified",
              "description": "Get a recognised certificate upon completion. Boost your resume and showcase your digital marketing expertise."
            },
            {
              "icon": "users",
              "title": "Private Community",
              "description": "Join an exclusive community of students and marketers. Network, share ideas, and grow together."
            },
            {
              "icon": "zap",
              "title": "Actionable Templates",
              "description": "Ready-to-use templates for ads, content calendars, email campaigns, and more. Start implementing immediately."
            },
            {
              "icon": "headphones",
              "title": "Lifetime Support",
              "description": "Get ongoing support from our team of experts. Ask questions, get feedback, and stay on track."
            },
            {
              "icon": "refresh-cw",
              "title": "Lifetime Updates",
              "description": "Digital marketing evolves fast. Get free lifetime access to all future course updates and new modules."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "dmc-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Choose Your Package",
          "subtitle": "Select the package that fits your learning goals. All packages include lifetime access to course materials.",
          "products": [
            {
              "id": "set-1",
              "code": "DMC-001",
              "name": "Set 1 — Starter",
              "description": "Perfect for beginners. Get the core modules covering social media marketing, content strategy, and basic SEO. Includes 20+ video lessons and starter templates.",
              "image_url": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop",
              "base_price": 149,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "set-2",
              "code": "DMC-002",
              "name": "Set 2 — Professional",
              "description": "Everything in Starter plus advanced modules on paid advertising (Meta & Google Ads), email marketing, funnel building, and analytics. 40+ video lessons included.",
              "image_url": "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
              "base_price": 299,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "set-3",
              "code": "DMC-003",
              "name": "Set 3 — Bundle (Complete)",
              "description": "The ultimate bundle! All modules from Starter + Professional, plus exclusive bonuses: 1-on-1 coaching session, private mastermind group, done-for-you ad templates, and lifetime community access.",
              "image_url": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
              "base_price": 499,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#eef2ff"
        }
      },
      {
        "id": "dmc-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Enroll Now",
          "description": "Fill in your details and select your preferred package to get instant access to the course.",
          "nameLabel": "Full Name",
          "mobileLabel": "Phone Number",
          "emailLabel": "Email Address",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "starter-pkg",
              "name": "Set 1 — Starter",
              "description": "Core modules, 20+ videos, starter templates",
              "price": 149
            },
            {
              "id": "pro-pkg",
              "name": "Set 2 — Professional",
              "description": "All Starter content + advanced modules, 40+ videos",
              "price": 299,
              "featured": true
            },
            {
              "id": "bundle-pkg",
              "name": "Set 3 — Bundle (Complete)",
              "description": "Everything + coaching, mastermind group, bonus templates",
              "price": 499
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Enroll & Pay Now",
          "submitButtonColor": "#4f46e5",
          "bgColor": "#ffffff",
          "companyName": "MarketPro Academy",
          "companyRegistration": ""
        }
      },
      {
        "id": "dmc-faq",
        "type": "faq",
        "order": 6,
        "props": {
          "title": "Frequently Asked Questions",
          "variant": "single_column",
          "questions": [
            {
              "question": "Is this course suitable for complete beginners?",
              "answer": "Absolutely! The Starter package is designed specifically for beginners with no prior marketing experience. We start from the basics and build up."
            },
            {
              "question": "How long do I have access to the course?",
              "answer": "All packages come with lifetime access. You can learn at your own pace and revisit any module whenever you want."
            },
            {
              "question": "What is the difference between the packages?",
              "answer": "Set 1 (Starter) covers core digital marketing skills. Set 2 (Professional) adds advanced paid ads and analytics. Set 3 (Bundle) includes everything plus 1-on-1 coaching and exclusive community access."
            },
            {
              "question": "Do I get a certificate?",
              "answer": "Yes! Upon completing all modules in your package, you will receive a digital certificate that you can add to your LinkedIn profile or resume."
            },
            {
              "question": "Is there a refund policy?",
              "answer": "We offer a 7-day money-back guarantee. If you are not satisfied with the course within the first 7 days, we will refund your payment in full."
            },
            {
              "question": "Can I upgrade my package later?",
              "answer": "Yes! You can upgrade from Starter to Professional or Bundle at any time. You will only pay the difference in price."
            }
          ],
          "bgColor": "#eef2ff"
        }
      },
      {
        "id": "dmc-testimonials",
        "type": "testimonials",
        "order": 7,
        "props": {
          "title": "What Our Students Say",
          "variant": "grid",
          "testimonials": [
            {
              "name": "Amir Syafiq",
              "role": "Freelance Marketer",
              "quote": "This course completely changed my career. I went from zero knowledge to running paid ads for clients within 2 months. The templates alone are worth the investment!",
              "rating": 5
            },
            {
              "name": "Nurul Aina",
              "role": "Small Business Owner",
              "quote": "As a small business owner, I needed to learn digital marketing fast. The Bundle package gave me everything. My online sales increased by 300% in just 3 months!",
              "rating": 5
            },
            {
              "name": "Kevin Lim",
              "role": "Marketing Executive",
              "quote": "Even as someone already working in marketing, I learnt so many new strategies. The advanced ads module and funnel building section were absolute game changers.",
              "rating": 5
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "dmc-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "centered",
          "headline": "Start Your Digital Marketing Journey Today",
          "description": "Join 5,000+ students who have transformed their careers and businesses. Enroll now and get instant access!",
          "buttonText": "Enroll Now",
          "buttonUrl": "#form_with_payment-5",
          "bgGradient": "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
        }
      },
      {
        "id": "dmc-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "MARKETPRO ACADEMY",
          "description": "Empowering the next generation of digital marketers.",
          "copyright": "2026 MarketPro Academy. All rights reserved.",
          "bgColor": "#1e1b4b",
          "textColor": "#e0e7ff",
          "columns": [
            {
              "title": "Quick Links",
              "links": [
                { "label": "Packages", "url": "#product_carousel-4" },
                { "label": "Enroll Now", "url": "#form_with_payment-5" },
                { "label": "FAQ", "url": "#faq-6" },
                { "label": "Reviews", "url": "#testimonials-7" }
              ]
            },
            {
              "title": "Contact Us",
              "links": [
                { "label": "Email: hello@marketproacademy.com", "url": "mailto:hello@marketproacademy.com" },
                { "label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" },
            { "platform": "youtube", "url": "https://youtube.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "MarketPro Academy - Master Digital Marketing in 30 Days",
      "description": "Learn digital marketing from industry experts. Social media, paid ads, SEO, email marketing, and more. Get certified and transform your career.",
      "keywords": "digital marketing course, online marketing, social media marketing, paid ads, SEO course, marketing certification, learn marketing"
    },
    "theme": {
      "primaryColor": "#4f46e5",
      "fontFamily": "Inter"
    }
  }'::jsonb
);
