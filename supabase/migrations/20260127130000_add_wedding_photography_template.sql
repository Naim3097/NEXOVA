-- Wedding Photography Template
INSERT INTO templates (
  id, name, slug, category, industry, description, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Wedding Photography',
  'wedding-photography',
  'services',
  'Photography',
  'Professional wedding photography service page with packages, portfolio showcase, booking form, and payment integration.',
  true,
  ARRAY['wedding', 'photography', 'services', 'packages', 'booking', 'portfolio'],
  '{
    "elements": [
      {
        "id": "wedding-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Book Your Dream Wedding Photography - Limited Slots Available for 2026!",
          "bgColor": "#1a1a2e",
          "textColor": "#e8d5b7",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": false
        }
      },
      {
        "id": "wedding-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "ETERNAL FRAMES",
          "logo": "",
          "menuItems": [
            { "label": "Home", "url": "#hero-2" },
            { "label": "Packages", "url": "#pricing-4" },
            { "label": "Why Us", "url": "#features-5" },
            { "label": "Book Now", "url": "#form_with_payment-6" },
            { "label": "Reviews", "url": "#testimonials-7" }
          ],
          "bgColor": "#ffffff",
          "textColor": "#1a1a2e",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Book Now",
            "url": "#form_with_payment-6"
          }
        }
      },
      {
        "id": "wedding-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Capturing Your Forever Moments",
          "subheadline": "Professional wedding photography that tells your unique love story. Every glance, every tear of joy, every dance move - beautifully preserved for generations.",
          "ctaText": "View Our Packages",
          "ctaUrl": "#pricing-4",
          "image": "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
          "bgColor": "#1a1a2e",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e2e8f0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 50,
          "buttonBgColor": "#8b5e3c",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "wedding-pricing",
        "type": "pricing",
        "order": 4,
        "props": {
          "title": "Our Wedding Packages",
          "subtitle": "Choose the perfect package to capture every beautiful moment of your special day",
          "layout": "cards",
          "enablePaymentIntegration": false,
          "plans": [
            {
              "name": "Essential",
              "price": "2,500",
              "currency": "RM",
              "period": "event",
              "description": "Perfect for intimate weddings and solemnization ceremonies",
              "image": "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
              "features": [
                "4 Hours Coverage",
                "1 Photographer",
                "100+ Edited Photos",
                "Online Gallery",
                "Digital Downloads",
                "Pre-Wedding Consultation"
              ],
              "buttonText": "Choose Essential",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            },
            {
              "name": "Premium",
              "price": "4,500",
              "currency": "RM",
              "period": "event",
              "description": "Complete coverage for your wedding ceremony and reception",
              "image": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
              "features": [
                "8 Hours Full Day Coverage",
                "2 Photographers",
                "300+ Edited Photos",
                "Online Gallery + USB Drive",
                "Engagement Photo Session",
                "Wedding Day Timeline Planning",
                "Same-Day Photo Preview"
              ],
              "buttonText": "Choose Premium",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": true
            },
            {
              "name": "Luxury",
              "price": "8,000",
              "currency": "RM",
              "period": "event",
              "description": "The ultimate wedding photography experience with videography",
              "image": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
              "features": [
                "12 Hours Full Coverage",
                "2 Photographers + 1 Videographer",
                "500+ Edited Photos",
                "Cinematic Wedding Film (5-10 min)",
                "Premium Photo Album (40 pages)",
                "Drone Aerial Photography",
                "Pre-Wedding Photo + Video Session",
                "Next-Day Edit Highlight Reel"
              ],
              "buttonText": "Choose Luxury",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            }
          ]
        }
      },
      {
        "id": "wedding-features",
        "type": "features",
        "order": 5,
        "props": {
          "title": "Why Choose Eternal Frames",
          "variant": "grid",
          "features": [
            {
              "icon": "sparkles",
              "title": "Award-Winning Photography",
              "description": "Our team has been recognized with multiple photography awards for creative wedding storytelling.",
              "image": "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80"
            },
            {
              "icon": "heart",
              "title": "Candid & Natural Style",
              "description": "We specialize in capturing genuine emotions and spontaneous moments that make your day unique.",
              "image": "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80"
            },
            {
              "icon": "clock",
              "title": "Quick Turnaround",
              "description": "Receive your beautifully edited photos within 2-4 weeks. Same-day previews available for premium packages.",
              "image": "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80"
            },
            {
              "icon": "users",
              "title": "Experienced Team",
              "description": "Over 500 weddings photographed with a team that understands every cultural tradition and ceremony.",
              "image": "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80"
            },
            {
              "icon": "shield",
              "title": "Backup & Security",
              "description": "Triple backup system ensures your precious memories are never lost. Cloud storage included for 1 year.",
              "image": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80"
            },
            {
              "icon": "star",
              "title": "5-Star Reviews",
              "description": "Consistently rated 5 stars by our couples. Read real testimonials from happy newlyweds.",
              "image": "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&q=80"
            }
          ]
        }
      },
      {
        "id": "wedding-form-payment",
        "type": "form_with_payment",
        "order": 6,
        "props": {
          "title": "Book Your Wedding Photography",
          "description": "Secure your date with a deposit. Fill in your details and select your preferred package.",
          "submitButtonText": "Book & Pay Deposit",
          "submitButtonColor": "#8b5e3c",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "wedding-essential",
              "name": "Essential Package - Deposit",
              "description": "4 Hours, 1 Photographer, 100+ Photos",
              "price": 500
            },
            {
              "id": "wedding-premium",
              "name": "Premium Package - Deposit",
              "description": "8 Hours, 2 Photographers, 300+ Photos, Engagement Session",
              "price": 1000,
              "featured": true
            },
            {
              "id": "wedding-luxury",
              "name": "Luxury Package - Deposit",
              "description": "12 Hours, Photo + Video, Album, Drone, Pre-Wedding Session",
              "price": 2000
            }
          ],
          "currency": "MYR",
          "bgColor": "#faf7f2",
          "companyName": "Eternal Frames Photography",
          "companyRegistration": ""
        }
      },
      {
        "id": "wedding-testimonials",
        "type": "testimonials",
        "order": 7,
        "props": {
          "title": "What Our Couples Say",
          "variant": "grid",
          "testimonials": [
            {
              "name": "Sarah & Ahmad",
              "role": "Married Dec 2025",
              "quote": "Eternal Frames captured every emotion perfectly. From the nervous moments before the ceremony to the joyful celebrations at the reception. The photos are absolutely stunning!",
              "rating": 5
            },
            {
              "name": "Lisa & Daniel",
              "role": "Married Oct 2025",
              "quote": "We chose the Premium package and it was worth every penny. The engagement session was so much fun, and the wedding photos exceeded our expectations. Highly recommend!",
              "rating": 5
            },
            {
              "name": "Nurul & Faiz",
              "role": "Married Aug 2025",
              "quote": "The team was professional, friendly, and made us feel completely comfortable. They understood our cultural traditions perfectly and captured beautiful moments we will treasure forever.",
              "rating": 5
            },
            {
              "name": "Emily & James",
              "role": "Married Jun 2025",
              "quote": "We went with the Luxury package including videography. The cinematic wedding film made us cry happy tears all over again. The drone shots of our outdoor ceremony were breathtaking!",
              "rating": 5
            },
            {
              "name": "Priya & Raj",
              "role": "Married Apr 2025",
              "quote": "Having two photographers meant no moment was missed. While one captured the bride getting ready, the other was with the groom. The parallel storytelling in our album is incredible.",
              "rating": 5
            },
            {
              "name": "Aisha & Hafiz",
              "role": "Married Feb 2025",
              "quote": "From the pre-wedding shoot to the reception, everything was handled seamlessly. The quick turnaround meant we could share photos with family within weeks. Absolutely wonderful experience!",
              "rating": 5
            }
          ]
        }
      },
      {
        "id": "wedding-whatsapp",
        "type": "whatsapp_button",
        "order": 8,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I am interested in your wedding photography services. I would like to know more about your packages.",
          "buttonText": "Chat With Us",
          "buttonColor": "#25D366",
          "buttonSize": "md",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true
        }
      },
      {
        "id": "wedding-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "Eternal Frames Photography",
          "description": "Capturing love stories, one frame at a time",
          "copyright": "2026 Eternal Frames Photography. All rights reserved.",
          "bgColor": "#1a1a2e",
          "textColor": "#e8d5b7",
          "columns": [
            {
              "title": "Quick Links",
              "links": [
                { "label": "Packages", "url": "#pricing-4" },
                { "label": "Why Choose Us", "url": "#features-5" },
                { "label": "Book Now", "url": "#form_with_payment-6" },
                { "label": "Reviews", "url": "#testimonials-7" }
              ]
            },
            {
              "title": "Services",
              "links": [
                { "label": "Wedding Photography", "url": "#" },
                { "label": "Pre-Wedding Shoot", "url": "#" },
                { "label": "Engagement Session", "url": "#" },
                { "label": "Videography", "url": "#" }
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
      "title": "Eternal Frames - Professional Wedding Photography",
      "description": "Capture your dream wedding with our professional photography services. From intimate ceremonies to grand celebrations, we tell your love story beautifully.",
      "keywords": "wedding photography, wedding photographer, wedding packages, bridal photography, engagement photos, wedding videography"
    },
    "theme": {
      "primaryColor": "#8b5e3c",
      "fontFamily": "Playfair Display, serif"
    }
  }'::jsonb
);
