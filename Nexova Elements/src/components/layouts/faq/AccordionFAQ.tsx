"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How do I get started?",
    answer: "Getting started is easy. Simply sign up for an account, choose a template, and start customizing your website using our drag-and-drop builder."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time. We offer a 30-day money-back guarantee for all new customers."
  },
  {
    question: "Do you offer custom domains?",
    answer: "Absolutely. You can connect your own custom domain to any paid plan. We also provide free SSL certificates for all domains."
  },
  {
    question: "Is there a limit to how many pages I can create?",
    answer: "No, there are no limits on the number of pages you can create. Build as big as you need."
  },
  {
    question: "Do you provide technical support?",
    answer: "Yes, our support team is available 24/7 to help you with any issues or questions you may have."
  }
];

export default function AccordionFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-zinc-400">Everything you need to know about the product and billing.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-white/10 rounded-2xl bg-zinc-900/30 overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-lg">{faq.question}</span>
                {activeIndex === index ? (
                  <Minus className="w-5 h-5 text-blue-500" />
                ) : (
                  <Plus className="w-5 h-5 text-zinc-500" />
                )}
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-zinc-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
