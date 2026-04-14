"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingBag } from "lucide-react";

export default function CenteredHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 grid grid-cols-3 items-center">
        
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
          <button className="text-zinc-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Logo */}
        <div className="text-center">
          <div className="text-2xl font-black tracking-tighter text-white">
            AXTRA<span className="text-blue-500">.</span>
          </div>
        </div>

        {/* Right: Navigation & Cart */}
        <div className="flex items-center justify-end gap-6">
          <nav className="hidden md:flex items-center gap-6">
            {["Shop", "Collections", "About"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          <button className="text-zinc-400 hover:text-white transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
              2
            </span>
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
            <div className="px-6 py-8 flex flex-col gap-6 text-center">
              {["Shop", "Collections", "About", "Account"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-lg font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
