"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, Zap, Shield, Globe } from "lucide-react";

const tabs = [
  {
    id: "design",
    label: "Design",
    icon: Layout,
    title: "Pixel Perfect Design",
    description: "Create stunning interfaces with our drag-and-drop builder. Every pixel is under your control.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "performance",
    label: "Performance",
    icon: Zap,
    title: "Lightning Fast Speed",
    description: "Optimized for core web vitals. Your site will load instantly anywhere in the world.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    title: "Enterprise Grade Security",
    description: "Bank-level encryption and automated backups keep your data safe and secure.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop"
  },
  {
    id: "global",
    label: "Global",
    icon: Globe,
    title: "Global CDN Network",
    description: "Deploy to the edge in seconds. Serve your content from 300+ locations worldwide.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
  }
];

export default function TabbedFeatures() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Built for scale</h2>
          <p className="text-zinc-400">Everything you need to grow your business.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Tabs Navigation */}
          <div className="lg:w-1/3 flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left p-6 rounded-xl transition-all duration-300 border ${
                  activeTab === tab.id 
                    ? "bg-zinc-900 border-blue-500/50" 
                    : "bg-transparent border-transparent hover:bg-zinc-900/50"
                }`}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className={`p-2 rounded-lg ${
                    activeTab === tab.id ? "bg-blue-500 text-white" : "bg-zinc-800 text-zinc-400"
                  }`}>
                    <tab.icon className="w-5 h-5" />
                  </div>
                  <span className={`font-bold text-lg ${
                    activeTab === tab.id ? "text-white" : "text-zinc-400"
                  }`}>
                    {tab.label}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm pl-[52px]">
                  {tab.description}
                </p>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:w-2/3 bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden relative min-h-[500px]">
            <AnimatePresence mode="wait">
              {tabs.map((tab) => (
                activeTab === tab.id && (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col"
                  >
                    <div className="h-2/3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10" />
                      <img 
                        src={tab.image} 
                        alt={tab.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-8 flex flex-col justify-center relative z-20">
                      <h3 className="text-3xl font-bold mb-4">{tab.title}</h3>
                      <p className="text-zinc-400 text-lg">{tab.description}</p>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
