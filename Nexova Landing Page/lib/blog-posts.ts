/* ─────────────────────────────────────────────────────────────────────────── */
/*  Blog post data — single source of truth                                    */
/*                                                                             */
/*  To add a new post:                                                         */
/*    1. Add an entry to the POSTS array below.                                */
/*    2. The index page (/blog), the post page (/blog/[slug]), and the         */
/*       sitemap all update automatically — no other files need editing.       */
/*                                                                             */
/*  Required fields:                                                           */
/*    slug      — URL-safe identifier, e.g. 'my-new-post'                    */
/*    title     — Full post title                                              */
/*    category  — Must be a key in CATEGORY_COLORS below                      */
/*    date      — ISO date string 'YYYY-MM-DD'                                */
/*    readTime  — e.g. '5 min'                                                 */
/*    excerpt   — One-sentence summary shown on the index card                */
/*    sections  — Array of { heading?: string; body: string }                 */
/*                First section typically has no heading (intro paragraph)    */
/* ─────────────────────────────────────────────────────────────────────────── */

export type PostSection = {
  heading?: string;
  body: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image?: string;
  sections: PostSection[];
};

export const CATEGORY_COLORS: Record<string, string> = {
  Tutorial: 'bg-teal-50 text-teal-700',
  Design: 'bg-purple-50 text-purple-700',
  Payments: 'bg-emerald-50 text-emerald-700',
  Development: 'bg-blue-50 text-blue-700',
  Product: 'bg-orange-50 text-orange-700',
  Growth: 'bg-rose-50 text-rose-700',
  'E-Commerce': 'bg-amber-50 text-amber-700',
  Marketing: 'bg-pink-50 text-pink-700',
  Operations: 'bg-sky-50 text-sky-700',
};

