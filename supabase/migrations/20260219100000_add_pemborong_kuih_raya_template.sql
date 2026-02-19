-- Pemborong Kuih Raya Template (E-commerce)
-- Theme: Maroon & Cream, Variants: hero=image_bg, features=list (with images), testimonials=grid, faq=two_column, cta=centered
-- Brand: SHAMEERA FOOD INDUSTRY SDN BHD (Pemborong Kuih Raya)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Pemborong Kuih Raya',
  'pemborong-kuih-raya',
  'ecommerce',
  'Food & Beverage',
  'Template e-dagang premium untuk pemborong kuih raya. Tema maroon dan krim yang elegan dengan reka bentuk moden. Termasuk pameran produk, borang tempahan dengan pembayaran, testimoni, dan FAQ.',
  'https://bazaramadhanbangi.com/wp-content/uploads/2020/04/TART-NENAS-2020-300x300.jpeg',
  'https://bazaramadhanbangi.com/wp-content/uploads/2020/04/TART-NENAS-2020-300x300.jpeg',
  true,
  ARRAY['pemborong kuih raya', 'kuih raya', 'cookies', 'tart nenas', 'makmur', 'chocolate chip', 'borong', 'raya', 'ecommerce', 'malaysia', 'wholesale'],
  '{
    "elements": [
      {
        "id": "pemborong-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Harga Borong Terendah! Tempahan Kuih Raya 2026 Kini Dibuka - Penghantaran Seluruh Malaysia",
          "bgColor": "#800020",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Tempahan ditutup:",
          "countdownEndDate": "2026-03-20T23:59:59"
        }
      },
      {
        "id": "pemborong-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "PEMBORONG KUIH RAYA",
          "logo": "",
          "menuItems": [
            { "label": "Produk Kami", "url": "#product_carousel-4" },
            { "label": "Kelebihan", "url": "#features-3" },
            { "label": "Testimoni", "url": "#testimonials-6" },
            { "label": "Soalan Lazim", "url": "#faq-7" }
          ],
          "bgColor": "#fdf6f0",
          "textColor": "#800020",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Tempah Sekarang",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "pemborong-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Gedung Kuih Raya Terbesar & Termurah",
          "subheadline": "Pembekal utama kuih raya berkualiti tinggi dengan harga borong. Lebih 50 jenis kuih raya tradisional dan moden untuk pilihan anda. Penghantaran ke seluruh Malaysia.",
          "ctaText": "Lihat Koleksi Kami",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1920&q=80",
          "bgColor": "#800020",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#fde8d0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 60,
          "buttonBgColor": "#d4a017",
          "buttonTextColor": "#3e2723",
          "showCtaButton": true
        }
      },
      {
        "id": "pemborong-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Kenapa Pilih Kami?",
          "variant": "list",
          "backgroundImage": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80",
          "backgroundOpacity": 85,
          "bgColor": "#fdf6f0",
          "features": [
            {
              "image": "https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=300&h=300&fit=crop",
              "title": "100% Buatan Tangan",
              "description": "Setiap kuih dihasilkan secara handmade menggunakan resipi turun-temurun. Rasa autentik yang tidak dapat ditandingi oleh produk kilang."
            },
            {
              "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop",
              "title": "Bahan Premium Berkualiti",
              "description": "Hanya menggunakan mentega tulen, tepung terbaik, dan bahan-bahan import berkualiti tinggi. Tanpa pengawet dan pewarna tiruan."
            },
            {
              "image": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=300&fit=crop",
              "title": "Pembungkusan Eksklusif",
              "description": "Balang premium dengan label cantik dan pembungkusan kemas. Sesuai untuk dijadikan hadiah, doorgift, dan buah tangan Hari Raya."
            },
            {
              "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop",
              "title": "Harga Borong Terbaik",
              "description": "Harga terendah di pasaran dengan kualiti premium. Diskaun istimewa untuk pesanan pukal dan tempahan korporat."
            },
            {
              "image": "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&h=300&fit=crop",
              "title": "Penghantaran Selamat & Pantas",
              "description": "Dibungkus dengan teliti dan dihantar ke seluruh Malaysia. Penghantaran express tersedia. Percuma untuk pesanan RM200 ke atas."
            },
            {
              "image": "https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=300&h=300&fit=crop",
              "title": "Jaminan Puas Hati 100%",
              "description": "Kami yakin dengan kualiti produk kami. Jika tidak berpuas hati, wang anda akan dikembalikan sepenuhnya tanpa soalan."
            }
          ]
        }
      },
      {
        "id": "pemborong-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Koleksi Kuih Raya Pilihan",
          "subtitle": "Kuih raya berkualiti premium dengan harga borong yang berpatutan. Setiap balang dipenuhi dengan keenakan tradisional.",
          "cardStyle": "shadow",
          "products": [
            {
              "id": "chocolate-chip",
              "code": "PKR-001",
              "name": "Chocolate Chip Cookies",
              "description": "Biskut chocolate chip rangup di luar, lembut di dalam. Dipenuhi dengan cip coklat Belgium premium. Kegemaran semua peringkat umur!",
              "image_url": "https://bazaramadhanbangi.com/wp-content/uploads/2020/04/CHOCOLATE-CHIP-1-300x300.jpeg",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "kuih-makmur",
              "code": "PKR-002",
              "name": "Makmur Cookies",
              "description": "Kuih makmur lembut yang hancur di mulut dengan inti kacang tanah rangup. Resipi warisan yang terjamin keasliannya sejak turun-temurun.",
              "image_url": "https://bazaramadhanbangi.com/wp-content/uploads/2020/04/MAKMUR-300x300.jpeg",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "mama-carie",
              "code": "PKR-003",
              "name": "Mama Carie Cookies",
              "description": "Biskut mentega premium dengan rasa yang unik dan istimewa. Tekstur lembut dan cair di mulut. Pilihan eksklusif untuk Hari Raya.",
              "image_url": "https://bazaramadhanbangi.com/wp-content/uploads/2020/04/MAMA-CARIE-300x300.jpeg",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "tart-nenas",
              "code": "PKR-004",
              "name": "Tart Nenas",
              "description": "Tart nenas rangup dengan jem nenas asli yang pekat dan manis. Dibakar sempurna dengan mentega berkualiti tinggi. Wajib ada setiap Raya!",
              "image_url": "https://bazaramadhanbangi.com/wp-content/uploads/2020/04/TART-NENAS-2020-300x300.jpeg",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#fdf6f0"
        }
      },
      {
        "id": "pemborong-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Borang Tempahan Kuih Raya",
          "description": "Isikan maklumat anda dan pilih kuih raya kegemaran untuk meneruskan tempahan. Harga borong untuk semua pelanggan!",
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
              "id": "chocolate-chip",
              "name": "Chocolate Chip Cookies",
              "description": "1 balang (50 biji)",
              "price": 25
            },
            {
              "id": "kuih-makmur",
              "name": "Makmur Cookies",
              "description": "1 balang (40 biji)",
              "price": 25
            },
            {
              "id": "mama-carie",
              "name": "Mama Carie Cookies",
              "description": "1 balang (45 biji)",
              "price": 25
            },
            {
              "id": "tart-nenas",
              "name": "Tart Nenas",
              "description": "1 balang (50 biji)",
              "price": 25
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Teruskan Pembayaran",
          "submitButtonColor": "#800020",
          "bgColor": "#ffffff",
          "companyName": "Pemborong Kuih Raya",
          "companyRegistration": "SHAMEERA FOOD INDUSTRY SDN BHD (202303033976)"
        }
      },
      {
        "id": "pemborong-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "Apa Kata Pelanggan Kami",
          "variant": "grid",
          "backgroundImage": "https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=1920&q=80",
          "backgroundOpacity": 90,
          "bgColor": "#fdf6f0",
          "testimonials": [
            {
              "name": "Puan Aishah",
              "role": "Peniaga Kuih Raya, Klang",
              "quote": "Dah 3 tahun ambil stok sini. Harga memang paling murah dan kualiti terjamin. Pelanggan saya semua repeat order setiap tahun!",
              "rating": 5
            },
            {
              "name": "Encik Faizal",
              "role": "Pengurus HR, Syarikat Korporat",
              "quote": "Order 100 balang untuk hamper Raya syarikat. Semua staff puji rasa dan pembungkusan yang cantik. Harga borong sangat berbaloi!",
              "rating": 5
            },
            {
              "name": "Kak Zarina",
              "role": "Suri Rumah, Shah Alam",
              "quote": "Tart nenas dan chocolate chip memang terbaik! Anak-anak tak sabar tunggu Raya sebab nak makan kuih dari sini. Memang jadi langganan tetap.",
              "rating": 5
            },
            {
              "name": "Datin Mariam",
              "role": "Pelanggan Setia, Petaling Jaya",
              "quote": "Kuih makmur dia memang hancur di mulut. Sama macam arwah mak buat dulu. Setiap Raya mesti order minimum 20 balang untuk bagi sedara-mara.",
              "rating": 5
            }
          ]
        }
      },
      {
        "id": "pemborong-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Soalan Lazim",
          "variant": "two_column",
          "bgColor": "#ffffff",
          "questions": [
            {
              "question": "Berapakah harga borong untuk kuih raya?",
              "answer": "Semua kuih raya kami bermula dari RM25 sebalang. Untuk pesanan pukal melebihi 50 balang, hubungi kami untuk harga istimewa yang lebih rendah."
            },
            {
              "question": "Adakah pesanan minimum untuk harga borong?",
              "answer": "Tiada pesanan minimum! Anda boleh order sebalang pun dengan harga borong kami. Namun, diskaun tambahan diberikan untuk pesanan 10 balang ke atas."
            },
            {
              "question": "Berapa lama jangka hayat kuih raya?",
              "answer": "Kuih raya kami tahan sehingga 3-4 minggu jika disimpan dalam bekas kedap udara pada suhu bilik. Lebih tahan lama jika disimpan dalam peti sejuk sehingga 6 minggu."
            },
            {
              "question": "Boleh buat tempahan untuk hamper korporat?",
              "answer": "Boleh! Kami menyediakan perkhidmatan hamper korporat dengan pembungkusan eksklusif. Hubungi kami melalui WhatsApp untuk sebut harga dan customisation."
            },
            {
              "question": "Bagaimana dengan penghantaran?",
              "answer": "Penghantaran ke seluruh Semenanjung Malaysia (2-3 hari bekerja) dan Sabah & Sarawak (5-7 hari bekerja). Percuma penghantaran untuk pesanan RM200 ke atas."
            },
            {
              "question": "Adakah sijil halal dan kelulusan MESTI?",
              "answer": "Ya, semua produk kami telah mendapat pengesahan halal dan mematuhi piawaian keselamatan makanan. Kami berdaftar di bawah SHAMEERA FOOD INDUSTRY SDN BHD."
            }
          ]
        }
      },
      {
        "id": "pemborong-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "centered",
          "headline": "Tempah Kuih Raya Sekarang!",
          "description": "Jangan tunggu saat akhir! Tempah kuih raya berkualiti premium dengan harga borong terendah. Stok terhad untuk musim Raya 2026.",
          "buttonText": "Tempah Sekarang",
          "buttonUrl": "#form_with_payment-5",
          "backgroundImage": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80",
          "backgroundOpacity": 70,
          "buttonColor": "#d4a017",
          "buttonTextColor": "#3e2723"
        }
      },
      {
        "id": "pemborong-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "PEMBORONG KUIH RAYA",
          "description": "Gedung kuih raya terbesar dan termurah. Pembekal utama kuih raya berkualiti tinggi dengan harga borong ke seluruh Malaysia.",
          "copyright": "2026 Pemborong Kuih Raya oleh SHAMEERA FOOD INDUSTRY SDN BHD. Hakcipta terpelihara.",
          "bgColor": "#800020",
          "textColor": "#fdf6f0",
          "columns": [
            {
              "title": "Pautan Pantas",
              "links": [
                { "label": "Koleksi Kuih Raya", "url": "#product_carousel-4" },
                { "label": "Tempah Sekarang", "url": "#form_with_payment-5" },
                { "label": "Testimoni", "url": "#testimonials-6" },
                { "label": "Soalan Lazim", "url": "#faq-7" }
              ]
            },
            {
              "title": "Hubungi Kami",
              "links": [
                { "label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789" },
                { "label": "Email: order@pemborongkuihraya.com", "url": "mailto:order@pemborongkuihraya.com" },
                { "label": "Alamat: No 49, Jalan Ehsan Perdana 4, Taman Ehsan Jaya, 42000 Pelabuhan Klang, Selangor", "url": "#" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com/kuihraya.padu" },
            { "platform": "facebook", "url": "https://facebook.com/pemborongkuihraya" },
            { "platform": "tiktok", "url": "https://tiktok.com/@pemborongkuihraya" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Pemborong Kuih Raya - Gedung Kuih Raya Terbesar & Termurah",
      "description": "Tempah kuih raya berkualiti premium dengan harga borong. Chocolate chip cookies, kuih makmur, tart nenas dan pelbagai lagi. Penghantaran ke seluruh Malaysia.",
      "keywords": "pemborong kuih raya, kuih raya borong, harga borong kuih raya, tart nenas, kuih makmur, chocolate chip cookies, biskut raya, hari raya, malaysia"
    },
    "theme": {
      "primaryColor": "#800020",
      "fontFamily": "Inter"
    }
  }'::jsonb
);
