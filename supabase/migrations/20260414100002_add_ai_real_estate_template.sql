-- AI Real Estate Template
-- Theme: Modern green, Satoshi typography
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'AI Real Estate',
  'ai-real-estate',
  'realestate',
  'Real Estate',
  'Premium AI-driven real estate investment platform with blockchain-secured transactions, property analytics, and luxury property listings.',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
  true,
  ARRAY['real estate', 'property', 'luxury', 'ai', 'investment', 'blockchain', 'dubai'],
  '{
    "elements": [
      {
        "type": "re-navigation",
        "order": 0,
        "props": {
          "brand": "Nexora",
          "logoIcon": "triangle",
          "menuItems": [
            { "label": "Discover", "url": "#featured" },
            { "label": "Projects", "url": "#projects" },
            { "label": "Insights", "url": "#insights" },
            { "label": "Contact", "url": "#contact" }
          ],
          "ctaText": "Connect",
          "ctaUrl": "#contact"
        }
      },
      {
        "type": "re-hero",
        "order": 1,
        "props": {
          "headline": "AI Driven Real Estate\nInvestments Opportunities",
          "cta1Text": "Explore",
          "cta1Url": "#featured",
          "cta2Text": "Talk to us",
          "cta2Url": "#contact",
          "bgImage": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=80",
          "searchPlaceholder": "Search by location, property type...",
          "searchFilters": ["Buy", "Rent", "Invest"]
        }
      },
      {
        "type": "re-intro",
        "order": 2,
        "props": {
          "text": "We are a next-generation platform combining AI-driven property analytics and blockchain-secured transactions to revolutionize the real estate investment process",
          "ctaText": "Learn More",
          "ctaUrl": "#featured",
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "re-featured-projects",
        "order": 3,
        "props": {
          "title": "Featured Projects",
          "totalCount": "479",
          "totalLabel": "Listed Properties",
          "filters": ["All", "Villa", "Apartment", "Penthouse", "Townhouse"],
          "bgColor": "#f8f8f8",
          "projects": [
            {
              "title": "Modern studio in Bluewaters Bay",
              "location": "Bluewaters Island",
              "price": "$4,200,000",
              "image": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
              "tag": "Premium",
              "number": "01",
              "beds": "3",
              "baths": "2",
              "sqft": "2,450",
              "description": "A stunning modern studio with panoramic views of the Dubai skyline and direct Bluewaters Bay access."
            },
            {
              "title": "Luxury Penthouse Suite",
              "location": "Downtown Dubai",
              "price": "$8,900,000",
              "image": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
              "tag": "Exclusive",
              "number": "02",
              "beds": "5",
              "baths": "4",
              "sqft": "6,800",
              "description": "An expansive penthouse with unobstructed Burj Khalifa views."
            },
            {
              "title": "Beachfront Villa Estate",
              "location": "Jumeirah Beach",
              "price": "$12,500,000",
              "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
              "tag": "New",
              "number": "03",
              "beds": "8",
              "baths": "6",
              "sqft": "12,200",
              "description": "A magnificent beachfront estate with direct beach access."
            },
            {
              "title": "Creek Harbour Elegance",
              "location": "Dubai Creek Harbour",
              "price": "$3,100,000",
              "image": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
              "tag": "Hot",
              "number": "04",
              "beds": "2",
              "baths": "2",
              "sqft": "1,850",
              "description": "An elegant waterfront residence overlooking Dubai Creek Tower."
            }
          ]
        }
      },
      {
        "type": "re-property-detail",
        "order": 4,
        "props": {
          "bgColor": "#111111",
          "title": "8-Bedroom Waterfront Villa with Luxurious Design and Stunning Sea Views",
          "price": "$9,500,000",
          "location": "Palm Jumeirah, Dubai",
          "bedrooms": 8,
          "bathrooms": 10,
          "area": "15,000 sqft",
          "type": "Villa",
          "mainImage": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80",
          "thumbImages": [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&q=80",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&q=80"
          ],
          "features": [
            { "icon": "pool", "label": "Private Pool" },
            { "icon": "parking", "label": "Parking" },
            { "icon": "master", "label": "Master Suite" },
            { "icon": "gym", "label": "Private Gym" },
            { "icon": "garden", "label": "Garden" },
            { "icon": "security", "label": "24/7 Security" }
          ],
          "details": [
            { "label": "Year Built", "value": "2024" },
            { "label": "Lot Size", "value": "20,000 sqft" },
            { "label": "Garage", "value": "4 Cars" },
            { "label": "Condition", "value": "New" }
          ]
        }
      },
      {
        "type": "re-gallery",
        "order": 5,
        "props": {
          "bgColor": "#f8f8f8",
          "images": [
            { "url": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&q=80", "alt": "Living Room" },
            { "url": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&q=80", "alt": "Pool View" },
            { "url": "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=500&q=80", "alt": "Kitchen" },
            { "url": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500&q=80", "alt": "Bedroom" },
            { "url": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&q=80", "alt": "Bathroom" },
            { "url": "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=500&q=80", "alt": "Exterior" }
          ]
        }
      },
      {
        "type": "re-leadership",
        "order": 7,
        "props": {
          "title": "Leadership",
          "bgColor": "#ffffff",
          "members": [
            {
              "name": "Sophia Patel",
              "role": "CEO & Co-Founder",
              "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80",
              "bio": "Specializes in high-yield investment opportunities with a client-first approach.",
              "experience": "12 years",
              "focus": "Dubai Marina,\nBluewaters Island"
            },
            {
              "name": "James Miller",
              "role": "Chief Investment Officer",
              "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80",
              "bio": "Drives portfolio strategy and oversees high-value property acquisitions across the UAE.",
              "experience": "15 years",
              "focus": "Palm Jumeirah,\nDowntown Dubai"
            },
            {
              "name": "Ayesha Rahman",
              "role": "Head of Analytics",
              "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80",
              "bio": "Leads AI-powered market analysis and predictive valuation models.",
              "experience": "9 years",
              "focus": "Business Bay,\nJumeirah Village"
            }
          ]
        }
      },
      {
        "type": "re-partners",
        "order": 8,
        "props": {
          "title": "Our valued partners",
          "bgColor": "#ffffff",
          "partners": ["BRAAS", "JAMANIC", "EMAAR", "THE CROWN", "SOBHA"]
        }
      },
      {
        "type": "re-insights",
        "order": 9,
        "props": {
          "title": "Latest Insights",
          "bgColor": "#ffffff",
          "categories": ["Buysell", "Interior Design", "Rendering", "Finance"],
          "articles": [
            { "title": "Smart Investments: How AI is Reshaping Dubai Real Estate in 2026", "category": "Buysell", "date": "Mar 15, 2026", "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80" },
            { "title": "Minimalist Luxury: Interior Design Trends for Modern Villas", "category": "Interior Design", "date": "Mar 10, 2026", "image": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80" },
            { "title": "3D Rendering: The Future of Property Visualization", "category": "Rendering", "date": "Mar 05, 2026", "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80" }
          ]
        }
      },
      {
        "type": "re-testimonials",
        "order": 10,
        "props": {
          "title": "What Our Clients Say",
          "bgColor": "#ffffff",
          "reviewCount": "125+",
          "testimonials": [
            { "name": "James", "role": "Dubai, December 2024", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", "quote": "Working with this team was an absolute pleasure. They helped me find the perfect property." },
            { "name": "Sarah", "role": "Abu Dhabi, November 2024", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", "quote": "Exceptional service from start to finish. The AI-powered property recommendations were incredibly accurate." },
            { "name": "Michael", "role": "Dubai Marina, October 2024", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80", "quote": "As an international investor, I needed a team that understood cross-border transactions." }
          ]
        }
      },
      {
        "type": "re-contact",
        "order": 11,
        "props": {
          "title": "Complete this form\nto contact our team",
          "bgColor": "#ffffff",
          "fields": [
            { "name": "firstName", "label": "First name", "type": "text", "placeholder": "Your first name" },
            { "name": "lastName", "label": "Last name", "type": "text", "placeholder": "Your last name" },
            { "name": "email", "label": "Email", "type": "email", "placeholder": "email@example.com" },
            { "name": "phone", "label": "Phone number", "type": "tel", "placeholder": "+971 XX XXX XXXX" },
            { "name": "propertyType", "label": "Property Type", "type": "select", "options": ["Villa", "Apartment", "Penthouse", "Townhouse", "Commercial"] },
            { "name": "budget", "label": "Budget Range", "type": "select", "options": ["$500K - $1M", "$1M - $3M", "$3M - $5M", "$5M - $10M", "$10M+"] }
          ],
          "buttonText": "Submit",
          "note": "Subscribe to our news",
          "mapCenter": "Dubai, UAE"
        }
      },
      {
        "type": "re-footer",
        "order": 12,
        "props": {
          "brand": "Nexora",
          "tagline": "We are here to change\nthe real estate world",
          "columns": [
            { "title": "Navigation", "links": [{ "label": "Home", "url": "#" }, { "label": "Projects", "url": "#projects" }, { "label": "About", "url": "#about" }, { "label": "Contact", "url": "#contact" }] },
            { "title": "Properties", "links": [{ "label": "Featured", "url": "#featured" }, { "label": "New Listings", "url": "#" }, { "label": "Dubai Marina", "url": "#" }, { "label": "Palm Jumeirah", "url": "#" }] },
            { "title": "Legal", "links": [{ "label": "Privacy Policy", "url": "#" }, { "label": "Terms of Service", "url": "#" }, { "label": "Cookie Policy", "url": "#" }] }
          ],
          "socials": [
            { "platform": "instagram", "url": "#" },
            { "platform": "twitter", "url": "#" },
            { "platform": "linkedin", "url": "#" },
            { "platform": "facebook", "url": "#" }
          ],
          "copyright": "© 2026 Nexora. All rights reserved."
        }
      }
    ],
    "seo_settings": {
      "title": "Nexora — AI Driven Real Estate Investments",
      "description": "Next-generation platform combining AI-driven property analytics and blockchain-secured transactions to revolutionize real estate investment."
    },
    "theme": {
      "primaryColor": "#1a6b4f",
      "fontFamily": "Satoshi"
    }
  }'
);