/* ─────────────────────────────────────── */
/*  Add new posts at the TOP of this array */
/*  (newest first = correct index order)   */
/* ─────────────────────────────────────── */
export const POSTS: BlogPost[] = [
  /* ── Batch 2 — Expanded Niches & Categories ──────── */
  {
    slug: 'how-to-start-online-f-and-b-business-malaysia',
    title:
      'How to start an online F&B business in Malaysia: from menu to first sale',
    category: 'E-Commerce',
    date: '2026-04-14',
    readTime: '10 min',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
    excerpt:
      'A step-by-step guide for Malaysian F&B entrepreneurs — from building your online menu to processing your first FPX payment.',
    sections: [
      {
        body: 'Malaysia\'s food industry is worth over RM 65 billion, yet a huge number of F&B operators still rely on walk-ins and WhatsApp orders. The pandemic proved that an online ordering presence is not optional — it is a survival requirement. Whether you run a home-based bakery, a nasi lemak stall, or a café chain, getting online properly means more than just posting on Instagram. It means having a structured menu, accepting payments digitally, and tracking which products actually sell.',
      },
      {
        heading: 'Step 1 — Build your digital menu page',
        body: 'Forget PDFs and image-based menus. A proper digital menu is a landing page with product cards, clear pricing in RM, high-quality food photography, and a direct order flow. With a no-code builder like X.IDE, you can drag-and-drop a product grid, add variant options (size, spice level, add-ons), and publish in under two hours. Use niche-specific templates designed for F&B — they already include sections for bestsellers, combo deals, and operating hours.',
      },
      {
        heading: 'Step 2 — Set up Malaysian payment processing',
        body: 'Your customers want to pay with FPX, Touch \'n Go eWallet, or GrabPay — not dig out a credit card. Integrating these methods used to require a developer and weeks of work. With LeanX (https://leanx.io/) integrated natively into your page builder, you activate Malaysian payment methods in minutes. Settlement is fast, and you get a dashboard to track every transaction. This is the single biggest friction remover for F&B businesses going online.',
      },
      {
        heading: 'Step 3 — Drive orders with social media + SEO',
        body: 'Once your page is live, share the link everywhere — Instagram bio, WhatsApp status, Google Business Profile. Set up Meta Pixel tracking so you can retarget people who viewed your menu but did not order. Write a blog post about your signature dish and optimise it for local search terms like "best nasi lemak delivery KL". The combination of a conversion-optimised page and targeted traffic is what separates hobby sellers from real F&B businesses.',
      },
      {
        heading: 'Step 4 — Optimise based on data',
        body: 'Track which items get the most views versus actual purchases. If your ayam goreng page gets traffic but low conversion, the problem might be pricing, photography, or a confusing checkout. Use your analytics dashboard to identify drop-off points. A/B test different hero images. Over time, your data tells you exactly what to promote and what to retire.',
      },
      {
        heading: 'The bottom line',
        body: 'Starting an online F&B business in Malaysia is no longer expensive or complicated. The tools exist. The payment infrastructure — specifically Malaysian-focused gateways like LeanX (https://leanx.io/) — is ready. The only question is whether you start today or let your competitors get there first.',
      },
    ],
  },
  {
    slug: 'google-ads-landing-page-tips-malaysia',
    title:
      '7 landing page rules that make your Google Ads actually convert in Malaysia',
    category: 'Marketing',
    date: '2026-04-13',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    excerpt:
      'Spending on Google Ads but getting poor ROAS? Your landing page is probably the problem — here are 7 fixes.',
    sections: [
      {
        body: 'Malaysian businesses collectively spend millions on Google Ads every month, yet the average conversion rate hovers around 2-3%. The gap between a 2% and a 6% conversion rate is not better keywords — it is a better landing page. Your ad gets the click; your landing page gets the sale. If you are sending paid traffic to your homepage or a generic page, you are burning money.',
      },
      {
        heading: '1. Match your headline to the search intent',
        body: 'If someone searches "beli tilam murah online", your landing page headline must immediately confirm they are in the right place. A headline like "Premium Mattresses — Free Delivery KL/Selangor" matches intent perfectly. A generic "Welcome to Our Store" does not. This single change can improve conversion by 30-50%.',
      },
      {
        heading: '2. Show pricing in RM — immediately',
        body: 'Malaysian buyers want to see prices upfront. Do not hide pricing behind a "Contact Us" form unless you are selling enterprise B2B services. For consumer products, show the price with any available instalment options (BNPL via Atome, FPX monthly). Transparency builds trust and reduces bounce.',
      },
      {
        heading: '3. Add Malaysian payment trust signals',
        body: 'Display the payment methods you accept — FPX, GrabPay, Touch \'n Go, credit cards. Malaysian shoppers look for these logos before they commit. When your checkout is powered by a trusted Malaysian payment gateway like LeanX (https://leanx.io/), conversion friction drops dramatically because buyers see familiar, local payment options.',
      },
      {
        heading: '4. One page, one goal',
        body: 'Your Google Ads landing page should have one CTA — buy, book, or enquire. Remove navigation menus, footer links, and anything that distracts from the conversion goal. Every element on the page should push toward that single action. This is why dedicated landing pages built in tools like X.IDE outperform generic website pages.',
      },
      {
        heading: '5. Load fast on mobile',
        body: 'Over 85% of Malaysian internet users browse on mobile. If your page takes more than 3 seconds to load, you lose half your visitors. Use optimised images (WebP format), minimal JavaScript, and a builder that outputs lightweight code. Test with Google PageSpeed Insights — aim for 90+ on mobile.',
      },
      {
        heading: '6. Add social proof in Bahasa and English',
        body: 'Testimonials, review screenshots, and "X customers served" counters work powerfully in Malaysia. Use bilingual social proof — BM for mass market, English for urban/professional segments. Video testimonials from real customers are the highest-converting format.',
      },
      {
        heading: '7. Set up conversion tracking properly',
        body: 'Without proper tracking, you cannot optimise. Install Google Ads conversion tracking, Google Analytics 4, and Meta Pixel on every landing page. Track add-to-cart, form submissions, and completed purchases separately. This data feeds Google\'s algorithm and improves your ad targeting over time. Platforms like X.IDE let you set up all pixels in one settings panel — no code required.',
      },
    ],
  },
  {
    slug: 'instagram-shop-to-real-website-malaysia',
    title:
      'Why your Instagram shop needs a real website (and how to build one in a day)',
    category: 'E-Commerce',
    date: '2026-04-12',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80',
    excerpt:
      'Instagram is great for discovery, but terrible for closing sales — here is how to bridge the gap.',
    sections: [
      {
        body: 'Thousands of Malaysian businesses run entirely on Instagram — posting product photos, taking orders via DM, and collecting payments through manual bank transfer. It works, until it does not. You lose track of orders, customers ghost after requesting your bank details, and you have zero analytics on what products people actually want. Instagram is a discovery platform, not a sales platform.',
      },
      {
        heading: 'The DM-to-sale conversion problem',
        body: 'Studies show that for every 10 DM enquiries, only 2-3 convert to actual purchases. The friction is enormous: customers ask for price, you reply, they ask for size/colour, you reply, they ask for postage, you reply, they say "I\'ll think about it" — and disappear. A product page with clear pricing, variants, shipping info, and a one-click checkout eliminates 80% of this back-and-forth.',
      },
      {
        heading: 'What your website needs to do',
        body: 'You do not need a complex e-commerce store. You need a simple, beautiful product page with: high-quality product images, clear pricing in RM, variant selection (size, colour), a checkout that accepts FPX and e-wallets via LeanX (https://leanx.io/), and a WhatsApp button for support. That is it. One page per product or collection, linked from your Instagram bio.',
      },
      {
        heading: 'Build it in one day — seriously',
        body: 'With X.IDE, you pick a template, replace the images and text with your own products, connect your LeanX (https://leanx.io/) payment account, and publish. Your page gets a free subdomain immediately, or you can connect your own .com.my domain. The entire process takes 2-4 hours for someone who has never built a website before.',
      },
      {
        heading: 'Link your Instagram to your new page',
        body: 'Update your Instagram bio link to your product page (or use a link-in-bio tool pointing to multiple pages). In your Stories and Reels, add swipe-up links or "link in bio" CTAs. Now every piece of content you post drives to a conversion-optimised page instead of a DM conversation. Your conversion rate jumps, your order tracking improves, and you look professional.',
      },
      {
        heading: 'Track what works',
        body: 'Install Meta Pixel on your website to create Custom Audiences from your page visitors. Now you can run retargeting ads to people who viewed your product but did not buy — the highest-ROI ad format available. This is impossible when you are selling through DMs alone. A real website turns your Instagram from a hustle into a scalable business.',
      },
    ],
  },
  {
    slug: 'beauty-salon-website-guide-malaysia',
    title:
      'The complete website guide for Malaysian beauty salons and clinics',
    category: 'Tutorial',
    date: '2026-04-11',
    readTime: '9 min',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
    excerpt:
      'How beauty salons, spas, and aesthetic clinics in Malaysia can build a website that actually books appointments.',
    sections: [
      {
        body: 'The beauty and wellness industry in Malaysia is booming — from nail salons in SS15 to aesthetic clinics in Mont Kiara. Yet most operators still rely on WhatsApp bookings and Instagram DMs to manage appointments. The result: double bookings, no-shows, and zero data on which services drive the most revenue. A simple website changes everything.',
      },
      {
        heading: 'What your salon website must include',
        body: 'Your website needs five core sections: (1) Hero with your best interior/service photos and a "Book Now" CTA, (2) Services menu with pricing in RM, (3) Before & after gallery for treatments, (4) Booking form with date/time selection, and (5) Location map + operating hours. That is the minimum viable salon website. Anything else is a bonus.',
      },
      {
        heading: 'Accept deposits to reduce no-shows',
        body: 'No-shows cost Malaysian salons an estimated RM 500-2,000 per month. The solution: require a 50% deposit at booking. With LeanX (https://leanx.io/) payment integration, you can add a deposit payment step to your booking form. Customers pay via FPX or e-wallet when they book. No-shows drop by 60-70% overnight.',
      },
      {
        heading: 'Build once, update easily',
        body: 'Salon menus change — new treatments, seasonal promotions, price adjustments. A website built on a no-code platform like X.IDE lets you update pricing, swap photos, and add new service cards without calling a developer. You manage your own site the same way you manage your Instagram — but with the permanence and professionalism of a real web presence.',
      },
      {
        heading: 'Get found on Google',
        body: 'When someone in Bangsar searches "facial treatment near me", Google shows local results. To appear in these results, you need: a Google Business Profile (free), a website linked to that profile, and consistent NAP (Name, Address, Phone) information. Your website is the anchor that makes all your other digital marketing work harder.',
      },
      {
        heading: 'Upsell and package deals',
        body: 'Your website can do what Instagram cannot: structured upselling. Create package pages — "Bridal Glow Package", "Monthly Facial Subscription" — with clear pricing and a checkout flow. Add bump offers at checkout (add a hair mask for RM 29). These strategies increase average order value by 20-40% and are built directly into platforms like X.IDE with LeanX (https://leanx.io/) payment support.',
      },
    ],
  },
  {
    slug: 'facebook-ads-for-local-businesses-malaysia',
    title:
      'Facebook Ads for Malaysian local businesses: the only guide you need in 2026',
    category: 'Marketing',
    date: '2026-04-10',
    readTime: '11 min',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80',
    excerpt:
      'A practical, no-fluff Facebook Ads guide specifically for Malaysian local businesses — from budget to targeting to landing pages.',
    sections: [
      {
        body: 'Facebook and Instagram remain the dominant advertising platforms for Malaysian local businesses. With over 28 million Malaysian users on META platforms, the reach is unmatched. But reach without strategy is just noise. This guide covers everything you need to run profitable META ads as a local business in Malaysia — from RM 10/day budgets to advanced retargeting.',
      },
      {
        heading: 'Start with the right campaign objective',
        body: 'For local businesses, there are really only three objectives that matter: Traffic (drive people to your website/landing page), Leads (collect contact information directly on Facebook), and Conversions (optimise for purchases or bookings). If you are just starting, use Traffic to your landing page. Once you have 50+ conversions tracked, switch to Conversion optimisation — Facebook\'s algorithm gets smarter with data.',
      },
      {
        heading: 'Targeting: go hyper-local',
        body: 'Target by radius around your business location (5-15km for urban, 25km for suburban). Layer with interests relevant to your industry — "Skincare" for beauty salons, "Home renovation" for contractors, "Fitness" for gyms. Exclude ages outside your customer profile. For Malaysia specifically, test separate ad sets for BM and English audiences — the messaging style differs significantly.',
      },
      {
        heading: 'Creative that works in Malaysia',
        body: 'Video outperforms static images by 2-3x in the Malaysian market. Shoot short, authentic videos (15-30 seconds) showing your product or service in action. Use text overlays in both BM and English. Include the price — Malaysians respond to price transparency. Before-and-after content works exceptionally well for beauty, renovation, and automotive businesses.',
      },
      {
        heading: 'The landing page is where money is made or lost',
        body: 'Your ad gets the click. Your landing page gets the sale. Sending traffic to your Instagram page or a generic homepage is the most common (and expensive) mistake. Build a dedicated landing page for each ad campaign with a headline that matches your ad copy, the same offer/price shown in the ad, Malaysian payment options via LeanX (https://leanx.io/), and a single clear CTA. Tools like X.IDE let you build and publish these pages in hours, not weeks.',
      },
      {
        heading: 'Budget: start small, scale what works',
        body: 'Start with RM 20-30/day per ad set. Run for 3-5 days before judging performance. If cost per click is under RM 1 and cost per lead is under RM 15, you have a winner — increase budget by 20% every 3 days. If not, change the creative first, then the audience, then the offer. Never scale a losing ad.',
      },
      {
        heading: 'Retargeting: the profit multiplier',
        body: 'Install Meta Pixel on your website. After 7 days, create a Custom Audience of people who visited but did not convert. Run a retargeting campaign to this audience with a stronger offer — a discount, free delivery, or limited-time bonus. Retargeting typically converts at 3-5x the rate of cold traffic. This is why having a proper website with pixel tracking is non-negotiable.',
      },
      {
        heading: 'Measure what matters',
        body: 'The metrics that matter for local businesses: Cost Per Lead (CPL), Cost Per Acquisition (CPA), and Return on Ad Spend (ROAS). Ignore vanity metrics like reach and impressions. Set up proper conversion tracking from day one — this is the foundation of profitable advertising. Your analytics dashboard should show you exactly which ad, which audience, and which landing page drives the most revenue.',
      },
    ],
  },
  {
    slug: 'ecommerce-shipping-guide-malaysia',
    title:
      'E-commerce shipping in Malaysia: costs, providers, and how to not lose money on delivery',
    category: 'Operations',
    date: '2026-04-09',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&q=80',
    excerpt:
      'A practical breakdown of Malaysian shipping options, pricing strategies, and how to turn delivery from a cost centre into a competitive advantage.',
    sections: [
      {
        body: 'Shipping is often the make-or-break factor for Malaysian e-commerce businesses. Charge too much and customers abandon cart. Offer free shipping and your margins disappear. The key is understanding the actual costs, choosing the right courier partners, and building shipping into your pricing strategy — not treating it as an afterthought.',
      },
      {
        heading: 'Malaysian courier landscape in 2026',
        body: 'The major players: J&T Express (fastest growing, strong Shopee integration), Pos Laju (widest coverage including East Malaysia), DHL eCommerce (reliable for West Malaysia), Ninja Van (competitive rates for SMEs), and GDex (budget option for lightweight items). Each has different strengths — J&T for speed, Pos Laju for rural reach, Ninja Van for volume discounts. Most SMEs should work with 2-3 couriers to optimise for cost and coverage.',
      },
      {
        heading: 'Pricing strategies that work',
        body: 'Three approaches: (1) Flat rate — e.g., RM 8 West Malaysia, RM 15 East Malaysia. Simple and predictable. (2) Free shipping above a threshold — "Free shipping for orders above RM 100." This increases average order value by 15-30%. (3) Built-in shipping — add RM 5-8 to your product price and advertise "free shipping." Psychologically, customers prefer paying RM 58 with free shipping over RM 50 + RM 8 delivery.',
      },
      {
        heading: 'Integrate shipping into your checkout flow',
        body: 'Your checkout page should calculate shipping automatically based on the customer\'s postcode. Show the delivery estimate ("3-5 business days to Johor") next to the shipping fee. When your payment processing is handled by a reliable gateway like LeanX (https://leanx.io/), the total — including shipping — is charged in one seamless transaction. No manual calculations, no awkward "I\'ll DM you the total" messages.',
      },
      {
        heading: 'Packaging tips that save money',
        body: 'Courier pricing is based on actual weight or volumetric weight — whichever is higher. Use the smallest box possible. Invest in polymailer bags for clothing and soft goods (half the volumetric cost of boxes). Buy packaging in bulk — a box that costs RM 2.50 each drops to RM 1.20 at quantities of 200+. These savings compound at scale.',
      },
      {
        heading: 'Handle returns before they happen',
        body: 'State your return policy clearly on your product page. For fashion and beauty, expect 5-10% returns. Build this into your pricing. Offer exchanges as the default option instead of refunds — this retains revenue while keeping customers happy. The best return policy is a product page so good that customers know exactly what they are buying before they click "Pay".',
      },
    ],
  },
  {
    slug: 'tiktok-shop-vs-own-website-malaysia',
    title:
      'TikTok Shop vs your own website: where should Malaysian sellers focus in 2026?',
    category: 'E-Commerce',
    date: '2026-04-08',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=1200&q=80',
    excerpt:
      'TikTok Shop is booming in Malaysia, but smart sellers are building their own websites too — here is why.',
    sections: [
      {
        body: 'TikTok Shop has taken Malaysia by storm. In 2025-2026 alone, thousands of businesses started selling directly through TikTok\'s in-app checkout. The attraction is obvious: massive reach, algorithm-driven discovery, and a young, engaged audience. But there is a growing tension — businesses that rely solely on TikTok Shop are building on rented land.',
      },
      {
        heading: 'The case for TikTok Shop',
        body: 'TikTok Shop is unmatched for discovery. A single viral video can generate thousands of sales overnight. The algorithm favours authentic, engaging content over polished ads. Commission rates (1-5%) are reasonable. For new brands with zero audience, TikTok Shop provides instant access to millions of Malaysian users without any upfront investment in a website or paid ads.',
      },
      {
        heading: 'The risks of platform dependency',
        body: 'TikTok controls the algorithm, the customer data, and the rules. A policy change can tank your sales overnight. You do not own your customer list — TikTok does. You cannot retarget buyers on other platforms. Your pricing is visible to every competitor. And TikTok\'s commission structure can change at any time. Remember when Shopee raised fees? Sellers with no alternative got squeezed.',
      },
      {
        heading: 'The smart play: both',
        body: 'The most successful Malaysian e-commerce operators in 2026 use TikTok Shop for discovery and their own website for retention and margin. Here is the playbook: sell trending and entry-level products on TikTok Shop (volume play), then direct repeat customers to your own website where margins are higher and you own the data. Your website runs on your terms — your pricing, your branding, your customer relationships.',
      },
      {
        heading: 'Building your website alongside TikTok',
        body: 'Your website does not need to replicate TikTok Shop. It needs to do three things: (1) showcase your full product range with proper descriptions, (2) accept Malaysian payments seamlessly via FPX, e-wallets, and BNPL through LeanX (https://leanx.io/), and (3) capture customer emails and phone numbers for direct marketing. Build it with a no-code tool, publish it in a day, and start linking from your TikTok bio and content.',
      },
      {
        heading: 'The data advantage',
        body: 'On your own website, you see everything: which products people view, where they drop off, which traffic source converts best, and who your repeat buyers are. Install Meta Pixel and Google Analytics. Build email lists. Run retargeting ads. This data is worth more than any single TikTok sale. The businesses that win long-term are the ones that own their customer data.',
      },
    ],
  },
  {
    slug: 'home-service-business-website-malaysia',
    title:
      'How Malaysian home service businesses can get more leads with a simple website',
    category: 'Tutorial',
    date: '2026-04-07',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
    excerpt:
      'Plumbers, electricians, contractors, and cleaners — here is how a basic website can triple your monthly leads.',
    sections: [
      {
        body: 'If you run a home service business in Malaysia — plumbing, electrical, air-cond servicing, renovation, cleaning, pest control — you know that word-of-mouth and WhatsApp referrals are your bread and butter. But there is a massive untapped channel: people searching Google for "plumber near me" or "aircon service Petaling Jaya". These are people ready to hire right now, and they are going to whoever shows up first with a professional-looking website.',
      },
      {
        heading: 'Why home service businesses need a website',
        body: 'Three reasons: (1) Google Search — "plumber taman tun" gets hundreds of searches monthly. Without a website, you are invisible. (2) Credibility — a customer choosing between a business with only a WhatsApp number and one with a proper website will pick the website every time. (3) Lead capture — instead of fielding 50 WhatsApp messages asking the same questions, your website answers them and collects only serious enquiries.',
      },
      {
        heading: 'The perfect home service landing page',
        body: 'Keep it simple: Hero section with your service area ("Professional Plumbing Services — Klang Valley"), a list of services with pricing ranges, 4-5 photos of completed work, customer testimonials, and a lead form asking for name, phone, location, and problem description. That is your entire website. One page. Build it in X.IDE in 2-3 hours.',
      },
      {
        heading: 'Accept deposits for bookings',
        body: 'For larger jobs (renovation, full air-cond servicing), require a deposit to confirm the booking. This filters out time-wasters and secures your schedule. With LeanX (https://leanx.io/) payment integration, customers can pay a deposit via FPX immediately after submitting their booking request. You get the deposit in your bank account within one business day.',
      },
      {
        heading: 'Get found on Google for free',
        body: 'Set up Google Business Profile (GBP) — it is free. Add your website URL, service area, business hours, and photos. Ask happy customers to leave Google reviews. The combination of GBP + a website with relevant content (e.g., a page titled "Air-Cond Service Petaling Jaya") is how you show up in local search results without spending a sen on ads.',
      },
      {
        heading: 'Scale with paid ads when ready',
        body: 'Once your website is converting organically, amplify with Google Ads targeting "near me" searches in your service area. Start with RM 15-20/day. Each lead might cost RM 10-25, but if your average job is RM 200-500, the ROI is massive. Track every lead from click to closed job. The data will tell you exactly which services and areas are most profitable to advertise.',
      },
    ],
  },
  {
    slug: 'automotive-business-digital-marketing-malaysia',
    title:
      'Digital marketing for Malaysian automotive businesses: workshops, dealers, and detailers',
    category: 'Marketing',
    date: '2026-04-06',
    readTime: '9 min',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f7ff24f2?w=1200&q=80',
    excerpt:
      'How car workshops, used car dealers, and auto detailers in Malaysia can use digital marketing to fill their bays.',
    sections: [
      {
        body: 'The Malaysian automotive aftermarket is massive — over 33 million registered vehicles on the road, each needing regular servicing, repairs, and upgrades. Yet most workshops, dealers, and detailers still rely on signboard visibility and word-of-mouth. The businesses that embrace digital marketing are pulling ahead fast, and the barrier to entry has never been lower.',
      },
      {
        heading: 'The automotive customer journey online',
        body: 'When a car owner needs a service, they search Google ("car workshop near Subang Jaya"), ask in Facebook Groups ("recommend good spray paint shop PJ"), or search Instagram for detailing results. Your business needs to show up in at least one of these channels. The ideal setup: a Google Business Profile for search visibility, active social media for trust building, and a website for conversion.',
      },
      {
        heading: 'Building your automotive business website',
        body: 'For workshops: list your services (engine overhaul, brake service, battery replacement) with transparent pricing ranges. Show your workshop interior and equipment — cleanliness builds trust. For detailers: before-and-after galleries are your best conversion tool. For used car dealers: individual vehicle pages with specs, photos, and a "Book Test Drive" form. All of these can be built with no-code templates in X.IDE.',
      },
      {
        heading: 'Accept bookings and deposits online',
        body: 'Let customers book service appointments online with a date/time selector and optional deposit payment. Workshops that accept online bookings report 40% fewer no-shows compared to phone-only booking. Process deposits through LeanX (https://leanx.io/) — your customer pays RM 50-100 via FPX to confirm their slot, and you have guaranteed revenue before they even arrive.',
      },
      {
        heading: 'Facebook and Instagram strategy for automotive',
        body: 'Content that works: transformation videos (before/after detailing), time-lapse repair videos, customer testimonial clips, and educational content ("5 signs your brake pads need replacing"). Post 3-4 times per week. Use location tags and automotive hashtags (#workshopKL, #cardetailingMalaysia). Run targeted ads to car owners within a 10-15km radius of your location.',
      },
      {
        heading: 'Google Ads for immediate results',
        body: 'Google Ads for automotive services has high intent. Someone searching "timing belt replacement Klang" is ready to spend RM 500-1,500 today. Target specific service keywords + location. Send traffic to a dedicated landing page (not your homepage) with the service, pricing, and a booking form. At RM 2-5 per click and 5-10% conversion rate, each lead costs RM 20-100 — a fraction of the job value.',
      },
      {
        heading: 'Tracking and optimisation',
        body: 'Set up conversion tracking on your website — every form submission, every deposit payment, every phone call click. After 30 days, you will know exactly which channels drive the most valuable customers. Double down on what works, cut what does not. Digital marketing for automotive is not complicated — it just needs to be measured.',
      },
    ],
  },
  {
    slug: 'education-tuition-centre-website-malaysia',
    title:
      'How Malaysian tuition centres and educators can build a website that enrols students',
    category: 'Tutorial',
    date: '2026-04-05',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
    excerpt:
      'A practical guide for tuition centres, online tutors, and education businesses in Malaysia to get more student sign-ups through a simple website.',
    sections: [
      {
        body: 'Malaysia has one of the highest tuition rates in Southeast Asia — over 70% of students attend some form of tuition or enrichment class. That is a massive market. Yet most tuition centres still advertise through banners on fences and flyers in letterboxes. The parents who are actually making decisions for their children are searching online, reading reviews, and comparing options on their phones.',
      },
      {
        heading: 'What parents look for in a tuition centre website',
        body: 'Parents evaluating tuition centres want: (1) subjects and levels offered (SPM, IGCSE, PT3, UPSR), (2) teacher qualifications and experience, (3) class schedules and fees, (4) results and testimonials (number of students scoring A), and (5) location and contact details. A website that answers all five questions clearly will convert visitors into enrolments.',
      },
      {
        heading: 'Build your education landing page',
        body: 'Use a no-code builder like X.IDE to create a structured page: hero section with your centre\'s name and tagline ("Helping SPM Students Score A+ Since 2018"), subject cards with pricing per month, teacher profiles with credentials, a results section ("85% of our students improved by 2 grades"), and a registration form. Publish in an afternoon.',
      },
      {
        heading: 'Accept registration fees and monthly payments online',
        body: 'Replace manual bank transfers with online payment links. Send parents a payment link for registration fees, monthly tuition, or material costs. Process everything through LeanX (https://leanx.io/) — parents pay via FPX or e-wallet, you get an instant notification, and the payment is reconciled automatically. No more chasing parents for late payments with awkward WhatsApp messages.',
      },
      {
        heading: 'Sell courses and workshops online',
        body: 'Beyond regular tuition, create landing pages for intensive workshops (SPM Crash Course, IGCSE Revision Camp), holiday programmes, and online courses. Each page has its own pricing, schedule, and payment checkout. This diversifies your revenue beyond monthly tuition fees and reaches students outside your physical location.',
      },
      {
        heading: 'Get found by parents searching online',
        body: 'Optimise your website for local search terms: "tuition centre Kota Damansara", "SPM Maths tutor Ampang", "IGCSE science tuition Subang". Set up Google Business Profile, encourage parent reviews, and write a few blog posts about study tips (these rank well for education keywords). Your website becomes a 24/7 enrolment machine — working while you are in class teaching.',
      },
    ],
  },
  /* ── Batch 1 — Landing Pages, Payments & Checkout ──────── */
  {
    slug: 'why-malaysian-smes-ditching-developers-for-no-code-builders',
    title:
      'Why Malaysian SMEs are ditching web developers for no-code builders in 2026',
    category: 'Growth',
    date: '2026-04-02',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
    excerpt:
      'A cost-vs-time analysis of hiring a developer versus launching with a no-code builder — with real Malaysian pricing.',
    sections: [
      {
        body: 'The economics of building a website in Malaysia have shifted dramatically. A custom-built site from a local freelancer costs RM 3,000–8,000 and takes 4–6 weeks. A template-based build in a modern no-code builder takes an afternoon and costs under RM 80 per month. For the majority of Malaysian SMEs — particularly those testing a new product, pivoting their offer, or simply getting online for the first time — the math no longer justifies custom development as a starting point.',
      },
      {
        heading: 'The real cost of a developer build',
        body: 'Beyond the initial quote, custom development carries hidden costs: revision rounds (most freelancers cap at 2–3 before charging hourly), hosting configuration, SSL certificates, ongoing maintenance, and — most critically — time. A business that takes 6 weeks to go live has lost 6 weeks of potential revenue, customer feedback, and market validation. For a seasonal product launch or a time-sensitive campaign, that delay can be fatal.',
      },
      {
        heading: 'What no-code actually means in 2026',
        body: 'No-code does not mean no control. Modern builders like X.IDE provide drag-and-drop visual editing with full responsive control, custom CSS injection for power users, and native integrations for payments, analytics, and inventory. The output is a production-grade website with clean HTML, optimised images, and performance scores that match or exceed most developer-built sites. The trade-off is not quality — it is flexibility at the extremes (complex custom logic, bespoke animations).',
      },
      {
        heading: 'When to still hire a developer',
        body: 'Custom development is the right choice when: you need a web application (not a website), you require complex server-side logic or database operations, or you are building a SaaS product with user authentication and role-based access. For marketing sites, product pages, and e-commerce storefronts — the use cases that cover 80% of Malaysian SMEs — a no-code builder is faster, cheaper, and lower risk.',
      },
      {
        heading: 'The payment integration advantage',
        body: 'One of the strongest arguments for a unified builder is payment infrastructure. A developer build requires separate gateway integration — selecting a provider, obtaining API keys, writing server-side code, handling webhooks, and testing edge cases. With X.IDE, connecting a checkout backed by integrated payment infrastructure from LeanX (https://leanx.io/) takes minutes rather than weeks. All Malaysian methods — FPX, e-wallets, cards — are available immediately.',
      },
      {
        heading: 'The verdict',
        body: 'For Malaysian SMEs in 2026: launch first with no-code, validate demand, then invest in custom development only when your business model demands functionality that a builder cannot provide. The businesses that win are not the ones with the most sophisticated tech stack — they are the ones that got to market fastest.',
      },
    ],
  },
  {
    slug: 'anatomy-of-high-converting-malaysian-landing-page',
    title:
      'The anatomy of a high-converting Malaysian landing page (with real examples)',
    category: 'Growth',
    date: '2026-03-28',
    readTime: '9 min',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80',
    excerpt:
      'A section-by-section teardown of what Malaysian buyers respond to — from hero headlines to payment trust signals.',
    sections: [
      {
        body: 'Not all landing pages are created equal — and a page that converts in the US market will not necessarily convert in Malaysia. Malaysian buyers have specific trust triggers, communication preferences, and payment expectations that must be addressed in the page structure itself. This is a data-informed teardown of the sections that matter most.',
      },
      {
        heading: 'Hero section — clarity over cleverness',
        body: 'Malaysian buyers scroll fast and decide faster. Your hero headline needs to communicate what you sell, who it is for, and why the visitor should care — in under 3 seconds. Avoid abstract taglines. "Build professional landing pages with native Malaysian payments" outperforms "Reimagine your digital presence" every time. Pair the headline with a single, specific CTA: "Start Building Free" converts better than "Learn More".',
      },
      {
        heading: 'Social proof — the trust accelerator',
        body: 'In Malaysia, social proof carries outsized weight. Customer logos, review counts, and testimonials with real names and photos are non-negotiable for conversion. If you are pre-launch, use "Join 500+ Malaysian businesses" or similar specificity. Generic "Trusted by thousands" performs poorly because Malaysian audiences are trained to spot inflated claims.',
      },
      {
        heading: 'Payment method display — the hidden conversion lever',
        body: "Displaying recognisable payment logos (FPX, GrabPay, Touch 'n Go) at the point of decision is a proven trust signal. Merchants using modern payment gateway solutions like LeanX (https://leanx.io/) see checkout abandonment drop measurably when method icons appear above the fold. This is unique to the Malaysian market — international audiences expect cards; Malaysian audiences expect to see their bank.",
      },
      {
        heading: 'Features section — benefits, not specifications',
        body: 'Lead with outcomes: "Accept payments in 65 minutes" is stronger than "Payment gateway integration." Each feature block should answer the visitor\'s internal question: "What does this do for me?" Three features is the optimal count for a landing page — more creates decision fatigue, fewer feels incomplete.',
      },
      {
        heading: 'CTA repetition — every scroll depth needs an exit',
        body: 'Place your primary CTA in the hero, after the features section, after testimonials, and in a final full-width band at the bottom. Malaysian mobile users scroll quickly — if your only CTA is at the top, 60% of visitors will never see it. Repeat the same CTA text for consistency; do not introduce new actions mid-page.',
      },
      {
        heading: 'WhatsApp integration — the Malaysian conversion shortcut',
        body: 'For service businesses, a WhatsApp CTA often outperforms a traditional form. Malaysian consumers are comfortable initiating business conversations on WhatsApp. A floating WhatsApp button with a pre-filled message ("Hi, I\'m interested in [product]") reduces friction to near zero. This is not optional for local service businesses — it is a conversion requirement.',
      },
    ],
  },
  {
    slug: 'zero-to-published-product-page-under-4-hours',
    title:
      'From zero to published: how to launch a product page in under 4 hours',
    category: 'Tutorial',
    date: '2026-03-21',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
    excerpt:
      'A timed, step-by-step walkthrough for solo founders, Shopee sellers, and course creators launching their own product page.',
    sections: [
      {
        body: 'This is a timed guide. Clock starts when you open Nexova. Clock stops when your product page is live, accepting payments, and sharable. The target: under 4 hours. This guide is for solo founders, dropshippers moving off Shopee, and course creators who need a branded sales page without hiring anyone.',
      },
      {
        heading: 'Hour 1 — Prep work (before you open the builder)',
        body: 'Gather everything you need before touching the editor. Brand assets: logo (PNG, transparent background), hero image or product photo (minimum 1200×800px), brand colours as hex codes. Copy: headline, 3 benefit bullets, pricing, and a one-paragraph product description. Payment credentials: your LeanX merchant dashboard (https://leanx.io/) should be set up with bank account verified — this takes 24 hours if you have not done it yet, so start early.',
      },
      {
        heading: 'Hour 2 — Template selection and structure',
        body: 'Open the Nexova Marketplace. Filter by your industry vertical. Click Preview on 3–4 options. Select the one closest to your brand style — you will be customising it anyway, so focus on layout structure, not colours. Click "Open in X.IDE". Immediately rename the project to your product name so you can find it later.',
      },
      {
        heading: 'Hour 3 — Customise content and payment',
        body: 'Replace the template placeholder text with your prepared copy. Swap images. Adjust your brand colours in the global style panel — this updates every section at once. Add your product to the inventory manager: name, price, description, stock count. Link the payment button to your LeanX account — all supported Malaysian payment methods (FPX, cards, e-wallets) appear automatically.',
      },
      {
        heading: 'Hour 4 — Tracking, SEO, and publish',
        body: 'Go to Settings → Integrations. Paste your Meta Pixel ID, TikTok Pixel ID, and Google Analytics measurement ID. Set your page title and meta description in the SEO panel. Click Publish. Your page is now live at your-project.nexova.co. Share the link on WhatsApp, Instagram bio, and your first ad campaign. You are live.',
      },
      {
        heading: 'Post-launch checklist',
        body: 'Within the first 24 hours: test a purchase yourself (use a small amount), verify the payment confirmation email arrives, check the analytics dashboard shows visits, and confirm your pixel is firing using Meta Events Manager. These four checks ensure your funnel is working end-to-end before you spend any money on ads.',
      },
    ],
  },
  {
    slug: '7-signs-website-builder-costing-you-sales',
    title: '7 signs your current website builder is costing you sales',
    category: 'Growth',
    date: '2026-03-14',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    excerpt:
      'Slow load times, missing FPX support, no inventory sync — if your builder has these problems, you are losing revenue.',
    sections: [
      {
        body: 'Most Malaysian business owners chose their website builder based on what was popular three years ago — or what their friend recommended. Since then, their needs have grown, but their tools have not. Here are seven signals that your current platform is actively costing you money.',
      },
      {
        heading: '1. Your page takes more than 3 seconds to load',
        body: 'Google data shows that 53% of mobile visits are abandoned if a page takes longer than 3 seconds to load. If your builder outputs bloated JavaScript bundles, unoptimised images, or excessive third-party scripts, you are paying for traffic that never sees your offer. Run Lighthouse in Chrome DevTools — if your performance score is below 70, your builder is the bottleneck.',
      },
      {
        heading: '2. You cannot accept FPX or Malaysian e-wallets natively',
        body: "If your builder only supports Stripe (which has limited direct support in Malaysia) or requires a complex third-party plugin for FPX, you are leaving the most popular Malaysian payment method off your checkout. Platforms not built for Malaysian commerce route payments through multiple intermediaries, stretching settlement to 5–7 days. Purpose-built infrastructure like LeanX's payment engine (https://leanx.io/) is architected for faster local settlement cycles.",
      },
      {
        heading: '3. Your inventory is managed in a separate spreadsheet',
        body: 'If you are tracking stock in Google Sheets and manually updating your website when something sells out, you will oversell. Overselling leads to refund requests, negative reviews, and customer trust erosion. A builder with integrated inventory management eliminates this entirely.',
      },
      {
        heading: '4. You need a developer to make simple changes',
        body: 'Changing a headline, swapping an image, or updating a price should take 30 seconds, not a support ticket. If your current platform requires coding knowledge for basic edits, every change has a cost — either in developer fees or in your time learning syntax.',
      },
      {
        heading: '5. You have no idea which traffic source generates sales',
        body: 'Without built-in analytics and pixel integration, you are spending ad budget blind. If your builder does not natively support Meta Pixel, TikTok Pixel, and Google Analytics, you cannot attribute conversions to channels — which means you cannot optimise spend.',
      },
      {
        heading: '6. Your site looks broken on mobile',
        body: 'Mobile traffic in Malaysia exceeds 78%. If your builder does not produce responsive layouts by default — or if responsive editing requires manual adjustment of every element — your mobile visitors are seeing a degraded experience. Test your site on a budget Android phone, not just your laptop.',
      },
      {
        heading: '7. You are paying for features you do not use',
        body: 'Many legacy builders charge for tiers packed with features designed for different markets — multilingual support for 40 languages, integrations with US-only services, CRM systems built for enterprise. If you are a Malaysian SME, you need: a visual editor, Malaysian payment processing, inventory management, analytics, and pixel tracking. Nothing more. Paying for bloat is a monthly tax on your business.',
      },
    ],
  },
  {
    slug: 'template-vs-custom-build-comparison-malaysia',
    title:
      'Template vs custom build: the honest comparison for Malaysian online businesses',
    category: 'Tutorial',
    date: '2026-03-07',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1200&q=80',
    excerpt:
      'When each approach makes sense — budget benchmarks, timeline comparison, and maintenance cost for Malaysian SMEs.',
    sections: [
      {
        body: 'The template vs. custom build debate has a clear and unsatisfying answer: it depends. But it depends on factors that are quantifiable — budget, timeline, technical requirements, and growth trajectory. This is the honest comparison with Malaysian-specific pricing.',
      },
      {
        heading: 'Cost comparison (Malaysian Ringgit)',
        body: 'Template-based build: RM 0–79/month (Nexova Free or Premium) plus 2–8 hours of your time. Custom freelancer build: RM 3,000–8,000 one-time plus RM 200–500/month maintenance. Agency build: RM 15,000–50,000 one-time plus RM 1,000–3,000/month retainer. The template path pays for itself in the first month. The custom path requires revenue to justify the investment.',
      },
      {
        heading: 'Timeline comparison',
        body: 'Template: 1 afternoon to 1 week (depending on customisation depth). Freelancer: 4–8 weeks. Agency: 8–16 weeks. For product launches, seasonal campaigns, or market validation, the template approach is the only option that operates on a business-relevant timeline.',
      },
      {
        heading: 'Quality comparison — the surprising truth',
        body: "Modern templates are not the generic, clipart-filled layouts of 2015. Nexova's marketplace templates are designed by professional UI designers, optimised for Core Web Vitals, and tested for mobile responsiveness across device categories. A well-customised template is visually indistinguishable from a RM 10,000 agency build for 90% of visitors.",
      },
      {
        heading: 'The payment integration gap',
        body: "This is where templates built for the Malaysian market have a decisive advantage. A custom build requires separate payment gateway integration work — API keys, server-side code, webhook handling, and testing. A template from Nexova's marketplace comes pre-wired to a seamless checkout system via LeanX (https://leanx.io/) on day one. No integration effort, no developer dependency.",
      },
      {
        heading: 'When to go custom',
        body: 'Choose custom development when: you need user authentication with role-based access, you require complex server-side business logic, you are building a marketplace or multi-vendor platform, or your design requirements include bespoke interactions that no template supports. For marketing sites, product pages, and standard e-commerce — start with a template.',
      },
      {
        heading: 'The recommended path',
        body: 'Launch with a template. Validate demand. Generate revenue. Then invest custom development budget into the specific areas where the template falls short — and only those areas. This approach minimises upfront risk and ensures that every Ringgit spent on development is backed by proven market demand.',
      },
    ],
  },
  {
    slug: 'complete-guide-accepting-online-payments-malaysia-2026',
    title:
      'The complete guide to accepting online payments in Malaysia (2026 edition)',
    category: 'Payments',
    date: '2026-02-28',
    readTime: '12 min',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    excerpt:
      'FPX, e-wallets, cards, BNPL — everything Malaysian merchants need to know about accepting payments online.',
    sections: [
      {
        body: "Malaysia's online payment landscape has matured significantly. In 2026, merchants have more options than ever — but also more complexity. This guide covers every payment method available to Malaysian online businesses, the real costs involved, and how to choose the right stack for your business model.",
      },
      {
        heading: 'FPX (Financial Process Exchange)',
        body: "FPX is Malaysia's interbank payment network, operated by PayNet. Customers are redirected to their bank's internet banking portal to authorise a direct transfer. Settlement: typically same-day or T+1. MDR: 0.5%–1.0%, often capped at RM 1.50–3.00 per transaction. Best for: high-AOV transactions (RM 100+), recurring B2B payments, and customers aged 35+. FPX has no chargebacks, making it the safest method for merchants.",
      },
      {
        heading: 'Credit and debit cards (Visa/Mastercard)',
        body: 'Card payments are processed through a payment gateway that routes authorisation through Visa/Mastercard networks. Settlement: 2–5 business days. MDR: 1.5%–3.5% depending on card type and gateway. Best for: international customers, Gen Z and millennial shoppers, and AOV under RM 100 where FPX minimum fees bite. Chargebacks are possible — the merchant bears fraud risk.',
      },
      {
        heading: "E-wallets (GrabPay, Touch 'n Go, Boost, ShopeePay)",
        body: "E-wallets dominate mobile transactions in Malaysia, especially among 18–34 year olds. GrabPay leads in urban areas; Touch 'n Go eWallet has the broadest adoption across demographics. Settlement: varies by provider, typically T+1 to T+3. MDR: 1.0%–1.5%. Best for: mobile-first audiences, food and beverage, and impulse purchases under RM 200.",
      },
      {
        heading: 'Buy Now Pay Later (Atome, ShopBack PayLater)',
        body: 'BNPL allows customers to split purchases into interest-free instalments. The merchant receives full payment upfront (minus MDR); the BNPL provider collects from the customer. Best for: fashion, beauty, electronics, and any product with AOV above RM 150 where the instalment option reduces purchase hesitation. MDR is higher (3%–5%) but often offset by increased conversion and basket size.',
      },
      {
        heading: 'How to offer all methods in one checkout',
        body: 'The operational overhead of managing separate contracts with each payment provider is significant. This is the problem that unified payment gateways solve. LeanX (https://leanx.io/) provides a single integration that covers FPX, all major e-wallets, Visa/Mastercard, and BNPL — one API key, one merchant dashboard, one settlement cycle. The conversion lift from offering all methods versus cards-only is typically 23–31% in Malaysian markets.',
      },
      {
        heading: 'Choosing your payment stack',
        body: 'If 90%+ of your customers are Malaysian: prioritise FPX + e-wallets, add cards as secondary. If you sell internationally: cards must be primary, with FPX for local traffic. If your AOV exceeds RM 150: add BNPL. In all cases, use a single gateway to avoid the complexity of multiple integrations, multiple dashboards, and multiple settlement schedules.',
      },
    ],
  },
  {
    slug: 'bnpl-atome-malaysia-ecommerce-revenue',
    title:
      'BNPL for Malaysian e-commerce: does Atome actually increase your revenue?',
    category: 'Payments',
    date: '2026-02-21',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80',
    excerpt:
      'A data-driven analysis of Buy Now Pay Later adoption in Malaysia — basket size lift, conversion changes, and the RM 150 threshold.',
    sections: [
      {
        body: 'Buy Now Pay Later has been one of the most talked-about payment innovations in Southeast Asia. But for Malaysian merchants, the question is practical: does adding BNPL to your checkout actually generate enough incremental revenue to justify the higher MDR? The answer depends on your average order value, your product category, and your customer demographic.',
      },
      {
        heading: 'How BNPL works for merchants',
        body: 'When a customer selects Atome at checkout, they pay the first instalment immediately. The BNPL provider pays the merchant the full transaction amount upfront (minus MDR of 3%–5%). The customer repays the provider in 3 interest-free instalments. The merchant carries zero credit risk — all default risk sits with the BNPL provider.',
      },
      {
        heading: 'The basket size effect',
        body: "Atome's published merchant data for Southeast Asia shows an average basket size increase of 20–35% when BNPL is offered alongside traditional payment methods. For a Malaysian fashion brand with RM 120 average order value, this could mean an increase to RM 145–162. The additional revenue per order more than compensates for the higher MDR.",
      },
      {
        heading: 'The RM 150 threshold',
        body: 'BNPL adoption rates are heavily correlated with order value. Below RM 100, fewer than 8% of customers select BNPL — the instalment amount is too small to feel meaningful. Between RM 100–150, adoption rises to 12–18%. Above RM 150, adoption jumps to 22–30%. If your products are priced below RM 100, BNPL will not move the needle. If your products are priced above RM 150, it is likely leaving money on the table by not offering it.',
      },
      {
        heading: 'Which product categories benefit most',
        body: 'Fashion and apparel: highest BNPL adoption in Malaysia. Beauty and skincare: strong for bundles and subscription boxes above RM 150. Electronics and gadgets: strong for RM 300+ items. Fitness equipment and supplements: growing category. Digital products and courses: limited adoption; customers prefer immediate-payment methods for instant delivery.',
      },
      {
        heading: 'Implementation without complexity',
        body: "LeanX's merchant platform includes Atome BNPL as a native checkout option (https://leanx.io/), alongside FPX and e-wallets, enabling you to offer instalment choices without a separate integration or a second merchant contract. This means you can A/B test BNPL impact on your checkout without any additional development work.",
      },
    ],
  },
  {
    slug: 'why-checkout-page-is-most-important-page',
    title:
      'Why your checkout page is your most important page (and how to fix it)',
    category: 'Growth',
    date: '2026-02-14',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1200&q=80',
    excerpt:
      'CRO-focused deep dive into checkout optimisation — method breadth, loading speed, trust signals, and mobile UX.',
    sections: [
      {
        body: 'You can have the best product, the best copy, and the best ads — but if your checkout page fails, none of it matters. The checkout is the single highest-leverage page on your entire website. A 10% improvement in checkout conversion has the same revenue impact as a 10% increase in traffic — but costs nothing in ad spend.',
      },
      {
        heading: 'Reduce the number of steps',
        body: 'Every additional step in your checkout funnel loses 10–15% of users. A three-step checkout (cart → customer info → payment) loses 27–39% of buyers cumulatively before they reach the payment button. The gold standard is a single-page checkout: product summary, customer details, and payment method selection all visible without scrolling. If you cannot achieve single-page, ensure progress is visible (step 1 of 2).',
      },
      {
        heading: 'Offer every payment method your customer expects',
        body: "Offering only card payments leaves a large share of Malaysian buyers without their preferred method. Adding FPX, GrabPay, and Touch 'n Go through a comprehensive payment infrastructure provider like LeanX (https://leanx.io/) typically delivers a 23–31% conversion lift in local markets. The cost of adding payment methods is near zero with a unified gateway; the cost of not offering them is lost sales every day.",
      },
      {
        heading: 'Load speed at the checkout matters more than anywhere else',
        body: 'A checkout page that takes 4 seconds to load after clicking "Buy Now" creates a doubt gap — the visitor wonders if the click registered, if the site is legitimate, or if their connection is too slow. Target sub-2-second load for your checkout page specifically. This means: no unnecessary JavaScript, no heavy images, and server-side rendering for the payment form.',
      },
      {
        heading: 'Trust signals at the point of payment',
        body: 'At the exact moment a customer is about to enter payment information, their anxiety is highest. Counter this with: visible SSL lock icon, "Secured by [gateway name]" badge, accepted payment method logos, a visible refund policy link, and a customer support contact. These elements do not need to be large — they need to be present.',
      },
      {
        heading: 'Mobile checkout is not desktop checkout on a small screen',
        body: 'Mobile checkout requires: large tap targets (minimum 48px), auto-zoom disabled on input focus, numeric keyboard triggered for card and phone number fields, auto-fill support for returning customers, and a sticky order summary that does not obscure the payment button. Test on a real budget Android device — not your latest iPhone.',
      },
      {
        heading: 'Measure, fix, repeat',
        body: 'Install a funnel visualisation in your analytics (Google Analytics 4 or Nexova built-in analytics). Measure: landing page → product page → checkout initiated → payment completed. Identify the biggest drop-off point. Fix that one step. Measure again. A 5% improvement each month compounds to a 80% improvement over a year.',
      },
    ],
  },
  {
    slug: 'fpx-vs-grabpay-vs-tng-which-to-prioritise',
    title: 'FPX vs GrabPay vs TnG: which payment method should you prioritise?',
    category: 'Payments',
    date: '2026-02-07',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?w=1200&q=80',
    excerpt:
      'Segmented analysis by buyer type, AOV, device, and business category — with a recommendation matrix for Malaysian merchants.',
    sections: [
      {
        body: "FPX, GrabPay, and Touch 'n Go eWallet are the three dominant non-card payment methods in Malaysia. Each has a different user base, different transaction economics, and different conversion characteristics. Understanding the differences lets you prioritise correctly — or, ideally, offer all three.",
      },
      {
        heading: 'FPX — the bank transfer standard',
        body: 'Profile: aged 30+, comfortable with internet banking, desktop and mobile. Best for: transactions above RM 100, recurring payments, B2B. MDR: 0.5%–1.0% (cheapest of the three). Settlement: typically same-day or T+1. Conversion: 68–74% for returning users, 55–60% for first-time FPX users (the bank redirect causes hesitation). No chargebacks — strongest merchant protection.',
      },
      {
        heading: 'GrabPay — the urban mobile wallet',
        body: 'Profile: aged 22–40, urban, Grab ecosystem users. Best for: food delivery add-ons, impulse purchases, AOV RM 30–200. MDR: 1.0%–1.5%. Settlement: T+1 to T+3. Conversion: 72–78% on mobile (native in-app flow), lower on desktop (requires QR scan or redirect). Strength: pre-loaded balance means instant authorisation, no bank login required.',
      },
      {
        heading: "Touch 'n Go eWallet — the broadest reach",
        body: "Profile: all ages (broadest demographic penetration due to physical Touch 'n Go card ecosystem), all device types. Best for: government-adjacent businesses (TnG has DuitNow integration), transport, parking, and general retail. MDR: 1.0%–1.5%. Settlement: T+1 to T+3. Conversion: 70–76% on mobile. Strength: highest wallet user count in Malaysia.",
      },
      {
        heading: 'Decision matrix',
        body: 'If your audience is 35+ and desktop-heavy: lead with FPX. If your audience is 22–35, mobile-first, and urban: lead with GrabPay. If you want the broadest possible coverage with a single e-wallet: lead with TnG. If you want maximum conversion: offer all three. With a single integration through LeanX (https://leanx.io/), you can route all three methods through one API and one settlement, eliminating the operational overhead of managing separate gateway contracts.',
      },
      {
        heading: 'The data says: offer everything',
        body: 'Lean.x merchant aggregate data shows that checkouts offering FPX + GrabPay + TnG + cards convert 23–31% higher than checkouts offering cards alone. The incremental development cost of supporting all methods through a unified gateway is zero. The incremental revenue is substantial. This is not a decision that requires optimisation — it requires implementation.',
      },
    ],
  },
  {
    slug: 'payment-settlement-speed-sme-cash-flow',
    title:
      'How payment settlement speed affects your SME cash flow (and what to do about it)',
    category: 'Payments',
    date: '2026-01-31',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    excerpt:
      'The practical cashflow impact of T+1 versus T+5 settlement — with real scenarios for Malaysian merchants.',
    sections: [
      {
        body: 'Settlement speed is one of the most underappreciated factors in Malaysian e-commerce operations. The difference between receiving your money tomorrow and receiving it next week is not just an inconvenience — it is a constraint on every operational decision you make: restocking, payroll, ad spend, and supplier payments.',
      },
      {
        heading: 'What settlement speed actually means',
        body: 'When a customer pays RM 200 through your checkout, that money does not arrive in your bank account immediately. "T+1" means the funds are deposited one business day after the transaction. "T+5" means five business days. Some gateways operating through multiple intermediaries can take even longer. The settlement speed depends on the payment method, the gateway, and your merchant tier.',
      },
      {
        heading: 'The cash flow math',
        body: 'Consider a merchant processing RM 50,000 per month (roughly RM 1,700 per day). At T+5 settlement, approximately RM 8,500 is perpetually in float — money that has been collected from customers but is not yet accessible. That RM 8,500 cannot be used for restocking, cannot be reinvested into ads, and cannot cover supplier invoices. At T+1, the float drops to RM 1,700. The difference — RM 6,800 of freed working capital — can be the difference between growing and stalling.',
      },
      {
        heading: 'How settlement speed affects ad spend',
        body: "Digital advertising platforms (Meta, Google, TikTok) charge daily. If your ad spend is RM 100/day but your payment settlement is T+5, you need 5 days of ad budget (RM 500) as working capital before the revenue from day 1's sales arrives. With T+1 settlement, you need only RM 100 buffer. Faster settlement directly enables more aggressive (and profitable) ad scaling.",
      },
      {
        heading: 'Choosing a gateway for speed',
        body: "Not all gateways settle at the same speed, and the headline rate is often the best-case scenario. Ask your gateway provider: what is the actual average settlement time for FPX? For e-wallets? For cards? Merchants on LeanX's Growth tier (https://leanx.io/) access accelerated settlement cycles — a material difference for businesses reinvesting cash into ad spend or inventory within the same week.",
      },
      {
        heading: 'Practical recommendations',
        body: 'Monitor your actual settlement times (not the advertised ones) weekly. Prioritise FPX for high-value transactions — it typically settles fastest. If settlement speed is a constraint, negotiate a faster tier with your gateway or switch to one that offers T+1 as standard. The hidden cost of slow settlement is not a fee on a statement — it is an opportunity cost that compounds every single day.',
      },
    ],
  },
  {
    slug: 'how-to-launch-a-landing-page-in-a-day',
    title: 'How to launch a landing page in a day',
    category: 'Tutorial',
    date: '2025-12-10',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80',
    excerpt:
      'Walk through the entire process — choosing a template, customising it in X.IDE, connecting a domain, and hitting publish.',
    sections: [
      {
        body: "Launching a landing page used to mean hiring a developer, waiting two weeks, and spending thousands. With X.IDE, the entire process — from template selection to a live, published URL — can happen in a single afternoon. Here's exactly how.",
      },
      {
        heading: 'Step 1 — Pick your template',
        body: "Start at the Template Marketplace. Filter by your industry — SaaS, e-commerce, restaurant, portfolio — then click Preview on anything that catches your eye. Every template is mobile-responsive and optimised for Lean.x payments out of the box. Once you've found the right foundation, click Open in X.IDE to load it into the builder.",
      },
      {
        heading: 'Step 2 — Customise in the visual editor',
        body: "X.IDE's drag-and-drop canvas works the same way you'd expect any modern page builder to work — click any element to select it, then edit text, swap images, change colours, or resize sections from the right-hand panel. The key sections to personalise first are: the Hero (your headline and CTA), the Features section (your three core value propositions), and the Pricing table or Payment button if you're selling something. Aim to spend no more than 90 minutes here. Perfection is the enemy of launch.",
      },
      {
        heading: 'Step 3 — Configure your payment button',
        body: "If you're selling a product or collecting payments, click the Payment Button element and link it to your Lean.x account from the Settings panel. Supported payment methods populate automatically: FPX (all major Malaysian banks), Touch 'n Go eWallet, GrabPay, Boost, ShopeePay, and debit/credit cards. Free plan users get a nexova.co subdomain payment page; Premium plan users can attach a custom domain.",
      },
      {
        heading: 'Step 4 — Add tracking pixels',
        body: 'Before you publish, go to Settings → Integrations and paste in your Meta Pixel ID, TikTok Pixel ID, and Google Analytics measurement ID. X.IDE injects these automatically into every published page — you do not need to touch any code.',
      },
      {
        heading: 'Step 5 — Publish',
        body: 'Hit the Publish button in the top-right corner of X.IDE. Your page is immediately live at your-project.nexova.co (or your custom domain on Premium). Share the link on your social channels, add it to your WhatsApp bio, and start your first campaign. You are now live. Total time from opening X.IDE to a published URL: typically under 4 hours for a complete, polished page.',
      },
      {
        heading: 'Tips for a faster launch',
        body: 'Gather your brand assets (logo PNG on transparent background, hero image or product photo, brand colours as hex values) before you open the builder. Prepare your copy in a notes app first — your headline, your three feature bullets, your pricing. Have your Lean.x API keys ready from the Lean.x dashboard. This prep work cuts your editing time in half.',
      },
    ],
  },
  {
    slug: 'top-7-design-trends-2026',
    title: 'Top 7 web design trends for 2026',
    category: 'Design',
    date: '2025-12-03',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=1200&q=80',
    excerpt:
      'From glassmorphism evolving to spatial UI and AI-assisted layouts — the trends shaping the web next year.',
    sections: [
      {
        body: 'Design trends in 2026 are being shaped by three forces simultaneously: the mainstreaming of AI-assisted tooling, the arrival of spatial computing, and a market-wide backlash against over-designed, heavy interfaces. What follows are the seven trends most likely to dominate landing pages, SaaS apps, and e-commerce this year.',
      },
      {
        heading: '1 — Glassmorphism 2.0',
        body: 'The frosted-glass aesthetic from 2021 has matured. In 2026, glassmorphism is applied with restraint — reserved for single focal elements (hero cards, pricing panels, notification toasts) rather than entire page backgrounds. The key upgrade is layered blur stacking: multiple translucent planes at different depths create a genuine sense of three-dimensional space without a GPU meltdown. Combined with subtle motion (cards that tilt on hover using device orientation data), these components feel alive.',
      },
      {
        heading: '2 — Spatial UI patterns',
        body: 'The launch of Apple Vision Pro — and the broader spatial computing ecosystem — has pushed UI design beyond the flat screen. Web designers are now building spatial interaction metaphors directly into browser experiences: depth-sorted card stacks, parallax layers responding to cursor position, and three-dimensional typography that casts soft shadows. CSS 3D transforms and View Transitions API make this achievable without any WebGL dependency.',
      },
      {
        heading: '3 — Micro-typography',
        body: 'Variable fonts have gone mainstream, enabling typographic expressions that were impossible before. Designers in 2026 are animating font weight and width axes mid-scroll — headlines that transition from thin to bold as they enter the viewport, or words that compress and expand in response to user interaction. Combined with optical sizing, text now adapts to context at a granularity that was previously only available to editorial print designers.',
      },
      {
        heading: '4 — AI-assisted layout generation',
        body: "Tools like Vercel's v0 and Nexova's own AI builder mode are changing how layouts are initiated. Rather than starting from a blank canvas, designers now prompt for a first draft, then refine. The result is faster exploration (10x more layout options reviewed per hour) and less 'blank page paralysis'. The human role is shifting from grid constructor to curator and quality-controller.",
      },
      {
        heading: '5 — Bold mono + serif pairings',
        body: 'The all-sans-serif era is ending. 2026 sees a return of high-contrast typeface pairings — bold geometric sans for headlines paired with elegant serif for body copy. The combination communicates both modernity and credibility, which is exactly what SaaS companies building for enterprise buyers need to project.',
      },
      {
        heading: '6 — Functional animation (not decorative)',
        body: 'Motion design is pivoting hard from purely decorative scroll animations toward functional state transitions. Loaders that communicate actual progress, hover states that preview content before interaction, success animations that confirm actions — animation is being judged by whether it reduces cognitive load, not whether it looks impressive in a Dribbble shot. Reduced-motion media query support is now table stakes, not optional.',
      },
      {
        heading: '7 — Local-first, sustainability-aware design',
        body: 'A growing number of digital businesses are making website carbon footprint a published metric. Lighter assets, darker default themes (OLED screens consume significantly less power in dark mode), and fewer HTTP requests are no longer just performance concerns — they are brand values. The Website Carbon Calculator is becoming as common a reference in design reviews as Lighthouse scores.',
      },
    ],
  },
  {
    slug: 'fpx-vs-card-payments-malaysia',
    title: 'FPX vs card payments — what every Malaysian merchant should know',
    category: 'Payments',
    date: '2025-11-22',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1556742208-999815fca738?w=1200&q=80',
    excerpt:
      'A no-jargon breakdown of FPX online banking, debit/credit card processing, and which works best for your e-commerce checkout.',
    sections: [
      {
        body: "If you're setting up an online checkout in Malaysia, two questions will come up immediately: should you accept FPX? Should you accept cards? And what's the actual difference in cost, conversion, and user experience? This is the definitive breakdown.",
      },
      {
        heading: 'What is FPX?',
        body: "FPX (Financial Process Exchange) is Malaysia's interbank online payment network, operated by PayNet. When a customer selects FPX at checkout, they are redirected to their bank's own internet banking portal — Maybank2u, CIMB Clicks, RHB Now, etc. — to authorise the transfer directly from their bank account. The merchant receives funds typically within the same business day. There is no card number, no card expiry, and no CVV involved. FPX is bank-to-bank.",
      },
      {
        heading: 'What is card payment?',
        body: 'Card payments (Visa, Mastercard, debit and credit cards) go through a payment gateway (Stripe, iPay88, Billplz, or Lean.x) which routes the authorisation through the card networks. Funds are typically settled within 2–5 business days. The transaction has higher fraud surface (card numbers can be stolen and reused) but is universally accepted internationally and works across all devices without a bank login redirect.',
      },
      {
        heading: 'MDR comparison: what you actually pay',
        body: 'Merchant Discount Rate (MDR) is the percentage deducted from each transaction before it reaches your account. FPX typical MDR: 0.5%–1.0% per transaction, capped at RM 1.50–RM 3.00. Card payments MDR: 1.5%–3.5% depending on card type, gateway, and plan. For a RM 200 sale — FPX: you keep RM 198.50. Card (2.5% MDR): you keep RM 195. At volume (1,000 transactions/month at RM 200 average), the difference is RM 2,000/month saved by routing to FPX.',
      },
      {
        heading: 'Conversion rates by payment method in Malaysia',
        body: 'Based on aggregate data from Lean.x merchants: FPX converts at approximately 68–74% for returning customers (customers who have previously used FPX are comfortable with the bank redirect flow). Cards convert at 70–82% because there is no redirect, and international buyers can complete without a Malaysian bank account. For new users who are unfamiliar with the FPX redirect, conversion drops to 55–60%. The lesson: offer both. Let the customer choose.',
      },
      {
        heading: 'When to prioritise FPX',
        body: 'FPX is the right primary method when: your customer is a Malaysian resident, your average order value is above RM 100 (MDR savings are meaningful), your product is subscription or B2B (FPX has no chargebacks, which protects merchants), and your buyers are 35+ years old (high FPX familiarity). FPX is the wrong primary method when: you sell internationally, your AOV is under RM 50 (FPX minimum fee bites), or your customer base skews toward Gen Z who prefer e-wallets.',
      },
      {
        heading: "The Malaysian merchant's ideal checkout",
        body: "Stack all three: FPX (for bank transfer lovers), e-wallets (Touch 'n Go, GrabPay, Boost, ShopeePay for mobile-first shoppers), and card (for international and credit card users). Lean.x handles all three in a single integration — one API key, one dashboard, one settlement. The conversion lift from offering all methods vs. cards-only is typically 23–31% in Malaysian markets.",
      },
    ],
  },
  {
    slug: 'css-animations-that-dont-hurt-performance',
    title: "CSS animations that don't hurt performance",
    category: 'Development',
    date: '2025-11-15',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1550439062-609e1531270e?w=1200&q=80',
    excerpt:
      'Using transform and opacity correctly, will-change gotchas, and when to prefer the Web Animations API over CSS keyframes.',
    sections: [
      {
        body: "Animation is one of the most effective tools in a UI designer's kit — and one of the easiest ways to accidentally tank your Lighthouse performance score. The good news: following a small set of rules eliminates almost all animation-related performance issues.",
      },
      {
        heading: 'Rule 1 — Only animate composited properties',
        body: "The GPU can animate two properties without triggering layout or paint: transform (translate, scale, rotate, skew) and opacity. Every other property — width, height, margin, padding, border, color, background — forces the browser to recalculate layout (expensive) or repaint pixels (less expensive but still measurable). If an animation feels janky, check DevTools Performance panel. If you see 'Layout' or 'Paint' events firing during the animation, you're animating the wrong property. Rethink the approach: instead of animating height from 0 to auto, animate scaleY from 0 to 1.",
      },
      {
        heading: 'Rule 2 — Use will-change sparingly',
        body: 'will-change: transform tells the browser to promote an element to its own GPU layer in advance of an animation. This prevents jank on first render because the element is already composited. The trap: applying will-change to too many elements simultaneously saturates GPU memory, causing worse performance than no will-change at all. The rule: apply will-change only to elements that are actively about to animate, and remove it after the animation ends using JavaScript. Never apply will-change to more than 3–5 elements at once.',
      },
      {
        heading: 'Rule 3 — prefer reduced motion',
        body: 'In 2026, ignoring @media (prefers-reduced-motion: reduce) is an accessibility violation. Users with vestibular disorders (motion sickness triggered by screen movement) and those who simply prefer less visual noise have this setting enabled. Always wrap non-essential animations in a reduced-motion check. In Tailwind: use motion-safe:transition-transform, motion-safe:animate-fade. In CSS: wrap @keyframes blocks inside @media (prefers-reduced-motion: no-preference) {}.',
      },
      {
        heading: 'Rule 4 — CSS keyframes vs Web Animations API',
        body: 'CSS @keyframes run off-main-thread for composited properties — this is the ideal path for looping animations like spinners, pulse effects, and skeleton loaders. But CSS lacks programmatic control: you cannot easily pause, seek, or reverse a CSS animation based on scroll position or user interaction without JavaScript. For scroll-linked animations, interactive reveals, or state-driven transitions, use the Web Animations API (element.animate()) or GSAP/Framer Motion — they give you full imperative control while still running composited transforms off-thread.',
      },
      {
        heading: 'Rule 5 — Keep animation durations honest',
        body: 'Micro-interactions: 150–250ms. Page transitions: 300–400ms. Hero entrances: 500–700ms. Anything longer than 700ms in a UI context starts feeling slow rather than polished. A 1200ms fade-in does not feel luxurious — it feels broken on a slow network. Use cubic-bezier easing (ease-out for entrances, ease-in-out for loops) rather than linear — linear motion reads as mechanical and unnatural to the human eye.',
      },
      {
        heading: 'Practical checklist before shipping animations',
        body: 'Open Chrome DevTools → Performance → record a 3-second interaction → look for frames below 60fps (red bars in the frame timeline). Check: are you triggering layout? Check: are you animating on the main thread? Open the Layers panel and verify animated elements are their own GPU layer. Test with prefers-reduced-motion enabled in OS settings — ensure the page is still usable. Test on a real mid-range Android device (not just desktop). The rule of thumb: if it runs smoothly on a Redmi Note, it runs smoothly everywhere.',
      },
    ],
  },
  {
    slug: 'nexova-elements-launch',
    title: 'Introducing Nexova Elements — 100+ UI animations',
    category: 'Product',
    date: '2025-11-01',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80',
    excerpt:
      "Today we're launching our UI element library: 100+ production-ready animations and 29 layout sections, free to preview.",
    sections: [
      {
        body: 'Today we are shipping something we have been building quietly for the past six months: Nexova Elements. It is a living design library — 100+ production-ready UI animations, 29 full-page layout blocks, and a growing widget reference — all integrated directly into the Nexova design system and available to every X.IDE user.',
      },
      {
        heading: 'What is in the library',
        body: '100+ animations across 15 categories: 3D & Immersion, Typography, Vector, UI Elements, Interaction, Background, Style, Data, Marketing, Navigation, Feedback, Forms, Character & Media, Text Effects, and Advanced. 29 layout blocks: Hero sections, Feature grids, Testimonial carousels, Pricing tables, Blog post layouts, Contact sections, and more. Every animation has a live preview, full source code viewer with copy-to-clipboard, and a real-time customisation panel where you can adjust colours, timing, and parameters without touching code.',
      },
      {
        heading: 'How to use it in X.IDE',
        body: 'Inside X.IDE, open the Elements sidebar and click Browse Elements Library. Any animation or layout you select is injected directly into your canvas as a pre-configured block. You can then edit it visually just like any other element — no code required. If you are a developer who wants the raw implementation, the code viewer in the Elements gallery gives you copy-paste ready CSS + HTML or React components that drop into any project.',
      },
      {
        heading: 'Designed to be invisible',
        body: 'Every animation in Nexova Elements is built with two constraints: it must run at 60fps on a mid-range Android device (Redmi Note class), and it must respect prefers-reduced-motion. We are opinionated about accessibility — if an animation creates a barrier for users with vestibular disorders, it does not ship. The library is the result of our design team spending hundreds of hours testing on real hardware, not just MacBook Pros.',
      },
      {
        heading: 'Free to preview, included in Premium',
        body: 'Nexova Elements is free to browse and preview for all users. Implementing animations directly in X.IDE requires an active Premium or Enterprise subscription. If you are on the Free plan and see something you love, the full source code is always available in the code viewer — take it and use it in any project you like.',
      },
      {
        heading: "What's next",
        body: 'The library currently ships at 100 animations. We are adding a new batch every month — prioritising requests from the community. Head to the Elements page and use the Request Animation form to submit what you want to see next. Thank you to everyone who beta-tested the library over the past three months and sent feedback that shaped this launch.',
      },
    ],
  },
  {
    slug: 'seo-checklist-small-business-website',
    title: 'The SEO checklist for a new small business website',
    category: 'Growth',
    date: '2025-10-28',
    readTime: '10 min',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80',
    excerpt:
      'Titles, meta descriptions, structured data, Core Web Vitals — the must-haves before you start thinking about backlinks.',
    sections: [
      {
        body: 'Every new business website starts with zero domain authority and zero backlinks. Most SEO advice skips straight to link-building — the part that takes months — while ignoring the on-page and technical foundations that every single page needs before any external effort pays off. This checklist covers the essentials, in order of priority.',
      },
      {
        heading: '1 — Unique, descriptive title tags on every page',
        body: "Your title tag is the single most important on-page signal. Format: [Primary Keyword] — [Brand Name]. Keep it under 60 characters. Home page: 'Affordable FPX Payment Gateway for Malaysian Businesses — Lean.x'. Inner page: 'How to Accept FPX Payments Online — Lean.x'. Never use 'Home' or 'Welcome' as a title. Never duplicate title tags across pages. Every page is a unique SEO opportunity.",
      },
      {
        heading: '2 — Meta descriptions that earn clicks',
        body: "Meta descriptions do not directly affect rankings — but they affect click-through rate (CTR), which does. Write descriptions that read like ad copy: lead with the value, include the target keyword naturally, end with a soft CTA. 140–160 characters. Example: 'Accept FPX, e-wallets, and cards in one checkout. Same-day settlement. Set up in 65 minutes. No coding required.' That converts better than 'We are a payment gateway company providing payment services for businesses in Malaysia.'",
      },
      {
        heading: '3 — One H1 per page, structured heading hierarchy',
        body: 'Every page must have exactly one H1 — your primary keyword phrase in natural language. Under the H1, use H2s for major sections and H3s for sub-points. Never skip heading levels (H1 to H4). Never use headings purely for visual size — use them to signal content structure to crawlers. The heading outline of your page should read like a table of contents.',
      },
      {
        heading: '4 — Canonical URLs',
        body: "If your page can be reached at multiple URLs — with/without www, with/without trailing slash, via HTTP and HTTPS — search engines may index duplicate content and split ranking signals. Add a canonical tag to every page pointing to the preferred URL. In Next.js: alternates: { canonical: 'https://yourdomain.com/page' } in your metadata export. Canonical is not optional — it is the cheapest SEO fix with the highest floor.",
      },
      {
        heading: '5 — Structured data (Schema Markup)',
        body: 'Local businesses should at minimum implement LocalBusiness schema. E-commerce products: Product schema with price, availability, and review data. SaaS products: SoftwareApplication schema. Blogs: Article schema with author, datePublished, dateModified. Structured data enables rich results in Google Search — star ratings, FAQ dropdowns, product prices, breadcrumbs — all of which lift CTR without spending on ads.',
      },
      {
        heading: '6 — Core Web Vitals',
        body: "Google's page experience signals directly impact rankings. Target: LCP (Largest Contentful Paint) under 2.5 seconds — optimise your hero image (WebP, correct sizing, priority loading). FID/INP (Interaction to Next Paint) under 200ms — reduce JavaScript execution time. CLS (Cumulative Layout Shift) under 0.1 — add explicit width/height to all images, never inject content above the fold after page load. Run Lighthouse in Chrome DevTools weekly until all three are green.",
      },
      {
        heading: '7 — XML sitemap and robots.txt',
        body: 'Submit a sitemap at /sitemap.xml to Google Search Console. Your sitemap tells Google which pages exist and when they were last modified. Your robots.txt should disallow crawling of admin pages, auth pages, API routes, and user-generated content that should not be indexed (e.g. /dashboard, /builder, /api). Allow crawling of all marketing, blog, and product pages. Verify both files are accessible before submitting to Search Console.',
      },
      {
        heading: '8 — Internal linking',
        body: "Internal links pass PageRank between pages and help crawlers discover content. From every blog post: link to at least 2 other relevant pages on your site. From product pages: link to related case studies or blog posts. From pricing: link to the payment method page (Lean.x) and the template gallery. Anchor text matters: 'Click here' passes no SEO signal. 'FPX payment integration guide' is descriptive and keyword-rich.",
      },
      {
        heading: 'What to tackle first',
        body: 'If you can only do three things this week: fix your title tags and meta descriptions (15 minutes), add canonical URLs to every page (30 minutes in Next.js), and submit a sitemap to Google Search Console (5 minutes). The rest — structured data, Core Web Vitals optimisation, internal linking — layer on top as your site grows.',
      },
    ],
  },
];
