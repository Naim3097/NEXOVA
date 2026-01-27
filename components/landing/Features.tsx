'use client';

import Image from 'next/image';

const features = [
  {
    image: '/assets/landing/layer-1.png',
    title: 'Build',
  },
  {
    image: '/assets/landing/layer-2.png',
    title: 'Edit',
  },
  {
    image: '/assets/landing/layer-3.png',
    title: 'Sell',
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA]">
              nexova unifies the
              <br />
              entire lifecycle
            </span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We combined professional grade design tools with immediate business infrastructure. It's not just a page builder; it's a revenue engine with faster settlements and zero bloat.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center group relative">
                {/* Connector Line (Fixed Position relative to grid cell, behind the box) */}
                {index < features.length - 1 && (
                    <div className="hidden md:block absolute top-[calc(50%-1.5rem)] -right-[calc(3rem/2+2px+1.5rem)] w-12 h-[3px] rounded-full bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] z-0" 
                         style={{ right: '-3rem', top: 'calc(50% - 2rem)' }} // Manually adjusting to vertically center with the box, ignoring the text label
                    ></div>
                  )}

                {/* Gradient Border Box */}
                <div className="relative p-[2px] rounded-3xl bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] w-full aspect-square mb-6 transition-transform duration-300 group-hover:-translate-y-2 z-10 bg-white">
                  <div className="bg-white rounded-[22px] w-full h-full flex items-center justify-center p-8 relative overflow-hidden"> 
                     <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
                        <Image 
                          src={feature.image} 
                          alt={feature.title}
                          fill
                          className="object-contain"
                        />
                     </div>
                  </div>
                </div>

                {/* Label */}
                <h3 className="text-gray-400 font-medium text-lg tracking-wide">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
