"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers, Cpu, Cloud, Lock, RefreshCw, Settings } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Modular Architecture",
    description: "Build scalable applications with our component-based architecture."
  },
  {
    icon: Cpu,
    title: "High Performance",
    description: "Optimized for speed with zero-runtime overhead."
  },
  {
    icon: Cloud,
    title: "Cloud Native",
    description: "Designed for the modern cloud ecosystem."
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-grade encryption and security standards."
  },
  {
    icon: RefreshCw,
    title: "Real-time Sync",
    description: "Keep your data synchronized across all devices instantly."
  },
  {
    icon: Settings,
    title: "Advanced Control",
    description: "Granular control over every aspect of your application."
  }
];

export default function CardGridFeatures() {
  return (
    <section className="py-24 bg-zinc-950 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Powerful Features</h2>
          <p className="text-zinc-400 text-lg">
            Discover the tools that will take your development to the next level.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 border border-white/5 p-8 rounded-2xl hover:bg-zinc-900 transition-colors group"
            >
              <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
