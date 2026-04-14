"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function GridHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-20 overflow-hidden bg-black">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#3b82f61a,transparent)]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              New Features Available
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Build faster with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Intelligent Blocks
              </span>
            </h1>
            
            <p className="text-xl text-zinc-400 mb-8 max-w-lg leading-relaxed">
              Create stunning websites in minutes with our drag-and-drop builder. 
              Powered by AI, designed for performance.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2">
                Start Building <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-4 bg-white/5 text-white font-bold rounded-lg hover:bg-white/10 transition-colors border border-white/10 flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" /> Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-12">
                <div className="h-40 bg-zinc-900 rounded-2xl border border-white/10 p-6 hover:border-blue-500/50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="w-5 h-5 bg-blue-500 rounded-full" />
                  </div>
                  <div className="h-2 w-20 bg-zinc-800 rounded mb-2" />
                  <div className="h-2 w-12 bg-zinc-800 rounded" />
                </div>
                <div className="h-56 bg-zinc-900 rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-colors group">
                   <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg mb-4 group-hover:opacity-80 transition-opacity" />
                   <div className="h-2 w-24 bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-56 bg-zinc-900 rounded-2xl border border-white/10 p-6 hover:border-pink-500/50 transition-colors group">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-zinc-800 rounded" />
                    <div className="h-2 w-3/4 bg-zinc-800 rounded" />
                    <div className="h-2 w-1/2 bg-zinc-800 rounded" />
                  </div>
                </div>
                <div className="h-40 bg-zinc-900 rounded-2xl border border-white/10 p-6 hover:border-indigo-500/50 transition-colors flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">99%</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Performance</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
