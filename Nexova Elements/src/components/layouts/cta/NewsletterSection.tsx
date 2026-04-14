"use client";

import React from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section className="py-24 bg-zinc-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join our newsletter
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Get the latest updates, articles, and resources sent straight to your inbox. No spam, ever.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                Subscribe <Send className="w-4 h-4" />
              </button>
            </form>
            
            <p className="text-sm text-zinc-500 mt-6">
              We care about your data in our <a href="#" className="underline hover:text-white">privacy policy</a>.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
