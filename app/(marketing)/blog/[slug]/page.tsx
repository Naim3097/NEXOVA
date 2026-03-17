import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

/* ─────────────────────────────────────────────────────── */
/*  Article data                                           */
/* ─────────────────────────────────────────────────────── */

const CATEGORY_COLORS: Record<string, string> = {
  Tutorial: 'bg-teal-50 text-teal-700',
  Design: 'bg-purple-50 text-purple-700',
  Payments: 'bg-emerald-50 text-emerald-700',
  Development: 'bg-blue-50 text-blue-700',
  Product: 'bg-orange-50 text-orange-700',
  Growth: 'bg-rose-50 text-rose-700',
};

type PostSection = {
  heading?: string;
  body: string;
};

type Post = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  sections: PostSection[];
};

const POSTS: Post[] = [
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

/* ─────────────────────────────────────────────────────── */
/*  Static params                                          */
/* ─────────────────────────────────────────────────────── */

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

/* ─────────────────────────────────────────────────────── */
/*  Metadata                                               */
/* ─────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://nexova.co/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://nexova.co/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

/* ─────────────────────────────────────────────────────── */
/*  Page                                                   */
/* ─────────────────────────────────────────────────────── */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'Nexova',
      url: 'https://nexova.co',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nexova',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nexova.co/assets/logo.png',
      },
    },
    url: `https://nexova.co/blog/${post.slug}`,
    mainEntityOfPage: `https://nexova.co/blog/${post.slug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://nexova.co',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://nexova.co/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://nexova.co/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb nav */}
      <nav
        className="bg-white border-b border-gray-100 py-3"
        aria-label="Breadcrumb"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li>
              <Link href="/" className="hover:text-[#5BC0BE] transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/blog"
                className="hover:text-[#5BC0BE] transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-600 truncate max-w-[200px]">
              {post.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Article header */}
      <header className="bg-white pt-12 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <RevealOnScroll>
            <div className="flex items-center gap-3 mb-6">
              <span
                className={`text-xs font-semibold rounded-full px-3 py-1 ${
                  CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-600'
                }`}
              >
                {post.category}
              </span>
              <span className="text-sm text-gray-400">
                {post.readTime} read
              </span>
              <span className="text-sm text-gray-400">·</span>
              <time className="text-sm text-gray-400">
                {formatDate(post.date)}
              </time>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#455263] leading-tight mb-6">
              {post.title}
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>
          </RevealOnScroll>
        </div>
      </header>

      {/* Cover image placeholder */}
      <div className="bg-gradient-to-br from-[#5BC0BE]/10 to-[#7C74EA]/10 h-72 flex items-center justify-center text-gray-300 text-sm">
        Cover image
      </div>

      {/* Article body */}
      <article className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <RevealOnScroll>
            <div className="prose prose-lg max-w-none">
              {post.sections.map((section, i) => (
                <div key={i} className="mb-10">
                  {section.heading && (
                    <h2 className="text-2xl font-bold text-[#455263] mb-4">
                      {section.heading}
                    </h2>
                  )}
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* Author card */}
          <RevealOnScroll delay={200}>
            <div className="mt-16 pt-8 border-t border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5BC0BE] to-[#7C74EA] flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#455263]">Nexova Team</p>
                <p className="text-sm text-gray-500">
                  Building X.IDE, Lean.x, and the tools Malaysian businesses
                  need to grow online.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* Back to blog */}
          <RevealOnScroll delay={300}>
            <div className="mt-10">
              <Link href="/blog">
                <Button
                  variant="outline"
                  className="rounded-full border-[#E2E8F0] text-[#455263] hover:text-[#5FC7CD] hover:border-[#5FC7CD] transition-all duration-300"
                >
                  ← Back to Blog
                </Button>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <RevealOnScroll>
              <h2 className="text-2xl font-bold text-[#455263] mb-10 text-center">
                More from the blog
              </h2>
            </RevealOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rp) => (
                <RevealOnScroll key={rp.slug} delay={200}>
                  <Link href={`/blog/${rp.slug}`}>
                    <article className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-[#5BC0BE]/10 group-hover:to-[#7C74EA]/10 transition-all flex items-center justify-center text-xs text-gray-300">
                        Preview
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <span
                          className={`self-start text-xs font-semibold rounded-full px-2.5 py-0.5 mb-3 ${
                            CATEGORY_COLORS[rp.category] ||
                            'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {rp.category}
                        </span>
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#5BC0BE] transition-colors leading-snug mb-2">
                          {rp.title}
                        </h3>
                        <time className="text-xs text-gray-400 mt-auto">
                          {formatDate(rp.date)}
                        </time>
                      </div>
                    </article>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] py-20 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <RevealOnScroll>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Build your landing page today
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              X.IDE gives you templates, elements, Lean.x payments — everything
              in one platform.
            </p>
            <Link href="/signup">
              <Button className="bg-white text-[#5BC0BE] hover:bg-gray-50 font-semibold rounded-full px-10 py-3 shadow-md border-0">
                Start Building Free →
              </Button>
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
