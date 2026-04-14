"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="py-20 px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 mb-6 tracking-tight">
          AXTRA DESIGN
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
          A curated collection of high-end website animation examples and effects for inspiration.
        </p>
        
        <div className="flex justify-center gap-4">
          <a 
            href="/elementor-widgets" 
            className="px-6 py-3 rounded-full bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors border border-zinc-700"
          >
            Elementor Elements
          </a>
          <a 
            href="/layouts" 
            className="px-6 py-3 rounded-full bg-blue-600/10 text-blue-400 font-medium hover:bg-blue-600/20 transition-colors border border-blue-600/20"
          >
            Axtra Codes
          </a>
        </div>
      </motion.div>
    </header>
  );
}
