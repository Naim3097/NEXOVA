"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function AlternatingFeatures() {
  return (
    <section className="py-24 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Feature 1 */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl font-bold mb-6">Streamline your workflow</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              Stop wasting time on repetitive tasks. Our automation tools handle the heavy lifting so you can focus on what matters most - building great products.
            </p>
            <ul className="space-y-4">
              {["Automated deployment pipelines", "Real-time collaboration", "Integrated analytics dashboard"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="aspect-video bg-zinc-900 rounded-2xl border border-white/10 p-2">
              <div className="w-full h-full bg-zinc-800 rounded-xl overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                 {/* Abstract UI representation */}
                 <div className="absolute top-8 left-8 right-8 h-4 bg-zinc-700 rounded" />
                 <div className="absolute top-16 left-8 w-1/3 h-32 bg-zinc-700 rounded" />
                 <div className="absolute top-16 right-8 w-1/2 h-32 bg-zinc-700 rounded" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl font-bold mb-6">Data-driven insights</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              Make informed decisions with our comprehensive analytics suite. Track user behavior, performance metrics, and conversion rates in real-time.
            </p>
            <ul className="space-y-4">
              {["Customizable reporting", "User journey tracking", "A/B testing capabilities"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="aspect-video bg-zinc-900 rounded-2xl border border-white/10 p-2">
              <div className="w-full h-full bg-zinc-800 rounded-xl overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 to-pink-500/10" />
                 {/* Abstract Chart representation */}
                 <div className="absolute bottom-8 left-8 w-8 h-20 bg-purple-500/50 rounded-t" />
                 <div className="absolute bottom-8 left-20 w-8 h-32 bg-purple-500/50 rounded-t" />
                 <div className="absolute bottom-8 left-32 w-8 h-16 bg-purple-500/50 rounded-t" />
                 <div className="absolute bottom-8 left-44 w-8 h-40 bg-purple-500/50 rounded-t" />
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
