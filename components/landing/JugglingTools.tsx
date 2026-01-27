'use client';

import Image from 'next/image';

const features = [
  {
    icon: '/assets/landing/icon-native-payments.png',
    title: 'Native Payments',
    description: 'Accept cards instantly. No gateways to configure.',
  },
  {
    icon: '/assets/landing/icon-inventory.png',
    title: 'Inventory Manager',
    description: 'Sync stock levels automatically as you sell.',
  },
  {
    icon: '/assets/landing/icon-dynamic-editor.png',
    title: 'Dynamic Editor',
    description: 'Edit live content without redeploying.',
  },
  {
    icon: '/assets/landing/icon-analytics.png',
    title: 'Base Analytics',
    description: 'Privacy-focused metrics built in by default.',
  },
];

export function JugglingTools() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-black">
            Stop juggling five different tools
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Forget complex integrations. We combined the builder, the payments, and the inventory into one seamless platform. It just works.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Side - Big Asset */}
          <div className="relative">
            <Image
              src="/assets/landing/juggling-asset.png"
              alt="Build Edit Sell Workflow"
              width={800}
              height={800}
              className="w-full h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          {/* Right Side - Feature List */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 relative">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
