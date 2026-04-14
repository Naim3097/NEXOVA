-- Citra Raya Template (E-commerce) - Variation 3
-- Theme: Royal Blue, Variants: hero=image_bg, features=grid, testimonials=grid, faq=two_column, cta=centered
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Citra Raya',
  'citra-raya',
  'ecommerce',
  'Food & Beverage',
  'Template e-dagang premium dengan tema biru diraja untuk menjual biskut raya eksklusif. Reka bentuk mewah dan profesional.',
  'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&h=800&fit=crop',
  true,
  ARRAY['citra raya', 'london almond', 'biskut mazola', 'biskut suji', 'raya', 'ecommerce', 'premium', 'malaysia'],
  '{
    "elements": [
      {
        "id": "citra-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Koleksi Eksklusif Raya 2026 - Edisi Terhad, Tempah Sebelum Kehabisan!",
          "bgColor": "#1e3a8a",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Stok tamat dalam:",
          "countdownEndDate": "2026-03-01T23:59:59"
        }
      },
      {
        "id": "citra-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "CITRA RAYA",
          "logo": "",
          "menuItems": [
            { "label": "Koleksi", "url": "#product_carousel-4" },
            { "label": "Testimoni", "url": "#testimonials-6" },
            { "label": "FAQ", "url": "#faq-7" }
          ],
          "bgColor": "#eff6ff",
          "textColor": "#1e3a8a",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Beli Sekarang",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "citra-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Koleksi Eksklusif Citra Raya",
          "subheadline": "Biskut premium untuk tetamu istimewa. Diperbuat dengan bahan import berkualiti tinggi untuk pengalaman rasa yang tiada tandingan.",
          "ctaText": "Jelajah Koleksi",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1920&q=80",
          "bgColor": "#eff6ff",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#bfdbfe",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 60,
          "buttonBgColor": "#1e3a8a",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "citra-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Kelebihan Citra Raya",
          "variant": "grid",
          "features": [
            {
              "icon": "gem",
              "title": "Bahan Import Premium",
              "description": "Mentega Anchor, badam California, tepung Jepun - hanya yang terbaik untuk biskut kami."
            },
            {
              "icon": "award",
              "title": "Pemenang Anugerah",
              "description": "Pemenang Anugerah Biskut Raya Terbaik 2024 & 2025. Kualiti yang diiktiraf."
            },
            {
              "icon": "sparkles",
              "title": "Reka Bentuk Eksklusif",
              "description": "Setiap biskut direka dengan teliti untuk penampilan yang cantik dan menarik."
            },
            {
              "icon": "box",
              "title": "Pembungkusan Mewah",
              "description": "Kotak hadiah premium dengan ribbon emas. Sempurna untuk majlis rasmi dan hadiah VIP."
            },
            {
              "icon": "shield",
              "title": "Jaminan Kualiti",
              "description": "Setiap pesanan diperiksa dengan teliti sebelum penghantaran. Kepuasan dijamin."
            },
            {
              "icon": "clock",
              "title": "Fresh Made Daily",
              "description": "Biskut dibuat segar setiap hari mengikut pesanan. Tiada stok lama."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "citra-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Koleksi Premium",
          "subtitle": "Biskut eksklusif dengan bahan import untuk pengalaman rasa yang tiada duanya.",
          "cardStyle": "shadow",
          "products": [
            {
              "id": "london-almond",
              "code": "CR-001",
              "name": "London Almond",
              "description": "Biskut mentega premium dengan taburan badam California panggang. Rangup di luar, lembut di dalam. Bestseller kami!",
              "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop",
              "base_price": 45,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "biskut-mazola",
              "code": "CR-002",
              "name": "Biskut Mazola",
              "description": "Biskut klasik dengan rasa mentega yang pekat. Diperbuat daripada mentega tulen 100% tanpa minyak sayuran.",
              "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
              "base_price": 38,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "biskut-suji",
              "code": "CR-003",
              "name": "Biskut Suji Premium",
              "description": "Biskut suji lembut dengan tekstur yang unik. Diperbuat daripada suji import dan ghee tulen. Cair di mulut!",
              "image_url": "https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=600&h=400&fit=crop",
              "base_price": 42,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#eff6ff"
        }
      },
      {
        "id": "citra-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Borang Tempahan Eksklusif",
          "description": "Lengkapkan maklumat anda untuk menikmati koleksi premium Citra Raya.",
          "nameLabel": "Nama Penuh",
          "mobileLabel": "No. Telefon",
          "emailLabel": "Email",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": false,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "london-almond",
              "name": "London Almond",
              "description": "1 balang premium (40 biji)",
              "price": 45
            },
            {
              "id": "biskut-mazola",
              "name": "Biskut Mazola",
              "description": "1 balang premium (45 biji)",
              "price": 38
            },
            {
              "id": "biskut-suji",
              "name": "Biskut Suji Premium",
              "description": "1 balang premium (40 biji)",
              "price": 42
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Teruskan Pembayaran",
          "submitButtonColor": "#1e3a8a",
          "bgColor": "#ffffff",
          "companyName": "Citra Raya",
          "companyRegistration": ""
        }
      },
      {
        "id": "citra-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "Testimoni Pelanggan VIP",
          "variant": "grid",
          "testimonials": [
            {
              "name": "Dato Hamzah",
              "role": "CEO, Syarikat Hartanah",
              "quote": "Setiap tahun order untuk bagi clients dan partners. London Almond memang first class! Packaging pun impressive.",
              "rating": 5
            },
            {
              "name": "Datin Normah",
              "role": "Bangsar",
              "quote": "Biskut Citra Raya memang premium quality. Tetamu rumah terbuka semua impressed. Worth every sen!",
              "rating": 5
            },
            {
              "name": "Puan Marina",
              "role": "Event Planner",
              "quote": "Saya recommend Citra Raya untuk semua client saya. Kualiti konsisten dan presentation memang tip-top.",
              "rating": 5
            }
          ],
          "bgColor": "#eff6ff"
        }
      },
      {
        "id": "citra-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Soalan Lazim",
          "variant": "two_column",
          "questions": [
            {
              "question": "Apa yang membuat Citra Raya berbeza?",
              "answer": "Kami hanya menggunakan bahan import berkualiti premium seperti mentega Anchor, badam California, dan tepung Jepun. Setiap biskut dibuat dengan teliti."
            },
            {
              "question": "Berapa lama biskut boleh tahan?",
              "answer": "Biskut kami tahan 4-6 minggu dalam bekas asal yang kedap udara. Disimpan di tempat sejuk dan kering."
            },
            {
              "question": "Ada pilihan corporate gift?",
              "answer": "Ya! Kami menawarkan pakej korporat dengan pembungkusan eksklusif, kad ucapan custom, dan diskaun untuk pesanan pukal."
            },
            {
              "question": "Boleh customise hamper?",
              "answer": "Boleh! Hubungi kami untuk mereka hamper mengikut bajet dan citarasa anda. Minimum 10 set untuk customisation."
            },
            {
              "question": "Bagaimana dengan penghantaran?",
              "answer": "Penghantaran percuma untuk semua pesanan. Express delivery (same day) tersedia untuk Klang Valley dengan caj tambahan RM15."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "citra-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "centered",
          "headline": "Tempah Koleksi Eksklusif Anda",
          "description": "Nikmati biskut premium berkualiti tinggi untuk Hari Raya yang istimewa. Edisi terhad - tempah sekarang!",
          "buttonText": "Beli Sekarang",
          "buttonUrl": "#form_with_payment-5",
          "bgGradient": "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)"
        }
      },
      {
        "id": "citra-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "CITRA RAYA",
          "description": "Biskut premium eksklusif untuk Hari Raya yang istimewa. Kualiti tanpa kompromi.",
          "copyright": "2026 Citra Raya. Hakcipta terpelihara.",
          "bgColor": "#1e3a8a",
          "textColor": "#eff6ff",
          "columns": [
            {
              "title": "Navigasi",
              "links": [
                { "label": "Koleksi Premium", "url": "#product_carousel-4" },
                { "label": "Tempah Sekarang", "url": "#form_with_payment-5" },
                { "label": "Testimoni VIP", "url": "#testimonials-6" },
                { "label": "FAQ", "url": "#faq-7" }
              ]
            },
            {
              "title": "Hubungi Kami",
              "links": [
                { "label": "WhatsApp: +60 17-888 9999", "url": "https://wa.me/60178889999" },
                { "label": "Email: vip@citraraya.my", "url": "mailto:vip@citraraya.my" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" },
            { "platform": "linkedin", "url": "https://linkedin.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Citra Raya - Biskut Premium Eksklusif Hari Raya 2026",
      "description": "Tempah biskut raya premium dengan bahan import berkualiti tinggi. London Almond, Biskut Mazola, Biskut Suji. Penghantaran percuma ke seluruh Malaysia.",
      "keywords": "citra raya, london almond, biskut mazola, biskut suji, biskut premium, biskut raya eksklusif, malaysia"
    },
    "theme": {
      "primaryColor": "#1e3a8a",
      "fontFamily": "Inter"
    }
  }'::jsonb
);
