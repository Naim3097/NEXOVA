-- Kuih Raya Template (E-commerce)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Kuih Raya',
  'kuih-raya',
  'ecommerce',
  'Food & Beverage',
  'Beautiful e-commerce template for selling Kuih Raya, cookies, and festive treats. Includes product showcase, order form with payment, testimonials, and FAQ.',
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200&h=800&fit=crop',
  true,
  ARRAY['kuih raya', 'cookies', 'raya', 'food', 'ecommerce', 'hari raya', 'bakery', 'malaysia'],
  '{
    "elements": [
      {
        "id": "kuih-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "🌙 Pre-Order Kuih Raya 2026 Kini Dibuka! Penghantaran Percuma Untuk Pesanan RM150+",
          "bgColor": "#b45309",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Tarikh tutup tempahan:",
          "countdownEndDate": "2026-03-15T23:59:59"
        }
      },
      {
        "id": "kuih-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "DAPUR RAYA",
          "logo": "",
          "menuItems": [
            { "label": "Koleksi", "url": "#product_carousel-4" },
            { "label": "Testimoni", "url": "#testimonials-6" },
            { "label": "Soalan Lazim", "url": "#faq-7" }
          ],
          "bgColor": "#ffffff",
          "textColor": "#1f2937",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Tempah Sekarang",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "kuih-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Koleksi Kuih Raya 2026",
          "subheadline": "Kuih raya homemade berkualiti tinggi diperbuat daripada bahan-bahan premium. Sempurna untuk hidangan Hari Raya dan buah tangan istimewa.",
          "ctaText": "Lihat Koleksi",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1920&q=80",
          "bgColor": "#fffbeb",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#fef3c7",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 50,
          "buttonBgColor": "#b45309",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "kuih-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Kenapa Pilih Dapur Raya?",
          "variant": "grid",
          "features": [
            {
              "icon": "sparkles",
              "title": "100% Homemade",
              "description": "Setiap kuih dibuat dengan tangan menggunakan resipi turun-temurun yang terjamin rasanya."
            },
            {
              "icon": "award",
              "title": "Bahan Premium",
              "description": "Kami hanya menggunakan mentega, tepung, dan bahan berkualiti tinggi tanpa pengawet tiruan."
            },
            {
              "icon": "rocket",
              "title": "Penghantaran Selamat",
              "description": "Pembungkusan kemas dan selamat untuk memastikan kuih sampai dalam keadaan sempurna."
            },
            {
              "icon": "shield",
              "title": "Jaminan Kualiti",
              "description": "Setiap balang melalui kawalan kualiti ketat. Wang dikembalikan jika tidak berpuas hati."
            },
            {
              "icon": "gift",
              "title": "Pembungkusan Cantik",
              "description": "Sesuai untuk dijadikan hadiah dengan pembungkusan eksklusif dan tag ucapan Raya percuma."
            },
            {
              "icon": "heart",
              "title": "Dibuat Dengan Kasih Sayang",
              "description": "Lebih 10 tahun pengalaman membuat kuih raya untuk pelanggan setia di seluruh Malaysia."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "kuih-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Koleksi Kuih Raya Kami",
          "subtitle": "Pilih dari pelbagai jenis kuih raya tradisional dan moden kegemaran anda.",
          "products": [
            {
              "id": "kuih-tart",
              "code": "KR-001",
              "name": "Tart Nenas Premium",
              "description": "Tart nenas rangup dengan jem nenas asli. Dibakar sempurna dengan mentega berkualiti tinggi. Kegemaran No.1 setiap Raya!",
              "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
              "base_price": 35,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "kuih-makmur",
              "code": "KR-002",
              "name": "Kuih Makmur Istimewa",
              "description": "Kuih makmur lembut yang hancur di mulut dengan inti kacang tanah rangup. Resipi warisan nenek yang tidak berubah.",
              "image_url": "https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=600&h=400&fit=crop",
              "base_price": 28,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "kuih-semperit",
              "code": "KR-003",
              "name": "Semperit Susu",
              "description": "Biskut semperit yang lembut dan cair di mulut. Diperbuat daripada susu segar dan mentega tulen. Sesuai untuk semua peringkat umur.",
              "image_url": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=400&fit=crop",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#fffbeb"
        }
      },
      {
        "id": "kuih-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Borang Tempahan",
          "description": "Isikan maklumat anda dan pilih kuih raya kegemaran untuk meneruskan tempahan.",
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
              "id": "tart-nenas",
              "name": "Tart Nenas Premium",
              "description": "1 balang (50 biji)",
              "price": 35
            },
            {
              "id": "kuih-makmur",
              "name": "Kuih Makmur Istimewa",
              "description": "1 balang (40 biji)",
              "price": 28
            },
            {
              "id": "semperit-susu",
              "name": "Semperit Susu",
              "description": "1 balang (50 biji)",
              "price": 25
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Teruskan Pembayaran",
          "submitButtonColor": "#b45309",
          "bgColor": "#ffffff",
          "companyName": "Dapur Raya",
          "companyRegistration": ""
        }
      },
      {
        "id": "kuih-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "Apa Kata Pelanggan Kami",
          "variant": "grid",
          "testimonials": [
            {
              "name": "Kak Nora",
              "role": "Pelanggan Setia 5 Tahun",
              "quote": "Setiap tahun memang order sini. Tart nenas dia memang terbaik! Rangup dan jem nenas pekat. Tetamu rumah terbuka selalu tanya beli mana.",
              "rating": 5
            },
            {
              "name": "Siti Hajar",
              "role": "Kuala Lumpur",
              "quote": "First time order dan terus jatuh cinta! Kuih makmur dia betul-betul hancur di mulut. Packaging pun cantik, sesuai untuk bagi hadiah.",
              "rating": 5
            },
            {
              "name": "Puan Azizah",
              "role": "Johor Bahru",
              "quote": "Order 10 balang untuk bagi saudara-mara. Semua puji! Penghantaran pun cepat dan selamat sampai. Memang recommended!",
              "rating": 5
            }
          ],
          "bgColor": "#fffbeb"
        }
      },
      {
        "id": "kuih-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Soalan Lazim",
          "variant": "single_column",
          "questions": [
            {
              "question": "Bila tarikh tutup tempahan?",
              "answer": "Tempahan ditutup 2 minggu sebelum Hari Raya atau apabila kuota penuh. Kami sarankan untuk tempah awal bagi mengelakkan kekecewaan."
            },
            {
              "question": "Berapa lama jangka hayat kuih?",
              "answer": "Kuih raya kami tahan sehingga 3-4 minggu jika disimpan dalam bekas kedap udara pada suhu bilik. Lebih tahan lama jika disimpan dalam peti sejuk."
            },
            {
              "question": "Adakah penghantaran tersedia ke seluruh Malaysia?",
              "answer": "Ya! Kami menghantar ke seluruh Semenanjung Malaysia (2-3 hari) dan Sabah & Sarawak (5-7 hari). Penghantaran percuma untuk pesanan RM150 ke atas."
            },
            {
              "question": "Boleh buat tempahan pukal untuk corporate?",
              "answer": "Boleh! Kami menerima tempahan pukal untuk syarikat dan majlis. Hubungi kami melalui WhatsApp untuk harga istimewa."
            },
            {
              "question": "Adakah kuih mengandungi bahan allergen?",
              "answer": "Kuih kami mengandungi mentega, susu, tepung gandum, dan kacang. Sila maklumkan jika anda mempunyai sebarang alergi."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "kuih-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "centered",
          "headline": "Jangan Lepaskan Peluang!",
          "description": "Tempah kuih raya premium kami sekarang sebelum kehabisan. Penghantaran percuma untuk pesanan RM150+!",
          "buttonText": "Tempah Sekarang",
          "buttonUrl": "#form_with_payment-5",
          "bgGradient": "linear-gradient(135deg, #b45309 0%, #92400e 100%)"
        }
      },
      {
        "id": "kuih-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "DAPUR RAYA",
          "description": "Kuih raya homemade berkualiti tinggi untuk keluarga tercinta.",
          "copyright": "2026 Dapur Raya. Hakcipta terpelihara.",
          "bgColor": "#1f2937",
          "textColor": "#f9fafb",
          "columns": [
            {
              "title": "Pautan Pantas",
              "links": [
                { "label": "Koleksi Kuih", "url": "#product_carousel-4" },
                { "label": "Tempah Sekarang", "url": "#form_with_payment-5" },
                { "label": "Testimoni", "url": "#testimonials-6" },
                { "label": "Soalan Lazim", "url": "#faq-7" }
              ]
            },
            {
              "title": "Hubungi Kami",
              "links": [
                { "label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789" },
                { "label": "Email: hello@dapurraya.my", "url": "mailto:hello@dapurraya.my" }
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
      "title": "Dapur Raya - Koleksi Kuih Raya Premium 2026",
      "description": "Tempah kuih raya homemade berkualiti tinggi. Tart nenas, kuih makmur, semperit dan banyak lagi. Penghantaran ke seluruh Malaysia.",
      "keywords": "kuih raya, tart nenas, kuih makmur, semperit, biskut raya, hari raya, tempah kuih raya"
    },
    "theme": {
      "primaryColor": "#b45309",
      "fontFamily": "Inter"
    }
  }'::jsonb
);
