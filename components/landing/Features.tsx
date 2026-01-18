'use client';

import { Layout, Smartphone, Code2 } from 'lucide-react';

const features = [
  {
    icon: Layout,
    title: 'Visual Editor',
    description: 'Drag, drop, and customize elements on a free-form canvas. What you see is exactly what you get.',
  },
  {
    icon: Smartphone,
    title: 'Responsive by Default',
    description: 'Pages automatically adapt to mobile, tablet, and desktop screens without extra configuration.',
  },
  {
    icon: Code2,
    title: 'Clean Code Export',
    description: 'Download your work as semantic HTML and JSON. No lock-in, host anywhere you want.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Designed for productivity
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to build and deploy, streamlined into one powerful interface.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="relative rounded-lg border border-gray-200 bg-white p-6 sm:p-8 hover:shadow-lg transition-shadow"
              >
                <div className="mb-3 sm:mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
