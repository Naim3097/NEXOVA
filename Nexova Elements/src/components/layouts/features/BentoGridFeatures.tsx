"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, Smartphone, Globe } from "lucide-react";

export default function BentoGridFeatures() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-4xl font-bold mb-6">Everything you need</h2>
          <p className="text-zinc-400 text-lg">
            A complete suite of tools designed to help you build better products faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
          {/* Large Item */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 bg-zinc-900 rounded-3xl p-8 border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Global Infrastructure</h3>
              <p className="text-zinc-400 max-w-md">
                Deploy your application to the edge in seconds. Our global network ensures low latency for users worldwide.
              </p>
            </div>
          </motion.div>

          {/* Tall Item */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="md:row-span-2 bg-zinc-900 rounded-3xl p-8 border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-900/20 to-transparent" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Mobile First</h3>
              <p className="text-zinc-400 mb-8">
                Responsive by default. Your application will look great on any device, from mobile phones to large desktop screens.
              </p>
              <div className="mt-auto flex justify-center">
                <div className="w-32 h-48 bg-black border border-zinc-800 rounded-2xl shadow-2xl" />
              </div>
            </div>
          </motion.div>

          {/* Small Item 1 */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-zinc-900 rounded-3xl p-8 border border-white/10 relative overflow-hidden group"
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 text-green-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-zinc-400 text-sm">
              Optimized for speed and performance out of the box.
            </p>
          </motion.div>

          {/* Small Item 2 */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-zinc-900 rounded-3xl p-8 border border-white/10 relative overflow-hidden group"
          >
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6 text-red-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure by Design</h3>
            <p className="text-zinc-400 text-sm">
              Enterprise-grade security features included.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
