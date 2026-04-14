'use client';

import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { Card } from '@/components/ui/card';
import { Play, Clock, ArrowLeft } from 'lucide-react';

export default function ClaimPremiumPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />
      <main>
        <section className="bg-gray-50 pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Academy
            </Link>

            <RevealOnScroll>
              <Card className="overflow-hidden border-0 shadow-xl bg-white">
                <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    poster=""
                  >
                    <source
                      src="https://kppnhfjwkzdrmoqwdhbi.supabase.co/storage/v1/object/public/assets/academy/Tutorial2.mp4"
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
                      <Clock className="w-3.5 h-3.5" />1 min
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    How to Claim Your Premium Account for FREE
                  </h1>
                  <p className="text-gray-500 leading-relaxed text-lg">
                    Learn how to upgrade your Nexova account to Premium at no
                    cost — unlock all builder elements, custom domains, and
                    advanced features for free.
                  </p>
                </div>
              </Card>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
