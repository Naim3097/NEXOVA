"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

export default function ModernHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          AXTRA.
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {["Products", "Solutions", "Resources", "Pricing"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button className="hidden md:block px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/10">
            Sign In
          </button>
          <button className="hidden md:block px-4 py-2 text-sm font-medium text-black bg-white hover:bg-zinc-200 rounded-full transition-colors">
            Get Started
          </button>
          
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {["Products", "Solutions", "Resources", "Pricing"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-lg font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <div className="flex flex-col gap-4">
                <button className="w-full py-3 text-center font-medium text-white bg-white/10 rounded-lg">
                  Sign In
                </button>
                <button className="w-full py-3 text-center font-medium text-black bg-white rounded-lg">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
