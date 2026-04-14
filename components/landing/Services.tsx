'use client';

import {
  Megaphone,
  BarChart3,
  Globe,
  Search,
  MapPin,
  Smartphone,
  Share2,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Share2,
    title: 'Social Media Management',
    description:
      'Content planning, scheduling, and community management across all platforms.',
    slug: 'social-media-management',
    gradient: 'linear-gradient(to right, #ec4899, #f43f5e)',
  },
  {
    icon: Settings,
    title: 'Business Operation System',
    description:
      'Streamline your workflows with custom management systems built for your business.',
    slug: 'business-management-system',
    gradient: 'linear-gradient(to right, #3b82f6, #6366f1)',
  },
  {
    icon: Megaphone,
    title: 'META Ads',
    description:
      'Facebook & Instagram advertising that targets the right Malaysian audience.',
    slug: 'meta-ads',
    gradient: 'linear-gradient(to right, #2563eb, #60a5fa)',
  },
  {
    icon: BarChart3,
    title: 'Google Ads',
    description:
      'Search, display, and video campaigns that turn clicks into paying customers.',
    slug: 'google-ads',
    gradient: 'linear-gradient(to right, #eab308, #f97316)',
  },
  {
    icon: Globe,
    title: 'Website Creation',
    description:
      'Professional websites and landing pages designed to convert visitors into revenue.',
    slug: 'website-creation',
    gradient: 'linear-gradient(to right, #5BC0BE, #7C74EA)',
  },
  {
    icon: Search,
    title: 'Google SEO',
    description:
      'Rank higher on Google and drive organic traffic that compounds over time.',
    slug: 'google-seo',
    gradient: 'linear-gradient(to right, #22c55e, #10b981)',
  },
  {
    icon: MapPin,
    title: 'Google My Business',
    description:
      'Get found locally. We set up and optimise your Google Business profile.',
    slug: 'google-my-business',
    gradient: 'linear-gradient(to right, #ef4444, #f97316)',
  },
  {
    icon: Smartphone,
    title: 'App Development',
    description:
      'Custom mobile and web applications tailored to your business needs.',
    slug: 'app-development',
    gradient: 'linear-gradient(to right, #a855f7, #8b5cf6)',
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-[#F8F9FB]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#5BC0BE] mb-3">
            Beyond the builder
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Digital services to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA]">
              grow your business
            </span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Need help with ads, SEO, or operations? Our team handles the heavy
            lifting so you can focus on your business.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: service.gradient }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {service.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500">
            Not sure what you need?{' '}
            <Link
              href="/services#contact"
              className="text-[#5BC0BE] font-medium hover:underline"
            >
              Talk to us — it&apos;s free
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
