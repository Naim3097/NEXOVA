"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop",
    title: "Create without limits",
    subtitle: "The ultimate design platform for modern teams."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop",
    title: "Future of Web",
    subtitle: "Build faster, scale better, ship sooner."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
    title: "Digital Excellence",
    subtitle: "Crafting experiences that leave a mark."
  }
];

export default function SliderHero() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src={slides[current].image} 
            alt={slides[current].title} 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6">
        <div className="max-w-4xl">
          <motion.h1 
            key={`h1-${current}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-8xl font-bold text-white mb-6 tracking-tight"
          >
            {slides[current].title}
          </motion.h1>
          <motion.p 
            key={`p-${current}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-zinc-200 mb-10"
          >
            {slides[current].subtitle}
          </motion.p>
          <motion.button
            key={`btn-${current}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors"
          >
            Explore Now
          </motion.button>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-4">
        <button onClick={prev} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "w-8 bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
        <button onClick={next} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
