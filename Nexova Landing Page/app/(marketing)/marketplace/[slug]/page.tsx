import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

/* ─────────────────────────────────────────────────────── */
/*  Template data                                          */
/* ─────────────────────────────────────────────────────── */

type Template = {
  slug: string;
  title: string;
  category: string;
  price: number;
  tags: string[];
  description: string;
  sections: string[];
  features: string[];
  pages: string[];
  demoUrl?: string;
};

const TEMPLATES: Template[] = [
  {
    slug: 'apexcare-dental',
    title: 'ApexCare Dental',
    category: 'Healthcare',
    price: 49,
    tags: ['Services', 'Appointment', 'Team', 'Blog'],
    description:
      'Modern dental clinic landing page with appointment booking, services list, team showcase, testimonials, and blog. Radiates trust and professionalism.',
    sections: [
      'Hero with patient stats and trust signals',
      'About section with doctor image',
      'Why Choose Us — reasons grid',
      'Comprehensive dental services list',
      'Appointment booking form',
      'Patient testimonial spotlight',
      'Team / dental professionals showcase',
      'Blog tips & insights',
    ],
    features: [
      'Online appointment booking form',
      'Doctor team profiles',
      'Patient testimonial section',
      'Blog preview section',
      'Newsletter subscription',
      'Mobile-responsive design',
    ],
    pages: ['Home', 'About', 'Services', 'Book Appointment', 'Blog'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/medical_elegant_085c1e61/index.html',
  },
  {
    slug: 'timeshop-smartwatch',
    title: 'Timeshop Smartwatch',
    category: 'E-commerce',
    price: 49,
    tags: ['Products', 'Specs', 'Video', 'Testimonials'],
    description:
      'Sleek e-commerce landing page for digital smartwatches. Includes product grid, feature showcase, limited-time offers, and video demo.',
    sections: [
      'Hero with discount badge',
      'Feature strip (shipping, support, payment)',
      'Product grid (6 products)',
      'Smartwatch specs showcase',
      'Best products selection',
      'Limited time offer section',
      'Product demo video',
      'Customer testimonials',
    ],
    features: [
      'Product grid with ratings and reviews',
      'Specs comparison table',
      'Limited-time offer countdown',
      'Video demo embed',
      'Customer testimonials',
      'Mobile-responsive design',
    ],
    pages: ['Home', 'Products', 'Product Detail', 'Contact'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/ecommerce_bold_3c3ea951/index.html',
  },
  {
    slug: 'ai-real-estate',
    title: 'AI Real Estate',
    category: 'Real Estate',
    price: 59,
    tags: ['Property Listings', 'Analytics', 'Team', 'Blog'],
    description:
      'Premium AI-driven real estate investment platform with property listings, analytics, team showcase, blog insights, and contact form.',
    sections: [
      'Hero with search bar and filters',
      'Intro / description section',
      'Featured projects grid (4 properties)',
      'Property detail showcase',
      'Property gallery grid',
      'Leadership team profiles',
      'Partner logos',
      'Latest insights / blog',
      'Client testimonials carousel',
      'Contact form with property preferences',
    ],
    features: [
      'Property search with filters (Buy/Rent/Invest)',
      'Featured property cards with details',
      'Property detail with specs and gallery',
      'Leadership team with bios',
      'Blog / insights section',
      'Contact form with budget range selector',
    ],
    pages: ['Home', 'Properties', 'Property Detail', 'Insights', 'Contact'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/realestate_professional_138d1185/index.html',
  },
  {
    slug: 'classic-barber',
    title: 'Classic Barber',
    category: 'Barber',
    price: 49,
    tags: ['Services', 'Gallery', 'Booking', 'Team'],
    description:
      'Premium barbershop template with dark luxurious aesthetic. Features services, team showcase, gallery, reviews, and booking form.',
    sections: [
      'Hero slider (3 slides)',
      'Services with pricing',
      'About Us with stats',
      'Meet the Team',
      'Gallery / Our Work (6 images)',
      'Client reviews',
      'Contact + booking form',
    ],
    features: [
      'Multi-slide hero with animations',
      'Service pricing cards',
      'Team member profiles',
      'Work gallery grid',
      'Client review cards with ratings',
      'Booking form with service selection',
    ],
    pages: ['Single page (scrollable)'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/fitness_bold_fcbe0d96/index.html',
  },
  {
    slug: 'saas-launch',
    title: 'SaaS Launch',
    category: 'SaaS',
    price: 49,
    tags: ['Hero', 'Pricing', 'FAQ'],
    description:
      'Clean, conversion-focused SaaS landing page with pricing table and feature grid. Designed to turn visitors into trial signups fast.',
    sections: [
      'Hero with animated gradient',
      'Feature grid (3-column)',
      'Social proof bar',
      'Pricing table (3 tiers)',
      'FAQ accordion',
      'Final CTA band',
    ],
    features: [
      'Lean.x payment button pre-wired',
      'Mobile-first responsive',
      'RevealOnScroll animations',
      'Open Graph meta pre-configured',
      'GTM tag placeholder',
      'Dark mode ready',
    ],
    pages: ['Home / Landing', 'Pricing (standalone)'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/saas_bold_0453596c/index.html',
  },
  {
    slug: 'agency-pro',
    title: 'Agency Pro',
    category: 'Agency',
    price: 59,
    tags: ['Portfolio', 'Case Studies', 'Contact'],
    description:
      'Full-service agency site with work showcase and team section. Projects your authority and drives qualified consultation requests.',
    sections: [
      'Hero with video background option',
      'Services overview (icon grid)',
      'Case study highlights',
      'Team bios',
      'Testimonials',
      'Contact with embedded form',
    ],
    features: [
      'formsubmit.co contact integration',
      'Case study expand/collapse',
      'Lightbox portfolio gallery',
      'Custom cursor effect',
      'Sticky header',
      'WCAG 2.1 AA accessible',
    ],
    pages: ['Home', 'Services', 'Work / Case Studies', 'Team', 'Contact'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/agency_creative_f9a2b3c4/index.html',
  },
  {
    slug: 'store-minimal',
    title: 'Store Minimal',
    category: 'E-commerce',
    price: 49,
    tags: ['Products', 'Cart', 'Checkout'],
    description:
      'Minimal, modern e-commerce storefront built for conversion. Pairs perfectly with Lean.x checkout for Malaysian FPX and e-wallet support.',
    sections: [
      'Hero with product hero shot',
      'Product grid (masonry)',
      'Feature highlights (shipping, returns)',
      'Best seller spotlight',
      'Reviews section',
      'Newsletter capture',
    ],
    features: [
      'Lean.x checkout integration',
      'FPX + e-wallet support',
      'Product quick-view modal',
      'Wishlist functionality',
      'Inventory badge display',
      'Cart persistence',
    ],
    pages: ['Home', 'Shop / Product Grid', 'Product Detail', 'Checkout'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/ecommerce_bold_22d74bb8/index.html',
  },
  {
    slug: 'portfolio-grid',
    title: 'Portfolio Grid',
    category: 'Portfolio',
    price: 29,
    tags: ['Grid', 'About', 'Contact'],
    description:
      'Elegant masonry grid portfolio for creators and designers. Let your work speak — this template keeps the UI invisible.',
    sections: [
      'Minimal hero (name + tagline)',
      'Filterable work grid',
      'Selected project spotlight',
      'About / bio panel',
      'Skills visual list',
      'Hire me CTA',
    ],
    features: [
      'Category filter (no JS framework)',
      'Lazy-load image grid',
      'PDF resume download hook',
      'Dark / light toggle',
      'Contact form',
      'Social links',
    ],
    pages: ['Home / Grid', 'Project Detail', 'About'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/portfolio_minimal_22d83524/index.html',
  },
  {
    slug: 'restaurant-bistro',
    title: 'Bistro',
    category: 'Restaurant',
    price: 39,
    tags: ['Menu', 'Reservations', 'Gallery'],
    description:
      'Warm, appetising restaurant site with menu and booking form. Conveys quality and drives table reservations from the first scroll.',
    sections: [
      'Full-bleed hero with food photography',
      'Featured dishes carousel',
      'Digital menu (category tabs)',
      'Gallery grid',
      'Reservations form',
      'Map embed + contact',
    ],
    features: [
      'Reservation form with time slots',
      'WhatsApp direct order button',
      'Menu PDF export link',
      'Instagram feed embed',
      'Google Maps embed',
      'Halal badge support',
    ],
    pages: ['Home', 'Menu', 'Gallery', 'Reservations'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/restaurant_creative_418334b4/index.html',
  },
  {
    slug: 'event-summit',
    title: 'Summit',
    category: 'Events',
    price: 39,
    tags: ['Schedule', 'Speakers', 'Tickets'],
    description:
      'Professional event and conference page with speaker lineup and ticket purchase. Creates urgency, communicates authority, drives registrations.',
    sections: [
      'Hero with countdown timer',
      'Speaker lineup grid',
      'Schedule / agenda',
      'Venue map and hotel',
      'Sponsor tier grid',
      'Ticket pricing + Lean.x checkout',
    ],
    features: [
      'Live countdown timer',
      'Lean.x ticket payment',
      'Agenda day/track filter',
      'Speaker modal bio',
      'Early-bird pricing logic',
      'PDF schedule download',
    ],
    pages: ['Home', 'Speakers', 'Schedule', 'Tickets'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/blog_tech_7d8e9f0a/index.html',
  },
  {
    slug: 'education-academy',
    title: 'Academy',
    category: 'Education',
    price: 49,
    tags: ['Courses', 'Instructors', 'Pricing'],
    description:
      'Online learning platform landing page with course cards and instructor profiles. Designed to convert visitors into enrolled students.',
    sections: [
      'Hero with enrolment stats',
      'Course category grid',
      'Featured course cards',
      'Instructor profiles',
      'Student testimonials',
      'Membership pricing table',
    ],
    features: [
      'Lean.x enrolment payment',
      'Course progress badges',
      'Certificate preview',
      'FAQ accordion',
      'Free preview lesson hook',
      'Whatsapp support link',
    ],
    pages: ['Home', 'Courses', 'Course Detail', 'Instructors', 'Pricing'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/portfolio_creative_1c8e5434/index.html',
  },
  {
    slug: 'health-clinic',
    title: 'Clinic',
    category: 'Healthcare',
    price: 49,
    tags: ['Services', 'Appointment', 'Team'],
    description:
      'Trustworthy healthcare and clinic site with appointment booking. Radiates calm authority and turns website visitors into booked patients.',
    sections: [
      'Hero with trust signals (years, patients)',
      'Services grid',
      'Doctor team profiles',
      'Appointment booking form',
      'Health tips blog preview',
      'Insurance logos',
    ],
    features: [
      'Online appointment form',
      'WhatsApp chat button',
      'Map + directions embed',
      'Medical disclaimer section',
      'Emergency contact banner',
      'MOH compliance note',
    ],
    pages: ['Home', 'Services', 'Doctors', 'Book Appointment', 'Blog'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/medical_elegant_085c1e61/index.html',
  },
  {
    slug: 'finance-advisor',
    title: 'Wealth Advisor',
    category: 'Finance',
    price: 59,
    tags: ['Services', 'Trust', 'Contact'],
    description:
      'Premium financial advisor page radiating trust, credibility, and authority. Designed for licensed financial planners and wealth management firms.',
    sections: [
      'Executive hero (dark, refined)',
      'AUM and client stats',
      'Services detail',
      'Philosophy / approach',
      'Media mentions',
      'Private consultation CTA',
    ],
    features: [
      'Compliance disclaimer section',
      'Calendly booking embed',
      'Secure contact form',
      'PDF brochure download',
      'Testimonials with initials',
      'FIMM/SC badge support',
    ],
    pages: ['Home', 'Services', 'About', 'Contact'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/legal_professional_c7c6d8a0/index.html',
  },
  {
    slug: 'travel-explore',
    title: 'Explore',
    category: 'Travel',
    price: 39,
    tags: ['Destinations', 'Gallery', 'Booking'],
    description:
      'Cinematic travel agency site with full-bleed imagery and package booking. Inspires wanderlust on first scroll and converts it into bookings.',
    sections: [
      'Full-bleed cinematic hero',
      'Destination card grid',
      'Popular package carousel',
      'Traveller testimonials',
      'Trust signals (years, trips, rating)',
      'Contact / quote form',
    ],
    features: [
      'WhatsApp booking integration',
      'Package inquiry form',
      'Image hover parallax',
      'Date picker booking widget',
      'Currency display toggle',
      'Google Reviews embed',
    ],
    pages: ['Home', 'Destinations', 'Packages', 'Contact'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/realestate_professional_138d1185/index.html',
  },
  {
    slug: 'fashion-brand',
    title: 'Fashion Brand',
    category: 'Fashion',
    price: 59,
    tags: ['Lookbook', 'Shop', 'Minimal'],
    description:
      'Editorial fashion brand with high-impact visuals and a shop grid. Communicates taste before a word is read.',
    sections: [
      'Split hero (image + text)',
      'Collection launch banner',
      'Lookbook editorial grid',
      'Product shop grid',
      'Brand story / mission',
      'Newsletter capture',
    ],
    features: [
      'Lean.x product checkout',
      'Lookbook zoom lightbox',
      'Size guide panel',
      'Instagram shoppable grid hook',
      'Pre-order mode',
      'Limited edition badge',
    ],
    pages: ['Home', 'Collections', 'Shop', 'Product Detail', 'About'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/ecommerce_bold_3b6e76e1/index.html',
  },
  {
    slug: 'startup-mvp',
    title: 'Startup MVP',
    category: 'SaaS',
    price: 29,
    tags: ['Hero', 'Features', 'CTA'],
    description:
      'Rapid-launch startup landing page — zero fluff, all signal. Ship your idea in a day and start validating before you build.',
    sections: [
      'Bold hero with waitlist form',
      'Problem → Solution (3 steps)',
      'Key feature highlights (3 cards)',
      'Founder quote',
      'Email waitlist CTA',
      'Social proof counter',
    ],
    features: [
      'Email waitlist capture',
      'Launch countdown optional',
      'Lean.x payment for pre-orders',
      'OG meta pre-configured',
      'Under-construction mode',
      'Typeform embed hook',
    ],
    pages: ['Single page (scrollable)'],
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/portfolio_bold_1e9e671a/index.html',
  },
];

const RELATED_COUNT = 3;

/* ─────────────────────────────────────────────────────── */
/*  Static params + Metadata                               */
/* ─────────────────────────────────────────────────────── */

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const t = TEMPLATES.find((x) => x.slug === params.slug);
  if (!t) return {};

  return {
    title: `${t.title} Template — Nexova Marketplace`,
    description: `${t.description} Open in X.IDE and publish in minutes.`,
    alternates: { canonical: `https://nexova.co/marketplace/${t.slug}` },
    openGraph: {
      title: `${t.title} — Nexova Template`,
      description: t.description,
      url: `https://nexova.co/marketplace/${t.slug}`,
      type: 'website',
    },
  };
}

/* ─────────────────────────────────────────────────────── */
/*  Page                                                   */
/* ─────────────────────────────────────────────────────── */

export default function TemplateDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const template = TEMPLATES.find((t) => t.slug === params.slug);
  if (!template) notFound();

  const related = TEMPLATES.filter(
    (t) => t.slug !== template.slug && t.category === template.category
  )
    .slice(0, RELATED_COUNT)
    .concat(
      TEMPLATES.filter(
        (t) => t.slug !== template.slug && t.category !== template.category
      ).slice(
        0,
        Math.max(
          0,
          RELATED_COUNT -
            TEMPLATES.filter(
              (t) =>
                t.category === template.category && t.slug !== template.slug
            ).length
        )
      )
    )
    .slice(0, RELATED_COUNT);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${template.title} Website Template`,
    description: template.description,
    url: `https://nexova.co/marketplace/${template.slug}`,
    offers: {
      '@type': 'Offer',
      price: template.price.toString(),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://nexova.co/marketplace/${template.slug}`,
    },
    brand: { '@type': 'Brand', name: 'Nexova' },
    category: `${template.category} Website Template`,
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
        name: 'Marketplace',
        item: 'https://nexova.co/marketplace',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: template.title,
        item: `https://nexova.co/marketplace/${template.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav
        className="bg-white border-b border-gray-100 py-3"
        aria-label="Breadcrumb"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li>
              <Link href="/" className="hover:text-[#5BC0BE] transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/marketplace"
                className="hover:text-[#5BC0BE] transition-colors"
              >
                Marketplace
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-600 truncate max-w-[160px]">
              {template.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Main content */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            {/* Left: detail */}
            <div>
              <RevealOnScroll>
                {/* Category badge */}
                <span className="inline-block bg-[#5FC7CD]/10 text-[#5FC7CD] text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  {template.category}
                </span>

                <h1 className="text-4xl sm:text-5xl font-bold text-[#455263] mb-4 leading-tight">
                  {template.title}
                </h1>
                <p className="text-xl text-gray-500 leading-relaxed mb-6">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {template.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs rounded-full px-3 py-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </RevealOnScroll>

              {/* Preview */}
              <RevealOnScroll delay={200}>
                {template.demoUrl ? (
                  <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-10">
                    <iframe
                      src={template.demoUrl}
                      title={`${template.title} live preview`}
                      className="w-full aspect-video"
                      loading="lazy"
                    />
                    <div className="bg-white border-t border-gray-100 px-4 py-3 flex justify-end">
                      <a href={template.demoUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#5BC0BE] hover:underline">
                        Open in new tab →
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-[#5BC0BE]/10 to-[#7C74EA]/10 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center text-gray-300 mb-10">
                    Template preview
                  </div>
                )}
              </RevealOnScroll>

              {/* Stats bar */}
              <RevealOnScroll delay={200}>
                <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-gray-200 mb-10">
                  <div>
                    <p className="text-xs uppercase text-gray-400 tracking-widest mb-1">
                      Category
                    </p>
                    <p className="font-semibold text-[#455263]">
                      {template.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400 tracking-widest mb-1">
                      Pages
                    </p>
                    <p className="font-semibold text-[#455263]">
                      {template.pages.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400 tracking-widest mb-1">
                      Sections
                    </p>
                    <p className="font-semibold text-[#455263]">
                      {template.sections.length}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Sections included */}
              <RevealOnScroll delay={200}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
                  <h2 className="text-xl font-bold text-[#455263] mb-5">
                    Sections included
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {template.sections.map((section) => (
                      <li
                        key={section}
                        className="flex items-center gap-3 text-sm text-gray-600"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#5FC7CD]/15 text-[#5FC7CD] flex items-center justify-center text-xs font-bold flex-shrink-0">
                          ✓
                        </span>
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>

              {/* Features */}
              <RevealOnScroll delay={200}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
                  <h2 className="text-xl font-bold text-[#455263] mb-5">
                    Features
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {template.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-gray-600"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#7C74EA]/15 text-[#7C74EA] flex items-center justify-center text-xs font-bold flex-shrink-0">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>

              {/* Pages included */}
              <RevealOnScroll delay={200}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  <h2 className="text-xl font-bold text-[#455263] mb-5">
                    Pages included
                  </h2>
                  <ul className="flex flex-wrap gap-3">
                    {template.pages.map((page) => (
                      <li
                        key={page}
                        className="bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-sm text-[#455263]"
                      >
                        {page}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            </div>

            {/* Right: sidebar */}
            <aside className="lg:sticky lg:top-24">
              <RevealOnScroll>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
                  {/* Price badge */}
                  <div className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] rounded-xl p-5 text-white text-center mb-6">
                    <p className="text-sm opacity-90 mb-1">One-time purchase</p>
                    <p className="text-4xl font-bold">${template.price}</p>
                    <p className="text-xs opacity-75 mt-1">
                      or from $12.38/mo with subscription
                    </p>
                  </div>

                  {/* CTAs */}
                  <Link href="/signup" className="block mb-3">
                    <Button className="w-full bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full py-3 font-semibold border-0 shadow-md transition-all duration-300">
                      Open in X.IDE Builder
                    </Button>
                  </Link>
                  {template.demoUrl ? (
                    <a href={template.demoUrl} target="_blank" rel="noopener noreferrer" className="block mb-6">
                      <Button
                        variant="outline"
                        className="w-full rounded-full py-3 text-[#455263] border-gray-200 hover:border-[#5BC0BE] hover:text-[#5BC0BE] transition-all duration-300"
                      >
                        Live Preview
                      </Button>
                    </a>
                  ) : (
                    <Link href={`/marketplace`} className="block mb-6">
                      <Button
                        variant="outline"
                        className="w-full rounded-full py-3 text-[#455263] border-gray-200 hover:border-[#5BC0BE] hover:text-[#5BC0BE] transition-all duration-300"
                      >
                        Browse Templates
                      </Button>
                    </Link>
                  )}

                  {/* Benefits */}
                  <ul className="space-y-3 mb-6">
                    {[
                      'Fully editable in X.IDE',
                      'Mobile-responsive by default',
                      'Lean.x payment pre-wired',
                      'Free updates included',
                      'Commercial use licence',
                    ].map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-3 text-sm text-gray-600"
                      >
                        <span className="text-[#5FC7CD] font-bold">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  {/* Info note */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
                    All templates include the full X.IDE source. Subscription
                    plan includes access to all 70+ templates at RM 59/month.{' '}
                    <Link href="/pricing" className="text-[#5BC0BE] underline">
                      Compare plans →
                    </Link>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Share / back */}
              <RevealOnScroll delay={200}>
                <div className="mt-4 text-center">
                  <Link
                    href="/marketplace"
                    className="text-sm text-gray-400 hover:text-[#5BC0BE] transition-colors"
                  >
                    ← Browse all templates
                  </Link>
                </div>
              </RevealOnScroll>
            </aside>
          </div>
        </div>
      </div>

      {/* Related templates */}
      {related.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <RevealOnScroll>
              <h2 className="text-2xl font-bold text-[#455263] mb-10 text-center">
                You might also like
              </h2>
            </RevealOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((t) => (
                <RevealOnScroll key={t.slug} delay={200}>
                  <Link href={`/marketplace/${t.slug}`}>
                    <article className="group bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow hover:-translate-y-1 duration-300 h-full flex flex-col">
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-[#5BC0BE]/10 group-hover:to-[#7C74EA]/10 transition-all flex items-center justify-center text-xs text-gray-300">
                        Preview
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[#5FC7CD] font-semibold">
                            {t.category}
                          </span>
                          <span className="text-xs font-bold text-[#455263]">
                            ${t.price}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#5BC0BE] transition-colors mb-2">
                          {t.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {t.description.slice(0, 80)}…
                        </p>
                      </div>
                    </article>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] py-20 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <RevealOnScroll>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to launch?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Open this template in X.IDE, customise it in minutes, and publish
              to your own domain.
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
