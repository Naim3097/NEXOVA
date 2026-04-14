"use client";

import React from "react";
import { motion } from "framer-motion";

const stats = [
  { label: "Active Users", value: "100K+", suffix: "" },
  { label: "Countries", value: "150", suffix: "+" },
  { label: "Uptime", value: "99.9", suffix: "%" },
  { label: "Support", value: "24/7", suffix: "" },
];

export default function AnimatedStats() {
  return (
    <section className="py-24 bg-blue-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl md:text-7xl font-bold mb-2 tracking-tight">
                {stat.value}<span className="text-blue-200">{stat.suffix}</span>
              </div>
              <div className="text-blue-100 font-medium text-lg uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
