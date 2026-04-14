-- Biskut Warisan Template (E-commerce) - Variation 1
-- Theme: Maroon/Burgundy, Variants: hero=centered, features=list, testimonials=slider, faq=two_column, cta=split
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Biskut Warisan',
  'biskut-warisan',
  'ecommerce',
  'Food & Beverage',
  'Template e-dagang elegan untuk menjual biskut dan kuih raya tradisional. Tema maroon klasik dengan reka bentuk warisan.',
  'https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=1200&h=800&fit=crop',
  true,
  ARRAY['biskut warisan', 'kuih bangkit', 'kuih kapit', 'biskut dahlia', 'raya', 'ecommerce', 'tradisional', 'malaysia'],
  '{
    "elements": [
      {
        "id": "warisan-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Warisan Turun-Temurun Sejak 1985 - Tempahan Raya 2026 Kini Dibuka!",
          "bgColor": "#7c2d12",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Tempahan ditutup dalam:",
          "countdownEndDate": "2026-03-10T23:59:59"
        }
      },
      {
        "id": "warisan-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "BISKUT WARISAN",
          "logo": "",
          "menuItems": [
            { "label": "Koleksi", "url": "#product_carousel-4" },
            { "label": "Testimoni", "url": "#testimonials-6" },
            { "label": "FAQ", "url": "#faq-7" }
          ],
          "bgColor": "#fef2f2",
          "textColor": "#7c2d12",
          "isSticky": true,
          "layout": "center",
          "ctaButton": {
            "text": "Pesan Sekarang",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "warisan-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "centered",
          "headline": "Resipi Warisan Sejak 1985",
          "subheadline": "Biskut dan kuih raya asli diperbuat mengikut resipi turun-temurun. Setiap gigitan membawa kenangan manis zaman dulu.",
          "ctaText": "Jelajah Koleksi",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=1920&q=80",
          "bgColor": "#fef2f2",
          "headlineColor": "#7c2d12",
          "subheadlineColor": "#991b1b",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 100,
          "buttonBgColor": "#7c2d12",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "warisan-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Kelebihan Biskut Warisan",
          "variant": "list",
          "features": [
            {
              "icon": "crown",
              "title": "Resipi Asli 1985",
              "description": "Resipi yang sama sejak nenek moyang kami mula berniaga. Tidak pernah berubah, kekal sedap."
            },
            {
              "icon": "award",
              "title": "Bahan Pilihan Terbaik",
              "description": "Hanya menggunakan mentega New Zealand, tepung Jepun, dan bahan import berkualiti tinggi."
            },
            {
              "icon": "users",
              "title": "Dibuat Oleh Pakar",
              "description": "Tukang masak berpengalaman lebih 30 tahun dalam industri kuih raya tradisional."
            },
            {
              "icon": "package",
              "title": "Pembungkusan Eksklusif",
              "description": "Balang kaca premium dengan label emas. Sesuai untuk hadiah atau koleksi peribadi."
            },
            {
              "icon": "truck",
              "title": "Penghantaran Seluruh Malaysia",
              "description": "Dihantar dengan bungkusan istimewa ke seluruh negara. Percuma untuk pesanan RM200+."
            },
            {
              "icon": "shield",
              "title": "Jaminan 100% Puas Hati",
              "description": "Tidak puas hati? Wang anda dikembalikan sepenuhnya tanpa soalan."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "warisan-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Koleksi Warisan Kami",
          "subtitle": "Setiap biskut diperbuat dengan penuh kasih sayang mengikut resipi turun-temurun.",
          "cardStyle": "shadow",
          "products": [
            {
              "id": "kuih-bangkit",
              "code": "BW-001",
              "name": "Kuih Bangkit Premium",
              "description": "Kuih bangkit lembut yang cair di mulut. Diperbuat daripada tepung ubi kayu asli dan santan segar. Wangi dan tidak terlalu manis.",
              "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop",
              "base_price": 32,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "kuih-kapit",
              "code": "BW-002",
              "name": "Kuih Kapit Rangup",
              "description": "Kuih kapit nipis dan rangup dengan corak tradisional yang cantik. Diperbuat daripada santan pekat dan gula melaka.",
              "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
              "base_price": 28,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "biskut-dahlia",
              "code": "BW-003",
              "name": "Biskut Dahlia",
              "description": "Biskut mentega berbentuk bunga dahlia yang cantik. Lembut, rangup, dan cair di mulut. Kegemaran semua generasi.",
              "image_url": "https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=600&h=400&fit=crop",
              "base_price": 30,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#fef2f2"
        }
      },
      {
        "id": "warisan-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Borang Tempahan",
          "description": "Lengkapkan maklumat anda untuk meneruskan tempahan biskut warisan.",
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
              "id": "kuih-bangkit",
              "name": "Kuih Bangkit Premium",
              "description": "1 balang (45 biji)",
              "price": 32
            },
            {
              "id": "kuih-kapit",
              "name": "Kuih Kapit Rangup",
              "description": "1 balang (30 keping)",
              "price": 28
            },
            {
              "id": "biskut-dahlia",
              "name": "Biskut Dahlia",
              "description": "1 balang (40 biji)",
              "price": 30
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Teruskan Pembayaran",
          "submitButtonColor": "#7c2d12",
          "bgColor": "#ffffff",
          "companyName": "Biskut Warisan",
          "companyRegistration": ""
        }
      },
      {
        "id": "warisan-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "Suara Pelanggan Setia",
          "variant": "slider",
          "testimonials": [
            {
              "name": "Puan Rosmah",
              "role": "Pelanggan Sejak 2010",
              "quote": "Kuih bangkit Biskut Warisan memang terbaik! Sama macam arwah nenek buat dulu. Setiap Raya mesti order sini.",
              "rating": 5
            },
            {
              "name": "Encik Hafiz",
              "role": "Penang",
              "quote": "Kuih kapit dia rangup dan wangi. Anak-anak suka sangat. Packaging pun cantik, sesuai untuk bagi boss.",
              "rating": 5
            },
            {
              "name": "Datin Seri Aminah",
              "role": "Shah Alam",
              "quote": "Setiap tahun order 20 balang untuk bagi sedara-mara. Kualiti konsisten dan tak pernah mengecewakan. Highly recommended!",
              "rating": 5
            }
          ],
          "bgColor": "#fef2f2"
        }
      },
      {
        "id": "warisan-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Soalan Lazim",
          "variant": "two_column",
          "questions": [
            {
              "question": "Apakah yang membezakan Biskut Warisan?",
              "answer": "Kami menggunakan resipi yang sama sejak 1985 tanpa sebarang pengubahsuaian. Setiap biskut dibuat dengan tangan oleh tukang masak berpengalaman."
            },
            {
              "question": "Berapa lama tempoh kesahan biskut?",
              "answer": "Biskut kami tahan 4-5 minggu jika disimpan dalam bekas kedap udara. Kuih bangkit dan kapit boleh tahan lebih lama sehingga 6 minggu."
            },
            {
              "question": "Boleh customise pembungkusan?",
              "answer": "Ya! Kami menawarkan perkhidmatan pembungkusan khas untuk hadiah korporat dan majlis perkahwinan. Hubungi kami untuk sebut harga."
            },
            {
              "question": "Bagaimana dengan penghantaran?",
              "answer": "Penghantaran ke seluruh Semenanjung (2-3 hari) dan Sabah/Sarawak (5-7 hari). Percuma untuk pesanan RM200 ke atas."
            },
            {
              "question": "Ada jaminan pulangan wang?",
              "answer": "Ya, kami tawarkan jaminan 100% puas hati. Jika anda tidak berpuas hati dengan produk kami, wang akan dikembalikan sepenuhnya."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "warisan-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "split",
          "headline": "Rasai Warisan Turun-Temurun",
          "description": "Tempah sekarang dan nikmati biskut berkualiti premium dengan resipi asli sejak 1985. Stok terhad!",
          "buttonText": "Tempah Sekarang",
          "buttonUrl": "#form_with_payment-5",
          "bgGradient": "linear-gradient(135deg, #7c2d12 0%, #991b1b 100%)"
        }
      },
      {
        "id": "warisan-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "BISKUT WARISAN",
          "description": "Meneruskan warisan rasa sejak 1985. Biskut tradisional berkualiti tinggi untuk keluarga Malaysia.",
          "copyright": "2026 Biskut Warisan. Hakcipta terpelihara.",
          "bgColor": "#7c2d12",
          "textColor": "#fef2f2",
          "columns": [
            {
              "title": "Pautan",
              "links": [
                { "label": "Koleksi Biskut", "url": "#product_carousel-4" },
                { "label": "Tempah Sekarang", "url": "#form_with_payment-5" },
                { "label": "Testimoni", "url": "#testimonials-6" },
                { "label": "FAQ", "url": "#faq-7" }
              ]
            },
            {
              "title": "Hubungi",
              "links": [
                { "label": "WhatsApp: +60 11-234 5678", "url": "https://wa.me/60112345678" },
                { "label": "Email: order@biskutwarisan.my", "url": "mailto:order@biskutwarisan.my" }
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
      "title": "Biskut Warisan - Resipi Turun-Temurun Sejak 1985",
      "description": "Tempah biskut dan kuih raya tradisional dengan resipi asli sejak 1985. Kuih bangkit, kuih kapit, biskut dahlia. Penghantaran ke seluruh Malaysia.",
      "keywords": "biskut warisan, kuih bangkit, kuih kapit, biskut dahlia, kuih raya tradisional, biskut raya, malaysia"
    },
    "theme": {
      "primaryColor": "#7c2d12",
      "fontFamily": "Inter"
    }
  }'::jsonb
);
