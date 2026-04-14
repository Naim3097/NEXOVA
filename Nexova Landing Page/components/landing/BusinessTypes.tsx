'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function BusinessTypes() {
  return (
    <section id="business-types" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Floating Elements Area */}
        <div className="relative h-[400px] w-full max-w-4xl mx-auto mb-16">
          {/* Central Text */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 leading-tight">
              Perfect for any{' '}
              <span className="text-[#8B80F9]">business type</span>
            </h2>
          </div>

          {/* Floating Badges */}

          {/* Top Left - Enterprises */}
          <div className="absolute top-10 left-0 md:left-20 animate-float-slow">
            <div className="bg-white border border-gray-100 shadow-xl rounded-full px-6 py-3 flex items-center gap-2 transform -rotate-6">
              <span className="text-[#4FD1C5] font-medium">Enterprises</span>
              <div className="w-6 h-6 relative">
                <Image
                  src="/assets/landing/icon-cube-float.png"
                  alt="icon"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Top Right - Digital Products */}
          <div className="absolute top-4 right-0 md:right-32 animate-float">
            <div className="bg-white border border-gray-100 shadow-xl rounded-full px-6 py-3 flex items-center gap-2 transform rotate-3">
              <span className="text-[#8B80F9] font-medium">
                Digital Products
              </span>
              <div className="w-6 h-6 relative">
                <Image
                  src="/assets/landing/icon-cube-float.png"
                  alt="icon"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Bottom Left - Mobile Apps */}
          <div className="absolute bottom-20 left-4 md:left-10 animate-float">
            <div className="bg-white border border-gray-100 shadow-xl rounded-full px-6 py-3 flex items-center gap-2 transform rotate-6">
              <div className="w-6 h-6 relative">
                <Image
                  src="/assets/landing/icon-cube-float.png"
                  alt="icon"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[#8B80F9] font-medium">Mobile Apps</span>
            </div>
          </div>

          {/* Bottom Right - SaaS */}
          <div className="absolute bottom-10 right-4 md:right-40 animate-float-slow">
            <div className="bg-white border border-gray-100 shadow-xl rounded-full px-6 py-3 flex items-center gap-2 transform -rotate-3">
              <div className="w-6 h-6 relative">
                <Image
                  src="/assets/landing/icon-cube-float.png"
                  alt="icon"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[#4FD1C5] font-medium">SaaS</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-[#5BC0BE]/5 to-[#7C74EA]/5 blurred-3xl -z-10" />

          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Manage Inventory Effortlessly
          </h3>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            You rest. X.IDE doesn't. It keeps your product data synced and
            ready. So you can launch new product pages in the morning just
            before lunch.
          </p>

          <Link href="/signup">
            <Button className="w-full sm:w-auto h-14 px-8 rounded-full bg-gradient-to-r from-[#5bc0becc] to-[#7c74eacc] hover:opacity-90 text-white text-lg font-medium shadow-lg hover:shadow-xl transition-all">
              Manage 100+ Products with Zero Errors
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
