'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column - Text Content */}
          <div className="flex flex-col text-left">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mb-6 w-fit">
              <span className="text-blue-600 font-semibold">NEW RELEASE V2.0</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
              Build landing pages for your business.
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              The professional drag-and-drop builder designed for performance. Create high-converting pages without writing code.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/builder">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white text-base px-8 h-12">
                  Start Building Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                View Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>✓ No credit card required</span>
              <span>✓ Free tier available</span>
            </div>
          </div>

          {/* Right Column - Builder Preview */}
          <div className="relative">
            <div className="relative rounded-lg border-2 border-gray-200 bg-white shadow-2xl overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>

              {/* Canvas Preview */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-200 mb-4">Builder Canvas</div>
                  <p className="text-gray-400 text-lg">Drag and drop components here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
