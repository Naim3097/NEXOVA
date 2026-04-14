"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const features = [
  {
    title: "Collaborative Editing",
    description: "Work together in real-time with your team. See changes as they happen and comment directly on the design.",
    color: "bg-blue-500"
  },
  {
    title: "Version Control",
    description: "Never lose your work. Automatically save versions and restore previous states with a single click.",
    color: "bg-purple-500"
  },
  {
    title: "Asset Management",
    description: "Organize your images, videos, and fonts in a central library. Drag and drop assets directly into your project.",
    color: "bg-pink-500"
  },
  {
    title: "One-Click Publish",
    description: "Deploy your website to a global CDN in seconds. Automatic SSL, caching, and image optimization included.",
    color: "bg-orange-500"
  }
];

export default function StickyScrollFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="bg-black text-white">
      {features.map((feature, index) => (
        <FeatureSection key={index} feature={feature} index={index} total={features.length} />
      ))}
    </section>
  );
}

function FeatureSection({ feature, index, total }: { feature: any, index: number, total: number }) {
  return (
    <div className="min-h-screen flex items-center justify-center sticky top-0 px-6 py-20 border-t border-white/10 bg-black">
      <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1">
          <span className="text-sm font-mono text-zinc-500 mb-4 block">0{index + 1} / 0{total}</span>
          <h2 className="text-4xl md:text-6xl font-bold mb-8">{feature.title}</h2>
          <p className="text-xl text-zinc-400 leading-relaxed max-w-lg">
            {feature.description}
          </p>
        </div>
        <div className="order-1 lg:order-2 flex justify-center">
          <div className={`w-full aspect-square max-w-[500px] rounded-3xl ${feature.color} bg-opacity-20 flex items-center justify-center relative overflow-hidden`}>
             <div className={`absolute inset-0 ${feature.color} opacity-20 blur-3xl`} />
             <div className="relative z-10 bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 w-2/3 h-2/3">
               {/* Abstract UI */}
               <div className="w-full h-4 bg-white/10 rounded mb-4" />
               <div className="w-2/3 h-4 bg-white/10 rounded mb-8" />
               <div className="grid grid-cols-2 gap-4">
                 <div className="h-20 bg-white/5 rounded" />
                 <div className="h-20 bg-white/5 rounded" />
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
