'use client';

import Image from 'next/image';

export function Problem() {
  return (
    <section className="relative pt-[24vw] md:pt-[16vw] lg:pt-[10vw] pb-[24vw] md:pb-[16vw] lg:pb-[10vw] overflow-hidden z-0 flex flex-col justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-[#2D2B4A]"> {/* Fallback color */}
        <Image
          src="/assets/landing/second-section-bg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay to ensure text readability if needed, though image likely handles it */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8">
          <span className="text-white block mb-2">Building a brand is hard enough.</span>
          <span className="text-[#FBBF24]">Your tools shouldn't make it harder.</span>
        </h2>
        
        <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
          You're likely paying for a builder, an analytics tool, and a payment gateway—and none of them talk to each other. You waste hours fighting with clunky design limitations and days waiting for funds to clear.
        </p>
      </div>
    </section>
  );
}
