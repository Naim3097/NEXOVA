-- Aroma Kampung Template (E-commerce) - Variation 4
-- Theme: Warm Brown, Variants: hero=centered, features=alternating, testimonials=slider, faq=single_column, cta=split
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Aroma Kampung',
  'aroma-kampung',
  'ecommerce',
  'Food & Beverage',
  'Template e-dagang rustic dengan tema coklat hangat untuk menjual biskut tradisional kampung. Reka bentuk mesra dan homey.',
  'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1200&h=800&fit=crop',
  true,
  ARRAY['aroma kampung', 'kuih siput', 'biskut kacang tanah', 'lidah kucing', 'raya', 'ecommerce', 'kampung', 'malaysia'],
  '{
    "elements": [
      {
        "id": "kampung-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Dari Dapur Kampung Ke Rumah Anda - Penghantaran Percuma Pesanan RM100+!",
          "bgColor": "#78350f",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Tawaran istimewa tamat:",
          "countdownEndDate": "2026-03-20T23:59:59"
        }
      },
      {
        "id": "kampung-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "AROMA KAMPUNG",
          "logo": "",
          "menuItems": [
            { "label": "Biskut Kami", "url": "#product_carousel-4" },
            { "label": "Cerita Pelanggan", "url": "#testimonials-6" },
            { "label": "Bantuan", "url": "#faq-7" }
          ],
          "bgColor": "#fef3c7",
          "textColor": "#78350f",
          "isSticky": true,
          "layout": "center",
          "ctaButton": {
            "text": "Tempah Sekarang",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "kampung-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "centered",
          "headline": "Aroma Kampung, Rasa Keluarga",
          "subheadline": "Biskut tradisional dibuat dengan penuh kasih sayang seperti emak buat. Setiap gigitan membawa anda pulang ke kampung halaman.",
          "ctaText": "Lihat Pilihan",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1920&q=80",
          "bgColor": "#fef3c7",
          "headlineColor": "#78350f",
          "subheadlineColor": "#92400e",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 100,
          "buttonBgColor": "#78350f",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "kampung-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Kenapa Aroma Kampung Istimewa?",
          "variant": "alternating",
          "features": [
            {
              "icon": "home",
              "title": "Resipi Emak & Nenek",
              "description": "Setiap biskut dibuat mengikut resipi turun-temurun yang diwarisi dari emak dan nenek kami di kampung."
            },
            {
              "icon": "flame",
              "title": "Dibakar Dengan Kayu Api",
              "description": "Biskut tertentu masih dibakar menggunakan ketuhar kayu api tradisional untuk rasa yang autentik."
            },
            {
              "icon": "leaf",
              "title": "Bahan Tempatan Segar",
              "description": "Kami gunakan kelapa parut segar, gula melaka asli, dan bahan-bahan dari kampung sendiri."
            },
            {
              "icon": "users",
              "title": "Dibuat Oleh Makcik-Makcik",
              "description": "Pasukan kami terdiri daripada makcik-makcik berpengalaman yang mahir membuat kuih tradisional."
            },
            {
              "icon": "heart",
              "title": "Dengan Penuh Kasih Sayang",
              "description": "Setiap balang diisi dengan kasih sayang dan doa agar pembeli sekeluarga sihat dan bahagia."
            },
            {
              "icon": "package",
              "title": "Pembungkusan Mesra Alam",
              "description": "Kami gunakan pembungkusan mesra alam - daun pisang, kertas kraf, dan bahan yang boleh dikitar semula."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "kampung-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Biskut Pilihan Kampung",
          "subtitle": "Setiap biskut diperbuat segar dengan bahan tempatan berkualiti.",
          "cardStyle": "minimal",
          "products": [
            {
              "id": "kuih-siput",
              "code": "AK-001",
              "name": "Kuih Siput",
              "description": "Kuih siput rangup berbentuk spiral yang unik. Digoreng sempurna dengan minyak kelapa. Manis dan gurih seimbang.",
              "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop",
              "base_price": 18,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "biskut-kacang",
              "code": "AK-002",
              "name": "Biskut Kacang Tanah",
              "description": "Biskut kacang tanah rangup dengan taburan kacang yang banyak. Diperbuat daripada kacang tanah panggang segar.",
              "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
              "base_price": 20,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "lidah-kucing",
              "code": "AK-003",
              "name": "Lidah Kucing",
              "description": "Biskut nipis berbentuk lidah kucing yang rangup dan lembut. Diperbuat daripada mentega dan telur segar.",
              "image_url": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=400&fit=crop",
              "base_price": 22,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#fef3c7"
        }
      },
      {
        "id": "kampung-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Borang Tempahan",
          "description": "Isi maklumat anda untuk meneruskan pesanan biskut kampung.",
          "nameLabel": "Nama",
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
              "id": "kuih-siput",
              "name": "Kuih Siput",
              "description": "1 balang (50 biji)",
              "price": 18
            },
            {
              "id": "biskut-kacang",
              "name": "Biskut Kacang Tanah",
              "description": "1 balang (45 biji)",
              "price": 20
            },
            {
              "id": "lidah-kucing",
              "name": "Lidah Kucing",
              "description": "1 balang (60 keping)",
              "price": 22
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Bayar Sekarang",
          "submitButtonColor": "#78350f",
          "bgColor": "#ffffff",
          "companyName": "Aroma Kampung",
          "companyRegistration": ""
        }
      },
      {
        "id": "kampung-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "Cerita Pelanggan Kami",
          "variant": "slider",
          "testimonials": [
            {
              "name": "Mak Cik Zainab",
              "role": "Kelantan",
              "quote": "Teringat masak kat kampung dulu. Biskut kacang tanah dia memang sama macam arwah mak buat. Sedap sangat!",
              "rating": 5
            },
            {
              "name": "Abang Rashid",
              "role": "Kuala Lumpur",
              "quote": "Dah lama cari kuih siput yang rangup macam ni. Aroma Kampung memang deliver! Rasa authentic kampung.",
              "rating": 5
            },
            {
              "name": "Kak Lina",
              "role": "Johor",
              "quote": "Lidah kucing dia nipis dan lembut. Anak-anak suka sangat. Packaging pun cute dengan daun pisang!",
              "rating": 5
            }
          ],
          "bgColor": "#fef3c7"
        }
      },
      {
        "id": "kampung-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Soalan Lazim",
          "variant": "single_column",
          "questions": [
            {
              "question": "Di mana biskut ini dibuat?",
              "answer": "Semua biskut dibuat di kampung kami di Perak. Makcik-makcik kami buat setiap hari dengan penuh kasih sayang."
            },
            {
              "question": "Berapa lama biskut boleh tahan?",
              "answer": "Biskut kami tahan 2-3 minggu pada suhu bilik. Simpan dalam bekas kedap udara untuk kekalkan kerenyahan."
            },
            {
              "question": "Ada pesanan minimum?",
              "answer": "Tiada pesanan minimum. Order satu balang pun kami buat dengan penuh kasih sayang yang sama."
            },
            {
              "question": "Penghantaran ke mana saja?",
              "answer": "Kami hantar ke seluruh Malaysia. Semenanjung: RM8-12, Sabah/Sarawak: RM15-20. Percuma untuk pesanan RM100+."
            },
            {
              "question": "Boleh order untuk kenduri?",
              "answer": "Boleh! Kami terima tempahan pukal untuk kenduri dan majlis. WhatsApp kami untuk harga borong."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "kampung-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "split",
          "headline": "Rindu Kampung? Kami Ada Jawapannya",
          "description": "Tempah biskut tradisional kami dan bawa aroma kampung ke rumah anda. Dibuat dengan kasih sayang!",
          "buttonText": "Tempah Sekarang",
          "buttonUrl": "#form_with_payment-5",
          "bgGradient": "linear-gradient(135deg, #78350f 0%, #92400e 100%)"
        }
      },
      {
        "id": "kampung-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "AROMA KAMPUNG",
          "description": "Membawa aroma kampung ke rumah anda. Biskut tradisional dengan kasih sayang.",
          "copyright": "2026 Aroma Kampung. Hakcipta terpelihara.",
          "bgColor": "#78350f",
          "textColor": "#fef3c7",
          "columns": [
            {
              "title": "Menu",
              "links": [
                { "label": "Biskut Kami", "url": "#product_carousel-4" },
                { "label": "Tempah", "url": "#form_with_payment-5" },
                { "label": "Cerita Pelanggan", "url": "#testimonials-6" },
                { "label": "Bantuan", "url": "#faq-7" }
              ]
            },
            {
              "title": "Hubungi",
              "links": [
                { "label": "WhatsApp: +60 19-555 6666", "url": "https://wa.me/60195556666" },
                { "label": "Email: salam@aromakampung.my", "url": "mailto:salam@aromakampung.my" }
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
      "title": "Aroma Kampung - Biskut Tradisional Kampung",
      "description": "Tempah biskut tradisional kampung diperbuat dengan kasih sayang. Kuih siput, biskut kacang tanah, lidah kucing. Penghantaran ke seluruh Malaysia.",
      "keywords": "aroma kampung, kuih siput, biskut kacang tanah, lidah kucing, biskut kampung, kuih tradisional, malaysia"
    },
    "theme": {
      "primaryColor": "#78350f",
      "fontFamily": "Inter"
    }
  }'::jsonb
);
