'use client';

import Image from 'next/image';

const features = [
  {
    title: 'Lean.x Seamless Payment',
    description: 'Start selling instantly with accelerated settlements. Our integrated system handles industry payout times, keeping your cashflow moving as fast as your sales.',
  },
  {
    title: 'Digital Marketing Analytics',
    description: 'It goes beyond page views. Our base analytics learn from your customers browse. Track conversions efficiently without complex setup.',
  },
  {
    title: 'Built-in Templates',
    description: 'Don\'t start from blank. Use our library of industry-proven layouts designed for specific conversion goals.',
  },
  {
    title: 'Dynamic Style Editor',
    description: 'Your brand, your rules. Change fonts, palettes, and layouts globally with our Drag and Drop style editor. Every asset feels like it came from a pro designer.',
  },
  {
    title: 'Easy Import/Export',
    description: 'Move freely. Easily export templates from other platforms or export your work to take elsewhere. No lock-in.',
  },
  {
    title: 'Seamless Live Production',
    description: 'Push to production with a single click. Your site is live, optimized, and ready to accept traffic instantly.',
  },
];

export function GridFeatures() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background Image - Reusing Section 2's background */}
      <div className="absolute inset-0 z-0 bg-[#2D2B4A]">
        <Image
          src="/assets/landing/second-section-bg.png"
          alt="Background"
          fill
          className="object-cover transform rotate-180" // Rotate for variety? Or keep same. Let's start normal.
          priority={false}
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/15 transition-colors duration-300"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
