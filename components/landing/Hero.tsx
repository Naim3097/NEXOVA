'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative z-20 bg-white pt-8 pb-[30vw] md:pb-[20vw] lg:pb-[15vw]">
      {/* Background Gradients/Decorations could go here */}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-4xl mx-auto mb-2">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-black mb-4 leading-tight">
            Build <span className="text-[#4FD1C5]">•</span> Edit <span className="text-[#4FD1C5]">•</span> Sell
            <br />
            All in one flow
          </h1>

          <p className="text-lg text-gray-500 mb-6 max-w-2xl mx-auto leading-relaxed">
            Stop stitching tools together. The only professional builder with native payments and live inventory baked directly into the design process.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/builder">
              <Button size="lg" className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full px-8 h-12 text-base font-medium shadow-lg border-0">
                Create Landing Page Now
              </Button>
            </Link>
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white rounded-full px-8 h-12 text-base font-medium">
              View Demo
            </Button>
          </div>
        </div>

        {/* Hero Assets */}
        <div className="relative max-w-6xl mx-auto mt-0 z-20">
          {/* Decorative Dotted Lines */}
          <div className="absolute inset-0 -z-10 pointer-events-none hidden md:block scale-125 -top-20">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
               {/* Left Curve Layer 1 */}
               <path d="M150 400 Q 100 200, 250 100" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" fill="none"/>
               {/* Left Curve Layer 2 (Offset) */}
               <path d="M130 400 Q 80 200, 230 100" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.6" />
               
               {/* Right Curve Layer 1 */}
               <path d="M850 400 Q 900 200, 750 100" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" fill="none"/>
               {/* Right Curve Layer 2 (Offset) */}
               <path d="M870 400 Q 920 200, 770 100" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.6" />
            </svg>
          </div>

          <div className="relative z-10 -mb-[50vw] md:-mb-[35vw] lg:-mb-[30vw]">
            <Image
              src="/assets/landing/hero-section-asset.png"
              alt="Nexova Builder Interface"
              width={1200}
              height={800}
              quality={100}
              priority
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>

          {/* Floating Element 1 - Left */}
          <div className="absolute top-0 -left-4 md:left-4 lg:-left-8 animate-float-slow hidden md:block z-30">
            <div className="p-2">
              <Image
                src="/assets/landing/hero-element-1.png"
                alt="Analytics Widget"
                width={160}
                height={160}
                className="w-[120px] md:w-[160px]"
              />
            </div>
          </div>

          {/* Floating Element 2 - Right */}
          <div className="absolute top-12 -right-4 md:right-4 lg:-right-8 animate-float hidden md:block z-30">
             {/* Removed background box for Element 2 as requested */}
            <Image
              src="/assets/landing/hero-element-2.png"
              alt="Interaction Widget"
              width={160}
              height={160}
              className="w-[120px] md:w-[160px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
