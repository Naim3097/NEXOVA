'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/* ─────────────────────────────────────────────────────── */
/*  Data                                                   */
/* ─────────────────────────────────────────────────────── */

export const CATEGORIES = [
  'All',
  'SaaS',
  'E-commerce',
  'Agency',
  'Portfolio',
  'Restaurant',
  'Events',
  'Education',
  'Healthcare',
  'Finance',
  'Travel',
  'Fashion',
  'Real Estate',
  'Barber',
];

export type Template = {
  slug: string;
  title: string;
  category: string;
  price: number;
  tags: string[];
  description: string;
  demoUrl?: string;
};

export const TEMPLATES: Template[] = [
  {
    slug: 'apexcare-dental',
    title: 'ApexCare Dental',
    category: 'Healthcare',
    price: 49,
    tags: ['Services', 'Appointment', 'Team', 'Blog'],
    description:
      'Modern dental clinic landing page with appointment booking, services list, team showcase, testimonials, and blog.',
    demoUrl: 'https://nexova-template-pokjak.vercel.app/templates/apexcare-dental',
  },
  {
    slug: 'timeshop-smartwatch',
    title: 'Timeshop Smartwatch',
    category: 'E-commerce',
    price: 49,
    tags: ['Products', 'Specs', 'Video', 'Testimonials'],
    description:
      'Sleek e-commerce landing page for digital smartwatches. Includes product grid, feature showcase, limited-time offers, and video demo.',
    demoUrl: 'https://nexova-template-pokjak.vercel.app/templates/timeshop-smartwatch',
  },
  {
    slug: 'ai-real-estate',
    title: 'AI Real Estate',
    category: 'Real Estate',
    price: 59,
    tags: ['Property Listings', 'Analytics', 'Team', 'Blog'],
    description:
      'Premium AI-driven real estate platform with property listings, analytics, team showcase, blog insights, and contact form.',
    demoUrl: 'https://nexova-template-pokjak.vercel.app/templates/ai-real-estate',
  },
  {
    slug: 'classic-barber',
    title: 'Classic Barber',
    category: 'Barber',
    price: 49,
    tags: ['Services', 'Gallery', 'Booking', 'Team'],
    description:
      'Premium barbershop template with dark luxurious aesthetic. Features services, team showcase, gallery, reviews, and booking form.',
    demoUrl: 'https://nexova-template-pokjak.vercel.app/templates/classic-barber',
  },
  {
    slug: 'saas-launch',
    title: 'SaaS Launch',
    category: 'SaaS',
    price: 49,
    tags: ['Hero', 'Pricing', 'FAQ'],
    description:
      'Clean, conversion-focused SaaS landing page with pricing table and feature grid.',
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/saas_bold_0453596c/index.html',
  },
  {
    slug: 'agency-pro',
    title: 'Agency Pro',
    category: 'Agency',
    price: 59,
    tags: ['Portfolio', 'Case Studies', 'Contact'],
    description:
      'Full-service agency site with work showcase and team section.',
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/agency_creative_f9a2b3c4/index.html',
  },
  {
    slug: 'store-minimal',
    title: 'Store Minimal',
    category: 'E-commerce',
    price: 49,
    tags: ['Products', 'Cart', 'Checkout'],
    description: 'Minimal, modern e-commerce storefront built for conversion.',
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/ecommerce_bold_22d74bb8/index.html',
  },
  {
    slug: 'portfolio-grid',
    title: 'Portfolio Grid',
    category: 'Portfolio',
    price: 29,
    tags: ['Grid', 'About', 'Contact'],
    description: 'Elegant masonry grid portfolio for creators and designers.',
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/portfolio_minimal_22d83524/index.html',
  },
  {
    slug: 'restaurant-bistro',
    title: 'Bistro',
    category: 'Restaurant',
    price: 39,
    tags: ['Menu', 'Reservations', 'Gallery'],
    description: 'Warm, appetising restaurant site with menu and booking form.',
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/restaurant_creative_418334b4/index.html',
  },
  {
    slug: 'event-summit',
    title: 'Summit',
    category: 'Events',
    price: 39,
    tags: ['Schedule', 'Speakers', 'Tickets'],
    description: 'Professional event / conference page with speaker lineup.',
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/blog_tech_7d8e9f0a/index.html',
  },
  {
    slug: 'education-academy',
    title: 'Academy',
    category: 'Education',
    price: 49,
    tags: ['Courses', 'Instructors', 'Pricing'],
    description: 'Online learning platform landing page with course cards.',
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/portfolio_creative_1c8e5434/index.html',
  },
  {
    slug: 'health-clinic',
    title: 'Clinic',
    category: 'Healthcare',
    price: 49,
    tags: ['Services', 'Appointment', 'Team'],
    description:
      'Trustworthy healthcare / clinic site with booking integration.',
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/medical_elegant_085c1e61/index.html',
  },
  {
    slug: 'finance-advisor',
    title: 'Wealth Advisor',
    category: 'Finance',
    price: 59,
    tags: ['Services', 'Trust', 'Contact'],
    description:
      'Premium financial advisor page radiating trust and authority.',
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/legal_professional_c7c6d8a0/index.html',
  },
  {
    slug: 'travel-explore',
    title: 'Explore',
    category: 'Travel',
    price: 39,
    tags: ['Destinations', 'Gallery', 'Booking'],
    description: 'Cinematic travel agency site with full-bleed imagery.',
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/realestate_professional_138d1185/index.html',
  },
  {
    slug: 'fashion-brand',
    title: 'Fashion Brand',
    category: 'Fashion',
    price: 59,
    tags: ['Lookbook', 'Shop', 'Minimal'],
    description:
      'Editorial fashion brand with high-impact visuals and shop grid.',
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/ecommerce_bold_3b6e76e1/index.html',
  },
  {
    slug: 'startup-mvp',
    title: 'Startup MVP',
    category: 'SaaS',
    price: 29,
    tags: ['Hero', 'Features', 'CTA'],
    description: 'Rapid-launch startup landing page — zero fluff, all signal.',
    demoUrl: 'https://axtratemplates.vercel.app/built_templates/portfolio_bold_1e9e671a/index.html',
  },
];

