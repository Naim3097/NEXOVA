"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    content: "This library has completely transformed how we build websites. The attention to detail is unmatched.",
    author: "Alex Morgan",
    role: "Senior Developer"
  },
  {
    content: "I was skeptical at first, but the code quality is top notch. It's like having a senior engineer on your team.",
    author: "Sam Wilson",
    role: "Tech Lead"
  },
  {
    content: "The animations are buttery smooth and the performance is incredible. My clients are always impressed.",
    author: "Jordan Lee",
    role: "Freelancer"
  },
  {
    content: "Documentation is clear, components are modular, and the design is stunning. What more could you ask for?",
    author: "Casey Taylor",
    role: "Product Manager"
  },
  {
    content: "We've cut our development time in half. This is a must-have for any serious agency.",
    author: "Riley Smith",
    role: "Agency Owner"
  },
  {
    content: "Simply the best React component library I've used in years. Worth every penny.",
    author: "Jamie Doe",
    role: "Frontend Architect"
  }
];

export default function TestimonialGrid() {
  return (
    <section className="py-24 bg-zinc-950 text-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-zinc-900 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors relative"
            >
              <Quote className="w-8 h-8 text-zinc-700 mb-4" />
              <p className="text-zinc-300 mb-6 leading-relaxed">
                {t.content}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800" />
                <div>
                  <div className="font-bold text-sm">{t.author}</div>
                  <div className="text-zinc-500 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
