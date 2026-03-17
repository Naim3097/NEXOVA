'use client';

import Link from 'next/link';

const DEMOS = [
  {
    id: 'gradient',
    title: 'Ambient Gradient',
    category: 'Background',
    description:
      'Slow-shifting gradient creates immersive depth without performance cost.',
    css: 'animate-gradient',
    preview: (
      <div className="w-full h-full bg-gradient-to-br from-[#5BC0BE] via-[#7C74EA] to-[#455263] animate-[bgshift_6s_ease-in-out_infinite_alternate] rounded-xl" />
    ),
  },
  {
    id: 'blob',
    title: 'Morphing Blob',
    category: 'Vector',
    description:
      'Organic shape transitions driven by CSS keyframes — no JavaScript required.',
    preview: (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-28 h-28 bg-gradient-to-br from-[#5BC0BE] to-[#7C74EA] animate-[blob_7s_ease-in-out_infinite] opacity-80" />
      </div>
    ),
  },
  {
    id: 'typewriter',
    title: 'Typewriter Effect',
    category: 'Typography',
    description:
      'Character-by-character text reveal with blinking cursor — pure CSS.',
    preview: (
      <div className="w-full h-full flex items-center justify-center px-4">
        <span className="text-white font-mono text-lg font-bold overflow-hidden whitespace-nowrap border-r-2 border-[#5FC7CD] animate-[typing_3.5s_steps(20,end)_infinite,blink_0.75s_step-end_infinite]">
          Build. Launch. Grow.
        </span>
      </div>
    ),
  },
  {
    id: 'float',
    title: 'Floating Card',
    category: 'Interaction',
    description:
      'Smooth Y-axis float creates a sense of lightness and motion for hero assets.',
    preview: (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-32 h-20 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl animate-[float_3s_ease-in-out_infinite] flex items-center justify-center">
          <div className="space-y-2 px-4 w-full">
            <div className="h-2 bg-white/40 rounded-full w-3/4" />
            <div className="h-2 bg-white/25 rounded-full w-full" />
            <div className="h-2 bg-white/25 rounded-full w-1/2" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'progress',
    title: 'Liquid Progress',
    category: 'UI Elements',
    description:
      'Smooth progress bars with animated fill gradients for dashboards and forms.',
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-6">
        {[75, 50, 90].map((pct, i) => (
          <div
            key={i}
            className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] rounded-full animate-[grow_2s_ease-out_forwards]"
              style={{ width: `${pct}%`, animationDelay: `${i * 0.3}s` }}
            />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'pulse',
    title: 'Glow Pulse Button',
    category: 'Micro-interactions',
    description:
      'Radial glow breathes in and out — draws the eye to primary CTAs.',
    preview: (
      <div className="w-full h-full flex items-center justify-center">
        <button className="px-6 py-3 bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] rounded-full text-white text-sm font-semibold relative">
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] animate-[glow_2s_ease-in-out_infinite] blur-md opacity-60" />
          <span className="relative">Get Started →</span>
        </button>
      </div>
    ),
  },
];

export function AnimationShowcase() {
  return (
    <>
      {/* Inject CSS keyframes */}
      <style>{`
        @keyframes bgshift {
          0%   { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25%       { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50%       { border-radius: 50% 60% 30% 60% / 30% 40% 70% 50%; }
          75%       { border-radius: 70% 30% 50% 50% / 40% 70% 30% 50%; }
        }
        @keyframes typing {
          0%, 85% { width: 0; }
          20%, 70% { width: 17ch; }
        }
        @keyframes blink {
          50% { border-color: transparent; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes grow {
          from { width: 0%; }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEMOS.map((demo) => (
          <div
            key={demo.id}
            className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Dark preview box */}
            <div className="aspect-video bg-gradient-to-br from-[#455263] to-[#2D2B4A] relative overflow-hidden">
              {demo.preview}
            </div>

            {/* Info */}
            <div className="p-5">
              <span className="text-xs font-semibold text-[#5FC7CD] uppercase tracking-widest">
                {demo.category}
              </span>
              <h3 className="text-base font-semibold text-gray-900 mt-1 mb-1 group-hover:text-[#5BC0BE] transition-colors">
                {demo.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {demo.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <p className="text-sm text-gray-500 mb-4">
          100+ more animations available inside X.IDE — live, interactive, and
          copy-ready.
        </p>
        <Link href="/builder">
          <button className="px-8 py-3 bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full text-sm font-semibold shadow-md transition-all">
            Open full library in X.IDE →
          </button>
        </Link>
      </div>
    </>
  );
}
