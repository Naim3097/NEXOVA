-- Migration: Add Baju Raya E-commerce Template
-- Date: 2026-01-18
-- Purpose: Create a high-converting e-commerce template for Baju Raya fashion brand

INSERT INTO templates (
  id,
  name,
  slug,
  description,
  category,
  industry,
  thumbnail_url,
  preview_url,
  tags,
  is_public,
  usage_count,
  data
) VALUES (
  gen_random_uuid(),
  'Baju Raya Collection',
  'baju-raya-collection',
  'A beautiful e-commerce template perfect for selling Baju Raya, Baju Melayu, and traditional Malay clothing. Features elegant design, size guides, delivery info, and WhatsApp ordering. Optimized for Hari Raya sales campaigns.',
  'ecommerce',
  'Fashion',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&h=800&fit=crop',
  ARRAY['baju raya', 'fashion', 'ecommerce', 'hari raya', 'baju melayu', 'clothing', 'traditional', 'malaysia', 'raya'],
  true,
  0,
  '{
    "seo_settings": {
      "title": "Koleksi Baju Raya 2026 | Baju Melayu & Kurung Terkini",
      "description": "Dapatkan koleksi Baju Raya terbaru dengan harga berpatutan. Baju Melayu, Baju Kurung, dan set family matching. Penghantaran percuma ke seluruh Malaysia.",
      "ogType": "product",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "ms"
    },
    "theme": {
      "primaryColor": "#7c3aed",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "PROMOSI RAYA! Diskaun Sehingga 50% + Penghantaran PERCUMA",
          "bgColor": "#7c3aed",
          "textColor": "#ffffff",
          "showCountdown": true,
          "countdownLabel": "Tamat dalam:",
          "countdownEndDate": "2026-03-31T23:59:59",
          "isSticky": true,
          "showCloseButton": false,
          "link": "#pricing",
          "linkText": "Beli Sekarang"
        }
      },
      {
        "type": "navigation",
        "order": 1,
        "props": {
          "logo": "",
          "logoText": "RAYA COLLECTION",
          "menuItems": [
            {"label": "Koleksi", "url": "#pricing"},
            {"label": "Testimoni", "url": "#testimonials"},
            {"label": "Soalan Lazim", "url": "#faq"}
          ],
          "ctaButton": {"text": "Tempah Sekarang", "url": "#order"},
          "bgColor": "#ffffff",
          "textColor": "#111827",
          "isSticky": true,
          "layout": "left"
        }
      },
      {
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Koleksi Baju Raya 2026",
          "subheadline": "Tampil bergaya sempena Hari Raya dengan koleksi eksklusif kami. Baju Melayu, Baju Kurung & Set Sedondon untuk sekeluarga.",
          "ctaText": "Lihat Koleksi",
          "ctaUrl": "#pricing",
          "image": "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&h=900&fit=crop",
          "bgColor": "#faf5ff",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#f3e8ff",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 60,
          "buttonBgColor": "#7c3aed",
          "buttonTextColor": "#ffffff"
        }
      },
      {
        "type": "features",
        "order": 3,
        "props": {
          "variant": "grid",
          "title": "Kenapa Pilih Kami?",
          "features": [
            {"icon": "sparkles", "title": "Kain Premium", "description": "Menggunakan kain berkualiti tinggi yang selesa, lembut dan tahan lama"},
            {"icon": "award", "title": "Rekaan Eksklusif", "description": "Corak dan design terkini yang moden namun tetap tradisional"},
            {"icon": "rocket", "title": "Penghantaran Cepat", "description": "Penghantaran dalam 2-3 hari bekerja ke seluruh Malaysia"},
            {"icon": "shield", "title": "Jaminan Kualiti", "description": "Wang dikembalikan jika tidak berpuas hati dengan produk"},
            {"icon": "users", "title": "Set Sekeluarga", "description": "Koleksi matching untuk seluruh ahli keluarga"},
            {"icon": "gift", "title": "Hadiah Percuma", "description": "Free gift exclusive untuk pembelian melebihi RM200"}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "pricing",
        "order": 4,
        "props": {
          "title": "Koleksi Pilihan Kami",
          "subtitle": "Harga istimewa sempena Hari Raya 2026",
          "layout": "cards",
          "plans": [
            {
              "name": "Baju Melayu Slim Fit",
              "price": "89",
              "currency": "RM",
              "period": "per helai",
              "description": "Baju Melayu moden dengan potongan slim fit yang kemas",
              "features": ["Kain cotton berkualiti tinggi", "Potongan slim fit moden", "Tersedia dalam 8 warna", "Saiz XS hingga 4XL", "Butang kayu premium", "Jahitan kemas dan rapi"],
              "buttonText": "Tempah Sekarang",
              "buttonUrl": "#order",
              "highlighted": false
            },
            {
              "name": "Set Sedondon Lelaki + Wanita",
              "price": "169",
              "currency": "RM",
              "period": "per set",
              "description": "Set matching untuk pasangan - paling popular!",
              "features": ["1x Baju Melayu Slim Fit", "1x Baju Kurung Moden", "Kain premium berkualiti", "Warna matching yang cantik", "FREE samping bernilai RM39", "Kotak hadiah eksklusif"],
              "buttonText": "Pilihan Popular!",
              "buttonUrl": "#order",
              "highlighted": true
            },
            {
              "name": "Set Family (4 orang)",
              "price": "299",
              "currency": "RM",
              "period": "per set",
              "description": "Set lengkap untuk sekeluarga - Ayah, Ibu & 2 Anak",
              "features": ["1x Baju Melayu Dewasa", "1x Baju Kurung Dewasa", "2x Baju Kanak-kanak", "Semua saiz tersedia", "FREE 2x samping/selendang", "Penghantaran PERCUMA"],
              "buttonText": "Set Jimat!",
              "buttonUrl": "#order",
              "highlighted": false
            }
          ],
          "bgColor": "#faf5ff"
        }
      },
      {
        "type": "testimonials",
        "order": 5,
        "props": {
          "variant": "grid",
          "title": "Apa Kata Pelanggan Kami",
          "testimonials": [
            {"name": "Siti Aminah", "role": "Kuala Lumpur", "quote": "Kain sangat lembut dan selesa! Anak-anak suka sangat. Tahun ni repeat order lagi untuk Raya.", "rating": 5},
            {"name": "Ahmad Firdaus", "role": "Johor Bahru", "quote": "Potongan slim fit memang kemas. Ramai puji masa rumah terbuka. Sangat berbaloi dengan harga!", "rating": 5},
            {"name": "Nurul Huda", "role": "Penang", "quote": "Set sedondon untuk family kami semua. Gambar Raya tahun ni memang cantik! Terima kasih.", "rating": 5},
            {"name": "Mohd Hafiz", "role": "Selangor", "quote": "Penghantaran cepat, dalam 2 hari dah sampai. Kualiti tiptop! Memang akan repeat order.", "rating": 5},
            {"name": "Farah Diana", "role": "Melaka", "quote": "Baju kurung moden design sangat cantik. Warna pun exactly macam gambar. Sangat puas hati!", "rating": 5},
            {"name": "Rizal Ibrahim", "role": "Sabah", "quote": "Walaupun di Sabah, sampai dalam masa seminggu. Packaging kemas dan baju sangat berkualiti.", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "cta",
        "order": 6,
        "props": {
          "variant": "centered",
          "headline": "Jangan Lepaskan Peluang Ini!",
          "description": "Stok terhad! Tempah sekarang sebelum kehabisan. Promosi tamat 31 Mac 2026.",
          "buttonText": "Tempah Sekarang",
          "buttonUrl": "#order",
          "bgGradient": "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
          "buttonColor": "#ffffff",
          "buttonTextColor": "#7c3aed",
          "buttonSize": "lg"
        }
      },
      {
        "type": "faq",
        "order": 7,
        "props": {
          "variant": "single_column",
          "title": "Soalan Lazim",
          "questions": [
            {"question": "Bagaimana cara untuk mengetahui saiz yang sesuai?", "answer": "Kami menyediakan carta saiz lengkap di setiap produk. Anda boleh ukur badan anda dan rujuk carta tersebut. Jika masih ragu, WhatsApp kami dengan ukuran anda dan kami akan bantu cadangkan saiz yang sesuai."},
            {"question": "Berapa lama tempoh penghantaran?", "answer": "Untuk Semenanjung Malaysia: 2-3 hari bekerja. Untuk Sabah & Sarawak: 5-7 hari bekerja. Penghantaran PERCUMA untuk pembelian melebihi RM150."},
            {"question": "Boleh tukar saiz jika tidak muat?", "answer": "Ya, kami menawarkan pertukaran saiz PERCUMA dalam tempoh 7 hari selepas menerima barang. Pastikan tag masih ada dan baju belum dipakai/dibasuh."},
            {"question": "Apakah kaedah pembayaran yang diterima?", "answer": "Kami menerima FPX (online banking), kad kredit/debit, dan juga Cash on Delivery (COD) untuk kawasan terpilih. Boleh juga buat bayaran ansuran melalui Atome atau GrabPay Later."},
            {"question": "Boleh buat tempahan untuk kumpulan/kenduri?", "answer": "Sudah tentu! Untuk tempahan 10 helai ke atas, anda layak mendapat diskaun istimewa. WhatsApp kami untuk dapatkan sebut harga khas."},
            {"question": "Adakah warna dalam gambar sama dengan produk sebenar?", "answer": "Kami berusaha untuk menunjukkan warna sehampir mungkin dengan produk sebenar. Namun, warna mungkin sedikit berbeza bergantung kepada tetapan skrin peranti anda."},
            {"question": "Bila tarikh akhir untuk tempahan sampai sebelum Raya?", "answer": "Untuk jaminan sampai sebelum Hari Raya, sila buat tempahan selewat-lewatnya 10 hari sebelum Raya. Tempahan last minute mungkin tertakluk kepada ketersediaan stok."}
          ],
          "bgColor": "#faf5ff"
        }
      },
      {
        "type": "form_with_payment",
        "order": 8,
        "props": {
          "title": "Borang Tempahan",
          "description": "Isikan maklumat anda untuk meneruskan tempahan. Kami akan hubungi anda untuk pengesahan.",
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
            {"id": "baju-melayu-slim", "name": "Baju Melayu Slim Fit", "description": "Baju Melayu moden potongan slim fit", "price": 89, "image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop", "featured": false},
            {"id": "set-sedondon", "name": "Set Sedondon (Lelaki + Wanita)", "description": "Set matching untuk pasangan", "price": 169, "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop", "featured": true},
            {"id": "set-family", "name": "Set Family (4 orang)", "description": "Set lengkap sekeluarga", "price": 299, "image": "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200&h=200&fit=crop", "featured": false}
          ],
          "currency": "MYR",
          "submitButtonText": "Teruskan Pembayaran",
          "submitButtonColor": "#7c3aed",
          "bgColor": "#ffffff",
          "termsUrl": "#terms",
          "policyUrl": "#privacy",
          "contactUrl": "#contact",
          "companyName": "Raya Collection Sdn Bhd",
          "companyRegistration": "SSM: 202401012345"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 9,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Assalamualaikum, saya berminat dengan Koleksi Baju Raya 2026. Boleh saya tahu lebih lanjut?",
          "buttonText": "WhatsApp Kami",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "showHeadline": true,
          "headlineText": "Ada soalan? Hubungi kami terus!",
          "headlineColor": "#1f2937"
        }
      },
      {
        "type": "footer",
        "order": 10,
        "props": {
          "logo": "",
          "logoText": "RAYA COLLECTION",
          "description": "Koleksi Baju Raya berkualiti tinggi dengan harga berpatutan. Tampil bergaya bersama keluarga tersayang.",
          "columns": [
            {"title": "Pautan Pantas", "links": [{"label": "Laman Utama", "url": "#"}, {"label": "Koleksi", "url": "#pricing"}, {"label": "Testimoni", "url": "#testimonials"}, {"label": "Hubungi Kami", "url": "#contact"}]},
            {"title": "Maklumat", "links": [{"label": "Carta Saiz", "url": "#size"}, {"label": "Polisi Penghantaran", "url": "#shipping"}, {"label": "Polisi Pemulangan", "url": "#return"}, {"label": "Soalan Lazim", "url": "#faq"}]},
            {"title": "Hubungi Kami", "links": [{"label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789"}, {"label": "Email: hello@rayacollection.my", "url": "mailto:hello@rayacollection.my"}, {"label": "Isnin - Jumaat: 9am - 6pm", "url": "#"}]}
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com/rayacollection"},
            {"platform": "instagram", "url": "https://instagram.com/rayacollection"}
          ],
          "copyright": "© 2026 Raya Collection Sdn Bhd. Hak cipta terpelihara.",
          "bgColor": "#1f2937",
          "textColor": "#ffffff"
        }
      }
    ]
  }'::jsonb
);
