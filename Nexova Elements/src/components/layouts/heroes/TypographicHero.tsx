"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TypographicHero() {
  return (
    <section className="min-h-screen bg-zinc-950 flex flex-col justify-center pt-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="border-b border-zinc-800 pb-12 mb-12"
        >
          <h1 className="text-[12vw] leading-[0.8] font-black text-white tracking-tighter uppercase">
            Creative <br />
            <span className="text-zinc-800">Developer</span> <br />
            Toolkit
          </h1>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-zinc-400">
            <h3 className="text-white font-bold mb-2">01. Design</h3>
            <p>Pixel perfect layouts crafted for modern web standards.</p>
          </div>
          <div className="text-zinc-400">
            <h3 className="text-white font-bold mb-2">02. Build</h3>
            <p>Component driven architecture for scalable applications.</p>
          </div>
          <div className="text-zinc-400">
            <h3 className="text-white font-bold mb-2">03. Ship</h3>
            <p>Deploy with confidence using our production-ready templates.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
