-- Frame Perfect Template (Corporate Photography) - Variation 3
-- Theme: Navy Blue, Variants: hero=image_left, features=grid, testimonials=grid, pricing=table
INSERT INTO templates (
  id, name, slug, category, industry, description, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Frame Perfect',
  'frame-perfect',
  'services',
  'Photography',
  'Professional corporate photography services for businesses. Team photos, office shoots, LinkedIn headshots, and annual report imagery.',
  true,
  ARRAY['corporate', 'photography', 'business', 'headshots', 'linkedin', 'team photos', 'professional'],
  '{
    "elements": [
      {
        "id": "frame-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Corporate Packages Now Available - Book Your Team Session Today!",
          "bgColor": "#1e3a5f",
          "textColor": "#e0f2fe",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": false
        }
      },
      {
        "id": "frame-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "FRAME PERFECT",
          "logo": "",
          "menuItems": [
            { "label": "Services", "url": "#pricing-4" },
            { "label": "Why Us", "url": "#features-5" },
            { "label": "Clients", "url": "#testimonials-7" },
            { "label": "Contact", "url": "#form_with_payment-6" }
          ],
          "bgColor": "#f0f9ff",
          "textColor": "#1e3a5f",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Get Quote",
            "url": "#form_with_payment-6"
          }
        }
      },
      {
        "id": "frame-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_left",
          "headline": "Elevate Your Corporate Image",
          "subheadline": "Professional photography services for businesses that understand the power of visual branding. From executive portraits to team photos, we help you look your best.",
          "ctaText": "View Services",
          "ctaUrl": "#pricing-4",
          "image": "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1920&q=80",
          "bgColor": "#f0f9ff",
          "headlineColor": "#1e3a5f",
          "subheadlineColor": "#3b82f6",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 100,
          "buttonBgColor": "#1e3a5f",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "frame-pricing",
        "type": "pricing",
        "order": 4,
        "props": {
          "title": "Corporate Photography Services",
          "subtitle": "Professional solutions for businesses of all sizes",
          "layout": "table",
          "enablePaymentIntegration": false,
          "plans": [
            {
              "name": "Executive Headshots",
              "price": "450",
              "currency": "RM",
              "period": "person",
              "description": "Professional headshots for executives and professionals",
              "features": [
                "30 Minutes Per Person",
                "3 Edited Photos",
                "Multiple Backgrounds",
                "LinkedIn Optimized",
                "Digital Downloads",
                "On-site or Studio"
              ],
              "buttonText": "Book Headshots",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            },
            {
              "name": "Team Package",
              "price": "2,500",
              "currency": "RM",
              "period": "team",
              "description": "Up to 15 team members with individual and group shots",
              "features": [
                "Half Day Session",
                "Individual Headshots",
                "Team Group Photos",
                "Department Photos",
                "5 Photos Per Person",
                "Branded Backgrounds"
              ],
              "buttonText": "Book Team",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": true
            },
            {
              "name": "Enterprise",
              "price": "5,000",
              "currency": "RM",
              "period": "project",
              "description": "Complete corporate photography for large organizations",
              "features": [
                "Full Day Session",
                "Unlimited Team Members",
                "Office Environment Shots",
                "Annual Report Images",
                "Marketing Materials",
                "Video Clips Available"
              ],
              "buttonText": "Contact Us",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            }
          ]
        }
      },
      {
        "id": "frame-features",
        "type": "features",
        "order": 5,
        "props": {
          "title": "Why Frame Perfect for Corporate",
          "variant": "grid",
          "features": [
            {
              "icon": "briefcase",
              "title": "Business Focused",
              "description": "We understand corporate environments. Our photographers are experienced with boardrooms, offices, and professional settings."
            },
            {
              "icon": "clock",
              "title": "Minimal Disruption",
              "description": "Efficient workflows designed to minimize impact on your workday. We work around your schedule."
            },
            {
              "icon": "users",
              "title": "Large Teams Welcome",
              "description": "From startups to enterprises, we have photographed teams of 5 to 500+. Scalable solutions for any size."
            },
            {
              "icon": "building",
              "title": "On-Site Service",
              "description": "We come to you with portable studio equipment. No need to transport your team anywhere."
            },
            {
              "icon": "image",
              "title": "Consistent Quality",
              "description": "Uniform lighting and editing ensures all team photos have a cohesive look for your website and materials."
            },
            {
              "icon": "lock",
              "title": "NDA & Confidentiality",
              "description": "We respect corporate privacy. NDA available upon request for sensitive locations and personnel."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "frame-form-payment",
        "type": "form_with_payment",
        "order": 6,
        "props": {
          "title": "Request Corporate Photography Quote",
          "description": "Tell us about your requirements and we will prepare a customized proposal for your organization.",
          "submitButtonText": "Submit Inquiry",
          "submitButtonColor": "#1e3a5f",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "corp-headshots",
              "name": "Executive Headshots (1-5 persons)",
              "description": "Individual professional headshots",
              "price": 450
            },
            {
              "id": "corp-team",
              "name": "Team Package (up to 15 persons)",
              "description": "Individual + group photos",
              "price": 2500,
              "featured": true
            },
            {
              "id": "corp-enterprise",
              "name": "Enterprise (Custom Quote)",
              "description": "Full corporate coverage - we will contact you",
              "price": 500
            }
          ],
          "currency": "MYR",
          "bgColor": "#f0f9ff",
          "companyName": "Frame Perfect Corporate Photography",
          "companyRegistration": ""
        }
      },
      {
        "id": "frame-testimonials",
        "type": "testimonials",
        "order": 7,
        "props": {
          "title": "Trusted by Leading Companies",
          "variant": "grid",
          "testimonials": [
            {
              "name": "PETRONAS",
              "role": "HR Department",
              "quote": "Frame Perfect handled our executive team photography with utmost professionalism. The quality and efficiency were exceptional.",
              "rating": 5
            },
            {
              "name": "Grab Malaysia",
              "role": "Marketing Team",
              "quote": "We needed photos for our annual report and website refresh. They delivered stunning results on a tight timeline.",
              "rating": 5
            },
            {
              "name": "Deloitte MY",
              "role": "Office Management",
              "quote": "Over 200 staff headshots completed in just 2 days. Minimal disruption to operations and consistent quality across all photos.",
              "rating": 5
            },
            {
              "name": "Sunway Group",
              "role": "Corporate Communications",
              "quote": "Professional, punctual, and perfectly aligned with our brand guidelines. Highly recommend for any corporate photography needs.",
              "rating": 5
            },
            {
              "name": "Bank Negara Malaysia",
              "role": "Communications Division",
              "quote": "The team was respectful of our security protocols and delivered high-quality images suitable for official publications.",
              "rating": 5
            },
            {
              "name": "AirAsia",
              "role": "People Team",
              "quote": "Fun, efficient, and the photos captured our company culture perfectly. Our LinkedIn pages have never looked better!",
              "rating": 5
            }
          ],
          "bgColor": "#f0f9ff"
        }
      },
      {
        "id": "frame-whatsapp",
        "type": "whatsapp_button",
        "order": 8,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I would like to inquire about corporate photography services for my company. Can you provide more information?",
          "buttonText": "WhatsApp Us",
          "buttonColor": "#25D366",
          "buttonSize": "md",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true
        }
      },
      {
        "id": "frame-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "Frame Perfect",
          "description": "Professional corporate photography solutions",
          "copyright": "2026 Frame Perfect Photography. All rights reserved.",
          "bgColor": "#1e3a5f",
          "textColor": "#e0f2fe",
          "columns": [
            {
              "title": "Services",
              "links": [
                { "label": "Executive Headshots", "url": "#pricing-4" },
                { "label": "Team Photography", "url": "#pricing-4" },
                { "label": "Office Shoots", "url": "#pricing-4" },
                { "label": "Annual Reports", "url": "#pricing-4" }
              ]
            },
            {
              "title": "Company",
              "links": [
                { "label": "About Us", "url": "#features-5" },
                { "label": "Our Clients", "url": "#testimonials-7" },
                { "label": "Contact", "url": "#form_with_payment-6" },
                { "label": "Portfolio", "url": "#" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "linkedin", "url": "https://linkedin.com" },
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Frame Perfect - Professional Corporate Photography Services",
      "description": "Elevate your corporate image with professional photography. Executive headshots, team photos, office shoots, and annual report imagery for businesses.",
      "keywords": "corporate photography, business headshots, linkedin photos, team photography, executive portraits, office photography malaysia"
    },
    "theme": {
      "primaryColor": "#1e3a5f",
      "fontFamily": "Inter"
    }
  }'::jsonb
);
