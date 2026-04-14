"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function SimplePricingCards() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Simple, transparent pricing</h2>
          <p className="text-zinc-400 mb-8">Choose the plan that's right for you.</p>
          
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isAnnual ? "text-white" : "text-zinc-500"}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 bg-zinc-800 rounded-full relative p-1 transition-colors hover:bg-zinc-700"
            >
              <motion.div 
                animate={{ x: isAnnual ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full"
              />
            </button>
            <span className={`text-sm ${isAnnual ? "text-white" : "text-zinc-500"}`}>Yearly <span className="text-green-500 text-xs ml-1">Save 20%</span></span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter */}
          <div className="bg-zinc-900 rounded-3xl p-8 border border-white/10 flex flex-col">
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <p className="text-zinc-400 text-sm mb-6">Perfect for side projects.</p>
            <div className="text-4xl font-bold mb-6">
              ${isAnnual ? "0" : "0"} <span className="text-lg text-zinc-500 font-normal">/mo</span>
            </div>
            <button className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium mb-8">
              Get Started
            </button>
            <ul className="space-y-4 flex-1">
              {["1 Project", "Community Support", "Basic Analytics"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-white" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="bg-zinc-900 rounded-3xl p-8 border border-blue-500 relative flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-zinc-400 text-sm mb-6">For growing businesses.</p>
            <div className="text-4xl font-bold mb-6">
              ${isAnnual ? "29" : "39"} <span className="text-lg text-zinc-500 font-normal">/mo</span>
            </div>
            <button className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-medium mb-8">
              Get Started
            </button>
            <ul className="space-y-4 flex-1">
              {["Unlimited Projects", "Priority Support", "Advanced Analytics", "Custom Domain", "Team Collaboration"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-blue-500" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Enterprise */}
          <div className="bg-zinc-900 rounded-3xl p-8 border border-white/10 flex flex-col">
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <p className="text-zinc-400 text-sm mb-6">For large scale needs.</p>
            <div className="text-4xl font-bold mb-6">
              ${isAnnual ? "99" : "129"} <span className="text-lg text-zinc-500 font-normal">/mo</span>
            </div>
            <button className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium mb-8">
              Contact Sales
            </button>
            <ul className="space-y-4 flex-1">
              {["Everything in Pro", "Dedicated Support", "SLA", "SSO", "Audit Logs"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-white" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
