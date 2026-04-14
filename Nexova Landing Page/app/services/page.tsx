import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import {
  Share2,
  Settings,
  Megaphone,
  BarChart3,
  Globe,
  Search,
  MapPin,
  Smartphone,
} from 'lucide-react';
import { servicesList } from '@/lib/services-data';
import { ContactForm } from '@/components/landing/ContactForm';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Share2,
  Settings,
  Megaphone,
  BarChart3,
  Globe,
  Search,
  MapPin,
  Smartphone,
};

export const metadata: Metadata = {
  title: 'Digital Services for Malaysian Businesses',
  description:
    'From Google Ads to app development — Nexova offers full-service digital solutions for Malaysian businesses. Social media, SEO, website creation, and more.',
  keywords: [
    'digital services Malaysia',
    'digital marketing agency Malaysia',
    'Google Ads Malaysia',
    'Facebook Ads Malaysia',
    'SEO Malaysia',
    'website creation Malaysia',
    'app development Malaysia',
  ],
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Digital Services — Nexova',
    description:
      'Full-service digital solutions for Malaysian businesses. Ads, SEO, websites, apps, and more.',
    url: '/services',
  },
};

export default function ServicesPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nexova.co';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Digital Services — Nexova',
    description: 'Full-service digital solutions for Malaysian businesses.',
    url: `${appUrl}/services`,
    isPartOf: { '@id': `${appUrl}/#website` },
    provider: { '@id': `${appUrl}/#organization` },
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      {/* Hero */}
      <section className="pt-16 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Digital services to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA]">
              grow your business
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            From ads to apps — our team handles the digital heavy lifting so you
            can focus on what you do best.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((service) => {
              const Icon = iconMap[service.icon] || Globe;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: service.gradient }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed mb-4">
                    {service.subtitle}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-[#5BC0BE] group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Not sure where to start?
              </h2>
              <p className="text-lg text-gray-500">
                Tell us about your business and we&apos;ll recommend the right
                services. No commitment, just honest advice.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
