"use client";

import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Designer",
    company: "TechFlow",
    content: "The best developer experience I've ever had. Simply incredible."
  },
  {
    name: "Michael Chen",
    role: "CTO",
    company: "StartupX",
    content: "We shipped our MVP in record time thanks to these templates."
  },
  {
    name: "Jessica Williams",
    role: "Frontend Dev",
    company: "Creative Agency",
    content: "Beautifully designed and easy to customize. A game changer."
  },
  {
    name: "David Miller",
    role: "Founder",
    company: "SaaS Inc",
    content: "The ROI on this library is insane. Highly recommended."
  },
  {
    name: "Emily Davis",
    role: "Art Director",
    company: "Design Studio",
    content: "Finally, a component library that actually looks good."
  }
];

export default function TestimonialMarquee() {
  return (
    <section className="py-24 bg-black overflow-hidden">
      <div className="container mx-auto px-6 mb-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Trusted by thousands</h2>
        <p className="text-zinc-400">Join the community of developers building the future.</p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
        
        <motion.div 
          className="flex gap-6 py-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 20 
          }}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <div 
              key={i}
              className="flex-shrink-0 w-[350px] bg-zinc-900/50 border border-white/10 p-6 rounded-2xl"
            >
              <p className="text-zinc-300 mb-6 text-lg leading-relaxed">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                <div>
                  <div className="text-white font-bold text-sm">{t.name}</div>
                  <div className="text-zinc-500 text-xs">{t.role} @ {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
