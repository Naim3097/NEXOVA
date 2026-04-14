'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, Check, ArrowLeft } from 'lucide-react';
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
import { ContactForm } from '@/components/landing/ContactForm';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import type { ServiceData } from '@/lib/services-data';

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

export default function ServicePageClient({
  service,
}: {
  service: ServiceData;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const Icon = iconMap[service.icon] || Globe;

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/services"
            className="hover:text-gray-900 transition-colors"
          >
            Services
          </Link>
          <span>/</span>
          <span className="text-gray-900">{service.title}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="pt-12 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: service.gradient }}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {service.headline}
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              {service.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full px-8 h-12 text-base font-medium shadow-lg border-0"
                >
                  Get a Free Consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#process">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 h-12 text-base font-medium"
                >
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10">
              {service.problem.heading}
            </h2>
            <div className="space-y-4">
              {service.problem.points.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-sm font-semibold">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              {service.solution.heading}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              {service.solution.description}
            </p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-500">
              A clear process from start to results.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {service.process.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 h-full">
                  <span
                    className="text-4xl font-bold text-transparent bg-clip-text block mb-4"
                    style={{ backgroundImage: service.gradient }}
                  >
                    {step.step}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {service.faq.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="font-semibold text-gray-900 pr-4">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 -mt-2">
                    <p className="text-gray-500 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Ready to get started?
              </h2>
              <p className="text-lg text-gray-500 mb-6">
                No commitment, no hard sell. Just honest advice on what your
                business needs.
              </p>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-full px-8 h-14 text-lg text-gray-600 hover:text-gray-900 group"
                >
                  <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  View All Services
                </Button>
              </Link>
            </div>
            <ContactForm service={service.title} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>&copy; 2026 Nexova. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
              <Link href="/services" className="hover:text-gray-900">
                Services
              </Link>
              <Link href="/pricing" className="hover:text-gray-900">
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
