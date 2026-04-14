import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Template data based on PRD requirements
const templates = [
  {
    name: 'SaaS Landing',
    slug: 'saas-landing',
    category: 'saas',
    industry: 'Technology',
    description:
      'Perfect for software products and SaaS platforms. Includes hero section, features grid, pricing table, FAQ, and strong CTA.',
    thumbnail_url: '/templates/saas-landing-thumb.png',
    preview_url: '/templates/saas-landing-preview.png',
    tags: ['software', 'saas', 'tech', 'modern', 'blue'],
    is_public: true,
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
                description: 'Built for speed and performance from the ground up.',
              },
              {
                icon: 'Shield',
                title: 'Secure by Default',
                description:
                  'Enterprise-grade security with SOC 2 compliance.',
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
      theme: {
        primaryColor: '#667eea',
        fontFamily: 'Inter',
      },
    },
  },
  {
    name: 'E-commerce Product',
    slug: 'ecommerce-product',
    category: 'ecommerce',
    industry: 'Retail',
    description:
      'Showcase your products beautifully. Perfect for physical or digital goods with product grid, testimonials, and buy now CTA.',
    thumbnail_url: '/templates/ecommerce-thumb.png',
    preview_url: '/templates/ecommerce-preview.png',
    tags: ['ecommerce', 'retail', 'shopping', 'product', 'sales'],
    is_public: true,
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
                avatar: '/avatars/sarah.jpg',
                quote:
                  'Best purchase I have made this year! The quality is outstanding and shipping was super fast.',
                rating: 5,
              },
              {
                name: 'Mike Chen',
                role: 'Verified Buyer',
                avatar: '/avatars/mike.jpg',
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
      theme: {
        primaryColor: '#f5576c',
        fontFamily: 'Inter',
      },
    },
  },
  {
    name: 'Course Sales',
    slug: 'course-sales',
    category: 'education',
    industry: 'Education',
    description:
      'Launch your online course with impact. Features video hero, curriculum overview, instructor bio, and enrollment CTA.',
    thumbnail_url: '/templates/course-thumb.png',
    preview_url: '/templates/course-preview.png',
    tags: ['education', 'course', 'learning', 'online', 'teaching'],
    is_public: true,
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
                avatar: '/avatars/alex.jpg',
                quote:
                  'This course completely changed my career trajectory. Within 3 months of completing it, I landed my dream job.',
                rating: 5,
              },
              {
                name: 'Emily Roberts',
                role: 'Freelance Developer',
                avatar: '/avatars/emily.jpg',
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
      theme: {
        primaryColor: '#fa709a',
        fontFamily: 'Inter',
      },
    },
  },
  {
    name: 'Lead Generation',
    slug: 'lead-gen',
    category: 'leadgen',
    industry: 'Services',
    description:
      'Perfect for B2B services and consultations. Focused on capturing leads with benefits showcase, social proof, and lead form.',
    thumbnail_url: '/templates/leadgen-thumb.png',
    preview_url: '/templates/leadgen-preview.png',
    tags: ['b2b', 'services', 'leads', 'consultation', 'business'],
    is_public: true,
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
                description:
                  'Deep insights into your market and competitors.',
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
                avatar: '/avatars/david.jpg',
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
      theme: {
        primaryColor: '#30cfd0',
        fontFamily: 'Inter',
      },
    },
  },
  {
    name: 'Event Registration',
    slug: 'event-registration',
    category: 'event',
    industry: 'Events',
    description:
      'Perfect for conferences, webinars, and meetups. Features agenda, speaker showcase, and registration form.',
    thumbnail_url: '/templates/event-thumb.png',
    preview_url: '/templates/event-preview.png',
    tags: ['event', 'conference', 'webinar', 'meetup', 'registration'],
    is_public: true,
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
                answer:
                  'Yes, we offer virtual tickets for remote attendees.',
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
      theme: {
        primaryColor: '#667eea',
        fontFamily: 'Inter',
      },
    },
  },
  {
    name: 'Portfolio',
    slug: 'portfolio',
    category: 'portfolio',
    industry: 'Creative',
    description:
      'Showcase your work beautifully. Perfect for freelancers and creatives with project gallery, about section, and contact form.',
    thumbnail_url: '/templates/portfolio-thumb.png',
    preview_url: '/templates/portfolio-preview.png',
    tags: ['portfolio', 'freelance', 'creative', 'design', 'showcase'],
    is_public: true,
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
                avatar: '/avatars/jessica.jpg',
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
      theme: {
        primaryColor: '#667eea',
        fontFamily: 'Inter',
      },
    },
  },
];

async function seedTemplates() {
  console.log('🌱 Starting template seeding...');

  try {
    // Check if templates already exist
    const { data: existingTemplates } = await supabase
      .from('templates')
      .select('slug');

    const existingSlugs = new Set(
      existingTemplates?.map((t) => t.slug) || []
    );

    // Filter out templates that already exist
    const newTemplates = templates.filter(
      (t) => !existingSlugs.has(t.slug)
    );

    if (newTemplates.length === 0) {
      console.log('✅ All templates already exist in the database');
      return;
    }

    console.log(
      `📝 Inserting ${newTemplates.length} new templates...`
    );

    const { data, error } = await supabase
      .from('templates')
      .insert(newTemplates)
      .select();

    if (error) {
      console.error('❌ Error inserting templates:', error);
      throw error;
    }

    console.log(`✅ Successfully inserted ${data?.length} templates:`);
    data?.forEach((template) => {
      console.log(`   - ${template.name} (${template.slug})`);
    });

    // Show summary
    const { count } = await supabase
      .from('templates')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true);

    console.log(`\n📊 Total public templates in database: ${count}`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedTemplates()
  .then(() => {
    console.log('\n🎉 Template seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
