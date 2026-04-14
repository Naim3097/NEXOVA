"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    year: "Step 01",
    title: "Discovery",
    description: "We start by understanding your business goals, target audience, and technical requirements."
  },
  {
    year: "Step 02",
    title: "Strategy",
    description: "Our team develops a comprehensive roadmap and technical architecture for your project."
  },
  {
    year: "Step 03",
    title: "Design",
    description: "We create high-fidelity wireframes and interactive prototypes to visualize the end product."
  },
  {
    year: "Step 04",
    title: "Development",
    description: "Our engineers build your solution using cutting-edge technologies and best practices."
  },
  {
    year: "Step 05",
    title: "Launch",
    description: "We handle the deployment process and ensure a smooth transition to production."
  }
];

export default function Timeline() {
  return (
    <section className="py-24 bg-zinc-950 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Our Process</h2>
          <p className="text-zinc-400">How we bring your vision to life.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-zinc-800 md:-translate-x-1/2" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className="md:w-1/2 pl-16 md:pl-0 md:px-12">
                  <div className={`text-left ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                    <span className="text-blue-500 font-mono text-sm font-bold tracking-wider mb-2 block">
                      {step.year}
                    </span>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-[20px] md:left-1/2 w-10 h-10 bg-zinc-950 border-4 border-zinc-800 rounded-full -translate-x-1/2 flex items-center justify-center z-10">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                </div>

                {/* Empty Space for other side */}
                <div className="md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