/* ─────────────────────────────────────────────────────── */
/*  Component                                              */
/* ─────────────────────────────────────────────────────── */

export function MarketplaceGrid() {
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === active);

  return (
    <>
      {/* Category filter — sticky under navbar */}
      <section className="bg-white border-b border-gray-100 sticky top-20 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-3 overflow-x-auto">
          <div
            className="flex gap-2 min-w-max"
            role="tablist"
            aria-label="Filter templates by category"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={active === cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors focus:outline-none focus:ring-2 focus:ring-[#5BC0BE] ${
                  active === cat
                    ? 'bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] text-white border-transparent shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-[#5BC0BE] hover:text-[#5BC0BE]'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span
                    className={`ml-1 text-xs ${active === cat ? 'text-white/75' : 'text-gray-400'}`}
                  >
                    {TEMPLATES.filter((t) => t.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Template grid */}
      <section className="bg-gray-50 py-16" aria-label="Template gallery">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Result count */}
          <p className="text-sm text-gray-400 mb-6">
            {filtered.length} template{filtered.length !== 1 ? 's' : ''}
            {active !== 'All' && (
              <>
                {' '}
                in <span className="font-medium text-[#5FC7CD]">{active}</span>
              </>
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.length === 0 ? (
              <div className="col-span-3 text-center py-20 text-gray-400">
                <p className="text-lg font-medium mb-2">
                  No templates in this category yet
                </p>
                <p className="text-sm">
                  More templates are being added weekly.{' '}
                  <button
                    onClick={() => setActive('All')}
                    className="text-[#5BC0BE] underline"
                  >
                    View all templates
                  </button>
                </p>
              </div>
            ) : (
              filtered.map((tpl) => (
                <article
                  key={tpl.slug}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Template thumbnail */}
                  <Link
                    href={`/marketplace/${tpl.slug}`}
                    tabIndex={-1}
                    aria-hidden
                  >
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/assets/templates/${tpl.slug}.jpg`}
                        alt={`${tpl.title} template preview`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="inline-block text-xs font-semibold text-[#5FC7CD] uppercase tracking-wide mb-1">
                          {tpl.category}
                        </span>
                        <h2 className="text-base font-semibold text-gray-900 group-hover:text-[#5BC0BE] transition-colors">
                          {tpl.title}
                        </h2>
                      </div>
                      <span className="text-base font-bold text-gray-900 ml-4 flex-shrink-0">
                        ${tpl.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                      {tpl.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {tpl.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Link href="/signup" className="flex-1">
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full border-0 text-xs"
                        >
                          Use Template
                        </Button>
                      </Link>
                      {tpl.demoUrl && (
                        <a href={tpl.demoUrl} target="_blank" rel="noopener noreferrer">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full border-gray-200 text-gray-600 hover:border-[#5BC0BE] hover:text-[#5BC0BE] text-xs transition-colors"
                          >
                            Live Preview
                          </Button>
                        </a>
                      )}
                      <Link href={`/marketplace/${tpl.slug}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full border-gray-200 text-gray-600 hover:border-[#5BC0BE] hover:text-[#5BC0BE] text-xs transition-colors"
                        >
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
