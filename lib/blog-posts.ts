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
  /* ── Batch 1 — Landing Pages, Payments & Checkout ──────── */
  {
    slug: 'why-malaysian-smes-ditching-developers-for-no-code-builders',
    title:
      'Why Malaysian SMEs are ditching web developers for no-code builders in 2026',
    category: 'Growth',
    date: '2026-04-02',
    readTime: '8 min',
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
