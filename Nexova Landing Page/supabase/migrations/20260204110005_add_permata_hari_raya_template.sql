-- Permata Hari Raya Template (E-commerce) - Variation 5
-- Theme: Rose Pink, Variants: hero=image_left, features=list, testimonials=masonry, faq=two_column, cta=banner
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Permata Hari Raya',
  'permata-hari-raya',
  'ecommerce',
  'Food & Beverage',
  'Template e-dagang feminin dengan tema merah jambu untuk menjual biskut raya eksklusif. Reka bentuk elegan dan anggun.',
  'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=1200&h=800&fit=crop',
  true,
  ARRAY['permata hari raya', 'biskut arab', 'kuih batang buruk', 'almond london', 'raya', 'ecommerce', 'feminin', 'malaysia'],
  '{
    "elements": [
      {
        "id": "permata-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Koleksi Istimewa Hari Raya 2026 - Hadiah Percuma Untuk 100 Pembeli Pertama!",
          "bgColor": "#9d174d",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Tawaran istimewa berakhir:",
          "countdownEndDate": "2026-03-05T23:59:59"
        }
      },
      {
        "id": "permata-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "PERMATA RAYA",
          "logo": "",
          "menuItems": [
            { "label": "Koleksi", "url": "#product_carousel-4" },
            { "label": "Reviews", "url": "#testimonials-6" },
            { "label": "FAQ", "url": "#faq-7" }
          ],
          "bgColor": "#fdf2f8",
          "textColor": "#9d174d",
          "isSticky": true,
          "layout": "split",
          "ctaButton": {
            "text": "Beli Sekarang",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "permata-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_left",
          "headline": "Permata Manis Hari Raya",
          "subheadline": "Biskut cantik dan sedap untuk meriahkan sambutan Hari Raya anda. Setiap balang adalah permata yang berharga.",
          "ctaText": "Lihat Koleksi",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=1920&q=80",
          "bgColor": "#fdf2f8",
          "headlineColor": "#9d174d",
          "subheadlineColor": "#be185d",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 100,
          "buttonBgColor": "#9d174d",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "permata-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Kelebihan Permata Raya",
          "variant": "list",
          "features": [
            {
              "icon": "sparkles",
              "title": "Reka Bentuk Cantik",
              "description": "Setiap biskut direka dengan teliti untuk penampilan yang cantik dan menarik. Sesuai untuk Instagram!"
            },
            {
              "icon": "heart",
              "title": "Dibuat Dengan Cinta",
              "description": "Setiap balang diisi dengan penuh kasih sayang oleh pasukan wanita kami yang berdedikasi."
            },
            {
              "icon": "gift",
              "title": "Pembungkusan Eksklusif",
              "description": "Kotak hadiah pink dengan ribbon satin. Sempurna untuk dijadikan hadiah atau hantaran."
            },
            {
              "icon": "award",
              "title": "Bahan Berkualiti",
              "description": "Hanya menggunakan bahan premium seperti mentega New Zealand dan badam Australia."
            },
            {
              "icon": "truck",
              "title": "Penghantaran Selamat",
              "description": "Biskut dibungkus dengan teliti dalam kotak khas untuk memastikan sampai dalam keadaan sempurna."
            },
            {
              "icon": "star",
              "title": "5 Bintang Rating",
              "description": "Lebih 2000 ulasan 5 bintang dari pelanggan yang berpuas hati di seluruh Malaysia."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "permata-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Koleksi Permata",
          "subtitle": "Biskut cantik dan sedap yang menjadi kegemaran ramai.",
          "cardStyle": "bordered",
          "products": [
            {
              "id": "biskut-arab",
              "code": "PR-001",
              "name": "Biskut Arab",
              "description": "Biskut lembut dengan inti kurma Medjool premium. Dibalut dengan tepung gula halus. Manis dan mewah!",
              "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop",
              "base_price": 38,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "batang-buruk",
              "code": "PR-002",
              "name": "Kuih Batang Buruk",
              "description": "Kuih tradisional berbentuk batang yang rangup. Diperbuat daripada tepung beras dan kelapa. Renyah dan sedap!",
              "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "almond-london",
              "code": "PR-003",
              "name": "Almond London",
              "description": "Biskut mentega dengan badam utuh di tengah, disalut coklat premium. Klasik yang tidak pernah lapuk!",
              "image_url": "https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=600&h=400&fit=crop",
              "base_price": 42,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#fdf2f8"
        }
      },
      {
        "id": "permata-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Borang Tempahan",
          "description": "Lengkapkan maklumat anda untuk meneruskan pembelian biskut Permata Raya.",
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
              "id": "biskut-arab",
              "name": "Biskut Arab",
              "description": "1 balang cantik (35 biji)",
              "price": 38
            },
            {
              "id": "batang-buruk",
              "name": "Kuih Batang Buruk",
              "description": "1 balang cantik (40 batang)",
              "price": 25
            },
            {
              "id": "almond-london",
              "name": "Almond London",
              "description": "1 balang cantik (30 biji)",
              "price": 42
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Teruskan Pembayaran",
          "submitButtonColor": "#9d174d",
          "bgColor": "#ffffff",
          "companyName": "Permata Hari Raya",
          "companyRegistration": ""
        }
      },
      {
        "id": "permata-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "Apa Kata Mereka",
          "variant": "masonry",
          "testimonials": [
            {
              "name": "Sis Aina",
              "role": "Influencer",
              "quote": "Cantiknyaaa packaging dia! Biskut pun sedap gila. Perfect for Raya! Dah share kat IG stories, semua tanya beli mana.",
              "rating": 5
            },
            {
              "name": "Puan Halimah",
              "role": "Selangor",
              "quote": "Biskut Arab dia memang terbaik! Kurma dalam tu mewah sangat. Sesuai sangat untuk hidang tetamu VIP.",
              "rating": 5
            },
            {
              "name": "Cik Diana",
              "role": "Penang",
              "quote": "Almond London best ever! Coklat tebal dan badam besar. Order untuk hantaran tunang, semua puji!",
              "rating": 5
            }
          ],
          "bgColor": "#fdf2f8"
        }
      },
      {
        "id": "permata-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Soalan Lazim",
          "variant": "two_column",
          "questions": [
            {
              "question": "Boleh customise warna packaging?",
              "answer": "Ya! Kami tawarkan pilihan warna pink, gold, dan mint green. Sila nyatakan pilihan semasa tempahan."
            },
            {
              "question": "Berapa lama biskut boleh tahan?",
              "answer": "Biskut kami tahan 4-5 minggu dalam bekas asal. Untuk kesegaran maksimum, simpan di tempat sejuk dan kering."
            },
            {
              "question": "Ada perkhidmatan untuk hantaran?",
              "answer": "Ada! Kami menawarkan pakej hantaran lengkap dengan dulang dan hiasan. Hubungi kami untuk maklumat lanjut."
            },
            {
              "question": "Boleh print nama pada balang?",
              "answer": "Boleh! Perkhidmatan personalisasi tersedia untuk pesanan minimum 10 balang. Tambahan RM3 sebalang."
            },
            {
              "question": "Bagaimana dengan penghantaran?",
              "answer": "Penghantaran ke seluruh Malaysia. Semenanjung: RM10-15, Sabah/Sarawak: RM20-25. Percuma untuk pesanan RM200+."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "permata-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "banner",
          "headline": "Jadikan Raya Anda Lebih Istimewa",
          "description": "Tempah biskut Permata Raya sekarang dan nikmati keindahan dalam setiap gigitan. Hadiah percuma untuk 100 pembeli pertama!",
          "buttonText": "Beli Sekarang",
          "buttonUrl": "#form_with_payment-5",
          "bgGradient": "linear-gradient(135deg, #9d174d 0%, #be185d 100%)"
        }
      },
      {
        "id": "permata-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "PERMATA RAYA",
          "description": "Biskut cantik dan sedap untuk Hari Raya yang istimewa. Setiap balang adalah permata.",
          "copyright": "2026 Permata Hari Raya. Hakcipta terpelihara.",
          "bgColor": "#9d174d",
          "textColor": "#fdf2f8",
          "columns": [
            {
              "title": "Pautan",
              "links": [
                { "label": "Koleksi Biskut", "url": "#product_carousel-4" },
                { "label": "Beli Sekarang", "url": "#form_with_payment-5" },
                { "label": "Reviews", "url": "#testimonials-6" },
                { "label": "FAQ", "url": "#faq-7" }
              ]
            },
            {
              "title": "Hubungi Kami",
              "links": [
                { "label": "WhatsApp: +60 16-777 8888", "url": "https://wa.me/60167778888" },
                { "label": "Email: love@permataraya.my", "url": "mailto:love@permataraya.my" }
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
      "title": "Permata Hari Raya - Biskut Cantik Untuk Raya Istimewa",
      "description": "Tempah biskut raya cantik dan sedap. Biskut Arab, Kuih Batang Buruk, Almond London. Pembungkusan eksklusif untuk hadiah dan hantaran.",
      "keywords": "permata hari raya, biskut arab, kuih batang buruk, almond london, biskut cantik, biskut raya, hantaran raya, malaysia"
    },
    "theme": {
      "primaryColor": "#9d174d",
      "fontFamily": "Inter"
    }
  }'::jsonb
);
