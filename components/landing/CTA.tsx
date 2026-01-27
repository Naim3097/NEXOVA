'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="relative py-24 sm:py-32 bg-white overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5BC0BE]/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#7C74EA]/10 rounded-full blur-[80px] translate-y-12" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
          One platform to
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA]">
            build, sell, and scale.
          </span>
        </h2>

        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join the new generation of creators who moved from stitching tools to a single, powerful IDE.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full px-10 h-14 text-lg font-semibold shadow-lg shadow-[#5BC0BE]/20 transition-all hover:scale-105">
              Start Building Now
            </Button>
          </Link>
          
          <Link href="/builder">
            <Button size="lg" variant="ghost" className="h-14 px-8 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-lg group">
              View Demo
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          No credit card required for free trial
        </p>
      </div>
    </section>
  );
}
