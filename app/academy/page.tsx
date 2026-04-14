'use client';

import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Clock, Lock, ArrowRight, BookOpen } from 'lucide-react';

export default function AcademyPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />
      <main>
        {/* Hero Section */}
        <RevealOnScroll className="relative z-20">
          <section className="relative bg-white pt-32 pb-20 overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5BC0BE]/8 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7C74EA]/8 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5BC0BE]/10 to-[#7C74EA]/10 rounded-full px-4 py-1.5 mb-6">
                <BookOpen className="w-4 h-4 text-[#7C74EA]" />
                <span className="text-sm font-medium text-gray-700">
                  Learning Hub
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-black mb-6 leading-tight">
                Nexova{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA]">
                  Academy
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
                Master the platform with step-by-step video tutorials. Learn how
                to build, customize, and publish stunning product pages in
                minutes.
              </p>
            </div>
          </section>
        </RevealOnScroll>

        {/* Featured Video Section */}
        <RevealOnScroll delay={200}>
          <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
              <div className="mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  Getting Started
                </h2>
                <p className="text-gray-500 text-lg">
                  Everything you need to create your first product page
                </p>
              </div>

              <Card className="overflow-hidden border-0 shadow-xl bg-white">
                <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 group">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    poster=""
                  >
                    <source
                      src="https://kppnhfjwkzdrmoqwdhbi.supabase.co/storage/v1/object/public/assets/academy/Tutorial1.mp4"
                      type="video/mp4"
                    />
                    Your browser does not support the video element.
                  </video>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-[#5BC0BE]/10 text-[#5BC0BE] rounded-full px-3 py-1 text-sm font-medium">
                      <Play className="w-3.5 h-3.5" />
                      Video Tutorial
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-gray-400 text-sm">
                      <Clock className="w-3.5 h-3.5" />5 min
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Build Your First Product Page
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    A complete walkthrough of the Nexova builder — from choosing
                    elements, customizing styles, adding products, to publishing
                    your page live with a custom subdomain.
                  </p>
                </div>
              </Card>
            </div>
          </section>
        </RevealOnScroll>

        {/* More Tutorials */}
        <RevealOnScroll delay={200}>
          <section className="bg-white py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
              <div className="mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  More Tutorials
                </h2>
                <p className="text-gray-500 text-lg">
                  Explore more guides to get the most out of Nexova
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/academy/claim-premium">
                  <Card className="overflow-hidden border border-gray-100 bg-white hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="relative aspect-video bg-gradient-to-br from-[#5BC0BE]/20 to-[#7C74EA]/20 flex items-center justify-center">
                      <Play className="w-10 h-10 text-[#5BC0BE] group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />1 min
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Claim Premium for FREE
                      </h3>
                      <p className="text-sm text-gray-500">
                        Upgrade your account to Premium at no cost and unlock
                        all features.
                      </p>
                    </div>
                  </Card>
                </Link>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        {/* Coming Soon Section */}
        <RevealOnScroll delay={200}>
          <section className="bg-white py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
              <div className="flex items-center gap-3 mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  More Tutorials
                </h2>
                <span className="inline-flex items-center bg-[#7C74EA]/10 text-[#7C74EA] rounded-full px-3 py-1 text-sm font-medium">
                  Coming Soon
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Payment Integration',
                    description:
                      'Set up LeanX payments and start accepting orders.',
                    duration: '8 min',
                  },
                  {
                    title: 'Custom Domains',
                    description:
                      'Connect your own domain for a professional storefront.',
                    duration: '4 min',
                  },
                  {
                    title: 'Advanced Styling',
                    description:
                      'Master gradients, backgrounds, and responsive layouts.',
                    duration: '6 min',
                  },
                ].map((course) => (
                  <Card
                    key={course.title}
                    className="overflow-hidden border border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed"
                  >
                    <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-gray-300" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-700 mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {course.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </RevealOnScroll>

        {/* CTA Section */}
        <RevealOnScroll delay={200}>
          <section className="relative py-24 bg-white overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5BC0BE]/8 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Ready to start building?
              </h2>
              <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
                Put what you&apos;ve learned into action. Create your first
                product page in minutes — no coding required.
              </p>
              <Link href="/builder">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full px-10 h-14 text-lg font-semibold shadow-lg shadow-[#5BC0BE]/20 transition-all hover:scale-105 group"
                >
                  Start Building Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </section>
        </RevealOnScroll>
      </main>
      <Footer />
    </div>
  );
}
