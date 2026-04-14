'use client';

import { Play } from 'lucide-react';

export function VideoDemo() {
  return (
    <section className="py-20 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            See it in action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch how easy it is to build a page from scratch.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 aspect-video flex items-center justify-center group cursor-pointer hover:shadow-2xl transition-shadow">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
            <button className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-white/90 hover:bg-white group-hover:scale-110 transition-all shadow-xl">
              <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
