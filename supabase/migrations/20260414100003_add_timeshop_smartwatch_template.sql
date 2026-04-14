-- Timeshop Smartwatch Template (E-commerce)
-- Theme: Green accent, Inter typography
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Timeshop — Digital Smartwatch',
  'timeshop-smartwatch',
  'ecommerce',
  'Consumer Electronics',
  'A sleek e-commerce landing page for selling digital smartwatches. Includes hero, product grid, feature showcase, limited-time offers, video demo, testimonials, and footer.',
  'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=1200&h=800&fit=crop',
  true,
  ARRAY['smartwatch', 'ecommerce', 'electronics', 'wearable', 'modern', 'green'],
  '{
    "elements": [
      {
        "type": "sw-navigation",
        "order": 0,
        "props": {
          "logo": "Timeshop",
          "links": [
            { "label": "Home", "href": "#" },
            { "label": "Feature", "href": "#features" },
            { "label": "Product", "href": "#products" },
            { "label": "Contact", "href": "#contact" }
          ],
          "ctaText": "Buy Now"
        }
      },
      {
        "type": "sw-hero",
        "order": 1,
        "props": {
          "headline": "Digital Watches\nThat Are Best For",
          "highlight": "Daily Use",
          "description": "Every man needs a good, solid watch. Our smartwatches combine premium craftsmanship with cutting-edge technology for your everyday lifestyle.",
          "ctaText": "Explore More",
          "ctaUrl": "#products",
          "badge": "Get Up To 65% Off",
          "image": "/images/smartwatch/hero-smart-watch.png"
        }
      },
      {
        "type": "sw-features",
        "order": 2,
        "props": {
          "features": [
            { "icon": "shipping", "title": "Free Shipping", "description": "Free Shipping On All Online Orders" },
            { "icon": "support", "title": "24/7 Support", "description": "Contact us any time for your problems" },
            { "icon": "secure", "title": "Secure Payment", "description": "Enjoy secure and worry-free transactions" }
          ]
        }
      },
      {
        "type": "sw-products",
        "order": 3,
        "props": {
          "subtitle": "Our Product",
          "headline": "Take Our Product",
          "description": "We provide marketing services to startups and small businesses looking for a partner for their digital media.",
          "products": [
            { "name": "Pulse Pro X1", "color": "Color: Ocean Blue", "image": "/images/smartwatch/watch-1.jpg", "price": "$70", "rating": 4.5, "reviews": 192 },
            { "name": "Chrono Lite S3", "color": "Color: Midnight", "image": "/images/smartwatch/watch-2.jpg", "price": "$200", "rating": 5, "reviews": 201 },
            { "name": "Aura Fit Band", "color": "Color: Sleek Silver", "image": "/images/smartwatch/watch-3.jpg", "price": "$120", "rating": 4.5, "reviews": 192 },
            { "name": "Zenith Gold 44", "color": "Color: Rose Gold", "image": "/images/smartwatch/watch-4.jpg", "price": "$150", "rating": 4.5, "reviews": 76 },
            { "name": "Nova Sport SE", "color": "Color: Forest Green", "image": "/images/smartwatch/watch-5.jpg", "price": "$70", "rating": 5, "reviews": 143 },
            { "name": "Titan Classic 7", "color": "Color: Jet Black", "image": "/images/smartwatch/watch-6.jpg", "price": "$110", "rating": 5, "reviews": 143 }
          ]
        }
      },
      {
        "type": "sw-showcase",
        "order": 4,
        "props": {
          "subtitle": "Smart Watch",
          "headline": "For Easy Living, Get The Best &\nFashionable Smartwatch",
          "description": "Experience cutting-edge wearable technology with premium materials and advanced health monitoring.",
          "image": "/images/smartwatch/green-watch.png",
          "specs": [
            { "label": "Eye Protection Level", "value": "OHLC/Offer" },
            { "label": "Case Material", "value": "Carbon Fibre" },
            { "label": "Battery Lifetime(hr)", "value": "48 hrs" },
            { "label": "Band Material", "value": "Silicone" },
            { "label": "App Download Available", "value": "Yes" },
            { "label": "Network", "value": "Mobile 4G" },
            { "label": "Movement Type", "value": "Electronic" },
            { "label": "Battery Capacity", "value": "300–450 mAh" },
            { "label": "Application Age", "value": "Group Adult" },
            { "label": "Compatibility", "value": "All Compatible" }
          ]
        }
      },
      {
        "type": "sw-choice",
        "order": 5,
        "props": {
          "headline": "Choice Our Best & Fashionable\nProducts",
          "description": "Experience cutting-edge wearable technology with premium materials and advanced health monitoring.",
          "image": "/images/smartwatch/green-watch-2.png",
          "checks": ["1 Year Warranty", "Authentic Product", "Return Policy", "Dedicated Support", "Free Shipping"]
        }
      },
      {
        "type": "sw-offer",
        "order": 6,
        "props": {
          "subtitle": "Limited Time Offer",
          "headline": "Discount 50% On All SX40 Model Product",
          "description": "Don''t miss out on our biggest sale of the year. Premium smartwatches at unbeatable prices.",
          "products": [
            { "name": "Sport Watch Pro", "image": "/images/smartwatch/watch-discount-1.png", "badge": "Sell 45% Off" },
            { "name": "Classic Digital", "image": "/images/smartwatch/watch-discount-2.png", "badge": "Sell 45% Off" },
            { "name": "Fitness Tracker", "image": "/images/smartwatch/watch-discount-3.png", "badge": "Sell 45% Off" }
          ]
        }
      },
      {
        "type": "sw-video",
        "order": 7,
        "props": {
          "subtitle": "Product Demo",
          "headline": "Get Product More Information From The Video",
          "description": "Watch our detailed product demo to discover all the features and capabilities of our premium smartwatch collection.",
          "thumbnail": "https://images.unsplash.com/photo-1510017803350-6a63e12b1f04?w=900&q=80",
          "video": "/images/smartwatch/smartwatch-demo.mp4"
        }
      },
      {
        "type": "sw-testimonials",
        "order": 8,
        "props": {
          "subtitle": "Our Testimonial",
          "headline": "Our Testimonial",
          "description": "See what our customers have to say about their experience with our premium smartwatch collection.",
          "testimonials": [
            { "name": "Jenny Willson", "role": "Customer", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", "rating": 5, "quote": "First quick result from multiple sources, quick results and select far required into a result. People can feel exclusive about the premium quality of this watch." },
            { "name": "Juliet Martinez", "role": "Customer", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", "rating": 5, "quote": "First quick result from multiple sources, quick results and select far required into a result. People can feel exclusive about the premium quality of this watch." },
            { "name": "David Conner", "role": "Customer", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", "rating": 5, "quote": "First quick result from multiple sources, quick results and select far required into a result. People can feel exclusive about the premium quality of this watch." }
          ]
        }
      },
      {
        "type": "sw-footer",
        "order": 9,
        "props": {
          "logo": "Timeshop",
          "tagline": "Premium digital smartwatches crafted for modern living. Style meets technology.",
          "phone": "+44 123 654 7890",
          "columns": [
            { "title": "Links", "links": [{ "label": "About Us", "href": "#" }, { "label": "Choose Us", "href": "#" }, { "label": "Products", "href": "#products" }, { "label": "Offer", "href": "#offer" }] },
            { "title": "Support", "links": [{ "label": "Help Center", "href": "#" }, { "label": "Partner", "href": "#" }, { "label": "Suggestions", "href": "#" }, { "label": "Support Center", "href": "#" }, { "label": "News", "href": "#" }] },
            { "title": "Info", "links": [{ "label": "Contact", "href": "#contact" }, { "label": "FAQ", "href": "#" }, { "label": "Privacy & Policy", "href": "#" }, { "label": "Co Omille Road Apt.728", "href": "#" }, { "label": "California, USA", "href": "#" }] }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Timeshop — Digital Smartwatch Store",
      "description": "Premium digital smartwatches for daily use. Free shipping, secure payments, and 24/7 support."
    },
    "theme": {
      "primaryColor": "#00b894",
      "fontFamily": "Inter"
    }
  }'
);
