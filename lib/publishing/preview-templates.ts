export interface MockTemplate {
  id: string;
  name: string;
  slug: string;
  category: string;
  industry: string;
  description: string;
  thumbnail_url: string;
  preview_url: string;
  tags: string[];
  usage_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  data: {
    elements: Array<{
      type: string;
      order: number;
      props: Record<string, any>;
    }>;
    seo_settings?: Record<string, any>;
    theme?: Record<string, any>;
  };
}

export const MOCK_TEMPLATES: MockTemplate[] = [
  {
    id: 'tpl-001',
    name: 'SaaS Landing',
    slug: 'saas-landing',
    category: 'saas',
    industry: 'Technology',
    description:
      'Perfect for software products and SaaS platforms. Includes hero section, features grid, pricing table, FAQ, and strong CTA.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    preview_url:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    tags: ['software', 'saas', 'tech', 'modern', 'blue'],
    usage_count: 342,
    is_public: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    data: {
      elements: [
        {
          type: 'hero',
          order: 0,
          props: {
            variant: 'image_left',
            headline: 'Build Your Business Faster',
            subheadline:
              'The all-in-one platform to manage, grow, and scale your business. Trusted by 10,000+ companies worldwide.',
            ctaText: 'Start Free Trial',
            ctaUrl: '#signup',
            image: '/placeholder-hero.jpg',
            bgColor: '#ffffff',
          },
        },
        {
          type: 'features',
          order: 1,
          props: {
            variant: 'grid',
            title: 'Everything You Need',
            features: [
              {
                icon: 'Zap',
                title: 'Lightning Fast',
                description:
                  'Built for speed and performance from the ground up.',
              },
              {
                icon: 'Shield',
                title: 'Secure by Default',
                description: 'Enterprise-grade security with SOC 2 compliance.',
              },
              {
                icon: 'BarChart',
                title: 'Advanced Analytics',
                description:
                  'Get insights that matter with real-time dashboards.',
              },
              {
                icon: 'Users',
                title: 'Team Collaboration',
                description: 'Work together seamlessly with your team.',
              },
              {
                icon: 'Cloud',
                title: 'Cloud Storage',
                description: 'Unlimited storage for all your files and data.',
              },
              {
                icon: 'Lock',
                title: 'Privacy First',
                description: 'Your data is encrypted and never shared.',
              },
            ],
          },
        },
        {
          type: 'faq',
          order: 2,
          props: {
            variant: 'single_column',
            title: 'Frequently Asked Questions',
            questions: [
              {
                question: 'How does the free trial work?',
                answer:
                  'You get full access to all features for 14 days. No credit card required.',
              },
              {
                question: 'Can I cancel anytime?',
                answer:
                  'Yes, you can cancel your subscription at any time with no penalties.',
              },
              {
                question: 'What payment methods do you accept?',
                answer:
                  'We accept all major credit cards, PayPal, and bank transfers for enterprise plans.',
              },
            ],
          },
        },
        {
          type: 'cta',
          order: 3,
          props: {
            variant: 'centered',
            headline: 'Ready to Get Started?',
            description:
              'Join thousands of companies already using our platform.',
            buttonText: 'Start Your Free Trial',
            buttonUrl: '#signup',
            bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
        },
      ],
      seo_settings: {
        title: 'SaaS Landing Page Template',
        description:
          'Professional landing page template for SaaS products and software platforms.',
      },
      theme: { primaryColor: '#667eea', fontFamily: 'Inter' },
    },
  },
  {
    id: 'tpl-002',
    name: 'E-commerce Product',
    slug: 'ecommerce-product',
    category: 'ecommerce',
    industry: 'Retail',
    description:
      'Showcase your products beautifully. Perfect for physical or digital goods with product grid, testimonials, and buy now CTA.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    preview_url:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    tags: ['ecommerce', 'retail', 'shopping', 'product', 'sales'],
    usage_count: 287,
    is_public: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    data: {
      elements: [
        {
          type: 'hero',
          order: 0,
          props: {
            variant: 'centered',
            headline: 'Premium Quality Products',
            subheadline:
              'Discover our curated collection of handpicked items. Free shipping on orders over $50.',
            ctaText: 'Shop Now',
            ctaUrl: '#products',
            image: '/placeholder-product.jpg',
            bgColor: '#f7fafc',
          },
        },
        {
          type: 'features',
          order: 1,
          props: {
            variant: 'grid',
            title: 'Why Choose Us',
            features: [
              {
                icon: 'Truck',
                title: 'Free Shipping',
                description: 'On all orders over $50',
              },
              {
                icon: 'RefreshCw',
                title: '30-Day Returns',
                description: 'Hassle-free returns',
              },
              {
                icon: 'Award',
                title: 'Quality Guarantee',
                description: '100% satisfaction guaranteed',
              },
              {
                icon: 'CreditCard',
                title: 'Secure Payment',
                description: 'Safe and encrypted',
              },
            ],
          },
        },
        {
          type: 'testimonials',
          order: 2,
          props: {
            variant: 'grid',
            title: 'What Our Customers Say',
            testimonials: [
              {
                name: 'Sarah Johnson',
                role: 'Verified Buyer',
                avatar: '',
                quote:
                  'Best purchase I have made this year! The quality is outstanding and shipping was super fast.',
                rating: 5,
              },
              {
                name: 'Mike Chen',
                role: 'Verified Buyer',
                avatar: '',
                quote:
                  'Excellent customer service and the product exceeded my expectations. Highly recommend!',
                rating: 5,
              },
            ],
          },
        },
        {
          type: 'cta',
          order: 3,
          props: {
            variant: 'split',
            headline: 'Limited Time Offer',
            description: 'Get 20% off your first purchase. Use code: WELCOME20',
            buttonText: 'Shop Now',
            buttonUrl: '#products',
            bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          },
        },
      ],
      seo_settings: {
        title: 'E-commerce Product Landing Page',
        description:
          'Beautiful product landing page template for online stores.',
      },
      theme: { primaryColor: '#f5576c', fontFamily: 'Inter' },
    },
  },
  {
    id: 'tpl-003',
    name: 'Course Sales',
    slug: 'course-sales',
    category: 'education',
    industry: 'Education',
    description:
      'Launch your online course with impact. Features video hero, curriculum overview, instructor bio, and enrollment CTA.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
    preview_url:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
    tags: ['education', 'course', 'learning', 'online', 'teaching'],
    usage_count: 198,
    is_public: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    data: {
      elements: [
        {
          type: 'hero',
          order: 0,
          props: {
            variant: 'video_bg',
            headline: 'Master Web Development in 12 Weeks',
            subheadline:
              'Transform your career with our comprehensive course. Join 5,000+ successful graduates.',
            ctaText: 'Enroll Now',
            ctaUrl: '#enroll',
            image: '/placeholder-course.jpg',
            bgColor: '#1a202c',
            headlineColor: '#ffffff',
            subheadlineColor: '#e2e8f0',
          },
        },
        {
          type: 'features',
          order: 1,
          props: {
            variant: 'list',
            title: 'What You Will Learn',
            features: [
              {
                icon: 'Code',
                title: 'Modern JavaScript',
                description:
                  'ES6+, async/await, promises, and functional programming.',
              },
              {
                icon: 'Layout',
                title: 'React & Next.js',
                description:
                  'Build production-ready applications with React ecosystem.',
              },
              {
                icon: 'Database',
                title: 'Backend Development',
                description: 'Node.js, Express, databases, and API design.',
              },
              {
                icon: 'Sparkles',
                title: 'Modern CSS',
                description: 'Tailwind CSS, responsive design, and animations.',
              },
            ],
          },
        },
        {
          type: 'testimonials',
          order: 2,
          props: {
            variant: 'slider',
            title: 'Student Success Stories',
            testimonials: [
              {
                name: 'Alex Martinez',
                role: 'Software Engineer at Google',
                avatar: '',
                quote:
                  'This course completely changed my career trajectory. Within 3 months of completing it, I landed my dream job.',
                rating: 5,
              },
              {
                name: 'Emily Roberts',
                role: 'Freelance Developer',
                avatar: '',
                quote:
                  'The best investment I have ever made. The content is top-notch and the community is incredibly supportive.',
                rating: 5,
              },
            ],
          },
        },
        {
          type: 'cta',
          order: 3,
          props: {
            variant: 'centered',
            headline: 'Start Learning Today',
            description:
              '14-day money-back guarantee. Lifetime access to all course materials.',
            buttonText: 'Enroll Now - $299',
            buttonUrl: '#enroll',
            bgGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          },
        },
      ],
      seo_settings: {
        title: 'Online Course Landing Page',
        description: 'Professional landing page template for online courses.',
      },
      theme: { primaryColor: '#fa709a', fontFamily: 'Inter' },
    },
  },
  {
    id: 'tpl-004',
    name: 'Lead Generation',
    slug: 'lead-gen',
    category: 'leadgen',
    industry: 'Services',
    description:
      'Perfect for B2B services and consultations. Focused on capturing leads with benefits showcase, social proof, and lead form.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    preview_url:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
    tags: ['b2b', 'services', 'leads', 'consultation', 'business'],
    usage_count: 156,
    is_public: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    data: {
      elements: [
        {
          type: 'hero',
          order: 0,
          props: {
            variant: 'image_left',
            headline: 'Grow Your Business with Expert Consulting',
            subheadline:
              'We help companies scale from $1M to $10M+ in revenue. Book a free strategy session today.',
            ctaText: 'Get Free Consultation',
            ctaUrl: '#contact',
            image: '/placeholder-consulting.jpg',
            bgColor: '#ffffff',
          },
        },
        {
          type: 'features',
          order: 1,
          props: {
            variant: 'alternating',
            title: 'Our Services',
            features: [
              {
                icon: 'TrendingUp',
                title: 'Growth Strategy',
                description:
                  'Data-driven strategies to accelerate your business growth.',
              },
              {
                icon: 'Target',
                title: 'Market Analysis',
                description: 'Deep insights into your market and competitors.',
              },
              {
                icon: 'Users',
                title: 'Team Building',
                description: 'Build and scale high-performing teams.',
              },
            ],
          },
        },
        {
          type: 'testimonials',
          order: 2,
          props: {
            variant: 'masonry',
            title: 'Trusted by Industry Leaders',
            testimonials: [
              {
                name: 'David Kim',
                role: 'CEO, TechCorp',
                avatar: '',
                quote:
                  'Their consulting helped us 3x our revenue in just 12 months. Absolutely worth every penny.',
                rating: 5,
              },
            ],
          },
        },
        {
          type: 'cta',
          order: 3,
          props: {
            variant: 'banner',
            headline: 'Ready to Scale Your Business?',
            description: 'Book your free 30-minute strategy call today.',
            buttonText: 'Schedule Free Call',
            buttonUrl: '#contact',
            bgGradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
          },
        },
      ],
      seo_settings: {
        title: 'Lead Generation Landing Page',
        description: 'Professional landing page template for B2B services.',
      },
      theme: { primaryColor: '#30cfd0', fontFamily: 'Inter' },
    },
  },
  {
    id: 'tpl-005',
    name: 'Event Registration',
    slug: 'event-registration',
    category: 'event',
    industry: 'Events',
    description:
      'Perfect for conferences, webinars, and meetups. Features agenda, speaker showcase, and registration form.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    preview_url:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    tags: ['event', 'conference', 'webinar', 'meetup', 'registration'],
    usage_count: 124,
    is_public: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    data: {
      elements: [
        {
          type: 'hero',
          order: 0,
          props: {
            variant: 'centered',
            headline: 'Web Summit 2024',
            subheadline:
              'Join 500+ developers for 3 days of learning, networking, and innovation. March 15-17, 2024.',
            ctaText: 'Register Now',
            ctaUrl: '#register',
            image: '/placeholder-event.jpg',
            bgColor: '#1a202c',
            headlineColor: '#ffffff',
            subheadlineColor: '#e2e8f0',
          },
        },
        {
          type: 'features',
          order: 1,
          props: {
            variant: 'grid',
            title: 'Event Highlights',
            features: [
              {
                icon: 'Mic',
                title: '30+ Speakers',
                description: 'Industry experts and thought leaders',
              },
              {
                icon: 'BookOpen',
                title: '50+ Sessions',
                description: 'Workshops, talks, and panels',
              },
              {
                icon: 'Users',
                title: '500+ Attendees',
                description: 'Network with peers',
              },
              {
                icon: 'MapPin',
                title: 'Prime Location',
                description: 'Downtown Convention Center',
              },
            ],
          },
        },
        {
          type: 'faq',
          order: 2,
          props: {
            variant: 'two_column',
            title: 'Event Information',
            questions: [
              {
                question: 'What is included in the ticket?',
                answer:
                  'Access to all sessions, workshops, meals, and networking events.',
              },
              {
                question: 'Is there a virtual option?',
                answer: 'Yes, we offer virtual tickets for remote attendees.',
              },
              {
                question: 'What is the refund policy?',
                answer: 'Full refund available up to 7 days before the event.',
              },
            ],
          },
        },
        {
          type: 'cta',
          order: 3,
          props: {
            variant: 'centered',
            headline: 'Limited Seats Available',
            description: 'Early bird pricing ends soon. Save $100 today!',
            buttonText: 'Register Now - $299',
            buttonUrl: '#register',
            bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
        },
      ],
      seo_settings: {
        title: 'Event Registration Landing Page',
        description:
          'Professional landing page template for events and conferences.',
      },
      theme: { primaryColor: '#667eea', fontFamily: 'Inter' },
    },
  },
  {
    id: 'tpl-006',
    name: 'Portfolio',
    slug: 'portfolio',
    category: 'portfolio',
    industry: 'Creative',
    description:
      'Showcase your work beautifully. Perfect for freelancers and creatives with project gallery, about section, and contact form.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&q=80',
    preview_url:
      'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=1200&q=80',
    tags: ['portfolio', 'freelance', 'creative', 'design', 'showcase'],
    usage_count: 95,
    is_public: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    data: {
      elements: [
        {
          type: 'hero',
          order: 0,
          props: {
            variant: 'centered',
            headline: 'Creative Designer & Developer',
            subheadline:
              'I help brands tell their story through beautiful design and engaging experiences.',
            ctaText: 'View My Work',
            ctaUrl: '#projects',
            image: '/placeholder-portfolio.jpg',
            bgColor: '#ffffff',
          },
        },
        {
          type: 'features',
          order: 1,
          props: {
            variant: 'grid',
            title: 'What I Do',
            features: [
              {
                icon: 'Palette',
                title: 'UI/UX Design',
                description: 'Creating intuitive and beautiful interfaces',
              },
              {
                icon: 'Code',
                title: 'Web Development',
                description: 'Building fast and responsive websites',
              },
              {
                icon: 'Smartphone',
                title: 'Mobile Apps',
                description: 'Crafting delightful mobile experiences',
              },
            ],
          },
        },
        {
          type: 'testimonials',
          order: 2,
          props: {
            variant: 'grid',
            title: 'What Clients Say',
            testimonials: [
              {
                name: 'Jessica Thompson',
                role: 'Marketing Director',
                avatar: '',
                quote:
                  'Exceptional work! The website exceeded all our expectations. Highly professional and creative.',
                rating: 5,
              },
            ],
          },
        },
        {
          type: 'cta',
          order: 3,
          props: {
            variant: 'centered',
            headline: "Let's Work Together",
            description:
              "Have a project in mind? Let's discuss how I can help bring your vision to life.",
            buttonText: 'Get In Touch',
            buttonUrl: '#contact',
            bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
        },
      ],
      seo_settings: {
        title: 'Portfolio Landing Page',
        description:
          'Professional portfolio template for designers and developers.',
      },
      theme: { primaryColor: '#667eea', fontFamily: 'Inter' },
    },
  },
  {
    id: 'tpl-007',
    name: 'Classic Barber',
    slug: 'classic-barber',
    category: 'barber',
    industry: 'Grooming',
    description:
      'Premium barbershop template with dark luxurious aesthetic. Features services showcase, about section, team, gallery, client reviews, booking form, and contact info.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1585747860019-8005b2f74e92?w=600&q=80',
    preview_url:
      'https://images.unsplash.com/photo-1585747860019-8005b2f74e92?w=1200&q=80',
    tags: [
      'barber',
      'barbershop',
      'grooming',
      'haircut',
      'men',
      'salon',
      'luxury',
    ],
    usage_count: 73,
    is_public: true,
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-02-01T00:00:00Z',
    data: {
      elements: [
        // 0 — Navigation
        {
          type: 'navigation',
          order: 0,
          props: {
            logoText: '',
            logoIcon:
              '<svg viewBox="0 0 40 40" fill="#c8a97e"><circle cx="20" cy="20" r="18" fill="none" stroke="#c8a97e" stroke-width="1.5"/><text x="20" y="26" text-anchor="middle" font-size="16" font-family="serif" fill="#c8a97e">GB</text></svg>',
            bgColor: '#0a0a0a',
            textColor: '#c8a97e',
            linkColor: '#999',
            isSticky: true,
            menuItems: [
              { label: 'Services', url: '#services' },
              { label: 'Team', url: '#team' },
              { label: 'Gallery', url: '#gallery' },
              { label: 'Reviews', url: '#reviews' },
              { label: 'Contact', url: '#contact' },
            ],
          },
        },
        // 1 — Hero Slider (3 slides)
        {
          type: 'hero',
          order: 1,
          props: {
            textAlign: 'left',
            slides: [
              {
                headline: 'CRAFT.CUT.\nCONFIDENCE',
                headlineFontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                subheadline: "THE ART OF MEN'S STYLE IN THE HEART OF THE CITY.",
                ctaText: 'BOOK APPOINTMENT',
                ctaUrl: '#contact',
                secondaryCtaText: 'VIEW SERVICES',
                secondaryCtaUrl: '#services',
                bgImage:
                  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=80',
                headlineColor: '#ffffff',
                subheadlineColor: '#aaa',
                buttonBgColor: 'transparent',
                buttonTextColor: '#fff',
              },
              {
                headline: 'LEARN THE\nCRAFT',
                headlineFontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                subheadline:
                  'JOIN OUR BARBER ACADEMY. MASTER THE ART OF CUTTING, STYLING & GROOMING FROM INDUSTRY PROS.',
                ctaText: 'ENROLL NOW',
                ctaUrl: '#contact',
                secondaryCtaText: 'VIEW PROGRAM',
                secondaryCtaUrl: '#services',
                bgImage:
                  'https://images.unsplash.com/photo-1621605815971-fbc98d665571?w=1400&q=80',
                headlineColor: '#ffffff',
                subheadlineColor: '#aaa',
                buttonBgColor: '#c8a97e',
                buttonTextColor: '#0a0a0a',
              },
              {
                headline: 'PREMIUM\nHAIR WAX',
                headlineFontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                subheadline:
                  'STRONG HOLD. MATTE FINISH. HANDCRAFTED WITH NATURAL INGREDIENTS FOR THE PERFECT STYLE ALL DAY.',
                ctaText: 'SHOP NOW',
                ctaUrl: '#contact',
                secondaryCtaText: 'LEARN MORE',
                secondaryCtaUrl: '#about',
                bgImage:
                  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1400&q=80',
                headlineColor: '#ffffff',
                subheadlineColor: '#aaa',
                buttonBgColor: 'transparent',
                buttonTextColor: '#fff',
              },
            ],
          },
        },
        // 2 — Services with pricing
        {
          type: 'services-pricing',
          order: 2,
          props: {
            title: 'OUR SERVICES',
            subtitle: "MEN'S GROOMING ESSENTIALS",
            bgColor: '#111111',
            services: [
              {
                icon: 'Scissors',
                title: "MEN'S HAIRCUT",
                description:
                  'Classic and modern cuts for your style and face shape.',
                price: '$45',
              },
              {
                icon: 'Sparkles',
                title: 'HOT TOWEL SHAVE',
                description:
                  'Smooth shave, includes warm lather & essential oils treatment.',
                price: '$35',
              },
              {
                icon: 'Scissors',
                title: 'THE COMBO',
                description:
                  'A classic craft haircut and a smooth shave package deal.',
                price: '$70',
              },
            ],
          },
        },
        // 3 — About Us
        {
          type: 'about',
          order: 3,
          props: {
            title: 'ABOUT US',
            subtitle: 'MORE THAN JUST A HAIRCUT',
            bgColor: '#111111',
            text: "We created this space for more than just grooming. It is a place where men can slow down, kick back, and enjoy — just the right music, expert craftsmanship, and the atmosphere of a classic gentleman's club. We respect your time and style. You come in to exhale, and walk out feeling recharged and confident.",
            image:
              'https://images.unsplash.com/photo-1621605815971-fbc98d665571?w=600&q=80',
            stats: [
              { value: '+2500', label: 'CLIENTS' },
              { value: '3 YEARS', label: 'OF EXPERIENCE' },
              { value: '45 MIN', label: 'HAIRCUT TIME' },
            ],
          },
        },
        // 4 — Meet The Team
        {
          type: 'team',
          order: 4,
          props: {
            title: 'MEET THE TEAM',
            subtitle: 'YOUR STYLE IN GOOD HANDS',
            bgColor: '#1a1a1a',
            members: [
              {
                name: 'Erik Nielsen',
                role: 'MASTER BARBER',
                image:
                  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
              },
              {
                name: 'Thomas Hayes',
                role: 'COLORIST',
                image:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
              },
              {
                name: 'Marco Rossi',
                role: 'JUNIOR',
                image:
                  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80',
              },
            ],
            ctaText: 'BOOK AN APPOINTMENT',
            ctaUrl: '#contact',
          },
        },
        // 5 — Gallery / Our Work
        {
          type: 'gallery',
          order: 5,
          props: {
            title: 'OUR WORK',
            subtitle: 'EXAMPLES OF IMPECCABLE STYLE',
            bgColor: '#111111',
            images: [
              {
                alt: 'Classic Fade',
                url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80',
              },
              {
                alt: 'Beard Trim',
                url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&q=80',
              },
              {
                alt: 'Hot Towel Shave',
                url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&q=80',
              },
              {
                alt: 'Textured Crop',
                url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&q=80',
              },
              {
                alt: 'Pompadour Style',
                url: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=500&q=80',
              },
              {
                alt: 'Straight Razor',
                url: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&q=80',
              },
            ],
            ctaText: 'BOOK ONLINE',
            ctaUrl: '#contact',
          },
        },
        // 6 — Client Reviews
        {
          type: 'testimonials',
          order: 6,
          props: {
            variant: 'grid',
            title: 'CLIENT REVIEWS',
            subtitle: 'WHAT OUR GUESTS SAY',
            bgColor: '#1a1a1a',
            testimonials: [
              {
                name: 'Lukas Weber',
                role: '',
                avatar:
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
                quote:
                  'True professionals. Extremely satisfied with the result. The attention to detail is amazing.',
                rating: 5,
              },
              {
                name: 'Oliver Smith',
                role: '',
                avatar:
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
                quote:
                  'Such a cool vibe, great drinks, and excellent service. Definitely coming back.',
                rating: 5,
              },
              {
                name: 'Matteo Ricci',
                role: '',
                avatar:
                  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80',
                quote:
                  'Sharp, fast, and high quality. Hands down the best barbershop in the city.',
                rating: 5,
              },
            ],
          },
        },
        // 7 — Contact + Booking Form
        {
          type: 'contact',
          order: 7,
          props: {
            title: 'CONTACTS',
            formTitle: 'BOOK AN APPOINTMENT',
            bgColor: '#111111',
            contactItems: [
              { icon: 'MapPin', text: '24 OXFORD STREET, LONDON, UK' },
              { icon: 'Clock', text: 'MON-SUN: 10AM \u2013 10PM' },
              { icon: 'Smartphone', text: '+44 20 7123 4567' },
            ],
            services: [
              "Men's Haircut",
              'Hot Towel Shave',
              'The Combo',
              'Beard Trim',
              'Kids Haircut',
            ],
            buttonText: 'BOOK NOW',
          },
        },
        // 8 — Footer
        {
          type: 'footer',
          order: 8,
          props: {
            bgColor: '#0a0a0a',
            textColor: '#888',
            copyright: '\u00a9 The Grizzly Barbers',
            socials: [
              { platform: 'instagram', url: '#' },
              { platform: 'tiktok', url: '#' },
              { platform: 'facebook', url: '#' },
            ],
          },
        },
      ],
      seo_settings: {
        title: 'The Grizzly Barbers \u2014 Craft.Cut.Confidence',
        description:
          'Premium barbershop offering classic haircuts, hot towel shaves, and the complete gentleman grooming experience in the heart of the city.',
      },
      theme: {
        primaryColor: '#c8a97e',
        fontFamily: 'Satoshi',
      },
    },
  },

  // ====== TPL-008: AI-Driven Real Estate ======
  {
    id: 'tpl-008',
    name: 'AI Real Estate',
    slug: 'ai-real-estate',
    category: 'realestate',
    industry: 'Real Estate',
    description:
      'Premium AI-driven real estate investment platform with blockchain-secured transactions, property analytics, and luxury property listings.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    preview_url:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    tags: [
      'real estate',
      'property',
      'luxury',
      'ai',
      'investment',
      'blockchain',
      'dubai',
    ],
    usage_count: 780,
    is_public: true,
    created_at: '2025-11-08T10:00:00Z',
    updated_at: '2026-03-20T14:00:00Z',
    data: {
      elements: [
        // 0 — Navigation
        {
          type: 're-navigation',
          order: 0,
          props: {
            brand: 'Nexora',
            logoIcon: 'triangle',
            menuItems: [
              { label: 'Discover', url: '#featured' },
              { label: 'Projects', url: '#projects' },
              { label: 'Insights', url: '#insights' },
              { label: 'Contact', url: '#contact' },
            ],
            ctaText: 'Connect',
            ctaUrl: '#contact',
          },
        },
        // 1 — Hero
        {
          type: 're-hero',
          order: 1,
          props: {
            headline: 'AI Driven Real Estate\nInvestments Opportunities',
            cta1Text: 'Explore',
            cta1Url: '#featured',
            cta2Text: 'Talk to us',
            cta2Url: '#contact',
            bgImage:
              'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=80',
            searchPlaceholder: 'Search by location, property type...',
            searchFilters: ['Buy', 'Rent', 'Invest'],
          },
        },
        // 2 — Intro / Description
        {
          type: 're-intro',
          order: 2,
          props: {
            text: 'We are a next-generation platform combining AI-driven property analytics and blockchain-secured transactions to revolutionize the real estate investment process',
            ctaText: 'Learn More',
            ctaUrl: '#featured',
            bgColor: '#ffffff',
          },
        },
        // 3 — Featured Projects
        {
          type: 're-featured-projects',
          order: 3,
          props: {
            title: 'Featured Projects',
            totalCount: '479',
            totalLabel: 'Listed Properties',
            filters: ['All', 'Villa', 'Apartment', 'Penthouse', 'Townhouse'],
            bgColor: '#f8f8f8',
            projects: [
              {
                title: 'Modern studio in Bluewaters Bay',
                location: 'Bluewaters Island',
                price: '$4,200,000',
                image:
                  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80',
                tag: 'Premium',
                number: '01',
                beds: '3',
                baths: '2',
                sqft: '2,450',
                description:
                  'A stunning modern studio with panoramic views of the Dubai skyline and direct Bluewaters Bay access. Floor-to-ceiling windows, marble finishes, and a private terrace overlooking the Arabian Gulf.',
              },
              {
                title: 'Luxury Penthouse Suite',
                location: 'Downtown Dubai',
                price: '$8,900,000',
                image:
                  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
                tag: 'Exclusive',
                number: '02',
                beds: '5',
                baths: '4',
                sqft: '6,800',
                description:
                  'An expansive penthouse with unobstructed Burj Khalifa views. Features a private rooftop pool, smart-home automation, Italian marble throughout, and a dedicated concierge service.',
              },
              {
                title: 'Beachfront Villa Estate',
                location: 'Jumeirah Beach',
                price: '$12,500,000',
                image:
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
                tag: 'New',
                number: '03',
                beds: '8',
                baths: '6',
                sqft: '12,200',
                description:
                  'A magnificent beachfront estate with direct beach access. Landscaped gardens, infinity pool, cinema room, and guest quarters set across three meticulously designed floors.',
              },
              {
                title: 'Creek Harbour Elegance',
                location: 'Dubai Creek Harbour',
                price: '$3,100,000',
                image:
                  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
                tag: 'Hot',
                number: '04',
                beds: '2',
                baths: '2',
                sqft: '1,850',
                description:
                  'An elegant waterfront residence overlooking Dubai Creek Tower. Open-plan living with premium finishes, balcony with creek views, and access to world-class amenities.',
              },
            ],
          },
        },
        // 4 — Property Detail Showcase
        {
          type: 're-property-detail',
          order: 4,
          props: {
            bgColor: '#111111',
            title:
              '8-Bedroom Waterfront Villa with Luxurious Design and Stunning Sea Views',
            price: '$9,500,000',
            location: 'Palm Jumeirah, Dubai',
            bedrooms: 8,
            bathrooms: 10,
            area: '15,000 sqft',
            type: 'Villa',
            mainImage:
              'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80',
            thumbImages: [
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80',
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&q=80',
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&q=80',
            ],
            features: [
              { icon: 'pool', label: 'Private Pool' },
              { icon: 'parking', label: 'Parking' },
              { icon: 'master', label: 'Master Suite' },
              { icon: 'gym', label: 'Private Gym' },
              { icon: 'garden', label: 'Garden' },
              { icon: 'security', label: '24/7 Security' },
            ],
            details: [
              { label: 'Year Built', value: '2024' },
              { label: 'Lot Size', value: '20,000 sqft' },
              { label: 'Garage', value: '4 Cars' },
              { label: 'Condition', value: 'New' },
            ],
          },
        },
        // 5 — Property Gallery Grid
        {
          type: 're-gallery',
          order: 5,
          props: {
            bgColor: '#f8f8f8',
            images: [
              {
                url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&q=80',
                alt: 'Living Room',
              },
              {
                url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&q=80',
                alt: 'Pool View',
              },
              {
                url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=500&q=80',
                alt: 'Kitchen',
              },
              {
                url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500&q=80',
                alt: 'Bedroom',
              },
              {
                url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&q=80',
                alt: 'Bathroom',
              },
              {
                url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=500&q=80',
                alt: 'Exterior',
              },
            ],
          },
        },
        // 6 — Building Layout / Floor Plans
        {
          type: 're-floor-plans',
          order: 6,
          props: {
            title: 'Building Layout',
            bgColor: '#ffffff',
            plans: [
              {
                name: 'BH Floor',
                image:
                  'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=700&q=80',
              },
              {
                name: 'Ground Floor',
                image:
                  'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=700&q=80',
              },
            ],
          },
        },
        // 7 — Leadership / Team
        {
          type: 're-leadership',
          order: 7,
          props: {
            title: 'Leadership',
            bgColor: '#ffffff',
            members: [
              {
                name: 'Sophia Patel',
                role: 'CEO & Co-Founder',
                image:
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80',
                photos: [
                  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80',
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
                ],
                bio: 'Specializes in high-yield investment opportunities with a client-first approach.',
                experience: '12 years',
                focus: 'Dubai Marina,\nBluewaters Island',
              },
              {
                name: 'James Miller',
                role: 'Chief Investment Officer',
                image:
                  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80',
                photos: [
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
                  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80',
                  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
                ],
                bio: 'Drives portfolio strategy and oversees high-value property acquisitions across the UAE.',
                experience: '15 years',
                focus: 'Palm Jumeirah,\nDowntown Dubai',
              },
              {
                name: 'Ayesha Rahman',
                role: 'Head of Analytics',
                image:
                  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80',
                photos: [
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
                  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80',
                  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
                ],
                bio: 'Leads AI-powered market analysis and predictive valuation models.',
                experience: '9 years',
                focus: 'Business Bay,\nJumeirah Village',
              },
            ],
          },
        },
        // 8 — Partners
        {
          type: 're-partners',
          order: 8,
          props: {
            title: 'Our valued partners',
            bgColor: '#ffffff',
            partners: ['BRAAS', 'JAMANIC', 'EMAAR', 'THE CROWN', 'SOBHA'],
          },
        },
        // 9 — Latest Insights / Blog
        {
          type: 're-insights',
          order: 9,
          props: {
            title: 'Latest Insights',
            bgColor: '#ffffff',
            categories: ['Buysell', 'Interior Design', 'Rendering', 'Finance'],
            articles: [
              {
                title:
                  'Smart Investments: How AI is Reshaping Dubai Real Estate in 2026',
                category: 'Buysell',
                date: 'Mar 15, 2026',
                image:
                  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80',
              },
              {
                title:
                  'Minimalist Luxury: Interior Design Trends for Modern Villas',
                category: 'Interior Design',
                date: 'Mar 10, 2026',
                image:
                  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80',
              },
              {
                title: '3D Rendering: The Future of Property Visualization',
                category: 'Rendering',
                date: 'Mar 05, 2026',
                image:
                  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80',
              },
            ],
          },
        },
        // 10 — What Our Clients Say
        {
          type: 're-testimonials',
          order: 10,
          props: {
            title: 'What Our Clients Say',
            bgColor: '#ffffff',
            reviewCount: '125+',
            testimonials: [
              {
                name: 'James',
                role: 'Dubai, December 2024',
                avatar:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                quote:
                  "Working with this team was an absolute pleasure. They helped me find the perfect property that matched all my needs and preferences. Their expertise and attention to detail made the entire process smooth and stress-free. I couldn't be happier with my new home!",
              },
              {
                name: 'Sarah',
                role: 'Abu Dhabi, November 2024',
                avatar:
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                quote:
                  'Exceptional service from start to finish. The AI-powered property recommendations were incredibly accurate and saved us weeks of searching. We found our dream villa within the first week.',
              },
              {
                name: 'Michael',
                role: 'Dubai Marina, October 2024',
                avatar:
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
                quote:
                  'As an international investor, I needed a team that understood cross-border transactions. Their blockchain-secured process and transparent documentation gave me complete confidence throughout the deal.',
              },
              {
                name: 'Amira',
                role: 'Palm Jumeirah, September 2024',
                avatar:
                  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
                quote:
                  'The personalized approach made all the difference. They took time to understand exactly what my family needed and presented options that were perfectly aligned with our lifestyle and budget.',
              },
              {
                name: 'David',
                role: 'Downtown Dubai, August 2024',
                avatar:
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
                quote:
                  'I was impressed by the market insights and data-driven analysis. Their team predicted the price trends accurately, and I secured my penthouse at the right time. Outstanding professionalism.',
              },
              {
                name: 'Fatima',
                role: 'Jumeirah Beach, July 2024',
                avatar:
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
                quote:
                  'From virtual tours to final handover, every step was seamless. The team went above and beyond to ensure we were comfortable with our decision. Truly a five-star experience.',
              },
              {
                name: 'Robert',
                role: 'Business Bay, June 2024',
                avatar:
                  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
                quote:
                  'The level of transparency was refreshing. No hidden fees, no surprises. They walked me through every document and made the legal process completely stress-free. Highly recommend.',
              },
              {
                name: 'Layla',
                role: 'Creek Harbour, May 2024',
                avatar:
                  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
                quote:
                  'What sets this team apart is their deep knowledge of the Dubai market. They knew every building, every developer, and every upcoming project. An invaluable resource for any buyer.',
              },
              {
                name: 'Ahmed',
                role: 'Bluewaters Island, April 2024',
                avatar:
                  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80',
                quote:
                  'Second time working with them, and the experience was even better. They remembered our preferences and found us the perfect investment property within days. Exceptional client care.',
              },
              {
                name: 'Elena',
                role: 'Dubai Hills, March 2024',
                avatar:
                  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80',
                quote:
                  'Moving from Europe, I needed someone who could handle everything remotely. Their digital-first approach and responsive communication made the entire overseas purchase feel effortless.',
              },
            ],
          },
        },
        // 11 — Contact Form
        {
          type: 're-contact',
          order: 11,
          props: {
            title: 'Complete this form\nto contact our team',
            bgColor: '#ffffff',
            fields: [
              {
                name: 'firstName',
                label: 'First name',
                type: 'text',
                placeholder: 'Your first name',
              },
              {
                name: 'lastName',
                label: 'Last name',
                type: 'text',
                placeholder: 'Your last name',
              },
              {
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'email@example.com',
              },
              {
                name: 'phone',
                label: 'Phone number',
                type: 'tel',
                placeholder: '+971 XX XXX XXXX',
              },
              {
                name: 'propertyType',
                label: 'Property Type',
                type: 'select',
                options: [
                  'Villa',
                  'Apartment',
                  'Penthouse',
                  'Townhouse',
                  'Commercial',
                ],
              },
              {
                name: 'budget',
                label: 'Budget Range',
                type: 'select',
                options: [
                  '$500K - $1M',
                  '$1M - $3M',
                  '$3M - $5M',
                  '$5M - $10M',
                  '$10M+',
                ],
              },
            ],
            buttonText: 'Submit',
            note: 'Subscribe to our news',
            mapCenter: 'Dubai, UAE',
          },
        },
        // 12 — Footer
        {
          type: 're-footer',
          order: 12,
          props: {
            brand: 'Nexora',
            tagline: 'We are here to change\nthe real estate world',
            columns: [
              {
                title: 'Navigation',
                links: [
                  { label: 'Home', url: '#' },
                  { label: 'Projects', url: '#projects' },
                  { label: 'About', url: '#about' },
                  { label: 'Contact', url: '#contact' },
                ],
              },
              {
                title: 'Properties',
                links: [
                  { label: 'Featured', url: '#featured' },
                  { label: 'New Listings', url: '#' },
                  { label: 'Dubai Marina', url: '#' },
                  { label: 'Palm Jumeirah', url: '#' },
                ],
              },
              {
                title: 'Legal',
                links: [
                  { label: 'Privacy Policy', url: '#' },
                  { label: 'Terms of Service', url: '#' },
                  { label: 'Cookie Policy', url: '#' },
                ],
              },
            ],
            socials: [
              { platform: 'instagram', url: '#' },
              { platform: 'twitter', url: '#' },
              { platform: 'linkedin', url: '#' },
              { platform: 'facebook', url: '#' },
            ],
            copyright: '© 2026 Nexora. All rights reserved.',
          },
        },
      ],
      seo_settings: {
        title: 'Nexora — AI Driven Real Estate Investments',
        description:
          'Next-generation platform combining AI-driven property analytics and blockchain-secured transactions to revolutionize real estate investment.',
      },
      theme: {
        primaryColor: '#1a6b4f',
        fontFamily: 'Satoshi',
      },
    },
  },
  // ====== TPL-009: Timeshop — Digital Smartwatch ======
  {
    id: 'tpl-009',
    name: 'Timeshop — Digital Smartwatch',
    slug: 'timeshop-smartwatch',
    category: 'ecommerce',
    industry: 'Consumer Electronics',
    description:
      'A sleek e-commerce landing page for selling digital smartwatches. Includes hero, product grid, feature showcase, limited-time offers, video demo, testimonials, and footer.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&q=80',
    preview_url:
      'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=1200&q=80',
    tags: [
      'smartwatch',
      'ecommerce',
      'electronics',
      'wearable',
      'modern',
      'green',
    ],
    usage_count: 187,
    is_public: true,
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-03-01T00:00:00Z',
    data: {
      elements: [
        // 0 — Navigation
        {
          type: 'sw-navigation',
          order: 0,
          props: {
            logo: 'Timeshop',
            links: [
              { label: 'Home', href: '#' },
              { label: 'Feature', href: '#features' },
              { label: 'Product', href: '#products' },
              { label: 'Contact', href: '#contact' },
            ],
            ctaText: 'Buy Now',
          },
        },
        // 1 — Hero
        {
          type: 'sw-hero',
          order: 1,
          props: {
            headline: 'Digital Watches\nThat Are Best For',
            highlight: 'Daily Use',
            description:
              'Every man needs a good, solid watch. Our smartwatches combine premium craftsmanship with cutting-edge technology for your everyday lifestyle.',
            ctaText: 'Explore More',
            ctaUrl: '#products',
            badge: 'Get Up To 65% Off',
            image: '/images/smartwatch/hero-smart-watch.png',
          },
        },
        // 2 — Features strip
        {
          type: 'sw-features',
          order: 2,
          props: {
            features: [
              {
                icon: 'shipping',
                title: 'Free Shipping',
                description: 'Free Shipping On All Online Orders',
              },
              {
                icon: 'support',
                title: '24/7 Support',
                description: 'Contact us any time for your problems',
              },
              {
                icon: 'secure',
                title: 'Secure Payment',
                description: 'Enjoy secure and worry-free transactions',
              },
            ],
          },
        },
        // 3 — Product Grid
        {
          type: 'sw-products',
          order: 3,
          props: {
            subtitle: 'Our Product',
            headline: 'Take Our <span>Product</span>',
            description:
              'We provide marketing services to startups and small businesses looking for a partner for their digital media.',
            products: [
              {
                name: 'Pulse Pro X1',
                color: 'Color: Ocean Blue',
                image: '/images/smartwatch/watch-1.jpg',
                price: '$70',
                rating: 4.5,
                reviews: 192,
              },
              {
                name: 'Chrono Lite S3',
                color: 'Color: Midnight',
                image: '/images/smartwatch/watch-2.jpg',
                price: '$200',
                rating: 5,
                reviews: 201,
              },
              {
                name: 'Aura Fit Band',
                color: 'Color: Sleek Silver',
                image: '/images/smartwatch/watch-3.jpg',
                price: '$120',
                rating: 4.5,
                reviews: 192,
              },
              {
                name: 'Zenith Gold 44',
                color: 'Color: Rose Gold',
                image: '/images/smartwatch/watch-4.jpg',
                price: '$150',
                rating: 4.5,
                reviews: 76,
              },
              {
                name: 'Nova Sport SE',
                color: 'Color: Forest Green',
                image: '/images/smartwatch/watch-5.jpg',
                price: '$70',
                rating: 5,
                reviews: 143,
              },
              {
                name: 'Titan Classic 7',
                color: 'Color: Jet Black',
                image: '/images/smartwatch/watch-6.jpg',
                price: '$110',
                rating: 5,
                reviews: 143,
              },
            ],
          },
        },
        // 4 — Smartwatch Features Showcase
        {
          type: 'sw-showcase',
          order: 4,
          props: {
            subtitle: 'Smart Watch',
            headline: 'For Easy Living, Get The Best &\nFashionable Smartwatch',
            description:
              'Experience cutting-edge wearable technology with premium materials and advanced health monitoring. Our smartwatches are designed to seamlessly integrate into your active lifestyle.',
            image: '/images/smartwatch/green-watch.png',
            specs: [
              { label: 'Eye Protection Level', value: 'OHLC/Offer' },
              { label: 'Case Material', value: 'Carbon Fibre' },
              { label: 'Battery Lifetime(hr)', value: '48 hrs' },
              { label: 'Band Material', value: 'Silicone' },
              { label: 'App Download Available', value: 'Yes' },
              { label: 'Network', value: 'Mobile 4G' },
              { label: 'Movement Type', value: 'Electronic' },
              { label: 'Battery Capacity', value: '300–450 mAh' },
              { label: 'Application Age', value: 'Group Adult' },
              { label: 'Compatibility', value: 'All Compatible' },
            ],
          },
        },
        // 5 — Choice Products
        {
          type: 'sw-choice',
          order: 5,
          props: {
            headline: 'Choice Our Best & Fashionable\nProducts',
            description:
              'Experience cutting-edge wearable technology with premium materials and advanced health monitoring. Our smartwatches seamlessly integrate into your active lifestyle with comprehensive features.',
            image: '/images/smartwatch/green-watch-2.png',
            checks: [
              '1 Year Warranty',
              'Authentic Product',
              'Return Policy',
              'Dedicated Support',
              'Free Shipping',
            ],
          },
        },
        // 6 — Limited Time Offer
        {
          type: 'sw-offer',
          order: 6,
          props: {
            subtitle: 'Limited Time Offer',
            headline: 'Discount 50% On All SX40 Model Product',
            description:
              "Don't miss out on our biggest sale of the year. Premium smartwatches at unbeatable prices.",
            products: [
              {
                name: 'Sport Watch Pro',
                image: '/images/smartwatch/watch-discount-1.png',
                badge: 'Sell 45% Off',
              },
              {
                name: 'Classic Digital',
                image: '/images/smartwatch/watch-discount-2.png',
                badge: 'Sell 45% Off',
              },
              {
                name: 'Fitness Tracker',
                image: '/images/smartwatch/watch-discount-3.png',
                badge: 'Sell 45% Off',
              },
            ],
          },
        },
        // 7 — Product Demo Video
        {
          type: 'sw-video',
          order: 7,
          props: {
            subtitle: 'Product Demo',
            headline: 'Get Product More Information From The Video',
            description:
              'Watch our detailed product demo to discover all the features and capabilities of our premium smartwatch collection.',
            thumbnail:
              'https://images.unsplash.com/photo-1510017803350-6a63e12b1f04?w=900&q=80',
            video: '/images/smartwatch/smartwatch-demo.mp4',
          },
        },
        // 8 — Testimonials
        {
          type: 'sw-testimonials',
          order: 8,
          props: {
            subtitle: 'Our Testimonial',
            headline: 'Our Testimonial',
            description:
              'See what our customers have to say about their experience with our premium smartwatch collection.',
            testimonials: [
              {
                name: 'Jenny Willson',
                role: 'Customer',
                avatar:
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                rating: 5,
                quote:
                  'First quick result from multiple sources, quick results and select far required into a result. People can feel exclusive about the premium quality of this watch.',
              },
              {
                name: 'Juliet Martinez',
                role: 'Customer',
                avatar:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                rating: 5,
                quote:
                  'First quick result from multiple sources, quick results and select far required into a result. People can feel exclusive about the premium quality of this watch.',
              },
              {
                name: 'David Conner',
                role: 'Customer',
                avatar:
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
                rating: 5,
                quote:
                  'First quick result from multiple sources, quick results and select far required into a result. People can feel exclusive about the premium quality of this watch.',
              },
            ],
          },
        },
        // 9 — Footer
        {
          type: 'sw-footer',
          order: 9,
          props: {
            logo: 'Timeshop',
            tagline:
              'Premium digital smartwatches crafted for modern living. Style meets technology.',
            phone: '+44 123 654 7890',
            columns: [
              {
                title: 'Links',
                links: [
                  { label: 'About Us', href: '#' },
                  { label: 'Choose Us', href: '#' },
                  { label: 'Products', href: '#products' },
                  { label: 'Offer', href: '#offer' },
                ],
              },
              {
                title: 'Support',
                links: [
                  { label: 'Help Center', href: '#' },
                  { label: 'Partner', href: '#' },
                  { label: 'Suggestions', href: '#' },
                  { label: 'Support Center', href: '#' },
                  { label: 'News', href: '#' },
                ],
              },
              {
                title: 'Info',
                links: [
                  { label: 'Contact', href: '#contact' },
                  { label: 'FAQ', href: '#' },
                  { label: 'Privacy & Policy', href: '#' },
                  { label: 'Co Omille Road Apt.728', href: '#' },
                  { label: 'California, USA', href: '#' },
                ],
              },
            ],
          },
        },
      ],
      seo_settings: {
        title: 'Timeshop — Digital Smartwatch Store',
        description:
          'Premium digital smartwatches for daily use. Free shipping, secure payments, and 24/7 support.',
      },
      theme: {
        primaryColor: '#00b894',
        fontFamily: 'Inter',
      },
    },
  },

  // ====== TPL-010: ApexCare — Dental Clinic ======
  {
    id: 'tpl-010',
    name: 'ApexCare — Dental Clinic',
    slug: 'apexcare-dental',
    category: 'healthcare',
    industry: 'Healthcare',
    description:
      'A modern, professional dental clinic landing page. Includes hero, about, services list, appointment booking, team showcase, testimonials, blog, and footer.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80',
    preview_url:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80',
    tags: ['dental', 'clinic', 'healthcare', 'medical', 'professional', 'blue'],
    usage_count: 94,
    is_public: true,
    created_at: '2025-03-20T00:00:00Z',
    updated_at: '2025-03-20T00:00:00Z',
    data: {
      elements: [
        // 0 — Navigation
        {
          type: 'dc-navigation',
          order: 0,
          props: {
            logo: 'ApexCare',
            links: [
              { label: 'Home', href: '#' },
              { label: 'About', href: '#about' },
              { label: 'Oral Health', href: '#services' },
              { label: 'Pricing', href: '#booking' },
              { label: 'Contacts', href: '#footer' },
            ],
            ctaText: "Let's Talk",
          },
        },
        // 1 — Hero
        {
          type: 'dc-hero',
          order: 1,
          props: {
            headline: 'Compassionate care, exceptional results.',
            brandLabel: 'Pro Health',
            subheadline:
              'Our team of experienced doctors and healthcare professionals are committed to providing quality care and personalized attention to our patients.',
            videoCtaText: 'See how we work',
            bgImage:
              'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1400&q=80',
            patientBadge: {
              value: '150K +',
              label: 'Patient Recover',
              avatars: [
                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&q=80',
                'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&q=80',
              ],
            },
            stats: [
              { value: '20+', label: 'Years of experience' },
              { value: '95%', label: 'Patient satisfaction rating' },
              { value: '5000+', label: 'Patients served annually' },
              { value: '10+', label: 'Healthcare providers on staff' },
            ],
          },
        },
        // 2 — About / Trusted Partners
        {
          type: 'dc-about',
          order: 2,
          props: {
            badge: 'LEARN ABOUT US',
            headline: 'Your trusted partners\nin dental care',
            description:
              'At ApexCare, we believe that a healthy smile is the gateway to a happy life. Our team of dedicated dental professionals combines state-of-the-art technology with compassionate care to provide you the best dental experience possible.',
            ctaText: 'Meet Doctor',
            image:
              'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=700&q=80',
          },
        },
        // 3 — Why Choose Us / Reasons
        {
          type: 'dc-reasons',
          order: 3,
          props: {
            badge: 'WHY CHOOSE US',
            headline: 'The top reasons our\npatients love us',
            certification: 'Certified by the American Dental Association',
            certCta: 'Schedule Your Visit',
            reasons: [
              {
                icon: 'tooth',
                title: 'Experienced & Caring Dentists',
                description:
                  'With over 25 years of experience, our team provides expert care with a gentle touch, ensuring a comfortable and effective experience every time.',
              },
              {
                icon: 'tech',
                title: 'State-of-the-Art Technology',
                description:
                  'We use the latest dental technology to provide precise, efficient, and effective treatments, reducing discomfort.',
              },
              {
                icon: 'family',
                title: 'Comprehensive Care for the Whole Family',
                description:
                  'From routine check-ups to advanced treatments, we offer dental services for all ages — ensuring the whole family receives the best care.',
              },
            ],
            imageCard: {
              image:
                'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80',
              title: 'Affordable &\nTransparent Pricing',
            },
          },
        },
        // 4 — Services
        {
          type: 'dc-services',
          order: 4,
          props: {
            badge: 'OUR SERVICES',
            headline: 'Our comprehensive\ndental services',
            moreCtaText: 'More Service',
            services: [
              {
                name: 'General Dentistry',
                desc: 'Regular check-ups, cleanings, fillings, and preventive care to keep your smile healthy and bright.',
              },
              {
                name: 'Cosmetic Dentistry',
                desc: 'Teeth whitening, veneers, bonding, and smile makeovers for a confident, radiant appearance.',
              },
              {
                name: 'Orthodontics',
                desc: 'Braces, clear aligners, and corrective treatments to straighten teeth and improve your bite.',
              },
              {
                name: 'Oral Surgery',
                desc: 'Extractions, implants, and surgical procedures performed with precision and patient comfort in mind.',
              },
              {
                name: 'Pediatric Dentistry',
                desc: 'Gentle, kid-friendly dental care designed to build healthy habits from childhood.',
              },
              {
                name: 'Emergency Care',
                desc: 'Same-day urgent dental care for injuries, severe pain, and unexpected dental emergencies.',
              },
            ],
            image:
              'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&q=80',
            reviewCard: {
              text: 'The best dental experience I have ever had. Truly caring and professional team!',
              author: 'Anna Roberts',
              role: 'Regular Patient',
              rating: 5,
            },
          },
        },
        // 5 — Appointment Booking
        {
          type: 'dc-booking',
          order: 5,
          props: {
            badge: 'APPOINTMENT BOOKING',
            headline: 'Easy & quick\nappointment booking',
            fields: [
              { label: 'Full name', placeholder: 'Full name *', type: 'text' },
              { label: 'Email', placeholder: 'Email *', type: 'email' },
              {
                label: 'Appointment date',
                placeholder: 'Appointment date *',
                type: 'date',
              },
              {
                label: 'Appointment time',
                placeholder: 'Appointment time *',
                type: 'time',
              },
              {
                label: 'Phone number',
                placeholder: 'Phone number *',
                type: 'tel',
                fullWidth: true,
              },
              {
                label: 'Additional Notes',
                placeholder: 'Additional Notes *',
                type: 'textarea',
                fullWidth: true,
              },
            ],
            ctaText: 'Reserve Your Spot',
            image:
              'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=700&q=80',
          },
        },
        // 6 — Testimonial
        {
          type: 'dc-testimonial',
          order: 6,
          props: {
            badge: 'OUR PATIENTS',
            quote:
              "The staff made me feel so comfortable and cared for. First-class treatment, friendly service, and a brighter smile — I couldn't ask for better care!",
            author: 'Cooper Aranda',
            role: 'Patient',
            avatar:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
            image:
              'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&q=80',
          },
        },
        // 7 — Team / Dental Professionals
        {
          type: 'dc-team',
          order: 7,
          props: {
            headline: 'Your trusted dental\nprofessionals',
            ctaText: 'View Doctor Today',
            doctors: [
              {
                name: 'Dr. John Smith',
                role: 'Oral Surgeon',
                image:
                  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80',
              },
              {
                name: 'Dr. Emily Lee',
                role: 'Orthodontist',
                image:
                  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80',
              },
              {
                name: 'Dr. Sarah Thompson',
                role: 'Periodontist',
                image:
                  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80',
              },
              {
                name: 'Dr. Ashley',
                role: 'Endodontist',
                image:
                  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&q=80',
              },
            ],
          },
        },
        // 8 — Blog
        {
          type: 'dc-blog',
          order: 8,
          props: {
            headline: 'From our blog: tips & insights for\nhealthy smiles',
            ctaText: 'Check All Insights',
            posts: [
              {
                date: 'October 9, 2025',
                title: '6 Tips to Keep Your Teeth Healthy',
                excerpt:
                  'Learn the essential daily habits that protect your teeth and gums for years to come.',
                image:
                  'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&q=80',
              },
              {
                date: 'September 6, 2025',
                title: 'How to Choose the Right Toothbrush',
                excerpt:
                  'Find out what to look for when picking the perfect toothbrush for your dental health.',
                image:
                  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&q=80',
              },
            ],
          },
        },
        // 9 — Footer
        {
          type: 'dc-footer',
          order: 9,
          props: {
            logo: 'ApexCare',
            tagline: 'Dental Care Excellence\nTrusted by Your Family',
            address: 'Suite 12, Medical Plaza,\n123 Health St, NY 10001',
            phone: '+1(234) 123-56',
            email: 'info@apexcare.com',
            quickLinks: [
              { label: 'About', href: '#about' },
              { label: 'Services', href: '#services' },
              { label: 'Pricing', href: '#booking' },
              { label: 'Coverage', href: '#' },
            ],
            socialLinks: ['facebook', 'twitter', 'instagram'],
            newsletter: {
              placeholder: 'Enter your email',
              ctaText: 'Subscribe',
            },
            copyright: '© 2025 ApexCare. All rights reserved.',
          },
        },
      ],
      theme: {
        primaryColor: '#1e3a6e',
        fontFamily: 'Satoshi',
      },
    },
  },
  // ── TPL-011  Sugarbomb — Luxury Perfume ──
  {
    id: 'tpl-011',
    name: 'Sugarbomb — Luxury Perfume',
    slug: 'sugarbomb-perfume',
    description:
      'Elegant luxury perfume landing page with dark aesthetic, product showcase, categories, video story section, and newsletter signup.',
    category: 'ecommerce',
    industry: 'Beauty & Fragrance',
    tags: ['perfume', 'fragrance', 'luxury', 'beauty'],
    usage_count: 89,
    is_public: true,
    created_at: '2025-06-01T00:00:00Z',
    updated_at: '2025-06-10T00:00:00Z',
    thumbnail_url:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80',
    preview_url:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80',
    data: {
      seo_settings: {
        title: 'Sugarbomb — Luxury Perfume Collection',
        description:
          'Discover Sugarbomb luxury fragrances. Elevate your daily routine with premium scents crafted for the modern individual.',
      },
      elements: [
        // 0 — Navigation
        {
          type: 'sb-navigation',
          order: 0,
          props: {
            logo: 'Sugarbomb',
            links: ['Products', 'Our Story', 'News & Event'],
            cartIcon: true,
            ctaText: 'Shop',
          },
        },
        // 1 — Hero
        {
          type: 'sb-hero',
          order: 1,
          props: {
            headline: 'Elegant In\nEvery Drop',
            subheadline:
              'Sugarbomb elevates your daily routine — blending care, confidence, and community in every moment.',
            ctaText: 'View Our Collections',
            bgImage: '/templates/sugarbomb-hero.png',
            featuredProduct: {
              name: 'Midnight Rose',
              price: 'IDR 89,000.00',
              image:
                'https://images.unsplash.com/photo-1594035910387-fea081ac063b?w=300&q=80',
            },
          },
        },
        // 2 — About
        {
          type: 'sb-about',
          order: 2,
          props: {
            badge: 'ABOUT US',
            text: 'Sugarbomb elevates your daily routine blending care, confidence, and community in every moment.',
            textContinued:
              'Sugarbomb elevates your daily routine blending care, confidence, and community in every moment.',
          },
        },
        // 3 — Popular Products
        {
          type: 'sb-popular',
          order: 3,
          props: {
            headline: 'Our Popular\nProduct',
            description:
              'Sugarbomb elevates your daily routine blending care, confidence,',
            products: [
              {
                name: 'Sugarbomb Parfume',
                image:
                  'https://images.unsplash.com/photo-1594035910387-fea081ac063b?w=400&q=80',
              },
              {
                name: 'Face Wash',
                image:
                  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80',
              },
              {
                name: 'Face Serum',
                image:
                  'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&q=80',
              },
            ],
          },
        },
        // 4 — Featured Banner
        {
          type: 'sb-banner',
          order: 4,
          props: {
            lines: ['Antiperspirant', 'Deodorant', 'Soothing'],
            bgImage:
              'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1400&q=80',
            productImages: [
              'https://images.unsplash.com/photo-1594035910387-fea081ac063b?w=300&q=80',
              'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=300&q=80',
            ],
          },
        },
        // 5 — Product Categories
        {
          type: 'sb-categories',
          order: 5,
          props: {
            badge: 'PRODUCT BY CATEGORY',
            categories: [
              'Face Care',
              'Body Care',
              'Hair Care',
              'Parfume',
              'Others',
            ],
            activeCategory: 'Body Care',
            categoryTitle: 'Sugarbomb Body Care',
            categoryDesc:
              'Sugarbomb elevates your daily routine — blending care, confidence, and community in every moment.',
            ctaText: 'View Our Collections',
            image:
              'https://images.unsplash.com/photo-1616094553394-f05f5131be9b?w=500&q=80',
          },
        },
        // 6 — Our Collections
        {
          type: 'sb-collections',
          order: 6,
          props: {
            headline: 'Our Collections',
            products: [
              {
                name: 'EDT True Brotherhood',
                price: 'IDR 89,000.00',
                image:
                  'https://images.unsplash.com/photo-1594035910387-fea081ac063b?w=400&q=80',
                featured: true,
              },
              {
                name: 'Mountain Mist',
                price: 'IDR 75,000.00',
                image:
                  'https://images.unsplash.com/photo-1533920379810-6bed1074020c?w=400&q=80',
                imageType: 'landscape',
              },
              {
                name: 'EDT Invigorating Waterfall',
                price: 'IDR 89,000.00',
                image:
                  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80',
              },
              {
                name: 'Acne Body Wash',
                price: 'IDR 44,000.00',
                image:
                  'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&q=80',
              },
            ],
            ctaText: 'View Our Collections',
          },
        },
        // 7 — Watch Our Story (Video)
        {
          type: 'sb-story',
          order: 7,
          props: {
            headline: 'Watch Our Story',
            bgImage:
              'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=1400&q=80',
          },
        },
        // 8 — Testimonials
        {
          type: 'sb-testimonials',
          order: 8,
          props: {
            badge: 'RATINGS',
            headline: 'What Our\nCustomers Say',
            reviews: [
              {
                text: "I've tried a lot of grooming products, but Sugarbomb truly exceeded all my expectations. Must try!",
                author: 'Ricky Maulana, 31',
                rating: 4.5,
                avatar:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                date: 'May 27',
              },
              {
                text: 'Sugarbomb scents are absolutely divine. They last all day and I always get compliments.',
                author: 'Sarah Chen, 28',
                rating: 4.5,
                avatar:
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
              },
              {
                text: "Best luxury fragrance brand I've ever used. The packaging and quality are top-notch.",
                author: 'Amir Hassan, 34',
                rating: 5,
                avatar:
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
              },
            ],
          },
        },
        // 9 — Newsletter / Join
        {
          type: 'sb-newsletter',
          order: 9,
          props: {
            headline: 'Join Sugarbomb\nBrotherhood',
            subtext:
              'Sign up to be the first to know, we send email exclusively on sale events and new launches.',
            placeholder: 'Your email address',
            ctaText: 'Join our community',
            bgImage:
              'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
          },
        },
        // 10 — Footer
        {
          type: 'sb-footer',
          order: 10,
          props: {
            logo: 'Sugarbomb',
            columns: [
              {
                title: '',
                links: ['Home', 'Products', 'Our Story', 'News & Event', 'FAQ'],
              },
              { title: '', links: ['+60 804 140 7175', 'info@sugarbomb.com'] },
            ],
            tagline: 'our little brotherhood is a great big community',
            copyright: '© made with ❤ Sugarbomb',
          },
        },
      ],
      theme: {
        primaryColor: '#2d3a2e',
        fontFamily: 'Inter Tight',
      },
    },
  },
];
