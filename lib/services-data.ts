export interface ServiceData {
  slug: string;
  title: string;
  headline: string;
  subtitle: string;
  description: string;
  keywords: string[];
  icon: string;
  color: string;
  gradient: string;
  problem: {
    heading: string;
    points: string[];
  };
  solution: {
    heading: string;
    description: string;
  };
  process: {
    step: string;
    title: string;
    description: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export const services: Record<string, ServiceData> = {
  'social-media-management': {
    slug: 'social-media-management',
    title: 'Social Media Management',
    headline: 'Social media that actually grows your business',
    subtitle:
      'Content planning, scheduling, and community management — handled by our team so you can focus on running your business.',
    description:
      'Professional social media management services for Malaysian businesses. Content creation, scheduling, community engagement, and performance reporting across Facebook, Instagram, TikTok, and more.',
    keywords: [
      'social media management Malaysia',
      'SMM agency KL',
      'social media marketing',
      'content management Malaysia',
      'Instagram management',
    ],
    icon: 'Share2',
    color: 'from-pink-500 to-rose-500',
    gradient: 'linear-gradient(to right, #ec4899, #f43f5e)',
    problem: {
      heading: "Posting randomly isn't a strategy",
      points: [
        'You post when you remember — not when your audience is active',
        'No consistent brand voice across platforms',
        'Comments and DMs pile up unanswered',
        'You have no idea which content actually drives sales',
      ],
    },
    solution: {
      heading: 'We manage your social presence end-to-end',
      description:
        'From content calendars to community engagement, we handle every aspect of your social media. You get consistent branding, timely responses, and content that converts followers into customers.',
    },
    process: [
      {
        step: '01',
        title: 'Audit & Strategy',
        description:
          'We review your current presence and build a tailored content strategy aligned with your business goals.',
      },
      {
        step: '02',
        title: 'Content Creation',
        description:
          'Our team creates on-brand visuals, copy, and video content for your platforms.',
      },
      {
        step: '03',
        title: 'Scheduling & Publishing',
        description:
          'Content goes live at optimal times with consistent posting frequency.',
      },
      {
        step: '04',
        title: 'Engage & Report',
        description:
          'We manage your community, respond to messages, and deliver monthly performance reports.',
      },
    ],
    faq: [
      {
        question: 'Which platforms do you manage?',
        answer:
          'We manage Facebook, Instagram, TikTok, LinkedIn, and X (Twitter). We recommend focusing on 2-3 platforms that match your target audience.',
      },
      {
        question: 'How many posts per week?',
        answer:
          'Our standard packages include 3-5 posts per week per platform, but we customise based on your industry and goals.',
      },
      {
        question: 'Do you handle replies and DMs?',
        answer:
          'Yes. Community management including comment replies and direct messages is included in all our packages.',
      },
      {
        question: 'Can I approve content before it goes live?',
        answer:
          'Absolutely. We share a content calendar for your review and approval before scheduling anything.',
      },
    ],
  },
  'business-management-system': {
    slug: 'business-management-system',
    title: 'Business Operation Management System',
    headline: 'Run your operations without the chaos',
    subtitle:
      'Custom management systems that automate workflows, track KPIs, and keep your team aligned.',
    description:
      'Custom business operation management systems for Malaysian SMBs. Workflow automation, inventory tracking, CRM, invoicing, and team management — built to fit how your business actually works.',
    keywords: [
      'business management system Malaysia',
      'ERP SMB',
      'business operations',
      'workflow automation Malaysia',
      'CRM Malaysia',
    ],
    icon: 'Settings',
    color: 'from-blue-500 to-indigo-500',
    gradient: 'linear-gradient(to right, #3b82f6, #6366f1)',
    problem: {
      heading: "Spreadsheets aren't scaling with you",
      points: [
        'Data scattered across WhatsApp groups, spreadsheets, and notebooks',
        'No real-time visibility into stock, orders, or team performance',
        'Manual processes eating hours every week',
        'Growing team but no standard operating procedures',
      ],
    },
    solution: {
      heading: 'A system built around your business',
      description:
        "We don't force you into generic software. We build custom management systems that match your actual workflows — from order tracking to staff scheduling to automated invoicing.",
    },
    process: [
      {
        step: '01',
        title: 'Process Mapping',
        description:
          'We sit with your team to map every workflow, bottleneck, and manual step.',
      },
      {
        step: '02',
        title: 'System Design',
        description:
          'We design a solution that automates repetitive tasks and gives you real-time dashboards.',
      },
      {
        step: '03',
        title: 'Build & Integrate',
        description:
          'Your system is built and integrated with your existing tools (accounting, WhatsApp, etc.).',
      },
      {
        step: '04',
        title: 'Train & Support',
        description:
          'We train your team and provide ongoing support as your operations evolve.',
      },
    ],
    faq: [
      {
        question: 'What kind of businesses need this?',
        answer:
          "Any business with 5+ staff, multiple daily orders, or complex inventory. We've built systems for F&B, retail, logistics, and service businesses.",
      },
      {
        question: 'Can it integrate with my existing tools?',
        answer:
          'Yes. We integrate with accounting software, WhatsApp Business API, payment gateways, and most cloud tools your team already uses.',
      },
      {
        question: 'How long does implementation take?',
        answer:
          'Typically 4-8 weeks depending on complexity. Simple CRM setups can be done in 2 weeks.',
      },
      {
        question: 'Do you provide training?',
        answer:
          'Yes, comprehensive training for your team is included. We also provide documentation and video guides.',
      },
    ],
  },
  'meta-ads': {
    slug: 'meta-ads',
    title: 'META Ads (Facebook & Instagram)',
    headline: 'Facebook & Instagram ads that convert',
    subtitle:
      'Targeted advertising on META platforms that reaches the right Malaysian audience and turns impressions into sales.',
    description:
      'Expert Facebook and Instagram advertising services for Malaysian businesses. Campaign strategy, audience targeting, creative production, and ROAS optimisation across META platforms.',
    keywords: [
      'Facebook ads Malaysia',
      'Instagram ads agency',
      'Meta ads KL',
      'Facebook advertising Malaysia',
      'social media ads Malaysia',
    ],
    icon: 'Megaphone',
    color: 'from-blue-600 to-blue-400',
    gradient: 'linear-gradient(to right, #2563eb, #60a5fa)',
    problem: {
      heading: "Boosting posts isn't advertising",
      points: [
        'You hit "Boost Post" and hope for the best',
        'No clear targeting — your ads reach everyone except buyers',
        'Creative fatigue — same ad formats, declining results',
        'No idea which campaigns actually make money',
      ],
    },
    solution: {
      heading: 'Data-driven META campaigns that scale',
      description:
        'We build full-funnel META campaigns — from awareness to conversion. Precise audience targeting for Malaysian demographics, scroll-stopping creatives, and continuous optimisation based on actual ROAS.',
    },
    process: [
      {
        step: '01',
        title: 'Audit & Strategy',
        description:
          'We analyse your current ad account, audiences, and competitors to build a winning strategy.',
      },
      {
        step: '02',
        title: 'Creative Production',
        description:
          'Our team produces ad creatives — images, carousels, and video — designed to stop the scroll.',
      },
      {
        step: '03',
        title: 'Launch & Optimise',
        description:
          'Campaigns go live with A/B testing. We optimise daily based on real performance data.',
      },
      {
        step: '04',
        title: 'Scale & Report',
        description:
          'Winning campaigns get scaled. You receive weekly reports with clear ROAS metrics.',
      },
    ],
    faq: [
      {
        question: "What's the minimum ad budget?",
        answer:
          'We recommend at least RM1,500/month in ad spend for meaningful results. Our management fee is separate from ad spend.',
      },
      {
        question: 'Do you create the ad visuals?',
        answer:
          'Yes. Creative production (images, carousels, short videos) is included in our management packages.',
      },
      {
        question: 'How quickly will I see results?',
        answer:
          'Most campaigns show initial results within 7-14 days. Full optimisation typically takes 4-6 weeks as we gather data.',
      },
      {
        question: 'Can you run ads to my Nexova landing page?',
        answer:
          'Absolutely. We can drive META traffic directly to your Nexova-built landing pages with proper pixel tracking and conversion optimisation.',
      },
    ],
  },
  'google-ads': {
    slug: 'google-ads',
    title: 'Google Ads Management',
    headline: 'Show up when customers search for you',
    subtitle:
      'Google Search, Display, and YouTube campaigns that capture high-intent traffic and drive measurable revenue.',
    description:
      'Professional Google Ads management for Malaysian businesses. Search campaigns, display advertising, YouTube ads, and Shopping campaigns — all optimised for maximum ROI in the Malaysian market.',
    keywords: [
      'Google Ads agency Malaysia',
      'PPC management KL',
      'SEM Malaysia',
      'Google advertising Malaysia',
      'pay per click Malaysia',
    ],
    icon: 'BarChart3',
    color: 'from-yellow-500 to-orange-500',
    gradient: 'linear-gradient(to right, #eab308, #f97316)',
    problem: {
      heading: "You're paying for clicks, not customers",
      points: [
        'High cost-per-click but low conversion rates',
        'Broad keywords eating your budget with irrelevant traffic',
        'No landing page strategy — sending traffic to your homepage',
        'Competitors outranking you on your own brand name',
      ],
    },
    solution: {
      heading: 'Campaigns built for the Malaysian market',
      description:
        'We build Google Ads campaigns specifically for Malaysian search behaviour. Tight keyword targeting, compelling ad copy in English and Bahasa, and landing pages designed to convert — so every ringgit counts.',
    },
    process: [
      {
        step: '01',
        title: 'Research & Setup',
        description:
          'Keyword research, competitor analysis, and account structure tailored to your industry.',
      },
      {
        step: '02',
        title: 'Campaign Build',
        description:
          'We create campaigns with targeted ad groups, compelling copy, and proper conversion tracking.',
      },
      {
        step: '03',
        title: 'Landing Page Alignment',
        description:
          'We ensure your landing pages match ad intent — or build new ones using Nexova.',
      },
      {
        step: '04',
        title: 'Optimise & Scale',
        description:
          'Weekly optimisation of bids, keywords, and ads. Monthly strategy reviews with clear reporting.',
      },
    ],
    faq: [
      {
        question: 'What types of Google Ads do you manage?',
        answer:
          'Search, Display, YouTube (video), Shopping, and Performance Max campaigns. We recommend the right mix based on your business.',
      },
      {
        question: "What's the minimum monthly ad budget?",
        answer:
          'We recommend at least RM2,000/month in ad spend for Google Ads. Higher-competition industries may need more.',
      },
      {
        question: 'Do you help with landing pages?',
        answer:
          'Yes. We can build dedicated landing pages using the Nexova builder that are specifically designed to convert your Google Ads traffic.',
      },
      {
        question: 'How do you measure success?',
        answer:
          'We track cost-per-acquisition (CPA), return on ad spend (ROAS), and conversion rate. You get clear ROI reporting, not vanity metrics.',
      },
    ],
  },
  'website-creation': {
    slug: 'website-creation',
    title: 'Website Creation',
    headline: 'Websites that work as hard as you do',
    subtitle:
      'Professional websites and landing pages designed to convert visitors into customers — not just sit there looking pretty.',
    description:
      'Professional website design and development for Malaysian businesses. From landing pages to full business websites — responsive, fast, and built to convert.',
    keywords: [
      'website design Malaysia',
      'web development KL',
      'business website Malaysia',
      'landing page design',
      'website creation Malaysia',
    ],
    icon: 'Globe',
    color: 'from-[#5BC0BE] to-[#7C74EA]',
    gradient: 'linear-gradient(to right, #5BC0BE, #7C74EA)',
    problem: {
      heading: "A pretty website that doesn't sell is just decoration",
      points: [
        'Your current site looks outdated or was built 5 years ago',
        "Mobile visitors bounce because it's not responsive",
        'No clear call-to-action — visitors browse and leave',
        "You paid RM10k+ for a site you can't even update yourself",
      ],
    },
    solution: {
      heading: 'Conversion-focused design, built to update',
      description:
        'We build websites with one goal: turn visitors into customers. Every page has a clear purpose, every section guides the visitor toward action. And with Nexova, you can update content yourself — forever.',
    },
    process: [
      {
        step: '01',
        title: 'Discovery & Wireframe',
        description:
          'We understand your business, audience, and goals — then wireframe the optimal page structure.',
      },
      {
        step: '02',
        title: 'Design & Content',
        description:
          'Our designers create a conversion-focused layout with professional copywriting.',
      },
      {
        step: '03',
        title: 'Build & Test',
        description:
          'We build the site — responsive, fast, and SEO-optimised — then test across all devices.',
      },
      {
        step: '04',
        title: 'Launch & Train',
        description:
          'Your site goes live with analytics. We train you to make updates yourself using Nexova.',
      },
    ],
    faq: [
      {
        question: 'How much does a website cost?',
        answer:
          'Landing pages start from RM1,500. Full business websites range from RM3,000-RM10,000 depending on complexity and features.',
      },
      {
        question: 'Can I edit the website myself after?',
        answer:
          'Yes. We build on Nexova so you can update text, images, and content anytime without touching code.',
      },
      {
        question: 'Do you handle hosting and domain?',
        answer:
          'Yes. We set up hosting, domain configuration, SSL certificates — everything needed for your site to go live.',
      },
      {
        question: 'Is SEO included?',
        answer:
          'Basic on-page SEO is included with every website. For ongoing SEO campaigns, see our Google SEO service.',
      },
    ],
  },
  'google-seo': {
    slug: 'google-seo',
    title: 'Google SEO',
    headline: 'Rank higher, get found, grow organically',
    subtitle:
      'Search engine optimisation that drives free, compounding traffic to your business — month after month.',
    description:
      'Professional SEO services for Malaysian businesses. Technical SEO, content strategy, link building, and local SEO to help you rank higher on Google in Malaysia.',
    keywords: [
      'SEO services Malaysia',
      'Google SEO agency',
      'search engine optimization KL',
      'SEO Malaysia',
      'organic search Malaysia',
    ],
    icon: 'Search',
    color: 'from-green-500 to-emerald-500',
    gradient: 'linear-gradient(to right, #22c55e, #10b981)',
    problem: {
      heading: 'Invisible on Google means invisible to customers',
      points: [
        "Your competitors show up on page 1 — you're on page 5",
        'You rely 100% on paid ads with zero organic traffic',
        "Your website has technical issues Google can't crawl properly",
        'No content strategy to target the keywords your customers search',
      ],
    },
    solution: {
      heading: 'SEO that compounds over time',
      description:
        'We fix your technical foundation, create content that targets real search queries, and build authority through strategic link building. Unlike ads, SEO traffic keeps growing even when you stop spending.',
    },
    process: [
      {
        step: '01',
        title: 'Technical Audit',
        description:
          'We crawl your site to fix speed, indexing, schema, and mobile issues that hurt rankings.',
      },
      {
        step: '02',
        title: 'Keyword Strategy',
        description:
          'Research and map the keywords your customers actually search for — in English and Bahasa.',
      },
      {
        step: '03',
        title: 'Content & On-Page',
        description:
          'We optimise existing pages and create new content targeting high-value keywords.',
      },
      {
        step: '04',
        title: 'Authority Building',
        description:
          'Strategic link building and local citations to strengthen your domain authority.',
      },
    ],
    faq: [
      {
        question: 'How long does SEO take to show results?',
        answer:
          "SEO is a long-term strategy. You'll see initial improvements in 2-3 months, with significant results typically at 6-12 months.",
      },
      {
        question: 'Do you guarantee page 1 rankings?',
        answer:
          'No legitimate SEO agency can guarantee specific rankings. We guarantee best practices, transparent reporting, and consistent effort toward measurable improvement.',
      },
      {
        question: 'Do you do SEO in Bahasa Melayu?',
        answer:
          'Yes. We optimise for both English and Bahasa Melayu search queries depending on your target audience.',
      },
      {
        question: 'Is SEO better than Google Ads?',
        answer:
          'They complement each other. Ads give immediate traffic, SEO gives compounding free traffic. We recommend starting with ads for instant results while building SEO for long-term growth.',
      },
    ],
  },
  'google-my-business': {
    slug: 'google-my-business',
    title: 'Google My Business Setup',
    headline: 'Get found when locals search for you',
    subtitle:
      'Professional Google Business Profile setup and optimisation — so you show up in Maps, local search, and the knowledge panel.',
    description:
      'Google My Business setup and optimisation for Malaysian businesses. Local SEO, Google Maps visibility, review management, and profile optimisation to dominate local search results.',
    keywords: [
      'Google My Business Malaysia',
      'GMB setup',
      'local SEO Malaysia',
      'Google Maps listing',
      'Google Business Profile Malaysia',
    ],
    icon: 'MapPin',
    color: 'from-red-500 to-orange-500',
    gradient: 'linear-gradient(to right, #ef4444, #f97316)',
    problem: {
      heading: 'Your neighbours find your competitor first',
      points: [
        "You don't show up when someone nearby searches for your service",
        'Your Google listing has wrong hours, no photos, or bad info',
        'Negative reviews sitting unanswered, killing trust',
        'Competitors with fewer reviews rank above you',
      ],
    },
    solution: {
      heading: 'Own your local search presence',
      description:
        "We fully optimise your Google Business Profile — accurate info, professional photos, strategic categories, and a review strategy that builds trust. You'll show up when nearby customers search for what you do.",
    },
    process: [
      {
        step: '01',
        title: 'Claim & Verify',
        description:
          "We claim your business listing (or create one) and complete Google's verification process.",
      },
      {
        step: '02',
        title: 'Full Optimisation',
        description:
          'Categories, descriptions, attributes, service areas, photos, and business hours — all optimised.',
      },
      {
        step: '03',
        title: 'Review Strategy',
        description:
          'We set up a system to generate and respond to reviews consistently.',
      },
      {
        step: '04',
        title: 'Ongoing Updates',
        description:
          'Regular posts, photo updates, and Q&A management to keep your listing active and ranking.',
      },
    ],
    faq: [
      {
        question: 'Do I need a physical address?',
        answer:
          'For a standard listing, yes. Service-area businesses without a storefront can set up a service-area profile instead.',
      },
      {
        question: 'How quickly will I appear on Google Maps?',
        answer:
          'After verification (usually 1-2 weeks), your listing goes live. Ranking improvements in local search typically take 1-3 months.',
      },
      {
        question: 'Can you help with negative reviews?',
        answer:
          'We help you respond professionally to negative reviews and implement a strategy to generate more positive reviews from satisfied customers.',
      },
      {
        question: 'Is this a one-time service?',
        answer:
          'Setup and optimisation is one-time. We also offer monthly management packages for ongoing posts, review responses, and performance tracking.',
      },
    ],
  },
  'app-development': {
    slug: 'app-development',
    title: 'App Development',
    headline: 'Custom apps that solve real business problems',
    subtitle:
      'Mobile and web applications built specifically for your business needs — not another cookie-cutter template.',
    description:
      'Custom mobile and web application development for Malaysian businesses. iOS, Android, and web apps designed around your specific workflows and customer needs.',
    keywords: [
      'app development Malaysia',
      'mobile app KL',
      'custom app development',
      'web application Malaysia',
      'software development Malaysia',
    ],
    icon: 'Smartphone',
    color: 'from-purple-500 to-violet-500',
    gradient: 'linear-gradient(to right, #a855f7, #8b5cf6)',
    problem: {
      heading: "Off-the-shelf software doesn't fit your business",
      points: [
        'Paying for 10 features but only using 2',
        "Your unique workflow doesn't match any existing software",
        "Customer experience suffers because your tools aren't connected",
        'You need a mobile app but quotes start at RM100k',
      ],
    },
    solution: {
      heading: "Built for your business, not everyone's business",
      description:
        'We build custom applications — mobile and web — that solve your specific problems. No unnecessary features, no forced workflows. Your app does exactly what your business needs, seamlessly.',
    },
    process: [
      {
        step: '01',
        title: 'Requirements & Scope',
        description:
          'We define exactly what your app needs to do — no more, no less. Clear scope, clear budget.',
      },
      {
        step: '02',
        title: 'Design & Prototype',
        description:
          'Interactive prototypes you can click through before any code is written.',
      },
      {
        step: '03',
        title: 'Development & Testing',
        description:
          'Agile development with regular demos. You see progress every 2 weeks.',
      },
      {
        step: '04',
        title: 'Launch & Iterate',
        description:
          'We launch your app, monitor performance, and iterate based on real user feedback.',
      },
    ],
    faq: [
      {
        question: 'How much does app development cost?',
        answer:
          'Simple web apps start from RM15,000. Mobile apps (iOS + Android) typically range from RM30,000-RM100,000+ depending on complexity.',
      },
      {
        question: 'How long does development take?',
        answer:
          'Simple web apps: 6-8 weeks. Mobile apps: 3-6 months. We provide a detailed timeline after scoping.',
      },
      {
        question: 'Do you build for both iOS and Android?',
        answer:
          'Yes. We use cross-platform frameworks to build for both iOS and Android simultaneously, reducing cost and timeline.',
      },
      {
        question: 'Do you handle app store submission?',
        answer:
          'Yes. We handle the full submission process for both Apple App Store and Google Play Store.',
      },
    ],
  },
  'landing-page-builder': {
    slug: 'landing-page-builder',
    title: 'Landing Page Builder',
    headline: 'Build landing pages that convert — no coding required',
    subtitle:
      'The all-in-one landing page builder for Malaysian businesses. Drag-and-drop design, built-in payments, and instant publishing.',
    description:
      'Nexova is the best landing page builder for Malaysian businesses. Drag-and-drop editor, built-in FPX payments via LeanX, inventory management, 15+ templates, and instant publishing — all in one platform.',
    keywords: [
      'landing page builder Malaysia',
      'page builder',
      'build landing page online',
      'drag and drop website builder Malaysia',
      'landing page template Malaysia',
      'no code builder Malaysia',
    ],
    icon: 'Globe',
    color: 'from-[#5BC0BE] to-[#7C74EA]',
    gradient: 'linear-gradient(to right, #5BC0BE, #7C74EA)',
    problem: {
      heading: "Building a landing page shouldn't cost RM10k",
      points: [
        'Hiring a developer costs RM5,000-RM20,000 for a single page',
        "DIY builders don't support Malaysian payment gateways",
        'You need separate tools for design, payments, inventory, and analytics',
        'Changes take days because you have to wait for your developer',
      ],
    },
    solution: {
      heading: 'One platform — design, sell, and manage',
      description:
        'Nexova lets you build professional landing pages in minutes with drag-and-drop. Native FPX payments through LeanX, real-time inventory sync, and built-in analytics — no coding, no separate tools, no developer dependency.',
    },
    process: [
      {
        step: '01',
        title: 'Pick a Template',
        description:
          'Choose from 15+ industry-specific templates designed for Malaysian businesses.',
      },
      {
        step: '02',
        title: 'Drag & Drop Edit',
        description:
          'Customise every element — text, images, colours, layout — with our visual editor.',
      },
      {
        step: '03',
        title: 'Add Products & Payments',
        description:
          'Set up your product inventory and connect FPX payments in minutes.',
      },
      {
        step: '04',
        title: 'Publish Instantly',
        description:
          'One click to go live. Your page gets a subdomain, or connect your custom domain.',
      },
    ],
    faq: [
      {
        question: 'Is there a free plan?',
        answer:
          'Yes. The free plan includes 3 projects, all page elements, form submissions, and a subdomain URL. No credit card required.',
      },
      {
        question: 'Can I accept FPX payments?',
        answer:
          'Yes. Nexova has native integration with LeanX payment gateway for FPX, e-wallets, and credit card payments.',
      },
      {
        question: 'Do I need coding skills?',
        answer:
          'Not at all. Everything is drag-and-drop. If you can use PowerPoint, you can use Nexova.',
      },
      {
        question: 'How is Nexova different from Wix or Squarespace?',
        answer:
          'Nexova is built specifically for Malaysian businesses with native FPX payments, Bahasa-ready templates, and integrated inventory management. No third-party payment plugins needed.',
      },
      {
        question: 'Can I use my own domain?',
        answer:
          'Yes. Pro plan users can connect custom domains (www.yourdomain.com) with simple DNS setup.',
      },
    ],
  },
};

export const servicesList = Object.values(services);

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services[slug];
}
