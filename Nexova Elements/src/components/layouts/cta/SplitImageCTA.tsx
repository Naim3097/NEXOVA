"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function SplitImageCTA() {
  return (
    <section className="bg-zinc-950 border-y border-white/10">
      <div className="grid lg:grid-cols-2">
        <div className="p-12 lg:p-24 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Transform your digital presence today.
            </h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              Don't let outdated design hold you back. Upgrade to a modern, high-performance website that converts.
            </p>
            <button className="inline-flex items-center gap-2 text-white font-bold border-b border-white pb-1 hover:text-blue-400 hover:border-blue-400 transition-colors">
              Start your free trial <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
        <div className="relative h-[400px] lg:h-auto bg-zinc-900">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop" 
            alt="Team working" 
            className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay" />
        </div>
      </div>
    </section>
  );
}
