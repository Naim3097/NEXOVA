-- Rasa Tradisi Template (E-commerce) - Variation 2
-- Theme: Emerald Green, Variants: hero=image_left, features=alternating, testimonials=masonry, faq=single_column, cta=banner
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Rasa Tradisi',
  'rasa-tradisi',
  'ecommerce',
  'Food & Beverage',
  'Template e-dagang segar dengan tema hijau zamrud untuk menjual kuih raya tradisional. Reka bentuk moden dengan sentuhan klasik.',
  'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=1200&h=800&fit=crop',
  true,
  ARRAY['rasa tradisi', 'kuih sarang semut', 'kuih ros', 'cornflakes madu', 'raya', 'ecommerce', 'tradisional', 'malaysia'],
  '{
    "elements": [
      {
        "id": "tradisi-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Nikmati Rasa Asli Kampung - Diskaun 15% Untuk Pesanan Awal Raya 2026!",
          "bgColor": "#065f46",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Promosi tamat:",
          "countdownEndDate": "2026-02-28T23:59:59"
        }
      },
      {
        "id": "tradisi-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "RASA TRADISI",
          "logo": "",
          "menuItems": [
            { "label": "Produk", "url": "#product_carousel-4" },
            { "label": "Ulasan", "url": "#testimonials-6" },
            { "label": "Bantuan", "url": "#faq-7" }
          ],
          "bgColor": "#ecfdf5",
          "textColor": "#065f46",
          "isSticky": true,
          "layout": "split",
          "ctaButton": {
            "text": "Order Sekarang",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "tradisi-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_left",
          "headline": "Rasa Kampung Dalam Setiap Gigitan",
          "subheadline": "Kuih raya tradisional diperbuat dengan penuh kasih sayang menggunakan resipi asli kampung. Segar, sedap, dan penuh nostalgia.",
          "ctaText": "Lihat Menu",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=1920&q=80",
          "bgColor": "#ecfdf5",
          "headlineColor": "#065f46",
          "subheadlineColor": "#047857",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 100,
          "buttonBgColor": "#065f46",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "tradisi-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Mengapa Pilih Rasa Tradisi?",
          "variant": "alternating",
          "features": [
            {
              "icon": "leaf",
              "title": "Bahan Organik & Segar",
              "description": "Kami gunakan bahan-bahan segar dari ladang tempatan. Tiada pengawet, tiada pewarna tiruan."
            },
            {
              "icon": "home",
              "title": "Resipi Asli Kampung",
              "description": "Setiap kuih dibuat mengikut cara tradisional yang dipelajari daripada emak dan nenek kami."
            },
            {
              "icon": "heart",
              "title": "Dibuat Dengan Kasih",
              "description": "Setiap balang dibuat dengan penuh perhatian dan kasih sayang, seperti untuk keluarga sendiri."
            },
            {
              "icon": "star",
              "title": "Kualiti Premium",
              "description": "Hanya yang terbaik untuk pelanggan kami. Setiap kuih melalui kawalan kualiti yang ketat."
            },
            {
              "icon": "gift",
              "title": "Sesuai Untuk Hadiah",
              "description": "Pembungkusan cantik dan eksklusif. Sempurna untuk dijadikan buah tangan atau hadiah korporat."
            },
            {
              "icon": "zap",
              "title": "Penghantaran Pantas",
              "description": "Pesanan diproses dalam 24 jam. Penghantaran express tersedia untuk keperluan segera."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "tradisi-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Menu Istimewa Kami",
          "subtitle": "Pilihan kuih raya tradisional yang diperbuat segar setiap hari.",
          "cardStyle": "bordered",
          "products": [
            {
              "id": "sarang-semut",
              "code": "RT-001",
              "name": "Kuih Sarang Semut",
              "description": "Kek kukus tradisional dengan tekstur berlubang unik seperti sarang semut. Lembut, manis, dan wangi gula hangus.",
              "image_url": "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&h=400&fit=crop",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "kuih-ros",
              "code": "RT-002",
              "name": "Kuih Ros",
              "description": "Kuih berbentuk bunga ros yang rangup dan cantik. Diperbuat daripada tepung beras dan santan. Ringan dan tidak berminyak.",
              "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop",
              "base_price": 22,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "cornflakes-madu",
              "code": "RT-003",
              "name": "Cornflakes Madu",
              "description": "Cornflakes rangup disalut madu asli dan mentega. Manis semulajadi dan addictive! Kegemaran kanak-kanak dan dewasa.",
              "image_url": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=400&fit=crop",
              "base_price": 20,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#ecfdf5"
        }
      },
      {
        "id": "tradisi-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Borang Pesanan",
          "description": "Isi maklumat anda dan pilih kuih kegemaran untuk meneruskan pesanan.",
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
              "id": "sarang-semut",
              "name": "Kuih Sarang Semut",
              "description": "1 loyang (8 inci)",
              "price": 25
            },
            {
              "id": "kuih-ros",
              "name": "Kuih Ros",
              "description": "1 balang (35 biji)",
              "price": 22
            },
            {
              "id": "cornflakes-madu",
              "name": "Cornflakes Madu",
              "description": "1 balang (40 biji)",
              "price": 20
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Bayar Sekarang",
          "submitButtonColor": "#065f46",
          "bgColor": "#ffffff",
          "companyName": "Rasa Tradisi",
          "companyRegistration": ""
        }
      },
      {
        "id": "tradisi-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "Kata Pelanggan",
          "variant": "masonry",
          "testimonials": [
            {
              "name": "Cik Farah",
              "role": "Petaling Jaya",
              "quote": "Kuih sarang semut dia memang authentic! Teringat masa kecil makan kat kampung. Terima kasih Rasa Tradisi!",
              "rating": 5
            },
            {
              "name": "Encik Rizal",
              "role": "Ipoh",
              "quote": "Cornflakes madu best gila. Anak-anak habiskan satu balang dalam sehari. Dah repeat order 3 kali!",
              "rating": 5
            },
            {
              "name": "Puan Salmah",
              "role": "Melaka",
              "quote": "Kuih ros cantik dan sedap. Bagi kat jiran semua puji. Packaging pun eco-friendly, suka sangat!",
              "rating": 5
            }
          ],
          "bgColor": "#ecfdf5"
        }
      },
      {
        "id": "tradisi-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Soalan Lazim",
          "variant": "single_column",
          "questions": [
            {
              "question": "Adakah kuih dibuat fresh untuk setiap pesanan?",
              "answer": "Ya! Setiap pesanan dibuat segar mengikut tarikh penghantaran yang diminta. Kami tidak menyimpan stok lama."
            },
            {
              "question": "Berapa lama boleh tahan kuih ini?",
              "answer": "Kuih sarang semut tahan 1 minggu pada suhu bilik. Kuih ros dan cornflakes madu tahan 3-4 minggu dalam bekas kedap udara."
            },
            {
              "question": "Boleh request kurang manis?",
              "answer": "Boleh! Sila nyatakan dalam pesanan anda. Kami boleh sesuaikan tahap kemanisan mengikut citarasa anda."
            },
            {
              "question": "Ada pesanan minimum?",
              "answer": "Tiada pesanan minimum. Anda boleh order satu balang pun kami hantar dengan selamat."
            },
            {
              "question": "Bagaimana dengan penghantaran?",
              "answer": "Penghantaran tersedia ke seluruh Malaysia. Semenanjung: RM8-15, Sabah/Sarawak: RM18-25. Percuma untuk pesanan RM150+."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "tradisi-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "banner",
          "headline": "Tempah Sekarang, Rasai Tradisi!",
          "description": "Jangan lepaskan peluang menikmati kuih raya tradisional yang segar dan sedap. Stok terhad untuk musim Raya ini!",
          "buttonText": "Order Sekarang",
          "buttonUrl": "#form_with_payment-5",
          "bgGradient": "linear-gradient(135deg, #065f46 0%, #047857 100%)"
        }
      },
      {
        "id": "tradisi-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "RASA TRADISI",
          "description": "Membawa rasa kampung ke rumah anda. Kuih tradisional segar untuk keluarga tercinta.",
          "copyright": "2026 Rasa Tradisi. Hakcipta terpelihara.",
          "bgColor": "#065f46",
          "textColor": "#ecfdf5",
          "columns": [
            {
              "title": "Menu",
              "links": [
                { "label": "Semua Produk", "url": "#product_carousel-4" },
                { "label": "Order Sekarang", "url": "#form_with_payment-5" },
                { "label": "Ulasan Pelanggan", "url": "#testimonials-6" },
                { "label": "Bantuan", "url": "#faq-7" }
              ]
            },
            {
              "title": "Hubungi",
              "links": [
                { "label": "WhatsApp: +60 13-456 7890", "url": "https://wa.me/60134567890" },
                { "label": "Email: hello@rasatradisi.my", "url": "mailto:hello@rasatradisi.my" }
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
      "title": "Rasa Tradisi - Kuih Raya Tradisional Segar",
      "description": "Tempah kuih raya tradisional segar diperbuat dengan resipi asli kampung. Kuih sarang semut, kuih ros, cornflakes madu. Penghantaran ke seluruh Malaysia.",
      "keywords": "rasa tradisi, kuih sarang semut, kuih ros, cornflakes madu, kuih raya tradisional, kuih kampung, malaysia"
    },
    "theme": {
      "primaryColor": "#065f46",
      "fontFamily": "Inter"
    }
  }'::jsonb
);
